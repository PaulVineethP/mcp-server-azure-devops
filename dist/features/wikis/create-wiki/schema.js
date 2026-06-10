"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWikiSchema = exports.WikiType = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../../utils/environment");
/**
 * Wiki types for creating wiki
 */
var WikiType;
(function (WikiType) {
    /**
     * The wiki is published from a git repository
     */
    WikiType["CodeWiki"] = "codeWiki";
    /**
     * The wiki is provisioned for the team project
     */
    WikiType["ProjectWiki"] = "projectWiki";
})(WikiType || (exports.WikiType = WikiType = {}));
/**
 * Schema for creating a wiki in an Azure DevOps project
 */
exports.CreateWikiSchema = zod_1.z
    .object({
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
    name: zod_1.z.string().describe('The name of the new wiki'),
    type: zod_1.z
        .nativeEnum(WikiType)
        .optional()
        .default(WikiType.ProjectWiki)
        .describe('Type of wiki to create (projectWiki or codeWiki)'),
    repositoryId: zod_1.z
        .string()
        .optional()
        .nullable()
        .describe('The ID of the repository to associate with the wiki (required for codeWiki)'),
    mappedPath: zod_1.z
        .string()
        .optional()
        .nullable()
        .default('/')
        .describe('Folder path inside repository which is shown as Wiki (only for codeWiki)'),
})
    .refine((data) => {
    // If type is codeWiki, then repositoryId is required
    return data.type !== WikiType.CodeWiki || !!data.repositoryId;
}, {
    message: 'repositoryId is required when type is codeWiki',
    path: ['repositoryId'],
});
//# sourceMappingURL=schema.js.map