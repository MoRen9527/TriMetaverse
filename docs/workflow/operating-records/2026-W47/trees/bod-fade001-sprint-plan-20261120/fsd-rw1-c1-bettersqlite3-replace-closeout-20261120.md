# FSD 毕报·RW1 窗C C-1 码面段（TriMMC 571139c·node:sqlite→better-sqlite3 A1 同形替换·零活体触）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T08:08:17Z（date 现查粘贴·+8=11-20 16:08·D-47 正形）
- 令面: COO §二十窗C 统排令（3a84346be8·台账 671·C-1 即派）+COO 毕报增补知会（15:55 直达·四件+探针配方承带·台账 673/f1002d4422）
- 交付锚: **TriMMC dev 571139c**（b2852cf..571139c·5 files +445/-13·sg 通道 push 达仓·ls-remote 顶==local 571139c6ec2c 全等 ✓）
- **next_agent=COO**（毕报承带→派值席窗 sg install+build 读数回执→转 CTO 窗C-2 开窗判据逐项对表）

## 一·实现方案（A1 同形替换·CTO 三方案卷 §三正身执行）

- **替换面收敛勘定**：node:sqlite 符号 src 面 5 行（store.ts L12 import+L212 类型注+L267 构造；types.ts L7 type import+L133 FadeDatabase 别名）——"30 处引用"=API 调用面 45 处（prepare 16/exec 10/run 8/all 6/get 4/close 1）**全为 better-sqlite3 同形家族零改**（PRAGMA 走 db.exec 兼容·零 backup/transaction() 专用 API）。
- **替换映射形**：`import Database from "better-sqlite3"`（esModuleInterop=true 在卷 ✓）+`new Database(dbPath)`+类型 `Database.Database`（namespace 实例型）·types.ts `import type Database`+`FadeDatabase = Database.Database`。
- **test 面外扩（CTO 卷字面 2 文件外·如实注）**：fade-driver.test.ts 4 处同形替换（L21 import+L53/L66/L187 fixture 构造）——理由：sg 18.20.8 零 node:sqlite+engines 回落 18 候选下 test 残留 22 依赖=矛盾面；契约回归门禁全绿必要面（tsx 运行时真加载）。
- **engines 本笔不动**：维持 b2852cf `">=22.5.0"`——终形回落候选随 §六 候 CTO 裁（增补④两分支清单）。

## 二·现查链与版本选型（增补③承带）

1. **engines 数字核实**：node:sqlite 引入版=**Node 22.5.0**（2024-07·实验性·官方 docs v22.5.1+InfoWorld 多源）——b2852cf `">=22.5.0"` 数字**正确**·存疑注解除。
2. **better-sqlite3 版本分叉事实**（npm view 现查）：**13.2.0（latest）engines=`>=22`·12.x=`20.x||22.x||23.x||24.x||25.x||26.x`——均不含 node 18**；**11.10.0（11 系末版）无 engines 声明+prebuilt 覆盖 node 18/ABI 108**（GitHub releases+多方源）——sg 18.20.8 唯一可装载主版本=11.x。
3. **选型**：deps `"better-sqlite3": "^11.10.0"`（C-2 sg 装载可行性硬约束）·devDeps `"@types/better-sqlite3": "^9.6.0"`（latest 现查）·**13.2.0 升版候 B 方案（sg node 22 LTS）后窗**——分叉事实全摆·终裁归 CTO。
4. **better-sqlite3 自身 engines 读数**：11.10.0 无声明（npm view 空）·12.0.0 起=`20.x || 22.x || 23.x || 24.x`·13.2.0=`>=22`。
5. **A1 后码面 18 兼容性勘定结论**：TriMMC src 内建模块族全谱勘定（grep `from "node:"`）=fs/path/url/crypto/child_process——**全 18 现役 API 零 22 系专属**；node:sqlite=唯一 22 系依赖·A1 后已除——**码面 18 兼容全绿·命中 CTO 判据卷分支 A**（详见 §六）。

## 三·代码变更清单

| 件 | 面 |
|---|---|
| src/fade/store.ts | 3 行：L12 `import Database from "better-sqlite3"`·L212 `db: Database.Database`·L267 `new Database(dbPath)` |
| src/fade/types.ts | 2 行：L7 `import type Database`·L133 `FadeDatabase = Database.Database` |
| test/fade-driver.test.ts | 4 处同形（import+3 fixture 构造） |
| package.json | deps +`"better-sqlite3": "^11.10.0"`·devDeps +`"@types/better-sqlite3": "^9.6.0"`·engines 维持不动 |
| package-lock.json | +434/-4（两包安装树·install rc=0） |

## 四·自测结果（门禁读数全项·全实跑非推演）

1. **install**：rc=0·native binding 落位（`node_modules/better-sqlite3/build/Release/better_sqlite3.node`）。
2. **载入+功能值面探针**（本机）：LOAD_OK·WAL PRAGMA 走 exec·prepare/run/get 回读闭环 ✓。
3. **check**：`tsc --noEmit` rc=0——strict 面 `stmt.get()` unknown 风险**未命中**（消费面类型兼容·零补 cast 需求）。
4. **build**：rc=0·dist 值面断言——store.js better-sqlite3 命中 1+**node:sqlite 零残留**·types.js 纯类型擦除零 import 面 ✓（本机 dist 旧残留随本笔刷新）。
5. **全量 test 对比基线**（替换前基线先勘）：729 tests/697 pass/**31 fail**/1 skip——替换后四读数**逐数全等**；fail 序号集合机械 diff **全等**（35,43,63,86,87,88,89,90,108,109,110,111,112,143 两轮一字不差·零新增红零消失红）。
6. **既有 31 fail 逐族归因**（全量回报纪律）：E2E Real model 族 4（真模型 API 依赖）+server 端点族 7（agent SSE/chat+internal/v1/agent 五案）+Contract Resolver/Employee Registry 真源依赖 2+echo 出向队列 1（含 subtest 展开计 31）——**fade-driver/node:sqlite 族基线零红→替换后 8/8 绿**·既有族=本机环境依赖面维持挂账·与 A1 替换面零涉。
7. **零活体触自证**：全变更=文件面+node_modules 面·零进程触零 restart——TriMMC 活体=sg 8712 pid 1816473 unit 托管态·本机零涉 ✓。

## 五·sg 面现势与值席窗任务书（增补①②承带）

**sg 只读勘定四读数**（本席 SSH fleet@M-SG 只读·/srv/fleet/TriMMC·node v18.20.8）：
1. 检出顶=**b2852cf**（C-1 笔 571139c 在 sg bare 候 pull·push 验真双证在卷）。
2. dirty 面=10 全 untracked（daemon.log+旧 dist-bak 三目录先例锚+echo/notify ledger 面+一个 .bak）——**零 tracked 码面 dirty·pull 快进零阻塞**。
3. **node_modules/better-sqlite3@11.10.0 恰已在位+binding 存在+载入功能探针绿**（SG_LOAD_OK·roundtrip 回读 ✓）——**sg 双实锚①成立**（版本与 deps 锁版全等·载入实证）。
4. 旧 dist/src/fade/store.js 在位（node:sqlite 形·G1 旧 dist 备份锚可立）。

**值席窗任务书**（增补②"双实锚"之 sg build 实锚②+增补①"sg 面 build 全绿"·写面非本席执行域·候 COO 统排派窗）：
- 工序：`cd /srv/fleet/TriMMC && git pull`（571139c 快进）→**旧 dist 备份锚**（`cp -a dist dist.bak-preC1-$(date -u +%Y%m%dT%H%M%SZ)`·G1 硬项）→`npm install`（rc+install 日志 prebuilt/编译面承录）→`npm run build`（rc=0 承录）→dist 值面断言（`grep -c "node:sqlite" dist/src/fade/store.js`==0+better-sqlite3 命中 1）。
- **零活体触实证随窗**：build 覆盖 dist 文件零影响勘定链=ESM 静态 import 启动全载（运行中进程零文件读）+TriMMC cron 0 jobs 零 spawn 面（残面挂账在卷）——值席 build 前后各拍活体三读数（pid 1816473 不变+/healthz 200/版本面）实证锚。
- 值席毕报回执→G1 硬项（sg node_modules 双实锚+旧 dist 备份锚）成立→CTO 窗C-2 判据对表。

## 六·engines 终形两分支候选清单（增补④承带）

- **分支 A（现勘命中）**：A1 后码面 18 兼容全绿（§二.5 勘定：唯一 22 系依赖已除+内建模块族全 18 现役+better-sqlite3@11.10.0 无 engines 声明 sg 18 载入实证）→**候选=engines 回落 `">=18.20.0"` 精确形=债真清**（sg 现役 18.20.8 满足）。
- **分支 B（现勘未命中）**：尚存其他 22 系 API 面则维持 22.5=债半清（sg node 22 LTS 回位候排）——现勘零命中（如 CTO 验收复勘出则随裁）。
- **回落动作候 CTO 裁**（本笔不动 engines）——若裁回落：一行勘正笔随 C-2 前或另窗·kit（TriOrchKit）engines>=20 声明差=kit 仓候勘项不在本窗。

## 七·G3 探⑤ store 功能值面探针配方（C-2 装载段六探复验消费·本机 dist 面已自证全绿）

```bash
cd /srv/fleet/TriMMC   # C-2 装载段新 dist 后执行
node --input-type=module -e "
import { createFadeStore } from './dist/src/fade/store.js';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir = mkdtempSync(join(tmpdir(), 'fade-probe-'));
const store = createFadeStore(join(dir, 'probe.db'));
const tables = store.db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'fade_%' ORDER BY name\").all().map(r => r.name);
const expect = ['fade_gate_rejections','fade_run_transitions','fade_runs','fade_watch_audit','fade_watch_state'];
console.log('T5_OK=' + (JSON.stringify(tables) === JSON.stringify(expect)));
const { created, run } = store.createRun({ runId: 'probe-run-1', idempotencyKey: 'probe-idem-1', profile: 'runtime-owned-durable', homeDomain: 'probe', writeAuthority: 'probe-fsd', authorityEpoch: 1, version: 'probe-v1' });
console.log('CREATE_OK=' + created + ' state=' + run.state);
const advanced = store.advanceRun('probe-run-1', 'QUALIFYING', { actor: 'segment-advance', reason: 'c1 probe' });
console.log('ADVANCE_OK state=' + advanced.state + ' transitions=' + store.listTransitions('probe-run-1').length);
store.close();
console.log('PROBE_ALL_GREEN');
"
```
- 过门锚=四行读数全绿（T5_OK=true/CREATE_OK=true state=DETECTED/ADVANCE_OK state=QUALIFYING transitions=2/PROBE_ALL_GREEN）。
- 本机自证实锚（16:0x 拍·dist 571139c 面）：**四行全绿** ✓。
- actor 契约注：DETECTED→QUALIFYING=actor `segment-advance`（register 仅初始注册转移·首跑误用 register 被 FadeTransitionError 拒·勘正后绿——配方已修正形承带）。

## 八·技术债务标记

1. **sg 面 build 实锚候值席窗**：增补①/②之 sg 侧余项（pull+备份锚+install+build+值面断言）——任务书承带 §五·值席毕报回执后 G1 硬项闭合。
2. **TriMMC github 通道欠账**：571139c github 面 Connection reset（443 断窗族）——候窗并批照纪律（sg 通道有效零阻塞）。
3. **engines 回落候裁**：§六分支 A 候选挂裁面（CTO）——本笔维持 22.5.0 语义注：sg 18 装载 npm engines warning（engine-strict=false 不阻装·运行时零 engines 检查）——回落毕=语义债清。
4. **既有 31 fail 族**：§四.6 归因维持挂账（真模型 API+server 端点活体依赖面·非本窗引入非本窗修）。
5. **better-sqlite3 升版候窗**：11.10.0=sg 18 兼容窗口选型——13.2.0（latest·engines>=22）升版候 B 方案（sg node 22 LTS）后窗·分叉事实 §二.2 在卷。
6. **strict 面注**：@types/better-sqlite3 `stmt.get()` 返回 unknown 与 node:sqlite 松散返回差=理论风险面——check rc=0 实证消费面零命中·零 cast 需求（如实注非隐瞒）。

## 九·使用依据

- COO §二十窗C 统排令（3a84346be8·台账 671）+COO 毕报增补知会（15:55 直达·四件+探针配方+台账 673 f1002d4422）
- CTO 三方案卷 §三（cto-three-plan-volumes-20261120.md·A1 规格）+CTO 窗C-2 开窗判据卷（575720b06·G1 五硬项/G3 探⑤）
- CTO 431a85a1 定性卷（4917ba16f·8712 双因链）+b2852cf engines 勘正笔（本席前笔）
- 现查三源：Node v22.5.1 官方 docs+InfoWorld（node:sqlite=22.5.0）·npm view（better-sqlite3/@types 版本与 engines）·GitHub WiseLibs releases（11.10.0 prebuilt ABI108）
- 本卷读数=实跑非推演（npm view/WebSearch/install/check/build/test 全量两轮+SSH sg 只读三拍+探针双机·现查 07:5x-08:08Z）

---
落卷=FSD 小全（m-fsd）·C-1 码面段毕（16:08+8）·**next_agent=COO**（值席窗 sg install+build 派窗→读数回执→转 CTO 窗C-2 判据对表→放行令）·零活体触维持（pid 1816473 零触）·engines 债根治链=C-2 毕=债清（分支 A 候选在卷）
