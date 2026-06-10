"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('createWorkItem integration', () => {
    let connection;
    beforeAll(async () => {
        // Get a real connection using environment variables
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
    });
    test('should create a new work item in Azure DevOps', async () => {
        // Create a unique title using timestamp to avoid conflicts
        const uniqueTitle = `Test Work Item ${new Date().toISOString()}`;
        // For a true integration test, use a real project
        const projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
        const workItemType = 'Task'; // Assumes 'Task' type exists in the project
        const options = {
            title: uniqueTitle,
            description: 'This is a test work item created by an integration test',
            priority: 2,
        };
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.createWorkItem)(connection, projectName, workItemType, options);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        // Verify fields match what we set
        expect(result.fields).toBeDefined();
        if (result.fields) {
            expect(result.fields['System.Title']).toBe(uniqueTitle);
            expect(result.fields['Microsoft.VSTS.Common.Priority']).toBe(2);
        }
    });
    test('should create a work item with additional fields', async () => {
        // Create a unique title using timestamp to avoid conflicts
        const uniqueTitle = `Test Work Item with Fields ${new Date().toISOString()}`;
        // For a true integration test, use a real project
        const projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
        const workItemType = 'Task';
        const options = {
            title: uniqueTitle,
            description: 'This is a test work item with additional fields',
            priority: 1,
            additionalFields: {
                'System.Tags': 'Integration Test,Automated',
            },
        };
        // Act - make an actual API call to Azure DevOps
        const result = await (0, feature_1.createWorkItem)(connection, projectName, workItemType, options);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        // Verify fields match what we set
        expect(result.fields).toBeDefined();
        if (result.fields) {
            expect(result.fields['System.Title']).toBe(uniqueTitle);
            expect(result.fields['Microsoft.VSTS.Common.Priority']).toBe(1);
            // Just check that tags contain both values, order may vary
            expect(result.fields['System.Tags']).toContain('Integration Test');
            expect(result.fields['System.Tags']).toContain('Automated');
        }
    });
    test('should create a child work item with parent-child relationship', async () => {
        // For a true integration test, use a real project
        const projectName = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
        // First, create a parent work item (User Story)
        const parentTitle = `Parent Story ${new Date().toISOString()}`;
        const parentOptions = {
            title: parentTitle,
            description: 'This is a parent user story',
        };
        const parentResult = await (0, feature_1.createWorkItem)(connection, projectName, 'User Story', // Assuming User Story type exists
        parentOptions);
        expect(parentResult).toBeDefined();
        expect(parentResult.id).toBeDefined();
        const parentId = parentResult.id;
        // Now create a child work item (Task) with a link to the parent
        const childTitle = `Child Task ${new Date().toISOString()}`;
        const childOptions = {
            title: childTitle,
            description: 'This is a child task of a user story',
            parentId: parentId, // Reference to parent work item
        };
        const childResult = await (0, feature_1.createWorkItem)(connection, projectName, 'Task', childOptions);
        // Assert the child work item was created
        expect(childResult).toBeDefined();
        expect(childResult.id).toBeDefined();
        // Now verify the parent-child relationship
        // We would need to fetch the relations, but for now we'll just assert
        // that the response indicates a relationship was created
        expect(childResult.relations).toBeDefined();
        // Check that at least one relation exists that points to our parent
        const parentRelation = childResult.relations?.find((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Reverse' &&
            relation.url &&
            relation.url.includes(`/${parentId}`));
        expect(parentRelation).toBeDefined();
    });
});
//# sourceMappingURL=feature.spec.int.js.map