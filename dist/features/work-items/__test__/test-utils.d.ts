/**
 * Test utilities for work item tests
 * These utilities help reduce test execution time and improve test reliability
 */
/**
 * Times test execution to help identify slow tests
 * @param testName Name of the test
 * @param fn Test function to execute
 */
export declare function timeTest(
  testName: string,
  fn: () => Promise<void>,
): Promise<number>;
/**
 * Setup function to prepare test environment
 * Call at beginning of test to ensure consistent setup
 */
export declare function setupTestEnvironment(): {
  cleanup: () => void;
};
