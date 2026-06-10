"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWikis = getWikis;
const errors_1 = require("../../../shared/errors");
/**
 * Get wikis in a project or organization
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting wikis
 * @returns List of wikis
 */
async function getWikis(connection, options) {
    try {
        // Get the Wiki API client
        const wikiApi = await connection.getWikiApi();
        // If a projectId is provided, get wikis for that specific project
        // Otherwise, get wikis for the entire organization
        const { projectId } = options;
        const wikis = await wikiApi.getAllWikis(projectId);
        return wikis || [];
    }
    catch (error) {
        // Handle resource not found errors specifically
        if (error instanceof Error &&
            error.message &&
            error.message.includes('The resource cannot be found')) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Resource not found: ${options.projectId ? `Project '${options.projectId}'` : 'Organization'}`);
        }
        // If it's already an AzureDevOpsError, rethrow it
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        // Otherwise, wrap it in a generic error
        throw new errors_1.AzureDevOpsError(`Failed to get wikis: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map