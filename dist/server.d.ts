import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfig } from './shared/types';
/**
 * Type definition for the Azure DevOps MCP Server
 */
export type AzureDevOpsServer = Server;
/**
 * Create an Azure DevOps MCP Server
 *
 * @param config The Azure DevOps configuration
 * @returns A configured MCP server instance
 */
export declare function createAzureDevOpsServer(
  config: AzureDevOpsConfig,
): Server;
/**
 * Create a connection to Azure DevOps
 *
 * @param config The configuration to use
 * @returns A WebApi connection
 */
export declare function getConnection(
  config: AzureDevOpsConfig,
): Promise<WebApi>;
