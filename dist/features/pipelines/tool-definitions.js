"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelinesTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schema_1 = require("./list-pipelines/schema");
const schema_2 = require("./get-pipeline/schema");
const schema_3 = require("./list-pipeline-runs/schema");
const schema_4 = require("./get-pipeline-run/schema");
const schema_5 = require("./download-pipeline-artifact/schema");
const schema_6 = require("./pipeline-timeline/schema");
const schema_7 = require("./get-pipeline-log/schema");
const schema_8 = require("./trigger-pipeline/schema");
/**
 * List of pipelines tools
 */
exports.pipelinesTools = [
    {
        name: 'list_pipelines',
        description: 'List pipelines in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_1.ListPipelinesSchema),
        mcp_enabled: true,
    },
    {
        name: 'get_pipeline',
        description: 'Get details of a specific pipeline',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_2.GetPipelineSchema),
        mcp_enabled: true,
    },
    {
        name: 'list_pipeline_runs',
        description: 'List recent runs for a pipeline',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_3.ListPipelineRunsSchema),
        mcp_enabled: true,
    },
    {
        name: 'get_pipeline_run',
        description: 'Get details for a specific pipeline run',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_4.GetPipelineRunSchema),
        mcp_enabled: true,
    },
    {
        name: 'download_pipeline_artifact',
        description: 'Download a file from a pipeline run artifact and return its textual content',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_5.DownloadPipelineArtifactSchema),
        mcp_enabled: true,
    },
    {
        name: 'pipeline_timeline',
        description: 'Retrieve the timeline of stages and jobs for a pipeline run, to reduce the amount of data returned, you can filter by state and result',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_6.GetPipelineTimelineSchema),
        mcp_enabled: true,
    },
    {
        name: 'get_pipeline_log',
        description: 'Retrieve a specific pipeline log using the timeline log identifier',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_7.GetPipelineLogSchema),
        mcp_enabled: true,
    },
    {
        name: 'trigger_pipeline',
        description: 'Trigger a pipeline run',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_8.TriggerPipelineSchema),
        mcp_enabled: true,
    },
];
//# sourceMappingURL=tool-definitions.js.map