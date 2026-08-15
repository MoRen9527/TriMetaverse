# Debug 开关 + 公司 Reset 技术方案

---
sourceOfTruth: TriMetaverse/docs/execution/
syncMode: central
lastSyncedAt: 2026-08-15
---

## 背景

CEO 手动测试 TriCade 初始化链（2026-08-15 开业实测成功）后提出需求：需要一个全局 debug 开关，开启后可将公司重置回 uninitialized 态，方便反复测试开业流程。

已有临时方案 `dev-reset-init.mjs`（编排层工具）已验证清理逻辑。本方案将其转化为产品内可用能力（TriPilot 面板 + trilc chat 可操作）。

## 设计目标

1. **全局 debug 开关**：生产默认关，开启后解锁 reset 端点 + 面板显示
2. **公司 reset**：POST /internal/v1/init/reset 契约，任意链态 → uninitialized
3. **项目 reset 联动**：可选项，清理 project-registry
4. **两入口呈现**：TriPilot 阶段卡按钮 + trilc chat 指令
5. **安全护栏**：debug 关闭时端点 403，清理白名单精确，防误触

---

## 一、全局 Debug 开关

### 1.1 载体选择

**裁决：环境变量 `TRILC_DEBUG=1`（daemon 启动时注入）**

| 方案 | 优点 | 缺点 |
|------|------|------|
| 环境变量 TRILC_DEBUG | 与 TriCade 部署一致（trilc-daemon.cmd 已有 env 注入面）、daemon 重启生效 | 需重启 daemon |
| settings.json 配置 | 可热更新、无需重启 | 需新增配置读取逻辑、泄漏面更大 |

**理由**：
- TriCade 部署已通过 `trilc-daemon.cmd` 注入环境变量（见 dev-reset-init.mjs 第 84 行）
- debug 是开发期工具，重启 daemon 可接受
- 配置文件需新增读取逻辑，且泄漏面更大（settings 文件可被用户直接编辑）

### 1.2 作用面

| 作用面 | debug 开启时 | debug 关闭时 |
|--------|-------------|-------------|
| reset 端点 | 200 正常响应 | 403 Forbidden |
| TriPilot 阶段卡 | 显示「重新初始化」按钮 | 隐藏按钮 |
| trilc chat | `@trilc reset-company` 指令可用 | 指令返回「debug 模式未启用」 |
| 诊断信息 | 解锁额外诊断字段（保留） | 生产诊断字段（保留） |

### 1.3 默认值

**裁决：生产默认关闭**

- TriCade 安装包不设置 `TRILC_DEBUG` 环境变量
- 开发测试期用户手动设置（系统环境变量或 .cmd 修改）
- daemon 启动时检测 env，记录到启动日志 `[trilc] debug mode: enabled/disabled`

---

## 二、公司 Reset 契约

### 2.1 端点定义

```
POST /internal/v1/init/reset
Request: { includeProject?: boolean }
Response: 200 { chainState: 'uninitialized', cleared: string[] }
         403 { error: 'debug mode required' }
         500 { error: string }
```

### 2.2 转移表处理

**裁决：专用重置函数，绕过转移表（状态文件直接重写）**

| 方案 | 优点 | 缺点 |
|------|------|------|
| 绕过转移表，直接重写状态文件 | 简洁、语义清晰（reset ≠ 状态转移） | 需专用函数 |
| 加 reset 转移到 TRANSITIONS | 保持转移表统一性 | 需处理多态回退、转移表复杂化 |

**理由**：
- reset 是「强制重置」，不是「状态转移」，语义不同
- 转移表设计为「线性前进单步」，加 reset 会破坏其简洁性
- InitChain.reset() 专用函数更易维护

### 2.3 清理面（精确白名单，复用 dev-reset-init.mjs 逻辑）

#### 运行态清理（无条件）

| 文件 | 路径 | 说明 |
|------|------|------|
| init-chain.json | `{dataDir}/company/init-chain.json` | 链路态文件 |
| state.json | `{dataDir}/company/state.json` | 公司态文件 |

#### 装配产物清理（白名单反查）

1. 读取 state.json 提取 `employees` 列表（格式 `[{ role, name }]`）
2. 按 roleId 反查删除：
   - `{workspaceRoot}/.claude/agents/{roleId}.md`
   - `{workspaceRoot}/docs/registry/company-state.json`
3. 占位文件保护（仅当内容为装配占位才删除）：
   - `{workspaceRoot}/AGENTS.md`（<1KB 且含标记词 `TriCade|TriMetaverse|占位|placeholder`）
   - `{workspaceRoot}/docs/registry/business-state.md`（同上）

#### 项目关联清理（可选，includeProject=true 时）

| 文件 | 路径 |
|------|------|
| project-registry.json | `{dataDir}/project-registry.json` |

#### 保留文件（绝不动）

- 会话历史：`{dataDir}/sessions/*.db`
- 密钥缓存：`{dataDir}/keys.json`
- cron 配置：`{dataDir}/cron/*.json`
- 损坏备份：`*.corrupt`（保留供诊断）

### 2.4 实现位置

**裁决：在 InitChain 类新增 reset() 方法**

```typescript
// init-chain.ts 新增
export class InitChain {
  // ... 现有方法

  /**
   * Debug reset: 任意链态 → uninitialized（绕过转移表）。
   * 清理面 = 运行态 + 装配产物白名单反查 + 可选项目关联。
   * 护栏: 仅当 TRILC_DEBUG=1 时调用（app.ts 端点层检查）。
   */
  async reset(opts: { includeProject?: boolean; workspaceRoot?: string }): Promise<{
    chainState: 'uninitialized';
    cleared: string[];
  }> {
    // 1. 读取现有 state.json 提取 employees（如存在）
    // 2. 清运行态文件
    // 3. 清装配产物（白名单反查）
    // 4. 可选清项目关联
    // 5. 重写 init-chain.json 为 defaultChainFrame()
    // 6. 发布 init:chain-changed 事件（to: uninitialized）
    // 7. 返回清理清单
  }
}
```

---

## 三、项目 Reset 联动

### 3.1 技术选项

| 选项 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| **A: includeProject 标志** | reset 端点请求带 `includeProject: true`，同步清 project-registry.json | 简单、统一入口 | 不清链快照、worktree 磁盘残留 |
| **B: 独立项目端点** | POST /internal/v1/projects/reset，单独清理项目关联 | 职责分离 | 额外端点、需两次调用 |
| **C: 全链重置** | reset 端点清理 project-registry + 链快照回 project-link（状态回滚） | 状态一致性 | 链快照回滚复杂 |

**裁决：选项 A（includeProject 标志）**

**理由**：
- CEO 需求是「反复测开业」，项目关联是开业流程的可选环节
- dev-reset-init.mjs 已验证 includeProject 路径（见第 9、77-80 行）
- 产品口径可请小乔确认：是否需要「项目重置」独立入口

### 3.2 产品口径建议（供小乔决策）

1. **简单模式**（选项 A）：`includeProject=true` 同步清 project-registry.json
2. **完整模式**（选项 C）：重置后链态回 project-link（用户重新走 link→sync→confirm）

---

## 四、两入口呈现

### 4.1 TriPilot 阶段卡

#### 按钮显示条件

```typescript
// extension.ts InitPhaseCardPayload 新增字段
type InitPhaseCardPayload = {
  // ... 现有字段
  debugMode?: boolean;  // 新增：debug 开关状态
  canReset?: boolean;   // 新增：是否可 reset（= debugMode）
}
```

#### 按钮位置

- 放置在阶段卡底部「诊断区」
- 仅当 `canReset=true` 时显示
- 按钮文案：「重新初始化」

#### 交互流程

1. 用户点击「重新初始化」
2. 弹确认对话框：「确认将公司重置到未初始化状态？这将清除公司装配产物（可勾选同时清除项目关联）」
3. 确认后调用 POST /internal/v1/init/reset（带 includeProject 标志）
4. 显示进度（清理解析）+ 完成提示（可重新开始开业）

### 4.2 trilc chat 指令

#### 指令契约

```
@trilc reset-company [--include-project]
```

#### 响应

- debug 未启用：「错误：debug 模式未启用（需设置 TRILC_DEBUG=1 环境变量并重启 daemon）」
- 执行成功：「公司已重置到未初始化状态。已清理：[文件列表]」

---

## 五、安全护栏

### 5.1 Debug 开关泄漏面

| 检查项 | 方法 |
|--------|------|
| 生产包默认关闭 | 构建脚本不注入 TRILC_DEBUG |
| 用户无法通过产品 UI 开启 | 无 settings 入口，仅 env |
| 端点强制检查 | app.ts 端点入口检查 process.env.TRILC_DEBUG |
| 启动日志记录 | daemon 启动时输出 `[trilc] debug mode: enabled/disabled` |

### 5.2 Reset 确认防误触

1. **TriPilot 侧**：二次确认对话框 + 清晰后果说明
2. **trilc chat 侧**：指令执行前返回确认提示（用户输入 `yes` 确认）

### 5.3 清理白名单精确性

** INCIDENT 纪律：绝不多删**

1. 装配产物删除前打印清单到 daemon 日志
2. 占位文件特征校验（<1KB 且含标记词）
3. 删除失败不中断整体流程（记录警告日志）
4. 清理清单返回给前端（用户可见）

### 5.4 会话历史/密钥不动

- 明确保留文件列表（见 §2.3）
- reset() 方法绝不访问 `{dataDir}/sessions/` 和 `{dataDir}/keys.json`

---

## 六、实现任务包（给小全）

### 6.1 TriLC 侧

| 任务 | 文件 | 描述 |
|------|------|------|
| **T1** | `src/company/init-chain.ts` | 新增 `reset()` 方法（见 §2.4） |
| **T2** | `src/server/app.ts` | 新增 POST `/internal/v1/init/reset` 端点（debug 检查 + 调用 InitChain.reset()） |
| **T3** | `src/config/env.ts` | 新增 `TriLCEnv.debugMode: boolean`（读取 process.env.TRILC_DEBUG） |
| **T4** | `src/company/init-assemble.ts` | InitPhaseCardPayload 新增 `debugMode`/`canReset` 字段（需同步 TriPilot 侧类型） |

### 6.2 TriPilot 侧

| 任务 | 文件 | 描述 |
|------|------|------|
| **T5** | `src/extension.ts` | InitPhaseCardPayload 类型扩展 + 阶段卡渲染逻辑（debug 模式下显示 reset 按钮） |
| **T6** | `webview/` 阶段卡 UI | 「重新初始化」按钮 + 确认对话框 |
| **T7** | `src/extension.ts` | reset 指令处理（调用 POST /internal/v1/init/reset） |

### 6.3 测试验证

| 任务 | 描述 |
|------|------|
| **T8** | 单测：InitChain.reset() 清理逻辑（复用 dev-reset-init.mjs 验证路径） |
| **T9** | 单测：端点 debug 关闭时 403 |
| **T10** | 集成测试：TriPilot 按钮 + trilc chat 指令 |
| **T11** | 门禁验证：生产包默认关闭（检查构建脚本） |

---

## 七、决策点汇总

| 决策点 | 裁决 | 理由 |
|--------|------|------|
| debug 载体 | 环境变量 TRILC_DEBUG | 与部署一致、泄漏面小 |
| reset 转移处理 | 绕过转移表，专用函数 | reset ≠ 状态转移、语义清晰 |
| 项目 reset 联动 | includeProject 标志 | 复用已验证逻辑、简单统一 |
| 产品入口 | 两入口（TriPilot + trilc chat） | 用户场景覆盖完整 |

---

## 八、风险与后续

### 8.1 风险

| 风险 | 缓解 |
|------|------|
| 用户误开启 debug 导致 reset | 生产包默认关 + 端点强制检查 |
| 清理白名单不精确 | 复用 dev-reset-init.mjs 已验证逻辑 + 单测覆盖 |
| 占位文件误删 | 特征校验（<1KB 且含标记词） |

### 8.2 后续优化

1. **诊断模式扩展**：debug 模式下解锁更多诊断字段（如详细错误堆栈）
2. **部分 reset**：支持保留 employees、仅清链态（需产品口径）
3. **自动化测试**：CI 中验证 debug 模式开关门禁

---

## 附录：dev-reset-init.mjs 参考路径

- 停 daemon：第 36-42 行
- 清运行态：第 44-56 行
- 清装配产物：第 58-74 行（白名单 + 占位保护）
- 项目关联：第 76-80 行（可选）
- 起 daemon：第 83-88 行
- 验证：第 91-97 行

---

**方案版本**：v0.1.0
**起草人**：小狄（CTO）
**日期**：2026-08-15
