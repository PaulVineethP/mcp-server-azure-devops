"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
const stream_1 = require("stream");
describe('getPullRequestChanges unit', () => {
    test('should retrieve changes, evaluations, and patches', async () => {
        const mockGitApi = {
            getPullRequest: jest.fn().mockResolvedValue({
                sourceRefName: 'refs/heads/feature',
                targetRefName: 'refs/heads/main',
            }),
            getPullRequestIterations: jest.fn().mockResolvedValue([{ id: 1 }]),
            getPullRequestIterationChanges: jest.fn().mockResolvedValue({
                changeEntries: [
                    {
                        item: {
                            path: '/file.txt',
                            objectId: 'new',
                            originalObjectId: 'old',
                        },
                    },
                ],
            }),
            getBlobContent: jest.fn().mockImplementation((_, sha) => {
                const content = sha === 'new' ? 'new content\n' : 'old content\n';
                const stream = new stream_1.Readable();
                stream.push(content);
                stream.push(null);
                return Promise.resolve(stream);
            }),
        };
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(mockGitApi),
            getPolicyApi: jest.fn().mockResolvedValue({
                getPolicyEvaluations: jest.fn().mockResolvedValue([{ id: '1' }]),
            }),
        };
        const result = await (0, feature_1.getPullRequestChanges)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            pullRequestId: 1,
        });
        expect(result.changes).toEqual({
            changeEntries: [
                {
                    item: { path: '/file.txt', objectId: 'new', originalObjectId: 'old' },
                },
            ],
        });
        expect(result.evaluations).toHaveLength(1);
        expect(result.files).toHaveLength(1);
        expect(result.files[0].path).toBe('/file.txt');
        expect(result.files[0].patch).toContain('-old content');
        expect(result.files[0].patch).toContain('+new content');
        expect(result.sourceRefName).toBe('refs/heads/feature');
        expect(result.targetRefName).toBe('refs/heads/main');
        expect(mockGitApi.getPullRequest).toHaveBeenCalledWith('r', 1, 'p');
    });
    test('should throw when no iterations found', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getPullRequest: jest.fn().mockResolvedValue({
                    sourceRefName: 'refs/heads/source',
                    targetRefName: 'refs/heads/target',
                }),
                getPullRequestIterations: jest.fn().mockResolvedValue([]),
            }),
        };
        await expect((0, feature_1.getPullRequestChanges)(mockConnection, {
            projectId: 'p',
            repositoryId: 'r',
            pullRequestId: 1,
        })).rejects.toThrow(errors_1.AzureDevOpsError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map