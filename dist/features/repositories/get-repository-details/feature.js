"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryDetails = getRepositoryDetails;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const errors_1 = require("../../../shared/errors");
/**
 * Get detailed information about a repository
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting repository details
 * @returns The repository details including optional statistics and refs
 * @throws {AzureDevOpsResourceNotFoundError} If the repository is not found
 */
async function getRepositoryDetails(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        // Get the basic repository information
        const repository = await gitApi.getRepository(options.repositoryId, options.projectId);
        if (!repository) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Repository '${options.repositoryId}' not found in project '${options.projectId}'`);
        }
        // Initialize the response object
        const response = {
            repository,
        };
        // Get branch statistics if requested
        if (options.includeStatistics) {
            let baseVersionDescriptor = undefined;
            // If a specific branch name is provided, create a version descriptor for it
            if (options.branchName) {
                baseVersionDescriptor = {
                    version: options.branchName,
                    versionType: GitInterfaces_1.GitVersionType.Branch,
                };
            }
            const branchStats = await gitApi.getBranches(repository.id || '', options.projectId, baseVersionDescriptor);
            response.statistics = {
                branches: branchStats || [],
            };
        }
        // Get repository refs if requested
        if (options.includeRefs) {
            const filter = options.refFilter || undefined;
            const refs = await gitApi.getRefs(repository.id || '', options.projectId, filter);
            if (refs) {
                response.refs = {
                    value: refs,
                    count: refs.length,
                };
            }
            else {
                response.refs = {
                    value: [],
                    count: 0,
                };
            }
        }
        return response;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get repository details: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map