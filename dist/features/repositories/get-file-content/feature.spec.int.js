"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../../server");
const test_helpers_1 = require("../../../shared/test/test-helpers");
const feature_1 = require("./feature");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const auth_1 = require("../../../shared/auth");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('getFileContent (Integration)', () => {
    let connection;
    let config;
    let projectId;
    let repositoryId;
    let knownFilePath;
    beforeAll(async () => {
        projectId =
            process.env.AZURE_DEVOPS_TEST_PROJECT_ID ||
                process.env.AZURE_DEVOPS_DEFAULT_PROJECT ||
                '';
        if (!projectId) {
            throw new Error('AZURE_DEVOPS_DEFAULT_PROJECT must be set (or AZURE_DEVOPS_TEST_PROJECT_ID) for this test');
        }
        config = {
            organizationUrl: process.env.AZURE_DEVOPS_ORG_URL || '',
            authMethod: auth_1.AuthenticationMethod.PersonalAccessToken,
            personalAccessToken: process.env.AZURE_DEVOPS_PAT || '',
            defaultProject: process.env.AZURE_DEVOPS_DEFAULT_PROJECT || '',
        };
        if (!config.organizationUrl || !config.personalAccessToken) {
            throw new Error('Azure DevOps credentials are required for this test');
        }
        connection = await (0, server_1.getConnection)(config);
        const gitApi = await connection.getGitApi();
        repositoryId =
            process.env.AZURE_DEVOPS_TEST_REPOSITORY_ID ||
                process.env.AZURE_DEVOPS_DEFAULT_REPOSITORY ||
                '';
        if (!repositoryId) {
            const repos = await gitApi.getRepositories(projectId);
            if (!repos || repos.length === 0 || !repos[0].id) {
                throw new Error('No repositories found. Set AZURE_DEVOPS_DEFAULT_REPOSITORY or AZURE_DEVOPS_TEST_REPOSITORY_ID to run this test.');
            }
            repositoryId = repos[0].id;
        }
        knownFilePath = process.env.AZURE_DEVOPS_TEST_FILE_PATH || '';
        // If no explicit file path, discover a file at repo root
        if (!knownFilePath) {
            const root = await (0, feature_1.getFileContent)(connection, projectId, repositoryId, '/');
            if (!root.isDirectory) {
                knownFilePath = '/README.md';
            }
            else {
                const items = JSON.parse(root.content);
                const firstFile = items.find((i) => i.path && i.isFolder === false);
                knownFilePath = firstFile?.path || '/README.md';
            }
        }
    }, 30000);
    it('should retrieve file content from the default branch', async () => {
        const result = await (0, feature_1.getFileContent)(connection, projectId, repositoryId, knownFilePath);
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(typeof result.content).toBe('string');
        expect(result.isDirectory).toBe(false);
    }, 30000);
    it('should retrieve directory content', async () => {
        const result = await (0, feature_1.getFileContent)(connection, projectId, repositoryId, '/');
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.isDirectory).toBe(true);
        const items = JSON.parse(result.content);
        expect(Array.isArray(items)).toBe(true);
    }, 30000);
    it('should handle specific version (branch)', async () => {
        const branchName = process.env.AZURE_DEVOPS_TEST_BRANCH || 'main';
        const result = await (0, feature_1.getFileContent)(connection, projectId, repositoryId, knownFilePath, {
            versionType: GitInterfaces_1.GitVersionType.Branch,
            version: branchName,
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.isDirectory).toBe(false);
    }, 30000);
});
//# sourceMappingURL=feature.spec.int.js.map