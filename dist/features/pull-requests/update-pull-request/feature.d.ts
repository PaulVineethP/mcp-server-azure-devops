import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { UpdatePullRequestOptions } from '../types';
/**
 * Updates an existing pull request in Azure DevOps with the specified changes.
 *
 * @param options - The options for updating the pull request
 * @returns The updated pull request
 */
export declare const updatePullRequest: (
  options: UpdatePullRequestOptions,
) => Promise<GitPullRequest>;
