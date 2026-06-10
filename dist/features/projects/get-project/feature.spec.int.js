"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('getProject integration', () => {
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
    test('should retrieve a real project from Azure DevOps', async () => {
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.getProject)(connection, projectName);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(result.name).toBe(projectName);
        expect(result.id).toBeDefined();
        expect(result.url).toBeDefined();
        expect(result.state).toBeDefined();
        // Verify basic project structure
        expect(result.visibility).toBeDefined();
        expect(result.lastUpdateTime).toBeDefined();
    });
    test('should throw error when project is not found', async () => {
        // Use a non-existent project name
        const nonExistentProjectName = 'non-existent-project-' + Date.now();
        // Act & Assert - should throw an error for non-existent project
        await expect((0, feature_1.getProject)(connection, nonExistentProjectName)).rejects.toThrow(/not found|Failed to get project/);
    });
});
//# sourceMappingURL=feature.spec.int.js.map