# TriMMC 编排拾取件移植河源·技术勘量卷（CTO·CEO 16:15:02 直令勘量节点）

- sourceOfTruth: 本卷（移植路线+施工窗勘量定谳正身·回执 BOD 抄 COO·排工流转归 COO）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 2026-11-05 16:15:02 直令（BOD 16:25 流转·COS 16:26:53 转投）verbatim「把TriMMC的编排拾取件移植到河源，让R面也具备。」
- 勘量法: 双机五向活体现探（sg=M-SG-47.245.122.61 / 河源=R-HY 经 -J 跳板·全程活体读数禁推定·md5 逐字节对表）

## §一 · 勘定总览（令文对象勘误注记·三反转）

**反转①「TriMMC 独有编排件」实为 TriCompany 仓件族·且河源已逐字节一致**：编排拾取件本体=`TriCompany/runtime/cognition/` 编排族——`orchestrate_tick.py`（23,649B·10-02 铸·7×24 编排工作循环 M2 正身）+`tree_op.py`（14,106B）+`dispatch/` 六件族。**双侧 md5 对表全同**（orchestrate_tick `43e528266fa6985dbabe82f0df0d3113`·tree_op `4c7d790df7e3a02d0079f4a156875d68`·dispatch/ 六件同构）——代码面河源**不缺**，零移植需求。

**反转② R 面编排循环现役已在跑**：河源 TriRMC 8710 cron 4 jobs 含 **`rmc-orchestrate-tick`（enabled=True）**，跑 TriRMC 仓自有 `scripts/rmc_tick.py`（442 行·rmc-autonomy-001 RA-2·与 M 面 orchestrate_tick 同构：三重门/指纹边沿/锁/台账全谱）——`tick-fingerprint.txt` **今日 16:22 刚写**（扫描循环活体在跑）·shadow-plane 台账族在（8 月末真实跑过一批 orchestrator-session 会话）·`orchestration.json` 河源本地化版在（glm-5.3-flash+2400s·与 sg 默认 deepseek 系已分化）。

**反转③ 真缺口=spawn 后端断链·「能扫不能干」**：rmc_tick spawn 后端=`127.0.0.1:8711/v1/messages`（8-28 铸时 TriLC 旧名位）——**河源 8711 现零监听**（ss 实证仅 8710·curl 空回）+河源 TriRLC 仓未编译未部署（dist 缺）。扫描循环活（指纹持续写）+spawn 链死（cost-ledger/session-registry **10-01 后停更**）——CEO/BOD「机制不具备」的终端判断与活体吻合，但机理=断链非缺件，**修复面远小于整件移植**。

## §二 · R 面现态活体读数（六面）

| 面 | 读数 | 锚 |
|---|---|---|
| 代码面 | TriCompany 编排族全在·与 sg 逐字节一致 | md5 双侧对表（§一） |
| daemon 面 | TriRMC 8710 活（trirmc.service·fleet·WorkingDirectory=/srv/fleet/TriRMC）·healthz ok | systemctl+curl |
| cron 面 | 4 jobs=weekly-plane-shift+**rmc-orchestrate-tick**+tricompany-pull+e1b2-window-reminder-patrol-8710·全 enabled·degraded=false | data/cron/jobs.json 活读 |
| 席组面 | 13 席 `claude --resume r-duty-*` 活（fleet）·r-duty-boot.sh 启动器在（SDE 11-04 铸·mirror sg m-duty 形） | ps 活体 |
| **断链面** | **8711 零监听**·TriRLC 未编译（dist/src/index.js 缺）·TriLC/.env 旧名目录在 | ss+ls 活体 |
| 台账面 | tick-fingerprint 16:22 活写·cost-ledger/session-registry 停 10-01（=spawn 断链时点旁证） | shadow-plane 活读 |

**TriRMC daemon 侧补勘**：`/internal/v1/tasks` POST=**acceptPlaceholder 占位**（非执行引擎）；**`/internal/v1/agent` POST=真执行引擎**（agent-loop+pipeline assembly+contract/tier/maxTurns 25+resolveDefaultModel·daemon 内完整循环）——R 面 headless 执行端点现役在。TriMMC 侧独有且 TriRMC 缺的面=notify 值席信箱族（outbox 388+duty-consumer 187+echo-queue 253+echo-routes 109+routes 145=**1082 行**+app.ts 挂载段）；TriRMC orchestration/ 库=9-20 旧版（与 sg 9-30 版差：employee-registry 缺 **family!=='Role' 过滤 5 行=CTO 2026-10-02 batch-15 件③追裁**·trilc-executor 纯旧名漂移零功能差·其余头注漂移）。

## §三 · 移植路线定谳（主修复+顺手件+第二序候裁）

**主修复（第一序·本窗）——rmc_tick spawn 后端改投同机现役引擎**：
- 现形：`TRILC_MESSAGES = "http://127.0.0.1:8711/v1/messages"`（死链）+token 读 `/srv/fleet/TriLC/.env`（旧名目录）
- 正形：改投 `http://127.0.0.1:8710/internal/v1/agent`（TriRMC 自身 agent-loop·同机闭环·零新部署·机位矩阵不破单形）+token 源改 TriRMC 部署 env（fail-closed 同构保留）+请求体映射（/v1/messages Anthropic 形→/internal/v1/agent 形：systemPrompt/maxTurns/cwd）+响应/usage 解析适配
- 改动面：**rmc_tick.py 单文件约 40-60 行**·TriRMC 仓 git commit 承载·daemon 不需重启（tick=cron 子进程形态·job 注册不动）
- 判据链：三重门扫描逻辑/指纹边沿/成本护栏（月 1000 元+日 token cap 15 亿·tick 内建）/台账记账全谱**零改动**——只换 spawn 端点适配层

**顺手件（同窗同笔）——TriRMC orchestration/ 库追裁对齐**：employee-registry.ts 补 family 过滤 5 行（CTO 10-02 batch-15 件③追裁·roster 纯度维持）+trilc-executor 等旧名漂移对齐——小改单 commit。

**第二序候裁（非本窗·随本卷呈 COO/CEO 排程）——notify 值席信箱族移植+席组派工面**：TriRMC 缺 notify/ 1082 行+app.ts 挂载段（值席信箱/跨面通知/echo 队列）。第一序 spawn 走 8710 自执**不需要**信箱；若后续要求「编排 tick 拆树→派工给 13 席席组班组」形态（tmux 直发通道），则第二窗移植 notify 族+派工适配。**CEO 令「班组派工」语义的两形取舍候令**：(a) 第一序形=spawn 单编排会话自执（8 月现役形·改动最小·最快恢复 R 面编排能力）；(b) 第二序形=拆树派席组（与 sg 值席班组形对齐·工程量大）。本席建议先 (a) 复活全链再评估 (b)。

## §四 · 施工分解与排工建议（流转 COO）

| 序 | 件 | 建议席 | 窗 |
|---|---|---|---|
| 1a | rmc_tick.py spawn 后端适配（§三主修复） | **SDE**（R-HY 通道现成·部署线 owner·现窗空闲） | 即窗（候 COO 派令） |
| 1b | orchestration/ 追裁对齐（§三顺手件） | SDE 同笔 | 随 1a |
| 1c | 全链实测（§五验收锚） | SDE 施工+STE 复验（第二方法） | 随 1a 毕 |
| 2 | notify 值席信箱族+席组派工面（§三第二序） | 候令 | 候 (a) 验收后评估 |

施工纪律：河源 TriRMC 仓 git 操作 `sudo -u fleet`/fleet 身份·origin=sg bare（ssh://fleet@47.245.122.61/srv/git/TriRMC.git·河源顶 2c5395e·工作区干净）；单 commit 可 revert 回滚；TriRMC cron 无 ALLOWLIST（job 零重注册）；13 席席组独立栈零冲突；TriCompany 仓两侧 hash 链分叉（同内容异 hash·sg 顶 2b64551 vs 河源 github 顶 8148369）——**禁整仓同步**，施工只动 TriRMC 仓目标件。

## §五 · 验收锚（BOD 附测点全链实测·判据细化）

1. **静态门**：rmc_tick.py 语法过+`--dry-run` 三重门扫描读数正常（不改状态的干跑）
2. **端到端门（BOD 建议全链）**：任务书挂平面（测试树 tree-op.json：status=active+domainRouting=server-executable+pending 节点·TriRMC scripts/ 已有 `rmc-audit-tree.json` 可作测试树基）→`rmc_tick.py --once` 手动触发→三重门过→spawn 8710 成功→agent 执行→树节点收口 status=done→cost-ledger 记账恢复+session-registry 更新——七链节逐节断言
3. **护栏门**：成本护栏读数（月台账）+超限降级路径 dry 断言
4. **回归门**：weekly-plane-shift/tricompany-pull/e1b2-patrol 三 job 零扰动+fingerprint 持续写+13 席席组零触碰
5. **回滚姿态**：TriRMC 仓 git revert 单 commit 即回 2c5395e 形态·零 daemon 重启·零 job 重注册·零席组影响

## §六 · 风险与缓解

- **R1 spawn 引擎差异**：/v1/messages→/internal/v1/agent 请求/响应形态映射若漏字段=spawn 半途炸——缓解：先 --dry-run+单节点小树实测·SDE 自测+STE 第二方法双闸
- **R2 cron 拾取窗错拍**：tick 17,47 * * * *（30min 窗）施工期间与手动 --once 并发——缓解：rmc_tick 有 orchestrator.lock 锁（同构 M 面）·施工窗避拍或短窗完成
- **R3 成本面**：spawn 会话真实消耗——护栏双层在（tick 内月 1000 元+日 token cap）·验收锚用最小树控成本
- **R4 河源 TriCompany 仓分叉**：禁整仓 pull/push（hash 链异）——施工面收敛 TriRMC 仓零触 TriCompany 仓

## §七 · 使用依据锚谱

- 活体探锚：M-SG-47.245.122.61（sg）+R-HY-8.155.54.79（河源·-J 跳板）双机 ss/ps/systemctl/curl/md5sum/git 活读·本卷时戳窗内
- sg 侧：/srv/fleet/TriCompany/runtime/cognition/（orchestrate_tick.py 头注 M2 五步正身）+/srv/fleet/TriMMC/（src/orchestration+src/notify+docs/engineering/employee-orchestration-design.md V1.0）+/tmp/jobs.json（**6 月旧 store 残留**·非现役·已标注）
- 河源侧：/srv/fleet/TriRMC/（scripts/rmc_tick.py 442 行+data/cron/jobs.json+src/server/app.ts 路由面+src/orchestration 旧版）/srv/fleet/shadow-plane/（台账族）/home/fleet/.trimetaverse/orchestration.json
- 本机对照：/tmp/orch-sg /tmp/orch-hy 双侧拉回 diff 底稿
- 关联卷：BOD 附测点（CEO 16:03 令 13 席+dsh 已验）·COS 转投信（16:26:53）·CEO 直令（16:15:02）

—— CTO 小狄（勘量节点·回执 BOD 抄 COO·排工流转 COO）
