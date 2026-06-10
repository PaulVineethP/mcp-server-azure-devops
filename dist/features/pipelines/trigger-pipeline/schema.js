"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerPipelineSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for the triggerPipeline function
 */
exports.TriggerPipelineSchema = zod_1.z.object({
    // The project containing the pipeline
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    // The ID of the pipeline to trigger
    pipelineId: zod_1.z
        .number()
        .int()
        .positive()
        .describe('The numeric ID of the pipeline to trigger'),
    // The branch to run the pipeline on
    branch: zod_1.z
        .string()
        .optional()
        .describe('The branch to run the pipeline on (e.g., "main", "feature/my-branch"). If left empty, the default branch will be used'),
    // Variables to pass to the pipeline run
    variables: zod_1.z
        .record(zod_1.z.object({
        value: zod_1.z.string(),
        isSecret: zod_1.z.boolean().optional(),
    }))
        .optional()
        .describe('Variables to pass to the pipeline run'),
    // Parameters for template-based pipelines
    templateParameters: zod_1.z
        .record(zod_1.z.string())
        .optional()
        .describe('Parameters for template-based pipelines'),
    // Stages to skip in the pipeline run
    stagesToSkip: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .describe('Stages to skip in the pipeline run'),
});
//# sourceMappingURL=schema.js.map