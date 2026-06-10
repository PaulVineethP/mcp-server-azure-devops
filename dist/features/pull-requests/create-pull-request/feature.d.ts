import { WebApi } from 'azure-devops-node-api';
import { CreatePullRequestOptions, PullRequest } from '../types';
/**
 * Create a pull request
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @param options Options for creating the pull request
 * @returns The created pull request
 */
export declare function createPullRequest(
  connection: WebApi,
  projectId: string,
  repositoryId: string,
  options: CreatePullRequestOptions,
): Promise<PullRequest>;
