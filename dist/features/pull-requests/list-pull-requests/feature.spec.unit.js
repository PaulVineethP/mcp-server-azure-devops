"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
describe('listPullRequests', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    test('should return pull requests successfully with pagination metadata', async () => {
        // Mock data
        const mockPullRequests = [
            {
                pullRequestId: 1,
                title: 'Test PR 1',
                description: 'Test PR description 1',
            },
            {
                pullRequestId: 2,
                title: 'Test PR 2',
                description: 'Test PR description 2',
            },
        ];
        // Setup mock connection
        const mockGitApi = {
            getPullRequests: jest.fn().mockResolvedValue(mockPullRequests),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        // Call the function with test parameters
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = {
            projectId,
            repositoryId,
            status: 'active',
            top: 10,
        };
        const result = await (0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options);
        // Verify results
        expect(result).toEqual({
            count: 2,
            value: mockPullRequests,
            hasMoreResults: false,
            warning: undefined,
        });
        expect(mockConnection.getGitApi).toHaveBeenCalledTimes(1);
        expect(mockGitApi.getPullRequests).toHaveBeenCalledTimes(1);
        expect(mockGitApi.getPullRequests).toHaveBeenCalledWith(repositoryId, { status: GitInterfaces_1.PullRequestStatus.Active }, projectId, undefined, // maxCommentLength
        0, // skip
        10);
    });
    test('should return empty array when no pull requests exist', async () => {
        // Setup mock connection
        const mockGitApi = {
            getPullRequests: jest.fn().mockResolvedValue(null),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        // Call the function with test parameters
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = { projectId, repositoryId };
        const result = await (0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options);
        // Verify results
        expect(result).toEqual({
            count: 0,
            value: [],
            hasMoreResults: false,
            warning: undefined,
        });
        expect(mockConnection.getGitApi).toHaveBeenCalledTimes(1);
        expect(mockGitApi.getPullRequests).toHaveBeenCalledTimes(1);
    });
    test('should handle all filter options correctly', async () => {
        // Setup mock connection
        const mockGitApi = {
            getPullRequests: jest.fn().mockResolvedValue([]),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        // Call with all options
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = {
            projectId,
            repositoryId,
            status: 'completed',
            creatorId: 'a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a8a8',
            reviewerId: 'b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b9b9',
            sourceRefName: 'refs/heads/source-branch',
            targetRefName: 'refs/heads/target-branch',
            top: 5,
            skip: 10,
        };
        await (0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options);
        // Verify the search criteria was constructed correctly
        expect(mockGitApi.getPullRequests).toHaveBeenCalledWith(repositoryId, {
            status: GitInterfaces_1.PullRequestStatus.Completed,
            creatorId: 'a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a8a8',
            reviewerId: 'b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b9b9',
            sourceRefName: 'refs/heads/source-branch',
            targetRefName: 'refs/heads/target-branch',
        }, projectId, undefined, // maxCommentLength
        10, // skip
        5);
    });
    test('should throw error when API call fails', async () => {
        // Setup mock connection
        const errorMessage = 'API error';
        const mockConnection = {
            getGitApi: jest.fn().mockImplementation(() => ({
                getPullRequests: jest.fn().mockRejectedValue(new Error(errorMessage)),
            })),
        };
        // Call the function with test parameters
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = { projectId, repositoryId };
        // Verify error handling
        await expect((0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options)).rejects.toThrow(`Failed to list pull requests: ${errorMessage}`);
    });
    test('should use default pagination values when not provided', async () => {
        // Mock data
        const mockPullRequests = [
            { pullRequestId: 1, title: 'Test PR 1' },
            { pullRequestId: 2, title: 'Test PR 2' },
        ];
        // Setup mock connection
        const mockGitApi = {
            getPullRequests: jest.fn().mockResolvedValue(mockPullRequests),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        // Call the function with minimal parameters (no top or skip)
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = { projectId, repositoryId };
        const result = await (0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options);
        // Verify default values were used
        expect(mockGitApi.getPullRequests).toHaveBeenCalledWith(repositoryId, {}, projectId, undefined, // maxCommentLength
        0, // default skip
        10);
        expect(result.count).toBe(2);
        expect(result.value).toEqual(mockPullRequests);
    });
    test('should add warning when hasMoreResults is true', async () => {
        // Create exactly 10 mock pull requests to trigger hasMoreResults
        const mockPullRequests = Array(10)
            .fill(0)
            .map((_, i) => ({
            pullRequestId: i + 1,
            title: `Test PR ${i + 1}`,
        }));
        // Setup mock connection
        const mockGitApi = {
            getPullRequests: jest.fn().mockResolvedValue(mockPullRequests),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
        // Call with top=10 to match the number of results
        const projectId = 'test-project';
        const repositoryId = 'test-repo';
        const options = {
            projectId,
            repositoryId,
            top: 10,
            skip: 5,
        };
        const result = await (0, feature_1.listPullRequests)(mockConnection, projectId, repositoryId, options);
        // Verify hasMoreResults is true and warning is set
        expect(result.hasMoreResults).toBe(true);
        expect(result.warning).toBe("Results limited to 10 items. Use 'skip: 15' to get the next page.");
    });
});
//# sourceMappingURL=feature.spec.unit.js.map