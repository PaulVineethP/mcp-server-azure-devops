export * from './schemas';
export * from './types';
export * from './create-pull-request';
export * from './get-pull-request';
export * from './list-pull-requests';
export * from './get-pull-request-comments';
export * from './add-pull-request-comment';
export * from './update-pull-request';
export * from './get-pull-request-changes';
export * from './get-pull-request-checks';
export * from './tool-definitions';
import {
  RequestIdentifier,
  RequestHandler,
} from '../../shared/types/request-handler';
/**
 * Checks if the request is for the pull requests feature
 */
export declare const isPullRequestsRequest: RequestIdentifier;
/**
 * Handles pull requests feature requests
 */
export declare const handlePullRequestsRequest: RequestHandler;
