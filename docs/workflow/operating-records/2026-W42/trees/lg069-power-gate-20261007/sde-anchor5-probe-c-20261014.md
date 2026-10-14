# SDE 毕报卷 · 序6 锚⑤件C 探针（POST 缺 enabled 归一行为值面）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/sde-anchor5-probe-c-20261014.md）
- syncMode: static（毕报留档卷·令源=COO 08:39:27 序6 两段令·段①即做）
- lastSyncedAt: 2026-10-14 08:43:30+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；对象=8713 TriMLC（55e1305 现役面）·毕报=COO（a5cd3167）+CTO（随信）

## 探针设计（10-11 勘验卷预置形照办）

- POST /internal/v1/cron/jobs **缺 enabled 键** payload：name=lg069-anchor5-probe-20261014·schedule={kind:"cron",expr:"0 0 5 1 1 *"}（远未来拍点·建删同窗零触发风险）·command=白名单在册串（scripts/fade/tree-node-patrol.mjs 精确等值）·systemPrompt=探针标记。
- 预期对照：修复前形态=POST 201+enabled=false 静默 disabled（F-3 第三型）；修复后=201+enabled=true。

## 三查门读数（全绿）

| 查 | 断言 | 读数 | 判 |
| --- | --- | --- | --- |
| ① | 201+enabled 归一 | HTTP 201·id=cron_mv7dy9bt_kyr1·**enabled 回读=true** | ✓ |
| ② | next_run_at 值面非空 | 2026-12-31T21:00:00.000Z（=2027-01-01 05:00+08） | ✓ |
| ③ | 删净零残留 | DELETE 200·listJobs 复验 probe 残留无·jobCount 回 13 基线 | ✓ |

- 源码面双锚（探针前随验）：dist/cron/store.js L205 `(input.enabled ?? true) ? 1 : 0` 归一行+L201-204 件C 注记在位（55e1305 现役加载面）；src/cron/types.ts L54-58 `CronJobCreate extends Omit<…,"enabled">` + `enabled?: boolean` 可选形在位。
- 8713 全程在线零停摆（探针零扰动）；锚④停摆链候令态维持未动。

## 使用依据

- COO 序6 两段令（08:39:27·方案稿 §六+§三表格「SDE 预置 POST 探针验收」正形）；10-11 sde-origin-trilc-and-8711-survey-20261011.md 探针预置段
- 活体探针：POST/GET/DELETE /internal/v1/cron/jobs（X-Internal-Token 门·token shell 变量零回显）
- 记忆条：trimmc-mlc-addjob-divergence（F-3 三查=201+next_run 值面+enabled=1）/trilc-cron-command-allowlist-exact-match（白名单精确等值）
