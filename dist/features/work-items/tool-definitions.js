"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workItemsTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of work items tools
 */
exports.workItemsTools = [
    {
        name: 'list_work_items',
        description: 'List work items in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListWorkItemsSchema),
    },
    {
        name: 'get_work_item',
        description: 'Get details of a specific work item',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetWorkItemSchema),
    },
    {
        name: 'create_work_item',
        description: 'Create a new work item',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.CreateWorkItemSchema),
    },
    {
        name: 'update_work_item',
        description: 'Update an existing work item',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.UpdateWorkItemSchema),
    },
    {
        name: 'manage_work_item_link',
        description: 'Add or remove links between work items',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ManageWorkItemLinkSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map