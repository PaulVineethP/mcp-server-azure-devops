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
exports.handleSearchRequest = exports.isSearchRequest = void 0;
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./search-code"), exports);
__exportStar(require("./search-wiki"), exports);
__exportStar(require("./search-work-items"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const _1 = require("./");
/**
 * Checks if the request is for the search feature
 */
const isSearchRequest = (request) => {
    const toolName = request.params.name;
    return ['search_code', 'search_wiki', 'search_work_items'].includes(toolName);
};
exports.isSearchRequest = isSearchRequest;
/**
 * Handles search feature requests
 */
const handleSearchRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'search_code': {
            const args = _1.SearchCodeSchema.parse(request.params.arguments);
            const result = await (0, _1.searchCode)(connection, args);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'search_wiki': {
            const args = _1.SearchWikiSchema.parse(request.params.arguments);
            const result = await (0, _1.searchWiki)(connection, args);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'search_work_items': {
            const args = _1.SearchWorkItemsSchema.parse(request.params.arguments);
            const result = await (0, _1.searchWorkItems)(connection, args);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown search tool: ${request.params.name}`);
    }
};
exports.handleSearchRequest = handleSearchRequest;
//# sourceMappingURL=index.js.map