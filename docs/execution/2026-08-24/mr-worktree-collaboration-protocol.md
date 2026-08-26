# M/R Worktree 协作与仓库管理协议（生产级）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/mr-worktree-collaboration-protocol.md
- syncMode: source-only
- lastSyncedAt: 2026-08-26
- 版本: v1.0
- 授权: CEO 2026-08-26 指令「制定好生产级协作和仓库管理方案」

## 一、拓扑

```
D:/Code/ai/TriMetaverse              ← 主仓 dev 分支（M 面/编排层/研发）
  ↕ git worktree 共享 .git
D:/Code/ai/TriMetaverse WorkTree    ← project/trimetaverse 分支（R 面执行区）
  ↕ pull/push
sg-bare (sg-server /srv/git/)       ← 裸仓正源
  ↕ clone
/srv/fleet/TriMetaverse (heyuan)    ← R 面服务器独立克隆（等效 worktree）
```

## 二、分支模型

| 分支 | 用途 | 谁写 | 谁读 |
| --- | --- | --- | --- |
| `dev` | 研发主线 | M 面（人+CC 编排） | 所有人 |
| `project/trimetaverse` | R 面执行分支 | R 面 agent（TriRLC/TriRMC） | M 面审阅后 merge |
| `project/trimetaverse-staging` | R 面产出暂存（未验证） | R 面 agent | 仅 R 面 |

## 三、写入权矩阵

| 目录 | M 面 (dev) | R 面 (worktree) | 说明 |
| --- | --- | --- | --- |
| docs/workflow/operating-records/ | ✅ 周平面迁移写 | ✅ 树状态更新（子目录内） | 双方都可写但不同子域 |
| docs/execution/** | ✅ 计划文档 | ⚠️ 仅 trees/{自己树ID}/ 内 | R 面不碰其他计划 |
| experience/staging/ | ✅ | ✅ | 共享暂存区 |
| src/ / packages/ | ✅ 研发修改 | ❌ 只读 | R 面不改研发代码 |
| scripts/e2e/ | ✅ | ⚠️ 可新增不可删改 | 测试脚本 |

## 四、周工作平面迁移协作

**原则**：迁移是**服务端单主体**操作，本地双面只消费结果。

```
周日 23:59 (Asia/Shanghai)
  TriRMC (heyuan) 执行五段链
    → 写入自身克隆的 operating-records/
    → commit + push sg-bare HEAD:dev
  
周一早晨（CEO 开机后）
  主仓: git pull sg-bare dev → 拿到 W36 平面
  WorkTree: git merge dev 或 git pull sg-bare → 同步到新周
  
冻结窗口：周日 23:00–23:59 双方都冻结 operating-records 写入
```

### 冲突预防规则

1. **R 面 agent 不直接 push dev**——推 `project/trimetaverse` 或通过 sg-bare 中转
2. **M 面编排层负责合并**——WorkTree 的产出经 M 面审核后 merge 到 dev
3. **冻结窗口期间双方停笔**——迁移是服务端单主体操作，本地不参与写入

## 五、日常协作流程

### R 面任务执行周期

```
1. M 面：计划写入 docs/execution/ + 树注册（domainRouting=server-executable）
2. M 面：push sg-bare → fleet/WorkTree 自动拉取
3. R 面：tick 发现 actionable tree → 在 WorkTree 中执行
4. R 面：原子 commit 到 project/trimetaverse 分支 → push origin
5. M 面：审阅 R 面产出 → merge 到 dev（或要求返工）
6. 循环直到 doneCondition 达成
```

### 合并纪律

- WorkTree 的 `project/trimetaverse` 定期 rebase 到 `dev`（保持基线新鲜）
- 合并方向永远是 `dev → project/trimetaverse`（rebase）或 `project/trimetaverse → dev`（PR/merge）
- 禁止在 worktree 中直接 push dev

## 六、五实例独立性确认

### 6.1 实例清单与代码来源

| 实例 | 工作目录 | 代码来源 | 执行引擎 | 推送到哪 |
| --- | --- | --- | --- | --- |
| TriMLC（本地 CC） | D:\Code\ai\TriMetaverse（dev 主仓） | sg-bare pull | claude code 宿主 | dev 直推 |
| TriMMC（sg-server） | /srv/fleet/TriMetaverse | sg-bare pull | claude code headless | sg-bare HEAD:dev |
| TriRMC（heyuan） | /srv/fleet/TriMetaverse | GitHub/sg-bare pull | 调度面（不跑 agent） | sg-bare HEAD:dev |
| TriRLC（heyuan） | /srv/fleet/TriLC + TriMetaverse 克隆 | GitHub pull | agent-core 循环 | project/trimetaverse 分支 |
| TriRLC（本地 PC） | D:\Code\ai\TriMetaverse WorkTree | dev 合并 | agent-core 循环 | project/trimetaverse 分支 |

每个实例有独立的 node_modules、构建产物、会话存储——互不干扰。代码通过 git 从正源拉取保证一致性，产出推到各自有权限的分支由 M 面审阅后合入。

### 6.2 R 面代码开发门禁

R 面（agent-core）在通过 M 面能力对齐验收前，**不承担代码修改任务**。门禁条件：

- M 面（CEO + CC 编排）确认 agent-core 对齐 CC 核心能力（持续执行/上下文管理/工具可靠性）
- 门禁通过前：所有代码修改由 M 面（CC harness）执行
- 门禁通过后：步骤 3&4（agent 执行+合入）解锁

## 七、rebase / merge / PR 详解与风险

### 7.1 什么是 SHA

每个 git commit 有一个唯一的 **40 位十六进制哈希值**（SHA），如 `4e4fdc2c8f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c`。这个哈希由以下因素决定：
- 文件内容的快照（树哈希）
- 父提交的 SHA
- 提交者、时间戳、提交消息

**关键特性**：改变任何一项 → SHA 完全不同。即使两个 commit 的文件内容一模一样，只要父提交或时间戳不同，就是两个不同的 commit。

日常使用取前 7-8 位缩写即可唯一标识（如 `4e4fdc2c`）。

### 7.2 什么是引用

引用是一个**指向某个 SHA 的命名指针**：

```
dev                    → 指向 4e4fdc2c...（本地研发主线最新）
origin/dev             → 指向 663b5a40...（GitHub 上 dev 分支的最新已知位置）
project/trimetaverse   → 指向 b125cf56...（WorkTree 的 R 面执行分支）
HEAD                   → 指向当前检出的分支或 commit
```

当你执行 `git push origin dev` 时，git 做的事是：
1. 查找本地 `dev` 引用指向哪个 SHA（如 `4e4fdc2c`）
2. 把该 SHA 及其所有祖先 commit 的数据发送到远端
3. 让远端的 `dev` 引用也指向同一个 SHA

### 7.3 Rebase 的具体风险举例

**场景**：你和同事协作出事了

```
第 1 步：你创建 feature 分支，写了两个提交 D 和 E
第 2 步：你把 feature 推到了 GitHub
第 3 步：同事看到了你的代码，基于 E 写了一个修复 F
第 4 步：同时 dev 主线推进到了 C

此时的提交图：
  dev:     A --- B --- C          ← 主线
                        \
  feature:               D --- E ← 你
                              \
  同事的分支:                   F ← 同事基于你的 E
```

**第 5 步：你决定 rebase feature 到 dev**

```
rebase 后：
  dev:     A --- B --- C
                           \
  feature:                  D' --- E'   ← 新的 SHA！（内容同 D/E 但父节点变了）

  （旧的 D 和 E 变成了孤儿——没有任何引用指向它们）
  （同事的 F 仍然指向旧 E —— 但 E 已经"不存在"于任何可达分支上了）
```

**后果**：
1. 你的 feature push 到 GitHub → 被拒（non-fast-forward），因为远端有旧的 D,E 而本地只有新的 D',E'
2. 如果 force push → 同事的 F 指向的 E 彻底丢失（成为孤儿）
3. 同事必须手动找到新 SHA 并 rebase 自己的工作
4. 如果同事不知道你做了 rebase，他们的下一次 push 会尝试把旧的 D,E 再加回来 → 冲突地狱

**这就是为什么黄金法则说：已推送的分支不要 rebase。**

### 7.4 在我们架构中的安全用法

| 操作 | 安全？ | 条件 |
| --- | --- | --- |
| WorkTree 追平 dev（rebase project/trimetaverse onto dev） | ✅ 安全 | 因为 project/trimetaverse 只有本机在用且未推远端 |
| TriRLC heyuan push 后本地 rebase 同一分支 | ❌ 危险 | heyuan 可能基于旧 SHA 继续工作 |
| 删掉远端分支重建 | ⚠️ 可控 | 必须通知所有协作者 |

### 7.5 Rebase 风险的四层规避方案（CEO 2026-08-26 指令写入）

**第 1 层：结构隔离（最根本）**

不同机器不共享同一个分支——每台机器推到自己的分支，由 M 面统一合并：

| 机器 | 推送到 | 说明 |
| --- | --- | --- |
| 河源 TriRLC | `project/trimetaverse-staging` 或 `project/trimetaverse` | R 面产出分支 |
| 本地 WorkTree | 同上（或本地合并后推） | 与河源不直接竞争 |
| 主仓 dev | 只有 M 面编排层推 | 单一写入方 |

这样 rebase 只影响本机的本地分支，永远不会破坏其他机器的历史。

**第 2 层：操作纪律**

三条铁律：

1. **pull 后才能 push**——push 前必须先拉取远端最新并确认无分叉
2. **已推送的 commit 不 rebase**——rebase 仅限尚未推送的本地提交
3. **禁 force push 共享分支**——force push 仅允许在自己独占的分支使用

**第 3 层：技术防护**

sg-bare 服务端配置 git hook 自动拒绝 force push 到保护分支：

```bash
# /srv/git/TriMetaverse.git/hooks/pre-receive
#!/bin/bash
while read old new ref; do
  if [ "$ref" = "refs/heads/dev" ]; then
    if ! git merge-base --is-ancestor "$old" "$new" 2>/dev/null; then
      echo "REJECTED: non-fast-forward push to protected branch $ref"
      exit 1
    fi
  fi
done
```

即使有人误操作 force push，服务端也会拦截。

**第 4 层：沟通协议**

如果确实需要 rebase 已共享的分支：
1. 先通知所有协作者"我要 rebase X 分支"
2. 等所有人确认没有基于旧 SHA 的未推工作
3. 执行后立即广播新 SHA
4. 所有协作者执行 `git pull --rebase` 对齐

## 八、异常处理

| 场景 | 处置 |
| --- | --- |
| R 面污染了 dev | M 面 revert + 台账登记 |
| 双方同时改同一文件 | 后写者 rebase 解决冲突 |
| WorkTree 过旧导致大量冲突 | 先追平再继续 R 面任务 |
| plane migration 与 R 面写入竞争 | 冻结窗口纪律（周日 23:00-23:59） |
| rebase 后 push 被拒 | force push（仅限自己独占的分支）或通知协作者 rebase |

## 九、初始化清单（一次性）

- [x] WorkTree 存在且为合法 git worktree
- [x] WorkTree 追平到当前 dev（4e4fdc2c）
- [ ] TriRLC daemon cwd 配置指向 WorkTree
- [ ] heyuan 克隆确认与 sg-bare 同步
- [ ] project/trimetaverse 分支推送远端备份
