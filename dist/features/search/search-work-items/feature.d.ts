import { WebApi } from 'azure-devops-node-api';
import { SearchWorkItemsOptions, WorkItemSearchResponse } from '../types';
/**
 * Search for work items in Azure DevOps projects
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Parameters for searching work items
 * @returns Search results with work item details and highlights
 */
export declare function searchWorkItems(
  connection: WebApi,
  options: SearchWorkItemsOptions,
): Promise<WorkItemSearchResponse>;
