# source_publish_check 升 gate 形·FSD 施工毕报

- sourceOfTruth: 本卷（施工毕报·CTO 要件⑥四件套+CAO 衔接段⑤）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: FSD 小全（CTO 施工令六要件·裁定卷 b57338c8c·死线 11-06 上午前=提前达）

## 一 · 施工 diff（要件⑥-①）

TriCompany 仓 5 文件 795 insertions / 62 deletions（勘定卷=fsd-gate-recon.md 同树）：

| 文件 | 变更 |
|---|---|
| `runtime/cognition/source_publish_check.py` | +382 行——gate 核心：`_find_git_root`/`_git_file_dirty`（porcelain 含 untracked·fail-closed）/`_git_file_commit_ts`（%cI）/`_gate_classify_drift`（方向判据四规则）/`resolve_agent_publish_mode`（flag>env>默认 gate·互斥 RC2）；`_publish_single_agent` gate 分支（判定遍零写盘）；`run_agent_publish` 拆 `_run_agent_publish_pass` 两遍编排（整 run 原子·gate_blocked 非空全拒）；`_execute_sync` gate=True 默认 pre-write 判定（sync 链挂闸）；CLI `--agent-dry-run` 新 flag+mode 解析；序列化 mode/gate_blocked/scope_specific.gate；main 互斥裁决归 resolve 层单点（RC2·依赖校验段不重复） |
| `runtime/cognition/employee_host_publish.py` | +113 行——wrapper execute 链挂闸：`_gate_check_support_surfaces`（支撑面 role/employee workspace README 方向判定·判据复用 `_gate_classify_drift`·source 锚=host_object_generation 定义文件）；gate block→整 run 拒绝零写盘零 delegate |
| `runtime/cognition/employee_onboard.py` | +4 行——stage_6 readiness 裸跑翻转会破坏观测意图→显式 `--agent-dry-run` 保留观测语义 |
| `runtime/cognition/source_publish_check_validation.py` | +349 行——6 既有观测测试显式 `--agent-dry-run`+`PublishGateTests` 新族 10 测试（block committed/dirty·allow 源侧演进·flag 降级·env 降级·env 未识别落前·互斥 RC2·dry-run requires·sync 双向）+git fixture helpers 三件套（显式时戳 env·check=True 防静默失败） |
| `runtime/cognition/employee_host_publish_validation.py` | A4 顺手件（裁定卷 a4/cto-ruling.md）：期望谱 13→14（tuple 补 product-manager+两计数）·独立锚设计保留·零派生化 |

## 二 · 三验证读数（要件⑥-②③④·活体 CLI 实跑一发·temp fixture）

```
VERIFY-1 gate-block: rc=1 mode=gate status=fail gate_blocked=1 reason=gate_target_newer_than_source
VERIFY-1 manual-value-intact=True          ← 构造发布面直改 commit 新于真源→真阻断·手工值原样在盘
VERIFY-2 dry-run-downgrade: rc=0 mode=dry-run dry_run=True intact=True
                                           ← 同 drift 形显式降级通道→零写盘观测
VERIFY-3 allow: rc=0 mode=gate status=pass gate_blocked=0 updated=1 allowed_drift=1
VERIFY-3 live-carries-source-payload=True  ← 源侧演进晚 commit→放行 gate 真写
```

## 三 · 自测读数（自测即门禁）

- `source_publish_check_validation`：**194 tests / 2 失败**（两件=SeatsPipelineValidation 既有·见五）
- `employee_host_publish_validation`：**5/5 OK**（A4 手改后全绿·55/55 锚语义达成）
- `PublishGateTests`：**10/10 OK**
- 全量 discover（`*_validation.py`）：**420 tests / 4 failures / 1 skip**——4 件全部既有（stash 基线实证·见五）·施工域零失败

## 四 · CAO 衔接段（要件⑤）

- **闸覆盖面（机械闸在役）**：三条自动写链全挂——agent 链（`--publish-agents`·defaultMode=gate）、sync 链（`--check --sync`）、wrapper 链（`employee_host_publish --execute`）。上轮写盘未 commit 形态同样 block——正形指令=先落卷再发布。
- **AGENTS.md 本尊投影链不在自动写链内**=机械闸管不到（本尊同步=文档流程·纪律面兜底）——勘定卷技术债⑤·候 CAO 窗勘补（如纳入「AGENTS.md 变更须回写真源」条款显式化）。
- **方向判据语义**：发布面 dirty→block／发布面 commit 新于真源→block（739a015 勘平语义）／源侧新于/等龄→allow（publish 本职）／无 git 信息→block（fail-closed）。
- 降级通道=显式声明制：`--agent-dry-run` flag 或 env `SOURCE_PUBLISH_CHECK_MODE=dry-run`（唯一合法值·未识别值落前 gate+stderr 警告）。

## 五 · 既有失败归因（stash 基线实证·非本施工引起）

施工件 stash 后纯基线复跑 3 件同炸（实证在案）：`frontmatter_parity`（product-manager 席位变更传播面漂移）／`lg025_manifest_value_prefix`／`SeatsPipelineValidation` 两件（sessionBody 席位漂移+claudeCodeTargets 15!=14 登记数）——**席位谱活体漂移族**·同 A4 治本段语义（席位变更时期望谱随动缺环）·候 CHO/管线窗。另注：Windows GBK stderr 中文输出会被 utf-8 母进程解码炸（施工中 gate 提示文案汉字一例已改全英文·截断伪影家族在案）。

## 六 · 技术债标记（勘定卷 §四 全谱引用·新增两项）

1-6 见勘定卷 fsd-gate-recon.md §四（裸跑语义翻转/TOCTOU/时戳启发式边界/dirty 误拦正形/AGENTS 本尊纪律兜底/fixture git 化）。新增：
7. **main 依赖校验段与 resolve 层原双裁决点 RC 分叉**（1 vs 2）——施工中已收口归 resolve 单点（RC2）·测试互踩坑实证。
8. **席位谱漂移族 4 件既有失败**持续红在 389 门——A4 治本段（席位变更流程补项·候 CHO）落位前每窗全量回归需重新分拣归因（本卷第五段为最新归因锚）。

## 使用依据

- CTO 施工令六要件（裁定卷 cto-window-ruling.md·b57338c8c）+死线勘补令。
- 勘定卷 fsd-gate-recon.md（同树·施工前活体勘定）。
- A4 裁定卷 `../a4-test-expectation-debt/cto-ruling.md`（顺手件语义）。
- TriCompany 739a015 勘平卷（发布面新于真源向语义原话锚）。
- 活体三验证脚本=temp 独立目录（`gate_verify_20261105.py`·非仓内）。
