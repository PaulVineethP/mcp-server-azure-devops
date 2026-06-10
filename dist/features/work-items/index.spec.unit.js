"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const workItemModule = __importStar(require("./"));
// Mock the imported modules
jest.mock('./get-work-item', () => ({
    getWorkItem: jest.fn(),
}));
jest.mock('./list-work-items', () => ({
    listWorkItems: jest.fn(),
}));
jest.mock('./create-work-item', () => ({
    createWorkItem: jest.fn(),
}));
jest.mock('./update-work-item', () => ({
    updateWorkItem: jest.fn(),
}));
jest.mock('./manage-work-item-link', () => ({
    manageWorkItemLink: jest.fn(),
}));
// Helper function to create a valid CallToolRequest object
const createCallToolRequest = (name, args) => {
    return {
        method: 'tools/call',
        params: {
            name,
            arguments: args,
        },
    };
};
describe('Work Items Request Handlers', () => {
    describe('isWorkItemsRequest', () => {
        it('should return true for work items requests', () => {
            const workItemsRequests = [
                'get_work_item',
                'list_work_items',
                'create_work_item',
                'update_work_item',
                'manage_work_item_link',
            ];
            workItemsRequests.forEach((name) => {
                const request = createCallToolRequest(name, {});
                expect((0, _1.isWorkItemsRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-work items requests', () => {
            const request = createCallToolRequest('get_project', {});
            expect((0, _1.isWorkItemsRequest)(request)).toBe(false);
        });
    });
    describe('handleWorkItemsRequest', () => {
        let mockConnection;
        beforeEach(() => {
            mockConnection = {};
            // Setup mock for schema validation - with correct return types
            jest
                .spyOn(workItemModule.GetWorkItemSchema, 'parse')
                .mockImplementation(() => {
                return { workItemId: 123, expand: undefined };
            });
            jest
                .spyOn(workItemModule.ListWorkItemsSchema, 'parse')
                .mockImplementation(() => {
                return { projectId: 'myProject' };
            });
            jest
                .spyOn(workItemModule.CreateWorkItemSchema, 'parse')
                .mockImplementation(() => {
                return {
                    projectId: 'myProject',
                    workItemType: 'Task',
                    title: 'New Task',
                };
            });
            jest
                .spyOn(workItemModule.UpdateWorkItemSchema, 'parse')
                .mockImplementation(() => {
                return {
                    workItemId: 123,
                    title: 'Updated Title',
                };
            });
            jest
                .spyOn(workItemModule.ManageWorkItemLinkSchema, 'parse')
                .mockImplementation(() => {
                return {
                    sourceWorkItemId: 123,
                    targetWorkItemId: 456,
                    operation: 'add',
                    relationType: 'System.LinkTypes.Hierarchy-Forward',
                };
            });
            // Setup mocks for feature functions
            jest.spyOn(workItemModule, 'getWorkItem').mockResolvedValue({ id: 123 });
            jest
                .spyOn(workItemModule, 'listWorkItems')
                .mockResolvedValue([{ id: 123 }, { id: 456 }]);
            jest
                .spyOn(workItemModule, 'createWorkItem')
                .mockResolvedValue({ id: 789 });
            jest
                .spyOn(workItemModule, 'updateWorkItem')
                .mockResolvedValue({ id: 123 });
            jest
                .spyOn(workItemModule, 'manageWorkItemLink')
                .mockResolvedValue({ id: 123 });
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should handle get_work_item requests', async () => {
            const request = createCallToolRequest('get_work_item', {
                workItemId: 123,
            });
            const result = await (0, _1.handleWorkItemsRequest)(mockConnection, request);
            expect(workItemModule.GetWorkItemSchema.parse).toHaveBeenCalledWith({
                workItemId: 123,
            });
            expect(workItemModule.getWorkItem).toHaveBeenCalledWith(mockConnection, 123, undefined);
            expect(result).toEqual({
                content: [{ type: 'text', text: JSON.stringify({ id: 123 }, null, 2) }],
            });
        });
        it('should handle list_work_items requests', async () => {
            const request = createCallToolRequest('list_work_items', {
                projectId: 'myProject',
            });
            const result = await (0, _1.handleWorkItemsRequest)(mockConnection, request);
            expect(workItemModule.ListWorkItemsSchema.parse).toHaveBeenCalledWith({
                projectId: 'myProject',
            });
            expect(workItemModule.listWorkItems).toHaveBeenCalled();
            expect(result).toEqual({
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify([{ id: 123 }, { id: 456 }], null, 2),
                    },
                ],
            });
        });
        it('should handle create_work_item requests', async () => {
            const request = createCallToolRequest('create_work_item', {
                projectId: 'myProject',
                workItemType: 'Task',
                title: 'New Task',
            });
            const result = await (0, _1.handleWorkItemsRequest)(mockConnection, request);
            expect(workItemModule.CreateWorkItemSchema.parse).toHaveBeenCalledWith({
                projectId: 'myProject',
                workItemType: 'Task',
                title: 'New Task',
            });
            expect(workItemModule.createWorkItem).toHaveBeenCalled();
            expect(result).toEqual({
                content: [{ type: 'text', text: JSON.stringify({ id: 789 }, null, 2) }],
            });
        });
        it('should handle update_work_item requests', async () => {
            const request = createCallToolRequest('update_work_item', {
                workItemId: 123,
                title: 'Updated Title',
            });
            const result = await (0, _1.handleWorkItemsRequest)(mockConnection, request);
            expect(workItemModule.UpdateWorkItemSchema.parse).toHaveBeenCalledWith({
                workItemId: 123,
                title: 'Updated Title',
            });
            expect(workItemModule.updateWorkItem).toHaveBeenCalled();
            expect(result).toEqual({
                content: [{ type: 'text', text: JSON.stringify({ id: 123 }, null, 2) }],
            });
        });
        it('should handle manage_work_item_link requests', async () => {
            const request = createCallToolRequest('manage_work_item_link', {
                sourceWorkItemId: 123,
                targetWorkItemId: 456,
                operation: 'add',
                relationType: 'System.LinkTypes.Hierarchy-Forward',
            });
            const result = await (0, _1.handleWorkItemsRequest)(mockConnection, request);
            expect(workItemModule.ManageWorkItemLinkSchema.parse).toHaveBeenCalledWith({
                sourceWorkItemId: 123,
                targetWorkItemId: 456,
                operation: 'add',
                relationType: 'System.LinkTypes.Hierarchy-Forward',
            });
            expect(workItemModule.manageWorkItemLink).toHaveBeenCalled();
            expect(result).toEqual({
                content: [{ type: 'text', text: JSON.stringify({ id: 123 }, null, 2) }],
            });
        });
        it('should throw an error for unknown work items tools', async () => {
            const request = createCallToolRequest('unknown_tool', {});
            await expect((0, _1.handleWorkItemsRequest)(mockConnection, request)).rejects.toThrow('Unknown work items tool: unknown_tool');
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map