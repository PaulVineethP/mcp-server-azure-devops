"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageWorkItemLinkSchema = exports.UpdateWorkItemSchema = exports.CreateWorkItemSchema = exports.ListWorkItemsSchema = exports.GetWorkItemSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../utils/environment");
/**
 * Schema for getting a work item
 */
exports.GetWorkItemSchema = zod_1.z.object({
    workItemId: zod_1.z.number().describe('The ID of the work item'),
    expand: zod_1.z
        .enum(['none', 'relations', 'fields', 'links', 'all'])
        .optional()
        .describe('The level of detail to include in the response. Defaults to "all" if not specified.'),
});
/**
 * Schema for listing work items
 */
exports.ListWorkItemsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    teamId: zod_1.z.string().optional().describe('The ID of the team'),
    queryId: zod_1.z.string().optional().describe('ID of a saved work item query'),
    wiql: zod_1.z.string().optional().describe('Work Item Query Language (WIQL) query'),
    top: zod_1.z.number().optional().describe('Maximum number of work items to return'),
    skip: zod_1.z.number().optional().describe('Number of work items to skip'),
});
/**
 * Schema for creating a work item
 */
exports.CreateWorkItemSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    workItemType: zod_1.z
        .string()
        .describe('The type of work item to create (e.g., "Task", "Bug", "User Story")'),
    title: zod_1.z.string().describe('The title of the work item'),
    description: zod_1.z
        .string()
        .optional()
        .describe('Work item description in HTML format. Multi-line text fields (i.e., System.History, AcceptanceCriteria, etc.) must use HTML format. Do not use CDATA tags.'),
    assignedTo: zod_1.z
        .string()
        .optional()
        .describe('The email or name of the user to assign the work item to'),
    areaPath: zod_1.z.string().optional().describe('The area path for the work item'),
    iterationPath: zod_1.z
        .string()
        .optional()
        .describe('The iteration path for the work item'),
    priority: zod_1.z.number().optional().describe('The priority of the work item'),
    parentId: zod_1.z
        .number()
        .optional()
        .describe('The ID of the parent work item to create a relationship with'),
    additionalFields: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .optional()
        .describe('Additional fields to set on the work item. Multi-line text fields (i.e., System.History, AcceptanceCriteria, etc.) must use HTML format. Do not use CDATA tags.'),
});
/**
 * Schema for updating a work item
 */
exports.UpdateWorkItemSchema = zod_1.z.object({
    workItemId: zod_1.z.number().describe('The ID of the work item to update'),
    title: zod_1.z.string().optional().describe('The updated title of the work item'),
    description: zod_1.z
        .string()
        .optional()
        .describe('Work item description in HTML format. Multi-line text fields (i.e., System.History, AcceptanceCriteria, etc.) must use HTML format. Do not use CDATA tags.'),
    assignedTo: zod_1.z
        .string()
        .optional()
        .describe('The email or name of the user to assign the work item to'),
    areaPath: zod_1.z
        .string()
        .optional()
        .describe('The updated area path for the work item'),
    iterationPath: zod_1.z
        .string()
        .optional()
        .describe('The updated iteration path for the work item'),
    priority: zod_1.z
        .number()
        .optional()
        .describe('The updated priority of the work item'),
    state: zod_1.z.string().optional().describe('The updated state of the work item'),
    additionalFields: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .optional()
        .describe('Additional fields to update on the work item. Multi-line text fields (i.e., System.History, AcceptanceCriteria, etc.) must use HTML format. Do not use CDATA tags.'),
});
/**
 * Schema for managing work item links
 */
exports.ManageWorkItemLinkSchema = zod_1.z.object({
    sourceWorkItemId: zod_1.z.number().describe('The ID of the source work item'),
    targetWorkItemId: zod_1.z.number().describe('The ID of the target work item'),
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    operation: zod_1.z
        .enum(['add', 'remove', 'update'])
        .describe('The operation to perform on the link'),
    relationType: zod_1.z
        .string()
        .describe('The reference name of the relation type (e.g., "System.LinkTypes.Hierarchy-Forward")'),
    newRelationType: zod_1.z
        .string()
        .optional()
        .describe('The new relation type to use when updating a link'),
    comment: zod_1.z
        .string()
        .optional()
        .describe('Optional comment explaining the link'),
});
//# sourceMappingURL=schemas.js.map