"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPullRequestComment = addPullRequestComment;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const errors_1 = require("../../../shared/errors");
const enums_1 = require("../../../shared/enums");
/**
 * Add a comment to a pull request
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @param pullRequestId The ID of the pull request
 * @param options Options for adding the comment
 * @returns The created comment or thread
 */
async function addPullRequestComment(connection, projectId, repositoryId, pullRequestId, options) {
    try {
        const gitApi = await connection.getGitApi();
        const project = projectId || undefined;
        let resolvedRepositoryId = repositoryId;
        if (!resolvedRepositoryId) {
            const pr = await gitApi.getPullRequestById(pullRequestId, project);
            resolvedRepositoryId = pr?.repository?.id;
        }
        if (!resolvedRepositoryId) {
            throw new Error('repositoryId is required (or must be derivable from pullRequestId)');
        }
        // Create comment object
        const comment = {
            content: options.content,
            commentType: GitInterfaces_1.CommentType.Text, // Default to Text type
            parentCommentId: options.parentCommentId,
        };
        // Case 1: Add comment to an existing thread
        if (options.threadId) {
            const createdComment = await gitApi.createComment(comment, resolvedRepositoryId, pullRequestId, options.threadId, project);
            if (!createdComment) {
                throw new Error('Failed to create pull request comment');
            }
            return {
                comment: {
                    ...createdComment,
                    commentType: (0, enums_1.transformCommentType)(createdComment.commentType),
                },
            };
        }
        // Case 2: Create new thread with comment
        else {
            // Map status string to CommentThreadStatus enum
            let threadStatus;
            if (options.status) {
                switch (options.status) {
                    case 'active':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.Active;
                        break;
                    case 'fixed':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.Fixed;
                        break;
                    case 'wontFix':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.WontFix;
                        break;
                    case 'closed':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.Closed;
                        break;
                    case 'pending':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.Pending;
                        break;
                    case 'byDesign':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.ByDesign;
                        break;
                    case 'unknown':
                        threadStatus = GitInterfaces_1.CommentThreadStatus.Unknown;
                        break;
                }
            }
            // Create thread with comment
            const thread = {
                comments: [comment],
                status: threadStatus,
            };
            // Add file context if specified (file comment)
            if (options.filePath) {
                thread.threadContext = {
                    filePath: options.filePath,
                    // Only add line information if provided
                    rightFileStart: options.lineNumber
                        ? {
                            line: options.lineNumber,
                            offset: 1, // Default to start of line
                        }
                        : undefined,
                    rightFileEnd: options.lineNumber
                        ? {
                            line: options.lineNumber,
                            offset: 1, // Default to start of line
                        }
                        : undefined,
                };
            }
            const createdThread = await gitApi.createThread(thread, resolvedRepositoryId, pullRequestId, project);
            if (!createdThread ||
                !createdThread.comments ||
                createdThread.comments.length === 0) {
                throw new Error('Failed to create pull request comment thread');
            }
            return {
                comment: {
                    ...createdThread.comments[0],
                    commentType: (0, enums_1.transformCommentType)(createdThread.comments[0].commentType),
                },
                thread: {
                    ...createdThread,
                    status: (0, enums_1.transformCommentThreadStatus)(createdThread.status),
                    comments: createdThread.comments?.map((comment) => ({
                        ...comment,
                        commentType: (0, enums_1.transformCommentType)(comment.commentType),
                    })),
                },
            };
        }
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to add pull request comment: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map