# P1 版本基勘定卷（CTO 车道，TriModel 事故恢复链首序）

- sourceOfTruth: 本件（P1 勘定正身；令源=COO 04:1x 派工+BOD #297 围栏加码+BOD #298 晨窗首序拍板）
- syncMode: final
- lastSyncedAt: 2026-10-03 04:28:40 +0800（date 现查贴原值；分项现勘时点随文标注）
- 勘定席: CTO 小狄（m-cto）；P1 只读段零写面 ✓（本卷落盘除外）；值面零出机 ✓（全程指纹形）
- 输入: STE 事故上报（20:1xZ）+STE 验证卷补记（d9e56f58）+STE 回执③+COO 修正版三件（04:22）+COO P1 输入增量（04:2x）+T7 裁决卷 TriModel 实勘段

## 前置三结论（毕报直用，COO 呈 BOD 面）

| # | 结论 | 一句话 |
|---|---|---|
| 1 | **拓扑定谳** | 受损实例=本机（pid 42616 唯一受损 3333）；sg 另有健康独立实例（实勘翻案：trimodel-config.service 3333+proxy 3334 active，LG-035 P3-sg 副本位）——SDE 分歧销案但「sg 有 3333」本身为真，与 M2 回滚锚无关 |
| 2 | **M2 单向门成立，风险升一级** | 回滚锚（本机 3333）dist 缺失=回退必失败；且现状模型链**双断**（R-HY 401+本机无 dist），8713 实跑 fallback default=deepseek-v4-pro——P3 排期权重判**高**，建议晨窗首序内 P1→P2→P3 连贯执行不分窗 |
| 3 | **可以 161d0ca 基准重建 dist**（附四条件） | 活体版本基≈995c2f7（9-29 04:39），其后 5 笔全 test/docs 零产品逻辑面——161d0ca（sg 权威顶 10-01 08:52）产品面与活体等价，重建无产品行为漂移 |

## 一、拓扑定谳（SDE 标注 a 钉死，04:25 sg 实勘新证据）

### 全机位 TriModel 3333 实例分布（实勘终态）

| 机位 | 实例 | 状态 | 角色 |
|---|---|---|---|
| 本机 dev | pid 42616（127.0.0.1:3333，起 09-29 04:53:31） | **内存壳存活**（dist 缺失，零 established，重启即失败） | M2 前模型门面+M2 回滚锚（**受损即锚本体**） |
| sg（47.245.122.61） | trimodel-config.service（127.0.0.1:3333，pid 2518071）+trimodel-proxy.service（3334） | **active running 健康**（04:25 实勘） | LG-035 P3-sg 部署副本，与 M2 回滚锚无关 |
| R-HY（8.155.54.79） | 门面 443（api-token.env L1=3608..cee7 权威） | 门面正常（rmc ok 对照），唯 mlc 侧 denied | M2 后主链 |

- SDE「sg 3333 受损」断言：受损面归属错（实锚本机），「sg 有 3333」**本身为真**——SDE 自勘误认领（04:22）成立，拓扑分歧销案。
- 知识面修正：sg 3333 非笔误虚构，系 LG-035 P3-sg 部署副本实例；其健康存在构成本卷第二节「非常规备选锚」的事实基础。
- 损伤面收敛（STE 回执③+本席复核认）：TriMLC 单树三条链接目标（TriModel/agent-core/TriCode）全数已恢复 tracked 面；TriRLC 闭界完好零第四条。

## 二、M2 单向门风险（COO 修正版①优先呈现项，本席加权判定）

### 单向门构成（比 COO 描述多一层事实）

1. **回退锚本体受损**：M2 回滚锚=「8713 出站 L13 改回本机 3333」——本机 3333 dist 缺失→改指+重启 8713 后 3333 侧连接拒绝（接客面死态，现活体零 established 佐证）→回退必失败。
2. **现状模型链双断**：R-HY 主链 401 denied（92 连始于 10-02 00:49）+本机 3333 无 dist——**当前 8713 模型供给实跑在 relay fallback default=deepseek-v4-pro 上**（channel.log `[trilc:keys] model relay refresh (card absent): default=deepseek-v4-pro` 实锚，本席 04:1x 勘）。单向门敞口期内模型链本就依赖 fallback，非「健康主链+可用回退」的双保险态。
3. **回退≠单键翻转（新增事实）**：TRIMODEL_API_TOKEN（channel.cmd L11）单键承载双链 token——R-HY 链需 3608..cee7，本地 3333 链需 a5cb..13a7（三处同值互证：channel.cmd L11+8711 trirlc-daemon.env+TriModel .env 拟恢复值）。完整回退序=L13 改指+**L11 token 回切 a5cb..13a7**+重启 8713+3333 可接客——四件套，非 COO 转述的单一改指。M2 cutover 设计面发现：单键双链 token 冲突（教训条 §九.3）。

### P3 排期权重判定（COO 候本席加权）

- **权重=高，建议晨窗首序内 P1→P2→P3 连贯执行不分窗**。理由：①单向门敞口时长∝风险，且敞口期内模型链已在 fallback 上跑（第二层风险叠加）；②3333 活体系 9-29 老进程内存壳，**死亡即失活体对照面**（P3 从「重建+受控重启」退化为「重建+冷起」，难度相近但失证据链）；③P2（.env 重建）先行是 P3 重启后探针全绿的前置，两件有硬顺序依赖，分窗徒增中间态时长。
- 3333 意外死亡预案（P3 前发生）：不构成新事故——启动链=launch.cmd 纯 node 起 dist（无 build 动作，04:1x 实勘），dist 缺→拉起失败退出零副作用；watchdog L1 拉起失败→L2 标记→stub restore fail-closed 空转（§四）——整链无害。P3 施工单加一条：开工前复勘 3333 pid==42616，pid 已变=活体已失，照冷起形态施工（判定不变）。

### 非常规备选锚（标注，非裁定启用）

sg 3333 健康+运行中，理论上可作紧急回退锚（8713 L13 改指 sg）。**本席不裁定启用**：跨机改指=新 cutover 动作超本席速裁面+sg 3333 token/卡面形态未勘（与本地门面链同族性未知）+LG-035 P3-sg 副本位语义。仅作 COO/BOD 知悉面备选，启用候独立裁。

## 三、P1 三项判定

### ① 本地主开发位勘定+未推提交风险

- **主开发位=本机**。证据四链：①origin=ssh://fleet@47.245.122.61/srv/git/TriModel.git（sg bare=权威远端）；②夜窗件流向=本机开发→推 sg（161d0ca/754fc96/69ea6ac 全系夜窗推笔）；③运维资产全在本机（launch.cmd/watchdog/L2 链/卡面 channel.cmd）；④sg 侧语义=LG-035 P3-sg 部署副本（systemd 服务形态，非开发工作区）。
- **未推提交风险=低**（不可证伪残余如实标注）。证据：①T7 裁决卷 01:5x 实勘=工作区零 M+stash 空（事故前最后形态读数）；②sg bare log 时点分布连续至 161d0ca（10-01 08:52），9-29 后 5 笔全数已推；③W40 operating-records 零 TriModel 提交活动记录（batch 系全在 TC/TMV 仓）；④10-01 08:52 后至事故窗（10-03 凌晨前）本地 TriModel 无已推笔亦无在案开发活动。残余=「10-01 08:52 后若存在未推未记提交则已灭失」，无旁证支持存在，判低概率，接受。

### ② 3333 活体版本基证据链

- **强旁证：活体 build 基≈995c2f7**（9-29 04:39:01 sg 顶提交）→3333 pid 启动 9-29 04:53:31——14 分钟窗内 build+启动，时点链闭合。
- 9-29 后至 161d0ca 共 5 笔，**全部 test/docs 面，零产品逻辑面**（git log 类型面实勘）——活体（995c2f7 基）与 161d0ca 在产品行为上等价。
- 文件面还原不可能：dist/.env/node_modules/.git 全 MISSING（04:15 实勘），活体版本基不可从文件面取证——时点旁证链为唯一证据面，已足。

### ③ 可否以 161d0ca 基准重建 dist——**可**（P3 施工输入）

四条件（P3 施工单验收锚素材）：

1. 版本漂移面=5 笔全 test/docs（§三.②），161d0ca 产品面与活体基等价——重建无产品行为漂移；
2. 3333 现活体零 established（接客面死态）——重启无消费方扰动面；
3. 161d0ca=sg bare 权威顶——部署基正确性有源头保证；
4. **入口形态断言**：launch.cmd 起 `dist\src\server.js`（04:1x 实勘）——161d0ca build 后产物须含 dist/src/server.js（tsc outDir 结构不变前提下自然满足），P3 施工时显式断言后重启。

P3 回归门（重启后必过）：keys 探针 200（.env P2 先行到位）+GLM 链路 smoke+watchdog 复验 recovered+relay 卡面对表（card absent fallback 应消失）。

## 四、watchdog 监护判定+L2 链发现

- **判定：无需暂停/监护**。现态行为无害：watchdog 每分钟 auth-dead 判定刷 flag（keys 探针 401/空值——.env 缺失）→8713 cron scan 120s→stub restore 每 2 分钟真调用但**全数 fail-closed**（stub.log 04:08-04:22 `restore-failed exit=1 ERR_MODULE_NOT_FOUND`：TriMLC node_modules 的 tricode 子依赖 trimodel-cli 导出位缺失——STE 重装 node_modules 后 tracked 面恢复但 dist 面缺）——**settings.json 零写入**（10-02 05:28 后无 restore-done），健康门 fail-closed 在守。
- **重大发现（勘定过程修正两轮认知）**：`.fade\trimodel-l2-stub.ps1` **非演练占位，系 L2 恢复梯真调用器**——`trimlc model restore-direct --provider bigmodel` 五门内核（备份/键名锁/健康门 fail-closed/diff 回读/掩码审计）写真活体 ~/.claude/settings.json。命名「stub」与语义严重不符（教训条 §九.2）。
- **P3 组单知悉项**：TriCode/agent-core build 补 dist 后（同 STE 类型门受阻根因，一个 build 窗两用），restore 链将**恢复真写能力**（bigmodel 直连形态，10-02 已验证该形态运行非破坏）——若 P3 后模型链走 R-HY，L2 链写入形态（bigmodel 直连）与域预期（R-HY 链）不一致，候选办重对表。TriMLC dist 修复动作勿在 P3 窗外顺手做（计划外激活真写路径）。

## 五、SDE 标注 b/c+COO 撤回确认

- **b 项（item5/P2 合流）**：COO 04:22 撤回确认成立——item5 落值点=sg 面 TriModel .env（sg TriModel 3333 服务域），P2=本机 .env 重建，异机异面零交集不合流，item5 照原排程独立走。本席 §四前判（非同一受损面）与此一致，销案。
- **c 项（本机车道交叉）**：确认一致——8713 出站链 L13 指 R-HY 443，TriModel 本地损毁不影响 8713 出站 pull 链（受损影响面=relay 卡面+3333 消费+watchdog 探针，零涉出站链）。R-HY 401 修复工序（审定单 b6e6db9f）不受本事故直阻，晨窗照排。

## 六、R-HY 401 漂移考古补强附注（审定单 §四 增补，本席自己的卷自补）

漂移引入时点考古**有主**：a5cb..13a7 系本地 TriModel 门面 token（3333 链路配对值，channel.cmd L11/8711 trirlc-daemon.env/TriModel .env 三处同值互证）——**非未知窗写入的漂移值，而是 M2 cutover（10-02 00:1x BOD order）切 L13 URL→R-HY 443 时未同步切 token**：8713 持本地链正值打 R-HY 权威门（3608..cee7）→401 denied 始于 10-02 00:49=切换后首轮 poll，时点链吻合。FSD「更早引入窗候勘」可结案（结论=M2 cutover 窗）。修复方向不变（本机 L11 对齐权威值，审定单 §一七步序），且 L11 值改动后**本地链回退需 token 回切**（§二.3 单键双链事实，P3/M2 回退序须含此步）。

## 七、bak 族灭失销项+事故损失清单收口

- **T7 裁决卷 §4「TriModel bak 族独立卫生候办（CTO 域）」：自然销项**（BOD #298 已裁）——对象（目录四+文件六）随事故穿透删除全灭失，untracked 无远端不可 git 恢复（STE 回执③真损定性）；HEAD 对 sg 权威一致实锚在卷，灭失影响低。晨窗记账销，本席不再追。
- 事故损失全景（收口用）：

| 损失面 | 定性 | 承接 |
|---|---|---|
| bak 族（目录四+文件六） | 真损·不可恢复 | 自然销项（本节） |
| TriModel .env/dist/node_modules | 可重建 | P2（.env，值源=8711 配对值）+P3（dist 161d0ca 基+node_modules install） |
| TriMLC node_modules tricode 链接目标（TriCode） | 已恢复 tracked 面（a3893ba 克隆体，04:26 勘：零 M+stash 空）；dist 面缺 | build 补 dist（与 agent-core 同窗，P3 前置） |
| TriCode untracked/未推提交 | 不可知·低概率残余（原仓灭失无从勘；最近笔 7a8bd7b 9-26 已推 sg，本域无后续本地活动记录） | 接受+标注 |
| TriCompany agent-core 55 文件 | 零真损（STE checkout 全回） | 已闭 |
| ~/.claude/settings.json | 零写入（L2 链 fail-closed 守住） | 已闭（正面样本） |

## 八、P2/P3 施工序建议（组单素材，施工归窗）

- **P2（本机 .env 重建）**：值源=8711 trirlc-daemon.env 配对值（a5cb..13a7，STE 实锚+本席 channel.cmd L11 同值互证）——管道写入零出机（审定单 §一步 2 同款形态）+写后指纹对表（len=64 head4/tail4）+行尾断言。完工序据：探针面（watchdog keys 判定转绿或 flag 停刷）。
- **P3（dist 重建+受控重启解围栏）序**：①开工断言 pid==42616（变则照冷起形态）②npm install+build 161d0ca③TriCode/agent-core build 补 dist 同窗④dist/src/server.js 存在断言（四条件之 4）⑤受控重启（watchdog 协同正形，禁裸杀）⑥回归门四项（§三.③）。P2 先于 P3（.env 到位是重启后探针全绿前置）。
- 顺序总图：P1（本卷）→P2→build 窗（TriCode+agent-core+TriModel）→P3 重启+回归门→围栏解除。

## 九、教训条（候 CAO 册，本席域初筛后呈）

1. **PS5.1 Remove-Item -Recurse 穿透 reparse point**（事故根因）：删除类操作前必勘 LinkType（Get-Item .LinkType）；跨仓链接拓扑（node_modules/@trimetaverse/* 系）是删除面雷区；worktree 清理用 git worktree remove 正形。——前窗已挂候办，本卷正式化。
2. **「stub」命名语义漂移**：trimodel-l2-stub.ps1 实为真调用接线版（写真活体配置），命名致运维误判风险（本席勘定中亦被名带偏一轮，读头注释方知真调用）——候选办：改名或头注警示前置。
3. **单键双链 token 冲突**：TRIMODEL_API_TOKEN 单键承载 R-HY/本地双链 token（M2 cutover 设计面发现）——链切换须同步切值，漏切即 401（本次事故链源头之一）——候选办：双键化（R-HY/LOCAL 分键）或链配置化。
4. **回滚锚活体验证缺位**（观察项）：3333 回滚锚从未被验证接客能力（dist 缺失若在 M2 前验证即暴露）——回滚锚定期活体演练候选办（低成本形态：对锚端点打一发探针）。

## 使用依据

- 令源链：STE 事故上报（20:1xZ）→COO 04:1x P1 派工→BOD #297 围栏加码（04:19）→COO 修正版三件（04:22）→COO P1 输入增量（04:2x）→BOD #298 首序拍板+bak 族销项裁（04:26）→STE 回执③（04:2x）
- 实勘读数（本席，时点随文）：TriModel 仓（04:15 HEAD=161d0ca/工作区净/bak 族全失）；3333 活体（pid 42616/9-29 04:53:31/零 established）；sg 3333 实勘（04:25 ssh：trimodel-config.service 3333 pid 2518071+proxy 3334 active）；TriCode 恢复体（04:26 a3893ba 零 M+stash 空）；watchdog v3/L2 链/stub.log/launch.cmd（04:1x-04:22 四轮）；channel.log relay fallback 读数
- 引用在案：T7 裁决卷 TriModel 实勘段（2ec7dfe4 载）；STE 验证卷补记 d9e56f58+回执③；COO 修正版三件；R-HY 401 审定单（b6e6db9f，§四附勘本卷 §六增补）；发现①裁卷（3c0a2753）
- 关联纪律：D-04 完工判据（P3 回归门同族）、值面零出机、禁裸杀、CRLF 三查、D-24 机位断言（本卷 sg/本机双机位全程显式）
