/**
 * Users feature module
 *
 * This module contains user-related functionality.
 */
export * from './types';
export * from './get-me';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the users feature
 */
export declare const isUsersRequest: RequestIdentifier;
/**
 * Handles users feature requests
 */
export declare const handleUsersRequest: RequestHandler;
