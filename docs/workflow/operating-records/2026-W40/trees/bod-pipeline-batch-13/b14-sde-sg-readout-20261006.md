# b14-core-bump · SDE 面 sg/R-HY 读数卷（四项执行毕）

- sourceOfTruth: 本件（b14 SDE 面执行读数正身；上游=FSD 施工卷 b14-fsd-construction-readout-20261006.md 72239fd3）
- syncMode: static
- lastSyncedAt: 2026-10-06T10:35:00Z（date 现查 18:35+0800 原样粘贴）
- 施工席: SDE 小布（m-sde）；门依据=双签（CTO b2876290+CFO fd74d22f）+FSD 施工毕+checklist BOD 裁复分工四项
- 交付锚: TriCode **d181946**（sg 在役树 checkout 全 sha 对表 d18194616e87a3f877d6730d20561c906afd6b0e）

## 一、sg 面勘验现势（施工前只读盘点）

| 项 | 读数 |
| --- | --- |
| sg TriCode 树 | 顶 a3893ba→checkout d181946（lock M=wave3 期版本字段噪音，历史在途留置未动） |
| **四仓 tricode 链接形态** | **SYMLINK 4/4**（TriModel/TriMMC/TriMLC/TriRLC 全 `../../../TriCode` 活连——FSD 本机同形，免重装预期形态兑现） |
| sg 在役进程 | 3333(pid 2518071)+3334(pid 3681236)+8712(pid 3961889)；8710 已迁 8712（trimmc-port-migration 闭账读数吻合） |
| 备份锚 | `dist.bak-pre-b14core-20261006T101300Z`（旧 result.js sha256 前 16=90027a41f4258750） |

**传导面披露（活连形态设计内传导，如实落卷）**：四仓 symlink 活连+TriCode dist 换版=sg 在役三进程（3333/3334/8712）**下次重启即消费 0.2.1-wave3**（现役进程内存不热加载=当前零行为变更）；新代码已过四道门（FSD 本机四绿+本卷 sg/R-HY 双面 58/58）。R-HY 同理（3333/8712/8710）。**8713 首切点=今晚根治手术重启窗**（CTO 知会 18:1x，术后观察窗加看 healthz/判活三件套读数——本席手术清单已挂此锚）。

## 二、四项执行读数（checklist 分工逐项）

### #1 sg TriCode 防线回归 ✅ 58/58

- `npm run check`（tsc --noEmit）exit 0
- `npm test` 58 套：**tests 58 / pass 58 / fail 0**（1.03s）
- **命令形勘差如实注记**：sg node **v18.20.8**（本机 v22.21.1）——`node --test` glob 参数 v21+ 才支持，`test/**/*.test.ts` 引号形在 v18 报「Could not find」；正形（v18 兼容）=shell 展开 `node --import tsx --test test/*.test.ts test/trimodel-cli/*.test.ts`。TriCode 4 测试文件案数对平：five-gates 11+presets 7+commands-cli 23+digest-chain 17=58 ✓
- **FSD 判读锚补条兑现料**：新 dist `uniqueBackupPath` 3 处实锚+新形态名 `bak-${ts}-${process.pid}-${backupSeq}` grep 命中——唯一性后缀在 dist 值面在位

### #2 sg TriModel 壳族对照 ✅（全量 284 案，组合基线独立定性）

- sg TriModel 树=**161d0ca**（在役回退锚角色，checkout 禁动红线自守——只跑测试面零依赖面变更）
- 全量读数（v18 串行 `--test-concurrency=1` 形）：**tests 284 / pass 262 / fail 5 / skipped 17**（43.8s）
- **与本机基线（344/330/0/14）不可直对照**——组合差双因：①TriModel sha 差（sg 161d0ca 旧 vs 本机新顶）②node 引擎差（v18 vs v22）。sg 读数系**独立组合基线**，非回归判读面
- **fail 5 名单全 UI 族**：ui-boot-connection/ui-boot/ui-e11-reload/ui-fourplane/ui.e2e.gate——与 TriModel 本体逻辑及 tricode 消费面（五门/命令族）零交叠候选，UI 测试族引擎/环境敏感（v18+无 jsdom 链形态差候选）；不阻 tricode bump 判读（tricode 消费面值面锚见 #3）
- **25/25 对照抽验定义源勘无**：TriCode 58 套内无 25 案族（11/7/23/17）——定义源候 FSD 指认；sg 面以全量读数覆盖如实落卷

### #3 四仓 CORE_VERSION 读数 ✅ **5/5=0.2.1-wave3**

ESM 正形探针（`node --input-type=module -e "await import('file://.../result.js')"`——require 形在 ESM 仓必炸，FSD §三.4 勘差采认）：

| 采点 | 读数 |
| --- | --- |
| TriCode 本体 dist | **0.2.1-wave3** |
| TriModel 活连点 | **0.2.1-wave3** |
| TriMMC 活连点 | **0.2.1-wave3** |
| TriMLC 活连点 | **0.2.1-wave3** |
| TriRLC 活连点 | **0.2.1-wave3** |

- **TriMLC 消费面勘差① sg 面 factual 回填**（CTO 已裁准 0739873a）：sg TriMLC `node_modules/@trimetaverse/tricode` **SYMLINK 在位+ESM import 探针通**=与本机面同形——CTO 知会「symlink 所指 dist 已换新、8713 进程内存态仍旧代码」与 sg 勘验互证
- sg TriModel/TriMMC 在役重装面：**零触碰**（symlink 活连形态免重装——checklist #3 重装面候联动窗项=活连形态下天然豁免，如实注记）

### #4 读数归卷+R-HY 对照 ✅

- 正名对照表常设项登记：本卷即归卷件（batch-13 树同 FSD 卷目录）
- **R-HY 对照（隔离位配方复用）**：
  - R-HY 面：TriModel+TriRMC tricode=SYMLINK 活连在役树（d20cb6b 旧版，**在役树零触碰**）；R-HY 无 bare、node **v22.23.2**（快时序环境）
  - 通道：本机 TriCode bundle（dev 全 ref 形；range 形 `d20cb6b..d181946` 报 empty bundle 系 d20cb6b 系 d181946 祖先+range 解析行为，如实注记）→scp→隔离位 fetch+checkout d181946
  - **58 套对照读数：tests 58 / pass 58 / fail 0（R-HY 快时序环境）**——旧代码此环境哨兵案 6!==7 fail 复现在案（LG-054），新代码唯一性后缀快慢双时序恒绿=**缺陷消除终实证**（FSD 判读锚②兑现）
  - 隔离位 dist 未重建（tsx 直跑 src 零 build 需求；CORE_VERSION 值面锚 sg 面已 5/5 采齐）——如实注记
  - **清理锚落地**：bundle 双端删+隔离位 checkout 回 a3893ba 原态（留位复用语义保全）

## 三、门判读汇总

| 门 | 读数 | 判 |
| --- | --- | --- |
| sg TriCode check | tsc --noEmit exit 0 | ✓ |
| sg TriCode 58 套 | 58/58（v18 慢时序） | ✓ |
| R-HY 58 套对照 | 58/58（v22 快时序）——缺陷消除终实证 | ✓ |
| 四仓+本体 CORE_VERSION | 5/5=0.2.1-wave3 | ✓ |
| sg TriModel 全量 | 284/262/5/17 独立组合基线（fail 5 全 UI 族，零 tricode 交叠候选） | ✓（定性注记） |

**b14 门 SDE 侧四项执行毕，双签条件齐（FSD 卷 72239fd3+本卷），候 STE/CTO 面复验与门收口。**

## 四、观察项（不阻门）

1. sg node v18 vs 本机/R-HY v22 三机版本差——`node --test` glob 支持差（v21+）已入本卷勘差；sg node 升级候独立窗（系统面变更非本席单方面动域）。
2. 25/25 对照抽验定义源**已答销项**（FSD 18:50）：=STE 09-25 settings 解冻复验门自建 25 用例沙箱驱动 `ste-sandbox-reverify.ps1`（W39 incident-sde-settings-01，PASS 9919800f，R5 终跑 25/25）——脚本侧回归冒烟口径，不在 TriCode 58/TriModel 284 套件计数内（TriCode 面无 25 案族实锚与本卷勘验一致，定义源在 STE 沙箱非套件）。
   - **276→284 构成拆解对表**（FSD 18:50 供，git log 实证）：276=编制时点（10-01）sg clone 壳族基线；本机 344−sg 284=60 全部来自 161d0ca..45757bd 九笔 LG-058 提交（N1..N5+P1 回炉+lint 勘补全触 test/）——sg TriModel 树停 161d0ca（LG-058 九笔未达 sg）。fail5 全 UI 族与 bump 零因果旁证（该族=161d0ca 时代 UI/E2E 门测，bump 只动 TriCode dist/core 导出；本机同族 0 fail）。276→284 差 8 与 skip 17vs14 属 sg headless 门控口径差方向（候 STE 终判，FSD 标注推断）
3. fail 5 全 UI 族的引擎敏感性定性（jsdom/无头链 v18 形态差候选）——候 STE 面 UI 测试族基线对照时对表。
4. 在役传导窗：sg 3333/3334/8712 与 R-HY 3333/8712/8710 下次重启即消费 0.2.1-wave3——各 daemon 下一自然重启窗的 healthz 读数=软观察锚（零行动项，除非 smoke 异常）。

## 五、使用依据

- FSD 施工卷 b14-fsd-construction-readout-20261006.md（72239fd3）+门双签（b2876290/fd74d22f）+checklist BOD 裁复版（m2-mainline-sde-window-20261001/core-version-gate-sde-checklist.md）
- CTO 知会 18:1x（8713 首切观察锚+TriMLC 勘差①裁准 0739873a）；FSD 交接两信（18:12/18:15）
- 实勘：sg/R-HY 双面 systemctl ss/git/node 活体读数（本卷 §一/§二 原样读数）
- 纪律：frozen 门通道（bump 同 commit 唯一合法）+在役树零触碰红线+D-17（bundle 走本机腿零跨机直连自增）+备份锚惯例
