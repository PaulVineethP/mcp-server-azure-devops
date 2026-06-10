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
exports.handleProjectsRequest = exports.isProjectsRequest = void 0;
// Re-export schemas and types
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
// Re-export features
__exportStar(require("./get-project"), exports);
__exportStar(require("./get-project-details"), exports);
__exportStar(require("./list-projects"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const environment_1 = require("../../utils/environment");
const _1 = require("./");
/**
 * Checks if the request is for the projects feature
 */
const isProjectsRequest = (request) => {
    const toolName = request.params.name;
    return ['list_projects', 'get_project', 'get_project_details'].includes(toolName);
};
exports.isProjectsRequest = isProjectsRequest;
/**
 * Handles projects feature requests
 */
const handleProjectsRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'list_projects': {
            const args = _1.ListProjectsSchema.parse(request.params.arguments);
            const result = await (0, _1.listProjects)(connection, {
                stateFilter: args.stateFilter,
                top: args.top,
                skip: args.skip,
                continuationToken: args.continuationToken,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_project': {
            const args = _1.GetProjectSchema.parse(request.params.arguments);
            const result = await (0, _1.getProject)(connection, args.projectId ?? environment_1.defaultProject);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_project_details': {
            const args = _1.GetProjectDetailsSchema.parse(request.params.arguments);
            const result = await (0, _1.getProjectDetails)(connection, {
                projectId: args.projectId ?? environment_1.defaultProject,
                includeProcess: args.includeProcess,
                includeWorkItemTypes: args.includeWorkItemTypes,
                includeFields: args.includeFields,
                includeTeams: args.includeTeams,
                expandTeamIdentity: args.expandTeamIdentity,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown projects tool: ${request.params.name}`);
    }
};
exports.handleProjectsRequest = handleProjectsRequest;
//# sourceMappingURL=index.js.map