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

## 根因定谳（FSD 勘验五项闭环，CTO 采认 2026-09-26 14:0x）

**根因=channel cmd 中文 rem 行 GBK 吞行**：L17-18 DRILL WINDOW 注释含中文全角（「。」尾字节 0x82 落 GBK 双字节首字节区）→ cmd.exe GBK 解码吞并 CR → 行边界破坏 → **紧随的 L19-22 四条钉位 set 行被吞** → daemon env 四键 ABSENT（PEB 直读 128 变量全量实证）→ cron runner spawn 全量继承 daemon env → stub env 同 ABSENT → 发现-A 修复后 node 可达，12:32:48 stub 首次真执行 restore-direct → CoreIO 缺省回退真 legacy 钥写真活体；drill 产物零产生。三读数全闭环。

勘验质量记档：PEB 直读（NtQueryInformationProcess+ReadProcessMemory，只读）为决定性手段；五位置单拷贝比对排除启动分叉；钉位块前后行全生效唯独块内 set 未生效的剖面定位；根因与项目已知同族坑对上（schtasks.ts:53-54 明文「rem 行严禁非 ASCII」纪律——**该纪律藏码未独立成文**）。第一刀四键 ABSENT 为同构推定（未做 PEB 勘验，如实标注）——彼时无 flag 在位故未触发。

## 定责三分（CTO 裁）

| 面 | 责任 | 裁语 |
| --- | --- | --- |
| FSD 操作面（主责） | 两刀 DRILL 注释均违反项目明文纪律（rem 行严禁非 ASCII），自认如实 | 主责成立；**如实上报+勘验高质量（PEB 硬功夫+不利读数照实录）记档正面**——事故文化面：如实不被追打 |
| 枢纽验收门（本席共担） | 进窗知会验收只收文件面读数（True×4=文件里有四行 set）未要求 daemon env 进程面实勘——被污染的读数过了验收 | 已自认入档；窗条款增补生效：进窗知会必含 PEB 进程面实勘读数 |
| 治理面（体系缺口，本席修正义务） | 「rem 行严禁非 ASCII」纪律只存在于 schtasks.ts 源码注释——藏码不独立成文=无强制自检门；对照 ps1 BOM 纪律已成文+有 memory 条目 | 修正动作：纪律成文（D 系入册，落 TriCompany/docs/workflow/engineering-disciplines.md，编号候台账对表）+cmd/ps1 交付自检项（非 ASCII 字节扫描，ps1 并 BOM 检查） |

## 恢复与复跑裁决（CTO，2026-09-26 14:0x）

1. **修复裁**：FSD 两案采「注释全改纯 ASCII」（根治；「钉位前移」否——绕当前不绕未来）。
2. **第三刀流程**：FSD 改 channel cmd（注释 ASCII 化+钉位 set 保留）→重启纪律→**进窗知会必含 daemon env PEB 实勘四键 present 读数**（新条款首次执行）→STE 核验进窗。
3. **复跑前提**（COO 三注承接）：隔离层修复经验收门含进程 env 面——第三刀满足后 F2 补验门重跑（10 断言表仍有效）→F3/F4/F5；窗计时随第三刀进窗重起。
4. **全停维持至第三刀进窗知会核验毕**。
5. 附加候选办：振荡循环节流（回滚毕报 STE 观察项）——波④ 收尾裁决并入。

## 根因勘正（第三刀实证，CTO 采认 2026-09-26 14:2x）

**GBK 吞行假说证伪**：纯 ASCII 化后首次重启（pid 20584）四键仍 ABSENT（硬门 FAIL 即停内续勘）→同内容文件沙箱复刻（node 行换 env dump）四键全 PRESENT→**文件与 cmd 解析双双无罪**。

**真根因=`Start-Process -FilePath <.cmd>` 的 ShellExecute 调用形态**：该形态父 cmdline=`cmd /c ""path" "`（双引号嵌套+尾部幽灵空参数），实测三灭（29844/20584/推定 45972 同形态）；改显式 `cmd.exe /c "path"` 干净形态（33328 父 cmdline 实证）**一次 PASS**。第三刀 PEB 硬门四键全 PRESENT（新条款首次执行即抓假说翻案——硬门价值实证）。

- **未决剖面如实挂账**：幽灵尾参形态下失效剖面=DRILL WINDOW 整块（L16-24）而前后行全活，cmd 精确解析机制未定谳——入册以**形态禁令**承载（行为实证三灭一活足够，禁令不依赖机制解释），机制解释候勘。
- **新暴露面（勘正衍生，CTO 裁）**：watchdog 拉起链 `trimlc-watchdog.ps1:29` 同为 `Start-Process -FilePath` 形态=**存量幽灵参路径**——watchdog 自动复活 daemon 时钉位将再次静默丢失。裁：窗内不动（TriMLC daemon 演练中活性稳定，复活概率≈0；F1 臂动 3333=TriModel 链不涉此）；**窗毕出窗还原时一并修 ps1 形态（显式 cmd.exe /c）+手动触发复活验证 cmdline 形态**，入候选办硬门。
- **事故链勘正注**：非 ASCII 注释本次非凶手（GBK 假说作废留痕），但 rem 行非 ASCII 纪律本身维持成立（schtasks.ts 纪律是真实坑）；定责三分操作面主责表述勘正为「launch 形态选择+钉位执行未验」——形态为存量链路形态非 FSD 新引入，操作面责任焦点收敛为「第二刀后未做进程面验证即报进窗」（该缺口枢纽验收门同担，三分结构不变）。
- **治理面修正扩条**：入册两条——①cmd/ps1 注释非 ASCII 纪律（维持）②**`Start-Process -FilePath *.cmd` 幽灵参形态禁令→显式 `cmd.exe /c` 形态**（本次真凶+存量 watchdog 链在用）。

## 使用依据

STE 事故上报（2026-09-26 12:4x）；FSD 勘验五项上报（14:0x）；FSD 第三刀+根因勘正上报（14:1x）；ste-wave4-execution-log.md；wave4-finding-A-ruling.md；wave4-dispatch-gap-ruling.md；dispatch-wave4.md 验收门④；schtasks.ts:53-54；trimlc-watchdog.ps1:29（存量形态暴露面）。
