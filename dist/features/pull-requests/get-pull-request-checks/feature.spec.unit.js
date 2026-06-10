"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const PolicyInterfaces_1 = require("azure-devops-node-api/interfaces/PolicyInterfaces");
const errors_1 = require("../../../shared/errors");
describe('getPullRequestChecks', () => {
    it('returns status checks and policy evaluations with pipeline references', async () => {
        const statusRecords = [
            {
                id: 10,
                state: GitInterfaces_1.GitStatusState.Failed,
                description: 'CI build',
                context: { name: 'CI', genre: 'continuous-integration' },
                targetUrl: 'https://dev.azure.com/org/project/_apis/pipelines/55/runs/123?view=results',
                creationDate: new Date('2024-01-01T00:00:00Z'),
                updatedDate: new Date('2024-01-01T01:00:00Z'),
            },
            {
                id: 11,
                state: GitInterfaces_1.GitStatusState.Succeeded,
                description: 'Lint checks',
                context: { name: 'Lint', genre: 'validation' },
                targetUrl: 'https://dev.azure.com/org/project/_build/results?buildId=456&definitionId=789',
                creationDate: new Date('2024-02-01T00:00:00Z'),
                updatedDate: new Date('2024-02-01T01:00:00Z'),
            },
        ];
        const evaluationRecords = [
            {
                evaluationId: 'eval-1',
                status: PolicyInterfaces_1.PolicyEvaluationStatus.Rejected,
                configuration: {
                    id: 7,
                    revision: 3,
                    isBlocking: true,
                    isEnabled: true,
                    type: {
                        id: 'policy-guid',
                        displayName: 'Build',
                    },
                    settings: {
                        displayName: 'CI Build',
                        buildDefinitionId: 987,
                    },
                },
                context: {
                    buildId: 456,
                    targetUrl: 'https://dev.azure.com/org/project/_build/results?buildId=456',
                    message: 'Build failed',
                },
            },
        ];
        const gitApi = {
            getPullRequestStatuses: jest.fn().mockResolvedValue(statusRecords),
        };
        const policyApi = {
            getPolicyEvaluations: jest.fn().mockResolvedValue(evaluationRecords),
        };
        const getProject = jest
            .fn()
            .mockResolvedValue({ id: 'project-guid', name: 'project' });
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue(gitApi),
            getPolicyApi: jest.fn().mockResolvedValue(policyApi),
            getCoreApi: jest.fn().mockResolvedValue({ getProject }),
        };
        const result = await (0, feature_1.getPullRequestChecks)(mockConnection, {
            projectId: 'project',
            repositoryId: 'repo',
            pullRequestId: 42,
        });
        expect(result.statuses).toHaveLength(2);
        expect(result.statuses[0].state).toBe('failed');
        expect(result.statuses[0].pipeline?.pipelineId).toBe(55);
        expect(result.statuses[0].pipeline?.runId).toBe(123);
        expect(result.statuses[1].pipeline?.buildId).toBe(456);
        expect(result.statuses[1].pipeline?.definitionId).toBe(789);
        expect(result.policyEvaluations).toHaveLength(1);
        expect(result.policyEvaluations[0].status).toBe('rejected');
        expect(result.policyEvaluations[0].pipeline?.definitionId).toBe(987);
        expect(result.policyEvaluations[0].pipeline?.buildId).toBe(456);
        expect(result.policyEvaluations[0].targetUrl).toContain('buildId=456');
        expect(getProject).toHaveBeenCalledWith('project');
        expect(gitApi.getPullRequestStatuses).toHaveBeenCalledWith('repo', 42, 'project-guid');
        expect(policyApi.getPolicyEvaluations).toHaveBeenCalledWith('project-guid', 'vstfs:///CodeReview/CodeReviewId/project-guid/42');
    });
    it('re-throws Azure DevOps errors', async () => {
        const azureError = new errors_1.AzureDevOpsError('Azure failure');
        const mockConnection = {
            getGitApi: jest.fn().mockRejectedValue(azureError),
            getPolicyApi: jest.fn(),
            getCoreApi: jest.fn().mockResolvedValue({
                getProject: jest.fn().mockResolvedValue({ id: 'project-guid' }),
            }),
        };
        await expect((0, feature_1.getPullRequestChecks)(mockConnection, {
            projectId: 'project',
            repositoryId: 'repo',
            pullRequestId: 1,
        })).rejects.toBe(azureError);
    });
    it('wraps unexpected errors', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockRejectedValue(new Error('boom')),
            getPolicyApi: jest.fn(),
            getCoreApi: jest.fn().mockResolvedValue({
                getProject: jest.fn().mockResolvedValue({ id: 'project-guid' }),
            }),
        };
        await expect((0, feature_1.getPullRequestChecks)(mockConnection, {
            projectId: 'project',
            repositoryId: 'repo',
            pullRequestId: 1,
        })).rejects.toThrow('Failed to get pull request checks: boom');
    });
    it('uses the provided project GUID without fetching project metadata', async () => {
        const mockConnection = {
            getGitApi: jest.fn().mockResolvedValue({
                getPullRequestStatuses: jest.fn().mockResolvedValue([]),
            }),
            getPolicyApi: jest.fn().mockResolvedValue({
                getPolicyEvaluations: jest.fn().mockResolvedValue([]),
            }),
            getCoreApi: jest.fn(() => {
                throw new Error('should not fetch project');
            }),
        };
        await expect((0, feature_1.getPullRequestChecks)(mockConnection, {
            projectId: '12345678-1234-1234-1234-1234567890ab',
            repositoryId: 'repo',
            pullRequestId: 1,
        })).resolves.toEqual({ statuses: [], policyEvaluations: [] });
        expect(mockConnection.getGitApi).toHaveBeenCalled();
        expect(mockConnection.getPolicyApi).toHaveBeenCalled();
    });
});
//# sourceMappingURL=feature.spec.unit.js.map