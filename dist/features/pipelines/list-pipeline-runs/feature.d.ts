import { WebApi } from 'azure-devops-node-api';
import { ListPipelineRunsOptions, ListPipelineRunsResult } from '../types';
export declare function listPipelineRuns(
  connection: WebApi,
  options: ListPipelineRunsOptions,
): Promise<ListPipelineRunsResult>;
