# 件4 随动 G4·攒批换代渲染记录（CHO 席·督核卷）

- sourceOfTruth: 本件（G4 渲染工序执行记录·随排程单树归档）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 写前现查: 2026-11-06T22:05:00+0800

## §一 · 工序执行链（三笔三面）

1. **全批 dry-run**（`employee_host_publish --employee all`·ADE 安全门默认形）：14 席预告 generated 28/published 14·errors 0。
2. **gate 卡点与解卡**：首跑 `--execute` 遭 drift gate 全批拦（gate_target_newer_than_source·target=PM support README TMV 6bb589e85·10-20T21:38:30 vs source anchor=`runtime/cognition/host_object_generation.py` TC b012da8·10-20T21:35:49——同工序跨仓 2min41s 时序伪 drift·非语义 drift·CHO 勘定+CTO 独立复核成立）。解卡=CTO 域内注记笔 TC **acedc3504**（21:59:57+08·+8/-0 纯注释·功能语义零改·CHO 验笔 sg 链在链 SG-CHAIN-OK）→source anchor 时戳越过 target→allow。
3. **全批 execute 过闸**：`--employee all --execute` status=pass·errors=0·generated 28（14 席 roles+employees README）+published 14（TC `.github/binding-profiles/*.json`）·agent live 面委托 source_publish_check copilot 面（total=20·identical=6·errors=0）。

## §二 · 双宿主位换代（两面两笔）

- **copilot 面**（`.github/agents/`·`--publish-agents` 默认 host）：随委托笔换代毕。
- **claude 面**（`.claude/agents/`·`--publish-agents --host claude` 独立笔）：委托不含 claude 面（employee_host_publish 委托只发 copilot 默认）——CHO 照委托参数原形补跑 `--host claude` 笔·gate_blocked=0·derived_drift=0·毕。
- **live discovery 全量实核**（CHO 督核·20 件×2 面 grep「双班组」计数）：员工席 14 全 1 命中·非员工 6（board/business-strategy/4 registry）全 0——两面同谱全绿·无缺笔无越面。

## §三 · 消费面读数勘误注（CHO 自领两笔）

- `would_sync=0` 初读疑假阴性——实为读数语义误读（would_sync=skipped_dry_run·execute 模式下 0 属正常·identical=skipped_identical=6）。
- `.github` 面首探 0 命中系探错文件名（实名=`<id>.agent.md` 带 .agent 后缀·CHO 首探用 `<id>.md`）——重探正名 1 命中。假读数族「探错名=零命中≠未落盘」又一例（manifest-identity-verification 同族）。

## §四 · 锚清单

- 解卡笔：TC acedc3504（2026-11-06T21:59:57+08·CTO·CHO 验 sg 在链+stat 实锚）+二推笔 TC 97e754b（2026-11-06T22:09:25+08·+5/-1 纯注释·CTO 前瞻注应验后终批锚）
- 全批 execute 终读数：status pass/check_time 2026-11-06T14:09:58Z/errors 0/published 14
- claude 面笔读数：gate_blocked=0·derived_drift=0
- live discovery：两面 20 件 grep 计数谱（§二）
- TC 仓变更：14 binding profiles（终跑过闸验证毕·内容恒定无欠账——见 §五 勘正注）
- TMV 仓变更：`.claude/agents/`+`.github/agents/`+`TriCompany-host-assets/` 三面（TMV@e31dec1a5 锁笔·sg 验真）
- 结构性债项（CTO 登记·CHO 排程裁量）：gate 判据 content-face 演进（render(source) hash 比对替代时戳代理·结构性假阳性根治）——**裁量=不排今晚**（全批 execute 后改闸违小步纪律·CTO 同理由在案）·候独立验证谱窗·随 G6 收口毕报一并呈 BOD 登记面。

## §五 · 勘正注（CHO 自领·2026-11-06T22:11:42+0800 现查）

**「并行窗吞笔」系误判，勘正**：锁笔链中 binding「M 14→0 diff」初判为并行席工作区恢复吞笔——终跑后 hash 三方对表实锚：磁盘 binding sha256=终跑④ published 读数逐字同（CSO 3dda32f79886）·HEAD 版=c2952ca2（B 批时代）·而 `git diff` 判 0——根因=**行尾归一化假象**（管线 LF 写入/检出 CRLF·git autocrlf 归一化后 binding 内容自 B 批起实质恒定——binding 系模板生成件不载岗位语义·14 席改版不动其内容面）。即：**无吞笔·TC binding 零欠账**（终跑 pass+内容恒定+sg 顶 97e754b 对平三锚闭环）。CHO 前勘违反「矛盾证据先 json/hash 对表」教训即定性——自领入卷；本族归档=行尾伪 diff 家族（与 PowerShell→ssh stdin CRLF 族同源·候纪律化窗并档）。G4 六环终态：source✓/support✓/binding✓（终态验证）/live✓（两面全量实核）/manifest→G5 正式对表/治理回填→G5。

—— CHO 小源 · G4 渲染记录落卷（写前现查 2026-11-06T22:05:00+0800·G5 治理回填续推）
