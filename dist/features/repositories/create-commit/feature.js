"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommit = createCommit;
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
 * Create a commit with multiple file changes
 */
async function createCommit(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const branch = await gitApi.getBranch(options.repositoryId, options.branchName, options.projectId);
        const baseCommit = branch?.commit?.commitId;
        if (!baseCommit) {
            throw new errors_1.AzureDevOpsError(`Branch '${options.branchName}' not found`);
        }
        const changes = [];
        for (const file of options.changes) {
            // Handle search/replace format by generating a patch
            let patchString = file.patch;
            if (!patchString &&
                file.search !== undefined &&
                file.replace !== undefined) {
                if (!file.path) {
                    throw new errors_1.AzureDevOpsError('path is required when using search/replace format');
                }
                // Fetch current file content
                let currentContent = '';
                try {
                    const stream = await gitApi.getItemContent(options.repositoryId, file.path, options.projectId, undefined, undefined, undefined, undefined, false, { version: options.branchName, versionType: GitInterfaces_1.GitVersionType.Branch }, true);
                    currentContent = stream ? await streamToString(stream) : '';
                }
                catch {
                    // File might not exist (new file scenario) - treat as empty
                    currentContent = '';
                }
                // Perform the replacement
                if (!currentContent.includes(file.search)) {
                    throw new errors_1.AzureDevOpsError(`Search string not found in ${file.path}. The file may have been modified since you last read it.`);
                }
                const newContent = currentContent.replace(file.search, file.replace);
                // Generate proper unified diff
                patchString = (0, diff_1.createTwoFilesPatch)(file.path, file.path, currentContent, newContent, undefined, undefined);
            }
            if (!patchString) {
                throw new errors_1.AzureDevOpsError('Either patch or both search and replace must be provided for each change');
            }
            const patches = (0, diff_1.parsePatch)(patchString);
            if (patches.length !== 1) {
                throw new errors_1.AzureDevOpsError(`Expected a single file diff for change but received ${patches.length}`);
            }
            const patch = patches[0];
            const normalizePath = (path) => {
                if (!path || path === '/dev/null') {
                    return undefined;
                }
                return path.replace(/^a\//, '').replace(/^b\//, '');
            };
            const oldPath = normalizePath(patch.oldFileName);
            const newPath = normalizePath(patch.newFileName);
            const targetPath = file.path ?? newPath ?? oldPath;
            if (!targetPath) {
                throw new errors_1.AzureDevOpsError('Unable to determine target path for change');
            }
            if (oldPath && newPath && oldPath !== newPath) {
                throw new errors_1.AzureDevOpsError(`Renaming files is not supported (attempted ${oldPath} -> ${newPath})`);
            }
            let originalContent = '';
            if (oldPath) {
                const stream = await gitApi.getItemContent(options.repositoryId, oldPath, options.projectId, undefined, undefined, undefined, undefined, false, { version: options.branchName, versionType: GitInterfaces_1.GitVersionType.Branch }, true);
                originalContent = stream ? await streamToString(stream) : '';
            }
            const patchedContent = (0, diff_1.applyPatch)(originalContent, patch);
            if (patchedContent === false) {
                throw new errors_1.AzureDevOpsError(`Failed to apply diff for ${targetPath}. Please ensure the patch is up to date with the branch head.`);
            }
            if (!newPath) {
                changes.push({
                    changeType: GitInterfaces_1.VersionControlChangeType.Delete,
                    item: { path: targetPath },
                });
                continue;
            }
            const changeType = oldPath
                ? GitInterfaces_1.VersionControlChangeType.Edit
                : GitInterfaces_1.VersionControlChangeType.Add;
            changes.push({
                changeType,
                item: { path: targetPath },
                newContent: {
                    content: patchedContent,
                    contentType: GitInterfaces_1.ItemContentType.RawText,
                },
            });
        }
        const commit = {
            comment: options.commitMessage,
            changes,
        };
        const refUpdate = {
            name: `refs/heads/${options.branchName}`,
            oldObjectId: baseCommit,
        };
        await gitApi.createPush({ commits: [commit], refUpdates: [refUpdate] }, options.repositoryId, options.projectId);
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to create commit: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map