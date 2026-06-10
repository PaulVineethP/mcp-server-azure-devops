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
exports.handleWorkItemsRequest = exports.isWorkItemsRequest = void 0;
// Re-export schemas and types
__exportStar(require("./schemas"), exports);
__exportStar(require("./types"), exports);
// Re-export features
__exportStar(require("./list-work-items"), exports);
__exportStar(require("./get-work-item"), exports);
__exportStar(require("./create-work-item"), exports);
__exportStar(require("./update-work-item"), exports);
__exportStar(require("./manage-work-item-link"), exports);
// Export tool definitions
__exportStar(require("./tool-definitions"), exports);
const environment_1 = require("../../utils/environment");
const _1 = require("./");
/**
 * Checks if the request is for the work items feature
 */
const isWorkItemsRequest = (request) => {
    const toolName = request.params.name;
    return [
        'get_work_item',
        'list_work_items',
        'create_work_item',
        'update_work_item',
        'manage_work_item_link',
    ].includes(toolName);
};
exports.isWorkItemsRequest = isWorkItemsRequest;
/**
 * Handles work items feature requests
 */
const handleWorkItemsRequest = async (connection, request) => {
    switch (request.params.name) {
        case 'get_work_item': {
            const args = _1.GetWorkItemSchema.parse(request.params.arguments);
            const result = await (0, _1.getWorkItem)(connection, args.workItemId, args.expand);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'list_work_items': {
            const args = _1.ListWorkItemsSchema.parse(request.params.arguments);
            const result = await (0, _1.listWorkItems)(connection, {
                projectId: args.projectId ?? environment_1.defaultProject,
                teamId: args.teamId,
                queryId: args.queryId,
                wiql: args.wiql,
                top: args.top,
                skip: args.skip,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_work_item': {
            const args = _1.CreateWorkItemSchema.parse(request.params.arguments);
            const result = await (0, _1.createWorkItem)(connection, args.projectId ?? environment_1.defaultProject, args.workItemType, {
                title: args.title,
                description: args.description,
                assignedTo: args.assignedTo,
                areaPath: args.areaPath,
                iterationPath: args.iterationPath,
                priority: args.priority,
                parentId: args.parentId,
                additionalFields: args.additionalFields,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'update_work_item': {
            const args = _1.UpdateWorkItemSchema.parse(request.params.arguments);
            const result = await (0, _1.updateWorkItem)(connection, args.workItemId, {
                title: args.title,
                description: args.description,
                assignedTo: args.assignedTo,
                areaPath: args.areaPath,
                iterationPath: args.iterationPath,
                priority: args.priority,
                state: args.state,
                additionalFields: args.additionalFields,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'manage_work_item_link': {
            const args = _1.ManageWorkItemLinkSchema.parse(request.params.arguments);
            const result = await (0, _1.manageWorkItemLink)(connection, args.projectId ?? environment_1.defaultProject, {
                sourceWorkItemId: args.sourceWorkItemId,
                targetWorkItemId: args.targetWorkItemId,
                operation: args.operation,
                relationType: args.relationType,
                newRelationType: args.newRelationType,
                comment: args.comment,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        default:
            throw new Error(`Unknown work items tool: ${request.params.name}`);
    }
};
exports.handleWorkItemsRequest = handleWorkItemsRequest;
//# sourceMappingURL=index.js.map