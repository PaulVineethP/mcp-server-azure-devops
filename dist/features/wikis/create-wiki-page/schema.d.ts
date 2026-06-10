import { z } from 'zod';
/**
 * Schema for creating a new wiki page in Azure DevOps
 */
export declare const CreateWikiPageSchema: z.ZodObject<
  {
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    wikiId: z.ZodString;
    pagePath: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    content: z.ZodString;
    comment: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    content: string;
    wikiId: string;
    pagePath: string | null;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    comment?: string | undefined;
  },
  {
    content: string;
    wikiId: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    comment?: string | undefined;
    pagePath?: string | null | undefined;
  }
>;
