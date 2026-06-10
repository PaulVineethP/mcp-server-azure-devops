import { WebApi } from 'azure-devops-node-api';
import { CreateCommitOptions } from '../types';
/**
 * Create a commit with multiple file changes
 */
export declare function createCommit(
  connection: WebApi,
  options: CreateCommitOptions,
): Promise<void>;
