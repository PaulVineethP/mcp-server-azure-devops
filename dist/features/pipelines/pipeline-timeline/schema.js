"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPipelineTimelineSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
exports.GetPipelineTimelineSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    runId: zod_1.z.number().int().min(1).describe('Run identifier'),
    timelineId: zod_1.z
        .string()
        .optional()
        .describe('Optional timeline identifier to select a specific timeline record'),
    pipelineId: zod_1.z
        .number()
        .int()
        .min(1)
        .optional()
        .describe('Optional pipeline numeric ID for reference only'),
    state: zod_1.z
        .union([
        zod_1.z.enum(['pending', 'inProgress', 'completed']),
        zod_1.z.array(zod_1.z.enum(['pending', 'inProgress', 'completed'])),
    ])
        .optional()
        .describe('Optional state filter (single value or array) applied to returned timeline records'),
    result: zod_1.z
        .union([
        zod_1.z.enum([
            'succeeded',
            'succeededWithIssues',
            'failed',
            'canceled',
            'skipped',
            'abandoned',
        ]),
        zod_1.z.array(zod_1.z.enum([
            'succeeded',
            'succeededWithIssues',
            'failed',
            'canceled',
            'skipped',
            'abandoned',
        ])),
    ])
        .optional()
        .describe('Optional result filter (single value or array) applied to returned timeline records'),
});
//# sourceMappingURL=schema.js.map