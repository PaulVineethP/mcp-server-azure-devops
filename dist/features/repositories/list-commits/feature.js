"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommits = listCommits;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const diff_1 = require("diff");
const errors_1 = require("../../../shared/errors");
async function streamToString(stream) {
    const chunks = [];
    return await new Promise((resolve, reject) => {
        stream.on('data', (c) => chunks.push(Buffer.from(c)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', (err) => reject(err));
    });
}
/**
 * List commits on a branch including their file level diffs
 */
async function listCommits(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const commits = await gitApi.getCommits(options.repositoryId, {
            itemVersion: {
                version: options.branchName,
                versionType: GitInterfaces_1.GitVersionType.Branch,
            },
            $top: options.top ?? 10,
            $skip: options.skip,
        }, options.projectId);
        if (!commits || commits.length === 0) {
            return { commits: [] };
        }
        const getBlobText = async (objId) => {
            if (!objId) {
                return '';
            }
            const stream = await gitApi.getBlobContent(options.repositoryId, objId, options.projectId);
            return stream ? await streamToString(stream) : '';
        };
        const commitsWithContent = [];
        for (const commit of commits) {
            const commitId = commit.commitId;
            if (!commitId) {
                continue;
            }
            const commitChanges = await gitApi.getChanges(commitId, options.repositoryId, options.projectId);
            const changeEntries = commitChanges?.changes ?? [];
            const files = await Promise.all(changeEntries.map(async (entry) => {
                const path = entry.item?.path || entry.originalPath || '';
                const [oldContent, newContent] = await Promise.all([
                    getBlobText(entry.item?.originalObjectId),
                    getBlobText(entry.item?.objectId),
                ]);
                const patch = (0, diff_1.createTwoFilesPatch)(entry.originalPath || path, path, oldContent, newContent);
                return { path, patch };
            }));
            commitsWithContent.push({
                commitId,
                comment: commit.comment,
                author: commit.author,
                committer: commit.committer,
                url: commit.url,
                parents: commit.parents,
                files,
            });
        }
        return { commits: commitsWithContent };
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to list commits: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map