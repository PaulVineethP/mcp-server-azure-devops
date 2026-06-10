import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { WebApi } from 'azure-devops-node-api';

/**
 * Function type for identifying if a request belongs to a specific feature.
 */
export interface RequestIdentifier {
  (request: CallToolRequest): boolean;
}

/**
 * Function type for handling feature-specific requests.
 * All feature handlers return a simplified text-content response. This shape is
 * still structurally compatible with the MCP server's expected result type.
 */
export interface RequestHandler {
  (
    connection: WebApi,
    request: CallToolRequest,
  ): Promise<{ content: Array<{ type: string; text: string }> }>;
}
