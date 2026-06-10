import { WebApi } from 'azure-devops-node-api';
import { WorkItem } from '../types';
/**
 * Options for managing work item link
 */
interface ManageWorkItemLinkOptions {
  sourceWorkItemId: number;
  targetWorkItemId: number;
  operation: 'add' | 'remove' | 'update';
  relationType: string;
  newRelationType?: string;
  comment?: string;
}
/**
 * Manage (add, remove, or update) a link between two work items
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param options Options for managing the work item link
 * @returns The updated source work item
 * @throws {AzureDevOpsResourceNotFoundError} If either work item is not found
 */
export declare function manageWorkItemLink(
  connection: WebApi,
  projectId: string,
  options: ManageWorkItemLinkOptions,
): Promise<WorkItem>;
export {};
