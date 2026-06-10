"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProjectsSchema = exports.GetProjectDetailsSchema = exports.GetProjectSchema = void 0;
const zod_1 = require("zod");
const environment_1 = require("../../utils/environment");
/**
 * Schema for getting a project
 */
exports.GetProjectSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
});
/**
 * Schema for getting detailed project information
 */
exports.GetProjectDetailsSchema = zod_1.z.object({
    projectId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the project (Default: ${environment_1.defaultProject})`),
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    includeProcess: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Include process information in the project result'),
    includeWorkItemTypes: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Include work item types and their structure'),
    includeFields: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Include field information for work item types'),
    includeTeams: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Include associated teams in the project result'),
    expandTeamIdentity: zod_1.z
        .boolean()
        .optional()
        .default(false)
        .describe('Expand identity information in the team objects'),
});
/**
 * Schema for listing projects
 */
exports.ListProjectsSchema = zod_1.z.object({
    organizationId: zod_1.z
        .string()
        .optional()
        .describe(`The ID or name of the organization (Default: ${environment_1.defaultOrg})`),
    stateFilter: zod_1.z
        .number()
        .optional()
        .describe('Filter on team project state (0: all, 1: well-formed, 2: creating, 3: deleting, 4: new)'),
    top: zod_1.z.number().optional().describe('Maximum number of projects to return'),
    skip: zod_1.z.number().optional().describe('Number of projects to skip'),
    continuationToken: zod_1.z
        .number()
        .optional()
        .describe('Gets the projects after the continuation token provided'),
});
//# sourceMappingURL=schemas.js.map