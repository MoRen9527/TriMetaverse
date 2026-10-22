# 供应链审计基准 · 2026-08-10 全工作区审计（ChainDrop 复盘归档）

- sourceOfTruth: 本卷（议题正身=2026-W33/AGENDA-20260810-001-supply-chain-hygiene-draft.md·CEO 2026-10-20 20:09 三项裁「照建议决议执行」·3-3 归档执行笔=AGENDA-001 排工单前行段）
- 归档时点: 2026-10-20（值席 COS·AGENDA-001 排工单 3-3）

## 一、事件基准表

| 项 | 内容 |
| --- | --- |
| 事件 | 2026-08-04 npm 供应链蠕虫 **ChainDrop**（Shai-Hulud 家族新变种）：4 小时投毒 **444 包 / 2,212 版本**，起点 keyv@6.0.0（周下载 1.5 亿），波及 jaredwray / @nebula.js 系 |
| 攻击模式 | preinstall 脚本下载 Bun 1.3.13 → 执行 710KB 混淆载荷（math_init.js / Math_Symbol.js）→ 窃取 npm/GitHub/云凭据 + **AI agent 凭据（Claude/OpenAI/Codex）** |
| 关键特点 | 第二波为**窃取凭据 republish 同名同版本**投毒——版本号正常 ≠ 安全，需验 integrity 签名 |
| IoC 清单 | umadev / @umacloud 命名空间；载荷文件名 math_init.js / Math_Symbol.js；keyv ≥6.0.0 异常版本 |

## 二、证据链（2026-08-10 全工作区审计实录）

| # | 审计项 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | 工作区覆盖 | 43 目录 / 14 个有依赖模块全覆盖 | ✓ |
| 2 | IoC 命名空间 | 无 umadev / @umacloud 命中 | ✓ |
| 3 | keyv 家族 | 均为合法版本（无 ≥6.0.0 异常） | ✓ |
| 4 | 载荷文件扫描 | math_init.js / Math_Symbol.js 零命中 | ✓ |
| 5 | npm audit | 12 模块 npm audit 无 ChainDrop 包 | ✓ |
| 6 | hooks 面 | 无恶意 hooks | ✓ |

**审计结论**: 环境未被感染、无需凭据轮换。事件暴露 3 项可执行改进（方案①npm12 白名单 / ②lockfile review 三层 / ③审计归档+复检触发）——三项 CEO 2026-10-20 20:09 全裁「照建议决议执行」，落地排工照 AGENDA-001 排工单四段走。

## 三、排查逻辑（可重复面·固化脚本=3-2 scan-supply-chain-iocs.ps1 候 SDE 段3）

1. IoC grep：umadev / @umacloud / 载荷文件名全工作区扫描
2. keyv 家族版本核（≥6.0.0 异常判）
3. 全模块 npm audit
4. hooks/preinstall 脚本清单核

—— 归档笔：sg 值席 COS（AGENDA-001 排工单 3-3·材料源=W33 议题正身 verbatim 摘录）
