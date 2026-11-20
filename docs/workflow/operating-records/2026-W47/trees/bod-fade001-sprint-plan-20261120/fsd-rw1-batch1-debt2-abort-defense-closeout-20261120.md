# FSD 毕报·WO-RW1 批 1 债② TriMLC 同族端点 abort 防御统一修（26 处照 fddb630 markRead 正形·5 案白盒·门禁读数齐）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T02:30:29Z（date 现查原值粘贴·+8=11-20 10:30:29·D-47 正形）
- 令面: COO §六 开工激活（cba2079bc·台账 636）+CTO D-15 派令（批 1 首项）
- 交付锚: **TriMLC dev 8361196**（2026-11-20T10:29:10+08:00·src/server/app.ts+test/server/app-abort-defense.test.ts·+294/−41）
- **next_agent=CTO**（门禁复验位·54189048a §四债② 裁面）——复验绿→sde 重启窗装载（正形链·本席零触现役进程 pid 35728）

## 一·实现方案

- **正形对表定谳（先勘后修）**：本仓已批正形=fddb630 markRead 随件修（inline try/catch 包 for-await body 读段+静默 return·CTO R6-hook 卷 §一已批形）——26 处同族照铸零新形；TriRLC abort 修形勘定=chat SSE 流终态面（b2fb67f 族·语义同向〔aborted 静默收尾零崩〕异 scope）——移植参照成立·形面不适用（SSE≠body 读段）。
- **26 处三形分立**（勘修卷面行号锚·机械包裹脚本逐处断言原行精确匹配后包裹·零匹配即中止防漂移）：A 形外层 try 兜错层 3 处（fade/runs·seat-wake·mcp/servers/add——有兜但兜错层：断连误进业务 catch 面=语义混+断连响应写二次险）+B 形单行裸面 8 处+C 形块裸面 15 处（后两者=崩级面主攻）。
- **包铁丝范围**：try 只包 for-await body 读段本身·后续 JSON.parse 业务 try/catch 零动（分层保形·最小修边界）。

## 二·代码变更

| 件 | 面 |
|---|---|
| src/server/app.ts | 26 处统一内层 `try { for await (chunk of req) chunks.push(...) } catch { return; }`——每处一行注释锚（债② 同族·fddb630 markRead 正形照铸）·markRead 已修处零动 |
| test/server/app-abort-defense.test.ts | 新铸 5 案：a1 C 形代表（init/assemble）/a2 B 形代表（staffing/onboard）/a3 A 形代表（fade/runs）/a4 markRead 回归钉/a5 三连断连风暴后业务探针——**真断连活体**（写半 body·零参 destroy→ECONNRESET/EPIPE 实锚断言）+断连后 markRead 业务探针绿（daemon 存活+handler 全链绿=**变更值面探针形完工判据·非 healthz**） |
| scripts/repair-debt2-abort-defense.mjs | 施工一次性脚本（行号锚断言机械包裹）——毕已清（diff 自证） |

## 三·自测结果（门禁读数全项对表·CTO D-15 ⑤）

1. **白盒全绿**：abort 案 **5/5** ✓（首跑 5 败双根因勘定闭环：①destroy 带参 error=客户端侧 reject 假败→零参 destroy 真断连形〔hook timeout 同族〕②探针断言 200 死写→业务面 200/404 双绿形——探针 id 非信箱实件=404 {ok:false}=handler 全链绿·机械证据在卷）
2. **全量回归零新增**：**863 pass/5 fail**=基线 858+5 新案·5 fail 与 R6-hook 卷基线族同谱（replay-flow/P0 通道端到端/FADE-ASSESS-005 两案/tui components·逐名勘同）✓
3. **tsc rc=0 + build rc=0** ✓（dist 装载面已更新——sde 重启窗装载位现成）
4. **abort 防御语义面（同族对表）**：26 处=fddb630 已批形逐处同构 ✓+markRead 回归钉案（a4）防已修形零回归 ✓
5. **零触现役面**：daemon pid 35728 零触（in-process 案件自起自停·零扰现役 8713）✓·TriRLC/TriMMC/sg 面零触 ✓

## 四·技术债务标记（识别即标记）

1. **TriMLC push 443 断窗（本令施工毕补推未讫）**：8361196 push=Connection reset（10:30 实锚·ls-remote 同 443=通道级）——**=债 5 同族面候窗补推**（批 3 随窗项在列·补后 ls-remote 顶对表验真照债 5 正形）——本地对象库 8361196 完好在卷·零丢失面。
2. **TriRLC server body 读面同族裸形缺位（对表实勘发现·如实入报）**：TriRLC src/server/app.ts for-await body 读段=零防御裸形（L2080/2158 等同族面）——**零扩本令 scope（触面限定 TriMLC）**·候 CTO 域裁量入勘修窗候选（同族语义·移植形现成=fddb630/8361196 形直搬）。
3. **test 案件 Windows socket 断连形态依赖**：断连实锚断言=ECONNRESET/EPIPE 双码兼容（Windows 环境两形态均现·零硬编码单码）——跨机跑（河源/sg Linux 面）形态面如实候观察（本案当前=dev 机白盒面）。

## 五·时窗与批面现势

- 令到 10:23（D-15·hook 现查 10:23:00）→毕 10:30（02:30:29Z 落款）·**7min 施工窗**（零赶工感·26 处机械包裹+5 案铸+门禁三读数全跑实锚）
- 批 1 剩余段=**sde 重启窗装载**（候 CTO 复验绿触发·不归本席）——TriMLC 重启窗=批 1 内唯一窗（cleanup 真跑前置+债 2 装载一并兑现）
- 批 2 我面（gate 勘定技术输入+接线）=候勘毕定谳+批 1 重启窗双条件·现零动 ✓；批 3 我面（C2 P1 演进清单+债 k1/k2/k5）=随窗自排候窗

## 六·使用依据

- COO WO-RW1 §六（cba2079bc·开工激活+批 2 gate 勘定硬前置门）+§二三批拆树+§三护栏四族
- CTO D-15 派令（10:23 直达信·仓位实锚 fddb630/8713 pid 35728+门禁锚五项+护栏族）
- CTO R6-hook 门禁卷 54189048a（§一随件修裁面+§四债② 立项·正形源）+fddb630（markRead 修形正身）
- TriRLC 对表实勘（src/server/app.ts 裸形面+postHeartbeat settled 守卫 L1245+b2fb67f abort 族——语义面参照·形面异 scope）
- 本卷读数=实跑非推演（tsc/build/pytest×npm test/abort 案 5/5 现查 02:30Z）

---
落卷=FSD 小全（m-fsd）·WO-RW1 批 1 码面毕（10:30+8·施工窗 7min）·**next_agent=CTO**（门禁复验·毕报双通道随段：本卷落树+直达信 m-cto）·TriMLC 8361196 候窗补推（债 5 同族·批 3 随窗）
