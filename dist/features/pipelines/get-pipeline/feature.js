"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPipeline = getPipeline;
const errors_1 = require("../../../shared/errors");
/**
 * Get a specific pipeline by ID
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting a pipeline
 * @returns Pipeline details
 */
async function getPipeline(connection, options) {
    try {
        const pipelinesApi = await connection.getPipelinesApi();
        const { projectId, pipelineId, pipelineVersion } = options;
        // Call the pipelines API to get the pipeline
        const pipeline = await pipelinesApi.getPipeline(projectId, pipelineId, pipelineVersion);
        // If pipeline not found, API returns null instead of throwing error
        if (pipeline === null) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline not found with ID: ${pipelineId}`);
        }
        return pipeline;
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
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline or project not found: ${error.message}`);
            }
        }
        // Otherwise, wrap it in a generic error
        throw new errors_1.AzureDevOpsError(`Failed to get pipeline: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map