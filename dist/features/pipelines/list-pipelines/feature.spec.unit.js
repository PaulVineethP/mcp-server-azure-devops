"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
describe('listPipelines unit', () => {
    let mockConnection;
    let mockPipelinesApi;
    beforeEach(() => {
        // Reset mocks
        jest.resetAllMocks();
        // Setup mock Pipelines API
        mockPipelinesApi = {
            listPipelines: jest.fn(),
        };
        // Mock WebApi with a getPipelinesApi method
        mockConnection = {
            serverUrl: 'https://dev.azure.com/testorg',
            getPipelinesApi: jest.fn().mockResolvedValue(mockPipelinesApi),
        };
    });
    test('should return list of pipelines', async () => {
        // Arrange
        const mockPipelines = [
            {
                id: 1,
                name: 'Pipeline 1',
                folder: 'Folder 1',
                revision: 1,
                url: 'https://dev.azure.com/testorg/testproject/_apis/pipelines/1',
            },
            {
                id: 2,
                name: 'Pipeline 2',
                folder: 'Folder 2',
                revision: 1,
                url: 'https://dev.azure.com/testorg/testproject/_apis/pipelines/2',
            },
        ];
        // Mock the Pipelines API to return data
        mockPipelinesApi.listPipelines.mockResolvedValue(mockPipelines);
        // Act
        const result = await (0, feature_1.listPipelines)(mockConnection, {
            projectId: 'testproject',
        });
        // Assert
        expect(mockConnection.getPipelinesApi).toHaveBeenCalled();
        expect(mockPipelinesApi.listPipelines).toHaveBeenCalledWith('testproject', undefined, undefined, undefined);
        expect(result).toEqual(mockPipelines);
    });
    test('should handle query parameters correctly', async () => {
        // Arrange
        mockPipelinesApi.listPipelines.mockResolvedValue([]);
        // Act
        await (0, feature_1.listPipelines)(mockConnection, {
            projectId: 'testproject',
            orderBy: 'name asc',
            top: 10,
            continuationToken: 'token123',
        });
        // Assert
        expect(mockPipelinesApi.listPipelines).toHaveBeenCalledWith('testproject', 'name asc', 10, 'token123');
    });
    test('should handle authentication errors', async () => {
        // Arrange
        const authError = new Error('Authentication failed');
        authError.message = 'Authentication failed: Unauthorized';
        mockPipelinesApi.listPipelines.mockRejectedValue(authError);
        // Act & Assert
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(errors_1.AzureDevOpsAuthenticationError);
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(/Failed to authenticate/);
    });
    test('should handle resource not found errors', async () => {
        // Arrange
        const notFoundError = new Error('Not found');
        notFoundError.message = 'Resource does not exist';
        mockPipelinesApi.listPipelines.mockRejectedValue(notFoundError);
        // Act & Assert
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(/Project or resource not found/);
    });
    test('should wrap general errors in AzureDevOpsError', async () => {
        // Arrange
        const testError = new Error('Test API error');
        mockPipelinesApi.listPipelines.mockRejectedValue(testError);
        // Act & Assert
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.listPipelines)(mockConnection, { projectId: 'testproject' })).rejects.toThrow(/Failed to list pipelines/);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map