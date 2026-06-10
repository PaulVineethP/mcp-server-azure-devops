"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPipelineRunsSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
exports.ListPipelineRunsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    pipelineId: zod_1.z.number().int().min(1).describe('Pipeline numeric ID'),
    top: zod_1.z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(50)
        .describe('Maximum number of runs to return (1-100)'),
    continuationToken: zod_1.z
        .string()
        .optional()
        .describe('Continuation token for pagination'),
    branch: zod_1.z
        .string()
        .optional()
        .describe('Branch to filter by (e.g., "main" or "refs/heads/main")'),
    state: zod_1.z
        .enum(['notStarted', 'inProgress', 'completed', 'cancelling', 'postponed'])
        .optional()
        .describe('Filter by current run state'),
    result: zod_1.z
        .enum(['succeeded', 'partiallySucceeded', 'failed', 'canceled', 'none'])
        .optional()
        .describe('Filter by final run result'),
    createdFrom: zod_1.z
        .string()
        .datetime()
        .optional()
        .describe('Filter runs created at or after this time (ISO 8601)'),
    createdTo: zod_1.z
        .string()
        .datetime()
        .optional()
        .describe('Filter runs created at or before this time (ISO 8601)'),
    orderBy: zod_1.z
        .enum(['createdDate desc', 'createdDate asc'])
        .default('createdDate desc')
        .describe('Sort order for run creation date'),
});
//# sourceMappingURL=schema.js.map