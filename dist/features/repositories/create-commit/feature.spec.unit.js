"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
const diff_1 = require("diff");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
describe('createCommit unit', () => {
    test('should create push with provided changes', async () => {
        const createPush = jest.fn().mockResolvedValue({});
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest
                    .fn()
                    .mockResolvedValue({ commit: { commitId: 'base' } }),
                getItemContent: jest
                    .fn()
                    .mockResolvedValue(stream_1.Readable.from(['console.log("hello");\n'])),
                createPush,
            }),
        };
        await (0, feature_1.createCommit)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
            commitMessage: 'msg',
            changes: [
                {
                    path: '/file.ts',
                    patch: (0, diff_1.createTwoFilesPatch)('/file.ts', '/file.ts', 'console.log("hello");\n', 'console.log("world");\n'),
                },
                {
                    path: '/new.txt',
                    patch: (0, diff_1.createTwoFilesPatch)('/dev/null', '/new.txt', '', 'hi\n'),
                },
            ],
        });
        expect(createPush).toHaveBeenCalled();
        const payload = createPush.mock.calls[0][0];
        expect(payload.commits[0].changes).toHaveLength(2);
    });
    test('should throw when snippet not found', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest
                    .fn()
                    .mockResolvedValue({ commit: { commitId: 'base' } }),
                getItemContent: jest
                    .fn()
                    .mockResolvedValue(stream_1.Readable.from(['nothing here'])),
            }),
        };
        await expect((0, feature_1.createCommit)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
            commitMessage: 'msg',
            changes: [
                {
                    path: '/file.ts',
                    patch: (0, diff_1.createTwoFilesPatch)('/file.ts', '/file.ts', 'console.log("hello");\n', 'console.log("world");\n'),
                },
            ],
        })).rejects.toThrow(errors_1.AzureDevOpsError);
    });
    test('should create delete change when patch removes a file', async () => {
        const createPush = jest.fn().mockResolvedValue({});
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest
                    .fn()
                    .mockResolvedValue({ commit: { commitId: 'base' } }),
                getItemContent: jest
                    .fn()
                    .mockResolvedValue(stream_1.Readable.from(['goodbye\n'])),
                createPush,
            }),
        };
        await (0, feature_1.createCommit)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
            commitMessage: 'msg',
            changes: [
                {
                    patch: (0, diff_1.createTwoFilesPatch)('/old.txt', '/dev/null', 'goodbye\n', ''),
                },
            ],
        });
        expect(createPush).toHaveBeenCalled();
        const payload = createPush.mock.calls[0][0];
        const change = payload.commits[0].changes[0];
        expect(change.changeType).toBe(GitInterfaces_1.VersionControlChangeType.Delete);
        expect(change.item).toEqual({ path: '/old.txt' });
        expect(change.newContent).toBeUndefined();
    });
    test('should handle search/replace format', async () => {
        const createPush = jest.fn().mockResolvedValue({});
        const fileContent = 'const x = 1;\nconsole.log("hello");\n';
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest
                    .fn()
                    .mockResolvedValue({ commit: { commitId: 'base' } }),
                getItemContent: jest
                    .fn()
                    .mockImplementation(() => stream_1.Readable.from([fileContent])),
                createPush,
            }),
        };
        await (0, feature_1.createCommit)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
            commitMessage: 'msg',
            changes: [
                {
                    path: '/file.ts',
                    search: 'console.log("hello");',
                    replace: 'console.log("world");',
                },
            ],
        });
        expect(createPush).toHaveBeenCalled();
        const payload = createPush.mock.calls[0][0];
        expect(payload.commits[0].changes).toHaveLength(1);
        const change = payload.commits[0].changes[0];
        expect(change.changeType).toBe(GitInterfaces_1.VersionControlChangeType.Edit);
        expect(change.newContent?.content).toContain('console.log("world");');
    });
    test('should throw when search string not found', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getBranch: jest
                    .fn()
                    .mockResolvedValue({ commit: { commitId: 'base' } }),
                getItemContent: jest
                    .fn()
                    .mockResolvedValue(stream_1.Readable.from(['const x = 1;\n'])),
            }),
        };
        await expect((0, feature_1.createCommit)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
            commitMessage: 'msg',
            changes: [
                {
                    path: '/file.ts',
                    search: 'NOT_FOUND',
                    replace: 'something',
                },
            ],
        })).rejects.toThrow(errors_1.AzureDevOpsError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map