"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
// Unit tests should only focus on isolated logic
// No real connections, HTTP requests, or dependencies
describe('updateWorkItem unit', () => {
    test('should throw error when no fields are provided for update', async () => {
        // Arrange - mock connection, never used due to validation error
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn(),
        };
        // Act & Assert - empty options object should throw
        await expect((0, feature_1.updateWorkItem)(mockConnection, 123, {})).rejects.toThrow('At least one field must be provided for update');
    });
    test('should propagate custom errors when thrown internally', async () => {
        // Arrange
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn().mockImplementation(() => {
                throw new errors_1.AzureDevOpsError('Custom error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.updateWorkItem)(mockConnection, 123, { title: 'Updated Title' })).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.updateWorkItem)(mockConnection, 123, { title: 'Updated Title' })).rejects.toThrow('Custom error');
    });
    test('should wrap unexpected errors in a friendly error message', async () => {
        // Arrange
        const mockConnection = {
            getWorkItemTrackingApi: jest.fn().mockImplementation(() => {
                throw new Error('Unexpected error');
            }),
        };
        // Act & Assert
        await expect((0, feature_1.updateWorkItem)(mockConnection, 123, { title: 'Updated Title' })).rejects.toThrow('Failed to update work item: Unexpected error');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map