export { getWikis, GetWikisSchema } from './get-wikis';
export { getWikiPage, GetWikiPageSchema } from './get-wiki-page';
export { createWiki, CreateWikiSchema, WikiType } from './create-wiki';
export { updateWikiPage, UpdateWikiPageSchema } from './update-wiki-page';
export { listWikiPages, ListWikiPagesSchema } from './list-wiki-pages';
export { createWikiPage, CreateWikiPageSchema } from './create-wiki-page';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the wikis feature
 */
export declare const isWikisRequest: RequestIdentifier;
/**
 * Handles wikis feature requests
 */
export declare const handleWikisRequest: RequestHandler;
