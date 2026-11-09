# FADE 实例跑后记录规范·初稿 v0.1（CEO 令11·CAO+COS 联合主笔）

- sourceOfTruth: 本件（初稿·候圆桌评审·CEO 2026-11-08 16:43 令二）
- syncMode: draft-v0.1（评审前可改）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 定性注: FADE=公司级标准工作流程（非字母缩写·框架名·PACE=路径之一）——跑后记录形随其公司级地位升为标准规范
- 联合主笔分工注: 制度形=CAO（本稿）·周平面收口与迁移器对表=COS 会签候·机制实现（driver 落盘）=CTO

## §一 · 现状实锚（fade-011 记录形全景·2026-11-08 实勘）

- **树位**：`operating-records/<week>/trees/fade011-ew-runs/`——实例挂树形·随周平移走（W45 现役两 run：fade011-daily-20261107/20261108）。
- **run 目录名**：`fade011-daily-<YYYYMMDD>-<HHMMSS>/`（时点戳到秒·命名规则草案 R5 正形模板）。
- **run 内含三件套**：①`plan.md`（Run Plan·程序化计划产物·FADE-011 S5.1 driver·plan skill 正身接线·treeDir 自声明）②`reports/`（六节点卷 `node-{plan,qualify,dce,verify,score,close}.md`+产物 `{plan,close,score}-output.json`）③`artifacts/`（DCE 产物·dce-output.md）。
- **机器账**：fade.db checkpoint（treeDir·APPROVED 态）与盘面 run 目录对账——README-POINTER 案（2026-11-04 字面 {week} 排障产物·两 run 原地保留维持 DB/盘一致·CTO 裁）=一致性铁律先例。
- **周平面联动现成面**：`fade-audit-latest.json`（滚动指针件·W45 根在役）。

## §二 · 标准位置案（迁移预留位）

- **公司级标准槽**：`operating-records/<week>/trees/fade-runs/<instance-id>/`——FADE 型实例 run 统一落此槽（现役 fade011-ew-runs=单实例树·转正形=通用 fade-runs 槽下按 instance-id 分目录·存量树原地保留不回改·新实例从新槽）。
- **迁移预留位**：周平移 carry-over 标准件清单**增 fade-runs 槽**——run 树随周平移整树走·在途 run 跨周=平移器显式携带项（联派工圆桌产出② P2 迁移段池系标准件族·防 W43/W44 断档族机制复发）。换周在途 run 处置细则（携带 vs 留旧周挂指针）候圆桌裁（倾向=在途 run 留旧周原地+新周挂指针·复刻 README-POINTER 一致性优先逻辑）。

## §三 · 记录形模板（像 011 那样·每跑必备）

run 目录必载五件（缺席件显式注 skip 理由·禁静默缺）：

1. **run-plan.md**：程序化计划·treeDir 自声明·触发源（cron/手动=CEO 通道注·fade011 手动运行=CEO 通道纪律在案）。
2. **reports/ 六节点卷**：`node-<phase>.md`+`<phase>-output.json`——phase 集={plan,qualify,dce,verify,score,close}·实际未执行 phase 落 `node-<phase>.md` 注 skip 理由（缺席显式化·审计可判）。
3. **artifacts/**：DCE 产物·逐件带产物名。
4. **run-close.md**（候增·收口摘要卷）：跑后收口一行卷——起止时点（%cI 代引禁手写）/终态（APPROVED 等）/三读数（节点数/产物数/异常数）/指针（fade.db checkpoint 锚）——审计入口卷·机器生成候 CTO driver 扩展·过渡期手补亦须 %cI 代引。
5. **fade.db checkpoint**：机器账对表锚——本件=真源账·盘面 run 树=投影·两侧一致铁律（R8 禁改面族）。

## §四 · 审计链与 owner 分工

- **审计链**：fade.db checkpoint ↔ 盘面 run 目录 ↔ run-close.md 三向对表·禁单侧删（README-POINTER 铁律入正形条款）；watcher 扫描域挂接候（派工圆桌产出① 扫描域六源候选——run 终态缺 close=候门态）。
- **owner 分工**：机制落盘=CTO（driver 扩展 run-close 自动生成）·标准位制度与迁移槽=CAO 本稿+COS 周平面收口会签·周平移携带=PM/COS 迁移器·成本读数消费=CFO（token 实测协议同源）·全员=审计读。
- **生命周期衔接**（D-76/秘书处 §12）：孵化段实例 run 记录照本规范全载（孵化隔离≠记录豁免）；实例退役 run 树归档随周平移不删（记录面=公司资产）。

## §五 · 验证三问（需求池格式·候入池随圆桌定）

- 谁消费：审计面（CEO/BOD 抽审·事后可溯）+CFO（跑成本读数）+CTO（driver 质量回查）+全员（实例健康感知）。
- 为什么现在：CEO 令11 直令+FADE 升公司级标准流程定性+011 记录形已自然成型（只差制度化命名与标准位·零新建成本）+迁移器池系断档两前言犹在（W43/W44）。
- 最小版本怎么验证：下一跑（fade011-daily 次日拍）对照五件清单命中（现役 1-3+checkpoint 已命中·run-close 为唯一增量件）+周平移下窗 fade-runs 槽携带断言。
