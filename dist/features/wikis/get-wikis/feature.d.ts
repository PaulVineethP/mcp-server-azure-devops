import { WebApi } from 'azure-devops-node-api';
import { WikiV2 } from 'azure-devops-node-api/interfaces/WikiInterfaces';
/**
 * Options for getting wikis
 */
export interface GetWikisOptions {
  /**
   * The ID or name of the organization
   * If not provided, the default organization will be used
   */
  organizationId?: string;
  /**
   * The ID or name of the project
   * If not provided, the wikis from all projects will be returned
   */
  projectId?: string;
}
/**
 * Get wikis in a project or organization
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting wikis
 * @returns List of wikis
 */
export declare function getWikis(
  connection: WebApi,
  options: GetWikisOptions,
): Promise<WikiV2[]>;
