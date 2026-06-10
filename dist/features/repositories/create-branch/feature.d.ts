import { WebApi } from 'azure-devops-node-api';
import { CreateBranchOptions } from '../types';
/**
 * Create a new branch from an existing one
 */
export declare function createBranch(
  connection: WebApi,
  options: CreateBranchOptions,
): Promise<void>;
