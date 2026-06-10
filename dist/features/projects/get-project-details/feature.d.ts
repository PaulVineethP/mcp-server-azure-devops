import { WebApi } from 'azure-devops-node-api';
import {
  TeamProject,
  WebApiTeam,
} from 'azure-devops-node-api/interfaces/CoreInterfaces';
/**
 * Options for getting project details
 */
export interface GetProjectDetailsOptions {
  projectId: string;
  includeProcess?: boolean;
  includeWorkItemTypes?: boolean;
  includeFields?: boolean;
  includeTeams?: boolean;
  expandTeamIdentity?: boolean;
}
/**
 * Process information with work item types
 */
interface ProcessInfo {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  type: string;
  workItemTypes?: WorkItemTypeInfo[];
  hierarchyInfo?: {
    portfolioBacklogs?: {
      name: string;
      workItemTypes: string[];
    }[];
    requirementBacklog?: {
      name: string;
      workItemTypes: string[];
    };
    taskBacklog?: {
      name: string;
      workItemTypes: string[];
    };
  };
}
/**
 * Work item type information with states and fields
 */
interface WorkItemTypeInfo {
  name: string;
  referenceName: string;
  description?: string;
  isDisabled: boolean;
  states?: {
    name: string;
    color?: string;
    stateCategory: string;
  }[];
  fields?: {
    name: string;
    referenceName: string;
    type: string;
    required?: boolean;
    isIdentity?: boolean;
    isPicklist?: boolean;
    description?: string;
  }[];
}
/**
 * Project details response
 */
interface ProjectDetails extends TeamProject {
  process?: ProcessInfo;
  teams?: WebApiTeam[];
}
/**
 * Get detailed information about a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting project details
 * @returns The project details
 * @throws {AzureDevOpsResourceNotFoundError} If the project is not found
 */
export declare function getProjectDetails(
  connection: WebApi,
  options: GetProjectDetailsOptions,
): Promise<ProjectDetails>;
export {};
