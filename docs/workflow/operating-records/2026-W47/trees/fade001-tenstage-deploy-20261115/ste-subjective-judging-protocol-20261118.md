# 主观题族判卷规程文卷（c 形规程·供河源 loop 正形跑判卷件族用）

- **seat**：STE（小柯）·判卷规程供卷席（notice-176③·CEO「必须做」判卷令 03:06:32Z）
- **用途**：河源 loop 正形跑主观题族判卷件族的操作规程正身（SDE 跑用面）
- **基座**：主观题卷正形（ste-subjective-exam-paper-20261115·α 形态基线单卷）+设计卷 §四 c 定谳形（CEO 三点裁决 14:26:37·终判卷=COS）+loop_autoreview.py subjective 聚合初判形（cefa5eb·缺席标注不冒充全席）
- lastSyncedAt: 2026-11-18T03:08Z（date 现查=11:08+08）

## §一 c 形判卷规程全文（三段判卷·主体分工定谳形）

### 段 1·初判=值席（三件套必附）

- **判卷主体**：值守窗席（值席）——loop 轮产物落卷后窗内判。
- **三件套（缺一=该判无效禁入聚合）**：
  1. **rationale 必附**（禁裸分——每判据逐条说理·锚文判读句必含，见 §三锚文操作化）；
  2. **evidence_ref 可复核**（指针指向 run_dir 内实产物文件·相对路径形·evidence 存在性=机械探针面）；
  3. **判卷时点戳**（D-47 形·date 现查原样粘贴 UTC Z 后缀+08 双轨·禁估读）。
- **判卷操作序**：读 run_dir 三域材料族（plan.json/close.json/score.json/manifest.json+段产物）→逐判据 I1/I2/I3 判分→落 subjective-score.json 至 run_dir（schema 见 §二）。

### 段 2·可选联审=五席角度 checklist（触发面制）

- **触发面**：fail 案/边界个案/初判分歧案——非全轮默认（α 轻形纪律·判卷成本零增）。
- **参与形**：CPO/CTO/CAO/COO 按各自角度 checklist（主观题卷 §五席角度表原样）评相关判据项·rationale 必附同三件套。

### 段 3·终判卷=COS（分差强制复核）

- **终判主体**：COS（c 定谳换主体形·CEO 保留否决/改判权不在判卷链内）。
- **汇总形**：收初判+联审意见出终判卷——judge_faces{initial, joint?, final} 全链留痕。
- **分差触发器**：联审意见与值席初判**分差 ≥2 分档→COS 强制复核**（该判据项重判+复核 rationale 必附）。
- **缺席面**：席缺席=聚合时缺席标注（**不冒充全席均分**——loop_autoreview 已席均形+缺席标注同构）。

## §二 subjective-score.json schema 面（落卷正形）

```json
{
  "score_version": "1.0.0",
  "run_id": "shift-W<nn>-<YYYYMMDD>T<HHMMSS>Z",
  "entries": [
    {"criterion": "I1", "score": 0, "rationale": "<必附·含锚文判读句>", "evidence_ref": "<run_dir 相对路径>"},
    {"criterion": "I2", "score": 0, "rationale": "<必附>", "evidence_ref": "<可复核>"},
    {"criterion": "I3", "score": 0, "rationale": "<必附>", "evidence_ref": "<可复核>"}
  ],
  "judge_faces": {"initial": "<值席名>", "joint": ["<席名>…"], "final": "COS"},
  "check_time": "<D-47 形时点戳>"
}
```

- **分值封顶**：I1≤4/I2≤3/I3≤3·全族 ≤10（engine _judge_subjective caps 同源——超封顶值判无效）。
- **禁裸分机判锚**：rationale 空/空白→该判据 engine 消费面不计（score_engine _judge_subjective 同源——判卷侧与消费侧同律）。
- **evidence_ref 存在性**：指针断链→该判据不计（半机判锚·同源）。
- **run_id 对表**：卷 run_id 与 run 目录 run_id 错位→engine 不消费（同值同源）。
- **落卷位**：`<run_dir>/subjective-score.json`（engine 判读 I 族消费路径·零别处）。

## §三 判卷锚操作化（每案必经步·防自造口径）

- **语义锚原句**（36bf14a1d L44 定谳位）：**「这是一周的记录，还是这一周的活——记录随周封存·活随人带走」**。
- **I1 每个案判分前**先过锚文判读：该划界对象=「记录」（随周封存→keep/归档面）还是「活」（随人带走→migrate/carry 面）？rationale 必含「记录/活」标签判读一句。
- 同行验收三标准并挂：清单枚举双向断言／不迁清单带判据／carry_over 带状态去向（三标注：状态/去向/死信风险）。

## §四 两维度分列形对表（r106 禁混打）

- **维度 A·fade-001 实现度**：十阶段链产物完备性与判据过态面（机判域承载为主·主观面只评 I 系判断质量在实现链中的留痕与合理性映射）。
- **维度 B·周平面迁移质量**：搬移清单划界/批次规划/降级链设计的语义质量面（I1/I2/I3 主承载）。
- **禁混打**：两维度分列判分分列落卷——**A 维读数不得折入 B 维判分、B 维判分不得折抵 A 维读数**；汇总卷两列并呈（列名=维度标签原样「fade-001 实现度」「周平面迁移质量」）·混打形卷=无效卷重判。
- 承接注：主观 I 族三判据本体属维度 B 面；维度 A 之主观映射面（如有）按本条分列形另行落 entries（criterion 命名带维度前缀防混）。

## §五 threshold=70 判定语义挂接

- **判定线**：总分（三域直加制·机判 59+采集 31+主观 10=满 100）**≥70=PASS 行入聚合卷；<70=RETRY 照降**（verdict 判定与 loop runner 机械分叉 A 条件同源）。
- **主观族在判定线中的语义**：I 族 10 分为总盘构成（并盘 100 形）——pending 态（subjective-score.json 未落）时 total_projection=100 制投影呈现·判定以已判面+pending 标注分层呈（禁以投影冒充已判）。
- **阈值语义边界**：70=判定线非质量目标线——RETRY 轮针对红灯族与四句门红面修·主观族低分不单独触发 RETRY（随总盘判定走）。

## §六 跑用交接面（SDE 面）

- 判卷件族消费序：loop 轮产物落卷→值席按 §一判→subjective-score.json 落 run_dir→engine _judge_subjective 消费（下次 score 判读面）→COS 终判卷随评分汇总窗。
- 卷面与 loop_autoreview sheet 面关系：seats/<seat>-score.json（七席联审 sheet·S4 形）与 subjective-score.json（值席判卷卷）**两卷分立**——前者=联审聚合初判形·后者=engine 消费正形·零互写（零交叉分立纪律）。

## §七 使用依据

notice-176③（CEO「必须做」判卷令 03:06:32Z）；主观题卷正形+设计卷 §四 c 定谳形；loop_autoreview.py cefa5eb/155535a（S4 复验绿面）；score_engine _judge_subjective（6fd8d38 消费链）；r106 两维度分列裁；D-47 时戳纪律。

—— STE 小柯（m-ste·判卷规程供卷席）·2026-11-18T03:08Z（date 现查）
