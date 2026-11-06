# STE 毕报 · 债单#1 flake 族两套件治理毕（pidfile-flow+init-confirm）

- **seat**：STE（小柯·m-ste）
- **令源**：COO 派工单（11-06 11:59:40Z+08）——施工对象=债 1 flake 族两套件并入现役测试线·护栏=现役测试线零触碰·基线参照=TriRLC 89a8768+c3f76c0 双交付锚
- **债单正身**：form3 树 `fsd-n7n8-completion-report.md` §四 #1（候 STE 合并勘·N2 窗在案延续）——本卷即销项执行卷
- **写前现查**：`2026-11-06T13:15:45Z`（date 现查原值·卷面时戳=commit %cI 零手写预填·D-47）

## §一 · 交付锚

| 项 | 读数 |
|---|---|
| 交付锚 | TriRLC `75f2e29a254d89c53fd9c0706a76595d8febdb7c`（dev·基线 c3f76c0 之上单笔） |
| sg bare 推达 | `git push sg-server dev` c3f76c0..75f2e29 验真平（ls-remote 顶==commit hash） |
| revert 锚 | 单 commit 独立 revert 即回（2 文件 34+/9-） |
| 护栏对表 | src/ 零触碰✓·package.json 零触碰✓·其余 131 测试文件零触碰✓·不加自动重试（不为绿而绿）✓ |

## §二 · 根因定性（静态实锚+历史三窗实证·复现采样未中如实注）

**两套件=「单跑绿·全量并发跑红」并发时序 flake 族**——历史三窗在案实证：β-2 窗 8729895（pidfile 单跑三绿）·β-3 窗 046a1b2（init-confirm 3 败单跑 21/21 全绿·pidfile 同族）·N7 窗 725/726（pidfile-flow 败案 duration 19920ms）。

| 套件 | 根因面（源码实锚） | 形态吻合 |
|---|---|---|
| pidfile-flow | ①硬编码口 18731/18732（残留占口=确定性失败族）②三段紧超时 waitFor 10s/waitExit 8s/CLI stop 15s——全量并发窗（8 核 node --test 并发+tsx 子进程冷启动挤压）启动超限→假红 | 败案 19920ms≈2×waitFor 超时串联·强吻合 |
| init-confirm | buildDeps 注入 `timeoutMs: 500` → fetchRemoteSyncStatus → init-sync.ts L664-667 `AbortSignal.timeout(timeoutMs)`——负载窗回环桩响应偶发 >500ms→fetch 抛→degraded→断言红 | β-3 窗 3 败=依赖 remote=='ok'/l1 ok 的案·吻合。防重入案排除（互斥 check-then-set 在首个 await 前同步段·单线程语义结构稳定） |

**本窗采样如实注**：全量 833 锚形态正形（npm test·cmd+node glob 自展开）×4 轮 733/733 全绿（23-36s）+负载模拟窗（7 node 空转进程背景）两套件 23/23 全绿——**复现未命中**（历史=跨多窗低频间歇）。治理按已实锚根因面做容限化+去冲突，不待复现。

**采样口径教训记档**：Git Bash globstar 关闭会把 `test/**/*.test.ts` 退化单层（140 tests 漏 integration 子目录）——flake 采样必须照在跑面正形（npm test）。

## §三 · 治理改动（容限化+去冲突·语义不变）

1. **pidfile-flow.test.ts**：硬编码口→`freePort()` 探口派发（net listen(0)·TOCTOU 窗竞态远低于确定性占口）；waitFor 10000→30000+waitExit 8000→30000+CLI stop 15000→60000（负载窗裕度·断言语义零变——真缺陷照红只是等更久）。
2. **init-confirm.test.ts**：`timeoutMs: 500→2000`（回环桩正常 <50ms·2000=40x 容限；降级路径断言语义不变——真 degraded 案照红）。

**不选方案如实注**：自动重试（node:test retry）=掩盖问题反模式·不选；--test-concurrency 限流/拆线=动现役测试线入口（package.json）·超护栏·不选。

## §四 · 验证读数（全链四层）

| 门 | 读数 |
|---|---|
| 类型门 | `npm run check` RC=0 零输出 |
| 套件门 | 两套件单跑×3=23/23 全绿（2.5s/轮·探口成本可忽略） |
| 全量回归 | ×2=**733/733 RC=0**（26-28s·零回归·与基线锚同谱） |
| 负载模拟 | 7 空转进程背景两套件 23/23 全绿 |

## §五 · 残余风险与候窗面

- **负载裕度非无限**：30s/60s/2000ms 容限覆盖历史三窗形态量级；极端负载窗（>30s tsx 冷启动）仍可假红——概率再降一档·如实注。若后续窗口再中败案（duration>30s 形态），候 CTO 面：集成面拆独立测试线（入 automation-backlog 评估口·本窗不立项）。
- **github push** 候网络窗（债单 #2 在案延续·sg bare 保险线已平·非本窗即办）。
- 复现采样零命中=根因定性的历史实证依赖（三窗形态+源码静态实锚双柱）——置信度标注如实：**根因面强锚·复发概率预估降一档·非零**。

## §六 · 使用依据

- COO 派工单（11-06）·债单正身=form3 树 fsd-n7n8-completion-report.md §四 #1
- 历史实证锚：TriRLC 8729895（β-2）·046a1b2（β-3）·N7 窗 725/726（FSD 毕报 §一实录 3）
- 源码实锚：test/integration/pidfile-flow.test.ts·test/init-confirm.test.ts·src/company/init-confirm.ts L260-261（互斥）·src/company/init-sync.ts L664-667（超时消费）
- 验证读数：本席本窗活体现采（tsc/单跑×3/全量×2/负载模拟）

—— STE 小柯（毕报随毕随报 COO·督办 fan-in COS→BOD）
