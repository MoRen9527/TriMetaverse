# score_engine 主观题判分面扩形·执行读数卷（CEO 直令线 2 16:23:35·FD 主刀）

- 执行: m-duty-fsd（CTO 架构约束下·验收门禁 CTO 面）；交付锚=TriCompany dev **1deb7ce**（score_engine.py +88/−1）
- 对表面: STE 设计卷 abcdf26ac（76 行全读）+开闸栏 C 四项（α 形/I1 锚文/独立附加分面/终判卷=COS 定谳 14:26:37+14:46:56/14:47:37）——**STE 线 1 并行重排方案卷未达 sg**（候达补对表注，本卷以 CEO 令文面「并盘 100 客观+主观=100·I 族并入总盘」为对表基准）

## 一、扩形读数（两件套）

1. **两级判分承载**：
   - 初判三件套原语 `initial_judgment(criterion, score, max_score, rationale, evidence_ref, judge, judged_at?)`——rationale 必附（裸分 ValueError 拒）/evidence_ref 可复核锚/判卷时点 UTC 打戳（可显式传入）
   - COS 终判卷原语 `final_verdict_volume(run_id, initials, joint_opinions?, final_judge='COS')`——judge_faces{initial/joint/final} 三面+分差触发复核面
2. **配套原语组**：分差触发器（原始分差 ≥2 分→divergence_review=True，STE 定谳形「分差≥2 分档」；触发/不触发双证冒烟）／独立落卷 `write_subjective_score`（subjective-score.json 写 run_dir，与 engine 机判 score.json 分立=STE §五面保持）／并盘 `merge_rubric`（客观+主观=100 合盘总量断言防漂）

## 二、验证门禁配套（②面）

- 主观冒烟全过（py3.8）：初判三件套/分差触发与不触发双证/终判卷=COS 断言/独立落卷落盘回读/并盘 100 断言/裸分禁令六面
- 域词断言：扩形后全引擎**零实例域词残留**（换实例测试法维持——主观面=通用判分结构，I1/I2/I3 判据语义=实例配置不入引擎）
- 现役零扰：MACHINE/MANUAL_FAMILIES/probe/run_score 契约/REDLINE_CAPS 零触（STE §五护栏面保持；扩形=纯增量原语组）

## 三、候达对表与边界

- STE 线 1 重排方案卷候达：达后对表两处——①分值面（本实现 merge_rubric 参数化合盘，适配任意重排权重面）②judge_faces 联审角度面（α checklist 视角层=信面非引擎面，零适配需求预判）
- 判分承载消费面：subjective-score.json 判卷消费链接验证（门 3 断言组 B）=STE 主责面（§六A），引擎侧 schema 与其断言组 B 对形就绪
- 23:30 冻结闸：扩形+完整预演（本卷冒烟=预演面）已过线 ✓

## 四、使用依据

CEO 直令线 2 16:23:35（COS 分诊经转）；STE 设计卷 abcdf26ac（定谳链全谱：终判卷=COS 14:26:37/开闸 14:47:37/subjective-score.json schema §四/engine 域外人工面 §五）；score_engine 1deb7ce diff
