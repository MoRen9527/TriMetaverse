# r100 双令接口勘定卷·①plan skill 接入 COS 面②collection 采集交付面（FD 主刀·报值席配装）

- 执行: m-duty-fsd；令面=r100 双令分诊（两件勘定接口面后报值席配装·勘定非施工）
- 实勘底座: score_engine.py 现势（collection/subjective 双判读消费面+v2.0.0 并盘已他席落装）/plan_scope.py 1.1.0（agent 慢道四层链+判据 prompt 契约）/STE 设计卷 abcdf26ac

## ① plan skill 接入 COS 面·接口勘定

### 生产者契约（COS plan skill 产物形·判据同源零改）

COS plan skill 语义判断产物沿用现役判据 prompt 契约（plan_scope.py:92-115 原文即契约面）：

```json
{
  "run_id": "<运行 id 对表键>",
  "judgments": [
    {"tree": "<原样名>", "domain": "tree|top_level",
     "family": "carry_periodic|new_week_templated|weekly_selfbuild|active_tree_ongoing|one_shot",
     "confidence": 0.0-1.0, "reasons": "<一句话依据>"}
  ],
  "files": [{"name": "<原样回填>", "family": <五枚举>, "confidence": 0.0-1.0, "reasons": "<…>"}],
  "judge": "COS", "check_time": "<UTC>"
}
```

- 判据五枚举+锚文（「记录/活」标签判读）+reasons 必附=与 8710 agent prompt 同契约（COS 侧换执行主体不换判据面——语义锚 36bf14a1d L44 同源）
- I1 验收三标准并挂（清单枚举双向/不迁带判据/carry_over 带去向）随 reasons 判读

### 消费者接缝（fade-001 plan 段·plan_scope.py 四层链）

现役链: `_call_agent`(POST 8710·60s 零重试)→`_extract_agent_text`(delta 主路径·勘修线①修)→`_parse_agent_verdict`(直解+{...} 截取)→`_validate_agent_output`(五枚举/conf[0,1]/reasons 守门)→agent_readings 投影+三清单

**接缝勘定（判源开关形·零破坏）**: run_dir 判源文件在场优先——
- `cos-plan-judgments.json`（上形生产者产物）落 run_dir → plan 段**跳过 8710 调用**直取判读（逐树映射 agent_readings 投影同函数）
- 判源缺席 → 现役 8710 慢道原路（零行为回退·灰度序同 N-D3 纪律）
- 校验复用 `_validate_agent_output` 全量（五枚举/置信/reasons 守门=COS 产物同门）
- 收益面: 60s 超时/8710 单点/回包形态三面全消（COS 侧文件交付=确定性判源）

### 承载落卷

- 接口 spec 本卷=落卷正形；施工件（plan_scope 判源开关+cos-plan-judgments.json schema 固化）候派工令（勘定→施工分立照 r100 面）

## ② collection 采集交付面·勘定

### 消费面现势（他席已落装·本席勘定确认）

score_engine 采集域族判读消费在位：collection-score.json→**二值分**（verdict=pass→weight/fail→0·与机判同制禁部分分）；卷面契约=score_version/run_id/entries[{family_id, verdict, rationale, evidence_ref}]/check_time；三防呆：run_id 对表/裸判不消费（rationale 禁空）/族条目缺席=pending（不冒充）

### 采集件交付形（值席采集→落卷→engine 消费三段）

1. 值席采集窗: A/F/H 族逐件按考卷 collection_cmd 采集→verdict 二值判（pass/fail）+rationale 必附+evidence_ref 指针
2. 落卷: run_dir/collection-score.json（上 schema·entries 逐 family_id 一条）
3. engine 消费: 评分窗自动读——族 verdict 二值入并盘 100 形 v2.0.0（机判 59+采集 31+主观 10 三域直加现值制）

### 排班评估单配装建议

- 采集窗排班=首拍评分窗后独立窗（与机判 23:50 锚时线解耦·照 STE §三时窗解耦纪律）
- 评估单=考卷族表（A/F/H 三族×collection_cmd×verdict 判据列）+采集人/时点列——落 manual 采集排班评估单配装归 CAO/CHO 面（r100 分诊③席域，本席供 schema 面锚）

## 三、边界与候裁

- ①施工件（判源开关）候令：勘定面=本卷；判源开关落 plan_scope 候 CTO 面（涉及 8710 现役链退行序=架构面）
- ②采集域 roster: A/F/H 三族 family_id 命名=考卷族表对表面（STE 线 1 卷对表后锁名）
- 零改链护栏遵行: 本卷勘定面零触 engine/plan_scope 现役代码 ✓

## 四、使用依据

r100 双令分诊（值席发令·r84 自走授权）；score_engine.py 现势实读（_judge_collection/_judge_subjective/三域直加）；plan_scope.py 1.1.0 四层链实读；STE 设计卷 abcdf26ac；COS 联审总结卷栏 A 十项；CTO 栏 A 覆盖裁决卷
