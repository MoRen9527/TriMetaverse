# FADE-001 第二阶段（Agent qualify）技术设计稿 · CTO 技术面主笔件

- sourceOfTruth: 本件（fade001-phase1-build-20261114/cto-phase2-qualify-tech-plan.md·阶段 2 设计先行稿）
- syncMode: static（设计稿·施工一律候令候批——CEO 令③「设计先行与 P2/P3 验收并行」）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 14:30 直连令③（演练 OK 即直接进阶段 2 设计·四席联审 CTO 入列·先知会）→COS 15:05 采认+**演练 OK 判定成立**（D-39 域内径裁）+设计先行同意启动→本件
- 阶段 2 范围锚（十阶段映射 §二表第 2 行·CEO 23:06 勘正口径）: 改造后承载=L5 载体资格（进程执行环境 qualify）+agent 到岗窗断言；F 系归位=F2；现状承载=无

## §零 终裁总表

| # | 件 | 终裁 | 工作量 |
|---|---|---|---|
| 1 | 载体资格段形态 | `runtime/cognition/qualify.py` 独立薄模块·五资格断言（§二）·与 P1 preflight 边界=触发侧切片不复检 | 1 天 |
| 2 | F2 到岗窗断言 | arrival.json 标记形+alarm.ts 第三分支（§三）·grace 35min | 1 天 |
| 3 | payload vB 形 | preflight→qualify→迁移器三序（§四）·vA1 骨架全保留 | 0.5 天 |
| 4 | 与 11-15 首拍关系 | **首拍前零生产面变更**（§五硬声明）·阶段 2 施工窗候 11-16 晨检读数后 | — |

## §一 与 P1 已落面的边界（防重复建设声明）

- P1 preflight 五断言已承载触发侧切片：算周双闸（γ 主闸）/hostname/git hygiene/8710 healthz/分叉预检——其中 healthz 即映射表「8710 healthz 探针上移」的实现（P1 tech-plan §二.4 原注「L5 载体资格前移触发段的触发侧切片」）。**qualify 段不复检 healthz**（单点探针防双告警·CPO 防蠕变精神同构）。
- qualify 段本体=**执行侧资格面**：触发闸（preflight）放行后、迁移器（DCE）接棒前——判「这个执行环境有没有资格跑迁移」，与「这一拍该不该跑」（preflight 语义）分层。
- **存在价值活案例（演练段第一拍实锚）**：root 身份跑 payload→dubious ownership→fetch 128→exit 5+notify.json 读不到→告警链全 render_only（被拦且无人知道·首拍最毒形态）。qualify 执行身份断言（§二.1）在位时此形态=run 前资格拦+告警可发——演练段直接实证了阶段 2 的必要性。

## §二 载体资格断言清单（v1 五项·stdlib only 零新依赖）

调用形：`cd /srv/fleet/TriCompany && python3 -m runtime.cognition.qualify --run-dir $RUN_DIR`（run dir 由 payload 铸形段传入·qualify.json 落卷其中）。

| # | 断言 | 判定 | 拦截语义 |
|---|---|---|---|
| 1 | 执行身份 | `getpass.getuser()==fleet`（env 覆盖位=TRICO_QUALIFY_EXPECTED_USER·dev escape 同 P1 hostname 形制） | 非 fleet 身份跑=属主错位前兆（演练第一拍实锚）·拦 |
| 2 | run dir 可写 | RUN_DIR 存在+probe 文件 touch+删 | 落卷面不可写=全链读数哑卷·拦 |
| 3 | git 身份在位 | `git config user.name/user.email` 非空（迁移 commit 身份·TriRMC-Scheduler 值面零回显只判 nonempty） | commit 段必败前兆·拦 |
| 4 | 告警凭据在位 | `~/.trimetaverse/notify.json` 存在+SMTP 键族 nonempty（bool 面·D-46 零回显） | **告警链资格前验**——凭据缺失=拦截时告警发不出=静默死（P1 部署段凭据后置装配教训反推·把「告警可发」变成 run 前资格） |
| 5 | 磁头余量 | `/srv/fleet` 剩余≥500MB（shutil.disk_usage） | 迁移 tee 落盘+git 对象写中途满盘=半提交态·拦 |

- 退出码语义表（与 preflight 同族·bash 消费面一致）：0 全过 / 2 资格拦（qualify.json 落卷·trap 告警承担外发）。
- 单测随 TriCompany 测试纪律面：注入式拦截案（假身份/假 run dir/假凭据位三案·DEM-009 同款精神）+全过案。

## §三 F2 到岗窗断言（真源候选「触发+到岗」双断言的工程落形）

- **语义**：23:50 cron 触发→30min 到岗窗（→00:20）内值席 agent 到岗确认 run 结果（真源 fade-001-improvement 设计面原值）。
- **到岗信号载体（终裁·arrival 标记形）**：值席到岗后一条命令落标记——`date -u +%Y-%m-%dT%H:%M:%SZ > /var/lib/trirmc/cron/runs/<最新run>/arrival.json`（内容=时戳·值席值守窗 SOP 增一步·P1 值守窗 23:45 前置预检+晨检三读数已在 SOP·增量=一条命令零新链路）。
- **判定挂点（终裁·alarm.ts 第三分支）**：weekly-plane-shift job 有新 run 记录后 35min（30min 窗+5min 探测余量·告警至 00:25 前不违 CPO-011 ≤2h）run dir 无 arrival.json→「到岗超窗」告警（SMTP 双址·dedup/稳定窗复用 P1 四参数同构）。
  - 架构正位注：判定在 daemon 内 alarm timer（P1 终裁挂点）·payload 纯执行——patrol bash 扩判据方案否决（巡检逻辑进 payload=职责越位）。
- **考卷面**：T1 判据扩为「触发+preflight+到岗」三断言候选（P1 考卷随改清单 T1 行已注 F2 随改窗口并入候选·一次改卷制不破·随 P1 清单同窗并跳）。

## §四 payload vB 形（qualify 并入·vA1 骨架全保留）

骨架五要点不动（set -eo pipefail/RUN_ID 铸形第一动作/preflight 前置+拦截轮 manifest/值面三查/trap EXIT 全链兜底）——preflight 过后插 qualify 序：

```bash
python3 -m runtime.cognition.qualify --run-dir "$RUN_DIR" >"$RUN_DIR/qualify.json" 2>&1 || { RC=$?; printf '{"run_id":"%s","qualify_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"; exit $RC; }
```

- RC guard 用 vA1 正形（`||` 右侧真值·演练缺陷②教训已固化进骨架纪律）。
- 部署施工序沿用 P1 勘定形：**改形走 PATCH API 内存态**（部署段教训①固化）+重启后终态复验（md5+值面双查）。

## §五 与 11-15 首拍及 P2/P3 关系（硬声明）

1. **11-15 23:50 首拍=vA1 形端到端·阶段 2 施工零涉及**——首拍前生产面零变更（payload/preflight/alarm 三面全冻结至首拍毕+11-16 晨检三读数落卷）。阶段 2 施工窗候晨检读数后排（候令候批）。
2. P2（exit 3 diverging 演练·F4）/P3 验收=11-18/11-19±硬时钟——与本设计稿并行不互斥（设计先行语义）；P2 演练脚本若复用 drill 形须含 qualify 序（届时 drill v3+qualify 注入案一并）。
3. 施工拆树派工=COS+COO 树权门禁窗（P1 mount-gate 先例形）·本稿=设计先行供联审面。

## §六 验收锚（阶段 2 三条）

1. qualify 注入式拦截实锚：错身份/run dir 不可写/凭据位缺失三案注入→拦+告警达 COS 记录（DEM-009 同款·演练段 fleet/root 双身份实测法直接复用）。
2. F2 双向实锚：到岗超窗不 touch→告警达 COS；touch→静默零告警（dedup 不误报）。
3. 首拍零扰读数：11-15 首拍 vA1 形端到端绿（阶段 2 施工前置门=首拍不受扰证明）。

## §七 风险与回滚

- qualify 误拦风险（假阴性卡生产轮）：五断言全为前置可静态验证项+dev escape env 覆盖位——回滚=revert payload vB→vA1 形（PATCH API 单点改形·零代码回滚面）；qualify.py 模块保留无害（不被调用即零行为差）。
- arrival 标记依赖值席 SOP 遵行（人因面）：值席忘 touch→误报「到岗超窗」——误报方向安全（多告警不漏告警）·SOP 一步成本+考卷 T1 扩形双保险；dedup 防轰炸复用 P1 形。
- alarm.ts 第三分支改动面：与 P1 已部署告警闸同模块——改形随施工窗·回滚=revert 单文件+build+重启（P1 回滚锚 §五同形）。

## 使用依据

十阶段映射 §二表第 2 行+§五 CEO 23:06 勘正（L4-L5 归属）/真源 fade-001-improvement-20261110.md F2 条+触发段设计面（30min 到岗窗原值）/P1 tech-plan §二.4（healthz 前移切片边界）+§五（值守窗 SOP 位）/演练段毕报 cto-drill-closeout-20261113.md（第一拍 root 实锚=qualify 必要性实证·vA1 RC guard 正形）/COS 15:05 演练 OK 判定+设计先行同意令。

—— CTO 小狄（m-cto·阶段 2 设计先行稿），2026-11-13 15:05:38 +0800（写前现查 2026-11-13T07:05:38Z 原值粘贴·D-47 正形）
