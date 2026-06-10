"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const auth_factory_1 = require("./shared/auth/auth-factory");
describe('index', () => {
    describe('normalizeAuthMethod', () => {
        it('should return AzureIdentity when authMethodStr is undefined', () => {
            // Arrange
            const authMethodStr = undefined;
            // Act
            const result = (0, index_1.normalizeAuthMethod)(authMethodStr);
            // Assert
            expect(result).toBe(auth_factory_1.AuthenticationMethod.AzureIdentity);
        });
        it('should return AzureIdentity when authMethodStr is empty', () => {
            // Arrange
            const authMethodStr = '';
            // Act
            const result = (0, index_1.normalizeAuthMethod)(authMethodStr);
            // Assert
            expect(result).toBe(auth_factory_1.AuthenticationMethod.AzureIdentity);
        });
        it('should handle PersonalAccessToken case-insensitively', () => {
            // Arrange
            const variations = ['pat', 'PAT', 'Pat', 'pAt', 'paT'];
            // Act & Assert
            variations.forEach((variant) => {
                expect((0, index_1.normalizeAuthMethod)(variant)).toBe(auth_factory_1.AuthenticationMethod.PersonalAccessToken);
            });
        });
        it('should handle AzureIdentity case-insensitively', () => {
            // Arrange
            const variations = [
                'azure-identity',
                'AZURE-IDENTITY',
                'Azure-Identity',
                'azure-Identity',
                'Azure-identity',
            ];
            // Act & Assert
            variations.forEach((variant) => {
                expect((0, index_1.normalizeAuthMethod)(variant)).toBe(auth_factory_1.AuthenticationMethod.AzureIdentity);
            });
        });
        it('should handle AzureCli case-insensitively', () => {
            // Arrange
            const variations = [
                'azure-cli',
                'AZURE-CLI',
                'Azure-Cli',
                'azure-Cli',
                'Azure-cli',
            ];
            // Act & Assert
            variations.forEach((variant) => {
                expect((0, index_1.normalizeAuthMethod)(variant)).toBe(auth_factory_1.AuthenticationMethod.AzureCli);
            });
        });
        it('should return AzureIdentity for unrecognized values', () => {
            // Arrange
            const unrecognized = [
                'unknown',
                'azureCli', // no hyphen
                'azureIdentity', // no hyphen
                'personal-access-token', // not matching enum value
                'cli',
                'identity',
            ];
            // Act & Assert (mute stderr for warning messages)
            const originalStderrWrite = process.stderr.write;
            process.stderr.write = jest.fn();
            try {
                unrecognized.forEach((value) => {
                    expect((0, index_1.normalizeAuthMethod)(value)).toBe(auth_factory_1.AuthenticationMethod.AzureIdentity);
                });
            }
            finally {
                process.stderr.write = originalStderrWrite;
            }
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map