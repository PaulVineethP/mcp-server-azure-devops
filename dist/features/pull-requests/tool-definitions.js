"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestsTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of pull requests tools
 */
exports.pullRequestsTools = [
    {
        name: 'create_pull_request',
        description: 'Create a new pull request, including reviewers, linked work items, and optional tags',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.CreatePullRequestSchema),
    },
    {
        name: 'get_pull_request',
        description: 'Get a pull request by ID (no repositoryId required; best for Azure DevOps Server where PR IDs are project-scoped)',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetPullRequestSchema),
    },
    {
        name: 'list_pull_requests',
        description: 'List pull requests in a repository',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListPullRequestsSchema),
    },
    {
        name: 'get_pull_request_comments',
        description: 'Get comments from a specific pull request',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetPullRequestCommentsSchema),
    },
    {
        name: 'add_pull_request_comment',
        description: 'Add a comment to a pull request (repositoryId optional; derived from pullRequestId when omitted)',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.AddPullRequestCommentSchema),
    },
    {
        name: 'update_pull_request',
        description: 'Update an existing pull request with new properties, manage reviewers and work items, and add or remove tags',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.UpdatePullRequestSchema),
    },
    {
        name: 'get_pull_request_changes',
        description: 'Get the files changed in a pull request, their unified diffs, source/target branch names, and the status of policy evaluations',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetPullRequestChangesSchema),
    },
    {
        name: 'get_pull_request_checks',
        description: [
            'Summarize the latest status checks and policy evaluations for a pull request.',
            '- Surfaces pipeline and run identifiers so you can jump straight to the blocking validation.',
            '- Pair with pipeline tools (e.g., get_pipeline_run, pipeline_timeline) to inspect failures in depth.',
        ].join('\n'),
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetPullRequestChecksSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map