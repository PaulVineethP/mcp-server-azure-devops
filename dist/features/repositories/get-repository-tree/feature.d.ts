import { WebApi } from 'azure-devops-node-api';
import { GetRepositoryTreeOptions, RepositoryTreeResponse } from '../types';
/**
 * Get tree view of files/directories in a repository starting at an optional path
 */
export declare function getRepositoryTree(
  connection: WebApi,
  options: GetRepositoryTreeOptions,
): Promise<RepositoryTreeResponse>;
