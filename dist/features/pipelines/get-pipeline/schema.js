"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPipelineSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for the getPipeline function
 */
exports.GetPipelineSchema = zod_1.z.object({
    // The project containing the pipeline
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    // The ID of the pipeline to retrieve
    pipelineId: zod_1.z
        .number()
        .int()
        .positive()
        .describe('The numeric ID of the pipeline to retrieve'),
    // The version of the pipeline to retrieve
    pipelineVersion: zod_1.z
        .number()
        .int()
        .positive()
        .optional()
        .describe('The version of the pipeline to retrieve (latest if not specified)'),
});
//# sourceMappingURL=schema.js.map