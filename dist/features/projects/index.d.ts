export * from './schemas';
export * from './types';
export * from './get-project';
export * from './get-project-details';
export * from './list-projects';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the projects feature
 */
export declare const isProjectsRequest: RequestIdentifier;
/**
 * Handles projects feature requests
 */
export declare const handleProjectsRequest: RequestHandler;
