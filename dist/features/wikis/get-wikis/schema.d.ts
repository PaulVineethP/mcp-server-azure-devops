import { z } from 'zod';
/**
 * Schema for listing wikis in an Azure DevOps project or organization
 */
export declare const GetWikisSchema: z.ZodObject<
  {
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  },
  {
    projectId?: string | null | undefined;
    organizationId?: string | null | undefined;
  }
>;
