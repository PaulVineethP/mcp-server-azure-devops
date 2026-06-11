import axios from 'axios';
import { spawn } from 'child_process';
import { VERSION } from './config';

/**
 * The published npm package name. Used for update checks and self-update.
 */
export const PACKAGE_NAME = '@altera/mcp-server-azure-devops-onprem';

// Scoped package names must be URL-encoded (the "/" becomes "%2F") when
// addressing the npm registry directly.
const REGISTRY_LATEST_URL = `https://registry.npmjs.org/${encodeURIComponent(
  PACKAGE_NAME,
)}/latest`;

function safeLog(message: string): void {
  process.stderr.write(`${message}\n`);
}

/**
 * Parse a semantic version string into numeric [major, minor, patch].
 * Pre-release/build metadata is ignored for comparison purposes.
 */
function parseVersion(version: string): [number, number, number] | null {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version.trim());
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Returns true when `latest` is a strictly newer version than `current`.
 */
export function isNewerVersion(latest: string, current: string): boolean {
  const a = parseVersion(latest);
  const b = parseVersion(current);
  if (!a || !b) {
    return false;
  }
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

/**
 * Fetch the latest published version from the npm registry.
 *
 * @returns The latest version string, or null if it could not be determined.
 */
export async function fetchLatestVersion(): Promise<string | null> {
  try {
    const response = await axios.get(REGISTRY_LATEST_URL, {
      timeout: 5000,
      headers: { Accept: 'application/json' },
    });
    const version = response.data?.version;
    return typeof version === 'string' ? version : null;
  } catch {
    // Offline / registry unreachable / blocked — never treat as fatal.
    return null;
  }
}

/**
 * Attempt a best-effort global self-update via npm. Runs detached and never
 * blocks or crashes the server. The update only takes effect on the next
 * launch.
 */
function attemptSelfUpdate(latest: string): void {
  try {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npmCmd, ['install', '-g', `${PACKAGE_NAME}@latest`], {
      stdio: 'ignore',
      detached: true,
      shell: process.platform === 'win32',
    });
    child.on('error', (err) => {
      safeLog(
        `[update] Auto-update to ${latest} could not start: ${err.message}`,
      );
    });
    child.unref();
    safeLog(
      `[update] Auto-updating to ${latest} in the background; it will be used on the next launch.`,
    );
  } catch (err) {
    safeLog(
      `[update] Auto-update attempt failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

/**
 * Check the npm registry for a newer version of this package. When a newer
 * version exists a notice is written to stderr, and (unless disabled) a
 * best-effort background self-update is started.
 *
 * Controlled by environment variables:
 * - AZURE_DEVOPS_MCP_DISABLE_UPDATE_CHECK=true  → skip the check entirely
 * - AZURE_DEVOPS_MCP_AUTO_UPDATE=false           → check & notify only (no update)
 *
 * This function never throws and never blocks server startup.
 */
export async function checkForUpdates(): Promise<void> {
  if (
    String(process.env.AZURE_DEVOPS_MCP_DISABLE_UPDATE_CHECK).toLowerCase() ===
    'true'
  ) {
    return;
  }

  const latest = await fetchLatestVersion();
  if (!latest || !isNewerVersion(latest, VERSION)) {
    return;
  }

  safeLog(
    `[update] A new version of ${PACKAGE_NAME} is available: ${VERSION} → ${latest}.`,
  );

  const autoUpdateDisabled =
    String(process.env.AZURE_DEVOPS_MCP_AUTO_UPDATE).toLowerCase() === 'false';

  if (autoUpdateDisabled) {
    safeLog(
      `[update] Auto-update disabled. Run "npm install -g ${PACKAGE_NAME}@latest" or restart (npx fetches the latest automatically).`,
    );
    return;
  }

  attemptSelfUpdate(latest);
}
