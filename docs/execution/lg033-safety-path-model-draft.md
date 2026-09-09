# safety 路径模型预研（LG-033 联审前置·CTO 主笔）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-safety-path-model-draft.md
- syncMode: draft｜lastSyncedAt: 2026-09-09

## 一、架构层方案：三层路径安全模型

```
Layer 1 确定性 deny（safety-check.ts SYSTEM_PATH_DENY 前缀清单）
  → 命中即拒（blocked=true 直拒非 confirm）——零裁量零旁路
Layer 2 确定性 confirm（工作目录白名单外=需人工确认）
  → cwd 白名单内自动放行，白名单外弹确认——半自动
Layer 3 语义裁（Agent Close Skill 语义裁决 approved|escalated）
  → 结构/语义级判断需 agent 参与
```

- **基底**：P4 e 项发现（write_file /etc/passwd 无拦截）+9a8be50 修复面（SYSTEM_PATH_DENY 前缀清单+blocked 直拒）——Layer 1 已落地
- **设计原则**：确定性 deny > 确定性 confirm > 语义裁——按风险递减排列，deny 层不依赖 agent 判断（纯规则匹配零幻觉零旁路）
- **工作目录白名单**：值班位=/srv/fleet/TriMetaverse（fleet 可写区域），白名单外写入需 confirm 而非拒绝（区分善意越界与恶意路径）
- **系统路径 deny 清单**：/etc/passwd /etc/shadow /etc/sudoers /boot /usr/bin /usr/sbin /bin /sbin /Windows（Windows 面）/proc /sys——前缀匹配不可逃逸（realpath 归一化后匹配）

## 二、值班位专属配置

- cwd 白名单=/srv/fleet/TriMetaverse（值班位蓄水池主仓）
- skip permissions 模式下 safety Layer 1 **仍强制**（skip 省确认/safety 管边界——e-fix 决策序红利）
- audit 全录（write_file 路径+目标+结果——值班位行为全可回放）

## 三、候联审裁点

1. deny 清单维护权（CAO 统一管理 vs 各 daemon 自管——推荐 CAO 统一）
2. confirm 升 deny 的判据（误确认率 >N% 自动升 deny——数据驱动渐进收紧）
3. realpath 归一化覆盖面（symlink/junction/hardlink 逃逸向量全覆盖 or 核心覆盖）
