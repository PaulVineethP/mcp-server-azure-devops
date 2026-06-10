import { ListWikiPagesOptions } from './schema';
/**
 * Summary information for a wiki page
 */
export interface WikiPageSummary {
  id: number;
  path: string;
  url?: string;
  order?: number;
}
/**
 * List wiki pages from a wiki
 *
 * @param options Options for listing wiki pages
 * @returns Array of wiki page summaries
 * @throws {AzureDevOpsResourceNotFoundError} When the wiki is not found
 * @throws {AzureDevOpsPermissionError} When the user does not have permission to access the wiki
 * @throws {AzureDevOpsError} When an error occurs while fetching the wiki pages
 */
export declare function listWikiPages(
  options: ListWikiPagesOptions,
): Promise<WikiPageSummary[]>;
