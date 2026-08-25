# EXPER_ASSET：R 面首次自治执行体验——TriRLC headless 实例接树直执（五要素简版）

> 本文件为演练树 `rmc-drill-001` 节点 RD-1 产出（R 面自治演练；执行实例 = 河源 TriRLC headless R-face executor，agent 名义 CEOChiefOfStaff）。
> 依据：`experience/README.md` schema v0.1（2026-08-24 quadmig-1 Q1-3 冻结）。
> 五要素（触发场景/做法/验证证据/适用边界/成本收益）简版齐全；status=draft；未过 L3 签收，只落 staging/。

## 资产头（schema v0.1 字段）

- objectType: EXPER_ASSET
- objectId: rmc-first-run
- status: draft（append-only 状态机起点：draft → validated → consumed/deprecated）
- ownerRole: CEOChiefOfStaff（产出与持有）
- securityLevel: internal（不含 restricted 级原始数据——服务器 IP/密钥等敏感基础设施细节不入资产，仅以 commit/文件指针引用）

### producer（溯源必填，L1 门）

- treeId: rmc-drill-001
- nodeId: RD-1
- opRef: docs/workflow/operating-records/2026-W35/OP-202608-W35-001.json（W35 周经营维护索引，实存确认）

### payload（五要素简版，执行判断只采信本区）

- scenario（触发场景）:
  - RA-2 后端验证需求：R 面（fleet 服务器 TriRLC headless 实例）需证明可不经 M 面人工派工，直接接收编排树节点并自主执行到收口（写资产+置 done+commit+push）。
  - 具体触发：`rmc-drill-001` 单节点树 RD-1（2026-08-26 立项，commit 1de9cc92），action 为在 experience/staging/ 产出本资产并收口本树。
- method（做法，可复现步骤）:
  1. 读树定态：读取 `docs/workflow/operating-records/2026-W35/trees/rmc-drill-001/tree-op.json`，确认唯一 pending 节点 RD-1 与 doneCondition（staging 资产存在且树 status=done）；`git status -b` 确认分支 dev 与远端基线。
  2. 规约对齐：读 `experience/README.md` 与 staging 在库样例（exper-asset-fleet-headless-cc-m0.md），取 schema v0.1 字段与五要素口径，不凭记忆造格式。
  3. 锚点核验：对拟引用的每个短 hash 跑 `git rev-parse` 取全 hash（1de9cc92→1de9cc92059e051b8aa12c07eea69765ce3bb386、4fb7d25c→4fb7d25c27cc5899262354f386970868c8f61639），确认 OP 文件实存后才写入 evidence——引用先验证后落笔。
  4. 单遍原子收口：按节点 action 写本资产 → 树文件节点置 done、顶层 status 置 done → `git add` 仅限这两个显式路径 → 单 commit → `git push sg-bare HEAD:dev`（不加 force/rebase）。
- evidence（验证证据）:
  - 本资产即 RD-1 的执行产物本身（自指闭环）：其存在性+树 status=done 由收口 commit 一并落在 dev 分支并推达 sg-bare，可用 `git log -- experience/staging/rmc-first-run.md` 直接复核。
  - commits（全 hash 经 rev-parse 验证为 commit 对象）:
    - `1de9cc92059e051b8aa12c07eea69765ce3bb386`（1de9cc92）：rmc-drill-001 演练树立项 commit（本树 producer 溯源锚）。
    - `4fb7d25c27cc5899262354f386970868c8f61639`（4fb7d25c）：rmc-autonomy RA-1 收口 commit——河源 TriRLC headless 实例上线（systemd 常驻+控制链接通），即本次执行的宿主实证。
    - 收口 commit：见本文件入库时的 dev 分支最新提交（提交信息含 rmc-drill-001 收口字样），即"首次自治执行端到端完成"的最终凭证。
  - logs: 无外部日志工件；全程工具调用痕迹留在编排会话内，事实均以 git 可复核对象为准。
- boundary（适用边界）:
  - 适用：单节点、server-executable 域、产出与状态变更均可落 git 的演练树；执行体具备文件读写+git 三件套（add 显式路径/commit/push）能力。
  - 不适用：
    - 多节点依赖树（本树仅 RD-1 单节点，未验证跨节点断点续跑排序）；
    - 需要 shell 之外交互（浏览器/桌面）或 restricted 级数据的任务；
    - 远端不可达或分叉需 force 的场景（纪律上禁用 force/rebase，遇阻应标 blocked 而非硬推）；
    - CC/驱动版本演进可能改变 headless 会话行为，复用前需重锚（同 mmc-host-driver Q-02 口径）。
- costBenefit（成本收益）:
  - 避免的返工：跳过"M 面派工→R 面等待→人工回填状态"的三段往返，树状态变更与产物同一 commit 落盘，消灭"产物已写但树未收口"的悬挂态；hash 先 rev-parse 后引用，杜绝死链 evidence 进册。
  - 沉淀收益：RA-2 后端验证取得首个端到端正样本（TriRLC 接树→执行→收口全链路走通），为 R 面常态化接单与后续多节点树自治提供流程模板（读树→对规约→验锚→原子收口四步法）。

### narrative（自由文本，non-actionable: true）

本次执行为本仓记录的 R 面首次自治接树闭环：执行实例由 TriRLC headless 派出，全程未引入树外写入路径，git 操作限于 add 显式路径/commit/push sg-bare HEAD:dev。"首次"的边界如实限定为：本仓观测范围内、单节点演练树意义上的首次完整闭环，不宣称跨系统普遍首次。

### metadata

- schemaVersion: v0.1（五要素简版：要素齐全、每要素压缩至最小可审计集）
- shadow: true（影子期产出：只落 staging/，未过 §5.2 判据不进 confirmed/）
- signOffLine: 小贾线（编排类，experience/README.md L3 门映射）；draft 态签收未过
- domainRouting: server-executable（与树顶层一致）
