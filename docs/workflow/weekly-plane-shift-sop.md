# 周度平移 SOP（标准操作流程）

> w33-6: W32 手动流程提炼 → 可复用模板 → 未来 cron 自动化基础
> ADE 模式：Agent plans → Deterministic CLI executes → Agent closes

## 流程概述

每周一（或周日 23:00）执行，将上一周的未闭合事项平移到新周。

## 步骤

### Step 1: 确认上一周状态

```
输入: 上一周 OP JSON (OP-YYYYMM-Wnn-001.json)
动作:
  1. 读取 status — 确认已闭合 (done) 或仍在进行 (active)
  2. 若 active: 读取 active_trees 列表, 统计 done/pending 节点
  3. 读取 carry_over_from_prev 清单
```

### Step 2: 读取未决事项

```
输入: 上一周 unresolved-items.md
动作:
  1. 提取 active 和 frozen 事项
  2. 计算每个事项已持续的周数
  3. 标记: <4w 正常, 4w+ ⚠️, 8w+ ⚠️⚠️ CEO 升级
```

### Step 3: 生成 carry-over 清单

```
输出: 新一周 unresolved-items.md
动作:
  1. 平移 active 事项 (保留原 ID + 周数+1)
  2. 平移 frozen 事项 (保持冻结标记 + 周数+1)
  3. 关闭 done 事项 (移至已关闭 §)
  4. 标记超期预警
```

### Step 4: 创建新周目录

```
输出目录结构:
  docs/workflow/operating-records/2026-Wnn/
  ├── OP-YYYYMM-Wnn-001.json           ← 周索引
  ├── OP-YYYYMM-Wnn-001.unresolved-items.md ← 未决事项
  └── trees/                            ← 树目录
      └── <tree-id>/
          └── tree-op.json

动作:
  1. 创建目录 (mkdir)
  2. 创建 OP JSON 骨架 (status: in_progress, dependsOn: 上一周)
  3. 创建 unresolved-items.md 骨架
  4. 创建 tree 子目录 (按需)
```

### Step 5: 注册到新周 OP JSON

```
动作:
  1. 更新 new_week OP JSON:
     - active_trees: 列出新周所有树
     - carry_over_from_prev: carry-over 清单
     - risks: 上一周未消除的风险 + 新识别
     - next_week_preview: 下一周预计
```

### Step 6: 通知 + 收口

```
动作:
  1. 周度平移完成 → localbus 通知 CEOChiefOfStaff 审核
  2. 4w+ carry-over 自动高亮
  3. 8w+ carry-over 升级到 CEO (磨人)
```

---

## 未来 CLI 规格 (`weekly-plane shift`)

```
weekly-plane shift [--from <week>] [--dry-run]

Options:
  --from <week>      源周 (默认: 自动检测 latestActiveWeek)
  --dry-run          干跑模式, 只输出将要执行的动作, 不写入

流程 (完整 ADE 五段闭环):
  0. Event 触发:
     - cron 定时 (周末 23:00, TriLC cron command 模式)
     - 或手动 (trilc cron run weekly-plane-shift --force)

  1. Agent plans (用规划 skill 标准化):
     - skill: tri-plan (周平面规划 skill)
     - 读取 --from 周 OP 索引 + unresolved-items
     - 计算 carry-over (active/frozen/done + 周数+1 + 4w/8w 预警)
     - 产出: 迁移计划 (JSON, 给 CLI 的确定性输入)

  2. Deterministic CLI executes:
     - weekly_plane_shift.py: create → migrate → carry_over → validate
     - 输出: .shift-ade.json (status/summary/changes/errors)

  3. Agent closes (验证收口):
     - 读取 .shift-ade.json, 验证 status=pass
     - 检查新周目录完整性 (OP JSON + unresolved-items)
     - 超期事项升级裁决 (8w → CEO)

  4. CLI 最终落地:
     - 更新 unresolved-items 周数标注 (幂等)
     - 写入操作记录 (shift log)
     - localbus 通知 (小贾/W33 首周事项清单)

Example:
  $ weekly-plane shift --from 2026-W32
  [weekly-plane] W32 → W33 shift
  [weekly-plane] Carried over: 7 items (5x ⚠️⚠️ 5w+, 2x active)
  [weekly-plane] Created: docs/workflow/operating-records/2026-W33/
  [weekly-plane] W32 marked done.
```

---

## 文件命名规范

| 文件 | 格式 | 示例 |
|---|---|---|
| 周索引 | `OP-YYYYMM-Wnn-001.json` | `OP-202608-W33-001.json` |
| 未决事项 | `OP-YYYYMM-Wnn-001.unresolved-items.md` | `OP-202608-W33-001.unresolved-items.md` |
| 经营记录 | `ET-YYYYMMDD-NNN-<desc>.json` | `ET-20260804-001-cron-verification.json` |
| 会议记录 | `project-ai-community-weekly-YYYY-Wnn.md` | `project-ai-community-weekly-2026-W33.md` |

## Carry-over 预警等级

| 周数 | 标记 | 动作 |
|---|---|---|
| <4w | (无) | 正常追踪 |
| 4w+ | ⚠️ | 标注预警, 通知负责人 |
| 8w+ | ⚠️⚠️ | CEO 升级, 强制评估: 推进/冻结/关闭 |
