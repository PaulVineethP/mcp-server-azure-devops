"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikisTools = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schema_1 = require("./get-wikis/schema");
const schema_2 = require("./get-wiki-page/schema");
const schema_3 = require("./create-wiki/schema");
const schema_4 = require("./update-wiki-page/schema");
const schema_5 = require("./list-wiki-pages/schema");
const schema_6 = require("./create-wiki-page/schema");
/**
 * List of wikis tools
 */
exports.wikisTools = [
    {
        name: 'get_wikis',
        description: 'Get details of wikis in a project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_1.GetWikisSchema),
    },
    {
        name: 'get_wiki_page',
        description: 'Get the content of a wiki page',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_2.GetWikiPageSchema),
    },
    {
        name: 'create_wiki',
        description: 'Create a new wiki in the project',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_3.CreateWikiSchema),
    },
    {
        name: 'update_wiki_page',
        description: 'Update content of a wiki page',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_4.UpdateWikiPageSchema),
    },
    {
        name: 'list_wiki_pages',
        description: 'List pages within an Azure DevOps wiki',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_5.ListWikiPagesSchema),
    },
    {
        name: 'create_wiki_page',
        description: 'Create a new page in a wiki. If the page already exists at the specified path, it will be updated.',
        inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(schema_6.CreateWikiPageSchema),
    },
];
//# sourceMappingURL=tool-definitions.js.map