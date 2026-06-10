#!/usr/bin/env node
/**
 * Entry point for the Azure DevOps MCP Server
 */
import { AuthenticationMethod } from './shared/auth/auth-factory';
/**
 * Normalize auth method string to a valid AuthenticationMethod enum value
 * in a case-insensitive manner
 *
 * @param authMethodStr The auth method string from environment variable
 * @returns A valid AuthenticationMethod value
 */
export declare function normalizeAuthMethod(
  authMethodStr?: string,
): AuthenticationMethod;
export * from './server';
