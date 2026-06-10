import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfig } from '../types';
/**
 * Creates a WebApi connection for tests with real credentials
 *
 * @returns WebApi connection
 */
export declare function getTestConnection(): Promise<WebApi | null>;
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
