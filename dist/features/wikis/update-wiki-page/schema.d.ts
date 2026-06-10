import { z } from 'zod';
/**
 * Schema for validating wiki page update options
 */
export declare const UpdateWikiPageSchema: z.ZodObject<
  {
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    wikiId: z.ZodString;
    pagePath: z.ZodString;
    content: z.ZodString;
    comment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    content: string;
    wikiId: string;
    pagePath: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    comment?: string | null | undefined;
  },
  {
    content: string;
    wikiId: string;
    pagePath: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
    comment?: string | null | undefined;
  }
>;
