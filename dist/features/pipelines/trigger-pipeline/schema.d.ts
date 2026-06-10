import { z } from 'zod';
/**
 * Schema for the triggerPipeline function
 */
export declare const TriggerPipelineSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    pipelineId: z.ZodNumber;
    branch: z.ZodOptional<z.ZodString>;
    variables: z.ZodOptional<
      z.ZodRecord<
        z.ZodString,
        z.ZodObject<
          {
            value: z.ZodString;
            isSecret: z.ZodOptional<z.ZodBoolean>;
          },
          'strip',
          z.ZodTypeAny,
          {
            value: string;
            isSecret?: boolean | undefined;
          },
          {
            value: string;
            isSecret?: boolean | undefined;
          }
        >
      >
    >;
    templateParameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    stagesToSkip: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    pipelineId: number;
    projectId?: string | undefined;
    branch?: string | undefined;
    templateParameters?: Record<string, string> | undefined;
    variables?:
      | Record<
          string,
          {
            value: string;
            isSecret?: boolean | undefined;
          }
        >
      | undefined;
    stagesToSkip?: string[] | undefined;
  },
  {
    pipelineId: number;
    projectId?: string | undefined;
    branch?: string | undefined;
    templateParameters?: Record<string, string> | undefined;
    variables?:
      | Record<
          string,
          {
            value: string;
            isSecret?: boolean | undefined;
          }
        >
      | undefined;
    stagesToSkip?: string[] | undefined;
  }
>;
