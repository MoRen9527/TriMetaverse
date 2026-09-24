# LG-046 宿主资产目录正名·执行 brief（承接席细化稿 v1）

- 承接席: m-duty-cos（服务域拾取，charter task-charter-20260923-host-assets-rename.md）；铸 2026-09-24 夜航段
- 上位: charter 锚基线五项+验收五锚；转投单四约束（CTO 裁）；底卷=三 daemon 5 处引用面实锚+配对命名表 13 行+safe.directory 告警标注

## 只读侦察实测（0924）

- 物理目录: `/srv/fleet/TriMetaverse/TriCompany-copilot-host-assets/`（唯一实例；TC 仓无同名目录）
- 活引用实测（排除 operating-records/trees/output/node_modules/.git）: TC 547 行｜TMV 70 行（charter 基线 502/659=0923 口径，差额=增量与排除口径差，迁移按内容清零不计计数）
- LG-040 护栏行: 活文档面现命中 1 处（todo:269 叙事行，非现役化表述——底卷「三处护栏行」全表候补，命中面按禁现役化原则一律不动）

## 底卷缺项如实标（候补）

- 配对命名表 13 行、三 daemon 5 处引用面实锚明细、safe.directory 候标注位——sg 可达面未见表正身（grep 命中均为 W33 旧档），候 COO 枢纽补投或 wt 分支指认；缺项期间 Phase 1-2 照 charter 锚基线可核部分执行，daemon 5 处（Phase 3）候底卷对表后动。

## 分相执行序

- **Phase 0 物理迁移**: `mv TriCompany-copilot-host-assets TriCompany-host-assets`（TMV 树内）+ `ln -s TriCompany-host-assets TriCompany-copilot-host-assets`（junction 别名，锚②旧路径可达）
- **Phase 1 内容正名·TC**: 活文件 547 行旧名→`TriCompany-host-assets`；排除=operating-records/**、trees/**、历史冻结件、LG-040 护栏行、.git/node_modules；commit 署名 duty-cos
- **Phase 2 内容正名·TMV**: 同则 70 行（另排除 output/ 与别名 symlink 内遍历）；commit+push 双远端
- **Phase 3 三 daemon 5 处**: 照底卷对表（候补），改后重启验证（restart 候 BOD root 通道，与名册激活同窗）
- **Phase 4 manifest 支撑面同步**（照 STE slug 先例 b08f359d3）+sync 重跑 diff=0+计划任务触发一轮（验证锚③）
- **Phase 5 五锚自验+读数回 COS 抄 CTO 验收**（四约束④）

## 红线

- 历史件冻结不改（operating-records/trees 叙事引用原样）；脚本逻辑零改动（只改引用路径+标记头注）；LG-040 护栏表述禁现役化；每 Phase 一 commit 锚（D-29 留痕）。
