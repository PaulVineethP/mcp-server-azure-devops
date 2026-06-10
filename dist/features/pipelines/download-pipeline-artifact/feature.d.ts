import { WebApi } from 'azure-devops-node-api';
import {
  DownloadPipelineArtifactOptions,
  PipelineArtifactContent,
} from '../types';
export declare function downloadPipelineArtifact(
  connection: WebApi,
  options: DownloadPipelineArtifactOptions,
): Promise<PipelineArtifactContent>;
