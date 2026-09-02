# TriModel 模型路由 triage 诊断报告（组长 STREAM 全链 failed 根因）

- sourceOfTruth: 本件（FD 小全 triage 产物，2026-09-02，候 CTO 裁）；syncMode: static；lastSyncedAt: 2026-09-02
- 派工：CTO TriModel 模型路由 triage 小令（2026-09-02，非 LG-026 主线插队，根因 ST 门禁④补跑实证）
- 症状：TriRLC 组长真唤醒后 trimodel client STREAM 全链 failed（tmv-deepseek-v4-flash→pro→chat→deepseek-v4-flash 依 fallback 序全部 failed，信件停 pending）；keys 200 四 provider 正常、deepseek key 直连 api.deepseek.com/v1/models 200 活性正常
- 边界：TriModel 现役服务面（3333 CEO 亲启在跑）零重启零直改；全部 probe 只读（chat probe max_tokens=1）

## 一、诊断结论（四事实）

### F1【主根因·实证】tmv-* 全链上游 127.0.0.1:8008（TriStaciss 端点）不在跑

- `Invoke-WebRequest http://127.0.0.1:8008/v1/models` → 「由于目标计算机积极拒绝，无法连接 (127.0.0.1:8008)」
- 链路：tmv-* 别名 → `trimetaverse` provider（TriModel/src/providers/trimetaverse.ts:32 baseUrl 默认 `http://127.0.0.1:8008/v1`，:125 POST `${baseUrl}/messages`）→ 8008 ECONNREFUSED → **tmv-deepseek-v4-flash / v4-pro / chat 三级全部 failed 即闭合**
- 旁证：TriRLC 侧 keys 快照 `D:/Code/ai/.i4-3-live/data/keys.json` trimetaverse 段 `base_url: http://127.0.0.1:8008/v1`；TriMC docker 拓扑 `.i4-3-live/TriMC/docker/docker-compose.yml:19` `TRISTACISS_BASE_URL` 默认 `http://127.0.0.1:8008`——8008 属 TriStaciss（TriMC 拓扑件），本地未拉起
- GLM 路径（anthropic provider → OpenRouter）不受影响——解释 8/27 R/M 面 flash 档切换实测可用（e25da88 备注）而 tmv-* 现全灭

### F2【实证】fallback 尾 deepseek-v4-flash 上游活性正常，client 内 failed 真因被 dist 吞错掩盖

- 直连 probe：`POST https://api.deepseek.com/v1/chat/completions` model=`deepseek-v4-flash` max_tokens=1 → **HTTP 200**（0s，正常 completion 响应）——上游名存活，「deepseek-chat retire」族不波及 v4-flash
- 因此 trimodel client 内该级 failed 的真因（key 分发形态/超时/其他）**当前不可见**——dist 吞错（F3）致 reason 缺失；dist rebuild 后以新实例复测即可读真因

### F3【实证】TriModel dist 落后 src：30a671e 未 build，吞错无 reason 段

- dist 构建时刻 2026-08-27 10:48:35（dist/src/client.js LastWriteTime）；HEAD=30a671e 提交时刻同日 **18:28:49**——8.5h 差距
- 30a671e merge 收编内容含 fallback 日志与 reason 段（src/client.ts:234 `reason.slice` 在 dist/src/client.js 无对应——ST 定性复核成立）
- dist 已含 10:48 前提交（1858f90 退避重试、e25da88 glm-5.3-flash——3333 `/v1/models` 清单含 glm-5.3-flash 实证）
- 3333 服务面定性：`src/api/routes.ts:2` 「Configuration-plane only (no chat proxy)」——**3333 无 chat 代理路由**（/v1/chat/completions 必 404，本 triage probe 实证）；chat 全走 TriRLC 进程内 trimodel client 库（node_modules/trimodel junction → TriModel 仓）

### F4【实证】别名映射表现状（tmv-* → 上游）

| registry 别名（src/client.ts:44-65） | primary 上游 | fallback | 上游现状 |
| --- | --- | --- | --- |
| tmv-deepseek-v4-flash | trimetaverse→8008 | tmv-deepseek-v4-pro | **8008 拒连** |
| tmv-deepseek-v4-pro | trimetaverse→8008 | tmv-deepseek-chat | **8008 拒连** |
| tmv-deepseek-chat | trimetaverse→8008 | deepseek-v4-flash（有 deepseek provider 时） | **8008 拒连** |
| deepseek-v4-flash（链尾） | deepseek→api.deepseek.com | deepseek-v4-pro | 上游 chat 200 活（F2） |

- 附：`deepseek-chat`/`deepseek-reasoner` 上游名已 retire（dist/src/client.js:12 注释 + 3bdb7c5 merge 远端退役适配），src 保留为 backward-compat 别名（400 后自动 fallback deepseek-v4-flash，src/client.ts:17-29）——设计内降级非故障

## 二、根因闭环

组长（tmv-deepseek-v4-flash）→ trimetaverse provider → **127.0.0.1:8008 拒连**（F1）→ flash/pro/chat 三级全灭 → 链尾 deepseek-v4-flash 上游活（F2）但 client 内仍 failed 且 **reason 被 dist 吞掉**（F3）不可诊断 → ST 观测「全链 failed」表象。主修复点=8008 通路；次修复点=dist rebuild 恢复可观测性。

## 三、最小修复案（候裁，未直改）

- **案 A（推荐·通路修复）**：拉起/迁移 8008 TriStaciss 本地端点——属 ops 面（TriMC 拓扑件本地未部署），FD 侧不动现役，候 CTO 定 8008 责任面与拉起窗。若 TriStaciss 本地不再需要：走案 B 改道。
- **案 B（别名改道·代码面）**：TriModel registry tmv-* 三别名 primary 由 trimetaverse 改 deepseek（直连 api.deepseek.com/v1，F2 已证活），trimetaverse 保留为 8008 复活后的回切项；或 TriRLC 侧 env 化组长/heartbeat 模型名切 glm-5.3-flash（GLM 路径已实证可用）。两法均动模型路由语义，**候 CTO 裁**（涉 TriRLC 模型链硬编码 tmv-* 是否 env 化=面内判断，FD 认为组长 config 属本线产物 env 化属面内小改）。
- **案 C（观测恢复·零语义变化）**：TriModel `npm run build`（dist 追平 30a671e）——**对新起进程即时生效**（TriRLC 临时实例/组长复测实例重起即加载；8711 现役进程已加载旧 dist 不受影响也不受益，候窗重启才有 reason 日志）。rebuild 本身不触现役服务面。建议与案 A/B 并行先落（恢复可观测性是后续一切复测的前提）。

## 四·附、实证 probe 结论（CTO 裁决交付序③，2026-09-02 补）

- 裁决执行：C 案 dist rebuild 完成（dist/src/client.js 2026-09-02 15:45:17，reason 段 :175 入 dist，零语义，tsc 干净）——**新进程 reason 日志即证生效**：`[trimodel] tmv-deepseek-v4-flash failed (depth=0, reason: fetch failed)` 三级日志完整（rebuild 前不可见）。
- B 案 env 化半案落地：TriRLC 组长 config.model 支持 `TRILC_LEAD_MODEL` env 覆盖（缺省 tmv-deepseek-v4-flash 不变零破坏）。
- **实证存活名单**（TriRLC 进程内 client 形态 stream 真调用，completion 真出 content token 为准）：

| 模型名 | 判定 | 实证 |
| --- | --- | --- |
| glm-5.3-flash | **ALIVE** | deltas=1 finish=stop content="好" completion_tokens=91 |
| deepseek-v4-flash | **ALIVE** | deltas=1 finish=stop content="好" completion_tokens=36 |
| deepseek-v4-pro | **ALIVE** | deltas=1 finish=stop content="好" completion_tokens=41 |
| deepseek-chat | **ALIVE**（8/27 dist 注释称 retired，实测上游当前可用） | deltas=2 finish=stop completion_tokens=2 |
| tmv-deepseek-v4-flash | **FAILED** | fetch failed ×3（8008 拒连）后 THREW |

- **F5 新事实（dist rebuild 后可见）**：`MAX_FALLBACK_DEPTH=2`（src/client.ts:9）截断——tmv-deepseek-v4-flash 的 fallback 链 flash(0)→pro(1)→chat(2) 后超深度，**链尾 deepseek-v4-flash 永远不会被真正调用**。含义：8008 修复前，tmv-deepseek-v4-flash 起步的链路数学上无活出口；`TRILC_LEAD_MODEL=deepseek-v4-flash`（或 glm-5.3-flash）切名即绕开整条死链，实证可活。
- probe 方法注记：首版口径两处修正——①max_tokens=8 被 v4 系 reasoning 消耗致 content 零输出（64 预算解决）；②trimodel StreamEvent 为裸 `{delta, usage?, finish_reason?}` 无 type 字段。「keys 200 不作数」纪律正确，且实测证明 ST 的怀疑方向对、死点收窄到 8008 单点。
- 3333 现役零接触零重启；probe 脚本为一次性临时件已删，方法与输出记录于本节。

## 四、证据清单

- TriModel 仓（D:/Code/ai/TriModel，HEAD=30a671e，工作树 src 零 diff）
  - src/client.ts:44-65（tmv-* registry）、:17-29（deepseek-chat retire 兼容别名）
  - src/providers/trimetaverse.ts:32/:125（8008 baseUrl 与 /messages 调用）
  - src/api/routes.ts:2/:23-46（3333 配置面定性+路由全表）
  - dist/src/client.js LastWriteTime=2026-08-27 10:48:35 vs HEAD 提交 18:28:49
- probe 记录（2026-09-02）：8008 /v1/models 连接拒绝；3333 /v1/models 19 条清单（含 tmv-*/glm-5.3-flash）；3333 /v1/chat/completions 404×5（0s，无 chat 路由实证）；api.deepseek.com chat deepseek-v4-flash 200（max_tokens=1，key 取自 .i4-3-live/data/keys.json 缓存，明文不落本报告）
- 关联：ST 门禁④补跑实证（组长真唤醒 STREAM 全链 failed）、TriRLC letter-store 信件停 pending 面（LG-026-P2/P3 主线）
