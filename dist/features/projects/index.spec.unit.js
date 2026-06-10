"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const get_project_1 = require("./get-project");
const get_project_details_1 = require("./get-project-details");
const list_projects_1 = require("./list-projects");
// Mock the imported modules
jest.mock('./get-project', () => ({
    getProject: jest.fn(),
}));
jest.mock('./get-project-details', () => ({
    getProjectDetails: jest.fn(),
}));
jest.mock('./list-projects', () => ({
    listProjects: jest.fn(),
}));
describe('Projects Request Handlers', () => {
    const mockConnection = {};
    describe('isProjectsRequest', () => {
        it('should return true for projects requests', () => {
            const validTools = [
                'list_projects',
                'get_project',
                'get_project_details',
            ];
            validTools.forEach((tool) => {
                const request = {
                    params: { name: tool, arguments: {} },
                    method: 'tools/call',
                };
                expect((0, index_1.isProjectsRequest)(request)).toBe(true);
            });
        });
        it('should return false for non-projects requests', () => {
            const request = {
                params: { name: 'list_work_items', arguments: {} },
                method: 'tools/call',
            };
            expect((0, index_1.isProjectsRequest)(request)).toBe(false);
        });
    });
    describe('handleProjectsRequest', () => {
        it('should handle list_projects request', async () => {
            const mockProjects = [
                { id: '1', name: 'Project 1' },
                { id: '2', name: 'Project 2' },
            ];
            list_projects_1.listProjects.mockResolvedValue(mockProjects);
            const request = {
                params: {
                    name: 'list_projects',
                    arguments: {
                        top: 10,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleProjectsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockProjects);
            expect(list_projects_1.listProjects).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                top: 10,
            }));
        });
        it('should handle get_project request', async () => {
            const mockProject = { id: '1', name: 'Project 1' };
            get_project_1.getProject.mockResolvedValue(mockProject);
            const request = {
                params: {
                    name: 'get_project',
                    arguments: {
                        projectId: 'Project 1',
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleProjectsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockProject);
            expect(get_project_1.getProject).toHaveBeenCalledWith(mockConnection, 'Project 1');
        });
        it('should handle get_project_details request', async () => {
            const mockProjectDetails = {
                id: '1',
                name: 'Project 1',
                teams: [{ id: 'team1', name: 'Team 1' }],
            };
            get_project_details_1.getProjectDetails.mockResolvedValue(mockProjectDetails);
            const request = {
                params: {
                    name: 'get_project_details',
                    arguments: {
                        projectId: 'Project 1',
                        includeTeams: true,
                    },
                },
                method: 'tools/call',
            };
            const response = await (0, index_1.handleProjectsRequest)(mockConnection, request);
            expect(response.content).toHaveLength(1);
            expect(JSON.parse(response.content[0].text)).toEqual(mockProjectDetails);
            expect(get_project_details_1.getProjectDetails).toHaveBeenCalledWith(mockConnection, expect.objectContaining({
                projectId: 'Project 1',
                includeTeams: true,
            }));
        });
        it('should throw error for unknown tool', async () => {
            const request = {
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleProjectsRequest)(mockConnection, request)).rejects.toThrow('Unknown projects tool');
        });
        it('should propagate errors from project functions', async () => {
            const mockError = new Error('Test error');
            list_projects_1.listProjects.mockRejectedValue(mockError);
            const request = {
                params: {
                    name: 'list_projects',
                    arguments: {},
                },
                method: 'tools/call',
            };
            await expect((0, index_1.handleProjectsRequest)(mockConnection, request)).rejects.toThrow(mockError);
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map