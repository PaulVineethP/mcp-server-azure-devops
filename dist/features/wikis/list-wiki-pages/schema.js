"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListWikiPagesSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for listing wiki pages from an Azure DevOps wiki
 */
exports.ListWikiPagesSchema = zod_1.z.object({
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
    wikiId: zod_1.z.string().describe('The ID or name of the wiki'),
});
//# sourceMappingURL=schema.js.map