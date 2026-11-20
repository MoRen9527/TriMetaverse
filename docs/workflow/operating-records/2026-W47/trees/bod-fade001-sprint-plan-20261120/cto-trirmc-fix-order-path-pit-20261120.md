# CTO TriRMC 修法令（同族路径坑定性·431a85a1 案②·652⑥ sprint 窗内候排）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·TriRMC 修法正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 工单源: 431a85a1 案②（BOD 轻催 13:06 承录面·652⑥ 非急面 sprint 窗内候排）+勘定配方卷（25d8436b0·预勘③④+§三探序）
- 定性证据链: 本席预勘③（TriRMC 本机检出 7126ddd 顶实物实锚：`"start": "node dist/index.js"`·`dist/index.js` 不存在·实锚产物=`dist/src/index.js`）+值席/BOD 12:50 面读数摘要「TriRMC 8710 停同族路径坑」**双源吻合**

## §一 · 定性采认

**TriRMC crash 根因=同族路径坑**（与 TriMMC 案①分支 A 同款家族）：启动命令指 `dist/index.js`（不存在产物）→Cannot find module 一秒崩→8710 零监听。**修法由定性唯一确定·即刻出令**（不候完整栈原文正身——栈原文落树后并入定性卷归档·若执行中栈另有异样照配方卷 §三回勘条款带回本席·备形不撤）。

## §二 · 修法令三行（值席/BOD SSH 链执行·root【R】标注）

1. **unit ExecStart 勘正**【R】：改为 `node dist/src/index.js`（实锚产物路径）——若现文已是正路径则零动（核验即过·【R】`systemctl cat` 先验后改）。
2. **EnvironmentFile 核验**【R】：`TRIRMC_PORT=8710` 在位必核——**镜像坑警示**（TriRMC 代码默认 8712=TriMMC sg 现役口·河源现役 8710=env 抬值·冷启 env 丢→绑 8712 误口——同族风险 TriMMC 已实证）·token 行脱敏照 D-46 零值回显。
3. **正形链冷启**：port FREE 验→冷启→pid/CIM 对表→**值面探针**（8710 LISTEN+业务探针绿·非 healthz）。

## §三 · 完工判据与解冻面

- 完工三件：①`ss -tlnp` 8710 LISTEN ②pid/CIM 对表 ③值面探针绿——毕报落树（探 3 栈原文正身随卷归档）；
- 毕报达→**④③ 河源 FREEZE 解冻候 COO 统排**（窗恢复节奏 COO 裁·本席零代派·D-27 v4）；
- 值席零自裁面：栈异样/环境面意外=带回本席候裁，零就地修。

## §四 · 回滚姿态

unit 文改动=revert 一键（零码面零 install 面）；冷启失败→照勘定配方卷 §三探 1 崩栈亲读带回（kit 修法候选序备形不撤：kit 补 CJS 双形 build>TriRMC 转 ESM>动态 import——预勘④显示 kit 相关分支概率低）。

## §五 · 使用依据

勘定配方卷 25d8436b0（§一预勘③④+§三探序）+BOD 轻催 13:06 承录面（12:50 值席读数摘要三要素）+本机 TriRMC 检出实物实锚（7126ddd 顶·start/dist 实构）+esm 勘定卷 3aab71f6c（§三候选序备形）+COO 台账 652（9f2d7ca35f·FREEZE ④③承录）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T05:07:52Z（+8=2026-11-20 13:07:52·date 现查原值·D-47 正形）
