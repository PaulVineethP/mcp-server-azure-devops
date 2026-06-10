import { ICoreApi } from 'azure-devops-node-api/CoreApi';
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { ITestApi } from 'azure-devops-node-api/TestApi';
import { IReleaseApi } from 'azure-devops-node-api/ReleaseApi';
import { ITaskAgentApi } from 'azure-devops-node-api/TaskAgentApi';
import { ITaskApi } from 'azure-devops-node-api/TaskApi';
export interface AzureDevOpsClientConfig {
  orgUrl: string;
  pat: string;
}
/**
 * Azure DevOps Client
 *
 * Provides access to Azure DevOps APIs
 */
export declare class AzureDevOpsClient {
  private config;
  private clientPromise;
  constructor(config: AzureDevOpsClientConfig);
  /**
   * Get the authenticated Azure DevOps client
   *
   * @returns The authenticated WebApi client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  private getClient;
  /**
   * Check if the client is authenticated
   *
   * @returns True if the client is authenticated
   */
  isAuthenticated(): Promise<boolean>;
  /**
   * Get the Core API
   *
   * @returns The Core API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getCoreApi(): Promise<ICoreApi>;
  /**
   * Get the Git API
   *
   * @returns The Git API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getGitApi(): Promise<IGitApi>;
  /**
   * Get the Work Item Tracking API
   *
   * @returns The Work Item Tracking API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getWorkItemTrackingApi(): Promise<IWorkItemTrackingApi>;
  /**
   * Get the Build API
   *
   * @returns The Build API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getBuildApi(): Promise<IBuildApi>;
  /**
   * Get the Test API
   *
   * @returns The Test API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getTestApi(): Promise<ITestApi>;
  /**
   * Get the Release API
   *
   * @returns The Release API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getReleaseApi(): Promise<IReleaseApi>;
  /**
   * Get the Task Agent API
   *
   * @returns The Task Agent API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getTaskAgentApi(): Promise<ITaskAgentApi>;
  /**
   * Get the Task API
   *
   * @returns The Task API client
   * @throws {AzureDevOpsAuthenticationError} If authentication fails
   */
  getTaskApi(): Promise<ITaskApi>;
}
