"use strict";
// ── TriLC Direct Client ──
// Talks to the local TriLC server via its Anthropic-compatible /v1/messages endpoint.
// Supports SSE streaming (default) and JSON modes.
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrilcDirectClient = void 0;
const http = __importStar(require("node:http"));
// ── Client ──
class TrilcDirectClient {
    extensionVersion;
    editorVersion;
    constructor(extensionVersion, editorVersion) {
        this.extensionVersion = extensionVersion;
        this.editorVersion = editorVersion;
    }
    /** @deprecated Stub — TriLC does not use GitHub tokens. */
    async getCopilotToken() {
        return null;
    }
    /** @deprecated Stub — TriLC client has no persistent resources to dispose. */
    dispose() { }
    /** @deprecated Stub — TriLC client state reset is a no-op. */
    reset() { }
    /** @deprecated Stub — TriLC does not use auto-models sessions. */
    async createAutoModelsSession(_args) {
        return undefined;
    }
    /**
     * Fetch available models from TriLC's /v1/models endpoint.
     */
    async listModels(cfg) {
        const url = `${cfg.baseUrl}/v1/models`;
        const body = await this.httpGet(url, cfg);
        const parsed = JSON.parse(body);
        // Anthropic-compatible models list response
        if (parsed.data && Array.isArray(parsed.data)) {
            return parsed.data.map((m) => ({
                id: String(m.id ?? ''),
                displayName: m.display_name ?? m.displayName ?? undefined,
                createdAt: m.created_at ?? m.createdAt ?? undefined,
            }));
        }
        // Fallback: if response wraps in { models: [...] }
        if (parsed.models && Array.isArray(parsed.models)) {
            return parsed.models.map((m) => ({
                id: String(m.id ?? ''),
                displayName: m.displayName ?? m.display_name ?? undefined,
                createdAt: m.createdAt ?? m.created_at ?? undefined,
            }));
        }
        return [];
    }
    /**
     * Send a streaming Anthropic-compatible request to TriLC /v1/messages.
     * Returns the full final text content and collected tool calls.
     */
    async streamChat(args) {
        const { cfg, model, system, messages, tools, maxTokens, abortSignal, onEvent } = args;
        const body = JSON.stringify({
            model,
            messages,
            system: system || undefined,
            tools: tools?.length ? tools.map((t) => ({
                name: t.name,
                description: t.description,
                input_schema: t.input_schema,
            })) : undefined,
            max_tokens: maxTokens ?? 4096,
            stream: true,
        });
        const url = `${cfg.baseUrl}/v1/messages`;
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const req = http.request({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 80,
                path: parsedUrl.pathname + parsedUrl.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body).toString(),
                    'Accept': 'text/event-stream',
                    ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {}),
                    ...(cfg.additionalHeaders ?? {}),
                    'User-Agent': `TriPilot/${this.extensionVersion}`,
                },
                timeout: 120_000,
            }, (res) => {
                if (res.statusCode !== 200) {
                    let errBody = '';
                    res.on('data', (chunk) => { errBody += chunk.toString(); });
                    res.on('end', () => {
                        reject(new Error(`TriLC returned ${res.statusCode}: ${errBody.slice(0, 500)}`));
                    });
                    return;
                }
                let buffer = '';
                let fullContent = '';
                const toolCalls = [];
                const pendingToolCalls = new Map();
                let stopReason = 'end_turn';
                res.on('data', (chunk) => {
                    buffer += chunk.toString();
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) {
                        if (!line.startsWith('data: '))
                            continue;
                        const data = line.slice(6).trim();
                        if (data === '[DONE]')
                            continue;
                        try {
                            const event = JSON.parse(data);
                            onEvent?.(event);
                            switch (event.type) {
                                case 'content_block_delta': {
                                    if (event.delta?.type === 'text_delta' && event.delta.text) {
                                        fullContent += event.delta.text;
                                    }
                                    else if (event.delta?.type === 'input_json_delta' && event.delta.partial_json !== undefined) {
                                        const idx = event.index ?? 0;
                                        const pending = pendingToolCalls.get(idx);
                                        if (pending) {
                                            pending.arguments += event.delta.partial_json;
                                        }
                                    }
                                    break;
                                }
                                case 'content_block_start': {
                                    if (event.content_block?.type === 'tool_use') {
                                        const idx = event.index ?? 0;
                                        pendingToolCalls.set(idx, {
                                            id: event.content_block.id ?? '',
                                            name: event.content_block.name ?? '',
                                            arguments: '',
                                        });
                                    }
                                    break;
                                }
                                case 'content_block_stop': {
                                    const idx = event.index ?? 0;
                                    const pending = pendingToolCalls.get(idx);
                                    if (pending) {
                                        toolCalls.push({
                                            id: pending.id,
                                            type: 'function',
                                            function: {
                                                name: pending.name,
                                                arguments: pending.arguments || '{}',
                                            },
                                        });
                                        pendingToolCalls.delete(idx);
                                    }
                                    break;
                                }
                            }
                        }
                        catch {
                            // Skip malformed SSE lines
                        }
                    }
                });
                res.on('end', () => {
                    resolve({ content: fullContent, toolCalls, stopReason });
                });
                res.on('error', reject);
            });
            req.on('error', reject);
            req.write(body);
            req.end();
            abortSignal.addEventListener('abort', () => {
                req.destroy();
                reject(new Error('Request aborted'));
            }, { once: true });
        });
    }
    /**
     * Health check — GET /healthz.
     */
    async healthCheck(baseUrl) {
        try {
            const url = `${baseUrl}/healthz`;
            await this.httpGet(url, { baseUrl });
            return true;
        }
        catch {
            return false;
        }
    }
    httpGet(url, cfg) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const req = http.get({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 80,
                path: parsedUrl.pathname + parsedUrl.search,
                headers: {
                    'Accept': 'application/json',
                    ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {}),
                    ...(cfg.additionalHeaders ?? {}),
                },
                timeout: 30_000,
            }, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }
                let data = '';
                res.on('data', (chunk) => { data += chunk.toString(); });
                res.on('end', () => resolve(data));
                res.on('error', reject);
            });
            req.on('error', reject);
        });
    }
}
exports.TrilcDirectClient = TrilcDirectClient;
//# sourceMappingURL=trilcClient.js.map