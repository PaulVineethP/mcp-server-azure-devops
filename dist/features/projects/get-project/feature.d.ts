import { WebApi } from 'azure-devops-node-api';
import { TeamProject } from '../types';
/**
 * Get a project by ID or name
 *
 * @param connection The Azure DevOps WebApi connection
 * @param projectId The ID or name of the project
 * @returns The project details
 * @throws {AzureDevOpsResourceNotFoundError} If the project is not found
 */
export declare function getProject(
  connection: WebApi,
  projectId: string,
): Promise<TeamProject>;
