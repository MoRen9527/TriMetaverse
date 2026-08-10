# 自研循环 v1 — 方案 B 测试计划

> w33-4: 验证 TriLC 自身 agent loop 的编码能力
> 方案 B = 纯 TriLC agent，不依赖 OpenCode/Claude Code/Codex 外部引擎

## 测试目标

验证 TriLC agent 能否独立完成：**理解需求 → 定位文件 → 生成代码 → 写入 → 验证** 的闭环。

## 测试场景

### 场景 1：简单字段追加（P0 — 必须通过）

**需求**：给 `/healthz` 返回值增加一个 `serverTime` 字段（ISO 8601 格式的服务器当前时间）。

**验证标准**：
1. TriLC agent 正确定位到 `TriLC/src/server/app.ts` 中 `/healthz` 的处理代码
2. 生成正确的代码修改（在 JSON 响应中增加 `serverTime: new Date().toISOString()`）
3. 使用 Write/Edit 工具写入文件
4. 修改后 `tsc --noEmit` 零错误
5. `curl http://127.0.0.1:8711/healthz` 返回包含 `serverTime` 字段

### 场景 2：CLI 子命令追加（P1 — 加分项）

**需求**：给 `trilc status` 输出增加一行 `version` 信息。

**验证标准**：
1. 定位到 `TriLC/src/cli.ts` 中 status 命令的实现
2. 在输出 JSON 中增加 version 字段
3. tsc 零错误
4. `trilc status` 输出包含 version

## 测试步骤

### Step 1: 备份当前状态
```powershell
cp D:\Code\ai\TriLC\src\server\app.ts D:\Code\ai\TriLC\src\server\app.ts.w33-backup
```

### Step 2: 通过 TriPilot 发送需求
在 TriPilot 聊天窗口输入：
```
修改 /healthz 端点，在返回的 JSON 中增加一个 serverTime 字段，
值为 ISO 8601 格式的当前时间。修改后运行 tsc --noEmit 确认零错误。
```

### Step 3: 观察 Agent 行为
记录以下指标：

| 指标 | 记录 |
|---|---|
| Agent 是否理解了需求 | Y/N |
| 是否正确定位了文件 | Y/N (实际文件: ________) |
| 使用的工具 | Read / Write / Edit / Grep |
| 是否自动运行了 tsc --noEmit | Y/N |
| 修改是否正确 | Y/N (人工审查) |
| 总耗时 | ______ 秒 |

### Step 4: 验证
```powershell
# 类型检查
cd D:\Code\ai\TriLC
npx tsc -p tsconfig.json --noEmit

# 功能验证（需要重启 daemon）
trilc restart
curl http://127.0.0.1:8711/healthz | findstr serverTime
```

### Step 5: 恢复
```powershell
cp D:\Code\ai\TriLC\src\server\app.ts.w33-backup D:\Code\ai\TriLC\src\server\app.ts
```

## 能力边界标注

测试完成后标注：

- [ ] 方案 B 通过 — TriLC agent 可独立完成基础代码修改
- [ ] 方案 B 未通过 — 需要引入方案 A（外部代码引擎）
- [ ] 局限性：________________________________

## 备注

- 当前 dev 侧的 Claude Code CLI 本身就是方案 A 的参考实现
- 方案 B 验证的是 TriLC daemon 内嵌的 agent loop 的编码能力
- 如果方案 B 不通过，不代表失败——它明确了当前 TriLC 的能力边界，为后续 TriCode 集成提供基准
