import { z } from 'zod';
/**
 * Schema for the listPipelines function
 */
export declare const ListPipelinesSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    top: z.ZodOptional<z.ZodNumber>;
    orderBy: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string | undefined;
    top?: number | undefined;
    orderBy?: string | undefined;
  },
  {
    projectId?: string | undefined;
    top?: number | undefined;
    orderBy?: string | undefined;
  }
>;
