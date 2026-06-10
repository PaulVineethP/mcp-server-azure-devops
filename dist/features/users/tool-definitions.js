"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of users tools
 */
exports.usersTools = [
    {
        name: 'get_me',
        description: 'Get details of the authenticated user (id, displayName, email)',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetMeSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map