"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const get_me_1 = require("./get-me");
// Mock the imported modules
jest.mock('./get-me', () => ({
    getMe: jest.fn(),
}));
describe('Users Request Handlers', () => {
    const mockConnection = {};
    describe('isUsersRequest', () => {
        it('should return true for users requests', () => {
            const request = {
                params: { name: 'get_me', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isUsersRequest)(request)).toBe(true);
        });
        it('should return false for non-users requests', () => {
            const request = {
                params: { name: 'list_projects', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isUsersRequest)(request)).toBe(false);
        });
    });
    describe('handleUsersRequest', () => {
        it('should handle get_me request', async () => {
            const mockUserProfile = {
                id: 'user-id-123',
                displayName: 'Test User',
                email: 'test.user@example.com',
            };
            get_me_1.getMe.mockResolvedValue(mockUserProfile);
            const request = {
                params: {
                    name: 'get_me',
                    arguments: {},
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleUsersRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockUserProfile);
            expect(get_me_1.getMe).toHaveBeenCalledWith(mockConnection);
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleUsersRequest)(mockConnection, request)).rejects.toThrow('Unknown users tool');
        });
        it('should propagate errors from user functions', async () => {
            const mockError = new Error('Test error');
            get_me_1.getMe.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'get_me',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleUsersRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map