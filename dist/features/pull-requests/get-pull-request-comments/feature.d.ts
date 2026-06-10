import { WebApi } from 'azure-devops-node-api';
import {
  GetPullRequestCommentsOptions,
  CommentThreadWithStringEnums,
} from '../types';
/**
 * Get comments from a pull request
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @param pullRequestId The ID of the pull request
 * @param options Options for filtering comments
 * @returns Array of comment threads with their comments
 */
export declare function getPullRequestComments(
  connection: WebApi,
  projectId: string,
  repositoryId: string,
  pullRequestId: number,
  options: GetPullRequestCommentsOptions,
): Promise<CommentThreadWithStringEnums[]>;
