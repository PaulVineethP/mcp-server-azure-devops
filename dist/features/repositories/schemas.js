"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCommitsSchema = exports.CreateCommitSchema = exports.CreateBranchSchema = exports.GetRepositoryTreeSchema = exports.GetAllRepositoriesTreeSchema = exports.GetFileContentSchema = exports.ListRepositoriesSchema = exports.GetRepositoryDetailsSchema = exports.GetRepositorySchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../utils/environment");
/**
 * Schema for getting a repository
 */
exports.GetRepositorySchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
});
/**
 * Schema for getting detailed repository information
 */
exports.GetRepositoryDetailsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    includeStatistics: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include branch statistics'),
    includeRefs: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include repository refs'),
    refFilter: zod_1.z
        .string()
        .optional()
        .describe('Optional filter for refs (e.g., "heads/" or "tags/")'),
    branchName: zod_1.z
        .string()
        .optional()
        .describe('Name of specific branch to get statistics for (if includeStatistics is true)'),
});
/**
 * Schema for listing repositories
 */
exports.ListRepositoriesSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    includeLinks: zod_1.z
        .boolean()
        .optional()
        .describe('Whether to include reference links'),
});
/**
 * Schema for getting file content
 */
exports.GetFileContentSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    path: zod_1.z
        .string()
        .optional()
        .default('/')
        .describe('Path to the file or folder'),
    version: zod_1.z
        .string()
        .optional()
        .describe('The version (branch, tag, or commit) to get content from'),
    versionType: zod_1.z
        .enum(['branch', 'commit', 'tag'])
        .optional()
        .describe('Type of version specified (branch, commit, or tag)'),
});
/**
 * Schema for getting all repositories tree structure
 */
exports.GetAllRepositoriesTreeSchema = zod_1.z.object({
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the Azure DevOps organization (Default: ${environment_1.defaultOrg})`),
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    repositoryPattern: zod_1.z
        .string()
        .optional()
        .describe('Repository name pattern (wildcard characters allowed) to filter which repositories are included'),
    depth: zod_1.z
        .number()
        .int()
        .min(0)
        .max(10)
        .optional()
        .default(0)
        .describe('Maximum depth to traverse within each repository (0 = unlimited)'),
    pattern: zod_1.z
        .string()
        .optional()
        .describe('File pattern (wildcard characters allowed) to filter files by within each repository'),
});
/**
 * Schema for getting a tree for a single repository
 */
exports.GetRepositoryTreeSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    path: zod_1.z
        .string()
        .optional()
        .default('/')
        .describe('Path within the repository to start from'),
    depth: zod_1.z
        .number()
        .int()
        .min(0)
        .max(10)
        .optional()
        .default(0)
        .describe('Maximum depth to traverse (0 = unlimited)'),
});
/**
 * Schema for creating a new branch
 */
exports.CreateBranchSchema = zod_1.z
    .object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    sourceBranch: zod_1.z
        .string()
        .describe('Name of the branch to copy from (without "refs/heads/", e.g., "master")'),
    newBranch: zod_1.z
        .string()
        .describe('Name of the new branch to create (without "refs/heads/", e.g., "feature/my-branch")'),
})
    .describe('Create a new branch from an existing branch.\n' +
    '- Pass plain branch names (no "refs/heads/"). Example: sourceBranch="master", newBranch="codex/test1".\n' +
    '- When creating pull requests later, use fully-qualified refs (e.g., "refs/heads/codex/test1").');
/**
 * Schema for creating a commit with multiple file changes
 */
exports.CreateCommitSchema = zod_1.z
    .object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    branchName: zod_1.z
        .string()
        .describe('The branch to commit to (without "refs/heads/", e.g., "codex/test2-delete-main-py")'),
    commitMessage: zod_1.z.string().describe('Commit message'),
    changes: zod_1.z
        .array(zod_1.z
        .object({
        path: zod_1.z
            .string()
            .optional()
            .describe('File path. Optional for patch format (uses diff header), REQUIRED for search/replace format'),
        patch: zod_1.z
            .string()
            .optional()
            .describe([
            'Unified git diff for a single file.',
            'MUST include `diff --git`, `--- a/...`, `+++ b/...`, and complete hunk headers.',
            'CRITICAL: Every hunk header must have line numbers in format: @@ -oldStart,oldLines +newStart,newLines @@',
            'Do NOT use @@ without the line range numbers - this will cause parsing failures.',
            'Include 3-5 context lines before and after changes for proper patch application.',
            'Use `/dev/null` with `---` for new files, or with `+++` for deleted files.',
            '',
            'Example modify patch:',
            '```diff',
            'diff --git a/charts/bcs-mcp-server/templates/service-api.yaml b/charts/bcs-mcp-server/templates/service-api.yaml',
            '--- a/charts/bcs-mcp-server/templates/service-api.yaml',
            '+++ b/charts/bcs-mcp-server/templates/service-api.yaml',
            '@@ -4,7 +4,7 @@ spec:',
            ' spec:',
            '   type: {{ .Values.service.type }}',
            '   ports:',
            '-    - port: 8080',
            '+    - port: 9090',
            '     targetPort: deployment-port',
            '     protocol: TCP',
            '     name: http',
            '```',
        ].join('\n')),
        search: zod_1.z
            .string()
            .optional()
            .describe([
            'Alternative to patch: Exact text to search for in the file.',
            'Must be used with "replace" and "path" fields.',
            'The server will fetch the file, perform the replacement, and generate the patch automatically.',
            'This is MUCH EASIER than creating unified diffs manually - no line counting needed!',
            '',
            'Example:',
            '"search": "return axios.post(apiUrl, payload, requestConfig);"',
            '"replace": "return axios.post(apiUrl, payload, requestConfig).then(r => { /* process */ return r; });"',
        ].join('\n')),
        replace: zod_1.z
            .string()
            .optional()
            .describe('Alternative to patch: Exact text to replace the "search" string with. Must be used together with "search" and "path".'),
    })
        .refine((data) => {
        const hasPatch = !!data.patch;
        const hasSearchReplace = !!data.search && !!data.replace;
        return hasPatch || hasSearchReplace;
    }, {
        message: 'Either "patch" or both "search" and "replace" must be provided',
    }))
        .describe('List of file changes as either unified git diffs OR search/replace pairs'),
})
    .describe([
    'Create a commit on an existing branch using file changes.',
    '- Provide plain branch names (no "refs/heads/").',
    '',
    '**RECOMMENDED: Use search/replace format (easier, no line counting needed!)**',
    '',
    'Option 1 - Search/Replace (Easiest):',
    '```json',
    '{',
    '  "changes": [{',
    '    "path": "src/file.ts",',
    '    "search": "old code here",',
    '    "replace": "new code here"',
    '  }]',
    '}',
    '```',
    '',
    'Option 2 - Unified Diff (Advanced):',
    '- Requires complete hunk headers: @@ -oldStart,oldLines +newStart,newLines @@',
    '- Include 3-5 context lines before/after changes',
    '- For deletions: --- a/file, +++ /dev/null',
    '- For additions: --- /dev/null, +++ b/file',
].join('\n'));
/**
 * Schema for listing commits on a branch
 */
exports.ListCommitsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    repositoryId: zod_1.z.string().describe('The ID or name of the repository'),
    branchName: zod_1.z.string().describe('Branch name to list commits from'),
    top: zod_1.z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Maximum number of commits to return (Default: 10)'),
    skip: zod_1.z
        .number()
        .int()
        .min(0)
        .optional()
        .describe('Number of commits to skip from the newest'),
});
//# sourceMappingURL=schemas.js.map