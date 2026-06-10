import { z } from 'zod';
export declare const GetPipelineLogSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    runId: z.ZodNumber;
    logId: z.ZodNumber;
    format: z.ZodOptional<z.ZodEnum<['plain', 'json']>>;
    startLine: z.ZodOptional<z.ZodNumber>;
    endLine: z.ZodOptional<z.ZodNumber>;
    pipelineId: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    runId: number;
    logId: number;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
    format?: 'json' | 'plain' | undefined;
    startLine?: number | undefined;
    endLine?: number | undefined;
  },
  {
    runId: number;
    logId: number;
    projectId?: string | undefined;
    pipelineId?: number | undefined;
    format?: 'json' | 'plain' | undefined;
    startLine?: number | undefined;
    endLine?: number | undefined;
  }
>;
