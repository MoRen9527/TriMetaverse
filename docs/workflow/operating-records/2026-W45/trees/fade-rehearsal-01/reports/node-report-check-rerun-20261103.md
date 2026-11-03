# node-report-check 补机跑读数卷（T6 勘窗·双门 exit 0 实锚）

- sourceOfTruth: 本卷（node-report-check-rerun-20261103.md）
- syncMode: static（CEO 22:29 口谕令一④即办·T6 补机跑读数留痕）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（校验器实现+双门补验）
- 法条正身: TriCompany/docs/engineering/fade-protocol-spec.md §2.7「执行与校验」（v1.4.1 联审强制·CTO-F1——置 done 前必须运行 node-report-check·exit≠0 不得翻转·编排层收口全节点复跑双门）

## §一 校验器落地

- 实现=`scripts/node_report_check.py`（**015bab659@dev**·2026-11-03T22:36:24+08 落卷）：九键机读核心结构门（nodeId/agent/startedAt/finishedAt/baselineCommit/trigger/actions/artifacts/gateResults）+三数组非空+时戳 ISO-8601 形态+nodeId 非空；协议管不变量实例管载体——额外键（actionsTimeNote 等）不校不禁。
- 载体决策：现役全 D:\Code\ai 零实现（fix-restore 分支仅历史文档提及·无实现件）——按法条直接新写（法条规格自足），落 scripts/ 与 doc-graph-scan.py 同族同位。
- D-65 CLI 五查自证：argparse ✓ / --bad-flag 拒显 ✓ / --help RC=0 ✓ / exit code（0 过·1 任一 FAIL·2 用法错·noargs 实测 RC=2）✓ / 副作用守卫=零写面纯读 ✓。

## §二 双门补机跑读数（22:35 轮）

| 门 | 跑法 | 读数 | RC |
| --- | --- | --- | --- |
| 门1（单节点门·补跑） | 六份批量一次跑（check_report 逐份调用·与逐次单跑等价·纯函数） | **6/6 PASS**（A-N1/A-N2/A-N3/B-N1/B-N2/B-N3 全过） | **0** |
| 门2（编排层复跑门） | `--tree-dir reports/` 全目录 node-*.md 复扫 | **6/6 PASS** | **0** |
| 负路径自测（校验器有效性） | 造缺键件（仅 nodeId 一键） | FAIL+缺 8 键明细全抓 | **1** |

- 时点锚：门2 22:34 轮 / 门1+负路径 22:35:34 轮（date 现查 2026-11-03T22:35:34+0800）。
- 形态如实注：两门均系**收口后追认性补机跑**（原翻转时点双门未机跑=divergence 已如实留证于 score-evidence-cli.md T6 行·本次补验不 retro-active 洗白原缺口·只证「六报告结构门现在跑得过」）。

## §三 T6 追认判定（按令文）

- CEO 令文判据「双门 exit 0 后→T6 追认 7/7·总分追认 99.5」——**判据面（双门 exit 0）实锚达成** ✓。
- T6=7/7·总分=99.5 的批卷卷面回填：score-evidence-cli.md 批卷卷面归属 CAO 面（毕报勘窗清单 owner）——本卷供证据锚，回填候 CAO 对表落卷（域界注）。

## §四 三送

COS（令一④毕报汇总转 bod）·CAO（批卷卷面回填锚）。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）
