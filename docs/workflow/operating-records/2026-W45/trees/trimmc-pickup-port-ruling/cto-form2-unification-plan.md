# 两域服务域编排形态统一改造方案（形二·席组形·CTO·CEO 17:04:22 形态定谳承接卷）

- sourceOfTruth: 本卷（形二改造方案定谳正身·替代 822c688f9 勘量卷 §三 形一路线）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 2026-11-05 17:04:22 直令（BOD 17:05 流转·COS 17:05:53 转投）verbatim「能不能M面和R面服务域都和M面本地域一样形，任务书挂上去，bod通知duty-cos（不是起无头），duty-cos和duty-coo协作拆树派工，一气呵成和整个班组完成任务书？」
- 前卷: cto-port-survey.md（822c688f9·形一 spawn agent-loop 路线·勘定事实面全继续有效·仅 §三 路线段被本卷替代）·SDE 形一施工已令停候本方案

## §一 · 形态定谳承接（四步链·两域同构）

```
任务书挂平面（tick 自动扫 ∥ BOD 手动通知）
  → 通知 duty-cos（notify 落箱 + tmux 直发唤醒·非 headless CC）
  → duty-cos + duty-coo 协作拆树派工（人在环会话·D-27 树协议）
  → 班组一气呵成施工 → 毕报回链（树节点收口照 D-15）
```

- **触发双通道并存**：①tick 周期扫（现役 cron 形保留）②BOD 手动 tmux 直发（即时通道）——两通道落同一接令面（duty-cos 会话）。
- **人会场切换**：spawn headless CC（锚定 COS 渲染位·M2 形）→退役；接令主体=duty-cos 常驻会话（m-duty-cos / r-duty-cos·人在环·Claude Code 完整工具面+席组协作纪律）。
- **成本记账切换**：headless usage 解析记账段退役→值席会话成本走 CFO 既有 token 实测协议口径（perf 线）——tick 记账段改为**派单审计行**（事件+任务书指针·防双记账）。

## §二 · sg 侧改造（TriCompany 仓·单文件·低风险）

**对象**：`runtime/cognition/orchestrate_tick.py`（M2 正身·23,649B）——**TriMMC daemon 与 crontab 零动**（notify 路由现役在·job 注册不动）。

| 段 | 现形 | 新形 |
|---|---|---|
| step4 spawn | headless CC（锚定 ceo-chief-of-staff 渲染位·brief v2·session_timeout 560s） | **删除 spawn 调用**→`_notify_duty_cos()`：POST TriMMC `:8712/internal/v1/notify`（target_seat=m-duty-cos·urgent 形或 normal+唤醒双保险）+**必跟 tmux send-keys 唤醒**（`tmux send-keys -t m-duty-cos <信体摘要> Enter`·normal notify 只落箱不唤醒 idle 值席=m-sg-external-web-dispatch 现行纪律正形） |
| step5 记账 | headless usage 解析→cost-ledger | 改派单审计行（事件 ts+任务书指针+tree id）·成本面走 CFO 常规口径 |
| step1-3 | 三重门扫描/指纹边沿/成本护栏 | **零改动**（server-executable 判据语义=服务域可执行·席组形仍成立·最小变更原则） |
| 会话超时 | session_timeout_s | 退役（人在环无超时语义·改派单幂等键=tree fingerprint 防重复派单） |

改动量：~100-150 行单文件·TriCompany 仓 sg 侧 commit·git revert 单笔回滚·零 daemon 重启。

## §三 · 河源侧改造（TriRMC 仓·notify 族转正必装+部署窗）

三件套+一窗：

1. **notify 值席信箱族移植（1082 行·前卷第二序转正）**：`src/notify/` 五件（outbox 388+duty-consumer 187+echo-queue 253+echo-routes 109+routes 145）+`app.ts` 挂载段（notify 五端点+echo 路由+maybeStartDutyConsumerFromEnv 生命周期）——适配：env 键 TRIMC_*→TRIRMC_*（TRIRMC_NOTIFY_DUTY_SEATS=r-duty-cos·TRIRMC_NOTIFY_DUTY_TMUX=r-duty-cos 会话名）·信箱落盘位=TriRMC data 面·token 门复用 TriRMC 现役 X-Internal-Token 面。duty-consumer 的 urgent=tmux display-message 弹显语义同构保留。
2. **rmc_tick.py spawn 段改造**（442 行正身·同 §二 同构改法）：spawn 后端死链段（8711 /v1/messages）整体退役→notify r-duty-cos+tmux send-keys 唤醒（`-t r-duty-cos`）·记账段改派单审计行·三重门/指纹/锁/护栏零改动。**原 §三形一「改投 8710 /internal/v1/agent」路线作废**（形态定谳推翻）。
3. **orchestration/ 追裁对齐**（前卷顺手件继续有效）：employee-registry family 过滤 5 行+旧名漂移。
4. **部署勘修窗（现役 daemon 触碰·必过 restart 链）**：TriRMC dist 重编（tsc）→daemon 重启挂勘修窗纪律全链（watchdog 评估→shutdown→port FREE→冷启→pid/CIM 对表→healthz 验证→恢复）——低峰窗施工·4 cron jobs 30min 周期错峰影响最小化·重启窗≈分钟级。

改动量：TriRMC 仓 2-3 commit（notify 族/新文件族+rmc_tick 改造+orchestration 对齐）+dist 编译产物·git revert 逐笔回滚+daemon 重启回滚链。

## §四 · BOD 手动通知通道（两域形状·活体勘定读数）

**sg（已验在役）**：BOD → `tmux send-keys -t m-duty-cos '<任务书指针+接令语>' Enter`——活体勘定：13 个 `m-duty-*` 独立会话在役（10-13 建·m-duty-cos 86x22）·systemd `duty-cos.service` 名≠tmux 会话名（会话名=m-duty-cos·命令模板以此为准）。

**河源（形状勘定·施工实测段验收）**：BOD → `ssh R-HY-8.155.54.79 "tmux send-keys -t r-duty-cos '<...>' Enter"`（R-HY alias 已修复可直连·fleet 用户 default socket /tmp/tmux-1000/default·13 个 r-duty-* 会话 11-04 13:24-13:26 在役）——或经跳板 `ssh -J M-SG R-HY`（BOD 无直连权限时备援形）。

**⚠️ 河源 pane 形态风险（本卷活体新发现）**：r-duty-cos 当前 pane=`bash`（非 claude 提示框）——**bash 层直发=命令落 shell 执行面（危险形·禁）**。唤醒正形前置闸：`capture-pane` 验 claude 输入框形态在 pane 顶部→才 send-keys；bash 形=先唤 claude（r-duty-boot.sh 重启形·候 SDE 勘定 13 席 boot 现态归因——可能 boot 链中途态非异常）。此闸入验收锚第 2 判据。

**纪律锚**（两域同规）：tmux send-keys 文本附 Enter 常 bracketed paste 吞→补发独立 Enter+capture-pane 验拾取；❯ 后文字可能是暗示提示非真实输入→验证提交只认对话流增量；唤醒信体带任务书指针（树路径+tree id）防信箱/直发单通道丢失。

## §五 · 排工建议（候 COO 重排·形一派工令作废重铸）

| 序 | 件 | 建议席 | 窗 |
|---|---|---|---|
| 1 | sg 侧 orchestrate_tick.py 改造（§二） | SDE 主刀（TriCompany 仓单文件·R-HY 通道经验无关·纯 sg 面） | 即窗（E1-5 A/C 毕后·原顺接格局不变） |
| 2 | sg 全链实测（验收锚 sg 轮） | SDE 施工+STE 复验 | 随 1 |
| 3 | 河源 notify 族移植+rmc_tick 改造+追裁（§三 1-3） | SDE 主刀+STE | **候 2 毕**（形态经 sg 实测背书后复刻·降返工） |
| 4 | 河源部署勘修窗+全链实测（验收锚河源轮·含 BOD 直发通道实测） | SDE+STE·BOD 配合直发实测 | 随 3·低峰窗 |

STE 复验格局不变·串行 sg→河源（形二形态在 sg 先验证）·总估 2-4h 级（sg ~1h·河源 ~1-3h 含部署窗）。

## §六 · 验收锚（两域各实测一轮·前卷 §五 扩形）

1. **静态门**：改造件语法/lint 过+tsc（河源 dist）+`--dry-run` 三重门扫描读数正常
2. **唤醒前置闸**：capture-pane 验 duty-cos pane=claude 输入框形态（河源 bash 形=闸不通过禁直发）
3. **sg 全链轮**：测试树挂平面→tick 扫到（--once 触发）→notify 落箱（mailbox 读数）+tmux 唤醒（capture-pane 验对话流增量=duty-cos 接令实锚·非无头证明）→duty-cos+duty-coo 拆树派工读数→班组施工→树节点收口→ledger 派单审计行
4. **河源全链轮**：同构判据+notify 族新装件活体（信箱落盘/三态回写/urgent 弹显）+BOD 经 M-SG→R-HY 直发通道实测+部署窗 restart 链全读数（pid/CIM 对表+healthz+4 jobs 复活）
5. **护栏门**：成本护栏/派单幂等键（同树不重派）dry 断言
6. **回归门**：两域 daemon healthz+cron jobs 零扰动+其余 12 席零触碰（被唤醒 duty-cos/coo 除外）
7. **回滚姿态**：sg=git revert 单 commit；河源=git revert+daemon 重启回滚链（两段均演练形写入施工单）

## §七 · 风险与缓解

- **R1** notify 落箱不唤醒 idle 值席（现行纪律实证）→正形=notify 必跟 tmux 直发·信体双通道同指针
- **R2** tmux 直发 Enter 吞噬/暗示提示幻影→补发独立 Enter+capture-pane 对话流增量验证（§四 纪律锚）
- **R3** 河源 r-duty-cos pane=bash 形直发落 shell=**危险形**→唤醒前置闸（§四·验收锚 2）+13 席 boot 现态归因候 SDE 施工段勘定
- **R4** 河源 daemon 重启窗（8710 短暂不可用）→低峰窗+restart 链纪律全链+30min cron 错峰
- **R5** 席组形成本可视性变化（headless usage 解析退役）→CFO 既有 token 实测协议口径承接+tick 派单审计行保底
- **R6** duty-cos 接令能力面（拆树派工质量依赖值席会话纪律）→D-27 树协议+值班席现行纪律已在·验收锚 3/4 实测背书

## §八 · 增补段（BOD 实勘勘正采纳+席间协作通道升级·复勘双证后补）

**勘正采纳（BOD 17:09-17:12 两轮活体 vs 本席 17:08 瞬态读数·本席复勘 09:15:53Z 第三证）**：r-duty-cos 现役=**claude 框实锤**（❯+bypass permissions+221058 tokens·「Brewed 35s done 5:14 PM」=BOD 直投 turn 痕迹）·13 席全扫 **12/13=claude 框**+r-duty-sde=new task 界面——本卷 §三/§四「13 席 boot 现态=bash」表述**撤销**，正形=席组现役 claude 在跑·本席勘定时点系瞬态读数（时序与 BOD 直投窗吻合·双向三证）。**唤醒前置闸保留**（价值恰在防瞬态 bash 误投——瞬态可能性已双向实证）·判据微调=capture-pane 验 ❯ 框形态·`new task?` 等中间界面形态候 SDE 施工段归因。

**席间协作通道升级（BOD 附赠实勘采纳）**：河源 13 席=claude CLI 2.1.296 直跑（ps 实锚）·SendMessage/ListAgents 工具面全通·r-duty-cos→r-duty-coo SendMessage 全链实证（COO-RECV-OK·35s turn）。**两通道分层定谳**：起手段=notify+tmux 唤醒（BOD/tick→duty-cos·§二/§三 不变）；**席间协作段=duty-cos↔duty-coo↔班组=SendMessage 结构化通道**（带收执回执链·比 tmux 粗投可靠）——§一 四步链第 3 步「协作拆树派工」通道正形升级。跨机边界（uds pipe 不跨机·河源席不见本机席位）与方案 §四 一致。

**LG-093 终判权衡输入收档（今晚 20:2x 本席门禁终判用）**：dsh=单会话 ACP agent（inter-session 面 grep 零命中）·自研 TUI（TriRLC fork ink）=单会话终端（ACP 架构卷 20261020 正身）——两宿主均**无席间互通机制**。若终判 dsh/TUI 接管班组席→席间 SendMessage 面消失（协作退 tmux+信箱粗投形·形二席组协作降级）——「席位宿主保持 claude CLI」=形二席组协作能力的技术前提·纳入终判权衡。

## §九 · 使用依据锚谱

- CEO 17:04:22 直令（BOD 17:05 流转·COS 17:05:53 转投）·前卷 cto-port-survey.md 822c688f9（勘定事实面全继续有效）
- 活体勘定（本卷时戳窗）：sg tmux 13×m-duty-* 会话清单+duty-cos.service unit（会话名消歧）·河源 tmux 13×r-duty-* 会话清单+r-duty-cos pane=bash 读数+default socket 位
- sg notify 正形纪律：m-sg-external-web-dispatch（normal notify 只落箱·notify 必跟 tmux 直发）·tmux 直发 Enter 吞噬/暗示提示纪律（现行记忆条族）
- TriMMC notify 族正身：/srv/fleet/TriMMC/src/notify/ 五件 1082 行+duty-consumer LG-052 头注（pullPendingForSeats/urgent 弹显语义）
- rmc_tick.py 442 行正身（前卷 §二 读数）·TriRMC app.ts 路由面（前卷 §二）·orchestrate_tick.py M2 头注五步（前卷 §二）

## §十 · 状态段（CEO 17:35:44 定向后·河源段挂起·2026-11-05 17:4x 补）

- **河源段挂起（§三 1-4+§五 序 3+4+§六 R3/R4 随挂）**：CEO 17:35:44 直令定向——河源 13 席 claude 宿主=干扰项（CEO 原话）·目标宿主=dsh·BOD 已办毕卸载（13 席 tmux 全停+claude 进程清零+npm 包物理卸载·39M ~/.claude 会话历史保留·dsh web 8791+TriRMC 8710 不动）——§三 河源侧「notify 族移植+rmc_tick 唤醒 r-duty-cos 席」的席位对象随停役消失，**候 CEO「TUI+dsh+自研 SendMessage」路线讨论定谳后重铸（形三）**·本卷河源段技术内容收档备查不施工。
- **sg 段继续不受影响（§二+§五 序 1+2 照常）**：SDE 即窗施工中（COO 派工单 v1.0 938b8036a0 已达）——sg 侧 m-duty-cos 值席现役在役·席组形态定谳未被定向后新令推翻。
- **COO 派工序 3+4 同步挂起（本席知会随发）**：防序 2 毕报触发陈旧基线排工·重排候形三定谳。
- **LG-093 终判性质更新（今晚 20:2x 本席门禁）**：CEO 已定向 dsh=目标宿主——终判=「怎么接管」的方案面非「要不要」取舍面；终判卷引 m-duty-cto(sg) dsh-superagent-prototype 会话间通信机制研究报告（dsh-superagent-research/ 落卷·回执 BOD）为「自研 SendMessage」路线技术输入——§八 收档句「席位宿主保持 claude CLI=形二协作技术前提」自此升格为待突破改造项（自研 SendMessage 追平 M 面席组形=研究令产出目标）。

—— CTO 小狄（形二改造方案·回执 BOD 抄 COO·排工候 COO 重排·§十 状态段随 CEO 定向补）
