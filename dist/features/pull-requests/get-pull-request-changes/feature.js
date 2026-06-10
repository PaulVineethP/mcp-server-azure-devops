"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequestChanges = getPullRequestChanges;
const errors_1 = require("../../../shared/errors");
const diff_1 = require("diff");
/**
 * Retrieve changes and policy evaluation status for a pull request
 */
async function getPullRequestChanges(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const [pullRequest, iterations] = await Promise.all([
            gitApi.getPullRequest(options.repositoryId, options.pullRequestId, options.projectId),
            gitApi.getPullRequestIterations(options.repositoryId, options.pullRequestId, options.projectId),
        ]);
        if (!iterations || iterations.length === 0) {
            throw new errors_1.AzureDevOpsError('No iterations found for pull request');
        }
        const latest = iterations[iterations.length - 1];
        const changes = await gitApi.getPullRequestIterationChanges(options.repositoryId, options.pullRequestId, latest.id, options.projectId);
        const policyApi = await connection.getPolicyApi();
        const artifactId = `vstfs:///CodeReview/CodeReviewId/${options.projectId}/${options.pullRequestId}`;
        const evaluations = await policyApi.getPolicyEvaluations(options.projectId, artifactId);
        const changeEntries = changes.changeEntries ?? [];
        const getBlobText = async (objId) => {
            if (!objId)
                return '';
            const stream = await gitApi.getBlobContent(options.repositoryId, objId, options.projectId);
            const chunks = [];
            return await new Promise((resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                stream.on('error', reject);
            });
        };
        const files = await Promise.all(changeEntries.map(async (entry) => {
            const path = entry.item?.path || entry.originalPath || '';
            const [oldContent, newContent] = await Promise.all([
                getBlobText(entry.item?.originalObjectId),
                getBlobText(entry.item?.objectId),
            ]);
            const patch = (0, diff_1.createTwoFilesPatch)(entry.originalPath || path, path, oldContent, newContent);
            return { path, patch };
        }));
        return {
            changes,
            evaluations,
            files,
            sourceRefName: pullRequest?.sourceRefName,
            targetRefName: pullRequest?.targetRefName,
        };
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get pull request changes: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map