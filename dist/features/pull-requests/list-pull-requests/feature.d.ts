import { WebApi } from 'azure-devops-node-api';
import { ListPullRequestsOptions, PullRequest } from '../types';
/**
 * List pull requests for a repository
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @param options Options for filtering pull requests
 * @returns Object containing pull requests array and pagination metadata
 */
export declare function listPullRequests(
  connection: WebApi,
  projectId: string,
  repositoryId: string,
  options: ListPullRequestsOptions,
): Promise<{
  count: number;
  value: PullRequest[];
  hasMoreResults: boolean;
  warning?: string;
}>;
