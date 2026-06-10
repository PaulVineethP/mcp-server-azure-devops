import { WebApi } from 'azure-devops-node-api';
import { GetPipelineLogOptions, PipelineLogContent } from '../types';
export declare function getPipelineLog(
  connection: WebApi,
  options: GetPipelineLogOptions,
): Promise<PipelineLogContent>;
