import { z } from 'zod';
export declare const DownloadPipelineArtifactSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    runId: z.ZodNumber;
    artifactPath: z.ZodString;
    pipelineId: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    runId: number;
    artifactPath: string;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
  },
  {
    runId: number;
    artifactPath: string;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
  }
>;
