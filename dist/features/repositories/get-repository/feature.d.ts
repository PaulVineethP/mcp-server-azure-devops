import { WebApi } from 'azure-devops-node-api';
import { GitRepository } from '../types';
/**
 * Get a repository by ID or name
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param repositoryId The ID or name of the repository
 * @returns The repository details
 * @throws {AzureDevOpsResourceNotFoundError} If the repository is not found
 */
export declare function getRepository(
  connection: WebApi,
  projectId: string,
  repositoryId: string,
): Promise<GitRepository>;
