# 任务书 batch-15 件③（BOD 20:5x 派·FSD 主·TriMMC 合同面施工单=T5 卡点②62/63 终裁落地）

- 背景：T5 卡点②（合同 62/63）CTO 终裁 2026-10-02 20:5x 达（全程读码+实跑测试取证，errors=2 实锚）——BOD 裁=**两条全采纳**，施工单即铸
- 裁决正意（CTO 终裁 verbatim 要点）：
  - **总裁**：两条均系 TriMMC 测试期望漂移（超前/超出于源侧+spec 现役态），源侧合同数据零缺件；源侧零改动
  - 62=TriMMC schema 缺 Registry family 分支（board+business-strategy 两份合同 paths 四件套 Required 未满足，而合同自证 Registry 非人格席「无四件套」=设计声明+CEO 09-27 审认在役 v3.1——补数据=破坏设计，不裁）
  - 63=期望超前（测试把 spec L104 候裁待办「runtime_baseline 对象形」断言成在役必填；全族 15 份双字段零持有实锚）
- 任务：
  ①**TriMMC schema 增 Registry family 分支**：src/contracts/agent-contract.ts——paths.soul/memory/colleagues/social 四件套对 Registry family 豁免+paths.agent_body 简形合法→resolve 15/15
  ②**期望校准两条**：62 期望 14→15（「预研 14」系 board 09-27 Registry 化前旧形历史态）；63 断言回落 spec 现役可选态（runtime_baseline 容 undefined/runtime_equivalent 容缺省）——波及面全族 15 份生效（CTO 仅系被点名样本）
- 独立候裁条（不在本单施工）：「runtime_baseline 对象形补齐」回 spec B 段裁决流程（spec L104 候裁标记激活；裁决后源侧 15 份批量补+断言升级，两步分明）——大表候办照录候窗
- 验收锚：resolve 全族 15/15 绿+62/63 两测试绿+全量测试四项读数（全量回归读数纪律：总数/通过/失败/既有失败逐族归因）+源侧合同正身零 diff（CTO 裁「源侧零改动」复验）
- 边界：不动源侧合同正身（TriCompany/source-agents 契约面）；不动 spec 现役条款；备选 B（扫描域剔除 board/bs）已裁不采——丢失治理席合同面机器可读入口；零敏感值
- 时点：**候 COO 排窗裁量**（今晚窗 FSD 车道空且不在 B 段伴行则可领，否则 10-03 维护窗并窗——B 段 21:30 优先）
