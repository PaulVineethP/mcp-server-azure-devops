"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
describe('listRepositories unit', () => {
    test('should return empty array when no repositories are found', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => ({
                getRepositories: jest.fn().mockResolvedValue([]), // No repositories found
            })),
        };
        // Act
        const result = await (0, feature_1.listRepositories)(mockConnection, {
            projectId: 'test-project',
        });
        // Assert
        expect(result).toEqual([]);
    });
    test('should propagate custom errors when thrown internally', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => {
                throw new errors_1.AzureDevOpsError('Custom error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.listRepositories)(mockConnection, { projectId: 'test-project' })).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.listRepositories)(mockConnection, { projectId: 'test-project' })).rejects.toThrow('Custom error');
    });
    test('should wrap unexpected errors in a friendly error message', async () => {
        // Arrange
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => {
                throw new Error('Unexpected error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.listRepositories)(mockConnection, { projectId: 'test-project' })).rejects.toThrow('Failed to list repositories: Unexpected error');
    });
    test('should respect the includeLinks option', async () => {
        // Arrange
        const mockGetRepositories = jest.fn().mockResolvedValue([]);
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => ({
                getRepositories: mockGetRepositories,
            })),
        };
        // Act
        await (0, feature_1.listRepositories)(mockConnection, {
            projectId: 'test-project',
            includeLinks: true,
        });
        // Assert
        expect(mockGetRepositories).toHaveBeenCalledWith('test-project', true);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map