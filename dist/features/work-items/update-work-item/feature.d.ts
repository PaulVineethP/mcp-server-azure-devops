import { WebApi } from 'azure-devops-node-api';
import { UpdateWorkItemOptions, WorkItem } from '../types';
/**
 * Update a work item
 *
 * @param connection The Azure DevOps WebApi connection
 * @param workItemId The ID of the work item to update
 * @param options Options for updating the work item
 * @returns The updated work item
 * @throws {AzureDevOpsResourceNotFoundError} If the work item is not found
 */
export declare function updateWorkItem(
  connection: WebApi,
  workItemId: number,
  options: UpdateWorkItemOptions,
): Promise<WorkItem>;
