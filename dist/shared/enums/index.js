"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitVersionTypeMapper = exports.pullRequestStatusMapper = exports.commentTypeMapper = exports.commentThreadStatusMapper = void 0;
exports.transformCommentThreadStatus = transformCommentThreadStatus;
exports.transformCommentType = transformCommentType;
exports.transformPullRequestStatus = transformPullRequestStatus;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const GitInterfaces_2 = require("azure-devops-node-api/interfaces/GitInterfaces");
/**
 * Generic enum mapper that creates bidirectional mappings between strings and numeric enums
 */
function createEnumMapper(mappings, defaultStringValue = 'unknown') {
    // Create reverse mapping from enum values to strings
    const reverseMap = Object.entries(mappings).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});
    return {
        toEnum: (value) => {
            const lowerValue = value.toLowerCase();
            return mappings[lowerValue];
        },
        toString: (value) => {
            return reverseMap[value] ?? defaultStringValue;
        },
    };
}
/**
 * CommentThreadStatus enum mappings
 */
exports.commentThreadStatusMapper = createEnumMapper({
    unknown: GitInterfaces_1.CommentThreadStatus.Unknown,
    active: GitInterfaces_1.CommentThreadStatus.Active,
    fixed: GitInterfaces_1.CommentThreadStatus.Fixed,
    wontfix: GitInterfaces_1.CommentThreadStatus.WontFix,
    closed: GitInterfaces_1.CommentThreadStatus.Closed,
    bydesign: GitInterfaces_1.CommentThreadStatus.ByDesign,
    pending: GitInterfaces_1.CommentThreadStatus.Pending,
});
/**
 * CommentType enum mappings
 */
exports.commentTypeMapper = createEnumMapper({
    unknown: GitInterfaces_1.CommentType.Unknown,
    text: GitInterfaces_1.CommentType.Text,
    codechange: GitInterfaces_1.CommentType.CodeChange,
    system: GitInterfaces_1.CommentType.System,
});
/**
 * PullRequestStatus enum mappings
 */
exports.pullRequestStatusMapper = createEnumMapper({
    active: GitInterfaces_2.PullRequestStatus.Active,
    abandoned: GitInterfaces_2.PullRequestStatus.Abandoned,
    completed: GitInterfaces_2.PullRequestStatus.Completed,
});
/**
 * GitVersionType enum mappings
 */
exports.gitVersionTypeMapper = createEnumMapper({
    branch: GitInterfaces_1.GitVersionType.Branch,
    commit: GitInterfaces_1.GitVersionType.Commit,
    tag: GitInterfaces_1.GitVersionType.Tag,
});
/**
 * Transform comment thread status from numeric to string
 */
function transformCommentThreadStatus(status) {
    return status !== undefined
        ? exports.commentThreadStatusMapper.toString(status)
        : undefined;
}
/**
 * Transform comment type from numeric to string
 */
function transformCommentType(type) {
    return type !== undefined ? exports.commentTypeMapper.toString(type) : undefined;
}
/**
 * Transform pull request status from numeric to string
 */
function transformPullRequestStatus(status) {
    return status !== undefined
        ? exports.pullRequestStatusMapper.toString(status)
        : undefined;
}
//# sourceMappingURL=index.js.map