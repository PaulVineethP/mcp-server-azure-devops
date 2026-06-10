"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAzureDevOpsServer = createAzureDevOpsServer;
exports.getConnection = getConnection;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const config_1 = require("./shared/config");
const errors_1 = require("./shared/errors");
const handle_request_error_1 = require("./shared/errors/handle-request-error");
const auth_1 = require("./shared/auth");
// Import environment defaults when needed in feature handlers
// Import feature modules with request handlers and tool definitions
const work_items_1 = require("./features/work-items");
const projects_1 = require("./features/projects");
const repositories_1 = require("./features/repositories");
const organizations_1 = require("./features/organizations");
const search_1 = require("./features/search");
const users_1 = require("./features/users");
const pull_requests_1 = require("./features/pull-requests");
const pipelines_1 = require("./features/pipelines");
const wikis_1 = require("./features/wikis");
// Create a safe console logging function that won't interfere with MCP protocol
function safeLog(message) {
    process.stderr.write(`${message}\n`);
}
/**
 * Create an Azure DevOps MCP Server
 *
 * @param config The Azure DevOps configuration
 * @returns A configured MCP server instance
 */
function createAzureDevOpsServer(config) {
    // Validate the configuration
    validateConfig(config);
    // Initialize the MCP server
    const server = new index_js_1.Server({
        name: 'azure-devops-mcp',
        version: config_1.VERSION,
    }, {
        capabilities: {
            tools: {},
            resources: {},
        },
    });
    // Register the ListTools request handler
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => {
        // Combine tools from all features
        const tools = [
            ...users_1.usersTools,
            ...organizations_1.organizationsTools,
            ...projects_1.projectsTools,
            ...repositories_1.repositoriesTools,
            ...work_items_1.workItemsTools,
            ...search_1.searchTools,
            ...pull_requests_1.pullRequestsTools,
            ...pipelines_1.pipelinesTools,
            ...wikis_1.wikisTools,
        ];
        return { tools };
    });
    // Register the resource handlers
    // ListResources - register available resource templates
    server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
        // Create resource templates for repository content
        const templates = [
            // Default branch content
            {
                uriTemplate: 'ado://{organization}/{project}/{repo}/contents{/path*}',
                name: 'Repository Content',
                description: 'Content from the default branch of a repository',
            },
            // Branch specific content
            {
                uriTemplate: 'ado://{organization}/{project}/{repo}/branches/{branch}/contents{/path*}',
                name: 'Branch Content',
                description: 'Content from a specific branch of a repository',
            },
            // Commit specific content
            {
                uriTemplate: 'ado://{organization}/{project}/{repo}/commits/{commit}/contents{/path*}',
                name: 'Commit Content',
                description: 'Content from a specific commit in a repository',
            },
            // Tag specific content
            {
                uriTemplate: 'ado://{organization}/{project}/{repo}/tags/{tag}/contents{/path*}',
                name: 'Tag Content',
                description: 'Content from a specific tag in a repository',
            },
            // Pull request specific content
            {
                uriTemplate: 'ado://{organization}/{project}/{repo}/pullrequests/{prId}/contents{/path*}',
                name: 'Pull Request Content',
                description: 'Content from a specific pull request in a repository',
            },
        ];
        return {
            resources: [],
            templates,
        };
    });
    // ReadResource - handle reading content from the templates
    server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
        try {
            const uri = new URL(request.params.uri);
            // Parse the URI to extract components
            const segments = uri.pathname.split('/').filter(Boolean);
            // Check if it's an Azure DevOps resource URI
            if (uri.protocol !== 'ado:') {
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Unsupported protocol: ${uri.protocol}`);
            }
            // Extract organization, project, and repo
            // const organization = segments[0]; // Currently unused but kept for future use
            const project = segments[1];
            const repo = segments[2];
            // Get a connection to Azure DevOps
            const connection = await getConnection(config);
            // Default path is root if not specified
            let path = '/';
            // Extract path from the remaining segments, if there are at least 5 segments (org/project/repo/contents/path)
            if (segments.length >= 5 && segments[3] === 'contents') {
                path = '/' + segments.slice(4).join('/');
            }
            // Determine version control parameters based on URI pattern
            let versionType;
            let version;
            if (segments[3] === 'branches' && segments.length >= 5) {
                versionType = GitInterfaces_1.GitVersionType.Branch;
                version = segments[4];
                // Extract path if present
                if (segments.length >= 7 && segments[5] === 'contents') {
                    path = '/' + segments.slice(6).join('/');
                }
            }
            else if (segments[3] === 'commits' && segments.length >= 5) {
                versionType = GitInterfaces_1.GitVersionType.Commit;
                version = segments[4];
                // Extract path if present
                if (segments.length >= 7 && segments[5] === 'contents') {
                    path = '/' + segments.slice(6).join('/');
                }
            }
            else if (segments[3] === 'tags' && segments.length >= 5) {
                versionType = GitInterfaces_1.GitVersionType.Tag;
                version = segments[4];
                // Extract path if present
                if (segments.length >= 7 && segments[5] === 'contents') {
                    path = '/' + segments.slice(6).join('/');
                }
            }
            else if (segments[3] === 'pullrequests' && segments.length >= 5) {
                // TODO: For PR head, we need to get the source branch or commit
                // Currently just use the default branch as a fallback
                // versionType = GitVersionType.Branch;
                // version = 'PR-' + segments[4];
                // Extract path if present
                if (segments.length >= 7 && segments[5] === 'contents') {
                    path = '/' + segments.slice(6).join('/');
                }
            }
            // Get the content
            const versionDescriptor = versionType && version ? { versionType, version } : undefined;
            // Import the getFileContent function from repositories feature
            const { getFileContent } = await import('./features/repositories/get-file-content/index.js');
            const fileContent = await getFileContent(connection, project, repo, path, versionDescriptor);
            // Return the content based on whether it's a file or directory
            return {
                contents: [
                    {
                        uri: request.params.uri,
                        mimeType: fileContent.isDirectory
                            ? 'application/json'
                            : getMimeType(path),
                        text: fileContent.content,
                    },
                ],
            };
        }
        catch (error) {
            safeLog(`Error reading resource: ${error}`);
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Failed to read resource: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    // Register the CallTool request handler
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        try {
            // Note: We don't need to validate the presence of arguments here because:
            // 1. The schema validations (via zod.parse) will check for required parameters
            // 2. Default values from environment.ts are applied for optional parameters (projectId, organizationId)
            // 3. Arguments can be omitted entirely for tools with no required parameters
            // Get a connection to Azure DevOps
            const connection = await getConnection(config);
            // Route the request to the appropriate feature handler
            if ((0, work_items_1.isWorkItemsRequest)(request)) {
                return await (0, work_items_1.handleWorkItemsRequest)(connection, request);
            }
            if ((0, projects_1.isProjectsRequest)(request)) {
                return await (0, projects_1.handleProjectsRequest)(connection, request);
            }
            if ((0, repositories_1.isRepositoriesRequest)(request)) {
                return await (0, repositories_1.handleRepositoriesRequest)(connection, request);
            }
            if ((0, organizations_1.isOrganizationsRequest)(request)) {
                // Organizations feature doesn't need the config object anymore
                return await (0, organizations_1.handleOrganizationsRequest)(connection, request);
            }
            if ((0, search_1.isSearchRequest)(request)) {
                return await (0, search_1.handleSearchRequest)(connection, request);
            }
            if ((0, users_1.isUsersRequest)(request)) {
                return await (0, users_1.handleUsersRequest)(connection, request);
            }
            if ((0, pull_requests_1.isPullRequestsRequest)(request)) {
                return await (0, pull_requests_1.handlePullRequestsRequest)(connection, request);
            }
            if ((0, pipelines_1.isPipelinesRequest)(request)) {
                return await (0, pipelines_1.handlePipelinesRequest)(connection, request);
            }
            if ((0, wikis_1.isWikisRequest)(request)) {
                return await (0, wikis_1.handleWikisRequest)(connection, request);
            }
            // If we get here, the tool is not recognized by any feature handler
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
        catch (error) {
            return (0, handle_request_error_1.handleResponseError)(error);
        }
    });
    return server;
}
/**
 * Get a mime type based on file extension
 *
 * @param path File path
 * @returns Mime type string
 */
function getMimeType(path) {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'txt':
            return 'text/plain';
        case 'html':
        case 'htm':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        case 'json':
            return 'application/json';
        case 'xml':
            return 'application/xml';
        case 'md':
            return 'text/markdown';
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        case 'svg':
            return 'image/svg+xml';
        case 'pdf':
            return 'application/pdf';
        case 'ts':
        case 'tsx':
            return 'application/typescript';
        case 'py':
            return 'text/x-python';
        case 'cs':
            return 'text/x-csharp';
        case 'java':
            return 'text/x-java';
        case 'c':
            return 'text/x-c';
        case 'cpp':
        case 'cc':
            return 'text/x-c++';
        case 'go':
            return 'text/x-go';
        case 'rs':
            return 'text/x-rust';
        case 'rb':
            return 'text/x-ruby';
        case 'sh':
            return 'text/x-sh';
        case 'yaml':
        case 'yml':
            return 'text/yaml';
        default:
            return 'text/plain';
    }
}
/**
 * Validate the Azure DevOps configuration
 *
 * @param config The configuration to validate
 * @throws {AzureDevOpsValidationError} If the configuration is invalid
 */
function validateConfig(config) {
    if (!config.organizationUrl) {
        process.stderr.write('ERROR: Organization URL is required but was not provided.\n');
        process.stderr.write(`Config: ${JSON.stringify({
            organizationUrl: config.organizationUrl,
            authMethod: config.authMethod,
            defaultProject: config.defaultProject,
            // Hide PAT for security
            personalAccessToken: config.personalAccessToken
                ? 'REDACTED'
                : undefined,
            apiVersion: config.apiVersion,
        }, null, 2)}\n`);
        throw new errors_1.AzureDevOpsValidationError('Organization URL is required');
    }
    // Set default authentication method if not specified
    if (!config.authMethod) {
        config.authMethod = auth_1.AuthenticationMethod.AzureIdentity;
    }
    // Validate PAT if using PAT authentication
    if (config.authMethod === auth_1.AuthenticationMethod.PersonalAccessToken &&
        !config.personalAccessToken) {
        throw new errors_1.AzureDevOpsValidationError('Personal access token is required when using PAT authentication');
    }
}
/**
 * Create a connection to Azure DevOps
 *
 * @param config The configuration to use
 * @returns A WebApi connection
 */
async function getConnection(config) {
    try {
        // Create a client with the appropriate authentication method
        const client = new auth_1.AzureDevOpsClient({
            method: config.authMethod || auth_1.AuthenticationMethod.AzureIdentity,
            organizationUrl: config.organizationUrl,
            personalAccessToken: config.personalAccessToken,
        });
        // Test the connection by getting the Core API
        await client.getCoreApi();
        // Return the underlying WebApi client
        return await client.getWebApiClient();
    }
    catch (error) {
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to connect to Azure DevOps: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=server.js.map