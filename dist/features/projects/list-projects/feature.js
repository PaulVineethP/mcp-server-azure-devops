"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
const errors_1 = require("../../../shared/errors");
/**
 * List all projects in the organization
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Optional parameters for listing projects
 * @returns Array of projects
 */
async function listProjects(connection, options = {}) {
    try {
        const coreApi = await connection.getCoreApi();
        const projects = await coreApi.getProjects(options.stateFilter, options.top, options.skip, options.continuationToken);
        return projects;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to list projects: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map