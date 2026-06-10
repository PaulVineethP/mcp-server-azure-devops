import { ToolDefinition } from './types/tool-definition';

/**
 * Tool names that only read data from Azure DevOps and never mutate state.
 *
 * These are marked with `readOnlyHint: true` so MCP clients (e.g. VS Code,
 * Claude Desktop) can safely auto-approve them without prompting for approval
 * on every call within a session.
 */
export const READ_ONLY_TOOLS = new Set<string>([
  // Users / organizations / projects
  'get_me',
  'list_organizations',
  'list_projects',
  'get_project',
  'get_project_details',
  // Repositories
  'get_repository',
  'get_repository_details',
  'list_repositories',
  'get_file_content',
  'get_all_repositories_tree',
  'get_repository_tree',
  'list_commits',
  // Work items
  'list_work_items',
  'get_work_item',
  // Search
  'search_code',
  'search_wiki',
  'search_work_items',
  // Wikis
  'get_wikis',
  'get_wiki_page',
  'list_wiki_pages',
  // Pipelines
  'list_pipelines',
  'get_pipeline',
  'list_pipeline_runs',
  'get_pipeline_run',
  'pipeline_timeline',
  'get_pipeline_log',
  'download_pipeline_artifact',
  // Pull requests
  'list_pull_requests',
  'get_pull_request',
  'get_pull_request_comments',
  'get_pull_request_changes',
  'get_pull_request_checks',
]);

/**
 * Tool names that create, update, or trigger state in Azure DevOps. These
 * remain `readOnlyHint: false` so clients keep requiring explicit approval.
 */
export const WRITE_TOOLS = new Set<string>([
  'create_work_item',
  'update_work_item',
  'manage_work_item_link',
  'create_branch',
  'create_commit',
  'create_pull_request',
  'update_pull_request',
  'add_pull_request_comment',
  'create_wiki',
  'create_wiki_page',
  'update_wiki_page',
  'trigger_pipeline',
]);

/**
 * Apply MCP tool annotations to a list of tool definitions based on whether
 * each tool is read-only or mutating. Read-only tools are eligible for client
 * auto-approval; write tools are not.
 *
 * @param tools The combined list of tool definitions
 * @returns A new list with `annotations` populated for every tool
 */
export function annotateTools(tools: ToolDefinition[]): ToolDefinition[] {
  return tools.map((tool) => {
    const readOnly = READ_ONLY_TOOLS.has(tool.name);

    return {
      ...tool,
      annotations: {
        title: tool.name,
        readOnlyHint: readOnly,
        // None of the write tools delete data, so destructive updates are not
        // expected; reads are inherently non-destructive.
        destructiveHint: false,
        // Every tool talks to an external Azure DevOps instance.
        openWorldHint: true,
        ...tool.annotations,
      },
    };
  });
}
