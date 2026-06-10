"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const create_pull_request_1 = require("./create-pull-request");
const get_pull_request_1 = require("./get-pull-request");
const list_pull_requests_1 = require("./list-pull-requests");
const get_pull_request_comments_1 = require("./get-pull-request-comments");
const add_pull_request_comment_1 = require("./add-pull-request-comment");
const schemas_1 = require("./schemas");
const get_pull_request_changes_1 = require("./get-pull-request-changes");
const get_pull_request_checks_1 = require("./get-pull-request-checks");
// Mock the imported modules
jest.mock('./create-pull-request', () => ({
    createPullRequest: jest.fn(),
}));
jest.mock('./get-pull-request', () => ({
    getPullRequest: jest.fn(),
}));
jest.mock('./list-pull-requests', () => ({
    listPullRequests: jest.fn(),
}));
jest.mock('./get-pull-request-comments', () => ({
    getPullRequestComments: jest.fn(),
}));
jest.mock('./add-pull-request-comment', () => ({
    addPullRequestComment: jest.fn(),
}));
jest.mock('./get-pull-request-changes', () => ({
    getPullRequestChanges: jest.fn(),
}));
jest.mock('./get-pull-request-checks', () => ({
    getPullRequestChecks: jest.fn(),
}));
describe('Pull Requests Request Handlers', () => {
    const mockConnection = {};
    describe('isPullRequestsRequest', () => {
        it('should return true for pull requests tools', () => {
            const validTools = [
                'create_pull_request',
                'get_pull_request',
                'list_pull_requests',
                'get_pull_request_comments',
                'add_pull_request_comment',
                'get_pull_request_changes',
                'get_pull_request_checks',
            ];
            validTools.forEach((tool) => {
                const request = {
                    params: { name: tool, arguments: {} },
                    method: 'tools/call',
                };
                expect((0, index_1.isPullRequestsRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-pull requests tools', () => {
            const request = {
                params: { name: 'list_projects', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isPullRequestsRequest)(request)).toBe(false);
        });
    });
    describe('handlePullRequestsRequest', () => {
        it('should handle create_pull_request request', async () => {
            const mockPullRequest = { id: 1, title: 'Test PR' };
            create_pull_request_1.createPullRequest.mockResolvedValue(mockPullRequest);
            const request = {
                params: {
                    name: 'create_pull_request',
                    arguments: {
                        repositoryId: 'test-repo',
                        title: 'Test PR',
                        sourceRefName: 'refs/heads/feature',
                        targetRefName: 'refs/heads/main',
                        tags: ['Tag-One'],
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockPullRequest);
            expect(create_pull_request_1.createPullRequest).toHaveBeenCalledWith(mockConnection, expect.any(String), 'test-repo', expect.objectContaining({
                title: 'Test PR',
                sourceRefName: 'refs/heads/feature',
                targetRefName: 'refs/heads/main',
                tags: ['Tag-One'],
            }));
        });
        it('should handle list_pull_requests request', async () => {
            const mockPullRequests = {
                count: 2,
                value: [
                    { id: 1, title: 'PR 1' },
                    { id: 2, title: 'PR 2' },
                ],
                hasMoreResults: false,
            };
            list_pull_requests_1.listPullRequests.mockResolvedValue(mockPullRequests);
            const request = {
                params: {
                    name: 'list_pull_requests',
                    arguments: {
                        repositoryId: 'test-repo',
                        status: 'active',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockPullRequests);
            expect(list_pull_requests_1.listPullRequests).toHaveBeenCalledWith(mockConnection, expect.any(String), 'test-repo', expect.objectContaining({
                status: 'active',
            }));
        });
        it('should handle get_pull_request request', async () => {
            const mockPullRequest = { id: 42, title: 'PR 42' };
            get_pull_request_1.getPullRequest.mockResolvedValue(mockPullRequest);
            const request = {
                params: {
                    name: 'get_pull_request',
                    arguments: {
                        projectId: 'test-project',
                        pullRequestId: 42,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockPullRequest);
            expect(get_pull_request_1.getPullRequest).toHaveBeenCalledWith(mockConnection, {
                projectId: 'test-project',
                pullRequestId: 42,
            });
        });
        it('should handle get_pull_request_comments request', async () => {
            const mockComments = {
                threads: [
                    {
                        id: 1,
                        comments: [{ id: 1, content: 'Comment 1' }],
                    },
                ],
            };
            get_pull_request_comments_1.getPullRequestComments.mockResolvedValue(mockComments);
            const request = {
                params: {
                    name: 'get_pull_request_comments',
                    arguments: {
                        repositoryId: 'test-repo',
                        pullRequestId: 123,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockComments);
            expect(get_pull_request_comments_1.getPullRequestComments).toHaveBeenCalledWith(mockConnection, expect.any(String), 'test-repo', 123, expect.objectContaining({
                pullRequestId: 123,
            }));
        });
        it('should handle add_pull_request_comment request', async () => {
            const mockResult = {
                comment: { id: 1, content: 'New comment' },
                thread: { id: 1 },
            };
            add_pull_request_comment_1.addPullRequestComment.mockResolvedValue(mockResult);
            const request = {
                params: {
                    name: 'add_pull_request_comment',
                    arguments: {
                        repositoryId: 'test-repo',
                        pullRequestId: 123,
                        content: 'New comment',
                        status: 'active', // Status is required when creating a new thread
                    },
                },
                method: 'tools/call',
            };
            // Mock the schema parsing
            const mockParsedArgs = {
                repositoryId: 'test-repo',
                pullRequestId: 123,
                content: 'New comment',
                status: 'active',
            };
            // Use a different approach for mocking
            const originalParse = schemas_1.AddPullRequestCommentSchema.parse;
            schemas_1.AddPullRequestCommentSchema.parse = jest
                .fn()
                .mockReturnValue(mockParsedArgs);
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockResult);
            expect(add_pull_request_comment_1.addPullRequestComment).toHaveBeenCalledWith(mockConnection, expect.any(String), 'test-repo', 123, expect.objectContaining({
                content: 'New comment',
            }));
            // Restore the original parse function
            schemas_1.AddPullRequestCommentSchema.parse = originalParse;
        });
        it('should handle get_pull_request_changes request', async () => {
            const mockResult = { changes: { changeEntries: [] }, evaluations: [] };
            get_pull_request_changes_1.getPullRequestChanges.mockResolvedValue(mockResult);
            const request = {
                params: {
                    name: 'get_pull_request_changes',
                    arguments: { repositoryId: 'test-repo', pullRequestId: 1 },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockResult);
            expect(get_pull_request_changes_1.getPullRequestChanges).toHaveBeenCalled();
        });
        it('should handle get_pull_request_checks request', async () => {
            const mockResult = { statuses: [], policyEvaluations: [] };
            get_pull_request_checks_1.getPullRequestChecks.mockResolvedValue(mockResult);
            const request = {
                params: {
                    name: 'get_pull_request_checks',
                    arguments: { repositoryId: 'test-repo', pullRequestId: 7 },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePullRequestsRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockResult);
            expect(get_pull_request_checks_1.getPullRequestChecks).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                repositoryId: 'test-repo',
                pullRequestId: 7,
            }));
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handlePullRequestsRequest)(mockConnection, request)).rejects.toThrow('Unknown pull requests tool');
        });
        it('should propagate errors from pull request functions', async () => {
            const mockError = new Error('Test error');
            list_pull_requests_1.listPullRequests.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'list_pull_requests',
                    arguments: {
                        repositoryId: 'test-repo',
                    },
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handlePullRequestsRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map