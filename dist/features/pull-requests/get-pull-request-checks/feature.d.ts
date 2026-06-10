import { WebApi } from 'azure-devops-node-api';
export interface PullRequestChecksOptions {
  projectId: string;
  repositoryId: string;
  pullRequestId: number;
}
export interface PipelineReference {
  pipelineId?: number;
  definitionId?: number;
  runId?: number;
  buildId?: number;
  displayName?: string;
  targetUrl?: string;
}
export interface PullRequestStatusCheck {
  id?: number;
  state: string;
  description?: string;
  context?: {
    name?: string;
    genre?: string;
  };
  createdDate?: string;
  updatedDate?: string;
  targetUrl?: string;
  pipeline?: PipelineReference;
}
export interface PullRequestPolicyCheck {
  evaluationId?: string;
  status: string;
  isBlocking?: boolean;
  isEnabled?: boolean;
  configurationId?: number;
  configurationRevision?: number;
  configurationTypeId?: string;
  configurationTypeDisplayName?: string;
  displayName?: string;
  startedDate?: string;
  completedDate?: string;
  message?: string;
  targetUrl?: string;
  pipeline?: PipelineReference;
}
export interface PullRequestChecksResult {
  statuses: PullRequestStatusCheck[];
  policyEvaluations: PullRequestPolicyCheck[];
}
/**
 * Retrieve status checks and policy evaluations for a pull request.
 */
export declare function getPullRequestChecks(
  connection: WebApi,
  options: PullRequestChecksOptions,
): Promise<PullRequestChecksResult>;
