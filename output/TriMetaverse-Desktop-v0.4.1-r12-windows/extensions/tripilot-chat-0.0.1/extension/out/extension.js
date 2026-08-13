"use strict";
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const node_child_process_1 = require("node:child_process");
const path = __importStar(require("node:path"));
const crypto = __importStar(require("node:crypto"));
const https = __importStar(require("node:https"));
const http = __importStar(require("node:http"));
const mcpClient_1 = require("./mcpClient");
const chatHistory_1 = require("./chatHistory");
const trilcClient_1 = require("./trilcDirect/trilcClient");
const TriLCClient_1 = require("./TriLCClient");
const diff_1 = require("diff");
const welcome_setup_1 = require("./welcome/welcome-setup");
function countLinesForDiffStat(value) {
    if (!value)
        return 0;
    const matches = value.match(/\r\n|\r|\n/g);
    const newlines = matches ? matches.length : 0;
    const endsWithNewline = /\r\n|\r|\n$/.test(value);
    return endsWithNewline ? newlines : newlines + 1;
}
function computeDiffStats(previews) {
    let additions = 0;
    let deletions = 0;
    for (const p of previews) {
        const parts = (0, diff_1.diffLines)(String(p.original ?? ''), String(p.updated ?? ''));
        for (const part of parts) {
            const value = String(part.value ?? '');
            if (part.added)
                additions += countLinesForDiffStat(value);
            else if (part.removed)
                deletions += countLinesForDiffStat(value);
        }
    }
    return { additions, deletions };
}
function formatMultiplier(multiplier) {
    if (!Number.isFinite(multiplier))
        return '';
    // Match Copilot UI: show raw multiplier number + 'x' (e.g. 0x, 0.33x, 1x, 3x)
    return `${multiplier}x`;
}
function formatDiscountPercent(frac) {
    if (!Number.isFinite(frac))
        return '';
    const pct = frac * 100;
    // Avoid trailing zeros for common values (10, 12.5, 33.33)
    return String(Number(pct.toFixed(2)));
}
function computeDiscountRange(discountedCosts) {
    if (!discountedCosts)
        return undefined;
    const values = Object.values(discountedCosts)
        .map((v) => (typeof v === 'number' ? v : (v?.low ?? v?.high)))
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (!values.length)
        return undefined;
    let low = values[0];
    let high = values[0];
    for (const v of values) {
        if (v < low)
            low = v;
        if (v > high)
            high = v;
    }
    if (!Number.isFinite(low) || !Number.isFinite(high))
        return undefined;
    return { low, high };
}
function formatDiscountLabel(range) {
    if (!range)
        return undefined;
    const low = range.low;
    const high = range.high;
    if (!Number.isFinite(low) || !Number.isFinite(high))
        return undefined;
    // Copilot UI shows discount only (not multiplier) for Auto.
    if (low <= 0 && high <= 0)
        return undefined;
    if (Math.abs(low - high) < 1e-9)
        return `${formatDiscountPercent(low)}% discount`;
    return `${formatDiscountPercent(low)}%–${formatDiscountPercent(high)}% discount`;
}
let sqlJsInitPromise;
async function getSqlJs(extensionPath) {
    if (!sqlJsInitPromise) {
        const mod = await Promise.resolve().then(() => __importStar(require('sql.js')));
        const initSqlJs = mod?.default ?? mod;
        sqlJsInitPromise = initSqlJs({
            locateFile: (file) => path.join(extensionPath, 'node_modules', 'sql.js', 'dist', file)
        });
    }
    return sqlJsInitPromise;
}
let cachedVscodeChatVisibleIds;
async function tryReadVscodeChatVisibleModelIdsFromStateDb(args) {
    try {
        const now = Date.now();
        if (cachedVscodeChatVisibleIds && now - cachedVscodeChatVisibleIds.atMs < 5_000) {
            return cachedVscodeChatVisibleIds.source === 'none'
                ? undefined
                : { ids: cachedVscodeChatVisibleIds.ids, source: 'vscdb.cachedLanguageModels' };
        }
        const globalStorageDir = path.dirname(args.context.globalStorageUri.fsPath);
        const stateDbPath = path.join(globalStorageDir, 'state.vscdb');
        const dbBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(stateDbPath));
        const SQL = await getSqlJs(args.context.extensionPath);
        const db = new SQL.Database(dbBytes);
        try {
            const res = db.exec("SELECT value FROM ItemTable WHERE key='chat.cachedLanguageModels' LIMIT 1");
            const val = res?.[0]?.values?.[0]?.[0];
            if (val == null) {
                cachedVscodeChatVisibleIds = { atMs: now, ids: new Set(), source: 'none' };
                return undefined;
            }
            const text = val instanceof Uint8Array
                ? new TextDecoder('utf-8').decode(val)
                : typeof val === 'string'
                    ? val
                    : String(val);
            const entries = JSON.parse(text);
            const ids = new Set();
            for (const e of entries) {
                const id = e?.metadata?.id != null ? String(e.metadata.id) : '';
                if (!id)
                    continue;
                if (e?.metadata?.isUserSelectable === true)
                    ids.add(id);
            }
            cachedVscodeChatVisibleIds = { atMs: now, ids, source: 'vscdb.cachedLanguageModels' };
            return { ids, source: 'vscdb.cachedLanguageModels' };
        }
        finally {
            try {
                db.close();
            }
            catch {
                // ignore
            }
        }
    }
    catch {
        cachedVscodeChatVisibleIds = { atMs: Date.now(), ids: new Set(), source: 'none' };
        return undefined;
    }
}
function normalizeVendorLabel(vendor) {
    const s = (vendor ? String(vendor).trim() : '') || '';
    if (!s)
        return undefined;
    const lower = s.toLowerCase();
    if (lower === 'openrouter')
        return 'openrouter';
    return s;
}
function inferModelsDirectProviderLabel(args) {
    const direct = (args.provider ? String(args.provider).trim() : '') || '';
    if (direct)
        return direct;
    try {
        const extra = args.modelExtra;
        if (extra && typeof extra === 'object') {
            const provider = extra.provider ?? extra.vendor ?? extra.source;
            const s = provider ? String(provider).trim() : '';
            if (s)
                return s;
        }
    }
    catch {
        // ignore
    }
    const tag = (args.modelTag ? String(args.modelTag).trim() : '') || '';
    return tag || undefined;
}
const SETTINGS_MODELS_CACHE_TTL_MS = 60_000;
const settingsModelsCache = new Map();
function makeSettingsModelsCacheKey(provider) {
    const cfg = vscode.workspace.getConfiguration('tripilot');
    const baseUrl = String(cfg.get('trilcDirect.baseUrl', 'http://127.0.0.1:8711') ?? '').trim();
    return `trilc-direct:${baseUrl}`;
}
function tryGetSettingsModelsFromCache(key) {
    const hit = settingsModelsCache.get(key);
    if (!hit)
        return undefined;
    if (Date.now() - hit.atMs > hit.ttlMs) {
        settingsModelsCache.delete(key);
        return undefined;
    }
    return hit.models;
}
function setSettingsModelsCache(key, models) {
    settingsModelsCache.set(key, { atMs: Date.now(), ttlMs: SETTINGS_MODELS_CACHE_TTL_MS, models });
    // Prevent unbounded growth (should be tiny).
    if (settingsModelsCache.size > 10) {
        const firstKey = settingsModelsCache.keys().next().value;
        if (firstKey)
            settingsModelsCache.delete(firstKey);
    }
}
function clearSettingsModelsCache() {
    settingsModelsCache.clear();
}
function languageToBadge(languageId, fileName) {
    const lid = String(languageId ?? '').toLowerCase();
    if (lid === 'typescript')
        return 'TS';
    if (lid === 'typescriptreact')
        return 'TSX';
    if (lid === 'javascript')
        return 'JS';
    if (lid === 'javascriptreact')
        return 'JSX';
    if (lid === 'json' || lid === 'jsonc')
        return 'JSON';
    if (lid === 'markdown')
        return 'MD';
    if (lid === 'yaml')
        return 'YAML';
    if (lid === 'python')
        return 'PY';
    if (lid === 'csharp')
        return 'CS';
    if (lid === 'cpp')
        return 'CPP';
    if (lid === 'c')
        return 'C';
    if (lid === 'go')
        return 'GO';
    if (lid === 'ruby')
        return 'RB';
    if (lid === 'java')
        return 'JAVA';
    if (lid === 'html')
        return 'HTML';
    if (lid === 'css')
        return 'CSS';
    if (lid === 'scss')
        return 'SCSS';
    if (lid === 'less')
        return 'LESS';
    if (lid === 'vue')
        return 'VUE';
    const ext = path.extname(fileName || '').replace(/^\./, '').toUpperCase();
    if (!ext)
        return undefined;
    if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG', 'BMP', 'ICO'].includes(ext))
        return 'IMG';
    return ext.length <= 6 ? ext : ext.slice(0, 6);
}
function attachmentsToChips(items) {
    const out = [];
    for (const a of items ?? []) {
        if (a.kind === 'file') {
            try {
                const uri = vscode.Uri.parse(a.uri);
                const fileName = path.basename(uri.fsPath || uri.path || '');
                const badge = languageToBadge(a.languageId, fileName);
                const title = safeWorkspaceRelativePath(uri) || uri.fsPath || a.label;
                out.push({ id: a.id, kind: a.kind, label: fileName || a.label, badge, title });
                continue;
            }
            catch {
                // fall through
            }
        }
        out.push({ id: a.id, kind: a.kind, label: a.label, title: a.label });
    }
    return out;
}
function safeWorkspaceRelativePath(uri) {
    try {
        const rel = vscode.workspace.asRelativePath(uri, false);
        const s = String(rel ?? '').trim();
        return s || undefined;
    }
    catch {
        return undefined;
    }
}
// W30 DEPRECATED: Tool execution delegated to TriLC daemon (CPO Q1).
// OPTIONAL_TOOL_NAMES and getToolDefinitions() remain for UI compatibility only.
// TODO(W30-S5): Replace with TriLC /internal/v1/agents tool listing.
// Tools menu currently exposes only a subset; treat them as optional toggles.
const OPTIONAL_TOOL_NAMES = new Set([
    // agent
    'runSubagent',
    // edit
    'createDirectory',
    'createFile',
    'editFiles',
    'editNotebook',
    'newJupyterNotebook',
    // execute
    'createAndRunTask',
    'runInTerminal',
    'getTerminalOutput',
    'runTask',
    'runTests',
    'testFailure',
    'runNotebookCell',
    // read
    'readFile',
    'problems',
    'terminalLastCommand',
    'terminalSelection',
    'getNotebookSummary',
    'readNotebookCellOutput',
    'getTaskOutput',
    // search
    'fileSearch',
    'textSearch',
    'listDirectory',
    'searchResults',
    'codebase',
    'usages',
    'changes',
    // todo
    'manage_todo_list',
    // vscode
    'extensions',
    'installExtension',
    'openSimpleBrowser',
    'runCommand',
    'newWorkspace',
    'getProjectSetupInfo',
    'vscodeAPI',
    // web
    'fetch',
    'githubRepo'
]);
/* v0.1 removed: TOOL_SETS */
/* v0.1 removed: ASK_STUDY_ALLOWED_* */
// Conversation is stored as vscode.lm messages (LanguageModelChatMessage).
let settingsPerfChannel;
let settingsPerfRing = [];
const SETTINGS_PERF_RING_MAX_LINES = 4000;
function isSettingsPerfEnabled() {
    try {
        return !!vscode.workspace.getConfiguration('tripilot').get('debug.settingsPerf', false);
    }
    catch {
        return false;
    }
}
function settingsPerfLog(msg) {
    if (!isSettingsPerfEnabled())
        return;
    try {
        settingsPerfRing.push(msg);
        if (settingsPerfRing.length > SETTINGS_PERF_RING_MAX_LINES) {
            settingsPerfRing.splice(0, settingsPerfRing.length - SETTINGS_PERF_RING_MAX_LINES);
        }
        settingsPerfChannel?.appendLine(msg);
    }
    catch {
        // ignore
    }
}
function activate(context) {
    const debugChannel = vscode.window.createOutputChannel('Tripilot Debug');
    context.subscriptions.push(debugChannel);
    const mcpChannel = vscode.window.createOutputChannel('Tripilot MCP');
    context.subscriptions.push(mcpChannel);
    settingsPerfChannel = vscode.window.createOutputChannel('Tripilot Settings Perf');
    context.subscriptions.push(settingsPerfChannel);
    const mcpManager = new mcpClient_1.McpClientManager(mcpChannel);
    context.subscriptions.push(mcpManager);
    const extensionVersion = String(context?.extension?.packageJSON?.version ?? '0.0.0');
    const editorVersionHeader = `vscode/${vscode.version}`;
    const provider = new TripilotChatViewProvider(context, mcpManager, extensionVersion, editorVersionHeader);
    TripilotChatViewProvider.setActiveInstance(provider);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(TripilotChatViewProvider.viewType, provider, {
        webviewOptions: { retainContextWhenHidden: true }
    }));
    //── Welcome / setup wizard (fire-and-forget, does not block TriLC startup) ──
    void (0, welcome_setup_1.showWelcomeSetupWizard)(context);
    // ── Status bar: TriLC + TriModel health ──
    const trilcStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    trilcStatusBar.name = 'TriLC Status';
    trilcStatusBar.tooltip = 'TriLC daemon status';
    context.subscriptions.push(trilcStatusBar);
    const trimodelStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    trimodelStatusBar.name = 'TriModel Status';
    trimodelStatusBar.tooltip = 'TriModel API status';
    context.subscriptions.push(trimodelStatusBar);
    async function updateServiceStatus() {
        const baseUrl = vscode.workspace.getConfiguration('tripilot.trilcDirect').get('baseUrl') || 'http://127.0.0.1:8711';
        try {
            const ctrl = new AbortController();
            const timeout = setTimeout(() => ctrl.abort(), 3000);
            const r = await fetch(`${baseUrl}/healthz`, { signal: ctrl.signal });
            clearTimeout(timeout);
            const body = await r.json();
            if (r.ok && body.ok) {
                trilcStatusBar.text = '$(circle-filled) TriLC';
                trilcStatusBar.color = new vscode.ThemeColor('terminal.ansiGreen');
            }
            else {
                trilcStatusBar.text = '$(error) TriLC';
                trilcStatusBar.color = new vscode.ThemeColor('terminal.ansiRed');
            }
        }
        catch {
            trilcStatusBar.text = '$(circle-slash) TriLC';
            trilcStatusBar.color = new vscode.ThemeColor('terminal.ansiRed');
        }
        trilcStatusBar.show();
        const tmUrl = 'http://127.0.0.1:3333';
        try {
            const ctrl = new AbortController();
            const timeout = setTimeout(() => ctrl.abort(), 3000);
            const r = await fetch(`${tmUrl}/v1/models`, { signal: ctrl.signal });
            clearTimeout(timeout);
            if (r.ok) {
                trimodelStatusBar.text = '$(circle-filled) TriModel';
                trimodelStatusBar.color = new vscode.ThemeColor('terminal.ansiGreen');
            }
            else {
                trimodelStatusBar.text = '$(error) TriModel';
                trimodelStatusBar.color = new vscode.ThemeColor('terminal.ansiRed');
            }
        }
        catch {
            trimodelStatusBar.text = '$(circle-slash) TriModel';
            trimodelStatusBar.color = new vscode.ThemeColor('terminal.ansiRed');
        }
        trimodelStatusBar.show();
    }
    void updateServiceStatus();
    const statusInterval = setInterval(() => void updateServiceStatus(), 30_000);
    context.subscriptions.push({ dispose: () => clearInterval(statusInterval) });
    // Background prefetch: try to warm TriLC model list to speed first Settings open.
    void (async () => {
        try {
            const cfg = vscode.workspace.getConfiguration('tripilot');
            const chatProvider = String(cfg.get('chatProvider', 'trilc-direct'));
            if (chatProvider !== 'trilc-direct')
                return;
            if (isSettingsPerfEnabled())
                settingsPerfLog('[settings] backgroundPrefetch start');
            try {
                const client = new trilcClient_1.TrilcDirectClient(extensionVersion, editorVersionHeader);
                // W30: apiKey removed — TriLC is localhost, no auth needed
                const trilcCfg = {
                    baseUrl: vscode.workspace.getConfiguration('tripilot.trilcDirect').get('baseUrl') || 'http://127.0.0.1:8711',
                };
                const models = await client.listModels(trilcCfg);
                const mapped = models.map((m) => ({
                    id: m.id,
                    name: m.displayName ?? m.id,
                    vendor: 'trilc',
                    family: 'trilc',
                    version: 'n/a',
                    maxInputTokens: m.maxInputTokens ?? 0
                }));
                const result = [
                    { id: 'auto', name: 'Auto', vendor: 'tripilot', family: 'auto', version: 'auto', maxInputTokens: 0 },
                    ...mapped
                ];
                setSettingsModelsCache(makeSettingsModelsCacheKey('trilc-direct'), result);
                if (isSettingsPerfEnabled())
                    settingsPerfLog('[settings] backgroundPrefetch done');
            }
            catch (e) {
                if (isSettingsPerfEnabled())
                    settingsPerfLog(`[settings] backgroundPrefetch err ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        catch (e) {
            // swallow any error; non-critical
        }
    })();
    context.subscriptions.push(mcpManager.onDidChange(() => {
        TripilotSettingsPanel.refreshIfOpen();
        void provider.refreshToolsAndPost();
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('tripilot.visibleModelIds')) {
            provider.refreshModelsAndPost();
        }
        if (e.affectsConfiguration('tripilot.chatProvider') ||
            e.affectsConfiguration('tripilot.trilcDirect.authMode') ||
            e.affectsConfiguration('tripilot.trilcDirect.baseUrl') ||
            e.affectsConfiguration('tripilot.trilcDirect.defaultModel') ||
            e.affectsConfiguration('tripilot.trilcDirect.modelTagDefault') ||
            e.affectsConfiguration('tripilot.trilcDirect.modelTags') ||
            e.affectsConfiguration('tripilot.trilcDirect.modelExtras')) {
            clearSettingsModelsCache();
        }
        if (e.affectsConfiguration('tripilot.mcpServers')) {
            void mcpManager.refresh(readMcpServersFromConfig());
        }
    }));
    // Connect enabled MCP servers on activation.
    void mcpManager.refresh(readMcpServersFromConfig());
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.debug.dumpLmModels', async () => {
        debugChannel.show(true);
        debugChannel.appendLine(`[dumpLmModels] ${new Date().toISOString()}`);
        const lmAnyLocal = vscode.lm;
        if (!lmAnyLocal || typeof lmAnyLocal.selectChatModels !== 'function') {
            debugChannel.appendLine('vscode.lm.selectChatModels 不可用（当前 VS Code 可能不支持 LM API）。');
            return;
        }
        const models = await vscode.lm.selectChatModels();
        debugChannel.appendLine(`models: ${models.length}`);
        for (const m of models) {
            const anyM = m;
            const keys = Object.keys(anyM).sort();
            debugChannel.appendLine('---');
            debugChannel.appendLine(`id: ${m.id}`);
            debugChannel.appendLine(`name: ${m.name}`);
            debugChannel.appendLine(`vendor: ${m.vendor}`);
            debugChannel.appendLine(`family: ${m.family}`);
            debugChannel.appendLine(`version: ${m.version}`);
            debugChannel.appendLine(`maxInputTokens: ${m.maxInputTokens}`);
            debugChannel.appendLine(`typeof sendRequest: ${typeof anyM.sendRequest}`);
            debugChannel.appendLine(`runtime keys: ${keys.join(', ')}`);
            for (const field of [
                'isUserSelectable',
                'showInModelPicker',
                'visible',
                'detail',
                'tooltip',
                'maxOutputTokens',
                'capabilities'
            ]) {
                if (Object.prototype.hasOwnProperty.call(anyM, field)) {
                    debugChannel.appendLine(`${field}: ${safeToString(anyM[field])}`);
                }
            }
        }
        debugChannel.appendLine('---');
        debugChannel.appendLine('提示：如果这里没有 isUserSelectable/visible 等字段，说明扩展侧公开 API 很可能无法获取“模型 picker 可见性”。');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.debug.searchCommands', async () => {
        debugChannel.show(true);
        debugChannel.appendLine(`[searchCommands] ${new Date().toISOString()}`);
        const all = await vscode.commands.getCommands(true);
        const hits = all
            .filter((c) => /language.*model|languageModel|languageModels|modelPicker|picker.*model|chat.*model/i.test(c))
            .sort();
        debugChannel.appendLine(`commands matched: ${hits.length}`);
        for (const c of hits.slice(0, 200)) {
            debugChannel.appendLine(c);
        }
        if (hits.length > 200) {
            debugChannel.appendLine(`... (truncated, showing first 200)`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.debug.copySettingsPerfLog', async () => {
        const defaultLines = 200;
        const raw = await vscode.window.showInputBox({
            title: 'Copy Tripilot Settings Perf Log',
            prompt: '复制最近多少行到剪贴板？',
            value: String(defaultLines),
            validateInput: (v) => {
                const n = Number.parseInt(String(v || ''), 10);
                if (!Number.isFinite(n) || n <= 0)
                    return '请输入一个正整数';
                if (n > 20000)
                    return '行数过大（建议 <= 20000）';
                return undefined;
            }
        });
        if (raw === undefined)
            return;
        const n = Math.max(1, Number.parseInt(raw, 10) || defaultLines);
        const tail = settingsPerfRing.slice(-n);
        if (tail.length === 0) {
            void vscode.window.showWarningMessage('没有可复制的 Settings Perf 日志。请先启用 tripilot.debug.settingsPerf=true 并复现一次打开 Settings。');
            return;
        }
        await vscode.env.clipboard.writeText(tail.join('\n'));
        try {
            settingsPerfChannel?.show(true);
        }
        catch {
            // ignore
        }
        void vscode.window.showInformationMessage(`已复制 Settings Perf 最近 ${tail.length} 行到剪贴板。`);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.debug.showChatLogView', async () => {
        await provider.showChatLogView();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.open', async () => {
        await provider.openChatView();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.toggle', async () => {
        await provider.toggleChatFocus();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.openInEditor', async () => {
        await provider.openChatInEditorArea();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.openInNewWindow', async () => {
        await provider.openChatInNewWindow();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.resetViewDefaults', async () => {
        await provider.resetViewDefaults();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.quickChat.toggle', async () => {
        await provider.openQuickChat();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.copyModelIdsToClipboard', async () => {
        const lmAnyLocal = vscode.lm;
        if (!lmAnyLocal || typeof lmAnyLocal.selectChatModels !== 'function') {
            vscode.window.showWarningMessage('当前 VS Code 环境不支持 Language Model API（vscode.lm）。');
            return;
        }
        const models = await vscode.lm.selectChatModels();
        const ids = ['auto', ...models.map((m) => m.id)];
        // Ensure uniqueness while keeping order.
        const seen = new Set();
        const uniqueIds = ids.filter((id) => {
            if (seen.has(id))
                return false;
            seen.add(id);
            return true;
        });
        const text = JSON.stringify(uniqueIds, null, 2);
        await vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage(`已复制 ${uniqueIds.length} 个模型 ID 到剪贴板（包含 auto）。`);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.openSettings', async () => {
        TripilotSettingsPanel.show(context, mcpManager);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.exportChatHistory', async () => {
        await provider.exportChatHistoryInteractive();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.newSession', async () => {
        await provider.startNewChatSessionInteractive();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tripilot.chat.selectSession', async () => {
        await provider.selectAndLoadChatSessionInteractive();
    }));
    // ── TriLC auto-start (desktop daemon) ──
    void (async () => {
        try {
            const cfg = vscode.workspace.getConfiguration('tripilot');
            const autoStart = cfg.get('triLC.autoStart', true);
            if (!autoStart)
                return;
            const port = cfg.get('triLC.port', 8711);
            const control = await resolveTriLCControlCommand();
            const child = (0, node_child_process_1.spawn)(control.command, [...control.prefixArgs, 'start', '--port', String(port)], {
                detached: true,
                stdio: 'ignore',
                shell: control.shell,
                env: control.env
            });
            triLCAutoStartControl = { ...control, port };
            debugChannel.appendLine(`[TriLC] auto-start requested via ${control.source} on port ${port}`);
            child.once('error', (error) => {
                triLCAutoStartControl = undefined;
                debugChannel.appendLine(`[TriLC] auto-start failed via ${control.source}: ${error.message}`);
            });
            child.once('exit', async (code, signal) => {
                if (code !== 0) {
                    triLCAutoStartControl = undefined;
                    debugChannel.appendLine(`[TriLC] auto-start command exited code=${code ?? 'null'} signal=${signal ?? 'none'} via ${control.source}`);
                    return;
                }
                const client = new TriLCClient_1.TriLCClient({ baseUrl: `http://127.0.0.1:${port}` });
                triLCAutoStarted = await client.checkHealth(3000);
                if (triLCAutoStarted) {
                    debugChannel.appendLine(`[TriLC] auto-started via ${control.source} on port ${port}`);
                }
                else {
                    triLCAutoStartControl = undefined;
                    debugChannel.appendLine(`[TriLC] auto-start command completed but health check failed on port ${port}`);
                }
            });
            child.unref();
        }
        catch (e) {
            debugChannel.appendLine(`[TriLC] auto-start failed: ${e instanceof Error ? e.message : String(e)}`);
        }
    })();
}
function safeToString(value) {
    if (value === null)
        return 'null';
    if (value === undefined)
        return 'undefined';
    // Errors stringify to "{}" by default; preserve message/stack.
    try {
        if (value instanceof Error) {
            const msg = String(value.message ?? '').trim();
            const stack = String(value.stack ?? '').trim();
            return stack || msg || value.name || 'Error';
        }
        const anyVal = value;
        if (anyVal && typeof anyVal === 'object' && typeof anyVal.message === 'string') {
            const msg = String(anyVal.message ?? '').trim();
            const name = typeof anyVal.name === 'string' ? String(anyVal.name).trim() : '';
            return [name, msg].filter(Boolean).join(': ') || msg;
        }
    }
    catch {
        // ignore
    }
    if (typeof value === 'string')
        return value;
    if (typeof value === 'number' || typeof value === 'boolean')
        return String(value);
    try {
        return JSON.stringify(value);
    }
    catch {
        return Object.prototype.toString.call(value);
    }
}
function serializeUnknownError(err) {
    try {
        if (err instanceof Error) {
            return {
                name: err.name,
                message: String(err.message ?? '') || err.name || 'Error',
                stack: typeof err.stack === 'string' ? String(err.stack) : undefined,
                typeof: 'object'
            };
        }
        const t = typeof err;
        if (err && t === 'object') {
            const anyErr = err;
            const keys = Object.keys(anyErr);
            const name = typeof anyErr.name === 'string' ? String(anyErr.name) : undefined;
            const message = typeof anyErr.message === 'string' ? String(anyErr.message) : safeToString(err);
            const stack = typeof anyErr.stack === 'string' ? String(anyErr.stack) : undefined;
            return { name, message: message || safeToString(err), stack, typeof: t, keys: keys.length ? keys : undefined };
        }
        return { message: safeToString(err), typeof: t };
    }
    catch {
        return { message: 'Unknown error', typeof: typeof err };
    }
}
function ensureFrontmatterHasVersion(markdown, version) {
    const eol = markdown.includes('\r\n') ? '\r\n' : '\n';
    const normalized = markdown.replace(/\r\n/g, '\n');
    const fm = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!fm) {
        const created = `---\nversion: ${version}\n---\n\n${normalized}`;
        return eol === '\n' ? created : created.replace(/\n/g, eol);
    }
    const front = fm[1] ?? '';
    if (/(^|\n)version\s*:/i.test(front))
        return markdown;
    const rest = normalized.slice(fm[0].length);
    const nextFront = `${front.replace(/\n+$/g, '')}\nversion: ${version}`;
    const updated = `---\n${nextFront}\n---\n${rest}`;
    return eol === '\n' ? updated : updated.replace(/\n/g, eol);
}
function getHiddenCustomAgentIdsFromConfig() {
    const raw = vscode.workspace.getConfiguration('tripilot').get('hiddenCustomAgents', []) ?? [];
    return new Set(raw.map((s) => String(s).trim()).filter(Boolean));
}
async function setHiddenCustomAgentIdsToConfig(ids) {
    await vscode.workspace.getConfiguration('tripilot').update('hiddenCustomAgents', (ids ?? []).map(String).map((s) => s.trim()).filter(Boolean), vscode.ConfigurationTarget.Global);
}
function stripYamlScalar(value) {
    const v = String(value ?? '').trim();
    if (!v)
        return '';
    // Remove wrapping quotes.
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        return v.slice(1, -1);
    }
    return v;
}
function parseInlineList(raw) {
    let text = String(raw ?? '').trim();
    if (!text)
        return [];
    // Remove surrounding brackets if present.
    if (text.startsWith('[') && text.endsWith(']')) {
        text = text.slice(1, -1);
    }
    return text
        .split(',')
        .map((s) => stripYamlScalar(s))
        .map((s) => s.trim())
        .filter(Boolean);
}
function parseCustomAgentMarkdown(markdown) {
    const normalized = String(markdown ?? '').replace(/\r\n/g, '\n');
    const fm = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!fm) {
        return { frontmatter: {}, body: normalized };
    }
    const frontText = fm[1] ?? '';
    const body = normalized.slice(fm[0].length);
    const front = {};
    const lines = frontText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.trim() || line.trim().startsWith('#'))
            continue;
        const m = line.match(/^([A-Za-z0-9_.\-]+)\s*:\s*(.*)$/);
        if (!m)
            continue;
        const key = m[1];
        const rest = String(m[2] ?? '');
        if (key === 'tools') {
            const trimmed = rest.trim();
            if (!trimmed) {
                const items = [];
                for (let j = i + 1; j < lines.length; j++) {
                    const l = lines[j];
                    const mm = l.match(/^\s*-\s+(.*)$/);
                    if (!mm)
                        break;
                    items.push(stripYamlScalar(mm[1]));
                    i = j;
                }
                front.tools = items.map((s) => s.trim()).filter(Boolean);
                continue;
            }
            front.tools = parseInlineList(trimmed);
            continue;
        }
        if (key === 'name') {
            front.name = stripYamlScalar(rest);
            continue;
        }
        if (key === 'description') {
            front.description = stripYamlScalar(rest);
            continue;
        }
        if (key === 'model') {
            front.model = stripYamlScalar(rest);
            continue;
        }
    }
    return { frontmatter: front, body };
}
function makeWorkspaceCustomAgentId(relativePath) {
    const rel = String(relativePath ?? '').replace(/\\/g, '/');
    const noExt = rel
        .replace(/\.agent\.md$/i, '')
        .replace(/\.chatmode\.md$/i, '');
    return `custom:${noExt}`;
}
async function discoverWorkspaceCustomAgents() {
    const perfEnabled = isSettingsPerfEnabled();
    const started = perfEnabled ? Date.now() : 0;
    // This scan can be relatively expensive (findFiles + readFile per agent).
    // Keep a short TTL cache to keep Settings opening snappy.
    const TTL_MS = 10_000;
    const TTL_NO_DIR_MS = 5 * 60_000;
    const folderKey = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || '';
    if (workspaceCustomAgentsCache &&
        workspaceCustomAgentsCache.folderKey === folderKey &&
        Date.now() - workspaceCustomAgentsCache.atMs < workspaceCustomAgentsCache.ttlMs) {
        if (perfEnabled) {
            settingsPerfLog(`[settings] discoverWorkspaceCustomAgents cacheHit age=${Date.now() - workspaceCustomAgentsCache.atMs}ms items=${workspaceCustomAgentsCache.items.length}`);
        }
        return workspaceCustomAgentsCache.items;
    }
    if (perfEnabled) {
        settingsPerfLog(`[settings] discoverWorkspaceCustomAgents start folder=${folderKey || '(none)'}`);
    }
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder)
        return [];
    // Fast path: if the standard directories do not exist, avoid expensive findFiles over the whole workspace.
    // Spec alignment: Custom Agents live under workspaceRoot/.github/agents (and legacy under .github/chatmodes).
    let hasAgentsDir = false;
    let hasChatmodesDir = false;
    try {
        const [a, b] = await Promise.allSettled([
            vscode.workspace.fs.stat(vscode.Uri.joinPath(folder.uri, '.github', 'agents')),
            vscode.workspace.fs.stat(vscode.Uri.joinPath(folder.uri, '.github', 'chatmodes'))
        ]);
        hasAgentsDir = a.status === 'fulfilled';
        hasChatmodesDir = b.status === 'fulfilled';
    }
    catch {
        // ignore
    }
    if (!hasAgentsDir && !hasChatmodesDir) {
        workspaceCustomAgentsCache = { folderKey, atMs: Date.now(), ttlMs: TTL_NO_DIR_MS, items: [] };
        if (perfEnabled) {
            settingsPerfLog(`[settings] discoverWorkspaceCustomAgents skip (no .github/agents or .github/chatmodes)  ${Date.now() - started}ms`);
        }
        return [];
    }
    const hidden = getHiddenCustomAgentIdsFromConfig();
    const found = [];
    if (hasAgentsDir) {
        try {
            found.push(...(await vscode.workspace.findFiles(new vscode.RelativePattern(folder, '.github/agents/**/*.agent.md'), '**/node_modules/**', 200)));
        }
        catch {
            // ignore
        }
    }
    if (hasChatmodesDir) {
        try {
            found.push(...(await vscode.workspace.findFiles(new vscode.RelativePattern(folder, '.github/chatmodes/**/*.chatmode.md'), '**/node_modules/**', 200)));
        }
        catch {
            // ignore
        }
    }
    const uniqueByFsPath = new Map();
    for (const u of found)
        uniqueByFsPath.set(u.fsPath, u);
    const unique = Array.from(uniqueByFsPath.values());
    const items = [];
    for (const uri of unique) {
        let raw = '';
        try {
            raw = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf8');
        }
        catch {
            continue;
        }
        const relativePath = vscode.workspace.asRelativePath(uri, false).replace(/\\/g, '/');
        const { frontmatter, body } = parseCustomAgentMarkdown(raw);
        const baseName = path.posix.basename(relativePath).replace(/\.(agent|chatmode)\.md$/i, '');
        const name = String(frontmatter.name ?? '').trim() || baseName;
        const id = makeWorkspaceCustomAgentId(relativePath);
        items.push({
            id,
            name,
            description: frontmatter.description ? String(frontmatter.description) : undefined,
            tools: Array.isArray(frontmatter.tools) ? frontmatter.tools.map(String) : undefined,
            model: frontmatter.model ? String(frontmatter.model) : undefined,
            relativePath,
            hidden: hidden.has(id),
            isLegacy: /\.chatmode\.md$/i.test(relativePath),
            body: String(body ?? '')
        });
    }
    items.sort((a, b) => a.name.localeCompare(b.name));
    workspaceCustomAgentsCache = { folderKey, atMs: Date.now(), ttlMs: items.length ? TTL_MS : TTL_NO_DIR_MS, items };
    if (perfEnabled) {
        settingsPerfLog(`[settings] discoverWorkspaceCustomAgents done ${Date.now() - started}ms files=${unique.length} items=${items.length}`);
    }
    return items;
}
let workspaceCustomAgentsCache;
function invalidateWorkspaceCustomAgentsCache() {
    workspaceCustomAgentsCache = undefined;
}
let triLCAutoStartControl;
let triLCAutoStarted = false;
async function resolveTriLCControlCommand() {
    const env = { ...process.env };
    const triCompanyFolder = vscode.workspace.workspaceFolders?.find((folder) => folder.name.toLowerCase() === 'tricompany');
    if (!env.TRICOMPANY_SOURCE_PATH && triCompanyFolder) {
        // w32-2 fix: source-agents is at TriCompany root, not under .github/
        env.TRICOMPANY_SOURCE_PATH = vscode.Uri.joinPath(triCompanyFolder.uri, 'source-agents').fsPath;
    }
    const bundledTriLCRoot = vscode.Uri.joinPath(vscode.Uri.file(vscode.env.appRoot), 'tools', 'trilc');
    if (!env.TRICOMPANY_SOURCE_PATH) {
        const bundledContracts = vscode.Uri.joinPath(bundledTriLCRoot, 'contracts');
        try {
            const stat = await vscode.workspace.fs.stat(bundledContracts);
            if ((stat.type & vscode.FileType.Directory) !== 0) {
                env.TRICOMPANY_SOURCE_PATH = bundledContracts.fsPath;
            }
        }
        catch {
            // The stock VS Code host does not include TriCade runtime contracts.
        }
    }
    const configuredBin = String(process.env.TRILC_BIN ?? '').trim();
    if (configuredBin) {
        return {
            command: configuredBin,
            prefixArgs: [],
            shell: process.platform === 'win32',
            env,
            source: 'TRILC_BIN'
        };
    }
    const bundledCli = vscode.Uri.joinPath(bundledTriLCRoot, 'dist', 'cli.js');
    try {
        const stat = await vscode.workspace.fs.stat(bundledCli);
        if ((stat.type & vscode.FileType.File) !== 0) {
            return {
                command: process.execPath,
                prefixArgs: [bundledCli.fsPath],
                shell: false,
                env: { ...env, ELECTRON_RUN_AS_NODE: '1' },
                source: bundledCli.fsPath
            };
        }
    }
    catch {
        // Fall through to a development workspace or PATH-installed CLI.
    }
    const workspaceFolder = vscode.workspace.workspaceFolders?.find((folder) => folder.name.toLowerCase() === 'trilc');
    if (workspaceFolder) {
        const cliUri = vscode.Uri.joinPath(workspaceFolder.uri, 'dist', 'cli.js');
        try {
            const stat = await vscode.workspace.fs.stat(cliUri);
            if ((stat.type & vscode.FileType.File) !== 0) {
                return {
                    command: process.execPath,
                    prefixArgs: [cliUri.fsPath],
                    shell: false,
                    env: { ...env, ELECTRON_RUN_AS_NODE: '1' },
                    source: cliUri.fsPath
                };
            }
        }
        catch {
            // Fall back to a PATH-installed CLI when the workspace has not been built yet.
        }
    }
    return {
        command: 'trilc',
        prefixArgs: [],
        shell: process.platform === 'win32',
        env,
        source: 'PATH'
    };
}
function deactivate() {
    // TriLC cleanup: attempt to stop the auto-started daemon
    if (triLCAutoStarted && triLCAutoStartControl) {
        try {
            const control = triLCAutoStartControl;
            const child = (0, node_child_process_1.spawn)(control.command, [...control.prefixArgs, 'stop', '--port', String(control.port)], {
                detached: true,
                stdio: 'ignore',
                shell: control.shell,
                env: control.env
            });
            child.unref();
        }
        catch {
            // best-effort
        }
    }
}
function readMcpServersFromConfig() {
    const raw = vscode.workspace.getConfiguration('tripilot').get('mcpServers', []) ?? [];
    return raw
        .map((s) => ({
        id: String(s?.id ?? '').trim(),
        name: String(s?.name ?? '').trim(),
        enabled: Boolean(s?.enabled),
        transport: String(s?.transport ?? 'stdio'),
        command: s?.command ? String(s.command) : undefined,
        args: Array.isArray(s?.args) ? s.args.map(String) : undefined,
        cwd: s?.cwd ? String(s.cwd) : undefined,
        env: s?.env && typeof s.env === 'object' ? s.env : undefined,
        url: s?.url ? String(s.url) : undefined
    }))
        .filter((s) => s.id && s.name);
}
/* v0.1 removed: DEFAULT_AGENT_PROFILES — agents now come from TriLC */
const DEFAULT_AGENT_PROFILES = [];
/* v0.1: no hardcoded default; first TriLC agent will be used */
function getDefaultAgentProfileId() {
    return '';
}
function readAgentProfilesFromConfig() {
    const raw = vscode.workspace.getConfiguration('tripilot').get('agentProfiles', []) ?? [];
    return raw
        .map((p) => ({
        id: String(p?.id ?? '').trim(),
        name: String(p?.name ?? '').trim(),
        enabledBuiltinTools: Array.isArray(p?.enabledBuiltinTools) ? p.enabledBuiltinTools.map(String) : undefined,
        enabledCommandTools: Array.isArray(p?.enabledCommandTools) ? p.enabledCommandTools.map(String) : undefined,
        enabledMcpServers: Array.isArray(p?.enabledMcpServers) ? p.enabledMcpServers.map(String) : undefined,
        editsEnableHealing: p?.editsEnableHealing === undefined ? undefined : Boolean(p.editsEnableHealing)
    }))
        .filter((p) => p.id && p.name);
}
async function writeAgentProfilesToConfig(next) {
    await vscode.workspace
        .getConfiguration('tripilot')
        .update('agentProfiles', next, vscode.ConfigurationTarget.Global);
}
function getAgentProfilesMerged() {
    const custom = readAgentProfilesFromConfig();
    const byId = new Map();
    /* v0.1: DEFAULT_AGENT_PROFILES is empty; profiles only from user config */
    for (const p of custom) {
        byId.set(p.id, { ...p });
    }
    return Array.from(byId.values());
}
function getAgentProfileMerged(id) {
    const normalized = String(id || '').trim() || getDefaultAgentProfileId();
    /* v0.1: no hardcoded defaults; return from user config or fallback */
    const found = getAgentProfilesMerged().find((p) => p.id === normalized);
    return found ?? { id: normalized, name: normalized };
}
async function upsertAgentProfile(profile) {
    const id = String(profile?.id ?? '').trim();
    const name = String(profile?.name ?? '').trim();
    if (!id || !name)
        return;
    const current = readAgentProfilesFromConfig();
    const next = current.filter((p) => p.id !== id);
    next.push({
        id,
        name,
        enabledBuiltinTools: profile.enabledBuiltinTools,
        enabledCommandTools: profile.enabledCommandTools,
        enabledMcpServers: profile.enabledMcpServers,
        editsEnableHealing: profile.editsEnableHealing
    });
    await writeAgentProfilesToConfig(next);
}
async function removeAgentProfile(profileId) {
    const id = String(profileId ?? '').trim();
    if (!id)
        return;
    /* v0.1: no built-in profiles to protect */
    const current = readAgentProfilesFromConfig();
    await writeAgentProfilesToConfig(current.filter((p) => p.id !== id));
}
async function setAgentProfileOptionalTools(profileId, enabledOptionalTools) {
    const id = String(profileId ?? '').trim() || getDefaultAgentProfileId();
    const baseProfile = getAgentProfileMerged(id);
    // Important: do NOT pass a defaultValue here; it can mask extension-contributed defaults.
    const raw = vscode.workspace.getConfiguration('tripilot').get('enabledBuiltinTools');
    const arr = Array.isArray(raw) ? raw : [];
    const normalized = arr.map((s) => String(s).trim()).filter(Boolean);
    const globalEnabled = new Set(normalized.length ? normalized : Array.from(OPTIONAL_TOOL_NAMES));
    const currentEnabled = new Set(Array.isArray(baseProfile.enabledBuiltinTools) ? baseProfile.enabledBuiltinTools.map(String) : Array.from(globalEnabled));
    // Guard against legacy UI/tool names: only apply changes for recognized optional tool ids.
    // If the caller passes a non-empty set but none of them are recognized, ignore to avoid wiping tool config.
    const recognized = new Set();
    for (const n of enabledOptionalTools) {
        if (OPTIONAL_TOOL_NAMES.has(n))
            recognized.add(n);
    }
    if (enabledOptionalTools.size > 0 && recognized.size === 0) {
        return;
    }
    for (const name of OPTIONAL_TOOL_NAMES) {
        if (recognized.has(name))
            currentEnabled.add(name);
        else
            currentEnabled.delete(name);
    }
    await upsertAgentProfile({ ...baseProfile, id, enabledBuiltinTools: Array.from(currentEnabled) });
}
class TripilotSettingsPanel {
    panel;
    context;
    mcpManager;
    extensionVersion;
    static viewType = 'tripilot.settings';
    static current;
    static currentManager;
    initialPage = 'models';
    activeAgentProfileId = getDefaultAgentProfileId();
    builtinToolCategoriesCache;
    trilcClient;
    triLcClient;
    tricompanyAgents = [];
    openedAtMs = Date.now();
    perfSeq = 0;
    static FOLLOW_CHAT_PROFILE_KEY = 'tripilot.settings.followChatProfile';
    static SYNC_CHAT_PROFILE_FROM_SETTINGS_KEY = 'tripilot.settings.syncChatProfileFromSettings';
    getEditsEnableHealing() {
        return !!vscode.workspace.getConfiguration('tripilot').get('edits.enableHealing', false);
    }
    perfPrefix() {
        return `+${Date.now() - this.openedAtMs}ms`;
    }
    perfLog(msg) {
        if (!isSettingsPerfEnabled())
            return;
        settingsPerfLog(`[settings] ${msg} ${this.perfPrefix()}`);
    }
    async timePromise(label, promise) {
        if (!isSettingsPerfEnabled())
            return promise;
        const id = ++this.perfSeq;
        const start = Date.now();
        settingsPerfLog(`[settings#${id}] ${label} start +${start - this.openedAtMs}ms`);
        try {
            const result = await promise;
            settingsPerfLog(`[settings#${id}] ${label} ok ${Date.now() - start}ms`);
            return result;
        }
        catch (e) {
            settingsPerfLog(`[settings#${id}] ${label} err ${Date.now() - start}ms: ${e instanceof Error ? e.message : String(e)}`);
            throw e;
        }
    }
    constructor(panel, context, mcpManager, extensionVersion, initialPage) {
        this.panel = panel;
        this.context = context;
        this.mcpManager = mcpManager;
        this.extensionVersion = extensionVersion;
        this.initialPage = initialPage ?? 'models';
        settingsPerfLog(`[settings] open initialPage=${this.initialPage}`);
        if (isSettingsPerfEnabled()) {
            try {
                settingsPerfChannel?.show(true);
            }
            catch {
                // ignore
            }
        }
        this.trilcClient = new trilcClient_1.TrilcDirectClient(this.extensionVersion, `vscode/${vscode.version}`);
        const triLcBaseUrl = vscode.workspace.getConfiguration('tripilot').get('trilcDirect.baseUrl', 'http://127.0.0.1:8711') ?? 'http://127.0.0.1:8711';
        this.triLcClient = new TriLCClient_1.TriLCClient({ baseUrl: triLcBaseUrl });
        this.panel.onDidDispose(() => {
            if (TripilotSettingsPanel.current === this) {
                TripilotSettingsPanel.current = undefined;
            }
            try {
                this.trilcClient.dispose();
            }
            catch {
                // ignore
            }
        });
        this.panel.webview.onDidReceiveMessage(async (msg) => {
            switch (msg.type) {
                case 'webviewReady':
                    settingsPerfLog(`[settings] webviewReady +${Date.now() - this.openedAtMs}ms`);
                    await this.refreshAndPost(true);
                    void this.fetchAndPostAgents();
                    return;
                case 'refreshModels':
                    clearSettingsModelsCache();
                    await this.refreshAndPost(false);
                    return;
                case 'toggleModel':
                    await this.toggleModel(msg.id, msg.enabled);
                    return;
                case 'setDefaultModel': {
                    const id = String(msg.id ?? '').trim();
                    if (id) {
                        await this.context.globalState.update('tripilot.defaultModelId', id);
                        this.post({ type: 'update', defaultModelId: id });
                    }
                    return;
                }
                case 'refreshToolsAndMcp':
                    await this.mcpManager.refresh(this.getEffectiveMcpServersConfig(this.activeAgentProfileId));
                    await this.refreshAndPost(false);
                    return;
                case 'refreshCustomAgents':
                    await this.refreshAndPost(false);
                    return;
                case 'refreshAgents':
                    await this.fetchAndPostAgents();
                    return;
                case 'setFollowChatProfile': {
                    const enabled = !!msg.enabled;
                    await this.context.globalState.update(TripilotSettingsPanel.FOLLOW_CHAT_PROFILE_KEY, enabled);
                    this.post({ type: 'update', followChatProfile: enabled });
                    if (enabled) {
                        const chatProfileId = String(this.context.globalState.get('tripilot.selectedAgentProfileId') ?? '').trim() ||
                            getDefaultAgentProfileId();
                        await this.applyChatProfileIfFollowing(chatProfileId);
                    }
                    return;
                }
                case 'setSyncChatProfileFromSettings': {
                    const enabled = !!msg.enabled;
                    await this.context.globalState.update(TripilotSettingsPanel.SYNC_CHAT_PROFILE_FROM_SETTINGS_KEY, enabled);
                    this.post({ type: 'update', syncChatProfileFromSettings: enabled });
                    return;
                }
                case 'setEditsEnableHealing': {
                    const enabled = !!msg.enabled;
                    await vscode.workspace
                        .getConfiguration('tripilot')
                        .update('edits.enableHealing', enabled, vscode.ConfigurationTarget.Global);
                    this.post({ type: 'update', editsEnableHealing: this.getEditsEnableHealing() });
                    return;
                }
                case 'setAgentProfileEditsEnableHealing': {
                    const id = String(msg.id ?? '').trim() || getDefaultAgentProfileId();
                    const mode = msg.mode === 'on' ? 'on' : msg.mode === 'off' ? 'off' : 'inherit';
                    const base = getAgentProfileMerged(id);
                    const editsEnableHealing = mode === 'inherit' ? undefined : mode === 'on';
                    await upsertAgentProfile({ ...base, id, editsEnableHealing });
                    await this.refreshAndPost(false);
                    return;
                }
                case 'createWorkspaceCustomAgent': {
                    const base = String(msg.fileBaseName ?? '').trim();
                    if (!base)
                        return;
                    const folder = vscode.workspace.workspaceFolders?.[0];
                    if (!folder)
                        return;
                    const safeBase = base.replace(/[^A-Za-z0-9_.\-]/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
                    if (!safeBase)
                        return;
                    const dir = vscode.Uri.joinPath(folder.uri, '.github', 'agents');
                    await vscode.workspace.fs.createDirectory(dir);
                    let fileUri = vscode.Uri.joinPath(dir, `${safeBase}.agent.md`);
                    for (let i = 2; i < 50; i++) {
                        try {
                            await vscode.workspace.fs.stat(fileUri);
                            fileUri = vscode.Uri.joinPath(dir, `${safeBase}-${i}.agent.md`);
                        }
                        catch {
                            break;
                        }
                    }
                    const template = `---\nname: ${safeBase}\ndescription: Describe what this agent does.\ntools: []\n---\n\n# Instructions\n\nDescribe the agent behavior and workflow here.\n`;
                    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(template, 'utf8'));
                    invalidateWorkspaceCustomAgentsCache();
                    try {
                        const doc = await vscode.workspace.openTextDocument(fileUri);
                        await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false });
                    }
                    catch {
                        // ignore
                    }
                    await this.refreshAndPost(false);
                    return;
                }
                case 'openWorkspaceCustomAgent': {
                    const id = String(msg.id ?? '').trim();
                    if (!id)
                        return;
                    const agents = await discoverWorkspaceCustomAgents();
                    const picked = agents.find((a) => a.id === id);
                    if (!picked)
                        return;
                    const folder = vscode.workspace.workspaceFolders?.[0];
                    if (!folder)
                        return;
                    const uri = vscode.Uri.joinPath(folder.uri, ...picked.relativePath.split('/'));
                    const doc = await vscode.workspace.openTextDocument(uri);
                    await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false });
                    return;
                }
                case 'deleteWorkspaceCustomAgent': {
                    const id = String(msg.id ?? '').trim();
                    if (!id)
                        return;
                    const agents = await discoverWorkspaceCustomAgents();
                    const picked = agents.find((a) => a.id === id);
                    if (!picked)
                        return;
                    const ok = await vscode.window.showWarningMessage(`删除 Custom Agent 文件？\n${picked.relativePath}`, { modal: true }, '删除');
                    if (ok !== '删除')
                        return;
                    const folder = vscode.workspace.workspaceFolders?.[0];
                    if (!folder)
                        return;
                    const uri = vscode.Uri.joinPath(folder.uri, ...picked.relativePath.split('/'));
                    await vscode.workspace.fs.delete(uri);
                    invalidateWorkspaceCustomAgentsCache();
                    // Also ensure hidden flag is cleared.
                    const hidden = getHiddenCustomAgentIdsFromConfig();
                    hidden.delete(id);
                    await setHiddenCustomAgentIdsToConfig(Array.from(hidden));
                    await this.refreshAndPost(false);
                    return;
                }
                case 'setWorkspaceCustomAgentHidden': {
                    const id = String(msg.id ?? '').trim();
                    if (!id)
                        return;
                    const hidden = getHiddenCustomAgentIdsFromConfig();
                    if (msg.hidden)
                        hidden.add(id);
                    else
                        hidden.delete(id);
                    await setHiddenCustomAgentIdsToConfig(Array.from(hidden));
                    invalidateWorkspaceCustomAgentsCache();
                    await this.refreshAndPost(false);
                    return;
                }
                case 'setActiveAgentProfile':
                    this.activeAgentProfileId = String(msg.id ?? '').trim() || getDefaultAgentProfileId();
                    await this.refreshAndPost(false);
                    if (this.getSyncChatProfileFromSettings()) {
                        TripilotChatViewProvider.trySyncChatProfileFromSettings(this.activeAgentProfileId);
                    }
                    return;
                case 'addAgentProfile':
                    await upsertAgentProfile(msg.profile);
                    this.post({ type: 'update', agentProfiles: getAgentProfilesMerged() });
                    return;
                case 'removeAgentProfile':
                    await removeAgentProfile(msg.id);
                    this.post({ type: 'update', agentProfiles: getAgentProfilesMerged() });
                    return;
                case 'discoverCommands': {
                    const query = String(msg.query ?? '').trim().toLowerCase();
                    const all = await vscode.commands.getCommands(true);
                    const filtered = query
                        ? all.filter((id) => String(id).toLowerCase().includes(query))
                        : all;
                    // Keep results bounded for webview perf.
                    this.post({ type: 'discoveredCommands', commands: filtered.slice(0, 200) });
                    return;
                }
                case 'setBuiltinToolEnabled':
                    await this.setBuiltinToolEnabled(msg.name, msg.enabled);
                    return;
                case 'addCommandTool':
                    await this.addCommandTool(msg.tool);
                    return;
                case 'removeCommandTool':
                    await this.removeCommandTool(msg.name);
                    return;
                case 'setCommandToolEnabled':
                    await this.setCommandToolEnabled(msg.name, msg.enabled);
                    return;
                case 'upsertMcpServer':
                    await this.upsertMcpServer(msg.server);
                    return;
                case 'removeMcpServer':
                    await this.removeMcpServer(msg.id);
                    return;
                case 'setMcpServerEnabled':
                    await this.setMcpServerEnabled(msg.id, msg.enabled);
                    return;
            }
        });
    }
    getFollowChatProfile() {
        try {
            const raw = this.context.globalState.get(TripilotSettingsPanel.FOLLOW_CHAT_PROFILE_KEY);
            return raw === undefined ? true : !!raw;
        }
        catch {
            return true;
        }
    }
    getSyncChatProfileFromSettings() {
        try {
            const raw = this.context.globalState.get(TripilotSettingsPanel.SYNC_CHAT_PROFILE_FROM_SETTINGS_KEY);
            return raw === undefined ? false : !!raw;
        }
        catch {
            return false;
        }
    }
    postToolsSnapshotUpdate() {
        const activeAgentProfileId = this.activeAgentProfileId;
        const builtinTools = this.getBuiltinToolsState(activeAgentProfileId);
        const commandTools = this.getCommandTools(activeAgentProfileId);
        const mcpConfigs = this.getEffectiveMcpServersConfig(activeAgentProfileId);
        const mcpServers = this.mcpManager.getStatuses(mcpConfigs);
        this.post({
            type: 'update',
            activeAgentProfileId,
            agentProfiles: getAgentProfilesMerged(),
            builtinTools,
            commandTools,
            mcpServers
        });
    }
    async applyChatProfileIfFollowing(chatProfileId) {
        const id = String(chatProfileId ?? '').trim();
        if (!id)
            return;
        if (!this.getFollowChatProfile())
            return;
        if (this.activeAgentProfileId === id)
            return;
        this.activeAgentProfileId = id;
        this.postToolsSnapshotUpdate();
    }
    resetTrilcDirectCaches() {
        try {
            this.trilcClient.reset();
        }
        catch {
            // ignore
        }
    }
    async fetchAndPostAgents() {
        try {
            const agents = await this.triLcClient.listAgents();
            if (agents.length)
                this.tricompanyAgents = agents;
        }
        catch {
            // TriLC not available — keep current list
        }
        this.post({ type: 'update', triLcAgents: this.tricompanyAgents });
    }
    static show(context, mcpManager, initialPage = 'models', options) {
        const perfEnabled = isSettingsPerfEnabled();
        const started = perfEnabled ? Date.now() : 0;
        if (perfEnabled) {
            settingsPerfLog(`[settings] show start initialPage=${initialPage}`);
        }
        if (TripilotSettingsPanel.current) {
            TripilotSettingsPanel.current.panel.reveal(vscode.ViewColumn.Active);
            TripilotSettingsPanel.current.initialPage = initialPage;
            if (options?.fromChat && options.agentProfileId) {
                void TripilotSettingsPanel.current.applyChatProfileIfFollowing(options.agentProfileId);
            }
            try {
                TripilotSettingsPanel.current.post({ type: 'setPage', page: initialPage });
            }
            catch {
                // ignore
            }
            if (perfEnabled) {
                settingsPerfLog(`[settings] show reuse existing ${Date.now() - started}ms`);
            }
            return;
        }
        let tCreate = 0;
        if (perfEnabled)
            tCreate = Date.now();
        const panel = vscode.window.createWebviewPanel(TripilotSettingsPanel.viewType, 'Tripilot Settings', vscode.ViewColumn.Active, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [context.extensionUri]
        });
        if (perfEnabled) {
            settingsPerfLog(`[settings] show createWebviewPanel ${Date.now() - tCreate}ms`);
        }
        const extensionVersion = String(context?.extension?.packageJSON?.version ?? '0.0.0');
        const instance = new TripilotSettingsPanel(panel, context, mcpManager, extensionVersion, initialPage);
        if (options?.fromChat && options.agentProfileId) {
            void instance.applyChatProfileIfFollowing(options.agentProfileId);
        }
        TripilotSettingsPanel.current = instance;
        TripilotSettingsPanel.currentManager = mcpManager;
        let tHtml = 0;
        if (perfEnabled)
            tHtml = Date.now();
        panel.webview.html = instance.getHtml(panel.webview);
        if (perfEnabled) {
            settingsPerfLog(`[settings] show setHtml ${Date.now() - tHtml}ms total=${Date.now() - started}ms`);
        }
    }
    static syncActiveAgentProfileFromChat(agentProfileId) {
        try {
            void TripilotSettingsPanel.current?.applyChatProfileIfFollowing(agentProfileId);
        }
        catch {
            // ignore
        }
    }
    getChatProvider() {
        return 'trilc-direct';
    }
    // W30: apiKey removed — TriPilot holds zero API keys (CPO Q2 ruling).
    // All LLM calls go through TriLC daemon on localhost.
    getTrilcConfig() {
        const cfg = vscode.workspace.getConfiguration('tripilot');
        const baseUrl = String(cfg.get('trilcDirect.baseUrl', 'http://127.0.0.1:8711') ?? '').trim();
        return {
            baseUrl,
        };
    }
    static refreshIfOpen() {
        try {
            void TripilotSettingsPanel.current?.refreshAndPost(false);
        }
        catch {
            // ignore
        }
    }
    post(msg) {
        if (isSettingsPerfEnabled()) {
            try {
                const keys = Object.keys(msg)
                    .filter((k) => k !== 'type')
                    .join(',');
                settingsPerfLog(`[settings] post type=${msg.type}${keys ? ` keys=${keys}` : ''} ${this.perfPrefix()}`);
            }
            catch {
                // ignore
            }
        }
        this.panel.webview.postMessage(msg);
    }
    getVisibleModelIds() {
        const ids = vscode.workspace.getConfiguration('tripilot').get('visibleModelIds', []) ?? [];
        return ids.map((s) => String(s).trim()).filter(Boolean);
    }
    async computeModelsStatus(models) {
        const parts = ['trilc-direct'];
        if (!Array.isArray(models) || !models.length)
            return parts.join(' · ');
        // For remote catalogs, keep it simple.
        parts.push(`models=${models.length}`);
        return parts.join(' · ');
    }
    async setVisibleModelIds(ids) {
        await vscode.workspace
            .getConfiguration('tripilot')
            .update('visibleModelIds', ids, vscode.ConfigurationTarget.Global);
    }
    async toggleModel(id, enabled) {
        const normalizedId = String(id);
        const current = this.getVisibleModelIds();
        const set = new Set(current);
        if (enabled)
            set.add(normalizedId);
        else
            set.delete(normalizedId);
        const next = Array.from(set);
        if (next.length === 0) {
            // Keep at least one model enabled to avoid a broken picker.
            set.add('auto');
            await this.setVisibleModelIds(Array.from(set));
            vscode.window.showInformationMessage('至少需要启用一个模型；已自动启用 Auto。');
        }
        else {
            await this.setVisibleModelIds(next);
        }
        this.post({ type: 'update', visibleModelIds: this.getVisibleModelIds() });
    }
    getAutoModelInfo() {
        return {
            id: 'auto',
            name: 'Auto',
            vendor: 'tripilot',
            family: 'auto',
            version: 'auto',
            maxInputTokens: 0
        };
    }
    async refreshAndPost(first) {
        const refreshId = ++this.perfSeq;
        const refreshStart = Date.now();
        if (isSettingsPerfEnabled()) {
            settingsPerfLog(`[settings#${refreshId}] refreshAndPost first=${first} page=${this.initialPage} start +${refreshStart - this.openedAtMs}ms`);
        }
        const visibleModelIds = this.getVisibleModelIds();
        const defaultModelId = this.context.globalState.get('tripilot.defaultModelId') ?? '';
        const modelsPromise = this.timePromise('getAllModelsForSettings', this.getAllModelsForSettings());
        const agentProfiles = getAgentProfilesMerged();
        const activeAgentProfileId = this.activeAgentProfileId;
        const followChatProfile = this.getFollowChatProfile();
        const syncChatProfileFromSettings = this.getSyncChatProfileFromSettings();
        const editsEnableHealing = this.getEditsEnableHealing();
        const builtinTools = this.getBuiltinToolsState(activeAgentProfileId);
        const commandTools = this.getCommandTools(activeAgentProfileId);
        const mcpConfigs = this.getEffectiveMcpServersConfig(activeAgentProfileId);
        const mcpServers = this.mcpManager.getStatuses(mcpConfigs);
        // Fast path: when opening Settings on the Models page, avoid blocking first paint
        // on expensive workspace scans (custom agents) and reference directory reads.
        const fastInit = first && this.initialPage === 'models';
        if (isSettingsPerfEnabled()) {
            settingsPerfLog(`[settings#${refreshId}] fastInit=${fastInit} ${this.perfPrefix()}`);
        }
        if (fastInit) {
            // Post quickly with Auto model, then update models when discovery completes.
            const models = [this.getAutoModelInfo()];
            this.post({
                type: 'init',
                initialPage: this.initialPage,
                modelsStatus: `${this.getChatProvider()} · loading…`,
                models,
                visibleModelIds,
                defaultModelId,
                editsEnableHealing,
                agentProfiles,
                activeAgentProfileId,
                followChatProfile,
                syncChatProfileFromSettings,
                builtinTools,
                // Tools page will fill these in shortly.
                builtinToolCategories: {},
                commandTools,
                mcpServers,
                // Custom agents page will fill these in shortly.
                customAgents: [],
                triLcAgents: this.tricompanyAgents
            });
            if (isSettingsPerfEnabled()) {
                settingsPerfLog(`[settings#${refreshId}] init posted total=${Date.now() - refreshStart}ms ${this.perfPrefix()}`);
            }
            void (async () => {
                try {
                    const full = await modelsPromise;
                    const modelsStatus = await this.computeModelsStatus(full);
                    this.post({ type: 'update', models: full, modelsStatus });
                }
                catch {
                    // ignore
                }
            })();
            void (async () => {
                try {
                    const bgStart = Date.now();
                    this.perfLog(`backgroundUpdate start`);
                    const [builtinToolCategories, customAgents] = await Promise.all([
                        this.timePromise('getBuiltinToolCategories', this.getBuiltinToolCategories()),
                        this.timePromise('discoverWorkspaceCustomAgents', discoverWorkspaceCustomAgents())
                    ]);
                    this.post({ type: 'update', builtinToolCategories, customAgents });
                    if (isSettingsPerfEnabled()) {
                        settingsPerfLog(`[settings] backgroundUpdate posted ${Date.now() - bgStart}ms ${this.perfPrefix()}`);
                    }
                }
                catch {
                    // ignore
                }
            })();
            return;
        }
        const [models, builtinToolCategories, customAgents] = await Promise.all([
            modelsPromise,
            this.timePromise('getBuiltinToolCategories', this.getBuiltinToolCategories()),
            this.timePromise('discoverWorkspaceCustomAgents', discoverWorkspaceCustomAgents())
        ]);
        const modelsStatus = await this.computeModelsStatus(models);
        this.post(first
            ? {
                type: 'init',
                initialPage: this.initialPage,
                modelsStatus,
                models,
                visibleModelIds,
                defaultModelId,
                editsEnableHealing,
                agentProfiles,
                activeAgentProfileId,
                followChatProfile,
                syncChatProfileFromSettings,
                builtinTools,
                builtinToolCategories,
                commandTools,
                mcpServers,
                customAgents,
                triLcAgents: this.tricompanyAgents
            }
            : {
                type: 'update',
                modelsStatus,
                models,
                visibleModelIds,
                defaultModelId,
                editsEnableHealing,
                agentProfiles,
                activeAgentProfileId,
                followChatProfile,
                syncChatProfileFromSettings,
                builtinTools,
                builtinToolCategories,
                commandTools,
                mcpServers,
                customAgents,
                triLcAgents: this.tricompanyAgents
            });
        if (isSettingsPerfEnabled()) {
            settingsPerfLog(`[settings#${refreshId}] done total=${Date.now() - refreshStart}ms ${this.perfPrefix()}`);
        }
    }
    async getBuiltinToolCategories() {
        if (this.builtinToolCategoriesCache) {
            this.perfLog(`getBuiltinToolCategories cacheHit`);
            return this.builtinToolCategoriesCache;
        }
        const started = Date.now();
        // Deterministic mapping from reference directory structure:
        // reference/copilot/built-in-tools/{agent,edit,execute,read,search,vscode,web}/*.md
        // plus reference/copilot/built-in-tools/todo.md (maps to manage_todo_list)
        const base = vscode.Uri.joinPath(this.context.extensionUri, 'reference', 'copilot', 'built-in-tools');
        const categories = ['agent', 'edit', 'execute', 'read', 'search', 'vscode', 'web'];
        const out = {};
        const allowed = new Set(getToolDefinitions().map((t) => t.function.name));
        const categoryPriority = {
            agent: 1,
            edit: 2,
            read: 3,
            search: 4,
            execute: 5,
            todo: 6,
            vscode: 7,
            web: 8
        };
        const shouldOverride = (existing, next) => {
            if (!existing)
                return true;
            return (categoryPriority[next] ?? 999) < (categoryPriority[existing] ?? 999);
        };
        const add = (toolName, category) => {
            if (!allowed.has(toolName))
                return;
            if (shouldOverride(out[toolName], category))
                out[toolName] = category;
        };
        for (const cat of categories) {
            let entries = [];
            try {
                const t = Date.now();
                entries = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(base, cat));
                if (isSettingsPerfEnabled()) {
                    settingsPerfLog(`[settings] getBuiltinToolCategories readDirectory ${cat} ${Date.now() - t}ms entries=${entries.length} ${this.perfPrefix()}`);
                }
            }
            catch {
                continue;
            }
            for (const [name, type] of entries) {
                if (type !== vscode.FileType.File)
                    continue;
                const lower = name.toLowerCase();
                if (!lower.endsWith('.md'))
                    continue;
                if (lower === 'overview.md' || lower === 'readme.md')
                    continue;
                const toolName = name.replace(/\.md$/i, '');
                add(toolName, cat);
            }
        }
        // todo.md is a category page, but it defines the todo tool.
        add('manage_todo_list', 'todo');
        this.builtinToolCategoriesCache = out;
        if (isSettingsPerfEnabled()) {
            settingsPerfLog(`[settings] getBuiltinToolCategories total ${Date.now() - started}ms mapped=${Object.keys(out).length} ${this.perfPrefix()}`);
        }
        return out;
    }
    getBuiltinToolsState(profileId) {
        const profile = getAgentProfileMerged(profileId);
        // Important: do NOT pass a defaultValue here; it can mask extension-contributed defaults.
        const raw = vscode.workspace.getConfiguration('tripilot').get('enabledBuiltinTools');
        const arr = Array.isArray(raw) ? raw : [];
        const normalized = arr.map((s) => String(s).trim()).filter(Boolean);
        const globalEnabled = new Set(normalized.length ? normalized : Array.from(OPTIONAL_TOOL_NAMES));
        const enabled = new Set(Array.isArray(profile.enabledBuiltinTools) && profile.enabledBuiltinTools.length > 0
            ? profile.enabledBuiltinTools.map(String)
            : Array.from(globalEnabled));
        const namesAll = getToolDefinitions().map((t) => t.function.name);
        return namesAll.map((name) => ({ name, enabled: enabled.has(name) }));
    }
    async setBuiltinToolEnabled(name, enabled) {
        const toolName = String(name);
        const profile = getAgentProfileMerged(this.activeAgentProfileId);
        // Start from the effective enabled set (including defaults) so toggling one tool doesn't accidentally disable others.
        const raw = vscode.workspace.getConfiguration('tripilot').get('enabledBuiltinTools');
        const arr = Array.isArray(raw) ? raw : [];
        const normalized = arr.map((s) => String(s).trim()).filter(Boolean);
        const base = Array.isArray(profile.enabledBuiltinTools) && profile.enabledBuiltinTools.length > 0
            ? profile.enabledBuiltinTools
            : (normalized.length ? normalized : Array.from(OPTIONAL_TOOL_NAMES));
        const set = new Set(base.map(String));
        if (enabled)
            set.add(toolName);
        else
            set.delete(toolName);
        await upsertAgentProfile({ ...profile, enabledBuiltinTools: Array.from(set) });
        this.post({ type: 'update', builtinTools: this.getBuiltinToolsState(this.activeAgentProfileId) });
    }
    getCommandToolDefsRaw() {
        const raw = vscode.workspace.getConfiguration('tripilot').get('commandTools', []) ?? [];
        return raw
            .map((t) => ({
            name: String(t?.name ?? '').trim(),
            command: String(t?.command ?? '').trim(),
            description: t?.description ? String(t.description) : undefined,
            enabled: Boolean(t?.enabled)
        }))
            .filter((t) => t.name && t.command);
    }
    getCommandTools(profileId) {
        const defs = this.getCommandToolDefsRaw();
        const profile = getAgentProfileMerged(profileId);
        const enabledSet = profile.enabledCommandTools
            ? new Set(profile.enabledCommandTools.map((s) => String(s).trim()).filter(Boolean))
            : new Set(defs.filter((d) => d.enabled).map((d) => d.name));
        return defs.map((d) => ({ ...d, enabled: enabledSet.has(d.name) }));
    }
    async setCommandTools(next) {
        await vscode.workspace
            .getConfiguration('tripilot')
            .update('commandTools', next, vscode.ConfigurationTarget.Global);
    }
    async addCommandTool(tool) {
        const nextTool = {
            name: String(tool?.name ?? '').trim(),
            command: String(tool?.command ?? '').trim(),
            description: tool?.description ? String(tool.description) : undefined,
            enabled: Boolean(tool?.enabled)
        };
        if (!nextTool.name || !nextTool.command)
            return;
        const current = this.getCommandToolDefsRaw();
        const filtered = current.filter((t) => t.name !== nextTool.name);
        filtered.push(nextTool);
        await this.setCommandTools(filtered);
        // Enable for current active profile.
        const profile = getAgentProfileMerged(this.activeAgentProfileId);
        /* v0.1 removed: ask-study check */
        const set = new Set(profile.enabledCommandTools ?? []);
        set.add(nextTool.name);
        await upsertAgentProfile({ ...profile, enabledCommandTools: Array.from(set) });
        this.post({ type: 'update', commandTools: this.getCommandTools(this.activeAgentProfileId), agentProfiles: getAgentProfilesMerged() });
    }
    async removeCommandTool(name) {
        const toolName = String(name);
        const current = this.getCommandToolDefsRaw().filter((t) => t.name !== toolName);
        await this.setCommandTools(current);
        // Remove from all profile enable lists.
        const profiles = readAgentProfilesFromConfig().map((p) => ({
            ...p,
            enabledCommandTools: Array.isArray(p.enabledCommandTools)
                ? p.enabledCommandTools.filter((n) => String(n) !== toolName)
                : undefined
        }));
        await writeAgentProfilesToConfig(profiles);
        this.post({ type: 'update', commandTools: this.getCommandTools(this.activeAgentProfileId), agentProfiles: getAgentProfilesMerged() });
    }
    async setCommandToolEnabled(name, enabled) {
        const toolName = String(name);
        const profile = getAgentProfileMerged(this.activeAgentProfileId);
        /* v0.1 removed: ask-study check */
        const set = new Set(profile.enabledCommandTools ?? []);
        if (enabled)
            set.add(toolName);
        else
            set.delete(toolName);
        await upsertAgentProfile({ ...profile, enabledCommandTools: Array.from(set) });
        this.post({ type: 'update', commandTools: this.getCommandTools(this.activeAgentProfileId), agentProfiles: getAgentProfilesMerged() });
    }
    getEffectiveMcpServersConfig(profileId) {
        const configs = this.getMcpServersConfig();
        const profile = getAgentProfileMerged(profileId);
        const enabledSet = profile.enabledMcpServers
            ? new Set(profile.enabledMcpServers.map((s) => String(s).trim()).filter(Boolean))
            : new Set(configs.filter((s) => s.enabled).map((s) => s.id));
        return configs.map((s) => ({ ...s, enabled: enabledSet.has(s.id) }));
    }
    getMcpServersConfig() {
        const raw = vscode.workspace.getConfiguration('tripilot').get('mcpServers', []) ?? [];
        return raw
            .map((s) => ({
            id: String(s?.id ?? '').trim(),
            name: String(s?.name ?? '').trim(),
            enabled: Boolean(s?.enabled),
            transport: String(s?.transport ?? 'stdio'),
            command: s?.command ? String(s.command) : undefined,
            args: Array.isArray(s?.args) ? s.args.map(String) : undefined,
            cwd: s?.cwd ? String(s.cwd) : undefined,
            env: s?.env && typeof s.env === 'object' ? s.env : undefined,
            url: s?.url ? String(s.url) : undefined
        }))
            .filter((s) => s.id && s.name);
    }
    async setMcpServers(next) {
        await vscode.workspace
            .getConfiguration('tripilot')
            .update('mcpServers', next, vscode.ConfigurationTarget.Global);
    }
    async upsertMcpServer(server) {
        const nextServer = {
            id: String(server?.id ?? '').trim(),
            name: String(server?.name ?? '').trim(),
            enabled: Boolean(server?.enabled),
            transport: String(server?.transport ?? 'stdio') ?? 'stdio',
            command: server?.command ? String(server.command) : undefined,
            args: Array.isArray(server?.args) ? server.args.map(String) : undefined,
            cwd: server?.cwd ? String(server.cwd) : undefined,
            env: server?.env && typeof server.env === 'object' ? server.env : undefined,
            url: server?.url ? String(server.url) : undefined
        };
        if (!nextServer.id || !nextServer.name)
            return;
        const current = vscode.workspace.getConfiguration('tripilot').get('mcpServers', []) ?? [];
        const filtered = current.filter((s) => String(s?.id ?? '') !== nextServer.id);
        filtered.push(nextServer);
        await this.setMcpServers(filtered);
        // Enable for current active profile.
        const profile = getAgentProfileMerged(this.activeAgentProfileId);
        /* v0.1 removed: ask-study MCP check */
        const set = new Set(profile.enabledMcpServers ?? []);
        set.add(nextServer.id);
        await upsertAgentProfile({ ...profile, enabledMcpServers: Array.from(set) });
        const cfgs = this.getEffectiveMcpServersConfig(this.activeAgentProfileId);
        await this.mcpManager.refresh(cfgs);
        this.post({ type: 'update', mcpServers: this.mcpManager.getStatuses(cfgs), agentProfiles: getAgentProfilesMerged() });
    }
    async removeMcpServer(id) {
        const serverId = String(id);
        const current = vscode.workspace.getConfiguration('tripilot').get('mcpServers', []) ?? [];
        const next = current.filter((s) => String(s?.id ?? '') !== serverId);
        await this.setMcpServers(next);
        // Remove from all profile enable lists.
        const profiles = readAgentProfilesFromConfig().map((p) => ({
            ...p,
            enabledMcpServers: Array.isArray(p.enabledMcpServers)
                ? p.enabledMcpServers.filter((sid) => String(sid) !== serverId)
                : undefined
        }));
        await writeAgentProfilesToConfig(profiles);
        const cfgs = this.getEffectiveMcpServersConfig(this.activeAgentProfileId);
        await this.mcpManager.refresh(cfgs);
        this.post({ type: 'update', mcpServers: this.mcpManager.getStatuses(cfgs), agentProfiles: getAgentProfilesMerged() });
    }
    async setMcpServerEnabled(id, enabled) {
        const serverId = String(id);
        const profile = getAgentProfileMerged(this.activeAgentProfileId);
        /* v0.1 removed: ask-study MCP check */
        const set = new Set(profile.enabledMcpServers ?? []);
        if (enabled)
            set.add(serverId);
        else
            set.delete(serverId);
        await upsertAgentProfile({ ...profile, enabledMcpServers: Array.from(set) });
        const cfgs = this.getEffectiveMcpServersConfig(this.activeAgentProfileId);
        await this.mcpManager.refresh(cfgs);
        this.post({ type: 'update', mcpServers: this.mcpManager.getStatuses(cfgs), agentProfiles: getAgentProfilesMerged() });
    }
    async getAllModelsForSettings() {
        const started = Date.now();
        const autoModel = this.getAutoModelInfo();
        const provider = this.getChatProvider();
        const cacheKey = makeSettingsModelsCacheKey(provider);
        const cached = tryGetSettingsModelsFromCache(cacheKey);
        if (cached && cached.length) {
            if (isSettingsPerfEnabled()) {
                settingsPerfLog(`[settings] getAllModelsForSettings cacheHit key=${cacheKey} count=${cached.length} ${this.perfPrefix()}`);
            }
            return cached;
        }
        const cfg = this.getTrilcConfig();
        if (!cfg.baseUrl)
            return [autoModel];
        try {
            const tList = Date.now();
            const models = await this.trilcClient.listModels({ baseUrl: cfg.baseUrl });
            if (isSettingsPerfEnabled()) {
                settingsPerfLog(`[settings] getAllModelsForSettings trilc-direct listModels ${Date.now() - tList}ms count=${models.length} ${this.perfPrefix()}`);
            }
            const mapped = models.map((m) => ({
                id: m.id,
                name: m.displayName ?? m.id,
                vendor: 'trilc-direct',
                family: String(m.modelTag || 'trilc-direct'),
                version: 'n/a',
                maxInputTokens: m.maxInputTokens ?? 0
            }));
            const result = [autoModel, ...mapped];
            setSettingsModelsCache(cacheKey, result);
            if (isSettingsPerfEnabled()) {
                settingsPerfLog(`[settings] getAllModelsForSettings total ${Date.now() - started}ms ${this.perfPrefix()}`);
            }
            return result;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            void vscode.window.showWarningMessage(`无法加载 TriLC Direct 模型：${message}`);
            if (isSettingsPerfEnabled()) {
                settingsPerfLog(`[settings] getAllModelsForSettings trilc-direct err: ${message} ${this.perfPrefix()}`);
            }
            return [autoModel];
        }
    }
    getHtml(webview) {
        const nonce = getNonce();
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'settings.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'settings.js'));
        const codiconUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'node_modules', '@vscode', 'codicons', 'dist', 'codicon.css'));
        return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} https:; font-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="${codiconUri}" />
	<link rel="stylesheet" href="${styleUri}" />
	<title>Tripilot Settings</title>
</head>
<body>
	<div class="app">
		<aside class="sidebar">
			<div class="sidebarTitle">Tripilot Settings</div>
			<button class="navItem active" data-page="models">
				<span class="codicon codicon-symbol-property"></span>
				<span>Models</span>
			</button>
			<button class="navItem" data-page="agents">
				<span class="codicon codicon-organization"></span>
				<span>Agents</span>
			</button>
			<button class="navItem" data-page="customAgents">
				<span class="codicon codicon-person"></span>
				<span>Custom Agents</span>
			</button>
			<button class="navItem" data-page="tools">
				<span class="codicon codicon-tools"></span>
				<span>Tools & MCP</span>
			</button>
		</aside>
		<main class="main">
			<section class="page" data-page="models">
				<div class="header">
					<h1 class="h1">Models</h1>
				</div>
				<div class="section">
					<div class="sectionTitle">Provider Status</div>
					<div class="authBox">
				<div class="searchRow">
					<input id="search" class="search" placeholder="Add or search model" />
					<button id="refresh" class="iconButton" title="Refresh">
						<span class="codicon codicon-refresh"></span>
					</button>
				</div>
				<div id="modelList" class="list"></div>
			</section>
			<section class="page hidden" data-page="agents">
				<div class="header">
					<h1 class="h1">TriCompany Agents</h1>
				</div>
				<div class="section">
					<div class="modelMeta">
						来自 TriLC 服务端的 TriCompany 角色定义。每个 agent 包含 <code>displayName</code>、<code>decisionRights</code> 和 <code>tools</code> 信息。<br />
						点击 <b>Refresh</b> 从 TriLC 重新拉取最新列表。
					</div>
					<div style="margin-top: 10px;">
						<button id="agentsRefresh" class="iconButton" title="Refresh from TriLC">
							<span class="codicon codicon-refresh"></span>
						</button>
						<span id="agentsStatus" class="modelMeta" style="margin-left: 8px;"></span>
					</div>
					<div id="agentsList" class="list"></div>
				</div>
			</section>
			<section class="page hidden" data-page="customAgents">
				<div class="header">
					<h1 class="h1">Custom Agents</h1>
				</div>
				<div class="section">
					<div class="modelMeta">
						对齐 VS Code Copilot Chat 的 <b>Custom Agents</b>：在工作区的 <code>.github/agents</code> 目录下创建 <code>*.agent.md</code> 文件，并在 YAML frontmatter 中配置 <code>name</code>/<code>description</code>/<code>tools</code>/<code>model</code> 等字段。<br />
						Tripilot 会自动扫描 <code>.github/agents/**/*.agent.md</code>，也会兼容旧格式 <code>.github/chatmodes/**/*.chatmode.md</code>。
					</div>
					<div class="inlineForm">
						<input id="customAgentFileBase" class="text" placeholder="file base name (e.g. planner)" />
						<div></div>
						<div></div>
						<button id="customAgentCreate" class="primary">Create</button>
					</div>
					<button id="customAgentRefresh" class="iconButton" title="Refresh">
						<span class="codicon codicon-refresh"></span>
					</button>
					<div id="customAgentList" class="list"></div>
				</div>
			</section>
			<section class="page hidden" data-page="tools">
				<div class="header">
					<h1 class="h1">Tools & MCP</h1>
				</div>
				<div class="section">
					<div class="sectionTitle">Agent Profiles</div>
					<div class="modelMeta">
						profiles 是 Tripilot 扩展自定义的“模式配置”，保存在 VS Code Settings 的 <code>tripilot.agentProfiles</code>（用户级）。<br />
						常用字段：<code>enabledBuiltinTools</code> / <code>enabledCommandTools</code> / <code>enabledMcpServers</code>。<br />
						示例（写到 settings.json 里）：
						<pre><code>"tripilot.agentProfiles": [
  {
    "id": "my-agent",
    "name": "my agent",
    "enabledBuiltinTools": ["workspace_findInFiles", "editor_getSelection"],
    "enabledCommandTools": ["myTool"],
    "enabledMcpServers": ["docs"]
  }
]</code></pre>
					</div>
					<div class="profileRow">
						<select id="agentProfileSelect" class="select"></select>
						<button id="agentProfileRemove" class="ghost">Remove</button>
					</div>
					<div class="row" style="margin-top: 10px;">
						<div>
							<div class="modelName">跟随当前聊天 Profile</div>
							<div class="modelMeta">从 Chat 打开 Tools Settings / 切换 Profile 时，自动对齐到当前对话的 Profile。</div>
						</div>
						<label class="toggle" title="开启后，Settings 会自动切换到当前聊天 Profile">
							<input id="followChatProfile" type="checkbox" />
							<span class="slider"></span>
						</label>
					</div>
					<div class="row" style="margin-top: 8px;">
						<div>
							<div class="modelName">Settings 选择 Profile 同步到 Chat</div>
							<div class="modelMeta">可选：在 Settings 下拉切 Profile 时，同时切换当前聊天的 Profile（可能改变对话行为）。</div>
						</div>
						<label class="toggle" title="开启后，Settings 的 profile 下拉会同步影响当前聊天 profile">
							<input id="syncChatProfileFromSettings" type="checkbox" />
							<span class="slider"></span>
						</label>
					</div>
					<div class="row" style="margin-top: 8px;">
						<div>
							<div class="modelName">Edits Healing（保守兜底）</div>
							<div class="modelMeta">当 replace-string edits 找不到 oldString 时，允许用“最相似且唯一”的片段自动重试一次（避免 patch mismatch）。ask&study 模式始终启用。</div>
						</div>
						<label class="toggle" title="开启后，apply_patch.edits 会在 oldString 不匹配时进行一次保守重试">
							<input id="editsEnableHealing" type="checkbox" />
							<span class="slider"></span>
						</label>
					</div>
					<div class="row" style="margin-top: 8px;">
						<div>
							<div class="modelName">Edits Healing（当前 Profile）</div>
							<div class="modelMeta">可选：为当前 Profile 单独配置（优先级高于全局设置）。</div>
						</div>
						<div class="rowRight" style="gap: 8px;">
							<select id="profileEditsEnableHealingMode" class="select" title="inherit = 使用全局设置；on/off = 覆盖全局设置">
								<option value="inherit">inherit</option>
								<option value="on">on</option>
								<option value="off">off</option>
							</select>
						</div>
					</div>
					<div class="inlineForm profileAdd">
						<input id="agentProfileId" class="text" placeholder="id (e.g. my-agent)" />
						<input id="agentProfileName" class="text" placeholder="name (e.g. my agent)" />
						<div></div>
						<button id="agentProfileAdd" class="primary">Add</button>
					</div>
				</div>
				<div class="section">
					<div class="sectionTitle">Built-in Tools</div>
					<div id="builtinTools" class="list"></div>
				</div>
				<div class="section">
					<div class="sectionTitle">Extension Tools (Commands)</div>
					<div id="commandTools" class="list"></div>
					<div class="inlineForm">
						<input id="cmdToolName" class="text" placeholder="tool name (e.g. myTool)" />
						<input id="cmdToolCommand" class="text" placeholder="command id (e.g. workbench.action...)" />
						<input id="cmdToolDesc" class="text" placeholder="description (optional)" />
						<button id="cmdToolAdd" class="primary">Add</button>
					</div>
					<div class="discoverRow">
						<input id="cmdDiscoverQuery" class="search" placeholder="Search installed commands" />
						<button id="cmdDiscover" class="iconButton" title="Search">
							<span class="codicon codicon-search"></span>
						</button>
					</div>
					<div id="cmdDiscoverList" class="list"></div>
				</div>
				<div class="section">
					<div class="sectionTitle">Installed MCP Servers</div>
					<div id="mcpServers" class="list"></div>
					<div class="inlineForm">
						<input id="mcpId" class="text" placeholder="id (e.g. zapier)" />
						<input id="mcpName" class="text" placeholder="name" />
						<select id="mcpTransport" class="select">
							<option value="stdio">stdio</option>
							<option value="http">http</option>
							<option value="websocket">websocket</option>
							<option value="sse">sse</option>
						</select>
						<input id="mcpUrl" class="text" placeholder="url (http/ws)" />
						<input id="mcpCommand" class="text" placeholder="command (stdio)" />
						<input id="mcpArgs" class="text" placeholder="args (stdio, JSON array)" />
						<button id="mcpAdd" class="primary">Save</button>
					</div>
					<button id="mcpRefresh" class="iconButton" title="Refresh">
						<span class="codicon codicon-refresh"></span>
					</button>
				</div>
			</section>
		</main>
	</div>
	<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }
}
class TripilotChatViewProvider {
    context;
    static viewType = 'tripilot.chatView';
    static activeInstance;
    static setActiveInstance(instance) {
        TripilotChatViewProvider.activeInstance = instance;
    }
    static trySyncChatProfileFromSettings(agentProfileId) {
        try {
            const id = String(agentProfileId ?? '').trim();
            if (!id)
                return;
            void TripilotChatViewProvider.activeInstance?.syncAgentProfileFromSettings(id);
        }
        catch {
            // ignore
        }
    }
    view;
    editorPanel;
    webviews = new Set();
    toggleWantsChat = true;
    hostStates;
    lastModels = [];
    lastTrilcModels = [];
    lastTrilcAutoDiscount;
    trilcAutoPrefetchInFlight;
    selectedModelId;
    selectedAgentProfileId;
    enabledTools = new Set();
    mcpManager;
    extensionVersion;
    editorVersionHeader;
    trilcClient;
    triLcClient;
    tricompanyAgents = [];
    tricompanyAgentSystemPrompts = new Map();
    tricompanyAgentsFetchInFlight;
    workspaceCustomAgentsLoaded = false;
    workspaceCustomAgents = [];
    workspaceCustomAgentById = new Map();
    sessionsRefreshTimer;
    subagentTraceCache = new Map();
    pendingEditApproval;
    pendingEditReviews = new Map();
    lastEditReviewRequestIdByHost = { sidebar: undefined, editor: undefined };
    appliedEditSeq = 0;
    appliedEditsTimelineByHost = { sidebar: [], editor: [] };
    checkpointsById = new Map();
    lastCheckpointRestoreByHost = { sidebar: undefined, editor: undefined };
    constructor(context, mcpManager, extensionVersion, editorVersionHeader) {
        this.context = context;
        this.mcpManager = mcpManager;
        this.extensionVersion = String(extensionVersion || '0.0.0');
        this.editorVersionHeader = String(editorVersionHeader || `vscode/${vscode.version}`);
        this.trilcClient = new trilcClient_1.TrilcDirectClient(this.extensionVersion, this.editorVersionHeader);
        const triLcBaseUrl = vscode.workspace.getConfiguration('tripilot').get('trilcDirect.baseUrl', 'http://127.0.0.1:8711') ?? 'http://127.0.0.1:8711';
        this.triLcClient = new TriLCClient_1.TriLCClient({ baseUrl: triLcBaseUrl });
        this.selectedModelId = this.context.globalState.get('tripilot.selectedModelId')
            ?? this.context.globalState.get('tripilot.defaultModelId');
        this.selectedAgentProfileId =
            this.context.globalState.get('tripilot.selectedAgentProfileId') ?? getDefaultAgentProfileId();
        this.enabledTools = new Set(Array.from(OPTIONAL_TOOL_NAMES));
        this.hostStates = {
            sidebar: { kind: 'sidebar', conversation: [], trilcConversation: [], transcript: [], contextAttachments: [] },
            editor: { kind: 'editor', conversation: [], trilcConversation: [], transcript: [], contextAttachments: [] }
        };
        // vscode.lm currently only supports User/Assistant roles; store our system instructions as a hidden User message.
        this.ensureSystemInstructionUpToDate(this.hostStates.sidebar);
        this.ensureSystemInstructionUpToDate(this.hostStates.editor);
        this.ensureTrilcSystemInstructionUpToDate(this.hostStates.sidebar);
        this.ensureTrilcSystemInstructionUpToDate(this.hostStates.editor);
        // Keep workspace custom agents in sync with the filesystem and settings.
        try {
            const w1 = vscode.workspace.createFileSystemWatcher('**/.github/agents/**/*.agent.md');
            const w2 = vscode.workspace.createFileSystemWatcher('**/.github/chatmodes/**/*.chatmode.md');
            this.context.subscriptions.push(w1, w2);
            const refresh = () => void this.refreshWorkspaceCustomAgentsAndPost();
            w1.onDidCreate(refresh);
            w1.onDidChange(refresh);
            w1.onDidDelete(refresh);
            w2.onDidCreate(refresh);
            w2.onDidChange(refresh);
            w2.onDidDelete(refresh);
            this.context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
                if (e.affectsConfiguration('tripilot.hiddenCustomAgents') || e.affectsConfiguration('tripilot.agentProfiles')) {
                    refresh();
                }
            }));
        }
        catch {
            // ignore
        }
        // Ensure we don't leak timers on extension reload.
        this.context.subscriptions.push({
            dispose: () => {
                if (this.sessionsRefreshTimer) {
                    clearTimeout(this.sessionsRefreshTimer);
                    this.sessionsRefreshTimer = undefined;
                }
                for (const state of Object.values(this.hostStates)) {
                    if (state.replayCadenceTimer) {
                        clearInterval(state.replayCadenceTimer);
                        state.replayCadenceTimer = undefined;
                    }
                }
            }
        });
    }
    scheduleSessionsRefresh(delayMs = 250) {
        // Sessions list only exists in the sidebar webview.
        if (!this.hostStates.sidebar.webview)
            return;
        if (!this.isChatHistoryEnabled())
            return;
        if (this.sessionsRefreshTimer)
            return;
        this.sessionsRefreshTimer = setTimeout(() => {
            this.sessionsRefreshTimer = undefined;
            void this.refreshSessionsAndPost();
        }, Math.max(0, delayMs));
    }
    resetTrilcDirectCaches() {
        try {
            this.trilcClient.reset();
        }
        catch {
            // ignore
        }
        this.lastTrilcModels = [];
        this.lastTrilcAutoDiscount = undefined;
        this.trilcAutoPrefetchInFlight = undefined;
    }
    // W30 S5: TriLC daemon health check + auto-reconnect to active sessions.
    // Called on webviewReady to post status indicator and session list to UI.
    async checkTriLCStatusAndReconnect(state) {
        try {
            const online = await this.triLcClient.checkHealth(3000);
            if (!online) {
                this.postToHost(state, { type: 'triLcStatus', status: 'offline', detail: 'TriLC daemon not reachable' });
                return;
            }
            this.postToHost(state, { type: 'triLcStatus', status: 'online', detail: 'Connected to TriLC' });
            // Fetch active sessions for auto-reconnect awareness
            const sessionList = await this.triLcClient.listSessions('running', 10);
            if (sessionList.sessions && sessionList.sessions.length > 0) {
                this.postToHost(state, {
                    type: 'sessionList',
                    sessions: sessionList.sessions.map(s => ({
                        id: s.id,
                        title: s.title,
                        status: s.status,
                        progress: s.progress,
                        updatedAt: s.updatedAt,
                    })),
                });
            }
        }
        catch {
            this.postToHost(state, { type: 'triLcStatus', status: 'offline', detail: 'TriLC check failed' });
        }
    }
    buildTrilcDirectLmModels() {
        const visibleModelIds = new Set((vscode.workspace.getConfiguration('tripilot').get('visibleModelIds', []) ?? [])
            .map((s) => String(s).trim())
            .filter(Boolean));
        const autoModel = {
            id: 'auto',
            name: 'Auto',
            vendor: 'tripilot',
            family: 'auto',
            version: 'auto',
            maxInputTokens: 0
        };
        const allRealModels = this.lastTrilcModels
            .map((m) => {
            const mult = typeof m.multiplier === 'number' ? m.multiplier : undefined;
            return {
                id: m.id,
                name: m.displayName ?? m.id,
                vendor: 'copilot',
                family: 'copilot',
                version: 'n/a',
                maxInputTokens: m.maxInputTokens ?? 0,
                rightText: typeof mult === 'number' ? formatMultiplier(mult) : undefined
            };
        })
            .filter((m) => m.id !== 'auto');
        const filteredRealModels = visibleModelIds.size ? allRealModels.filter((m) => visibleModelIds.has(m.id)) : allRealModels;
        const models = [];
        // Default behavior (no whitelist): always include Auto at the top.
        // If a whitelist is configured, include Auto only when it is explicitly listed.
        if (!visibleModelIds.size || visibleModelIds.has('auto')) {
            const now = Date.now();
            const autoDiscount = this.lastTrilcAutoDiscount && this.lastTrilcAutoDiscount.expiresAtMs > now
                ? this.lastTrilcAutoDiscount.label
                : undefined;
            models.push({ ...autoModel, rightText: autoDiscount });
        }
        models.push(...filteredRealModels);
        return { models, selectedModelId: this.selectedModelId };
    }
    prefetchTrilcAutoDiscount(stateHint) {
        // Non-blocking: fetch /models/session and then re-post model list to show Auto discount.
        const now = Date.now();
        if (this.lastTrilcAutoDiscount && this.lastTrilcAutoDiscount.expiresAtMs - 30_000 > now)
            return;
        if (this.trilcAutoPrefetchInFlight)
            return;
        const state = stateHint ?? this.hostStates.sidebar;
        this.trilcAutoPrefetchInFlight = (async () => {
            try {
                await this.ensureTrilcAutoSession(state);
                const whitelistSize = (vscode.workspace.getConfiguration('tripilot').get('visibleModelIds', []) ?? [])
                    .map((s) => String(s).trim())
                    .filter(Boolean).length;
                const built = this.buildTrilcDirectLmModels();
                this.postAny({
                    type: 'lmModels',
                    models: built.models,
                    selectedModelId: built.selectedModelId,
                    provider: 'trilc-direct',
                    runtimeCount: this.lastTrilcModels.length,
                    whitelistSize,
                    filteredCount: built.models.length
                });
            }
            finally {
                this.trilcAutoPrefetchInFlight = undefined;
            }
        })();
    }
    async ensureTrilcAutoSession(state) {
        const now = Date.now();
        const cached = state.copilotAutoSession;
        if (cached && cached.expiresAtMs - 30_000 > now) {
            return cached;
        }
        let session;
        try {
            const token = await this.trilcClient.getCopilotToken();
            session = await this.trilcClient.createAutoModelsSession({
                token,
                modelHint: 'auto',
                previousSessionToken: cached?.sessionToken
            });
        }
        catch {
            session = undefined;
        }
        if (!session)
            return undefined;
        const expiresAtMs = (session.expiresAt ? session.expiresAt * 1000 : now + 5 * 60_000);
        const discountRange = computeDiscountRange(session.discountedCosts);
        state.copilotAutoSession = {
            sessionToken: session.sessionToken,
            expiresAtMs,
            selectedModel: session.selectedModel,
            discountRange
        };
        const label = formatDiscountLabel(discountRange);
        if (label) {
            this.lastTrilcAutoDiscount = { label, expiresAtMs };
        }
        else {
            this.lastTrilcAutoDiscount = undefined;
        }
        return state.copilotAutoSession;
    }
    async refreshWorkspaceCustomAgentsAndPost() {
        this.workspaceCustomAgentsLoaded = true;
        try {
            this.workspaceCustomAgents = await discoverWorkspaceCustomAgents();
            this.workspaceCustomAgentById = new Map(this.workspaceCustomAgents.map((a) => [a.id, a]));
        }
        catch {
            this.workspaceCustomAgents = [];
            this.workspaceCustomAgentById = new Map();
        }
        this.postAgentsList();
        // Settings panel may also be open; refresh it best-effort.
        TripilotSettingsPanel.refreshIfOpen();
    }
    postAgentsList() {
        const items = [];
        // TriCompany agents from TriLC (primary source)
        if (this.tricompanyAgents.length) {
            for (const a of this.tricompanyAgents) {
                const rights = a.decisionRights;
                const description = rights
                    ? [
                        rights.approve.length ? `approve: ${rights.approve.join(', ')}` : '',
                        rights.freeze.length ? `freeze: ${rights.freeze.join(', ')}` : '',
                        rights.escalate.length ? `escalate: ${rights.escalate.join(', ')}` : ''
                    ].filter(Boolean).join(' · ') || undefined
                    : undefined;
                items.push({
                    id: a.id,
                    label: a.displayName,
                    description: [a.description, description].filter(Boolean).join(' · ') || undefined
                });
            }
        }
        this.postAny({ type: 'agents', agents: items, loading: this.tricompanyAgents.length === 0 });
    }
    getWorkspaceCustomAgent(profileId) {
        return this.workspaceCustomAgentById.get(String(profileId ?? '').trim());
    }
    async fetchAgentsFromTriLC() {
        if (this.tricompanyAgentsFetchInFlight)
            return this.tricompanyAgentsFetchInFlight;
        this.tricompanyAgentsFetchInFlight = (async () => {
            try {
                const agents = await this.triLcClient.listAgents();
                if (agents.length) {
                    this.tricompanyAgents = agents;
                    // Prefetch system prompts for all agents
                    for (const a of agents) {
                        try {
                            const prompt = await this.triLcClient.getAgentSystemPrompt(a.id);
                            if (prompt)
                                this.tricompanyAgentSystemPrompts.set(a.id, prompt);
                        }
                        catch { /* best-effort */ }
                    }
                    this.ensureSystemInstructionUpToDate(this.hostStates.sidebar);
                    this.ensureSystemInstructionUpToDate(this.hostStates.editor);
                    this.ensureTrilcSystemInstructionUpToDate(this.hostStates.sidebar);
                    this.ensureTrilcSystemInstructionUpToDate(this.hostStates.editor);
                }
            }
            catch {
                // TriLC not available — keep empty list
            }
            finally {
                this.tricompanyAgentsFetchInFlight = undefined;
            }
        })();
        return this.tricompanyAgentsFetchInFlight;
    }
    getTriLCAgentSystemPrompt(agentId) {
        return this.tricompanyAgentSystemPrompts.get(String(agentId ?? '').trim());
    }
    async ensureSelectedAgentContractLoaded() {
        const profileId = String(this.selectedAgentProfileId ?? '').trim();
        if (!profileId)
            throw new Error('请先选择一个 TriLC Agent Contract。');
        if (this.getWorkspaceCustomAgent(profileId))
            return;
        if (!this.getTriLCAgentSystemPrompt(profileId))
            await this.fetchAgentsFromTriLC();
        const contractAgent = this.tricompanyAgents.find((agent) => agent.id === profileId);
        if (!contractAgent)
            throw new Error(`TriLC 未返回所选 Agent Contract：${profileId}`);
        if (!this.getTriLCAgentSystemPrompt(profileId)) {
            throw new Error(`Agent Contract 缺少 system prompt：${profileId}`);
        }
        this.ensureSystemInstructionUpToDate(this.hostStates.sidebar);
        this.ensureSystemInstructionUpToDate(this.hostStates.editor);
        this.ensureTrilcSystemInstructionUpToDate(this.hostStates.sidebar);
        this.ensureTrilcSystemInstructionUpToDate(this.hostStates.editor);
    }
    mapCustomAgentToolsToOptionalBuiltinTools(toolSpecs) {
        // If tools are not specified, behave like a general-purpose agent.
        if (!Array.isArray(toolSpecs) || toolSpecs.length === 0) {
            return new Set(Array.from(OPTIONAL_TOOL_NAMES));
        }
        const enabled = new Set();
        for (const raw of toolSpecs) {
            const t = String(raw ?? '').trim();
            if (!t)
                continue;
            if (OPTIONAL_TOOL_NAMES.has(t)) {
                enabled.add(t);
                continue;
            }
            // Minimal compatibility with VS Code Copilot custom agent tool sets.
            // Copilot-style custom agents typically specify coarse tool *sets* like: edit/search/terminal/diagnostics.
            // Tripilot only exposes the Copilot tool surface (OPTIONAL_TOOL_NAMES), so map those sets to our tool sets.
            /* v0.1: inline TOOL_SETS */
            const TOOL_SET_EDIT = ['createDirectory', 'createFile', 'editFiles', 'editNotebook', 'newJupyterNotebook'];
            const TOOL_SET_SEARCH = ['readFile', 'listDirectory', 'fileSearch', 'textSearch', 'searchResults', 'codebase', 'usages', 'changes', 'problems'];
            if (t === 'search') {
                for (const n of TOOL_SET_SEARCH)
                    enabled.add(n);
                continue;
            }
            if (t === 'edit') {
                for (const n of TOOL_SET_EDIT)
                    enabled.add(n);
                continue;
            }
            if (t === 'read') {
                for (const n of TOOL_SET_SEARCH)
                    enabled.add(n);
                continue;
            }
            if (t === 'execute') {
                for (const n of ['createAndRunTask', 'runInTerminal', 'getTerminalOutput', 'runTask', 'runTests']) {
                    enabled.add(n);
                }
                continue;
            }
            if (t === 'terminal') {
                enabled.add('runInTerminal');
                enabled.add('getTerminalOutput');
                continue;
            }
            if (t === 'diagnostics') {
                enabled.add('problems');
                continue;
            }
            // 'selection' isn't currently part of the exposed Copilot tool surface in Tripilot.
        }
        return enabled;
    }
    getEffectiveAgentProfile(profileId) {
        const contractAgent = this.tricompanyAgents.find((candidate) => candidate.id === profileId);
        if (contractAgent) {
            const contractTools = Array.isArray(contractAgent.tools?.tools)
                ? contractAgent.tools.tools.map(String)
                : [];
            return {
                id: contractAgent.id,
                name: contractAgent.displayName || contractAgent.id,
                enabledBuiltinTools: Array.from(this.mapCustomAgentToolsToOptionalBuiltinTools(contractTools)),
                enabledCommandTools: [],
                enabledMcpServers: []
            };
        }
        const agent = this.getWorkspaceCustomAgent(profileId);
        if (!agent)
            return { id: profileId, name: profileId };
        // v0.1: generic base config (no more agent-vm default)
        const base = { id: profileId, name: profileId };
        const enabledBuiltin = Array.from(this.mapCustomAgentToolsToOptionalBuiltinTools(agent.tools));
        // Command tools and MCP servers: only enable those explicitly referenced.
        const enabledCommandTools = [];
        const enabledMcpServers = [];
        if (Array.isArray(agent.tools)) {
            for (const raw of agent.tools) {
                const t = String(raw ?? '').trim();
                if (!t)
                    continue;
                if (t.endsWith('/*')) {
                    enabledMcpServers.push(t.slice(0, -2));
                    continue;
                }
                // Treat as command tool name if it matches a configured one.
                enabledCommandTools.push(t);
            }
        }
        return {
            ...base,
            id: agent.id,
            name: agent.name,
            enabledBuiltinTools: enabledBuiltin,
            enabledCommandTools: enabledCommandTools.length ? enabledCommandTools : [],
            enabledMcpServers: enabledMcpServers.length ? enabledMcpServers : []
        };
    }
    async showChatLogView(host = 'sidebar') {
        const state = this.hostStates[host];
        if (!this.isChatHistoryEnabled()) {
            const choice = await vscode.window.showInformationMessage('需要启用 Tripilot 的本地聊天历史记录，才能查看 Chat Debug View。是否现在启用？', '启用', '取消');
            if (choice !== '启用')
                return;
            await vscode.workspace
                .getConfiguration('tripilot')
                .update('chatHistory.enabled', true, vscode.ConfigurationTarget.Global);
        }
        if (!state.historySessionId) {
            vscode.window.showWarningMessage('当前没有活跃的聊天会话。请先发送一条消息，或从会话列表加载/新建会话。');
            return;
        }
        const fileUri = vscode.Uri.joinPath(this.getHistoryDirUri(), `${state.historySessionId}.jsonl`);
        try {
            const doc = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(doc, { preview: true, preserveFocus: false });
        }
        catch (err) {
            vscode.window.showErrorMessage(`打开 Chat Debug View 失败：${safeToString(err)}`);
        }
    }
    async openChatView() {
        // Only touches Tripilot's own view container.
        await this.tryExecute('workbench.view.extension.tripilot');
        await this.tryExecute('tripilot.chatView.focus');
    }
    async toggleChatFocus() {
        // Copilot-like: toggle focus between our view and the editor group.
        this.toggleWantsChat = !this.toggleWantsChat;
        if (this.toggleWantsChat) {
            await this.openChatView();
            return;
        }
        await this.tryExecute('workbench.action.focusActiveEditorGroup');
    }
    async openChatInEditorArea(sourceHost = 'sidebar') {
        if (this.editorPanel) {
            this.editorPanel.reveal(vscode.ViewColumn.Active, false);
            return;
        }
        const srcState = this.hostStates[sourceHost];
        const isFromSidebar = sourceHost === 'sidebar';
        const panel = vscode.window.createWebviewPanel('tripilot.chatEditor', 'Tripilot Chat', { viewColumn: vscode.ViewColumn.Active, preserveFocus: false }, { enableScripts: true, retainContextWhenHidden: true, localResourceRoots: [this.context.extensionUri] });
        this.editorPanel = panel;
        this.webviews.add(panel.webview);
        panel.webview.html = this.getHtml(panel.webview, 'editor');
        // Copilot-like behavior:
        // 1) If moving during generation, do NOT interrupt. Migrate the running state object to editor.
        // 2) After move, sidebar should not keep the moved chat content (it may show other sessions or stay empty).
        if (isFromSidebar && srcState.isBusy) {
            const sidebarWebview = this.hostStates.sidebar.webview;
            const running = this.hostStates.sidebar;
            const freshSidebar = {
                kind: 'sidebar',
                webview: sidebarWebview,
                conversation: [],
                trilcConversation: [],
                transcript: [],
                contextAttachments: []
            };
            this.ensureSystemInstructionUpToDate(freshSidebar);
            this.ensureTrilcSystemInstructionUpToDate(freshSidebar);
            // Migrate running host state to editor.
            running.kind = 'editor';
            running.webview = panel.webview;
            // Let the editor webview render current transcript on ready (without mutating the running state).
            running.replayOnReady = { kind: 'transcript', transcript: [...running.transcript] };
            // Best-effort: reflect current busy status in the editor immediately.
            if (running.status) {
                this.postToHost(running, { type: 'chatSetStatus', status: running.status, detail: running.statusDetail });
            }
            if (running.inProgressAssistantText) {
                this.postToHost(running, { type: 'chatAssistantStart', initialText: running.inProgressAssistantText });
            }
            this.hostStates.editor = running;
            this.hostStates.sidebar = freshSidebar;
            // Clear sidebar chat UI immediately; sessions list remains usable.
            this.postToHost(freshSidebar, { type: 'chatReset' });
            this.setAndPostStatus(freshSidebar, 'idle');
            await this.refreshSessionsAndPost();
        }
        else {
            const editorState = this.hostStates.editor;
            editorState.webview = panel.webview;
            // Align with Copilot Chat: editor chat is independent of the sidebar. We pin the current session/transcript.
            if (this.isChatHistoryEnabled() && srcState.historySessionId) {
                editorState.replayOnReady = { kind: 'session', sessionId: srcState.historySessionId };
            }
            else {
                editorState.replayOnReady = { kind: 'transcript', transcript: [...srcState.transcript] };
            }
            if (isFromSidebar) {
                srcState.conversation = [];
                srcState.transcript = [];
                srcState.contextAttachments = [];
                srcState.historySessionId = undefined;
                srcState.currentSessionTitle = undefined;
                srcState.historyStore = undefined;
                this.ensureSystemInstructionUpToDate(srcState);
                this.postToHost(srcState, { type: 'chatReset' });
                this.setAndPostStatus(srcState, 'idle');
                await this.context.globalState.update('tripilot.activeChatSessionId', undefined);
                await this.refreshSessionsAndPost();
            }
        }
        panel.onDidDispose(() => {
            this.webviews.delete(panel.webview);
            if (this.editorPanel === panel)
                this.editorPanel = undefined;
            if (this.hostStates.editor.webview === panel.webview)
                this.hostStates.editor.webview = undefined;
        });
        panel.webview.onDidReceiveMessage(async (msg) => {
            await this.handleInboundMessage(panel.webview, msg);
        });
    }
    async openChatInNewWindow() {
        // VS Code stable API does not let extensions move a webview into an auxiliary window.
        // Keep this as an explicit, safe fallback.
        const picked = await vscode.window.showInformationMessage('Tripilot：扩展 API 暂不支持像 Copilot Chat 一样把聊天移动到“新窗口”。\n\n可选：在当前窗口的编辑器区域打开（推荐）。', '在编辑器区域打开', '取消');
        if (picked === '在编辑器区域打开') {
            await this.openChatInEditorArea();
        }
    }
    async resetViewDefaults() {
        // Keep minimal for now: reset only Tripilot-local UI state.
        await this.refreshSessionsAndPost();
        vscode.window.showInformationMessage('Tripilot：已恢复默认显示（仅影响 Tripilot）。');
    }
    async openQuickChat() {
        const text = await vscode.window.showInputBox({
            prompt: 'Tripilot Quick Chat',
            placeHolder: '输入你的问题（回车发送，Esc 取消）',
            ignoreFocusOut: true
        });
        if (!text || !text.trim())
            return;
        await this.openChatView();
        await this.handleUserMessage(text, this.hostStates.sidebar);
    }
    async tryExecute(commandId, ...args) {
        try {
            await vscode.commands.executeCommand(commandId, ...args);
            return true;
        }
        catch {
            return false;
        }
    }
    isChatHistoryEnabled() {
        return Boolean(vscode.workspace.getConfiguration('tripilot').get('chatHistory.enabled', false));
    }
    isGranularExportEnabled() {
        return Boolean(vscode.workspace.getConfiguration('tripilot').get('chatHistory.exportGranularEnabled', false));
    }
    getHistoryDirUri() {
        return vscode.Uri.joinPath(this.context.globalStorageUri, 'chat-history');
    }
    async listStoredHistorySessions() {
        try {
            const dir = this.getHistoryDirUri();
            const entries = await vscode.workspace.fs.readDirectory(dir);
            const sessionIds = entries
                .filter(([name, type]) => type === vscode.FileType.File && String(name).endsWith('.jsonl'))
                .map(([name]) => String(name).replace(/\.jsonl$/i, ''))
                .filter(Boolean);
            const out = [];
            for (const sessionId of sessionIds) {
                try {
                    const fileUri = vscode.Uri.joinPath(dir, `${sessionId}.jsonl`);
                    const raw = Buffer.from(await vscode.workspace.fs.readFile(fileUri)).toString('utf8');
                    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
                    let startedAt;
                    let profileId;
                    let modelId;
                    let title;
                    let lastPreview;
                    let lastAt;
                    // First line: session_start (best-effort)
                    try {
                        const firstObj = JSON.parse(lines[0] ?? '');
                        if (firstObj && firstObj.kind === 'session_start') {
                            startedAt = firstObj.ts ? String(firstObj.ts) : undefined;
                            profileId = firstObj.profileId ? String(firstObj.profileId) : undefined;
                            modelId = firstObj.modelId ? String(firstObj.modelId) : undefined;
                        }
                    }
                    catch {
                        // ignore
                    }
                    // Title (Copilot-like): prefer AI-generated title based on prompt only.
                    // Fallback: first user message.
                    for (let i = Math.max(0, lines.length - 80); i < lines.length; i++) {
                        try {
                            const ev = JSON.parse(lines[i]);
                            if (ev && ev.kind === 'session_title') {
                                const t = String(ev.title ?? '').trim();
                                if (t) {
                                    title = t;
                                    break;
                                }
                            }
                        }
                        catch {
                            // ignore
                        }
                    }
                    if (!title) {
                        for (let i = 0; i < Math.min(lines.length, 120); i++) {
                            try {
                                const ev = JSON.parse(lines[i]);
                                if (ev && ev.kind === 'user_message') {
                                    const t = String(ev.text ?? '').trim();
                                    if (t) {
                                        title = this.heuristicSessionTitleFromPrompt(t);
                                        break;
                                    }
                                }
                            }
                            catch {
                                // ignore
                            }
                        }
                    }
                    // Last preview: scan backward for last user/assistant/tool text
                    for (let i = lines.length - 1; i >= 0 && lines.length - i <= 200; i--) {
                        try {
                            const ev = JSON.parse(lines[i]);
                            const kind = String(ev?.kind ?? '');
                            if (kind === 'user_message' || kind === 'assistant_message' || kind === 'tool_trace') {
                                const t = String(ev?.text ?? '').trim();
                                if (t) {
                                    lastPreview = t;
                                    lastAt = ev?.ts ? String(ev.ts) : undefined;
                                    break;
                                }
                            }
                            if (kind === 'error') {
                                const t = String(ev?.message ?? '').trim();
                                if (t) {
                                    lastPreview = `Error: ${t}`;
                                    lastAt = ev?.ts ? String(ev.ts) : undefined;
                                    break;
                                }
                            }
                        }
                        catch {
                            // ignore
                        }
                    }
                    const clip = (s, max = 72) => {
                        const text = String(s ?? '').replace(/\s+/g, ' ').trim();
                        if (!text)
                            return '';
                        return text.length > max ? `${text.slice(0, max)}…` : text;
                    };
                    out.push({
                        sessionId,
                        startedAt,
                        profileId,
                        modelId,
                        title: clip(title, 64) || undefined,
                        lastPreview: clip(lastPreview, 90) || undefined,
                        lastAt
                    });
                }
                catch {
                    out.push({ sessionId });
                }
            }
            const toMs = (s) => {
                const t = s ? Date.parse(s) : NaN;
                return Number.isFinite(t) ? t : 0;
            };
            // Sort by last activity time first, fallback to startedAt.
            out.sort((a, b) => (toMs(b.lastAt) || toMs(b.startedAt)) - (toMs(a.lastAt) || toMs(a.startedAt)));
            return out;
        }
        catch {
            return [];
        }
    }
    formatRelativeTime(iso) {
        const ms = iso ? Date.parse(iso) : NaN;
        if (!Number.isFinite(ms))
            return '';
        const deltaMs = Date.now() - ms;
        const sec = Math.floor(deltaMs / 1000);
        if (sec < 60)
            return '刚刚';
        const min = Math.floor(sec / 60);
        if (min < 60)
            return `${min} 分钟前`;
        const hour = Math.floor(min / 60);
        if (hour < 24)
            return `${hour} 小时前`;
        const day = Math.floor(hour / 24);
        if (day < 30)
            return `${day} 天前`;
        const month = Math.floor(day / 30);
        if (month < 12)
            return `${month} 个月前`;
        const year = Math.floor(month / 12);
        return `${year} 年前`;
    }
    async ensureHistorySessionStarted(state) {
        if (!this.isChatHistoryEnabled())
            return;
        if (state.historySessionId)
            return;
        try {
            const storageUri = this.getHistoryDirUri();
            state.historyStore = new chatHistory_1.JsonlChatHistoryStore(storageUri);
            const folder = vscode.workspace.workspaceFolders?.[0];
            state.historySessionId = await state.historyStore.startSession({
                profileId: this.selectedAgentProfileId,
                modelId: this.selectedModelId,
                workspaceFolder: folder
            });
            if (state.kind === 'sidebar' && state.historySessionId) {
                await this.context.globalState.update('tripilot.activeChatSessionId', state.historySessionId);
            }
        }
        catch {
            // Never block chat on logging.
            state.historyStore = undefined;
            state.historySessionId = undefined;
        }
    }
    resetConversationForLoadedSession(state) {
        state.conversation = [];
        state.contextAttachments = [];
        this.ensureSystemInstructionUpToDate(state);
        this.postContextChips(state);
    }
    heuristicSessionTitleFromPrompt(promptText) {
        const raw = String(promptText ?? '').trim();
        if (!raw)
            return 'Chat';
        // Remove fenced code blocks for title generation.
        const withoutFences = raw.replace(/```[\s\S]*?```/g, ' ');
        const firstLine = withoutFences
            .split(/\r?\n/)
            .map((s) => s.trim())
            .find((s) => s.length > 0);
        const line = (firstLine ?? withoutFences).replace(/\s+/g, ' ').trim();
        if (!line)
            return 'Chat';
        const max = 28; // Copilot-like: short, scannable title
        return line.length > max ? `${line.slice(0, max)}…` : line;
    }
    sanitizeAiTitle(title) {
        let t = String(title ?? '').trim();
        // Strip wrapping quotes/backticks.
        t = t.replace(/^(["'`“”‘’])+/g, '').replace(/(["'`“”‘’])+$/g, '').trim();
        // Remove trailing punctuation.
        t = t.replace(/[。.!！？…]+$/g, '').trim();
        // Collapse whitespace.
        t = t.replace(/\s+/g, ' ');
        if (!t)
            return 'Chat';
        const max = 36;
        return t.length > max ? `${t.slice(0, max)}…` : t;
    }
    async maybeGenerateAndStoreSessionTitle(state, promptText, model) {
        if (!this.isChatHistoryEnabled())
            return;
        await this.ensureHistorySessionStarted(state);
        if (!state.historySessionId)
            return;
        if (state.currentSessionTitle)
            return;
        const prompt = String(promptText ?? '').trim();
        if (!prompt)
            return;
        const fallback = this.heuristicSessionTitleFromPrompt(prompt);
        let title = fallback;
        let source = 'heuristic';
        if (model) {
            try {
                const titlePrompt = 'Generate a short chat title based ONLY on the user\'s message.\n' +
                    '- Output ONLY the title text (no quotes, no markdown, no trailing punctuation).\n' +
                    '- Keep it short and scannable (<= 8 words for English, <= 18 Chinese characters if Chinese).\n' +
                    '- Use the same language as the user.\n\n' +
                    `User message:\n${prompt}`;
                const cts = new vscode.CancellationTokenSource();
                const timeout = setTimeout(() => cts.cancel(), 1500);
                try {
                    const resp = await model.sendRequest([vscode.LanguageModelChatMessage.User(titlePrompt)], { tools: [], toolMode: vscode.LanguageModelChatToolMode.Auto }, cts.token);
                    let out = '';
                    for await (const part of resp.stream) {
                        if (part instanceof vscode.LanguageModelTextPart)
                            out += part.value;
                    }
                    const cleaned = this.sanitizeAiTitle(out);
                    if (cleaned && cleaned !== 'Chat') {
                        title = cleaned;
                        source = 'ai';
                    }
                }
                finally {
                    clearTimeout(timeout);
                    cts.dispose();
                }
            }
            catch {
                // fallback
            }
        }
        state.currentSessionTitle = title;
        await this.appendHistory(state, {
            kind: 'session_title',
            title,
            source,
            profileId: this.selectedAgentProfileId,
            modelId: this.selectedModelId
        });
    }
    async loadSessionIntoHost(sessionId, state) {
        const sid = String(sessionId || '').trim();
        if (!sid)
            return;
        if (!this.isChatHistoryEnabled())
            return;
        const dir = this.getHistoryDirUri();
        const fileUri = vscode.Uri.joinPath(dir, `${sid}.jsonl`);
        const raw = Buffer.from(await vscode.workspace.fs.readFile(fileUri)).toString('utf8');
        const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
        state.historyStore = new chatHistory_1.JsonlChatHistoryStore(dir);
        await state.historyStore.resumeSession(sid);
        state.historySessionId = sid;
        state.currentSessionTitle = undefined;
        this.resetConversationForLoadedSession(state);
        if (state.kind === 'sidebar') {
            await this.context.globalState.update('tripilot.activeChatSessionId', sid);
        }
        this.postToHost(state, { type: 'chatReset' });
        state.transcript = [];
        for (const line of lines) {
            try {
                const ev = JSON.parse(line);
                if (!ev || typeof ev !== 'object')
                    continue;
                const kind = String(ev.kind ?? '');
                if (kind === 'session_title') {
                    const t = String(ev.title ?? '').trim();
                    if (t)
                        state.currentSessionTitle = t;
                    continue;
                }
                if (kind === 'user_message') {
                    const text = String(ev.text ?? '');
                    this.postToHost(state, { type: 'chatAppend', role: 'user', text });
                    state.transcript.push({ role: 'user', text });
                    state.conversation.push(vscode.LanguageModelChatMessage.User(text));
                }
                else if (kind === 'assistant_message') {
                    const text = String(ev.text ?? '');
                    this.postToHost(state, { type: 'chatAppend', role: 'assistant', text });
                    state.transcript.push({ role: 'assistant', text });
                    state.conversation.push(vscode.LanguageModelChatMessage.Assistant(text));
                    this.appendCheckpoint(state);
                }
                else if (kind === 'tool_trace') {
                    const text = String(ev.text ?? '');
                    this.postToHost(state, { type: 'chatAppend', role: 'tool', text });
                    state.transcript.push({ role: 'tool', text });
                }
                else if (kind === 'approval_request') {
                    const reqId = String(ev.requestId ?? '');
                    const summary = ev.summary ? `${ev.summary.editCount ?? 0} edits / ${ev.summary.fileCount ?? 0} files` : '';
                    const text = `Approval requested ${reqId}${summary ? ` (${summary})` : ''}`;
                    this.postToHost(state, { type: 'chatAppend', role: 'tool', text });
                    state.transcript.push({ role: 'tool', text });
                }
                else if (kind === 'approval_decision') {
                    const text = `Approval decision ${String(ev.requestId ?? '')}: ${String(ev.decision ?? '')}`;
                    this.postToHost(state, {
                        type: 'chatAppend',
                        role: 'tool',
                        text
                    });
                    state.transcript.push({ role: 'tool', text });
                }
                else if (kind === 'error') {
                    const text = `Error: ${String(ev.message ?? '')}`;
                    this.postToHost(state, { type: 'chatAppend', role: 'assistant', text });
                    state.transcript.push({ role: 'assistant', text });
                    this.appendCheckpoint(state);
                }
            }
            catch {
                // ignore malformed line
            }
        }
    }
    async startNewChatSessionInteractive(host = 'sidebar') {
        const state = this.hostStates[host];
        if (!this.isChatHistoryEnabled()) {
            vscode.window.showWarningMessage('Tripilot: Chat History 未启用（tripilot.chatHistory.enabled=false）。');
            return;
        }
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder) {
            vscode.window.showWarningMessage('Tripilot: 请先打开一个工作区文件夹再创建会话。');
            return;
        }
        try {
            state.historyStore = new chatHistory_1.JsonlChatHistoryStore(this.getHistoryDirUri());
            state.historySessionId = await state.historyStore.startSession({
                profileId: this.selectedAgentProfileId,
                modelId: this.selectedModelId,
                workspaceFolder: folder
            });
            state.currentSessionTitle = undefined;
            if (state.kind === 'sidebar') {
                await this.context.globalState.update('tripilot.activeChatSessionId', state.historySessionId);
            }
            this.resetConversationForLoadedSession(state);
            state.transcript = [];
            this.postToHost(state, { type: 'chatReset' });
        }
        catch (e) {
            vscode.window.showErrorMessage(`Tripilot: 创建会话失败：${String(e?.message ?? e)}`);
        }
    }
    async selectAndLoadChatSessionInteractive() {
        const state = this.hostStates.sidebar;
        if (!this.isChatHistoryEnabled()) {
            vscode.window.showWarningMessage('Tripilot: Chat History 未启用（tripilot.chatHistory.enabled=false）。');
            return;
        }
        const sessions = await this.listStoredHistorySessions();
        if (!sessions.length) {
            vscode.window.showInformationMessage('Tripilot: 没有找到已保存的会话。');
            return;
        }
        const active = state.historySessionId;
        const items = sessions
            .map((s) => {
            const title = s.title || '(无标题)';
            const rel = this.formatRelativeTime(s.lastAt || s.startedAt);
            const descParts = [rel, s.profileId, s.modelId].filter(Boolean);
            const label = s.sessionId === active ? `${title} (current)` : title;
            return {
                label,
                description: descParts.length ? descParts.join(' · ') : undefined,
                detail: s.lastPreview ? s.lastPreview : s.sessionId,
                picked: s.sessionId === active,
                _sessionId: s.sessionId
            };
        })
            // pin current session first
            .sort((a, b) => Number(Boolean(b.picked)) - Number(Boolean(a.picked)));
        const picked = await vscode.window.showQuickPick(items, {
            title: 'Tripilot: 选择会话',
            placeHolder: '选择要加载的聊天会话（标题取第一条用户消息）',
            matchOnDescription: true,
            matchOnDetail: true
        });
        if (!picked?._sessionId)
            return;
        try {
            await this.loadSessionIntoHost(picked._sessionId, state);
            vscode.window.showInformationMessage('Tripilot: 已加载会话。');
        }
        catch (e) {
            vscode.window.showErrorMessage(`Tripilot: 加载会话失败：${String(e?.message ?? e)}`);
        }
    }
    async exportChatHistoryInteractive() {
        const state = this.hostStates.sidebar;
        if (!this.isChatHistoryEnabled()) {
            vscode.window.showWarningMessage('Tripilot: Chat History 未启用（tripilot.chatHistory.enabled=false）。');
            return;
        }
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder) {
            vscode.window.showWarningMessage('Tripilot: 请先打开一个工作区文件夹再导出聊天记录。');
            return;
        }
        const sessions = await this.listStoredHistorySessions();
        if (!sessions.length) {
            vscode.window.showInformationMessage('Tripilot: 没有找到可导出的会话。');
            return;
        }
        const active = state.historySessionId;
        const items = sessions
            .map((s) => {
            const title = s.title || '(无标题)';
            const rel = this.formatRelativeTime(s.lastAt || s.startedAt);
            const descParts = [rel, s.profileId, s.modelId].filter(Boolean);
            const label = s.sessionId === active ? `${title} (current)` : title;
            return { label, description: descParts.length ? descParts.join(' · ') : undefined, detail: s.lastPreview || s.sessionId, _sessionId: s.sessionId };
        })
            .sort((a, b) => Number(b._sessionId === active) - Number(a._sessionId === active));
        const picked = await vscode.window.showQuickPick(items, {
            title: 'Tripilot: 导出聊天记录',
            placeHolder: '选择要导出的会话',
            matchOnDescription: true,
            matchOnDetail: true
        });
        if (!picked?._sessionId)
            return;
        const sessionId = picked._sessionId;
        const exportsDir = vscode.Uri.joinPath(folder.uri, '.tripilot', 'exports');
        await vscode.workspace.fs.createDirectory(exportsDir);
        const srcUri = vscode.Uri.joinPath(this.getHistoryDirUri(), `${sessionId}.jsonl`);
        if (!this.isGranularExportEnabled()) {
            const destUri = vscode.Uri.joinPath(exportsDir, `tripilot-${sessionId}.jsonl`);
            const bytes = await vscode.workspace.fs.readFile(srcUri);
            await vscode.workspace.fs.writeFile(destUri, bytes);
            vscode.window.showInformationMessage(`Tripilot: 已导出聊天记录到 ${destUri.fsPath}`);
            return;
        }
        const mode = await vscode.window.showQuickPick([
            { label: '导出全部', detail: 'full' },
            { label: '选择条目…', detail: 'select' }
        ], { title: 'Tripilot: 导出方式' });
        if (!mode?.detail)
            return;
        if (mode.detail === 'full') {
            const destUri = vscode.Uri.joinPath(exportsDir, `tripilot-${sessionId}.jsonl`);
            const bytes = await vscode.workspace.fs.readFile(srcUri);
            await vscode.workspace.fs.writeFile(destUri, bytes);
            vscode.window.showInformationMessage(`Tripilot: 已导出聊天记录到 ${destUri.fsPath}`);
            return;
        }
        const bytes = await vscode.workspace.fs.readFile(srcUri);
        const raw = Buffer.from(bytes).toString('utf8');
        const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const parsed = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            try {
                const ev = JSON.parse(line);
                const kind = String(ev?.kind ?? '');
                const ts = String(ev?.ts ?? '');
                const preview = (kind === 'user_message' || kind === 'assistant_message' || kind === 'tool_trace')
                    ? String(ev?.text ?? '')
                    : kind === 'error'
                        ? String(ev?.message ?? '')
                        : kind === 'approval_request'
                            ? `approval_request ${String(ev?.requestId ?? '')}`
                            : kind === 'approval_decision'
                                ? `approval_decision ${String(ev?.requestId ?? '')} ${String(ev?.decision ?? '')}`
                                : kind;
                parsed.push({ idx: i, line, kind, ts, preview });
            }
            catch {
                // skip
            }
        }
        const pickItems = parsed.map((p) => ({
            label: `${p.idx + 1}. ${p.kind}${p.ts ? ` · ${p.ts.replace('T', ' ').replace('Z', '')}` : ''}`,
            description: p.preview.length > 80 ? `${p.preview.slice(0, 80)}…` : p.preview,
            detail: String(p.idx)
        }));
        const pickedItems = await vscode.window.showQuickPick(pickItems, {
            title: 'Tripilot: 选择要导出的条目',
            canPickMany: true,
            placeHolder: '可多选（搜索过滤后勾选）'
        });
        if (!pickedItems?.length)
            return;
        const selectedIdx = new Set(pickedItems.map((p) => Number(p.detail)).filter((n) => Number.isFinite(n)));
        const selectedLines = [];
        for (let i = 0; i < lines.length; i++) {
            if (selectedIdx.has(i))
                selectedLines.push(lines[i]);
        }
        const destUri = vscode.Uri.joinPath(exportsDir, `tripilot-${sessionId}-partial.jsonl`);
        await vscode.workspace.fs.writeFile(destUri, Buffer.from(selectedLines.join('\n') + '\n', 'utf8'));
        vscode.window.showInformationMessage(`Tripilot: 已导出选中条目到 ${destUri.fsPath}`);
    }
    async exportSingleSessionInteractive(sessionId, selectEntries) {
        if (!this.isChatHistoryEnabled()) {
            vscode.window.showWarningMessage('Tripilot: Chat History 未启用（tripilot.chatHistory.enabled=false）。');
            return;
        }
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder) {
            vscode.window.showWarningMessage('Tripilot: 请先打开一个工作区文件夹再导出聊天记录。');
            return;
        }
        const exportsDir = vscode.Uri.joinPath(folder.uri, '.tripilot', 'exports');
        await vscode.workspace.fs.createDirectory(exportsDir);
        const srcUri = vscode.Uri.joinPath(this.getHistoryDirUri(), `${sessionId}.jsonl`);
        if (!selectEntries || !this.isGranularExportEnabled()) {
            const destUri = vscode.Uri.joinPath(exportsDir, `tripilot-${sessionId}.jsonl`);
            const bytes = await vscode.workspace.fs.readFile(srcUri);
            await vscode.workspace.fs.writeFile(destUri, bytes);
            vscode.window.showInformationMessage(`Tripilot: 已导出聊天记录到 ${destUri.fsPath}`);
            return;
        }
        const bytes = await vscode.workspace.fs.readFile(srcUri);
        const raw = Buffer.from(bytes).toString('utf8');
        const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const parsed = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            try {
                const ev = JSON.parse(line);
                const kind = String(ev?.kind ?? '');
                const ts = String(ev?.ts ?? '');
                const preview = kind === 'user_message' || kind === 'assistant_message' || kind === 'tool_trace'
                    ? String(ev?.text ?? '')
                    : kind === 'error'
                        ? String(ev?.message ?? '')
                        : kind === 'approval_request'
                            ? `approval_request ${String(ev?.requestId ?? '')}`
                            : kind === 'approval_decision'
                                ? `approval_decision ${String(ev?.requestId ?? '')} ${String(ev?.decision ?? '')}`
                                : kind;
                parsed.push({ idx: i, line, kind, ts, preview });
            }
            catch {
                // skip
            }
        }
        const pickItems = parsed.map((p) => ({
            label: `${p.idx + 1}. ${p.kind}${p.ts ? ` · ${p.ts.replace('T', ' ').replace('Z', '')}` : ''}`,
            description: p.preview.length > 80 ? `${p.preview.slice(0, 80)}…` : p.preview,
            detail: String(p.idx)
        }));
        const pickedItems = await vscode.window.showQuickPick(pickItems, {
            title: 'Tripilot: 选择要导出的条目',
            canPickMany: true,
            placeHolder: '可多选（搜索过滤后勾选）'
        });
        if (!pickedItems?.length)
            return;
        const selectedIdx = new Set(pickedItems.map((p) => Number(p.detail)).filter((n) => Number.isFinite(n)));
        const selectedLines = [];
        for (let i = 0; i < lines.length; i++) {
            if (selectedIdx.has(i))
                selectedLines.push(lines[i]);
        }
        const destUri = vscode.Uri.joinPath(exportsDir, `tripilot-${sessionId}-partial.jsonl`);
        await vscode.workspace.fs.writeFile(destUri, Buffer.from(selectedLines.join('\n') + '\n', 'utf8'));
        vscode.window.showInformationMessage(`Tripilot: 已导出选中条目到 ${destUri.fsPath}`);
    }
    async appendHistory(state, event) {
        if (!this.isChatHistoryEnabled())
            return;
        await this.ensureHistorySessionStarted(state);
        if (!state.historyStore || !state.historySessionId)
            return;
        try {
            await state.historyStore.append({
                ...event,
                ts: new Date().toISOString(),
                sessionId: state.historySessionId
            });
            // Copilot-like: keep session list previews/titles fresh without requiring manual refresh.
            this.scheduleSessionsRefresh();
        }
        catch {
            // ignore
        }
    }
    getChatProvider() {
        return 'trilc-direct';
    }
    // W30: apiKey removed — TriPilot holds zero API keys (CPO Q2 ruling).
    getTrilcConfig() {
        const cfg = vscode.workspace.getConfiguration('tripilot');
        const baseUrl = String(cfg.get('trilcDirect.baseUrl', 'http://127.0.0.1:8711') ?? '').trim();
        return {
            baseUrl,
        };
    }
    getTrilcAuthMode() {
        const raw = String(vscode.workspace.getConfiguration('tripilot').get('trilcDirect.authMode', 'minimal') ?? 'minimal');
        return raw === 'permissive' ? 'permissive' : 'minimal';
    }
    ensureTrilcSystemInstructionUpToDate(state) {
        const instruction = this.buildSystemInstructionForProfile(this.selectedAgentProfileId);
        state.trilcSystemInstruction = instruction;
        const msg = { role: 'system', content: instruction };
        if (!state.trilcConversation)
            state.trilcConversation = [];
        if (!state.trilcConversation.length) {
            state.trilcConversation.push(msg);
        }
        else {
            state.trilcConversation[0] = msg;
        }
        state.trilcInteractionId ??= createUuid();
    }
    ensureSystemInstructionUpToDate(state) {
        const instruction = this.buildSystemInstructionForProfile(this.selectedAgentProfileId);
        const msg = vscode.LanguageModelChatMessage.User(instruction);
        if (!state.conversation.length) {
            state.conversation.push(msg);
            return;
        }
        // Always keep the instruction message as the first conversation item.
        state.conversation[0] = msg;
    }
    buildSystemInstructionForProfile(profileId) {
        const custom = this.getWorkspaceCustomAgent(profileId);
        // TriLC Contract prompt is authoritative for TriCompany agents.
        const triLcPrompt = this.getTriLCAgentSystemPrompt(profileId);
        if (triLcPrompt)
            return triLcPrompt;
        // Host-neutral fallback for workspace custom agents only. Tripilot owns no persona.
        const base = [
            '(Tripilot Runtime)',
            'Follow the selected agent instructions. Tripilot is only the UI and transport host, not an agent persona.',
            'You are tool-aware and may call enabled tools to search/read/edit/create/run as needed to accomplish the user\'s request.',
            'In agent-style workflows, autonomously decide when to call tools.',
            'When the user asks to create or modify files, use createFile/editFiles (with approval) instead of asking the user to manually copy/paste or apply patches.',
            'For normal edits, apply edits via tools and rely on the pending edits review (Keep/Undo).',
            'Only ask clarifying questions when the missing information is truly required to proceed safely.'
        ];
        if (custom) {
            const body = String(custom.body ?? '').trim();
            // Keep it bounded to avoid exploding prompt size.
            const bounded = body.length > 8000 ? body.slice(0, 8000) + '\n\n(…truncated)' : body;
            return [
                ...base,
                '',
                `(custom agent: ${custom.name})`,
                custom.description ? `Description: ${custom.description}` : undefined,
                'This agent is defined by a workspace .agent.md file. The agent instructions below are prepended to the user prompt.',
                custom.tools?.length ? `Tools (frontmatter.tools): ${custom.tools.join(', ')}` : 'Tools (frontmatter.tools): (default)',
                '',
                '(Custom Agent Instructions)',
                bounded
            ]
                .filter((x) => typeof x === 'string' && x.length > 0)
                .join('\n');
        }
        /* v0.1 removed: mode-specific system prompts (ask-study/edit-test/agent-vm/agent-deploy) */
        // TriLC agents provide their own system prompts.
        return base.join('\n');
    }
    async refreshToolsAndPost() {
        // Placeholder: chat UI tool menu is still local; MCP/tool injection is handled in the tool loop.
        // We keep this hook so Settings changes can trigger a refresh later.
        return;
    }
    getAskStudySandboxRelFromConfig() {
        const raw = vscode.workspace.getConfiguration('tripilot').get('askStudySandboxDir', '.tripilot/ask-study') ??
            '.tripilot/ask-study';
        const normalized = path.posix
            .normalize(String(raw).replace(/\\/g, '/'))
            .replace(/^\/+/, '')
            .trim();
        if (!normalized)
            return '.tripilot/ask-study';
        // Prevent path traversal.
        if (normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
            throw new Error(`Invalid tripilot.askStudySandboxDir: ${raw}`);
        }
        return normalized;
    }
    async ensureAskStudySandboxInitializedIfPossible() {
        /* v0.1: ask-study mode removed — no-op */
        return;
    }
    async ensureAskStudyReadmeInitialized(dirUri) {
        const readmeUri = vscode.Uri.joinPath(dirUri, 'README.md');
        try {
            await vscode.workspace.fs.stat(readmeUri);
            return; // don't overwrite user edits
        }
        catch {
            // continue
        }
        const readme = `# Tripilot · ask&study 沙盒\n\n该目录用于保存学习资料和需求记录。Tripilot 只提供界面与传输能力，实际角色身份、行为和工具配置由当前选中的 Agent Contract 决定。\n\n当问题逐渐清晰时，可以对当前 Agent 说“请帮我记录到需求”，由 Agent 生成或更新 \`requirements.md\`。\n`;
        await vscode.workspace.fs.writeFile(readmeUri, Buffer.from(readme, 'utf8'));
    }
    async ensureAskStudyRequirementsInitialized(dirUri) {
        const reqUri = vscode.Uri.joinPath(dirUri, 'requirements.md');
        try {
            await vscode.workspace.fs.stat(reqUri);
            // If file exists, ensure it has frontmatter with version, but do not rewrite the body.
            const raw = Buffer.from(await vscode.workspace.fs.readFile(reqUri)).toString('utf8');
            const ensured = ensureFrontmatterHasVersion(raw, '1.0.0');
            if (ensured !== raw) {
                await vscode.workspace.fs.writeFile(reqUri, Buffer.from(ensured, 'utf8'));
            }
            return;
        }
        catch {
            // continue
        }
        const initial = `---\nversion: 1.0.0\n---\n\n# 需求（ask&study）\n\n在 Tripilot Chat 里对我说：\n> “请帮我记录到需求”\n\n我会把本次对话中逐步明确的内容，整理到这个文件里。\n`;
        await vscode.workspace.fs.writeFile(reqUri, Buffer.from(initial, 'utf8'));
    }
    postAgentProfileAndLabel() {
        const profile = this.getEffectiveAgentProfile(this.selectedAgentProfileId);
        const enabledBuiltin = Array.isArray(profile.enabledBuiltinTools) && profile.enabledBuiltinTools.length > 0
            ? new Set(profile.enabledBuiltinTools.map((s) => String(s).trim()).filter(Boolean))
            : this.getEnabledBuiltinToolNamesFromConfig();
        const allowedOptionalTools = Array.from(OPTIONAL_TOOL_NAMES);
        const enabledOptionalTools = Array.from(OPTIONAL_TOOL_NAMES).filter((t) => enabledBuiltin.has(t));
        this.postAny({
            type: 'agentProfile',
            id: this.selectedAgentProfileId,
            label: profile?.name ?? this.selectedAgentProfileId,
            allowedOptionalTools,
            enabledOptionalTools
        });
    }
    getEnabledBuiltinToolNamesFromConfig() {
        // Important: do NOT pass a defaultValue here.
        // VS Code configuration already has extension-contributed defaults; passing a defaultValue
        // can mask those defaults and accidentally return an empty list, which disables all tools.
        const raw = vscode.workspace.getConfiguration('tripilot').get('enabledBuiltinTools');
        const arr = Array.isArray(raw) ? raw : [];
        const normalized = arr.map((s) => String(s).trim()).filter(Boolean);
        // Defensive fallback: if configuration is missing/empty, use the curated Copilot-like surface.
        return new Set(normalized.length ? normalized : Array.from(OPTIONAL_TOOL_NAMES));
    }
    getCommandToolConfigsFromConfig() {
        const raw = vscode.workspace.getConfiguration('tripilot').get('commandTools', []) ?? [];
        return raw
            .map((t) => ({
            name: String(t?.name ?? '').trim(),
            command: String(t?.command ?? '').trim(),
            description: t?.description ? String(t.description) : undefined,
            enabled: Boolean(t?.enabled)
        }))
            .filter((t) => t.name && t.command);
    }
    getMcpServerConfigsFromConfig() {
        const raw = vscode.workspace.getConfiguration('tripilot').get('mcpServers', []) ?? [];
        return raw
            .map((s) => ({
            id: String(s?.id ?? '').trim(),
            name: String(s?.name ?? '').trim(),
            enabled: Boolean(s?.enabled),
            transport: String(s?.transport ?? 'stdio'),
            command: s?.command ? String(s.command) : undefined,
            args: Array.isArray(s?.args) ? s.args.map(String) : undefined,
            cwd: s?.cwd ? String(s.cwd) : undefined,
            env: s?.env && typeof s.env === 'object' ? s.env : undefined,
            url: s?.url ? String(s.url) : undefined
        }))
            .filter((s) => s.id && s.name);
    }
    parseToolDirectives(text) {
        const toolReferences = new Set();
        const serverReferences = new Set();
        const re = /(^|\s)([#@])([A-Za-z0-9_.\-\/]+)/g;
        for (const match of text.matchAll(re)) {
            const sigil = match[2];
            const value = match[3];
            if (!value)
                continue;
            // Do not treat prompt syntax markers as tool directives.
            // Example: "#tool:readFile" should NOT force tool "tool".
            try {
                const endIndex = (match.index ?? -1) + match[0].length;
                const nextChar = endIndex >= 0 && endIndex < text.length ? text[endIndex] : '';
                if (sigil === '#' && (value === 'file' || value === 'tool') && nextChar === ':') {
                    continue;
                }
            }
            catch {
                // ignore
            }
            if (sigil === '#') {
                toolReferences.add(value);
                // Allow #server.tool to imply enabling that MCP server.
                const dot = value.indexOf('.');
                if (dot > 0) {
                    serverReferences.add(value.slice(0, dot));
                }
            }
            else
                serverReferences.add(value);
        }
        return { toolReferences, serverReferences };
    }
    computeEnabledMcpServerIds(profile, 
    /* v0.1 removed: isAskStudy param */
    mcpConfigs, serverReferences) {
        const mcpEnabledSetRaw = profile.enabledMcpServers
            ? new Set(profile.enabledMcpServers.map((s) => String(s).trim()).filter(Boolean))
            : new Set(mcpConfigs.filter((s) => s.enabled).map((s) => s.id));
        const mcpEnabledSet = mcpEnabledSetRaw;
        const enabledServerIds = new Set(mcpEnabledSet);
        for (const id of serverReferences)
            enabledServerIds.add(id);
        return enabledServerIds;
    }
    enableReferencedTools(enabledTools, toolDefinitions, toolReferences) {
        if (!toolReferences.size)
            return;
        const normalizeRef = (rawName) => {
            const name = String(rawName ?? '').trim();
            if (!name)
                return '';
            // Back-compat for older prompts/docs that reference internal snake_case tool names.
            const map = {
                // read
                read_file: 'readFile',
                get_errors: 'problems',
                terminal_last_command: 'terminalLastCommand',
                terminal_selection: 'terminalSelection',
                copilot_getNotebookSummary: 'getNotebookSummary',
                read_notebook_cell_output: 'readNotebookCellOutput',
                get_task_output: 'getTaskOutput',
                // search
                file_search: 'fileSearch',
                grep_search: 'textSearch',
                list_dir: 'listDirectory',
                get_search_view_results: 'searchResults',
                semantic_search: 'codebase',
                list_code_usages: 'usages',
                get_changed_files: 'changes',
                // edit
                create_directory: 'createDirectory',
                create_file: 'createFile',
                apply_patch: 'editFiles',
                edit_files: 'editFiles',
                edit_notebook_file: 'editNotebook',
                create_new_jupyter_notebook: 'newJupyterNotebook',
                // execute
                run_in_terminal: 'runInTerminal',
                get_terminal_output: 'getTerminalOutput',
                create_and_run_task: 'createAndRunTask',
                run_task: 'runTask',
                run_tests: 'runTests',
                test_failure: 'testFailure',
                run_notebook_cell: 'runNotebookCell',
                // vscode
                install_extension: 'installExtension',
                open_simple_browser: 'openSimpleBrowser',
                run_vscode_command: 'runCommand',
                create_new_workspace: 'newWorkspace',
                get_project_setup_info: 'getProjectSetupInfo',
                get_vscode_api: 'vscodeAPI',
                // web
                fetch_webpage: 'fetch',
                github_repo: 'githubRepo'
            };
            return map[name] ?? name;
        };
        const definedNames = new Set();
        for (const d of toolDefinitions ?? []) {
            try {
                const name = String(d?.function?.name ?? '').trim();
                if (name)
                    definedNames.add(name);
            }
            catch {
                // ignore
            }
        }
        for (const ref of toolReferences) {
            const name = normalizeRef(ref);
            if (!name)
                continue;
            // Expand tool sets (e.g. #edit / #search) into underlying tool names.
            /* v0.1: inline TOOL_SETS */
            const TOOL_SET_MAP = {
                edit: ['createDirectory', 'createFile', 'editFiles', 'editNotebook', 'newJupyterNotebook'],
                search: ['readFile', 'listDirectory', 'fileSearch', 'textSearch', 'searchResults', 'codebase', 'usages', 'changes', 'problems']
            };
            if (!definedNames.has(name) && name in TOOL_SET_MAP) {
                for (const t of TOOL_SET_MAP[name]) {
                    if (definedNames.has(t))
                        enabledTools.add(t);
                }
                continue;
            }
            if (definedNames.has(name))
                enabledTools.add(name);
        }
    }
    async buildToolsForRequest(profileId, serverReferences, toolReferences) {
        const profile = this.getEffectiveAgentProfile(profileId);
        /* v0.1 removed: isAskStudy */
        const effectiveServerRefs = serverReferences;
        const effectiveToolRefs = toolReferences;
        const builtinDefs = getToolDefinitions();
        // Treat an empty enabledBuiltinTools array as "use defaults".
        // This prevents accidentally disabling all built-in tools (including write tools) for a profile.
        const builtinEnabled = Array.isArray(profile.enabledBuiltinTools) && profile.enabledBuiltinTools.length > 0
            ? new Set(profile.enabledBuiltinTools.map((s) => String(s).trim()).filter(Boolean))
            : this.getEnabledBuiltinToolNamesFromConfig();
        const cmdConfigs = this.getCommandToolConfigsFromConfig();
        const cmdEnabledSetRaw = profile.enabledCommandTools
            ? new Set(profile.enabledCommandTools.map((s) => String(s).trim()).filter(Boolean))
            : new Set(cmdConfigs.filter((t) => t.enabled).map((t) => t.name));
        const cmdEnabledSet = cmdEnabledSetRaw;
        const cmdIncluded = cmdConfigs.filter((t) => cmdEnabledSet.has(t.name) ||
            effectiveToolRefs.has(t.name));
        const cmdMap = new Map();
        for (const t of cmdConfigs)
            cmdMap.set(t.name, t);
        const cmdDefs = cmdIncluded.map((t) => ({
            type: 'function',
            function: {
                name: t.name,
                description: t.description
                    ? `Command tool: ${t.command}. ${t.description}`
                    : `Command tool: ${t.command}.`,
                parameters: {
                    type: 'object',
                    properties: {
                        args: { type: 'array', items: {}, description: 'Arguments array passed to VS Code command.' }
                    }
                }
            }
        }));
        const mcpConfigs = this.getMcpServerConfigsFromConfig();
        const enabledServerIds = this.computeEnabledMcpServerIds(profile, mcpConfigs, effectiveServerRefs);
        const effectiveMcpConfigs = mcpConfigs.map((s) => ({ ...s, enabled: enabledServerIds.has(s.id) }));
        await this.mcpManager.refresh(effectiveMcpConfigs);
        // Best-effort connect (bounded) so tools become callable quickly.
        const timeoutMs = 2500;
        for (const id of enabledServerIds) {
            await Promise.race([
                this.mcpManager.ensureConnected(id),
                new Promise((resolve) => setTimeout(resolve, timeoutMs))
            ]);
        }
        const mcpTools = this.mcpManager.getToolsForEnabledServers(enabledServerIds);
        const mcpDefs = mcpTools.map((t) => ({
            type: 'function',
            function: {
                name: t.lmToolName,
                description: t.description
                    ? `MCP(${t.serverName}/${t.serverId}): ${t.toolName}. ${t.description}`
                    : `MCP(${t.serverName}/${t.serverId}): ${t.toolName}.`,
                parameters: t.inputSchema ?? { type: 'object', properties: {} }
            }
        }));
        // Optional alias definitions: allow #server.tool to reference an MCP tool without exposing internal lmToolName.
        // We keep aliases disabled by default (only enabled when user explicitly forces them via #...).
        const isSafe = (s) => /^[A-Za-z0-9_.\-\/]+$/.test(String(s));
        const mcpAliasDefs = [];
        for (const t of mcpTools) {
            if (!isSafe(t.serverId) || !isSafe(t.toolName))
                continue;
            const aliasName = `${t.serverId}.${t.toolName}`;
            mcpAliasDefs.push({
                type: 'function',
                function: {
                    name: aliasName,
                    description: t.description
                        ? `MCP alias for ${t.serverName}/${t.serverId}: ${t.toolName}. ${t.description}`
                        : `MCP alias for ${t.serverName}/${t.serverId}: ${t.toolName}.`,
                    parameters: t.inputSchema ?? { type: 'object', properties: {} }
                }
            });
        }
        const toolDefinitions = [...builtinDefs, ...cmdDefs, ...mcpDefs, ...mcpAliasDefs];
        const enabledTools = new Set();
        for (const t of builtinDefs) {
            if (builtinEnabled.has(t.function.name))
                enabledTools.add(t.function.name);
        }
        for (const t of cmdIncluded)
            enabledTools.add(t.name);
        for (const t of mcpDefs)
            enabledTools.add(String(t.function.name));
        // Only enable explicitly referenced tools if they exist in toolDefinitions.
        this.enableReferencedTools(enabledTools, toolDefinitions, effectiveToolRefs);
        return { toolDefinitions: toolDefinitions, enabledTools, commandTools: cmdMap };
    }
    resolveWebviewView(webviewView) {
        this.view = webviewView;
        // Ensure the view header title is stable and not derived from extension display name.
        webviewView.title = 'Chat';
        this.hostStates.sidebar.webview = webviewView.webview;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };
        webviewView.webview.html = this.getHtml(webviewView.webview, 'sidebar');
        this.webviews.add(webviewView.webview);
        try {
            webviewView.onDidDispose(() => {
                this.webviews.delete(webviewView.webview);
                if (this.hostStates.sidebar.webview === webviewView.webview)
                    this.hostStates.sidebar.webview = undefined;
            });
        }
        catch {
            // ignore
        }
        webviewView.webview.onDidReceiveMessage(async (msg) => {
            await this.handleInboundMessage(webviewView.webview, msg);
        });
    }
    async handleInboundMessage(webview, msg) {
        const host = this.hostStates.editor.webview === webview ? 'editor' : 'sidebar';
        const state = this.hostStates[host];
        switch (msg.type) {
            case 'webviewReady':
                // Init is per-webview; global state (models/profile) is broadcast.
                void webview.postMessage({ type: 'init', extensionName: '' });
                void webview.postMessage({ type: 'host', host });
                state.contextAttachments ??= [];
                void webview.postMessage({ type: 'contextChips', items: attachmentsToChips(state.contextAttachments) });
                void webview.postMessage({ type: 'toolChips', items: Array.isArray(state.lastToolReferences) ? state.lastToolReferences : [] });
                // Do not scan workspace custom agents on startup; it can be slow on some filesystems (e.g. OneDrive).
                // Settings > Custom Agents or filesystem watchers will refresh the list when needed.
                // v0.1: Fetch TriLC agents first, then post combined agent list
                void this.fetchAgentsFromTriLC().then(() => {
                    this.postAgentsList();
                    this.postAgentProfileAndLabel();
                });
                // Retry once after TriLC has had time to start
                setTimeout(() => {
                    void this.fetchAgentsFromTriLC().then(() => {
                        if (this.tricompanyAgents.length) {
                            this.postAgentsList();
                            this.postAgentProfileAndLabel();
                        }
                    });
                }, 8000);
                void this.refreshModelsAndPost(state);
                /* v0.1 removed: askStudy sandbox init */
                // W30 S5: Check TriLC daemon health and auto-reconnect active sessions
                void this.checkTriLCStatusAndReconnect(state);
                // If this host was opened via "move to editor", replay the pinned session/transcript.
                const didReplayOnReady = Boolean(state.replayOnReady);
                if (state.replayOnReady) {
                    const replay = state.replayOnReady;
                    state.replayOnReady = undefined;
                    if (replay.kind === 'session') {
                        await this.loadSessionIntoHost(replay.sessionId, state);
                    }
                    else {
                        this.postToHost(state, { type: 'chatReset' });
                        for (const item of replay.transcript) {
                            if (item.role === 'checkpoint') {
                                this.postToHost(state, { type: 'chatCheckpoint', checkpointId: item.checkpointId });
                                continue;
                            }
                            const msgItem = item;
                            this.postToHost(state, { type: 'chatAppend', role: msgItem.role, text: msgItem.text });
                        }
                        // If a run is in-flight, do not mutate conversation/transcript arrays (they are being used by the request).
                        if (!state.isBusy) {
                            state.transcript = [...replay.transcript];
                            state.conversation = [];
                            this.ensureSystemInstructionUpToDate(state);
                            for (const item of state.transcript) {
                                if (item.role === 'user')
                                    state.conversation.push(vscode.LanguageModelChatMessage.User(item.text));
                                else if (item.role === 'assistant')
                                    state.conversation.push(vscode.LanguageModelChatMessage.Assistant(item.text));
                            }
                        }
                    }
                }
                // If this is a fresh webview instance, re-render existing in-memory transcript (covers temp sessions).
                if (!didReplayOnReady && state.transcript.length > 0) {
                    this.postToHost(state, { type: 'chatReset' });
                    for (const item of state.transcript) {
                        if (item.role === 'checkpoint') {
                            this.postToHost(state, { type: 'chatCheckpoint', checkpointId: item.checkpointId });
                            continue;
                        }
                        const msgItem = item;
                        this.postToHost(state, { type: 'chatAppend', role: msgItem.role, text: msgItem.text });
                    }
                    if (state.inProgressAssistantText && state.isBusy) {
                        this.postToHost(state, { type: 'chatAssistantStart' });
                        this.postToHost(state, { type: 'chatAssistantDelta', delta: state.inProgressAssistantText });
                    }
                }
                if (host === 'sidebar') {
                    await this.maybeAutoLoadMostRecentSessionIntoSidebar(state);
                    await this.refreshSessionsAndPost();
                }
                break;
            case 'requestWorkspaceContext': {
                const folders = (vscode.workspace.workspaceFolders ?? []).map((f) => f.uri.fsPath);
                void webview.postMessage({ type: 'workspaceContext', workspaceFolders: folders });
                break;
            }
            case 'cancel':
                state.abortController?.abort();
                state.abortController = undefined;
                state.lmCancelSource?.cancel();
                state.lmCancelSource?.dispose();
                state.lmCancelSource = undefined;
                state.isBusy = false;
                state.inProgressAssistantText = undefined;
                if (this.pendingEditApproval?.originHost === host) {
                    this.resolvePendingEditApproval('cancel');
                }
                this.setAndPostStatus(state, 'idle');
                break;
            case 'chatUserMessage':
                await this.handleUserMessage(msg.text, state);
                break;
            case 'editApprovalAction':
                await this.handleEditApprovalAction(state, msg);
                break;
            case 'editReviewAction':
                await this.handleEditReviewAction(state, msg);
                break;
            case 'checkpointAction':
                await this.handleCheckpointAction(state, msg);
                break;
            case 'uiAction':
                if (isSettingsPerfEnabled()) {
                    const anyMsg = msg;
                    const clientTs = typeof anyMsg?.clientTs === 'number' ? anyMsg.clientTs : undefined;
                    if (clientTs) {
                        const delta = Date.now() - clientTs;
                        settingsPerfLog(`[ui] uiAction recv action=${msg.action} host=${host} delta=${delta}ms`);
                    }
                    else {
                        settingsPerfLog(`[ui] uiAction recv action=${msg.action} host=${host}`);
                    }
                }
                await this.handleUiAction(state, msg.action, msg.payload);
                break;
        }
    }
    async maybeAutoLoadMostRecentSessionIntoSidebar(state) {
        if (state.kind !== 'sidebar')
            return;
        if (!this.isChatHistoryEnabled())
            return;
        // Do not interfere with an in-flight run.
        if (state.isBusy)
            return;
        // If there is already something selected or displayed, keep it.
        if (state.historySessionId)
            return;
        if (state.transcript.length > 0)
            return;
        const archivedRaw = this.context.globalState.get('tripilot.archivedSessionIds') ?? [];
        const archived = new Set(archivedRaw.map((s) => String(s).trim()).filter(Boolean));
        const tryLoad = async (sid) => {
            const id = String(sid ?? '').trim();
            if (!id)
                return false;
            if (archived.has(id))
                return false;
            try {
                await this.loadSessionIntoHost(id, state);
                return true;
            }
            catch {
                return false;
            }
        };
        // Prefer last active session id (if present), otherwise pick most-recent unarchived session.
        const activeSid = String(this.context.globalState.get('tripilot.activeChatSessionId') ?? '').trim();
        if (activeSid && (await tryLoad(activeSid)))
            return;
        const sessions = await this.listStoredHistorySessions();
        const mostRecent = sessions.find((s) => s?.sessionId && !archived.has(s.sessionId))?.sessionId;
        if (mostRecent) {
            await tryLoad(mostRecent);
        }
    }
    postContextChips(state) {
        state.contextAttachments ??= [];
        this.postToHost(state, { type: 'contextChips', items: attachmentsToChips(state.contextAttachments) });
    }
    postToolChips(state) {
        const items = Array.isArray(state.lastToolReferences) ? state.lastToolReferences : [];
        this.postToHost(state, { type: 'toolChips', items });
    }
    addContextAttachment(state, attachment) {
        state.contextAttachments ??= [];
        if (state.contextAttachments.some((a) => a.id === attachment.id))
            return;
        const MAX_ATTACHMENTS = 12;
        state.contextAttachments.push(attachment);
        if (state.contextAttachments.length > MAX_ATTACHMENTS) {
            state.contextAttachments = state.contextAttachments.slice(state.contextAttachments.length - MAX_ATTACHMENTS);
        }
        this.postContextChips(state);
    }
    removeContextAttachment(state, id) {
        const raw = String(id ?? '').trim();
        if (!raw)
            return;
        state.contextAttachments ??= [];
        const before = state.contextAttachments.length;
        state.contextAttachments = state.contextAttachments.filter((a) => a.id !== raw);
        if (state.contextAttachments.length !== before) {
            this.postContextChips(state);
        }
    }
    async addContextInteractive(state) {
        const editor = vscode.window.activeTextEditor;
        const hasEditor = Boolean(editor && editor.document);
        const selectionText = editor && !editor.selection.isEmpty ? String(editor.document.getText(editor.selection) ?? '') : '';
        const hasSelection = Boolean(selectionText.trim());
        const items = [];
        if (hasSelection && editor) {
            const rel = safeWorkspaceRelativePath(editor.document.uri);
            items.push({
                tpKind: 'selection',
                label: '添加当前选区',
                detail: rel ? `${rel}:${editor.selection.start.line + 1}-${editor.selection.end.line + 1}` : undefined
            });
        }
        if (hasEditor && editor) {
            const rel = safeWorkspaceRelativePath(editor.document.uri);
            items.push({ tpKind: 'activeFile', label: '添加当前文件', detail: rel || editor.document.fileName });
        }
        items.push({ tpKind: 'pickFiles', label: '选择文件…', detail: '从工作区选择一个或多个文件' });
        const picked = await vscode.window.showQuickPick(items, {
            title: 'Tripilot: 添加上下文',
            canPickMany: true,
            ignoreFocusOut: true
        });
        if (!picked || picked.length === 0)
            return;
        const maxChars = 20000;
        let added = 0;
        for (const p of picked) {
            if (p.tpKind === 'selection' && editor && hasSelection) {
                const doc = editor.document;
                const r = editor.selection;
                let text = selectionText;
                if (text.length > maxChars)
                    text = text.slice(0, maxChars) + '\n…(truncated)';
                const rel = safeWorkspaceRelativePath(doc.uri) || path.basename(doc.fileName);
                const label = `选区: ${rel}:${r.start.line + 1}-${r.end.line + 1}`;
                const id = `sel:${doc.uri.toString()}:${r.start.line}:${r.start.character}-${r.end.line}:${r.end.character}`;
                this.addContextAttachment(state, {
                    id,
                    kind: 'selection',
                    label,
                    text,
                    languageId: doc.languageId,
                    source: {
                        uri: doc.uri.toString(),
                        range: {
                            startLine: r.start.line,
                            startCharacter: r.start.character,
                            endLine: r.end.line,
                            endCharacter: r.end.character
                        }
                    }
                });
            }
            if (p.tpKind === 'activeFile' && editor) {
                const doc = editor.document;
                let text = String(doc.getText() ?? '');
                let truncated = false;
                if (text.length > maxChars) {
                    text = text.slice(0, maxChars) + '\n…(truncated)';
                    truncated = true;
                }
                const rel = safeWorkspaceRelativePath(doc.uri) || path.basename(doc.fileName);
                const label = `文件: ${rel}`;
                const id = `file:${doc.uri.toString()}`;
                this.addContextAttachment(state, {
                    id,
                    kind: 'file',
                    label,
                    uri: doc.uri.toString(),
                    text,
                    languageId: doc.languageId,
                    truncated
                });
                added++;
                continue;
            }
            if (p.tpKind === 'pickFiles') {
                const defaultUri = vscode.workspace.workspaceFolders?.[0]?.uri;
                const uris = await vscode.window.showOpenDialog({
                    title: 'Tripilot: 选择要附加到聊天的文件',
                    defaultUri,
                    canSelectMany: true,
                    canSelectFiles: true,
                    canSelectFolders: false,
                    openLabel: '添加'
                });
                if (!uris || uris.length === 0)
                    continue;
                for (const uri of uris) {
                    try {
                        const doc = await vscode.workspace.openTextDocument(uri);
                        let text = String(doc.getText() ?? '');
                        let truncated = false;
                        if (text.length > maxChars) {
                            text = text.slice(0, maxChars) + '\n…(truncated)';
                            truncated = true;
                        }
                        const rel = safeWorkspaceRelativePath(uri) || path.basename(uri.fsPath);
                        const label = `文件: ${rel}`;
                        const id = `file:${uri.toString()}`;
                        this.addContextAttachment(state, {
                            id,
                            kind: 'file',
                            label,
                            uri: uri.toString(),
                            text,
                            languageId: doc.languageId,
                            truncated
                        });
                        added++;
                    }
                    catch {
                        // ignore unreadable/binary
                    }
                }
            }
        }
        if (added > 0) {
            this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `已添加上下文：${added} 项` });
        }
        else {
            this.postToHost(state, { type: 'chatAppend', role: 'tool', text: '未添加任何上下文（可能没有可用选区，或文件无法读取）。' });
        }
    }
    parsePromptSyntax(text) {
        const raw = String(text ?? '');
        const fileRefs = [];
        const toolRefs = [];
        // Copilot-like prompt markers: #file:<path> and #tool:<toolName>
        // - filePath: any non-whitespace, not containing '#'
        // - toolName: [\w_\-\.\/]+
        // - ignore markers inside markdown links like [text](...)
        const tokenRe = /#file:(?<filePath>[^\s#]+)|#tool:(?<toolName>[\w_\-\.\/]+)/gi;
        const scrubRe = /(^|\s)(?:#file:[^\s#]+|#tool:[\w_\-\.\/]+)/gi;
        const linkRanges = [];
        for (const linkMatch of raw.matchAll(/\[[^\]]*?\]\([^\)]*?\)/g)) {
            if (typeof linkMatch.index !== 'number')
                continue;
            linkRanges.push({ start: linkMatch.index, end: linkMatch.index + linkMatch[0].length });
        }
        const isInLink = (index) => linkRanges.some((r) => index >= r.start && index < r.end);
        for (const m of raw.matchAll(tokenRe)) {
            if (typeof m.index === 'number' && isInLink(m.index))
                continue;
            const filePath = m.groups?.filePath;
            const toolName = m.groups?.toolName;
            if (filePath)
                fileRefs.push(String(filePath));
            else if (toolName)
                toolRefs.push(String(toolName));
        }
        const cleanText = raw.replace(scrubRe, '$1');
        return { cleanText, fileRefs, toolRefs };
    }
    resolveFileRefToUri(ref) {
        const raw = String(ref ?? '').trim();
        if (!raw)
            return undefined;
        // Allow file:// URIs.
        if (/^file:/i.test(raw)) {
            try {
                return vscode.Uri.parse(raw);
            }
            catch {
                return undefined;
            }
        }
        // Treat leading-slash paths as workspace-relative (Copilot-style).
        if (raw.startsWith('/')) {
            const folder = vscode.workspace.workspaceFolders?.[0];
            if (!folder)
                return undefined;
            const segments = raw.slice(1).split('/').filter(Boolean);
            if (!segments.length)
                return undefined;
            return vscode.Uri.joinPath(folder.uri, ...segments);
        }
        // Absolute filesystem paths.
        if (path.isAbsolute(raw)) {
            return vscode.Uri.file(raw);
        }
        // Workspace-relative.
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder)
            return undefined;
        const normalized = raw.replace(/^\.\//, '').replace(/^\.\\/, '');
        const segments = normalized.split(/[\\/]+/).filter(Boolean);
        if (!segments.length)
            return undefined;
        return vscode.Uri.joinPath(folder.uri, ...segments);
    }
    async attachFilesFromPromptRefs(state, refs) {
        if (!Array.isArray(refs) || refs.length === 0)
            return;
        state.contextAttachments ??= [];
        const maxChars = 20000;
        for (const r of refs) {
            const uri = this.resolveFileRefToUri(r);
            if (!uri)
                continue;
            const id = `file:${uri.toString()}`;
            if (state.contextAttachments.some((a) => a.id === id))
                continue;
            try {
                const doc = await vscode.workspace.openTextDocument(uri);
                let text = String(doc.getText() ?? '');
                let truncated = false;
                if (text.length > maxChars) {
                    text = text.slice(0, maxChars) + '\n…(truncated)';
                    truncated = true;
                }
                const rel = safeWorkspaceRelativePath(uri) || path.basename(uri.fsPath);
                const label = `文件: ${rel}`;
                this.addContextAttachment(state, {
                    id,
                    kind: 'file',
                    label,
                    uri: uri.toString(),
                    text,
                    languageId: doc.languageId,
                    truncated
                });
            }
            catch {
                // ignore unreadable/binary
            }
        }
    }
    buildUserTextWithContext(state, userText) {
        const raw = String(userText ?? '');
        const attachments = state.contextAttachments ?? [];
        if (!attachments.length)
            return raw;
        const parts = [];
        parts.push(raw.trimEnd());
        parts.push('');
        parts.push('---');
        parts.push('[Tripilot attached context]');
        for (const a of attachments) {
            const header = a.kind === 'file' ? `${a.label}${a.truncated ? ' (truncated)' : ''}` : a.label;
            parts.push('');
            parts.push(`### ${header}`);
            const lang = a.languageId ? String(a.languageId).trim() : '';
            parts.push('```' + (lang || ''));
            parts.push(String(a.text ?? ''));
            parts.push('```');
        }
        parts.push('---');
        return parts.join('\n');
    }
    extractSubagentNodesFromToolLines(args) {
        const out = [];
        let subIndex = 0;
        const stack = [];
        const baseId = String(args.parentId || 'root').replace(/[^a-zA-Z0-9_.-]/g, '_');
        for (let i = 0; i < args.toolLines.length; i++) {
            const line = String(args.toolLines[i] ?? '').trim();
            const start = line.match(/^→\s+runSubagent\((.*)\)$/);
            if (start) {
                subIndex += 1;
                let desc = `SubAgent #${subIndex}`;
                const raw = String(start[1] ?? '').trim();
                try {
                    const parsed = JSON.parse(raw);
                    const d = String(parsed?.description ?? '').trim();
                    if (d)
                        desc = d;
                }
                catch {
                    // ignore malformed previews
                }
                const parent = stack.length ? stack[stack.length - 1].id : args.parentId;
                const nodeId = `${baseId}.subagent.${subIndex}`;
                out.push({
                    id: nodeId,
                    parentId: parent,
                    label: desc,
                    type: 'subagent',
                    status: 'working',
                    sessionId: args.sessionId,
                    traceId: args.traceId,
                    eventId: `evt_subagent_start_${i + 1}`,
                    eventSeq: i + 1
                });
                stack.push({ id: nodeId, index: out.length - 1 });
                continue;
            }
            if (/^←\s+runSubagent:\s*/.test(line)) {
                const current = stack.pop();
                if (!current)
                    continue;
                const preview = line.replace(/^←\s+runSubagent:\s*/, '').trim();
                const nextStatus = /error|failed|exception/i.test(preview) ? 'error' : 'done';
                out[current.index] = {
                    ...out[current.index],
                    status: nextStatus,
                    eventId: `evt_subagent_end_${i + 1}`,
                    eventSeq: i + 1
                };
            }
        }
        return out;
    }
    async readSessionToolTraceLines(sessionId) {
        const sid = String(sessionId ?? '').trim();
        if (!sid)
            return [];
        const hit = this.subagentTraceCache.get(sid);
        if (hit && Date.now() - hit.atMs <= 5_000)
            return hit.lines;
        try {
            const fileUri = vscode.Uri.joinPath(this.getHistoryDirUri(), `${sid}.jsonl`);
            const raw = Buffer.from(await vscode.workspace.fs.readFile(fileUri)).toString('utf8');
            const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
            const toolLines = [];
            for (const line of lines) {
                try {
                    const ev = JSON.parse(line);
                    if (String(ev?.kind ?? '') !== 'tool_trace')
                        continue;
                    const text = String(ev?.text ?? '').trim();
                    if (text)
                        toolLines.push(text);
                }
                catch {
                    // ignore malformed lines
                }
            }
            this.subagentTraceCache.set(sid, { atMs: Date.now(), lines: toolLines });
            return toolLines;
        }
        catch {
            return [];
        }
    }
    async postSubagentTree(state) {
        const sessionId = String(state.historySessionId ?? '').trim() || undefined;
        const traceId = sessionId ? `trc_${sessionId}` : 'trc_live';
        const nodes = [];
        nodes.push({
            id: 'agent.root',
            parentId: null,
            label: state.currentSessionTitle ? `Agent VM · ${state.currentSessionTitle}` : 'Agent VM',
            type: 'main',
            status: state.isBusy ? 'working' : 'idle',
            sessionId,
            traceId,
            eventId: 'evt_root'
        });
        const toolLines = (state.transcript ?? [])
            .filter((item) => item?.role === 'tool')
            .map((item) => String(item?.text ?? '').trim())
            .filter(Boolean);
        nodes.push(...this.extractSubagentNodesFromToolLines({ toolLines, parentId: 'agent.root', sessionId, traceId }));
        if (state.kind === 'sidebar' && this.isChatHistoryEnabled()) {
            const sessions = await this.listStoredHistorySessions();
            const recent = sessions
                .filter((s) => String(s.sessionId ?? '').trim() && String(s.sessionId) !== String(sessionId ?? ''))
                .slice(0, 3);
            for (const sess of recent) {
                const sid = String(sess.sessionId ?? '').trim();
                if (!sid)
                    continue;
                const rootId = `session.${sid}`;
                const title = String(sess.title ?? '').trim() || sid;
                nodes.push({
                    id: rootId,
                    parentId: null,
                    label: `History · ${title}`,
                    type: 'main',
                    status: 'idle',
                    sessionId: sid,
                    traceId: `trc_${sid}`,
                    eventId: `evt_session_${sid}`
                });
                const lines = await this.readSessionToolTraceLines(sid);
                nodes.push(...this.extractSubagentNodesFromToolLines({
                    toolLines: lines,
                    parentId: rootId,
                    sessionId: sid,
                    traceId: `trc_${sid}`
                }));
            }
        }
        this.postToHost(state, { type: 'subagentTree', nodes });
        this.postSceneState(state, nodes);
    }
    postSceneState(state, nodes) {
        const normalizeKeyPart = (value) => {
            return String(value ?? '')
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9._-]/g, '_')
                .slice(0, 80);
        };
        const hasFailed = nodes.some((n) => n.type === 'subagent' && n.status === 'error');
        const hasWorking = nodes.some((n) => n.type === 'subagent' && n.status === 'working');
        const hasWaitingApproval = !!this.pendingEditApproval &&
            (this.pendingEditApproval.originHost === state.kind || this.pendingEditApproval.originHost === 'sidebar');
        const prevScene = state.sceneState;
        const prevStations = new Map((state.sceneState?.workstations ?? []).map((s) => [String(s.id), s]));
        let machineState = 'idle';
        let reason = 'no-active-signals';
        if (hasFailed) {
            machineState = 'failed';
            reason = 'subagent-error';
        }
        else if (hasWaitingApproval) {
            machineState = 'waiting';
            reason = 'approval-pending';
        }
        else if (state.isBusy || hasWorking) {
            machineState = 'working';
            reason = state.isBusy ? 'host-busy' : 'subagent-working';
        }
        const workstations = [];
        let recoveredCount = 0;
        for (const n of nodes) {
            if (n.type !== 'subagent')
                continue;
            const mapped = n.status === 'error' ? 'failed' : n.status === 'working' ? 'working' : 'idle';
            const sid = String(n.sessionId ?? '').trim() || 'live';
            const tid = String(n.traceId ?? '').trim() || 'trace';
            const labelKey = normalizeKeyPart(String(n.label ?? n.id ?? 'station')) || normalizeKeyPart(String(n.id));
            const stationId = `ws.subagent.${sid}.${tid}.${labelKey}`;
            const prev = prevStations.get(stationId);
            const recovered = !!prev && prev.state === 'failed' && mapped !== 'failed';
            if (recovered)
                recoveredCount += 1;
            workstations.push({
                id: stationId,
                mappingKey: `${sid}|${tid}|${String(n.eventId ?? '')}|${String(n.eventSeq ?? '')}`,
                label: n.label,
                state: mapped,
                recovered,
                nodeId: n.id,
                eventId: n.eventId,
                eventSeq: n.eventSeq,
                sessionId: n.sessionId,
                traceId: n.traceId,
                kind: 'subagent'
            });
        }
        if (hasWaitingApproval && this.pendingEditApproval) {
            const approvalId = `approval.${this.pendingEditApproval.requestId}`;
            workstations.unshift({
                id: approvalId,
                mappingKey: approvalId,
                label: 'Approval Gate',
                state: 'waiting',
                eventId: this.pendingEditApproval.requestId,
                kind: 'approval'
            });
        }
        if (!hasFailed && recoveredCount > 0) {
            if (hasWaitingApproval) {
                reason = 'recovered-awaiting-approval';
            }
            else if (state.isBusy || hasWorking) {
                machineState = 'working';
                reason = 'recovered-and-running';
            }
            else {
                machineState = 'idle';
                reason = 'recovered-to-idle';
            }
        }
        const stateRank = {
            failed: 0,
            waiting: 1,
            working: 2,
            idle: 3
        };
        workstations.sort((a, b) => stateRank[a.state] - stateRank[b.state] || a.label.localeCompare(b.label));
        const latestEventSeq = (() => {
            let maxSeq;
            for (const ws of workstations) {
                const seq = ws.eventSeq;
                if (!Number.isFinite(Number(seq)))
                    continue;
                const n = Math.max(0, Math.floor(Number(seq)));
                if (maxSeq == null || n > maxSeq)
                    maxSeq = n;
            }
            return maxSeq;
        })();
        const transition = `${String(prevScene?.machineState ?? 'init')}->${machineState}`;
        const recoveryAt = recoveredCount > 0 ? Date.now() : prevScene?.recoveryAt;
        const next = {
            machineState,
            reason,
            transition,
            latestEventSeq,
            recoveryAt,
            updatedAt: Date.now(),
            workstations
        };
        state.sceneState = next;
        this.postToHost(state, { type: 'sceneState', ...next });
    }
    postReplayState(state) {
        const rs = state.replayState ?? {
            active: false,
            playing: false,
            cursor: 0,
            locked: false,
            sessionId: undefined,
            traceId: undefined,
            totalRecords: 0,
            cadenceMs: 850
        };
        this.postToHost(state, {
            type: 'replayState',
            active: Boolean(rs.active),
            playing: Boolean(rs.playing),
            cursor: Number(rs.cursor ?? 0),
            sessionId: rs.sessionId,
            traceId: rs.traceId,
            locked: Boolean(rs.locked),
            totalRecords: Number.isFinite(Number(rs.totalRecords)) ? Math.max(0, Math.floor(Number(rs.totalRecords))) : 0,
            cadenceMs: Number.isFinite(Number(rs.cadenceMs)) ? Math.max(250, Math.floor(Number(rs.cadenceMs))) : 850
        });
    }
    stopReplayCadence(state) {
        if (state.replayCadenceTimer) {
            clearInterval(state.replayCadenceTimer);
            state.replayCadenceTimer = undefined;
        }
    }
    startReplayCadence(state) {
        this.stopReplayCadence(state);
        const rs = state.replayState;
        if (!rs?.active || !rs.playing || !rs.locked)
            return;
        const cadenceMs = Number.isFinite(Number(rs.cadenceMs)) ? Math.max(250, Math.floor(Number(rs.cadenceMs))) : 850;
        state.replayCadenceTimer = setInterval(() => {
            const cur = state.replayState;
            if (!cur?.active || !cur.playing || !cur.locked) {
                this.stopReplayCadence(state);
                return;
            }
            const total = Number.isFinite(Number(cur.totalRecords)) ? Math.max(0, Math.floor(Number(cur.totalRecords))) : 0;
            if (total <= 0) {
                cur.playing = false;
                this.stopReplayCadence(state);
                this.postReplayState(state);
                return;
            }
            const cursor = Number.isFinite(Number(cur.cursor)) ? Math.max(0, Math.floor(Number(cur.cursor))) : 0;
            if (cursor >= total - 1) {
                cur.cursor = total - 1;
                cur.playing = false;
                this.stopReplayCadence(state);
                this.postReplayState(state);
                return;
            }
            cur.cursor = cursor + 1;
            this.postReplayState(state);
        }, cadenceMs);
    }
    async handleUiAction(state, action, payload) {
        switch (action) {
            case 'addContext': {
                await this.addContextInteractive(state);
                return;
            }
            case 'attachFileRef': {
                const ref = String(payload?.ref ?? '').trim();
                if (!ref)
                    return;
                await this.attachFilesFromPromptRefs(state, [ref]);
                return;
            }
            case 'addToolRef': {
                const name = String(payload?.name ?? '').trim();
                if (!name)
                    return;
                const next = new Set((state.lastToolReferences ?? []).map((s) => String(s).trim()).filter(Boolean));
                next.add(name);
                state.lastToolReferences = Array.from(next).sort();
                this.postToolChips(state);
                return;
            }
            case 'removeToolRef': {
                const name = String(payload?.name ?? '').trim();
                if (!name)
                    return;
                state.lastToolReferences = (state.lastToolReferences ?? []).map(String).map((s) => s.trim()).filter((s) => s && s !== name).sort();
                this.postToolChips(state);
                return;
            }
            case 'removeContext': {
                const id = String(payload?.id ?? '').trim();
                if (!id)
                    return;
                this.removeContextAttachment(state, id);
                return;
            }
            case 'hashSuggest': {
                const rawPrefix = String(payload?.prefix ?? '').trim();
                let mode = 'any';
                let prefix = rawPrefix;
                if (/^file:/i.test(rawPrefix)) {
                    mode = 'file';
                    prefix = rawPrefix.slice('file:'.length).trim();
                }
                else if (/^tool:/i.test(rawPrefix)) {
                    mode = 'toolCompat';
                    prefix = rawPrefix.slice('tool:'.length).trim();
                }
                const items = [];
                const pushFile = (uri, labelSuffix) => {
                    const rel = safeWorkspaceRelativePath(uri) || uri.fsPath;
                    if (!rel)
                        return;
                    const base = path.basename(uri.fsPath || uri.path || rel);
                    const label = labelSuffix ? `${base}${labelSuffix}` : base;
                    items.push({ kind: 'file', label, detail: rel, insertText: `#file:${rel}` });
                };
                if (mode !== 'toolCompat') {
                    // Active file first.
                    const active = vscode.window.activeTextEditor?.document?.uri;
                    if (active && (active.scheme === 'file' || active.scheme === 'vscode-remote')) {
                        pushFile(active, ' (Active file)');
                    }
                    // Then visible editors.
                    for (const ed of vscode.window.visibleTextEditors ?? []) {
                        const u = ed.document?.uri;
                        if (!u || u.toString() === active?.toString())
                            continue;
                        if (u.scheme !== 'file' && u.scheme !== 'vscode-remote')
                            continue;
                        pushFile(u);
                        if (items.length >= 12)
                            break;
                    }
                }
                // If prefix is non-empty, do a lightweight workspace search.
                const folder = vscode.workspace.workspaceFolders?.[0];
                const shouldSearchWorkspace = mode === 'file' ? prefix.length >= 0 : prefix.length >= 2;
                if (mode !== 'toolCompat' && folder && prefix && shouldSearchWorkspace) {
                    const safe = prefix.replace(/[^A-Za-z0-9_.\-\/]/g, '');
                    const pat = safe.includes('/') ? `**/${safe}*` : `**/*${safe}*`;
                    const exclude = '{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/build/**,**/.next/**,**/.turbo/**}';
                    try {
                        const uris = await vscode.workspace.findFiles(pat, exclude, 20);
                        for (const uri of uris) {
                            const rel = safeWorkspaceRelativePath(uri) || uri.fsPath;
                            if (!rel)
                                continue;
                            if (items.some((it) => it.kind === 'file' && it.insertText === `#file:${rel}`))
                                continue;
                            pushFile(uri);
                            if (items.length >= 20)
                                break;
                        }
                    }
                    catch {
                        // ignore
                    }
                }
                if (mode !== 'file') {
                    // Tool suggestions from built-in tool definitions.
                    const toolPrefix = prefix.toLowerCase();
                    // Tool set suggestions (Copilot-like).
                    /* v0.1: inline TOOL_SETS */
                    const TOOL_SET_SUGGESTIONS = [
                        { name: 'edit', desc: 'Tool set for creating/modifying files (Copilot-like #edit).' },
                        { name: 'search', desc: 'Tool set for reading/searching workspace context (Copilot-like #search).' }
                    ];
                    for (const { name: setName, desc } of TOOL_SET_SUGGESTIONS) {
                        if (!toolPrefix || setName.toLowerCase().startsWith(toolPrefix)) {
                            items.push({
                                kind: 'tool',
                                label: setName,
                                detail: `Tool set · ${desc}`.trim(),
                                insertText: `#${setName}`
                            });
                        }
                        if (items.length >= 40)
                            break;
                    }
                    const toolNames = getToolDefinitions()
                        .map((t) => String(t?.function?.name ?? '').trim())
                        .filter(Boolean);
                    for (const name of toolNames) {
                        if (!toolPrefix || name.toLowerCase().startsWith(toolPrefix)) {
                            items.push({
                                kind: 'tool',
                                label: name,
                                insertText: mode === 'toolCompat' ? `#tool:${name}` : `#${name}`
                            });
                        }
                        if (items.length >= 40)
                            break;
                    }
                }
                this.postToHost(state, { type: 'hashSuggestions', items });
                return;
            }
            case 'continueChat': {
                // Copilot-like: ask the model to continue the last assistant output.
                // We reuse the normal message pipeline so tools/streaming/history all stay consistent.
                await this.handleUserMessage('继续', state);
                return;
            }
            case 'newChatEditor':
            case 'moveToEditor': {
                await this.openChatInEditorArea(state.kind);
                return;
            }
            case 'newChatWindow':
            case 'moveToNewWindow': {
                await this.openChatInNewWindow();
                return;
            }
            case 'showChat': {
                await this.openChatView();
                return;
            }
            case 'showChatDebug': {
                await this.showChatLogView(state.kind);
                return;
            }
            case 'defaultView': {
                await this.resetViewDefaults();
                return;
            }
            case 'sessionsSearch':
            case 'sessionsFilter':
            case 'sessionsView':
                return;
            case 'requestSubagentTree': {
                await this.postSubagentTree(state);
                return;
            }
            case 'requestReplayState': {
                this.postReplayState(state);
                if (state.sceneState) {
                    this.postToHost(state, { type: 'sceneState', ...state.sceneState });
                }
                return;
            }
            case 'replayControl': {
                const cmd = String(payload?.action ?? '').trim().toLowerCase();
                const sid = String(payload?.sessionId ?? '').trim() || undefined;
                const tid = String(payload?.traceId ?? '').trim() || undefined;
                const cur = Number.isFinite(Number(payload?.cursor)) ? Math.max(0, Math.floor(Number(payload?.cursor))) : 0;
                const total = Number.isFinite(Number(payload?.totalRecords)) ? Math.max(0, Math.floor(Number(payload?.totalRecords))) : undefined;
                const cadenceMs = Number.isFinite(Number(payload?.cadenceMs))
                    ? Math.max(250, Math.floor(Number(payload?.cadenceMs)))
                    : undefined;
                const next = state.replayState ?? {
                    active: false,
                    playing: false,
                    cursor: 0,
                    locked: false,
                    sessionId: undefined,
                    traceId: undefined,
                    totalRecords: 0,
                    cadenceMs: 850
                };
                if (cmd === 'load') {
                    next.active = true;
                    next.playing = false;
                    next.cursor = cur;
                    next.locked = true;
                    next.sessionId = sid;
                    next.traceId = tid;
                    next.totalRecords = total ?? 0;
                    next.cadenceMs = cadenceMs ?? next.cadenceMs ?? 850;
                    this.stopReplayCadence(state);
                }
                else if (cmd === 'play' || cmd === 'resume') {
                    next.active = true;
                    next.playing = true;
                    next.locked = true;
                    next.cursor = cur;
                    next.sessionId = sid ?? next.sessionId;
                    next.traceId = tid ?? next.traceId;
                    next.totalRecords = total ?? next.totalRecords ?? 0;
                    next.cadenceMs = cadenceMs ?? next.cadenceMs ?? 850;
                    this.startReplayCadence(state);
                }
                else if (cmd === 'pause' || cmd === 'scrub') {
                    next.active = true;
                    next.playing = false;
                    next.locked = true;
                    next.cursor = cur;
                    next.sessionId = sid ?? next.sessionId;
                    next.traceId = tid ?? next.traceId;
                    next.totalRecords = total ?? next.totalRecords ?? 0;
                    next.cadenceMs = cadenceMs ?? next.cadenceMs ?? 850;
                    this.stopReplayCadence(state);
                }
                else if (cmd === 'stop') {
                    next.active = false;
                    next.playing = false;
                    next.cursor = 0;
                    next.locked = false;
                    next.sessionId = undefined;
                    next.traceId = undefined;
                    next.totalRecords = 0;
                    this.stopReplayCadence(state);
                }
                else if (cmd === 'config') {
                    next.cadenceMs = cadenceMs ?? next.cadenceMs ?? 850;
                    next.totalRecords = total ?? next.totalRecords ?? 0;
                    next.sessionId = sid ?? next.sessionId;
                    next.traceId = tid ?? next.traceId;
                    next.cursor = cur;
                    if (next.active && next.playing)
                        this.startReplayCadence(state);
                }
                state.replayState = next;
                this.postReplayState(state);
                if (!next.active) {
                    await this.postSubagentTree(state);
                }
                return;
            }
            case 'jumpToSubagentEvent': {
                const nodeId = String(payload?.nodeId ?? '').trim() || '(unknown-node)';
                const eventId = String(payload?.eventId ?? '').trim() || '(unknown-event)';
                const traceId = String(payload?.traceId ?? '').trim() || '(unknown-trace)';
                const sessionId = String(payload?.sessionId ?? '').trim() || '(unknown-session)';
                const status = String(payload?.status ?? '').trim() || 'unknown';
                const source = String(payload?.source ?? '').trim() || 'subagent-tree-live';
                const silent = Boolean(payload?.silent);
                if (silent)
                    return;
                this.postToHost(state, {
                    type: 'chatAppend',
                    role: 'tool',
                    text: [
                        '[Subagent Event Jump]',
                        `nodeId: ${nodeId}`,
                        `eventId: ${eventId}`,
                        `traceId: ${traceId}`,
                        `sessionId: ${sessionId}`,
                        `status: ${status}`,
                        `source: ${source}`
                    ].join('\n')
                });
                return;
            }
            case 'setTempSession': {
                const tempEnabled = Boolean(payload?.enabled);
                // temp session ON => do not record history.
                await vscode.workspace
                    .getConfiguration('tripilot')
                    .update('chatHistory.enabled', !tempEnabled, vscode.ConfigurationTarget.Global);
                // Avoid appending into an old session id after toggling (applies to both hosts).
                for (const s of Object.values(this.hostStates)) {
                    s.historySessionId = undefined;
                    s.currentSessionTitle = undefined;
                    s.historyStore = undefined;
                }
                await this.refreshSessionsAndPost();
                return;
            }
            case 'requestSessions': {
                await this.refreshSessionsAndPost();
                return;
            }
            case 'newSession': {
                await this.startNewChatSessionInteractive(state.kind);
                if (state.kind === 'sidebar')
                    await this.refreshSessionsAndPost();
                return;
            }
            case 'loadSession': {
                const sid = String(payload?.sessionId ?? '').trim();
                if (!sid)
                    return;
                try {
                    await this.loadSessionIntoHost(sid, state);
                }
                catch (e) {
                    vscode.window.showErrorMessage(`Tripilot: 加载会话失败：${String(e?.message ?? e)}`);
                }
                if (state.kind === 'sidebar')
                    await this.refreshSessionsAndPost();
                return;
            }
            case 'archiveSession': {
                if (state.kind !== 'sidebar')
                    return;
                const sid = String(payload?.sessionId ?? '').trim();
                if (!sid)
                    return;
                const raw = this.context.globalState.get('tripilot.archivedSessionIds') ?? [];
                const set = new Set(raw.map((s) => String(s).trim()).filter(Boolean));
                set.add(sid);
                await this.context.globalState.update('tripilot.archivedSessionIds', Array.from(set));
                await this.refreshSessionsAndPost();
                return;
            }
            case 'archiveOrExportSession': {
                if (state.kind !== 'sidebar')
                    return;
                const sid = String(payload?.sessionId ?? '').trim();
                if (!sid)
                    return;
                if (!this.isChatHistoryEnabled()) {
                    vscode.window.showWarningMessage('Tripilot: Chat History 未启用（tripilot.chatHistory.enabled=false）。');
                    return;
                }
                const hasGranular = this.isGranularExportEnabled();
                const picked = await vscode.window.showQuickPick([
                    { label: '归档此会话', detail: 'archive' },
                    { label: '导出此会话（全量）', detail: 'export_full' },
                    ...(hasGranular ? [{ label: '导出此会话（选择记录…）', detail: 'export_select' }] : [])
                ], { title: 'Tripilot: 会话操作' });
                if (!picked?.detail)
                    return;
                if (picked.detail === 'archive') {
                    await this.handleUiAction(state, 'archiveSession', { sessionId: sid });
                    return;
                }
                await this.exportSingleSessionInteractive(sid, picked.detail === 'export_select');
                return;
            }
            case 'deleteSession': {
                if (state.kind !== 'sidebar')
                    return;
                const sid = String(payload?.sessionId ?? '').trim();
                if (!sid)
                    return;
                if (!this.isChatHistoryEnabled())
                    return;
                const confirm = await vscode.window.showWarningMessage(`Tripilot: 确认删除会话 ${sid}？`, { modal: true }, '删除');
                if (confirm !== '删除')
                    return;
                try {
                    const uri = vscode.Uri.joinPath(this.getHistoryDirUri(), `${sid}.jsonl`);
                    await vscode.workspace.fs.delete(uri, { recursive: false, useTrash: true });
                }
                catch (e) {
                    vscode.window.showErrorMessage(`Tripilot: 删除会话失败：${String(e?.message ?? e)}`);
                    return;
                }
                // Also remove from archived set if present.
                const raw = this.context.globalState.get('tripilot.archivedSessionIds') ?? [];
                const filtered = raw.map(String).map((s) => s.trim()).filter((s) => s && s !== sid);
                if (filtered.length !== raw.length) {
                    await this.context.globalState.update('tripilot.archivedSessionIds', filtered);
                }
                // If deleting current session, reset UI for any host that was using it.
                for (const s of Object.values(this.hostStates)) {
                    if (sid === s.historySessionId) {
                        s.historySessionId = undefined;
                        s.currentSessionTitle = undefined;
                        s.historyStore = undefined;
                        s.transcript = [];
                        await this.context.globalState.update('tripilot.activeChatSessionId', undefined);
                        this.resetConversationForLoadedSession(s);
                        this.postToHost(s, { type: 'chatReset' });
                    }
                }
                await this.refreshSessionsAndPost();
                return;
            }
            case 'openSettings': {
                TripilotSettingsPanel.show(this.context, this.mcpManager, 'models');
                return;
            }
            case 'openToolsSettings': {
                TripilotSettingsPanel.show(this.context, this.mcpManager, 'tools', {
                    fromChat: true,
                    agentProfileId: this.selectedAgentProfileId
                });
                return;
            }
            case 'setAgentProfile': {
                const id = String(payload?.id ?? payload?.value ?? '').trim();
                if (!id)
                    return;
                this.selectedAgentProfileId = id;
                this.ensureSystemInstructionUpToDate(this.hostStates.sidebar);
                this.ensureSystemInstructionUpToDate(this.hostStates.editor);
                this.ensureTrilcSystemInstructionUpToDate(this.hostStates.sidebar);
                this.ensureTrilcSystemInstructionUpToDate(this.hostStates.editor);
                await this.context.globalState.update('tripilot.selectedAgentProfileId', id);
                this.postAgentProfileAndLabel();
                TripilotSettingsPanel.syncActiveAgentProfileFromChat(id);
                /* v0.1 removed: ask-study sandbox init */
                return;
            }
            case 'configureCustomAgents': {
                TripilotSettingsPanel.show(this.context, this.mcpManager, 'agents');
                return;
            }
            case 'requestModels': {
                await this.refreshModelsAndPost(state);
                return;
            }
            case 'clearModelWhitelist': {
                await vscode.workspace
                    .getConfiguration('tripilot')
                    .update('visibleModelIds', [], vscode.ConfigurationTarget.Global);
                await this.refreshModelsAndPost(state);
                this.postToHost(state, { type: 'chatAppend', role: 'tool', text: '已清空模型白名单：现在显示全部可用模型。' });
                return;
            }
            case 'setModel': {
                const modelId = String(payload?.id ?? payload?.value ?? '');
                if (!modelId)
                    return;
                this.selectedModelId = modelId;
                await this.context.globalState.update('tripilot.selectedModelId', modelId);
                await this.refreshModelsAndPost(state);
                this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `已选择模型：${modelId}` });
                return;
            }
            case 'setEnabledTools': {
                const toolsRaw = Array.isArray(payload?.tools)
                    ? payload.tools
                        .map((value) => String(value ?? '').trim())
                        .filter(Boolean)
                    : [];
                const tools = toolsRaw.filter((s) => OPTIONAL_TOOL_NAMES.has(s));
                const unknown = toolsRaw.filter((s) => !OPTIONAL_TOOL_NAMES.has(s));
                // If the UI is outdated and sends unknown tool ids, don't wipe the profile's tool list.
                if (unknown.length && toolsRaw.length && tools.length === 0) {
                    this.postToHost(state, {
                        type: 'chatAppend',
                        role: 'tool',
                        text: `Tools 菜单发送了未知工具名（可能是旧版 UI）：${unknown.join(', ')}。已忽略本次更新，请更新/重载 Tripilot 后再试。`
                    });
                    return;
                }
                if (this.tricompanyAgents.some((agent) => agent.id === this.selectedAgentProfileId)) {
                    this.postToHost(state, {
                        type: 'chatAppend',
                        role: 'tool',
                        text: '当前 Agent 的工具配置由 TriLC Contract 控制，Tripilot 不保存本地覆盖。'
                    });
                    this.postAgentProfileAndLabel();
                    return;
                }
                if (this.getWorkspaceCustomAgent(this.selectedAgentProfileId)) {
                    this.postToHost(state, {
                        type: 'chatAppend',
                        role: 'tool',
                        text: 'Custom Agent 的 tools 由 .agent.md 文件控制；请在 Settings → Custom Agents 打开文件后编辑 frontmatter.tools。'
                    });
                    return;
                }
                this.enabledTools = new Set(tools);
                await setAgentProfileOptionalTools(this.selectedAgentProfileId, this.enabledTools);
                this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `已更新 Tools：${tools.join(', ') || '(none)'}` });
                return;
            }
            case 'manageModels': {
                try {
                    // copilot-direct uses Copilot's /models and does not rely on VS Code's LM registry UI.
                    this.postToHost(state, { type: 'chatAppend', role: 'tool', text: '打开 Tripilot Settings → Models…' });
                    // Open Settings immediately; do any network checks in the background.
                    TripilotSettingsPanel.show(this.context, this.mcpManager, 'models');
                    void (async () => {
                        try {
                            const cfg = this.getTrilcConfig();
                            this.lastTrilcModels = await this.trilcClient.listModels(cfg);
                            await this.refreshModelsAndPost(state);
                        }
                        catch (err) {
                            const message = err instanceof Error ? err.message : String(err);
                            this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `加载 TriLC 模型失败：${message}` });
                        }
                    })();
                    return;
                }
                catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    try {
                        this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `打开模型管理失败：${message}` });
                    }
                    catch {
                        // ignore
                    }
                    // Always keep a safe UI fallback to avoid host restarts.
                    TripilotSettingsPanel.show(this.context, this.mcpManager, 'models');
                    return;
                }
            }
            default:
                this.postToHost(state, { type: 'chatAppend', role: 'tool', text: `UI action (stub): ${action}` });
                return;
        }
    }
    postAny(message) {
        for (const w of Array.from(this.webviews)) {
            try {
                void w.postMessage(message);
            }
            catch {
                this.webviews.delete(w);
            }
        }
    }
    async syncAgentProfileFromSettings(agentProfileId) {
        const id = String(agentProfileId ?? '').trim();
        if (!id)
            return;
        if (this.selectedAgentProfileId === id)
            return;
        // Reuse the canonical path (updates prompts, persists globalState, triggers ask&study sandbox init, etc.).
        await this.handleUiAction(this.hostStates.sidebar, 'setAgentProfile', { id });
    }
    setAndPostStatus(state, status, detail) {
        state.status = status;
        state.statusDetail = detail;
        this.postToHost(state, { type: 'chatSetStatus', status, detail });
    }
    postToHost(state, message) {
        const w = state.webview;
        if (!w)
            return;
        try {
            void w.postMessage(message);
        }
        catch {
            // Drop broken webview reference.
            if (state.webview === w)
                state.webview = undefined;
            this.webviews.delete(w);
        }
    }
    async refreshModelsAndPost(state) {
        try {
            const cfg = this.getTrilcConfig();
            this.lastTrilcModels = await this.trilcClient.listModels(cfg);
            if (!this.lastTrilcModels.length) {
                const text = 'TriLC /v1/models 返回空列表，因此模型菜单只会显示 Auto。' +
                    '\n请确认 TriLC 服务已启动且 /v1/models 端点可访问。';
                if (state) {
                    this.postToHost(state, { type: 'chatAppend', role: 'tool', text });
                }
                else {
                    void vscode.window.showWarningMessage(text);
                }
            }
            // If Auto is visible and we don't yet have a discount label, prefetch /models/session in background.
            this.prefetchTrilcAutoDiscount(state);
            const built = this.buildTrilcDirectLmModels();
            const models = built.models;
            if (!this.selectedModelId) {
                this.selectedModelId = models[0]?.id;
                if (this.selectedModelId) {
                    await this.context.globalState.update('tripilot.selectedModelId', this.selectedModelId);
                }
            }
            if (this.selectedModelId) {
                const visibleIdsNow = new Set(models.map((m) => m.id));
                if (!visibleIdsNow.has(this.selectedModelId)) {
                    this.selectedModelId = models[0]?.id;
                    if (this.selectedModelId) {
                        await this.context.globalState.update('tripilot.selectedModelId', this.selectedModelId);
                    }
                }
            }
            this.postAny({
                type: 'lmModels',
                models,
                selectedModelId: this.selectedModelId,
                provider: 'trilc-direct',
                runtimeCount: this.lastTrilcModels.length,
                filteredCount: models.length
            });
            return;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            const text = `无法读取可用语言模型：${message}`;
            if (state) {
                this.postToHost(state, { type: 'chatAppend', role: 'tool', text });
            }
            else {
                void vscode.window.showWarningMessage(text);
            }
        }
    }
    getSelectedModel() {
        if (!this.lastModels.length)
            return undefined;
        if (this.selectedModelId && this.selectedModelId !== 'auto') {
            const exact = this.lastModels.find((m) => m.id === this.selectedModelId);
            if (exact)
                return exact;
        }
        return this.lastModels[0];
    }
    getEnabledToolNames() {
        const out = new Set();
        for (const t of getToolDefinitions()) {
            const name = t.function.name;
            if (!OPTIONAL_TOOL_NAMES.has(name) || this.enabledTools.has(name)) {
                out.add(name);
            }
        }
        return out;
    }
    getSelectedTrilcModelId() {
        if (this.selectedModelId)
            return this.selectedModelId;
        // Best-effort fallback if selection wasn't initialized.
        return this.lastTrilcModels[0]?.id ?? 'auto';
    }
    getFallbackNonAutoTrilcModelId() {
        // Prefer DeepSeek models (TriLC default model family). Fall back to any non-auto model.
        const prefer = ['deepseek-v4-pro', 'deepseek-chat', 'deepseek-reasoner'];
        for (const id of prefer) {
            if (this.lastTrilcModels.some((m) => m.id === id))
                return id;
        }
        return this.lastTrilcModels.find((m) => m.id && m.id !== 'auto')?.id;
    }
    convertTrilcConversationToMessages(conversation) {
        const messages = [];
        for (const m of conversation) {
            if (m.role === 'tool') {
                // Tool result: wrap as user message with tool_result content block
                messages.push({
                    role: 'user',
                    content: [{
                            type: 'tool_result',
                            tool_use_id: m.tool_call_id,
                            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                        }],
                });
            }
            else if (m.role === 'assistant' && m.tool_calls && m.tool_calls.length > 0) {
                // Assistant with tool calls: convert to content blocks
                const blocks = [];
                if (m.content && typeof m.content === 'string' && m.content.trim()) {
                    blocks.push({ type: 'text', text: m.content });
                }
                for (const tc of m.tool_calls) {
                    blocks.push({
                        type: 'tool_use',
                        id: tc.id,
                        name: tc.function.name,
                        input: (() => { try {
                            return JSON.parse(tc.function.arguments);
                        }
                        catch {
                            return {};
                        } })(),
                    });
                }
                messages.push({ role: 'assistant', content: blocks });
            }
            else {
                // Plain user/assistant text message
                messages.push({
                    role: (m.role === 'assistant' ? 'assistant' : 'user'),
                    content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                });
            }
        }
        return messages;
    }
    // W30 Architecture Fix: executeViaTriLCClient replaces runTrilcDirectRequest.
    // All LLM communication and tool execution is delegated to TriLC daemon.
    // TriPilot only displays the SSE stream events — zero local execution.
    async executeViaTriLCClient(state, userText) {
        const systemPrompt = state.trilcSystemInstruction ?? undefined;
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
        const submitReq = {
            message: userText,
            systemPrompt,
            context: {
                workspaceRoot,
            },
        };
        let didStreamAssistant = false;
        let streamedText = '';
        let conversationId;
        let taskError;
        try {
            // ① Submit task to TriLC daemon
            const submitRes = await this.triLcClient.submitTask(submitReq, state.abortController?.signal);
            conversationId = submitRes.sessionId;
            // ② Open SSE stream and pipe events to webview
            const callbacks = {
                onDelta: (content) => {
                    if (!didStreamAssistant) {
                        didStreamAssistant = true;
                        state.inProgressAssistantText = '';
                        this.postToHost(state, { type: 'chatAssistantStart', initialText: '' });
                    }
                    state.inProgressAssistantText = (state.inProgressAssistantText ?? '') + content;
                    streamedText += content;
                    this.postToHost(state, { type: 'chatAssistantDelta', delta: content });
                },
                onToolUse: (toolName, input) => {
                    const invocationId = `call_${crypto.randomUUID()}`;
                    this.postToHost(state, {
                        type: 'chatToolInvocationBegin',
                        invocationId,
                        toolName,
                        inputPreview: JSON.stringify(input).slice(0, 200),
                    });
                },
                onToolResult: (toolName, output, durationMs) => {
                    // Note: invocationId matching is best-effort since TriLC doesn't echo it back.
                    const shortId = (conversationId ?? 'unknown').slice(-8);
                    this.postToHost(state, {
                        type: 'chatToolInvocationEnd',
                        invocationId: `call_${shortId}`,
                        toolName,
                        ok: !output.startsWith('Error:'),
                        outputPreview: output.slice(0, 200),
                        outputFull: output,
                        durationMs,
                    });
                },
                onTaskDone: (summary) => {
                    if (didStreamAssistant) {
                        this.postToHost(state, { type: 'chatAssistantEnd' });
                        state.inProgressAssistantText = undefined;
                    }
                },
                onTaskError: (error) => {
                    taskError = error;
                    if (didStreamAssistant) {
                        this.postToHost(state, { type: 'chatAssistantEnd' });
                        state.inProgressAssistantText = undefined;
                    }
                    this.postToHost(state, { type: 'chatSetStatus', status: 'error', detail: error });
                },
            };
            await this.triLcClient.streamSession(conversationId, callbacks, state.abortController?.signal);
            if (taskError)
                throw new Error(taskError);
        }
        catch (err) {
            if (state.abortController?.signal.aborted) {
                // User cancelled — clean up gracefully
                if (didStreamAssistant) {
                    this.postToHost(state, { type: 'chatAssistantEnd' });
                    state.inProgressAssistantText = undefined;
                }
                const cancelMsg = '[已取消]';
                this.postToHost(state, { type: 'chatAppend', role: 'assistant', text: cancelMsg });
                state.transcript.push({ role: 'assistant', text: cancelMsg });
                return;
            }
            throw err;
        }
        // Finalize: append assistant response & checkpoint
        const displayText = streamedText || '';
        if (!didStreamAssistant && displayText) {
            this.postToHost(state, { type: 'chatAppend', role: 'assistant', text: displayText });
        }
        state.transcript.push({ role: 'assistant', text: displayText });
        state.trilcConversation ??= [];
        state.trilcConversation.push({ role: 'user', content: userText });
        state.trilcConversation.push({ role: 'assistant', content: displayText });
        await this.appendHistory(state, {
            kind: 'assistant_message',
            text: displayText,
            profileId: this.selectedAgentProfileId,
            modelId: this.selectedModelId,
        });
        this.appendCheckpoint(state);
    }
    async handleUserMessage(text, state) {
        if (!text.trim())
            return;
        try {
            await this.ensureSelectedAgentContractLoaded();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.setAndPostStatus(state, 'error', message);
            this.postToHost(state, { type: 'chatAppend', role: 'assistant', text: `Error: ${message}` });
            return;
        }
        // Copilot-like: any new user message invalidates the last restore/redo opportunity.
        if (this.lastCheckpointRestoreByHost[state.kind]) {
            this.lastCheckpointRestoreByHost[state.kind] = undefined;
            this.postToHost(state, { type: 'checkpointRedoClear' });
        }
        // Copilot-like: if there is a pending edit approval, treat short confirmations as UI actions.
        // This avoids awkward multi-turn "reply CONFIRM" workflows and keeps approvals in the review flow.
        try {
            const pending = this.pendingEditApproval;
            if (pending && pending.originHost === state.kind) {
                const t = String(text ?? '').trim();
                const low = t.toLowerCase();
                const isPreview = /^(preview|预览|查看|看一下)$/i.test(t);
                const isApply = /^(ok|okay|yes|y|apply|确认|同意|应用|执行|继续|好|可以|行)$/i.test(t);
                const isCancel = /^(no|n|cancel|取消|不要|不用|算了|停止)$/i.test(t);
                if (isPreview || isApply || isCancel) {
                    await this.handleEditApprovalAction(state, {
                        type: 'editApprovalAction',
                        requestId: pending.requestId,
                        action: isPreview ? 'preview' : isApply ? 'apply' : 'cancel'
                    });
                    return;
                }
            }
        }
        catch {
            // ignore
        }
        // Copilot-like: post-apply review flow also supports short inputs (Undo/Keep/Preview).
        try {
            const lastId = this.lastEditReviewRequestIdByHost[state.kind];
            if (lastId) {
                const pending = this.pendingEditReviews.get(lastId);
                if (pending && pending.originHost === state.kind) {
                    const t = String(text ?? '').trim();
                    const isPreview = /^(preview|预览|查看|看一下)$/i.test(t);
                    const isUndo = /^(undo|撤销|回滚|还原|撤回)$/i.test(t);
                    const isKeep = /^(keep|保留|保存|确认|好|可以|行|继续)$/i.test(t);
                    if (isPreview || isUndo || isKeep) {
                        await this.handleEditReviewAction(state, {
                            type: 'editReviewAction',
                            requestId: lastId,
                            action: isPreview ? 'preview' : isUndo ? 'undo' : 'keep'
                        });
                        return;
                    }
                }
            }
        }
        catch {
            // ignore
        }
        state.isBusy = true;
        state.inProgressAssistantText = undefined;
        // Treat current chips as draft tokens for this request (Copilot-like per-request scope).
        const draftToolRefs = Array.isArray(state.lastToolReferences) ? state.lastToolReferences.slice() : [];
        const draftHadAttachments = Array.isArray(state.contextAttachments) && state.contextAttachments.length > 0;
        await this.appendHistory(state, {
            kind: 'user_message',
            text,
            profileId: this.selectedAgentProfileId,
            modelId: this.selectedModelId
        });
        this.ensureSystemInstructionUpToDate(state);
        this.ensureTrilcSystemInstructionUpToDate(state);
        const promptSyntax = this.parsePromptSyntax(text);
        const directives = this.parseToolDirectives(text);
        // Compatibility: support #tool:<name> (reference repo supports it), but prefer Copilot-style #<toolName>.
        for (const t of promptSyntax.toolRefs) {
            const name = String(t).trim();
            if (!name)
                continue;
            directives.toolReferences.add(name);
            // Allow #tool:server.tool to imply enabling that MCP server.
            const dot = name.indexOf('.');
            if (dot > 0) {
                directives.serverReferences.add(name.slice(0, dot));
            }
        }
        for (const t of draftToolRefs) {
            const name = String(t).trim();
            if (!name)
                continue;
            directives.toolReferences.add(name);
            const dot = name.indexOf('.');
            if (dot > 0) {
                directives.serverReferences.add(name.slice(0, dot));
            }
        }
        state.lastToolReferences = Array.from(directives.toolReferences)
            .map((s) => String(s).trim())
            .filter(Boolean)
            .sort();
        this.postToolChips(state);
        await this.attachFilesFromPromptRefs(state, promptSyntax.fileRefs);
        const effectiveText = this.buildUserTextWithContext(state, promptSyntax.cleanText);
        this.postToHost(state, { type: 'chatAppend', role: 'user', text });
        state.transcript.push({ role: 'user', text });
        this.setAndPostStatus(state, 'thinking');
        // Clear draft chips after capturing them into this request.
        if (draftToolRefs.length) {
            state.lastToolReferences = [];
            this.postToolChips(state);
        }
        if (draftHadAttachments) {
            state.contextAttachments = [];
            this.postContextChips(state);
        }
        if (promptSyntax.toolRefs.length > 0) {
            const warn = '提示：检测到 #tool:<name> 兼容语法。建议使用 Copilot 风格的 #<toolName>（例如 #fetch https://...、#githubRepo owner/repo）。';
            this.postToHost(state, { type: 'chatAppend', role: 'tool', text: warn });
            state.transcript.push({ role: 'tool', text: warn });
        }
        state.trilcConversation ??= [];
        state.trilcConversation.push({ role: 'user', content: effectiveText });
        state.abortController?.abort();
        state.abortController = new AbortController();
        state.lmCancelSource?.cancel();
        state.lmCancelSource?.dispose();
        state.lmCancelSource = new vscode.CancellationTokenSource();
        try {
            const cfg = this.getTrilcConfig();
            if (!cfg.baseUrl) {
                throw new Error('未配置 tripilot.trilcDirect.baseUrl');
            }
            // W30 Architecture Fix: delegate to TriLC daemon via tasks/submit + SSE stream.
            await this.executeViaTriLCClient(state, effectiveText);
            this.setAndPostStatus(state, 'idle');
            return;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            await this.appendHistory(state, {
                kind: 'error',
                message: message,
                profileId: this.selectedAgentProfileId,
                modelId: this.selectedModelId
            });
            this.setAndPostStatus(state, 'error', message);
            this.postToHost(state, { type: 'chatAppend', role: 'assistant', text: `Error: ${message}` });
            state.transcript.push({ role: 'assistant', text: `Error: ${message}` });
            this.appendCheckpoint(state);
        }
        finally {
            state.isBusy = false;
            state.inProgressAssistantText = undefined;
        }
    }
    getHtml(webview, host = 'sidebar') {
        const nonce = getNonce();
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const codiconUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'node_modules', '@vscode', 'codicons', 'dist', 'codicon.css'));
        return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} https:; font-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="${codiconUri}" />
	<link rel="stylesheet" href="${styleUri}" />
	<title></title>
</head>

<body class="host-${host}">
	<div class="app">
		<div class="topbar" role="toolbar" aria-label="Chat toolbar">
			<div class="topbarLeft">
				<div class="topbarTitle">聊天</div>
			</div>
			<div class="topbarRight">
				<button class="icon ghost" id="btnHistory" aria-label="历史记录" title="历史记录">
					<span class="codicon codicon-history"></span>
				</button>
				<button class="icon ghost" id="btnTopNew" aria-label="New" title="New">
					<span class="codicon codicon-add"></span>
					<span class="codicon codicon-chevron-down"></span>
				</button>
				<button class="icon ghost" id="btnTopSettings" aria-label="Settings" title="Settings">
					<span class="codicon codicon-settings-gear"></span>
				</button>
				<button class="icon ghost" id="btnTopMore" aria-label="More" title="More">
					<span class="codicon codicon-ellipsis"></span>
				</button>
			</div>
			<div class="menu menuTop hidden" id="topNewMenu" role="menu" aria-label="New menu">
				<button class="menuItem" data-action="newSession" role="menuitem">新建聊天</button>
				<button class="menuItem" data-action="newChatEditor" role="menuitem">新建聊天编辑器</button>
				<button class="menuItem" data-action="newChatWindow" role="menuitem">新聊天窗口</button>
			</div>
			<div class="menu menuTop hidden" id="topMoreMenu" role="menu" aria-label="More menu">
				<button class="menuItem" data-action="moveToEditor" role="menuitem">将聊天移动到编辑器区域</button>
				<button class="menuItem" data-action="moveToNewWindow" role="menuitem">将聊天移动到新窗口</button>
				<div class="menuDivider" role="separator"></div>
				<button class="menuItem" data-action="showChat" role="menuitem">显示聊天...</button>
				<div class="menuDivider" role="separator"></div>
				<button class="menuItem" data-action="showChatDebug" role="menuitem">显示聊天调试视图</button>
				<button class="menuItem" data-action="defaultView" role="menuitem">默认显示视图</button>
			</div>
		</div>

		<div class="approval hidden" id="approval" role="region" aria-label="Edit approval">
			<div class="approval-text" id="approvalText"></div>
			<div class="approval-files" id="approvalFiles"></div>
			<div class="approval-actions">
				<button class="ghost" id="approvalPreview">Preview</button>
				<button id="approvalApply">Apply</button>
				<button class="ghost" id="approvalCancel">Cancel</button>
			</div>
		</div>
		<div class="messages" id="messages" role="log" aria-live="polite"></div>
		<div class="composer">
			<div class="composerBox">
				<div class="composerTop">
					<button class="contextButton ghost" id="btnAddContext" aria-label="Add context" title="添加上下文">
						<span class="codicon codicon-clippy"></span>
						<span class="contextButtonText">添加上下文...</span>
					</button>
					<div class="composerTokens" aria-label="Prompt tokens">
						<div class="contextChips" id="contextChips" aria-label="Context"></div>
						<div class="contextChips toolChips" id="toolChips" aria-label="Tools"></div>
					</div>
				</div>
				<textarea id="input" rows="2" placeholder="描述下一步要构建的内容" aria-label="Chat input"></textarea>
				<div class="hashSuggest hidden" id="hashSuggest" role="listbox" aria-label="Suggestions"></div>
				<div class="composerBottom" role="toolbar" aria-label="Composer toolbar">
					<div class="bottomLeft">
						<button class="menuButton ghost" id="btnAgentMenu" aria-label="Agent" title="Agent">
							<span class="menuLabel" id="agentLabel">Agent</span>
							<span class="codicon codicon-chevron-down"></span>
						</button>
						<button class="menuButton ghost" id="btnModelMenu" aria-label="Model" title="Model">
							<span class="menuLabel" id="modelLabel">Model</span>
							<span class="codicon codicon-chevron-down"></span>
						</button>
						<button class="icon ghost" id="btnTools" aria-label="Tools" title="Tools（点击打开设置；Shift+点击快速开关）">
							<span class="codicon codicon-tools"></span>
						</button>
					</div>
					<div class="bottomCenter">
						<label class="tempSessionToggle" id="tempSessionToggleWrap" title="开启临时会话（不保存聊天记录）" aria-label="Temporary session">
							<input type="checkbox" id="tempSessionToggle" />
							<span class="tempSessionPill" id="tempSessionPill">临时会话</span>
						</label>
					</div>
					<div class="bottomRight">
						<button class="icon ghost" id="btnContinue" aria-label="Continue chat" title="Continue chat">
							<span class="codicon codicon-redo"></span>
						</button>
						<button id="send" class="icon send" title="Send" aria-label="Send">
							<span class="codicon codicon-send"></span>
						</button>
					</div>
				</div>

				<div class="menu hidden" id="agentMenu" role="menu" aria-label="Agent menu"></div>
					<div class="menu menuModel hidden" id="modelMenu" role="menu" aria-label="Model menu">
						<button class="menuItem" data-value="manageModels" role="menuitem">管理模型...</button>
					</div>
				<div class="menu hidden" id="toolsMenu" role="menu" aria-label="Tools menu">
					${Array.from(OPTIONAL_TOOL_NAMES.values())
            .sort((a, b) => a.localeCompare(b))
            .map((name) => `<label class="menuCheck"><input type="checkbox" data-tool="${name}" />${name}</label>`)
            .join('')}
				</div>
			</div>
		</div>
		<div class="status" id="status"></div>
	</div>
		<!-- Sessions overlay: Copilot-like slide-in panel, 默认 hidden -->
		<div class="sessionsOverlay hidden" id="sessionsOverlay" role="region" aria-label="会话历史">
			<div class="sessionsOverlayHeader">
				<span class="sessionsOverlayTitle">会话历史</span>
				<button class="icon ghost" id="btnSessionsOverlayClose" aria-label="关闭" title="关闭">
					<span class="codicon codicon-close"></span>
				</button>
			</div>
			<div class="sessions" id="sessions" role="region" aria-label="Sessions">
				<div class="sessionNav hidden" id="sessionNav" role="toolbar" aria-label="Session navigation">
					<button class="icon ghost" id="btnSessionBack" aria-label="Back" title="Back">
						<span class="codicon codicon-arrow-left"></span>
					</button>
					<div class="sessionNavTitle" id="sessionNavTitle"></div>
				</div>
				<div class="sessionsHeader">
					<div class="sessionsHeaderLeft" id="sessionsHeaderText">RECENT SESSIONS</div>
					<div class="sessionsHeaderRight" id="sessionsHeaderActions">
						<button class="icon ghost hidden" id="btnSessionsRefresh" aria-label="Refresh" title="Refresh"><span class="codicon codicon-refresh"></span></button>
						<button class="icon ghost hidden" id="btnSessionsSearch" aria-label="Search" title="Search"><span class="codicon codicon-search"></span></button>
						<button class="icon ghost hidden" id="btnSessionsFilter" aria-label="Filter" title="Filter"><span class="codicon codicon-filter"></span></button>
						<button class="icon ghost" id="btnSessionsView" aria-label="View" title="View"><span class="codicon codicon-layout"></span></button>
					</div>
				</div>
				<div class="sessionsList" id="sessionsList"></div>
				<button class="sessionsToggle ghost" id="btnSessionsToggle">Show All Sessions</button>
			</div>
		</div>
		<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }
    async refreshSessionsAndPost() {
        const sidebar = this.hostStates.sidebar;
        if (!sidebar.webview)
            return;
        const isEnabled = this.isChatHistoryEnabled();
        if (!isEnabled) {
            this.postToHost(sidebar, { type: 'sessions', isHistoryEnabled: false, sessions: [] });
            return;
        }
        const archivedRaw = this.context.globalState.get('tripilot.archivedSessionIds') ?? [];
        const archived = new Set(archivedRaw.map((s) => String(s).trim()).filter(Boolean));
        const sessions = await this.listStoredHistorySessions();
        const items = sessions
            .filter((s) => !archived.has(s.sessionId))
            .map((s) => ({
            sessionId: s.sessionId,
            title: s.title,
            preview: s.lastPreview,
            relativeTime: this.formatRelativeTime(s.lastAt || s.startedAt),
            isActive: s.sessionId === sidebar.historySessionId
        }));
        this.postToHost(sidebar, { type: 'sessions', isHistoryEnabled: true, sessions: items });
    }
    async requestEditsApproval(state, args) {
        // If webview isn't available, fall back to a modal (best-effort).
        if (!state.webview) {
            const picked = await vscode.window.showInformationMessage(`Tripilot wants to apply ${args.summary.editCount} edit(s) to ${args.summary.fileCount} file(s).`, { modal: true }, 'Apply', 'Cancel');
            return picked === 'Apply' ? 'apply' : 'cancel';
        }
        // If there is an existing pending approval, cancel it.
        this.resolvePendingEditApproval('cancel');
        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const files = args.previews.map((p) => ({ relativePath: p.relativePath, editCount: p.editCount }));
        const { additions, deletions } = computeDiffStats(args.previews);
        const summaryText = `Tripilot wants to apply ${args.summary.editCount} edit(s) to ${args.summary.fileCount} file(s).`;
        void this.appendHistory(state, {
            kind: 'approval_request',
            requestId,
            summary: args.summary,
            files,
            profileId: this.selectedAgentProfileId,
            modelId: this.selectedModelId
        });
        this.pendingEditApproval = {
            requestId,
            originHost: state.kind,
            resolve: () => {
                // placeholder; replaced below
            },
            previews: args.previews,
            canPreview: args.canPreview
        };
        this.postToHost(state, {
            type: 'editApprovalRequest',
            requestId,
            summary: summaryText,
            files,
            diffStats: { filesChanged: args.summary.fileCount, additions, deletions },
            canPreview: args.canPreview
        });
        return await new Promise((resolve) => {
            if (!this.pendingEditApproval || this.pendingEditApproval.requestId !== requestId) {
                resolve('cancel');
                return;
            }
            this.pendingEditApproval.resolve = (v) => {
                void this.appendHistory(state, {
                    kind: 'approval_decision',
                    requestId,
                    decision: v,
                    profileId: this.selectedAgentProfileId,
                    modelId: this.selectedModelId
                });
                this.postToHost(state, { type: 'editApprovalClear', requestId });
                this.pendingEditApproval = undefined;
                resolve(v);
            };
        });
    }
    resolvePendingEditApproval(result) {
        if (!this.pendingEditApproval)
            return;
        try {
            this.pendingEditApproval.resolve(result);
        }
        catch {
            // ignore
        }
    }
    async handleEditApprovalAction(state, msg) {
        const pending = this.pendingEditApproval;
        if (!pending)
            return;
        if (pending.originHost !== state.kind)
            return;
        if (pending.requestId !== msg.requestId)
            return;
        if (msg.action === 'preview') {
            if (!pending.canPreview)
                return;
            await previewEditsInDiff(pending.previews);
            return;
        }
        if (msg.action === 'apply') {
            pending.resolve('apply');
            return;
        }
        pending.resolve('cancel');
    }
    postEditsReview(state, args) {
        if (!state.webview)
            return;
        const requestId = String(args.requestId || '');
        if (!requestId)
            return;
        // Record in the applied edits timeline (used by checkpoints/restore).
        const seq = ++this.appliedEditSeq;
        this.appliedEditsTimelineByHost[state.kind].push({
            seq,
            requestId,
            previews: args.previews,
            createdAt: Date.now()
        });
        this.pendingEditReviews.set(requestId, {
            originHost: state.kind,
            previews: args.previews,
            canPreview: Boolean(args.canPreview),
            createdAt: Date.now()
        });
        this.lastEditReviewRequestIdByHost[state.kind] = requestId;
        const files = args.previews.map((p) => ({ relativePath: p.relativePath, editCount: p.editCount }));
        const { additions, deletions } = computeDiffStats(args.previews);
        const summaryText = `已应用 ${args.summary.editCount} 处修改（${args.summary.fileCount} 个文件）。`;
        this.postToHost(state, {
            type: 'editReviewRequest',
            requestId,
            summary: summaryText,
            files,
            diffStats: { filesChanged: args.summary.fileCount, additions, deletions },
            canPreview: Boolean(args.canPreview)
        });
    }
    appendCheckpoint(state) {
        const checkpointId = createUuid();
        const lastEditSeq = this.appliedEditsTimelineByHost[state.kind].length
            ? this.appliedEditsTimelineByHost[state.kind][this.appliedEditsTimelineByHost[state.kind].length - 1].seq
            : 0;
        const conversationSnapshot = [...state.conversation];
        let copilotConversationSnapshot = undefined;
        if (state.trilcConversation) {
            try {
                copilotConversationSnapshot = structuredClone(state.trilcConversation);
            }
            catch {
                copilotConversationSnapshot = [...state.trilcConversation];
            }
        }
        state.transcript.push({ role: 'checkpoint', checkpointId });
        this.checkpointsById.set(checkpointId, {
            originHost: state.kind,
            transcriptIndex: state.transcript.length,
            lastEditSeq,
            conversationSnapshot,
            copilotConversationSnapshot,
            createdAt: Date.now()
        });
        this.postToHost(state, { type: 'chatCheckpoint', checkpointId });
    }
    async handleCheckpointAction(state, msg) {
        const checkpointId = String(msg.checkpointId || '').trim();
        if (!checkpointId)
            return;
        if (msg.action === 'redo') {
            const rec = this.lastCheckpointRestoreByHost[state.kind];
            const token = String(msg.redoToken ?? '').trim();
            if (!rec)
                return;
            if (rec.restoredToCheckpointId !== checkpointId)
                return;
            if (!token || token !== rec.redoToken)
                return;
            // Abort any in-flight run for this host.
            try {
                state.abortController?.abort();
            }
            catch {
                // ignore
            }
            state.abortController = undefined;
            try {
                state.lmCancelSource?.cancel();
                state.lmCancelSource?.dispose();
            }
            catch {
                // ignore
            }
            state.lmCancelSource = undefined;
            state.isBusy = false;
            state.inProgressAssistantText = undefined;
            if (this.pendingEditApproval?.originHost === state.kind) {
                this.resolvePendingEditApproval('cancel');
            }
            // Re-apply edits that were undone during restore.
            const entriesToRedo = rec.appliedTimelineBefore
                .filter((e) => e.seq > rec.checkpointLastEditSeq)
                .sort((a, b) => a.seq - b.seq);
            for (const entry of entriesToRedo) {
                for (const p of entry.previews) {
                    if (p.kind === 'delete') {
                        try {
                            await vscode.workspace.fs.delete(p.uri, { recursive: false, useTrash: true });
                        }
                        catch {
                            // ignore
                        }
                        continue;
                    }
                    await ensureParentDir(p.uri);
                    await vscode.workspace.fs.writeFile(p.uri, Buffer.from(p.updated ?? '', 'utf8'));
                }
            }
            // Restore applied edits timeline and edit review handlers.
            this.appliedEditsTimelineByHost[state.kind] = [...rec.appliedTimelineBefore];
            for (const entry of entriesToRedo) {
                this.pendingEditReviews.set(entry.requestId, {
                    originHost: state.kind,
                    previews: entry.previews,
                    canPreview: true,
                    createdAt: entry.createdAt
                });
                this.lastEditReviewRequestIdByHost[state.kind] = entry.requestId;
            }
            // Restore checkpoints that were deleted during restore.
            for (const item of rec.removedCheckpoints) {
                this.checkpointsById.set(item.id, item.rec);
            }
            // Restore transcript and conversations.
            state.transcript = [...rec.transcriptBefore];
            state.conversation = [...rec.conversationBefore];
            if (rec.copilotConversationBefore) {
                try {
                    state.trilcConversation = structuredClone(rec.copilotConversationBefore);
                }
                catch {
                    state.trilcConversation = [...rec.copilotConversationBefore];
                }
            }
            this.setAndPostStatus(state, 'idle');
            // Clear redo offer after using it.
            this.lastCheckpointRestoreByHost[state.kind] = undefined;
            this.postToHost(state, { type: 'checkpointRedoClear' });
            // Re-render transcript.
            this.postToHost(state, { type: 'chatReset' });
            for (const item of state.transcript) {
                if (item.role === 'checkpoint') {
                    this.postToHost(state, { type: 'chatCheckpoint', checkpointId: item.checkpointId });
                    continue;
                }
                const msgItem = item;
                this.postToHost(state, { type: 'chatAppend', role: msgItem.role, text: msgItem.text });
            }
            // Re-post edit review cards so their Undo/Keep actions remain available after redo.
            for (const entry of entriesToRedo) {
                const files = entry.previews.map((p) => ({ relativePath: p.relativePath, editCount: p.editCount }));
                const editCount = files.reduce((n, f) => n + (Number(f.editCount) || 0), 0);
                const fileCount = new Set(files.map((f) => f.relativePath)).size;
                const summaryText = `已应用 ${editCount} 处修改（${fileCount} 个文件）。`;
                this.postToHost(state, {
                    type: 'editReviewRequest',
                    requestId: entry.requestId,
                    summary: summaryText,
                    files,
                    canPreview: true
                });
            }
            return;
        }
        if (msg.action !== 'restore')
            return;
        const cp = this.checkpointsById.get(checkpointId);
        if (!cp)
            return;
        if (cp.originHost !== state.kind)
            return;
        // Prepare redo snapshot BEFORE mutating anything.
        const redoToken = createUuid();
        const transcriptBefore = [...state.transcript];
        const conversationBefore = [...state.conversation];
        let copilotConversationBefore = undefined;
        if (state.trilcConversation) {
            try {
                copilotConversationBefore = structuredClone(state.trilcConversation);
            }
            catch {
                copilotConversationBefore = [...state.trilcConversation];
            }
        }
        const timelineBefore = [...this.appliedEditsTimelineByHost[state.kind]];
        const removedCheckpoints = [];
        for (const [id, rec] of Array.from(this.checkpointsById.entries())) {
            if (rec.originHost !== state.kind)
                continue;
            if (rec.createdAt > cp.createdAt)
                removedCheckpoints.push({ id, rec });
        }
        // Abort any in-flight run for this host.
        try {
            state.abortController?.abort();
        }
        catch {
            // ignore
        }
        state.abortController = undefined;
        try {
            state.lmCancelSource?.cancel();
            state.lmCancelSource?.dispose();
        }
        catch {
            // ignore
        }
        state.lmCancelSource = undefined;
        state.isBusy = false;
        state.inProgressAssistantText = undefined;
        if (this.pendingEditApproval?.originHost === state.kind) {
            this.resolvePendingEditApproval('cancel');
        }
        // Undo applied edits after the checkpoint.
        const timeline = this.appliedEditsTimelineByHost[state.kind];
        const toUndo = timeline.filter((e) => e.seq > cp.lastEditSeq).sort((a, b) => b.seq - a.seq);
        for (const entry of toUndo) {
            for (const p of entry.previews) {
                if (p.kind === 'add') {
                    try {
                        await vscode.workspace.fs.delete(p.uri, { recursive: false, useTrash: true });
                    }
                    catch {
                        // ignore
                    }
                    continue;
                }
                await ensureParentDir(p.uri);
                await vscode.workspace.fs.writeFile(p.uri, Buffer.from(p.original ?? '', 'utf8'));
            }
            // Clear any existing review card for this request id.
            this.pendingEditReviews.delete(entry.requestId);
            if (this.lastEditReviewRequestIdByHost[state.kind] === entry.requestId) {
                this.lastEditReviewRequestIdByHost[state.kind] = undefined;
            }
            this.postToHost(state, { type: 'editReviewClear', requestId: entry.requestId });
        }
        this.appliedEditsTimelineByHost[state.kind] = timeline.filter((e) => e.seq <= cp.lastEditSeq);
        // Truncate transcript and restore model conversations.
        state.transcript = state.transcript.slice(0, Math.max(0, Math.min(cp.transcriptIndex, state.transcript.length)));
        state.conversation = [...cp.conversationSnapshot];
        if (cp.copilotConversationSnapshot) {
            try {
                state.trilcConversation = structuredClone(cp.copilotConversationSnapshot);
            }
            catch {
                state.trilcConversation = [...cp.copilotConversationSnapshot];
            }
        }
        this.setAndPostStatus(state, 'idle');
        // Drop checkpoints after this point for this host (they no longer exist in transcript).
        for (const [id, rec] of Array.from(this.checkpointsById.entries())) {
            if (rec.originHost !== state.kind)
                continue;
            if (rec.createdAt > cp.createdAt) {
                this.checkpointsById.delete(id);
            }
        }
        // Re-render transcript.
        this.postToHost(state, { type: 'chatReset' });
        for (const item of state.transcript) {
            if (item.role === 'checkpoint') {
                this.postToHost(state, { type: 'chatCheckpoint', checkpointId: item.checkpointId });
                continue;
            }
            const msgItem = item;
            this.postToHost(state, { type: 'chatAppend', role: msgItem.role, text: msgItem.text });
        }
        // Offer redo (Copilot-like): available right after restoring.
        this.lastCheckpointRestoreByHost[state.kind] = {
            restoredToCheckpointId: checkpointId,
            checkpointLastEditSeq: cp.lastEditSeq,
            redoToken,
            createdAt: Date.now(),
            transcriptBefore,
            conversationBefore,
            copilotConversationBefore,
            appliedTimelineBefore: timelineBefore,
            removedCheckpoints
        };
        this.postToHost(state, { type: 'checkpointRedoOffer', checkpointId, redoToken });
    }
    async handleEditReviewAction(state, msg) {
        const requestId = String(msg.requestId || '');
        if (!requestId)
            return;
        const pending = this.pendingEditReviews.get(requestId);
        if (!pending)
            return;
        if (pending.originHost !== state.kind)
            return;
        if (msg.action === 'preview') {
            if (!pending.canPreview)
                return;
            await previewEditsInDiff(pending.previews.map((p) => ({
                relativePath: p.relativePath,
                uri: p.uri,
                original: p.original,
                updated: p.updated,
                editCount: p.editCount
            })));
            return;
        }
        if (msg.action === 'keep') {
            this.pendingEditReviews.delete(requestId);
            if (this.lastEditReviewRequestIdByHost[state.kind] === requestId) {
                this.lastEditReviewRequestIdByHost[state.kind] = undefined;
            }
            this.postToHost(state, { type: 'editReviewClear', requestId });
            return;
        }
        // undo
        for (const p of pending.previews) {
            if (p.kind === 'add') {
                try {
                    await vscode.workspace.fs.delete(p.uri, { recursive: false, useTrash: true });
                }
                catch {
                    // ignore
                }
                continue;
            }
            await ensureParentDir(p.uri);
            await vscode.workspace.fs.writeFile(p.uri, Buffer.from(p.original ?? '', 'utf8'));
        }
        this.pendingEditReviews.delete(requestId);
        if (this.lastEditReviewRequestIdByHost[state.kind] === requestId) {
            this.lastEditReviewRequestIdByHost[state.kind] = undefined;
        }
        this.postToHost(state, { type: 'editReviewClear', requestId });
    }
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function createUuid() {
    try {
        return typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    catch {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}
function extractFirstDiffBlock(text) {
    const s = String(text ?? '');
    // Fast path: common marker.
    if (s.includes('diff --git')) {
        const idx = s.indexOf('diff --git');
        if (idx >= 0) {
            // If it's inside a fenced block, prefer the fenced content.
            // Otherwise, take a bounded slice to avoid grabbing the entire answer.
            const slice = s.slice(idx);
            const endFence = slice.indexOf('```');
            if (endFence > 0)
                return slice.slice(0, endFence).trim();
            return slice.trim();
        }
    }
    // Parse fenced blocks: ```lang\n...\n```
    let i = 0;
    while (i < s.length) {
        const start = s.indexOf('```', i);
        if (start < 0)
            break;
        const langLineEnd = s.indexOf('\n', start + 3);
        if (langLineEnd < 0)
            break;
        const lang = s
            .slice(start + 3, langLineEnd)
            .trim()
            .toLowerCase();
        const end = s.indexOf('```', langLineEnd + 1);
        if (end < 0)
            break;
        const body = s.slice(langLineEnd + 1, end).trim();
        const looksLikeDiff = lang === 'diff' ||
            lang === 'patch' ||
            body.startsWith('diff --git') ||
            body.startsWith('--- ') ||
            body.startsWith('*** Begin Patch');
        if (looksLikeDiff && body)
            return body;
        i = end + 3;
    }
    return undefined;
}
// W30 DEPRECATED: Tool registry moved to TriLC toolbus (CPO Q1).
// Kept for UI compatibility only — no longer sent to LLM.
// All tool execution delegated via TriLCClient → TriLC daemon.
// TODO(W30-S5): Replace callers with TriLC-based tool listing.
function getToolDefinitions() {
    const defs = [
        // --- Copilot-aligned built-in tool names (Tripilot compatibility layer) ---
        {
            type: 'function',
            function: {
                name: 'manage_todo_list',
                description: 'Update the structured todo list for progress tracking (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        todoList: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    status: { type: 'string', description: 'not-started | in-progress | completed' }
                                },
                                required: ['id', 'title', 'description', 'status']
                            }
                        }
                    },
                    required: ['todoList']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'read_file',
                description: 'Read the contents of a file. Line numbers are 1-indexed. This tool truncates output at 2000 lines; call again with offset/limit to read larger files in chunks.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                        startLine: { type: 'number', description: 'V1: 1-based start line (optional; use with endLine).' },
                        endLine: { type: 'number', description: 'V1: 1-based end line (optional; use with startLine).' },
                        offset: {
                            type: 'number',
                            description: 'V2: Optional 1-based line offset to start reading from. Prefer using offset/limit when reading large files.'
                        },
                        limit: {
                            type: 'number',
                            description: 'V2: Optional maximum number of lines to read (capped so the total output is at most ~2000 lines). Use together with offset.'
                        }
                    },
                    required: ['filePath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'readFile',
                description: 'Read the contents of a file. Line numbers are 1-indexed. This tool truncates output at 2000 lines; call again with offset/limit to read larger files in chunks.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                        startLine: { type: 'number', description: 'V1: 1-based start line (optional; use with endLine).' },
                        endLine: { type: 'number', description: 'V1: 1-based end line (optional; use with startLine).' },
                        offset: {
                            type: 'number',
                            description: 'V2: Optional 1-based line offset to start reading from. Prefer using offset/limit when reading large files.'
                        },
                        limit: {
                            type: 'number',
                            description: 'V2: Optional maximum number of lines to read (capped so the total output is at most ~2000 lines). Use together with offset.'
                        }
                    },
                    required: ['filePath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'file_search',
                description: 'Search for files in the workspace by glob pattern (Copilot-compatible).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Glob pattern like **/*.{js,ts}.' },
                        maxResults: { type: 'number', description: 'Max results (optional).' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'fileSearch',
                description: 'Search for files in the workspace by glob pattern (Copilot-compatible).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Glob pattern like **/*.{js,ts}.' },
                        maxResults: { type: 'number', description: 'Max results (optional).' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'grep_search',
                description: 'Text search in workspace files (string or regex).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search string or regex.' },
                        isRegexp: { type: 'boolean', description: 'Whether query is regex.' },
                        includePattern: { type: 'string', description: 'Glob include pattern (optional).' },
                        maxResults: { type: 'number', description: 'Max results (optional).' },
                        includeIgnoredFiles: { type: 'boolean', description: 'Include ignored files (optional).' }
                    },
                    required: ['query', 'isRegexp']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'textSearch',
                description: 'Text search in workspace files (string or regex).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search string or regex.' },
                        isRegexp: { type: 'boolean', description: 'Whether query is regex.' },
                        includePattern: { type: 'string', description: 'Glob include pattern (optional).' },
                        maxResults: { type: 'number', description: 'Max results (optional).' },
                        includeIgnoredFiles: { type: 'boolean', description: 'Include ignored files (optional).' }
                    },
                    required: ['query', 'isRegexp']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'list_dir',
                description: 'List children of a directory (files and folders).',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: 'Absolute path or workspace-relative path.' }
                    },
                    required: ['path']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'listDirectory',
                description: 'List children of a directory (files and folders).',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: 'Absolute path or workspace-relative path.' }
                    },
                    required: ['path']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_directory',
                description: 'Create a directory (mkdir -p).',
                parameters: {
                    type: 'object',
                    properties: {
                        dirPath: { type: 'string', description: 'Absolute path or workspace-relative path.' }
                    },
                    required: ['dirPath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'createDirectory',
                description: 'Create a directory (mkdir -p).',
                parameters: {
                    type: 'object',
                    properties: {
                        dirPath: { type: 'string', description: 'Absolute path or workspace-relative path.' }
                    },
                    required: ['dirPath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_file',
                description: 'Create a new file with content (fails if exists, unless overwrite=true).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                        content: { type: 'string', description: 'File content.' },
                        overwrite: { type: 'boolean', description: 'If true, overwrite existing file.', default: false }
                    },
                    required: ['filePath', 'content']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'createFile',
                description: 'Create a new file with content (fails if exists, unless overwrite=true).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                        content: { type: 'string', description: 'File content.' },
                        overwrite: { type: 'boolean', description: 'If true, overwrite existing file.', default: false }
                    },
                    required: ['filePath', 'content']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'apply_patch',
                description: 'Apply a patch in the "*** Begin Patch" format to workspace files (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        input: { type: 'string', description: 'Patch text (preferred field name).' },
                        patch: { type: 'string', description: 'Patch text (alias of input).' },
                        diff: { type: 'string', description: 'Unified diff text (alias of input).' },
                        edits: {
                            type: 'array',
                            description: 'Optional: replace-string edits (Copilot-style). Use when patches are too fragile. Each edit replaces one exact snippet with another.',
                            items: {
                                type: 'object',
                                properties: {
                                    filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                                    oldString: { type: 'string', description: 'Exact snippet to replace (must match uniquely).' },
                                    newString: { type: 'string', description: 'Replacement snippet.' },
                                    expected_replacements: {
                                        type: 'number',
                                        description: 'Optional: expected number of replacements (usually 1). If provided and the match count differs, the tool errors.'
                                    }
                                },
                                required: ['filePath', 'oldString', 'newString']
                            }
                        },
                        explanation: { type: 'string', description: 'Human-readable intent (optional).' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'editFiles',
                description: 'Apply a patch in the "*** Begin Patch" format to workspace files (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        input: { type: 'string', description: 'Patch text (preferred field name).' },
                        patch: { type: 'string', description: 'Patch text (alias of input).' },
                        diff: { type: 'string', description: 'Unified diff text (alias of input).' },
                        edits: {
                            type: 'array',
                            description: 'Optional: replace-string edits (Copilot-style). Use when patches are too fragile. Each edit replaces one exact snippet with another.',
                            items: {
                                type: 'object',
                                properties: {
                                    filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                                    oldString: { type: 'string', description: 'Exact snippet to replace (must match uniquely).' },
                                    newString: { type: 'string', description: 'Replacement snippet.' },
                                    expected_replacements: {
                                        type: 'number',
                                        description: 'Optional: expected number of replacements (usually 1). If provided and the match count differs, the tool errors.'
                                    }
                                },
                                required: ['filePath', 'oldString', 'newString']
                            }
                        },
                        explanation: { type: 'string', description: 'Human-readable intent (optional).' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'edit_files',
                description: 'Alias for apply_patch (reference-aligned name; expects the same {input, explanation}).',
                parameters: {
                    type: 'object',
                    properties: {
                        input: { type: 'string', description: 'Patch text (preferred field name).' },
                        patch: { type: 'string', description: 'Patch text (alias of input).' },
                        diff: { type: 'string', description: 'Unified diff text (alias of input).' },
                        edits: {
                            type: 'array',
                            description: 'Optional: replace-string edits (Copilot-style). Use when patches are too fragile. Each edit replaces one exact snippet with another.',
                            items: {
                                type: 'object',
                                properties: {
                                    filePath: { type: 'string', description: 'Absolute path or workspace-relative path.' },
                                    oldString: { type: 'string', description: 'Exact snippet to replace (must match uniquely).' },
                                    newString: { type: 'string', description: 'Replacement snippet.' },
                                    expected_replacements: {
                                        type: 'number',
                                        description: 'Optional: expected number of replacements (usually 1). If provided and the match count differs, the tool errors.'
                                    }
                                },
                                required: ['filePath', 'oldString', 'newString']
                            }
                        },
                        explanation: { type: 'string', description: 'Human-readable intent (optional).' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_errors',
                description: 'List diagnostics (problems) for given files or whole workspace.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePaths: { type: 'array', items: { type: 'string' }, description: 'Absolute or workspace-relative file paths.' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'problems',
                description: 'List diagnostics (problems) for given files or whole workspace.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePaths: { type: 'array', items: { type: 'string' }, description: 'Absolute or workspace-relative file paths.' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_changed_files',
                description: 'List git changed files (staged/unstaged).',
                parameters: {
                    type: 'object',
                    properties: {
                        repositoryPath: { type: 'string', description: 'Repository root (optional).' },
                        sourceControlState: {
                            type: 'array',
                            items: { type: 'string', enum: ['staged', 'unstaged', 'merge-conflicts'] },
                            description: 'Filter by git state (optional).'
                        }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'changes',
                description: 'List git changed files (staged/unstaged).',
                parameters: {
                    type: 'object',
                    properties: {
                        repositoryPath: { type: 'string', description: 'Repository root (optional).' },
                        sourceControlState: {
                            type: 'array',
                            items: { type: 'string', enum: ['staged', 'unstaged', 'merge-conflicts'] },
                            description: 'Filter by git state (optional).'
                        }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_in_terminal',
                description: 'Run a shell command (captured) with optional background execution.',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string', description: 'Shell command to run.' },
                        explanation: { type: 'string', description: 'One-sentence purpose shown to user.' },
                        isBackground: { type: 'boolean', description: 'Run in background if true.' }
                    },
                    required: ['command', 'explanation', 'isBackground']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runInTerminal',
                description: 'Alias for run_in_terminal (reference tool name).',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string' },
                        explanation: { type: 'string' },
                        isBackground: { type: 'boolean' }
                    },
                    required: ['command', 'explanation', 'isBackground']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_terminal_output',
                description: 'Get output of a previous run_in_terminal command by id.',
                parameters: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Terminal run id.' }
                    },
                    required: ['id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getTerminalOutput',
                description: 'Alias for get_terminal_output (reference tool name).',
                parameters: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Terminal run id.' }
                    },
                    required: ['id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'terminal_last_command',
                description: 'Get the last command run via run_in_terminal (best-effort).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'terminalLastCommand',
                description: 'Get the last command run via run_in_terminal (best-effort).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'terminal_selection',
                description: 'Get the current selection in the active terminal (not available; returns empty).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'terminalSelection',
                description: 'Get the current selection in the active terminal (not available; returns empty).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_search_view_results',
                description: 'Return the last search results produced by grep_search/file_search (best-effort).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'searchResults',
                description: 'Return the last search results produced by grep_search/file_search (best-effort).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_and_run_task',
                description: 'Create and run a task (best-effort, output captured by Tripilot).',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string', description: 'Workspace folder path (absolute or relative).' },
                        task: {
                            type: 'object',
                            properties: {
                                label: { type: 'string' },
                                type: { type: 'string', enum: ['shell'] },
                                command: { type: 'string' },
                                args: { type: 'array', items: { type: 'string' } },
                                isBackground: { type: 'boolean' }
                            },
                            required: ['label', 'type', 'command']
                        }
                    },
                    required: ['workspaceFolder', 'task']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'createAndRunTask',
                description: 'Create and run a task (best-effort, output captured by Tripilot).',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string', description: 'Workspace folder path (absolute or relative).' },
                        task: {
                            type: 'object',
                            properties: {
                                label: { type: 'string' },
                                type: { type: 'string', enum: ['shell'] },
                                command: { type: 'string' },
                                args: { type: 'array', items: { type: 'string' } },
                                isBackground: { type: 'boolean' }
                            },
                            required: ['label', 'type', 'command']
                        }
                    },
                    required: ['workspaceFolder', 'task']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_task',
                description: 'Run an existing task by id/label (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string' },
                        id: { type: 'string' }
                    },
                    required: ['workspaceFolder', 'id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runTask',
                description: 'Alias for run_task (reference tool name).',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string' },
                        id: { type: 'string' }
                    },
                    required: ['workspaceFolder', 'id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_task_output',
                description: 'Get captured output for a previously started task.',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string' },
                        id: { type: 'string' }
                    },
                    required: ['workspaceFolder', 'id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getTaskOutput',
                description: 'Alias for get_task_output (reference tool name).',
                parameters: {
                    type: 'object',
                    properties: {
                        workspaceFolder: { type: 'string' },
                        id: { type: 'string' }
                    },
                    required: ['workspaceFolder', 'id']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_tests',
                description: 'Run workspace tests (best-effort: npm test).',
                parameters: {
                    type: 'object',
                    properties: {
                        scope: { type: 'string', description: 'Test scope (optional).' },
                        coverage: { type: 'boolean', description: 'Generate coverage if supported (optional).', default: false }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runTests',
                description: 'Alias for run_tests (reference tool name).',
                parameters: {
                    type: 'object',
                    properties: {
                        scope: { type: 'string' },
                        coverage: { type: 'boolean', default: false }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'test_failure',
                description: 'Return details from the most recent failed run_tests (best-effort).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'testFailure',
                description: 'Alias for test_failure (reference tool name).',
                parameters: { type: 'object', properties: {} }
            }
        },
        {
            type: 'function',
            function: {
                name: 'copilot_getNotebookSummary',
                description: 'Get a summary of all cells in a Jupyter notebook (.ipynb): cellId, kind, language, line ranges, execution info and output mime types.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' }
                    },
                    required: ['filePath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getNotebookSummary',
                description: 'Get a summary of all cells in a Jupyter notebook (.ipynb): cellId, kind, language, line ranges, execution info and output mime types.',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' }
                    },
                    required: ['filePath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_notebook_cell',
                description: 'Execute a code cell in a Jupyter notebook (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: { type: 'string', description: 'Cell id (from copilot_getNotebookSummary).' },
                        reason: { type: 'string', description: 'Why the cell is being run (optional).' },
                        continueOnError: { type: 'boolean', description: 'Whether to continue if error encountered (unused for single-cell).', default: false }
                    },
                    required: ['filePath', 'cellId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runNotebookCell',
                description: 'Execute a code cell in a Jupyter notebook (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: { type: 'string', description: 'Cell id (from getNotebookSummary).' },
                        reason: { type: 'string', description: 'Why the cell is being run (optional).' },
                        continueOnError: { type: 'boolean', description: 'Whether to continue if error encountered (unused for single-cell).', default: false }
                    },
                    required: ['filePath', 'cellId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'read_notebook_cell_output',
                description: 'Read the most recent output for a notebook cell (does not execute).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: { type: 'string', description: 'Cell id (from copilot_getNotebookSummary).' }
                    },
                    required: ['filePath', 'cellId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'readNotebookCellOutput',
                description: 'Read the most recent output for a notebook cell (does not execute).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: { type: 'string', description: 'Cell id (from getNotebookSummary).' }
                    },
                    required: ['filePath', 'cellId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'edit_notebook_file',
                description: 'Insert, delete, or edit a Jupyter notebook cell (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: {
                            type: 'string',
                            description: 'Cell id to edit/delete, or anchor cell id to insert after. Use TOP or BOTTOM to insert at file boundaries.'
                        },
                        newCode: { type: ['string', 'array'], description: 'New cell code for insert/edit.' },
                        language: { type: 'string', description: 'Cell language: markdown/python/javascript/etc (optional).' },
                        editType: { type: 'string', enum: ['insert', 'delete', 'edit'] }
                    },
                    required: ['filePath', 'cellId', 'editType']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'editNotebook',
                description: 'Insert, delete, or edit a Jupyter notebook cell (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string', description: 'Absolute path or workspace-relative path to a .ipynb file.' },
                        cellId: {
                            type: 'string',
                            description: 'Cell id to edit/delete, or anchor cell id to insert after. Use TOP or BOTTOM to insert at file boundaries.'
                        },
                        newCode: { type: ['string', 'array'], description: 'New cell code for insert/edit.' },
                        language: { type: 'string', description: 'Cell language: markdown/python/javascript/etc (optional).' },
                        editType: { type: 'string', enum: ['insert', 'delete', 'edit'] }
                    },
                    required: ['filePath', 'cellId', 'editType']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_new_jupyter_notebook',
                description: 'Generate a new Jupyter Notebook (.ipynb) file (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Natural language description of the notebook to generate.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'newJupyterNotebook',
                description: 'Generate a new Jupyter Notebook (.ipynb) file (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Natural language description of the notebook to generate.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runSubagent',
                description: 'Delegate a complex task to a context-isolated subagent and return only its final result (no recursion).',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: { type: 'string', description: 'Task prompt for the subagent.' },
                        description: { type: 'string', description: 'Short 3-5 word description.' }
                    },
                    required: ['prompt', 'description']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'agent.runSubagent',
                description: 'Alias for runSubagent.',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: { type: 'string' },
                        description: { type: 'string' }
                    },
                    required: ['prompt', 'description']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'fetch_webpage',
                description: 'Fetch and extract readable text content from one or more web pages (with URL approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        urls: { type: 'array', items: { type: 'string' }, description: 'URLs to fetch.' },
                        query: { type: 'string', description: 'What to look for in the page(s).' }
                    },
                    required: ['urls', 'query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'fetch',
                description: 'Fetch and extract readable text content from one or more web pages (with URL approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        urls: { type: 'array', items: { type: 'string' }, description: 'URLs to fetch.' },
                        query: { type: 'string', description: 'What to look for in the page(s).' }
                    },
                    required: ['urls', 'query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'github_repo',
                description: 'Search a public GitHub repo for relevant code snippets (best-effort; may require a token).',
                parameters: {
                    type: 'object',
                    properties: {
                        repo: { type: 'string', description: "Repo in the form 'owner/repo'." },
                        query: { type: 'string', description: 'Search query.' }
                    },
                    required: ['repo', 'query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'githubRepo',
                description: 'Search a public GitHub repo for relevant code snippets (best-effort; may require a token).',
                parameters: {
                    type: 'object',
                    properties: {
                        repo: { type: 'string', description: "Repo in the form 'owner/repo'." },
                        query: { type: 'string', description: 'Search query.' }
                    },
                    required: ['repo', 'query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'extensions',
                description: 'List installed VS Code extensions (id/displayName/isActive).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Optional filter (id/displayName substring).' },
                        includeDisabled: { type: 'boolean', description: 'Include disabled extensions if available (best-effort).', default: true },
                        maxResults: { type: 'number', description: 'Max results (optional).', default: 200 }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'install_extension',
                description: 'Install a VS Code extension by id (requires user confirmation).',
                parameters: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Extension id in the format publisher.name.' },
                        name: { type: 'string', description: 'Human-readable extension name.' }
                    },
                    required: ['id', 'name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'installExtension',
                description: 'Install a VS Code extension by id (requires user confirmation).',
                parameters: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Extension id in the format publisher.name.' },
                        name: { type: 'string', description: 'Human-readable extension name.' }
                    },
                    required: ['id', 'name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'vscode_searchExtensions_internal',
                description: 'Search for VS Code extensions (best-effort; may open Extensions UI).',
                parameters: {
                    type: 'object',
                    properties: {
                        category: { type: 'string', description: 'Optional category.' },
                        keywords: { type: 'array', items: { type: 'string' }, description: 'Search keywords.' },
                        ids: { type: 'array', items: { type: 'string' }, description: 'Known extension ids to look up.' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'open_simple_browser',
                description: 'Open a URL in VS Code Simple Browser (or external browser fallback).',
                parameters: {
                    type: 'object',
                    properties: {
                        url: { type: 'string', description: 'http(s) URL.' }
                    },
                    required: ['url']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'openSimpleBrowser',
                description: 'Open a URL in VS Code Simple Browser (or external browser fallback).',
                parameters: {
                    type: 'object',
                    properties: {
                        url: { type: 'string', description: 'http(s) URL.' }
                    },
                    required: ['url']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_vscode_command',
                description: 'Run a VS Code command (best-effort; subject to allowlist in ask&study).',
                parameters: {
                    type: 'object',
                    properties: {
                        commandId: { type: 'string', description: 'Command id.' },
                        name: { type: 'string', description: 'Human-readable description.' },
                        args: { type: 'array', items: { type: 'string' }, description: 'Optional args array.' }
                    },
                    required: ['commandId', 'name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'runCommand',
                description: 'Run a VS Code command (best-effort; subject to allowlist in ask&study).',
                parameters: {
                    type: 'object',
                    properties: {
                        commandId: { type: 'string', description: 'Command id.' },
                        name: { type: 'string', description: 'Human-readable description.' },
                        args: { type: 'array', items: { type: 'string' }, description: 'Optional args array.' }
                    },
                    required: ['commandId', 'name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'run_command',
                description: 'Alias for run_vscode_command (reference-aligned name).',
                parameters: {
                    type: 'object',
                    properties: {
                        commandId: { type: 'string', description: 'Command id.' },
                        args: { type: 'array', items: { type: 'string' }, description: 'Optional args array.' }
                    },
                    required: ['commandId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_new_workspace',
                description: 'Scaffold a new workspace/project under the current workspace (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Description of the workspace to generate.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'newWorkspace',
                description: 'Scaffold a new workspace/project under the current workspace (with approval).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Description of the workspace to generate.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'new_workspace',
                description: 'Create a new workspace/project (reference-aligned shape; best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Project/workspace name.' },
                        directory: { type: 'string', description: 'Workspace-relative directory hint.' },
                        template: { type: 'string', description: 'Template name (e.g. vite, next-js, python-project).' },
                        openInNewWindow: { type: 'boolean', description: 'Whether to open in a new window (best-effort).' }
                    },
                    required: ['name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_project_setup_info',
                description: 'Get setup/build/run/test guidance for a project type (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        projectType: { type: 'string', description: 'python-project/python-script/next-js/vite/vscode-extension/mcp-server/other.' }
                    },
                    required: ['projectType']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getProjectSetupInfo',
                description: 'Get setup/build/run/test guidance for a project type (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        projectType: { type: 'string', description: 'python-project/python-script/next-js/vite/vscode-extension/mcp-server/other.' }
                    },
                    required: ['projectType']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_vscode_api',
                description: 'Search VS Code API docs/types for guidance (offline best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Question or API name to search for.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'vscodeAPI',
                description: 'Search VS Code API docs/types for guidance (offline best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Question or API name to search for.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'vscode_api',
                description: 'Alias for get_vscode_api (reference-aligned name).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Question or API name to search for.' },
                        version: { type: 'string', description: 'Optional version hint.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'list_code_usages',
                description: 'List usages/references of a symbol name in the workspace (best-effort text search).',
                parameters: {
                    type: 'object',
                    properties: {
                        symbolName: { type: 'string', description: 'Symbol to search for.' },
                        filePaths: { type: 'array', items: { type: 'string' }, description: 'Optional hint files (workspace-relative).' }
                    },
                    required: ['symbolName']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'usages',
                description: 'List usages/references of a symbol name in the workspace (best-effort text search).',
                parameters: {
                    type: 'object',
                    properties: {
                        symbolName: { type: 'string', description: 'Symbol to search for.' },
                        filePaths: { type: 'array', items: { type: 'string' }, description: 'Optional hint files (workspace-relative).' }
                    },
                    required: ['symbolName']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'semantic_search',
                description: 'Semantic-ish search over the codebase (best-effort keyword search).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Natural language query.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'codebase',
                description: 'Semantic-ish search over the codebase (best-effort keyword search).',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Natural language query.' }
                    },
                    required: ['query']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'editor_getActiveDocument',
                description: 'Get info about the active editor document and (optionally) its text.',
                parameters: {
                    type: 'object',
                    properties: {
                        includeText: { type: 'boolean', description: 'If true, include the document text (may be truncated).' },
                        maxChars: { type: 'number', description: 'Max chars to return when includeText=true.', default: 20000 },
                        startLine: { type: 'number', description: '1-based start line (optional).' },
                        endLine: { type: 'number', description: '1-based end line (optional).' }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'editor_getSelection',
                description: 'Get the current selection text in the active editor.',
                parameters: {
                    type: 'object',
                    properties: {
                        maxChars: { type: 'number', description: 'Max chars to return.', default: 20000 }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'workspace_listFiles',
                description: 'List files under a workspace-relative directory (non-recursive by default).',
                parameters: {
                    type: 'object',
                    properties: {
                        relativeDir: { type: 'string', description: 'Workspace-relative directory path.' },
                        recursive: { type: 'boolean', description: 'If true, list recursively.' }
                    },
                    required: ['relativeDir']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'workspace_readFile',
                description: 'Read a UTF-8 text file by workspace-relative path.',
                parameters: {
                    type: 'object',
                    properties: {
                        relativePath: { type: 'string' }
                    },
                    required: ['relativePath']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'workspace_writeFile',
                description: 'Write a UTF-8 text file by workspace-relative path (creates folders as needed).',
                parameters: {
                    type: 'object',
                    properties: {
                        relativePath: { type: 'string' },
                        content: { type: 'string' }
                    },
                    required: ['relativePath', 'content']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'workspace_findInFiles',
                description: 'Search text in workspace files, returning matched lines and ranges (limited).',
                parameters: {
                    type: 'object',
                    properties: {
                        pattern: { type: 'string', description: 'Search pattern.' },
                        isRegExp: { type: 'boolean', default: false },
                        isCaseSensitive: { type: 'boolean', default: false },
                        isWordMatch: { type: 'boolean', default: false },
                        include: { type: 'string', description: 'Glob include, e.g. **/*.ts' },
                        exclude: { type: 'string', description: 'Glob exclude, e.g. **/node_modules/**' },
                        maxResults: { type: 'number', default: 50 }
                    },
                    required: ['pattern']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'workspace_applyEdits',
                description: 'Apply text edits to workspace files using WorkspaceEdit. Lines/chars are 1-based.',
                parameters: {
                    type: 'object',
                    properties: {
                        edits: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    relativePath: { type: 'string' },
                                    startLine: { type: 'number', description: '1-based.' },
                                    startCharacter: { type: 'number', description: '1-based.' },
                                    endLine: { type: 'number', description: '1-based.' },
                                    endCharacter: { type: 'number', description: '1-based.' },
                                    newText: { type: 'string' }
                                },
                                required: ['relativePath', 'startLine', 'startCharacter', 'endLine', 'endCharacter', 'newText']
                            }
                        }
                    },
                    required: ['edits']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'diagnostics_list',
                description: 'List VS Code diagnostics (problems) for a file or whole workspace (limited).',
                parameters: {
                    type: 'object',
                    properties: {
                        relativePath: { type: 'string', description: 'Optional workspace-relative file path.' },
                        maxItems: { type: 'number', default: 200 }
                    }
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'vscode_executeCommand',
                description: 'Execute a VS Code command by id.',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string' },
                        args: { type: 'array', items: {} }
                    },
                    required: ['command']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'terminal_run',
                description: 'Run a shell command in a VS Code terminal and return captured output (best-effort).',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string' },
                        shell: { type: 'string', enum: ['powershell', 'cmd', 'bash'], description: 'Preferred shell.' }
                    },
                    required: ['command']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'process_run',
                description: 'Run a process (non-interactive) and capture stdout/stderr. Prefer this when you need output.',
                parameters: {
                    type: 'object',
                    properties: {
                        command: { type: 'string', description: 'Executable name or path.' },
                        args: { type: 'array', items: { type: 'string' }, description: 'Arguments array.' },
                        cwd: { type: 'string', description: 'Workspace-relative working directory (optional).' },
                        timeoutMs: { type: 'number', default: 60000 },
                        maxOutputChars: { type: 'number', default: 60000 }
                    },
                    required: ['command']
                }
            }
        }
    ];
    // Expose only the Copilot-style tool surface (no extra internal tools).
    const ALIAS_FROM_COPILOT_NAME = {
        // todo
        manage_todo_list: 'manage_todo_list',
        // read
        readFile: 'read_file',
        problems: 'get_errors',
        terminalLastCommand: 'terminal_last_command',
        terminalSelection: 'terminal_selection',
        getNotebookSummary: 'copilot_getNotebookSummary',
        readNotebookCellOutput: 'read_notebook_cell_output',
        getTaskOutput: 'get_task_output',
        // search
        fileSearch: 'file_search',
        textSearch: 'grep_search',
        listDirectory: 'list_dir',
        searchResults: 'get_search_view_results',
        codebase: 'semantic_search',
        usages: 'list_code_usages',
        changes: 'get_changed_files',
        // edit
        createDirectory: 'create_directory',
        createFile: 'create_file',
        editFiles: 'apply_patch',
        editNotebook: 'edit_notebook_file',
        newJupyterNotebook: 'create_new_jupyter_notebook',
        // execute
        runInTerminal: 'run_in_terminal',
        getTerminalOutput: 'get_terminal_output',
        createAndRunTask: 'create_and_run_task',
        runTask: 'run_task',
        runTests: 'run_tests',
        testFailure: 'test_failure',
        runNotebookCell: 'run_notebook_cell',
        // agent
        runSubagent: 'runSubagent',
        // vscode
        extensions: 'extensions',
        installExtension: 'install_extension',
        openSimpleBrowser: 'open_simple_browser',
        runCommand: 'run_vscode_command',
        newWorkspace: 'create_new_workspace',
        getProjectSetupInfo: 'get_project_setup_info',
        vscodeAPI: 'get_vscode_api',
        // web
        fetch: 'fetch_webpage',
        githubRepo: 'github_repo'
    };
    const byName = new Map();
    for (const d of defs)
        byName.set(String(d?.function?.name ?? ''), d);
    const out = [];
    for (const copilotName of OPTIONAL_TOOL_NAMES) {
        const baseName = ALIAS_FROM_COPILOT_NAME[copilotName] ?? copilotName;
        const base = byName.get(baseName);
        if (!base)
            continue;
        if (baseName === copilotName) {
            out.push(base);
            continue;
        }
        out.push({
            ...base,
            function: {
                ...base.function,
                name: copilotName,
                description: `Copilot name alias for ${baseName}. ${String(base.function?.description ?? '')}`.trim()
            }
        });
    }
    return out;
}
const CAPTURED_RUNS = new Map();
const CAPTURED_TASKS = new Map();
const TASK_DEFS = new Map();
let LAST_TERMINAL_COMMAND;
let LAST_SEARCH_RESULTS;
let LAST_TEST_FAILURE;
let LAST_TODO_LIST;
function isProbablyAbsolutePath(p) {
    const s = String(p ?? '');
    // Windows drive path, UNC, or POSIX root.
    return /^[A-Za-z]:[\\/]/.test(s) || s.startsWith('\\\\') || s.startsWith('/');
}
function resolveAnyPathToUri(p) {
    const raw = String(p ?? '').trim();
    if (!raw)
        throw new Error('Path is required.');
    if (isProbablyAbsolutePath(raw)) {
        return vscode.Uri.file(raw);
    }
    // Treat as workspace-relative.
    const rel = raw.replace(/\\/g, '/').replace(/^\/+/, '');
    return resolveWorkspaceUri(rel);
}
function toWorkspaceRelativePosix(uri) {
    const rel = vscode.workspace.asRelativePath(uri, false);
    return String(rel ?? '').replace(/\\/g, '/');
}
function normalizeNewlinesToLf(text) {
    return String(text ?? '').replace(/\r\n/g, '\n');
}
function escapeRegExp(s) {
    return String(s ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function isSafeHttpUrl(url) {
    try {
        const u = new URL(String(url));
        if (u.protocol !== 'http:' && u.protocol !== 'https:')
            return false;
        return true;
    }
    catch {
        return false;
    }
}
async function fetchUrlText(url, timeoutMs = 20000) {
    const target = String(url ?? '').trim();
    if (!isSafeHttpUrl(target))
        throw new Error(`Invalid URL: ${target}`);
    // Prefer global fetch when available (Node 18+), otherwise fall back to http(s).
    const anyFetch = globalThis.fetch;
    if (typeof anyFetch === 'function') {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), timeoutMs);
        try {
            const res = await anyFetch(target, {
                redirect: 'follow',
                signal: ac.signal,
                headers: {
                    'User-Agent': 'Tripilot/0.0.1 (+https://github.com/)'
                }
            });
            const text = await res.text();
            return {
                finalUrl: String(res.url ?? target),
                status: Number(res.status ?? 0),
                contentType: String(res.headers?.get?.('content-type') ?? ''),
                text
            };
        }
        finally {
            clearTimeout(t);
        }
    }
    return await new Promise((resolve, reject) => {
        try {
            const u = new URL(target);
            const lib = u.protocol === 'https:' ? https : http;
            const req = lib.request({
                method: 'GET',
                host: u.hostname,
                path: u.pathname + u.search,
                port: u.port ? Number(u.port) : undefined,
                headers: { 'User-Agent': 'Tripilot/0.0.1' }
            }, (res) => {
                const chunks = [];
                res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))));
                res.on('end', () => {
                    const text = Buffer.concat(chunks).toString('utf8');
                    resolve({
                        finalUrl: target,
                        status: Number(res.statusCode ?? 0),
                        contentType: String(res.headers?.['content-type'] ?? ''),
                        text
                    });
                });
            });
            req.on('error', reject);
            req.setTimeout(timeoutMs, () => {
                req.destroy(new Error('Request timeout'));
            });
            req.end();
        }
        catch (e) {
            reject(e);
        }
    });
}
function extractReadableTextFromHtml(html) {
    let s = String(html ?? '');
    // Remove scripts/styles.
    s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    // Remove tags.
    s = s.replace(/<[^>]+>/g, ' ');
    // Basic entity decode.
    s = s
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");
    // Collapse whitespace.
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}
function pickRelevantText(fullText, query, maxChars = 20000) {
    const text = String(fullText ?? '');
    const q = String(query ?? '').trim();
    if (!q)
        return truncate(text, maxChars);
    const tokens = q
        .toLowerCase()
        .split(/[^a-z0-9\u4e00-\u9fff]+/)
        .filter((t) => t.length >= 3)
        .slice(0, 10);
    if (!tokens.length)
        return truncate(text, maxChars);
    // Prefer sentences containing any token.
    const sentences = text.split(/(?<=[.!?。！？])\s+/);
    const picked = [];
    for (const s of sentences) {
        const low = s.toLowerCase();
        if (tokens.some((t) => low.includes(t))) {
            picked.push(s.trim());
            if (picked.join(' ').length >= maxChars)
                break;
        }
    }
    const out = picked.length ? picked.join(' ') : text;
    return truncate(out, maxChars);
}
function slugifyFileBase(input) {
    const raw = String(input ?? '').trim().toLowerCase();
    const s = raw
        .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    return s || 'notebook';
}
function resolveNotebookCellIdToIndex(cellId, cells) {
    const raw = String(cellId ?? '').trim();
    if (!raw)
        throw new Error('cellId is required.');
    const cellCount = cells.length;
    // Preferred legacy format: cell-<index>
    const m = /^cell-(\d+)$/.exec(raw);
    if (m) {
        const idx = Number(m[1]);
        if (!Number.isFinite(idx) || idx < 0 || idx >= cellCount)
            throw new Error('cellId out of range.');
        return idx;
    }
    // Accept numeric string as index.
    if (/^\d+$/.test(raw)) {
        const idx = Number(raw);
        if (!Number.isFinite(idx) || idx < 0 || idx >= cellCount)
            throw new Error('cellId out of range.');
        return idx;
    }
    // Accept a notebook cell document URI string (stable-ish across edits).
    const uriMatchIndex = cells.findIndex((c) => String(c.document?.uri?.toString() ?? '') === raw);
    if (uriMatchIndex >= 0)
        return uriMatchIndex;
    // Accept our own metadata id: tripilot:<uuid>
    const tripilotPrefix = 'tripilot:';
    if (raw.startsWith(tripilotPrefix)) {
        const wanted = raw.slice(tripilotPrefix.length);
        const idx = cells.findIndex((c) => {
            const md = c?.metadata;
            return md && typeof md === 'object' && String(md.tripilotCellId ?? '') === wanted;
        });
        if (idx >= 0)
            return idx;
    }
    throw new Error(`Unknown cellId format: ${raw}`);
}
function normalizeNotebookNewCode(newCode) {
    if (Array.isArray(newCode))
        return newCode.map((x) => String(x ?? '')).join('');
    return String(newCode ?? '');
}
function notebookOutputsToStructured(outputs, maxCharsPerItem = 20000) {
    const mimeTypes = new Set();
    const textParts = [];
    const structured = [];
    for (const o of outputs ?? []) {
        const outItems = [];
        for (const item of o.items ?? []) {
            const mime = String(item?.mime ?? '');
            if (mime)
                mimeTypes.add(mime);
            let byteLength = 0;
            let textPreview;
            try {
                const data = item?.data;
                byteLength = data?.byteLength ?? 0;
                const isTextish = mime.startsWith('text/') ||
                    mime === 'application/vnd.code.notebook.stdout' ||
                    mime === 'application/vnd.code.notebook.stderr' ||
                    mime === 'application/json' ||
                    mime === 'application/javascript';
                if (isTextish && data && data.byteLength) {
                    textPreview = Buffer.from(data).toString('utf8');
                    if (textPreview.length > maxCharsPerItem) {
                        textPreview = textPreview.slice(0, maxCharsPerItem) + '\n…(truncated)';
                    }
                    textParts.push(textPreview);
                }
            }
            catch {
                // ignore
            }
            outItems.push({ mime, byteLength, ...(textPreview ? { textPreview } : {}) });
        }
        structured.push({ items: outItems });
    }
    return {
        text: textParts.join('\n').trim(),
        mimeTypes: Array.from(mimeTypes.values()).sort((a, b) => a.localeCompare(b)),
        outputs: structured
    };
}
function parseTripilotPatch(input) {
    const text = String(input ?? '');
    // Be tolerant: some models omit the end marker. If Begin exists, treat EOF as End.
    if (!text.includes('*** Begin Patch')) {
        throw new Error('Patch must include "*** Begin Patch" marker.');
    }
    const normalized = text.includes('*** End Patch') ? text : text + '\n*** End Patch';
    const lines = normalized.split(/\r?\n/);
    const actions = [];
    let i = 0;
    const takePath = (line) => line.split(':').slice(1).join(':').trim();
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('*** Add File:')) {
            const filePath = takePath(line);
            i++;
            const body = [];
            while (i < lines.length && !lines[i].startsWith('*** ')) {
                body.push(lines[i]);
                i++;
            }
            const content = body
                .filter((l) => l !== '\\ No newline at end of file')
                .map((l) => (l.startsWith('+') ? l.slice(1) : l))
                .join('\n');
            actions.push({ kind: 'add', filePath, content });
            continue;
        }
        if (line.startsWith('*** Delete File:')) {
            const filePath = takePath(line);
            actions.push({ kind: 'delete', filePath });
            i++;
            continue;
        }
        if (line.startsWith('*** Update File:')) {
            const filePath = takePath(line);
            i++;
            const hunks = [];
            let hunkLines = [];
            const flush = () => {
                if (!hunkLines.length)
                    return;
                const beforeLines = [];
                const afterLines = [];
                for (const hl of hunkLines) {
                    if (!hl) {
                        beforeLines.push('');
                        afterLines.push('');
                        continue;
                    }
                    if (hl.startsWith('@@')) {
                        // context marker, ignore
                        continue;
                    }
                    if (hl.startsWith('-')) {
                        beforeLines.push(hl.slice(1));
                        continue;
                    }
                    if (hl.startsWith('+')) {
                        afterLines.push(hl.slice(1));
                        continue;
                    }
                    // context line
                    beforeLines.push(hl);
                    afterLines.push(hl);
                }
                hunks.push({ before: beforeLines.join('\n'), after: afterLines.join('\n') });
                hunkLines = [];
            };
            while (i < lines.length && !lines[i].startsWith('*** ')) {
                const l = lines[i];
                // New hunk marker: flush current block.
                if (l.startsWith('@@')) {
                    flush();
                    hunkLines.push(l);
                    i++;
                    continue;
                }
                hunkLines.push(l);
                i++;
            }
            flush();
            actions.push({ kind: 'update', filePath, hunks });
            continue;
        }
        i++;
    }
    return actions;
}
function applyHunksToText(original, hunks) {
    const originalLf = normalizeNewlinesToLf(original);
    const endsWithNewline = originalLf.endsWith('\n');
    let lines = originalLf.split('\n');
    if (endsWithNewline)
        lines = lines.slice(0, -1);
    const splitLines = (text) => {
        const t = normalizeNewlinesToLf(text);
        // Avoid returning [''] for empty.
        return t ? t.split('\n') : [];
    };
    const maybeUnescapeLeadingTabs = (s) => {
        // Some models emit literal "\\t" instead of a tab at the start of lines.
        // Keep this conservative: only fix a leading "\\t" when the string has no real tabs.
        const str = String(s ?? '');
        if (!str.includes('\t') && str.startsWith('\\t'))
            return '\t' + str.slice(2);
        return str;
    };
    const normalizeForCompare = (s, mode) => {
        const base = maybeUnescapeLeadingTabs(String(s ?? ''));
        if (mode === 'exact')
            return base;
        if (mode === 'trimEnd')
            return base.replace(/[\t\f\v \u00A0]+$/g, '');
        return base.trim();
    };
    const levenshteinWithin = (a, b, maxDistance) => {
        if (a === b)
            return 0;
        if (maxDistance <= 0)
            return 1;
        const al = a.length;
        const bl = b.length;
        if (Math.abs(al - bl) > maxDistance)
            return maxDistance + 1;
        if (al === 0)
            return bl;
        if (bl === 0)
            return al;
        // Ensure b is the shorter string for less memory.
        if (bl > al)
            return levenshteinWithin(b, a, maxDistance);
        let prev = new Array(bl + 1);
        let curr = new Array(bl + 1);
        for (let j = 0; j <= bl; j++)
            prev[j] = j;
        for (let i = 1; i <= al; i++) {
            curr[0] = i;
            let rowMin = curr[0];
            const ca = a.charCodeAt(i - 1);
            for (let j = 1; j <= bl; j++) {
                const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
                const del = prev[j] + 1;
                const ins = curr[j - 1] + 1;
                const sub = prev[j - 1] + cost;
                const v = del < ins ? (del < sub ? del : sub) : ins < sub ? ins : sub;
                curr[j] = v;
                if (v < rowMin)
                    rowMin = v;
            }
            if (rowMin > maxDistance)
                return maxDistance + 1;
            [prev, curr] = [curr, prev];
        }
        return prev[bl];
    };
    const findSubsequenceMatches = (haystack, needle, mode) => {
        const matches = [];
        if (!needle.length)
            return matches;
        if (needle.length > haystack.length)
            return matches;
        for (let i = 0; i <= haystack.length - needle.length; i++) {
            let ok = true;
            for (let j = 0; j < needle.length; j++) {
                if (normalizeForCompare(haystack[i + j], mode) !== normalizeForCompare(needle[j], mode)) {
                    ok = false;
                    break;
                }
            }
            if (ok)
                matches.push(i);
        }
        return matches;
    };
    const findFuzzyIndexByAnchors = (haystack, needle) => {
        if (!needle.length)
            return 0;
        const nonEmptyIdx = needle
            .map((l, idx) => ({ l, idx }))
            .filter((x) => x.l.trim().length > 0);
        if (!nonEmptyIdx.length)
            return -1;
        const first = nonEmptyIdx[0];
        const last = nonEmptyIdx[nonEmptyIdx.length - 1];
        const candidates = [];
        for (let i = 0; i < haystack.length; i++) {
            if (normalizeForCompare(haystack[i], 'trim') === normalizeForCompare(first.l, 'trim'))
                candidates.push(i);
        }
        if (!candidates.length)
            return -1;
        let bestStart = -1;
        let bestScore = -1;
        let bestCount = 0;
        for (const p of candidates) {
            const start = p - first.idx;
            if (start < 0)
                continue;
            const end = start + needle.length;
            if (end > haystack.length)
                continue;
            // Require the last anchor to match, otherwise skip quickly.
            const lastPos = start + last.idx;
            if (lastPos < 0 || lastPos >= haystack.length)
                continue;
            if (normalizeForCompare(haystack[lastPos], 'trim') !== normalizeForCompare(last.l, 'trim'))
                continue;
            let score = 0;
            for (let j = 0; j < needle.length; j++) {
                if (normalizeForCompare(haystack[start + j], 'trimEnd') === normalizeForCompare(needle[j], 'trimEnd'))
                    score++;
            }
            if (score > bestScore) {
                bestScore = score;
                bestStart = start;
                bestCount = 1;
            }
            else if (score === bestScore && score !== -1) {
                bestCount++;
            }
        }
        // Only accept high-confidence, unambiguous matches.
        const ratio = needle.length ? bestScore / needle.length : 0;
        if (bestStart >= 0 && ratio >= 0.85 && bestCount === 1)
            return bestStart;
        return -1;
    };
    const findEditDistanceIndexByAnchors = (haystack, needle) => {
        // Conservative edit-distance matching (Copilot-style): allow small per-line drift.
        if (!needle.length)
            return 0;
        const nonEmptyIdx = needle
            .map((l, idx) => ({ l, idx }))
            .filter((x) => x.l.trim().length > 0);
        if (!nonEmptyIdx.length)
            return -1;
        const first = nonEmptyIdx[0];
        const last = nonEmptyIdx[nonEmptyIdx.length - 1];
        const candidates = [];
        for (let i = 0; i < haystack.length; i++) {
            if (normalizeForCompare(haystack[i], 'trim') === normalizeForCompare(first.l, 'trim'))
                candidates.push(i);
        }
        if (!candidates.length)
            return -1;
        const allowanceRatio = 0.34;
        let bestStart = -1;
        let bestTotalDist = Number.POSITIVE_INFINITY;
        let bestCount = 0;
        for (const p of candidates) {
            const start = p - first.idx;
            if (start < 0)
                continue;
            const end = start + needle.length;
            if (end > haystack.length)
                continue;
            const lastPos = start + last.idx;
            if (lastPos < 0 || lastPos >= haystack.length)
                continue;
            if (normalizeForCompare(haystack[lastPos], 'trim') !== normalizeForCompare(last.l, 'trim'))
                continue;
            let totalDist = 0;
            let ok = true;
            for (let j = 0; j < needle.length; j++) {
                const a = normalizeForCompare(haystack[start + j], 'trimEnd');
                const b = normalizeForCompare(needle[j], 'trimEnd');
                if (a === b)
                    continue;
                const maxLen = Math.max(a.length, b.length);
                const allowed = Math.max(1, Math.floor(maxLen * allowanceRatio));
                const d = levenshteinWithin(a, b, allowed);
                if (d > allowed) {
                    ok = false;
                    break;
                }
                totalDist += d;
            }
            if (!ok)
                continue;
            if (totalDist < bestTotalDist) {
                bestTotalDist = totalDist;
                bestStart = start;
                bestCount = 1;
            }
            else if (totalDist === bestTotalDist) {
                bestCount++;
            }
        }
        if (bestStart >= 0 && bestCount === 1)
            return bestStart;
        return -1;
    };
    for (const h of hunks) {
        const before = normalizeNewlinesToLf(h.before);
        const after = normalizeNewlinesToLf(h.after);
        if (!before) {
            // If no before context, append after.
            const afterLines = splitLines(after);
            if (afterLines.length)
                lines.push(...afterLines);
            continue;
        }
        const beforeLines = splitLines(before);
        const afterLines = splitLines(after);
        let start = -1;
        for (const mode of ['exact', 'trimEnd', 'trim']) {
            const matches = findSubsequenceMatches(lines, beforeLines, mode);
            if (matches.length === 1) {
                start = matches[0];
                break;
            }
            if (matches.length > 1) {
                throw new Error(`Patch hunk matched multiple locations (${matches.length}). Make the context more specific (include more unchanged lines around the edit) and try again.`);
            }
        }
        if (start === -1)
            start = findFuzzyIndexByAnchors(lines, beforeLines);
        if (start === -1)
            start = findEditDistanceIndexByAnchors(lines, beforeLines);
        if (start === -1) {
            throw new Error('Patch hunk did not match the current file content.\n\n' +
                'Next steps:\n' +
                '1) Use read_file to fetch the latest content for this file (around the area you want to change).\n' +
                '2) Re-generate the patch with more unchanged context lines, OR switch to apply_patch.edits (replace-string) for a more stable edit.\n');
        }
        lines.splice(start, beforeLines.length, ...afterLines);
    }
    let out = lines.join('\n');
    if (endsWithNewline)
        out += '\n';
    return out;
}
// W30 Architecture Fix: Local tool execution helpers removed (CPO Q1).
// - levenshteinWithin, buildWhitespaceFlexibleRegex, suggestClosestSnippet, applyReplaceStringOnce
// - escapeRegex, detectEol, normalizeToLf, toOriginalEol, countOccurrences
// - executeToolCall (2243 lines)
// All tools now delegated to TriLC daemon via TriLCClient.
function resolveWorkspaceUri(relativePath) {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder)
        throw new Error('No workspace folder opened.');
    return vscode.Uri.joinPath(folder.uri, relativePath);
}
function safeOneLine(text, maxLen = 300) {
    const s = String(text ?? '')
        .replace(/\s+/g, ' ')
        .trim();
    return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
}
function truncate(text, maxChars) {
    const s = String(text ?? '');
    return s.length > maxChars ? s.slice(0, maxChars) + '\n…(truncated)' : s;
}
function severityToString(sev) {
    switch (sev) {
        case vscode.DiagnosticSeverity.Error:
            return 'Error';
        case vscode.DiagnosticSeverity.Warning:
            return 'Warning';
        case vscode.DiagnosticSeverity.Information:
            return 'Information';
        case vscode.DiagnosticSeverity.Hint:
            return 'Hint';
        default:
            return String(sev);
    }
}
function groupEditsByFile(edits) {
    const map = new Map();
    for (const e of edits) {
        const arr = map.get(e.relativePath) ?? [];
        arr.push({
            startLine: e.startLine,
            startCharacter: e.startCharacter,
            endLine: e.endLine,
            endCharacter: e.endCharacter,
            newText: e.newText
        });
        map.set(e.relativePath, arr);
    }
    return map;
}
function applyTextEditsToString(original, edits) {
    // Convert 1-based (line, char) to absolute offsets, then apply from back to front.
    const lineStarts = computeLineStarts(original);
    const normalized = edits
        .map((e) => {
        const start = positionToOffset(lineStarts, e.startLine, e.startCharacter);
        const end = positionToOffset(lineStarts, e.endLine, e.endCharacter);
        return { start, end, newText: e.newText };
    })
        .sort((a, b) => b.start - a.start);
    let text = original;
    for (const e of normalized) {
        if (e.start > e.end || e.start < 0 || e.end < 0 || e.start > text.length || e.end > text.length) {
            continue;
        }
        text = text.slice(0, e.start) + e.newText + text.slice(e.end);
    }
    return text;
}
function computeLineStarts(text) {
    const starts = [0];
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n')
            starts.push(i + 1);
    }
    return starts;
}
function positionToOffset(lineStarts, line1, char1) {
    const line = Math.max(1, line1);
    const ch = Math.max(1, char1);
    const lineIndex = Math.min(lineStarts.length, line) - 1;
    const lineStart = lineStarts[lineIndex] ?? 0;
    return lineStart + (ch - 1);
}
async function previewEditsInDiff(previews) {
    for (const p of previews) {
        let language = undefined;
        try {
            const doc = await vscode.workspace.openTextDocument(p.uri);
            language = doc.languageId;
        }
        catch {
            // ignore
        }
        const modified = await vscode.workspace.openTextDocument({ content: p.updated, language });
        await vscode.commands.executeCommand('vscode.diff', p.uri, modified.uri, `Tripilot Preview: ${p.relativePath} (${p.editCount} edit(s))`);
    }
}
async function ensureParentDir(uri) {
    // vscode.Uri.path is POSIX-style. Compute dirname safely.
    const parentPath = uri.path.replace(/\/[^/]*$/, '') || '/';
    const parent = uri.with({ path: parentPath });
    try {
        await vscode.workspace.fs.createDirectory(parent);
    }
    catch {
        // ignore
    }
}
async function findInFiles(args) {
    const include = args.include && args.include.trim().length > 0 ? args.include : '**/*';
    const exclude = args.exclude && args.exclude.trim().length > 0 ? args.exclude : '**/node_modules/**';
    const uris = await vscode.workspace.findFiles(include, exclude);
    const results = [];
    const maxResults = Math.max(1, args.maxResults);
    const maxBytesPerFile = 1024 * 1024; // 1MB safety cap
    const needle = args.isCaseSensitive ? args.pattern : args.pattern.toLowerCase();
    let regex;
    if (args.isRegExp) {
        const flags = `${args.isCaseSensitive ? '' : 'i'}g`;
        try {
            regex = new RegExp(args.pattern, flags);
        }
        catch (e) {
            throw new Error(`Invalid RegExp pattern: ${String(e)}`);
        }
    }
    for (const uri of uris) {
        if (results.length >= maxResults)
            break;
        let stat;
        try {
            stat = await vscode.workspace.fs.stat(uri);
        }
        catch {
            continue;
        }
        if (stat.size > maxBytesPerFile)
            continue;
        let text;
        try {
            const bytes = await vscode.workspace.fs.readFile(uri);
            text = Buffer.from(bytes).toString('utf8');
        }
        catch {
            continue;
        }
        const lines = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            if (results.length >= maxResults)
                break;
            const line = lines[i];
            const hay = args.isCaseSensitive ? line : line.toLowerCase();
            if (args.isRegExp && regex) {
                regex.lastIndex = 0;
                const ranges = [];
                let m;
                while ((m = regex.exec(line)) !== null) {
                    const start = m.index;
                    const end = m.index + (m[0]?.length ?? 0);
                    if (args.isWordMatch && !isWordBoundaryMatch(line, start, end)) {
                        if (m[0]?.length === 0)
                            regex.lastIndex++;
                        continue;
                    }
                    ranges.push({
                        startLine: i + 1,
                        startCharacter: start + 1,
                        endLine: i + 1,
                        endCharacter: end + 1
                    });
                    if (ranges.length >= 5)
                        break;
                    if (m[0]?.length === 0)
                        regex.lastIndex++;
                }
                if (ranges.length > 0) {
                    results.push({
                        uri: uri.toString(),
                        fsPath: uri.fsPath,
                        preview: line,
                        ranges
                    });
                }
                continue;
            }
            // plain string search
            let idx = hay.indexOf(needle);
            if (idx === -1)
                continue;
            const end = idx + needle.length;
            if (args.isWordMatch && !isWordBoundaryMatch(line, idx, end))
                continue;
            results.push({
                uri: uri.toString(),
                fsPath: uri.fsPath,
                preview: line,
                ranges: [
                    {
                        startLine: i + 1,
                        startCharacter: idx + 1,
                        endLine: i + 1,
                        endCharacter: end + 1
                    }
                ]
            });
        }
    }
    return { count: results.length, results, scannedFiles: uris.length };
}
function isWordBoundaryMatch(line, start, end) {
    const isWordChar = (ch) => (ch ? /[A-Za-z0-9_]/.test(ch) : false);
    const before = start > 0 ? line[start - 1] : undefined;
    const after = end < line.length ? line[end] : undefined;
    return !isWordChar(before) && !isWordChar(after);
}
async function listDir(dir, rel, recursive, out) {
    let items;
    try {
        items = await vscode.workspace.fs.readDirectory(dir);
    }
    catch {
        return;
    }
    for (const [name, type] of items) {
        const childRel = rel.replace(/\\/g, '/').replace(/\/$/, '') + '/' + name;
        out.push(childRel);
        if (recursive && type === vscode.FileType.Directory) {
            await listDir(vscode.Uri.joinPath(dir, name), childRel, recursive, out);
        }
    }
}
//# sourceMappingURL=extension.js.map