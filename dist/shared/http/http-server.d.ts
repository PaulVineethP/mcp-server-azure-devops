import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export interface HttpServerOptions {
  /** Hostname/interface to bind to (default 127.0.0.1). */
  host: string;
  /** TCP port to listen on (default 3000). */
  port: number;
  /** Additional Host header values to allow (for non-localhost deployments). */
  allowedHosts?: string[];
  /** Factory that returns a fresh MCP Server instance per connection. */
  createServer: () => Server;
}
/**
 * Start the HTTP server and resolve once it is listening.
 */
export declare function startHttpServer(
  options: HttpServerOptions,
): Promise<void>;
