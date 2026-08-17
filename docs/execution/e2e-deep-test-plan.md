# TriMetaverse 深度 E2E 测试方案

> 文档类型：测试设计文档（主笔：测试工程师小柯）
> 协同：小狄（三端协作/通信通道技术面）、小乔（轮换同步/冲突产品口径）
> 来源：CEO 最高优先级指令（W34 首任务，2026-08-17）
>
> 文档同步元信息：
> - sourceOfTruth: TriMetaverse/docs/execution/e2e-deep-test-plan.md
> - syncMode: source-only
> - lastSyncedAt: 2026-08-17

---

## 文档说明

本方案扩展 CEO 手测版 `manual-e2e-runbook.md`，设计系统化 E2E 用例矩阵，充分测试：

1. **开业+项目初始化**深度场景（边界条件 + 异常路径）
2. **三端协同**：本地研发仓/TriMC/TriLC 协作与五维同步
3. **两入口轮换同步**：TriPilot ↔ trilc chat 交替推进与竞态
4. **三端团队冲突**：worktree .claude/agents vs TriLC 合约双源（OP 2.54.0 登记项）

---

## 第一部分：已知缺陷清单（汇总自 CEO 手测记录）

### 1.1 装配与初始化缺陷

| ID | 缺陷描述 | 登记来源 | 状态 | 影响范围 |
|---|---|---|---|---|
| BUG-001 | 装配落点冲突：.claude/agents 与 worktree 内 Claude Code 子代理定义冲突，同名文件无 preserved 保护直接覆盖 | OP 2.54.0（2026-08-16 22:2x） | open | 团队装配冲突 |
| BUG-002 | 开张入口分裂：TriCade Setup 欢迎页 step4 只是配置开关，真正开张流程在聊天面板，新用户不知道去哪开张 | OP W33（产品观察项） | open | 用户引导 |
| BUG-003 | 欢迎页问题链：向导写未注册旧键名 modelsDirect.* 报错 | OP W33（CEO 手测三轮反馈） | closed | 向导配置 |
| BUG-004 | 扩展部署问题：install-tricade.ps1 从不部署 extensions，装后扩展停留初始版 | OP W33（欢迎页问题链③） | closed | 安装流程 |
| BUG-005 | 扩展加载位错误：build 脚本 vsix 嵌套解压 VS Code 扫不到 | OP W33（欢迎页问题链④） | closed | 安装流程 |
| BUG-006 | 扩展真实加载位：~/.vscode/extensions（用户级优先于 builtin） | OP W33（欢迎页问题链⑤） | closed | 安装流程 |
| BUG-007 | daemon.log 双重定向 EBUSY：launcher >> 与 daemon stdio append fd 同文件两 open 冲突 | OP W33（r18 装后状态） | closed | 日志系统 |
| BUG-008 | daemon install 再生 cmd 丢 TRIMODEL_API_TOKEN set 行 | OP W33（r18 装后状态） | closed | 环境注入 |

### 1.2 Session 与会话管理缺陷

| ID | 缺陷描述 | 登记来源 | 状态 | 影响范围 |
|---|---|---|---|---|
| SESSION-001 | 两入口 session id 各自为政不同步（应 id 相等才能共享上下文） | CEO 需求登记（2026-08-16 凌晨） | open | 轮换同步 |
| SESSION-002 | reset 不联动会话（初始化链重置但旧会话历史未清/归档） | CEO 需求登记（2026-08-16 凌晨） | open | Reset 行为 |
| SESSION-003 | claude code 原生 session/resume 体系完整，移植面未接上 | CEO 需求登记（2026-08-16 凌晨） | open | 会话管理 |

### 1.3 探测与初始化缺陷

| ID | 缺陷描述 | 登记来源 | 状态 | 影响范围 |
|---|---|---|---|---|
| PROBE-001 | plane-hint-probe pseudo-success 间歇复发（模型行为不定：同 prompt 有时 316 字符 PASS 有时 tool-calls-only） | CEO 手测 D5 轮（2026-08-15 深夜） | open | 自检探测 |
| PROBE-002 | 发起自检后 trilc 崩溃（实为事件循环阻塞数分钟，进程未死自愈恢复，healthz 超时被判 running=false） | CEO 手测 D5 轮（2026-08-15 深夜） | open | 自检流程 |
| PROBE-003 | 探测会话模型 loop 的工具执行同步 IO（agent-core 工具 readdirSync/glob 同步扫） | CEO 手测 D5 轮根因分析 | open | 工具执行 |
| PROBE-004 | 第五探测卡顿 ~60s（装后态 plane-hint-probe 阻塞 HTTP 面） | manual-e2e-runbook.md 已知 bug | known | 自检探测 |

### 1.4 三端协同与同步缺陷

| ID | 缺陷描述 | 登记来源 | 状态 | 影响范围 |
|---|---|---|---|---|
| SYNC-001 | keys.fetchedAt 残留（I4 观察项 OBS-8，非阻塞） | OP 2.38.0 | open | 五维同步 |
| SYNC-002 | 周平面迁移 carry-over 面两处缺口（W34 unresolved-items 头部标题/平移说明不完整，nextActions 丢失） | OP W34 O-D1-4 | open | 周迁移 |

### 1.5 模型与通信缺陷

| ID | 缺陷描述 | 登记来源 | 状态 | 影响范围 |
|---|---|---|---|---|
| MODEL-001 | TriStaciss /v1/models 返回空列表（provider_configs.json 为历史配置无 deepseek 后端） | OP W33（服务链拉起状态） | closed | 模型配置 |
| MODEL-002 | A' 主路径 tools 未接线（/v1/messages 422 缺口） | A-PRIME-WIRING-20260817-001 | open | 模型调用 |
| MODEL-003 | TriMC app.ts /hello 等端点仍用旧模型名 deepseek-v4-pro/flash（与 tmv-* 正典不一致） | OP W33（非流式观察） | open | 模型名一致性 |

### 1.6 已关闭缺陷（验证回归）

| ID | 缺陷描述 | 登记来源 | 修复方式 |
|---|---|---|---|
| CLOSED-001 | 默认模型名硬编码错配（deepseek-v4-pro 与 tmv-* 注册表错配） | INCIDENT-20260813-001 | prod-grade-3 修复 |
| CLOSED-002 | agent ls 工具 cwd 上下文解析错误 | BUG-20260814-001 | prod-grade-4 修复（REQ-014b） |
| CLOSED-003 | D1 carry_over bump 正则列序假设缺陷 | OP W33 r1-3 | 代码修复逐行处理 |
| CLOSED-004 | TriLC Read 工具 tool_result 空串 | BUG-20260805-001 | TriLC 侧修 |
| CLOSED-005 | 安装版 healthz version 报 0.1.0 | BUG-20260805-002 | 三处修复（build-desktop.ps1 + build-tricade.yml + TriLC BOM strip） |
| CLOSED-006 | MSI 打包缺 yoga-layout 别名 | BUG-20260805-003 | TriLC package.json 加 npm 别名 |

---

## 第二部分：测试用例矩阵（设计草案）

### 用例格式规范

每个用例包含：
- **ID**：域-编号（E1-001, S1-001, R1-001, C1-001）
- **标题**：简短描述
- **前置**：测试前条件
- **步骤**：操作序列
- **预期**：预期结果
- **判定**：通过/失败标准
- **证据**：日志/截图/命令输出
- **自动化分级**：手动/半自动/全自动

---

## 第三部分：开业+项目初始化深度用例（域 E）

### E1 岗位选择边界用例

| ID | 标题 | 前置 | 步骤 | 预期 | 判定 | 证据 | 自动化 |
|---|---|---|---|---|---|---|---|
| E1-001 | 0岗拦截 | 自检完成 | 清空所有勾选→提交 | 被拒绝，提示至少1岗 | 拒绝提示出现 | 截图 | 手动 |
| E1-002 | 13岗全选 | 自检完成 | 全选13岗→命名→提交 | 成功装配13人 | 开张卡显示13人 | 截图 | 手动 |
| E1-003 | 中文名特字符 | 自检完成 | 岗位名含中文/emoji/特殊符号 | 成功保存并显示 | 名字正确显示 | 截图 | 手动 |
| E1-004 | 超长名测试 | 自检完成 | 岗位名>100字符 | 截断或提示或成功保存 | 行为一致 | 截图 | 手动 |
| E1-005 | 重名测试 | 自检完成 | 两个岗位起相同名字 | 提示重名或允许 | 重名处理明确 | 截图 | 手动 |
| E1-006 | 默认7岗验证 | 自检完成 | 不修改默认勾选 | 恰好7岗（总助/CPO/CTO/开发/测试/CAO/CHO） | 7岗全对 | 截图 | 自动 |

### E2 断点续跑用例

| ID | 标题 | 前置 | 步骤 | 预期 | 判定 | 证据 | 自动化 |
|---|---|---|---|---|---|---|---|
| E2-001 | 命名阶段中断 | 岗位选择界面 | 命名到一半关闭TriCade→重开 | 已答名字不重复提问可回看 | 状态恢复正确 | 截图 | 半自动 |
| E2-002 | 项目初始化中断 | 项目关联阶段 | SSE进度进行中关闭TriCade→重开 | 进度可恢复或从头开始 | 状态明确 | 截图 | 半自动 |
| E2-003 | 同步阶段中断 | 五维同步进行中 | daemon崩溃或网络中断 | 重启后可恢复同步 | 不丢失状态 | 日志 | 半自动 |

### E3 Reset 用例

| ID | 标题 | 前置 | 步骤 | 预期 | 判定 | 证据 | 自动化 |
|---|---|---|---|---|---|---|---|
| E3-001 | 面板重置 | 任意初始化阶段 | TriPilot面板「重新初始化」按钮 | 回到uninitialized | 状态清空 | 截图 | 半自动 |
| E3-002 | CLI重置 | 任意初始化阶段 | trilc chat reset | 回到uninitialized | 状态清空 | 输出 | 半自动 |
| E3-003 | 重置含项目 | 项目已关联 | trilc chat reset --include-project | 公司+项目关联清空 | project-registry清空 | 文件检查 | 半自动 |
| E3-004 | HTTP重置 | 任意初始化阶段 | curl reset端点 | 回到uninitialized | 状态清空 | 响应 | 自动 |

### E4 异常路径用例

| ID | 标题 | 前置 | 步骤 | 预期 | 判定 | 证据 | 自动化 |
|---|---|---|---|---|---|---|---|
| E4-001 | daemon中途崩溃 | 自检进行中 | 杀daemon进程 | 面板显示连接中断/重试提示 | 错误提示明确 | 截图+日志 | 手动 |
| E4-002 | TriMC不可达 | 初始化完成 | 断网或TriMC停机 | 降级运行或明确提示 | 行为一致 | 截图 | 手动 |
| E4-003 | 半装态 | 安装后未启动daemon | 直接打开TriPilot | 提示daemon未运行或自动拉起 | 引导正确 | 截图 | 半自动 |
| E4-004 | 多实例竞争 | daemon在运行 | 启动第二个daemon实例 | 第二个拒绝启动或提示 | 不冲突 | 日志 | 半自动 |

### E5 两入口交叉用例

| ID | 标题 | 前置 | 步骤 | 预期 | 判定 | 证据 | 自动化 |
|---|---|---|---|---|---|---|---|
| E5-001 | 面板开工chat看 | 未初始化 | TriPilot面板选岗装配→trilc chat查看 | chat可见相同公司态 | 状态同步 | 截图 | 手动 |
| E5-002 | chat开工面板看 | 未初始化 | trilc chat选岗装配→TriPilot面板查看 | 面板可见相同公司态 | 状态同步 | 截图 | 手动 |
| E5-003 | 交叉reset | 任意初始化阶段 | 面板reset→chat继续操作 | chat检测到状态变化或提示 | 一致性 | 截图 | 手动 |
| E5-004 | 同时操作竞态 | 未初始化 | 同时在面板+chat推进 | 串行化或拒绝或后入覆盖 | 行为明确 | 视频+日志 | 手动 |

---

## 第四部分：三端协同用例（域 S）

**协同范围**：本地研发仓（D:/Code/ai/TriMetaverse）/ TriMC（服务器 sg-ecs-server:8710）/ TriLC（本地 127.0.0.1:8711）

### S1 Git 链一致性用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| S1-001 | 三端HEAD一致性 | 查询三端HEAD（本地git/fleet/TriMC status） | 三值相等或可解释差异 | 一致性明确 | 三个命令输出 |
| S1-002 | 工作区竞态写入 | 本地+fleet同时push | 一方成功另一方reject或排队 | 非静默覆盖 | 日志 |
| S1-003 | 回退-重迁移循环 | 迁移后reset→再次迁移 | 迁移commit不重复或幂等 | 不腐化 | git log |

### S2 五维同步失败注入用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| S2-001 | 公司维同步失败 | TriMC公司态损坏或网络中断 | 降级或重试或失败提示 | 行为明确 | 日志 |
| S2-002 | 模型维同步失败 | TriMC模型配置不可达 | 其余维继续或整体失败 | 行为明确 | 日志 |
| S2-003 | 员工维同步失败 | TriMC员工态损坏 | 降级或重试 | 行为明确 | 日志 |
| S2-004 | 项目维同步失败 | 项目仓不存在或不可达 | 失败提示明确 | 错误提示 | 日志 |
| S2-005 | Keys维同步失败 | 密钥获取失败（SEC-20260813-001场景） | 只同步配置面+指纹，不传材料 | 密钥不在payload | 抓包/日志 |

### S3 周迁移与初始化交错用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| S3-001 | 初始化中触发迁移 | 项目初始化进行中→23:00迁移触发 | 初始化不中断或可恢复 | 数据一致性 | 日志 |
| S3-002 | 迁移中开始初始化 | 迁移进行中→新实例开始初始化 | 初始化等待或使用新周数据 | 行为明确 | 日志 |
| S3-003 | 迁移后立即初始化 | 迁移完成→立即初始化 | 使用新周OP索引 | W34数据可见 | 截图 |

### S4 五维同步产物验证用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| S4-001 | bundle生成验证 | 触发同步 | 本地生成bundle文件 | 文件存在+schema验证 | 文件检查 |
| S4-002 | bundleId单调性 | 多次同步 | bundleId单调递增 | 无回退 | 日志 |
| S4-003 | TriMC applied验证 | sync-apply cron执行 | TriMC status显示applied bundleId | 双侧一致 | HTTP查询 |
| S4-004 | sync幂等性 | 相同条件下多次sync | 产生相同bundleId或already_exists | 幂等 | 日志 |

---

## 第五部分：两入口轮换同步用例（域 R）

### R1 基础轮换用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| R1-001 | 面板开工→chat继续 | TriPilot完成开业→trilc chat查看 | chat可见相同状态 | SESSION-001验证点 | 截图 |
| R1-002 | chat开工→面板继续 | trilc chat完成开业→TriPilot查看 | 面板可见相同状态 | SESSION-001验证点 | 截图 |
| R1-003 | 面板推进→chat推进 | 面板完成同步→chat完成同步 | 状态一致不冲突 | 无竞态表现 | 双截图 |
| R1-004 | 交叉reset验证 | 面板reset→chat检查状态 | chat检测到reset或拒绝操作 | SESSION-002验证点 | 截图 |

### R2 阻塞期竞态用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| R2-001 | 同步中面板操作 | chat同步进行中→TriPilot面板操作 | 面板等待或提示同步进行中 | 不冲突 | 截图+日志 |
| R2-002 | 同步中chat操作 | TriPilot同步进行中→trilc chat操作 | chat等待或提示同步进行中 | 不冲突 | 截图+日志 |
| R2-003 | 双入口同时同步 | 同时在面板+chat触发同步 | 一个成功另一个排队或幂等 | 行为明确 | 双日志 |

### R3 Reset交叉用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| R3-001 | 面板reset→chat复位 | TriPilot面板reset→trilc chat检查 | chat状态清空或提示需reset | SESSION-002验证点 | 截图 |
| R3-002 | chat reset→面板复位 | trilc chat reset→TriPilot检查 | 面板状态清空或提示需reset | SESSION-002验证点 | 截图 |
| R3-003 | 双入口同时reset | 同时在面板+chatreset | 一个成功另一个幂等 | 行为明确 | 双日志 |
| R3-004 | reset含项目交叉 | 一入口reset--include-project→另一入口检查 | project-registry清空同步 | 文件检查 | 文件验证 |

### R4 Session ID同步验证用例（SESSION-001核心）

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| R4-001 | sessionID读取 | 查询面板+chat的sessionID | 两值相等 | 相等 | 命令输出 |
| R4-002 | 共享上下文验证 | 面板创建会话→chat访问历史 | chat可见面板历史 | 上下文共享 | 截图 |
| R4-003 | chat创建上下文验证 | chat创建会话→面板访问历史 | 面板可见chat历史 | 上下文共享 | 截图 |

---

## 第六部分：三端团队冲突用例（域 C）

**核心冲突（OP 2.54.0）**：worktree 的 .claude/agents 与 TriLC 合约双源，同名 agent 两处定义

### C1 双源冲突基础用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| C1-001 | 同名agent检测 | 扫描.claude/agents与TriLC合同 | 列出同名agent列表 | 冲突可见 | 扫描输出 |
| C1-002 | 装配覆盖风险测试 | 同名agent存在于两处 | 装配时提示或拒绝或保留原 | 不静默覆盖 | 日志+文件 |
| C1-003 | 双源定义差异读取 | 同名agent两处定义不同 | 明确使用哪个来源 | 优先级明确 | API输出 |

### C2 装配冲突解决用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| C2-001 | 合约优先装配 | 同名agent两处存在→装配 | 使用TriLC合同来源 | 优先级正确 | 装配产物 |
| C2-002 | worktree优先装配 | TriLC无该agent→装配 | 使用worktree来源 | 降级正确 | 装配产物 |
| C2-003 | preserved保护测试 | 写.claude/agents/<roleId>.md | 已存在时不覆盖或备份 | 保护生效 | 文件检查 |
| C2-004 | 冲突提示用户 | 装配时检测冲突 | 用户可选择来源或取消 | 选择权明确 | 截图 |

### C3 运行时一致性用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| C3-001 | /agents API一致性 | 查询/agents端点 | 返回与装配产物一致 | 一致性 | API输出 |
| C3-002 | 会话初始化器一致性 | 6.4会话初始化器读取 | 使用装配后的agent | 正确来源 | 日志 |
| C3-003 | TriPilot面板一致性 | TriPilot显示员工列表 | 与/agents API一致 | 一致性 | 截图+API |

### C4 Worktree特定场景用例

| ID | 标题 | 步骤 | 预期 | 判定 | 证据 |
|---|---|---|---|---|---|
| C4-001 | worktree不存在 | .claude/agents指向不存在的worktree | 降级到TriLC来源或报错 | 降级正确 | 日志 |
| C4-002 | worktree切换 | 切换项目worktree | agent来源重新评估 | 动态更新 | 日志 |
| C4-003 | junction事故预防 | worktree+npm install组合 | 拒绝或警告 | INCIDENT-20260814-001验证 | 日志 |

---

## 第七部分：测试执行策略

### 7.1 自动化分级

- **全自动（A）**：可脚本化执行，无需人工判断
- **半自动（S）**：需人工启动/部分验证
- **手动（M）**：需人工全程操作+判断

### 7.2 优先级分级

- **P0（阻塞）**：阻塞性缺陷/核心功能
- **P1（高）**：重要功能/频繁路径
- **P2（中）**：边界条件/异常路径
- **P3（低）**：优化项/观察项

### 7.3 执行顺序建议

1. **Phase 1**：E1-E3 基础开业用例（P0）
2. **Phase 2**：R1-R2 轮换同步用例（P0，SESSION-001核心）
3. **Phase 3**：S1-S2 三端协同用例（P0）
4. **Phase 4**：C1-C2 冲突用例（P1，OP 2.54.0核心）
5. **Phase 5**：E4-R3-C3 异常/交叉用例（P2）
6. **Phase 6**：S3-S4-R4-C4 高级场景（P2-P3）

---

## 第八部分：协同设计输入（已交付）

### 8.1 小狄技术方案（已交付）

**文档落点**：`docs/execution/e2e-three-endpoint-collab-model.md`（已落盘未提交）

**核心方案要点**：

1. **三端协作契约模型**：
   - 单状态机（trilc daemon 持久）+ 两入口瘦客户端（TriPilot 面板 / trilc chat CLI）
   - 状态机 7 态：UNINITIALIZED → SELFCHECK → ONBOARDING → PROJECT-LINK → SYNC → CONFIRM → READY
   - 两入口一致性规则：状态真源单一、中途切换不丢进度、冲突防护（指令队列锁）

2. **通信通道规则**：
   - git 链：研发仓（写主体）→ github（PR 备份）→ sg-server 裸仓（中转）→ 舰队面（只读）
   - 五维同步：company/model/keys/employees/project（git bundle 载体）
   - 协同确认：L1-L4 分层验证（项目身份/版本/写读闭环正向+反向）

3. **冲突解决协议**：
   - 装配落点冲突：source-agents 为唯一真源，`.claude/agents/` 为投影；装配端点冲突检测 → 拒绝写入
   - git 链竞态：身份单一纪律、push 重试机制、bundle 幂等性
   - 双入口竞态：daemon 状态机单执行体 + 指令串行化

4. **失败注入场景**（7+4+3 类）：
   - 五维同步：模型不可达/key 认证/员工滞后/state 损坏/worktree 冲突/同步链失败/TriMC 不可达
   - git 链：远端 HEAD 漂移/裸仓不可达/舰队 pull 失败/身份冲突
   - 双入口：同时操作/状态漂移/指令重复

### 8.2 小乔产品口径（已交付）

**场景矩阵（6 类核心场景）**：

| 场景 | TriPilot 操作 | trilc chat 操作 | 用户体验验证点 |
|------|---------------|-----------------|----------------|
| **A1. 初始阶段切换** | SELFCHECK 完成后关闭面板 | 打开 chat → 应从 ONBOARDING 继续 | 不重复自检、阶段连续 |
| **A2. 命名中断后跨入口续跑** | 员工起名到一半关闭 | chat 打开 → 剩余岗位不重复提问 | 已答名字保留、当前步高亮 |
| **A3. 项目初始化跨入口完成** | 项目关联 SSE 进度中切换 | chat 呈现同一进度状态 | 进度连续、无状态漂移 |
| **A4. 同步中入口切换** | SYNC 五维三态呈现中切换 | chat 显示同步进度同步 | 单维失败状态一致 |
| **A5. 确认卡跨入口确认** | TriPilot 呈现 L1-L4 证据 | chat 可执行同一确认动作 | 确认结果双侧同步 |
| **A6. reset 后跨入口恢复** | TriPilot reset → uninitialized | chat 打开应从 selfcheck 起步 | 重置状态双侧收敛 |

**冲突分类（3 类）**：

| 冲突类型 | 触发条件 | 用户提示 | 引导动作 |
|----------|----------|----------|----------|
| **B1. 并发写冲突** | 面板与 chat 同时操作同一阶段 | 「正在另一入口操作中，请稍候」 | 等待自动解锁（5s 超时） |
| **B2. 状态不一致** | 一侧正在执行时另一侧读状态 | 「另一入口正在推进，当前状态可能滞后」 | 刷新提示或稍后重试 |
| **B3. 资源竞争** | daemon 单执行体繁忙 | 「系统忙碌，请等待当前操作完成」 | 进度条显示 + 超时重试入口 |

---

## 第九部分：自动化测试脚本集设计

### 9.1 自动化分级定义（CEO 指令约束）

| 分级 | 定义 | 执行方式 | 脚本落点 |
|------|------|----------|----------|
| **A-全自动** | 编排层脚本可跑，无需人工判断 | CI/CD 或手动执行脚本 | `scripts/e2e/` |
| **S-半自动** | 脚本执行 + 编排层/测试员判读 | 脚本 + 人工验证 | `scripts/e2e/` + 判读文档 |
| **M-CEO手测** | 需 CEO 配合的视觉确认/真实会话 | CEO 手动操作 | 清单式检查表 |

### 9.2 全自动测试脚本集（目录结构）

```
scripts/e2e/
├── package.json                    # 依赖（axios/node-fetch等）
├── lib/
│   ├── daemon-client.js           # TriLC 端点封装
│   ├── trimc-client.js            # TriMC 端点封装
│   ├── git-ops.js                 # git 操作封装
│   └── assertions.js              # 断言库
├── suites/
│   ├── 01-init-chain.js           # 初始化链全流程（selfcheck→ready）
│   ├── 02-reset-scenarios.js       # Reset 各场景（面板/CLI/HTTP）
│   ├── 03-sync-e2e.js             # 五维同步 E2E
│   ├── 04-git-consistency.js      # 三端 git 一致性
│   ├── 05-concurrent-ops.js       # 并发/竞态场景
│   ├── 06-failure-injection.js    # 失败注入（坏 token/daemon 中途杀/服务器不可达）
│   └── 07-cross-entry-reset.js    # 两入口 reset 交叉（两脚本交错）
└── run-all.js                     # 统一执行入口
```

### 9.3 全自动用例覆盖清单

| 用例ID | 标题 | 脚本文件 | 验证点 |
|--------|------|----------|--------|
| E1-001 | 0岗拦截 | 01-init-chain.js | 装配端点返回 4xx |
| E1-006 | 默认7岗验证 | 01-init-chain.js | 装配产物恰好 7 岗 |
| E2-001 | 命名阶段中断 | 01-init-chain.js | 模拟中断后重跑，状态恢复 |
| E2-002 | 项目初始化中断 | 01-init-chain.js | SSE 中断后重连 |
| E3-001~004 | Reset 各场景 | 02-reset-scenarios.js | 端点返回 chainState=uninitialized |
| S1-001 | 三端HEAD一致性 | 04-git-consistency.js | 三值相等断言 |
| S2-001~005 | 五维同步失败注入 | 06-failure-injection.js | 各维失败响应验证 |
| S4-001~004 | 五维同步产物验证 | 03-sync-e2e.js | bundle 生成/单调性/applied/幂等 |
| R2-001~003 | 阻塞期竞态 | 05-concurrent-ops.js | 并发请求响应验证 |
| R3-001~004 | Reset 交叉 | 07-cross-entry-reset.js | 两脚本交错执行 |
| C1-001 | 同名agent检测 | scripts/e2e/lib/assertions.js | 扫描 + 冲突列表验证 |
| C2-001~003 | 装配冲突解决 | 01-init-chain.js | 装配端点响应验证 |

### 9.4 半自动用例清单（需判读）

| 用例ID | 标题 | 脚本执行 | 判读要点 |
|--------|------|----------|----------|
| E1-002 | 13岗全选 | 脚本自动化装配13岗 | 人工验证开张卡显示 |
| E1-003~005 | 特字符/超长/重名 | 脚本自动化提交 | 人工验证行为一致性 |
| E2-003 | 同步阶段中断 | 脚本模拟 daemon 崩溃 | 判读日志确认不丢失状态 |
| E4-001 | daemon中途崩溃 | 脚本杀进程 | 判读面板错误提示 |
| R1-001~004 | 基础轮换 | 脚本执行两入口操作 | 判读状态同步截图 |
| C3-001~003 | 运行时一致性 | 脚本查询 API | 判读输出一致性 |

### 9.5 CEO 手测清单（需 CEO 配合）

| 用例ID | 标题 | 验证方式 | 验收标准 |
|--------|------|----------|----------|
| M-001 | TriPilot 面板视觉确认 | CEO 打开面板 | 卡片渲染正确/按钮反馈清晰/输入保护生效 |
| M-002 | 真实模型会话质量 | CEO 对话测试 | 第五探测答复合理（非 tool-calls-only） |
| M-003 | IDE 内 worktree 体验 | CEO 在 VS Code 中操作 | worktree 可见/可编辑 |
| M-004 | 邮件到达确认 | CEO 等待迁移邮件 | 邮件内容正确/时间戳准确 |
| M-005 | 冲突提示用户体验 | CEO 触发并发冲突 | 提示文案中性/动作明确/状态可见 |
| M-006 | Reset 后用户引导 | CEO 执行 reset | 引导清晰/会话清理通知/数据丢失提示 |

### 9.6 执行策略（CEO 约束）

1. **Phase 1（全自动优先）**：执行 `scripts/e2e/run-all.js`，覆盖所有 A-全自动用例
2. **Phase 2（半自动验证）**：编排层执行半自动脚本，小柯判读结果
3. **Phase 3（CEO 验收）**：CEO 按清单 M-001~M-006 手测验收

---

## 第十部分：后续行动

### 9.1 立即行动（小柯）

1. ✅ 已创建任务跟踪列表（Task #10-#14）
2. ⏳ 已向小狄、小乔发送协同请求
3. ⏳ 等待协同输入后完善用例矩阵
4. ⏳ 编写可执行测试脚本（全自动用例）

### 9.2 协同输入等待

- **小狄**：三端协作模型与通信通道规则设计（预计1-2小时）
- **小乔**：轮换同步用户体验口径（预计1小时）

### 9.3 落盘计划

- 本文件作为设计文档落盘（source-only）
- 协同输入并入后更新版本
- 可执行脚本落 `tests/e2e/` 目录（如需）

---

## 附录：参考文献

1. `docs/workflow/operating-records/2026-W33/trees/init-collab-i5-first-collab/verify/manual-e2e-runbook.md` - CEO 手测版
2. `docs/workflow/operating-records/2026-W33/trees/init-collab-i5-first-collab/verify/verify-l1-l4.md` - L1-L4 判定矩阵
3. `docs/execution/init-to-collab-design.md` - 初始化到协同设计
4. `docs/execution/worktree-architecture-design.md` - Worktree 架构设计
5. `docs/execution/project-workspace-design-v2.md` - 项目级工作区设计 v2
6. OP W33/W34 记录 - 缺陷登记与决策历史

---

*本文档将持续更新，待小狄、小乔协同输入并入后形成最终版。*
