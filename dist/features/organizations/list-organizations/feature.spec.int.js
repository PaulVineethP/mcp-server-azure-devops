"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('listOrganizations integration', () => {
    test('should list organizations accessible to the authenticated user', async () => {
        // Get test configuration
        const config = (0, test_helpers_1.getTestConfig)();
        if (!config) {
            throw new Error('Configuration should be available when test is not skipped');
        }
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.listOrganizations)(config);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Check structure of returned organizations
        const firstOrg = result[0];
        expect(firstOrg.id).toBeDefined();
        expect(firstOrg.name).toBeDefined();
        expect(firstOrg.url).toBeDefined();
        // The organization URL in the config should match one of the returned organizations
        // Extract the organization name from the URL
        const orgUrlParts = config.organizationUrl.split('/');
        const configOrgName = orgUrlParts[orgUrlParts.length - 1];
        // Find matching organization
        const matchingOrg = result.find((org) => org.name.toLowerCase() === configOrgName.toLowerCase());
        expect(matchingOrg).toBeDefined();
    });
});
//# sourceMappingURL=feature.spec.int.js.map