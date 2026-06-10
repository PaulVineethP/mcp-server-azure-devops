"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProject = getProject;
const errors_1 = require("../../../shared/errors");
/**
 * Get a project by ID or name
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @returns The project details
 * @throws {AzureDevOpsResourceNotFoundError} If the project is not found
 */
async function getProject(connection, projectId) {
    try {
        const coreApi = await connection.getCoreApi();
        const project = await coreApi.getProject(projectId);
        if (!project) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Project '${projectId}' not found`);
        }
        return project;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get project: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map