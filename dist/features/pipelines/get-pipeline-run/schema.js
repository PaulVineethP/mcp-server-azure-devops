"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPipelineRunSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
exports.GetPipelineRunSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    runId: zod_1.z.number().int().min(1).describe('Pipeline run identifier'),
    pipelineId: zod_1.z
        .number()
        .int()
        .min(1)
        .optional()
        .describe('Optional guard; validates the run belongs to this pipeline'),
});
//# sourceMappingURL=schema.js.map