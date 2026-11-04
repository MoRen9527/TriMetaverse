# 排期单 v1.1（根目录 md 迁移+引用面同步+docs-maintenance event-watch 接入·COO 拆解·全谱单波）

- sourceOfTruth: 本件（排期单·执行面·COS 域径裁承袭现役·非真任务书）
- syncMode: dispatch-plan
- lastSyncedAt: 2026-11-04T10:53:46+08:00（date 现查原值·COO 全谱拆解落笔）
- 令源: CEO 2026-11-04 10:30:13 亲令·bod 10:38:00 转流转（底稿=同目录 draft-ceo-bod-session-20261102.md 意见㊻/㊼·断链全清单=意见㊻ E 类节 L536-540）
- 映射终稿: COS 定谳 2026-11-04 10:51:44（CPO 落点意见 7 件 10:48:23 齐·候定谳组解除·全谱可动）
- 版本留痕: v1.0（10:44:44 初稿·18 件先行拆）→v1.0 勘正（10:50:18·bod 意见㊼并入 17/7 拆）→**v1.1（10:53:46·映射终稿并入·候定谳段撤销·全谱单波）**
- 制度基线: 排窗废止（CEO 11-03 22:29 令三）=顺序推进有活就干；任务书生效面 CEO 确认制保留（11-04 01:39 收窄=限真任务书）；排期单/承载面=COS 域径裁（D-39 勘正段 0a7fe8a+ac0639a）
- 姊妹件: 任务书草案 v0.9（候 CEO 确认·同目录 task-charter-draft-v0.9.md——生效前不派工·D-27 分装）

## 一、映射终稿对表（COS 定谳四组·31 件实锚=29 根目录 md+meta-recognition/ 2 子目录件）

- **留根 3**：README.md／CLAUDE.md／AGENTS.md——不动（宿主约定/入口）。
- **A 组→docs/archive/（随卷归档·23 件=22 根+1 子目录）**：历史卷 15（phase 系 10＋opentride/tride runbook 2＋github-app-copilot-rollout-v1＋90天收入突击计划＋arch-storage-migration·被引 20 处最大断链面）＋三元宇宙价值流动_old＋tmv-phase-1-execution-plan（被引 5 处）＋trimetaverse.md＋三元宇宙价值流动.md（新版）＋三元宇宙落地方案.md＋链基础设施选型.md（随迁附注记「结论时点 2026-02·现役链面候重估」）＋灵感记录.md（**CEO 10:45 已定谳随卷归档·销候形态**）＋meta-recognition/元宇宙学院.md（子目录件·随 A 落 archive）。
- **B 组→docs/execution/（现役参考位+注记·2 件）**：meta-recognition/以太坊私链部署.md（注记「场景休眠·手册方法仍有效」）＋copilot-cli-deepseek-byok-setup.md（注记「2026-07-19 验证·配置值面候复验」）。
- **销项组（3 件）**：meta-reality.md／meta-recognition.md／meta-virtuality.md 全 0 字节（bod 无异议+CPO 产品域无保留）——销项+引用面改指/删。
- **判据线（CPO 供·终稿复用）**：叙事件被现役真源取代→A 历史卷；操作规程类方法面不随叙事过时→B 现役参考位+注记。链基础 _old 勘异已闭（CPO 勘异成立·根目录独立件·无改指负担）。
- **子目录处置（COS 授权本席拆解定）**：meta-recognition/ 两件按件各归其组（元宇宙学院→A·以太坊私链部署→B）·目录清空后删除·git mv 保历史。

## 二、工序排期（顺序推进·P1→P2 同窗紧接→P3·排窗已废有活就干）

### P1 迁移段（owner=FSD）

1. git mv A 组 23 件 → `docs/archive/`（平铺不改名·先例=docs/archive/tricompany-v0.1-design-20260324.md）＋B 组 2 件 → `docs/execution/`——合计迁移 25 件·git mv 保历史（禁删+重建）·每笔 commit 归属 FSD 署名。
2. 注记三处随迁落卷：链基础设施选型「结论时点 2026-02·现役链面候重估」／以太坊私链部署「场景休眠·手册方法仍有效」／copilot-cli「2026-07-19 验证·配置值面候复验」——注记形式按 docs/archive·docs/execution 现惯例对表（frontmatter 或头注·施工细节 FSD 裁）。
3. meta-recognition/ 子目录清空后删除（git rm 目录·两件已各归其组）。
4. 完工锚：`git log --diff-filter=R` 重命名记录 25 条＋根目录残留对表=6 件（3 留根+3 销项组候 P2 清）＋meta-recognition/ 目录已不存在。

### P2 引用面同步段（owner=FSD·与 P1 同窗紧接防断链窗口）

1. **白皮书改指清单（五条·行号系 CPO 勘时快照·施工按内容锚定非硬行号）**：①L1036/L1164 价值流动「详见」×2→**内章自指形**（COS 定谳采 CPO 建议形——内容已收编白皮书·非改指 archive 路径）②L1294 meta-三占位「补齐」待办行随销项废 ③L1379/L1381/L1382 三索引行改指 archive ④L1436-1443 文件清单段三行改指 ⑤文件清单段三占位行删。
2. **D3 销项施工**：git rm meta-reality.md/meta-recognition.md/meta-virtuality.md＋全仓 meta-reality/meta-virtuality 引用面改指/删（底稿 E 类读数各 2 件·白皮书外增量逐处判）。
3. **全仓被引面改链**（底稿 E 类 L540 读数逐项对表·25 迁移件旧根/旧子目录路径引用全清）：arch-storage-migration 20 件（最大断链面·含 tmv-phase-1 upstream 声明——tmv-phase-1 本身迁移后自引同步）／三元宇宙价值流动 6 件（含新旧两版名面）／tmv-phase-1 5 件／链基础设施选型 5 件／github-app-copilot-rollout 5 件／meta-recognition 5 件（**按被引对象分向改链：引元宇宙学院→archive 路径·引以太坊私链部署→execution 路径**）／trimetaverse.md 2 件／灵感记录 2 件／落地方案 2 件／90天·copilot-cli 各 0 件（零改链面）。
4. **doc-graph.json re-scan**：跑 doc-graph-scan.py 全量刷新（generatedAt+repoHead 对现顶）——P2 机械收尾步·刷毕断链断言（下节锚 2）。

### P3 event-watch 接入段（owner=SDE 施工+CTO 门禁·前置=P1/P2 毕）

1. env 三键（8713 现役 daemon 部署面）：`TRILC_FADE_WATCH_DIRS=D:/Code/ai/TriMetaverse/docs/archive`——**并集建议值**：B 组落 docs/execution/·WATCH_DIRS 是否并集 execution（或扩 docs/ 全目录面）候 SDE/CTO 按 watch 触发面与噪音面实勘裁定（本席建议=archive+execution 并集·落点即接入面）＋`TRILC_FADE_WATCH_TREE_ROOT`＋`TRILC_FADE_WATCH_INTERVAL_MS`（按现役部署面惯例值·af240529a 立窗先例）。
2. **fail-closed 三键缺一不可**（TriMLC watch.ts c52f5bc 缺键拒启语义）。
3. 8713 受控重启链（**本日第三次同口径**·04:04/04:48 两次计划内部署重启先例）：watchdog Disable→POST /shutdown→port FREE 验→schtasks 冷启→pid/CIM 对表→watchdog Enable→healthz+目标 env 值面探针（重启窗完工判据=进程内生效验证·非 healthz 绿即完）。
4. **首验=event-watch 对接入目录变更触发真 run 证据留档呈 bod**（CEO 令③原义「首验真触发 run 证据留档」）——受控试触（探针件或触发现役文件轻改）→真 run APPROVED 证据卷→呈 bod。

## 三、验收锚（四锚）

1. **根目录残留对表**：全谱施工毕=根目录 md 恰 3 件（README/CLAUDE/AGENTS）＋meta-recognition/ 目录不存在——ls 现勘留痕。
2. **断链断言**：25 迁移件旧路径（根 22+子目录 2 形态名面）＋销项 3 件旧根路径——全仓引用零命中（git grep 逐件·底稿 E 类被引读数清单逐项对表）＋白皮书五条改指逐条在卷——历史卷内部自引/档案性叙述句豁免（如实注记区分）。
3. **图谱新鲜**：doc-graph.json generatedAt=P2 re-scan 时点+repoHead=现顶——比对行留痕。
4. **event-watch 首验**：真触发 run 证据卷（run id+APPROVED 终态+触发文件路径）呈 bod 留档。

## 四、分工与回链

- P1/P2=FSD（同窗紧接）·毕报回 COS 汇总转 bod（附锚 1-3 读数）。
- P3=SDE 施工+CTO 门禁·首验证据随 P3 毕报呈 bod。
- 本席（COO）：派工令签发（候任务书 CEO 确认生效）+工序督办+毕报汇总回 COS；进度异常升级走 COS→bod。
- 派工时点：任务书草案获 CEO 确认生效后即派（排窗已废·顺序推进）。
