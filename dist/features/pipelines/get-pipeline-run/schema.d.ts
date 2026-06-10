import { z } from 'zod';
export declare const GetPipelineRunSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    runId: z.ZodNumber;
    pipelineId: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    runId: number;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
  },
  {
    runId: number;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
  }
>;
