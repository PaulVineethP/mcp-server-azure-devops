import { WebApi } from 'azure-devops-node-api';
import { GetPipelineTimelineOptions, PipelineTimeline } from '../types';
export declare function getPipelineTimeline(
  connection: WebApi,
  options: GetPipelineTimelineOptions,
): Promise<PipelineTimeline>;
