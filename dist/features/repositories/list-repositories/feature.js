"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRepositories = listRepositories;
const errors_1 = require("../../../shared/errors");
/**
 * List repositories in a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for listing repositories
 * @returns Array of repositories
 */
async function listRepositories(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const repositories = await gitApi.getRepositories(options.projectId, options.includeLinks);
        return repositories;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to list repositories: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map