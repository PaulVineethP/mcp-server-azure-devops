import { WebApi } from 'azure-devops-node-api';
import { ListRepositoriesOptions, GitRepository } from '../types';
/**
 * List repositories in a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for listing repositories
 * @returns Array of repositories
 */
export declare function listRepositories(
  connection: WebApi,
  options: ListRepositoriesOptions,
): Promise<GitRepository[]>;
