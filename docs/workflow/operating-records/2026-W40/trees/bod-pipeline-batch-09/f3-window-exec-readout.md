# F-3 修复窗执行读数卷（连夜赶工令 10-04 01:37·CEO 01:37 质询承转）

- 执行: m-duty-fsd（FD/sg 值席）；令=BOD 连夜赶工令（窗 NOW 开启，原 10-04 晚窗作废重排）
- **总判: F-3 修复码面已全数在库在推（本机 COS 执行笔），我席勘实确证+克隆自测过；余=8713 冷起+值面探针（dev face，本机 COS 链候 go）**

## 一、码面勘实（sg TriMLC clone @ dev==origin/dev 推平态）

| Part | 提交锚 | 内容 | 判 |
| --- | --- | --- | --- |
| Part A | **0fd9c6f**（09-30 03:49） | addJob INSERT 补 next_run_at 列+初值补算（try/catch 非法 schedule 保 NULL=不劣化） | ✓ 在库在推 |
| Part B | **a66b3b2**（10-02 00:01） | engine start 自愈回填存量 NULL next_run_at 行 | ✓ 在库在推 |
| 尾补 | **2b1709d**（10-03 03:57） | updateJobRun 尾补 saveCronStore（九调用点 .json backup 突变路径闭合；COALESCE 保 nextRunAt 卫生语义） | ✓ 在库在推，「生效候 8713 冷起窗带出」 |

- 三笔均 MoRen 身份（本机 COS 执行笔 e31278fd 派工产物）；origin/dev..dev=0（推平实证，dev 拉取链可达）
- 我席冗余笔已撤：batch-09 稿 Part B（armTimer 层第二自愈）与 a66b3b2（engine start 层）重复——checkout 撤除保单一正形 ✓

## 二、克隆自测（sg clone，node22+依赖新装 137 包）

- tsc 门（npm run check）: **0 错** ✓
- 全量: **194/190/4/0**——4 挂=TriMLC 孪生克隆既存族独立归因（auth-gate P0 healthz 形 1+FADE-005 roster×2+tui ink 1——TriRLC 同族缺陷在本 clone 未移植面，非 F-3 族；**cron 族全绿** ✓ F-3 修复面无涉）

## 三、余下工序（dev face，本机 COS 链——BOD NOW 窗 go 候发）

1. dev TriMLC 拉取（origin 推平态即含三笔）
2. 8713 冷起（禁裸杀，trilc stop/start 权威路径；pidfile per-port 先验=src/pidfile.ts）
3. 值面探针（#136 正形）: 临时 job POST→nextRun 非 NULL 断言→（短周期可选）lastRun 非 NULL→DELETE 清理；**存量六 job 复活断言**（Part B 自愈回填直证）
4. 进程内生效验证非仅 healthz 绿（BOD 令面）: cron 白名单照守+jobCount/degraded 双读数+探针值面三态谱
5. 修卷对表: 本卷+batch-09 补丁稿 566fd195（Part A/B 稿面与在库实现语义等价，实现形以在库两笔为准）

## 四、使用依据

sg TriMLC clone git 谱系（0fd9c6f/a66b3b2/2b1709d/ee5d7fe）；batch-09 补丁稿 566fd195；runbook 三裁后版（重启纪律/pidfile）；timer.ts:93/:132 机制链（batch-09 勘实）
