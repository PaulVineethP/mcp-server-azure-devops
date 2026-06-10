import { WebApi } from 'azure-devops-node-api';
import { AddPullRequestCommentOptions, AddCommentResponse } from '../types';
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
export declare function addPullRequestComment(
  connection: WebApi,
  projectId: string | undefined,
  repositoryId: string | undefined,
  pullRequestId: number,
  options: AddPullRequestCommentOptions,
): Promise<AddCommentResponse>;
