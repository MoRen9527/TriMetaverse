# 任务书 sgA：TriModel sg 副本残留卫生（sg duty 值席试水件一）

- 立书位: 董事会 BOD（CEO 2026-10-09 01:03 批令试水排程；D-39 BOD 待裁全域授权）
- 承接位: M-SG duty 值席（树协议拾取，D-27 执行层标准）
- 树目录: trees/sg-duty-trial-20261009/
- 立书时点: 2026-10-09 01:0x（date 现查制，落笔以 commit 时戳为准）

## 目标

清点并处置 sg 机 `/srv/fleet/TriModel` 工作副本的三件未提交残留（BOD 2026-10-09 00:1x 实探快照）：

1. `package-lock.json` 存在未提交修改（M 态）
2. 两个 `.bak` 目录（2026-09-28 切换残留，目录名以现场实探为准）

## 执行步骤（自含打包，照单执行）

1. `git -C /srv/fleet/TriModel status` + `git diff package-lock.json` 现场取真值（BOD 快照仅作参照，以现场为准）
2. package-lock.json：判读 diff 内容来源（哪次操作引入）→ 若为依赖锁漂移且与当前 package.json 一致性无冲突，**还原**（`git checkout -- package-lock.json`）；若为有意义的变更，保留并在回卷中说明理由候认
3. 两个 .bak 目录：确认为 09-28 切换残留（对照目录内文件与现役文件 diff 无独有内容）→ **归档压缩至 `/srv/fleet/TriModel/.residue-archive-20261009/` 后删除原目录**；若含独有内容，保留原目录并在回卷中列明
4. 处置后复跑 `git status` 断言工作副本清洁（或仅余留痕件）
5. 回卷落盘本树目录：`sgA-closure-report-20261009.md`

## 边界（红线）

- **禁动** sg 生产 daemon（8710 MMC / 8712 值席通道 / 8460 代理）——纯工作副本卫生件
- **禁 push / 禁改 remote / 禁碰 credential**（token 值面不进本任务书与回卷）
- **禁 git reset / 禁 checkout 其他分支**——只处理上述三残留
- 现场实探与任务书快照不符时：以现场为准，差异如实录回卷，不强行对表

## 完成判据

- 三残留逐一有处置决策+留痕依据
- 工作副本 status 清洁（或余项逐条说明）
- 回卷文件落树（路径+行数在回报中列出）

## 回报

回卷落盘后值席回报（说明拾取时点/处置决策三件/终态 status）候 BOD 认账。本件为 sg duty 值席试水件之一，回卷质量纳入试水评估。
