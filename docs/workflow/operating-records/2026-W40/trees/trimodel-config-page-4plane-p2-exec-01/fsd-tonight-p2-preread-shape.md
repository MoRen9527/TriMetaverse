# FSD·今夜 P2 三件预读定形卷（0:00 开工前预读产出·不施工）

- sourceOfTruth: 本件（FSD 预读卷；令源=COO 23:15 转 BOD 23:11 夜窗令——今夜 0:00-9:00 施工 P2 三件，序不变：件D 五行→件A 双修→件C 两案；23:5x 前可预读定形不施工）
- syncMode: working
- lastSyncedAt: 2026-09-29T15:5xZ（date 待 0:00 现查刷新）
- 施工席: FSD 小全（m-fsd）

## 一、件A 挂点全锚（e9/e10/e12 实读）

**根因统一**：P2 单页架构下策略卡元素全在 `#panel-strategy`（ui/index.html L186，`hidden` 缺省）内；旧测试 `page.goto` 后直接 fill/click `#tc-*` 选择器——Playwright fill/click 要求元素可见 → 挂。**非 id 消失**（#tc-conn 在 L193 在位）。

| 文件 | 挂点 | 修法 |
| --- | --- | --- |
| ui-e9-seam.test.ts | L96 `fill('#tc-conn')`（连接保存后直做） | fill 前插切视图 |
| ui-e10-reload.test.ts | L85 `fill('#tc-conn')`（L82 waitForFunction 只查 DOM 存在不查可见性，故 conn 阶段过、此处挂） | 同上；reload 后 L102 `$eval` 不要求可见，**无需二次切** |
| ui-e12-strategy-delete.test.ts | withHarness L126 后 fn 内首组 `locator('[data-del]').click()`（C1/C2/C3/C4/C8/C9/C10a/C11 八案；C6=jsdom 无可见性概念、C10b=API 直打，两案不受影响） | withHarness conn 后插一次（覆盖 fn 首编辑面）+ **C2 第二轮编辑前（L180 click 丙）再插一次**（reload 后 panel 复 hidden）；其余案 reload 后仅 waitForFunction/$$eval/readFile，无需切 |

**幂等 helper（各文件顶置或内联）**——防 menu-btn 为 toggle 语义下二次点击反关面板：
```ts
async function gotoStrategy(page: Page): Promise<void> {
  const hidden = await page.$eval('#panel-strategy', (el) => (el as HTMLElement).hidden).catch(() => true);
  if (!hidden) return;
  await page.click('#page-menu .menu-btn[data-view="strategy"]');
  await page.waitForFunction(() => !(document.querySelector('#panel-strategy') as HTMLElement | null)?.hidden, undefined, { timeout: 8000 });
}
```
- 先例=ui.e2e.gate.test.ts L153-156（无幂等前置；本 helper 加 hidden 预查）。
- E0 对照钩（TRIMODEL_UI_E2E_HTML 历史态 HTML）兼容性：helper 对「panel 不存在」catch 后 return——历史态若结构不同则修复不生效属可归因新差异，E0 窗候用时候 STE 注意；默认=现势 HTML 不受影响。

**teardown 三件套（CTO 21fe08d6 §六.4，e9/e10/e12 三文件同套升级）**：
```ts
let timedOut = false;
const proc = browser.process?.();               // chromium.launch 返回体带 process()
try {
  await Promise.race([
    browser.close().catch(() => {}),
    new Promise((r) => setTimeout(() => { timedOut = true; r(null); }, 15000)),
  ]);
  if (timedOut && proc?.pid) {
    await new Promise((r) => setTimeout(r, 100));
    execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: 'ignore' });   // 强杀进程树兜底
  } catch { /* after-hook 吞错防遮蔽原断言 */ }
} finally {
  if (server) {
    (server as import('node:http').Server).closeAllConnections?.();      // node 18.2+；keep-alive 挂连接是 server.close 挂起主因
    await Promise.race([new Promise<void>((r) => server.close(() => r())), new Promise((r) => setTimeout(r, 5000))]);
  }
  rmSync(dir, { recursive: true, force: true });
}
```
- 零挂全量跑=clean-readout 前提（CTO 裁卷原文）；server.close 挂起面=keep-alive 连接未断，`closeAllConnections` 先行。
- finally 整体 try/catch 防 teardown 异常遮蔽原断言错误（读数保真）。

## 二、件C 落点与两案形状（定形，施工时按 src/api 实签微调）

- **落点=新独立文件** `test/ui-e13-4plane-truechain.test.ts`（不动 gate test 既有 E1-E8/W1-W5 结构；自足 createServer 零重启——CTO R3 6bf7a596 原文）。
- 案1 true chain：createServer 挂真 GET `/v1/config/cards/<face>?view=managed` handler（src/api cards 族 3e6ab37 实签施工时读）+ `TRIMODEL_ADMIN_TOKEN` env + UI `#adminToken` 注入同值 → boot → loadFaceCards 四 face 拉取 → 断言：请求带 auth 头（server 侧记录）+200 parse+四卡 cf-badge 三态呈现。
- 案2 wrong token：UI 注错值 → 401 → 诚实 failed 态呈现断言（不静默装成功）。
- 判据=LG-035 R3 原文；token 值不入断言/日志（len/前缀指纹纪律）。

## 三、件D 五行（CPO cf574b6e 定稿，已锚定）

ui/index.html：L189「LG-035 面」→「过渡期形态」（保留括注）；L404 nav title 同替；L358 删「（PUT 卡面）」括注+「本 face 卡文件现役=LG-035 策略卡过渡位（trimmc-card.json）」→「本卡配置文件现役=策略卡过渡位」；L89/L91 placeholder 属性整删。零测试碰撞（placeholder 命中皆 anthropic-proxy cc-placeholder 语义无关）。

## 三a、件C 实签预读增补（23:5x，config-cards.ts 全文读毕）

- handler 正身：`handleGetConfigCard(authHeader: string|undefined, face: string, search: string, origin?: {remoteAddress?})` → `{statusCode, body}`；managed 视图=requireAdmin（`Bearer ${TRIMODEL_ADMIN_TOKEN}`，未配置=503 fail-closed / 不匹配=401）→ 委托 handleGetTrimmcCard(faceCardPath(face)) → 200 分支 body 扩展 `{face, ledger}`。
- face 守卫：`isRegisteredFace`/`FACES`（card-faces.ts L29）——**四 face=mmc/mlc/rmc/rlc 已锚**（FaceId=keyof FACES）；案1 即此四 face×managed 拉取断言。
- 案1 断言面：server 侧记录 authHeader（带 Bearer 前缀+len 指纹，值不落日志）+四 face 各 200+`body.face` 回显+`body.ledger` 在+UI 侧 cf-badge 渲染（UI loadFaceCards fetch 面施工时读 ui/ js 定断言 id）。
- 案2：错值 token → requireAdmin 401 → UI 诚实 failed 态（不静默装成功）。

## 四、明晨批定界（CTO 23:5x 候裁点·COO 转达）

- 8713 **暂不迁 ENV_FILE**——维持现役 channel 提取形态（今夜守望+F-2 已连吃两变更窗，三变更一窗回归面不放大；收益纯运维美学）。远期搭车：TriMLC watchdog 上线随迁，不专窗。
- 明晨批=8711 侧 ENV_FILE 正形（独立 ENV_FILE + launcher 读→注 + token 不入脚本/仓 + ACL 当前用户）+ watchdog→new launcher + 身份无关活体 + F-2 修面复核；8713 侧仅 allowlist 已生效面确认。

## 使用依据

- BOD 23:11 夜窗令（COO 23:15 转）+ CTO teardown 裁卷 21fe08d6 + CTO R3 6bf7a596
- CPO 件D 定稿 cf574b6e（COO 12:09 转）+ G2① f4407426
- 实读：ui-e9-seam.test.ts / ui-e10-reload.test.ts / ui-e12-strategy-delete.test.ts 全文 + ui.e2e.gate.test.ts L84-160 + ui/index.html L89/L91/L186/L189/L193/L358/L404
- CTO 8713 定界（COO 23:50 转达）
