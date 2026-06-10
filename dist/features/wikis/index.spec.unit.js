"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const get_wikis_1 = require("./get-wikis");
const get_wiki_page_1 = require("./get-wiki-page");
const create_wiki_1 = require("./create-wiki");
const update_wiki_page_1 = require("./update-wiki-page");
// Mock the imported modules
jest.mock('./get-wikis', () => ({
    getWikis: jest.fn(),
    GetWikisSchema: {
        parse: jest.fn(),
    },
}));
jest.mock('./get-wiki-page', () => ({
    getWikiPage: jest.fn(),
    GetWikiPageSchema: {
        parse: jest.fn(),
    },
}));
jest.mock('./create-wiki', () => ({
    createWiki: jest.fn(),
    CreateWikiSchema: {
        parse: jest.fn(),
    },
    WikiType: {
        ProjectWiki: 'projectWiki',
        CodeWiki: 'codeWiki',
    },
}));
jest.mock('./update-wiki-page', () => ({
    updateWikiPage: jest.fn(),
    UpdateWikiPageSchema: {
        parse: jest.fn(),
    },
}));
describe('Wikis Request Handlers', () => {
    const mockConnection = {};
    describe('isWikisRequest', () => {
        it('should return true for wikis requests', () => {
            const validTools = [
                'get_wikis',
                'get_wiki_page',
                'create_wiki',
                'update_wiki_page',
            ];
            validTools.forEach((tool) => {
                const request = {
                    params: { name: tool, arguments: {} },
                    method: 'tools/call',
                };
                expect((0, index_1.isWikisRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-wikis requests', () => {
            const request = {
                params: { name: 'list_projects', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isWikisRequest)(request)).toBe(false);
        });
    });
    describe('handleWikisRequest', () => {
        it('should handle get_wikis request', async () => {
            const mockWikis = [
                { id: 'wiki1', name: 'Wiki 1' },
                { id: 'wiki2', name: 'Wiki 2' },
            ];
            get_wikis_1.getWikis.mockResolvedValue(mockWikis);
            const request = {
                params: {
                    name: 'get_wikis',
                    arguments: {
                        projectId: 'project1',
                    },
                },
                method: 'tools/call',
            };
            // Mock the arguments object after parsing
            get_wikis_1.GetWikisSchema.parse.mockReturnValue({
                projectId: 'project1',
            });
            const response = await (0, index_1.handleWikisRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockWikis);
            expect(get_wikis_1.getWikis).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'project1',
            }));
        });
        it('should handle get_wiki_page request', async () => {
            const mockWikiContent = '# Wiki Page\n\nThis is a wiki page content.';
            get_wiki_page_1.getWikiPage.mockResolvedValue(mockWikiContent);
            const request = {
                params: {
                    name: 'get_wiki_page',
                    arguments: {
                        projectId: 'project1',
                        wikiId: 'wiki1',
                        pagePath: '/Home',
                    },
                },
                method: 'tools/call',
            };
            // Mock the arguments object after parsing
            get_wiki_page_1.GetWikiPageSchema.parse.mockReturnValue({
                projectId: 'project1',
                wikiId: 'wiki1',
                pagePath: '/Home',
            });
            const response = await (0, index_1.handleWikisRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(response.content[0].text).toEqual(mockWikiContent);
            expect(get_wiki_page_1.getWikiPage).toHaveBeenCalledWith(expect.objectContaining({
                projectId: 'project1',
                wikiId: 'wiki1',
                pagePath: '/Home',
            }));
        });
        it('should handle create_wiki request', async () => {
            const mockWiki = { id: 'wiki1', name: 'New Wiki' };
            create_wiki_1.createWiki.mockResolvedValue(mockWiki);
            const request = {
                params: {
                    name: 'create_wiki',
                    arguments: {
                        projectId: 'project1',
                        name: 'New Wiki',
                        type: create_wiki_1.WikiType.ProjectWiki,
                    },
                },
                method: 'tools/call',
            };
            // Mock the arguments object after parsing
            create_wiki_1.CreateWikiSchema.parse.mockReturnValue({
                projectId: 'project1',
                name: 'New Wiki',
                type: create_wiki_1.WikiType.ProjectWiki,
                mappedPath: null, // Required field in the schema
            });
            const response = await (0, index_1.handleWikisRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockWiki);
            expect(create_wiki_1.createWiki).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'project1',
                name: 'New Wiki',
                type: create_wiki_1.WikiType.ProjectWiki,
            }));
        });
        it('should handle update_wiki_page request', async () => {
            const mockUpdateResult = { id: 'page1', content: 'Updated content' };
            update_wiki_page_1.updateWikiPage.mockResolvedValue(mockUpdateResult);
            const request = {
                params: {
                    name: 'update_wiki_page',
                    arguments: {
                        projectId: 'project1',
                        wikiId: 'wiki1',
                        pagePath: '/Home',
                        content: 'Updated content',
                        comment: 'Update home page',
                    },
                },
                method: 'tools/call',
            };
            // Mock the arguments object after parsing
            update_wiki_page_1.UpdateWikiPageSchema.parse.mockReturnValue({
                projectId: 'project1',
                wikiId: 'wiki1',
                pagePath: '/Home',
                content: 'Updated content',
                comment: 'Update home page',
            });
            const response = await (0, index_1.handleWikisRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockUpdateResult);
            expect(update_wiki_page_1.updateWikiPage).toHaveBeenCalledWith(expect.objectContaining({
                projectId: 'project1',
                wikiId: 'wiki1',
                pagePath: '/Home',
                content: 'Updated content',
                comment: 'Update home page',
            }));
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleWikisRequest)(mockConnection, request)).rejects.toThrow('Unknown wikis tool');
        });
        it('should propagate errors from wiki functions', async () => {
            const mockError = new Error('Test error');
            get_wikis_1.getWikis.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'get_wikis',
                    arguments: {
                        projectId: 'project1',
                    },
                },
                method: 'tools/call',
            };
            // Mock the arguments object after parsing
            get_wikis_1.GetWikisSchema.parse.mockReturnValue({
                projectId: 'project1',
            });
            await expect((0, index_1.handleWikisRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map