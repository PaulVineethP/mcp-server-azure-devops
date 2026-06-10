"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
const axios_1 = __importDefault(require("axios"));
const identity_1 = require("@azure/identity");
const errors_1 = require("../../../shared/errors");
const azure_devops_url_1 = require("../../../shared/azure-devops-url");
/**
 * Get details of the currently authenticated user
 *
 * This function returns basic profile information about the authenticated user.
 *
 * @param connection The Azure DevOps WebApi connection
 * @returns User profile information including id, displayName, and email
 * @throws {AzureDevOpsError} If retrieval of user information fails
 */
async function getMe(connection) {
    try {
        if (!(0, azure_devops_url_1.isAzureDevOpsServicesUrl)(connection.serverUrl)) {
            throw new errors_1.AzureDevOpsValidationError('The get_me profile endpoint is only available for Azure DevOps Services');
        }
        const baseUrls = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)(connection.serverUrl);
        const organization = baseUrls.organization;
        if (!organization) {
            throw new errors_1.AzureDevOpsValidationError('Could not extract organization from Azure DevOps Services URL');
        }
        // Get the authorization header
        const authHeader = await getAuthorizationHeader();
        // Make direct call to the Profile API endpoint
        // Note: This API is in the vssps.dev.azure.com domain, not dev.azure.com
        const response = await axios_1.default.get(`https://vssps.dev.azure.com/${organization}/_apis/profile/profiles/me?api-version=7.1`, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });
        const profile = response.data;
        // Return the user profile with required fields
        return {
            id: profile.id,
            displayName: profile.displayName || '',
            email: profile.emailAddress || '',
        };
    }
    catch (error) {
        // Handle authentication errors
        if (axios_1.default.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)) {
            throw new errors_1.AzureDevOpsAuthenticationError(`Authentication failed: ${error.message}`);
        }
        // If it's already an AzureDevOpsError, rethrow it
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        // Otherwise, wrap it in a generic error
        throw new errors_1.AzureDevOpsError(`Failed to get user information: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Get the authorization header for API requests
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
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to get authorization header: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map