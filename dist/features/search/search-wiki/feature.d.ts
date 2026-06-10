import { WebApi } from 'azure-devops-node-api';
import { SearchWikiOptions, WikiSearchResponse } from '../types';
/**
 * Search for wiki pages in Azure DevOps projects
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for searching wiki pages
 * @returns Search results for wiki pages
 */
export declare function searchWiki(
  connection: WebApi,
  options: SearchWikiOptions,
): Promise<WikiSearchResponse>;
