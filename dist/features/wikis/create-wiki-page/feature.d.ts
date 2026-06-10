import { z } from 'zod';
import { CreateWikiPageSchema } from './schema';
/**
 * Creates a new wiki page in Azure DevOps.
 * If a page already exists at the specified path, it will be updated.
 *
 * @param {z.infer<typeof CreateWikiPageSchema>} params - The parameters for creating the wiki page.
 * @returns {Promise<any>} A promise that resolves with the API response.
 */
export declare const createWikiPage: (
  params: z.infer<typeof CreateWikiPageSchema>,
  client?: {
    defaults?: {
      organizationId?: string;
      projectId?: string;
    };
    put: (
      url: string,
      data: Record<string, unknown>,
    ) => Promise<{
      data: unknown;
    }>;
  },
) => Promise<any>;
