"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of search tools
 */
exports.searchTools = [
    {
        name: 'search_code',
        description: 'Search for code across repositories in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.SearchCodeSchema),
    },
    {
        name: 'search_wiki',
        description: 'Search for content across wiki pages in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.SearchWikiSchema),
    },
    {
        name: 'search_work_items',
        description: 'Search for work items across projects in Azure DevOps',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.SearchWorkItemsSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map