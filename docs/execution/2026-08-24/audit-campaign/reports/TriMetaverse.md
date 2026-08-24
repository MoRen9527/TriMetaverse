# AC-TMV 审计报告 — TriMetaverse（audit-campaign-001）

- 审计节点：AC-TMV（角色=TriMetaverseCodeRegistry 代码 registry 视角，fresh 单次实例）
- 目标仓：`/srv/fleet/TriMetaverse`（全程只读，除本报告外零写入）
- 日期：2026-08-25

## 一、概述

发现计数：**P0 = 0，P1 = 3，P2 = 7**。

两面审计结论：(A) scripts/ 约 57 个脚本中，e2e 框架（run-all + 14 suites + lib）结构清晰、有 dry/live 双模与破坏性 suite 后置排序等良好实践，但**跑批入口失败不改变退出码**、**公网 IP 硬编码为默认值并默认向线上发心跳**是两条高风险设计；PowerShell 侧 `SilentlyContinue` 吞错模式广泛（92 处/27 文件）。(B) `.claude`（18 文件）与 `.github`（22 文件）员工条目一一对应、description 无漂移，但 **tools 映射契约已实质漂移**：sync 脚本声明映射含 Grep/Write(/Bash)，而 `.claude` 侧 18 个文件全部停留在 `[Read, Glob, Edit]`；`.github` 侧另有 4 个 PascalCase 重复注册条目。未发现密钥/token 泄漏（sk-/ghp_/AKIA/PEM 等模式全仓扫描零命中）。

## 二、范围与方法

1. Glob 建立清单：`scripts/**/*`（57 项）、`.claude/agents/*.md`（18）、`.github/agents/*.agent.md`（22）。
2. 双宿主比对：逐文件提取 description/tools 行全文比对（Grep content 模式）；文件名级孤儿检测；`.github` 内部 PascalCase vs kebab 同名对检查。
3. 脚本按风险抽读：e2e 优先（run-all.js、lib/daemon-client.js、suites/02-reset.js 全文），配合全仓 Grep（端口/IP、Secrets 模式、SilentlyContinue 计数、curl 依赖）；可疑无扩展名文件（`scripts/delete`、`scripts/query`）直读。
4. 受沙箱限制，部分 shell 自动化 diff 未能执行，改以 Grep 证据链替代（见"未覆盖"）。

## 三、发现清单

### P0（安全 / 数据损坏 / 崩溃）

无实锤。密钥/token 扫描（`sk-`、`ghp_`、`AKIA`、PEM 私钥头等）在 scripts/ 下零命中。

### P1（功能缺陷或高风险设计）

1. **e2e 跑批失败仍 exit 0，且运行时错误被误标为"加载失败"**
   - 证据：`scripts/e2e/run-all.js:32-35`（catch 仅记 `load-error` 后继续下一 suite）、`scripts/e2e/run-all.js:37-40`（汇总后 main 正常返回，无非零退出路径）；live 模式下 `await entry()` 的运行时异常也落入同一 catch（`run-all.js:24-26`）。
   - 影响：CI/自动化无法凭退出码感知 e2e 失败，坏结果静默放行。
2. **公网 IP 硬编码为 e2e 默认值，缺省直接对线上 TriMC 发探测写请求**
   - 证据：`scripts/e2e/lib/daemon-client.js:6`（`TRIMC = ... || 'http://47.245.122.61:8710'`）、`scripts/e2e/lib/daemon-client.js:47`（heartbeat POST `{state:'degraded',...}` 默认打向该地址）。
   - 影响：未设 `E2E_TRIMC_URL` 的任何一次跑批都会向生产服务器写入探针状态；同时仓库公开暴露了基础设施地址与端口。
3. **双宿主 tools 映射契约漂移：`.claude` 侧全员缺 Grep/Write（及执行档的 Bash）**
   - 证据：`scripts/sync-agents-to-claude.mjs:22-25` 声明 `[read, search, edit] → [Read, Glob, Grep, Write, Edit]`、`[read, search, edit, execute] → [...+Bash]`；但 `.claude/agents/test-engineer.md:4` 等**全部 18 个文件**实际均为 `tools: [Read, Glob, Edit]`，而其源 `.github/agents/test-engineer.agent.md:4` 为 `[read, search, edit, execute]`（deployment-engineer、full-stack-developer、chief-technology-officer 同档）。
   - 影响：Claude 宿主 13 员工的工具面低于设计（无 Write 无法落盘、执行档无 Bash），现网 `.claude` 内容与同步脚本产物不一致——要么脚本未重跑、要么被手工改写，双源真值已破。

### P2（质量 / 可维护性）

1. **`.github/agents` 存在 4 个 PascalCase 重复注册条目**：`TriMetaverseCodeRegistry.agent.md`、`TriMetaverseProductRegistry.agent.md`、`TriMetaverseBusinessStrategyRegistry.agent.md`、`CompanyGovernanceRegistry.agent.md` 与对应 kebab 条目并存（description/tools 逐字相同，如 `.github/agents/TriMetaverseCodeRegistry.agent.md:3` vs `.github/agents/tri-metaverse-code-registry.agent.md:3`）；`sync-agents-to-claude.mjs:68-74` 会把两套都同步进 `.claude`，重跑即产生 4 个 kebab 新文件并造成命名混乱。
2. **伪 CLI 覆盖**：`scripts/e2e/suites/02-reset.js:36-39` 用例 E3-002 注释称测 CLI reset，实际复用同一 HTTP `daemon.reset`，CLI 路径零覆盖却记 pass。
3. **断言可静默跳过**：`scripts/e2e/suites/02-reset.js:65-68` `projectRegistry` 清空校验包在 `if (... !== undefined)` 内，字段缺失时用例照常 pass。
4. **杂散误提交文件**：`scripts/delete:1` 与 `scripts/query:1` 无扩展名、内容仅一行 "TriLC"，疑似命令重定向残留物。
5. **PowerShell 吞错惯性**：`-ErrorAction SilentlyContinue` 全仓 92 处/27 文件；其中含删除/杀进程等有副作用操作，如 `scripts/install-tricade.ps1:170-172`（Stop-Process -Force 静默失败）与 `scripts/install-tricade.ps1:365`（Remove-Item -Recurse -Force 静默失败），清理失败不可见。
6. **结果回写无容错**：`scripts/e2e/lib/daemon-client.js:61` `flushResults` 直接 `readFileSync(SUITE_PATH)`，`docs/execution/e2e-test-suite.json` 缺失或损坏时整套用例结果丢失且报错晦涩。
7. **跨平台/端口假设**：`scripts/dev-reset-init.mjs:93` 依赖 PATH 中的 `curl`（Windows 老环境无 curl.exe 即崩）；`http://127.0.0.1:8711` 端口字面量散布十余个 ps1（如 `scripts/fix-nssm-paused.ps1:53`、`scripts/verify-nssm-service.ps1:85`），改端口需全量手改（仅 e2e 侧提供 `E2E_TRILC_URL` 覆盖）。

## 四、质量总评

整体工程素养中上：e2e 有统一 runner、dry/live 分级、破坏性 suite 显式后置（`run-all.js:9` 注释记录了首轮教训）、断言库与结果回写分层清晰；agent 双宿主发布有专门 sync 工具并在头部文档化四类历史问题修复。但三条主线风险一致指向"自动化可信度"：runner 不回报失败、测试默认打生产、`.claude` 工具声明与生成器脱节——当前 e2e 结果与 Claude 宿主员工能力面都不能按表面采信。建议优先级：先修 run-all 退出码与 TRIMC 默认值（改为必填 env 或 dry 断言），再重跑 sync-agents-to-claude 收敛 tools 漂移并删除 `.github` 侧 4 个重复条目。

## 五、未覆盖

- `.github` 与 `.claude` 对应文件的**正文（frontmatter 之后）逐字节比对**因沙箱拦截内联 diff/node 未完成，本次仅核实 name/description/tools 三字段一致性。
- e2e suites 仅全文精读 `02-reset.js`；`01-init-chain`、`03-sync`、`04-git`、`05-concurrent`、`06-failure`、`07-cross-reset`、`08-verify`、`09-agents-conflict`、`10-portability`、`11-maintainability`、`12-desktop-gui`、`13-activation`、`14-final-push` 及 `gui/desktop_gui_test.py` 未逐行审读。
- 17 个版本化 `install-tricade-0.x.ps1` 仅做模式扫描（端口/吞错/Secrets），未逐行审读幂等性；`git-six-repo-*`、`export-*`、`hot-swap-*`、`journal-cli.mjs`、`sync_validator.py`、`migrate-*.mjs`、`pack-pc/*`、`build-desktop.ps1`、`validate-declarations.ps1` 等未读。
- 幂等性结论仅基于已读样本归纳，未做运行验证。

## 附：实际读过的关键文件清单

- `/srv/fleet/TriMetaverse/scripts/e2e/run-all.js`
- `/srv/fleet/TriMetaverse/scripts/e2e/lib/daemon-client.js`
- `/srv/fleet/TriMetaverse/scripts/e2e/suites/02-reset.js`
- `/srv/fleet/TriMetaverse/scripts/sync-agents-to-claude.mjs`
- `/srv/fleet/TriMetaverse/scripts/delete`、`/srv/fleet/TriMetaverse/scripts/query`
- `/srv/fleet/TriMetaverse/scripts/install-tricade.ps1`（grep 定位片段）
- `.claude/agents/*.md` 18 个与 `.github/agents/*.agent.md` 22 个的 frontmatter 字段（name/description/tools 全量 grep 比对）
