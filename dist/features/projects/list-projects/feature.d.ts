import { WebApi } from 'azure-devops-node-api';
import { ListProjectsOptions, TeamProject } from '../types';
/**
 * List all projects in the organization
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Optional parameters for listing projects
 * @returns Array of projects
 */
export declare function listProjects(
  connection: WebApi,
  options?: ListProjectsOptions,
): Promise<TeamProject[]>;
