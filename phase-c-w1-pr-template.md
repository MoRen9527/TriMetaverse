# Phase C W1-4 最小 PR 描述模板

> 用途：满足 W1-4“架构调整提交附带四重回归证据”。

## 标题建议

`[Phase-C-W1] <本次架构调整点>`

## 描述模板（可直接复制）

```markdown
## 变更范围
- 调整点：
- 影响目录/模块：
- 回滚方式：

## 四重回归证据

1) 编译门禁
- 命令：`npx tsc --noEmit`
- 结果：通过 / 失败

2) alias 门禁
- 命令：`powershell -ExecutionPolicy Bypass -File scripts/acceptance/daily-smoke.ps1`
- 关键结果：`MISSING=0`、`BAD_ALIAS_TARGETS=0`
- 结果：通过 / 失败

3) smoke 产物留存
- txt：`Tripilot/artifacts/acceptance/daily-smoke-YYYYMMDD-HHMMSS.txt`
- json：`Tripilot/artifacts/acceptance/daily-smoke-YYYYMMDD-HHMMSS.json`
- `overallPass`：true / false

4) 主路径手工回归（opencode-acp）
- 输入：
- 观察结果：
- 结论：通过 / 失败

## 风险与后续
- 已知风险：
- 后续动作：
```