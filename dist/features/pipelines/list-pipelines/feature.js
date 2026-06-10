"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPipelines = listPipelines;
const errors_1 = require("../../../shared/errors");
/**
 * List pipelines in a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for listing pipelines
 * @returns List of pipelines
 */
async function listPipelines(connection, options) {
    try {
        const pipelinesApi = await connection.getPipelinesApi();
        const { projectId, orderBy, top, continuationToken } = options;
        // Call the pipelines API to get the list of pipelines
        const pipelines = await pipelinesApi.listPipelines(projectId, orderBy, top, continuationToken);
        return pipelines;
    }
    catch (error) {
        // Handle specific error types
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        // Check for specific error types and convert to appropriate Azure DevOps errors
        if (error instanceof Error) {
            if (error.message.includes('Authentication') ||
                error.message.includes('Unauthorized') ||
                error.message.includes('401')) {
                throw new errors_1.AzureDevOpsAuthenticationError(`Failed to authenticate: ${error.message}`);
            }
            if (error.message.includes('not found') ||
                error.message.includes('does not exist') ||
                error.message.includes('404')) {
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Project or resource not found: ${error.message}`);
            }
        }
        // Otherwise, wrap it in a generic error
        throw new errors_1.AzureDevOpsError(`Failed to list pipelines: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map