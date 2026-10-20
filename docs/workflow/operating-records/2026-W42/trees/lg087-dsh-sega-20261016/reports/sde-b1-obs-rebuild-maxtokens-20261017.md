# SDE 施工卷 · B1 步①②毕（观测实例再起+maxTokens 300 硬顶装设面落位）· 候步③ cos GUI 手测 · 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-b1-obs-rebuild-maxtokens-20261017.md
- syncMode: static（施工卷·步①②毕·候步③）
- lastSyncedAt: 2026-10-17 13:55:20+08:00（date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 B1（COO 13:49 开工令·四步 checklist）
- 施工位: 河源 R-HY ~/.dsh-segb-obs（观测面）

## 步① 观测实例再起（毕）

| 断言 | 读数 | 判 |
| --- | --- | --- |
| 8790 前置 FREE | PORT_FREE_OK | ✓ |
| boot 进程 | pid=232415→（步②重启后）pid=**233952**·fleet·dsh web --port 8790 | ✓ |
| 8790 LISTEN | 127.0.0.1 绑定×1 | ✓ |
| preset 挂载 | tricompass 行 13 条（13 preset 全挂） | ✓ |

## 步② maxTokens 300 硬顶装设位勘定+落位（毕·裁①条件①）

### 勘定链（五层收敛）

| 层 | 勘 | 读数 |
| --- | --- | --- |
| 1 | 观测 patch/agent-preset lib/web-app lib grep maxTokens | 三面零命中——preset 段（AgentPreset=id/name/description/order/broken）与 GUI 均无此键 |
| 2 | 全包面一网搜 | **dsh-agent-preset-registry typert 实锚**：`AgentOptions{provider?;model?;reasoningEffort?;maxTokens?;subagentDepth?}`+`LlmCallConfig{...maxTokens?}`——maxTokens=agent 级选项 |
| 3 | agent-loop 用法 | options.maxTokens 未传→requestHeader config 无此键→**adapter 默认接管**（LlmCallConfigAdapterDefaults 机制） |
| 4 | adapter 归属勘误 | 观测/生产 patch **均零 llm 条**——deepseek adapter=dsh-base 出厂条（L526 `id: llm-deepseek`·零 config 走全默认）——先前 head 截断漏看（94 条目·截断教训再实锚） |
| 5 | **装设位定谳** | dsh-llm-deepseek config schema：`maxTokens: z.number().min(1).default(DEFAULT_MAX_TOKENS)`——**LLM provider 插件 config 顶层键**·GUI settings 无覆盖项（web-app 零命中→config 值稳定生效） |

### 落位施工（id-targeted override·官方合成规则）

- 依据 dsh-base patch 头注：「user's profile cordis.patch.yml **address these rows by id, last write winning**」+「patch **replaces the targeted row's whole config**」——观测 home patch append override 条：

```yaml
  - id: llm-deepseek
    name: '@deepseek-ai/dsh-llm-deepseek-api-key'
    config:
      maxTokens: 300
```

- apiKeyEnv 不写=走 README 默认 `DEEPSEEK_API_KEY`（观测 store refs 同名键·P2 接管面无损）。
- patch md5：7300f0d2→**c2f75ba7**（append 前后照）·备份件 cordis.patch.yml.bak-b1-maxtok（294907B）在档。
- 写法=文本精确 append（patch 含 `!!js` 禁 yaml load·P1 同款管道）。

### 生效验证（重启+四断言）

| 断言 | 读数 | 判 |
| --- | --- | --- |
| 旧实例退 | TERM 232415→EXITED_OK→PORT_FREE | ✓ |
| 新实例起 | pid 233952+8790×1 | ✓ |
| 13 preset 全挂 | tricompass 行 13 条 | ✓ |
| override 合法性 | boot log **零 error/parse 行**（zod schema 接受 maxTokens:300=装设面级活体过） | ✓ |

**值面行为注记**：装设面级绿（配置进组合活体+schema 接受）；**行为级（真实请求 300 截断）候步③ GUI 手测并验**——persona 自检句短回复无感属正常·长回复截断=天花板预期行为（如实录 cos 手测读数）。

## 步③ 就绪态（候 cos 侧入场）

- GUI 入口：`http://127.0.0.1:8790`（URL+token 在 obs-boot4.log·fleet 可读·**token 零转报**·cos 侧自读）
- store/preset/patch 冻结三件健在+备份件齐
- 手测项（COO 知会 cos）：①compass 渲染对表 ②persona 自检句——**r-duty-cos preset 会话**
- 手测毕=步④关停（7270MB 纪律·SDE 施工位执行）

## 挂账更新

- patch 截断漏看教训（head -20 截断致 adapter 归属误判一轮）——已在勘定链层 4 自正·全量 grep 复验
- 观测实例现役 pid 233952（步④候关停）

## 使用依据

- COO B1 开工令 13:49（四步 checklist）·CTO 三裁信 13:44:15（裁①条件①原文）
- dsh-base cordis.patch.yml L518-531（出厂条原形+合成规则头注）·dsh-llm-deepseek lib L302-317（config schema）
- B1 再起 checklist（sde-p0-obs-shutdown-closeout-20261017.md）

落款=SDE 小布 2026-10-17 13:55:20 +0800（date 现查原值·发毕对表）
