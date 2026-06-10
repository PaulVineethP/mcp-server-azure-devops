import { WebApi } from 'azure-devops-node-api';
export declare function coercePipelineId(id: unknown): number | undefined;
export declare function resolvePipelineId(
  connection: WebApi,
  projectId: string,
  runId: number,
  providedPipelineId?: number,
): Promise<number | undefined>;
