"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const feature_2 = require("../list-pipelines/feature");
const test_helpers_1 = require("../../../shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const projectId = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || '';
const hasProjectId = Boolean(projectId);
const describeOrSkip = !shouldSkip && hasProjectId ? describe : describe.skip;
describeOrSkip('getPipeline integration', () => {
    let connection;
    let existingPipelineId;
    beforeAll(async () => {
        // Get a real connection using environment variables
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
        // Try to get an existing pipeline ID for testing
        const pipelines = await (0, feature_2.listPipelines)(connection, { projectId });
        const pipelineId = pipelines[0]?.id;
        if (!pipelineId) {
            throw new Error('No pipelines found for getPipeline tests');
        }
        existingPipelineId = pipelineId;
    });
    test('should get a pipeline by ID', async () => {
        // Act - make an API call to Azure DevOps
        const pipeline = await (0, feature_1.getPipeline)(connection, {
            projectId,
            pipelineId: existingPipelineId,
        });
        // Assert
        expect(pipeline).toBeDefined();
        expect(pipeline.id).toBe(existingPipelineId);
        expect(pipeline.name).toBeDefined();
        expect(typeof pipeline.name).toBe('string');
        expect(pipeline.folder).toBeDefined();
        expect(pipeline.revision).toBeDefined();
        expect(pipeline.url).toBeDefined();
        expect(pipeline.url).toContain('_apis/pipelines');
    });
    test('should throw ResourceNotFoundError for non-existent pipeline', async () => {
        // Use a very high ID that is unlikely to exist
        const nonExistentPipelineId = 999999;
        // Act & Assert - should throw a not found error
        await expect((0, feature_1.getPipeline)(connection, {
            projectId,
            pipelineId: nonExistentPipelineId,
        })).rejects.toThrow(/not found/);
    });
});
//# sourceMappingURL=feature.spec.int.js.map