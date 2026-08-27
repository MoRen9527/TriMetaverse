# 白班排期：P0 审计修复 ×9 与 TriLC 双线合并

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-27/p0-fix-and-trilc-merge-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-08-27
- 文档版本: v1.0（2026-08-27 凌晨战役收口后补立，供白班排期）
- 事实来源：四份审计报告（file:line 均经编排侧抽验属实）

## 一、九项 P0 清单（核准自原始报告）

| # | 模块 | 缺陷 | 位置 | 来源 |
| --- | --- | --- | --- | --- |
| 1 | agent-core | 路径边界校验前缀混淆+目录穿越双重绕过 | packages/agent-core/src（decision-pipeline 等，报告 :19 起） | rmc-agent-core.md P0-1 |
| 2 | agent-core | acceptEdits 把 shell_exec 及一切非文件写入工具免确认放行 | decision-pipeline.ts:226-232 | rmc-agent-core.md P0-2 |
| 3 | agent-core | 规则内容匹配退化为序列化全文子串匹配 → allow 规则可子串注入绕过 | decision-pipeline.ts:215 | rmc-agent-core.md P0-3 |
| 4 | agent-core | spawnAgent 丢弃全部权限配置，子代理恒 bypassPermissions 无 cwd 边界 | spawn.ts:31-39 | rmc-agent-core.md P0-4 |
| 5 | TriRMC | cron 载荷 runAs 字段无校验 → 反用为提权/任意用户执行 | src/command-handler.ts:85 | rmc-TriRMC.md P0-1 |
| 6 | TriRMC | /internal/* 鉴权 fail-open（token 未配置=零鉴权，含 cron RCE 面） | src/app.ts:121-122 | rmc-TriRMC.md P0-2 |
| 7 | TriRMC | 权限规则子串匹配绕过（#3 的 TriRMC 本地拷贝同源缺陷） | decision-pipeline.ts:100-108 | rmc-TriRMC.md P0-3 |
| 8 | TriLC | 全 HTTP 面零认证+暴露三条命令执行通道（cron command/MCP add/默认 bypass 流）+无 Host 校验可被 DNS rebinding 远程触达 | server/app.ts 等（heyuan 实装绑定 127.0.0.1 为部分缓解） | rmc-TriLC.md P0-1（精修版归并条目） |
| 9 | TriModel | stream() 流中途 fallback 静默拼接两个模型输出流，文本与工具增量均损坏 | providers/client 路径 client.ts chat/stream 双实现区（报告 :20 起） | rmc-TriModel.md P0-1 |

**修正记录**：本清单取代我方此前口头口径两处——TriLC 精修版将原 R3 四个 P0 归并为 1 条集群项；TriModel「上游密钥明文分发」定级为 P1（keys.ts:97-107），非 P0。

### 修复批次建议（同源归并，先真源后拷贝）

| 批 | 内容 | 要点 |
| --- | --- | --- |
| A 权限引擎硬化 | #1 #3 #7 | 先修 agent-core 真源（前缀边界改 real-path 解析；内容匹配改结构化语义匹配）；TriRMC 本地拷贝随修随同步。最小化原则：严化匹配不得破坏既有 allow 清单语义，逐条回归既有权限测试 |
| B 工具放行与子代理隔离 | #2 #4 | acceptEdits 只豁免白名单写入类工具；spawnAgent 透传 loopOptions.permissionMode/cwd 并缺省继承父级 |
| C TriRMC 服务面 | #5 #6 | runAs 白名单（仅 fleet）+token 未配置即拒绝启动或拒绝路由（fail-closed） |
| D TriLC HTTP 面 | #8 | X-Internal-Token 全局门（对齐 TriMMC 已有实现 trimc-auth 模式）+Origin/Host 校验+cron command 白名单化；分两步走避免打断 heyuan 生产周迁移链路（生产窗口外部署） |

#### 批 D 生产升级运行手册（2026-08-27 增补——p0fix3 落库后生效，升级即必读）

新代码将 `/healthz` 外全部路由置于 `TRILC_INTERNAL_TOKEN` 门后。**不配 token 直接重启=非 healthz 全线 401**（含 rmc_tick→TriRLC 的 `/v1/messages`）。四步：

1. **生成 token**（两端各一把，openssl rand -hex 32）
2. **服务端配置**：heyuan `/srv/fleet/TriLC/.env` 追加 `TRILC_INTERNAL_TOKEN=<rm-token>`；本机 daemon 同理加用户级 env 或 .env
3. **调用方适配**：`TriRMC/scripts/rmc_tick.py` 的 `TRILC_MESSAGES` 请求头补 `X-Internal-Token`（读同源 env）；本地 CLI/TUI 调用面同步
4. **验收序列**：配置后重启 → curl 无头打 `/v1/messages` 应 401 → 带 token 应业务可达 → 触发一次 rmc_tick dry-run 通链

注意语义差异：本面为 fail-closed 变体（与 TriMC trimc-auth 的 fail-open 故意不同，见其 verify.md 差异声明）。
| E TriModel 流式 fallback | #9 | 已开流的 fallback 一律终止流并向上报错（禁止拼接）；顺带处理报告指出的 chat/stream 双实现漂移（P2-4 记录）。**状态：修复工件已沙箱全绿封存（p0fix4 PE-1/PE-T blocked-workaround-verified），落位被三重墙阻（W1 src/** 属主 jedih·W2 外来 WIP 层·W3 bare 领先三笔）；解封手术见下附注** |

#### TriModel 三重墙解封手术清单（2026-08-27 增补——p0fix4 解封前置，需专项窗口）

p0fix4 取证定谳（log.md 09:04-10:10Z）：sg `/srv/fleet/TriModel` 存在长期未提交修补层（anthropic.ts ±162/usage.ts −10/trimetaverse.ts Bearer 掩码修复等，来源非 0827 部署动作；**Bearer 掩码疑为 trimetaverse provider 生产 load-bearing 补丁，禁裸 reset**）+ 属主混杂（src=uid197609/test=root）+ bare 领先克隆三笔（a5638e9/aaba31b/6476812，内容待考古）。手术序列：

1. **考古定谳**：bare 三笔逐一读 diff 归类（合法演进→收编 GitHub；误操作→revert 留痕）
2. **外来层收编**：sg 脏区逐文件 diff——load-bearing 语义提炼为正式 commit 上推真源；确认无价值的列入废弃清单留档
3. **统一重置**：真源对齐后 `git checkout -B dev origin/dev` + 全树 chown fleet（消灭 W1/W3）
4. **回执落位**：p0fix4 按「解封后下 tick 即取工件直落」自愈路径恢复（其沙箱门禁结论可直接复用）
5. **教训固化**：服务器 clone 一律走 git 通道变更，禁 tar/scp 直灌（本章第二次因直灌/半直灌付账）

## 二、TriLC 双线合并方案

### 现状（2026-08-26 实测）

- 本地 dev：领先 28 提交，含旧版 TC-s1 草案（8ad6d5c 直接改处理器式）
- 正式线 `tc001-canonical`（GitHub 分支 = sg 线）：c4f9e0f（runHarnessAgentLoop 三机制宿主架构，17 测试绿）+ ba32bc7（task_plan 扁平数组兼容+112 行测试）；**heyuan 生产已在此线**
- 两版 TC-s1 冲突必现于 src/server/app.ts；以 c4f9e0f 架构为准，本地旧版放弃

### 合并步骤草案

```bash
# 0. 备份双端分支引用（回滚锚点）
git branch backup/local-dev-premerge dev && git push origin backup/local-dev-premerge

# 1. 以 canonical 为基线建集成分支
git checkout -b integrate/tc001-canonical origin/tc001-canonical

# 2. 挑拣本地 28 提交中的非 TC-s1 变更（git log origin/tc001-canonical..dev 甄别，
#    旧版 TC-s1 相关提交显式跳过）；预期冲突全部集中在 src/server/app.ts
git cherry-pick <筛过的提交序列>

# 3. 门禁：npx tsc --noEmit clean + npm test 全套件
#    （基线参考 437/445 通过，8 个预置失败属 tui/ink-testing-library 等并行流债务，
#     见 tc001-harness-scaffold 树 HS-3 登记——不得新增失败）

# 4. dev fast-forward 到集成结果，推 origin + sg-server；heyuan 生产切回 dev 线
#    （或保留 tc001-canonical 为发布跟踪分支，dev 为研发主线，二者从此单线同步）
```

### 风险与回滚

- cherry-pick 冲突超预期（>10 处）→ 放弃挑拣，改为评估「canonical 全量 + 仅移植本地无冲突小改」降档路径
- 合并后 heyuan 生产重启窗选在周平面迁移空闲期（避开周日 23:00-23:59 冻结窗及迁移执行时刻）
- 回滚 = 删集成分支重置 dev 至 backup/local-dev-premerge（备份已推远端）

## 三、排期建议

- 顺序：批 A/B 同仓同包可一并做 → C、D 各自独立服务可并行 → E 独立最后
- D 批注意与 [[trilc-daemon-restart-discipline]] 生产纪律的窗口约束
- 执行载体由编排层裁决：FADE 派树（每批一树）或 M 面直派会话均可；代码变更建议沿用「先写后报+原子即提交+收口置 done」纪律
