"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWikiPageSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for creating a new wiki page in Azure DevOps
 */
exports.CreateWikiPageSchema = zod_1.z.object({
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
    wikiId: zod_1.z.string().min(1).describe('The ID or name of the wiki'),
    pagePath: zod_1.z
        .string()
        .optional()
        .nullable()
        .default('/')
        .describe('Path of the wiki page to create. If the path does not exist, it will be created. Defaults to the wiki root (/). Example: /ParentPage/NewPage'),
    content: zod_1.z
        .string()
        .min(1)
        .describe('The content for the new wiki page in markdown format'),
    comment: zod_1.z
        .string()
        .optional()
        .describe('Optional comment for the creation or update'),
});
//# sourceMappingURL=schema.js.map