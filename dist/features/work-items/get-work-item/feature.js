"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkItem = getWorkItem;
const WorkItemTrackingInterfaces_1 = require("azure-devops-node-api/interfaces/WorkItemTrackingInterfaces");
const errors_1 = require("../../../shared/errors");
const workItemTypeFieldsCache = {};
/**
 * Maps string-based expansion options to the WorkItemExpand enum
 */
const expandMap = {
    none: WorkItemTrackingInterfaces_1.WorkItemExpand.None,
    relations: WorkItemTrackingInterfaces_1.WorkItemExpand.Relations,
    fields: WorkItemTrackingInterfaces_1.WorkItemExpand.Fields,
    links: WorkItemTrackingInterfaces_1.WorkItemExpand.Links,
    all: WorkItemTrackingInterfaces_1.WorkItemExpand.All,
};
/**
 * Get a work item by ID
 *
 * @param connection The Azure DevOps WebApi connection
 * @param workItemId The ID of the work item
 * @param expand Optional expansion options (defaults to 'all')
 * @returns The work item details
 * @throws {AzureDevOpsResourceNotFoundError} If the work item is not found
 */
async function getWorkItem(connection, workItemId, expand = 'all') {
    try {
        const witApi = await connection.getWorkItemTrackingApi();
        const workItem = await witApi.getWorkItem(workItemId, undefined, undefined, expandMap[expand.toLowerCase()]);
        if (!workItem) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Work item '${workItemId}' not found`);
        }
        // Extract project and work item type to get all possible fields
        const projectName = workItem.fields?.['System.TeamProject'];
        const workItemType = workItem.fields?.['System.WorkItemType'];
        if (!projectName || !workItemType) {
            // If we can't determine the project or type, return the original work item
            return workItem;
        }
        // Get all possible fields for this work item type
        const allFields = workItemTypeFieldsCache[projectName.toString()]?.[workItemType.toString()] ??
            (await witApi.getWorkItemTypeFieldsWithReferences(projectName.toString(), workItemType.toString(), WorkItemTrackingInterfaces_1.WorkItemTypeFieldsExpandLevel.All));
        workItemTypeFieldsCache[projectName.toString()] = {
            ...workItemTypeFieldsCache[projectName.toString()],
            [workItemType.toString()]: allFields,
        };
        // Create a new work item object with all fields
        const enhancedWorkItem = { ...workItem };
        // Initialize fields object if it doesn't exist
        if (!enhancedWorkItem.fields) {
            enhancedWorkItem.fields = {};
        }
        // Set null for all potential fields that don't have values
        for (const field of allFields) {
            if (field.referenceName &&
                !(field.referenceName in enhancedWorkItem.fields)) {
                enhancedWorkItem.fields[field.referenceName] = field.defaultValue;
            }
        }
        return enhancedWorkItem;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        throw new Error(`Failed to get work item: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map