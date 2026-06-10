"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const feature_1 = require("./feature");
const errors_1 = require("@/shared/errors");
// Mock axios
jest.mock('axios');
const mockAxios = axios_1.default;
// Mock env variables
const originalEnv = process.env;
describe('getMe', () => {
    let mockConnection;
    beforeEach(() => {
        // Reset mocks
        jest.resetAllMocks();
        // Mock WebApi with a server URL
        mockConnection = {
            serverUrl: 'https://dev.azure.com/testorg',
        };
        // Mock environment variables for PAT authentication
        process.env = {
            ...originalEnv,
            AZURE_DEVOPS_AUTH_METHOD: 'pat',
            AZURE_DEVOPS_PAT: 'test-pat',
        };
    });
    afterEach(() => {
        // Restore original env
        process.env = originalEnv;
    });
    it('should return user profile with id, displayName, and email', async () => {
        // Arrange
        const mockProfile = {
            id: 'user-id-123',
            displayName: 'Test User',
            emailAddress: 'test.user@example.com',
            coreRevision: 1647,
            timeStamp: '2023-01-01T00:00:00.000Z',
            revision: 1647,
        };
        // Mock axios get to return profile data
        mockAxios.get.mockResolvedValue({ data: mockProfile });
        // Act
        const result = await (0, feature_1.getMe)(mockConnection);
        // Assert
        expect(mockAxios.get).toHaveBeenCalledWith('https://vssps.dev.azure.com/testorg/_apis/profile/profiles/me?api-version=7.1', expect.any(Object));
        expect(result).toEqual({
            id: 'user-id-123',
            displayName: 'Test User',
            email: 'test.user@example.com',
        });
    });
    it('should decode organization name from URL-encoded dev.azure.com org urls', async () => {
        mockConnection = {
            serverUrl: 'https://dev.azure.com/test%2Dorg',
        };
        const mockProfile = {
            id: 'user-id-123',
            displayName: 'Test User',
            emailAddress: 'test.user@example.com',
            coreRevision: 1647,
            timeStamp: '2023-01-01T00:00:00.000Z',
            revision: 1647,
        };
        mockAxios.get.mockResolvedValue({ data: mockProfile });
        await (0, feature_1.getMe)(mockConnection);
        expect(mockAxios.get).toHaveBeenCalledWith('https://vssps.dev.azure.com/test-org/_apis/profile/profiles/me?api-version=7.1', expect.any(Object));
    });
    it('should handle missing email', async () => {
        // Arrange
        const mockProfile = {
            id: 'user-id-123',
            displayName: 'Test User',
            // No emailAddress
            coreRevision: 1647,
            timeStamp: '2023-01-01T00:00:00.000Z',
            revision: 1647,
        };
        // Mock axios get to return profile data
        mockAxios.get.mockResolvedValue({ data: mockProfile });
        // Act
        const result = await (0, feature_1.getMe)(mockConnection);
        // Assert
        expect(result.email).toBe('');
    });
    it('should handle missing display name', async () => {
        // Arrange
        const mockProfile = {
            id: 'user-id-123',
            // No displayName
            emailAddress: 'test.user@example.com',
            coreRevision: 1647,
            timeStamp: '2023-01-01T00:00:00.000Z',
            revision: 1647,
        };
        // Mock axios get to return profile data
        mockAxios.get.mockResolvedValue({ data: mockProfile });
        // Act
        const result = await (0, feature_1.getMe)(mockConnection);
        // Assert
        expect(result.displayName).toBe('');
    });
    it('should handle authentication errors', async () => {
        // Arrange
        const axiosError = {
            isAxiosError: true,
            response: {
                status: 401,
                data: { message: 'Unauthorized' },
            },
            message: 'Request failed with status code 401',
        };
        // Mock axios get to throw error
        mockAxios.get.mockRejectedValue(axiosError);
        // Mock axios.isAxiosError function
        jest.spyOn(axios_1.default, 'isAxiosError').mockImplementation(() => true);
        // Act & Assert
        await expect((0, feature_1.getMe)(mockConnection)).rejects.toThrow(errors_1.AzureDevOpsAuthenticationError);
        await expect((0, feature_1.getMe)(mockConnection)).rejects.toThrow(/Authentication failed/);
    });
    it('should reject Azure DevOps Server URLs', async () => {
        mockConnection = {
            serverUrl: 'https://ado.local/tfs/DefaultCollection',
        };
        await expect((0, feature_1.getMe)(mockConnection)).rejects.toThrow(errors_1.AzureDevOpsValidationError);
    });
    it('should wrap general errors in AzureDevOpsError', async () => {
        // Arrange
        const testError = new Error('Test API error');
        mockAxios.get.mockRejectedValue(testError);
        // Mock axios.isAxiosError function
        jest.spyOn(axios_1.default, 'isAxiosError').mockImplementation(() => false);
        // Act & Assert
        await expect((0, feature_1.getMe)(mockConnection)).rejects.toThrow(errors_1.AzureDevOpsError);
        await expect((0, feature_1.getMe)(mockConnection)).rejects.toThrow('Failed to get user information: Test API error');
    });
    // Test the legacy URL format of project.visualstudio.com
    it('should work with legacy visualstudio.com URL format', async () => {
        mockConnection = {
            serverUrl: 'https://legacy_test_org.visualstudio.com',
        };
        const mockProfile = {
            id: 'user-id-123',
            displayName: 'Test User',
            emailAddress: 'test.user@example.com',
            coreRevision: 1647,
            timeStamp: '2023-01-01T00:00:00.000Z',
            revision: 1647,
        };
        mockAxios.get.mockResolvedValue({ data: mockProfile });
        const result = await (0, feature_1.getMe)(mockConnection);
        // Verify that the organization name was correctly extracted from the legacy URL
        expect(mockAxios.get).toHaveBeenCalledWith('https://vssps.dev.azure.com/legacy_test_org/_apis/profile/profiles/me?api-version=7.1', expect.any(Object));
        expect(result).toEqual({
            id: 'user-id-123',
            displayName: 'Test User',
            email: 'test.user@example.com',
        });
    });
});
//# sourceMappingURL=feature.spec.unit.js.map