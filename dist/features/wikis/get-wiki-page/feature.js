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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWikiPage = getWikiPage;
const azureDevOpsClient = __importStar(require("../../../clients/azure-devops"));
const azure_devops_errors_1 = require("../../../shared/errors/azure-devops-errors");
/**
 * Get a wiki page from a wiki
 *
 * @param options Options for getting a wiki page
 * @returns Wiki page content as text/plain
 * @throws {AzureDevOpsResourceNotFoundError} When the wiki page is not found
 * @throws {AzureDevOpsPermissionError} When the user does not have permission to access the wiki page
 * @throws {AzureDevOpsError} When an error occurs while fetching the wiki page
 */
async function getWikiPage(options) {
    const { organizationId, projectId, wikiId, pagePath } = options;
    try {
        // Create the client
        const client = await azureDevOpsClient.getWikiClient({
            organizationId,
            projectId,
        });
        // Get the wiki page
        return (await client.getPage(projectId, wikiId, pagePath)).content;
    }
    catch (error) {
        // If it's already an AzureDevOpsError, rethrow it
        if (error instanceof azure_devops_errors_1.AzureDevOpsError) {
            throw error;
        }
        // Otherwise wrap it in an AzureDevOpsError
        throw new azure_devops_errors_1.AzureDevOpsError('Failed to get wiki page', { cause: error });
    }
}
//# sourceMappingURL=feature.js.map