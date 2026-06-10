"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequest = getPullRequest;
const errors_1 = require("../../../shared/errors");
async function getPullRequest(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const project = options.projectId;
        const pr = await gitApi.getPullRequestById(options.pullRequestId, project);
        if (!pr) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Pull request not found: ${options.pullRequestId}`);
        }
        return pr;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get pull request: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map