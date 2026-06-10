"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileContent = getFileContent;
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const errors_1 = require("../../../shared/errors");
/**
 * Get content of a file or directory from a repository
 *
 * @param connection - Azure DevOps WebApi connection
 * @param projectId - Project ID or name
 * @param repositoryId - Repository ID or name
 * @param path - Path to file or directory
 * @param versionDescriptor - Optional version descriptor for retrieving file at specific commit/branch/tag
 * @returns Content of the file or list of items if path is a directory
 */
async function getFileContent(connection, projectId, repositoryId, path = '/', versionDescriptor) {
    try {
        const gitApi = await connection.getGitApi();
        // Create version descriptor for API requests
        const gitVersionDescriptor = versionDescriptor
            ? {
                version: versionDescriptor.version,
                versionType: versionDescriptor.versionType,
                versionOptions: undefined,
            }
            : undefined;
        // First, try to get items using the path to determine if it's a directory
        let isDirectory = false;
        let items = [];
        try {
            items = await gitApi.getItems(repositoryId, projectId, path, GitInterfaces_1.VersionControlRecursionType.OneLevel, undefined, undefined, undefined, undefined, gitVersionDescriptor);
            // If multiple items are returned or the path ends with /, it's a directory
            isDirectory = items.length > 1 || (path !== '/' && path.endsWith('/'));
        }
        catch {
            // If getItems fails, try to get file content directly
            isDirectory = false;
        }
        if (isDirectory) {
            // For directories, return a formatted list of the items
            return {
                content: JSON.stringify(items, null, 2),
                isDirectory: true,
            };
        }
        else {
            // For files, get the actual content
            try {
                // Get file content using the Git API
                const contentStream = await gitApi.getItemContent(repositoryId, path, projectId, undefined, undefined, undefined, undefined, false, gitVersionDescriptor, true);
                // Convert the stream to a string
                if (contentStream) {
                    const chunks = [];
                    // Listen for data events to collect chunks
                    contentStream.on('data', (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });
                    // Use a promise to wait for the stream to finish
                    const content = await new Promise((resolve, reject) => {
                        contentStream.on('end', () => {
                            // Concatenate all chunks and convert to string
                            const buffer = Buffer.concat(chunks);
                            resolve(buffer.toString('utf8'));
                        });
                        contentStream.on('error', (err) => {
                            reject(err);
                        });
                    });
                    return {
                        content,
                        isDirectory: false,
                    };
                }
                throw new Error('No content returned from API');
            }
            catch (error) {
                // If it's a 404 or similar error, throw a ResourceNotFoundError
                if (error instanceof Error &&
                    (error.message.includes('not found') ||
                        error.message.includes('does not exist'))) {
                    throw new errors_1.AzureDevOpsResourceNotFoundError(`Path '${path}' not found in repository '${repositoryId}' of project '${projectId}'`);
                }
                throw error;
            }
        }
    }
    catch (error) {
        // If it's already an AzureDevOpsResourceNotFoundError, rethrow it
        if (error instanceof errors_1.AzureDevOpsResourceNotFoundError) {
            throw error;
        }
        // Otherwise, wrap it in a ResourceNotFoundError
        throw new errors_1.AzureDevOpsResourceNotFoundError(`Failed to get content for path '${path}': ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map