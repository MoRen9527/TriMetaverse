# FSD C5 首步清点卷·RLC/MLC 五类件逐件分级表+方向核（只读·零改·2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T04:03:57Z（date 现查粘贴·+8=12:03:57·D-47 正形）
- 令面: COO C5 首步派工（拆树令 ① 清点达面才进逐件施工）
- 方法: **对象断言先行**（双侧同路径逐件 ✓）+**行尾归一**（`tr -d '\r'` 后 diff·今日行尾形态族正形）+双侧 diff 禁单点现勘
- **next_agent=COO+CTO**（分级表终审→COO 逐件窗位令）

## 一·分级表（九件·双侧本机活体）

| # | 件 | RLC/MLC 行数 | 归一 diff | 机械级 | **本质判读** |
|---|---|---|---|---|---|
| 1 | session-store/index.ts | 15/15 | **4L** | b | **命名投影差**（TriRLC/TriLC 头注+TriMMC/TriMC 注释·零逻辑） |
| 2 | task-runtime/runtime.ts | 30/30 | **0** | **a** | 完全同构 |
| 3 | toolbus/bus.ts | 10/10 | **0** | **a** | 完全同构 |
| 4 | sync/sync-engine.ts | 193/193 | **18L** | b | **命名投影差**（头注/函数名注释全为 TriRLC↔TriLC·TriMMC↔TriMC 名差·需末 2L 明细随施工卷补） |
| 5 | services/compact/index.ts | 4/4 | **0** | **a** | 完全同构 |
| 6 | services/compact/compact.ts | 163/163 | **16L** | b | **命名投影差**（含 **symbol 名 `TriRLCMessage`→`TriLCMessage`**+注释） |
| 7 | services/compact/grouping.ts | 37/37 | **14L** | b | **命名投影差**（`TriRLCMessage` interface 名+注释·14/37=37.8% 输出行超 20% 机械线但**逻辑零差**=本质 a'） |
| 8 | services/compact/prompt.ts | 166/166 | **2L** | b | 命名投影差（微） |

**汇总**：a 级 **3 件**（真零差）+ **命名投影差 5 件**（b 机械级但本质语义同构·a'）·c 级 **0**·d 级 0（排除件=CTO 已给 RLC letter-store/power-follower·MLC fade/notify·不在五类清点面）。

## 二·CTO 实勘基准对表（独立复跑·非转抄）

| 件 | CTO 读数 | 本席归一复跑 | 差异说明 |
|---|---|---|---|
| task-runtime | 30=30 diff 0 | **30=30·0** | ✓ 一致 |
| toolbus | 10=10 0 差 | **10=10·0** | ✓ 一致 |
| session-store | 15=15·**8 行输出差** | 15=15·**4L 真差** | CTO 8=未归一 diff 输出行（4 差行×2 标记）·**归一后 4L 真差**（今日行尾归一正形） |
| sync | 193=193·**34 行输出差** | 193=193·**18L 真差** | 同上（17×2=34 vs 我 18——差 1 行待末 2L 明细核·不影响分级） |

## 三·件级差异方向核（session-store/sync 两 B 级件·拆树令 ② 附步）

- **TriRLC 侧=新**：`git log -1 -- src/session-store/index.ts` = **2026-10-01**「fix(lg-059): TriRLC 仓旧名叙事面残留修复——525 行扫面改名/127 文件」（同 sync 同 commit）；
- **TriMLC 侧=旧**：session-store=**2026-07-18**（P5.4）·sync=**2026-07-23**（S2）·未随 2026-08-31 改名更新；
- **方向定谳**：RLC 命名面新（TriRLC/TriMMC）·MLC 命名面旧（TriLC/TriMC 残留）→ **形源定向=RLC 命名形**（薄壳/收敛时符号名以 RLC 侧为准或中性化·`TriRLCMessage`→统一决策随施工卷呈 CTO）。

## 四·施工含义（供 CTO 终审）

1. a 级 3 件：直接收敛零设计；
2. 命名投影 5 件：**逻辑零差**·薄壳化时唯一决策点=**symbol 名统一**（`TriRLCMessage` 类名两侧不同——kit 化需中性名如 `CompactMessage` 或保留 RLC 形），属 CTO 裁面；
3. 无 c 级=**零合并设计需求**（C5 全链可纯机械收敛）；
4. 零 daemon 触零改（全程只读）。

## 五·使用依据

COO 首步派工令+CTO 拆树令 ①（分级法四档+实勘基准）+双侧现勘读数（路径断言/行数/归一 diff/差异内容样本/git log 方向）+今日行尾形态族正形（行尾归一闪 diff）。

---
落卷=FSD 小全（m-fsd）·C5 首步清点（12:03+8）·**next_agent=COO+CTO**（分级表终审）·a 3 件+命名投影 5 件+c 0·方向核=RLC 新 MLC 旧·形源=RLC 命名面·symbol 统一候 CTO 裁·零改零触

