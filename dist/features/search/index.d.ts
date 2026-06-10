export * from './schemas';
export * from './types';
export * from './search-code';
export * from './search-wiki';
export * from './search-work-items';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the search feature
 */
export declare const isSearchRequest: RequestIdentifier;
/**
 * Handles search feature requests
 */
export declare const handleSearchRequest: RequestHandler;
