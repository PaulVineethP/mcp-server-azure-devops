"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryTree = getRepositoryTree;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const errors_1 = require("../../../shared/errors");
/**
 * Get tree view of files/directories in a repository starting at an optional path
 */
async function getRepositoryTree(connection, options) {
    try {
        const gitApi = await connection.getGitApi();
        const repository = await gitApi.getRepository(options.repositoryId, options.projectId);
        if (!repository || !repository.id) {
            throw new errors_1.AzureDevOpsError(`Repository '${options.repositoryId}' not found in project '${options.projectId}'`);
        }
        const defaultBranch = repository.defaultBranch;
        if (!defaultBranch) {
            throw new errors_1.AzureDevOpsError('Default branch not found');
        }
        const branchRef = defaultBranch.replace('refs/heads/', '');
        const rootPath = options.path ?? '/';
        const items = await gitApi.getItems(repository.id, options.projectId, rootPath, GitInterfaces_1.VersionControlRecursionType.Full, true, false, false, false, {
            version: branchRef,
            versionType: GitInterfaces_1.GitVersionType.Branch,
        });
        const treeItems = [];
        const stats = { directories: 0, files: 0 };
        for (const item of items) {
            const path = item.path || '';
            if (path === rootPath || item.gitObjectType === GitInterfaces_1.GitObjectType.Bad) {
                continue;
            }
            const relative = rootPath === '/'
                ? path.replace(/^\//, '')
                : path.slice(rootPath.length + 1);
            const level = relative.split('/').length;
            if (options.depth && options.depth > 0 && level > options.depth) {
                continue;
            }
            const isFolder = !!item.isFolder;
            treeItems.push({
                name: relative.split('/').pop() || '',
                path,
                isFolder,
                level,
            });
            if (isFolder)
                stats.directories++;
            else
                stats.files++;
        }
        return {
            name: repository.name || options.repositoryId,
            tree: treeItems,
            stats,
        };
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get repository tree: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map