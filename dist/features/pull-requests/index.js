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
exports.handlePullRequestsRequest = exports.isPullRequestsRequest = void 0;
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./create-pull-request"), exports);
__exportStar(require("./get-pull-request"), exports);
__exportStar(require("./list-pull-requests"), exports);
__exportStar(require("./get-pull-request-comments"), exports);
__exportStar(require("./add-pull-request-comment"), exports);
__exportStar(require("./update-pull-request"), exports);
__exportStar(require("./get-pull-request-changes"), exports);
__exportStar(require("./get-pull-request-checks"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const environment_1 = require("../../utils/environment");
const _1 = require("./");
/**
 * Checks if the request is for the pull requests feature
 */
const isPullRequestsRequest = (request) => {
    const toolName = request.params.name;
    return [
        'create_pull_request',
        'get_pull_request',
        'list_pull_requests',
        'get_pull_request_comments',
        'add_pull_request_comment',
        'update_pull_request',
        'get_pull_request_changes',
        'get_pull_request_checks',
    ].includes(toolName);
};
exports.isPullRequestsRequest = isPullRequestsRequest;
/**
 * Handles pull requests feature requests
 */
const handlePullRequestsRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'create_pull_request': {
            const args = _1.CreatePullRequestSchema.parse(request.params.arguments);
            const result = await (0, _1.createPullRequest)(connection, args.projectId ?? environment_1.defaultProject, args.repositoryId, args);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pull_request': {
            const params = _1.GetPullRequestSchema.parse(request.params.arguments);
            const result = await (0, _1.getPullRequest)(connection, {
                projectId: params.projectId,
                pullRequestId: params.pullRequestId,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'list_pull_requests': {
            const params = _1.ListPullRequestsSchema.parse(request.params.arguments);
            const result = await (0, _1.listPullRequests)(connection, params.projectId ?? environment_1.defaultProject, params.repositoryId, {
                projectId: params.projectId ?? environment_1.defaultProject,
                repositoryId: params.repositoryId,
                status: params.status,
                creatorId: params.creatorId,
                reviewerId: params.reviewerId,
                sourceRefName: params.sourceRefName,
                targetRefName: params.targetRefName,
                top: params.top,
                skip: params.skip,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pull_request_comments': {
            const params = _1.GetPullRequestCommentsSchema.parse(request.params.arguments);
            const result = await (0, _1.getPullRequestComments)(connection, params.projectId ?? environment_1.defaultProject, params.repositoryId, params.pullRequestId, {
                projectId: params.projectId ?? environment_1.defaultProject,
                repositoryId: params.repositoryId,
                pullRequestId: params.pullRequestId,
                threadId: params.threadId,
                includeDeleted: params.includeDeleted,
                top: params.top,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'add_pull_request_comment': {
            const params = _1.AddPullRequestCommentSchema.parse(request.params.arguments);
            const result = await (0, _1.addPullRequestComment)(connection, params.projectId ?? environment_1.defaultProject, params.repositoryId, params.pullRequestId, {
                projectId: params.projectId ?? environment_1.defaultProject,
                repositoryId: params.repositoryId,
                pullRequestId: params.pullRequestId,
                content: params.content,
                threadId: params.threadId,
                parentCommentId: params.parentCommentId,
                filePath: params.filePath,
                lineNumber: params.lineNumber,
                status: params.status,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'update_pull_request': {
            const params = _1.UpdatePullRequestSchema.parse(request.params.arguments);
            const fixedParams = {
                ...params,
                projectId: params.projectId ?? environment_1.defaultProject,
            };
            const result = await (0, _1.updatePullRequest)(fixedParams);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pull_request_changes': {
            const params = _1.GetPullRequestChangesSchema.parse(request.params.arguments);
            const result = await (0, _1.getPullRequestChanges)(connection, {
                projectId: params.projectId ?? environment_1.defaultProject,
                repositoryId: params.repositoryId,
                pullRequestId: params.pullRequestId,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pull_request_checks': {
            const params = _1.GetPullRequestChecksSchema.parse(request.params.arguments);
            const result = await (0, _1.getPullRequestChecks)(connection, {
                projectId: params.projectId ?? environment_1.defaultProject,
                repositoryId: params.repositoryId,
                pullRequestId: params.pullRequestId,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown pull requests tool: ${request.params.name}`);
    }
};
exports.handlePullRequestsRequest = handlePullRequestsRequest;
//# sourceMappingURL=index.js.map