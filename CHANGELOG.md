# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.2] - 2026-06-30

### Fixed

- `install` command now writes VS Code `inputs` prompts for the organization URL (`ado_org_url`) and default project (`ado_project`) instead of inlining empty strings, and references them from the server `env`.
- `install` command writes `AZURE_DEVOPS_API_VERSION` (default `6.0`), overridable via the new `--api-version` flag. The PAT prompt description now notes `(TFS)`, `--org-url` / `--project` become prompt defaults, and existing inputs are preserved on re-run.

## [1.2.1] - 2026-06-10

### Changed

- Published to npm as `mcp-server-azure-devops-onprem`; run with `npx -y mcp-server-azure-devops-onprem` (no clone needed).
- Cross-platform packaging (`prepack`/`prepublishOnly` build without Unix-only `chmod`); `bin` resolves by the published package name.

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
