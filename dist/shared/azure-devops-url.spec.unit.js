"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const azure_devops_url_1 = require("./azure-devops-url");
describe('resolveAzureDevOpsBaseUrls', () => {
    it('parses dev.azure.com org and builds base urls', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://dev.azure.com/my-org');
        expect(result).toEqual(expect.objectContaining({
            type: 'services',
            organization: 'my-org',
            coreBaseUrl: 'https://dev.azure.com/my-org',
            searchBaseUrl: 'https://almsearch.dev.azure.com/my-org',
        }));
    });
    it('parses visualstudio.com org and normalizes to dev.azure.com base urls', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://legacyorg.visualstudio.com/DefaultCollection');
        expect(result).toEqual(expect.objectContaining({
            type: 'services',
            organization: 'legacyorg',
            coreBaseUrl: 'https://dev.azure.com/legacyorg',
            searchBaseUrl: 'https://almsearch.dev.azure.com/legacyorg',
        }));
    });
    it('uses organization override for services', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://dev.azure.com/source', {
            organizationId: 'override',
        });
        expect(result).toEqual(expect.objectContaining({
            type: 'services',
            organization: 'override',
        }));
    });
    it('parses server url with collection and tfs virtual dir', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://ado.local/tfs/DefaultCollection');
        expect(result).toEqual(expect.objectContaining({
            type: 'server',
            collection: 'DefaultCollection',
            instanceBaseUrl: 'https://ado.local/tfs',
            coreBaseUrl: 'https://ado.local/tfs/DefaultCollection',
            searchBaseUrl: 'https://ado.local/tfs/DefaultCollection',
        }));
    });
    it('parses server url with project when projectId provided', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://ado.local/tfs/DefaultCollection/ProjectX', {
            projectId: 'ProjectX',
        });
        expect(result).toEqual(expect.objectContaining({
            type: 'server',
            collection: 'DefaultCollection',
            instanceBaseUrl: 'https://ado.local/tfs',
            coreBaseUrl: 'https://ado.local/tfs/DefaultCollection',
        }));
    });
    it('parses server url with collection and no virtual dir (issue #277 shape)', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://ado.local/ORG/');
        expect(result).toEqual(expect.objectContaining({
            type: 'server',
            collection: 'ORG',
            instanceBaseUrl: 'https://ado.local',
            coreBaseUrl: 'https://ado.local/ORG',
            searchBaseUrl: 'https://ado.local/ORG',
        }));
    });
    it('parses server url with collection + project (no virtual dir) when projectId provided', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://ado.local/ORG/ProjectX', {
            projectId: 'ProjectX',
        });
        expect(result).toEqual(expect.objectContaining({
            type: 'server',
            collection: 'ORG',
            instanceBaseUrl: 'https://ado.local',
            coreBaseUrl: 'https://ado.local/ORG',
        }));
    });
    it('parses server url with custom virtual dir when projectId provided', () => {
        const result = (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://ado.local/azuredevops/Collection/ProjectX', {
            projectId: 'ProjectX',
        });
        expect(result).toEqual(expect.objectContaining({
            type: 'server',
            collection: 'Collection',
            instanceBaseUrl: 'https://ado.local/azuredevops',
            coreBaseUrl: 'https://ado.local/azuredevops/Collection',
        }));
    });
    it('throws when services url is missing organization', () => {
        expect(() => (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('https://dev.azure.com/')).toThrow(errors_1.AzureDevOpsValidationError);
    });
    it('throws when url is missing scheme', () => {
        expect(() => (0, azure_devops_url_1.resolveAzureDevOpsBaseUrls)('dev.azure.com/myorg')).toThrow(errors_1.AzureDevOpsValidationError);
    });
});
describe('isAzureDevOpsServicesUrl', () => {
    it('returns true for dev.azure.com and visualstudio.com urls', () => {
        expect((0, azure_devops_url_1.isAzureDevOpsServicesUrl)('https://dev.azure.com/my-org')).toBe(true);
        expect((0, azure_devops_url_1.isAzureDevOpsServicesUrl)('https://legacy.visualstudio.com')).toBe(true);
    });
    it('returns false for server urls and invalid urls', () => {
        expect((0, azure_devops_url_1.isAzureDevOpsServicesUrl)('https://ado.local/tfs/DefaultCollection')).toBe(false);
        expect((0, azure_devops_url_1.isAzureDevOpsServicesUrl)('not-a-url')).toBe(false);
    });
});
//# sourceMappingURL=azure-devops-url.spec.unit.js.map