"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMethod = void 0;
exports.createAuthClient = createAuthClient;
const azure_devops_node_api_1 = require("azure-devops-node-api");
const bearertoken_1 = require("azure-devops-node-api/handlers/bearertoken");
const identity_1 = require("@azure/identity");
const errors_1 = require("../errors");
const azure_devops_url_1 = require("../azure-devops-url");
/**
 * Authentication methods supported by the Azure DevOps client
 */
var AuthenticationMethod;
(function (AuthenticationMethod) {
    /**
     * Personal Access Token authentication
     */
    AuthenticationMethod["PersonalAccessToken"] = "pat";
    /**
     * Azure Identity authentication (DefaultAzureCredential)
     */
    AuthenticationMethod["AzureIdentity"] = "azure-identity";
    /**
     * Azure CLI authentication (AzureCliCredential)
     */
    AuthenticationMethod["AzureCli"] = "azure-cli";
})(AuthenticationMethod || (exports.AuthenticationMethod = AuthenticationMethod = {}));
/**
 * Azure DevOps resource ID for token acquisition
 */
const AZURE_DEVOPS_RESOURCE_ID = '499b84ac-1321-427f-aa17-267ca6975798';
/**
 * Creates an authenticated client for Azure DevOps API based on the specified authentication method
 *
 * @param config Authentication configuration
 * @returns Authenticated WebApi client
 * @throws {AzureDevOpsAuthenticationError} If authentication fails
 */
async function createAuthClient(config) {
    if (!config.organizationUrl) {
        throw new errors_1.AzureDevOpsAuthenticationError('Organization URL is required');
    }
    if (!(0, azure_devops_url_1.isAzureDevOpsServicesUrl)(config.organizationUrl) &&
        config.method !== AuthenticationMethod.PersonalAccessToken) {
        throw new errors_1.AzureDevOpsAuthenticationError('Azure DevOps Server requires Personal Access Token authentication');
    }
    try {
        let client;
        switch (config.method) {
            case AuthenticationMethod.PersonalAccessToken:
                client = await createPatClient(config);
                break;
            case AuthenticationMethod.AzureIdentity:
                client = await createAzureIdentityClient(config);
                break;
            case AuthenticationMethod.AzureCli:
                client = await createAzureCliClient(config);
                break;
            default:
                throw new errors_1.AzureDevOpsAuthenticationError(`Unsupported authentication method: ${config.method}`);
        }
        // Test the connection
        const locationsApi = await client.getLocationsApi();
        await locationsApi.getResourceAreas();
        return client;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsAuthenticationError) {
            throw error;
        }
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to authenticate with Azure DevOps: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Creates a client using Personal Access Token authentication
 *
 * @param config Authentication configuration
 * @returns Authenticated WebApi client
 * @throws {AzureDevOpsAuthenticationError} If PAT is missing or authentication fails
 */
async function createPatClient(config) {
    if (!config.personalAccessToken) {
        throw new errors_1.AzureDevOpsAuthenticationError('Personal Access Token is required');
    }
    // Create authentication handler using PAT
    const authHandler = (0, azure_devops_node_api_1.getPersonalAccessTokenHandler)(config.personalAccessToken);
    // Create API client with the auth handler
    return new azure_devops_node_api_1.WebApi(config.organizationUrl, authHandler);
}
/**
 * Creates a client using DefaultAzureCredential authentication
 *
 * @param config Authentication configuration
 * @returns Authenticated WebApi client
 * @throws {AzureDevOpsAuthenticationError} If token acquisition fails
 */
async function createAzureIdentityClient(config) {
    try {
        // Create DefaultAzureCredential
        const credential = new identity_1.DefaultAzureCredential();
        // Get token for Azure DevOps
        const token = await credential.getToken(`${AZURE_DEVOPS_RESOURCE_ID}/.default`);
        if (!token || !token.token) {
            throw new Error('Failed to acquire token');
        }
        // Create bearer token handler
        const authHandler = new bearertoken_1.BearerCredentialHandler(token.token);
        // Create API client with the auth handler
        return new azure_devops_node_api_1.WebApi(config.organizationUrl, authHandler);
    }
    catch (error) {
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to acquire Azure Identity token: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Creates a client using AzureCliCredential authentication
 *
 * @param config Authentication configuration
 * @returns Authenticated WebApi client
 * @throws {AzureDevOpsAuthenticationError} If token acquisition fails
 */
async function createAzureCliClient(config) {
    try {
        // Create AzureCliCredential
        const credential = new identity_1.AzureCliCredential();
        // Get token for Azure DevOps
        const token = await credential.getToken(`${AZURE_DEVOPS_RESOURCE_ID}/.default`);
        if (!token || !token.token) {
            throw new Error('Failed to acquire token');
        }
        // Create bearer token handler
        const authHandler = new bearertoken_1.BearerCredentialHandler(token.token);
        // Create API client with the auth handler
        return new azure_devops_node_api_1.WebApi(config.organizationUrl, authHandler);
    }
    catch (error) {
        throw new errors_1.AzureDevOpsAuthenticationError(`Failed to acquire Azure CLI token: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=auth-factory.js.map