import { WebApi } from 'azure-devops-node-api';
import { Run, TriggerPipelineOptions } from '../types';
/**
 * Trigger a pipeline run
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for triggering a pipeline
 * @returns The run details
 */
export declare function triggerPipeline(
  connection: WebApi,
  options: TriggerPipelineOptions,
): Promise<Run>;
