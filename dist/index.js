#!/usr/bin/env node
"use strict";
/**
 * Entry point for the Azure DevOps MCP Server
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAuthMethod = normalizeAuthMethod;
const server_1 = require("./server");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const http_server_1 = require("./shared/http/http-server");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_factory_1 = require("./shared/auth/auth-factory");
/**
 * Normalize auth method string to a valid AuthenticationMethod enum value
 * in a case-insensitive manner
 *
 * @param authMethodStr The auth method string from environment variable
 * @returns A valid AuthenticationMethod value
 */
function normalizeAuthMethod(authMethodStr) {
    if (!authMethodStr) {
        return auth_factory_1.AuthenticationMethod.AzureIdentity; // Default
    }
    // Convert to lowercase for case-insensitive comparison
    const normalizedMethod = authMethodStr.toLowerCase();
    // Check against known enum values (as lowercase strings)
    if (normalizedMethod === auth_factory_1.AuthenticationMethod.PersonalAccessToken.toLowerCase()) {
        return auth_factory_1.AuthenticationMethod.PersonalAccessToken;
    }
    else if (normalizedMethod === auth_factory_1.AuthenticationMethod.AzureIdentity.toLowerCase()) {
        return auth_factory_1.AuthenticationMethod.AzureIdentity;
    }
    else if (normalizedMethod === auth_factory_1.AuthenticationMethod.AzureCli.toLowerCase()) {
        return auth_factory_1.AuthenticationMethod.AzureCli;
    }
    // If not recognized, log a warning and use the default
    process.stderr.write(`WARNING: Unrecognized auth method '${authMethodStr}'. Using default (${auth_factory_1.AuthenticationMethod.AzureIdentity}).\n`);
    return auth_factory_1.AuthenticationMethod.AzureIdentity;
}
// Load environment variables
dotenv_1.default.config();
function getConfig() {
    // Debug log the environment variables to help diagnose issues
    process.stderr.write(`DEBUG - Environment variables in getConfig():
  AZURE_DEVOPS_ORG_URL: ${process.env.AZURE_DEVOPS_ORG_URL || 'NOT SET'}
  AZURE_DEVOPS_AUTH_METHOD: ${process.env.AZURE_DEVOPS_AUTH_METHOD || 'NOT SET'}
  AZURE_DEVOPS_PAT: ${process.env.AZURE_DEVOPS_PAT ? 'SET (hidden)' : 'NOT SET'}
  AZURE_DEVOPS_DEFAULT_PROJECT: ${process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'NOT SET'}
  AZURE_DEVOPS_API_VERSION: ${process.env.AZURE_DEVOPS_API_VERSION || 'NOT SET'}
  NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}
\n`);
    return {
        organizationUrl: process.env.AZURE_DEVOPS_ORG_URL || '',
        authMethod: normalizeAuthMethod(process.env.AZURE_DEVOPS_AUTH_METHOD),
        personalAccessToken: process.env.AZURE_DEVOPS_PAT,
        defaultProject: process.env.AZURE_DEVOPS_DEFAULT_PROJECT,
        apiVersion: process.env.AZURE_DEVOPS_API_VERSION,
    };
}
async function main() {
    try {
        const config = getConfig();
        // HTTP is the default/priority transport. Set MCP_TRANSPORT=stdio to use
        // the classic stdio transport instead. (Legacy SSE is served within HTTP
        // mode at GET /sse.)
        const transportType = (process.env.MCP_TRANSPORT || 'http').toLowerCase();
        if (transportType === 'stdio') {
            // Classic stdio transport (one client per process).
            const server = (0, server_1.createAzureDevOpsServer)(config);
            const transport = new stdio_js_1.StdioServerTransport();
            await server.connect(transport);
            process.stderr.write('Azure DevOps MCP Server running on stdio\n');
        }
        else {
            // Default: HTTP transport (Streamable HTTP + legacy SSE).
            const host = process.env.MCP_HTTP_HOST || '127.0.0.1';
            const port = parseInt(process.env.MCP_HTTP_PORT || '3000', 10);
            const allowedHosts = (process.env.MCP_HTTP_ALLOWED_HOSTS || '')
                .split(',')
                .map((h) => h.trim())
                .filter(Boolean);
            await (0, http_server_1.startHttpServer)({
                host,
                port,
                allowedHosts,
                createServer: () => (0, server_1.createAzureDevOpsServer)(config),
            });
        }
    }
    catch (error) {
        process.stderr.write(`Error starting server: ${error}\n`);
        process.exit(1);
    }
}
// Start the server when this script is run directly
if (require.main === module) {
    main().catch((error) => {
        process.stderr.write(`Fatal error in main(): ${error}\n`);
        process.exit(1);
    });
}
// Export the server and related components
__exportStar(require("./server"), exports);
//# sourceMappingURL=index.js.map