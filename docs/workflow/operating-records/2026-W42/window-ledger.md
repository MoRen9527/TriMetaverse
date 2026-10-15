---
sourceOfTruth: docs/workflow/operating-records/2026-W42/window-ledger.md
syncMode: living
lastSyncedAt: 2026-10-15T10:54:09+08:00
form: whitelist-registry（白名单登记面·D-23 v3 批后件③改版·原「窗序现势台账」C1 正身）
schemaRef: docs/execution/window-reminder-job-plan-20261014.md §二（CTO 提案·COO 会签裁 YAML front-matter 内嵌@1db9d27ca）
maintenance: COO 唯一定笔位·COS 共读对表·BOD 旁证
windows:
  - id: w42-8711-notify-enable
    type: daemon-maintenance
    start: "2026-10-15T09:40:00+08:00"
    end: "2026-10-15T10:10:00+08:00"
    owner: sde
    endReminder: true
    state: done
    note: 8711 obs 出向启用（trirlc-daemon.cmd 补 NOTIFY env+TriRLC 冷起·窗令 09:12 已发 M-004·止损 10:30）
---

# 白名单登记面 · 2026-W42（原窗序现势台账·C1 立项正身）

- **改版说明（10-15 十笔·批后件③落地）**：本面由「窗序现势台账」转制「窗控白名单登记面」——①front-matter `windows` 段=机器可读白名单窗（提醒 job 解析契约·schema 六字段照 CTO 稿 §二·会签裁形态）；②人读表格照旧承载；③**直跑件不入 windows 段**（直跑无窗无提醒·D-23 v3 形态）于人读「直跑件现势」面留痕；④windows 段=active 窗+当日 done 窗（供 job 幂等键与当日催收拍）·隔日已毕窗转人读留痕段·schema 清理随周平面迁移；⑤结构化字段只增不改语义（会签纪律）；⑥元信息三键（sourceOfTruth/syncMode/lastSyncedAt）由 front-matter 承载（形态升级·键面合规不变）。
- 立项依据: CEO 15:58 批 C1 首位先行；形态改制=CEO 20:55 裁「直跑为默认+窗控白名单」·D-23 v3 CEO 21:18 批·款4 COO 会签 21:03 全批；改版令=BOD 09:09 晨令①（转 CEO 09:09 令「不符合的直接跑不用排窗」）。
- **用途**：域内排窗对表第一读数面——白名单窗排定/变动/毕态唯一记笔位；提醒 job 只读契约面（job 零回写）；直跑件现势留痕（非准入面·候排池准入已废止）。

## 白名单窗现势（人读面·与 front-matter windows 段同源对表）

| 窗 | 时段 | 内容 | owner | 态 |
| --- | --- | --- | --- | --- |
| 8711 obs 出向启用窗 | 10-15 09:40-10:10（止损 10:30） | trirlc-daemon.cmd 补 NOTIFY env 行（env 名 env.ts:169 勘定·值=18710 隧道口形态·token 值面 D-46 禁进日志）+TriRLC 冷起（停摆预期 18s·重启纪律三断言）·终验锚=**进程内生效验证非 healthz 绿** | SDE 主施工/COO 终验/CTO 知会 | **毕（实开 09:39:59·实毕 09:42·停摆≈10s·组合证四件全绿·终验卷=coo-8711-window-finalverify-20261015@树·卡③案 B 落地收口）** |

## 直跑件现势（不入 windows 段·候排池准入面已废止·毕报经 COS）

| 件 | owner | 态 |
| --- | --- | --- |
| 白名单登记面改版（批后件③·本笔） | COO | **毕（10-15 十笔）** |
| A1 任务书标准模板（含会签生效判据·直跑正形修订） | COO | **毕（CAO 判定①换代并入·M2 已落笔 TC f588561·CAO 主笔吸收本席转正认领·内容面零改写承入+M1 三制度保留·毕报卷=reports/cao-a1-m2-ruling-closeout-20261015.md@dfb25eb7c）** |
| B1 派工令格式铸条（直跑正形修订） | COO | **毕（转正 TriCompany dispatch-order-format.md a01f07d·CAO 备案随发）** |
| D1 督办读数出单节奏（含 fan-in 呈报格式） | COO | **毕（COS 认·生效→转正 TriCompany d78ceb6·09:27）** |
| E2 残留候考池成文 | COO | **毕（同上转正+池正身立档 candidates-pool.md·首批收编两项）** |
| 排程 SOP 双段式必查项对轨（§三第3项） | COO | 直跑在办——候 COS 会签 |
| TriMLC 卫生三件（卫①gitignore 两模式/卫②备份清理留3清17+dist ignore/卫③digest-inbox.mjs 归位） | SDE 主施工 | **毕（09:20 终验销@trimlc-hygiene-20261015/coo-finalverify@518308472）+卫④追补挂行（gitignore 两窄模式·异族 2 件留盘定性·SDE 轻笔在途）** |
| patrol 卫生两件（log 治理 137 log 三选或并施+退役判据立条 N=7） | COS | **毕（COS 报 fb894f26c·留样 2+判据 N=7 立条+存量删 137 断言绿+增量并施·大表 8c85c2531 已刷·09:38 run 迁移锚候验注）** |
| keeper 活性巡检挂靠件（#140 骑缝①·TD-obs-1 遗留） | BOD/COO 对表 | **毕（COS 大表 c994e97d4 刷卡③毕销·CTO 验收·锚链全录·W43 周名异常注记候迁正）** |
| 差②铸条排程方案稿（CAO 主笔·排程权本席） | CAO/COO | 直跑在办 |
| dsh 序3（r-duty-cos 上线报到·候 CTO 令） | BOD 施工/CTO 令 | 候令态——改版漏挂补行（COS 对表发现@09:34·候令态无人读行旧发现并此归一） |
| E1 催办跨会话存续方案稿（TriMLC cron 位） | COO | **毕（v1 实勘两项+COS 会签认·生效 e951996c8·触发面渐扩序落实——先 endReminder 实存后督办字段渐扩·立项闭环·施工候提醒 job 批后同窗）** |

- 另候（非直跑非窗）：提醒 job 步1（8713·候 CEO 终审·批后施工=addJob 非重启=直跑）。

## 已毕窗留痕（隔日/当日转此·读数不抹）

- 10-14：LG-069 合并窗 08:35-10:35 实毕 08:51（零返工）；python 根治窗 09:10-09:50 实毕（杀父+零复批）；mc_link 修复 11:08（非窗形态·令面准令直执）；**四卡窗 21:00-22:45 实毕 21:35**（FSD 三卡落码 ee59619/7aa5799/d9a6254→SDE 重启毕 21:22 停摆 18s→STE 门禁 PASS 749/749@4707390→FSD 活体锚三轮重启链毕 21:33→COO 终验四锚全销 21:35·零回滚·终验卷=mc-link-verify-20261014/coo-obs4card-finalverify-20261014.md）；dsh 窗1 序1 验收过（BOD 19:32）+序2 装设+双段烟测毕 23:18（段2 全链 9/9 ALL GREEN·DSH_SMOKE2_OK 真回话）；重启窗 18:00-18:30/CFO 双锚 20:30·20:50/LG-077 步①②③ 18:30-20:30 照排段。

## 观察池（2026-10-14 21:53 成文·随事件随挂随销）

- ①锚②真放电窗补验 ②TriRLC github 腿 5 笔候 443 补推 ③reminder 入否豁免域候灰度周评估 ④hub-silent 豁免灰度观察 ⑤python 三选候资源读数 ⑥**sg 8712 白名单补录 'trirlc-conn'——毕（BOD 09:58 三证绿：patch 单行 outbox.ts L66+tsc 重建+restart pid 3126596→3862557+dist 产物 grep 'trirlc-conn'=1 真生效·锁笔 60496df·毕报树=2026-W42/trees/sg-8712-allowlist-conn-20261015/·主仓 09395881b·两如实记：cli.ts TS2307 既有错非本笔引入已报 CTO/FSD+真值探针候 8711 出向自然验证——原条「sg 8713」系笔误正名 sg 8712）；**连败事件注（10-15 十五笔·BOD 10:50 报+勘误卷 35a3045cd）**：sg 8712 daemon degraded=true（10:37 拍 consecutiveFailures=3·首败 10:00）——因=BOD 09:54 build 回归（config-sync-apply job 跑新 emit cli.js→require @trimetaverse/tricode→node_modules 缺链接→10:00/10:15/10:30 三连败）·修复毕 10:47-48（补挂链接 readlink=/srv/fleet/TriCode 真值+ESM 直跑冒烟过）·候 11:07 拍自然回零验证（BOD 盯·读数随下信并卷）；TS2307 定性收束（CTO 10:53 对表）：「非本笔引入」事实不撤·「仅独立 bin 破面」半径评估撤（独立 bin 实有 job 消费面三连败实证）·CTO 稿勘误注 42bb1e087；token 值面泄露自报收账——CTO 裁**不立即轮换**（D-39 即生效·两护栏=值面进外部可达面/公开卷/第三方管道任一→急件立即轮换+下次 sg daemon 勘修窗顺手摊入·候考池项 4）；**白名单本体生效面不受染——两事独立（dist grep=1 证编译产物非 daemon 运行态）·trirlc-conn 真值探针仍候 8711 出向自然验证** ⑦dim-4 24h 读数候 CTO 复核——**totalFailures 本窗归零重计=新段起点 09:40·24h 锚候 CTO 复核对表（原锚 21:35 与新段起点关系随复核定性）** ⑧跨宿主探针对候立卡（挂 LG-067 转正条件②）⑨**TD-obs-1 已收口（勘误定性毕 10-14 22:0x+案 B 落地毕 10-15 09:42 窗毕）**——通道实走本机隧道 18710 现役健康·keeper 巡检挂靠件毕（c994e97d4）；**8713 notifyFailures=6 实证精化（10-15 09:54 本席 channel.log 追读）**：#1-3=10-14 09:04-09:21（勘误基线 3 ✓）+#4-6=10-14 22:38/22:43/23:48（**勘误卷 22:03 发出后新三败=keeper 隧道夜间断窗 70min 实证·当时无巡检发现=keeper 巡检挂靠件价值再证**）·23:48 后>10h 零新增；语义精化=notifyFailures 系 LG-069 闸告警信出向投递失败累计（勘误「读数冻结」表述精化：fetch failed 系告警信出向失败非读数冻结·读数缓存系另一面）；recovered 语义=失败后下次成功尝试打 recovered+重计（零尝试期计数挂 6 属正常·通道健康实锚=SDE 09:42 探针 401 应用层响应）；**附观察：8713 mailbox 写 EPERM rename 杂音（10-14 时段·并发冲突族·CTO 面观察）**；8711 notifyFailures=0 候真实出向首触发读数（零触发态如实记·不制造不加码）⑩**FUZZY-TS merge 豁免真仓活验锚**（CTO 09:40:55 请托·COS 转）——下次自然合流场景：merge commit hash+gate 行为实录（沙箱毕·真仓活验候自然场景）。

## 笔序（不抹历史）

- 10-14 16:00:03 初笔：台账落位（C1 立项首笔）。
- 10-14 17:05:53 二笔：明晨候排面增 TriMLC 卫生三件（CEO 17:04 批派）。
- 10-14 19:21:47 三笔：dsh 窗1 挂行（免候排窗·CEO 19:17 令）+并批窗对表至九件。
- 10-14 19:34:08 四笔：dsh 序1 验收过+序2 装设挂今夜行（BOD 19:32 裁）。
- 10-14 20:56:16 五笔：排工形态改制基线挂行（CEO 20:55 裁·直跑默认+窗控白名单）。
- 10-14 21:20:44 六笔：D-23 v3 批态更新（批后件三项挂扩面）。
- 10-14 21:39:00 七笔：四卡窗毕挂行（实毕 21:35·四锚全销·零回滚）。
- 10-14 23:19:27 八笔：dsh 序2 装设+双段烟测毕挂行（9/9 ALL GREEN·DSH_SMOKE2_OK）。
- 10-15 09:10:49 九笔：晨令承接（BOD 09:09 转 CEO 令「不符合的直接跑不用排窗」）——候排面九件转直跑在办·唯 8711 件留白名单①窗（排 09:40-10:10·窗令 09:12 已发 M-004）。
- 10-15 09:12:29 十笔：**白名单登记面改版落地（批后件③·本笔）**——front-matter windows 段内嵌（schema 六字段·会签裁形态）+直跑件现势面立+已毕窗留痕段转制+观察池/笔序沿续——本面自十笔起为「白名单登记面」形态。
- 10-15 09:28:38 十一笔：D1+E2 转正挂行（COS 认·生效→TriCompany d78ceb6·池正身 candidates-pool.md 立档首批收编两项）+patrol 两件毕态销行（COS fb894f26c）+A1/B1 树锚并笔挂注（D-27 v9 对轨·候 COS 复核两项）+A1 第三态补全（COS 修改项落实）。
- 10-15 09:39:12 十二笔：B1 转正毕（dispatch-order-format.md a01f07d）+A1 候 CAO 对表（M1 owner 域实勘发现·COS 复核两项认 d7e8e1342）+dsh 序3 漏挂补行（COS 对表发现归一）+E1 v0 稿落盘（候 8713 实勘）。
- 10-15 09:50:36 十三笔：**8711 窗毕挂行（w42-8711-notify-enable·实开 09:39:59 实毕 09:42·停摆≈10s·组合证四件全绿·终验卷落 mc-link-verify 树·卡③案 B 落地收口）**+windows 段 state=done+A1 毕态刷（CAO 判①换代并入 M2·TC f588561）+观察池⑥激活/⑦新段起点注/⑨案 B 落地毕/⑩FUZZY-TS 新条（CTO 请托）。
- 10-15 09:56:52 十四笔：观察池⑥ sg 侧毕刷（BOD 09:58 三证绿·锁笔 60496df·正名 sg 8712）+⑨ channel.log 追读精化笔（690c3bcc 并入）+E1 稿 v0→v1（实勘两项毕·白名单 15 条在案+跨仓读无障碍·候 COS 会签）。
- 10-15 10:54:09 十五笔：sg 8712 连败事件收账注（观察池⑥补事件注：build 回归因果链+修复毕候 11:07 回零·TS2307 定性 CTO 对表收束·token 轮换 CTO 裁不立即轮换+两护栏·两事独立白名单本体不受染）+候考池项 4（token 顺手窗轮换·候考池笔随）——BOD/CTO 信双发毕。落款自查如实记：本笔前两信落款 10:50:00 系估读未现查（D-47 虚标自查抓获·实发≤10:53·无倒挂·随犯随记）。
