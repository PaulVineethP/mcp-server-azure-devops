import { z } from 'zod';
/**
 * Schema for searching code in Azure DevOps repositories
 */
export declare const SearchCodeSchema: z.ZodObject<
  {
    searchText: z.ZodString;
    organizationId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<
      z.ZodObject<
        {
          Repository: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          Path: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          Branch: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          CodeElement: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          Repository?: string[] | undefined;
          Path?: string[] | undefined;
          Branch?: string[] | undefined;
          CodeElement?: string[] | undefined;
        },
        {
          Repository?: string[] | undefined;
          Path?: string[] | undefined;
          Branch?: string[] | undefined;
          CodeElement?: string[] | undefined;
        }
      >
    >;
    top: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
    includeSnippet: z.ZodDefault<z.ZodBoolean>;
    includeContent: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    top: number;
    skip: number;
    searchText: string;
    includeSnippet: boolean;
    includeContent: boolean;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    filters?:
      | {
          Repository?: string[] | undefined;
          Path?: string[] | undefined;
          Branch?: string[] | undefined;
          CodeElement?: string[] | undefined;
        }
      | undefined;
  },
  {
    searchText: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    filters?:
      | {
          Repository?: string[] | undefined;
          Path?: string[] | undefined;
          Branch?: string[] | undefined;
          CodeElement?: string[] | undefined;
        }
      | undefined;
    includeSnippet?: boolean | undefined;
    includeContent?: boolean | undefined;
  }
>;
/**
 * Schema for searching wiki pages in Azure DevOps projects
 */
export declare const SearchWikiSchema: z.ZodObject<
  {
    searchText: z.ZodString;
    organizationId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<
      z.ZodObject<
        {
          Project: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          Project?: string[] | undefined;
        },
        {
          Project?: string[] | undefined;
        }
      >
    >;
    top: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
    includeFacets: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    top: number;
    skip: number;
    searchText: string;
    includeFacets: boolean;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    filters?:
      | {
          Project?: string[] | undefined;
        }
      | undefined;
  },
  {
    searchText: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    filters?:
      | {
          Project?: string[] | undefined;
        }
      | undefined;
    includeFacets?: boolean | undefined;
  }
>;
/**
 * Schema for searching work items in Azure DevOps projects
 */
export declare const SearchWorkItemsSchema: z.ZodObject<
  {
    searchText: z.ZodString;
    organizationId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<
      z.ZodObject<
        {
          'System.TeamProject': z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          'System.WorkItemType': z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          'System.State': z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          'System.AssignedTo': z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          'System.AreaPath': z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          'System.State'?: string[] | undefined;
          'System.AssignedTo'?: string[] | undefined;
          'System.TeamProject'?: string[] | undefined;
          'System.WorkItemType'?: string[] | undefined;
          'System.AreaPath'?: string[] | undefined;
        },
        {
          'System.State'?: string[] | undefined;
          'System.AssignedTo'?: string[] | undefined;
          'System.TeamProject'?: string[] | undefined;
          'System.WorkItemType'?: string[] | undefined;
          'System.AreaPath'?: string[] | undefined;
        }
      >
    >;
    top: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
    includeFacets: z.ZodDefault<z.ZodBoolean>;
    orderBy: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            field: z.ZodString;
            sortOrder: z.ZodEnum<['ASC', 'DESC']>;
          },
          'strip',
          z.ZodTypeAny,
          {
            field: string;
            sortOrder: 'ASC' | 'DESC';
          },
          {
            field: string;
            sortOrder: 'ASC' | 'DESC';
          }
        >,
        'many'
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    top: number;
    skip: number;
    searchText: string;
    includeFacets: boolean;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    filters?:
      | {
          'System.State'?: string[] | undefined;
          'System.AssignedTo'?: string[] | undefined;
          'System.TeamProject'?: string[] | undefined;
          'System.WorkItemType'?: string[] | undefined;
          'System.AreaPath'?: string[] | undefined;
        }
      | undefined;
    orderBy?:
      | {
          field: string;
          sortOrder: 'ASC' | 'DESC';
        }[]
      | undefined;
  },
  {
    searchText: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
    filters?:
      | {
          'System.State'?: string[] | undefined;
          'System.AssignedTo'?: string[] | undefined;
          'System.TeamProject'?: string[] | undefined;
          'System.WorkItemType'?: string[] | undefined;
          'System.AreaPath'?: string[] | undefined;
        }
      | undefined;
    includeFacets?: boolean | undefined;
    orderBy?:
      | {
          field: string;
          sortOrder: 'ASC' | 'DESC';
        }[]
      | undefined;
  }
>;
