"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranch = createBranch;
const errors_1 = require("../../../shared/errors");
/**
 * Create a new branch from an existing one
 */
async function createBranch(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const source = await gitApi.getBranch(options.repositoryId, options.sourceBranch, options.projectId);
        const commitId = source?.commit?.commitId;
        if (!commitId) {
            throw new errors_1.AzureDevOpsError(`Source branch '${options.sourceBranch}' not found`);
        }
        const refUpdate = {
            name: `refs/heads/${options.newBranch}`,
            oldObjectId: '0000000000000000000000000000000000000000',
            newObjectId: commitId,
        };
        const result = await gitApi.updateRefs([refUpdate], options.repositoryId, options.projectId);
        if (!result.every((r) => r.success)) {
            throw new errors_1.AzureDevOpsError('Failed to create new branch');
        }
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to create branch: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map