#!/usr/bin/env python3
"""Generate 7 FADE tutorial trees for W35 plane."""
import json, os
from pathlib import Path

BASE = Path("docs/workflow/operating-records/2026-W35/trees")

META = {
    "domainRouting": "server-executable", "face": "m-face", "status": "active",
    "created": "2026-08-28", "week": "W35",
}

def node(nid, agent, action):
    return {"nodeId": nid, "agent": agent, "status": "pending", "action": action}

def tree(tid, title, spec_ref, nodes, done_cond):
    d = {"treeId": tid, "title": title, **META, "spec": spec_ref, "nodes": nodes,
         "doneCondition": done_cond}
    d["notes"] = [
        "任务说明书=本文件 action 字段（FADE-006 标准管线：说明书→挂平面→sg 小贾拆树执行）",
        "审稿重点：引用的 commit/hash/评分数字必须与仓库实证一致，禁凭记忆写",
    ]
    return d

def W1(action): return node("W1", "RAndDTrainer", action)
def V1(action): return node("V1", "TestEngineer", action)
def C1(action): return node("C1", "CEOChiefOfStaff",
    "收口：核验通过后 commit+push 三端（本地/sg-bare/GitHub），状态条报董事会。核验不通过→打回 W1 重写。")

TREES = []

# 1. FADE-001
TREES.append(tree("fade-tutorial-001-deep",
    "FADE-001 周平面维护深度教程",
    "fade-registry FADE-001 扩维条目 + daily_progress_patrol.py + daily-progress.md + D-03 v2/v3",
    [
        W1("撰写 TriCompany/docs/training/fade-001-maintenance-deep-dive.md：FADE-001 周平面维护深度教程。①协议十段逐段在本实例的落地形态（事件触发=cron→事件驱动演进/登记=日期锚+git 三端/Qualify=ledger mtime+commits 变化机械门/Plan=三节结构静态固化/DCE=patrol 确定性收集+事件驱动双写/Verify=回读四查/Score=--score shadow→gate 两阶段/Close=确认+push 即终态→收口登记载体演进）②patrol 巡检三跳弧线逐跳拆解（20:10 首跳真实触发/20:20 同秒缺陷实测抓出/20:30 拓扑门限修复——file:line 到 daily_progress_patrol.py）③shadow→gate 评分接线设计与 FADE-007 E-3 对照④事件驱动+10min 兜底节奏架构图⑤与 D-03 v2/v3、D-02 纪律关联。深度基线 >400 行；commit/hash 与仓库实证一致。"),
        V1("事实核验 fade-001-maintenance-deep-dive.md：①教程引用的每个 file:line 与仓库现行代码比对 ②每个 commit hash 用 git log 验证 ③评分数字（90/80/85）与 fade-papers/FADE-001-paper*.json 对照 ④深度 wc -l ≥400 ⑤错误逐条列出，核验报告落同目录 reports/。"),
        C1(""),
    ],
    "三节点 done：教程入库 TriCompany/docs/training/ + 事实核验零错误 + 三端已推"))

# 2. FADE-002
TREES.append(tree("fade-tutorial-002-deep",
    "FADE-002 发布域深度教程",
    "fade-registry FADE-002 条目（93 分复评）+ envelope v1.0 + source_publish_check.py + 多宿主渲染（spec §6.2）",
    [
        W1("撰写 TriCompany/docs/training/fade-002-publishing-deep-dive.md：FADE-002 发布域深度教程。①envelope v1.0 合同逐字段拆解（protocol/version/scope/run_id/mode/status/summary 守恒/items 七字段/action 词表——v2.0.0 降格为参考实现的立法弧线）②三 scope（sync/project-docs/publish-agents）逐 scope 流程拆解（source_publish_check.py file:line）③多宿主渲染模型（HOST_RENDER_REGISTRY/copilot 字节保真/claude 渲染面+白名单/tool_drops 审计）④内容归属+跨管线派生校验（v1.2.0 B 族/D 族）⑤复评 93 分的 run-id 核销弧线。深度基线 >400 行。"),
        V1("事实核验 fade-002-publishing-deep-dive.md：file:line 对照 source_publish_check.py 现行代码/93 分与 fade-papers/FADE-002-* 卷宗对照/深度 ≥400 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

# 3. FADE-003
TREES.append(tree("fade-tutorial-003-deep",
    "FADE-003 共学周记深度教程",
    "fade-registry FADE-003 升完整档条目（98/100 首评最高分）+ journal-cli.mjs（17649d7d：score/RETRY/三态）+ fade-003-upgrade-review.md 升档弧线",
    [
        W1("撰写 TriCompany/docs/training/fade-003-journal-deep-dive.md：FADE-003 共学周记深度教程。①journal-cli 五子命令逐个拆解（begin/qualify/append/close/score，file:line 到 journal-cli.mjs）②score 子命令 S1-S7 逐检查项拆解（含 W4 双判问/entryNo+title 定位/S5 QUALIFIED 入链强化/S7 守恒基线非本 run 条目零变化+revision 授权域）③RETRY 状态机全图（score FAIL→close retry→revision→score 重跑→PASS→close APPROVED；S7 自斥缺陷与修复弧线）④词表三态（FROZEN 留口理由：语义偏移+纸面态纪律）⑤升档弧线全录（80 卡线→降档兼容→score 落地→98/100 首评最高分——元叙事：评分体系第一个真实 run 评的就是其自身教训）。深度基线 >400 行。"),
        V1("事实核验 fade-003-journal-deep-dive.md：file:line 对照 journal-cli.mjs 现行代码（17649d7d 版）/98 分与 fade-papers/FADE-003-* 卷宗对照/升档弧线与 git log 对照/深度 ≥400 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

# 4. FADE-004
TREES.append(tree("fade-tutorial-004-deep",
    "FADE-004 员工域深度教程",
    "fade-registry FADE-004 条目（88 分复评）+ staffing 三端点 + 多宿主渲染（spec §6.2）+ FADE-005 并入沿革",
    [
        W1("撰写 TriCompany/docs/training/fade-004-employee-deep-dive.md：FADE-004 员工域深度教程。①staffing 三端点逐个拆解（roster/onboard/decide，src/company/staffing.ts file:line）②多宿主渲染模型（HOST_RENDER_REGISTRY/copilot 字节保真/claude 渲染面+白名单/tool_drops 审计/派生纪律三层单向传导）③CHO 面板代理审批链④FADE-005 roster-gating-spec 并入沿革（ADE-B 扩容整合定调）⑤复评 81→88 升级四项弧线。深度基线 >400 行。"),
        V1("事实核验 fade-004-employee-deep-dive.md：file:line 对照 staffing.ts 现行代码/88 分与 fade-papers/FADE-004-* 卷宗对照/深度 ≥400 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

# 5. FADE-005 号
TREES.append(tree("fade-tutorial-005-deep",
    "FADE-005 号深度解读（roster-gating 规范+并入沿革）",
    "fade-005-roster-gating-spec.md 独立规范 + fade-registry FADE-004 条目（并入沿革）+ ade-consolidation-proposal.md",
    [
        W1("撰写 TriCompany/docs/training/fade-005-roster-gating-deep-dive.md：FADE-005 号深度解读。①fade-005-roster-gating-spec.md 逐条解读（三处门禁/非在岗语义/兼容性表）②编号勘误史（为何无独立 FADE-005 登记——ADE-B 扩容整合定调）③并入 FADE-004 后的 roster.active 门禁与员工域的关系④roster-gating 在 TriLC staffing.ts 的实现映射。深度基线 >350 行。"),
        V1("事实核验 fade-005-roster-gating-deep-dive.md：file:line 对照 staffing.ts/gate 相关代码/深度 ≥350 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

# 6. FADE-006
TREES.append(tree("fade-tutorial-006-deep",
    "FADE-006 执行面自动拾取深度教程",
    "fade-registry FADE-006 升格标准档条目（映射表+run root c841f337）+ P0 战役八实例 + fade-pipeline-design.md v1.1",
    [
        W1("撰写 TriCompany/docs/training/fade-006-autopilot-deep-dive.md：FADE-006 执行面自动拾取深度教程——全体系新标准首例。①段-实现映射表逐段拆解（十段×三字段：载体/不变量证据/降级合同——登记册 v2.1 FADE-006 条目为准）②run root v2 schema 逐字段拆解（producedAt/initialRoot/recompute_history append-only/basis manifest/anchors）③P0 战役八实例全弧线（p0fix1 四轮磨墙/p0fix2 服务面/p0fix3 HTTP 三通道/p0fix4 三重墙沙箱——每实例 blocked 分层取证→修复→自愈复工弧线）④双轨评分制（首评冻结+增评现行法）⑤卷封制与段-实现映射表制度闭环（细则 7(a)+run root+周检三件套）⑥覆盖写缺陷弧线（细则 10 第 4 判例）。深度基线 >450 行（新标准首例基线最高）。"),
        V1("事实核验 fade-006-autopilot-deep-dive.md：file:line 对照 agent-core 现行代码/八实例 commit hash 与 git log 对照/91 分与 fade-papers/FADE-006-*rereview 卷宗对照/深度 ≥450 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

# 7. FADE-007
TREES.append(tree("fade-tutorial-007-deep",
    "FADE-007 蓄水池深度教程",
    "fade-007-context-reservoir-spec.md（探索期→兼容档：S1-S3 场景/E-1 E-2 演练/五源恢复配方）+ 工具族五件 + board-journal/ledger-mirror",
    [
        W1("撰写 TriCompany/docs/training/fade-007-reservoir-deep-dive.md：FADE-007 蓄水池深度教程。①蓄水池隐喻逐角色拆解（蓄水池=董事会/闹钟+记事本=董事会/河水水位=中枢上下文）②流程 A 受控压缩五步/流程 B 清空过渡六步逐步拆解③五源恢复配方逐步拆解（CLAUDE.md 分权制节/board-journal/ledger-mirror/full 基线/协议规范——每源各含什么、恢复时各怎么用）④S1-S3 故障场景枚举与演练证据（E-1 寻址 49s/E-2 五源重建零背景复述全对）⑤工具族五件逐件拆解（seal-materials 双 hash+SOFT-DRIFT/node-report-check 九键+三态/run-root v2 append-only/_fadehash canonical/hub-snapshot-diff 一具两段）⑥细则 10 判例×4 全弧线。深度基线 >400 行。"),
        V1("事实核验 fade-007-reservoir-deep-dive.md：file:line 对照工具族五件现行代码/E-1 E-2 演练记录对照/深度 ≥400 行/核验报告落同目录。"),
        C1(""),
    ],
    "三节点 done：教程入库+核验零错误+三端已推"))

for spec in TREES:
    d = BASE / spec["treeId"]
    d.mkdir(parents=True, exist_ok=True)
    (d / "tree-op.json").write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  {spec['treeId']}: {len(spec['nodes'])} nodes")
print(f"{len(TREES)} trees generated")
