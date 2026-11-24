# CPO 产品面审 · collection-score.json 中间件废/重设计（CEO 01:4x 令·与 CTO 联议）

- sourceOfTruth: 本件（collection 中间件重设计·产品面意见）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 01:4x 观察（BOD 转 01:48）：「AFH 都三件分离了，这个 collection-score.json 就该废掉不用，重新设计了吧，还这么勉强用，会出问题吧」
- 事实面（BOD 给）：resume21 缺件→collection=0·A/F/H 判 manual／resume20 run_id 不匹配→判 manual——**每轮易漏易错**（engine L317 读单文件·L321 缺=manual·L326 run_id 不匹配=manual）
- 联议: 技术实现归 CTO；本卷=产品面（契约归属/推荐方案/改动面/风险）

## §一 · 事实面核读（代码实锚·本席自读）

- **消费方两岸**：①`score_engine._judge_collection`（L308-331：缺件→manual／坏卷→manual／run_id 不匹配→manual／族条目缺→pending／裸判无 rationale→manual）②`joint_review_trigger.py` L90（同读单件）。
- **产出方**：`duty_collection_auto.py`（notice-214·T+10min 自动采集窗·tick 宿 17/47 分探针——**自动生成器已在**·「首采禁靠值席人手」七席共识已落）。
- **契约形**：单文件 `{score_version, run_id, entries[{family_id, verdict, rationale, evidence_ref}], check_time}`——**A/F/H 多族聚合于一件**。
- **产品面事实判决**：CEO 观察成立且比 BOD 给的更准——**问题不在「有没有自动化」**（auto 已在），**在结构**：①三件分离（A/F/H）已定形，却仍要单文件聚合=多一层可漏面；②**归因粒度丢失**：单件缺/坏/mismatch → **A/F/H 全族 fallback manual**，无法定位哪席漏产（这才是「会出问题」的实质）；③自动采集窗有时序缺口（T+10min 窗 vs trigger 时序——resume21/20 两踩坑即此形态）。

## §二 · ①接口契约归属（产品原则裁定）

- **契约由消费方定义（engine）·产出方按约产**——照今日第 25 笔教训「产件未对消费契约」的产品面版：**消费方定义件名/必填字段/run_id 规则/时间戳/族映射；三席按约产出各自件；engine 逐件校验**。
- 反形警示：现单文件契约=「聚合方定义一切」——聚合方既定义又合成又校验=单点假象（看起来一个契约，实际把三席责任糊成一处）。

## §三 · ②三案对表与推荐

| 案 | 形 | 产品判 |
|---|---|---|
| **a 直读三分离件** | engine 直读 A/F/H 各件·逐件 run_id 校验·逐族归因 | **推荐** |
| b 产出方写合并形 | 三席产出时即写合并件 | 不取——合并责任无主（三席谁合成？最后完成席=时序依赖脆弱） |
| c 中间件+合成自动化 | 保留单件·合成自动化 | **现状已是 c**（auto 采集器在）——今天仍两踩坑⇒c 不解决结构问题（窗口时序+归因粒度）|

**推荐理由（产品面三条）**：
1. **归因粒度**：直读=缺哪件判哪席 manual（可定位到责任席/责任族）；单件=三族连坐（不可定位）——这是质量治理的根基差异。
2. **责任对位**：三件分离已是正形，中间件是分离设计的**逆反层**——废之=设计与契约同向。
3. **漏面消减**：少一个文件=少一个生成/校验/时序面（auto 窗口缺口随之消失）。

## §四 · ③改动面与风险（产品视角·技术归 CTO）

- **改动面**：①engine `_judge_collection` 重写为三件直读（逐件 run_id/坏卷/裸判/缺件判据照旧·逐族归因）②`joint_review_trigger` 消费面同步（两消费方须同窗改）③三席产出契约文档（消费方定义件名/字段/族映射）④`duty_collection_auto` 处置：**转型为逐件 fallback 采集器**（窗过未写→按 run_dir 段产物生成该席件·producer 标 auto——防单席漏致该族 manual·逐件兜底不连坐）；⑤**三件实锚（CTO 联议确认）**=`collection-A.json`/`collection-F.json`/`collection-H.json`（三席各写自己件·无并发）·工时 CTO 估 ~1.5h（engine+采集 prompt）。
- **采集件 schema（本席产品语义定·供 CTO 落码）**：`{schema_version, family_id(A|F|H), run_id, producer_seat, entries:[{item_id, verdict(pass|fail|na), rationale(非空), evidence_ref(必填)}], check_time}`——**verdict 三值**：pass→weight／fail→0／**na=设计内不适用**（如 F 族零触发→按免评分母规则满分类·须 rubric 显式·防 N/A 计分母）；rationale 非空/evidence_ref 必填（DCA 精神·禁裸判）/run_id 逐件校验/producer_seat 必填（归因）。
- **风险三条**：①**契约对表未做**（三件现物形态未知→契约可能拍脑袋，须 CTO 先给现物清单）②历史轮兼容（旧轮单件读法保留一版回滚）③两消费方改造不同步=中间态（须同窗+开关回滚）。
- **验收判据（产品面）**：新形下①任一族件缺=仅该族 manual（不连坐）②run_id 逐件校验③两消费方读数一致（禁两套）④历史轮回读不变。

## 使用依据

- CEO 01:4x 观察（BOD 转）·事实面两踩坑（BOD 给）·代码实读：`score_engine.py` L308-331／`duty_collection_auto.py` L1-40／`joint_review_trigger.py` L90（2026-11-25 01:4x 现查）
- 第 25 笔教训（产件未对消费契约）·D-90 下沉义务·正形「契约=消费方定义」

—— CPO 小乔（m-cpo·产品面审·候 CTO 联议后并呈 CEO）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
