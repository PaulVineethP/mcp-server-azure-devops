import { WebApi } from 'azure-devops-node-api';
import { GetPipelineRunOptions, PipelineRunDetails } from '../types';
export declare function getPipelineRun(
  connection: WebApi,
  options: GetPipelineRunOptions,
): Promise<PipelineRunDetails>;
