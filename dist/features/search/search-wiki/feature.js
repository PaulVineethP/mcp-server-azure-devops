"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWiki = searchWiki;
const axios_1 = __importDefault(require("axios"));
const identity_1 = require("@azure/identity");
const errors_1 = require("../../../shared/errors");
const azure_devops_url_1 = require("../../../shared/azure-devops-url");
/**
 * Search for wiki pages in Azure DevOps projects
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for searching wiki pages
 * @returns Search results for wiki pages
 */
async function searchWiki(connection, options) {
    try {
        // Prepare the search request
        const searchRequest = {
            searchText: options.searchText,
            $skip: options.skip,
            $top: options.top,
            filters: options.projectId
                ? {
                    Project: [options.projectId],
                }
                : {},
            includeFacets: options.includeFacets,
        };
        // Add custom filters if provided
        if (options.filters &&
            options.filters.Project &&
            options.filters.Project.length > 0) {
            if (!searchRequest.filters) {
                searchRequest.filters = {};
            }
            if (!searchRequest.filters.Project) {
                searchRequest.filters.Project = [];
            }
            searchRequest.filters.Project = [
                ...(searchRequest.filters.Project || []),
                ...options.filters.Project,
            ];
        }
        // Get the authorization header from the connection
        const authHeader = await getAuthorizationHeader();
        const baseUrls = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)(connection.serverUrl, {
            organizationId: options.organizationId,
            projectId: options.projectId,
        });
        if (baseUrls.type === 'server' && !options.projectId) {
            throw new errors_1.AzureDevOpsValidationError('Project ID is required for Azure DevOps Server wiki search');
        }
        // Make the search API request
        // If projectId is provided, include it in the URL, otherwise perform organization-wide search
        const searchUrl = options.projectId
            ? `${baseUrls.searchBaseUrl}/${options.projectId}/_apis/search/wikisearchresults?api-version=7.1`
            : `${baseUrls.searchBaseUrl}/_apis/search/wikisearchresults?api-version=7.1`;
        const searchResponse = await axios_1.default.post(searchUrl, searchRequest, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });
        return searchResponse.data;
    }
    catch (error) {
        // If it's already an AzureDevOpsError, rethrow it
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        // Handle axios errors
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            if (status === 404) {
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Resource not found: ${message}`);
            }
            else if (status === 400) {
                throw new errors_1.AzureDevOpsValidationError(`Invalid request: ${message}`, error.response?.data);
            }
            else if (status === 401 || status === 403) {
                throw new errors_1.AzureDevOpsPermissionError(`Permission denied: ${message}`);
            }
            else {
                // For other axios errors, wrap in a generic AzureDevOpsError
                throw new errors_1.AzureDevOpsError(`Azure DevOps API error: ${message}`);
            }
            // This return is never reached but helps TypeScript understand the control flow
            return null;
        }
        // Otherwise, wrap it in a generic error
        throw new errors_1.AzureDevOpsError(`Failed to search wiki: ${error instanceof Error ? error.message : String(error)}`);
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
//# sourceMappingURL=feature.js.map