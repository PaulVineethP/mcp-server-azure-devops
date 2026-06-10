"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAzureDevOpsBaseUrls = resolveAzureDevOpsBaseUrls;
exports.isAzureDevOpsServicesUrl = isAzureDevOpsServicesUrl;
const errors_1 = require("./errors");
const DEV_AZURE_HOST = 'dev.azure.com';
const SEARCH_HOST = 'almsearch.dev.azure.com';
const VSTS_HOST_SUFFIX = '.visualstudio.com';
function resolveAzureDevOpsBaseUrls(serverUrl, options = {}) {
    const url = parseUrl(serverUrl);
    const hostname = url.hostname.toLowerCase();
    if (isServicesHost(hostname)) {
        const organization = options.organizationId ?? extractServicesOrganization(url);
        if (!organization) {
            throw new errors_1.AzureDevOpsValidationError('Could not extract organization from Azure DevOps Services URL');
        }
        return {
            type: 'services',
            organization,
            coreBaseUrl: `https://${DEV_AZURE_HOST}/${organization}`,
            searchBaseUrl: `https://${SEARCH_HOST}/${organization}`,
        };
    }
    const serverInfo = extractServerInfo(url, options.projectId);
    const collection = serverInfo.collection ?? options.organizationId;
    if (!collection) {
        throw new errors_1.AzureDevOpsValidationError('Azure DevOps Server URL must include a collection');
    }
    const instanceBaseUrl = buildBaseUrl(url.origin, serverInfo.instanceSegments);
    const coreBaseUrl = joinUrl(instanceBaseUrl, collection);
    return {
        type: 'server',
        collection,
        instanceBaseUrl,
        coreBaseUrl,
        searchBaseUrl: coreBaseUrl,
        projectFromUrl: serverInfo.projectFromUrl,
    };
}
function isAzureDevOpsServicesUrl(serverUrl) {
    try {
        const url = new URL(serverUrl);
        return isServicesHost(url.hostname.toLowerCase());
    }
    catch {
        return false;
    }
}
function parseUrl(input) {
    try {
        const url = new URL(input);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new errors_1.AzureDevOpsValidationError('Organization URL must start with http:// or https://');
        }
        return url;
    }
    catch (error) {
        if (error instanceof errors_1.AzureDevOpsValidationError) {
            throw error;
        }
        throw new errors_1.AzureDevOpsValidationError('Organization URL must include a valid http or https scheme');
    }
}
function isServicesHost(hostname) {
    return hostname === DEV_AZURE_HOST || hostname.endsWith(VSTS_HOST_SUFFIX);
}
function extractServicesOrganization(url) {
    if (url.hostname.toLowerCase() === DEV_AZURE_HOST) {
        const segments = getPathSegments(url);
        return segments[0] ?? '';
    }
    const hostParts = url.hostname.split('.');
    return hostParts[0] ?? '';
}
function getPathSegments(url) {
    return url.pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => decodeURIComponent(segment));
}
function extractServerInfo(url, projectId) {
    const segments = getPathSegments(url);
    const normalizedProject = projectId?.toLowerCase();
    if (segments.length === 0) {
        return { instanceSegments: [] };
    }
    if (segments.length === 1) {
        const [segment] = segments;
        if (segment.toLowerCase() === 'tfs') {
            return { instanceSegments: [segment] };
        }
        return { instanceSegments: [], collection: segment };
    }
    const lastSegment = segments[segments.length - 1];
    if (normalizedProject && lastSegment.toLowerCase() === normalizedProject) {
        const collection = segments[segments.length - 2];
        const instanceSegments = segments.slice(0, -2);
        return {
            instanceSegments,
            collection,
            projectFromUrl: lastSegment,
        };
    }
    return {
        instanceSegments: segments.slice(0, -1),
        collection: lastSegment,
    };
}
function buildBaseUrl(origin, segments) {
    if (segments.length === 0) {
        return origin.replace(/\/+$/, '');
    }
    const url = new URL(origin);
    url.pathname = `/${segments.join('/')}`;
    return url.toString().replace(/\/+$/, '');
}
function joinUrl(base, segment) {
    return `${base.replace(/\/+$/, '')}/${segment}`;
}
//# sourceMappingURL=azure-devops-url.js.map