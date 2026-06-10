"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPullRequestChangesResponseSchema = exports.PullRequestFileChangeSchema = exports.GetPullRequestChecksSchema = exports.GetPullRequestChangesSchema = exports.UpdatePullRequestSchema = exports.AddPullRequestCommentSchema = exports.GetPullRequestCommentsSchema = exports.ListPullRequestsSchema = exports.GetPullRequestSchema = exports.CreatePullRequestSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../utils/environment");
/**
 * Schema for creating a pull request
 */
exports.CreatePullRequestSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    title: zod_1.z.string().describe('The title of the pull request'),
    description: zod_1.z
        .string()
        .optional()
        .describe('The description of the pull request (markdown is supported)'),
    sourceRefName: zod_1.z
        .string()
        .describe('The source branch name (e.g., refs/heads/feature-branch)'),
    targetRefName: zod_1.z
        .string()
        .describe('The target branch name (e.g., refs/heads/main)'),
    reviewers: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .describe('List of reviewer email addresses or IDs'),
    isDraft: zod_1.z
        .boolean()
        .optional()
        .describe('Whether the pull request should be created as a draft'),
    workItemRefs: zod_1.z
        .array(zod_1.z.number())
        .optional()
        .describe('List of work item IDs to link to the pull request'),
    tags: zod_1.z
        .array(zod_1.z.string().trim().min(1))
        .optional()
        .describe('List of tags to apply to the pull request'),
    additionalProperties: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .optional()
        .describe('Additional properties to set on the pull request'),
});
/**
 * Schema for getting a pull request by ID (no repositoryId required)
 */
exports.GetPullRequestSchema = zod_1.z.object({
    projectId: zod_1.z.string().describe('The ID or name of the project'),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request'),
});
/**
 * Schema for listing pull requests
 */
exports.ListPullRequestsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    status: zod_1.z
        .enum(['all', 'active', 'completed', 'abandoned'])
        .optional()
        .describe('Filter by pull request status'),
    creatorId: zod_1.z
        .string()
        .optional()
        .describe('Filter by creator ID (must be a UUID string)'),
    reviewerId: zod_1.z
        .string()
        .optional()
        .describe('Filter by reviewer ID (must be a UUID string)'),
    sourceRefName: zod_1.z.string().optional().describe('Filter by source branch name'),
    targetRefName: zod_1.z.string().optional().describe('Filter by target branch name'),
    top: zod_1.z
        .number()
        .default(10)
        .describe('Maximum number of pull requests to return (default: 10)'),
    skip: zod_1.z
        .number()
        .optional()
        .describe('Number of pull requests to skip for pagination'),
});
/**
 * Schema for getting pull request comments
 */
exports.GetPullRequestCommentsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request'),
    threadId: zod_1.z
        .number()
        .optional()
        .describe('The ID of the specific thread to get comments from'),
    includeDeleted: zod_1.z
        .boolean()
        .optional()
        .describe('Whether to include deleted comments'),
    top: zod_1.z
        .number()
        .optional()
        .describe('Maximum number of threads/comments to return'),
});
/**
 * Schema for adding a comment to a pull request
 */
exports.AddPullRequestCommentSchema = zod_1.z
    .object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z
        .string()
        .optional()
        .describe('The ID or name of the repository (optional; derived from pullRequestId when omitted)'),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request'),
    content: zod_1.z.string().describe('The content of the comment in markdown'),
    threadId: zod_1.z
        .number()
        .optional()
        .describe('The ID of the thread to add the comment to'),
    parentCommentId: zod_1.z
        .number()
        .optional()
        .describe('ID of the parent comment when replying to an existing comment'),
    filePath: zod_1.z
        .string()
        .optional()
        .describe('The path of the file to comment on (for new thread on file)'),
    lineNumber: zod_1.z
        .number()
        .optional()
        .describe('The line number to comment on (for new thread on file)'),
    status: zod_1.z
        .enum([
        'active',
        'fixed',
        'wontFix',
        'closed',
        'pending',
        'byDesign',
        'unknown',
    ])
        .optional()
        .describe('The status to set for a new thread'),
})
    .superRefine((data, ctx) => {
    // If we're creating a new thread (no threadId), status is required
    if (!data.threadId && !data.status) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Status is required when creating a new thread',
            path: ['status'],
        });
    }
});
/**
 * Schema for updating a pull request
 */
exports.UpdatePullRequestSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request to update'),
    title: zod_1.z
        .string()
        .optional()
        .describe('The updated title of the pull request'),
    description: zod_1.z
        .string()
        .optional()
        .describe('The updated description of the pull request'),
    status: zod_1.z
        .enum(['active', 'abandoned', 'completed'])
        .optional()
        .describe('The updated status of the pull request'),
    isDraft: zod_1.z
        .boolean()
        .optional()
        .describe('Whether the pull request should be marked as a draft (true) or unmarked (false)'),
    addWorkItemIds: zod_1.z
        .array(zod_1.z.number())
        .optional()
        .describe('List of work item IDs to link to the pull request'),
    removeWorkItemIds: zod_1.z
        .array(zod_1.z.number())
        .optional()
        .describe('List of work item IDs to unlink from the pull request'),
    addReviewers: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .describe('List of reviewer email addresses or IDs to add'),
    removeReviewers: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .describe('List of reviewer email addresses or IDs to remove'),
    addTags: zod_1.z
        .array(zod_1.z.string().trim().min(1))
        .optional()
        .describe('List of tags to add to the pull request'),
    removeTags: zod_1.z
        .array(zod_1.z.string().trim().min(1))
        .optional()
        .describe('List of tags to remove from the pull request'),
    additionalProperties: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .optional()
        .describe('Additional properties to update on the pull request'),
});
/**
 * Schema for getting pull request changes and policy evaluations
 */
exports.GetPullRequestChangesSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request'),
});
/**
 * Schema for retrieving pull request status checks and policy evaluations
 */
exports.GetPullRequestChecksSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    pullRequestId: zod_1.z.number().describe('The ID of the pull request'),
});
exports.PullRequestFileChangeSchema = zod_1.z.object({
    path: zod_1.z.string().describe('Path of the changed file'),
    patch: zod_1.z.string().describe('Unified diff of the file'),
});
exports.GetPullRequestChangesResponseSchema = zod_1.z.object({
    changes: zod_1.z.any(),
    evaluations: zod_1.z.array(zod_1.z.any()),
    files: zod_1.z.array(exports.PullRequestFileChangeSchema),
    sourceRefName: zod_1.z.string().optional(),
    targetRefName: zod_1.z.string().optional(),
});
//# sourceMappingURL=schemas.js.map