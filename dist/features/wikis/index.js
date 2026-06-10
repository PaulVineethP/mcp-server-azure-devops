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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWikisRequest = exports.isWikisRequest = exports.CreateWikiPageSchema = exports.createWikiPage = exports.ListWikiPagesSchema = exports.listWikiPages = exports.UpdateWikiPageSchema = exports.updateWikiPage = exports.WikiType = exports.CreateWikiSchema = exports.createWiki = exports.GetWikiPageSchema = exports.getWikiPage = exports.GetWikisSchema = exports.getWikis = void 0;
var get_wikis_1 = require("./get-wikis");
Object.defineProperty(exports, "getWikis", { enumerable: true, get: function () { return get_wikis_1.getWikis; } });
Object.defineProperty(exports, "GetWikisSchema", { enumerable: true, get: function () { return get_wikis_1.GetWikisSchema; } });
var get_wiki_page_1 = require("./get-wiki-page");
Object.defineProperty(exports, "getWikiPage", { enumerable: true, get: function () { return get_wiki_page_1.getWikiPage; } });
Object.defineProperty(exports, "GetWikiPageSchema", { enumerable: true, get: function () { return get_wiki_page_1.GetWikiPageSchema; } });
var create_wiki_1 = require("./create-wiki");
Object.defineProperty(exports, "createWiki", { enumerable: true, get: function () { return create_wiki_1.createWiki; } });
Object.defineProperty(exports, "CreateWikiSchema", { enumerable: true, get: function () { return create_wiki_1.CreateWikiSchema; } });
Object.defineProperty(exports, "WikiType", { enumerable: true, get: function () { return create_wiki_1.WikiType; } });
var update_wiki_page_1 = require("./update-wiki-page");
Object.defineProperty(exports, "updateWikiPage", { enumerable: true, get: function () { return update_wiki_page_1.updateWikiPage; } });
Object.defineProperty(exports, "UpdateWikiPageSchema", { enumerable: true, get: function () { return update_wiki_page_1.UpdateWikiPageSchema; } });
var list_wiki_pages_1 = require("./list-wiki-pages");
Object.defineProperty(exports, "listWikiPages", { enumerable: true, get: function () { return list_wiki_pages_1.listWikiPages; } });
Object.defineProperty(exports, "ListWikiPagesSchema", { enumerable: true, get: function () { return list_wiki_pages_1.ListWikiPagesSchema; } });
var create_wiki_page_1 = require("./create-wiki-page");
Object.defineProperty(exports, "createWikiPage", { enumerable: true, get: function () { return create_wiki_page_1.createWikiPage; } });
Object.defineProperty(exports, "CreateWikiPageSchema", { enumerable: true, get: function () { return create_wiki_page_1.CreateWikiPageSchema; } });
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const environment_1 = require("../../utils/environment");
const _1 = require("./");
/**
 * Checks if the request is for the wikis feature
 */
const isWikisRequest = (request) => {
    const toolName = request.params.name;
    return [
        'get_wikis',
        'get_wiki_page',
        'create_wiki',
        'update_wiki_page',
        'list_wiki_pages',
        'create_wiki_page',
    ].includes(toolName);
};
exports.isWikisRequest = isWikisRequest;
/**
 * Handles wikis feature requests
 */
const handleWikisRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'get_wikis': {
            const args = _1.GetWikisSchema.parse(request.params.arguments);
            const result = await (0, _1.getWikis)(connection, {
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_wiki_page': {
            const args = _1.GetWikiPageSchema.parse(request.params.arguments);
            const result = await (0, _1.getWikiPage)({
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
                wikiId: args.wikiId,
                pagePath: args.pagePath,
            });
            return {
                content: [{ type: 'text', text: result }],
            };
        }
        case 'create_wiki': {
            const args = _1.CreateWikiSchema.parse(request.params.arguments);
            const result = await (0, _1.createWiki)(connection, {
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
                name: args.name,
                type: args.type,
                repositoryId: args.repositoryId ?? undefined,
                mappedPath: args.mappedPath ?? undefined,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'update_wiki_page': {
            const args = _1.UpdateWikiPageSchema.parse(request.params.arguments);
            const result = await (0, _1.updateWikiPage)({
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
                wikiId: args.wikiId,
                pagePath: args.pagePath,
                content: args.content,
                comment: args.comment,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'list_wiki_pages': {
            const args = _1.ListWikiPagesSchema.parse(request.params.arguments);
            const result = await (0, _1.listWikiPages)({
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
                wikiId: args.wikiId,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_wiki_page': {
            const args = _1.CreateWikiPageSchema.parse(request.params.arguments);
            const result = await (0, _1.createWikiPage)({
                organizationId: args.organizationId ?? environment_1.defaultOrg,
                projectId: args.projectId ?? environment_1.defaultProject,
                wikiId: args.wikiId,
                pagePath: args.pagePath,
                content: args.content,
                comment: args.comment,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown wikis tool: ${request.params.name}`);
    }
};
exports.handleWikisRequest = handleWikisRequest;
//# sourceMappingURL=index.js.map