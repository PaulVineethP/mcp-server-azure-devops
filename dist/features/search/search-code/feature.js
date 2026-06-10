"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCode = searchCode;
const axios_1 = __importDefault(require("axios"));
const identity_1 = require("@azure/identity");
const errors_1 = require("../../../shared/errors");
const azure_devops_url_1 = require("../../../shared/azure-devops-url");
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
/**
 * Search for code in Azure DevOps repositories
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for searching code
 * @returns Search results with optional file content
 */
async function searchCode(connection, options) {
    try {
        // When includeContent is true, limit results to prevent timeouts
        const top = options.includeContent
            ? Math.min(options.top || 10, 10)
            : options.top;
        // Get the project ID (either provided or default)
        const projectId = options.projectId || process.env.AZURE_DEVOPS_DEFAULT_PROJECT;
        if (!projectId) {
            throw new errors_1.AzureDevOpsValidationError('Project ID is required. Either provide a projectId or set the AZURE_DEVOPS_DEFAULT_PROJECT environment variable.');
        }
        // Prepare the search request
        const searchRequest = {
            searchText: options.searchText,
            $skip: options.skip,
            $top: top, // Use limited top value when includeContent is true
            filters: {
                Project: [projectId],
                ...(options.filters || {}),
            },
            includeFacets: true,
            includeSnippet: options.includeSnippet,
        };
        // Get the authorization header from the connection
        const authHeader = await getAuthorizationHeader();
        const baseUrls = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)(connection.serverUrl, {
            organizationId: options.organizationId,
            projectId,
        });
        // Make the search API request with the project ID
        const searchUrl = `${baseUrls.searchBaseUrl}/${projectId}/_apis/search/codesearchresults?api-version=7.1`;
        const searchResponse = await axios_1.default.post(searchUrl, searchRequest, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });
        const results = searchResponse.data;
        // If includeContent is true, fetch the content for each result
        if (options.includeContent && results.results.length > 0) {
            await enrichResultsWithContent(connection, results.results);
        }
        return results;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 404) {
                throw new errors_1.AzureDevOpsResourceNotFoundError('Repository or project not found', { cause: error });
            }
            if (status === 400) {
                throw new errors_1.AzureDevOpsValidationError('Invalid search parameters', error.response?.data, { cause: error });
            }
            if (status === 401) {
                throw new errors_1.AzureDevOpsAuthenticationError('Authentication failed', {
                    cause: error,
                });
            }
            if (status === 403) {
                throw new errors_1.AzureDevOpsPermissionError('Permission denied to access repository', { cause: error });
            }
        }
        throw new errors_1.AzureDevOpsError('Failed to search code', { cause: error });
    }
}
/**
 * Get the authorization header from the connection
 *
 * @returns The authorization header
 */
async function getAuthorizationHeader() {
    try {
        // For PAT authentication, we can construct the header directly
        if (process.env.AZURE_DEVOPS_AUTH_METHOD?.toLowerCase() === 'pat' &&
            process.env.AZURE_DEVOPS_PAT) {
            // For PAT auth, we can construct the Basic auth header directly
            const token = process.env.AZURE_DEVOPS_PAT;
            const base64Token = Buffer.from(`:${token}`).toString('base64');
            return `Basic ${base64Token}`;
        }
        // For Azure Identity / Azure CLI auth, we need to get a token
        // using the Azure DevOps resource ID
        // Choose the appropriate credential based on auth method
        const credential = process.env.AZURE_DEVOPS_AUTH_METHOD?.toLowerCase() === 'azure-cli'
            ? new identity_1.AzureCliCredential()
            : new identity_1.DefaultAzureCredential();
        // Azure DevOps resource ID for token acquisition
        const AZURE_DEVOPS_RESOURCE_ID = '499b84ac-1321-427f-aa17-267ca6975798';
        // Get token for Azure DevOps
        const token = await credential.getToken(`${AZURE_DEVOPS_RESOURCE_ID}/.default`);
        if (!token || !token.token) {
            throw new Error('Failed to acquire token for Azure DevOps');
        }
        return `Bearer ${token.token}`;
    }
    catch (error) {
        throw new errors_1.AzureDevOpsValidationError(`Failed to get authorization header: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Enrich search results with file content
 *
 * @param connection The Azure DevOps WebApi connection
 * @param results The search results to enrich
 */
async function enrichResultsWithContent(connection, results) {
    try {
        const gitApi = await connection.getGitApi();
        // Process each result in parallel
        await Promise.all(results.map(async (result) => {
            try {
                // Get the file content using the Git API
                // Pass only the required parameters to avoid the "path" and "scopePath" conflict
                const contentStream = await gitApi.getItemContent(result.repository.id, result.path, result.project.name, undefined, // No version descriptor object
                undefined, // No recursion level
                undefined, // Don't include content metadata
                undefined, // No latest processed change
                false, // Don't download
                {
                    version: result.versions[0]?.changeId,
                    versionType: GitInterfaces_1.GitVersionType.Commit,
                }, // Version descriptor
                true);
                // Convert the stream to a string and store it in the result
                if (contentStream) {
                    // Since getItemContent always returns NodeJS.ReadableStream, we need to read the stream
                    const chunks = [];
                    // Listen for data events to collect chunks
                    contentStream.on('data', (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });
                    // Use a promise to wait for the stream to finish
                    result.content = await new Promise((resolve, reject) => {
                        contentStream.on('end', () => {
                            // Concatenate all chunks and convert to string
                            const buffer = Buffer.concat(chunks);
                            resolve(buffer.toString('utf8'));
                        });
                        contentStream.on('error', (err) => {
                            reject(err);
                        });
                    });
                }
            }
            catch (error) {
                // Log the error but don't fail the entire operation
                console.error(`Failed to fetch content for ${result.path}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }));
    }
    catch (error) {
        // Log the error but don't fail the entire operation
        console.error(`Failed to enrich results with content: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map