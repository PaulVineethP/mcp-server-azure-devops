import { WebApi } from 'azure-devops-node-api';
/**
 * Authentication methods supported by the Azure DevOps client
 */
export declare enum AuthenticationMethod {
  /**
   * Personal Access Token authentication
   */
  PersonalAccessToken = 'pat',
  /**
   * Azure Identity authentication (DefaultAzureCredential)
   */
  AzureIdentity = 'azure-identity',
  /**
   * Azure CLI authentication (AzureCliCredential)
   */
  AzureCli = 'azure-cli',
}
/**
 * Authentication configuration for Azure DevOps
 */
export interface AuthConfig {
  /**
   * Authentication method to use
   */
  method: AuthenticationMethod;
  /**
   * Organization URL (e.g., https://dev.azure.com/myorg)
   */
  organizationUrl: string;
  /**
   * Personal Access Token for Azure DevOps (required for PAT authentication)
   */
  personalAccessToken?: string;
}
/**
 * Creates an authenticated client for Azure DevOps API based on the specified authentication method
 *
 * @param config Authentication configuration
 * @returns Authenticated WebApi client
 * @throws {AzureDevOpsAuthenticationError} If authentication fails
 */
export declare function createAuthClient(config: AuthConfig): Promise<WebApi>;
