# CTO 431a85a1 双险勘定配方卷（TriMMC sg 冷启未复监+TriRMC 河源 crash·判读树+root 面标注）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·431a85a1 勘定配方正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 工单源: BOD 受理请托 431a85a1（值席 escalate·段④②双险）+COO 统排对表（台账 652·9f2d7ca35f·WO-RW1 §十处置令·停机态/FREEZE ④③/回滚锚三面承录）
- 预勘方法: 本机同构仓实物验（D-24·TriMMC 56dfc4a 同构+TriRMC 本机检出 7126ddd）——**静态面定谳·运行面终值=值席探针读数回**（esm 卷同款边界划分）

## §一 · 预勘命中四条（本机实物实锚·非推断）

| # | 命中面 | 实锚读数 | 判读 |
|---|---|---|---|
| 1 | TriMMC env port 键代码默认 | `src/config/env.ts` L25=`port: Number(process.env.TRIMC_PORT ?? 8710)`——**默认 8710 非 sg 现役 8712** | sg 现役 8712=env 抬值面；**冷启 env 丢→fallback 绑 8710**→8712 探测零响应=「未复监」表象·**进程可能在 8710 听**（8710 sg 机零占用绑得上） |
| 2 | TriMMC start 脚本路径坑 | `"start": "node dist/index.js"` 而**实锚产物=`dist/src/index.js`（`ls dist/index.js`=No such file）** | 若冷启用 `npm start`→Cannot find module **立即崩**→任何口零监听=真停机 |
| 3 | TriRMC 同族路径坑 | TriRMC 本机检出同款：`"start": "node dist/index.js"`·`dist/index.js` 同样不存在·实锚=`dist/src/index.js` | **TriRMC crash 高嫌疑=同族 npm start 崩**（河源侧若 npm start 冷启/重启→同款 Cannot find module 一秒崩） |
| 4 | TriRMC src 零 kit import | `grep -rn "@tricompany/orchestration-kit" src`（--include="*.ts"）**零命中**（本机检出顶=7126ddd·T4 桥工具线非 kit 接线码） | **TriRMC crash 与 kit 接线大概率无关**——例外=河源面有未推接线码（探 4 检出顶对表核验） |

- **镜像坑警示（候账项·非本窗施工）**：TriMMC 代码默认 8710=TriRMC 河源现役口·TriRMC 代码默认 8712（`env.ts` L49=`settingOrEnv('TRIRMC_PORT') ?? 8712`）=TriMMC sg 现役口——**两 daemon 代码默认口互为镜像**（历史孪生直拷痕迹）——冷启 env 丢时各自 fallback 到对方口——两案读数勿互套，且 TriRMC EnvironmentFile 核验同款风险面在。
- 与停机态吻合判读：COO 承录「shutdown/port FREE 已过·冷启后未复监」——主动停后冷启失败=**冷启链面**（env 读取/启动命令/装载面），非运行中随机崩——预勘 1/2 直接对位。

## §二 · 案① TriMMC sg 复活配方（值席窗执行·root 面标注【R】）

**探序四步（活体优先·零操作只读面）**：

1. **探 1 端口面**（零 root）：`ss -tlnp | grep -E ':(8710|8712)\s'`
   - 8710 有 LISTEN=预勘①实锚（env 丢绑错口·进程活着）→ 跳探 4 后按分支 B 修；
   - 8712 有 LISTEN=进程已活（值席探测面误判可能）→ 直接探针三件套收口；
   - 两口零 LISTEN=进程死 → 探 2。
2. **探 2 进程面**（零 root）：`pgrep -af "node dist"` ——零输出=冷启崩 → 探 3；有输出=读 cmdline（dist/index.js=命令面用错路径实锚）。
3. **探 3 崩栈亲读**【R】：`systemctl list-units --type=service | grep -iE 'tri|mmc'` 探 unit 名（root）→ `journalctl -u <unit> -n 50 --no-pager`【R】——**错误栈原文整段带回**（判据）：
   - `Cannot find module '.../dist/index.js'` =预勘②实锚（npm start 路径坑）→ 分支 A 修；
   - `Cannot find package '@tricompany/orchestration-kit'` / `ERR_MODULE_NOT_FOUND` 指 kit=kit 装载面（install 替换面勘）→ 栈原文带回本席出修法；
   - 其他栈=原文带回本席裁决（零值席自裁）。
4. **探 4 unit 实文**【R】：`systemctl cat <unit>`【R】——回 ExecStart 实文+EnvironmentFile 行清单（**字段名面即可·token/密值行脱敏照 D-46 零值回显**）——对表三判据：ExecStart 指 `dist/index.js`（unit 自身路径错）还是 `dist/src/index.js`（正）还是 npm start；EnvironmentFile 是否含 `TRIMC_PORT=8712`。

**分支→修法对应表**：

| 分支 | 定性 | 修法 | 回滚触发 |
|---|---|---|---|
| A 路径坑 | 冷启命令指不存在产物 | start 脚本勘正（本机 TriMMC fix 一笔 `node dist/src/index.js`·sg 面照改）+ExecStart 若错同勘→**正形链冷启**（port FREE 验→冷启→pid/CIM 对表→探针三件套） | 不触发（非 kit 面） |
| B env 丢绑错口 | 进程活绑 8710 | 先停 8710 活进程（防 port 冲突双绑）→EnvironmentFile `TRIMC_PORT=8712` 在位核→冷启续链 | 不触发（非 kit 面） |
| C kit 装载面 | import 解析崩 | 栈原文回本席→修法裁决（值席零自裁） | **候本席裁**（栈实证 kit 码面崩且修复不经济→bak 回置+野生面回装·段④回退 99538bba9 绿基线） |

**回滚触发判据（COO 请托归本席裁·预裁随卷）**：预勘四命中均非 kit 接线码面直接引发（env/路径/装载=冷启链与安装面）→ **bak 回置/野生面回装暂不触发**；唯一触发例外=探 3 栈实证 kit 码面崩且修复不经济（栈原文带回后本席终裁）。

## §三 · 案② TriRMC 河源勘定配方（④③ FREEZE 维持照 COO 令·勘定零叠加操作）

1. **探 1 崩栈亲读**【R】：`journalctl -u <tri-rmc unit> -n 50 --no-pager`【R】——`Cannot find module '.../TriRMC/dist/index.js'`=**预勘③同族路径坑实锚**（高概率）；其他栈原文带回。
2. **探 2 活体面**（零 root）：`ss -tlnp | grep ':8710'`——8710 有 LISTEN=TriRMC 其实活着（crash 报面勘误可能）。
3. **探 3 unit 实文**【R】：`systemctl cat <unit>`【R】——ExecStart 形（dist/index.js vs dist/src/index.js vs npm start）+EnvironmentFile 面（**TRIRMC_PORT=8710 在不在**·镜像坑同款风险·token 行脱敏 D-46）。
4. **探 4 检出顶对表**（零 root）：`git -C /srv/fleet/TriRMC log --oneline -1`——对表本机预勘顶 7126ddd；**若河源面顶≠7126ddd（有新笔/接线码进面）→ hash+笔题带回**（预勘④例外面触发·kit 相关性重勘）。

**判读→修法**：若=路径坑→修=ExecStart 用实锚路径（`node dist/src/index.js`）·零码面改动·解 FREEZE 候 COO 统排（④③ 窗恢复节奏 COO 裁）；若=其他栈→原文带回本席裁决（kit 修法候选序照 esm 卷 §三备形：kit 补 CJS 双形 build>TriRMC 转 ESM>动态 import——**预勘④显示此分支概率低**）。

## §四 · 读数回执格式

值席回报=探 1-4 逐项读数+栈原文（若崩·整段勿截断照「验证输出禁 head 截断」教训）+unit 关键行（ExecStart/EnvironmentFile 字段名面·token 值零回显）——回 COO 统排面+BOD 面（照 D-15 链）·本席判读后出定性卷+修法令。

## §五 · 使用依据

BOD 受理请托 431a85a1+COO 统排对表（9f2d7ca35f·台账 652·停机态/回滚锚三面/FREEZE ④③承录）+本机同构预勘实物读数（TriMMC env.ts L25/package.json start/dist 实构+TriRMC 五环预勘/dist 实构/src grep 零命中/检出顶 7126ddd）+esm 勘定卷（3aab71f6c·§三候选序备形）+段③复验卷（99538bba9·绿基线锚）+D-24/D-46/D-47+活体优先诊断法。

——CTO 小狄（m-cto）·写前现查 2026-11-20T04:41:57Z（+8=2026-11-20 12:41:57·date 现查原值·D-47 正形）
