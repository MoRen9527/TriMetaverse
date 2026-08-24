# EXPER_ASSET：fleet headless CC 环境验证经验——M0 五判据与两发现

> 本文件为演练树 `m1-drill-001` 节点 M1-N1 产出（TriMMC 编排会话首跑派工；执行角色 FullStackDeveloper）。
> 依据：`experience/README.md` schema v0.1（2026-08-24 quadmig-1 Q1-3 冻结）+ `docs/execution/2026-08-24/quad-migration-spec.md` §九（Q3 双面合流 APPROVE）+ `docs/execution/2026-08-24/mmc-host-driver-design-draft.md` §4.2（影子写入协议）。
> 五要素（触发场景/做法/验证证据/适用边界/成本收益）齐全；status=draft；未过 L3 签收，只落 staging/。

## 资产头（schema v0.1 字段）

- objectType: EXPER_ASSET
- objectId: exper-asset-fleet-headless-cc-m0
- status: draft（append-only 状态机起点：draft → validated → consumed/deprecated）
- ownerRole: FullStackDeveloper（产出与持有；L3 签收线=CTO，见 metadata.signOffLine）
- securityLevel: internal（不含 restricted 级原始数据——服务器 IP/密钥等敏感基础设施细节不复制入资产，仅以文件指针引用报告）

### producer（溯源必填，L1 门）

- treeId: m1-drill-001
- nodeId: M1-N1
- opRef: docs/workflow/operating-records/2026-W35/OP-202608-W35-001.json（objectId=OP-202608-W35-001，status=active，W35 周经营维护索引——已实存确认）

### evidence（验证证据）

- commits:
  - `26ca782d835941ba7fda2d14c352fd8a67e6d755`（26ca782d）：M0 报告正文自引的双仓闭环验证 commit——`docs/execution/server-fleet-m0.md:45`（"双仓闭环全链路验证通过（本地 commit 26ca782d → push → fleet pull 可见）"）；reflog（`.git/logs/refs/heads/dev` 第 2 条，clone 后首次 fast-forward 目标）确证存在，当前 HEAD 祖先可达；`git cat-file -t` 验证为 commit 对象。
  - 收口核验补跑（M1-N3，2026-08-25）：`git log --oneline -- docs/execution/server-fleet-m0.md` 最近 5 个 commit——`cff1b924`（k8s 扩展设计原则记档）、`8fbc6dea`（M1 阶段二完成登记——编排 MVP 门禁 5/5）、`d5da2cba`（M1 阶段一启动登记——TriMC 部署+舰队自由对话实测）、`34d273e3`（8710 验证+WireGuard 清理+fleet 账号）、`13ae6248`（TriStaciss 清理下线登记）。本资产事实点对应登记 commit：门禁 5/5→8fbc6dea、fleet 账号→34d273e3、自由对话→d5da2cba。
  - 局限披露（如实）：N1 执行实例无 shell 工具，初版未能运行 git log；权威 commit 清单由收口核验（M1-N3）补跑完成，全部 hash 经 `git cat-file -t` 验证为 commit 对象。
- logs（报告登记的实证工件，带行级引用）:
  - 后台会话 fleet-alpha：`ad45d07b-7e44-493b-8389-c5009b8a9d78`（server-fleet-m0.md:71）
  - 后台会话 fleet-beta：`1542f850-4092-49d0-9058-f5dea8b09321`（server-fleet-m0.md:71）
  - SendMessage 双向往返：beta→alpha 5.1s（alpha 回复"alpha收到beta的消息"）、alpha→beta 9.0s（beta 回复"beta收到alpha的回复"）（server-fleet-m0.md:71）
  - TriMC `/healthz` = 200（公网 0.16s，`{"ok":true,"service":"trimc"}`）（server-fleet-m0.md:70）
  - MVP 消息桥：`POST /internal/v1/agents/{sid}/message` → task completed + result 回写（8.2s）（server-fleet-m0.md:73）
  - e2e dispatch：6 步 trace 全绿，route 命中 chieftechnologyofficer IO:100%，executor 真实回复"e2eDispatch链路OK。"（server-fleet-m0.md:73）

### payload（结构化事实，执行判断只采信本区）

- scenario（触发场景）:
  - M0 服务器环境搭建清单 12 项全部完成（server-fleet-m0.md §三，:35-:48）后，进入 M1 试点前置：需在 fleet 服务器验证 headless Claude Code 环境可用性——作为 TriMMC（驱动 claude code 在 fleet 工作的壳）的宿主前提。
  - 具体触发任务：M1 启动记录（server-fleet-m0.md §三.7，:68-:73）中的舰队自由对话实测 + 编排 MVP 门禁 5/5 验证（2026-08-11）。
- method（做法，可复现步骤）:
  1. 以 fleet 非 root 账号（uid=1001，无密码无 sudo）运行 claude 2.1.227（PATH=/opt/claude-code），settings.json 照抄 root 版 13 键 env（server-fleet-m0.md:66）。
  2. 起两个后台会话：`fleet-alpha`（ad45d07b-...）、`fleet-beta`（1542f850-...）（server-fleet-m0.md:71）。
  3. ListAgents 验证：`claude agents --json` 可见双 agent；SendMessage 双向往返（beta→alpha 5.1s / alpha→beta 9.0s）（server-fleet-m0.md:71）。
  4. bg 会话桥接通道：`claude -p --resume <sessionId> --fork-session <msg>`（副本语义，TriMC 编排层以此桥接）（server-fleet-m0.md:71）。
  5. 编排 MVP 门禁 5/5 五判据逐条验证（全部实证于 server-fleet-m0.md:73）：
     - 判据①：spawn → agentId；
     - 判据②：`GET /internal/v1/agents` 注册表（agentId/sessionId/name 映射）；
     - 判据③：`POST /internal/v1/agents/{sid}/message` → task completed + result 回写（8.2s）；
     - 判据④：e2e dispatch 6 步 trace 全绿（route 命中 chieftechnologyofficer IO:100%，executor 真实回复"e2eDispatch链路OK。"）；
     - 判据⑤：重启后 spawn + 注册表 + 消息桥全链路复验通过。
- boundary（适用边界）:
  - 两发现（本资产核心经验）：
    - 发现①（server-fleet-m0.md:71）：bg 会话受保护，不能直接 `--resume`；实现通道为 `claude -p --resume <sessionId> --fork-session <msg>`（副本语义）——凡需桥接 bg 会话的场景必须走 fork 副本，TriMC 编排层以此桥接。
    - 发现②（server-fleet-m0.md:73 末）：bg 会话继承 trimc.service cgroup（systemd control-group），TriMC restart 会连带杀会话——需重派（秒级），后续可独立 scope 管理。
  - 其他边界：
    - root 账号下不能用 `--dangerously-skip-permissions`（2.x 安全限制），舰队运行时建议专用非 root 账号（server-fleet-m0.md:46）。
    - 服务器标称 5Mbps 为出网限制；入网实测 11.9-17.1 MB/s，直拉优于离线中转（server-fleet-m0.md:42）——带宽判断不得只看标称。
    - 本资产事实锚定 CC 2.1.227 / 2026-08-11 M0 阶段；CC 版本演进可能改变宿主机制事实（mmc-host-driver-design-draft.md Q-02 同口径），复用前需重锚。
    - 编排 MVP 实现于 TriMC 仓（session-bridge.ts + app.ts 三端点 + dispatchAsync + task-controller），k8s 化后置（server-fleet-m0.md:70）——判据③④⑤依赖该 MVP 端点形态。
- costBenefit（成本收益）:
  - 避免的返工：直接 `--resume` bg 会话的失败摸索（实现通道已实测定型）；TriMC restart 后会话"消失"的困惑与误诊（cgroup 连带杀，重派秒级）；吞吐/可达性重复探测（基线已登记：github 16.3MB/s、npm 17.1MB/s、API 往返 2.44s，server-fleet-m0.md:48）；MVP 端点调试返工（五判据一次通过且含重启复验）。
  - 沉淀收益：为 TriMMC 壳的 spawn-only 设计提供宿主机制事实依据（mmc-host-driver-design-draft.md §2.1 实证结论同源）；编排层桥接通道直接采用 `--fork-session` 副本语义，避免再造会话恢复机制。

### narrative（自由文本，non-actionable: true）

本资产全部事实源自 M0 报告 `docs/execution/server-fleet-m0.md`（本仓，版本 v2026.W33.1，2026-08-11 签发，owner 小狄/小贾；文件头 sourceOfTruth 自述同路径）。溯源命名差异如实记录：演练树 m1-drill-001 的 action 指名 "trimmc-orchestration-m0-report.md"，该文件在本仓及所有已知仓库均不存在；M0 报告实存文件为本仓 `docs/execution/server-fleet-m0.md`。本资产 producer/evidence 全部指向实存路径，未伪造不存在的文件。

"M0 五判据"无独立权威文档定义该词；报告内有两组候选——§四（:75-:80）"M0 完成门禁"4 条（双仓闭环/claude 可用/TriMC 可部署/吞吐基线，属环境搭建门禁），§三.7 阶段二（:73）"MVP 门禁 5/5"5 个实证判据。本资产主题为"fleet headless CC 环境验证经验"，与 §三.7 的 headless 会话/编排实证直接对应，故五判据取 §三.7 的 5 个实证判据（逐条见 payload.method 步骤 5，均引 :73）；未混拼 §四，未添加报告中不存在的判据。两发现取 §三.7 中 fleet headless CC 会话管理两个实证发现（发现①:71、发现②:73），未替换为其他内容。

### metadata

- schemaVersion: v0.1（2026-08-24，quadmig-1 Q1-3 冻结：objectType/objectId/status/ownerRole/securityLevel/producer{treeId,nodeId,opRef}/evidence{commits[],logs[]}/payload{scenario,method,boundary,costBenefit}/narrative/metadata；append-only）
- shadow: true（mmc-host-driver-design-draft.md §4.2 影子写入协议：EXPER_ASSET 需 metadata.shadow=true + status=draft 双标记；本资产为演练树影子期产出，只落 staging/，未过 §5.2 判据不进 confirmed/）
- signOffLine: CTO（L3 签收门：工程类经验走 CTO 线，spec §九 9.2）；draft 态签收未过
- sourceNamingDiscrepancy: 树 action 指名 "trimmc-orchestration-m0-report.md" 不存在（全仓核验）；实存锚 = docs/execution/server-fleet-m0.md。全部溯源引用指向实存锚
- evidenceCommitLimitation: 初版（N1）无 shell 工具未执行 git log；收口核验（M1-N3，2026-08-25）已补跑 `git log --oneline -- docs/execution/server-fleet-m0.md` 并补全权威 commit 清单（见 evidence.commits），26ca782d 经 cat-file 验证为 commit 对象
- fiveCriteriaBasis: §三.7（server-fleet-m0.md:73）"MVP 门禁 5/5"5 个实证判据；§四 4 条门禁（:75-:80）与环境验证主题不对应，未采用
