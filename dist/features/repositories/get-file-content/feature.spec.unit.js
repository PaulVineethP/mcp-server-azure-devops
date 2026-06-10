"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const errors_1 = require("../../../shared/errors");
const feature_1 = require("./feature");
const stream_1 = require("stream");
describe('getFileContent', () => {
    let mockConnection;
    let mockGitApi;
    const mockRepositoryId = 'test-repo';
    const mockProjectId = 'test-project';
    const mockFilePath = '/path/to/file.txt';
    const mockFileContent = 'Test file content';
    const mockItem = {
        objectId: '123456',
        path: mockFilePath,
        url: 'https://dev.azure.com/org/project/_apis/git/repositories/repo/items/path/to/file.txt',
        gitObjectType: 'blob',
    };
    // Helper function to create a readable stream from a string
    function createReadableStream(content) {
        const stream = new stream_1.Readable();
        stream.push(content);
        stream.push(null); // Signals the end of the stream
        return stream;
    }
    beforeEach(() => {
        mockGitApi = {
            getItemContent: jest
                .fn()
                .mockResolvedValue(createReadableStream(mockFileContent)),
            getItems: jest.fn().mockResolvedValue([mockItem]),
        };
        mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
        };
    });
    it('should get file content for a file in the default branch', async () => {
        const result = await (0, feature_1.getFileContent)(mockConnection, mockProjectId, mockRepositoryId, mockFilePath);
        expect(mockConnection.getGitApi).toHaveBeenCalled();
        expect(mockGitApi.getItems).toHaveBeenCalledWith(mockRepositoryId, mockProjectId, mockFilePath, expect.any(Number), // VersionControlRecursionType.OneLevel
        undefined, undefined, undefined, undefined, undefined);
        expect(mockGitApi.getItemContent).toHaveBeenCalledWith(mockRepositoryId, mockFilePath, mockProjectId, undefined, undefined, undefined, undefined, false, undefined, true);
        expect(result).toEqual({
            content: mockFileContent,
            isDirectory: false,
        });
    });
    it('should get file content for a file in a specific branch', async () => {
        const branchName = 'test-branch';
        const versionDescriptor = {
            versionType: GitInterfaces_1.GitVersionType.Branch,
            version: branchName,
            versionOptions: undefined,
        };
        const result = await (0, feature_1.getFileContent)(mockConnection, mockProjectId, mockRepositoryId, mockFilePath, {
            versionType: GitInterfaces_1.GitVersionType.Branch,
            version: branchName,
        });
        expect(mockConnection.getGitApi).toHaveBeenCalled();
        expect(mockGitApi.getItems).toHaveBeenCalledWith(mockRepositoryId, mockProjectId, mockFilePath, expect.any(Number), // VersionControlRecursionType.OneLevel
        undefined, undefined, undefined, undefined, versionDescriptor);
        expect(mockGitApi.getItemContent).toHaveBeenCalledWith(mockRepositoryId, mockFilePath, mockProjectId, undefined, undefined, undefined, undefined, false, versionDescriptor, true);
        expect(result).toEqual({
            content: mockFileContent,
            isDirectory: false,
        });
    });
    it('should throw an error if the file is not found', async () => {
        // Mock getItems to throw an error
        mockGitApi.getItems = jest
            .fn()
            .mockRejectedValue(new Error('Item not found'));
        // Mock getItemContent to throw a specific error indicating not found
        mockGitApi.getItemContent = jest
            .fn()
            .mockRejectedValue(new Error('Item not found'));
        await expect((0, feature_1.getFileContent)(mockConnection, mockProjectId, mockRepositoryId, '/invalid/path')).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
    });
    it('should get directory content if the path is a directory', async () => {
        const dirPath = '/path/to/dir';
        const mockDirectoryItems = [
            {
                path: `${dirPath}/file1.txt`,
                gitObjectType: 'blob',
                isFolder: false,
            },
            {
                path: `${dirPath}/file2.md`,
                gitObjectType: 'blob',
                isFolder: false,
            },
            {
                path: `${dirPath}/subdir`,
                gitObjectType: 'tree',
                isFolder: true,
            },
        ];
        // Mock getItems to return multiple items, indicating a directory
        mockGitApi.getItems = jest.fn().mockResolvedValue(mockDirectoryItems);
        const result = await (0, feature_1.getFileContent)(mockConnection, mockProjectId, mockRepositoryId, dirPath);
        expect(mockConnection.getGitApi).toHaveBeenCalled();
        expect(mockGitApi.getItems).toHaveBeenCalledWith(mockRepositoryId, mockProjectId, dirPath, expect.any(Number), // VersionControlRecursionType.OneLevel
        undefined, undefined, undefined, undefined, undefined);
        // Should not attempt to get file content for a directory
        expect(mockGitApi.getItemContent).not.toHaveBeenCalled();
        expect(result).toEqual({
            content: JSON.stringify(mockDirectoryItems, null, 2),
            isDirectory: true,
        });
    });
    it('should handle a directory path with trailing slash', async () => {
        const dirPath = '/path/to/dir/';
        const mockDirectoryItems = [
            {
                path: `${dirPath}file1.txt`,
                gitObjectType: 'blob',
                isFolder: false,
            },
        ];
        // Even with one item, it should be treated as a directory due to trailing slash
        mockGitApi.getItems = jest.fn().mockResolvedValue(mockDirectoryItems);
        const result = await (0, feature_1.getFileContent)(mockConnection, mockProjectId, mockRepositoryId, dirPath);
        expect(result.isDirectory).toBe(true);
        expect(result.content).toBe(JSON.stringify(mockDirectoryItems, null, 2));
    });
});
//# sourceMappingURL=feature.spec.unit.js.map