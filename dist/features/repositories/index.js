"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRepositoriesRequest = exports.isRepositoriesRequest = void 0;
// Re-export schemas and types
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
// Re-export features
__exportStar(require("./get-repository"), exports);
__exportStar(require("./get-repository-details"), exports);
__exportStar(require("./list-repositories"), exports);
__exportStar(require("./get-file-content"), exports);
__exportStar(require("./get-all-repositories-tree"), exports);
__exportStar(require("./get-repository-tree"), exports);
__exportStar(require("./create-branch"), exports);
__exportStar(require("./create-commit"), exports);
__exportStar(require("./list-commits"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const environment_1 = require("../../utils/environment");
const _1 = require("./");
/**
 * Checks if the request is for the repositories feature
 */
const isRepositoriesRequest = (request) => {
    const toolName = request.params.name;
    return [
        'get_repository',
        'get_repository_details',
        'list_repositories',
        'get_file_content',
        'get_all_repositories_tree',
        'get_repository_tree',
        'create_branch',
        'create_commit',
        'list_commits',
    ].includes(toolName);
};
exports.isRepositoriesRequest = isRepositoriesRequest;
/**
 * Handles repositories feature requests
 */
const handleRepositoriesRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'get_repository': {
            const args = _1.GetRepositorySchema.parse(request.params.arguments);
            const result = await (0, _1.getRepository)(connection, args.projectId ?? environment_1.defaultProject, args.repositoryId);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_repository_details': {
            const args = _1.GetRepositoryDetailsSchema.parse(request.params.arguments);
            const result = await (0, _1.getRepositoryDetails)(connection, {
                projectId: args.projectId ?? environment_1.defaultProject,
                repositoryId: args.repositoryId,
                includeStatistics: args.includeStatistics,
                includeRefs: args.includeRefs,
                refFilter: args.refFilter,
                branchName: args.branchName,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'list_repositories': {
            const args = _1.ListRepositoriesSchema.parse(request.params.arguments);
            const result = await (0, _1.listRepositories)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_file_content': {
            const args = _1.GetFileContentSchema.parse(request.params.arguments);
            // Map the string version type to the GitVersionType enum
            let versionTypeEnum;
            if (args.versionType && args.version) {
                if (args.versionType === 'branch') {
                    versionTypeEnum = GitInterfaces_1.GitVersionType.Branch;
                }
                else if (args.versionType === 'commit') {
                    versionTypeEnum = GitInterfaces_1.GitVersionType.Commit;
                }
                else if (args.versionType === 'tag') {
                    versionTypeEnum = GitInterfaces_1.GitVersionType.Tag;
                }
            }
            const result = await (0, _1.getFileContent)(connection, args.projectId ?? environment_1.defaultProject, args.repositoryId, args.path, versionTypeEnum !== undefined && args.version
                ? { versionType: versionTypeEnum, version: args.version }
                : undefined);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_all_repositories_tree': {
            const args = _1.GetAllRepositoriesTreeSchema.parse(request.params.arguments);
            const result = await (0, _1.getAllRepositoriesTree)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
                organizationId: args.organizationId ?? environment_1.defaultOrg,
            });
            // Format the output as plain text tree representation
            let formattedOutput = '';
            for (const repo of result.repositories) {
                formattedOutput += (0, _1.formatRepositoryTree)(repo.name, repo.tree, repo.stats, repo.error);
                formattedOutput += '\n'; // Add blank line between repositories
            }
            return {
                content: [{ type: 'text', text: formattedOutput }],
            };
        }
        case 'get_repository_tree': {
            const args = _1.GetRepositoryTreeSchema.parse(request.params.arguments);
            const result = await (0, _1.getRepositoryTree)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        case 'create_branch': {
            const args = _1.CreateBranchSchema.parse(request.params.arguments);
            await (0, _1.createBranch)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: 'Branch created successfully' }],
            };
        }
        case 'create_commit': {
            const args = _1.CreateCommitSchema.parse(request.params.arguments);
            await (0, _1.createCommit)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: 'Commit created successfully' }],
            };
        }
        case 'list_commits': {
            const args = _1.ListCommitsSchema.parse(request.params.arguments);
            const result = await (0, _1.listCommits)(connection, {
                ...args,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown repositories tool: ${request.params.name}`);
    }
};
exports.handleRepositoriesRequest = handleRepositoriesRequest;
//# sourceMappingURL=index.js.map