import { WebApi } from 'azure-devops-node-api';
import { GitPullRequestIterationChanges } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { PolicyEvaluationRecord } from 'azure-devops-node-api/interfaces/PolicyInterfaces';
export interface PullRequestChangesOptions {
  projectId: string;
  repositoryId: string;
  pullRequestId: number;
}
export interface PullRequestChangesResponse {
  changes: GitPullRequestIterationChanges;
  evaluations: PolicyEvaluationRecord[];
  files: Array<{
    path: string;
    patch: string;
  }>;
  sourceRefName?: string;
  targetRefName?: string;
}
/**
 * Retrieve changes and policy evaluation status for a pull request
 */
export declare function getPullRequestChanges(
  connection: WebApi,
  options: PullRequestChangesOptions,
): Promise<PullRequestChangesResponse>;
