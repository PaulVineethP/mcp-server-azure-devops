"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPipelineArtifact = downloadPipelineArtifact;
const axios_1 = __importDefault(require("axios"));
const jszip_1 = __importDefault(require("jszip"));
const PipelinesInterfaces_1 = require("azure-devops-node-api/interfaces/PipelinesInterfaces");
const errors_1 = require("../../../shared/errors");
const environment_1 = require("../../../utils/environment");
const artifacts_1 = require("../artifacts");
const helpers_1 = require("../helpers");
function normalizeArtifactPath(artifactPath) {
    const trimmed = artifactPath.trim();
    if (trimmed.length === 0) {
        throw new errors_1.AzureDevOpsResourceNotFoundError('Artifact path must include the artifact name and file path.');
    }
    const sanitized = trimmed.replace(/^[\\/]+/, '').replace(/[\\/]+$/, '');
    const segments = sanitized
        .split(/[\\/]+/)
        .filter((segment) => segment.length > 0);
    const artifactName = segments.shift();
    if (!artifactName) {
        throw new errors_1.AzureDevOpsResourceNotFoundError('Artifact path must include the artifact name and file path.');
    }
    if (segments.length === 0) {
        throw new errors_1.AzureDevOpsResourceNotFoundError('Please specify a file path inside the artifact (e.g. <artifact>/<path/to/file>).');
    }
    return {
        artifactName,
        relativePath: segments.join('/'),
    };
}
function joinPaths(...parts) {
    return parts
        .filter((part) => typeof part === 'string' && part.length > 0)
        .map((part) => part.replace(/^[\\/]+|[\\/]+$/g, ''))
        .filter((part) => part.length > 0)
        .join('/');
}
function buildContainerPathCandidates(artifactName, rootPath, relativePath) {
    const normalizedRelative = relativePath.replace(/^[\\/]+/, '');
    const candidates = new Set();
    candidates.add(normalizedRelative);
    candidates.add(joinPaths(rootPath, normalizedRelative));
    candidates.add(joinPaths(artifactName, normalizedRelative));
    candidates.add(joinPaths(rootPath, artifactName, normalizedRelative));
    candidates.add(joinPaths(artifactName, rootPath, normalizedRelative));
    return Array.from(candidates).filter((candidate) => candidate.length > 0);
}
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        stream.on('error', reject);
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
    });
}
async function getContainerItemStream(connection, containerId, projectId, candidatePaths) {
    if (typeof connection.getFileContainerApi !== 'function') {
        return null;
    }
    const fileContainerApi = await connection.getFileContainerApi();
    if (!fileContainerApi || typeof fileContainerApi.getItem !== 'function') {
        return null;
    }
    const scopeCandidates = [projectId, undefined].filter((scope, index, array) => array.indexOf(scope) === index);
    for (const candidatePath of candidatePaths) {
        for (const scope of scopeCandidates) {
            try {
                const response = await fileContainerApi.getItem(containerId, scope, candidatePath);
                if (response.statusCode === 404) {
                    continue;
                }
                if (response.result) {
                    return { stream: response.result, path: candidatePath };
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                if (/\b403\b|forbidden|access/i.test(message)) {
                    throw new errors_1.AzureDevOpsAuthenticationError(`Failed to access container ${containerId}: ${message}`);
                }
                // Ignore other errors and try the next variation; the container API
                // returns 400 for invalid paths, which we treat as a miss.
            }
        }
    }
    return null;
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function normalizeZipPath(path) {
    return path.replace(/^[\\/]+|[\\/]+$/g, '').replace(/\\+/g, '/');
}
function selectZipEntry(zip, relativePath, artifactName, rootPath) {
    const normalized = normalizeZipPath(relativePath);
    const candidates = [normalized];
    if (artifactName) {
        candidates.push(`${artifactName}/${normalized}`);
    }
    if (rootPath) {
        candidates.push(`${rootPath}/${normalized}`);
        if (artifactName) {
            candidates.push(`${artifactName}/${rootPath}/${normalized}`);
        }
    }
    for (const candidate of candidates) {
        const match = zip.file(candidate);
        if (!match) {
            continue;
        }
        const files = Array.isArray(match) ? match : [match];
        const file = files.find((entry) => !entry.dir);
        if (file) {
            return file;
        }
    }
    const fallbackMatches = zip
        .file(new RegExp(`${escapeRegExp(normalized)}$`))
        ?.filter((entry) => !entry.dir);
    if (fallbackMatches && fallbackMatches.length > 0) {
        fallbackMatches.sort((a, b) => a.name.length - b.name.length);
        return fallbackMatches[0] ?? null;
    }
    return null;
}
async function downloadFromContainer(connection, projectId, artifactName, artifact, relativePath) {
    const { containerId, rootPath } = (0, artifacts_1.parseArtifactContainer)(artifact.resource);
    if (typeof containerId !== 'number') {
        return null;
    }
    const pathCandidates = buildContainerPathCandidates(artifactName, rootPath, relativePath);
    const resolved = await getContainerItemStream(connection, containerId, projectId, pathCandidates);
    if (!resolved) {
        throw new errors_1.AzureDevOpsResourceNotFoundError(`File ${relativePath} not found in artifact ${artifactName}.`);
    }
    const buffer = await streamToBuffer(resolved.stream);
    return {
        artifact: artifactName,
        path: resolved.path,
        content: buffer.toString('utf8'),
    };
}
async function downloadFromPipelineArtifact(connection, projectId, runId, artifactName, artifact, relativePath, pipelineId) {
    const resolvedPipelineId = await (0, helpers_1.resolvePipelineId)(connection, projectId, runId, pipelineId);
    if (typeof resolvedPipelineId !== 'number') {
        throw new errors_1.AzureDevOpsResourceNotFoundError(`Unable to resolve pipeline identifier for artifact ${artifactName}.`);
    }
    const pipelinesApi = await connection.getPipelinesApi();
    const artifactDetails = await pipelinesApi.getArtifact(projectId, resolvedPipelineId, runId, artifactName, PipelinesInterfaces_1.GetArtifactExpandOptions.SignedContent);
    const downloadUrl = artifactDetails?.signedContent?.url ||
        artifact.resource?.downloadUrl ||
        artifactDetails?.url;
    if (!downloadUrl) {
        throw new errors_1.AzureDevOpsResourceNotFoundError(`Artifact ${artifactName} does not expose downloadable content.`);
    }
    const response = await axios_1.default.get(downloadUrl, {
        responseType: 'arraybuffer',
    });
    const zip = await jszip_1.default.loadAsync(response.data);
    const file = selectZipEntry(zip, relativePath, artifactName, (0, artifacts_1.parseArtifactContainer)(artifact.resource).rootPath);
    if (!file) {
        throw new errors_1.AzureDevOpsResourceNotFoundError(`File ${relativePath} not found in artifact ${artifactName}.`);
    }
    const content = await file.async('string');
    return {
        artifact: artifactName,
        path: file.name,
        content,
    };
}
async function downloadPipelineArtifact(connection, options) {
    try {
        const projectId = options.projectId ?? environment_1.defaultProject;
        const runId = options.runId;
        const { artifactName, relativePath } = normalizeArtifactPath(options.artifactPath);
        const buildApi = await connection.getBuildApi();
        let artifacts;
        try {
            artifacts = await buildApi.getArtifacts(projectId, runId);
        }
        catch (error) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline run ${runId} not found in project ${projectId}: ${String(error)}`);
        }
        const artifact = artifacts.find((item) => item.name === artifactName);
        if (!artifact) {
            throw new errors_1.AzureDevOpsResourceNotFoundError(`Artifact ${artifactName} not found for run ${runId} in project ${projectId}.`);
        }
        const containerResult = await downloadFromContainer(connection, projectId, artifactName, artifact, relativePath);
        if (containerResult) {
            return containerResult;
        }
        return await downloadFromPipelineArtifact(connection, projectId, runId, artifactName, artifact, relativePath, options.pipelineId);
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
                throw new errors_1.AzureDevOpsResourceNotFoundError(`Pipeline artifact or project not found: ${error.message}`);
            }
        }
        throw new errors_1.AzureDevOpsError(`Failed to download pipeline artifact: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=feature.js.map