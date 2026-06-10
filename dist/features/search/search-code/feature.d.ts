import { WebApi } from 'azure-devops-node-api';
import { SearchCodeOptions, CodeSearchResponse } from '../types';
/**
 * Search for code in Azure DevOps repositories
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for searching code
 * @returns Search results with optional file content
 */
export declare function searchCode(
  connection: WebApi,
  options: SearchCodeOptions,
): Promise<CodeSearchResponse>;
