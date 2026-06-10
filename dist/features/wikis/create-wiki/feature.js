"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWiki = createWiki;
const errors_1 = require("../../../shared/errors");
const schema_1 = require("./schema");
const azure_devops_1 = require("../../../clients/azure-devops");
/**
 * Create a new wiki in Azure DevOps
 *
 * @param _connection The Azure DevOps WebApi connection (deprecated, kept for backward compatibility)
 * @param options Options for creating a wiki
 * @returns The created wiki
 * @throws {AzureDevOpsValidationError} When required parameters are missing
 * @throws {AzureDevOpsResourceNotFoundError} When the project or repository is not found
 * @throws {AzureDevOpsPermissionError} When the user does not have permission to create a wiki
 * @throws {AzureDevOpsError} When an error occurs while creating the wiki
 */
async function createWiki(_connection, options) {
    try {
        const { name, projectId, type = schema_1.WikiType.ProjectWiki, repositoryId, mappedPath = '/', } = options;
        // Validate repository ID for code wiki
        if (type === schema_1.WikiType.CodeWiki && !repositoryId) {
            throw new errors_1.AzureDevOpsValidationError('Repository ID is required for code wikis');
        }
        // Get the Wiki client
        const wikiClient = await (0, azure_devops_1.getWikiClient)({
            organizationId: options.organizationId,
            projectId,
        });
        // Prepare the wiki creation parameters
        const wikiCreateParams = {
            name,
            projectId: projectId,
            type,
            ...(type === schema_1.WikiType.CodeWiki && {
                repositoryId,
                mappedPath,
                version: {
                    version: 'main',
                    versionType: 'branch',
                },
            }),
        };
        // Create the wiki
        return await wikiClient.createWiki(projectId, wikiCreateParams);
    }
    catch (error) {
        // Just rethrow if it's already one of our error types
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        // Otherwise wrap in AzureDevOpsError
        throw new errors_1.AzureDevOpsError(`Failed to create wiki: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map