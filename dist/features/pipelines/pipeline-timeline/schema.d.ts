import { z } from 'zod';
export declare const GetPipelineTimelineSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    runId: z.ZodNumber;
    timelineId: z.ZodOptional<z.ZodString>;
    pipelineId: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<
      z.ZodUnion<
        [
          z.ZodEnum<['pending', 'inProgress', 'completed']>,
          z.ZodArray<z.ZodEnum<['pending', 'inProgress', 'completed']>, 'many'>,
        ]
      >
    >;
    result: z.ZodOptional<
      z.ZodUnion<
        [
          z.ZodEnum<
            [
              'succeeded',
              'succeededWithIssues',
              'failed',
              'canceled',
              'skipped',
              'abandoned',
            ]
          >,
          z.ZodArray<
            z.ZodEnum<
              [
                'succeeded',
                'succeededWithIssues',
                'failed',
                'canceled',
                'skipped',
                'abandoned',
              ]
            >,
            'many'
          >,
        ]
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    runId: number;
    projectId?: string | undefined;
    state?:
      | 'completed'
      | 'pending'
      | 'inProgress'
      | ('completed' | 'pending' | 'inProgress')[]
      | undefined;
    pipelineId?: number | undefined;
    result?:
      | 'abandoned'
      | 'succeeded'
      | 'failed'
      | 'canceled'
      | 'succeededWithIssues'
      | 'skipped'
      | (
          | 'abandoned'
          | 'succeeded'
          | 'failed'
          | 'canceled'
          | 'succeededWithIssues'
          | 'skipped'
        )[]
      | undefined;
    timelineId?: string | undefined;
  },
  {
    runId: number;
    projectId?: string | undefined;
    state?:
      | 'completed'
      | 'pending'
      | 'inProgress'
      | ('completed' | 'pending' | 'inProgress')[]
      | undefined;
    pipelineId?: number | undefined;
    result?:
      | 'abandoned'
      | 'succeeded'
      | 'failed'
      | 'canceled'
      | 'succeededWithIssues'
      | 'skipped'
      | (
          | 'abandoned'
          | 'succeeded'
          | 'failed'
          | 'canceled'
          | 'succeededWithIssues'
          | 'skipped'
        )[]
      | undefined;
    timelineId?: string | undefined;
  }
>;
