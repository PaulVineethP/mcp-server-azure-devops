"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_me_1 = require("../get-me");
const test_helpers_1 = require("@/shared/test/test-helpers");
const shouldSkip = (0, test_helpers_1.shouldSkipIntegrationTest)();
const describeOrSkip = shouldSkip ? describe.skip : describe;
describeOrSkip('getMe Integration', () => {
    let connection;
    beforeAll(async () => {
        // Get a real connection using environment variables
        const testConnection = await (0, test_helpers_1.getTestConnection)();
        if (!testConnection) {
            throw new Error('Connection should be available when integration tests are enabled');
        }
        connection = testConnection;
    });
    test('should get authenticated user profile information', async () => {
        // Act - make a direct API call using Axios
        const result = await (0, get_me_1.getMe)(connection);
        // Assert on the actual response
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(typeof result.id).toBe('string');
        expect(result.displayName).toBeDefined();
        expect(typeof result.displayName).toBe('string');
        expect(result.displayName.length).toBeGreaterThan(0);
        // Email should be defined, a string, and not empty
        expect(result.email).toBeDefined();
        expect(typeof result.email).toBe('string');
        expect(result.email.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=feature.spec.int.js.map