import { WebApi } from 'azure-devops-node-api';
import { CreateWorkItemOptions, WorkItem } from '../types';
/**
 * Create a work item
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @param workItemType The type of work item to create (e.g., "Task", "Bug", "User Story")
 * @param options Options for creating the work item
 * @returns The created work item
 */
export declare function createWorkItem(
  connection: WebApi,
  projectId: string,
  workItemType: string,
  options: CreateWorkItemOptions,
): Promise<WorkItem>;
