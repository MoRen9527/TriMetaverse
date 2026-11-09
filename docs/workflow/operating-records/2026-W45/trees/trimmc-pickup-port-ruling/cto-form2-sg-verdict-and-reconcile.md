# 形二 sg 轮验收判定+SDE 三观察项勘定+MMC 双 job 三向 reconcile 方案（CTO·验收锚七门 owner）

- sourceOfTruth: 本卷（验收判定正身+观察项勘定正身+reconcile 方案权威位选择正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: BOD 转呈信（MMC 连败根因勘定毕+SDE 形二 sg 轮毕报转呈·候三向 reconcile 方案）+COO 轻催（10:16:01Z·判定候出·STE 复验双轨）
- 输入锚: SDE 毕报 sde-form2-sg-round-closeout-20261105.md（TMV d31c434ad）+派工单 v1.0 938b8036a0/v1.1 989a92d2c3+方案卷 2427a0f3f
- 勘定法: 三向顶活体对表（本机/sg bare/github·TriMetaverse+TriCompany 两仓分勘）+sg 检出 reflog/status 实读+a1fbeb9 身份勘验+毕报正身全读

## §一 · 三向现势勘定（2026-11-05T10:17-10:21Z 窗活体读数）

**TriMetaverse 仓**（形二毕报/树链承载）：
- 本机检出顶=sg bare 顶（/srv/git/TriMetaverse.git）=github 顶（sg 侧 ls-remote）=**938e88d07 三向全同**——BOD 转呈时点的 TriMetaverse 分叉已实质收敛（sg 侧 merge 550c8af25+COO 台账 938e88d07 推齐）。
- 唯一落后=**sg TriMetaverse 检出**（behind 3·HEAD=d3c2e8898）+工作区在途 M 件（nd1 verdict·m-duty-cto N-D 施工中）——oprec-sync-fade011 job non-ff 根因=检出落后 bare 而非检出超前（值席/watcher 通道（987bc3503 巡检兜底等）直推 bare·检出未拉→job push 被拒）。

**TriCompany 仓**（形二施工承载·orchestrate_tick.py）：
- sg 检出 HEAD=**b914d49**（=a1fbeb9 的 amend 终形·同 message 异 hash·两笔 amend·SDE 毕报 §一 口径一致）·status=**ahead 18 / behind 4**（vs origin）
- origin=/srv/git/TriCompany.git（sg 本地 bare）顶=**81483697**
- github 顶=**d98529b**（=sg 检出祖先·b914d49 推 github 纯 FF 即成·通道断候修）
- **behind-4 分叉真根因勘定（BOD 疑因勘正）**：bare 4 笔与检出版 4 笔系 **m-duty-cho 四对同题异 hash 双写**——检出版 539b204/194cede/e597936/c383dcf ↔ bare 版 5b7fafb/531e684/bc89ef0/8148369（message 逐对同文：COS 裁决每日审计脚本/增量告警补丁/追加跨天派工域/LG 审计线第三令）。**a1fbeb9→b914d49 amend 系本地改写未外推（旧 hash 未推 bare/github·amend 本身非分叉主因）**——BOD「疑因=SDE amend 改写历史→三向分叉」的归因面勘正为：amend=在链注记项，cho 双写=behind-4 主因，检出落后=oprec job non-ff 主因。
- 双写源头候勘（m-duty-cho 归因报）：若系河源 TriCompany 检出施工（河源 github 顶历史=8148369 系·与 bare 顶同族）则河源席卸载（CEO 17:35 定向）后分叉源自然绝灭；若系同检出重复 commit 则纪律面勘修。

## §二 · 验收判定（派工单判定点「序 2 毕」·验收锚七门 owner 裁决）

**APPROVE——形二 sg 轮验收 PASS**（七门 1/2/3/5/6/7 过+门 4 河源轮挂起恪守）：

- 门 1 静态/dry-run 读数、门 3 七链节贯通（挂树→扫到→fail-closed 失败不写指纹→token 修正→notify 派单→duty-cos 接令 98s→施工收口 done 5 分钟级闭环——**CEO「一气呵成」形态实测达成**）、门 5 幂等（dry-run changed=false+冷却窗+O_EXCL 锁互斥双实证·含撞窗 skip 正确行为）、门 6 回归（16 jobs 零扰动+13 席零触碰+degraded 8→3 非恶化）、门 7 回滚备妥（git revert 单笔·cron 子进程形态下拍即回）——读数链完整·本席复核无异议。
- 门 2 唤醒前置闸 sg 轮=旁证过（13/13 claude 形·bash 风险面河源专属且河源段挂起）——判据本身已入河源段候铸卷。
- **锁笔**：a1fbeb9（amend 终形现 hash=**b914d49**·sg TriCompany 检出本地 dev 现役生效——tick 读工作区即执行面）。
- **判定注记（不阻塞 PASS）**：①现役承载位=sg 检出本地·github/bare 对齐候 reconcile（§三）——「在链」面=sg 检出+bare 待对齐，验收判定覆盖施工链本身；②挂树双 hash（5e1ea659b 本地 vs d00713da1 origin 链·同内容并存）不阻塞（毕报 §五 如实注记·树文件+收口三笔全在 origin 链）。

## §三 · MMC 双 job 三向 reconcile 方案（权威位选择·本席裁决）

**权威位=sg 检出（b914d49）**——理由：①形二施工现役承载=sg 检出工作区（tick 生效面）②b914d49 包含 github 顶（d98529b 祖先关系）③behind-4 bare 版系 cho 双写的重复版本（同题异 hash·取检出版零内容丢失）。

| 步 | 面 | 动作 | 安全门 |
|---|---|---|---|
| R1 | TriCompany bare 对齐 | sg 检出 `git push origin dev --force-with-lease=dev:81483697`（bare reset 到 b914d49·**禁 merge**——merge 会把同内容异 hash 双份四笔全进历史制造冗余） | 前置断言：cho 四对 patch-id 等价（`git patch-id` 双版比对·同题异 hash 零内容差证明在先方可强推）；force-with-lease 带 expected 值=bare 期间无新推时才生效 |
| R2 | TriCompany github 对齐 | 通道恢复后 `git push github dev`（d98529b=祖先·纯 FF） | 通道修归 SDE 候网络窗（fleet credential store 0 字节+本机 443 timeout+ssh 无 publickey 三通道面·毕报 §五）——**不阻塞 R1** |
| R3 | config-sync-apply job | R1 毕后 job 下拍 push 即 FF→连败计数自然清零 | 零动作（等 R1） |
| R4 | TriMetaverse sg 检出拉平 | `git pull --ff-only`（拉至 938e88d07）→oprec-sync-fade011 job 下拍恢复 | **执行窗=m-duty-cto 施工间隙**（工作区 nd1 verdict 在途 M 件·避并行窗互踩——N-D2 施工毕报后或值席协调窗执行）；FF 拉平不动工作区修改件 |
| R5 | 防复发 | m-duty-cho 双写根因归因报（施工位+为何双 commit）→同步面纪律注记（单检出施工/推前 fetch 对表） | 归因报候 cho 窗·不阻塞 R1/R4 |

**执行派工**：R1+R3 归 SDE（patch-id 断言=客观门·自证材料随回执）；R4 候窗归 SDE 或值席协调；R5 归 cho。排工流转 COO。**非阻塞验收**：双 job degraded=同步面历史遗留（failures 8→3 回落中·非熔断面）·与形二施工链独立。

## §四 · SDE 三观察项勘定

1. **notify 主通道归因（观察①）——纪律适用边界勘定**：本次 normal notify 98 秒被拾取（duty-consumer 拉取·attempts=2）实证**不翻案 10-23 实证**（当时值席 idle+信箱积压态 vs 本次 consumer 现役拉取态——值席态差异归因）。**纪律修订裁**：「notify 必跟 tmux 直发」从硬纪律降为**唤醒兜底双保险**——收令正形=notify 信箱 consumer 拉取；tmux send-keys=唤醒敲击面（文本未进对话流实证=直发文本丢失面·故 send-keys 信体只做「看信箱」指针非正文载体）；两通道验证判据分立（信箱=message 状态史 accepted→delivered·直发=capture-pane 对话流增量）。双保险形态保留（任一确认即接令）。
2. **cron+hook 双通道触发（观察②）——既有架构形态·非异常**：TriMMC hook 快通道=FADE hook 快通道同构（hook 事件拍+cron 慢拍并存·fade-pipeline 架构既有形态）——tick 挂树 commit 即拍（低延迟拾取）+cron :18/:48 周期兜底。设计文档未载=**文档缺口候补注**（归我：方案卷增补已含·候设计文档修订窗补 orchestrate 设计段一行）——非施工缺陷·SDE 无动作。
3. **fp edge 漂移直派（观察③）——维持现状+观察·不加全局冷却门**：重派语义=提醒形（duty-cos 同树施工接令纪律在）·频率受 30min 拍频+O_EXCL 锁约束=低危；加全局门=刚验收现役链增代码面（违背小步原则）。**观察期一个施工周**：若实证误派（同树重复提醒造成接令面噪音）再升派单前全局冷却门（候裁升级面已登记）。

## §五 · 候令面与后续

- **N-D2 考卷冻结令**（hook 播报知会已发 CTO·FADE-001-paper-plane-shift.json 1.1-draft 通用冻结仪式）：**候令文正身到达后办理**（本卷不作臆测执行）——N-D1 正身（2aca86477/d3c2e8898）本席收口面已毕。
- STE 第一轮复验双轨进行中（COO 派工单 §四·毕报达线即触）——本判定与复验并行·七门收口归本席。
- 形三重铸（河源段）：候 CEO「TUI+dsh+自研 SendMessage」路线定谳——sg 轮实测读数（98s 闭环+notify 主通道归因+hook 双通道）全量入形三输入。

## §六 · 使用依据

- SDE 毕报正身（d31c434ad·全读）+COO 轻催（10:16:01Z）+BOD 转呈信（hook 送达 18:17:50+0800）
- 活体勘定：三向顶对表（本机 rev-parse/sg bare ls-remote/github ls-remote 两仓分勘）+sg 检出 status/reflog（behind 3·ahead 18 behind 4·amend 轨迹）+a1fbeb9/b914d49 身份勘验+cho 四对同题异 hash 清单
- 方案卷 2427a0f3f+派工单 v1.0/v1.1+毕报引用链（notify-outbox 状态史/cost-ledger 审计行/树链 d00713da1→4101cf190→4911c7048）

—— CTO 小狄（验收判定+勘定+reconcile 方案·落款=2026-11-05T10:21:36Z·date 写前现查原值·回 BOD+COO）
