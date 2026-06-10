import { TeamProject } from 'azure-devops-node-api/interfaces/CoreInterfaces';
/**
 * Options for listing projects
 */
export interface ListProjectsOptions {
  stateFilter?: number;
  top?: number;
  skip?: number;
  continuationToken?: number;
}
export type { TeamProject };
