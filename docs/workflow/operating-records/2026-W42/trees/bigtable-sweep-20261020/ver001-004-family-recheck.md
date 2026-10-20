# VER-20260806-001~004 版本族复核卷（大表清扫②·CTO）

- date 现查: 2026-10-20 12:4x CST；分支=report/20261020-bigtable-sweep；只读勘证 ✓

## VER-001 双轨过渡（聚合 calver+模块 semver 并行）——进行中确认+一处勘正

- TriRLC package.json=**0.9.0** semver 在役 ✓（10-13 亲勘沿用）；TriCade CI calver 面=**sg 未克隆 TriCade 仓**，CI/tag 面归 dev 对表（sg 面不可勘如实注）。
- **勘正①**: 10-13 亲勘「VERSION.json 映射表全工作区 glob 零命中（version.json 已消亡）」——本卷复勘 **3 命中**：TriRLC/version.json、TriMLC/version.json（各 {"version":"1.0.0"}）、TriLC.quarantine-20260921/version.json（归档件）。version.json **未消亡**，活在两现役仓根。

## VER-002 族 Phase 1「版本双源派生修正」——**双源分歧活体现勘（勘正②）**

- **TriRLC 双源分歧在役**: version.json=**1.0.0**（mtime 09-20 14:40）vs package.json=**0.9.0**；消费面分裂实锚=src/config/env.ts:121-132 **运行时读 version.json**（解析 <trilc-root>/version.json）+src/server/app.ts:4238 ACT2 更新比较用 version.json——而 npm/工程面读 package.json。**两面版本号分叉（1.0.0 vs 0.9.0）为现役活体态**。
- 10-13 结论「0.9.0 单源在役」**勘正为「双源分歧在役」**（其勘 glob 零命中致漏；口径差=勘深差异非追责）。
- 修复方向（归 VER-002 排期，非本批）: 单源化裁定——建议 package.json 为唯一源、version.json 转派生产物（build 时生成）或废止改读 package.json；TriMLC 同型同治。

## VER-003/004（Phase 2/3）——维持承袭

- 零进展证据不变（W32→W42 对表沿用 10-13 批）；Phase 1 双源修正（上）为 Phase 2/3 前置，排期随 VER-002。

## 大表行随更素材（四行）

- VER-001: 进行中维持+勘正①（version.json 未消亡，3 命中清单随卷）。
- VER-002: 状态升级=**双源分歧活体在役（1.0.0 vs 0.9.0 分叉实锚 env.ts:121-132/app.ts:4238）**，候排期升 P1 建议。
- VER-003/004: open 承袭维持。
- RISK-001（①卷）: 建议降级 P2 观察态。

## 使用依据

TriRLC/package.json+version.json+src/config/env.ts:121-132+src/server/app.ts:4238；TriMLC/version.json；TriLC.quarantine 归档件；curl 探针（api.deepseek.com 401/127.0.0.1:3333 200）；.claude/agents 22 件清点；OP-202610-W42-001.unresolved-items.md 全款。
