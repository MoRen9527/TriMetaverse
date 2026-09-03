# LG-022 余量小项：TriMMC CLI docker/.env 兜底读取 bug——修复案（case 包）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-022-cli-dotenv-fallback-case.md
- syncMode: source-only
- lastSyncedAt: 2026-09-03
- 性质：LG-022 余量小项 case 包（准备面，D-15 路由 CTO→FD；候 CTO 裁修法后派 FD）
- 优先级：低（显式 env 为稳路径；仅影响无 env 裸跑场景）

## 一、症状（LG-022 验收实测 09-01）

- sg `/srv/fleet/TriMC` `node dist/src/cli.js` cron list 时，显式 env 注入 `TRIMC_INTERNAL_TOKEN` 后**全通**；不注入仅靠 docker/.env 兜底时**报未配置**（HINT 文案+401）——「docker/.env 兜底读取路径未命中（cwd 在仓根仍报未配置）」。

## 二、根因定谳（2026-09-03 源码实读）

- 落点：`TriMMC/src/internal-token.ts:33`（LG-012 模块）：
  ```ts
  const envFile = fileURLToPath(new URL('../docker/.env', import.meta.url));
  ```
- 模块相对路径推导：
  - **src 面**（tsx 直跑）：`src/internal-token.ts` → `../docker/.env` = **仓根 `docker/.env`** → 命中 ✓（LG-012 冒烟「tsx 跑」路径）。
  - **dist 面**（生产形态 `node dist/src/cli.js`）：`dist/src/cli.js` → `../docker/.env` = **`dist/docker/.env`**（构建产物目录无 docker/ 子目录）→ readFileSync 抛错→catch→undefined ✗。
- **定性：dist 形态下模块相对路径偏移**（dist 目录布局与 src 不同构）；LG-012 验收走显式 env 未踩兜底路径（验收盲区），LG-022 余量在册正确。
- 注记：HINT 文案「<TriMC 仓>/docker/.env」语义正确，但实现只在 src 形态达成——文案 vs 实盘偏差。

## 三、修法三案

| 案 | 修法 | 评价 |
| --- | --- | --- |
| A. cwd 探测链兜底 | resolveInternalToken 在模块相对失败后，追加 `process.cwd()`（及其父链≤3 层）探测合并队；命中 `docker/.env` 即用 | **推荐**（sg 常规=仓根 cwd，最小改动；失败依赖=无） |
| B. dist 构建拷贝 | dist 构建步骤复制 docker/.env 至 dist/docker/ | 不推荐（.env 不在构建源、随构建分发凭证；语义恶心） |
| C. 只修文档/HINT | 明示「dist 形态须显式 env」 | 实测已有；治标不治本（兜底存在=语义承诺） |

**推荐：A 案**（cwd/父链探测 + 保序 env→模块相对→cwd；零行为变化=三链失败仍 undefined）；补一条测试：`resolveInternalToken` 无 env+无模块相对情形下 cwd 命中。

## 四、验收口径（若采 A）

1. src 直跑 cwd=仓根：兜底命中（现有行为保持）。
2. dist 直跑 cwd=仓根：兜底命中（**本次修复主验**）。
3. dist 直跑 cwd=任意位置+env 注入：env 优先（LG-012 行为不变）。
4. dist 直跑 cwd=任意位置+无 env+无兜底：undefined→后续 401+HINT（行为同旧）。
5. 重构测试：内部单测 + `node --check`。

## 五、归属与路径

- 修法裁决=CTO（D-15）；实施派=FD；测试旁观=ST（可选小验）。
- 候裁点：A/B/C 案裁决+测试面是否需要 ST 复验。
