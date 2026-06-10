"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_factory_1 = require("./auth-factory");
const errors_1 = require("../errors");
jest.mock('azure-devops-node-api', () => ({
    WebApi: jest.fn().mockImplementation(() => ({
        getLocationsApi: jest.fn().mockResolvedValue({
            getResourceAreas: jest.fn().mockResolvedValue([]),
        }),
    })),
    getPersonalAccessTokenHandler: jest.fn().mockReturnValue({}),
}));
jest.mock('@azure/identity', () => ({
    DefaultAzureCredential: jest.fn(),
    AzureCliCredential: jest.fn(),
}));
describe('createAuthClient server auth guard', () => {
    it('rejects Azure Identity for Azure DevOps Server URLs', async () => {
        await expect((0, auth_factory_1.createAuthClient)({
            method: auth_factory_1.AuthenticationMethod.AzureIdentity,
            organizationUrl: 'https://ado.local/tfs/DefaultCollection',
        })).rejects.toThrow(errors_1.AzureDevOpsAuthenticationError);
    });
    it('rejects Azure CLI auth for Azure DevOps Server URLs', async () => {
        await expect((0, auth_factory_1.createAuthClient)({
            method: auth_factory_1.AuthenticationMethod.AzureCli,
            organizationUrl: 'https://ado.local/tfs/DefaultCollection',
        })).rejects.toThrow(errors_1.AzureDevOpsAuthenticationError);
    });
    it('allows PAT auth for Azure DevOps Server URLs', async () => {
        await expect((0, auth_factory_1.createAuthClient)({
            method: auth_factory_1.AuthenticationMethod.PersonalAccessToken,
            organizationUrl: 'https://ado.local/tfs/DefaultCollection',
            personalAccessToken: 'test-pat',
        })).resolves.toBeDefined();
    });
});
//# sourceMappingURL=auth-factory.spec.unit.js.map