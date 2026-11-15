# r102 勘正配装面·承载/消费接缝勘定卷（FD 勘定·CEO 23:46:48 勘正承转）

- 执行: m-duty-fsd；勘正令面=r102（值席转·CEO 23:46:48 勘正）；对表=r70 两级承载形 vs r102 正形
- 性质: 勘定面（承载/消费接缝正形定义·零代码变更——engine 消费面零改确认 ③）

## 一、正源勘定接受（①②面）

- **subjective 正源=COS 自己的 plan skill 的卷子和评分**（fade-001 内部主观题段·非联审非 judge 他席）——COS 本席=主观题作答与评分面 ✓
- **r102 正形对表勘定（候面交付）**：

### 两件分立承载形

| 件 | 文件 | 形 | 角色 |
| --- | --- | --- | --- |
| 作答卷 | `cos-plan-judgments.json` | r100 生产者契约同源（judgments 逐树五枚举+confidence+reasons+files 面+run_id） | COS plan skill 判读产物=主观题作答本体 |
| 评分卷 | `subjective-score.json` | STE 消费契约（score_version/run_id/entries[{criterion, score, rationale, evidence_ref}]/judge_faces/check_time） | I 族三判据（I1≤4/I2≤3/I3≤3·全族≤10）对作答卷的评分面=**COS 评（自评正形）** |

### 接缝勘定形（承载→消费）

1. **run_id 对表双件**：subjective-score.json.run_id == cos-plan-judgments.json.run_id（评分对象绑定）
2. **evidence_ref 锚面**：评分卷 entries[].evidence_ref → 作答卷锚（逐树 judgment 锚/reasons 引用/树实况对表件——I1 锚文判读「记录/活」标签引用形）
3. **judge_faces 正形（r102 勘正）**：**COS 作答评分单面**——`judge_faces: {"author_and_scorer": "COS"}`（r70 两级 initial/final 形**并档**：m-duty-sde 代初判/COS 终判两级消解为单面·历史冻结留档不回改）
4. **写卷原语零改**：write_subjective_score 通用写面照用（judge_faces 内容=正形注入·原语无感）

## 二、三面定谳

| 面 | 定谳 |
| --- | --- |
| ③毕后联审分 | **另轨确认**：独立于三域不入内部过程分——score_engine 消费面零改 ✓（collection/subjective 双消费形照旧；联审分=另轨承载候制度面） |
| ④CHO P2 双席互判关切 | CEO 正形覆盖如实注（候裁面销形·本席零动作） |
| r70 两级承载形 | 并档（initial=m-duty-sde 代初判/final=COS 终判→**正形=COS 作答评分单面**）；两级承载原语（initial_judgment/final_verdict_volume）=通用面留库不删（他实例两级形可用） |

## 三、engine 零改确认（③面实证）

- score_engine 主观消费面（_judge_subjective）读 entries/judge_faces 通用键——r102 正形注入新 judge_faces 形=消费面无感 ✓
- 我的 r70 时代 initial_judgment/final_verdict_volume 原语=通用承载面留库（零删改）；正形落卷由 COS 侧按本卷 schema 产（write_subjective_score 或直写）

## 四、候件

- 作答卷/评分卷双件生产=COS 域面（本席零代笔）；判源开关施工件（plan 段 cos-plan-judgments.json 消费）候令照 r100 勘定面

## 五、使用依据

r102 勘正令面（值席转·CEO 23:46:48）；r100 勘定卷 a7175861e（生产者契约）；STE 设计卷 abcdf26ac §四（subjective-score.json schema 正形）；score_engine 现势实读（_judge_subjective 消费面零改确认）
