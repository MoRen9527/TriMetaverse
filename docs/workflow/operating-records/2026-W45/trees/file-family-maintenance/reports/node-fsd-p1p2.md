# node-fsd-p1p2 · 根目录 md 治理 P1 迁移+P2 引用面同步节点收口报告

```json
{
  "nodeId": "node-fsd-p1p2",
  "agent": "FSD",
  "startedAt": "2026-11-04T11:16:48+08:00",
  "finishedAt": "2026-11-04T11:40:33+08:00",
  "baselineCommit": "TMV@dev 37aa2aadd（P1 前现顶）",
  "trigger": "COO 小营 排期单 v1.1 派工（startedAt=派工令落款原值·COS 流转 11:15:05·CEO 批令 11:09 任务书生效 7a7a1a07e·coo-dispatch-plan-v1.0.md·P1/P2 owner=FSD 同窗紧接·毕报回 COS 汇总转 bod 附锚 1-3 读数）",
  "actions": [
    "P1 迁移段（TMV 6730bfd85）: 25 件 git mv 保历史平铺不改名——A 组 23→docs/archive/（phase 系 10+runbook 2+github-app+90天+arch-storage-migration+价值流动新旧+tmv-phase-1+trimetaverse+落地方案+链基础选型+灵感记录+元宇宙学院）·B 组 2→docs/execution/（以太坊私链部署+copilot-cli）·R 断言 25 条（similarity 93-100%）·注记三处随迁（链基础=结论时点 2026-02 现役链面候重估/以太坊=场景休眠方法有效/copilot-cli=2026-07-19 验证候复验）·meta-recognition/ 清空删除",
    "P2 白皮书五条（7cf34062f）: ①两处「详见 三元宇宙价值流动.md」→内章自指形（原基线件内容已收编·历史卷注）②L1294 meta-三占位补齐待办行删③C.1 四行改指 docs/archive/④附录D 文件清单五件改指（含补漏 trimetaverse 行）⑤三占位行删+尾句如实化「meta-三篇占位件 2026-11-04 随根目录治理销项」",
    "P2 改链真手面九件十二处（7cf34062f）: AGENTS×2/prd README/ISSUE_WORKFLOW×2/mermaid README/refactor-master-plan/执行轮次参考模板×2/PRD001×2/workflow-engine-config.example.yaml——底稿 E 类读数逐项对表·全部指向 docs/archive/（历史卷注随形）",
    "P2 D3 销项: meta-reality/meta-recognition/meta-virtuality 三件 git rm（全 0B·bod 无异议+CPO 无保留）——delete 随 SDE 侦察卷 99b4b58d7 互踩入链（暂存面实录·SDE 信 2026-11-04T03:24:39Z 自领·技术面零损不 revert 不 amend·毕报锚引 99b4b58d7 --stat 3 delete 在卷）",
    "P2 doc-graph re-scan: scripts/doc-graph-scan.py 全量刷新 files=334 internal_edges=672 external_files=79 repoHead=7cd2b49b4（scan 时现顶）——含于 P2 commit 7cf34062f（commit 后 HEAD 递进一档=预期自指差·如实注记）",
    "断链终验: git-tracked 1236 files 全谱裸名扫（26 pattern=25 迁移件+meta-recognition/ 目录面+销项 3 件）·链接形态剥离后裸名残留=0 PASS"
  ],
  "artifacts": [
    "TMV 6730bfd85: P1 迁移 25 件+注记三处+meta-recognition/ 删除（R 断言 25 条）",
    "TMV 99b4b58d7: 销项 3 delete（SDE 侦察卷互踩入链·实录见 SDE 信）",
    "TMV 7cf34062f: P2 白皮书五条+改链九件十二处+doc-graph re-scan（10 files +292/-314）",
    "reports/node-fsd-p1p2.md（本报告）"
  ],
  "gateResults": [
    {"gate": "验收锚1 根目录残留对表", "result": "PASS", "detail": "根目录 md 恰 3 件=AGENTS/CLAUDE/README（ls 现勘·finishedAt 时点）+meta-recognition/ 目录 NOT-EXIST——3 留根+25 迁移+3 销项=全谱 31 件清零在卷"},
    {"gate": "验收锚2 断链断言", "result": "PASS", "detail": "git-tracked 1236 files 裸名残留 0（26 pattern 全谱·docs/archive//docs/execution/ 链接形态视为合法改指）——豁免面如实注记：docs/archive/ 历史卷内部自引（迁入件互引=历史卷常态）+docs/workflow/operating-records/ 记录面叙事+docs/runs/ 历史执行卷 12 处叙事句（run-R01×3/R02×5/R03×2/R04×2·2026-02/03 时点执行记录=档案性叙述·历史叙事冻结纪律不动卷）+docs/doc-graph.json re-scan 机械面"},
    {"gate": "验收锚3 图谱新鲜", "result": "PASS", "detail": "doc-graph.json generatedAt=2026-11-04T11:32:06+08:00（re-scan 时点现查原值）+repoHead=7cd2b49b4（scan 时现顶）——P2 commit 7cf34062f 收编（含后 HEAD=7cf34062f 递进一档=commit 包含自身的自指差·预期形态如实注记）"},
    {"gate": "白皮书五条逐条在卷", "result": "PASS", "detail": "内章自指×2 在卷+C.1 四行 docs/archive/ 在卷+候重估注在卷+附录D 五件改指在卷（含 trimetaverse 补漏行）+销项尾句在卷+旧「补齐」待办行零残留"},
    {"gate": "git mv 保历史", "result": "PASS", "detail": "P1 commit R 断言 25 条（git log --diff-filter=R·similarity 93-100%）+平铺不改名（先例 tricompany-v0.1-design）"},
    {"gate": "纪律面", "result": "PASS", "detail": "写后即 commit 锁笔（P1/P2 两笔）·D-47 卷面时戳=写前现查粘贴零手打·共享 index 纪律（显式文件清单 add 非 add -A·防并行席互踩复发）·销项互踩实录如实入卷不遮"} 
  ]
}
```

## 实现方案

P1 迁移形=git mv 保历史（R100 断言·注记件 93-98%）+注记三处按 archive/execution 现惯例（标题后缀+quote 注记块）。P2 引用面形=底稿 E 类读数逐项对表，引用面分类三法：doc-graph.json 全归 re-scan 机械面（零手改）·真手改面逐处判（现役/真源面改链+档案性叙述句豁免）·html 渲染物标题字面豁免。断链终验判据=裸名残留（链接形态 docs/archive//docs/execution/ 前缀剥离后）——子串假阳性两轮迭代后定型。

## 异常与处置

1. **销项暂存物被 SDE commit 互踩带入**（99b4b58d7·11:23:39）：SDE 自领认领+不 revert 不 amend 处置（重写风险>记账微瑕）——采认，毕报锚改引 99b4b58d7 --stat（3 delete 在卷），本席后续共享窗 add 前暂存面三查加严。
2. **断链扫两轮假阳性修正**：裸文件名 pattern 会命中 docs/archive/ 新路径子串——终验判据改为链接形态剥离后再断言裸名（两轮迭代 self-caught）。
3. **E 类读数与现勘差异如实**：令面 arch-storage 20 处 vs 现勘 tracked 面命中面 34 行（含新路径合法命中 17+真残留 15+豁免 runs 面外延）——底稿读数为 CPO 勘时点快照，本席全谱复扫覆盖面为准，逐处定性留痕（本报告 gateResults 锚 2）。

## 断点交接

- P1/P2 毕（6730bfd85+7cf34062f+99b4b58d7 三锚）·毕报回 COS（收口）+抄 COO（督办读数）随本报告同窗发出。
- P3 event-watch 接入 owner=SDE 施工+CTO 门禁（排期单 §P3·引用 TriMLC watch.ts c52f5bc fail-closed 三键+受控重启链）——前置 P1/P2 毕已满足。
- doc-graph repoHead 自指差：下轮 re-scan 自然对齐（机械面惯例）。

## 自测结果

- 验收锚 1-3 全 PASS（读数见 gateResults·现勘时点=finishedAt）。
- 白皮书五条逐条在卷断言 PASS；断链终验 1236 files 裸名 0 PASS。

## 技术债务标记

1. runs/ 历史执行卷 12 处裸名叙事句为已知豁免面（如实注记·不动卷）——若未来 runs/ 入 archive 族迁移窗可随批改链。
2. doc-graph repoHead 自指差为机械面常态（每轮 re-scan 对齐）。
3. html 渲染物标题字面（三元宇宙价值流动.html）豁免在案——html 重渲窗自然消解。

## 使用依据

- 排期单正身：`file-family-maintenance/coo-dispatch-plan-v1.0.md` v1.1（映射终稿四组/工序 P1-P3/验收锚四条/分工回链）
- 令源：CEO 2026-11-04 10:30:13 亲令（任务书生效 7a7a1a07e·COS 流转 11:15:05·COO 派工 11:16:48）
- 底稿：draft-ceo-bod-session-20261102.md 意见㊻ E 类 L536-540（断链全清单）+意见㊼
- 判据线：CPO 供（叙事件→A 历史卷·操作规程→B 现役参考位+注记）
