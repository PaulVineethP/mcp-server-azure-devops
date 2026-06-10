"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePipelinesRequest = exports.isPipelinesRequest = void 0;
// Re-export types
__exportStar(require("./types"), exports);
// Re-export features
__exportStar(require("./list-pipelines"), exports);
__exportStar(require("./get-pipeline"), exports);
__exportStar(require("./list-pipeline-runs"), exports);
__exportStar(require("./get-pipeline-run"), exports);
__exportStar(require("./download-pipeline-artifact"), exports);
__exportStar(require("./pipeline-timeline"), exports);
__exportStar(require("./get-pipeline-log"), exports);
__exportStar(require("./trigger-pipeline"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const list_pipelines_1 = require("./list-pipelines");
const get_pipeline_1 = require("./get-pipeline");
const list_pipeline_runs_1 = require("./list-pipeline-runs");
const get_pipeline_run_1 = require("./get-pipeline-run");
const download_pipeline_artifact_1 = require("./download-pipeline-artifact");
const pipeline_timeline_1 = require("./pipeline-timeline");
const get_pipeline_log_1 = require("./get-pipeline-log");
const trigger_pipeline_1 = require("./trigger-pipeline");
const list_pipelines_2 = require("./list-pipelines");
const get_pipeline_2 = require("./get-pipeline");
const list_pipeline_runs_2 = require("./list-pipeline-runs");
const get_pipeline_run_2 = require("./get-pipeline-run");
const download_pipeline_artifact_2 = require("./download-pipeline-artifact");
const pipeline_timeline_2 = require("./pipeline-timeline");
const get_pipeline_log_2 = require("./get-pipeline-log");
const trigger_pipeline_2 = require("./trigger-pipeline");
const environment_1 = require("../../utils/environment");
/**
 * Checks if the request is for the pipelines feature
 */
const isPipelinesRequest = (request) => {
    const toolName = request.params.name;
    return [
        'list_pipelines',
        'get_pipeline',
        'list_pipeline_runs',
        'get_pipeline_run',
        'download_pipeline_artifact',
        'pipeline_timeline',
        'get_pipeline_log',
        'trigger_pipeline',
    ].includes(toolName);
};
exports.isPipelinesRequest = isPipelinesRequest;
/**
 * Handles pipelines feature requests
 */
const handlePipelinesRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'list_pipelines': {
            const args = list_pipelines_1.ListPipelinesSchema.parse(request.params.arguments);
            const result = await (0, list_pipelines_2.listPipelines)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pipeline': {
            const args = get_pipeline_1.GetPipelineSchema.parse(request.params.arguments);
            const result = await (0, get_pipeline_2.getPipeline)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'list_pipeline_runs': {
            const args = list_pipeline_runs_1.ListPipelineRunsSchema.parse(request.params.arguments);
            const result = await (0, list_pipeline_runs_2.listPipelineRuns)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pipeline_run': {
            const args = get_pipeline_run_1.GetPipelineRunSchema.parse(request.params.arguments);
            const result = await (0, get_pipeline_run_2.getPipelineRun)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'download_pipeline_artifact': {
            const args = download_pipeline_artifact_1.DownloadPipelineArtifactSchema.parse(request.params.arguments);
            const result = await (0, download_pipeline_artifact_2.downloadPipelineArtifact)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'pipeline_timeline': {
            const args = pipeline_timeline_1.GetPipelineTimelineSchema.parse(request.params.arguments);
            const result = await (0, pipeline_timeline_2.getPipelineTimeline)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pipeline_log': {
            const args = get_pipeline_log_1.GetPipelineLogSchema.parse(request.params.arguments);
            const result = await (0, get_pipeline_log_2.getPipelineLog)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
            return {
                content: [{ type: 'text', text }],
            };
        }
        case 'trigger_pipeline': {
            const args = trigger_pipeline_1.TriggerPipelineSchema.parse(request.params.arguments);
            const result = await (0, trigger_pipeline_2.triggerPipeline)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown pipelines tool: ${request.params.name}`);
    }
};
exports.handlePipelinesRequest = handlePipelinesRequest;
//# sourceMappingURL=index.js.map