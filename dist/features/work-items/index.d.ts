export * from './schemas';
export * from './types';
export * from './list-work-items';
export * from './get-work-item';
export * from './create-work-item';
export * from './update-work-item';
export * from './manage-work-item-link';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the work items feature
 */
export declare const isWorkItemsRequest: RequestIdentifier;
/**
 * Handles work items feature requests
 */
export declare const handleWorkItemsRequest: RequestHandler;
