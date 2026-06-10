"use strict";
/**
 * Users feature module
 *
 * This module contains user-related functionality.
 */
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
exports.handleUsersRequest = exports.isUsersRequest = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./get-me"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const _1 = require("./");
/**
 * Checks if the request is for the users feature
 */
const isUsersRequest = (request) => {
    const toolName = request.params.name;
    return ['get_me'].includes(toolName);
};
exports.isUsersRequest = isUsersRequest;
/**
 * Handles users feature requests
 */
const handleUsersRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'get_me': {
            const result = await (0, _1.getMe)(connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown users tool: ${request.params.name}`);
    }
};
exports.handleUsersRequest = handleUsersRequest;
//# sourceMappingURL=index.js.map