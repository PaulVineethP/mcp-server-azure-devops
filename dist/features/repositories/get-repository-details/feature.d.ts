import { WebApi } from 'azure-devops-node-api';
import { GetRepositoryDetailsOptions, RepositoryDetails } from '../types';
/**
 * Get detailed information about a repository
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting repository details
 * @returns The repository details including optional statistics and refs
 * @throws {AzureDevOpsResourceNotFoundError} If the repository is not found
 */
export declare function getRepositoryDetails(
  connection: WebApi,
  options: GetRepositoryDetailsOptions,
): Promise<RepositoryDetails>;
