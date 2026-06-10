"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequestError = handleRequestError;
exports.handleResponseError = handleResponseError;
const azure_devops_errors_1 = require("./azure-devops-errors");
const axios_1 = __importDefault(require("axios"));
// Create a safe console logging function that won't interfere with MCP protocol
function safeLog(message) {
    process.stderr.write(`${message}\n`);
}
/**
 * Format an Azure DevOps error for display
 *
 * @param error The error to format
 * @returns Formatted error message
 */
function formatAzureDevOpsError(error) {
    let message = `Azure DevOps API Error: ${error.message}`;
    if (error instanceof azure_devops_errors_1.AzureDevOpsValidationError) {
        message = `Validation Error: ${error.message}`;
    }
    else if (error instanceof azure_devops_errors_1.AzureDevOpsResourceNotFoundError) {
        message = `Not Found: ${error.message}`;
    }
    else if (error instanceof azure_devops_errors_1.AzureDevOpsAuthenticationError) {
        message = `Authentication Failed: ${error.message}`;
    }
    else if (error instanceof azure_devops_errors_1.AzureDevOpsPermissionError) {
        message = `Permission Denied: ${error.message}`;
    }
    return message;
}
/**
 * Centralized error handler for Azure DevOps API requests.
 * This function takes an error caught in a try-catch block and converts it
 * into an appropriate AzureDevOpsError subtype with a user-friendly message.
 *
 * @param error - The caught error to handle
 * @param context - Additional context about the operation being performed
 * @returns Never - This function always throws an error
 * @throws {AzureDevOpsError} - Always throws a subclass of AzureDevOpsError
 *
 * @example
 * try {
 *   // Some Azure DevOps API call
 * } catch (error) {
 *   handleRequestError(error, 'getting work item details');
 * }
 */
function handleRequestError(error, context) {
    // If it's already an AzureDevOpsError, rethrow it
    if (error instanceof azure_devops_errors_1.AzureDevOpsError) {
        throw error;
    }
    // Handle Axios errors
    if (axios_1.default.isAxiosError(error)) {
        const axiosError = error;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data;
        const message = data?.message || axiosError.message;
        switch (status) {
            case 400:
                throw new azure_devops_errors_1.AzureDevOpsValidationError(`Invalid request while ${context}: ${message}`, data, { cause: error });
            case 401:
                throw new azure_devops_errors_1.AzureDevOpsAuthenticationError(`Authentication failed while ${context}: ${message}`, { cause: error });
            case 403:
                throw new azure_devops_errors_1.AzureDevOpsPermissionError(`Permission denied while ${context}: ${message}`, { cause: error });
            case 404:
                throw new azure_devops_errors_1.AzureDevOpsResourceNotFoundError(`Resource not found while ${context}: ${message}`, { cause: error });
            default:
                throw new azure_devops_errors_1.AzureDevOpsError(`Failed while ${context}: ${message}`, {
                    cause: error,
                });
        }
    }
    // Handle all other errors
    throw new azure_devops_errors_1.AzureDevOpsError(`Unexpected error while ${context}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
}
/**
 * Handles errors from feature request handlers and returns a formatted response
 * instead of throwing an error. This is used in the server's request handlers.
 *
 * @param error The error to handle
 * @returns A formatted error response
 */
function handleResponseError(error) {
    safeLog(`Error handling request: ${error}`);
    const errorMessage = (0, azure_devops_errors_1.isAzureDevOpsError)(error)
        ? formatAzureDevOpsError(error)
        : `Error: ${error instanceof Error ? error.message : String(error)}`;
    return {
        content: [{ type: 'text', text: errorMessage }],
    };
}
//# sourceMappingURL=handle-request-error.js.map