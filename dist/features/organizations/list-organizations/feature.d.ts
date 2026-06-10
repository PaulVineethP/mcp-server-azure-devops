import { AzureDevOpsConfig } from '../../../shared/types';
import { Organization } from '../types';
/**
 * Lists all Azure DevOps organizations accessible to the authenticated user
 *
 * Note: This function uses Axios directly rather than the Azure DevOps Node API
 * because the WebApi client doesn't support the organizations endpoint.
 *
 * @param config The Azure DevOps configuration
 * @returns Array of organizations
 * @throws {AzureDevOpsAuthenticationError} If authentication fails
 */
export declare function listOrganizations(
  config: AzureDevOpsConfig,
): Promise<Organization[]>;
