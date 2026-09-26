# 事故记录·波④ 红线破（restore 写真活体）（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波④ 红线破事故记录正身；D-15 枢纽留痕件）
- syncMode: working（勘验进行中，随勘续写）
- lastSyncedAt: 2026-09-26 12:5x +0800（date 现查 12:47 hook 链）
- 事故级: 红线（真活体零接触总判据破线）
- 发现席: STE 小柯（F2 补验门 #5/#6 断言抓破，立即停臂+F3/F4/F5 全停+零动作候令——处置完全正确）

## 事故事实（STE 读数锚定）

- 注入 T0''=12:27:35 →L1 三轮 71s 节律正常→flag 12:30:27 落盘→cron 拾取→**12:32:48 restore-done exit=0**→**drill-settings/drill-audit 零产生，真活体被写**：hash `d7a565ca…8967f`≠基线 `491F…78B2`，mtime 12:32:55 与 restore 吻合。
- F2 补验门：#4 PASS（发现-A 修复端到端实证——node 经 guard PATH 可达，core 五门真跑）/#5 #6 FAIL（钉位触达实证失败）→**整体 FAIL，红线破**。

## 损失面（已勘定）

- 备份完整：`settings.json.bak-2026-09-26T04-32-55-927Z`（2046B=基线大小，core 备份先行门照常工作）——回滚能力完整。
- 写入值：base_url=bigmodel + model=glm-5.3-flash + AUTH_TOKEN=真 legacy 钥 + API_KEY 双载体同值——**「合法恢复态」（L2 梯产品语义原样）覆盖了原基线配置**；真 `.deploy-key` 零接触（mtime 2026-09-25 23:40 不变）；运行中会话不受影响，新起会话将走 glm 直连。
- **红线违反不因写入值合法而降格**：演练期间真活体零接触是总判据，破线即事故流程。

## 枢纽裁决（CTO，2026-09-26 12:5x）

1. **回滚授权裁可**：copy bak→settings.json，回滚前验 mtime==12:32:55（无人再动断言），回滚后 hash==基线+mtime 留痕——STE 执行中。
2. **F3/F4/F5 全停确认+新窗作废**：钉位链断=沙箱隔离前提不存在；窗内只许回滚+勘验；出窗还原义务重申。
3. **勘验令已下 FSD**（五项清单）：第二刀启动方式对质/启动链指向比对（多份拷贝疑点）/daemon pid 29844 进程 env 实勘/channel cmd 结构勘验（setlocal·顺序·start 形态）/全程只读如实。
4. **根因方向（候勘）**：STE 强疑=FSD 第二刀重启未走 channel cmd 正身（PATH 到位而 TRIMODEL_* 未达）；枢纽平行假设=钉位行 setlocal/顺序结构未传达子进程 env，或启动项指向无钉位拷贝。
5. **枢纽自认验收门缺口（责任面）**：第二刀进窗知会验收只收钉位「文件面」读数（True×4），未要求 daemon 进程 env 实勘——文件面在位≠进程 env 到位（「键存在性抽验≠值面验证」同族教训再犯）。窗条款增补：**进窗知会必含 daemon 进程 env TRIMODEL_* 实勘读数**。

## 初步定性（候勘终裁）

- **功能面与隔离面分离评估**：cron 拾取→restore-direct→core 五门真跑→备份先行→双载体写入→exit=0——L2 梯产品语义在真实链路端到端工作（意外实证）；坏的是演练隔离（钉位链断），不是恢复梯功能。
- **core 无错**：DEPLOY_KEY 未达→deployKeyPathFor 走缺省=真 `.deploy-key`；CLAUDE_SETTINGS 未达→写真活体路径——core 缺省解析真活体=生产正确行为（wave4-dispatch-gap-ruling 已定性），错在隔离层未生效。
- 事故责任面候勘毕裁（FSD 第二刀操作面/枢纽验收门缺口/窗管理条款面，三分归位）。

## 流程教训（初步，候勘毕补全）

1. 文件面在位≠进程 env 到位——验收断言必须落在生效面（进程 env），不停在文件面。
2. 补验门 #5/#6 断言体系（钉位触达实证）正是为抓此类破线设计——抓到了，门设计必要性实证；若无数值断言仅凭「restore-done」即判绿，破线将静默。
3. STE 停臂纪律（发现即停+全停+零动作候令）在红线事件中再次实证。

## 使用依据

STE 事故上报（2026-09-26 12:4x，读数锚定全量在卷）；ste-wave4-execution-log.md；wave4-finding-A-ruling.md（修复时序）；wave4-dispatch-gap-ruling.md（窗管理四条款）；dispatch-wave4.md 验收门④（修正即报候审）。
