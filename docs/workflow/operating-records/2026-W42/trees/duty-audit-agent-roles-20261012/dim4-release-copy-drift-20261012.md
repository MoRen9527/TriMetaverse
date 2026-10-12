# 维度 4 主审材料 · 发布拷贝漂移清单（全岗位职责审核·CHO 主导组队）

- 主审维度 4: 发布拷贝漂移（TriMetaverse/.claude/agents/ 与 .github/agents/ vs TriCompany/source-agents/）
- 执行位: sg duty 值席（CHO 23:06 组队令）；边界=**只审不改**全程恪守（全只读比对）
- 比对法: 三层——①host-vs-host 裸 hash ②**归一化 hash**（剥管线尾注行/尾空白后）③源-发布 mtime 时效面＋源席映射覆盖
- 采集时点: 2026-10-12T15:30:02Z（23:30+08·date 现查）
- 面积: 源 16 席目录（15 席同名映射＋registries/ 族）×发布位各 22 文件×两 host

## 一、总判

**双 host 正文零实质漂移的席=15/22；实质漂移集中=双形重复文件族 4 件＋宿主方言族（设计内）**；源-发布时效面零漏发布信号。

## 二、漂移清单（席×发布位×漂移面×建议）

| # | 席/文件 | 发布位 | 漂移面 | 定性 | 建议 |
|---|---|---|---|---|---|
| 1 | company-governance-registry（小写） | .claude | 与同席 Camel 形**代差 12 行**（lower mtime 10-0x 早于 camel 新代）；gh 侧同名文件=与 Camel 逐字节全同 | 双形重复·claude 侧 lower=旧代残留 | 命名归一裁决（候 CHO/管线 owner 定保留形·camel 为新代证据面）；claude lower 旧代件退役评估；gh 重复件随管线去重 |
| 2 | CompanyGovernanceRegistry（Camel） | .claude vs .github | 正文差=tools 字段宿主方言（[Read, Glob, Edit] vs [read, search, edit]）＋尾注/尾换行 | **设计内宿主形制·非漂移** | 无需动（管线形制面） |
| 3 | tri-metaverse-code-registry（小写） | .claude | 与 TriMetaverseCodeRegistry 代差（同 #1 型）；gh 侧=全同复本 | 双形重复·旧代残留 | 同 #1 |
| 4 | TriMetaverseCodeRegistry（Camel） | .claude vs .github | tools 方言＋尾注（同 #2 型） | 设计内 | 无需动 |
| 5 | TriMetaverseBusinessStrategyRegistry | .claude vs .github | tools 方言族 | 设计内 | 无需动 |
| 6 | TriMetaverseProductRegistry | .claude vs .github | tools 方言族＋**gh 侧 UTF-8 BOM 头**（﻿--- frontmatter 前零宽字符） | 方言设计内＋BOM=管线 hygiene | BOM 列管线卫生小项（候发布管线 owner 顺手清） |
| 7 | deployment-engineer | .claude vs .github | gh 特有 frontmatter 字段 `user-invocable: true`（claude 侧无） | 宿主 frontmatter 形制差（github-agents 格式字段） | 候管线 owner 确认 claude 形是否需对等字段（形制面对表·非内容漂移） |
| 8 | 其余 15 席（board/13 C-level 席/FSD/RDT/SDE*/STE*/CSO 等） | .claude vs .github | 归一化 hash 全同（裸 DIFF 系管线尾注 --host 行＋尾换行） | **零实质漂移** | 无需动 |
| 9 | 全 22 席 | 源-发布时效 | 源片 mtime 全部 ≤ 发布批（1791121212 批·10-0x 全量发布）＝**零源新于发布漏发布信号**；源 16 目录→15 同名＋registries 族映射成立 | 时效面清洁 | 无需动 |

## 三、观察项（非漂移·录CHO 合稿参考）

- gh 侧 4 席 mtime 陈旧（board/business-strategy/CAO/registry 族 08-2x~10-01）但归一正文同＝发布批未重渲而内容已在态——管线增量渲染行为观察项，非漂移。
- 裸 hash 层 22/22 全 DIFF 的真相=宿主形制包装（尾注行/frontmatter/BOM）——**审发布拷贝漂移须归一化比对**，裸 hash 会全量误报（方法论注记随卷）。

## 四、边界声明

- 只审不改恪守（全只读·零写入三面）；本材料=维度 4 比对面，13 席描述面/真源六件归 CHO+CAO 主读（值席免读全量恪守）；漂移清单即刻回 CHO 席合稿（合稿正身=audit-report-20261013.md·本卷=维度 4 材料）。

—— sg 值席 COS（维度 4 主审），2026-10-12 23:4x +0800
