"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const azure_devops_1 = require("./azure-devops");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('WikiClient base urls', () => {
    const originalEnv = process.env;
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = {
            ...originalEnv,
            AZURE_DEVOPS_AUTH_METHOD: 'pat',
            AZURE_DEVOPS_PAT: 'test-pat',
        };
    });
    afterEach(() => {
        process.env = originalEnv;
    });
    it('uses server base url when organizationUrl points to Azure DevOps Server', async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                value: [],
            },
        });
        const client = await (0, azure_devops_1.getWikiClient)({
            organizationUrl: 'https://ado.local/tfs/DefaultCollection',
            projectId: 'ProjectX',
        });
        await client.listWikiPages('ProjectX', 'wiki1');
        expect(mockedAxios.post).toHaveBeenCalledWith('https://ado.local/tfs/DefaultCollection/ProjectX/_apis/wiki/wikis/wiki1/pagesbatch', expect.any(Object), expect.objectContaining({
            params: {
                'api-version': '7.1',
            },
            headers: expect.any(Object),
        }));
    });
});
//# sourceMappingURL=azure-devops.spec.unit.js.map