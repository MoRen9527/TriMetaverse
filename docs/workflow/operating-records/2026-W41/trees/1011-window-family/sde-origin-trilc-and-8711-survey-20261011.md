# SDE 排工毕报 · TriMLC origin 追平+8711 同源在位性勘验（COO 窗毕拉单#1 两件）

- sourceOfTruth: 本卷（trees/1011-window-family/sde-origin-trilc-and-8711-survey-20261011.md）
- syncMode: static（排工毕报卷）
- lastSyncedAt: 2026-10-11 13:40:31+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；令源=COO 窗毕拉单#1（13:34+08·令源链 CEO 13:28 质询→BOD 13:30 裁）；挂账真源=cto-repair-window-report-20261011.md @5cbfe118 §八.1/§八.4

## 件① TriMLC origin 追平双腿推平（§八.1）

**结论：双腿已在位平顶，零待推——挂账实销（活体验真非转抄）。**

| 面 | 顶 hash | 判 |
| --- | --- | --- |
| TriMLC 本地 dev | `baf800d` | 基准 |
| sg bare（`git config remote.origin.pushurl` 读值=ssh://fleet@47.245.122.61/srv/git/TriMLC.git，禁手拼铁律满足） | `baf800d7`（ls-remote 独立验真） | 平 ✓ |
| GitHub 443（https://github.com/MoRen9527/TriMLC.git） | `baf800d7`（ls-remote 独立验真·**443 现通**） | 平 ✓ |
| fetch 后本地 origin/dev ref | 6f832a1→baf800d（fetch 增量 6 笔印证） | 领先面归 0 ✓ |

- **勘注（读数反转归因）**：令文「本地领先 6 笔」系 CTO 毕报时点（12:40）挂账态；本席 13:4x 活体 ls-remote 双腿各独立验真=两腿均已推平——**「领先 6 笔」为本地陈旧 origin/dev ref 假象**（ref 面 vs 远端真值面两分层，fetch 后归零印证；双腿推平者非本席，推平时点与执行者候 COO 对值席面）。本席零 push 动作（无可推）。
- 纪律遵照：pushurl 取 config 禁手拼 ✓；两腿独立 ls-remote 验真 ✓（tail 截断不可作判读纪律遵照）；GitHub 443 断续预案未触发（腿已通）。

## 件② 8711（TriRLC 仓）三件同源在位性勘验资料（§八.4·只勘不修）

**总判：三件 8711 侧均同源缺位/缺防——候下窗修复面备料（零施工）。**

### 件A 崩溃 handler —— **同源缺口实锚（8711 侧零在位）**

- TriRLC src/ 全域 grep `uncaughtException|unhandledRejection|crash-handler` **零命中**——8711 无全局崩溃接面，uncaughtException 即裸崩（watchdog revive 通道在但 crash.log 取证面缺）。
- 备料：TriMLC 正形=fc44904（src/crash-handler.ts 新建+index.ts 注入+TRIMLC_CRASH_LOG_ONLY=1 回滚通道）；回流=同名件+TriRLC 侧 LOG 前缀/路径适配。

### 件B race guarded —— **结构同形缺口实锚（防残面缺位）**

- TriRLC `src/cron/timer.ts` L314-329 `executeJobCoreWithTimeout`：L326 `await Promise.race([jobPromise, timeoutPromise])`——**无 guardedJob.catch 滞后 rejection 吸收**，与 TriMLC 件B（cc52c89）修复前同形。
- 差异注记（如实录·可触发性候 CTO 判）：TriRLC executeJobCore 子进程 wrap 用 close handler **resolve 形**（L301-310：错误走 `resolve({status:"error"})` 非 reject）——command job 常规错误面不产生 rejection，可触发性结构上低于 TriMLC 形态；但 jobPromise 上游（executeJobCore 内 await 链/依赖回调 throw）rejection 可能性未穷尽勘，防线缺位同构成立。
- 备料：TriMLC 正形=cc52c89（guardedJob.catch 吸收滞后 rejection 转 error 结果入 race·状态面零变）。

### 件C F-3 第三型 enabled 缺省归一 —— **运行时缺口成立实锚（三要素全录）**

| 要素 | TriRLC 现状 | 判 |
| --- | --- | --- |
| ①store 层 INSERT | `src/cron/store.ts` L235 `input.enabled ? 1 : 0`——**非 `?? true` 归一形** | 缺口 ✓ |
| ②类型面 | `types.ts` L49-52 `CronJobCreate = Omit<CronJob, "id"\|"state"\|"createdAt"\|"updatedAt"\|"runCount"\|"errorCount">`——enabled 不在 Omit 列=**编译面必填** | 编译挡面在 |
| ③HTTP 入口 | `app.ts` L4125-4128 `cronEngine.addJob({...(body as Record<string,unknown>), systemPrompt: ...} as never)`——**`as never` 原样透传绕类型面** | 运行时缺口成立 ✓ |

- 缺口行为面：POST /internal/v1/cron/jobs **缺 enabled 字段** → body 透传 `input.enabled=undefined` → L235 `undefined ? 1 : 0` = 0 → **201 返回+job 静默 disabled**（调用方以为建成 enabled job，实际永不跑，无任何提示面）。
- 与 TriMLC 件C（baf800d）同源同形（TriMLC 修法=store 层 `(input.enabled ?? true) ? 1 : 0` 归一全入口覆盖+CronJobCreate.enabled 可选+CronStoreLike 签名同步——注意 TriMLC 施工增量注记：interface extends Omit 惯形+签名双处同步，回流同坑位可参照）。
- 下窗活体探针预置（候批·本席未执行零触碰）：POST 缺 enabled 的 systemPrompt 形 payload → 预期现役返回 201+值面 enabled=false → 修复后应 201+enabled=true（TriMLC §六 S6 三查门同款形）。

## 使用依据

- COO 窗毕拉单#1（13:34+08）；CTO 勘修窗毕报 @5cbfe118 §八.1/§八.4；三件正形 commit fc44904/cc52c89/baf800d（TriMLC 仓）
- 勘验源码：TriRLC src/cron/timer.ts L314-329、src/cron/store.ts L218-255、src/cron/types.ts L49-52、src/server/app.ts L4107-4137；TriMLC git config remote.origin.pushurl+双腿 ls-remote
- 记忆条：key-presence-vs-value-validation（ref 面 vs 真值面两分层——件① 反转读数同族）/trimmc-mlc-addjob-divergence（三形态勿互套——本卷按 TriRLC 独立勘验零互套）
