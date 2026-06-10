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
const feature_1 = require("./feature");
const errors_1 = require("../../../shared/errors");
const azureDevOpsClient = __importStar(require("../../../clients/azure-devops"));
// Mock Azure DevOps client
jest.mock('../../../clients/azure-devops');
const mockGetPage = jest.fn();
azureDevOpsClient.getWikiClient.mockImplementation(() => {
    return Promise.resolve({
        getPage: mockGetPage,
    });
});
describe('getWikiPage unit', () => {
    const mockWikiPageContent = 'Wiki page content text';
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetPage.mockResolvedValue({ content: mockWikiPageContent });
    });
    it('should return wiki page content as text', async () => {
        // Arrange
        const options = {
            organizationId: 'testOrg',
            projectId: 'testProject',
            wikiId: 'testWiki',
            pagePath: '/Home',
        };
        // Act
        const result = await (0, feature_1.getWikiPage)(options);
        // Assert
        expect(result).toBe(mockWikiPageContent);
        expect(azureDevOpsClient.getWikiClient).toHaveBeenCalledWith({
            organizationId: 'testOrg',
            projectId: 'testProject',
        });
        expect(mockGetPage).toHaveBeenCalledWith('testProject', 'testWiki', '/Home');
    });
    it('should properly handle wiki page path', async () => {
        // Arrange
        const options = {
            organizationId: 'testOrg',
            projectId: 'testProject',
            wikiId: 'testWiki',
            pagePath: '/Path with spaces/And special chars $&+,/:;=?@',
        };
        // Act
        await (0, feature_1.getWikiPage)(options);
        // Assert
        expect(mockGetPage).toHaveBeenCalledWith('testProject', 'testWiki', '/Path with spaces/And special chars $&+,/:;=?@');
    });
    it('should throw ResourceNotFoundError when wiki page is not found', async () => {
        // Arrange
        mockGetPage.mockRejectedValue(new errors_1.AzureDevOpsResourceNotFoundError('Page not found'));
        // Act & Assert
        const options = {
            organizationId: 'testOrg',
            projectId: 'testProject',
            wikiId: 'testWiki',
            pagePath: '/NonExistentPage',
        };
        await expect((0, feature_1.getWikiPage)(options)).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
    });
    it('should throw PermissionError when user lacks permissions', async () => {
        // Arrange
        mockGetPage.mockRejectedValue(new errors_1.AzureDevOpsPermissionError('Permission denied'));
        // Act & Assert
        const options = {
            organizationId: 'testOrg',
            projectId: 'testProject',
            wikiId: 'testWiki',
            pagePath: '/RestrictedPage',
        };
        await expect((0, feature_1.getWikiPage)(options)).rejects.toThrow(errors_1.AzureDevOpsPermissionError);
    });
    it('should throw generic error for other failures', async () => {
        // Arrange
        mockGetPage.mockRejectedValue(new Error('Network error'));
        // Act & Assert
        const options = {
            organizationId: 'testOrg',
            projectId: 'testProject',
            wikiId: 'testWiki',
            pagePath: '/AnyPage',
        };
        await expect((0, feature_1.getWikiPage)(options)).rejects.toThrow(errors_1.AzureDevOpsError);
    });
});
//# sourceMappingURL=feature.spec.unit.js.map