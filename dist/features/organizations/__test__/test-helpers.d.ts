import { AzureDevOpsConfig } from '../../../shared/types';
/**
 * Creates test configuration for Azure DevOps tests
 *
 * @returns Azure DevOps config
 */
export declare function getTestConfig(): AzureDevOpsConfig | null;
/**
 * Determines if integration tests should be skipped
 *
 * @returns true if integration tests should be skipped
 */
export declare function shouldSkipIntegrationTest(): boolean;
