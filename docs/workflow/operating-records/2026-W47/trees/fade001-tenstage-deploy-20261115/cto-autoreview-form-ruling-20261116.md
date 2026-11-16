# ②迁移施工·技术形裁定卷（七席自动联审入 TriRMC loop·CTO 主刀）

- date 现查: 2026-11-16（D-47）；施工序: 本裁定→SDE 施工→STE 复验→真值轮验证
- 令面: r154 CEO 19:20 直令（loop convene 段升级 auto-review 形·三域评分＋四句门对照在 loop 内闭环）
- a) 检出追平态: **已达成**——TC dev@b8fbdb0 含 V2-2 auto-segment（本席 FF 实勘在案）；余=河源 pull（R 面动作，照跨机路由 BOD SSH/值班自拉，不经 sg 中转）

## 一、形态定谳（auto-review 形正身）

**七席评分角色=loop run 内 headless 评分会话族**（每席一会话·材料只读投喂·评分 prompt 模板化）：

1. **执行体形态**：per-seat headless agent 会话（convene_mode=auto 触发后，runner 为七席各起一会话：投喂=run_dir 三域材料族+该席评分角度 prompt 模板；产出=该席评分 sheet JSON 落 run_dir/convene/seats/&lt;seat&gt;-score.json）；
2. **三域评分闭环在 loop 内**：machine 域=引擎 v2.0.0 原样（已机判）；collection 域=采集卷消费（接口在位）；**subjective 域=七席评分 sheet 聚合**（每席角度独立打分→聚合形=r119④ 联评形的自动前段——**人联评降为终审签认位不废**：聚合初判出、值席终审签认回执保留，防线双层）；
3. **四句门对照在 loop 内闭环**：CEO 四句=四条机械断言入 runner（对照 migrate/keep/carry_over counts 与树清单实勘）：①不漏任务不漏树=doneTrees 随迁清单 vs 迁移面实树清点零缺；②不多任务不多树=迁移面新增树数==迁移 counts；③必迁文件不漏=必迁族（task-inventory/daily-progress/OP 双件/whitelist 族）逐件在 to_week 面在位；④该收口的收口该迁移的适配=closeout brief 在+节收口行四态词在——**四断言全绿=四句门 PASS 行入 score 面；任一红=四句门 FAIL 行+本轮 verdict 降 RETRY**。

## 二、边界与不变面（护栏正身）

- **零直接投递零 POST 保持**：七席评分 sheet 落 run_dir/convene/seats/ staging——**控制面=m-duty-cos 值守拾取发送不变**（V2-2 人在线边界正形延续，自动段不越投递面）；
- **零触在途链与已验收现役链**（§六 v2 隔离纪律照守）；回滚锚谱系续用（d7e7831e 系+本形施工笔独立 commit 单笔族 revert 一键）；
- **人联评终审位不废**（r119④ 联评形语义保留：自动聚合初判→值席终审签认——防线双层非替代）；
- 评分 prompt 模板零密钥零敏感值（D-46）；材料投喂只读（run_dir 件族只读挂载）。

## 三、施工序（SDE 主刀·STE 复验·真值轮验证）

1. **S1 河源检出追平**（a 步收尾）：heyuan pull TC dev（b8fbdb0 在位核）——R 面通道；
2. **S2 auto-review 形施工**：loop convene 段升 auto-review——七席评分会话 runner（spawn/收集/聚合）+四句门四断言+subjective 聚合初判形；独立 commit 单笔族；
3. **S3 dry 双态**：dry=渲染零落位零会话 spawn（预演面）；实弹 dry-run 席=单席试会话（materials 投喂+sheet 产出核）；
4. **S4 STE 复验**：评分 sheet 形/聚合数/四断言单测；
5. **S5 真值轮验证**：loop-window 触发轮全链（七席会话实弹+四句门 PASS 行+聚合初判落卷）。

## 四、验收锚（STE 复验+真值轮判据）

1. 七席评分 sheet 七文件齐（每席独立形在=席单形独立性保持）；
2. 聚合初判形=subjective 域自动分出（与 cos 自评形并读不覆盖——**双轨并读期**：自动聚合形与人评形并列至终审签认制度定谳）；
3. 四句门四断言全绿行入 score 面（FAIL 任一=本轮 verdict RETRY 照降）；
4. 护栏零违（零触在途链/零直接投递/零密钥）。

## 五、风险与降级

- 七席会话 spawn 成本（7×模型调用/轮）——降级形=抽三席代表形（CPO/CTO/COO 角度代表）候 BOD 裁；
- 会话失败单席=该席 sheet 缺席如实注（聚合降级为已席均形+缺席标注——不冒充全席）；
- 与 r119④ 联评形制度的关系=本形为**联评前段自动化**，人联评终审位保留——制度面归 CAO/BOD 知悉。

## 使用依据

r154 CEO 直令；V2-2 交付 b8fbdb0（loop_convene_auto.py 全读）；V2-1 966f99d 谱系；§六 v2 隔离裁量；CEO 四句门（§九 冻结照录）；r119④ 联评形制度线。
