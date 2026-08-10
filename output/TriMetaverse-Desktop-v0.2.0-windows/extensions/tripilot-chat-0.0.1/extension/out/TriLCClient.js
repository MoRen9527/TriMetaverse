"use strict";
/**
 * TriLC HTTP+SSE Client — W30 Architecture Fix S3
 *
 * Replaces the old `runTrilcDirectRequest()` pattern.
 * TriPilot submits user intent → TriLC daemon executes → SSE events flow back.
 *
 * Protocol:
 *   POST /internal/v1/tasks/submit  → { sessionId, streamEndpoint }
 *   GET  /internal/v1/sessions/{id}/stream → SSE (delta / tool_use / tool_result / task_done / task_error)
 *   GET  /internal/v1/sessions       → session list
 *   POST /internal/v1/sessions/{id}/cancel → cancel
 *   POST /internal/v1/sessions/recover → recover
 *
 * TriPilot holds ZERO API keys — all LLM calls go through TriLC.
 */
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
exports.TriLCClient = void 0;
const http = __importStar(require("node:http"));
// ── TriLCClient ──
class TriLCClient {
    baseUrl;
    timeout;
    activeStreams = new Map();
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/+$/, ''); // strip trailing slash
        this.timeout = config.timeout ?? 30_000;
    }
    // ── Endpoint ①: POST /internal/v1/tasks/submit ──
    async submitTask(req, signal) {
        const body = JSON.stringify(req);
        return this.jsonRequest('POST', '/internal/v1/tasks/submit', body, signal);
    }
    // ── Endpoint ②: SSE GET /internal/v1/sessions/{id}/stream ──
    streamSession(sessionId, callbacks, signal) {
        return new Promise((resolve, reject) => {
            const url = new URL(`/internal/v1/sessions/${encodeURIComponent(sessionId)}/stream`, this.baseUrl);
            const req = http.get(url.toString(), {
                timeout: 0, // no timeout for SSE
                signal,
            }, (res) => {
                if (res.statusCode !== 200) {
                    let body = '';
                    res.on('data', (c) => (body += c.toString()));
                    res.on('end', () => {
                        reject(new Error(`SSE stream error ${res.statusCode}: ${body}`));
                    });
                    return;
                }
                // Parse SSE stream
                let buffer = '';
                let currentEvent = '';
                let currentData = '';
                res.on('data', (chunk) => {
                    buffer += chunk.toString();
                    // Process complete lines
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? ''; // keep incomplete line in buffer
                    for (const line of lines) {
                        if (line.startsWith('event: ')) {
                            currentEvent = line.slice(7).trim();
                        }
                        else if (line.startsWith('data: ')) {
                            currentData = line.slice(6);
                        }
                        else if (line.trim() === '' && currentEvent) {
                            // Empty line = end of event
                            this.dispatchSSEEvent(currentEvent, currentData, callbacks, resolve, reject);
                            currentEvent = '';
                            currentData = '';
                        }
                    }
                });
                res.on('end', () => {
                    // Process any remaining event
                    if (currentEvent && currentData) {
                        this.dispatchSSEEvent(currentEvent, currentData, callbacks, resolve, reject);
                    }
                    this.activeStreams.delete(sessionId);
                    resolve();
                });
                res.on('error', (err) => {
                    this.activeStreams.delete(sessionId);
                    reject(err);
                });
            });
            req.on('error', (err) => {
                this.activeStreams.delete(sessionId);
                reject(err);
            });
            this.activeStreams.set(sessionId, req);
        });
    }
    // ── Endpoint ③: GET /internal/v1/sessions ──
    async listSessions(status, limit = 20, signal) {
        const params = new URLSearchParams();
        if (status)
            params.set('status', status);
        params.set('limit', String(limit));
        const path = `/internal/v1/sessions?${params.toString()}`;
        return this.jsonRequest('GET', path, null, signal);
    }
    // ── Endpoint ④: POST /internal/v1/sessions/{id}/cancel ──
    async cancelSession(sessionId, signal) {
        // Also abort the active SSE stream if any
        const activeStream = this.activeStreams.get(sessionId);
        if (activeStream) {
            activeStream.destroy();
            this.activeStreams.delete(sessionId);
        }
        return this.jsonRequest('POST', `/internal/v1/sessions/${encodeURIComponent(sessionId)}/cancel`, '{}', signal);
    }
    // ── Endpoint ⑤: POST /internal/v1/sessions/recover ──
    async recoverSession(sessionId, signal) {
        const body = JSON.stringify(sessionId ? { sessionId } : {});
        return this.jsonRequest('POST', '/internal/v1/sessions/recover', body, signal);
    }
    // ── Connection check ──
    // ── Endpoint ⑥: GET /internal/v1/agents ──
    /** Fetch TriCompany agent list from TriLC. */
    async listAgents(signal) {
        try {
            const resp = await this.jsonRequest('GET', '/internal/v1/agents', null, signal);
            return Array.isArray(resp.agents) ? resp.agents : [];
        }
        catch {
            return [];
        }
    }
    /** Fetch system prompt for a specific TriCompany agent. */
    async getAgentSystemPrompt(agentId, signal) {
        try {
            const resp = await this.jsonRequest('GET', `/internal/v1/agents/${encodeURIComponent(agentId)}/system-prompt`, null, signal);
            return resp.systemPrompt ?? undefined;
        }
        catch {
            return undefined;
        }
    }
    /** Check if TriLC daemon is reachable via /healthz. */
    async checkHealth(timeoutMs = 3000, signal) {
        try {
            const resp = await this.jsonRequest('GET', '/healthz', null, signal);
            return resp.ok === true;
        }
        catch {
            return false;
        }
    }
    /** Abort all active SSE streams. */
    abortAll() {
        for (const [id, req] of this.activeStreams) {
            req.destroy();
            this.activeStreams.delete(id);
        }
    }
    dispose() {
        this.abortAll();
    }
    // ── Private helpers ──
    jsonRequest(method, path, body, signal) {
        return new Promise((resolve, reject) => {
            const url = new URL(path, this.baseUrl);
            const req = http.request({
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method,
                headers: body
                    ? {
                        'content-type': 'application/json',
                        'content-length': Buffer.byteLength(body).toString(),
                    }
                    : {},
                timeout: this.timeout,
                signal,
            }, (res) => {
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => {
                    const raw = Buffer.concat(chunks).toString('utf-8');
                    try {
                        const parsed = JSON.parse(raw);
                        resolve(parsed);
                    }
                    catch {
                        reject(new Error(`Invalid JSON response for ${method} ${path}: ${raw.slice(0, 200)}`));
                    }
                });
                res.on('error', reject);
            });
            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout for ${method} ${path}`));
            });
            req.on('error', reject);
            if (body)
                req.write(body);
            req.end();
        });
    }
    dispatchSSEEvent(event, data, callbacks, resolve, reject) {
        try {
            const parsed = JSON.parse(data);
            switch (event) {
                case 'delta':
                    callbacks.onDelta?.(parsed.content ?? '');
                    break;
                case 'tool_use':
                    callbacks.onToolUse?.(parsed.toolName ?? 'unknown', parsed.input ?? {});
                    break;
                case 'tool_result':
                    callbacks.onToolResult?.(parsed.toolName ?? 'unknown', parsed.output ?? '', parsed.durationMs);
                    break;
                case 'task_progress':
                    callbacks.onTaskProgress?.(parsed.step ?? 0, parsed.totalSteps ?? 0, parsed.description ?? '');
                    break;
                case 'task_done':
                    callbacks.onTaskDone?.(parsed.summary ?? 'Task completed');
                    break;
                case 'task_error':
                    callbacks.onTaskError?.(parsed.error ?? 'Unknown error');
                    break;
                default:
                    // Unknown event type — silently ignore
                    break;
            }
        }
        catch (err) {
            reject(new Error(`Failed to parse SSE event: ${err.message}`));
        }
    }
}
exports.TriLCClient = TriLCClient;
//# sourceMappingURL=TriLCClient.js.map