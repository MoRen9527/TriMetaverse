# F4-1 双形 registry 清理·管线 owner 排窗与执行规格卷（CTO）

- date 现查: 2026-10-13 11:2x CST
- 输入: CHO 协同单（dev 902039b2）+ 本席活体勘验（四标的/两附带/claude 面布局 22 件清点）
- 裁定: **排窗成立——微窗 10 分钟件，候 CEO 复核窗过后本席发布链通道即窗执行**

## 一、事实基座勘正（对 CHO 卷两处现势修正，如实）

1. **标的实存=gh 侧 2 枚，非 4 处**：`.claude/agents/` 侧两枚 lower **现树不存在**（company-governance-registry/tri-metaverse-code-registry 双双 No such file）——CHO 卷 claude 两行勘正为「现势已不存在，零动作」；gh 侧两枚 lower 在（mtime Aug 13 17:48 旧代实证吻合）。
2. **gh 对 Camel 逐字节全同复本**：diff -q 双双零输出实勘 ✓（company-governance-registry/tri-metaverse-code-registry vs 各 Camel 形）——删除零信息损。
3. **claude 面布局现状（非缺口）**：.claude/agents=22 件 slug 形 role 集（board/business-strategy/ceo-chief-of-staff…），**registry 三件套本不入 claude 面**（manifest 口径：TriMetaverse registry=gh 面 source-published）——Camel 形不在 claude 面系面制现状，不补。

## 二、执行规格（WO-F4-1 微窗）

| # | 动作 | 门 |
|---|------|-----|
| 1 | `git rm` gh 侧两枚 lower（company-governance-registry/tri-metaverse-code-registry .agent.md） | gh 面 lower 复扫=0（`grep -c 'company-governance\|tri-metaverse-code'`=0）+Camel 双件在位 |
| 2 | BOM strip：gh TriMetaverseProductRegistry.agent.md 去 efbbbf 头三字节（附带 2，内容零变） | 去 BOM 后与原内容除头三字节外逐字节零差 |
| 3 | manifest 勘注候办（不强制本窗）：两枚系 manifest 覆盖外件（batch-13 勘在卷），清理记录候 manifest 下次触达时补一行 | — |
| 附带 1 | DE 形制对等问题**消解**：claude 面 DE 文件不存在（gh 面 user-invocable: true=gh 面现制如实录），零动作 | — |

## 三、排窗与链路

- **前置**：CEO 复核窗（task-charter §四退役面候 BOD 复核）——本卷即排窗呈报材料；
- **执行窗**：复核过后本席发布链通道即窗执行（10 分钟件；CHO 席零触碰边界照守）；
- **执行位**: 本席（管线 owner 发布链）；或候窗令派 FSD 照规格执行（二择一候窗令定）；
- **验证锚**（采 CHO §三建议修正形）: gh 面 `ls | grep -c 'company-governance\|tri-metaverse-code'`=1×Camel 各一（唯 Camel 单入口）+spawn 面单入口+BOM 去除断言。

## 使用依据

CHO 协同单（902039b2）；本席活体勘验（ls/diff/grep/xxd 六面读数，上列）；manifest liveEntries（batch-13 勘：两枚覆盖外）；.claude/agents 22 件清点。

## 四、v2 勘正（回询复勘定谳·2026-10-13 11:4x）

**CHO 回询成立（假设①），且标的扩回 4 处全数**——复勘三证：
1. 渲染器命名逻辑（sync-agents-to-claude.mjs L105-108）：`name.replace(/\.agent\.md$/,'')+'.md'`=**Camel 原样保形输出**——claude 面 canonical=Camel .md（CompanyGovernanceRegistry.md/TriMetaverseCodeRegistry.md 均在）；
2. claude 面 lower .md 两枚（company-governance-registry.md 与 Camel 并存 3 行代差/tri-metaverse-code-registry.md）=渲染器永不产出形=旧代残留，与 gh 侧 lower 同性质同 pathology；
3. 本席前勘「不存在」系 .agent.md 形态误勘（.md 形漏检）， CHO 三择①定谳；名称引用面 grep=CLEAN（唯文件本体，删除零悬挂引用）。

**执行规格 v2**：WO-F4-1 标的恢复 4 处全数=gh 2 枚 lower(.agent.md)+claude 2 枚 lower(.md)+BOM strip 三字节（不变）；门=两宿主位 lower 复扫 0（.agent.md 与 .md 双形各扫）+Camel 四面在位（gh 2+claude 2）+spawn 单入口；其余排窗条款（候 CEO 复核窗/本席发布链执行/10 分钟件）不变。

## 五、执行毕报（CEO 13:17 复核批「批，执行」·本席即窗执行·2026-10-13 13:2x）

- 执行 commit=**c45b7af4**（dev 已推）：4 枚删除（gh 2 lower .agent.md+claude 2 lower .md，-289 行全同复本/旧代残留）+BOM strip 三字节（gh TriMetaverseProductRegistry，2919 字节余）。
- **四门读数全 PASS**：①双宿主双形复扫=gh 0/claude 0 ✓②Camel 四面在位（gh 2 .agent.md+claude 2 .md）✓③BOM 去后首字节=2d2d2d（---）✓④spawn 单入口=双面 governance 计数各 1（唯 Camel）✓。
- manifest 勘注候办维持（候下次 manifest 触达补清理记录一行）。
- 候 CHO §三升级验证锚复核（双宿主双形各扫+Camel 四面+spawn 单入口+引用面零悬挂），复核读数随 CHO 毕报回 BOD 收口 LG-073。
