import { WebApi } from 'azure-devops-node-api';
import { ListCommitsOptions, ListCommitsResponse } from '../types';
/**
 * List commits on a branch including their file level diffs
 */
export declare function listCommits(
  connection: WebApi,
  options: ListCommitsOptions,
): Promise<ListCommitsResponse>;
