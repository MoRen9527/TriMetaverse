# sg 仓面 ADE 残留清查任务简报（BOD 排窗令夜航段①，COO 排程）

- sourceOfTruth: 本件（trees/ade-legacy-sweep/ 交接简报）
- syncMode: static
- lastSyncedAt: 2026-09-21 23:3x
- 派工: COO 排窗令（23:28）→ CHO 打包 → 值席（m-duty-cos）留痕制执行
- 上位: task-charter-20260921-ade-legacy-sweep.md（fade-protocol-spec v2.0.0 ADE 概念退役）

## 一、任务

sg 侧各仓（照 MAP 20 仓清单）活类面 ADE 残留清查：扫→甄别→正名替换→读数回 COO 抄 CTO。

## 二、扫描口径

- pattern：词界 `ADE`（隔离 FADE 误匹配——FADE 内含 ADE 子串，禁裸 grep）+ 文件引用 `ade-pattern`/`ade_spec_reference`；
- 范围：*.md/*.yaml/*.json/*.py/.ts，排除 node_modules/.git/vendor/reference/dist/build/.codegraph/operating-records；
- 守卫脚本：`TriCompany/runtime/cognition/ade_legacy_guard.py`（纯 python 零依赖，可 python3 直跑；本机 TC 仓取最新版 80437b4+）。

## 三、甄别规则（CTO 四裁审定对照表）

1. 冻结不动：退役仓档案/历史记叙（带日期与 commit 锚的沿革句）/协议变更记录/考卷件/「ADE-A/B 历史代号」已注现称者/`ade-report` 契约值/`ADE_PROTOCOL`/`ADE_ACTIONS` 标识符/「前称 ADE」溯源注记形；
2. 活引用改：`ADE 模式/ADE 概念/ADE 协议框架` 类旧概念直呼→「确定性执行规程（FADE DCE 段）」/「FADE 协议（v2.0.0 前称 ADE）」；`ade-pattern-spec.md` 引用→`fade-protocol-spec.md`；
3. **同名词旗**：「共学周记 ADE 规范」（journal-recording-ade-spec）系另一 ADE 同名词非本退役概念——命中即标旗回 CHO，禁擅改。

## 四、读数回执格式

per 仓：扫描文件数/命中文件数/命中数/分类（冻结 X 活改 Y 同名词旗 Z）/改动文件清单+commit 锚。零命中仓报「零命中」即闭。

## 五、边界

- sg 面只读勘证+活引用替换；历史件禁改；遇归属不明→标旗回 CHO 不擅断；
- 读数回 COO（排窗令要求）抄 CTO（对照表审定人）。
