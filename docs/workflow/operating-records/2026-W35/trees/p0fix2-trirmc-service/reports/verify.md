# p0fix2-trirmc-service 修复验证记录

- 节点：p0fix2-trirmc-service / PC-T
- 角色：TestEngineer（小柯），fresh 派工，一次一节点
- tick：20260827T061216Z 起，PC-T 对抗复核落盘同日（2026-08-27）
- 审计真源：`docs/workflow/operating-records/2026-W35/trees/rmc-audit-cmp-001/reports/rmc-TriRMC.md`（P0-1/P0-2 = 发现清单第 5-6 条；审计 P0 计 3 项，本树修其中服务面两项，P0-3 归属 p0fix1 姊妹树同源治理线）
- 复核方式：无 Bash 三件套实例——Read 通读两处修复区全 diff 面 + 既有四件套手法对齐（internal-auth/routes/command-handler 三测试真源照抄装配）→ Edit 落盘两套对抗复现套件共 **23 例**（server 面 6 例 + cron 路由层 6 例 + 执行层 5 例 + 解析单元 6 例）→ 本报告六节。**全部用例未经运行**（工具面无 Bash），终值以编排层按 §2 等价口径重开门禁实测为准。

## 1. 两 P0 逐项核验（修复位置 × 审计向量 × 守护用例）

file:line 以 `/srv/fleet/TriRMC/src/` 为根，行号来自本实例 Read 输出（工作树 HEAD=e3545b7）。

### P0-1 runAs 提权面白名单化 — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | 单元层 `cron/command-handler.ts:48`（RUNAS_REJECT_PREFIX 常量）、`:55-63`（resolveRunAsAllowlist：env TRIRMC_RUNAS_ALLOWLIST 逗号分隔 trim 入集，空/未配置 ⇒ 空集）、`:66-68`（isRunAsAllowed 精确等值）；入口层 `cron/routes.ts:58-69`（validateCreateInput 尾部：runAs !== undefined 且非 string 或未命中 ⇒ 返回错误串走 400 bad_request）；执行层 `cron/command-handler.ts:124-136`（spawn 前 throw 同前缀错误）；HOME 推导后置 `:146-151`（通过校验后才注入 HOME=/home/<runAs>，杜绝未校验用户名进入推导模板） |
| 审计向量复现→被拒 | 向量 a 提权（宿主 root systemd 跑时任意 runAs 经 `runuser -u <u>` 直取目标身份）：allowlist 未配置 × 任意值 → 400/throw（route r1 / exec e1）；向量 b 越用户（runAs:'root' 以其身份跑任意 bash）→ route r2 / exec e2 双处被拒且 exec 层 spawnFn 零调用实证「绝不 spawn」 |
| 重放向量 | job-store 持久化 payload 与 PATCH 通道（P2-1 既有缺口，不过 createInput 校验）→ 执行层 :129-136 兜底 throw 兜住（exec e1-e4 死证零调用） |
| 语义保持锚 | runAs 缺省 undefined 直通（routes.test.ts 既有 fixture 全矩阵 + 新增 r6 显式 201 例）；合法主体 fleet 正向锚（r3 / exec e5 runuser 链 argv+HOME 断言，不真执行） |

### P0-2 /internal 鉴权 fail-open 反转 fail-closed — 已修复

| 项 | 内容 |
| --- | --- |
| 修复位置 | `server/app.ts:127-145`：token 读 env 后凡 `/internal/` 前缀**无条件进门**（:128，删除原空串短路跳过整个鉴权块的 fail-open 结构）；token 空 ⇒ 401 `{error:'internal_auth_disabled'}`（:129-133）；配置态缺头/错头 ⇒ 401 `unauthorized:*` 原形态（:134-144）；healthz 分支保持门前公开不变（:91-116） |
| 审计向量复现→被拒 | 「漏配即裸奔」：未配置 × 无头 → 401 internal_auth_disabled（failclosed-1）；未配置 × 错头 → 同样 internal_auth_disabled，证明未配置态连头比对都不发生、不存在残余旁路（failclosed-2）；两状态可区分（failclosed-4：配置态 401 为 unauthorized:* 且 ≠ internal_auth_disabled——审计明文要求） |
| 正向/外溢锚 | Bearer 正确形态 → 200（failclosed-6 + 既有套件同型）；healthz 未配置态 → 200（failclosed-3，门不外溢公开面） |
| 语义变化声明 | 既有 `test/server/internal-auth.test.ts`『未配置放行』用例已随修复反转为断言 401+internal_auth_disabled（文件头注释明示故意语义变化）——审计要求的故意破坏性变更，非误伤；原『配置后』四形态用例保留并在案双轮绿 |

## 2. 门禁命令形态与环境事实

- **环境事实**：node v18.20.8。package.json test=`node --import tsx --test test/**/*.test.ts`，node18/sh 无 globstar 下该 glob 仅展开两级目录文件（24 文件），根级受影响套件以 npm 追参形态显式补入同一轮运行：`npm test --prefix /srv/fleet/TriRMC -- test/chat-endpoint.test.ts test/http-agent-endpoint.test.ts test/agent-sse.test.ts`（log.md 披露在案）。
- **tsc 口径**：`npm run check`（tsconfig include 仅 src/**——测试面不进 tsc 门禁；故本节点两新套件的静态类型正确性不在 check 覆盖范围，如实申报于 §3⑦）。
- **依赖前置**：fresh clone 无 node_modules，门禁前需先 `npm install --prefix /srv/fleet/TriRMC`（tick 内 06:18Z 实测 116 包通过，EBADENGINE 警告非阻断）。
- **等价门禁口径含义**：与 package.json test script 的全量意图对齐的显式枚举运行，非逐字脚本重放；执行器为树内 `reports/gate-runner.mjs`（node 白名单形态 spawn 同一条 npm test 命令、原样捕获 stdout/stderr+退出码落盘 TAP，防 shell 重定向墙截尾丢汇总）。
- **五轮 TAP 存档清单**（reports/gate-logs/）：

| label | 内容 | 结果 |
| --- | --- | --- |
| pc1-round0-baseline.tap | pristine dev@671b4d4 stash 对照基线（对照法基准盘） | 3 fail＝tools-ctx-cwd 两 suite 三 subtests 环境性既有失败 |
| pc1-round1.tap | 修复落盘后首轮全量（e2e 漏判期） | 474 tests / 442 pass / 8 fail exit1 |
| pc1-round2-plusroots.tap | 根级三文件追参扩展口径复测（增差定位数据源） | +24 例全绿；增差 5 个全落 e2e real-model |
| pc1-round3-rework.tap | e2e token 注入返工后第一轮隔离 | # tests 474 / # suites 125 / # pass 471 / # fail 3 |
| pc1-round4-double.tap | 连续第二轮隔离复测 | 同上逐字稳定（duration ≈37.9s/41.1s） |

round3/round4 的末尾汇总行本节点已亲自复读 tap 文件原文实证；round0/1/2 数值取自编排层 state.json/log.md 记载（下轮重开时 gate-runner 会追加新 label 可再证）。

- **round0 基线对照法**：判定口径不是「零失败」而是「新增失败集为空」——修复后完整失败集 ∖ pristine 基线失败集 = 新增回归。本轮 round2 实测增差 5 个全落 e2e real-model 单文件 → 定位为漏判而非设计缺陷 → 返工后 round3/round4 失败集与基线逐字同型 ⇒ 零新增失败定谳。该方法使环境性既有失败（tools-ctx-cwd）不被误计为回归。
- **本节点新套件落位**：均位于 `test/server/` 与 `test/cron/` 子目录，恰落在默认两级 glob 展开面内，编排层重开门禁无需额外追参即被拾取；加入后总盘预期 474+23=497 tests（终值以实测为准）。

## 3. 残差清单（如实收录，按归属移交）

1. **TriRMC→GitHub push 凭据通道全空**（授权侧）：`git -C /srv/fleet/TriRMC push origin dev` 实测 `fatal: could not read Username for 'https://github.com'`——config credential.helper 缺失、~/.git-credentials/~/.netrc/~/.config/gh/GITHUB_TOKEN 类 env 四处探察全空（state.json push.triRMCGitHub 在案）。e3545b7 本地 commit 计进度（dev 领先 origin/dev 1），远端同步窗口由授权侧推送；属会话不可解非树内可修，不阻塞节点翻转（红线三如实留痕条款）。
2. **resolveRunAsAllowlist 每 job 实时读 env，无缓存亦无专门审计痕迹**（CTO/后续安全树）：拒绝事件仅经 throw 消息进 lastError/journal 文案，无结构化 security-event 日志（来源 IP、原始 body 指纹、命中/未命中 allowlist 快照）；高频探测与一次性事故不可回溯区分。建议后续加一次性 deny 日志通道。
3. **TRIRMC_RUNAS_ALLOWLIST 成为新增部署必需 env**（运维窗口/heyuan）：空配置下存量带 runAs 的 job 全部拒绝执行=fail-closed 既定代价。升级部署若不补配 env，存量周报类 job 将到点即失败（lastError=payload.runas not allowlisted）。heyuan 生产部署排除在本树外由人工窗口拉取重启（tree-op notes 在案），窗口操作者必须知悉此项并预配 'fleet'。
4. **PATCH 通道仍无 createInput 校验=P2-1 既有缺口**（CTO 排期）：PATCH jobs/{id} 可把 payload 改成带越权 runAs 的形状——入口层不拦，要到执行期（调度到点/手动 run）才在 handler throw 成 lastError 噪音；本轮 e1-e4 已死证兜底层绝不 spawn（安全性无损），但暴露时机滞后属体验/可观测残差。
5. **session-bridge 的 env.runAsUser（TRIRMC_RUNAS）不受白名单约束**（授权侧统一治理建议）：claude 会话降权账号仍走独立 env 无校验语义，与 cron 白名单是两套放行口径；建议后续树收敛为同一 allowlist 单元或显式分离治理文档，避免「改了 cron 忘了 bridge」的漂移复发（P0-3 同源教训=本地拷贝漂移即缺陷）。
6. **白名单仅做主体名精确等值，不校验系统用户存在性**（低危，知悉即可）：配置错拼用户名要到 spawn 时才由 runuser 报错失败；等值匹配不含大小写折叠/前缀宽松（u6 pin 锁死），无绕过原语，但缺配置校验辅助（启动时 warn 未知主体之类的友好性留后续）。
7. **tsc 门禁不含 test 面 + 本节点 23 例未经运行**（编排层门禁闭环动作）：check 仅覆盖 src/**；两新套件类型正确性与断言绿未经任何运行验证，须按 §2 等价口径重开门禁实测确认后方可视为生效（§5 附加条件主体）。
8. **e2e real-model 依赖真实模型凭据外呼**（既有环境事实照旧披露）：等价门禁含真实模型 API 调用（log.md 披露 STREAM deepseek-v4-pro 在案），门禁并非完全离线；模型凭据缺失环境下该套件行为另测，与本树无关但影响门禁可重复性认知。

## 4. PC-1 过程事实复盘与本节点增量

**复盘一句**：PC-1 首扫据 e2e real-model 文件注释误判「无 key 即 skip」而漏清扫，实际本机 TriModel dotenv 注入链使该套件真实起 app 走 HTTP、被新 fail-closed 门拦截翻红——最终靠编排层 stash 基线对照实测（修复后 8 fail vs pristine 3 fail，增差 5 全定位该单文件）抓出并同实例续接返工回绿；方法论价值固化为纪律：**门禁判定一律对 pristine 基线做失败集差分，不数绝对失败个数，且对「注释宣称 skip」的套件必须以实跑验证其真实性**。

**本节点新增两套件的零覆盖分支清点表**（23 例 vs 修复代码分支盘点；标注仅静态推演未经运行）：

| 分支（file:line） | 覆盖所有者 | 用例 |
| --- | --- | --- |
| resolveRunAsAllowlist env 缺省回退路径（command-handler.ts:56 右支） | 本节点 u1 | 空集语义根基 |
| source 参数注入优先于 env（:56 左支） | 本节点 u4 | 旁路优先级钉定 |
| trim+空段过滤正道（:59-61） | 本节点 u3/u5 | 保序集合 {fleet,root} / 清空收回 |
| isRunAsAllowed 精确等值含反变体（:66-68） | 本节点 u6 | fleets/Fleet/空串全拒（无前缀模式语义 pin） |
| routes runAs===undefined 直通（routes.ts:62 早退） | 既有 routes.test.ts fixture 语义覆盖 + 本节点 r6 显式化 | 一刀切封杀回归锚 |
| routes 非 string（:64） | 本节点 r4 | 数字不 String 化放行 |
| routes 未命中（:65-67） | 本节点 r1/r2/r5 | 空 env/越权 root/空串三态 |
| routes 合法放行 | 既有 fixture + 本节点 r3 | 201 落库带 runAs |
| 执行层 runAs undefined skip（command-handler.ts:129 早退） | 既有 command-handler.test.ts 五例（无 runAs 过新门） | 遗留隐式 |
| 执行层非 string（:131） | 本节点 e4 | 此前完全零覆盖分支 |
| 执行层未命中（:132-135） | 本节点 e1/e2/e3 | PATCH 重放向量死证（spawnFn 零调用） |
| HOME 推导后置有-runAs 支（:148-151） | 本节点 e5 | runuser argv 链 + env.HOME=/home/fleet |
| HOME 推导无-runAs 不注支 | 部分（遗留 succeed 用例只断 cwd/env 整体存活，不断言 HOME 缺席） | 低风险披露：详见下行 |
| app.ts token 空→401 disabled（:129-133） | 本节点 failclosed-1/-2 | 「漏配即零鉴权」死证两条 |
| app.ts 配置态 mismatch→unauthorized（:140-143） | 既有内部套件 + 本节点 failclosed-4/-5 | 与 disabled 态可区分 |
| app.ts Bearer/X-Internal-Token 提取正道（:134-139） | 既有内部套件 + 本节点 failclosed-6 | 正向锚 |
| app.ts 多值数组头提取支（:135-136 Array.isArray 分支） | 未覆盖——属修复前既有解析逻辑非本次 diff 新增，列为透明披露不阻塞 | — |
| healthz 公开面前置不外溢（:91 先于 :128） | 本节点 failclosed-3 | 公开面守恒 |

补充说明：上表「HOME 无-runAs 不注支」为本清点唯一发现的半覆盖点——若未来有人把条件展开改成无条件注 HOME，遗留 succeed 用例不会翻红；风险极低（仅进程用户场景 env 卫生问题），记录备查不动手改码（硬约束 src 只读）。

**诚实声明**：以上 23 例均为本 PC-T 实例仅经 Read/Edit 落盘的静态推演对抗增量，**全部未经运行**；474/471×2 终值不含它们，预期总盘 497 例。需编排层以相同等价口径（gate-runner.mjs，两级 glob 默认拾取+根级追参，先确认 npm install 就绪）重开门禁实测确认全绿后方可视为完全生效。

## 5. 结论判定

**PASS——两 P0 修复经逐行 Read 对照审计向量核验成立，各有分层复现用例守护（入口 400／执行层 throw 零 spawn／fail-closed 401 死证），既有等价套件 474/471 双轮隔离零新增失败，npm run check 干净。**

附加条件（不改变判定方向，改变生效时点）：

1. 本节点 23 例未经运行，终值以编排层按 §2 口径重开门禁（预期 497 例，失败集须与 round0 基线逐字同型）为准；
2. 残差 §3① push 凭据通道不阻塞翻转——树顶层 status 按红线四既定动作翻转为 done，push 侧事实由本条与 state.json push.triRMCGitHub 双处留痕，待授权侧推送同步 e3545b7；
3. §3③ 运维知悉义务：授权侧安排 heyuan 人工重启窗口前，须先补配 TRIRMC_RUNAS_ALLOWLIST='fleet' 并知悉存量带 runAs job 在空配置下的 fail-closed 全拒行为。

## 6. 使用依据

- 审计真源：rmc-audit-cmp-001/reports/rmc-TriRMC.md（发现 5-6 原文 file:line、触发场景、修复建议）
- 修复产物实测读源：src/cron/command-handler.ts（单元区 :37-68、执行层 :96-181）、src/cron/routes.ts（:36-71 校验体）、src/server/app.ts（:88-145 鉴权门区）、src/config/env.ts（TriMCEnv 契约参照）
- 回归套件读源：test/server/internal-auth.test.ts（反转后形态）、test/cron/routes.test.ts、test/cron/command-handler.test.ts（脚手架手法定版依据）；package.json（test/check 脚本与依赖）
- 编排层移交证据：state.json（基线勘察/predecessorSummary/nodes.verdictNote/push.triRMCGitHub）、log.md（动作序列+门禁等价口径披露）、reports/gate-runner.mjs 与 gate-logs/pc1-round{0..4}*.tap（round3/round4 末尾汇总行本实例复读实证）
- 姊妹树结构参照：p0fix1-agent-core-perm/reports/verify.md（六节骨架与方法论纪律沿用）
- 测试判断三分法依据：CTO 工程门禁框架内 PASS 判定 + 重开条件与运维知悉义务显式化
