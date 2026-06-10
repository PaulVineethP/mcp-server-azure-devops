/**
 * Base error class for Azure DevOps API errors.
 * All specific Azure DevOps errors should extend this class.
 *
 * @class AzureDevOpsError
 * @extends {Error}
 */
export declare class AzureDevOpsError extends Error {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Error thrown when authentication with Azure DevOps fails.
 * This can occur due to invalid credentials, expired tokens, or network issues.
 *
 * @class AzureDevOpsAuthenticationError
 * @extends {AzureDevOpsError}
 */
export declare class AzureDevOpsAuthenticationError extends AzureDevOpsError {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Type for API response error details
 */
export type ApiErrorResponse = {
  message?: string;
  statusCode?: number;
  details?: unknown;
  [key: string]: unknown;
};
/**
 * Error thrown when input validation fails.
 * This includes invalid parameters, malformed requests, or missing required fields.
 *
 * @class AzureDevOpsValidationError
 * @extends {AzureDevOpsError}
 * @property {ApiErrorResponse} [response] - The raw response from the API containing validation details
 */
export declare class AzureDevOpsValidationError extends AzureDevOpsError {
  response?: ApiErrorResponse;
  constructor(
    message: string,
    response?: ApiErrorResponse,
    options?: ErrorOptions,
  );
}
/**
 * Error thrown when a requested resource is not found.
 * This can occur when trying to access non-existent projects, repositories, or work items.
 *
 * @class AzureDevOpsResourceNotFoundError
 * @extends {AzureDevOpsError}
 */
export declare class AzureDevOpsResourceNotFoundError extends AzureDevOpsError {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Error thrown when the user lacks permissions for an operation.
 * This occurs when trying to access or modify resources without proper authorization.
 *
 * @class AzureDevOpsPermissionError
 * @extends {AzureDevOpsError}
 */
export declare class AzureDevOpsPermissionError extends AzureDevOpsError {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Error thrown when the API rate limit is exceeded.
 * Contains information about when the rate limit will reset.
 *
 * @class AzureDevOpsRateLimitError
 * @extends {AzureDevOpsError}
 * @property {Date} resetAt - The time when the rate limit will reset
 */
export declare class AzureDevOpsRateLimitError extends AzureDevOpsError {
  resetAt: Date;
  constructor(message: string, resetAt: Date, options?: ErrorOptions);
}
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
export declare function isAzureDevOpsError(
  error: unknown,
): error is AzureDevOpsError;
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
export declare function formatAzureDevOpsError(error: unknown): string;
