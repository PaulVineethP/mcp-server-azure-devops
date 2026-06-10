"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestConnection = getTestConnection;
exports.shouldSkipIntegrationTest = shouldSkipIntegrationTest;
const azure_devops_node_api_1 = require("azure-devops-node-api");
const azure_devops_node_api_2 = require("azure-devops-node-api");
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