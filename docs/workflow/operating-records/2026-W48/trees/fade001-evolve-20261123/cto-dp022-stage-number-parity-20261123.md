# CTO 对表卷·DP-20261123-022 协议段号×实现段号（两轨并列·不改行为只正名）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-dp022-stage-number-parity-20261123.md·段号对表正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: BOD 催（四向核零命中·DP-022 待出卷）+COS 927 排期+CAO 联合面

## §一 · 两轨并列（正身定义）

**协议轨（教程体系 01 十阶段全景·v2.0.0 权威·协议层视角）**：

| 协议段 | 问题 | 脚本 | 产物 |
|---|---|---|---|
| **（隐形第 0 道）** | **触发**（该不该起跑·cron payload/ignite） | （cron `50 23 * * 0` / `fade001-ignite.ts`） | — |
| 1 | 该不该跑？ | preflight.py | preflight.json |
| 2 | 有资格跑吗？ | qualify.py | qualify.json |
| 3 | 搬什么？ | plan_scope.py | plan.json |
| 4 | 动手跑 | dce_steps.py | dce.json |
| 5 | 迁对没？ | verify.py | verify.json |
| 6 | 有没有分？ | score_cli.py + score_engine.py | score.json |
| 7 | 怎么评的？ | score_rubric.py | report |
| 8 | 复盘收口 | close_skill.py | close.json |
| 9 | 有终点吗？ | close_cli.py | manifest.json |
| 10 | 到达人了吗？ | notify_done.py | — |

**实现轨（chain_runner.ts STAGES·5ade74f 代码实证·10 段）**：

| 实现段 | name | script | output |
|---|---|---|---|
| 1 | preflight | preflight.py | preflight.json |
| 2 | qualify | qualify.py | qualify.json |
| 3 | plan_scope | plan_scope.py↔plan_skill_spawn.py（spawn 形） | plan.json |
| 4 | dce | dce_steps.py | dce.json |
| 5 | verify | verify.py | verify.json |
| 6 | score | score_cli.py | score.json |
| 7 | score_skill | score_skill_spawn.py（两席） | score-skill.json |
| 8 | close_skill | close_skill.py↔close_skill_spawn.py（spawn 形） | close.json |
| 9 | close | close_cli.py | manifest.json |
| 10 | notify_done | notify_done.py | notify_done.json |

## §二 · 映射表与错位裁定

**1-6/8-10 段=两轨同名**（**8/9 段功能一致**·脚本同源；段 3/8 的 spawn 形=灰度/默认形切换·段号不变）。

**唯一功能差异=段 7**：
- 协议 7=**score_rubric.py**（评分规则展示·report）=「怎么评的」**透明度步**；
- 实现 7=**score_skill**（spawn 两席主观判分·score-skill.json）——**P2/P3 演进新增**；
- **如实注**：score_rubric 功能现状=**评分规则已内嵌 score_cli/spawn prompt 面**·未单步落地（教程 01 v2.0.0=11-14 基线·实现已演进至 W48）；**段 7 两义并存=功能演进差非编号错**——**正名=实现段 7 称「score_skill（段 7 演进面）」·协议 7「rubric 展示」标注「已并入评分面」**。

**口诀「协议数触发·实现数 preflight」=旧读法正名**：
- 若按「协议段 1=触发」读（旧版/简化口诀）→协议 1..10=触发+preflight..notify=**与实现差 1 位**；
- **正身=教程 01 v2.0.0「触发=隐形第 0 道」**⇒ **两轨 1..10 对齐**（除段 7 功能演进）；
- **正名注（入文档面）**：一切文档/教程/规范提及段号时——**触发=第 0 道（隐形·链前）·段 1-10=两轨同名**；旧「段 1=触发」表述=历史读法·引用须加注。

## §三 · 落地面（不改行为只正名）

1. **文档/教程面**：07 触发章已如实注（L29）·RDT 补丁按本卷正名（§二口诀段）；
2. **代码注释面**：chain_runner STAGES 注释可加「段号=实现轨·协议轨同名（触发=第 0 道）」一行（候 FSD 顺手·非必须）；
3. **零行为变更**（本卷=对表非施工）。

## §四 · 使用依据

教程 01（v2.0.0 十阶段全景）+教程 07（触发章 L29 错位如实注）+chain_runner 5ade74f STAGES 实读+RDT 教程 v2.3.0（526fbc0 系）+BOD 催（四向核）+COS 927+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T12:29:00Z（+0800=20:29）〔commit 时戳锚·D-47 正形〕
