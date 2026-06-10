"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
describe('getProject unit', () => {
    test('should throw resource not found error when project is null', async () => {
        // Arrange
        const mockCoreApi = {
            getProject: jest.fn().mockResolvedValue(null), // Simulate project not found
        };
        const mockConnection = {
            getCoreApi: jest.fn().mockResolvedValue(mockCoreApi),
        };
        // Act & Assert
        await expect((0, feature_1.getProject)(mockConnection, 'non-existent-project')).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        await expect((0, feature_1.getProject)(mockConnection, 'non-existent-project')).rejects.toThrow("Project 'non-existent-project' not found");
    });
    test('should propagate custom errors when thrown internally', async () => {
        // Arrange
        const mockConnection = {
            getCoreApi: jest.fn().mockImplementation(() => {
                throw new errors_1.AzureDevOpsError('Custom error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.getProject)(mockConnection, 'test-project')).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.getProject)(mockConnection, 'test-project')).rejects.toThrow('Custom error');
    });
    test('should wrap unexpected errors in a friendly error message', async () => {
        // Arrange
        const mockConnection = {
            getCoreApi: jest.fn().mockImplementation(() => {
                throw new Error('Unexpected error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.getProject)(mockConnection, 'test-project')).rejects.toThrow('Failed to get project: Unexpected error');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map