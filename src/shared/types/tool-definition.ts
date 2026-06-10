import { JsonSchema7Type } from 'zod-to-json-schema';

/**
 * MCP tool behavior hints. Clients use these (notably `readOnlyHint`) to decide
 * whether a tool can be auto-approved without prompting on every invocation.
 */
export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

/**
 * Represents a tool that can be listed in the ListTools response
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JsonSchema7Type;
  mcp_enabled?: boolean;
  annotations?: ToolAnnotations;
}
