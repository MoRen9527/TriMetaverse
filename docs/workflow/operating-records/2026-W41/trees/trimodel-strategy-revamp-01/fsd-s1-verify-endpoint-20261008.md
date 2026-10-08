# 深测②合一窗 S1 段验收卷 · FSD（config verify 三态端点）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/trimodel-strategy-revamp-01/fsd-s1-verify-endpoint-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T03:35:00+08:00
- 树节点: S1 段验收件（任务书 3e4f53058 链 · CTO 细估 75a51dda 段门对应）
- 状态: S1 施工毕·重启窗闭合·四态值面探针齐——段门达成，候 CTO 段验收

## 〇、段门对表（CTO 细估原文）

> S1 | 件① daemon 侧：config verify 扩三态字段+四态读数+服务重启 | 独立 commit（daemon 仓） | 四态值面探针读数齐；重启窗紧贴本段验收，日窗内闭合不留跨夜悬空态

| 门件 | 读数 | 判 |
| --- | --- | --- |
| 独立 commit（daemon 仓） | TriModel `7f7063a`（3 文件 +401：src/api/verify.ts 新/routes.ts 接线/test 新 16 例） | ✓ |
| 服务重启 | 3333 pid 27252（proc start 03:31:34+0800），launch.cmd dist 正形 | ✓ |
| 四态值面探针读数齐 | 五态全态活体实证（见 §三） | ✓ |
| 日窗内闭合 | 探针闭合 03:32+0800，无跨夜悬空 | ✓ |

## 一、实现方案与关键代码路径

1. **`src/api/verify.ts`（新）**：`GET /v1/config/verify` handler。A 案（候裁点④ BOD 终裁）落地=派生逻辑自 UI connLocalState 判定树服务端单点下沉，`deriveVerifyState` 纯函数与 UI 逐分支同构；五态枚举（诚实三态 已存未拉/已拉未落/已落生效 + 落盘失败 + 未配置）+ `VERIFY_STATE_LABELS` 中文标签表（S4 UI 直消费）+ `pull_chain_degraded` 结构化面（UI 现役「·拉取链异常」后缀）。
2. **语义边界硬实现**（CPO 卷 §4.5）：响应体零健康字段——字段集=意图面（intent_version/intent_updated_at）+落地回写面（version_applied/applied_at/write_result/write_error）+拉取链面（last_pull_at/last_pull_result）+派生三态，无 health/alive/uptime 语义；零密钥面（纯版本/时刻比对，不 decrypt）。
3. **鉴权**：requireAdmin 同族 fail-closed（503 未配/401 错值），与 config-cards 同形。
4. **`routes.ts`**：路由接线一处（CLI show 同源、一份数据两消费端——S4 UI 接线后两页读数同源）。

## 二、自测读数（全量四项）

- S1 单测 16/16 绿（A 族判定树全分支：五态+degraded+优先序[failed 优先于版本齐平 applied 判据]+空态边界[无卡有旧回写→not-configured/拉取时刻=意图时刻 >= 边界]；B 族 dispatch 端到端：鉴权三态/四 face 值面对照/键集合等值白名单=零健康字段硬门）。
- tsc 零错；全量回归 366/349/3——3 败=ui-fourplane 族（**git stash 干净 HEAD 复跑同败独立验，既有非本件引入**，逐字独立验非转抄）。
- （LG-069 全量基线 647/642/5 为 TriMLC 仓口径，本段为 TriModel 仓口径，两仓分记。）

## 三、重启窗与五态值面探针（03:30-03:32+0800）

**重启窗**（launch 链形态实勘后执行）：
- 现役形态勘定：旧 pid 20356=tsx 直跑源码（手工态，非 launch 链）；launch.cmd 正形=`node dist\src\server.js`（watchdog L1 拉起同链）——**以 launch.cmd 正形对齐重启**（npm build 刷 dist 03:30:05 后拉起），消双形态分裂雷。
- 停止形态例外如实入卷：TriModel server 无优雅停面（无 shutdown 端点、无信号处理——src/server.ts grep 实锚）；数据面全 atomic write（read-merge tmp+rename）；TriModel-Watchdog 任务 Disabled 实锚（无自动拉起干扰窗）；taskkill /T 树杀（20356/29596/23544 三连）→ 3333 释放断言 → wscript trimodel-launch.vbs 拉起 → healthz 200。
- 新态断言：pid 27252，cmdline=`node dist\src\server.js`，proc start 03:31:34+0800。

**五态值面探针**（隔离实例法，零生产数据面污染）：

| 态 | 布景（卡+台账） | state 读数 | 判 |
| --- | --- | --- | --- |
| applied | intent v3 + 回写 v3 ok + pull ok | `applied` | ✓ |
| pulled-not-applied | intent v2 + pull ok@同时刻 + 零回写 | `pulled-not-applied` | ✓ |
| apply-failed | intent v5 + 回写 v4 failed | `apply-failed` | ✓ |
| stored-not-pulled | intent v2 + 零台账 | `stored-not-pulled` | ✓ |
| not-configured | （生产 3333 自然态：四 face 无卡） | `not-configured` ×4 | ✓ |

- 隔离实例=TRIMODEL_PORT=3334+临时 CARDS/DATA 目录+probe token，探针毕即杀，生产 3333 healthz 200 复验零污染。
- 生产 3333 活体读数留档：四 face 全 `not-configured`（card_present=false，本机卡位现势无卡=如实态；rlc 台账 last_pull 10-08T03:24+08 = dev TriRLC 周期拉取在活动）。

## 四、如实边界与技术债

1. **乱码伪影销案**：探针管道 python json.tool 显示 state_label 乱码——字节面 od 实锚服务端响应=`e6 9c aa e9 85 8d e7 bd ae`（「未配置」UTF-8 逐字节正确），伪影在管道消费端（cp936 误解码），截断伪影家族显示层成员，非产品缺陷。
2. 本机生产卡位现势全空（not-configured×4）——S4 接线后 UI 兜底卡三态在真实卡到位前的显示形态=空态如实，非缺陷；深测②走查时注意此现势基线。
3. state_label 经 HTTP 无 charset 标头传输——HTTP/1.1 默认 charset 语义下主流客户端按 UTF-8 解，如实记录（不扩窗改）。
4. 鉴权 token 注入位=`TriModel/.env`（dotenv cwd 读）——launch.cmd 与手工态两形态同覆盖，实锚在卷。

## 五、下段预告

S2 结构骨架（四区块平铺：块1 模型条目信息/块2 可切换模型集/块3 模型切换规则/块4 策略列表唯一策略区；活动策略独立区壳消失三路分流）——强制中间走查①（三块就位+联席菜单机制原样+批 A 面原样）报 STE+BOD。

## 使用依据

- 任务书 3e4f53058（v3 链）；CTO 细估卷 75a51dda（S1 段门原文）；CTO 技术设计卷 §2.3/§2.4/§2.6（A 案/三态支撑面/候裁点全裁）；CPO 合一卷 §4.5 5d175a26（语义边界）；TriModel commit 7f7063a；ui/index.html L1534-1556（connLocalState 下沉真源）；BOD 暂停/复工令（01:0x/03:12）；全量 stash 基线归因记录（会话链）。
