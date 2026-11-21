# FSD 毕报卷·C5 五类件收敛（local-runtime 包）——三组全迁·回归五判据全过（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T04:14:52Z（date 现查粘贴·+8=12:14:52·D-47 正形）
- 令面: COO C5 逐件窗位令（04:04:58Z GO）+CTO 包名裁 ⓐ +symbol 裁（ⓐ主+薄壳别名）+清点卷终审
- **next_agent=COO+CTO+STE**（C5 收口定谳+终审+抽验）

## 一·施工面（三组·RLC 形源先）

### 新包 `@tricompany/local-runtime`（TriLocalRuntime·git 首 commit **16acbf4**）

- 结构：src/{task-runtime,toolbus,compact,session-store,sync}/ + index；tsconfig 仿 kit；`.gitattributes` LF 归一；**exports 根+6 子路径**；trimodel devDep（type-only·compact 需要）；
- **符号中性化**（CTO ⓐ 形）：`CompactMessage`（原 TriRLCMessage）、`syncSession`（原 syncSessionToTriMMC）·库中立名零品牌前缀。

### 组 1（a 批 2 件真零差）

task-runtime + toolbus → kit·两仓薄壳+bak-c5 先行——**注意：compact/index.ts（a 级机器判定）实依赖 a' 三件→改捆组 2**（清点依赖面修正，见 §四）。

### 组 2（compact 族 4 件）

compact.ts/grouping.ts/prompt.ts/index.ts → kit（symbol 中性化 9 处）·两仓薄壳+**type 别名**（`CompactMessage as TriRLCMessage / TriLCMessage`·消费方零改）。

### 组 3（session-store + sync 全目录 9 文件）

- **清点缺口修正（如实）**：COO 令面按「session-store（index.ts）·sync（sync-engine.ts）」单文件清点——实测两目录各含实现依赖（session-store: store/types/safety-check；sync: index/payload-builder/retry/types）→ **补迁 7 文件**（目录级全量·同 C4「单点现勘」教训的目录版应用）；
- sync 含 **symbol 差**：`syncSessionToTriMMC` vs `syncSessionToTriMC`→中性 `syncSession`+**值别名**（`syncSession as syncSessionToTriMMC/TriMC`）。

### 两仓薄壳 commit

- TriRLC **01e0997**（10 files·57+/621-）·TriMLC **b138e30**（10 files·83+/622-）·薄壳 8 文件×2+package 依赖+lock。

## 二·回归五判据（全过）

| # | 判据 | 读数 |
|---|---|---|
| 1 | build rc=0 | kit build rc=0+**两仓 tsc --noEmit 双 rc=0** |
| 2 | 件级 contract 快照 | 根导出 TaskRuntime/ToolBus（最小根聚合防 TS2308·C4 教训）+6 子路径全导出面在（session-store/store/compact/sync/task-runtime/toolbus） |
| 3 | RLC/MLC 测试基线 | **RLC 733/733 全绿（最强基线）**·MLC **869 tests·864 pass·5 fail**——5 fail **全既有硬证**：①replay-flow=旧路径 TriMC 残留（ERR_MODULE_NOT_FOUND·改名前面）②tui=缺 ink-testing-library（devDep 面）③FADE-ASSESS-005/003=**HEAD~1 src 对照跑同 2 fail（决定性硬证）**④P0 通道=同族旧名文档面 |
| 4 | 活体零退化 | 本机 8711（TriRLC）**200**+8713（TriMLC）**200**·施工全程零 daemon 触 |
| 5 | TS2307 零新增 | 双仓 tsc 全绿（零 TS2307 零其他） |

## 三·回滚锚三形（在位）

| 形 | 锚 |
|---|---|
| kit 独立 commit | **16acbf4**（首 commit·revert 形） |
| dist bak | TriRLC `dist-bak-pre-c5-20261121T040513Z` / TriMLC `…040515Z` |
| 源码 bak | 8 薄壳文件 `.bak-c5`（两仓各·未跟踪）+ 两仓 commit（01e0997/b138e30 可 revert） |

**零部署恪守**：三仓 dist 均未 rebuild 为运行位（kit build=类型面产物·两仓运行 dist 零触）——生效绑部署窗。

## 四·process 如实档（三笔）

1. **清点缺口**：单文件清点漏目录依赖（session-store/sync 各 3-4 实现文件）→补迁 7 文件——**「目录级件须全展开」教训**（C4 单点现勘教训的目录版·入 SOP）；
2. **替换破坏一笔**：`TriMMC`→中性替换时误伤标识符 `syncSessionToTriMMC`→`syncSessionToservice domain`（语法错 1 处+类型引用 1 处）→精确修复——**教训：全局名称替换须先保护标识符内嵌面**（正则词边界/先行符号重命名）；
3. compact 首迁漏 trimodel 依赖→devDep 补齐（同 kit 形）。

## 五·使用依据

COO 逐件窗位令+CTO 包名裁/symbol 裁/清点卷终审+清点卷 88ed64644+三组迁移脚本读数+两仓 tsc/test（RLC 733 全绿·MLC 864/5 含 HEAD~1 硬证）+活体探+commit 读数（16acbf4/01e0997/b138e30）。

---
落卷=FSD 小全（m-fsd）·C5 毕报（12:14+8）·**next_agent=COO+CTO+STE**·三组全迁·回归五判据全过·5 fail 全既有硬证·回滚锚三形·零部署恪守·process 三笔如实

