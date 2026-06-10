import { WebApi } from 'azure-devops-node-api';
import { ListWorkItemsOptions, WorkItem as WorkItemType } from '../types';
/**
 * List work items in a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for listing work items
 * @returns List of work items
 */
export declare function listWorkItems(
  connection: WebApi,
  options: ListWorkItemsOptions,
): Promise<WorkItemType[]>;
