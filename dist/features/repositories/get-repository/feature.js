"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepository = getRepository;
const errors_1 = require("../../../shared/errors");
/**
 * Get a repository by ID or name
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @returns The repository details
 * @throws {AzureDevOpsResourceNotFoundError} If the repository is not found
 */
async function getRepository(connection, projectId, repositoryId) {
    try {
        const gitApi = await connection.getGitApi();
        const repository = await gitApi.getRepository(repositoryId, projectId);
        if (!repository) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Repository '${repositoryId}' not found in project '${projectId}'`);
        }
        return repository;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get repository: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map