/**
 * HTTP transport for the Azure DevOps MCP Server.
 *
 * Exposes the server over HTTP using two MCP transports:
 *   - Streamable HTTP (modern, recommended):  POST /mcp
 *   - SSE (legacy, deprecated):               GET /sse  +  POST /messages
 *
 * The server still authenticates to Azure DevOps with the configured method
 * (PAT / Azure Identity / Azure CLI); only the client<->server transport
 * changes here. Because the running process holds Azure DevOps credentials,
 * the HTTP listener binds to localhost by default and enables DNS-rebinding
 * protection.
 */
import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

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

function writeJson(
  res: ServerResponse,
  status: number,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

/**
 * Start the HTTP server and resolve once it is listening.
 */
export async function startHttpServer(
  options: HttpServerOptions,
): Promise<void> {
  const { host, port, createServer } = options;

  // Host header values permitted by DNS-rebinding protection.
  const allowedHosts = Array.from(
    new Set([
      `${host}:${port}`,
      `127.0.0.1:${port}`,
      `localhost:${port}`,
      ...(options.allowedHosts ?? []),
    ]),
  );

  // Active SSE transports keyed by their session id.
  const sseTransports: Record<string, SSEServerTransport> = {};

  const httpServer = createHttpServer(
    (req: IncomingMessage, res: ServerResponse) => {
      void handleRequest(req, res);
    },
  );

  async function handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      const url = new URL(
        req.url ?? '/',
        `http://${req.headers.host ?? `${host}:${port}`}`,
      );
      const pathname = url.pathname;

      // Health check.
      if (req.method === 'GET' && pathname === '/health') {
        writeJson(res, 200, { status: 'ok' });
        return;
      }

      // --- Streamable HTTP (modern), stateless one-shot per request ---
      if (pathname === '/mcp') {
        if (req.method !== 'POST') {
          writeJson(
            res,
            405,
            {
              jsonrpc: '2.0',
              error: { code: -32000, message: 'Method not allowed.' },
              id: null,
            },
            { Allow: 'POST' },
          );
          return;
        }

        const server = createServer();
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined, // stateless
          enableDnsRebindingProtection: true,
          allowedHosts,
        });
        res.on('close', () => {
          void transport.close();
          void server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res);
        return;
      }

      // --- SSE (legacy) open stream ---
      if (req.method === 'GET' && pathname === '/sse') {
        const transport = new SSEServerTransport('/messages', res);
        sseTransports[transport.sessionId] = transport;
        res.on('close', () => {
          delete sseTransports[transport.sessionId];
        });
        const server = createServer();
        await server.connect(transport);
        return;
      }

      // --- SSE (legacy) client->server messages ---
      if (req.method === 'POST' && pathname === '/messages') {
        const sessionId = url.searchParams.get('sessionId') ?? '';
        const transport = sseTransports[sessionId];
        if (!transport) {
          writeJson(res, 400, {
            error: 'No active SSE session for the provided sessionId.',
          });
          return;
        }
        await transport.handlePostMessage(req, res);
        return;
      }

      writeJson(res, 404, { error: 'Not found' });
    } catch (error) {
      process.stderr.write(`HTTP handler error: ${error}\n`);
      if (!res.headersSent) {
        writeJson(res, 500, { error: 'Internal server error' });
      }
    }
  }

  await new Promise<void>((resolve) => {
    httpServer.listen(port, host, () => resolve());
  });

  process.stderr.write(
    `Azure DevOps MCP Server running on http://${host}:${port}\n` +
      `  Streamable HTTP: POST http://${host}:${port}/mcp\n` +
      `  SSE (legacy):    GET  http://${host}:${port}/sse  (POST /messages)\n` +
      `  Health:          GET  http://${host}:${port}/health\n`,
  );
}
