import { WebApi } from 'azure-devops-node-api';
import { GitVersionType } from 'azure-devops-node-api/interfaces/GitInterfaces';
/**
 * Response format for file content
 */
export interface FileContentResponse {
  content: string;
  isDirectory: boolean;
}
/**
 * Get content of a file or directory from a repository
 *
 * @param connection - Azure DevOps WebApi connection
 * @param projectId - Project ID or name
 * @param repositoryId - Repository ID or name
 * @param path - Path to file or directory
 * @param versionDescriptor - Optional version descriptor for retrieving file at specific commit/branch/tag
 * @returns Content of the file or list of items if path is a directory
 */
export declare function getFileContent(
  connection: WebApi,
  projectId: string,
  repositoryId: string,
  path?: string,
  versionDescriptor?: {
    versionType: GitVersionType;
    version: string;
  },
): Promise<FileContentResponse>;
