import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { runInstall } from './install';
import { PACKAGE_NAME } from './shared/version-check';

function tempMcpJsonPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'install-'));
  return join(dir, 'mcp.json');
}

function readJson(path: string): Record<string, any> {
  return JSON.parse(readFileSync(path, 'utf8'));
}

describe('runInstall', () => {
  it('writes the expected servers and inputs blocks with no flags', () => {
    const target = tempMcpJsonPath();

    runInstall(['--path', target]);

    const config = readJson(target);
    const server = config.servers.azureDevOps;

    expect(server).toEqual({
      command: 'npx',
      args: ['-y', PACKAGE_NAME],
      env: {
        MCP_TRANSPORT: 'stdio',
        AZURE_DEVOPS_ORG_URL: '${input:ado_org_url}',
        AZURE_DEVOPS_AUTH_METHOD: 'pat',
        AZURE_DEVOPS_PAT: '${input:ado_pat}',
        AZURE_DEVOPS_DEFAULT_PROJECT: '${input:ado_project}',
        AZURE_DEVOPS_API_VERSION: '6.0',
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
      },
      type: 'stdio',
    });

    expect(config.inputs).toEqual([
      {
        id: 'ado_pat',
        type: 'promptString',
        description: 'Azure DevOps Personal Access Token (TFS)',
        password: true,
      },
      {
        id: 'ado_org_url',
        type: 'promptString',
        description: 'Azure DevOps Organization URL',
      },
      {
        id: 'ado_project',
        type: 'promptString',
        description: 'Azure DevOps Default Project',
      },
    ]);
  });

  it('uses --org-url and --project as prompt defaults', () => {
    const target = tempMcpJsonPath();

    runInstall([
      '--path',
      target,
      '--org-url',
      'https://server/tfs/DefaultCollection',
      '--project',
      'MyProject',
    ]);

    const config = readJson(target);

    // The env still references the inputs, not the raw values.
    expect(config.servers.azureDevOps.env.AZURE_DEVOPS_ORG_URL).toBe(
      '${input:ado_org_url}',
    );
    expect(config.servers.azureDevOps.env.AZURE_DEVOPS_DEFAULT_PROJECT).toBe(
      '${input:ado_project}',
    );

    const orgUrlInput = config.inputs.find(
      (input: Record<string, unknown>) => input.id === 'ado_org_url',
    );
    const projectInput = config.inputs.find(
      (input: Record<string, unknown>) => input.id === 'ado_project',
    );
    expect(orgUrlInput.default).toBe('https://server/tfs/DefaultCollection');
    expect(projectInput.default).toBe('MyProject');
  });

  it('honors a custom --api-version', () => {
    const target = tempMcpJsonPath();

    runInstall(['--path', target, '--api-version', '7.1']);

    const config = readJson(target);
    expect(config.servers.azureDevOps.env.AZURE_DEVOPS_API_VERSION).toBe('7.1');
  });

  it('preserves existing inputs and does not duplicate prompts on re-run', () => {
    const target = tempMcpJsonPath();
    writeFileSync(
      target,
      JSON.stringify({
        inputs: [
          {
            id: 'ado_pat',
            type: 'promptString',
            description: 'Custom PAT prompt',
            password: true,
          },
        ],
      }),
      'utf8',
    );

    runInstall(['--path', target]);

    const config = readJson(target);
    const ids = config.inputs.map((input: Record<string, unknown>) => input.id);
    expect(ids).toEqual(['ado_pat', 'ado_org_url', 'ado_project']);

    // The pre-existing prompt is left untouched.
    const patInput = config.inputs.find(
      (input: Record<string, unknown>) => input.id === 'ado_pat',
    );
    expect(patInput.description).toBe('Custom PAT prompt');
  });

  it('respects an existing mcpServers key instead of servers', () => {
    const target = tempMcpJsonPath();
    writeFileSync(
      target,
      JSON.stringify({ mcpServers: { existing: {} } }),
      'utf8',
    );

    runInstall(['--path', target]);

    const config = readJson(target);
    expect(config.mcpServers.azureDevOps).toBeDefined();
    expect(config.servers).toBeUndefined();
  });
});
