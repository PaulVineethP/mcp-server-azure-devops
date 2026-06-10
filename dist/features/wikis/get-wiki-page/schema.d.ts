import { z } from 'zod';
/**
 * Schema for getting a wiki page from an Azure DevOps wiki
 */
export declare const GetWikiPageSchema: z.ZodObject<
  {
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    wikiId: z.ZodString;
    pagePath: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    wikiId: string;
    pagePath: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  },
  {
    wikiId: string;
    pagePath: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  }
>;
