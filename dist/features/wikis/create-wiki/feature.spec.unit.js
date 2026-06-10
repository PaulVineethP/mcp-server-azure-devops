"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../shared/errors");
const feature_1 = require("./feature");
const schema_1 = require("./schema");
const azure_devops_1 = require("../../../clients/azure-devops");
// Mock the WikiClient
jest.mock('../../../clients/azure-devops');
describe('createWiki unit', () => {
    // Mock WikiClient
    const mockWikiClient = {
        createWiki: jest.fn(),
    };
    // Mock WebApi connection (kept for backward compatibility)
    const mockConnection = {};
    beforeEach(() => {
        // Clear mock calls between tests
        jest.clearAllMocks();
        // Setup mock response for getWikiClient
        azure_devops_1.getWikiClient.mockResolvedValue(mockWikiClient);
    });
    test('should create a project wiki', async () => {
        // Mock data
        const mockWiki = {
            id: 'wiki1',
            name: 'Project Wiki',
            projectId: 'project1',
            remoteUrl: 'https://example.com/wiki1',
            url: 'https://dev.azure.com/org/project/_wiki/wikis/wiki1',
            type: 'projectWiki',
            repositoryId: 'repo1',
            mappedPath: '/',
        };
        // Setup mock response
        mockWikiClient.createWiki.mockResolvedValue(mockWiki);
        // Call the function
        const result = await (0, feature_1.createWiki)(mockConnection, {
            name: 'Project Wiki',
            projectId: 'project1',
        });
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'project1',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalledWith('project1', {
            name: 'Project Wiki',
            projectId: 'project1',
            type: schema_1.WikiType.ProjectWiki,
        });
        expect(result).toEqual(mockWiki);
    });
    test('should create a code wiki', async () => {
        // Mock data
        const mockWiki = {
            id: 'wiki2',
            name: 'Code Wiki',
            projectId: 'project1',
            repositoryId: 'repo1',
            mappedPath: '/docs',
            remoteUrl: 'https://example.com/wiki2',
            url: 'https://dev.azure.com/org/project/_wiki/wikis/wiki2',
            type: 'codeWiki',
        };
        // Setup mock response
        mockWikiClient.createWiki.mockResolvedValue(mockWiki);
        // Call the function
        const result = await (0, feature_1.createWiki)(mockConnection, {
            name: 'Code Wiki',
            projectId: 'project1',
            type: schema_1.WikiType.CodeWiki,
            repositoryId: 'repo1',
            mappedPath: '/docs',
        });
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'project1',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalledWith('project1', {
            name: 'Code Wiki',
            projectId: 'project1',
            type: schema_1.WikiType.CodeWiki,
            repositoryId: 'repo1',
            mappedPath: '/docs',
            version: {
                version: 'main',
                versionType: 'branch',
            },
        });
        expect(result).toEqual(mockWiki);
    });
    test('should throw validation error when repository ID is missing for code wiki', async () => {
        // Call the function and expect it to throw
        await expect((0, feature_1.createWiki)(mockConnection, {
            name: 'Code Wiki',
            projectId: 'project1',
            type: schema_1.WikiType.CodeWiki,
            // repositoryId is missing
        })).rejects.toThrow(errors_1.AzureDevOpsValidationError);
        // Assertions
        expect(azure_devops_1.getWikiClient).not.toHaveBeenCalled();
        expect(mockWikiClient.createWiki).not.toHaveBeenCalled();
    });
    test('should handle project not found error', async () => {
        // Setup mock to throw an error
        mockWikiClient.createWiki.mockRejectedValue(new errors_1.AzureDevOpsResourceNotFoundError('Project not found'));
        // Call the function and expect it to throw
        await expect((0, feature_1.createWiki)(mockConnection, {
            name: 'Project Wiki',
            projectId: 'nonExistentProject',
        })).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'nonExistentProject',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalled();
    });
    test('should handle repository not found error', async () => {
        // Setup mock to throw an error
        mockWikiClient.createWiki.mockRejectedValue(new errors_1.AzureDevOpsResourceNotFoundError('Repository not found'));
        // Call the function and expect it to throw
        await expect((0, feature_1.createWiki)(mockConnection, {
            name: 'Code Wiki',
            projectId: 'project1',
            type: schema_1.WikiType.CodeWiki,
            repositoryId: 'nonExistentRepo',
        })).rejects.toThrow(errors_1.AzureDevOpsResourceNotFoundError);
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'project1',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalled();
    });
    test('should handle permission error', async () => {
        // Setup mock to throw an error
        mockWikiClient.createWiki.mockRejectedValue(new errors_1.AzureDevOpsPermissionError('You do not have permission'));
        // Call the function and expect it to throw
        await expect((0, feature_1.createWiki)(mockConnection, {
            name: 'Project Wiki',
            projectId: 'project1',
        })).rejects.toThrow(errors_1.AzureDevOpsPermissionError);
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'project1',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalled();
    });
    test('should handle generic errors', async () => {
        // Setup mock to throw an error
        mockWikiClient.createWiki.mockRejectedValue(new Error('Unknown error'));
        // Call the function and expect it to throw
        await expect((0, feature_1.createWiki)(mockConnection, {
            name: 'Project Wiki',
            projectId: 'project1',
        })).rejects.toThrow(errors_1.AzureDevOpsError);
        // Assertions
        expect(azure_devops_1.getWikiClient).toHaveBeenCalledWith({
            organizationId: undefined,
            projectId: 'project1',
        });
        expect(mockWikiClient.createWiki).toHaveBeenCalled();
    });
});
//# sourceMappingURL=feature.spec.unit.js.map