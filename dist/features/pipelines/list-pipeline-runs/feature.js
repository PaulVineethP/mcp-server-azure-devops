"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPipelineRuns = listPipelineRuns;
const PipelinesInterfaces_1 = require("azure-devops-node-api/interfaces/PipelinesInterfaces");
const errors_1 = require("../../../shared/errors");
const environment_1 = require("../../../utils/environment");
const API_VERSION = '7.1';
function normalizeBranch(branch) {
    if (!branch) {
        return undefined;
    }
    const trimmed = branch.trim();
    if (trimmed.startsWith('refs/')) {
        return trimmed;
    }
    return `refs/heads/${trimmed}`;
}
function extractContinuationToken(headers, result) {
    for (const [key, value] of Object.entries(headers ?? {})) {
        if (key.toLowerCase() === 'x-ms-continuationtoken') {
            if (Array.isArray(value)) {
                return value[0];
            }
            if (typeof value === 'string') {
                return value;
            }
        }
    }
    if (result && typeof result === 'object') {
        const continuationToken = result
            .continuationToken;
        if (typeof continuationToken === 'string' && continuationToken.length > 0) {
            return continuationToken;
        }
    }
    return undefined;
}
async function listPipelineRuns(connection, options) {
    try {
        const pipelinesApi = await connection.getPipelinesApi();
        const projectId = options.projectId ?? environment_1.defaultProject;
        const pipelineId = options.pipelineId;
        const baseUrl = connection.serverUrl.replace(/\/+$/, '');
        const route = `${encodeURIComponent(projectId)}/_apis/pipelines/${pipelineId}/runs`;
        const url = new URL(`${route}`, `${baseUrl}/`);
        url.searchParams.set('api-version', API_VERSION);
        const top = Math.min(Math.max(options.top ?? 50, 1), 100);
        url.searchParams.set('$top', top.toString());
        if (options.continuationToken) {
            url.searchParams.set('continuationToken', options.continuationToken);
        }
        const branch = normalizeBranch(options.branch);
        if (branch) {
            url.searchParams.set('branch', branch);
        }
        if (options.state) {
            url.searchParams.set('state', options.state);
        }
        if (options.result) {
            url.searchParams.set('result', options.result);
        }
        if (options.createdFrom) {
            url.searchParams.set('createdDate/min', options.createdFrom);
        }
        if (options.createdTo) {
            url.searchParams.set('createdDate/max', options.createdTo);
        }
        url.searchParams.set('orderBy', options.orderBy ?? 'createdDate desc');
        const requestOptions = pipelinesApi.createRequestOptions('application/json', API_VERSION);
        const response = await pipelinesApi.rest.get(url.toString(), requestOptions);
        if (response.statusCode === 404 || !response.result) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline ${pipelineId} or project ${projectId} not found`);
        }
        const runs = pipelinesApi.formatResponse(response.result, PipelinesInterfaces_1.TypeInfo.Run, true) ?? [];
        const continuationToken = extractContinuationToken(response.headers, response.result);
        return continuationToken ? { runs, continuationToken } : { runs };
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsError) {
            throw error;
        }
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('authentication') ||
                message.includes('unauthorized') ||
                message.includes('401')) {
                throw new errors_1.AzureDevOpsAuthenticationError(`Failed to authenticate: ${error.message}`);
            }
            if (message.includes('not found') ||
                message.includes('does not exist') ||
                message.includes('404')) {
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline or project not found: ${error.message}`);
            }
        }
        throw new errors_1.AzureDevOpsError(`Failed to list pipeline runs: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map