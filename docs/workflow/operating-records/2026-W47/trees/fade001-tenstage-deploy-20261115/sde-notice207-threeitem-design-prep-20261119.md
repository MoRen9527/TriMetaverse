# SDE notice-207 三条＋notice-208 第四件施工设计面预备稿（候排接入件·零施工越位·COO 拆树候接入）

- sourceOfTruth: 本卷（四件族施工设计面预备·候 COO 拆树派工接入即施）
- syncMode: write-time
- 执行席: SDE 小布；令源=m-duty-cos 施工令（notice-207 三条+notice-208 第四件·CEO 增补令·入账卷 fade001 树）
- date 现查: 2026-11-19T00:5xZ（D-47）
- 判定: **四件族承领·同窗统排单笔族·施工窗=ns6 排面候接入（零施工越位）——设计面预备随卷（接入时零准备成本）**

## 件① · Score CLI→Skill 硬序改造（二款）

- **链序现形**：score_cli→score_rubric→close_skill→close_cli→notify_done（Score skill 评卷=链尾 joint_review_trigger best-effort 触发·组织层人工形）
- **改造形**：链内插 **score_skill_spawn 段**（新脚本 TC `runtime/cognition/score_skill_spawn.py`）——位置=score_cli 毕后 close_skill 前——spawn COS+COO 两席 headless 评主观分（I 族三判据·材料=run_dir 件族·ns4 spawn 同款 --patch 尾挂+F4 上限承）→score-skill.json initial/joint 面落卷（final 候 COS 值席）
- **硬序断言**：段前置校验 score_cli.json 在+verdict 面（客观分先于主观分·禁并行禁倒置——&& 串行链+段毕真值校验照 notice-198 四要点同族）
- **十阶段表述清晰化随卷**：每阶段产物/责任模块/验收锚三清表（plan_scope=迁什么/preflight=该不该跑/qualify=有没有资格/dce=执行/verify=验迁对/score=客观分/score_skill=主观分/close=复盘收口/manifest=终点——责任模块+产物+验收锚逐段表）
- **payload 面**：PATCH 形（weekly-plane-shift payload 链序插段——WP4 先例·bak 先行）·白盒随卷（score_skill_spawn 案族+硬序断言案）

## 件② · plan skill 材料扩围（一款）

- **现形**：plan_scope 全集 S=trees/（判据要点 1）＋顶层文件域纯读数面（栏 A ①笔 1 扩·零触三清单）
- **扩围形**（读数面为主·动作面候 CTO）：
  ①需求池只迁未联审件——顶层 readings 增联审状态解析读数（需求池件内联审标记面·「只迁未联审」判据读数化）
  ②任务大表完成/未完成对账——task-inventory 件对账读数（完成/未完成两态面）
  ③W47 周共学目录建立——共学目录建立建议读数（建立动作面候值席/排面）
- **评卷材料同步扩围**：材料清单增扩围读数面（联审检查面含扩围完善性·缺陷检出+优化建议义务——prompt 注入段随件①同窗）
- 白盒随卷（扩围读数案族+契约零破钉：M∪K=S=trees 域零动——扩围纯读数面零清单触）

## 件③ · malformed 解析层勘定（三款·ns6 联审首用检查项）

- **四轮复现样本源**：ns2-ns5 各拍 agent_readings failed_fallback 案（agent_output_malformed: unparsable/守门败）
- **勘定三面**：输出格式约定/解析器容错/判卷 prompt 约束——至少定位一层主因
- **落卷形**：**root-cause 件入 run_dir**（`malformed-root-cause.json`·逐案勘定+主因定位+修法建议——plan_scope 每拍自动落卷逻辑码面+ns5 拍一次性勘定件双形）
- **勘定探针预备**：8710 agent call 一发样树（原始输出形态实录——三面定位实证面）
- 白盒随卷（root-cause 落卷逻辑案+三面定位结构案）

## 件④ · close CLI 断言族（notice-208＋notice-210 勘正·七席 I3 相抵面口径统一）

- **收口顺序勘正承录（notice-210）**：**先 skill 后 CLI**——close skill 智能面先行（COS 自检总结）→毕后 close CLI 机械验正面（收口断言）——notice-208「先机械后智能硬序」误文废止（score 段才是先 CLI 后 skill·两段相反勿互套）。断言族 placement=**收口末段（skill 毕后 close_cli 终位）**＝现役链序零改。
- **收口恒等式承录（notice-209 勘正·双模语义作废）**：有无七席联审·收口都是 fade-001 自身自检与总结（close skill＋CLI 承载）——七席联审≠收口（联审=进化面·与收口两义分立勿混装）。
- **断言族三面**（close_cli 断言面新增·自动可验收口·内容全保留）：
  ①时点断言——close/manifest/notify 三面 check_time 写序统一断言（写序产物 vs 定稿态口径分立承认：close 时点=段 8·manifest=段 9 定稿态——pending_manifest 形=合法序·终值回填审计行位=close 增 audit 行载 manifest 终值引用面）
  ②hash 断言——evidence sha256_16 全载＋裸 hash 拒钉维持（r1 缺陷③防复发核·WP7 结构门现役面核对表）
  ③run_state 口径断言——单值源 source 字段强制（run_state_source ∈ {manifest, pending} 值域断言·manifest_polluted/manifest_malformed=毒化面如实）＋CAO 案 manifest_late 枚举形候勘接入（候 CAO 值面定谳随批）
- 白盒随卷（时点序案/hash 全载案/run_state 值域案/manifest_late 候位案）

## 施工序候（接入后排面）

件③勘定探针（轻）→件②扩围读数（中）→件①硬序改造＋件④断言族（重·PATCH 面＋close_cli 面·同窗统排单笔族）——或照 COO 拆树序。护栏照承（单笔族/bak 先行/r1+ns1-ns5 存档零触/D-24/D-46/D-47）。

—— SDE 小布（承令+设计面预备·候排接入·卷面时戳=commit %cI）
