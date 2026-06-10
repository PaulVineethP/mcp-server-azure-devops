"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
// No real connections, HTTP requests, or dependencies
describe('getRepository unit', () => {
    test('should propagate resource not found errors', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => ({
                getRepository: jest.fn().mockResolvedValue(null), // Simulate repository not found
            })),
        };
        // Act & Assert
        await expect((0, feature_1.getRepository)(mockConnection, 'test-project', 'non-existent-repo')).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        await expect((0, feature_1.getRepository)(mockConnection, 'test-project', 'non-existent-repo')).rejects.toThrow("Repository 'non-existent-repo' not found in project 'test-project'");
    });
    test('should propagate custom errors when thrown internally', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => {
                throw new errors_1.AzureDevOpsError('Custom error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.getRepository)(mockConnection, 'test-project', 'test-repo')).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.getRepository)(mockConnection, 'test-project', 'test-repo')).rejects.toThrow('Custom error');
    });
    test('should wrap unexpected errors in a friendly error message', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => {
                throw new Error('Unexpected error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.getRepository)(mockConnection, 'test-project', 'test-repo')).rejects.toThrow('Failed to get repository: Unexpected error');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map