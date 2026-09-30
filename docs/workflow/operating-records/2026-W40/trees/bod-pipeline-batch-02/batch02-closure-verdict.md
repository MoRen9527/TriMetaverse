# 批次02 收口审查裁决卷（CTO owner 面·件 2+3 候裁注三族）

- date 现查: 2026-10-01 02:09 CST
- 裁决人: CTO 小狄（批次02 收口审查 owner）
- 输入: lg059-trimmc-fix-readout.md（TriMMC bfbfcfe）+ lg060-field-follow-readout.md（TriRLC 3800e2d）+ alias 真源原文对表（company-governance-state.md:198-211 现勘）
- 裁决口径: 测试门=涉面全绿+零回归+挂名单 diff 一致=门过；预存 out-of-face 挂/tsc 错不阻本批收口（已归域候办清单在卷）

## 族 1·alias 真源对表 → **裁可（对表成立，零补）**

实勘真源原文（company-governance-state.md:198-211，CEO 08-31 终态裁决·单 B，C 档双名并书+物理冻结）逐条对表 FSD 执行面：

| 真源规则 | FSD 执行 | 判 |
| --- | --- | --- |
| 大写连写=叙事名→正名 | 888 行 TriMC→TriMMC/TriLC→TriRLC 大小写敏感改 | ✓ 吻合 |
| 小写标识符=兼容面旧名 | trimc/trilc（bin 名/服务名/email/runtime_equivalent 值）天然零触 | ✓ 吻合 |
| 物理目录/systemd units 永久冻结 | `/srv/fleet/TriMC`+`TRIMC_*` env K 面整行不动（18 行） | ✓ 吻合 |
| 留痕 | 「正名投影非事实抹除」本卷留痕 | ✓ 合规 |

**裁条**：族 1 无补项；LG-059 修复面（R 面）复扫零命中+K 面逐行清单在卷=收口证据链闭合。

## 族 2·registry 三件文件名收敛 → **不可补（本批）→ 归专窗定性**

TriMC{Code,BusinessStrategy,Product}Registry.agent.md 三件：frontmatter `name:` 随冻结文件名保留旧形=FSD 正确守为（文件名绑定标识符，本批擅改=越界）。

- 方向裁示：**应收敛**——alias 真源明文「叙事名=文档与 registry 正名」，registry 件属叙事面，文件名终态=TriMMC*Registry（含 frontmatter name 同步）。
- 不可补因（本批）：文件名收敛捆绑 **manifest migrated-module-local-live-entry 三条 target 同步修订**（单发现规则治理面）+Copilot 宿主发现身份+跨卷引用面（b13/b14 扫尾清册等）——非测试门可保护的纯改名，属 host-object 命名治理窗。
- **裁条**：归专窗（host-object/migration 命名收敛窗，候 BOD 排窗）；前置清单=①manifest 三 target 同步方案②发现面影响清点③正名批与 LG-046 Phase 3/4 邻接对表。候裁期间三件现名照用（单发现规则下无二义）。

## 族 3·TriMC Scheduler cron payload 身份 → **裁可（维持 K 档，随批窗条款）**

真源 B 档条款**原文预裁**：「B 档项（cron payload/hook 内嵌路径）仅在自然编辑窗顺手对齐，不排停机窗」——FSD K 档（B 档候自然编辑窗）=逐字执行真源，非自由裁量。

**裁条**：现役维持 `TriMC Scheduler`（cli.ts:77/runbook:23/scheduler-design:1/92/107 五处 K 面）；**下次 cron job 重推窗**（名册激活/周迁移窗/任意 job json 原子重推窗）payload 身份字符串随批 `TriMC Scheduler`→`TriMMC Scheduler` 五处原子切换（代码+持久化 job json 同窗，防身份分裂），审计锚=切换前后 job lastRunStatus 对照行留痕。勿为此单排停机窗。

## 附裁·LG-060 顺手修复（'trirlc'→'trilc'）→ **裁可**

小写=兼容面旧名域：`trilc` 在册（alias 表 TriRLC 兼容面载体=「trilc bin/npm 名」），`'trirlc'`=改名期事故字（无此服务名）；service/owned_by 字符串值修正+auth-gate e1 转绿=双证。零补。

## 测试门判读（收口成立要件）

- **件 2**：476/466/10/0 改前改后全等+挂名单 diff 一致+复扫 R 面零命中+tsc 过 → **涉面门过**（10 挂全预存 out-of-face，四族归因候 CTO/STE 清单在卷）
- **件 3**：node22 基线 190/13 → 件 3 后 199/4（**净收口 −9**），4 挂+tsc 5 错全预存 out-of-face（归域：LG-026-P2 漂移/FADE-005 产品面/FADE-003 计数/ink 冲突专窗/lead-tools API 代差）→ **涉面门过**；node18→node22 测试基建半件+devDeps 补装合规留痕
- **收口裁定**：件 2（bfbfcfe）+件 3（3800e2d）**收口成立**；本卷即 NOTIFY 件

## Follow-ups（不阻收口，已归域）

1. 卡点四族十挂+tsc 五错：候 CTO/STE 各域清单（ctx.cwd sg 环境/config-sync+cron 401=03fecb0 fail-closed 测试未随（8712 迁移窗随批）/花名册 14vs12 对表现役/internal token 兼容断言改 fail-closed 正形/ink 版本专窗/lead-tools 代差）
2. 族 2 专窗候 BOD 排窗；族 3 随批窗条款由本席在对应窗触发时提示
3. ±1 计数差（45vs46）FSD 实勘 46 逐处对表不凑数=正确处置，留痕即可
