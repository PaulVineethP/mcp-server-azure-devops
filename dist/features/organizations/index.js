"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrganizationsRequest = exports.isOrganizationsRequest = void 0;
// Re-export schemas and types
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
// Re-export features
__exportStar(require("./list-organizations"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const list_organizations_1 = require("./list-organizations");
const auth_1 = require("../../shared/auth");
/**
 * Checks if the request is for the organizations feature
 */
const isOrganizationsRequest = (request) => {
    const toolName = request.params.name;
    return ['list_organizations'].includes(toolName);
};
exports.isOrganizationsRequest = isOrganizationsRequest;
/**
 * Handles organizations feature requests
 */
const handleOrganizationsRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'list_organizations': {
            // Use environment variables for authentication method and PAT
            // This matches how other features handle authentication
            const config = {
                authMethod: process.env.AZURE_DEVOPS_AUTH_METHOD?.toLowerCase() === 'pat'
                    ? auth_1.AuthenticationMethod.PersonalAccessToken
                    : process.env.AZURE_DEVOPS_AUTH_METHOD?.toLowerCase() ===
                        'azure-cli'
                        ? auth_1.AuthenticationMethod.AzureCli
                        : auth_1.AuthenticationMethod.AzureIdentity,
                personalAccessToken: process.env.AZURE_DEVOPS_PAT,
                organizationUrl: connection.serverUrl || '',
            };
            const result = await (0, list_organizations_1.listOrganizations)(config);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown organizations tool: ${request.params.name}`);
    }
};
exports.handleOrganizationsRequest = handleOrganizationsRequest;
//# sourceMappingURL=index.js.map