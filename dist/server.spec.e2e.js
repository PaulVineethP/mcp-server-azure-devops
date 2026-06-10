"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const child_process_1 = require("child_process");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables from .env file
dotenv_1.default.config();
describe('Azure DevOps MCP Server E2E Tests', () => {
    let client;
    let serverProcess;
    let transport;
    let tempEnvFile = null;
    beforeAll(async () => {
        // Debug: Log environment variables
        console.error('E2E TEST ENVIRONMENT VARIABLES:');
        console.error(`AZURE_DEVOPS_ORG_URL: ${process.env.AZURE_DEVOPS_ORG_URL || 'NOT SET'}`);
        console.error(`AZURE_DEVOPS_PAT: ${process.env.AZURE_DEVOPS_PAT ? 'SET (hidden value)' : 'NOT SET'}`);
        console.error(`AZURE_DEVOPS_DEFAULT_PROJECT: ${process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'NOT SET'}`);
        console.error(`AZURE_DEVOPS_AUTH_METHOD: ${process.env.AZURE_DEVOPS_AUTH_METHOD || 'NOT SET'}`);
        // Start the MCP server process
        const serverPath = (0, path_1.join)(process.cwd(), 'dist', 'index.js');
        // Create a temporary .env file for testing if needed
        const orgUrl = process.env.AZURE_DEVOPS_ORG_URL || '';
        const pat = process.env.AZURE_DEVOPS_PAT || '';
        const defaultProject = process.env.AZURE_DEVOPS_DEFAULT_PROJECT || '';
        const authMethod = process.env.AZURE_DEVOPS_AUTH_METHOD || 'pat';
        if (orgUrl) {
            // Create a temporary .env file for the test
            tempEnvFile = (0, path_1.join)(process.cwd(), '.env.e2e-test');
            const envFileContent = `
AZURE_DEVOPS_ORG_URL=${orgUrl}
AZURE_DEVOPS_PAT=${pat}
AZURE_DEVOPS_DEFAULT_PROJECT=${defaultProject}
AZURE_DEVOPS_AUTH_METHOD=${authMethod}
`;
            fs_1.default.writeFileSync(tempEnvFile, envFileContent);
            console.error(`Created temporary .env file at ${tempEnvFile}`);
            // Start server with explicit file path to the temp .env file
            serverProcess = (0, child_process_1.spawn)('node', ['-r', 'dotenv/config', serverPath], {
                env: {
                    ...process.env,
                    NODE_ENV: 'test',
                    DOTENV_CONFIG_PATH: tempEnvFile,
                },
            });
        }
        else {
            throw new Error('Cannot start server: AZURE_DEVOPS_ORG_URL is not set in the environment');
        }
        // Capture server output for debugging
        if (serverProcess && serverProcess.stderr) {
            serverProcess.stderr.on('data', (data) => {
                console.error(`Server error: ${data.toString()}`);
            });
        }
        // Give the server a moment to start
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Connect the MCP client to the server
        transport = new stdio_js_1.StdioClientTransport({
            command: 'node',
            args: ['-r', 'dotenv/config', serverPath],
            env: {
                ...process.env,
                NODE_ENV: 'test',
                DOTENV_CONFIG_PATH: tempEnvFile,
            },
        });
        client = new index_js_1.Client({
            name: 'e2e-test-client',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        await client.connect(transport);
    });
    afterAll(async () => {
        // Clean up the client transport
        if (transport) {
            await transport.close();
        }
        // Clean up the client
        if (client) {
            await client.close();
        }
        // Clean up the server process
        if (serverProcess) {
            serverProcess.kill();
        }
        // Clean up temporary env file
        if (tempEnvFile && fs_1.default.existsSync(tempEnvFile)) {
            fs_1.default.unlinkSync(tempEnvFile);
            console.error(`Deleted temporary .env file at ${tempEnvFile}`);
        }
        // Force exit to clean up any remaining handles
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });
    describe('Organizations', () => {
        test('should list organizations', async () => {
            // Arrange
            // No specific arrangement needed for this test as we're just listing organizations
            // Act
            const result = await client.callTool({
                name: 'list_organizations',
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            // Access the content safely
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Parse the result content
            const resultText = content[0].text;
            const organizations = JSON.parse(resultText);
            // Verify the response structure
            expect(Array.isArray(organizations)).toBe(true);
            if (organizations.length > 0) {
                const firstOrg = organizations[0];
                expect(firstOrg).toHaveProperty('id');
                expect(firstOrg).toHaveProperty('name');
                expect(firstOrg).toHaveProperty('url');
            }
        });
    });
    describe('Parameterless Tools', () => {
        test('should call list_organizations without arguments', async () => {
            // Act - call the tool without providing arguments
            const result = await client.callTool({
                name: 'list_organizations',
                // No arguments provided
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Verify we got a valid JSON response
            const resultText = content[0].text;
            const organizations = JSON.parse(resultText);
            expect(Array.isArray(organizations)).toBe(true);
        });
        test('should call get_me without arguments', async () => {
            // Act - call the tool without providing arguments
            const result = await client.callTool({
                name: 'get_me',
                // No arguments provided
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Verify we got a valid JSON response with user info
            const resultText = content[0].text;
            const userInfo = JSON.parse(resultText);
            expect(userInfo).toHaveProperty('id');
            expect(userInfo).toHaveProperty('displayName');
        });
    });
    describe('Tools with Optional Parameters', () => {
        test('should call list_projects without arguments', async () => {
            // Act - call the tool without providing arguments
            const result = await client.callTool({
                name: 'list_projects',
                // No arguments provided
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Verify we got a valid JSON response
            const resultText = content[0].text;
            const projects = JSON.parse(resultText);
            expect(Array.isArray(projects)).toBe(true);
        });
        test('should call get_project without arguments', async () => {
            // Act - call the tool without providing arguments
            const result = await client.callTool({
                name: 'get_project',
                // No arguments provided
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Verify we got a valid JSON response with project info
            const resultText = content[0].text;
            const project = JSON.parse(resultText);
            expect(project).toHaveProperty('id');
            expect(project).toHaveProperty('name');
        });
        test('should call list_repositories without arguments', async () => {
            // Act - call the tool without providing arguments
            const result = await client.callTool({
                name: 'list_repositories',
                // No arguments provided
                arguments: {},
            });
            // Assert
            expect(result).toBeDefined();
            const content = result.content;
            expect(content).toBeDefined();
            expect(content.length).toBeGreaterThan(0);
            // Verify we got a valid JSON response
            const resultText = content[0].text;
            const repositories = JSON.parse(resultText);
            expect(Array.isArray(repositories)).toBe(true);
        });
    });
});
//# sourceMappingURL=server.spec.e2e.js.map