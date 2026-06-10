"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const environment_1 = require("@/utils/environment");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('updateWikiPage integration', () => {
    let projectName;
    let wikiId;
    let organizationId;
    beforeAll(async () => {
        projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
        // Note: You'll need to set this to a valid wiki ID in your environment
        wikiId = `${projectName}.wiki`;
        organizationId =
            process.env.AZURE_DEVOPS_ORG ||
                (0, environment_1.getOrgNameFromUrl)(process.env.AZURE_DEVOPS_ORG_URL);
    });
    test('should update a wiki page in Azure DevOps', async () => {
        const testPagePath = '/test-page';
        const testContent = '# Test Content\nThis is a test update.';
        const testComment = 'Test update from integration test';
        // Update the wiki page
        const result = await (0, feature_1.updateWikiPage)({
            organizationId,
            projectId: projectName,
            wikiId: wikiId,
            pagePath: testPagePath,
            content: testContent,
            comment: testComment,
        });
        // Verify the result
        expect(result).toBeDefined();
        expect(result.path).toBe(testPagePath);
        expect(result.content).toBe(testContent);
    });
});
//# sourceMappingURL=feature.spec.int.js.map