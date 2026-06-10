"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePullRequest = void 0;
const WorkItemTrackingInterfaces_1 = require("azure-devops-node-api/interfaces/WorkItemTrackingInterfaces");
const client_factory_1 = require("../../../shared/auth/client-factory");
const errors_1 = require("../../../shared/errors");
const enums_1 = require("../../../shared/enums");
function normalizeTags(tags) {
    if (!tags) {
        return [];
    }
    const seen = new Set();
    const normalized = [];
    for (const rawTag of tags) {
        const trimmed = rawTag.trim();
        if (!trimmed) {
            continue;
        }
        const key = trimmed.toLowerCase();
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        normalized.push(trimmed);
    }
    return normalized;
}
/**
 * Updates an existing pull request in Azure DevOps with the specified changes.
 *
 * @param options - The options for updating the pull request
 * @returns The updated pull request
 */
const updatePullRequest = async (options) => {
    const { projectId, repositoryId, pullRequestId, title, description, status, isDraft, addWorkItemIds, removeWorkItemIds, addReviewers, removeReviewers, addTags, removeTags, additionalProperties, } = options;
    try {
        // Get connection to Azure DevOps
        const client = new client_factory_1.AzureDevOpsClient({
            method: process.env.AZURE_DEVOPS_AUTH_METHOD ?? 'pat',
            organizationUrl: process.env.AZURE_DEVOPS_ORG_URL ?? '',
            personalAccessToken: process.env.AZURE_DEVOPS_PAT,
        });
        const connection = await client.getWebApiClient();
        // Get the Git API client
        const gitApi = await connection.getGitApi();
        // First, get the current pull request
        const pullRequest = await gitApi.getPullRequestById(pullRequestId, projectId);
        if (!pullRequest) {
            throw new errors_1.AzureDevOpsError(`Pull request ${pullRequestId} not found in repository ${repositoryId}`);
        }
        // Store the artifactId for work item linking
        const artifactId = pullRequest.artifactId;
        const effectivePullRequestId = pullRequest.pullRequestId ?? pullRequestId;
        // Create an object with the properties to update
        const updateObject = {};
        if (title !== undefined) {
            updateObject.title = title;
        }
        if (description !== undefined) {
            updateObject.description = description;
        }
        if (isDraft !== undefined) {
            updateObject.isDraft = isDraft;
        }
        if (status) {
            const enumStatus = enums_1.pullRequestStatusMapper.toEnum(status);
            if (enumStatus !== undefined) {
                updateObject.status = enumStatus;
            }
            else {
                throw new errors_1.AzureDevOpsError(`Invalid status: ${status}. Valid values are: active, abandoned, completed`);
            }
        }
        // Add any additional properties that were specified
        if (additionalProperties) {
            Object.assign(updateObject, additionalProperties);
        }
        // Update the pull request
        const updatedPullRequest = await gitApi.updatePullRequest(updateObject, repositoryId, pullRequestId, projectId);
        // Handle work items separately if needed
        const addIds = addWorkItemIds ?? [];
        const removeIds = removeWorkItemIds ?? [];
        if (addIds.length > 0 || removeIds.length > 0) {
            await handleWorkItems({
                connection,
                pullRequestId,
                repositoryId,
                projectId,
                workItemIdsToAdd: addIds,
                workItemIdsToRemove: removeIds,
                artifactId,
            });
        }
        // Handle reviewers separately if needed
        const addReviewerIds = addReviewers ?? [];
        const removeReviewerIds = removeReviewers ?? [];
        if (addReviewerIds.length > 0 || removeReviewerIds.length > 0) {
            await handleReviewers({
                connection,
                pullRequestId,
                repositoryId,
                projectId,
                reviewersToAdd: addReviewerIds,
                reviewersToRemove: removeReviewerIds,
            });
        }
        const normalizedTagsToAdd = normalizeTags(addTags);
        const normalizedTagsToRemove = normalizeTags(removeTags);
        if (effectivePullRequestId &&
            (normalizedTagsToAdd.length > 0 || normalizedTagsToRemove.length > 0)) {
            let labels = (await gitApi.getPullRequestLabels(repositoryId, effectivePullRequestId, projectId)) ?? [];
            const existingNames = new Set(labels
                .map((label) => label.name?.toLowerCase())
                .filter((name) => Boolean(name)));
            const tagsToCreate = normalizedTagsToAdd.filter((tag) => !existingNames.has(tag.toLowerCase()));
            for (const tag of tagsToCreate) {
                try {
                    const createdLabel = await gitApi.createPullRequestLabel({ name: tag }, repositoryId, effectivePullRequestId, projectId);
                    labels.push(createdLabel);
                    existingNames.add(tag.toLowerCase());
                }
                catch (error) {
                    throw new Error(`Failed to add tag '${tag}': ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            for (const tag of normalizedTagsToRemove) {
                try {
                    await gitApi.deletePullRequestLabels(repositoryId, effectivePullRequestId, tag, projectId);
                    labels = labels.filter((label) => {
                        const name = label.name?.toLowerCase();
                        return name ? name !== tag.toLowerCase() : true;
                    });
                    existingNames.delete(tag.toLowerCase());
                }
                catch (error) {
                    if (error &&
                        typeof error === 'object' &&
                        'statusCode' in error &&
                        error.statusCode === 404) {
                        continue;
                    }
                    throw new Error(`Failed to remove tag '${tag}': ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            updatedPullRequest.labels = labels;
        }
        return updatedPullRequest;
    }
    catch (error) {
        throw new errors_1.AzureDevOpsError(`Failed to update pull request ${pullRequestId} in repository ${repositoryId}: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.updatePullRequest = updatePullRequest;
async function handleWorkItems(options) {
    const { connection, pullRequestId, repositoryId, projectId, workItemIdsToAdd, workItemIdsToRemove, artifactId, } = options;
    try {
        // For each work item to add, create a link
        if (workItemIdsToAdd.length > 0) {
            const workItemTrackingApi = await connection.getWorkItemTrackingApi();
            for (const workItemId of workItemIdsToAdd) {
                // Add the relationship between the work item and pull request
                await workItemTrackingApi.updateWorkItem(null, [
                    {
                        op: 'add',
                        path: '/relations/-',
                        value: {
                            rel: 'ArtifactLink',
                            // Use the artifactId if available, otherwise fall back to the old format
                            url: artifactId ||
                                `vstfs:///Git/PullRequestId/${projectId ?? ''}/${repositoryId}/${pullRequestId}`,
                            attributes: {
                                name: 'Pull Request',
                            },
                        },
                    },
                ], workItemId);
            }
        }
        // For each work item to remove, remove the link
        if (workItemIdsToRemove.length > 0) {
            const workItemTrackingApi = await connection.getWorkItemTrackingApi();
            for (const workItemId of workItemIdsToRemove) {
                try {
                    // First, get the work item with relations expanded
                    const workItem = await workItemTrackingApi.getWorkItem(workItemId, undefined, // fields
                    undefined, // asOf
                    WorkItemTrackingInterfaces_1.WorkItemExpand.Relations);
                    if (workItem.relations) {
                        // Find the relationship to the pull request using the artifactId
                        const prRelationIndex = workItem.relations.findIndex((rel) => rel.rel === 'ArtifactLink' &&
                            rel.attributes &&
                            rel.attributes.name === 'Pull Request' &&
                            rel.url === artifactId);
                        if (prRelationIndex !== -1) {
                            // Remove the relationship
                            await workItemTrackingApi.updateWorkItem(null, [
                                {
                                    op: 'remove',
                                    path: `/relations/${prRelationIndex}`,
                                },
                            ], workItemId);
                        }
                    }
                }
                catch (error) {
                    console.log(`Error removing work item ${workItemId} from pull request ${pullRequestId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    }
    catch (error) {
        throw new errors_1.AzureDevOpsError(`Failed to update work item links for pull request ${pullRequestId}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
async function handleReviewers(options) {
    const { connection, pullRequestId, repositoryId, projectId, reviewersToAdd, reviewersToRemove, } = options;
    try {
        const gitApi = await connection.getGitApi();
        // Add reviewers
        if (reviewersToAdd.length > 0) {
            for (const reviewer of reviewersToAdd) {
                try {
                    // Create a reviewer object with the identifier
                    await gitApi.createPullRequestReviewer({
                        id: reviewer, // This can be email or ID
                        isRequired: false,
                    }, repositoryId, pullRequestId, reviewer, projectId);
                }
                catch (error) {
                    console.log(`Error adding reviewer ${reviewer} to pull request ${pullRequestId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        // Remove reviewers
        if (reviewersToRemove.length > 0) {
            for (const reviewer of reviewersToRemove) {
                try {
                    await gitApi.deletePullRequestReviewer(repositoryId, pullRequestId, reviewer, projectId);
                }
                catch (error) {
                    console.log(`Error removing reviewer ${reviewer} from pull request ${pullRequestId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    }
    catch (error) {
        throw new errors_1.AzureDevOpsError(`Failed to update reviewers for pull request ${pullRequestId}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map