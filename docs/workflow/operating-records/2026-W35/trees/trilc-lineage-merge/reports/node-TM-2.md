# 节点收口报告 — TM-2（门禁+单线化+台账）

- nodeId/agent: TM-2 / TestEngineer（TriMLC 本地执行）
- 起止: 2026-08-27T15:0xZ → 15:4xZ（UTC）
- 基线 commit: integrate/tc001-canonical@7707b9b（27 重放末梢）
- 触发来源: 同 TM-1 连续执行
- 动作序列:
  | 时刻(Z) | 动作 | commit |
  | --- | --- | --- |
  | 15:0x | tsc 首跑 → TS2300 ×6（两接口续跑参数双声明） | — |
  | 15:1x | npm test 首跑 578/8（staffing 两条新增失败定位=撞 p0fix3 fail-closed 门） | — |
  | 15:2x | 去重修正×2（保留 sg TC-001 块，删本地旧对） | 44e3843 |
  | 15:3x | roster-gating 套件适配（before 注 token+三处 fetch 带头，镜像 qa stub 正解） | ff2f970 |
  | 15:4x | 复门：tsc 全清 + 585 pass/fail 1（唯一=tui 预置债 HS-3 ✓ 零新增；staffing 两条复绿，总通过 585 创新高） | — |
  | 15:4x | dev 单线化：checkout -B dev integrate（FF 不可达=弃草案语义自证）→ GitHub lease 安全重置(8ad6d5c→ff2f970, 旧线保全 backup)→ sg-bare 纯 FF(876d21e→ff2f970) | — |
- 工件清单: 本地 dev@ff2f970；merge-log.md（本目录）；修正案 2 提交
- 门禁结果: `npx tsc --noEmit` → exit 0 零输出；`npm test` → 585 pass/1 fail（唯一失败=test\tui\components.test.ts＝HS-3 预置债）
- 异常与处置: FF 不可达非异常（设计内弃草案）；lease 推送保证旧线可达性
- 断点交接: 无中断；heyuan 生产切线动作移交验收窗口（见 merge-log 决策节）
- 使用依据: 计划 §二步骤 0-4；tc001-harness-scaffold HS-3 基线登记


## 机读核心（§2.7 v1.4.1 格式增补，2026-08-28；事实同上散文节）

```json
{
 "nodeId": "TM-2",
 "agent": "TestEngineer（TriMLC 本地执行）",
 "startedAt": "2026-08-27T15:02:00Z",
 "finishedAt": "2026-08-27T15:40:00Z",
 "baselineCommit": "integrate/tc001-canonical@7707b9b",
 "trigger": "manual（同 TM-1 连续执行）",
 "actions": [
  {
   "t": "15:0x",
   "act": "tsc 首跑 TS2300×6（两接口双声明）",
   "commit": "-"
  },
  {
   "t": "15:1x",
   "act": "npm test 578/8，staffing 两条新增失败定位（撞 p0fix3 fail-closed 门）",
   "commit": "-"
  },
  {
   "t": "15:2x",
   "act": "接口去重修正（保留 sg TC-001 块）",
   "commit": "44e3843"
  },
  {
   "t": "15:3x",
   "act": "roster-gating 套件 fail-closed 适配（token 注入+带头）",
   "commit": "ff2f970"
  },
  {
   "t": "15:4x",
   "act": "复门 tsc 清+585/1（唯一=HS-3 预置债）；dev 单线化 lease 重置+FF 双推",
   "commit": "-"
  }
 ],
 "artifacts": [
  {
   "path": "dev=ff2f970",
   "evidence": "单线化双远端"
  },
  {
   "path": "merge-log.md",
   "evidence": "台账"
  }
 ],
 "gateResults": [
  {
   "cmd": "npx tsc --noEmit",
   "exit": 0
  },
  {
   "cmd": "npm test",
   "exit": "585 pass/1 fail(HS-3 预置)"
  }
 ]
}
```
