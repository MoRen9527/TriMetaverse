# 主观题族判卷规程文卷 v2（v1 承续增补·notice-179 施工序随线）

- **seat**：STE（小柯）·判卷规程供卷席
- **性质**：v1（ste-subjective-judging-protocol-20261118.md）**承续增补非重写**——v1 三段规程/schema/锚文/两维度分列/跑用交接面全谱继续有效；本卷=四增补面对表落卷（CEO 三裁全批 notice-179·O3 码面 12eef86+O1 COS 规划卷 §三+Score/Close Skill 双模板落树面对表）
- lastSyncedAt: 2026-11-18（date 现查·增补落卷时戳锚=commit 时戳 D-47 形）

## §一增补·threshold 70→95 语义段更新（v1 §五承录改定）

- **判定线=95**（NEW_STRUCTURE_THRESHOLD·自新结构首轮起用；enforcement=joint_review_recycle **--threshold 带值位**·零硬编码改链——旧 70 值=r1 存档面零触 C 款遵行）。
- **语义承录（v1 语义面原样随迁）**：95=判定线**非质量目标线**——RETRY 轮针对红灯族与四句门红面修；主观族低分不单独触发 RETRY（随总盘判定走）。
- **主观族在 95 线中的构成语义更新**：判定总盘基面=**权重 120 归一形**（见 §四增补）——主观/改善意见面占 20/120·机判+采集+十段基准 100/120——pending 态分层呈现禁投影冒充语义维持。

## §二增补·改善意见必付面入规程（O3 schema 对表·validate_improvement_opinions 同律）

- **每席每维度 improvement_opinions 三件套（缺=fail-closed 不消费）**：
  1. **rationale 禁裸意见**（逐条说理必附·「建议…因为…」形）；
  2. **evidence_ref 可复核锚**（run_dir 实产物相对路径）；
  3. **check_time D-47 戳**（date 现查原样粘贴·UTC Z+08 双轨）。
- **双 topic 必付对表**：①周迁移质量 ②fade-001 自身完善度——两 topic 各自独立成条·缺任一 topic=该席 sheet 不完整 **fail-closed 不消费不冒充**（卷面落卷留审计·聚合排除·incomplete_faces 如实列——O3 单测四态形：完整/缺 topic/裸意见/空面）。
- **spawn 面即教**：prompt 模板随迁改善意见必付面注记（spawn 输出契约增必付面·零事后补面）——判卷席落卷侧同律：落卷前自检双 topic+三件套齐，缺=补齐后再落（卷面留审计痕）。

## §三增补·Score/Close Skill 卷模板位注记（notice-179② 语义勘定承）

- **Score Skill 卷模板**（score-skill-卷模板-20261118.md）=**十阶段内评卷面**——段内评分载体（十段各 10 基准+改善意见面 20 承载位）。
- **Close Skill 卷模板**（close-skill-卷模板-20261118.md）=**终判收口面**——closeout 收口判定与四句门终态同卷呈现位。
- **正交勘定承**（notice-179②）：Skill 双模板卷面与 **7 席联审 loop 尾段正交**——联审 sheet（seats/<seat>-score.json·S4 形）≠Skill 卷面≠subjective-score.json 判卷卷（三卷分立零互写纪律承 v1 §六扩三卷）。
- 权重面 scope 如实承（O3 卷注原样）：120 归一 engine 消费面**本体**=Score/Close Skill 卷模板工序承载位——loop_autoreview 语义常量=对表锚·零越域改 score_engine 现役面。

## §四增补·权重面 120 归一对表注

- **基准形**：NEW_STRUCTURE_WEIGHT 十段各 10（=100）+**改善意见面 20**=基准 **120 归一**（engine 消费面对表锚·O3 落码面）。
- **与 v1 并盘 100 制关系如实注**：v1 §五三域直加 100 制（机判 59+采集 31+主观 10）系 **score_engine 现役面**（r112 线已闭）；**120 归一系新结构首轮面**（Skill 卷模板工序承载·自新结构首轮起用）——两制并行期判读以**跑用面标记**为准（新结构轮=120 归一形/现行轮=100 直加形），两制数值零互折（混折=无效卷）。
- 主观/改善意见面在 120 制中=20/120 构成·pending 分层禁投影冒充语义承 v1。

## §五增补·判卷席操作清单（v2 增量三步）

1. 落卷前自检：双 topic improvement_opinions 齐+每条三件套齐（缺=补齐再落·审计痕留）；
2. 卷面双制标记：跑用面=新结构轮（120 归一）/现行轮（100 直加）显式注——禁混折；
3. threshold 语义用 95（--threshold 带值面·非硬编码引用）——判定线语义承 v1 §五原样。

## 使用依据

notice-179 三裁令文（CEO 三裁全批·threshold 95+O1-O4 全批）；O3 码面读数卷（sde-o3-convene-code-readout-20261118·12eef86 diff+单测四态）；O1 COS 规划卷 §三（cos-plan-skill-卷-新结构首轮-20261118）；Score/Close Skill 双模板落树卷；v1 判卷规程卷（ste-subjective-judging-protocol-20261118 承续基座）。

—— STE 小柯（m-ste·判卷规程供卷席）·2026-11-18（commit 时戳锚）
