# rubric 并盘 100 改形施工毕报卷（STE 主刀·候 CTO 确认链+线 3 事件令）

- **seat**：STE（小柯）·施工主刀席
- **链路**：CEO 直令 16:23:35→方案卷（ste-merge100-rescheme-proposal-20261115）→CTO 门禁有条件 PASS（勘正卷 a3793c559：机判域算术勘正 63→59+偶合注+61.5 交接注——三件已即办落卷）→**施工批毕（TriCompany b54cf39）**
- lastSyncedAt: 卷面时戳锚=git commit 时戳（D-47）

## §一 施工批读数（五件一笔·b54cf39）

| 件 | 面 | 读数 |
|---|---|---|
| rubric-firstshoot.json | 九族乙 v2+I 族列（判据/锚文/规程全引主观题卷正形） | 权重合计 **100 勾稽**（机判 59=B9+C13+D9+E9+G19·采集 31=A9+F13+H9·主观 10）——勘正①公式活体 ✓ |
| score_engine.py | **v2.0.0** 三域直加制 | SUBJECTIVE_FAMILIES=("I",)+_judge_subjective（判卷消费：I1≤4/I2≤3/I3≤3 封顶+禁裸分锚 rationale 非空+evidence_ref 存在性半机判+run_id 对表）+_judge_collection（采集消费：二值制贴 verdict_rule+禁裸判锚）+总分段直加（归一化除法退役）+分层输出（total_pending_weight/total_projection/domain_breakdown） |
| score_rubric.py | 键域 A-H→**A-I**+勘误文案 | validate 九族过 ✓ |
| test_score_engine.py | 期望校正三案（字面校准留痕+正道可达注）+**消费链新案 3** | 降级案 9.0/C 红边界 46.0/G 红 cap 构造扩两卷（81→cap 59 正道可达形）/归一化案→直加案（59+pending 41+projection 100+breakdown 断言）——**禁删断言零违反·双件套教义遵行** |
| test_score_rubric.py | 快照案随令（九族乙 v2+令锚留痕）+键域断言 +I | ✓ |

## §二 验证读数（三面）

1. **单测**：三件 **39/39 OK**（36 基线案期望校正+3 消费链新案：满盘勾稽 100/禁裸分锚活体 96/pending 分层 41）——改形前基线 36/36 OK 快照在档（回退对照面）。
2. **完整预演三态**（/tmp/merge100-rehearsal.log）：
   - 态1 满盘：total=**100.0**（59+31+10）·pending 0·projection 100·pass ✓
   - 态2 pending（首拍时点形）：total=**59.0**+pending **41**+projection **100**·机判已判/采集主观分层待 ✓
   - 态3 G 红灯：机判 40+采集 31+主观 10=**81>59→cap 压 59**·fail ✓（红灯不洗白语义活体保留——REDLINE cap 权重解耦实锚）
3. **score_cli 契约**：四参面原样（--help 面+三路径分立零动）✓

## §三 施工实现细化如实注（候 CTO 确认两处）

1. **采集域消费链新增**：方案卷 §三.2「采集未判=分层输出」隐含采集分进链接口——现役 v1 无此接口（manual 恒 null），施工补 **collection-score.json** 值席采集卷形（entries[{family_id, verdict, rationale, evidence_ref}]·二值制贴 verdict_rule）+engine 消费——与主观卷同构分立，毕报如实列候确认。
2. **score_cli 判卷位处置**：§四.4「命令面+判卷位」——判卷=人工落卷件（rationale 必附+判卷时点打戳），cli 零新增子命令=设计内（subjective-score.json/collection-score.json 落 run_dir 即被 engine 消费·消费面已接线）；「判卷位」以**落卷约定承载**（schema 锚=主观题卷 §判卷规程）——如实列候确认。

## §四 判读表 v2 建议行（§四.3·表主 COS/值席面采纳）

- 「主面机判读数」行：61.5 形（归一化百分制）→**直加制构成读数**——首拍时点=「机判 X/59+pending 41（采集 31+主观 10）+projection 100」三层并呈（G5 三层分立先例形）；
- 「红灯 cap」行：C79/G59 零动（权重解耦实证：G 红满盘 81→59）；
- 「主观族」行：新增——判卷三段（初判值席/联审五角度/终判卷 COS）·subjective-score.json 落卷即消费。

## §五 倒排确认

- 预演 **17:5x+08 毕**（≤23:00 倒排 ✓·23:30 冻结闸余量充裕）→23:30 闸→23:50 首拍锚零动（jobs.json 零触实证：改形五件零涉调度链）
- 回退锚：`git revert b54cf39` 一键回 61.5 形（+rubric 备份 /tmp/rubric-pre-merge100-backup.json 双保险）

## §六 使用依据

CTO 门禁勘正卷 a3793c559+方案卷+主观题卷正形；TriCompany b54cf39（改形笔五件）；基线快照 36/36 OK；预演 log /tmp/merge100-rehearsal.log；期望校正双件套教义。

—— STE 小柯（m-ste·施工主刀）·写前现查 〔commit 时戳锚〕
