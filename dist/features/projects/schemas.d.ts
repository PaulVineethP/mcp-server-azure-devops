import { z } from 'zod';
/**
 * Schema for getting a project
 */
export declare const GetProjectSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
  }
>;
/**
 * Schema for getting detailed project information
 */
export declare const GetProjectDetailsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    includeProcess: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeWorkItemTypes: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeFields: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeTeams: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    expandTeamIdentity: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    includeProcess: boolean;
    includeWorkItemTypes: boolean;
    includeFields: boolean;
    includeTeams: boolean;
    expandTeamIdentity: boolean;
    projectId?: string | undefined;
    organizationId?: string | undefined;
  },
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    includeProcess?: boolean | undefined;
    includeWorkItemTypes?: boolean | undefined;
    includeFields?: boolean | undefined;
    includeTeams?: boolean | undefined;
    expandTeamIdentity?: boolean | undefined;
  }
>;
/**
 * Schema for listing projects
 */
export declare const ListProjectsSchema: z.ZodObject<
  {
    organizationId: z.ZodOptional<z.ZodString>;
    stateFilter: z.ZodOptional<z.ZodNumber>;
    top: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    continuationToken: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    stateFilter?: number | undefined;
    continuationToken?: number | undefined;
  },
  {
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    stateFilter?: number | undefined;
    continuationToken?: number | undefined;
  }
>;
