"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coercePipelineId = coercePipelineId;
exports.resolvePipelineId = resolvePipelineId;
function coercePipelineId(id) {
    if (typeof id === 'number') {
        return id;
    }
    if (typeof id === 'string') {
        const parsed = Number.parseInt(id, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
}
async function resolvePipelineId(connection, projectId, runId, providedPipelineId) {
    if (typeof providedPipelineId === 'number') {
        return providedPipelineId;
    }
    try {
        const buildApi = await connection.getBuildApi();
        const build = (await buildApi.getBuild(projectId, runId));
        return coercePipelineId(build?.definition?.id);
    }
    catch {
        // Swallow errors here; we'll handle not-found later when the main request fails
        return undefined;
    }
}
//# sourceMappingURL=helpers.js.map