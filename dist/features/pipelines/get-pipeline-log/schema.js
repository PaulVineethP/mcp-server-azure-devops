"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPipelineLogSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
exports.GetPipelineLogSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    runId: zod_1.z.number().int().min(1).describe('Pipeline run identifier'),
    logId: zod_1.z
        .number()
        .int()
        .min(1)
        .describe('Log identifier from the timeline record'),
    format: zod_1.z
        .enum(['plain', 'json'])
        .optional()
        .describe('Optional format for the log contents (plain or json)'),
    startLine: zod_1.z
        .number()
        .int()
        .min(0)
        .optional()
        .describe('Optional starting line number for the log segment'),
    endLine: zod_1.z
        .number()
        .int()
        .min(0)
        .optional()
        .describe('Optional ending line number for the log segment'),
    pipelineId: zod_1.z
        .number()
        .int()
        .min(1)
        .optional()
        .describe('Optional pipeline numeric ID for reference only'),
});
//# sourceMappingURL=schema.js.map