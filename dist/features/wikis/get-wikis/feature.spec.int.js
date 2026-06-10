"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('getWikis integration', () => {
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
    test('should retrieve wikis from Azure DevOps', async () => {
        // Get the wikis
        const result = await (0, feature_1.getWikis)(connection, {
            projectId: projectName,
        });
        // Verify the result
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        if (result.length > 0) {
            expect(result[0].name).toBeDefined();
            expect(result[0].id).toBeDefined();
            expect(result[0].type).toBeDefined();
        }
    });
});
//# sourceMappingURL=feature.spec.int.js.map