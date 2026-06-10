"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkItemsFixture = exports.createWorkItemFixture = void 0;
/**
 * Standard work item fixture for tests
 */
const createWorkItemFixture = (id, title = 'Test Work Item', state = 'Active', assignedTo) => {
    return {
        id,
        rev: 1,
        fields: {
            'System.Id': id,
            'System.Title': title,
            'System.State': state,
            ...(assignedTo ? { 'System.AssignedTo': assignedTo } : {}),
        },
        url: `https://dev.azure.com/test-org/test-project/_apis/wit/workItems/${id}`,
    };
};
exports.createWorkItemFixture = createWorkItemFixture;
/**
 * Create a collection of work items for list tests
 */
const createWorkItemsFixture = (count = 3) => {
    return Array.from({ length: count }, (_, i) => (0, exports.createWorkItemFixture)(i + 1, `Work Item ${i + 1}`, i % 2 === 0 ? 'Active' : 'Resolved'));
};
exports.createWorkItemsFixture = createWorkItemsFixture;
//# sourceMappingURL=fixtures.js.map