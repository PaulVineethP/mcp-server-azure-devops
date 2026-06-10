"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
describe('createBranch unit', () => {
    test('should create branch when source exists', async () => {
        const updateRefs = jest.fn().mockResolvedValue([{ success: true }]);
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest.fn().mockResolvedValue({ commit: { commitId: 'abc' } }),
                updateRefs,
            }),
        };
        await (0, feature_1.createBranch)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            sourceBranch: 'main',
            newBranch: 'feature',
        });
        expect(updateRefs).toHaveBeenCalled();
    });
    test('should throw error when source branch missing', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest.fn().mockResolvedValue(null),
            }),
        };
        await expect((0, feature_1.createBranch)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            sourceBranch: 'missing',
            newBranch: 'feature',
        })).rejects.toThrow(errors_1.AzureDevOpsError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map