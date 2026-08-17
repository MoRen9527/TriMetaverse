# E2E 回归测试集（勾选视图）

> 真源: e2e-test-suite.json（本视图由其生成——勾选后请同步 JSON status 字段）
> 分层: basic/boundary/exception 每轮必跑 · performance/security 可选 | A 全自动 S 半自动 M CEO 手测

## 开业+项目初始化（域 E）

| 勾 | ID | 用例 | 层 | 自 | 必 | 优 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | E1-001 | 0 岗拦截 | boundary | A | ✓ | P0 | untested |
| [ ] | E1-002 | 13 岗全选 | boundary | S | ✓ | P1 | untested |
| [ ] | E1-003 | 中文名/emoji/特字符 | boundary | S | ✓ | P1 | untested |
| [ ] | E1-004 | 超长名(>100 字符) | boundary | S | ✓ | P2 | untested |
| [ ] | E1-005 | 重名 | boundary | S | ✓ | P2 | untested |
| [ ] | E1-006 | 默认 7 岗验证 | basic | A | ✓ | P0 | untested |
| [ ] | E2-001 | 命名阶段中断续跑 | exception | A | ✓ | P0 | untested |
| [ ] | E2-002 | 项目初始化中断 | exception | A | ✓ | P1 | untested |
| [ ] | E2-003 | 同步阶段中断 | exception | S | ✓ | P1 | untested |
| [ ] | E3-001 | 面板 reset | basic | S | ✓ | P0 | untested |
| [ ] | E3-002 | CLI reset | basic | A | ✓ | P0 | untested |
| [ ] | E3-003 | reset --include-project | basic | A | ✓ | P0 | untested |
| [ ] | E3-004 | HTTP reset | basic | A | ✓ | P0 | untested |
| [ ] | E3-005 | reset --purge-worktree | basic | S |  | P1 | untested |
| [ ] | E4-001 | daemon 中途崩溃 | exception | S | ✓ | P1 | untested |
| [ ] | E4-002 | TriMC 不可达 | exception | S | ✓ | P1 | untested |
| [ ] | E4-003 | 半装态 | exception | S | ✓ | P2 | untested |
| [ ] | E4-004 | 多实例竞争 | exception | A | ✓ | P1 | untested |
| [ ] | E5-001 | 面板开张 chat 看 | basic | S | ✓ | P0 | untested |
| [ ] | E5-002 | chat 开张面板看 | basic | S | ✓ | P0 | untested |
| [ ] | E5-003 | 交叉 reset | exception | S | ✓ | P1 | untested |
| [ ] | E5-004 | 同时操作竞态 | exception | M | ✓ | P1 | untested |

## 三端协同（域 S）

| 勾 | ID | 用例 | 层 | 自 | 必 | 优 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | S1-001 | 三端 HEAD 一致 | basic | A | ✓ | P0 | untested |
| [ ] | S1-002 | 工作区竞态写入 | exception | A | ✓ | P1 | untested |
| [ ] | S1-003 | 回退-重迁移循环 | exception | A | ✓ | P1 | untested |
| [ ] | S2-001 | 公司维失败注入 | exception | A |  | P1 | untested |
| [ ] | S2-002 | 模型维失败注入 | exception | A |  | P1 | untested |
| [ ] | S2-003 | 员工维失败注入 | exception | A |  | P2 | untested |
| [ ] | S2-004 | 项目维失败注入 | exception | A |  | P2 | untested |
| [ ] | S2-005 | keys 维安全验证 | security | A |  | P0 | untested |
| [ ] | S3-001 | 初始化中触发迁移 | exception | S |  | P2 | untested |
| [ ] | S3-002 | 迁移中开始初始化 | exception | S |  | P2 | untested |
| [ ] | S3-003 | 迁移后立即初始化 | basic | S |  | P2 | untested |
| [ ] | S4-001 | bundle 生成验证 | basic | A | ✓ | P0 | untested |
| [ ] | S4-002 | bundleId 单调性 | basic | A | ✓ | P0 | untested |
| [ ] | S4-003 | TriMC applied 验证 | basic | A | ✓ | P0 | untested |
| [ ] | S4-004 | sync 幂等 | basic | A | ✓ | P0 | untested |

## 两入口轮换同步（域 R）

| 勾 | ID | 用例 | 层 | 自 | 必 | 优 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | R1-001 | 面板开张 chat 续 | basic | S | ✓ | P0 | untested |
| [ ] | R1-002 | chat 开张面板续 | basic | S | ✓ | P0 | untested |
| [ ] | R1-003 | 面板推进 chat 推进 | basic | S | ✓ | P0 | untested |
| [ ] | R1-004 | 交叉 reset 验证 | exception | S | ✓ | P0 | untested |
| [ ] | R2-001 | 同步中面板操作 | exception | S | ✓ | P1 | untested |
| [ ] | R2-002 | 同步中 chat 操作 | exception | S | ✓ | P1 | untested |
| [ ] | R2-003 | 双入口同时 sync | exception | A | ✓ | P1 | untested |
| [ ] | R3-001 | 面板 reset chat 复位 | exception | S | ✓ | P1 | untested |
| [ ] | R3-002 | chat reset 面板复位 | exception | S | ✓ | P1 | untested |
| [ ] | R3-003 | 双入口同时 reset | exception | A | ✓ | P1 | untested |
| [ ] | R3-004 | reset 含项目交叉 | exception | S | ✓ | P2 | untested |
| [ ] | R4-001 | sessionID 相等验证 | basic | A | ✓ | P0 | untested |
| [ ] | R4-002 | 面板历史 chat 可见 | basic | S | ✓ | P0 | untested |
| [ ] | R4-003 | chat 历史面板可见 | basic | S | ✓ | P0 | untested |

## 三端团队冲突（域 C）

| 勾 | ID | 用例 | 层 | 自 | 必 | 优 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | C1-001 | 同名 agent 检测 | basic | A | ✓ | P1 | untested |
| [ ] | C1-002 | 装配覆盖风险 | exception | A | ✓ | P0 | untested |
| [ ] | C1-003 | 双源定义差异读取 | boundary | S | ✓ | P1 | untested |
| [ ] | C2-001 | 合约优先装配 | basic | A | ✓ | P1 | untested |
| [ ] | C2-002 | 降级装配 | basic | S | ✓ | P2 | untested |
| [ ] | C2-003 | preserved 保护 | exception | A | ✓ | P0 | untested |
| [ ] | C2-004 | 冲突用户选择 | boundary | M |  | P2 | untested |
| [ ] | C3-001 | /agents API 一致 | basic | A | ✓ | P1 | untested |
| [ ] | C3-002 | 会话初始化器一致 | basic | S | ✓ | P1 | untested |
| [ ] | C3-003 | 面板员工列表一致 | basic | S | ✓ | P1 | untested |
| [ ] | C4-001 | worktree 不存在降级 | exception | S |  | P2 | untested |
| [ ] | C4-002 | worktree 切换 | boundary | S |  | P2 | untested |
| [ ] | C4-003 | junction 事故预防 | security | S |  | P1 | untested |

## CEO 手测（域 M）

| 勾 | ID | 用例 | 层 | 自 | 必 | 优 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | M-001 | 面板视觉确认 | basic | M | ✓ | P0 | untested |
| [ ] | M-002 | 模型会话质量 | basic | M | ✓ | P0 | untested |
| [ ] | M-003 | IDE worktree 体验 | basic | M | ✓ | P1 | untested |
| [ ] | M-004 | 邮件到达确认 | basic | M | ✓ | P0 | untested |
| [ ] | M-005 | 冲突提示体验 | boundary | M |  | P2 | untested |
| [ ] | M-006 | reset 用户引导 | boundary | M |  | P2 | untested |

