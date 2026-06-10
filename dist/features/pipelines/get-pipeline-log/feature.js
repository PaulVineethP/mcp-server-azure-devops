"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPipelineLog = getPipelineLog;
const errors_1 = require("../../../shared/errors");
const environment_1 = require("../../../utils/environment");
const API_VERSION = '7.1';
async function getPipelineLog(connection, options) {
    try {
        const buildApi = await connection.getBuildApi();
        const projectId = options.projectId ?? environment_1.defaultProject;
        const { runId, logId, format, startLine, endLine } = options;
        if (format === 'json') {
            const route = `${encodeURIComponent(projectId)}/_apis/build/builds/${runId}/logs/${logId}`;
            const baseUrl = connection.serverUrl.replace(/\/+$/, '');
            const url = new URL(`${route}`, `${baseUrl}/`);
            url.searchParams.set('api-version', API_VERSION);
            url.searchParams.set('format', 'json');
            if (typeof startLine === 'number') {
                url.searchParams.set('startLine', startLine.toString());
            }
            if (typeof endLine === 'number') {
                url.searchParams.set('endLine', endLine.toString());
            }
            const requestOptions = buildApi.createRequestOptions('application/json', API_VERSION);
            const response = await buildApi.rest.get(url.toString(), requestOptions);
            if (response.statusCode === 404 || response.result === null) {
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Log ${logId} not found for run ${runId} in project ${projectId}`);
            }
            return response.result;
        }
        const lines = await buildApi.getBuildLogLines(projectId, runId, logId, startLine, endLine);
        if (!lines) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Log ${logId} not found for run ${runId} in project ${projectId}`);
        }
        return lines.join('\n');
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
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline log or project not found: ${error.message}`);
            }
        }
        throw new errors_1.AzureDevOpsError(`Failed to retrieve pipeline log: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map