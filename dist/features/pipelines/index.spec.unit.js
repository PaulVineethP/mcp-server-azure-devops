"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const feature_1 = require("./list-pipelines/feature");
const feature_2 = require("./get-pipeline/feature");
const feature_3 = require("./list-pipeline-runs/feature");
const feature_4 = require("./get-pipeline-run/feature");
const feature_5 = require("./pipeline-timeline/feature");
const feature_6 = require("./get-pipeline-log/feature");
const feature_7 = require("./trigger-pipeline/feature");
jest.mock('./list-pipelines/feature');
jest.mock('./get-pipeline/feature');
jest.mock('./list-pipeline-runs/feature');
jest.mock('./get-pipeline-run/feature');
jest.mock('./pipeline-timeline/feature');
jest.mock('./get-pipeline-log/feature');
jest.mock('./trigger-pipeline/feature');
describe('Pipelines Request Handlers', () => {
    const mockConnection = {};
    describe('isPipelinesRequest', () => {
        it('should return true for pipelines requests', () => {
            const validTools = [
                'list_pipelines',
                'get_pipeline',
                'list_pipeline_runs',
                'get_pipeline_run',
                'pipeline_timeline',
                'get_pipeline_log',
                'trigger_pipeline',
            ];
            validTools.forEach((tool) => {
                const request = {
                    params: { name: tool, arguments: {} },
                    method: 'tools/call',
                };
                expect((0, index_1.isPipelinesRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-pipelines requests', () => {
            const request = {
                params: { name: 'get_project', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isPipelinesRequest)(request)).toBe(false);
        });
    });
    describe('handlePipelinesRequest', () => {
        it('should handle list_pipelines request', async () => {
            const mockPipelines = [
                { id: 1, name: 'Pipeline 1' },
                { id: 2, name: 'Pipeline 2' },
            ];
            feature_1.listPipelines.mockResolvedValue(mockPipelines);
            const request = {
                params: {
                    name: 'list_pipelines',
                    arguments: {
                        projectId: 'test-project',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockPipelines);
            expect(feature_1.listPipelines).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
            }));
        });
        it('should handle get_pipeline request', async () => {
            const mockPipeline = { id: 1, name: 'Pipeline 1' };
            feature_2.getPipeline.mockResolvedValue(mockPipeline);
            const request = {
                params: {
                    name: 'get_pipeline',
                    arguments: {
                        projectId: 'test-project',
                        pipelineId: 1,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockPipeline);
            expect(feature_2.getPipeline).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                pipelineId: 1,
            }));
        });
        it('should handle trigger_pipeline request', async () => {
            const mockRun = { id: 1, state: 'inProgress' };
            feature_7.triggerPipeline.mockResolvedValue(mockRun);
            const request = {
                params: {
                    name: 'trigger_pipeline',
                    arguments: {
                        projectId: 'test-project',
                        pipelineId: 1,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRun);
            expect(feature_7.triggerPipeline).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                pipelineId: 1,
            }));
        });
        it('should handle list_pipeline_runs request', async () => {
            const mockRuns = { runs: [{ id: 1 }], continuationToken: 'next' };
            feature_3.listPipelineRuns.mockResolvedValue(mockRuns);
            const request = {
                params: {
                    name: 'list_pipeline_runs',
                    arguments: {
                        projectId: 'test-project',
                        pipelineId: 99,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRuns);
            expect(feature_3.listPipelineRuns).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                pipelineId: 99,
            }));
        });
        it('should handle get_pipeline_run request', async () => {
            const mockRun = { id: 123 };
            feature_4.getPipelineRun.mockResolvedValue(mockRun);
            const request = {
                params: {
                    name: 'get_pipeline_run',
                    arguments: {
                        projectId: 'test-project',
                        runId: 123,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockRun);
            expect(feature_4.getPipelineRun).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                runId: 123,
            }));
        });
        it('should handle pipeline_timeline request', async () => {
            const mockTimeline = { records: [{ name: 'Stage 1' }] };
            feature_5.getPipelineTimeline.mockResolvedValue(mockTimeline);
            const request = {
                params: {
                    name: 'pipeline_timeline',
                    arguments: {
                        projectId: 'test-project',
                        pipelineId: 99,
                        runId: 321,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(JSON.parse(response.content[0].text)).toEqual(mockTimeline);
            expect(feature_5.getPipelineTimeline).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                pipelineId: 99,
                runId: 321,
            }));
        });
        it('should handle get_pipeline_log request', async () => {
            feature_6.getPipelineLog.mockResolvedValue('log lines');
            const request = {
                params: {
                    name: 'get_pipeline_log',
                    arguments: {
                        projectId: 'test-project',
                        pipelineId: 99,
                        runId: 321,
                        logId: 7,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handlePipelinesRequest)(mockConnection, request);
            expect(response.content[0].text).toBe('log lines');
            expect(feature_6.getPipelineLog).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'test-project',
                pipelineId: 99,
                runId: 321,
                logId: 7,
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
            await expect((0, index_1.handlePipelinesRequest)(mockConnection, request)).rejects.toThrow('Unknown pipelines tool');
        });
        it('should propagate errors from pipeline functions', async () => {
            const mockError = new Error('Test error');
            feature_1.listPipelines.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'list_pipelines',
                    arguments: {
                        projectId: 'test-project',
                    },
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handlePipelinesRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map