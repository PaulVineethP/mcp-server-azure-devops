import { z } from 'zod';
/**
 * Schema for getting a work item
 */
export declare const GetWorkItemSchema: z.ZodObject<
  {
    workItemId: z.ZodNumber;
    expand: z.ZodOptional<
      z.ZodEnum<['none', 'relations', 'fields', 'links', 'all']>
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    workItemId: number;
    expand?: 'none' | 'relations' | 'fields' | 'links' | 'all' | undefined;
  },
  {
    workItemId: number;
    expand?: 'none' | 'relations' | 'fields' | 'links' | 'all' | undefined;
  }
>;
/**
 * Schema for listing work items
 */
export declare const ListWorkItemsSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    wiql: z.ZodOptional<z.ZodString>;
    top: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    teamId?: string | undefined;
    queryId?: string | undefined;
    wiql?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
  },
  {
    projectId?: string | undefined;
    organizationId?: string | undefined;
    teamId?: string | undefined;
    queryId?: string | undefined;
    wiql?: string | undefined;
    top?: number | undefined;
    skip?: number | undefined;
  }
>;
/**
 * Schema for creating a work item
 */
export declare const CreateWorkItemSchema: z.ZodObject<
  {
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    workItemType: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    assignedTo: z.ZodOptional<z.ZodString>;
    areaPath: z.ZodOptional<z.ZodString>;
    iterationPath: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNumber>;
    parentId: z.ZodOptional<z.ZodNumber>;
    additionalFields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    workItemType: string;
    title: string;
    priority?: number | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    description?: string | undefined;
    assignedTo?: string | undefined;
    areaPath?: string | undefined;
    iterationPath?: string | undefined;
    parentId?: number | undefined;
    additionalFields?: Record<string, any> | undefined;
  },
  {
    workItemType: string;
    title: string;
    priority?: number | undefined;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    description?: string | undefined;
    assignedTo?: string | undefined;
    areaPath?: string | undefined;
    iterationPath?: string | undefined;
    parentId?: number | undefined;
    additionalFields?: Record<string, any> | undefined;
  }
>;
/**
 * Schema for updating a work item
 */
export declare const UpdateWorkItemSchema: z.ZodObject<
  {
    workItemId: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    assignedTo: z.ZodOptional<z.ZodString>;
    areaPath: z.ZodOptional<z.ZodString>;
    iterationPath: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodString>;
    additionalFields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    workItemId: number;
    priority?: number | undefined;
    title?: string | undefined;
    description?: string | undefined;
    assignedTo?: string | undefined;
    areaPath?: string | undefined;
    iterationPath?: string | undefined;
    additionalFields?: Record<string, any> | undefined;
    state?: string | undefined;
  },
  {
    workItemId: number;
    priority?: number | undefined;
    title?: string | undefined;
    description?: string | undefined;
    assignedTo?: string | undefined;
    areaPath?: string | undefined;
    iterationPath?: string | undefined;
    additionalFields?: Record<string, any> | undefined;
    state?: string | undefined;
  }
>;
/**
 * Schema for managing work item links
 */
export declare const ManageWorkItemLinkSchema: z.ZodObject<
  {
    sourceWorkItemId: z.ZodNumber;
    targetWorkItemId: z.ZodNumber;
    projectId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    operation: z.ZodEnum<['add', 'remove', 'update']>;
    relationType: z.ZodString;
    newRelationType: z.ZodOptional<z.ZodString>;
    comment: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    sourceWorkItemId: number;
    targetWorkItemId: number;
    operation: 'add' | 'remove' | 'update';
    relationType: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    newRelationType?: string | undefined;
    comment?: string | undefined;
  },
  {
    sourceWorkItemId: number;
    targetWorkItemId: number;
    operation: 'add' | 'remove' | 'update';
    relationType: string;
    projectId?: string | undefined;
    organizationId?: string | undefined;
    newRelationType?: string | undefined;
    comment?: string | undefined;
  }
>;
