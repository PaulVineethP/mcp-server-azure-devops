import { WebApi } from 'azure-devops-node-api';
import { GetPipelineOptions, Pipeline } from '../types';
/**
 * Get a specific pipeline by ID
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting a pipeline
 * @returns Pipeline details
 */
export declare function getPipeline(
  connection: WebApi,
  options: GetPipelineOptions,
): Promise<Pipeline>;
