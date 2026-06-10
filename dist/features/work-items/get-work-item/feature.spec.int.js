"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("../__test__/test-helpers");
const errors_1 = require("../../../shared/errors");
const feature_2 = require("../create-work-item/feature");
const feature_3 = require("../manage-work-item-link/feature");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('getWorkItem integration', () => {
    let connection;
    let testWorkItemId;
    let linkedWorkItemId;
    let projectName;
    beforeAll(async () => {
        // Get a real connection using environment variables
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
        projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
        // Create a test work item
        const uniqueTitle = `Test Work Item ${new Date().toISOString()}`;
        const options = {
            title: uniqueTitle,
            description: 'Test work item for get-work-item integration tests',
        };
        const testWorkItem = await (0, feature_2.createWorkItem)(connection, projectName, 'Task', options);
        // Create another work item to link to the first one
        const linkedItemOptions = {
            title: `Linked Work Item ${new Date().toISOString()}`,
            description: 'Linked work item for get-work-item integration tests',
        };
        const linkedWorkItem = await (0, feature_2.createWorkItem)(connection, projectName, 'Task', linkedItemOptions);
        if (!testWorkItem?.id || !linkedWorkItem?.id) {
            throw new Error('Failed to create required work items for testing');
        }
        testWorkItemId = testWorkItem.id;
        linkedWorkItemId = linkedWorkItem.id;
        // Create a link between the two work items
        await (0, feature_3.manageWorkItemLink)(connection, projectName, {
            sourceWorkItemId: testWorkItemId,
            targetWorkItemId: linkedWorkItemId,
            operation: 'add',
            relationType: 'System.LinkTypes.Related',
            comment: 'Link created for get-work-item integration tests',
        });
    });
    test('should retrieve a real work item from Azure DevOps with default expand=all', async () => {
        // Act - get work item by ID
        const result = await (0, feature_1.getWorkItem)(connection, testWorkItemId);
        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBe(testWorkItemId);
        // Verify expanded fields and data are present
        expect(result.fields).toBeDefined();
        expect(result._links).toBeDefined();
        // With expand=all and a linked item, relations should be defined
        expect(result.relations).toBeDefined();
        if (result.fields) {
            // Verify common fields that should be present with expand=all
            expect(result.fields['System.Title']).toBeDefined();
            expect(result.fields['System.State']).toBeDefined();
            expect(result.fields['System.CreatedDate']).toBeDefined();
            expect(result.fields['System.ChangedDate']).toBeDefined();
        }
    });
    test('should retrieve work item with expanded relations', async () => {
        // Act - get work item with relations expansion
        const result = await (0, feature_1.getWorkItem)(connection, testWorkItemId, 'relations');
        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBe(testWorkItemId);
        // When using expand=relations on a work item with links, relations should be defined
        expect(result.relations).toBeDefined();
        // Verify we can access the related work item
        if (result.relations && result.relations.length > 0) {
            const relation = result.relations[0];
            expect(relation.rel).toBe('System.LinkTypes.Related');
            expect(relation.url).toContain(linkedWorkItemId.toString());
        }
        // Verify fields exist
        expect(result.fields).toBeDefined();
        if (result.fields) {
            expect(result.fields['System.Title']).toBeDefined();
        }
    });
    test('should retrieve work item with minimal fields when using expand=none', async () => {
        // Act - get work item with no expansion
        const result = await (0, feature_1.getWorkItem)(connection, testWorkItemId, 'none');
        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBe(testWorkItemId);
        expect(result.fields).toBeDefined();
        // With expand=none, we should still get _links but no relations
        // The Azure DevOps API still returns _links even with expand=none
        expect(result.relations).toBeUndefined();
    });
    test('should throw AzureDevOpsResourceNotFoundError for non-existent work item', async () => {
        // Use a very large ID that's unlikely to exist
        const nonExistentId = 999999999;
        // Assert that it throws the correct error
        await expect((0, feature_1.getWorkItem)(connection, nonExistentId)).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
    });
    test('should include all possible fields with null values for empty fields', async () => {
        // Act - get work item by ID
        const result = await (0, feature_1.getWorkItem)(connection, testWorkItemId);
        // Assert
        expect(result).toBeDefined();
        expect(result.fields).toBeDefined();
        if (result.fields) {
            // Get a direct connection to WorkItemTrackingApi to fetch field info for comparison
            const witApi = await connection.getWorkItemTrackingApi();
            const projectName = result.fields['System.TeamProject'];
            const workItemType = result.fields['System.WorkItemType'];
            expect(projectName).toBeDefined();
            expect(workItemType).toBeDefined();
            if (projectName && workItemType) {
                // Get all possible field references for this work item type
                const allFields = await witApi.getWorkItemTypeFieldsWithReferences(projectName.toString(), workItemType.toString());
                // Check that all fields from the reference are present in the result
                // Some might be null, but they should exist in the fields object
                for (const field of allFields) {
                    if (field.referenceName) {
                        expect(Object.keys(result.fields)).toContain(field.referenceName);
                    }
                }
                // There should be at least one field with a null value
                // (This is a probabilistic test but very likely to pass since work items
                // typically have many optional fields that aren't filled in)
                const hasNullField = Object.values(result.fields).some((value) => value === null);
                expect(hasNullField).toBe(true);
            }
        }
    });
});
//# sourceMappingURL=feature.spec.int.js.map