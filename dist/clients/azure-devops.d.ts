interface ClientOptions {
  organizationId?: string;
  organizationUrl?: string;
  projectId?: string;
}
interface WikiCreateParameters {
  name: string;
  projectId: string;
  type: 'projectWiki' | 'codeWiki';
  repositoryId?: string;
  mappedPath?: string;
  version?: {
    version: string;
    versionType?: 'branch' | 'tag' | 'commit';
  };
}
interface WikiPageContent {
  content: string;
}
export interface WikiPageSummary {
  id: number;
  path: string;
  url?: string;
  order?: number;
}
interface PageUpdateOptions {
  comment?: string;
  versionDescriptor?: {
    version?: string;
  };
}
export declare class WikiClient {
  private baseUrl;
  constructor(options: {
    organizationId?: string;
    organizationUrl?: string;
    projectId?: string;
  });
  /**
   * Gets a project's ID from its name or verifies a project ID
   * @param projectNameOrId - Project name or ID
   * @returns The project ID
   */
  private getProjectId;
  /**
   * Creates a new wiki in Azure DevOps
   * @param projectId - Project ID or name
   * @param params - Parameters for creating the wiki
   * @returns The created wiki
   */
  createWiki(projectId: string, params: WikiCreateParameters): Promise<any>;
  /**
   * Gets a wiki page's content
   * @param projectId - Project ID or name
   * @param wikiId - Wiki ID or name
   * @param pagePath - Path of the wiki page
   * @param options - Additional options like version
   * @returns The wiki page content and ETag
   */
  getPage(
    projectId: string,
    wikiId: string,
    pagePath: string,
  ): Promise<{
    content: any;
    eTag: any;
  }>;
  /**
   * Creates a new wiki page with the provided content
   * @param content - Content for the new wiki page
   * @param projectId - Project ID or name
   * @param wikiId - Wiki ID or name
   * @param pagePath - Path of the wiki page to create
   * @param options - Additional options like comment
   * @returns The created wiki page
   */
  createPage(
    content: string,
    projectId: string,
    wikiId: string,
    pagePath: string,
    options?: {
      comment?: string;
    },
  ): Promise<any>;
  /**
   * Updates a wiki page with the provided content
   * @param content - Content for the wiki page
   * @param projectId - Project ID or name
   * @param wikiId - Wiki ID or name
   * @param pagePath - Path of the wiki page
   * @param options - Additional options like comment and version
   * @returns The updated wiki page
   */
  updatePage(
    content: WikiPageContent,
    projectId: string,
    wikiId: string,
    pagePath: string,
    options?: PageUpdateOptions,
  ): Promise<any>;
  /**
   * Lists wiki pages from a wiki using the Pages Batch API
   * @param projectId - Project ID or name
   * @param wikiId - Wiki ID or name
   * @returns Array of wiki page summaries sorted by order then path
   */
  listWikiPages(projectId: string, wikiId: string): Promise<WikiPageSummary[]>;
}
/**
 * Creates a Wiki client for Azure DevOps operations
 * @param options - Options for creating the client
 * @returns A Wiki client instance
 */
export declare function getWikiClient(
  options: ClientOptions,
): Promise<WikiClient>;
/**
 * Get the authorization header for Azure DevOps API requests
 * @returns The authorization header
 */
export declare function getAuthorizationHeader(): Promise<string>;
export {};
