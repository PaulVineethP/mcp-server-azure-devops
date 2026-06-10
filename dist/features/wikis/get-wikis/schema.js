"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWikisSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for listing wikis in an Azure DevOps project or organization
 */
exports.GetWikisSchema = zod_1.z.object({
    organizationId: zod_1.z
        .string()
        .optional()
        .nullable()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    projectId: zod_1.z
        .string()
        .optional()
        .nullable()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
});
//# sourceMappingURL=schema.js.map