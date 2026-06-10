import { WebApi } from 'azure-devops-node-api';
import { UserProfile } from '../types';
/**
 * Get details of the currently authenticated user
 *
 * This function returns basic profile information about the authenticated user.
 *
 * @param connection The Azure DevOps WebApi connection
 * @returns User profile information including id, displayName, and email
 * @throws {AzureDevOpsError} If retrieval of user information fails
 */
export declare function getMe(connection: WebApi): Promise<UserProfile>;
