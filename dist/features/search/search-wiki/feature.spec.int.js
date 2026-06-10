"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('searchWiki integration', () => {
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
    test('should search wiki content', async () => {
        // Search the wiki
        const result = await (0, feature_1.searchWiki)(connection, {
            searchText: 'test',
            projectId: projectName,
            top: 10,
        });
        // Verify the result
        expect(result).toBeDefined();
        expect(result.count).toBeDefined();
        expect(Array.isArray(result.results)).toBe(true);
        if (result.results.length > 0) {
            expect(result.results[0].fileName).toBeDefined();
            expect(result.results[0].path).toBeDefined();
            expect(result.results[0].project).toBeDefined();
        }
    });
    test('should handle pagination correctly', async () => {
        // Get first page of results
        const page1 = await (0, feature_1.searchWiki)(connection, {
            searchText: 'test', // Common word likely to have many results
            projectId: projectName,
            top: 5,
            skip: 0,
        });
        // Get second page of results
        const page2 = await (0, feature_1.searchWiki)(connection, {
            searchText: 'test',
            projectId: projectName,
            top: 5,
            skip: 5,
        });
        // Verify pagination
        expect(page1.results).not.toEqual(page2.results);
    });
    test('should handle filters correctly', async () => {
        // This test is more of a smoke test since we can't guarantee specific projects
        const result = await (0, feature_1.searchWiki)(connection, {
            searchText: 'test',
            filters: {
                Project: [projectName],
            },
            includeFacets: true,
        });
        expect(result).toBeDefined();
        expect(result.facets).toBeDefined();
    });
});
//# sourceMappingURL=feature.spec.int.js.map