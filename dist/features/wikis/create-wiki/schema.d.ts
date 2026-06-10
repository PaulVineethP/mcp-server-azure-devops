import { z } from 'zod';
/**
 * Wiki types for creating wiki
 */
export declare enum WikiType {
  /**
   * The wiki is published from a git repository
   */
  CodeWiki = 'codeWiki',
  /**
   * The wiki is provisioned for the team project
   */
  ProjectWiki = 'projectWiki',
}
/**
 * Schema for creating a wiki in an Azure DevOps project
 */
export declare const CreateWikiSchema: z.ZodEffects<
  z.ZodObject<
    {
      organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
      projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
      name: z.ZodString;
      type: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof WikiType>>>;
      repositoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
      mappedPath: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    },
    'strip',
    z.ZodTypeAny,
    {
      name: string;
      type: WikiType;
      mappedPath: string | null;
      projectId?: string | null | undefined;
      organizationId?: string | null | undefined;
      repositoryId?: string | null | undefined;
    },
    {
      name: string;
      type?: WikiType | undefined;
      projectId?: string | null | undefined;
      organizationId?: string | null | undefined;
      repositoryId?: string | null | undefined;
      mappedPath?: string | null | undefined;
    }
  >,
  {
    name: string;
    type: WikiType;
    mappedPath: string | null;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    repositoryId?: string | null | undefined;
  },
  {
    name: string;
    type?: WikiType | undefined;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    repositoryId?: string | null | undefined;
    mappedPath?: string | null | undefined;
  }
>;
