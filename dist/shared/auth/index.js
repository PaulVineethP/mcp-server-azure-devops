"use strict";
/**
 * Authentication module for Azure DevOps
 *
 * This module provides authentication functionality for Azure DevOps API.
 * It supports multiple authentication methods:
 * - Personal Access Token (PAT)
 * - Azure Identity (DefaultAzureCredential)
 * - Azure CLI (AzureCliCredential)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureDevOpsClient = exports.createAuthClient = exports.AuthenticationMethod = void 0;
var auth_factory_1 = require("./auth-factory");
Object.defineProperty(exports, "AuthenticationMethod", { enumerable: true, get: function () { return auth_factory_1.AuthenticationMethod; } });
Object.defineProperty(exports, "createAuthClient", { enumerable: true, get: function () { return auth_factory_1.createAuthClient; } });
var client_factory_1 = require("./client-factory");
Object.defineProperty(exports, "AzureDevOpsClient", { enumerable: true, get: function () { return client_factory_1.AzureDevOpsClient; } });
//# sourceMappingURL=index.js.map