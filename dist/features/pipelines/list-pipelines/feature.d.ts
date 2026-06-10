import { WebApi } from 'azure-devops-node-api';
import { ListPipelinesOptions, Pipeline } from '../types';
/**
 * List pipelines in a project
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for listing pipelines
 * @returns List of pipelines
 */
export declare function listPipelines(
  connection: WebApi,
  options: ListPipelinesOptions,
): Promise<Pipeline[]>;
