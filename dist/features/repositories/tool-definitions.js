"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoriesTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
/**
 * List of repositories tools
 */
exports.repositoriesTools = [
    {
        name: 'get_repository',
        description: 'Get details of a specific repository',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetRepositorySchema),
    },
    {
        name: 'get_repository_details',
        description: 'Get detailed information about a repository including statistics and refs',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetRepositoryDetailsSchema),
    },
    {
        name: 'list_repositories',
        description: 'List repositories in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListRepositoriesSchema),
    },
    {
        name: 'get_file_content',
        description: 'Get content of a file or directory from a repository',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetFileContentSchema),
    },
    {
        name: 'get_all_repositories_tree',
        description: 'Displays a hierarchical tree view of files and directories across multiple Azure DevOps repositories within a project, based on their default branches',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetAllRepositoriesTreeSchema),
    },
    {
        name: 'get_repository_tree',
        description: 'Displays a hierarchical tree view of files and directories within a single repository starting from an optional path',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.GetRepositoryTreeSchema),
    },
    {
        name: 'create_branch',
        description: 'Create a new branch from an existing one',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.CreateBranchSchema),
    },
    {
        name: 'create_commit',
        description: [
            'Create a commit on an existing branch using file changes.',
            '- Provide plain branch names (no "refs/heads/").',
            '- ⚠️ Each file path may appear only once per commit request—combine all edits to a file into a single change entry.',
            '- Prefer multiple commits when you have sparse or unrelated edits; smaller focused commits keep review context clear.',
            '',
            '🎯 RECOMMENDED: Use the SEARCH/REPLACE format (much easier, no line counting!).',
            '',
            '**Option 1: SEARCH/REPLACE format (EASIEST)**',
            'Simply provide the exact text to find and replace:',
            '```json',
            '{',
            '  "changes": [{',
            '    "path": "src/api/services/function-call.ts",',
            '    "search": "return axios.post(apiUrl, payload, requestConfig);",',
            '    "replace": "return axios.post(apiUrl, payload, requestConfig).then(r => { processResponse(r); return r; });"',
            '  }]',
            '}',
            '```',
            'The server fetches the file, performs the replacement, and generates the diff automatically.',
            'No line counting, no hunk headers, no context lines needed!',
            '',
            '**Option 2: UNIFIED DIFF format (Advanced)**',
            'If you prefer full control, provide complete unified diffs:',
            '- Each patch MUST have complete hunk headers: @@ -oldStart,oldLines +newStart,newLines @@',
            '- CRITICAL: Every @@ marker MUST include line numbers. Do NOT use @@ without line ranges.',
            '- Include 3-5 context lines before and after changes.',
            '- For deletions: `--- a/filepath` and `+++ /dev/null`',
            '- For additions: `--- /dev/null` and `+++ b/filepath`',
            '',
            'Example unified diff:',
            '```json',
            '{',
            '  "changes": [{',
            '    "patch": "diff --git a/file.yaml b/file.yaml\\n--- a/file.yaml\\n+++ b/file.yaml\\n@@ -4,7 +4,7 @@ spec:\\n spec:\\n   type: ClusterIP\\n   ports:\\n-    - port: 8080\\n+    - port: 9090\\n       targetPort: http\\n"',
            '  }]',
            '}',
            '```',
        ].join('\n'),
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.CreateCommitSchema),
    },
    {
        name: 'list_commits',
        description: 'List recent commits on a branch including file-level diff content for each commit',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schemas_1.ListCommitsSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map