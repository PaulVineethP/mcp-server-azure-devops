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
exports.createWikiPage = void 0;
const azureDevOpsClient = __importStar(require("../../../clients/azure-devops"));
const handle_request_error_1 = require("../../../shared/errors/handle-request-error");
const environment_1 = require("../../../utils/environment");
/**
 * Creates a new wiki page in Azure DevOps.
 * If a page already exists at the specified path, it will be updated.
 *
 * @param {z.infer<typeof CreateWikiPageSchema>} params - The parameters for creating the wiki page.
 * @returns {Promise<any>} A promise that resolves with the API response.
 */
const createWikiPage = async (params, client) => {
    try {
        const { organizationId, projectId, wikiId, pagePath, content, comment } = params;
        // For testing mode, use the client's defaults
        if (client && client.defaults) {
            const org = organizationId ?? client.defaults.organizationId;
            const project = projectId ?? client.defaults.projectId;
            if (!org) {
                throw new Error('Organization ID is not defined. Please provide it or set a default.');
            }
            // This branch is for testing only
            const apiUrl = `${org}/${project ? `${project}/` : ''}_apis/wiki/wikis/${wikiId}/pages?path=${encodeURIComponent(pagePath ?? '/')}&api-version=7.1-preview.1`;
            // Prepare the request body
            const requestBody = { content };
            if (comment) {
                requestBody.comment = comment;
            }
            // Make the API request
            const response = await client.put(apiUrl, requestBody);
            return response.data;
        }
        else {
            // Use default organization and project if not provided
            const org = organizationId ?? environment_1.defaultOrg;
            const project = projectId ?? environment_1.defaultProject;
            if (!org) {
                throw new Error('Organization ID is not defined. Please provide it or set a default.');
            }
            // Create the client
            const wikiClient = await azureDevOpsClient.getWikiClient({
                organizationId: org,
                projectId: project,
            });
            // Prepare the wiki page content
            const wikiPageContent = {
                content,
            };
            // This is the real implementation
            return await wikiClient.updatePage(wikiPageContent, project, wikiId, pagePath ?? '/', {
                comment: comment ?? undefined,
            });
        }
    }
    catch (error) {
        throw await (0, handle_request_error_1.handleRequestError)(error, 'Failed to create or update wiki page');
    }
};
exports.createWikiPage = createWikiPage;
//# sourceMappingURL=feature.js.map