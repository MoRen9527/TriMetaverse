# core-agent 留痕必要性评估·CTO 技术事实段

- sourceOfTruth: 本件（CTO 技术事实面；三择候 CEO 终裁）
- syncMode: draft
- lastSyncedAt: 2026-09-23T23:2x+0800（date 现查 23:27:03，本回合执行）
- 实勘: D:/Code/ai/core-agent/ 全目录+全工作区引用面 grep+TriMC/src/observability 现态

---

## 结论

core-agent 件**仍在仓**（D:/Code/ai/core-agent/ 完整目录：src/sql/test/scripts/samples/docker-compose+README）；**observability 迁移源职能已完结**——TriMC/src/observability/ 四件实装在位（benchmarkGate/benchmarkSummary/contractSamples/index），README 自述「Its useful parts belong in TriMC/src/observability/」=迁移完成态自认。

## 依据

1. **README 自述完结态**（core-agent/README.md:3/8）：「Legacy observability and replay scaffold that now feeds TriMC service-domain observability」「Its useful parts belong in TriMC/src/observability/」——legacy 定性+去向已归位双自认；
2. **迁移去向实装实锚**：TriMMC/src/observability/ 四件在位（benchmarkGate.ts/benchmarkSummary.ts/contractSamples.ts/index.ts）——README 指称的去向实存；
3. **活引用面甄别**：全工作区 grep 仅三处命中，**全是「禁误引」护栏行**（CTO 行为护栏 :120/BS 历史注 :33/compass session :123——同款文案「不把 core-agent 当成现役服务域主控；它只可作为历史 observability 迁移源」），**零代码级 import**（无 ts/py 消费）；
4. **无进程/服务依赖**：3333/8713/8711 三服务面与 core-agent 零关联（config-plane/daemon/tui 均独立仓独立进程）。

## 建议倾向

**精简保留（中间档）**，倾向理由三条：
- **清删除的反对**：sql/schema+test+samples 可能含 observability 迁移期的源参考价值（历史考古面）；且三处护栏行的防误引实效实证有效（LLM 工作区扫描撞上需有护栏对冲）——护栏保留前提=目录物理在位（删目录则护栏行成无的放矢，可转历史注）；
- **原样保留的反对**：src/test 全量留着占工作区扫描面（LLM 探索噪音），且 legacy 脚手架与现役四仓零代码关联，保留=纯历史陈列；
- **精简保留平衡点**：README 头注加一行「迁移已完结（TriMC/src/observability/）」终局定性+src/test 瘦身或归档域移置（保 README/sql/schema 作史）+三处护栏行保留改注「已归档」——具体裁度候 CEO 终裁。

## 边界遵守声明

历史叙事件未动；仅活护栏行语义甄别；不裁决（三择候 CEO）。
