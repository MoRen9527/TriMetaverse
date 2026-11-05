# source_publish_check 升 gate 形·FSD 施工勘定卷

- sourceOfTruth: 本卷（施工前勘定·落笔依据）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘定席: FSD 小全（CTO 施工令六要件·死线 11-06 上午前）

## 一 · 令面与裁定要点（施工输入）

- 裁定卷正身=`cto-window-ruling.md`（同树·b57338c8c）·CEO 裁③投递。
- 六要件：①触发面=发布面变更时 publish/release 链 pre-publish 点强制 manifest source 对表（链内强制非候检）②拦截=对表失败→阻断发布 fail-closed ③双形拦=A-1 形（发布面直改未回写真源）+AGENTS.md 形（副本改未回写真源）④defaultMode 升 gate+dry-run 显式降级（env/flag·防默认降级稀释闸语义）⑤CAO 衔接毕报注明 ⑥毕报四件套（施工 diff+拦截真触发验证+dry-run 降级验证+正常放行读数）。
- 背景实证：AGENTS.md 形勘平卷=TriCompany 739a015（「发布面新于真源向」=漏损方向原话）。

## 二 · 现役面勘定读数（活体实锚）

### 2.1 source_publish_check.py（4694 行）

| 面 | 现役形态 | 锚 |
|---|---|---|
| 对表核心 | `_publish_single_agent`：render payload（source+host template 渲染后 SHA-256）vs 发布面 hash 比对**已存在** | L1101-1311 |
| execute 形缺口 | hash 异→直接覆写 `action=updated`，零预检拦截——A-1 形静默丢稿洞 | L1286-1299 |
| dry-run 形 | drift→`derived_drift`（render）/`skipped_dry_run`（copy），**RC 仍 0**（观测形） | L1206·L1274 |
| 退出码语义 | `--publish-agents` 分支仅 `summary.errors>0`→RC1；derived_drift 不进 RC | main L3807-3824 |
| defaultMode | `dry_run: bool = True`（dataclass）+CLI `dry_run = not args.agent_execute`（L3808）——默认降级在役 | L426·L468·L1106·L1362 |
| sync 写链 | `_execute_sync` 对 out_of_sync 直 `shutil.copy2` 覆写，零方向判定——AGENTS.md 同族丢稿洞 | L2981-3018 |
| CLI 面 | `--publish-agents`/`--agent-execute`/`--host` 三值/--employees；`--agent-execute requires --publish-agents` 校验在 | build_parser L3039+ |
| envelope | mode 键=`"execute" if not report.dry_run else "dry-run"`；scope_specific.dry_run 布尔 | L1598·L1628 |
| import 面 | argparse/hashlib/json/os/re/shutil/**subprocess**/sys/time/dataclass/datetime/pathlib——git 调用零新依赖 | 头部 L28-41 |

### 2.2 employee_host_publish.py（374 行·canonical wrapper）

- 写链：`publish_declared_employee_host_assets()`（execute 分支 L122-148）——写支撑面 role/employee workspace README（TMV host-assets knowledge/ 下）+**源侧** binding profile（TriCompany 仓内）+manifest upsert。
- delegate：execute 分支末尾 subprocess 裸跑 `--publish-agents`（L300-346，注释自认 dry-run by default）——gate 化后随主命令 execute 意图真写。
- dry-run 分支（无 flag）投影不写盘（L149-158）。
- import 图：host_object_generation/employee_host_binding_profile_generation **已 import source_publish_check**（零循环风险·gate 函数可直接 import 复用）。

### 2.3 测试面（source_publish_check_validation.py·184 tests/27 classes）

- execute 形直测：`AgentPublishLogicTests`（L521·create/update×dry/execute 等约 40 测）。
- CLI 面：`AgentPublishBaseCLITests`（L1079·dry-run JSON/employees filter/execute requires 校验/combined）+`AgentPublishHostCLITests`（L3113）+`AgentPublishSessionHostCLITests`（L3659）。
- 合同面：`EnvelopeContractTests.test_action_vocabulary_is_contractual`（L1573）——**action 枚举是合同**，扩枚举须同步。
- fixture 形态：temp 目录造 manifest+文件（无 git）——gate fail-closed 下 execute 形测试须 fixture git init 或走显式降级通道。
- 门禁锚：全量 389 门 discover（`*_validation.py`）+host-publish 面 55/55（A4 锚同窗）。

## 三 · 施工设计（FSD 在 CTO 要件边界内的实现路径）

### 3.1 方向性判据（gate 核心·`_gate_classify_drift`）

对表失败的操作化定义——漂移条目（渲染 hash ≠ 发布面 hash）的方向判定：

1. **发布面 dirty**（`git status --porcelain` 按路径过滤非空，含 untracked）→ `block`——直改未落卷=A-1/AGENTS 形直改实锚。
2. **发布面新于真源向**（发布面文件最后 commit `%cI` > 源侧文件最后 commit）→ `block`——739a015 勘平方向语义直用（先回写真源再发布）。
3. **源侧新于发布面**（源侧 ts ≥ 发布面 ts）→ `allow`——源侧正常演进待传播=publish 本职，放行覆写。
4. **任一侧无 git 信息**（无仓/无历史）→ `block`——fail-closed：信息不足不放行（「宁过掩不放过」家族）。

时戳取 `%cI`（committer·指纹锚正形·同 hash 异日期先对字段教训在案）。跨仓（TriCompany↔TriMetaverse）各找各 git root（`_find_git_root` 向上遍历）。

### 3.2 挂接面（三条写链全闸·单函数内两循环保原子）

1. **agent 链**（source_publish_check `--publish-agents`）：`run_agent_publish` 内嵌两循环——先全 entries 对表+方向判定（零写盘），block 清单非空→**整 run 拒绝**（同 protected_target 先例「never partially executed」）RC1+gate 详情进报告；全 allow→第二循环真写。
2. **sync 链**（`--check --sync`）：`_execute_sync` 写前对 out_of_sync 逐条判定，block 非空→整 run 拒（synced 零条）+RC1+gate 明细进 change_summary。
3. **wrapper 链**（employee_host_publish `--execute`）：写支撑面 workspace README 前挂闸（同判据）；binding profile/manifest=源侧仓内生成物非发布面，不挂。dry-run 默认形态保留（--execute 本身=显式写意图，闸挂链内=合规要件①）。

### 3.3 defaultMode 升 gate（要件④·CLI 层）

- `--publish-agents` 裸跑 → **gate 模式**（对表+过闸真写）——默认行为从 dry-run 观测翻转，正是「防默认降级」令面本意。
- `--publish-agents --agent-execute` → 同 gate 模式（向后兼容别名·help 注明）。
- `--publish-agents --agent-dry-run`（新 flag·与 --agent-execute 对仗）→ 显式降级=观测不写（现役 dry-run 语义）。
- env `SOURCE_PUBLISH_CHECK_MODE=dry-run` → env 显式降级；优先级 flag > env > 默认 gate；`--agent-dry-run` 与 `--agent-execute` 同传→RC2。
- sync 面 dry-run=现役 `--check` 不带 `--sync`（观测保留·写意图本由 --sync flag 显式承载，无新 flag）。

### 3.4 报告面扩展

- action 枚举增 `gate_blocked`（合同面·EnvelopeContractTests 同步扩）。
- scope_specific 增 `gate` 键：`{enforced: bool, blocked: [{source,target,reason}], allowed_drift: N, checked: N}`；sync 面 change_summary 增同构 gate 键。
- 顶层 mode 键：gate 真写=`"gate"`（诚实区分无闸 execute 遗迹），dry-run 降级=`"dry-run"` 不变——消费者枚举断言施工时先 grep 对表。

## 四 · 风险与技术债标记（如实）

1. **裸 `--publish-agents` 语义翻转**（观测→gate 真写）——现役调用点施工时 grep 盘点并毕报披露；已知点=session-body 灌注命令族（带 --agent-execute·兼容）、wrapper delegate（execute 分支内·随闸）。
2. **TOCTOU 微窗**（判定与写之间）——单函数内两循环毫秒级窗，本机单席操作可接受。
3. **方向判据启发式边界**：同窗 commit/rebase 时戳扰动/同秒相等放行——宁拦勿放兜底；渲染面方向判定取 source 文件 ts（host template/session fragment 侧链变更归入源侧侧链·简化·候 refine）。
4. **dirty→block 对「上轮 publish 写盘未 commit」形态误拦**——正形指令=先落卷再发布（commit 零损失）；漏放成本=A-1 丢稿，fail-closed 选 block。
5. **AGENTS.md 本尊若不在自动写链内**=机械闸管不到（投影真源同步=文档流程）——纪律面兜底，CAO 衔接段注明。
6. **无 git 环境 execute 测试**（temp fixture）——fixture git init 或显式降级通道，测试改造随施工。

## 五 · 施工序

判据函数→agent 链内嵌→CLI mode 解析+flag→sync 链内嵌→wrapper 挂闸→action 枚举合同同步→测试改造+gate 新族→全量 389 门+host-publish 55/55→三验证（拦截真触发一发/dry-run 降级/正常放行）→毕报（CTO+CAO 衔接段）。

## 使用依据

- 裁定卷 cto-window-ruling.md（b57338c8c）·CEO 裁③投递链。
- source_publish_check.py L1101-1311/L1357-1565/L2981-3018/L3039-3158/L3600-3930 活体勘定。
- employee_host_publish.py 全文 374 行活体勘定。
- 勘平卷 TriCompany 739a015（方向语义原话锚）。
- source_publish_check_validation.py 类谱 grep 勘定。
