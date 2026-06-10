"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
describe('getPullRequest', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    test('should return pull request by id', async () => {
        const mockPullRequest = { pullRequestId: 42, title: 'PR 42' };
        const mockGitApi = {
            getPullRequestById: jest.fn().mockResolvedValue(mockPullRequest),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        const result = await (0, feature_1.getPullRequest)(mockConnection, {
            projectId: 'test-project',
            pullRequestId: 42,
        });
        expect(result).toEqual(mockPullRequest);
        expect(mockGitApi.getPullRequestById).toHaveBeenCalledWith(42, 'test-project');
    });
    test('should throw resource not found error when pull request is not found', async () => {
        const mockGitApi = {
            getPullRequestById: jest.fn().mockResolvedValue(undefined),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        await expect((0, feature_1.getPullRequest)(mockConnection, {
            projectId: 'test-project',
            pullRequestId: 42,
        })).rejects.toBeInstanceOf(errors_1.AzureDevOpsResourceNotFoundError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map