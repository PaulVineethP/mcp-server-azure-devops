"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const get_repository_1 = require("./get-repository");
const get_repository_details_1 = require("./get-repository-details");
const list_repositories_1 = require("./list-repositories");
const get_file_content_1 = require("./get-file-content");
const get_all_repositories_tree_1 = require("./get-all-repositories-tree");
const get_repository_tree_1 = require("./get-repository-tree");
const create_branch_1 = require("./create-branch");
const create_commit_1 = require("./create-commit");
const list_commits_1 = require("./list-commits");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
// Mock the imported modules
jest.mock('./get-repository', () => ({
    getRepository: jest.fn(),
}));
jest.mock('./get-repository-details', () => ({
    getRepositoryDetails: jest.fn(),
}));
jest.mock('./list-repositories', () => ({
    listRepositories: jest.fn(),
}));
jest.mock('./get-file-content', () => ({
    getFileContent: jest.fn(),
}));
jest.mock('./get-all-repositories-tree', () => ({
    getAllRepositoriesTree: jest.fn(),
    formatRepositoryTree: jest.fn(),
}));
jest.mock('./get-repository-tree', () => ({
    getRepositoryTree: jest.fn(),
}));
jest.mock('./create-branch', () => ({
    createBranch: jest.fn(),
}));
jest.mock('./create-commit', () => ({
    createCommit: jest.fn(),
}));
jest.mock('./list-commits', () => ({
    listCommits: jest.fn(),
}));
describe('Repositories Request Handlers', () => {
    const mockConnection = {};
    describe('isRepositoriesRequest', () => {
        it('should return true for repositories requests', () => {
            const validTools = [
                'get_repository',
                'get_repository_details',
                'list_repositories',
                'get_file_content',
                'get_all_repositories_tree',
                'get_repository_tree',
                'create_branch',
                'create_commit',
                'list_commits',
            ];
            validTools.forEach((tool) => {
                const request = {
                    params: { name: tool, arguments: {} },
                    method: 'tools/call',
                };
                expect((0, index_1.isRepositoriesRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-repositories requests', () => {
            const request = {
                params: { name: 'list_projects', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isRepositoriesRequest)(request)).toBe(false);
        });
    });
    describe('handleRepositoriesRequest', () => {
        it('should handle get_repository request', async () => {
            const mockRepository = { id: 'repo1', name: 'Repository 1' };
            get_repository_1.getRepository.mockResolvedValue(mockRepository);
            const request = {
                params: {
                    name: 'get_repository',
                    arguments: {
                        repositoryId: 'repo1',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRepository);
            expect(get_repository_1.getRepository).toHaveBeenCalledWith(mockConnection, expect.any(String), 'repo1');
        });
        it('should handle get_repository_details request', async () => {
            const mockRepositoryDetails = {
                repository: { id: 'repo1', name: 'Repository 1' },
                statistics: { branches: [] },
                refs: { value: [], count: 0 },
            };
            get_repository_details_1.getRepositoryDetails.mockResolvedValue(mockRepositoryDetails);
            const request = {
                params: {
                    name: 'get_repository_details',
                    arguments: {
                        repositoryId: 'repo1',
                        includeStatistics: true,
                        includeRefs: true,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRepositoryDetails);
            expect(get_repository_details_1.getRepositoryDetails).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                repositoryId: 'repo1',
                includeStatistics: true,
                includeRefs: true,
            }));
        });
        it('should handle list_repositories request', async () => {
            const mockRepositories = [
                { id: 'repo1', name: 'Repository 1' },
                { id: 'repo2', name: 'Repository 2' },
            ];
            list_repositories_1.listRepositories.mockResolvedValue(mockRepositories);
            const request = {
                params: {
                    name: 'list_repositories',
                    arguments: {
                        projectId: 'project1',
                        includeLinks: true,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRepositories);
            expect(list_repositories_1.listRepositories).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'project1',
                includeLinks: true,
            }));
        });
        it('should handle get_file_content request', async () => {
            const mockFileContent = { content: 'file content', isFolder: false };
            get_file_content_1.getFileContent.mockResolvedValue(mockFileContent);
            const request = {
                params: {
                    name: 'get_file_content',
                    arguments: {
                        repositoryId: 'repo1',
                        path: '/path/to/file',
                        version: 'main',
                        versionType: 'branch',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockFileContent);
            expect(get_file_content_1.getFileContent).toHaveBeenCalledWith(mockConnection, expect.any(String), 'repo1', '/path/to/file', { versionType: GitInterfaces_1.GitVersionType.Branch, version: 'main' });
        });
        it('should handle get_all_repositories_tree request', async () => {
            const mockTreeResponse = {
                repositories: [
                    {
                        name: 'repo1',
                        tree: [
                            { name: 'file1', path: '/file1', isFolder: false, level: 0 },
                        ],
                        stats: { directories: 0, files: 1 },
                    },
                ],
            };
            get_all_repositories_tree_1.getAllRepositoriesTree.mockResolvedValue(mockTreeResponse);
            get_all_repositories_tree_1.formatRepositoryTree.mockReturnValue('repo1\n  file1\n');
            const request = {
                params: {
                    name: 'get_all_repositories_tree',
                    arguments: {
                        projectId: 'project1',
                        depth: 2,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(response.content[0].text).toContain('repo1');
            expect(get_all_repositories_tree_1.getAllRepositoriesTree).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'project1',
                depth: 2,
            }));
            expect(get_all_repositories_tree_1.formatRepositoryTree).toHaveBeenCalledWith('repo1', expect.any(Array), expect.any(Object), undefined);
        });
        it('should handle get_repository_tree request', async () => {
            const mockResponse = {
                name: 'repo',
                tree: [],
                stats: { directories: 0, files: 0 },
            };
            get_repository_tree_1.getRepositoryTree.mockResolvedValue(mockResponse);
            const request = {
                params: {
                    name: 'get_repository_tree',
                    arguments: { repositoryId: 'r' },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockResponse);
            expect(get_repository_tree_1.getRepositoryTree).toHaveBeenCalled();
        });
        it('should handle create_branch request', async () => {
            const request = {
                params: {
                    name: 'create_branch',
                    arguments: {
                        repositoryId: 'r',
                        sourceBranch: 'main',
                        newBranch: 'feature',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content[0].text).toContain('Branch created');
            expect(create_branch_1.createBranch).toHaveBeenCalled();
        });
        it('should handle create_commit request', async () => {
            const request = {
                params: {
                    name: 'create_commit',
                    arguments: {
                        repositoryId: 'r',
                        branchName: 'main',
                        commitMessage: 'msg',
                        changes: [],
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(response.content[0].text).toContain('Commit created');
            expect(create_commit_1.createCommit).toHaveBeenCalled();
        });
        it('should handle list_commits request', async () => {
            list_commits_1.listCommits.mockResolvedValue({ commits: [] });
            const request = {
                params: {
                    name: 'list_commits',
                    arguments: {
                        repositoryId: 'r',
                        branchName: 'main',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleRepositoriesRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual({
                commits: [],
            });
            expect(list_commits_1.listCommits).toHaveBeenCalled();
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleRepositoriesRequest)(mockConnection, request)).rejects.toThrow('Unknown repositories tool');
        });
        it('should propagate errors from repository functions', async () => {
            const mockError = new Error('Test error');
            list_repositories_1.listRepositories.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'list_repositories',
                    arguments: {
                        projectId: 'project1',
                    },
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleRepositoriesRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map