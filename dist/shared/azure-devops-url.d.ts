export type AzureDevOpsUrlType = 'services' | 'server';
export interface AzureDevOpsBaseUrls {
  type: AzureDevOpsUrlType;
  organization?: string;
  collection?: string;
  instanceBaseUrl?: string;
  coreBaseUrl: string;
  searchBaseUrl: string;
  projectFromUrl?: string;
}
interface AzureDevOpsUrlOptions {
  organizationId?: string;
  projectId?: string;
}
export declare function resolveAzureDevOpsBaseUrls(
  serverUrl: string,
  options?: AzureDevOpsUrlOptions,
): AzureDevOpsBaseUrls;
export declare function isAzureDevOpsServicesUrl(serverUrl: string): boolean;
export {};
