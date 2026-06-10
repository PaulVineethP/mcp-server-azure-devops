"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPipelineTimeline = getPipelineTimeline;
const BuildInterfaces_1 = require("azure-devops-node-api/interfaces/BuildInterfaces");
const errors_1 = require("../../../shared/errors");
const environment_1 = require("../../../utils/environment");
const API_VERSION = '7.1';
async function getPipelineTimeline(connection, options) {
    try {
        const buildApi = await connection.getBuildApi();
        const projectId = options.projectId ?? environment_1.defaultProject;
        const { runId, timelineId, state, result } = options;
        const route = `${encodeURIComponent(projectId)}/_apis/build/builds/${runId}/timeline`;
        const baseUrl = connection.serverUrl.replace(/\/+$/, '');
        const url = new URL(`${route}`, `${baseUrl}/`);
        url.searchParams.set('api-version', API_VERSION);
        if (timelineId) {
            url.searchParams.set('timelineId', timelineId);
        }
        const requestOptions = buildApi.createRequestOptions('application/json', API_VERSION);
        const response = await buildApi.rest.get(url.toString(), requestOptions);
        if (response.statusCode === 404 || !response.result) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Timeline not found for run ${runId} in project ${projectId}`);
        }
        const timeline = response.result;
        const stateFilters = normalizeFilter(state);
        const resultFilters = normalizeFilter(result);
        if (Array.isArray(timeline.records) && (stateFilters || resultFilters)) {
            const filteredRecords = timeline.records.filter((record) => {
                const recordState = stateToString(record.state);
                const recordResult = resultToString(record.result);
                const stateMatch = !stateFilters || (recordState && stateFilters.has(recordState));
                const resultMatch = !resultFilters || (recordResult && resultFilters.has(recordResult));
                return stateMatch && resultMatch;
            });
            return {
                ...timeline,
                records: filteredRecords,
            };
        }
        return timeline;
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
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline timeline or project not found: ${error.message}`);
            }
        }
        throw new errors_1.AzureDevOpsError(`Failed to retrieve pipeline timeline: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function normalizeFilter(value) {
    if (!value) {
        return undefined;
    }
    const values = Array.isArray(value) ? value : [value];
    const normalized = values
        .map((item) => (typeof item === 'string' ? item.trim().toLowerCase() : ''))
        .filter((item) => item.length > 0);
    return normalized.length > 0 ? new Set(normalized) : undefined;
}
function stateToString(state) {
    if (typeof state === 'number') {
        const stateName = BuildInterfaces_1.TimelineRecordState[state];
        return typeof stateName === 'string' ? stateName.toLowerCase() : undefined;
    }
    if (typeof state === 'string' && state.length > 0) {
        return state.toLowerCase();
    }
    return undefined;
}
function resultToString(result) {
    if (typeof result === 'number') {
        const resultName = BuildInterfaces_1.TaskResult[result];
        return typeof resultName === 'string'
            ? resultName.toLowerCase()
            : undefined;
    }
    if (typeof result === 'string' && result.length > 0) {
        return result.toLowerCase();
    }
    return undefined;
}
//# sourceMappingURL=feature.js.map