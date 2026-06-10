"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
describe('getPipelineLog unit', () => {
    let mockConnection;
    let mockBuildApi;
    let mockRestGet;
    beforeEach(() => {
        jest.resetAllMocks();
        mockRestGet = jest.fn();
        mockBuildApi = {
            rest: { get: mockRestGet },
            createRequestOptions: jest
                .fn()
                .mockReturnValue({ acceptHeader: 'application/json' }),
            getBuildLogLines: jest.fn(),
        };
        mockConnection = {
            serverUrl: 'https://dev.azure.com/testorg',
            getBuildApi: jest.fn().mockResolvedValue(mockBuildApi),
        };
    });
    it('retrieves the pipeline log with query parameters', async () => {
        mockRestGet.mockResolvedValue({
            statusCode: 200,
            result: 'log content',
            headers: {},
        });
        const result = await (0, feature_1.getPipelineLog)(mockConnection, {
            projectId: 'test-project',
            runId: 101,
            logId: 7,
            format: 'json',
            startLine: 10,
            endLine: 20,
        });
        expect(result).toEqual('log content');
        expect(mockBuildApi.createRequestOptions).toHaveBeenCalledWith('application/json', '7.1');
        const [requestUrl] = mockRestGet.mock.calls[0];
        const url = new URL(requestUrl);
        expect(url.pathname).toContain('/build/builds/101/logs/7');
        expect(url.searchParams.get('format')).toBe('json');
        expect(url.searchParams.get('startLine')).toBe('10');
        expect(url.searchParams.get('endLine')).toBe('20');
    });
    it('defaults to plain text when format not provided', async () => {
        mockBuildApi.getBuildLogLines.mockResolvedValue(['line1', 'line2']);
        await (0, feature_1.getPipelineLog)(mockConnection, {
            projectId: 'test-project',
            runId: 101,
            logId: 7,
        });
        expect(mockBuildApi.getBuildLogLines).toHaveBeenCalledWith('test-project', 101, 7, undefined, undefined);
    });
    it('throws resource not found when API returns 404', async () => {
        mockBuildApi.getBuildLogLines.mockResolvedValue(undefined);
        await expect((0, feature_1.getPipelineLog)(mockConnection, {
            projectId: 'test-project',
            runId: 101,
            logId: 7,
        })).rejects.toBeInstanceOf(errors_1.AzureDevOpsResourceNotFoundError);
    });
    it('maps authentication errors', async () => {
        mockBuildApi.getBuildLogLines.mockRejectedValue(new Error('401 Unauthorized'));
        await expect((0, feature_1.getPipelineLog)(mockConnection, {
            projectId: 'test-project',
            runId: 101,
            logId: 7,
        })).rejects.toBeInstanceOf(errors_1.AzureDevOpsAuthenticationError);
    });
    it('wraps unexpected errors', async () => {
        mockBuildApi.getBuildLogLines.mockRejectedValue(new Error('Boom'));
        await expect((0, feature_1.getPipelineLog)(mockConnection, {
            projectId: 'test-project',
            runId: 101,
            logId: 7,
        })).rejects.toBeInstanceOf(errors_1.AzureDevOpsError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map