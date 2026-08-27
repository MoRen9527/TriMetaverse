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
