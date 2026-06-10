import { z } from 'zod';
/**
 * Schema for creating a pull request
 */
export declare const CreatePullRequestSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sourceRefName: z.ZodString;
    targetRefName: z.ZodString;
    reviewers: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    workItemRefs: z.ZodOptional<z.ZodArray<z.ZodNumber, 'many'>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    additionalProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    title: string;
    repositoryId: string;
    sourceRefName: string;
    targetRefName: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    description?: string | undefined;
    reviewers?: string[] | undefined;
    isDraft?: boolean | undefined;
    workItemRefs?: number[] | undefined;
    tags?: string[] | undefined;
    additionalProperties?: Record<string, any> | undefined;
  },
  {
    title: string;
    repositoryId: string;
    sourceRefName: string;
    targetRefName: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    description?: string | undefined;
    reviewers?: string[] | undefined;
    isDraft?: boolean | undefined;
    workItemRefs?: number[] | undefined;
    tags?: string[] | undefined;
    additionalProperties?: Record<string, any> | undefined;
  }
>;
/**
 * Schema for getting a pull request by ID (no repositoryId required)
 */
export declare const GetPullRequestSchema: z.ZodObject<
  {
    projectId: z.ZodString;
    organizationId: z.ZodOptional<z.ZodString>;
    pullRequestId: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId: string;
    pullRequestId: number;
    organizationId?: string | undefined;
  },
  {
    projectId: string;
    pullRequestId: number;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for listing pull requests
 */
export declare const ListPullRequestsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    status: z.ZodOptional<
      z.ZodEnum<['all', 'active', 'completed', 'abandoned']>
    >;
    creatorId: z.ZodOptional<z.ZodString>;
    reviewerId: z.ZodOptional<z.ZodString>;
    sourceRefName: z.ZodOptional<z.ZodString>;
    targetRefName: z.ZodOptional<z.ZodString>;
    top: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    top: number;
    repositoryId: string;
    status?: 'all' | 'active' | 'completed' | 'abandoned' | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    skip?: number | undefined;
    sourceRefName?: string | undefined;
    targetRefName?: string | undefined;
    creatorId?: string | undefined;
    reviewerId?: string | undefined;
  },
  {
    repositoryId: string;
    status?: 'all' | 'active' | 'completed' | 'abandoned' | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    sourceRefName?: string | undefined;
    targetRefName?: string | undefined;
    creatorId?: string | undefined;
    reviewerId?: string | undefined;
  }
>;
/**
 * Schema for getting pull request comments
 */
export declare const GetPullRequestCommentsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    pullRequestId: z.ZodNumber;
    threadId: z.ZodOptional<z.ZodNumber>;
    includeDeleted: z.ZodOptional<z.ZodBoolean>;
    top: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    threadId?: number | undefined;
    includeDeleted?: boolean | undefined;
  },
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    threadId?: number | undefined;
    includeDeleted?: boolean | undefined;
  }
>;
/**
 * Schema for adding a comment to a pull request
 */
export declare const AddPullRequestCommentSchema: z.ZodEffects<
  z.ZodObject<
    {
      projectId: z.ZodOptional<z.ZodString>;
      organizationId: z.ZodOptional<z.ZodString>;
      repositoryId: z.ZodOptional<z.ZodString>;
      pullRequestId: z.ZodNumber;
      content: z.ZodString;
      threadId: z.ZodOptional<z.ZodNumber>;
      parentCommentId: z.ZodOptional<z.ZodNumber>;
      filePath: z.ZodOptional<z.ZodString>;
      lineNumber: z.ZodOptional<z.ZodNumber>;
      status: z.ZodOptional<
        z.ZodEnum<
          [
            'active',
            'fixed',
            'wontFix',
            'closed',
            'pending',
            'byDesign',
            'unknown',
          ]
        >
      >;
    },
    'strip',
    z.ZodTypeAny,
    {
      content: string;
      pullRequestId: number;
      status?:
        | 'unknown'
        | 'active'
        | 'fixed'
        | 'wontFix'
        | 'closed'
        | 'pending'
        | 'byDesign'
        | undefined;
      projectId?: string | undefined;
      organizationId?: string | undefined;
      repositoryId?: string | undefined;
      threadId?: number | undefined;
      parentCommentId?: number | undefined;
      filePath?: string | undefined;
      lineNumber?: number | undefined;
    },
    {
      content: string;
      pullRequestId: number;
      status?:
        | 'unknown'
        | 'active'
        | 'fixed'
        | 'wontFix'
        | 'closed'
        | 'pending'
        | 'byDesign'
        | undefined;
      projectId?: string | undefined;
      organizationId?: string | undefined;
      repositoryId?: string | undefined;
      threadId?: number | undefined;
      parentCommentId?: number | undefined;
      filePath?: string | undefined;
      lineNumber?: number | undefined;
    }
  >,
  {
    content: string;
    pullRequestId: number;
    status?:
      | 'unknown'
      | 'active'
      | 'fixed'
      | 'wontFix'
      | 'closed'
      | 'pending'
      | 'byDesign'
      | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    repositoryId?: string | undefined;
    threadId?: number | undefined;
    parentCommentId?: number | undefined;
    filePath?: string | undefined;
    lineNumber?: number | undefined;
  },
  {
    content: string;
    pullRequestId: number;
    status?:
      | 'unknown'
      | 'active'
      | 'fixed'
      | 'wontFix'
      | 'closed'
      | 'pending'
      | 'byDesign'
      | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    repositoryId?: string | undefined;
    threadId?: number | undefined;
    parentCommentId?: number | undefined;
    filePath?: string | undefined;
    lineNumber?: number | undefined;
  }
>;
/**
 * Schema for updating a pull request
 */
export declare const UpdatePullRequestSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    pullRequestId: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<['active', 'abandoned', 'completed']>>;
    isDraft: z.ZodOptional<z.ZodBoolean>;
    addWorkItemIds: z.ZodOptional<z.ZodArray<z.ZodNumber, 'many'>>;
    removeWorkItemIds: z.ZodOptional<z.ZodArray<z.ZodNumber, 'many'>>;
    addReviewers: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    removeReviewers: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    addTags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    removeTags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    additionalProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    pullRequestId: number;
    status?: 'active' | 'completed' | 'abandoned' | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isDraft?: boolean | undefined;
    additionalProperties?: Record<string, any> | undefined;
    addWorkItemIds?: number[] | undefined;
    removeWorkItemIds?: number[] | undefined;
    addReviewers?: string[] | undefined;
    removeReviewers?: string[] | undefined;
    addTags?: string[] | undefined;
    removeTags?: string[] | undefined;
  },
  {
    repositoryId: string;
    pullRequestId: number;
    status?: 'active' | 'completed' | 'abandoned' | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isDraft?: boolean | undefined;
    additionalProperties?: Record<string, any> | undefined;
    addWorkItemIds?: number[] | undefined;
    removeWorkItemIds?: number[] | undefined;
    addReviewers?: string[] | undefined;
    removeReviewers?: string[] | undefined;
    addTags?: string[] | undefined;
    removeTags?: string[] | undefined;
  }
>;
/**
 * Schema for getting pull request changes and policy evaluations
 */
export declare const GetPullRequestChangesSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    pullRequestId: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for retrieving pull request status checks and policy evaluations
 */
export declare const GetPullRequestChecksSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    pullRequestId: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    pullRequestId: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
export declare const PullRequestFileChangeSchema: z.ZodObject<
  {
    path: z.ZodString;
    patch: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    patch: string;
    path: string;
  },
  {
    patch: string;
    path: string;
  }
>;
export declare const GetPullRequestChangesResponseSchema: z.ZodObject<
  {
    changes: z.ZodAny;
    evaluations: z.ZodArray<z.ZodAny, 'many'>;
    files: z.ZodArray<
      z.ZodObject<
        {
          path: z.ZodString;
          patch: z.ZodString;
        },
        'strip',
        z.ZodTypeAny,
        {
          patch: string;
          path: string;
        },
        {
          patch: string;
          path: string;
        }
      >,
      'many'
    >;
    sourceRefName: z.ZodOptional<z.ZodString>;
    targetRefName: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    evaluations: any[];
    files: {
      patch: string;
      path: string;
    }[];
    changes?: any;
    sourceRefName?: string | undefined;
    targetRefName?: string | undefined;
  },
  {
    evaluations: any[];
    files: {
      patch: string;
      path: string;
    }[];
    changes?: any;
    sourceRefName?: string | undefined;
    targetRefName?: string | undefined;
  }
>;
