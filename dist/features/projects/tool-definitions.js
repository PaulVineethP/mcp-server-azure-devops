"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of projects tools
 */
exports.projectsTools = [
    {
        name: 'list_projects',
        description: 'List all projects in an organization',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListProjectsSchema),
    },
    {
        name: 'get_project',
        description: 'Get details of a specific project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetProjectSchema),
    },
    {
        name: 'get_project_details',
        description: 'Get comprehensive details of a project including process, work item types, and teams',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetProjectDetailsSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map