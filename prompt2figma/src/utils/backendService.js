"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendService = void 0;
class BackendService {
    constructor() {
        this.baseUrl = 'http://localhost:8000';
    }
    static getInstance() {
        if (!BackendService.instance) {
            BackendService.instance = new BackendService();
        }
        return BackendService.instance;
    }
    /**
     * Sends a prompt to the backend MCP server
     */
    generateDesign(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/api/v1/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        options: {
                            includeCode: true,
                            format: 'figma'
                        }
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                return {
                    success: true,
                    data: data
                };
            }
            catch (error) {
                console.error('Backend service error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                };
            }
        });
    }
    /**
     * Health check for the backend server
     */
    healthCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/health`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.ok;
            }
            catch (error) {
                console.error('Health check failed:', error);
                return false;
            }
        });
    }
    /**
     * Sets the backend URL (useful for development)
     */
    setBaseUrl(url) {
        this.baseUrl = url;
    }
}
exports.BackendService = BackendService;
