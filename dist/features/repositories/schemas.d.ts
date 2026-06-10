import { z } from 'zod';
/**
 * Schema for getting a repository
 */
export declare const GetRepositorySchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for getting detailed repository information
 */
export declare const GetRepositoryDetailsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    includeStatistics: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeRefs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    refFilter: z.ZodOptional<z.ZodString>;
    branchName: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    includeStatistics: boolean;
    includeRefs: boolean;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    refFilter?: string | undefined;
    branchName?: string | undefined;
  },
  {
    repositoryId: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    includeStatistics?: boolean | undefined;
    includeRefs?: boolean | undefined;
    refFilter?: string | undefined;
    branchName?: string | undefined;
  }
>;
/**
 * Schema for listing repositories
 */
export declare const ListRepositoriesSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    includeLinks: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    includeLinks?: boolean | undefined;
  },
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    includeLinks?: boolean | undefined;
  }
>;
/**
 * Schema for getting file content
 */
export declare const GetFileContentSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    path: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    version: z.ZodOptional<z.ZodString>;
    versionType: z.ZodOptional<z.ZodEnum<['branch', 'commit', 'tag']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    path: string;
    repositoryId: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    version?: string | undefined;
    versionType?: 'branch' | 'commit' | 'tag' | undefined;
  },
  {
    repositoryId: string;
    path?: string | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    version?: string | undefined;
    versionType?: 'branch' | 'commit' | 'tag' | undefined;
  }
>;
/**
 * Schema for getting all repositories tree structure
 */
export declare const GetAllRepositoriesTreeSchema: z.ZodObject<
  {
    organizationId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    repositoryPattern: z.ZodOptional<z.ZodString>;
    depth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pattern: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    depth: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    repositoryPattern?: string | undefined;
    pattern?: string | undefined;
  },
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    repositoryPattern?: string | undefined;
    depth?: number | undefined;
    pattern?: string | undefined;
  }
>;
/**
 * Schema for getting a tree for a single repository
 */
export declare const GetRepositoryTreeSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    path: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    depth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    path: string;
    repositoryId: string;
    depth: number;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    path?: string | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    depth?: number | undefined;
  }
>;
/**
 * Schema for creating a new branch
 */
export declare const CreateBranchSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    sourceBranch: z.ZodString;
    newBranch: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    sourceBranch: string;
    newBranch: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    sourceBranch: string;
    newBranch: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for creating a commit with multiple file changes
 */
export declare const CreateCommitSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    branchName: z.ZodString;
    commitMessage: z.ZodString;
    changes: z.ZodArray<
      z.ZodEffects<
        z.ZodObject<
          {
            path: z.ZodOptional<z.ZodString>;
            patch: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
            replace: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            patch?: string | undefined;
            path?: string | undefined;
            search?: string | undefined;
            replace?: string | undefined;
          },
          {
            patch?: string | undefined;
            path?: string | undefined;
            search?: string | undefined;
            replace?: string | undefined;
          }
        >,
        {
          patch?: string | undefined;
          path?: string | undefined;
          search?: string | undefined;
          replace?: string | undefined;
        },
        {
          patch?: string | undefined;
          path?: string | undefined;
          search?: string | undefined;
          replace?: string | undefined;
        }
      >,
      'many'
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    branchName: string;
    commitMessage: string;
    changes: {
      patch?: string | undefined;
      path?: string | undefined;
      search?: string | undefined;
      replace?: string | undefined;
    }[];
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    repositoryId: string;
    branchName: string;
    commitMessage: string;
    changes: {
      patch?: string | undefined;
      path?: string | undefined;
      search?: string | undefined;
      replace?: string | undefined;
    }[];
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for listing commits on a branch
 */
export declare const ListCommitsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    repositoryId: z.ZodString;
    branchName: z.ZodString;
    top: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    repositoryId: string;
    branchName: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
  },
  {
    repositoryId: string;
    branchName: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
  }
>;
