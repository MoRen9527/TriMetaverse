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
