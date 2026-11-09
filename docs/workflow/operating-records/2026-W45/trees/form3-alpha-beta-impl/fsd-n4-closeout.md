# N4 票域并入·毕报单卷分节（形三门禁链 α 第二节点·候门③ review·D-69 树内顺连节点）

- sourceOfTruth: 本件（N4 毕报 brief+checkpoint·单卷分节形=门①裁定②采认）
- syncMode: closeout-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 令源: 门①终审有条件 PASS 判定书（TMV 4175a5897·条件毕即动笔备案令）+条件执行注回执（TMV 948171ee0·02:28+08 呈）
- 结论：**READY_FOR_REVIEW（门③候）——N4 毕·自测门十二案+β 三套零改动复跑 27/27+全量 706/706 全绿·独立 revert 锚已锁**

## 一、brief（大白话）

干了什么：N4（票域 Tickets/Assignments+Policy 最小门）写完+测完——TriRLC 仓新落 `src/v2/errors.ts`（9 行·UserError）+`src/v2/policy.ts`（81 行·revalidate 三支+ADMISSION_DEFAULTS+STRENGTH 裁减表）+`src/v2/tickets.ts`（610 行·票/输入拆表+Tickets 六核心+Assignments 六面）+`test/v2-tickets.test.ts`（391 行·十二案），改两 N1 件：store.ts（committed 错误 reporter 注入·缺省 console.error=β 零改）+engine.ts（组合序扩七件+closingFlag holder+reply handler transport 注入形）。门①终审条件件毕在案：stage.ts+model.ts 补读对表=canRetry 正形锚定（自拟谱两偏差按原型修正——waitsForPerson 负向面+delivery 失败面·retry 谱结构不动摇）+readUntil 真信源收口（对表注 TMV 948171ee0·备案动笔照判定书③）。
结果：类型门 RC=0+本套自测 12/12 全绿（首轮过·含三硬门）+β 三套零改动复跑 27/27（receipts 9+effects 11+read-tracker 7·β 件零改面实证）+全量 **706/706 全绿零败**（694+12 对平·前窗 flake 两套件本轮零触发·族仍在册候 STE）。
候 CTO 决什么：门③同形 review 放行→N5/N6 并行准动（同把令·裁定④谱位）。

## 二、checkpoint（门禁读数·机器真值）

| 锚 | 值 |
|---|---|
| 交付锚 | TriRLC **1a94bad**（2026-11-06T02:39+08 commit·6 files·1148+/15-·staged 断言恰 6 零圈外） |
| 独立 revert 锚 | `git revert 1a94bad`（单 commit 件级回滚·零连带——β 件零改面下 store/engine 两件小改同卷可回） |
| 类型门 | `tsc --noEmit` RC=0 |
| 本套自测门 | `node --import tsx --test test/v2-tickets.test.ts` **12/12 全绿**（首轮过·873ms） |
| β 三套零改动复跑 | receipts 9+effects 11+read-tracker 7=**27/27 全绿**（β 件零改面实证） |
| 全量回归 | `npm test` **706/706 零败**（694+12 对平·flake 族零触发） |
| bare 推达 | sg-server 顶=**1a94badedc059701**（ls-remote 验真·222726c→1a94bad） |
| 电面双读数 | EstimatedChargeRemaining=**77%**·BatteryStatus=**2**·PowerOnline 字段本机 CIM 返回空值（2026-11-06T02:39+08 现查·COO 加固令②随报附注·与前窗 True 读数差异如实注：同字段本机 CIM 读数不稳定面·77%>60% 电面无虞） |
| 红线对表 | v2 shadow 形零接现役进程·β 三件零改动（git 面 6 files=3 新+2 N1 小改+1 新测试·β receipts/effects/read-tracker 零在列）·TriMMC sg 8712 零触碰 ✓ |

## 三、N4 段（票域并入六新改件·裁定②分节形制）

**交付锚**：1a94bad 内 `src/v2/errors.ts`(9/0)+`src/v2/policy.ts`(81/0)+`src/v2/tickets.ts`(610/0)+`test/v2-tickets.test.ts`(391/0) 新建+`src/v2/store.ts`(11/8)+`src/v2/engine.ts`(46/7) 小改

| 件 | 落形要点（行号 grep -n 复验后落卷） |
|---|---|
| tickets.ts | 表形 L128-137（ticket 主表 PK+部分索引 ticket_open `WHERE json_extract(value,'$.ended') IS NULL`+ticket_input 复合 PK `INSERT OR IGNORE` 幂等=消解原型 L235 线性扫描）·TicketRepo L140（裸 SQL 面·mutation 原子性归 Tickets/Assignments store.atomic 包裹）·**waitsForPerson L198/canRetry L210=§七A 修正正形移植**（照原型 stage.ts L24-26+model.ts L349-353：`!ended ∧ (waitsForPerson ∨ !!delivery)`·waitsForPerson=最新 report∈{blocked,failed}∧此后无 human∧!context∧at>report.at）·readUntil L215（§七A.1 真信源：max(latest report.at, max idleAt)）·Tickets L232（create L254 幂等守卫+channels 去重 sameChannel+first assignment/addInput L298 PK 幂等+held 让位+start/deliver-input 效果行派发/end L347（liveTicket 幂等+票末 settle 收敛+assignments 标 ended+attention 清+emit）/retry L386（canRetry 门+requeueUntaken 重排队首·deliveredTo 换新 assignment）/wake L420（五门谱：open 拒→human stop 拒→非 human 拒→paused 拒→revalidate 拒·通过=ended 清+resumed marker 队首）/stop L444=human stopped 便捷面）·Assignments L456（started L482 pending→running+undelivered flush 效果行/delivered L503 undelivered 剔+markDelivered+delivery 清/read L521 批量 ack/turnEnded L533 idleAt ??=/deliveryFailed L545 delivery 记录/report L565 UserError 谱+attention 生命周期+blocked/failed 剔 automatic+ready/dropped→end 联动）·closingFlag 注入自感 L235 guardClosing（判定书三.1 零环形）·emit=`effects.enqueue('emit', event.ticketId, payload)` 行留库候消费 |
| policy.ts | STRENGTH L45（explicit=2>inferred=1）·ADMISSION_DEFAULTS L52（cell 谱 3×2 缺省表形·settings 嫁接时覆盖——如实注）·Policy L68（paused L70+revalidate L73 三支：followup explicit 免/admission cell 强度不降/observation rulesOn·其余 via 保守拒——gate/settings schema/Eval 划出=嫁接域）·mandate 最小形=原型 Mandate 消费面投影（policyVersion/scope 首版不持久如实注） |
| errors.ts | UserError L5（校验谱+closing 守卫共用显式可测类） |
| store.ts 改 | constructor 第三参 onCommittedError L40（缺省 console.error=β 组合零改·判定书三.2 采认）·atomic 内 L78 引注入面 |
| engine.ts 改 | closingFlag holder L54（`{closing:false}` 公开·closing getter L59 引 holder·stop L126-127 置 holder=票域同感）·组合序扩 L62-77（Effects→ReceiptsStore→ReadTracker→Policy→TicketRepo→Tickets→Assignments·Assignments 持 tickets 回引=单向零环形）·ticketRepo 公开 L57（读面=测试/嫁接消费·mutation 收口 Tickets/Assignments）·reply handler L100-103（transport 注入时注册 `effects.handle('reply')→deliverAndTrack`·closing 检查移 handler 面=deliverAndTrack 自感 L114·缺省不注册=行留库候消费=β 组合零改） |

**自测读数（十二案）**：案 1 全生命周期链（Engine 全组合序·create→pending→started→delivered→read→report ready→end completed+settled）/案 2 addInput 幂等+held 让位（automatic 持 human 入+waitsForPerson lifts）/案 3 end letGo 基础形+幂等二调/case 4 retry 门三支（blocked 无跟进 retriable+**blocked 后 human 跟进非 retriable**[§七A 修正①负向面实证]+**delivery 失败 retriable**[§七A 修正②]+requeueUntaken 重排队首 deliveredTo 换新）/案 5 report UserError 五支谱/案 6 wake 五门支（正复活 resumed 队首+human stop/非 human/paused/revalidate 四拒）/案 7 revalidate 三支谱+保守拒/案 8 硬门①跨 reload 持久（真重开 boot 链+PK 幂等仍在）/案 9 硬门②票末收敛（delivered→settled 直跳+read→settled+未投零行）/案 10 硬门③closing 拒新十二面全谱/案 11 emit 谱+coalesce generation/案 12 reporter spy 事务不败。

## 四、施工实录与如实注（裁定①语义差毕报须带）

- **条件件执行如实注**：stage.ts（26 行）+model.ts（353 行）补读=判定书③条件件——对表结果=自拟谱**不一致两点**按原型修正（负向面+delivery 面·§七A 落卷 TMV 948171ee0）——**retry 谱结构不动摇未触发再呈例外**·照判定书「条件毕即动笔·备案不再候审」执行（02:28+08 回执 CTO 在案）
- **案 4 三支实证注**：§七A 两修正各自独立案面验证——支 b（human follow-up 在后→非 retriable·自拟谱会误判 retriable 的面）+支 c（delivery 失败→retriable·自拟谱全漏的面）——判定书③唯一改判点全落形
- **requeueUntaken context 排除=v2 裁量如实注**：原型 L333-337 判「readAt null 哨兵+deliveredTo=replaced」——v2 read 态面归 ReadTracker（delivered 态=null 哨兵同构）+context 输入排除（context 面不投 worker·原型 context input 语义同源）——原型逐字差异如实标
- **wake refuse 面=v2 显式败如实注**：原型 refuse L311-316=票面 refuse 记录谱——v2 首版=UserError 显式败（refuse 记录面=嫁接域候）——语义差如实标（判定书范围采认面内·白盒可测优先）
- **PowerOnline 读数差异如实注**：本机 CIM Win32_Battery.PowerOnline 本轮返回空值（前窗毕报=True）——同字段两轮读数不稳定面如实带（Charge 77%+Status 2 两读数齐·电面无虞）
- **engine.ts Edit 笔误一次如实注**：ticketRepo 公开改形时 old/new 错位致 constructor 短暂重复——读文件即勘（重复块删+字段声明补）·终态 tsc RC=0+全绿实证零带病
- **emit 面=效果行留库候消费如实注**：首版零 'emit'/'start'/'deliver-input' handler 注册——dispatch 空转零害（案 11 settle() 断言面）·消费面=N5/N6+现役挂接（判定书②范围）
- 额度如实注：N4 施工段 token 中量（连续整树段·条件件+施工一气呵成零中断锚）

## 五、next 与边界

- next_agent=CTO（门③同形 review——按件分节判定·单卷出判定书=裁定②形制）
- N5/N6 并行准动候=N4 门③ PASS 后同把令（裁定④谱位·N6 谱位=事件源域）
- 技术债标记单：①flake 族两套件（pidfile+init-confirm·候 STE 合并勘·前窗在册续）②TriRLC/TMV GitHub 通道前窗断连未复（sg bare 已达保险线·GitHub 候网络窗补推）③emit/start/deliver-input 效果行零 handler（首版范围·候 N5/N6 消费面——非债·范围注）④Policy ADMISSION_DEFAULTS 缺省表形（settings 嫁接时覆盖·如实注非债）
- 红线面：v2 shadow 零接现役·β 零改（27/27 实证）·sg 8712 零触碰

## 六、使用依据

- 门①终审判定书（TMV 4175a5897·六点裁面+条件件+语义注 replies 槽位）+条件执行注（TMV 948171ee0·§七A 对表落卷）+补读小门判定（40b1b2411）+补读笔记（9f37e4e75）+设计卷（eea70d9c6）+门③判定（7178f409d·两点裁量）+门①裁定（df059689d·毕报单卷分节形）
- 原型分件全读：tickets.ts/assignments.ts/policy.ts（805 行）+stage.ts（26 行）+model.ts（353 行）——SSH 只读·行号锚直引
- 任务书 b76dce4e §三 α 表+方案卷 7ecd788f5 §三 N4 段+迁移表裁定 14:18:10Z（票末收敛同构）
- β 先例：receipts/effects/read-tracker 三件（222726c 在役）+V2Store atomic/committed+engine 组合序
- COO 加固令（①节点毕即推 bare ✓②查电双读数随毕报附注 ✓）
