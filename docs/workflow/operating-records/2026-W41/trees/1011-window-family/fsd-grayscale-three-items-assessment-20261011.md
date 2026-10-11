# FSD 灰度三项评估+CTO 会签卷（hub-silent-detect 灰度周反馈）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-11T10:18:16Z（18:18:16+08·date 现查原值）
- 施工位: FSD 小全（m-fsd）
- 令源链: CTO 转呈 18:15（灰度周反馈三项汇总·卷面正身=COO 卷 b758ca41）→ FSD 评估 18:16 → CTO 会签 18:17（APPROVE×2+照排×1）
- 状态条: ①date 现查 2026-10-11T10:18:16Z ②水位=中（评估+会签闭·施工候窗）③联审证据=本卷 ④末次活动=本卷 lastSyncedAt

## 三项处置定稿（评估+会签合卷·施工窗直取）

### ① 候窗态误报——候选 B 采（CTO APPROVE）

- **根因实锚**：duty second-hop（hub-silent-detect.mjs L186-212）只读 transcript 单源，主循环 entry 级三源 OR——豁免面不对称=误报温床（m-cos 候窗态不产 transcript 写入→单源判静默→直报 BOD）。
- **施工方向**：duty hop 判据补 transcript 活动类型面（读尾部 JSONL 尾轮回合类型，判「候窗态尾轮」=收到回执后无新请求轮→豁免）。
- **裁量注记**：文本启发式弃（头注 L12「note-text heuristics avoided」哲学引用成立·CTO 认）。
- **施工边界注记（CTO 会签·最高风险误豁免形态·必入测试面）**：**长任务深潜反例**——transcript 持续写入（进行中长 assistant 轮/半写尾行）不得误判「候窗尾轮」。测试用例至少含：候窗尾轮（豁免正例）/长 assistant 轮进行中（不豁免反例）/半写尾行（不豁免反例）/正常静默（仍升级正例）。

### ② 重复投递——幂等键方向采（CTO APPROVE·含两点补笔）

- **实锚**：TMV notify-sender.mjs（94 行）零 retry（仅 10s timeout abort）→重复产自 daemon/executor 层（TriMLC 域）。
- **机理勘正（CTO 补笔 a·FSD 原推论瑕疵认领）**：两条直报隔 4min<900s 周期=**同轮执行段内双投**——FSD 原信「三钉②冷却下轮重发」系跨轮机理，解释不了本案间隔（900s=15min 轮距下 4min 间隔只能同轮）；**daemon 侧（TriMLC notify 投递管道）层内 retry 有无=勘修窗必勘项**，此证据随卷。
- **施工方向**：确定性 message_id（dutyKey+时间窗哈希代随机）——「可去重」；**「谁去重」随一并定（CTO 补笔 b·禁悬空）**：建议 daemon 投递管道侧治本，hook 层轻量查重表候选。
- **落点权属**：message_id 若 sender 可传则 TMV 先落；若 daemon 侧生成则候勘修窗（与层内 retry 勘项同窗）。

### ③ 贴线 453s/600s——照排（认达）

- 根治候勘修窗照排不动；优化方向附注：collectNodeSignals 逐 entry 串行 git plumbing 并行化=合理候选，随勘修窗评。

## 窗位（会签认达）

- ①+② TMV 侧（判据改+幂等键半件）：候 W1 窗毕后空档或灰度周评估节点（候 BOD/COO 排）
- ② daemon 侧（层内 retry 勘+投递管道去重治本）：候勘修窗
- 均不入今晚 W1 窗（21:10-22:30）备料

## 使用依据

- CTO 转呈 18:15 三形态汇总（卷面正身=COO 卷 b758ca41）·当事人回执 18:10（候窗静默非挂起）
- FSD 实勘：TriMetaverse/scripts/fade/hub-silent-detect.mjs（L12/L131/L186-212/L268）+lib/notify-sender.mjs（零 retry）
- CTO 会签 18:17（候选 B APPROVE+幂等键 APPROVE+补笔 a/b+窗位认达）
- 纪律：硬门签认必落卷直达（CTO 会签在会话信=暗签，本卷即消费面正形）
