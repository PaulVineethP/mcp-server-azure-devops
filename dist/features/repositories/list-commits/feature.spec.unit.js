"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const feature_1 = require("./feature");
describe('listCommits', () => {
    it('should return commits with file patches', async () => {
        const mockCommits = [
            {
                commitId: '123',
                comment: 'Initial commit',
                author: { name: 'Author' },
                committer: { name: 'Committer' },
                url: 'https://example.com',
                parents: ['abc'],
            },
        ];
        const getCommits = jest.fn().mockResolvedValue(mockCommits);
        const getChanges = jest.fn().mockResolvedValue({
            changes: [
                {
                    item: {
                        path: '/file.ts',
                        objectId: 'new',
                        originalObjectId: 'old',
                    },
                    originalPath: '/file.ts',
                },
            ],
        });
        const getBlobContent = jest
            .fn()
            .mockImplementation((_repo, objectId) => {
            const content = objectId === 'old'
                ? 'console.log("old");\n'
                : 'console.log("new");\n';
            return stream_1.Readable.from([content]);
        });
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getCommits,
                getChanges,
                getBlobContent,
            }),
        };
        const result = await (0, feature_1.listCommits)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            branchName: 'main',
        });
        expect(result.commits).toHaveLength(1);
        expect(result.commits[0].files).toHaveLength(1);
        expect(result.commits[0].files[0].patch).toContain('-console.log("old");');
        expect(result.commits[0].files[0].patch).toContain('+console.log("new");');
        expect(getCommits).toHaveBeenCalled();
        expect(getChanges).toHaveBeenCalledWith('123', 'r', 'p');
    });
});
//# sourceMappingURL=feature.spec.unit.js.map