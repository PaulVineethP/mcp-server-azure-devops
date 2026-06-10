import { WebApi } from 'azure-devops-node-api';
/**
 * Creates a WebApi connection for tests with real credentials
 *
 * @returns WebApi connection
 */
export declare function getTestConnection(): Promise<WebApi | null>;
/**
 * Determines if integration tests should be skipped
 *
 * @returns true if integration tests should be skipped
 */
export declare function shouldSkipIntegrationTest(): boolean;
