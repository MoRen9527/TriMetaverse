---
name: ceo-standing-authorization
description: CEO 2026-08-13 常驻授权——非关键决策自行裁决不升级，升级仅限三类硬边界
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-13T01:25:11.593Z
---

CEO 2026-08-13 授予小贾（CEOChiefOfStaff）常驻决策授权：非关键决策自行裁决，不升级 CEO，保持任务不中断。

**升级 CEO 仅限三类**：
1. 重大不可逆（生产数据/架构变更）
2. CEO 明确保留权（战略/预算/组织）
3. 系统硬约束（管理员权限/UAC、GitHub push 权限等物理卡点）

**Why**: 消除"等 CEO 决策"成为任务中断点的现象。

**How to apply**:
- 能做的做：如 CI 触发走 gh workflow_dispatch（gh 已登录 MoRen9527，token 含 workflow 权限）
- 被系统卡住的记为 blocked + 整理批量清单，等 CEO 下次终端一次执行（不算中断）
- push 权限、管理员 shell 均属硬约束：直接判 blocked，不尝试绕过（2026-08-13 实测：`git push --dry-run` 被权限系统 deny；`net session` 报非管理员）
- 关联 [[verification-style-confirmed]]（验证纪律同源确认）
