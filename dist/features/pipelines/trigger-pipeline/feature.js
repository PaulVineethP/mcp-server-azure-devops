"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerPipeline = triggerPipeline;
const errors_1 = require("../../../shared/errors");
const environment_1 = require("../../../utils/environment");
/**
 * Trigger a pipeline run
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for triggering a pipeline
 * @returns The run details
 */
async function triggerPipeline(connection, options) {
    try {
        const pipelinesApi = await connection.getPipelinesApi();
        const { projectId = environment_1.defaultProject, pipelineId, branch, variables, templateParameters, stagesToSkip, } = options;
        // Prepare run parameters
        const runParameters = {};
        // Add variables
        if (variables) {
            runParameters.variables = variables;
        }
        // Add template parameters
        if (templateParameters) {
            runParameters.templateParameters = templateParameters;
        }
        // Add stages to skip
        if (stagesToSkip && stagesToSkip.length > 0) {
            runParameters.stagesToSkip = stagesToSkip;
        }
        // Prepare resources (including branch)
        const resources = branch
            ? { repositories: { self: { refName: `refs/heads/${branch}` } } }
            : {};
        // Add resources to run parameters if not empty
        if (Object.keys(resources).length > 0) {
            runParameters.resources = resources;
        }
        // Call pipeline API to run pipeline
        const result = await pipelinesApi.runPipeline(runParameters, projectId, pipelineId);
        return result;
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
        throw new errors_1.AzureDevOpsError(`Failed to trigger pipeline: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map