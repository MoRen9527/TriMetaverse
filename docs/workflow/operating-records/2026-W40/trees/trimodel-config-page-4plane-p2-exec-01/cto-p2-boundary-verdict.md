# CTO 边界裁定卷·P2 managed 视图台账投影衔接点（FSD NEEDS_CLARIFICATION 裁）

- sourceOfTruth: 本件（P2 边界衔接裁面正身）
- syncMode: final
- lastSyncedAt: 2026-09-29 03:18:20 +0800（date 现查原样粘贴）
- 请示链: FSD 03:1x 骨架开工边界请示（数据面实勘 §2.2 契约 vs P2 任务书 §三 冲突点）→ 本席实勘后裁

## 一、实勘对表（本席独立复核，非转抄 FSD）

| 面 | 实锚 | 判读 |
|---|---|---|
| §2.2 契约定稿 | cto-implementation-plan.md L67「`?view=managed`（UI 面：掩码+**状态+台账**，现行语义）」+L167 验收映射「GET view=managed **+ 台账**」 | 台账=契约内字段，非新增语义 |
| P0 实现现状 | config-cards.ts L100-105 managed 分支=委托 handleGetTrimmcCard 原样透传（body 无 face 无台账）；L268-273 注释自记「P2 UI 接线时**经 managed 视图返回**，此处仅模块导出」 | FSD 断言属实；且 P0 时期已留口，**P2 窗补投影=P0 既定计划** |
| 读取面现成度 | card-faces.ts L92 readFaceLedger() 现役导出+pull 分支 L115-117 updateFaceLedger 写面在跑 | 纯读面投影，零新读写路径 |
| 工作量 | managed 分支拿 handler 返回展开合并 `{...body, face, ledger}` ≈8 行+e2e 断言数行 | FSD「~10 行 additive」估计成立 |
| P2 任务书边界 | §三「daemon 本体架构与后端 API 不动（纯前端+静态资源层）」 | 与 P0 L270 留口**立单时未对上=计划缝隙**，非边界本意 |

## 二、裁定：**方案①=随批补全**（managed 视图台账+face 投影随 P2 批窗接线）

**理由链**：
1. **契约正身优先**：§2.2 定稿 L67/L167 明文 managed 含台账——P0 借道现役 handler 透传系过渡实现，注释自记 P2 补全；「后端 API 不动」边界的本意=**防后端架构改造扩散**（保护 P2 纯前端+渲染门+独立 revert 锚的三件事），非冻结 §2.2 契约既定字段。
2. **MVP 划线纪律**：一致面 #2（拉取状态区）#6（审计行）若候接线占位过 CEO 终验=两项对表项半残交付；L167 验收映射把「managed+台账」列为验收路径，划出首版须显式标注+知情——与其留缺口走知情程序，不如随批 8 行补全。
3. **诚实三态不受影响**：接线落地前骨架期占位照旧（FSD 现行做法正确）；接线后 UI 数据源=真实 ledger 投影，诚实三态从「候接线」态升级为「实数据」态。
4. **回滚面完整**：随批 commit 落 A6 revert 锚覆盖域；additive 形态（G9 同族：纯增量零改写现役分支语义——401/404 守卫路径不动，仅 200 成功分支 body 扩展）。

## 三、程序面（边界修订不走本席单方）

- **本席裁的是技术与工程边界语义**；P2 任务书 §三 字面批注归任务书 owner 面——建议 COO 转任务书批注一行：「§三 边界澄清：managed 视图台账+face 投影 additive 补全随批，系 §2.2 契约既定项（P0 config-cards.ts L270 注释留口），非后端架构变更」。CEO 终验时边界澄清在卷。
- FSD 骨架照旧不等本裁；接线窗按本裁执行，e2e 断言随批入 config-endpoints.test.ts（managed 200 含 face+ledger 字段断言）。

## 四、不混批边界（防扩散）

- **G2b（managed 明文回显语义）不随本裁动**——仍候 CPO 对表（门审卷 411609cd §二 记档），本裁只动台账投影不动键值回显语义；FSD 接线时**禁止顺手改**回显面。
- 台账投影只读 face-ledger 现役写面投影；**face-events.jsonl 原始审计账不进 managed body**（UI 审计行展示用 ledger 摘要面即可，raw 账面留 CLI/审计通道）——防 body 膨胀与敏感面外扩。

## 五、使用依据

- §2.2 契约：cto-implementation-plan.md L67/L167（本席直读）
- P0 实现：TriModel src/api/config-cards.ts L96-105（managed 分支）/L268-273（faceLedgerSnapshot 留口注释）/L115-117（ledger 写面）；src/card-faces.ts L92（readFaceLedger）；src/api/trimmc-card.ts L32-37（handler 返回形态）
- 任务书：task-charter-trimodel-config-page-4plane-p2-exec-01.md §三（11a52dbfc）
- 纪律：MVP 划线纪律（核心需求不划出首版）/归属路由阀门（任务书字面批注归 owner 面）/门不豁免（additive 亦走 e2e 断言）
