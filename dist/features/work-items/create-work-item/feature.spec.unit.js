"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
// No real connections, HTTP requests, or dependencies
describe('createWorkItem unit', () => {
    // Test for required title validation
    test('should throw error when title is not provided', async () => {
        // Arrange - mock connection, never used due to validation error
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn(),
        };
        // Act & Assert
        await expect((0, feature_1.createWorkItem)(mockConnection, 'TestProject', 'Task', { title: '' })).rejects.toThrow('Title is required');
    });
    // Test for error propagation
    test('should propagate custom errors when thrown internally', async () => {
        // Arrange
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn().mockImplementation(() => {
                throw new errors_1.AzureDevOpsError('Custom error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.createWorkItem)(mockConnection, 'TestProject', 'Task', {
            title: 'Test Task',
        })).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.createWorkItem)(mockConnection, 'TestProject', 'Task', {
            title: 'Test Task',
        })).rejects.toThrow('Custom error');
    });
    test('should wrap unexpected errors in a friendly error message', async () => {
        // Arrange
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn().mockImplementation(() => {
                throw new Error('Unexpected error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.createWorkItem)(mockConnection, 'TestProject', 'Task', {
            title: 'Test Task',
        })).rejects.toThrow('Failed to create work item: Unexpected error');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map