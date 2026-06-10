import { WebApi } from 'azure-devops-node-api';
import { ArtifactResource } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import { PipelineRunArtifact } from './types';
interface ArtifactContainerInfo {
  containerId?: number;
  rootPath?: string;
}
export declare function fetchRunArtifacts(
  connection: WebApi,
  projectId: string,
  runId: number,
  pipelineId?: number,
): Promise<PipelineRunArtifact[]>;
export declare function getArtifactContainerInfo(
  artifact: PipelineRunArtifact,
): ArtifactContainerInfo;
export declare function parseArtifactContainer(
  resource?: ArtifactResource,
): ArtifactContainerInfo;
export {};
