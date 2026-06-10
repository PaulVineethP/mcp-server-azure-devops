"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWikiPageSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Schema for validating wiki page update options
 */
exports.UpdateWikiPageSchema = zod_1.z.object({
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
    pagePath: zod_1.z.string().min(1).describe('Path of the wiki page to update'),
    content: zod_1.z
        .string()
        .min(1)
        .describe('The new content for the wiki page in markdown format'),
    comment: zod_1.z
        .string()
        .optional()
        .nullable()
        .describe('Optional comment for the update'),
});
//# sourceMappingURL=schema.js.map