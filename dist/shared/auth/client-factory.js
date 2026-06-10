"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureDevOpsClient = void 0;
const errors_1 = require("../errors");
const auth_factory_1 = require("./auth-factory");
/**
 * Azure DevOps Client
 *
 * Provides access to Azure DevOps APIs using the configured authentication method
 */
class AzureDevOpsClient {
    config;
    clientPromise = null;
    /**
     * Creates a new Azure DevOps client
     *
     * @param config Authentication configuration
     */
    constructor(config) {
        this.config = config;
    }
    /**
     * Get the authenticated Azure DevOps client
     *
     * @returns The authenticated WebApi client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getClient() {
        if (!this.clientPromise) {
            this.clientPromise = (async () => {
                try {
                    return await (0, auth_factory_1.createAuthClient)(this.config);
                }
                catch (error) {
                    // If it's already an AzureDevOpsError, rethrow it
                    if (error instanceof errors_1.AzureDevOpsError) {
                        throw error;
                    }
                    // Otherwise, wrap it in an AzureDevOpsAuthenticationError
                    throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                        ? `Authentication failed: ${error.message}`
                        : 'Authentication failed: Unknown error');
                }
            })();
        }
        return this.clientPromise;
    }
    /**
     * Get the underlying WebApi client
     *
     * @returns The authenticated WebApi client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getWebApiClient() {
        return this.getClient();
    }
    /**
     * Check if the client is authenticated
     *
     * @returns True if the client is authenticated
     */
    async isAuthenticated() {
        try {
            const client = await this.getClient();
            return !!client;
        }
        catch {
            // Any error means we're not authenticated
            return false;
        }
    }
    /**
     * Get the Core API
     *
     * @returns The Core API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getCoreApi() {
        try {
            const client = await this.getClient();
            return await client.getCoreApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Core API: ${error.message}`
                : 'Failed to get Core API: Unknown error');
        }
    }
    /**
     * Get the Git API
     *
     * @returns The Git API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getGitApi() {
        try {
            const client = await this.getClient();
            return await client.getGitApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Git API: ${error.message}`
                : 'Failed to get Git API: Unknown error');
        }
    }
    /**
     * Get the Work Item Tracking API
     *
     * @returns The Work Item Tracking API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getWorkItemTrackingApi() {
        try {
            const client = await this.getClient();
            return await client.getWorkItemTrackingApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Work Item Tracking API: ${error.message}`
                : 'Failed to get Work Item Tracking API: Unknown error');
        }
    }
    /**
     * Get the Build API
     *
     * @returns The Build API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getBuildApi() {
        try {
            const client = await this.getClient();
            return await client.getBuildApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Build API: ${error.message}`
                : 'Failed to get Build API: Unknown error');
        }
    }
    /**
     * Get the Test API
     *
     * @returns The Test API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getTestApi() {
        try {
            const client = await this.getClient();
            return await client.getTestApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Test API: ${error.message}`
                : 'Failed to get Test API: Unknown error');
        }
    }
    /**
     * Get the Release API
     *
     * @returns The Release API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getReleaseApi() {
        try {
            const client = await this.getClient();
            return await client.getReleaseApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Release API: ${error.message}`
                : 'Failed to get Release API: Unknown error');
        }
    }
    /**
     * Get the Task Agent API
     *
     * @returns The Task Agent API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getTaskAgentApi() {
        try {
            const client = await this.getClient();
            return await client.getTaskAgentApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Task Agent API: ${error.message}`
                : 'Failed to get Task Agent API: Unknown error');
        }
    }
    /**
     * Get the Task API
     *
     * @returns The Task API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getTaskApi() {
        try {
            const client = await this.getClient();
            return await client.getTaskApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Task API: ${error.message}`
                : 'Failed to get Task API: Unknown error');
        }
    }
    /**
     * Get the Profile API
     *
     * @returns The Profile API client
     * @throws {AzureDevOpsAuthenticationError} If authentication fails
     */
    async getProfileApi() {
        try {
            const client = await this.getClient();
            return await client.getProfileApi();
        }
        catch (error) {
            // If it's already an AzureDevOpsError, rethrow it
            if (error instanceof errors_1.AzureDevOpsError) {
                throw error;
            }
            // Otherwise, wrap it in an AzureDevOpsAuthenticationError
            throw new errors_1.AzureDevOpsAuthenticationError(error instanceof Error
                ? `Failed to get Profile API: ${error.message}`
                : 'Failed to get Profile API: Unknown error');
        }
    }
}
exports.AzureDevOpsClient = AzureDevOpsClient;
//# sourceMappingURL=client-factory.js.map