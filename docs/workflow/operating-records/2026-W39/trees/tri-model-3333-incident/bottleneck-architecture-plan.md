# 3333 单点自举悖论·兜底架构方案件（CTO）

- sourceOfTruth: 本件（3333 事故③兜底架构审视；①根因读数②watchdog 实测随事故回执）
- syncMode: draft（候 BOD 裁）
- lastSyncedAt: 2026-09-22T00:1x+0800 基线（date 本回合链）

---

## 〇、悖论陈述

直连兜底的配置分发依赖 3333 自身可用——**3333 挂时兜底也配不了**（今晚 CEO 被迫手改 settings.json 实证）。本质：配置的「写入通道」与「消费通道」同源（都过 3333），写入通道单点=全局单点。

## 一、三层兜底架构（按启动成本递增排序，全不依赖 3333）

| 层 | 机制 | 触发 | 成本 |
| --- | --- | --- | --- |
| **L0 静态保底模板** | `~/.claude/settings.json.known-good`（直连 bigmodel 官方端点的冻结好配置）——3333 挂且需手工恢复时，拷回即用 | 人工（模板位固定，README 一句话指引） | 零（一份冻结文件） |
| **L1 独立恢复脚本** | `scripts/ops/local/restore-claude-direct.ps1`（脚本真源化域）——不经 3333，直接写 settings.json env 子集（三值：bigmodel 官方+known-good model） | 人工/半自动（一条命令） | 低（脚本真源化随批） |
| **L2 最后已知配置冻结（自动）** | TriModel 每次**成功写** settings.json 时，同步导出副本至 `.fade/settings.last-known.json`（3333 外独立位）——3333 挂时该冻结件=最近已知好配置 | 自动（3333 写路径集中，加快照逻辑=TriModel 小改，候下窗） | 中（需 TriModel 代码小改） |

## 二、配套

1. **TriModel-Watchdog 已部署**（seat-watchdog 并入 3333 保活段+TriModel-Watchdog 任务双保险）——兜底触发概率被 watchdog 压到极低（3333 挂≤5 分钟自动复活），三层兜底=watchdog 失效时的最后防线（纵深防御非重复建设）；
2. **CEO 手工恢复动作模板化**：昨夜 CEO 手改 settings.json 的操作固化为 L0 README 指引（「3333 挂时：copy known-good→settings.json→重启会话」三步）；
3. **脚本真源化联动**：L1 脚本入 scripts/ops/local/（真源化命题首落件之一）。

## 三、裁决点（候 BOD/CEO）

- L0+L1 立即可落（零风险）；L2 的 TriModel 快照小改候下窗（与 contract 窗错峰）；
- 若 CEO 认为 L2 也不必（watchdog+L0/L1 足够）——可裁 L2 不做（YAGNI 合理）。

## 四、使用依据

BOD 事故单三件令；3333 事故链（09-22 挂起/CEO 急救/watchdog 部署实测）；脚本真源化命题（L1 归位）。
