/**
 * CommentThreadStatus enum mappings
 */
export declare const commentThreadStatusMapper: {
  toEnum: (value: string) => number | undefined;
  toString: (value: number) => string;
};
/**
 * CommentType enum mappings
 */
export declare const commentTypeMapper: {
  toEnum: (value: string) => number | undefined;
  toString: (value: number) => string;
};
/**
 * PullRequestStatus enum mappings
 */
export declare const pullRequestStatusMapper: {
  toEnum: (value: string) => number | undefined;
  toString: (value: number) => string;
};
/**
 * GitVersionType enum mappings
 */
export declare const gitVersionTypeMapper: {
  toEnum: (value: string) => number | undefined;
  toString: (value: number) => string;
};
/**
 * Transform comment thread status from numeric to string
 */
export declare function transformCommentThreadStatus(
  status?: number,
): string | undefined;
/**
 * Transform comment type from numeric to string
 */
export declare function transformCommentType(type?: number): string | undefined;
/**
 * Transform pull request status from numeric to string
 */
export declare function transformPullRequestStatus(
  status?: number,
): string | undefined;
