"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const schema_1 = require("./schema");
const test_helpers_1 = require("@/shared/test/test-helpers");
const feature_2 = require("../get-wikis/feature");
const errors_1 = require("@/shared/errors");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('createWiki (Integration)', () => {
    let connection;
    let projectName;
    beforeAll(async () => {
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
        projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || '';
        if (!projectName) {
            throw new Error('AZURE_DEVOPS_DEFAULT_PROJECT must be set for this test');
        }
    });
    test('should create a project wiki or report that it already exists', async () => {
        const existing = await (0, feature_2.getWikis)(connection, { projectId: projectName });
        const expectedProjectWikiName = `${projectName}.wiki`;
        const hasProjectWiki = existing.some((w) => w.name === expectedProjectWikiName);
        const options = {
            name: `${projectName}.wiki`,
            projectId: projectName,
            type: schema_1.WikiType.ProjectWiki,
        };
        if (hasProjectWiki) {
            await expect((0, feature_1.createWiki)(connection, options)).rejects.toThrow(errors_1.AzureDevOpsError);
        }
        else {
            const wiki = await (0, feature_1.createWiki)(connection, options);
            expect(wiki).toBeDefined();
            expect(wiki.projectId).toBeDefined();
            expect(String(wiki.type)).toBe('projectWiki');
        }
    }, 60000);
});
//# sourceMappingURL=feature.spec.int.js.map