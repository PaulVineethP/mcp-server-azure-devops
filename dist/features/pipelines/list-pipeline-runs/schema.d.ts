import { z } from 'zod';
export declare const ListPipelineRunsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    pipelineId: z.ZodNumber;
    top: z.ZodDefault<z.ZodNumber>;
    continuationToken: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<
      z.ZodEnum<
        ['notStarted', 'inProgress', 'completed', 'cancelling', 'postponed']
      >
    >;
    result: z.ZodOptional<
      z.ZodEnum<
        ['succeeded', 'partiallySucceeded', 'failed', 'canceled', 'none']
      >
    >;
    createdFrom: z.ZodOptional<z.ZodString>;
    createdTo: z.ZodOptional<z.ZodString>;
    orderBy: z.ZodDefault<z.ZodEnum<['createdDate desc', 'createdDate asc']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    top: number;
    orderBy: 'createdDate desc' | 'createdDate asc';
    pipelineId: number;
    projectId?: string | undefined;
    state?:
      | 'completed'
      | 'notStarted'
      | 'inProgress'
      | 'cancelling'
      | 'postponed'
      | undefined;
    continuationToken?: string | undefined;
    branch?: string | undefined;
    result?:
      | 'none'
      | 'succeeded'
      | 'partiallySucceeded'
      | 'failed'
      | 'canceled'
      | undefined;
    createdFrom?: string | undefined;
    createdTo?: string | undefined;
  },
  {
    pipelineId: number;
    projectId?: string | undefined;
    top?: number | undefined;
    state?:
      | 'completed'
      | 'notStarted'
      | 'inProgress'
      | 'cancelling'
      | 'postponed'
      | undefined;
    continuationToken?: string | undefined;
    branch?: string | undefined;
    orderBy?: 'createdDate desc' | 'createdDate asc' | undefined;
    result?:
      | 'none'
      | 'succeeded'
      | 'partiallySucceeded'
      | 'failed'
      | 'canceled'
      | undefined;
    createdFrom?: string | undefined;
    createdTo?: string | undefined;
  }
>;
