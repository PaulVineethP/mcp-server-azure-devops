# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.0](https://github.com/PaulVineethP/mcp-server-azure-devops/compare/mcp-server-azure-devops-v1.2.0...mcp-server-azure-devops-v1.3.0) (2026-06-10)


### Features

* add HTTP transport (Streamable HTTP + legacy SSE) ([a95e169](https://github.com/PaulVineethP/mcp-server-azure-devops/commit/a95e1696d52db03ccedc4366d31600f55a3794bc))
* make HTTP the default transport (stdio via MCP_TRANSPORT=stdio) ([cd29227](https://github.com/PaulVineethP/mcp-server-azure-devops/commit/cd29227a94cf0d535a3e724930d944ab31286d48))

## [1.2.0] - 2026-06-10

### Changed

- **HTTP is now the default transport.** Running the server with no `MCP_TRANSPORT` set starts the HTTP server (Streamable HTTP at `POST /mcp`, legacy SSE at `GET /sse` + `POST /messages`, health at `GET /health`). Set `MCP_TRANSPORT=stdio` to use the classic stdio transport.

## [1.1.0] - 2026-06-10

### Features

- HTTP transport selectable via `MCP_TRANSPORT=http`, exposing both modern Streamable HTTP (`POST /mcp`) and legacy SSE (`GET /sse` + `POST /messages`), plus a `GET /health` endpoint. The stdio transport remains the default.
- HTTP listener binds to `127.0.0.1` by default with DNS-rebinding protection; configurable via `MCP_HTTP_HOST`, `MCP_HTTP_PORT`, and `MCP_HTTP_ALLOWED_HOSTS`.

## [1.0.0] - 2026-06-10

Initial release.

### Features

- Model Context Protocol (MCP) server for Azure DevOps and on-premises Azure DevOps Server / TFS.
- Authentication via Personal Access Token (PAT), Azure Identity, and Azure CLI.
- Tooling across projects, work items, repositories, pull requests, pipelines, wikis, and search (44 tools).

### Security

- Dependencies updated to remove all known production vulnerabilities.
- Build hardened to exclude test sources from the published output.
