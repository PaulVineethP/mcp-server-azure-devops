# Azure DevOps MCP Server

A Model Context Protocol (MCP) server implementation for Azure DevOps, allowing AI assistants to interact with Azure DevOps APIs through a standardized protocol.

> Supports **Azure DevOps Server (on-premises / TFS)** via Personal Access Token authentication, as well as Azure DevOps Services (cloud).

## Overview

This server implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) for Azure DevOps, enabling AI assistants like Claude to interact with Azure DevOps resources securely. The server acts as a bridge between AI models and Azure DevOps APIs, providing a standardized way to:

- Access and manage projects, work items, repositories, and more
- Create and update work items, branches, and pull requests
- Execute common DevOps workflows through natural language
- Access repository content via standardized resource URIs
- Safely authenticate and interact with Azure DevOps resources

## Server Structure

The server is structured around the Model Context Protocol (MCP) for communicating with AI assistants. It provides tools for interacting with Azure DevOps resources including:

- Projects
- Work Items
- Repositories
- Pull Requests
- Branches
- Pipelines

### Core Components

- **AzureDevOpsServer**: Main server class that initializes the MCP server and registers tools
- **Feature Modules**: Organized by feature area (work-items, projects, repositories, etc.)
- **Request Handlers**: Each feature module provides request identification and handling functions
- **Tool Handlers**: Modular functions for each Azure DevOps operation
- **Configuration**: Environment-based configuration for organization URL, PAT, etc.

The server uses a feature-based architecture where each feature area (like work-items, projects, repositories) is encapsulated in its own module. This makes the codebase more maintainable and easier to extend with new features.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Azure DevOps account with appropriate access
- Authentication credentials (see [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md) for details):
  - Personal Access Token (PAT), or
  - Azure Identity credentials, or
  - Azure CLI login

### Running from npm (npx)

The server is published to npm, so you can run it without cloning this repository:

```bash
npx -y mcp-server-azure-devops-onprem
```

### Running locally (from source)

```bash
npm ci
cp .env.example .env   # then edit values
npm run build
npm start              # runs: node dist/index.js
```

For iterative development (auto-reload):

```bash
npm run dev            # runs src/index.ts via ts-node-dev
```

### Transports (stdio vs HTTP/SSE)

The server supports two transports, selected with the `MCP_TRANSPORT` environment variable. This only affects how the **MCP client connects to the server** — Azure DevOps authentication (PAT / Azure Identity / Azure CLI) is unchanged.

| `MCP_TRANSPORT` | Description | Endpoints |
| --------------- | ----------- | --------- |
| `http` (default) | HTTP server exposing both modern and legacy transports. | `POST /mcp` (Streamable HTTP), `GET /sse` + `POST /messages` (legacy SSE), `GET /health` |
| `stdio` | Classic stdio; one client per process. | n/a |

HTTP options (used only when `MCP_TRANSPORT=http`):

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `MCP_HTTP_HOST` | `127.0.0.1` | Interface to bind to. Keep on localhost unless fronted by auth + TLS — the process holds Azure DevOps credentials. |
| `MCP_HTTP_PORT` | `3000` | Listening port. |
| `MCP_HTTP_ALLOWED_HOSTS` | _(localhost only)_ | Extra `Host` header values allowed by DNS-rebinding protection (comma-separated), for non-localhost deployments. |

Start it (HTTP is the default transport):

```bash
npm start                          # HTTP on http://127.0.0.1:3000
MCP_HTTP_PORT=8080 npm start       # custom port
MCP_TRANSPORT=stdio npm start      # classic stdio instead
```

Then point an HTTP-capable MCP client at `http://127.0.0.1:3000/mcp` (Streamable HTTP) or `http://127.0.0.1:3000/sse` (legacy SSE). Example VS Code `mcp.json` entry using Streamable HTTP:

```json
{
  "servers": {
    "azureDevOps": {
      "type": "http",
      "url": "http://127.0.0.1:3000/mcp"
    }
  }
}
```

> Security: the HTTP listener binds to `127.0.0.1` by default and enables DNS-rebinding protection. Exposing it on other interfaces makes your Azure DevOps PAT reachable by anyone who can reach the port — only do so behind authentication and TLS.

### Quick install (writes `mcp.json` for you)

Instead of editing `mcp.json` by hand, let the package register itself. This adds an `azureDevOps` server entry **and** a secure `inputs` prompt for your PAT:

```bash
# VS Code user config (default location for your OS)
npx -y mcp-server-azure-devops-onprem install

# or write into the current workspace (.vscode/mcp.json)
npx -y mcp-server-azure-devops-onprem install --workspace

# pre-fill org URL and default project
npx -y mcp-server-azure-devops-onprem install --org-url https://dev.azure.com/your-org --project your-project
```

Options:

| Flag | Description |
| ---- | ----------- |
| `--path <file>` | Explicit path to the `mcp.json` to update. |
| `--workspace` | Write to `./.vscode/mcp.json` in the current directory. |
| `--server-name <id>` | Server key to use (default `azureDevOps`). |
| `--org-url <url>` | Pre-fill `AZURE_DEVOPS_ORG_URL`. |
| `--project <name>` | Pre-fill `AZURE_DEVOPS_DEFAULT_PROJECT`. |

The command is non-destructive: an existing config is backed up to `<mcp.json>.bak` before it is updated, and the PAT input is only added if it is not already present. After running it, fill in `AZURE_DEVOPS_ORG_URL` and restart your MCP client. The resulting entry looks like:

```json
{
  "servers": {
    "azureDevOps": {
      "command": "npx",
      "args": ["-y", "mcp-server-azure-devops-onprem"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "AZURE_DEVOPS_ORG_URL": "",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_DEVOPS_PAT": "${input:ado_pat}",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      },
      "type": "stdio"
    }
  },
  "inputs": [
    {
      "id": "ado_pat",
      "type": "promptString",
      "description": "Azure DevOps Personal Access Token",
      "password": true
    }
  ]
}
```

> `NODE_TLS_REJECT_UNAUTHORIZED: "0"` disables TLS certificate validation — useful for on-prem Azure DevOps Server with self-signed certs, but remove it for cloud/production to keep certificate verification on.

### Tool approvals (auto-approve read-only tools)

Every tool advertises an MCP `readOnlyHint` annotation. Read-only tools (everything that only fetches data — `list_*`, `get_*`, `search_*`, `pipeline_timeline`, `download_pipeline_artifact`) are marked `readOnlyHint: true`, so MCP clients such as VS Code can auto-approve them without prompting on every call.

Mutating tools (`create_*`, `update_*`, `trigger_pipeline`, `manage_work_item_link`, `add_pull_request_comment`) are marked `readOnlyHint: false` and continue to require explicit approval.

In VS Code you can confirm/adjust this per tool from the tool's approval menu; the read-only annotation makes those tools eligible to "Always allow" safely.

### Automatic updates

On startup the server checks the npm registry for a newer published version. If one exists it logs a notice and, by default, starts a best-effort background self-update (`npm install -g mcp-server-azure-devops-onprem@latest`) that takes effect on the next launch. When launched via `npx -y …`, npx also fetches the latest version on each run. Control this with:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `AZURE_DEVOPS_MCP_AUTO_UPDATE` | `true` | Set to `false` to check and notify only (no background update). |
| `AZURE_DEVOPS_MCP_DISABLE_UPDATE_CHECK` | `false` | Set to `true` to skip the update check entirely (e.g. offline/air-gapped). |

The update check never blocks startup and silently ignores network/registry errors.

### Usage with Claude Desktop/Cursor AI

To integrate with Claude Desktop or Cursor AI, add one of the following configurations to your configuration file.

#### Azure Identity Authentication

Be sure you are logged in to Azure CLI with `az login` then add the following:

```json
{
  "mcpServers": {
    "azureDevOps": {
      "command": "npx",
      "args": ["-y", "mcp-server-azure-devops-onprem"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/your-organization",
        "AZURE_DEVOPS_AUTH_METHOD": "azure-identity",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "your-project-name"
      }
    }
  }
}
```

#### Personal Access Token (PAT) Authentication

```json
{
  "mcpServers": {
    "azureDevOps": {
      "command": "npx",
      "args": ["-y", "mcp-server-azure-devops-onprem"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/your-organization",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_DEVOPS_PAT": "<YOUR_PAT>",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "your-project-name"
      }
    }
  }
}
```

Azure DevOps Server (on-prem) requires PAT authentication. Example:

```json
{
  "mcpServers": {
    "azureDevOps": {
      "command": "npx",
      "args": ["-y", "mcp-server-azure-devops-onprem"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "AZURE_DEVOPS_ORG_URL": "https://server:8080/tfs/DefaultCollection",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_DEVOPS_PAT": "<YOUR_PAT>",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "your-project-name"
      }
    }
  }
}
```

For detailed configuration instructions and more authentication options, see the [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md).

## Authentication Methods

This server supports multiple authentication methods for connecting to Azure DevOps APIs. For detailed setup instructions, configuration examples, and troubleshooting tips, see the [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md).

### Supported Authentication Methods

1. **Personal Access Token (PAT)** - Simple token-based authentication
2. **Azure Identity (DefaultAzureCredential)** - Flexible authentication using the Azure Identity SDK
3. **Azure CLI** - Authentication using your Azure CLI login

Example configuration files for each authentication method are available in the [examples directory](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/tree/main/docs/examples).

Azure DevOps Server (on-prem) supports PAT authentication only. Azure Identity and Azure CLI are supported for Azure DevOps Services.

## Environment Variables

For a complete list of environment variables and their descriptions, see the [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md#configuration-reference).

Key environment variables include:

| Variable                       | Description                                                                        | Required                     | Default          |
| ------------------------------ | ---------------------------------------------------------------------------------- | ---------------------------- | ---------------- |
| `AZURE_DEVOPS_AUTH_METHOD`     | Authentication method (`pat`, `azure-identity`, or `azure-cli`) - case-insensitive | No                           | `azure-identity` |
| `AZURE_DEVOPS_ORG_URL`         | Full URL to your Azure DevOps organization or Server collection (e.g., `https://server:8080/tfs/DefaultCollection`) | Yes                          | -                |
| `AZURE_DEVOPS_PAT`             | Personal Access Token (for PAT auth)                                               | Only with PAT auth           | -                |
| `AZURE_DEVOPS_DEFAULT_PROJECT` | Default project if none specified                                                  | No                           | -                |
| `AZURE_DEVOPS_API_VERSION`     | API version to use                                                                 | No                           | Latest           |
| `AZURE_TENANT_ID`              | Azure AD tenant ID (for service principals)                                        | Only with service principals | -                |
| `AZURE_CLIENT_ID`              | Azure AD application ID (for service principals)                                   | Only with service principals | -                |
| `AZURE_CLIENT_SECRET`          | Azure AD client secret (for service principals)                                    | Only with service principals | -                |
| `AZURE_DEVOPS_MCP_AUTO_UPDATE` | Background self-update when a newer version is published (`true`/`false`)           | No                           | `true`           |
| `AZURE_DEVOPS_MCP_DISABLE_UPDATE_CHECK` | Skip the npm version check entirely (`true`/`false`)                      | No                           | `false`          |
| `LOG_LEVEL`                    | Logging level (debug, info, warn, error)                                           | No                           | info             |

## Troubleshooting Authentication

For detailed troubleshooting information for each authentication method, see the [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md#troubleshooting-authentication-issues).

Common issues include:

- Invalid or expired credentials
- Insufficient permissions
- Network connectivity problems
- Configuration errors

## Authentication Implementation Details

For technical details about how authentication is implemented in the Azure DevOps MCP server, see the [Authentication Guide](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/authentication.md) and the source code in the `src/auth` directory.

## Available Tools

The Azure DevOps MCP server provides a variety of tools for interacting with Azure DevOps resources. For detailed documentation on each tool, please refer to the corresponding documentation.

### User Tools

- `get_me`: Get details of the authenticated user (id, displayName, email) (Azure DevOps Services only)

### Organization Tools

- `list_organizations`: List all accessible organizations (Azure DevOps Services only)

### Project Tools

- `list_projects`: List all projects in an organization
- `get_project`: Get details of a specific project
- `get_project_details`: Get comprehensive details of a project including process, work item types, and teams

### Repository Tools

- `list_repositories`: List all repositories in a project
- `get_repository`: Get details of a specific repository
- `get_repository_details`: Get detailed information about a repository including statistics and refs
- `get_file_content`: Get content of a file or directory from a repository
- `get_repository_tree`: List a repository's file tree from any path and depth
- `create_branch`: Create a new branch from an existing one
- `create_commit`: Commit multiple file changes to a branch using unified diffs or search/replace instructions

### Work Item Tools

- `get_work_item`: Retrieve a work item by ID
- `create_work_item`: Create a new work item
- `update_work_item`: Update an existing work item
- `list_work_items`: List work items in a project
- `manage_work_item_link`: Add, remove, or update links between work items

### Search Tools

- `search_code`: Search for code across repositories in a project
- `search_wiki`: Search for content across wiki pages in a project
- `search_work_items`: Search for work items across projects in Azure DevOps

### Pipelines Tools

- `list_pipelines`: List pipelines in a project
- `get_pipeline`: Get details of a specific pipeline
- `list_pipeline_runs`: List recent runs for a pipeline with optional filters
- `get_pipeline_run`: Get detailed run information and artifact summaries
- `download_pipeline_artifact`: Download a single artifact file as text
- `pipeline_timeline`: Retrieve the stage and job timeline for a run
- `get_pipeline_log`: Retrieve raw or JSON-formatted log content
- `trigger_pipeline`: Trigger a pipeline run with customizable parameters

### Wiki Tools

- `get_wikis`: List all wikis in a project
- `get_wiki_page`: Get content of a specific wiki page as plain text

### Pull Request Tools

- [`create_pull_request`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#create_pull_request) - Create a new pull request
- [`get_pull_request`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#get_pull_request) - Get a pull request by ID
- [`list_pull_requests`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#list_pull_requests) - List pull requests in a repository
- [`add_pull_request_comment`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#add_pull_request_comment) - Add a comment to a pull request
- [`get_pull_request_comments`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#get_pull_request_comments) - Get comments from a pull request
- [`update_pull_request`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#update_pull_request) - Update an existing pull request (title, description, status, draft state, reviewers, work items)
- [`get_pull_request_changes`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#get_pull_request_changes) - List changes in a pull request and policy evaluation status
- [`get_pull_request_checks`](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/docs/tools/pull-requests.md#get_pull_request_checks) - Summarize status checks, policy evaluations, and their related pipelines

For comprehensive documentation on all tools, see the [Tools Documentation](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/tree/main/docs/tools).

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/allscriptshealthcare/mcp-server-azure-devops-onprem/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=allscriptshealthcare/mcp-server-azure-devops-onprem&type=Date)](https://www.star-history.com/#allscriptshealthcare/mcp-server-azure-devops-onprem&Date)

## License

MIT
