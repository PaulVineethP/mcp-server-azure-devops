import { WebApi } from 'azure-devops-node-api';
import { WorkItem } from '../types';
/**
 * Get a work item by ID
 *
 * @param connection The Azure DevOps WebApi connection
 * @param workItemId The ID of the work item
 * @param expand Optional expansion options (defaults to 'all')
 * @returns The work item details
 * @throws {AzureDevOpsResourceNotFoundError} If the work item is not found
 */
export declare function getWorkItem(
  connection: WebApi,
  workItemId: number,
  expand?: string,
): Promise<WorkItem>;
