"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrganizations = listOrganizations;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../../../shared/errors");
const identity_1 = require("@azure/identity");
const auth_1 = require("../../../shared/auth");
const types_1 = require("../types");
const azure_devops_url_1 = require("../../../shared/azure-devops-url");
/**
 * Lists all Azure DevOps organizations accessible to the authenticated user
 *
 * Note: This function uses Axios directly rather than the Azure DevOps Node API
 * because the WebApi client doesn't support the organizations endpoint.
 *
 * @param config The Azure DevOps configuration
 * @returns Array of organizations
 * @throws {AzureDevOpsAuthenticationError} If authentication fails
 */
async function listOrganizations(config) {
    try {
        if (!(0, azure_devops_url_1.isAzureDevOpsServicesUrl)(config.organizationUrl)) {
            throw new errors_1.AzureDevOpsValidationError('The list_organizations endpoint is only available for Azure DevOps Services');
        }
        // Determine auth method and create appropriate authorization header
        let authHeader;
        if (config.authMethod === auth_1.AuthenticationMethod.PersonalAccessToken) {
            // PAT authentication
            if (!config.personalAccessToken) {
                throw new errors_1.AzureDevOpsAuthenticationError('Personal Access Token (PAT) is required when using PAT authentication');
            }
            authHeader = createBasicAuthHeader(config.personalAccessToken);
        }
        else {
            // Azure Identity authentication (DefaultAzureCredential or AzureCliCredential)
            const credential = config.authMethod === auth_1.AuthenticationMethod.AzureCli
                ? new identity_1.AzureCliCredential()
                : new identity_1.DefaultAzureCredential();
            const token = await credential.getToken(`${types_1.AZURE_DEVOPS_RESOURCE_ID}/.default`);
            if (!token || !token.token) {
                throw new errors_1.AzureDevOpsAuthenticationError('Failed to acquire Azure Identity token');
            }
            authHeader = `Bearer ${token.token}`;
        }
        // Step 1: Get the user profile to get the publicAlias
        const profileResponse = await axios_1.default.get('https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0', {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });
        // Extract the publicAlias
        const publicAlias = profileResponse.data.publicAlias;
        if (!publicAlias) {
            throw new errors_1.AzureDevOpsAuthenticationError('Unable to get user publicAlias from profile');
        }
        // Step 2: Get organizations using the publicAlias
        const orgsResponse = await axios_1.default.get(`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${publicAlias}&api-version=6.0`, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });
        // Transform the response
        return orgsResponse.data.value.map((org) => ({
            id: org.accountId,
            name: org.accountName,
            url: org.accountUri,
        }));
    }
    catch (error) {
        // Handle profile API errors as authentication errors
        if (axios_1.default.isAxiosError(error) && error.config?.url?.includes('profile')) {
            throw new errors_1.AzureDevOpsAuthenticationError(`Authentication failed: ${error.toJSON()}`);
        }
        else if (error instanceof Error &&
            (error.message.includes('profile') ||
                error.message.includes('Unauthorized') ||
                error.message.includes('Authentication'))) {
            throw new errors_1.AzureDevOpsAuthenticationError(`Authentication failed: ${error.message}`);
        }
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to list organizations: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Creates a Basic Auth header for the Azure DevOps API
 *
 * @param pat Personal Access Token
 * @returns Basic Auth header value
 */
function createBasicAuthHeader(pat) {
    const token = Buffer.from(`:${pat}`).toString('base64');
    return `Basic ${token}`;
}
//# sourceMappingURL=feature.js.map