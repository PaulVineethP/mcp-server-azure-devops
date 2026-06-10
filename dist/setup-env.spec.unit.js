"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const child_process_1 = require("child_process");
describe('setup_env.sh', () => {
    it('writes PAT and auth method in non-interactive mode', () => {
        const tempDir = (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), 'setup-env-'));
        const scriptPath = (0, path_1.join)(process.cwd(), 'setup_env.sh');
        const result = (0, child_process_1.spawnSync)('bash', [scriptPath], {
            cwd: tempDir,
            env: {
                ...process.env,
                SETUP_ENV_NONINTERACTIVE: '1',
                SETUP_ENV_ORG_NAME: 'unit-test-org',
                AZURE_DEVOPS_PAT: 'unit-test-pat',
                AZURE_DEVOPS_DEFAULT_PROJECT: 'unit-project',
            },
            encoding: 'utf8',
        });
        expect(result.status).toBe(0);
        const envFile = (0, fs_1.readFileSync)((0, path_1.join)(tempDir, '.env'), 'utf8');
        expect(envFile).toContain('AZURE_DEVOPS_PAT=unit-test-pat');
        expect(envFile).toContain('AZURE_DEVOPS_AUTH_METHOD=pat');
        expect(envFile).toContain('AZURE_DEVOPS_ORG_URL=https://dev.azure.com/unit-test-org');
    });
    it('skips extension install when azure-devops is already present', () => {
        const tempDir = (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), 'setup-env-'));
        const binDir = (0, path_1.join)(tempDir, 'bin');
        (0, fs_1.mkdirSync)(binDir);
        const scriptPath = (0, path_1.join)(process.cwd(), 'setup_env.sh');
        const azPath = (0, path_1.join)(binDir, 'az');
        (0, fs_1.writeFileSync)(azPath, `#!/bin/bash
case "$1" in
  devops)
    echo "Missing command" >&2
    exit 2
    ;;
  extension)
    if [ "$2" = "show" ]; then
      echo "azure-devops"
      exit 0
    fi
    if [ "$2" = "add" ]; then
      echo "unexpected extension add" >&2
      exit 42
    fi
    ;;
  account)
    exit 0
    ;;
  rest)
    if echo "$*" | grep -q "profiles/me"; then
      echo '{"publicAlias":"unit-alias"}'
      exit 0
    fi
    if echo "$*" | grep -q "accounts?memberId=unit-alias"; then
      echo '{"value":[{"accountName":"org-one"}]}'
      exit 0
    fi
    ;;
esac
echo "unexpected az call: $*" >&2
exit 3
`, { mode: 0o755 });
        (0, fs_1.chmodSync)(azPath, 0o755);
        const jqPath = (0, path_1.join)(binDir, 'jq');
        (0, fs_1.writeFileSync)(jqPath, `#!/bin/bash
if [ "$1" != "-r" ]; then
  exit 2
fi
case "$2" in
  .publicAlias)
    echo "unit-alias"
    ;;
  .value[].accountName)
    echo "org-one"
    ;;
  *)
    exit 1
    ;;
esac
`, { mode: 0o755 });
        (0, fs_1.chmodSync)(jqPath, 0o755);
        const result = (0, child_process_1.spawnSync)('bash', [scriptPath], {
            cwd: tempDir,
            env: {
                ...process.env,
                PATH: `${binDir}:${process.env.PATH}`,
            },
            input: '1\nn\nn\n',
            encoding: 'utf8',
        });
        expect(result.status).toBe(0);
    });
    it('extracts org name when user pastes a dev.azure.com URL', () => {
        const tempDir = (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), 'setup-env-'));
        const binDir = (0, path_1.join)(tempDir, 'bin');
        (0, fs_1.mkdirSync)(binDir);
        const scriptPath = (0, path_1.join)(process.cwd(), 'setup_env.sh');
        const azPath = (0, path_1.join)(binDir, 'az');
        (0, fs_1.writeFileSync)(azPath, `#!/bin/bash
case "$1" in
  extension)
    if [ "$2" = "show" ]; then
      echo "azure-devops"
      exit 0
    fi
    if [ "$2" = "add" ]; then
      echo "unexpected extension add" >&2
      exit 42
    fi
    ;;
  account)
    exit 0
    ;;
  rest)
    exit 1
    ;;
esac
echo "unexpected az call: $*" >&2
exit 3
`, { mode: 0o755 });
        (0, fs_1.chmodSync)(azPath, 0o755);
        const jqPath = (0, path_1.join)(binDir, 'jq');
        (0, fs_1.writeFileSync)(jqPath, `#!/bin/bash
exit 0
`, { mode: 0o755 });
        (0, fs_1.chmodSync)(jqPath, 0o755);
        const result = (0, child_process_1.spawnSync)('bash', [scriptPath], {
            cwd: tempDir,
            env: {
                ...process.env,
                PATH: `${binDir}:${process.env.PATH}`,
            },
            input: 'https://dev.azure.com/azure-devops-mcp-testing/\n' + 'n\n' + 'n\n',
            encoding: 'utf8',
        });
        expect(result.status).toBe(0);
        const envFile = (0, fs_1.readFileSync)((0, path_1.join)(tempDir, '.env'), 'utf8');
        expect(envFile).toContain('AZURE_DEVOPS_ORG=azure-devops-mcp-testing');
        expect(envFile).toContain('AZURE_DEVOPS_ORG_URL=https://dev.azure.com/azure-devops-mcp-testing');
    });
});
//# sourceMappingURL=setup-env.spec.unit.js.map