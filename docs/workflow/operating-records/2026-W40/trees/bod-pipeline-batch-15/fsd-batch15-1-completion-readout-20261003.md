# FSD·batch-15 件①完工读数卷（LG-053 恢复阶梯执行面·10-03 凌晨窗）

- sourceOfTruth: 本件（FSD batch-15 件①完工卷；令源=BOD 复工令 return-to-work-batch-15 2ec7dfe4+CEO 01:38 亲裁追认「照原任务书零变更复工」，COO 01:4x 四环转达）
- syncMode: static（施工毕自测全绿；STE 验证候派——毕报即触发）
- lastSyncedAt: 2026-10-03T02:19+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）
- 施工锚: TriCompany `scripts/ops/local/triladder.ps1`（312 行）+`scripts/ops/local/direct-probe.ps1`（125 行）——均未提交（commit 候 COO 收口批，与批 push 惯例一致）

## 一、实现方案

### triladder.ps1（阶梯执行面·四子命令单文件）

- **probe**：§一四态判定，双面制（healthz 进程面+功能探针业务面）。判定树：端口死→T-3（-Pid 带活进程核对=process-alive-port-dead 细分，否则 all-dead）；两绿=T-OK；功能探 5xx=T-1；401/403=T-2（**detail 两分**：probe-unauthenticated=探针未持令形 / auth-rejected=带令仍拒真 T-2）；healthz 异常但端口通=T-1 半可用心形。令面：-TokenKey 显式＞TRILC_INTERNAL_TOKEN（daemon 门族）＞TRIMODEL_API_TOKEN（网关门族）；-TokenHeader 支持 X-Internal-Token 裸值形（TriRLC/TriMLC app.ts 门优先头）与 Authorization Bearer 形。RESULT 结构化行+triladder-state.json 落痕。
- **a1 重启**：前置 probe 判 T-1/T-3 才触发（T-OK 拒=无触发条件；T-2 拒=指向开关/命令通道面非重启）；防环（意见书条款 2 细则 3）=watchdog-revive state＜5min 且 T-OK→拒触发；T-1 形 plan=token 门优雅停（POST /shutdown）+启动器拉活，T-3 形=直接拉活；-Execute 才真动作（默认 dry-run 安全侧）；P1 通报行输出（notify 链候接）；后置 probe 回归+5min 回归纪律注记。
- **a2 重建**：前置断言=回滚锚 declared 必填+值席判位必填（P2）；**配置面子件（restore-claude-config.ps1 调用吸收）与进程面子件（npm run build）并列显式分列**（意见书条款 1 修改①防覆盖误读）；-Execute 首发只跑 restore WhatIf 预览+带出 restore_exit（P2 判间留隙，不连发两面真动作）。
- **a3 回退**：前置=BOD 裁门必填（-BodGate，P3）+**bak JSON 合法校验**（意见书条款 1 合流定义）；-Execute 真回滚（写前现役再备份 a3-pre-*.bak）；git revert/拓扑维度=提示行不代执行（restore 面之外独立）；P4 双签注记。

### direct-probe.ps1（§四直连面探针·三段检）

预设形（presets/direct.json 键名+占位符检出=密钥卫生正形）→活体形（settings.json env 三键齐性+指纹 len+head4+tail4）→连通面（TCP+GET {base}/v1/models HTTP 状态）。只读零写；-Live 真推理候值席窗（成本面，本件未实现=如实标记）。

### 边界守约

R-HY 域零触（本机域形）；3333 退役面不入框架（§四）；零敏感值出机（探针/RESULT/卷全指纹形）；生产 daemon 零扰动（8711/8713 全程只读探；a1 真动作全 dry-run）。

## 二、实测读数（探活四态·六形全活体验证）

| 态 | 形 | 活体/fixture | 读数 |
| --- | --- | --- | --- |
| T-OK | both-green | 8713 TriMLC（X-Internal-Token 带令+/internal/v1/agents） | healthz=200 probe=200 both-green |
| T-1 | probe-5xx | fixture 503 服务（用后即焚） | healthz=200 probe=503 → T-1 |
| T-2 | probe-unauthenticated | 8711 TriRLC 无令探 | healthz=200 probe=401 |
| T-2 | auth-rejected | 8711 错令域探（8713 令值） | healthz=200 probe=401（令域分野实证：两 daemon 独立令域） |
| T-3 | all-dead | 8712（SSH 隧道终点位未起，BOD #140 迁移窗注记在 channel.cmd） | 全 unreachable |
| T-3 | process-alive-port-dead | 8798+活 pid | process-alive-port-dead |

### a1/a2/a3 系自测

- a1：T-OK 拒 ✓／T-2 拒（指向开关面）✓／T-3 dry-run plan（拉活单行）✓／T-1 fixture dry-run plan（shutdown+拉活两行）✓／**防环**：watchdog-revive＜5min+T-OK state → rejected exit 1 ✓
- a2：缺回滚锚 stderr+exit 2 ✓／dry-run plan 两子件并列 ✓／-Execute→restore WhatIf 集成链通（**restore 凭据健康门对仓库模板占位符形按设计拒切 FAIL code=2；活体 settings.json mtime 未动=零写面实证**；真窗需 -InjectKey 后）
- a3：缺 BodGate exit 2 ✓／坏 JSON bak rejected exit 1 ✓／dry-run plan ✓／**沙箱真回滚** executed：target=bak 内容+pre-backup 落盘 ✓
- 5.1 兼容：powershell.exe（PSModulePath 净化）probe 双形读数与 pwsh7 一致（8712 T-3/8713 T-OK，exit 0）✓
- direct-probe：**PASS**——preset 11 键+AUTH_TOKEN 占位符（密钥卫生正形）；live 三键齐非占位（指纹形）；连通 TCP=True+HTTP 200（open.bigmodel.cn/api/anthropic:443 直连）

### 自测中修复的实现缺陷（四条，均实测现形后修）

1. **[datetime] cast 丢 Z 的 UTC Kind**（钟面当本地→差出整时区 480min，防环永失效）→ 改 epoch 秒算龄。
2. **ConvertFrom-Json 自动转 ISO 串为 datetime 且 Kind 降级**（Unspecified），字符串 Parse 二次转换必漂 → 同上 epoch 修法收敛。
3. **EAP=Stop 下 Write-Error 抛 terminating 异常**，exit 2 永不到达（校验门失效）→ Fail helper（stderr+exit 2）8 处替换。
4. **a1 前置探针令源读错参数**（读 -ShutdownTokenEnvFile 应优先 -EnvFile）→ 修序。

## 三、验收锚逐条对表

| 验收锚 | 形 | 读数 |
| --- | --- | --- |
| A1-A3 阶梯逐级有实现 | triladder.ps1 四子命令 | a1/a2/a3 全实现+dry-run/校验门/沙箱真回滚全测（见上表） |
| 探活三态实测读数 | probe 活体+fixture | 四态六形全读数（超三态：T-健康/T-1/T-2 两形/T-3 两形） |
| 直连面通 | direct-probe PASS | preset+live+连通三段全绿（HTTP 200）；真推理 -Live 候值席窗（成本面，未实现如实标记） |
| STE 验证 | 候派 | 本卷即毕报触发件 |

## 四、技术债务标记

1. **restore-claude-config.ps1 在途 38 行 diff 不触**（M 状态+README.md M）：前窗 9-25 解冻窗收尾修复（O-1/O-2/O-3）未提交笔，本件零接触零依赖其未提交段（a2 吸收的=已提交 v2 接口 f887b27 形+工作树现形）；候其属窗收口。
2. **a2 真窗前置链**：restore 凭据健康门要求 -InjectKey 真钥注入后才能 WhatIf 预览（本窗实测=模板形拒切）——a2 真执行窗操作序=InjectKey→restore WhatIf 预览→进程面 build，候值席窗。
3. **P1 通报行**=本件输出载体（RESULT 行），notify 链（LG-036 通道）候接；watchdog 集成=state 文件 watchdog-revive 形约定（写点在 watchdog 侧，本工具只读+判定），候 watchdog 侧接线（LG-056 细则 3 完整闭环）。
4. **direct-probe -Live 真推理**未实现（成本面候值席窗批）；连通面即本件验收锚。
5. 8711 功能探路径用 /internal/v1/models 判 401 形=T-2 展示位；其健康态带令复探需 8711 令值（channel.cmd 形缺位，8711 启动器=裸 node 进程，令在进程 env），本件未取（零必要扰动）——T-OK 分支已由 8713 活体验证，分支逻辑同码路。

## 五、使用依据

- 任务书：LG-053 恢复阶梯正身 `bod-pipeline-batch-12/lg053-recovery-ladder-final.md`（v1.0 §一四态/§二阶梯/§三介入点/§四直连面）+CTO 接口意见书 `bod-pipeline-batch-13/lg053-interface-review.md`（条款 1 修改①②/条款 2 细则 3）
- 复工令链：BOD 2ec7dfe4+CEO 01:38 亲裁（COO 01:4x 四环）
- 实勘：TriMLC/TriRLC app.ts 门令键名（TRILC_INTERNAL_TOKEN+X-Internal-Token 优先）；TriMLC 路由表（/internal/v1/agents 等 GET 面）；channel.cmd 键名面（TRILC_INTERNAL_TOKEN 在列；8712 隧道位注记；TASK-TRIMODEL-RECOVERY-LADDER-01 wave2 allowlist 注记）
- 惯例继承：restore-claude-config.ps1 v2（RESULT 行/安全侧默认/占位符防呆/零值面纪律）
