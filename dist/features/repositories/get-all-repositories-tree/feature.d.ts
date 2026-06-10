import { WebApi } from 'azure-devops-node-api';
import {
  GetAllRepositoriesTreeOptions,
  AllRepositoriesTreeResponse,
  RepositoryTreeItem,
} from '../types';
/**
 * Get tree view of files/directories across multiple repositories
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting repository tree
 * @returns Tree structure for each repository
 */
export declare function getAllRepositoriesTree(
  connection: WebApi,
  options: GetAllRepositoriesTreeOptions,
): Promise<AllRepositoriesTreeResponse>;
/**
 * Convert the tree items to a formatted ASCII string representation
 *
 * @param repoName Repository name
 * @param items Tree items
 * @param stats Statistics about files and directories
 * @returns Formatted ASCII string
 */
export declare function formatRepositoryTree(
  repoName: string,
  items: RepositoryTreeItem[],
  stats: {
    directories: number;
    files: number;
  },
  error?: string,
): string;
