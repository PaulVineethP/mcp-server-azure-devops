import { WebApi } from 'azure-devops-node-api';
import { PullRequest } from '../types';
export declare function getPullRequest(
  connection: WebApi,
  options: {
    projectId: string;
    pullRequestId: number;
  },
): Promise<PullRequest>;
