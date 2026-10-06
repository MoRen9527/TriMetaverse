# b14-core-bump · FSD 施工读数卷（本机面施工毕）

- sourceOfTruth: 本件（b14 FSD 面施工读数正身；sg 侧四项+SDE 面交接项见 §五）
- syncMode: static
- lastSyncedAt: 2026-10-06T10:08:49Z（date 现查 18:08+0800 原样粘贴）
- 施工席: FSD 小全（m-fsd）；门依据=双签（CTO b2876290 五条+CFO fd74d22f 三注记）+checklist 分工裁复
- 交付锚: **TriCode d181946**（dev，sg bare 已推平 ls-remote 验顶）

## 一、施工本体（双义同 commit，2 files/13+/5-）

1. **io-kernel.ts 族③缺陷修**（STE 定案=唯一性后缀单 helper）：两写点同改——
   - runWrite 备份先行（原 L155-158）：`${path}.bak-${ts}` → `uniqueBackupPath(path)`
   - rollbackTo 回滚前备份（原 L286）：同上收敛
   - 新增模块级 `uniqueBackupPath()`：`bak-<ts>-<pid>-<seq>`（进程内单调 seq+pid 防跨进程同毫秒）
2. **CORE_VERSION bump**：result.ts:8 `'0.2.0-wave3'`→`'0.2.1-wave3'`（语义化 patch 位，wave 段不动，CTO 签 §二.1 审定形）

## 二、门禁读数（四道全绿）

| 门 | 读数 | 判 |
| --- | --- | --- |
| tsc --noEmit | exit 0 零错 | ✓ |
| TriCode 防线回归 | **58/58 全绿**（哨兵案 L140 在唯一性后缀下确定性绿——修前本机绿系循环跨毫秒时序运气，R-HY 快时序 6!==7 实证缺陷在案；修后任何时序恒 7 份） | ✓ |
| TriModel 壳族+全量 | **344/330/0/14 与窗内基线逐项对平零回归**（276 壳族含内） | ✓ |
| 四仓联动 CORE_VERSION | **4/4=0.2.1-wave3**（TriModel/TriRLC/TriMMC/TriMLC，见 §三形态注记） | ✓ |

## 三、四仓读数形态注记（三项勘差如实报）

1. **symlink 活连形态**：本机四仓 `node_modules/@trimetaverse/tricode` 全部为 SYMLINK→/d/Code/ai/TriCode——dist 重建即四仓联动，**零重装需求**（checklist #3「逐仓 npm install+build+读数」的 sg 面=clone/安装形态可能不同，以 SDE sg 实勘为准）。
2. **TriMLC 消费面勘差（CTO §八 裁定勘差候选，如实报不自行改裁）**：本机 TriMLC `src/cli.ts:17` 运行时 `import { makeCoreIO, runCli } from '@trimetaverse/tricode/trimodel-cli'` + symlink 在位=**物理+运行时双实证消费**。CTO §八「TriMLC 非 CORE_VERSION 消费面」裁定的 sg 面 factual（SDE 探针 MODULE_NOT_FOUND+「仅 tricode 一项无链接」）与本机面相反。勘差根源候选=①包名勘误（CORE_VERSION 所在包=**@trimetaverse/tricode**，trimodel-cli 系其 dist 子路径+exports 二级入口，require('@trimetaverse/trimodel-cli') 必 MODULE_NOT_FOUND）②sg TriMLC clone 与本机 TriMLC 依赖面形态差。裁定域=sg 读数面维持不动；本机面四仓构成=含 TriMLC（4/4 读数已采）。候 CTO 勘差裁。
3. **TriCade 本机无 clone**（/d/Code/ai/TriCade 不存在）——CTO 四仓构成「TriCade（打包面）」本机缺位注记；sg/R-HY 面形态归 SDE 采集。
4. **checklist 命令形勘差**：TriCode=`"type": "module"`（ESM 仓）——`node -e "require('...result.js')"` 形必炸（ERR）；正形=`node --input-type=module -e "const m=await import('file:///<真身路径>/dist/trimodel-cli/result.js'); console.log(m.CORE_VERSION)"`。sg 侧 SDE 探针失败形态候选同因（§三.2 包名+ESM 双因），照此勘。

## 四、红线合规对表

- frozen 纪律：core 变更与 CORE_VERSION bump 同 commit=门内唯一合法通道 ✓（CTO 签 §二.2 同批裁定）
- sg TriModel 生产依赖面：零触碰 ✓（本机面施工，sg 侧动作全归 SDE）
- R-HY 面：零直连 ✓（对照复验=SDE 配方面，/tmp/lg054-rerun 留位复用）
- 作废条款：防线回归全绿，门成，bump 不回滚 ✓

## 五、SDE 面交接项（sg 侧四项前置已备）

1. sg TriCode 拉 d181946（sg bare 顶已平）→sg 面 `npm run check`+`npm test`（58 套）——**预期 58/58**（R-HY 快时序哨兵案缺陷随唯一性后缀消除，预告案转绿判读锚）
2. sg TriModel 壳族 276+25/25 对照抽验（时点约束不变：sg TriModel 3333/3334 在役重装=M2 改指联动窗并批项禁单方面动）
3. sg 侧四仓读数（TriMMC 8712 在役重装候联动窗；clone 形态仓照 §三.1 勘 symlink 与否——**勘到 symlink 即免重装采读数**）
4. 读数归卷+正名对照表常设项登记；R-HY 对照=隔离位 /tmp/lg054-rerun 复用（清理锚=复验毕）

## 六、消费面行为语义（零变更自证补记）

- 备份文件名变更仅扩尾部段（前缀 `settings.json.bak-` 不变）：startsWith 前缀过滤×2（rotateBackups L61/listBackups L249）零破；rollback 防穿越 regex `/^settings\.json\.bak-[0-9A-Za-z:\-.]+$/` 字符类含 ts/pid/seq 全段字符（`-` 数字字母），穿越拒收语义不变（本机 node 实测过）
- 轮换/哨兵/回滚逻辑零触：diff 面仅 helper 6 行+两调用点+CORE_VERSION 1 行

## 使用依据

- 双签卷：cfo-b14-core-bump-cosign-20261006.md（fd74d22f）+cto-tc502-conditions-b14-cosign-20261004.md（b2876290，同目录）
- checklist：core-version-gate-sde-checklist.md（BOD 裁复回填版，同上树）
- 技术定案：W39 trimodel-rhy-deploy-01/cto-adaptation-review.md §三+STE 附注（8ca237e1）
- 消费面实勘：TriCode package.json exports/type 字段；TriMLC src/cli.ts:17；四仓 node_modules 链接形态实勘（本卷 §三）
