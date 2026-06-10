"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestConnection = getTestConnection;
exports.getTestConfig = getTestConfig;
exports.shouldSkipIntegrationTest = shouldSkipIntegrationTest;
const azure_devops_node_api_1 = require("azure-devops-node-api");
const azure_devops_node_api_2 = require("azure-devops-node-api");
const auth_1 = require("../auth");
/**
 * Creates a WebApi connection for tests with real credentials
 *
 * @returns WebApi connection
 */
async function getTestConnection() {
    // If we have real credentials, use them
    const orgUrl = process.env.AZURE_DEVOPS_ORG_URL;
    const token = process.env.AZURE_DEVOPS_PAT;
    if (orgUrl && token) {
        const authHandler = (0, azure_devops_node_api_2.getPersonalAccessTokenHandler)(token);
        return new azure_devops_node_api_1.WebApi(orgUrl, authHandler);
    }
    // If we don't have credentials, return null
    return null;
}
/**
 * Creates test configuration for Azure DevOps tests
 *
 * @returns Azure DevOps config
 */
function getTestConfig() {
    // If we have real credentials, use them
    const orgUrl = process.env.AZURE_DEVOPS_ORG_URL;
    const pat = process.env.AZURE_DEVOPS_PAT;
    if (orgUrl && pat) {
        return {
            organizationUrl: orgUrl,
            authMethod: auth_1.AuthenticationMethod.PersonalAccessToken,
            personalAccessToken: pat,
            defaultProject: process.env.AZURE_DEVOPS_DEFAULT_PROJECT,
        };
    }
    // If we don't have credentials, return null
    return null;
}
/**
 * Determines if integration tests should be skipped
 *
 * @returns true if integration tests should be skipped
 */
function shouldSkipIntegrationTest() {
    if (!process.env.AZURE_DEVOPS_ORG_URL || !process.env.AZURE_DEVOPS_PAT) {
        console.log('Skipping integration test: No real Azure DevOps connection available');
        return true;
    }
    return false;
}
//# sourceMappingURL=test-helpers.js.map