"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationsTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of organizations tools
 */
exports.organizationsTools = [
    {
        name: 'list_organizations',
        description: 'List all Azure DevOps organizations accessible to the current authentication',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListOrganizationsSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map