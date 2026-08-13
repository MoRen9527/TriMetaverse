"use strict";
// ── Tripilot CLI ──
// Standalone CLI for TriPilot that talks to TriLC via Anthropic-compatible API.
// Independent of VS Code. Streams SSE responses to stdout. Executes tools locally.
// CTO-008-P P.1 + TWF-002-5: Tool execution loop with TriCode→opencode integration.
// W30: tricodeBridge.ts removed; import directly from @trimetaverse/tricode.
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
const http = __importStar(require("node:http"));
const https = __importStar(require("node:https"));
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const node_child_process_1 = require("node:child_process");
const node_readline_1 = require("node:readline");
const tricode_1 = require("@trimetaverse/tricode");
// ── Tool definitions (Anthropic-compatible) ──
const CLI_TOOLS = [
    {
        name: 'read_file',
        description: 'Read the contents of a file at the given path.',
        input_schema: {
            type: 'object',
            properties: {
                file_path: { type: 'string', description: 'Absolute path to the file to read.' },
                offset: { type: 'number', description: 'Optional line offset (0-indexed).' },
                limit: { type: 'number', description: 'Optional max number of lines to read.' },
            },
            required: ['file_path'],
        },
    },
    {
        name: 'write_file',
        description: 'Write or overwrite a file at the given path with the provided content.',
        input_schema: {
            type: 'object',
            properties: {
                file_path: { type: 'string', description: 'Absolute path to the file to write.' },
                content: { type: 'string', description: 'Content to write to the file.' },
            },
            required: ['file_path', 'content'],
        },
    },
    {
        name: 'list_directory',
        description: 'List files and directories at the given path.',
        input_schema: {
            type: 'object',
            properties: {
                dir_path: { type: 'string', description: 'Absolute path to the directory to list.' },
                depth: { type: 'number', description: 'Optional recursion depth (default 1).' },
            },
            required: ['dir_path'],
        },
    },
    {
        name: 'search_files',
        description: 'Search for a pattern in files within a directory.',
        input_schema: {
            type: 'object',
            properties: {
                pattern: { type: 'string', description: 'Text or regex pattern to search for.' },
                dir_path: { type: 'string', description: 'Directory to search within.' },
                file_glob: { type: 'string', description: 'Optional glob filter (e.g. "*.ts").' },
            },
            required: ['pattern', 'dir_path'],
        },
    },
    {
        name: 'run_command',
        description: 'Execute a shell command and return its output.',
        input_schema: {
            type: 'object',
            properties: {
                command: { type: 'string', description: 'Shell command to execute.' },
                cwd: { type: 'string', description: 'Optional working directory.' },
                timeout: { type: 'number', description: 'Optional timeout in ms (default 30000).' },
            },
            required: ['command'],
        },
    },
    {
        name: 'code_task',
        description: 'Execute a complex multi-step code task via TriCode→opencode. Use for refactoring, code generation, or running build/test commands.',
        input_schema: {
            type: 'object',
            properties: {
                task: { type: 'string', description: 'Natural language description of the code task.' },
                cwd: { type: 'string', description: 'Optional working directory for the task.' },
            },
            required: ['task'],
        },
    },
];
async function executeTool(tool, cwd) {
    const args = tool.arguments;
    try {
        switch (tool.name) {
            case 'read_file': {
                const filePath = String(args.file_path ?? '');
                if (!filePath)
                    throw new Error('file_path is required');
                const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
                const content = await fs.readFile(resolved, 'utf-8');
                const lines = content.split('\n');
                const offset = typeof args.offset === 'number' ? args.offset : 0;
                const limit = typeof args.limit === 'number' ? args.limit : lines.length;
                const sliced = lines.slice(offset, offset + limit);
                // Format with line numbers
                const numbered = sliced.map((l, i) => `${offset + i + 1}\t${l}`).join('\n');
                return { tool_use_id: tool.id, content: numbered || '(empty file)' };
            }
            case 'write_file': {
                const filePath = String(args.file_path ?? '');
                const content = String(args.content ?? '');
                if (!filePath)
                    throw new Error('file_path is required');
                const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
                await fs.mkdir(path.dirname(resolved), { recursive: true });
                await fs.writeFile(resolved, content, 'utf-8');
                return { tool_use_id: tool.id, content: `File written: ${resolved}` };
            }
            case 'list_directory': {
                const dirPath = String(args.dir_path ?? '');
                if (!dirPath)
                    throw new Error('dir_path is required');
                const resolved = path.isAbsolute(dirPath) ? dirPath : path.resolve(cwd, dirPath);
                const depth = typeof args.depth === 'number' ? args.depth : 1;
                const entries = await listDir(resolved, depth);
                return { tool_use_id: tool.id, content: entries.join('\n') || '(empty directory)' };
            }
            case 'search_files': {
                const pattern = String(args.pattern ?? '');
                const dirPath = String(args.dir_path ?? '');
                if (!pattern || !dirPath)
                    throw new Error('pattern and dir_path are required');
                const resolved = path.isAbsolute(dirPath) ? dirPath : path.resolve(cwd, dirPath);
                const results = await searchInDir(resolved, pattern, String(args.file_glob ?? ''));
                return { tool_use_id: tool.id, content: results.join('\n') || '(no matches)' };
            }
            case 'run_command': {
                const command = String(args.command ?? '');
                if (!command)
                    throw new Error('command is required');
                const cmdCwd = args.cwd ? (path.isAbsolute(String(args.cwd)) ? String(args.cwd) : path.resolve(cwd, String(args.cwd))) : cwd;
                const timeout = typeof args.timeout === 'number' ? args.timeout : 30000;
                const output = await runShellCommand(command, cmdCwd, timeout);
                return { tool_use_id: tool.id, content: output };
            }
            case 'code_task': {
                const task = String(args.task ?? '');
                if (!task)
                    throw new Error('task is required');
                const taskCwd = args.cwd ? String(args.cwd) : cwd;
                try {
                    const result = await (0, tricode_1.executeCodeTask)({ task, cwd: taskCwd });
                    return { tool_use_id: tool.id, content: `TriCode result:\n${JSON.stringify(result, null, 2)}` };
                }
                catch (err) {
                    return { tool_use_id: tool.id, content: `TriCode execution failed: ${err instanceof Error ? err.message : String(err)}`, is_error: true };
                }
            }
            default:
                return { tool_use_id: tool.id, content: `Unknown tool: ${tool.name}`, is_error: true };
        }
    }
    catch (err) {
        return { tool_use_id: tool.id, content: `Tool execution error: ${err instanceof Error ? err.message : String(err)}`, is_error: true };
    }
}
async function listDir(dirPath, depth) {
    const entries = [];
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        for (const item of items) {
            const full = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                entries.push(`[DIR]  ${full}`);
                if (depth > 1) {
                    try {
                        const sub = await listDir(full, depth - 1);
                        entries.push(...sub);
                    }
                    catch { /* skip inaccessible */ }
                }
            }
            else {
                entries.push(`[FILE] ${full}`);
            }
        }
    }
    catch (err) {
        entries.push(`(error listing ${dirPath}: ${err instanceof Error ? err.message : String(err)})`);
    }
    return entries;
}
async function searchInDir(dirPath, pattern, glob) {
    const results = [];
    const grepArgs = [];
    const useRegex = pattern.startsWith('/') && pattern.endsWith('/');
    if (useRegex) {
        grepArgs.push('-P', pattern.slice(1, -1));
    }
    else {
        grepArgs.push('-F', pattern);
    }
    grepArgs.push('-rn', '--include=*');
    // Apply glob filter if provided
    if (glob) {
        // convert simple glob to --include pattern
        grepArgs.length = grepArgs.length - 1; // remove --include=*
        grepArgs.push(`--include=${glob}`);
    }
    grepArgs.push(dirPath);
    try {
        const stdout = await new Promise((resolve, reject) => {
            (0, node_child_process_1.execFile)('grep', grepArgs, { maxBuffer: 10 * 1024 * 1024, timeout: 15000 }, (err, stdout) => {
                if (err && err.code !== 1)
                    reject(err); // code 1 = no matches, not an error
                else
                    resolve(stdout);
            });
        });
        if (stdout.trim())
            results.push(stdout.trim());
    }
    catch {
        // If grep fails, fall back to a simple Node.js search
        results.push('(grep unavailable; try installing grep for faster search)');
    }
    return results;
}
async function runShellCommand(command, cwd, timeout) {
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/sh';
    const shellArgs = isWindows ? ['-NoProfile', '-Command', command] : ['-c', command];
    return new Promise((resolve, reject) => {
        const proc = (0, node_child_process_1.execFile)(shell, shellArgs, {
            cwd,
            maxBuffer: 10 * 1024 * 1024,
            timeout,
            env: { ...process.env },
        }, (err, stdout, stderr) => {
            if (err) {
                resolve(`Exit: ${err.code}\nSTDOUT:\n${stdout || '(none)'}\nSTDERR:\n${stderr || '(none)'}`);
            }
            else {
                resolve(stdout || stderr || '(no output)');
            }
        });
    });
}
// ── Config ──
const VERSION = '0.1.0';
const DEFAULT_PORT = 8711;
const DEFAULT_MODEL = 'deepseek-v4-pro';
const TRILC_BASE = 'http://127.0.0.1';
// ── Help ──
function printHelp() {
    console.log(`Tripilot CLI v${VERSION} — TriMetaverse AI Assistant

Usage: tripilot [options] [prompt]

Options:
  --port <n>       TriLC daemon port (default: ${DEFAULT_PORT})
  --model <id>     Model ID to use (default: ${DEFAULT_MODEL})
  --max-tokens <n> Max output tokens (default: 4096)
  --system <text>  System prompt override
  --help, -h       Show this help
  --version, -v    Show version

Examples:
  tripilot "Explain this code"
  tripilot --port 8711 --model claude-sonnet-4-20250514 "Refactor this function"
  echo "What is TypeScript?" | tripilot
  tripilot              # interactive mode
`);
}
// ── Argument parsing ──
function parseArgs(args) {
    const opts = {
        port: DEFAULT_PORT,
        model: DEFAULT_MODEL,
        maxTokens: 4096,
        help: false,
        version: false,
        prompt: '',
        interactive: false,
    };
    const positional = [];
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--port':
                opts.port = parseInt(args[++i] ?? '', 10) || DEFAULT_PORT;
                break;
            case '--model':
                opts.model = args[++i] ?? DEFAULT_MODEL;
                break;
            case '--max-tokens':
                opts.maxTokens = parseInt(args[++i] ?? '', 10) || 4096;
                break;
            case '--system':
                opts.system = args[++i] ?? undefined;
                break;
            case '--help':
            case '-h':
                opts.help = true;
                break;
            case '--version':
            case '-v':
                opts.version = true;
                break;
            default:
                if (!args[i].startsWith('-')) {
                    positional.push(args[i]);
                }
        }
    }
    opts.prompt = positional.join(' ');
    // If no prompt and not asking for help/version, check if stdin is piped
    if (!opts.prompt && !opts.help && !opts.version) {
        if (process.stdin.isTTY) {
            opts.interactive = true;
        }
    }
    return opts;
}
// ── HTTP helpers ──
function httpPost(url, body, headers = {}, timeoutMs = 120_000) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const reqFn = parsedUrl.protocol === 'https:' ? https.request : http.request;
        const req = reqFn({
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body).toString(),
                Accept: 'text/event-stream',
                'User-Agent': `TripilotCLI/${VERSION}`,
                ...headers,
            },
            timeout: timeoutMs,
        }, res => {
            if (res.statusCode !== 200) {
                let errBody = '';
                res.on('data', (chunk) => { errBody += chunk.toString(); });
                res.on('end', () => reject(new Error(`TriLC returned ${res.statusCode}: ${errBody.slice(0, 500)}`)));
                return;
            }
            resolve({ statusCode: res.statusCode ?? 200, stream: res });
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
        req.write(body);
        req.end();
    });
}
// ── SSE Parser ──
async function* parseSSE(stream) {
    let buffer = '';
    for await (const chunk of stream) {
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
                yield JSON.parse(data);
            }
            catch {
                // Skip malformed SSE lines
            }
        }
    }
}
// ── Chat ──
function buildRequest(opts, messages) {
    return {
        model: opts.model,
        messages,
        system: opts.system,
        tools: CLI_TOOLS,
        max_tokens: opts.maxTokens,
        stream: true,
    };
}
async function sendMessage(opts, messages) {
    const url = `${TRILC_BASE}:${opts.port}/v1/messages`;
    const request = buildRequest(opts, messages);
    const { stream } = await httpPost(url, JSON.stringify(request));
    let fullContent = '';
    const toolCalls = [];
    const pendingTools = new Map();
    let stopReason = 'end_turn';
    for await (const event of parseSSE(stream)) {
        switch (event.type) {
            case 'content_block_start': {
                if (event.content_block?.type === 'tool_use') {
                    const idx = event.index ?? 0;
                    pendingTools.set(idx, {
                        id: event.content_block.id ?? '',
                        name: event.content_block.name ?? '',
                        argsJson: '',
                    });
                }
                break;
            }
            case 'content_block_delta': {
                if (event.delta?.type === 'text_delta' && event.delta.text) {
                    fullContent += event.delta.text;
                    process.stdout.write(event.delta.text);
                }
                else if (event.delta?.type === 'input_json_delta' && event.delta.partial_json !== undefined) {
                    const idx = event.index ?? 0;
                    const pending = pendingTools.get(idx);
                    if (pending) {
                        pending.argsJson += event.delta.partial_json;
                    }
                }
                break;
            }
            case 'content_block_stop': {
                const idx = event.index ?? 0;
                const pending = pendingTools.get(idx);
                if (pending) {
                    try {
                        toolCalls.push({
                            id: pending.id,
                            name: pending.name,
                            arguments: JSON.parse(pending.argsJson || '{}'),
                        });
                    }
                    catch {
                        toolCalls.push({
                            id: pending.id,
                            name: pending.name,
                            arguments: {},
                        });
                    }
                    pendingTools.delete(idx);
                }
                break;
            }
            case 'message_stop': {
                stopReason = 'end_turn';
                break;
            }
            case 'error': {
                throw new Error(`TriLC error: ${event.error?.message ?? 'unknown'}`);
            }
        }
    }
    // Final newline after streaming
    if (fullContent)
        process.stdout.write('\n');
    return { content: fullContent, toolCalls, stopReason };
}
// ── Tool execution loop ──
const MAX_TOOL_ROUNDS = 10;
async function conversationLoop(opts, messages) {
    const cwd = process.cwd();
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const result = await sendMessage(opts, messages);
        // Build assistant message with content + tool_use blocks
        const assistantBlocks = [];
        if (result.content) {
            assistantBlocks.push({ type: 'text', text: result.content });
        }
        for (const tc of result.toolCalls) {
            assistantBlocks.push({ type: 'tool_use', id: tc.id, name: tc.name, input: tc.arguments });
        }
        if (Array.isArray(assistantBlocks)) {
            messages.push({ role: 'assistant', content: assistantBlocks });
        }
        // If stop reason is end_turn (no more tool calls), exit loop
        if (result.stopReason === 'end_turn' || result.toolCalls.length === 0) {
            return;
        }
        // Execute tool calls
        console.log(); // blank line before tool execution
        const toolResults = [];
        for (const tc of result.toolCalls) {
            process.stdout.write(`  ▶ ${tc.name} ... `);
            const res = await executeTool(tc, cwd);
            toolResults.push(res);
            process.stdout.write(res.is_error ? '✗\n' : '✓\n');
        }
        console.log(); // blank line after tools
        // Send tool results back
        const toolResultBlocks = toolResults.map(r => ({
            type: 'tool_result',
            tool_use_id: r.tool_use_id,
            content: r.content,
            is_error: r.is_error,
        }));
        messages.push({ role: 'user', content: toolResultBlocks });
        // Continue loop - TriLC will process tool results
    }
    console.log('[Max tool rounds reached]');
}
// ── Interactive mode ──
async function interactiveMode(opts) {
    console.log(`Tripilot CLI v${VERSION} (model: ${opts.model}, port: ${opts.port})`);
    console.log('Type your message and press Enter. /exit to quit, /clear to reset.\n');
    const rl = (0, node_readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
        prompt: '> ',
    });
    const messages = [];
    rl.prompt();
    for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) {
            rl.prompt();
            continue;
        }
        if (trimmed === '/exit' || trimmed === '/quit') {
            break;
        }
        if (trimmed === '/clear') {
            messages.length = 0;
            console.log('[session cleared]');
            rl.prompt();
            continue;
        }
        messages.push({ role: 'user', content: trimmed });
        try {
            await conversationLoop(opts, messages);
        }
        catch (err) {
            console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`);
        }
        rl.prompt();
    }
    rl.close();
    console.log('\nGoodbye.');
}
// ── Single prompt mode ──
async function singlePromptMode(opts) {
    const messages = [
        { role: 'user', content: opts.prompt },
    ];
    try {
        await conversationLoop(opts, messages);
    }
    catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}
// ── Stdin pipe mode ──
async function stdinMode(opts) {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    const prompt = Buffer.concat(chunks).toString('utf-8').trim();
    if (!prompt) {
        console.error('Error: no input provided');
        process.exit(1);
    }
    opts.prompt = prompt;
    await singlePromptMode(opts);
}
// ── Health check ──
async function checkTriLC(port) {
    return new Promise(resolve => {
        const req = http.get(`http://127.0.0.1:${port}/healthz`, { timeout: 3000 }, res => {
            let body = '';
            res.on('data', (chunk) => { body += chunk.toString(); });
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve(data.ok === true || data.service === 'trilc');
                }
                catch {
                    resolve(false);
                }
            });
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
    });
}
// ── Entry ──
async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
        printHelp();
        return;
    }
    if (opts.version) {
        console.log(`Tripilot CLI v${VERSION}`);
        return;
    }
    // Check TriLC is running
    const healthy = await checkTriLC(opts.port);
    if (!healthy) {
        console.error(`Error: TriLC daemon not running on port ${opts.port}`);
        console.error('Start it with: trilc start --port ' + opts.port);
        process.exit(1);
    }
    if (opts.interactive) {
        await interactiveMode(opts);
    }
    else if (opts.prompt) {
        await singlePromptMode(opts);
    }
    else if (!process.stdin.isTTY) {
        await stdinMode(opts);
    }
    else {
        // No prompt provided, enter interactive mode
        opts.interactive = true;
        await interactiveMode(opts);
    }
}
main().catch(err => {
    console.error('Tripilot CLI fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=tripilot-cli.js.map