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
const auth_1 = require("../../shared/auth");
const listOrganizationsFeature = __importStar(require("./list-organizations"));
// Mock the listOrganizations function
jest.mock('./list-organizations');
describe('Organizations Request Handlers', () => {
    describe('isOrganizationsRequest', () => {
        it('should return true for organizations requests', () => {
            const request = {
                params: { name: 'list_organizations', arguments: {} },
            };
            expect((0, _1.isOrganizationsRequest)(request)).toBe(true);
        });
        it('should return false for non-organizations requests', () => {
            const request = {
                params: { name: 'get_project', arguments: {} },
            };
            expect((0, _1.isOrganizationsRequest)(request)).toBe(false);
        });
    });
    describe('handleOrganizationsRequest', () => {
        const mockConnection = {
            serverUrl: 'https://dev.azure.com/mock-org',
        };
        beforeEach(() => {
            jest.resetAllMocks();
            // Mock environment variables
            process.env.AZURE_DEVOPS_AUTH_METHOD = 'pat';
            process.env.AZURE_DEVOPS_PAT = 'mock-pat';
        });
        it('should handle list_organizations request', async () => {
            const mockOrgs = [
                { id: '1', name: 'org1', url: 'https://dev.azure.com/org1' },
                { id: '2', name: 'org2', url: 'https://dev.azure.com/org2' },
            ];
            listOrganizationsFeature.listOrganizations.mockResolvedValue(mockOrgs);
            const request = {
                params: { name: 'list_organizations', arguments: {} },
            };
            const response = await (0, _1.handleOrganizationsRequest)(mockConnection, request);
            expect(response).toEqual({
                content: [{ type: 'text', text: JSON.stringify(mockOrgs, null, 2) }],
            });
            expect(listOrganizationsFeature.listOrganizations).toHaveBeenCalledWith({
                authMethod: auth_1.AuthenticationMethod.PersonalAccessToken,
                personalAccessToken: 'mock-pat',
                organizationUrl: 'https://dev.azure.com/mock-org',
            });
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: { name: 'unknown_tool', arguments: {} },
            };
            await expect((0, _1.handleOrganizationsRequest)(mockConnection, request)).rejects.toThrow('Unknown organizations tool: unknown_tool');
        });
        it('should propagate errors from listOrganizations', async () => {
            const mockError = new Error('Test error');
            listOrganizationsFeature.listOrganizations.mockRejectedValue(mockError);
            const request = {
                params: { name: 'list_organizations', arguments: {} },
            };
            await expect((0, _1.handleOrganizationsRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
        afterEach(() => {
            // Clean up environment variables
            delete process.env.AZURE_DEVOPS_AUTH_METHOD;
            delete process.env.AZURE_DEVOPS_PAT;
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map