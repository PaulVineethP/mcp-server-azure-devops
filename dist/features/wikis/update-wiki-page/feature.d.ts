import { UpdateWikiPageSchema } from './schema';
import { z } from 'zod';
/**
 * Options for updating a wiki page
 */
export type UpdateWikiPageOptions = z.infer<typeof UpdateWikiPageSchema>;
/**
 * Updates a wiki page in Azure DevOps
 * @param options - The options for updating the wiki page
 * @returns The updated wiki page
 */
export declare function updateWikiPage(
  options: UpdateWikiPageOptions,
): Promise<any>;
