"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureDevOpsRateLimitError = exports.AzureDevOpsPermissionError = exports.AzureDevOpsResourceNotFoundError = exports.AzureDevOpsValidationError = exports.AzureDevOpsAuthenticationError = exports.AzureDevOpsError = void 0;
exports.isAzureDevOpsError = isAzureDevOpsError;
exports.formatAzureDevOpsError = formatAzureDevOpsError;
/**
 * Base error class for Azure DevOps API errors.
 * All specific Azure DevOps errors should extend this class.
 *
 * @class AzureDevOpsError
 * @extends {Error}
 */
class AzureDevOpsError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'AzureDevOpsError';
    }
}
exports.AzureDevOpsError = AzureDevOpsError;
/**
 * Error thrown when authentication with Azure DevOps fails.
 * This can occur due to invalid credentials, expired tokens, or network issues.
 *
 * @class AzureDevOpsAuthenticationError
 * @extends {AzureDevOpsError}
 */
class AzureDevOpsAuthenticationError extends AzureDevOpsError {
    constructor(message, options) {
        super(message, options);
        this.name = 'AzureDevOpsAuthenticationError';
    }
}
exports.AzureDevOpsAuthenticationError = AzureDevOpsAuthenticationError;
/**
 * Error thrown when input validation fails.
 * This includes invalid parameters, malformed requests, or missing required fields.
 *
 * @class AzureDevOpsValidationError
 * @extends {AzureDevOpsError}
 * @property {ApiErrorResponse} [response] - The raw response from the API containing validation details
 */
class AzureDevOpsValidationError extends AzureDevOpsError {
    response;
    constructor(message, response, options) {
        super(message, options);
        this.name = 'AzureDevOpsValidationError';
        this.response = response;
    }
}
exports.AzureDevOpsValidationError = AzureDevOpsValidationError;
/**
 * Error thrown when a requested resource is not found.
 * This can occur when trying to access non-existent projects, repositories, or work items.
 *
 * @class AzureDevOpsResourceNotFoundError
 * @extends {AzureDevOpsError}
 */
class AzureDevOpsResourceNotFoundError extends AzureDevOpsError {
    constructor(message, options) {
        super(message, options);
        this.name = 'AzureDevOpsResourceNotFoundError';
    }
}
exports.AzureDevOpsResourceNotFoundError = AzureDevOpsResourceNotFoundError;
/**
 * Error thrown when the user lacks permissions for an operation.
 * This occurs when trying to access or modify resources without proper authorization.
 *
 * @class AzureDevOpsPermissionError
 * @extends {AzureDevOpsError}
 */
class AzureDevOpsPermissionError extends AzureDevOpsError {
    constructor(message, options) {
        super(message, options);
        this.name = 'AzureDevOpsPermissionError';
    }
}
exports.AzureDevOpsPermissionError = AzureDevOpsPermissionError;
/**
 * Error thrown when the API rate limit is exceeded.
 * Contains information about when the rate limit will reset.
 *
 * @class AzureDevOpsRateLimitError
 * @extends {AzureDevOpsError}
 * @property {Date} resetAt - The time when the rate limit will reset
 */
class AzureDevOpsRateLimitError extends AzureDevOpsError {
    resetAt;
    constructor(message, resetAt, options) {
        super(message, options);
        this.name = 'AzureDevOpsRateLimitError';
        this.resetAt = resetAt;
    }
}
exports.AzureDevOpsRateLimitError = AzureDevOpsRateLimitError;
/**
 * Helper function to check if an error is an Azure DevOps error.
 * Useful for type narrowing in catch blocks.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an Azure DevOps error
 *
 * @example
 * try {
 *   // Some Azure DevOps operation
 * } catch (error) {
 *   if (isAzureDevOpsError(error)) {
 *     // Handle Azure DevOps specific error
 *   } else {
 *     // Handle other errors
 *   }
 * }
 */
function isAzureDevOpsError(error) {
    return error instanceof AzureDevOpsError;
}
/**
 * Format an Azure DevOps error for display.
 * Provides a consistent error message format across different error types.
 *
 * @param {unknown} error - The error to format
 * @returns {string} A formatted error message
 *
 * @example
 * try {
 *   // Some Azure DevOps operation
 * } catch (error) {
 *   console.error(formatAzureDevOpsError(error));
 * }
 */
function formatAzureDevOpsError(error) {
    // Handle non-error objects
    if (error === null) {
        return 'null';
    }
    if (error === undefined) {
        return 'undefined';
    }
    if (typeof error === 'string') {
        return error;
    }
    if (typeof error === 'number' || typeof error === 'boolean') {
        return String(error);
    }
    // Handle error-like objects
    const errorObj = error;
    let message = `${errorObj.name || 'Unknown'}: ${errorObj.message || 'Unknown error'}`;
    if (error instanceof AzureDevOpsValidationError) {
        if (error.response) {
            message += `\nResponse: ${JSON.stringify(error.response)}`;
        }
        else {
            message += '\nNo response details available';
        }
    }
    else if (error instanceof AzureDevOpsRateLimitError) {
        message += `\nReset at: ${error.resetAt.toISOString()}`;
    }
    return message;
}
//# sourceMappingURL=azure-devops-errors.js.map