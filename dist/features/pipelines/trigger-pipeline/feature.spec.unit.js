"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
describe('triggerPipeline unit', () => {
    let mockConnection;
    let mockPipelinesApi;
    beforeEach(() => {
        // Reset mocks
        jest.resetAllMocks();
        // Mock WebApi with a server URL
        mockConnection = {
            serverUrl: 'https://dev.azure.com/testorg',
        };
        // Mock the getPipelinesApi method
        mockPipelinesApi = {
            runPipeline: jest.fn(),
        };
        mockConnection.getPipelinesApi = jest
            .fn()
            .mockResolvedValue(mockPipelinesApi);
    });
    test('should trigger a pipeline with basic options', async () => {
        // Arrange
        const mockRun = { id: 123, name: 'Run 123' };
        mockPipelinesApi.runPipeline.mockResolvedValue(mockRun);
        // Act
        const result = await (0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
            branch: 'main',
        });
        // Assert
        expect(mockConnection.getPipelinesApi).toHaveBeenCalled();
        expect(mockPipelinesApi.runPipeline).toHaveBeenCalledWith(expect.objectContaining({
            resources: {
                repositories: {
                    self: {
                        refName: 'refs/heads/main',
                    },
                },
            },
        }), 'testproject', 4);
        expect(result).toBe(mockRun);
    });
    test('should trigger a pipeline with variables', async () => {
        // Arrange
        const mockRun = { id: 123, name: 'Run 123' };
        mockPipelinesApi.runPipeline.mockResolvedValue(mockRun);
        // Act
        const result = await (0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
            variables: {
                var1: { value: 'value1' },
                var2: { value: 'value2', isSecret: true },
            },
        });
        // Assert
        expect(mockPipelinesApi.runPipeline).toHaveBeenCalledWith(expect.objectContaining({
            variables: {
                var1: { value: 'value1' },
                var2: { value: 'value2', isSecret: true },
            },
        }), 'testproject', 4);
        expect(result).toBe(mockRun);
    });
    test('should handle authentication errors', async () => {
        // Arrange
        const authError = new Error('Authentication failed');
        mockPipelinesApi.runPipeline.mockRejectedValue(authError);
        // Act & Assert
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
        })).rejects.toThrow(errors_1.AzureDevOpsAuthenticationError);
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
        })).rejects.toThrow('Failed to authenticate');
    });
    test('should handle resource not found errors', async () => {
        // Arrange
        const notFoundError = new Error('Pipeline not found');
        mockPipelinesApi.runPipeline.mockRejectedValue(notFoundError);
        // Act & Assert
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 999,
        })).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 999,
        })).rejects.toThrow('Pipeline or project not found');
    });
    test('should wrap other errors', async () => {
        // Arrange
        const testError = new Error('Some other error');
        mockPipelinesApi.runPipeline.mockRejectedValue(testError);
        // Act & Assert
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
        })).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.triggerPipeline)(mockConnection, {
            projectId: 'testproject',
            pipelineId: 4,
        })).rejects.toThrow('Failed to trigger pipeline');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map