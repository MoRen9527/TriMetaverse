# 波③ 共享 core 导出面接口清单（纯设计·不动码）

> sourceOfTruth: 本件（FSD workbench 设计稿，候 CTO 派单裁决后转施工）
> syncMode: snapshot
> lastSyncedAt: 2026-09-25T20:15Z（+0800=2026-09-26 04:15）
> 依据: CTO 五架构点裁决（04:0x）＋joint-plan 问3＋波① 现役内核实读（TriModel `src/api/claude-fallback.ts`，588 行，commit 3db73829）
> 红线: 本件纯设计；施工候正式派单；现役 HTTP 行为零变；LG-035 冻结面零触碰

## 0. 设计总则（从五架构点推导）

1. **core 零仓感知**：core 不 import 任何仓特有常量/路径；一切仓特有项（写入目标、域参、machine 标识、探针源）经**注入点**（CoreOptions）由 bin 侧给。
2. **分层剥离**：现役 `claude-fallback.ts` 实为三层混居（纯函数/IO 内核/HTTP handler）。core 化=前三层迁 TriCode，HTTP 壳层留 TriModel 改调 core（URL 空间与现役行为零变）。
3. **缺省解析器随 core 走**：env 解析（SETTINGS_FILE_ENV 等）保留 core 内缺省实现（TriModel 现役零改即兼容），bin 可覆写。
4. **RESULT 行三统一**（CPO 判据）在 core 结果 schema 一处达成——HTTP body 与命令行 RESULT 行同构映射。

## 1. 分层接口清单

### L-A 纯函数层（零 IO 零 env，直接迁）

| 接口 | 现役签名（src/api/claude-fallback.ts） | 迁移形态 |
| --- | --- | --- |
| `MODEL_TIER_KEYS` | `export const`（9 键族，:81） | 原样迁，core 常量 |
| `BACKUP_KEEP` | `export const = 5`（:94） | 原样迁，可进 CoreOptions 缺省 |
| `credentialGate` | `(apiKey: string) => string \| null`（:147） | 原样迁（null=通过，字符串=人话拒因） |
| `validateTriplet` | `(input: RestoreInput) => { baseUrl, apiKey, model } \| { error }`（:182） | 原样迁（门③+格式校验合一） |
| `envSubsetDiff` | `(prevEnv, baseUrl, apiKey, model, hasApiKeyCarrier) => DiffRow[]`（:195） | 原样迁（凭据 len-only 掩码红线在此） |
| `parseRestoreInput` | `(rawBody) => { input } \| { error }`（:171） | 迁入并**参数化**：命令族无 rawBody，改 `normalizeInput(partial: RestoreInput)`；HTTP 壳自做 JSON.parse 后调它 |

### L-B IO 内核层（路径注入制，五门心脏）

| 接口 | 现役签名 | 注入点 | 迁移形态 |
| --- | --- | --- | --- |
| `readSettings` | `(path) => { raw, doc } \| { error }`（:112） | path 显式传 | 原样迁（内部函数转导出） |
| `rotateBackups` | `(path) => { rotated, removed }`（:218） | path 显式传；keep 缺省 BACKUP_KEEP；哨兵 FROZEN-BACKUPS 识别 | 原样迁 |
| `verifyWritten` | `(path, expected { baseUrl, apiKey, model, hasApiKeyCarrier }) => { ok: true } \| { ok: false, why }`（:238） | path 显式传 | 原样迁（门④写后断言器） |
| `writeEnvSubset` | `(who, baseUrl, apiKey, model, opts { settingsPath?, dryRun? }) => { statusCode, body }`（:266） | **core 化改签名**（见 §2）：`runWrite(plan: WritePlan): WriteResult` | 门①幂等短路/备份先行/原子写/写后断言+自动回滚/审计行——五门一处落地不变 |
| 备份清单内核 | 现混在 `handleGetClaudeFallbackBackups`（:455） | path | 剥出纯内核 `listBackups(path): BackupMeta[]`（file/mtime/size/sentinel），HTTP 壳与 `config`/`status` 共用 |
| 回滚内核 | 现混在 `handlePostClaudeFallbackRollback`（:486） | path；文件名正则守卫 | 剥出 `rollbackTo(path, backupFile): RollbackResult`（回滚前自动备份当前态=可逆） |

### L-C 环境解析层（core 缺省解析器＋bin 覆写）

| 接口 | 现役 | core 化 |
| --- | --- | --- |
| `settingsPath()` | env `TRIMODEL_CLAUDE_SETTINGS` → 缺省 `~/.claude/settings.json`（:51） | 缺省解析器保留；CoreOptions.settingsPath 覆写（现役 opts 注入已通，扩展成统一 CoreOptions） |
| `deployKeyPath()` | env `TRIMODEL_DEPLOY_KEY` → 缺省部署位（:58） | 同上；**per-provider 扩展**：`.deploy-key.bigmodel` 命名族（问3 模板三件套），缺省解析器收 provider 参 |
| `appendAudit` | env `TRIMODEL_AUDIT_LOG` → 结构化行（:72） | CoreOptions.auditLogPath 覆写；行 schema 不变（who/mode/backup/assert/result/detail）——status 与事后取证共用此源 |
| `DEFAULT_PROVIDER` | 无（现役模板表直取 bigmodel） | **core 常量 `bigmodel` + env 覆写一档**（CTO 裁⑤：`TRIMLC_DEFAULT_PROVIDER` 族形 env 名）；不建配置文件 |

### L-D 模板层

| 接口 | 现役 | core 化 |
| --- | --- | --- |
| `TEMPLATES` | 内置常量表（:98，bigmodel deployed / deepseek 候批） | **presets 装载器取代内置表**：`loadPresets(presetsDir): ProviderPreset[]`；`ProviderPreset = { id, label, base_url, model, key_placeholder, deployed }`；presetsDir=注入项（TriModel 现役内置表→转 presets/direct.json 形态迁移基料，TC `scripts/ops/local/presets/` 先例在卷）；**钥不进模板**（独立钥文件 per-provider）纪律在装载器断言（含 key 字段的 preset 拒载） |
| `listTemplates()` | (:103) | 变 core 导出 `listPresets(opts): PresetInfo[]`（deployed 过滤策略=参数） |
| 占位符守卫 | inject-key 路径（:551 段）fail-closed | `readDeployKey(provider, opts): { key } \| { failClosed, why }`——缺失/空/占位符/健康门四连，零半写 |

### L-E 命令编排层（波③ 新码，core 的命令面）

四族 bin 共用的编排函数——core 提供语义，bin 提供 argv 与注入项：

| 命令 | core 编排签名（拟） | 数据源 |
| --- | --- | --- |
| `restoreDirect` | `(args { provider?, keyFile? }, io: CoreIO) => ResultLine` | preset 装载＋readDeployKey＋runWrite；**零参数=DEFAULT_PROVIDER 安全侧默认**（CTO 裁⑤；provider 不存在 fail-closed 报错列可用模板） |
| `configList` | `(io) => ResultLine` | listPresets（len-only 显示策略在此） |
| `configGet` | `(args { keys? }, io) => ResultLine` | readSettings→键形投影（密钥 len-only；「我现在用什么配置」人话行） |
| `configSet` | `(args { provider?, base_url?, model?, keyFile? }, io) => ResultLine` | **与页面同一套 runWrite 五门内核**（问3 判据） |
| `status` | `(io) => ResultLine` | readSettings 键形＋listBackups＋**探针读数（注入）**＋L2 标记态（路径注入）；零参只读 |

### L-F HTTP 壳层（留 TriModel，不进 core）

现役 `handleGetClaudeFallback` / `handlePostClaudeFallbackRestore` / `...Preview` / `...Backups` / `...Rollback` / `...InjectKey` 六 handler（:394–:588）：改薄=鉴权（adminOk/requireAdmin 留壳，token 属服务面）＋JSON 解析＋调 core＋statusCode/body 映射。URL 空间与响应体现役行为零变（ui-boot-connection 276 测套为回归锚）。

## 2. 关键类型设计（拟）

```ts
// 注入点汇总——bin 侧唯一需要构造的东西（core 零仓感知的落点）
interface CoreIO {
  settingsPath: string;             // 写入目标（必注入）
  presetsDir: string;               // 模板目录（必注入）
  deployKeyPathFor: (provider: string) => string;  // 独立钥文件命名族
  auditLogPath: string;             // 结构化审计行落点
  who: string;                      // 审计调用方标识（'trimlc-cmd' | 'trirlc-cmd' | 'ui-restore' | ...）
  machine?: string;                 // 四象限路由键（问6；本机 M/R 分族注入）
  probes?: ProbeSource[];           // status 探针源（路径型: { name, logPath } ——core 读 tail 聚合）
  l2FlagPath?: string;              // L2 标记态读数源
  defaultProvider?: string;         // 缺省=core 常量 'bigmodel'，env TRIMLC_DEFAULT_PROVIDER 族再覆写
}

// RESULT 行三统一 schema（CPO 判据：语法·结果行·输出风格同构）
interface ResultLine {
  ok: boolean;
  code: 'RESTORED' | 'ALREADY_SAME' | 'ROLLED_BACK' | 'WRITE_FAILED_ROLLED_BACK'
      | 'KEY_FAIL_CLOSED' | 'PRESET_UNKNOWN' | 'DENIED' | 'PROBE_DEGRADED' | ...;
  message: string;                  // 人话行（CPO 人话纪律：出了什么事/什么状态/做什么）
  data?: Record<string, unknown>;   // 结构化体（backup/keys_written/diff len-only/probe 读数）
}
// 映射：HTTP 壳 statusCode = f(code)（200/400/401/422/500 同现役）；命令行输出=RESULT 行序列化＋message 顶行
```

## 3. 迁移与回归锚

- **施工序**（候派单）：core 骨架（L-A/L-B/L-C 直迁，TriModel 改 re-export）→ presets 装载器（L-D）→ 命令编排（L-E）→ 四 bin（正名+alias 双键）→ HTTP 壳改调 core（回归 276 测）。
- **继承验收基线**：f887b27 修-1..6＋STE 25/25（脚本侧行为对照）；五防线硬条款全量继承=writeEnvSubset 五门不删不减。
- **回归锚**：TriModel 276 测套全绿=HTTP 面零变证明；core 新增单测=五门逐门（复用 wave1 25 测形态，注入临时域）。
- **组② trimc 双仓冲突**（CTO 裁③）：alias 期无解不阻塞，弃用引导换新名。

## 4. 候 CTO 裁/核点（纯设计暴露项）

1. `CoreIO.probes` 路径型 vs 回调型（本稿取路径型起步——core 读日志 tail 零回调序列化问题；回调型候真实需要再扩）。
2. `writeEnvSubset` 现役签名（who/baseUrl/apiKey/model/opts）与拟 `runWrite(WritePlan)` 的映射关系——WritePlan 蓝本=现役五参+CoreIO 归并，施工时一步到位或先薄适配层过渡（候派单定）。
3. `TRIMLC_DEFAULT_PROVIDER` env 命名族：前缀取 `TRIMLC_`（本稿照 CTO 裁⑤原文）——但四族共用 core 时该 env 是全局一份，**分域覆写**（trimlc vs trirlc 各自默认 provider 不同）候需求确认（现势无此需求，先一份全局）。
4. presets 装载器的 deployed 过滤：命令族 `restore-direct` 对 `deployed: false` 的 provider 是否拒写（现役 HTTP 面模板选择已拒）——建议 core 侧同 fail-closed，候裁。
