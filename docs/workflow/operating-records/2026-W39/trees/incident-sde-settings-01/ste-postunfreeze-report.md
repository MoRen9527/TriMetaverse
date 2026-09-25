# STE 解冻后复验报告（TASK-INCIDENT-SDE-SETTINGS-01 · 两段验收第一段）

- sourceOfTruth: 本件（解冻后复验正身；读数全自产；PASS/FAIL 直报 COO+BOD）
- syncMode: final
- lastSyncedAt: 2026-09-25 13:5x +0800（date 现查回合链）
- 复验席: STE 小柯（m-ste）；派令: m-coo 11:22 执行 BOD 11:19 解冻令（接令回执 msg_id bc519068）
- 范围: a) 四锚沙箱对 dev 合成形态（2d08d7c）复跑（merge 无回归验证）；b) CaptureRelay 沙箱固化演练（CTO 建议项·部署日 3333 健康窗预演）

## 复验判定（按范围拆分直报）

| 范围 | 判定 | 要点 |
| --- | --- | --- |
| a) 四锚 merge 无回归 | **PASS** | 身份三查全过（dev=2d08d7c；合成内容与已验分支 f887b27 EOL 归一同值；冻结门 exit 3 零残留）；四锚 6 案全 PASS |
| b) CaptureRelay 固化演练 | **FAIL** | 发现**新缺陷 N-1**（下详）：capture 产出 `relay-3333.json`，`-Mode relay` 回切却找 `relay.json`——README L43/L91 承诺的部署日「capture→回切」链路开箱即断。fail-closed 姿态（无数据风险），但演练目的（部署日就绪）未达成 |

## 一、测试判断

两段验收第一段完毕。dev 合成形态（2d08d7c）对四锚行为与已验分支零回归；CaptureRelay 演练暴露 N-1 真缺陷（f887b27 原生、非 merge 引入，系原 25 案正册覆盖缺口——正册无 `-Mode relay` 成功路径案，本演练补上）。N-1 已升级上报，候 CTO 裁修法；与 FSD 在途 O-1/O-2/O-3 收尾 patch 的二段增量复验可同窗处置。

## 二、执行件声明（只验不改的实现方式）

- **被测件**：`git archive 2d08d7c` 提取的纯净副本 `%TEMP%\ste-postunfreeze-extract-2d08d7c\scripts\ops\local\`——因 dev 工作树有 FSD 在途未提交改动（O-1/O-2/O-3 patch 进行中，11:34 预告），跑工作树会测错对象且触他人工作区。
- **提取件身份对表**：脚本 blob `4a15e58f…`、`presets/direct.json` blob `a19fa4dc…` 与 `git rev-parse 2d08d7c:<path>` 精确一致。
- **dev 工作树零触**：全程仅跑提取副本+沙箱；前后 `git status` 对表——M 集= {README.md, restore-claude-config.ps1}（FSD 在途件）不变，统计形不变（2 files, 35+/7-）；期间字节面漂移=FSD 并发编辑归因（本席无任何仓库面写入通道）。

## 三、测试结果（R3 终跑自产读数全文）

沙箱 `%TEMP%\ste-postunfreeze-20260925-134928\`，起跑 2026-09-25T13:49:28+08:00，**13/15 PASS, 2 FAIL**（两 FAIL 同指 N-1）：

```
PASS | I-1 dev现役笔身份 | branch=dev head=2d08d7c（期望 dev/2d08d7c）
PASS | I-2 合成同值身份(vs f887b27 已验分支·EOL归一) | content-equal=True
PASS | I-3 冻结门除名静态断言 | exit-3-gate-absent=True
PASS | T1a 占位符拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T1b 空串拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T1c 纯空白拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T2b 同形注入(API_KEY形) | exit=0 keyshape-line=True gen-api-val-match=True gen-auth-prop=<absent-prop>
PASS | T3c 轮换豁免哨兵 | exit=0 baks-after=8（期望8=7旧+1新，零淘汰） rotation-note=True
PASS | T4b 断言失败自动回滚 | exit=1 rollback-line=True restored=True
PASS | CR-1 CaptureRelay固化全流程 | exit=0 cap-keys=7/7 fidelity=True bom=False
FAIL | CR-2 部署日relay回切演练 | exit=2 … fail-line=预设不存在：…\settings.presets\relay.json（relay 形请先在 3333 健康日执行 -CaptureRelay 固化…）
PASS | CR-3 CaptureRelay WhatIf零写 | exit=0 preset-absent=True
PASS | CR-4 relay预设缺位fail-closed | exit=2 hint-line=True
PASS | CR-5 CaptureRelay×InjectKey互斥 | exit=2
FAIL | CR-6 3333健康窗冒烟预演 | port=3333被占用降级口65225 cap-exit=0 switch-exit=2 smoke-line=False fail-line=（同上 relay.json 不存在）
```

四锚逐锚结论：健康门三分支（T1a-c）exit 2+哨兵不动+零备份 ✓；同形注入（T2b）键形/值面 ✓；轮换豁免（T3c）8 bak 零淘汰 ✓；自动回滚（T4b）restored=True ✓——**merge 合成零回归**。

## 四、新缺陷 N-1 正身（本次复验最高价值发现）

- **现象**：`-CaptureRelay` 固化产出 `settings.presets\relay-3333.json`（L118），随后 `-Mode relay` 回切报 `预设不存在：…\relay.json` exit 2（L222 `$presetName = "$Mode.json"`；L137 bundled 模板同形 `"$Mode.json"`）。
- **README 三处矛盾**：L26「`presets/relay-3333.json` = -CaptureRelay 现役固化产物」；L43/L47 「-Mode relay=切回 3333 中转现役形」；L91 沙箱验收流程④明确「固化→`-Mode relay`→查 BASE_URL 含 :3333」——**文档承诺的主流程被文件名断链打破**。
- **归因**：f887b27 原生（提交面 diff f887b27↔2d08d7c 零漂移+I-2 内容同值 ⇒ 两形态同病），**非 merge 引入**；原 25 案正册覆盖缺口自认（正册 relay 族仅 T7b 负路径，无 `-Mode relay` 成功路径案——CR 演练即为补此盲区而生，命中）。
- **影响**：fail-closed（预设缺位拒绝、settings.json 零扰动），无数据风险；部署日影响=「capture→健康窗后回切 relay」需人工改名 `relay-3333.json→relay.json` 才能走通，与 README 单命令承诺不符。
- **修法候选（候 CTO 裁，一行级）**：①`-Mode relay` 预设定位改 `relay-3333.json`（对齐 README L26/L47 与 capture 产物名——STE 倾向，文档-实现对表方向正确）；②或 capture 改产 `relay.json`（改 README 三处+对历史固化产物语义）。
- **复现证据**：R3 CR-2/CR-6 fail-line 全文（上节）；独立手动复现沙箱 `%TEMP%\ste-cr2-repro-134644\`（capture exit 0 产 relay-3333.json→relay exit 2 找 relay.json）。

## 五、FSD 在途 patch 观察（只读 diff 实勘，13:5x 时点）

在途收尾件（未提交，头注「BOD 裁三授权+CTO 定谳」）覆盖本席前轮三项发现：**O-1**（keyshape 注记字面对齐，实现在 RESULT 行照出具体键名）、**O-2**（断言域收窄照 CTO 定谳实现=预设写入键域断空；预设外残留空凭据键→`warn=stale-empty-key:<键名>` 信息性注记不阻断）、**O-3**（bundled 分支保留理由注记+T7c 锚）。**N-1 不在窗内**（`$presetName = "$Mode.json"` 原样）。建议：N-1 与 O 族 patch 同窗落（一行修），二段增量复验一并覆盖，免第三次往返；候 CTO/COO 排程。

## 六、二段增量复验范围提案（候 COO/BOD 确认）

FSD patch 落盘后对本席提案范围：①O-2 断言域族（收窄后主路径不判死+stale 注记行值面）②O-1 RESULT 行 keyshape 字面 ③N-1（若修）capture→relay 回切全序+smoke ④四锚快速回归 ⑤100% 新增 diff 行覆盖走读。量级 30-60 分钟内。

## 七、驱动调试迭代史（如实记录）

| 轮 | 沙箱 | 结果 | 归因（全部为驱动/环境侧，非被测侧） |
| --- | --- | --- | --- |
| R1 | 134538 | 11/15 | ①Bash→powershell.exe 链继承 pwsh7 污染 PSModulePath→5.1 加载 pwsh7 版 Utility→Get-FileHash 缺失（驱动内净化修复）；②mock listener 子进程继承 stdout 管道句柄→外层永不 EOF 假悬挂（重定向修复）；③R0 死跑 123444 卡 CR-1（同②根因，顺序 ReadToEnd 死锁类，改异步双读+60s 看门狗） |
| R2 | 134928 前勘 | — | I-2 假 FAIL=git archive CRLF smudge（390 处，归一即同值）；I-3 假 FAIL=断言锚错（门形是 exit 3 非 FROZEN-NOTICE 字样，后者系 L19 档案注记合法在文） |
| **R3 终跑** | **134928** | **13/15** | 两 FAIL=N-1 真缺陷（非驱动侧） |

## 八、硬约束遵守声明

1. **「禁动现役 settings.json」（含读取）**：全程零触——活体路径仅驱动防呆字符串参照；执行件=TEMP 提取副本，全部写动作经 `-TargetDir` 沙箱。
2. **dev 现役态只验不改**：仓库面零写入（提取用 `git archive` 只读；执行件在 TEMP）；工作树 FSD 在途改动原样未触，前后指纹留痕（§二）。
3. **读数自产**：15 案断言与读数为 STE 驱动产出；FSD/CTO 读数仅对照。
4. **3333 口纪律**：R3 实测本机 3333 被占（现役服务，零触），CR-6 降级自由口 65225 演练（语义等价；真 3333 健康窗部署日执行——正是 CTO「不重犯活体形态」要求的沙箱位）。

## 使用依据

- 派令链: BOD 11:19 解冻令（COO 11:22 派工+11:31 FROZEN-NOTICE 保留候示+11:34 两段验收预告）
- 被测: TC dev `2d08d7c`（merge 笔）经 `git archive` 提取副本（blob 对表 4a15e58f/a19fa4dc）
- 前轮真源: 本树 `ste-reverify-report.md`（25 案正册+四锚基准）
- FROZEN-NOTICE: `TriCompany/scripts/ops/local/FROZEN-NOTICE-restore-claude-config-20260925.md`（档案保留，BOD 11:19 裁）
- 驱动: 本树 `ste-postunfreeze-driver.ps1`；证据沙箱: `ste-postunfreeze-20260925-134928`（R3）、`134538`（R1）、`123444`（R0 死跑）、`ste-postunfreeze-extract-2d08d7c`（提取件）、`ste-cr2-repro-134644`（N-1 手动复现）
