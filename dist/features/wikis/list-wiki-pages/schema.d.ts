import { z } from 'zod';
/**
 * Schema for listing wiki pages from an Azure DevOps wiki
 */
export declare const ListWikiPagesSchema: z.ZodObject<
  {
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    wikiId: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    wikiId: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  },
  {
    wikiId: string;
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  }
>;
export type ListWikiPagesOptions = z.infer<typeof ListWikiPagesSchema>;
