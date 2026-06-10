import { z } from 'zod';
/**
 * Schema for the getPipeline function
 */
export declare const GetPipelineSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    pipelineId: z.ZodNumber;
    pipelineVersion: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    pipelineId: number;
    projectId?: string | undefined;
    pipelineVersion?: number | undefined;
  },
  {
    pipelineId: number;
    projectId?: string | undefined;
    pipelineVersion?: number | undefined;
  }
>;
