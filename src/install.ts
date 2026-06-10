/**
 * `install` command: write or update an MCP client configuration file
 * (mcp.json) so the Azure DevOps server is registered with sensible defaults,
 * including the `inputs` prompt used to securely collect the PAT.
 *
 * Usage:
 *   npx -y mcp-server-azure-devops-onprem install [options]
 *
 * Options:
 *   --path <file>        Explicit path to the mcp.json to update.
 *   --workspace          Write to ./.vscode/mcp.json in the current directory.
 *   --server-name <id>   Server key to use (default: azureDevOps).
 *   --org-url <url>      Pre-fill AZURE_DEVOPS_ORG_URL.
 *   --project <name>     Pre-fill AZURE_DEVOPS_DEFAULT_PROJECT.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'fs';
import { dirname, join } from 'path';
import { homedir, platform } from 'os';
import { PACKAGE_NAME } from './shared/version-check';

const INPUT_ID = 'ado_pat';

interface InstallOptions {
  path?: string;
  workspace?: boolean;
  serverName: string;
  orgUrl: string;
  project: string;
}

function log(message: string): void {
  process.stderr.write(`${message}\n`);
}

/**
 * Resolve the default VS Code user-level mcp.json path for the current OS.
 */
export function defaultVsCodeMcpJsonPath(): string {
  const home = homedir();
  switch (platform()) {
    case 'win32':
      return join(
        process.env.APPDATA || join(home, 'AppData', 'Roaming'),
        'Code',
        'User',
        'mcp.json',
      );
    case 'darwin':
      return join(
        home,
        'Library',
        'Application Support',
        'Code',
        'User',
        'mcp.json',
      );
    default:
      return join(
        process.env.XDG_CONFIG_HOME || join(home, '.config'),
        'Code',
        'User',
        'mcp.json',
      );
  }
}

function parseArgs(args: string[]): InstallOptions {
  const options: InstallOptions = {
    serverName: 'azureDevOps',
    orgUrl: '',
    project: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--path':
        options.path = args[++i];
        break;
      case '--workspace':
        options.workspace = true;
        break;
      case '--server-name':
        options.serverName = args[++i] || options.serverName;
        break;
      case '--org-url':
        options.orgUrl = args[++i] || '';
        break;
      case '--project':
        options.project = args[++i] || '';
        break;
      default:
        // Ignore unknown args to stay forgiving.
        break;
    }
  }

  return options;
}

/**
 * Strip // line comments and /* block comments *\/ from JSONC text so it can
 * be parsed as JSON. Best-effort: ignores comment-like sequences inside
 * strings.
 */
function stripJsonComments(text: string): string {
  let result = '';
  let inString = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inLine) {
      if (char === '\n') {
        inLine = false;
        result += char;
      }
      continue;
    }
    if (inBlock) {
      if (char === '*' && next === '/') {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inString) {
      result += char;
      if (char === '\\') {
        result += text[++i] ?? '';
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }
    if (char === '/' && next === '/') {
      inLine = true;
      i++;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlock = true;
      i++;
      continue;
    }
    result += char;
  }

  return result;
}

/**
 * Remove trailing commas (e.g. before `}` or `]`) so JSONC text written by
 * editors like VS Code can be parsed as standard JSON. Commas inside strings
 * are preserved.
 */
function stripTrailingCommas(text: string): string {
  let result = '';
  let inString = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      result += char;
      if (char === '\\') {
        result += text[++i] ?? '';
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }
    if (char === ',') {
      // Look ahead past whitespace for a closing bracket/brace.
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) {
        j++;
      }
      if (text[j] === '}' || text[j] === ']') {
        // Skip the trailing comma.
        continue;
      }
    }
    result += char;
  }

  return result;
}

function buildServerEntry(options: InstallOptions): Record<string, unknown> {
  return {
    command: 'npx',
    args: ['-y', PACKAGE_NAME],
    env: {
      MCP_TRANSPORT: 'stdio',
      AZURE_DEVOPS_ORG_URL: options.orgUrl,
      AZURE_DEVOPS_AUTH_METHOD: 'pat',
      AZURE_DEVOPS_PAT: `\${input:${INPUT_ID}}`,
      AZURE_DEVOPS_DEFAULT_PROJECT: options.project,
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    type: 'stdio',
  };
}

function buildInputEntry(): Record<string, unknown> {
  return {
    id: INPUT_ID,
    type: 'promptString',
    description: 'Azure DevOps Personal Access Token',
    password: true,
  };
}

/**
 * Run the install/setup flow. Returns the path written.
 */
export function runInstall(args: string[]): string {
  const options = parseArgs(args);

  const targetPath = options.path
    ? options.path
    : options.workspace
      ? join(process.cwd(), '.vscode', 'mcp.json')
      : defaultVsCodeMcpJsonPath();

  // Load existing config (JSONC tolerant). If parsing fails, abort rather than
  // risk destroying a hand-edited file.
  let config: Record<string, unknown> = {};
  if (existsSync(targetPath)) {
    const raw = readFileSync(targetPath, 'utf8');
    try {
      config = JSON.parse(raw || '{}');
    } catch {
      try {
        config = JSON.parse(
          stripTrailingCommas(stripJsonComments(raw)) || '{}',
        );
      } catch {
        log(
          `ERROR: Could not parse existing ${targetPath}. Please add the server entry manually, or pass --path to a clean file.`,
        );
        throw new Error('Unable to parse existing mcp.json');
      }
    }
    // Back up before modifying.
    const backup = `${targetPath}.bak`;
    copyFileSync(targetPath, backup);
    log(`Backed up existing config to ${backup}`);
  } else {
    mkdirSync(dirname(targetPath), { recursive: true });
  }

  // VS Code standalone mcp.json uses `servers`; Claude-style configs use
  // `mcpServers`. Respect whichever already exists, defaulting to `servers`.
  const serversKey =
    config.mcpServers && !config.servers ? 'mcpServers' : 'servers';

  const servers =
    (config[serversKey] as Record<string, unknown> | undefined) ?? {};
  servers[options.serverName] = buildServerEntry(options);
  config[serversKey] = servers;

  // Ensure the PAT input prompt exists (VS Code `inputs` array).
  const inputs = Array.isArray(config.inputs)
    ? (config.inputs as Array<Record<string, unknown>>)
    : [];
  if (!inputs.some((input) => input.id === INPUT_ID)) {
    inputs.push(buildInputEntry());
  }
  config.inputs = inputs;

  writeFileSync(targetPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  log(`✓ Registered "${options.serverName}" MCP server in ${targetPath}`);
  log('  Restart your MCP client to pick up the changes.');

  return targetPath;
}
