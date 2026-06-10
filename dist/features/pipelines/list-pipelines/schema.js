"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPipelinesSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for the listPipelines function
 */
exports.ListPipelinesSchema = zod_1.z.object({
    // The project to list pipelines from
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    // Maximum number of pipelines to return
    top: zod_1.z.number().optional().describe('Maximum number of pipelines to return'),
    // Order by field and direction
    orderBy: zod_1.z
        .string()
        .optional()
        .describe('Order by field and direction (e.g., "createdDate desc")'),
});
//# sourceMappingURL=schema.js.map