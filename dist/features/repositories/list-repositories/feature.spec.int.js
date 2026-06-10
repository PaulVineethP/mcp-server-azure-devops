"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('listRepositories integration', () => {
    let connection;
    let projectName;
    beforeAll(async () => {
        // Get a real connection using environment variables
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
        projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
    });
    test('should list repositories in a project', async () => {
        const options = {
            projectId: projectName,
        };
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.listRepositories)(connection, options);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        // Check structure of returned items (even if empty)
        if (result.length > 0) {
            const firstRepo = result[0];
            expect(firstRepo.id).toBeDefined();
            expect(firstRepo.name).toBeDefined();
            expect(firstRepo.project).toBeDefined();
            if (firstRepo.project) {
                expect(firstRepo.project.name).toBe(projectName);
            }
        }
    });
    test('should include links when option is specified', async () => {
        const options = {
            projectId: projectName,
            includeLinks: true,
        };
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.listRepositories)(connection, options);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        // Verify links are included, if repositories exist
        if (result.length > 0) {
            const firstRepo = result[0];
            expect(firstRepo._links).toBeDefined();
        }
    });
});
//# sourceMappingURL=feature.spec.int.js.map