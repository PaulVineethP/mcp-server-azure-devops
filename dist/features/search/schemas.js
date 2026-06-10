"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchWorkItemsSchema = exports.SearchWikiSchema = exports.SearchCodeSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../utils/environment");
/**
 * Schema for searching code in Azure DevOps repositories
 */
exports.SearchCodeSchema = zod_1.z.object({
    searchText: zod_1.z.string().describe('The text to search for'),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project to search in (Default: ${environment_1.defaultProject}). If not provided, the default project will be used.`),
    filters: zod_1.z
        .object({
        Repository: zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by repository names'),
        Path: zod_1.z.array(zod_1.z.string()).optional().describe('Filter by file paths'),
        Branch: zod_1.z.array(zod_1.z.string()).optional().describe('Filter by branch names'),
        CodeElement: zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by code element types (function, class, etc.)'),
    })
        .optional()
        .describe('Optional filters to narrow search results'),
    top: zod_1.z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(100)
        .describe('Number of results to return (default: 100, max: 1000)'),
    skip: zod_1.z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe('Number of results to skip for pagination (default: 0)'),
    includeSnippet: zod_1.z
        .boolean()
        .default(true)
        .describe('Whether to include code snippets in results (default: true)'),
    includeContent: zod_1.z
        .boolean()
        .default(true)
        .describe('Whether to include full file content in results (default: true)'),
});
/**
 * Schema for searching wiki pages in Azure DevOps projects
 */
exports.SearchWikiSchema = zod_1.z.object({
    searchText: zod_1.z.string().describe('The text to search for in wikis'),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    projectId: zod_1.z
        .string()
        .optional()
        .describe('The ID or name of the project to search in. If omitted, the search runs across the organization when supported.'),
    filters: zod_1.z
        .object({
        Project: zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by project names'),
    })
        .optional()
        .describe('Optional filters to narrow search results'),
    top: zod_1.z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(100)
        .describe('Number of results to return (default: 100, max: 1000)'),
    skip: zod_1.z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe('Number of results to skip for pagination (default: 0)'),
    includeFacets: zod_1.z
        .boolean()
        .default(true)
        .describe('Whether to include faceting in results (default: true)'),
});
/**
 * Schema for searching work items in Azure DevOps projects
 */
exports.SearchWorkItemsSchema = zod_1.z.object({
    searchText: zod_1.z.string().describe('The text to search for in work items'),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    projectId: zod_1.z
        .string()
        .optional()
        .describe('The ID or name of the project to search in. If omitted, the search runs across the organization when supported.'),
    filters: zod_1.z
        .object({
        'System.TeamProject': zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by project names'),
        'System.WorkItemType': zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by work item types (Bug, Task, User Story, etc.)'),
        'System.State': zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by work item states (New, Active, Closed, etc.)'),
        'System.AssignedTo': zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by assigned users'),
        'System.AreaPath': zod_1.z
            .array(zod_1.z.string())
            .optional()
            .describe('Filter by area paths'),
    })
        .optional()
        .describe('Optional filters to narrow search results'),
    top: zod_1.z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(100)
        .describe('Number of results to return (default: 100, max: 1000)'),
    skip: zod_1.z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe('Number of results to skip for pagination (default: 0)'),
    includeFacets: zod_1.z
        .boolean()
        .default(true)
        .describe('Whether to include faceting in results (default: true)'),
    orderBy: zod_1.z
        .array(zod_1.z.object({
        field: zod_1.z.string().describe('Field to sort by'),
        sortOrder: zod_1.z.enum(['ASC', 'DESC']).describe('Sort order (ASC/DESC)'),
    }))
        .optional()
        .describe('Options for sorting search results'),
});
//# sourceMappingURL=schemas.js.map