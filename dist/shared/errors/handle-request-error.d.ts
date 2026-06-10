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
export declare function handleRequestError(
  error: unknown,
  context: string,
): never;
/**
 * Handles errors from feature request handlers and returns a formatted response
 * instead of throwing an error. This is used in the server's request handlers.
 *
 * @param error The error to handle
 * @returns A formatted error response
 */
export declare function handleResponseError(error: unknown): {
  content: Array<{
    type: string;
    text: string;
  }>;
};
