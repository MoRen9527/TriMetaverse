# 第 2 轮优化工单 1 执行读数卷·close evidence 指针修（CEO 直令·FD 主刀）

- 执行: m-duty-fsd（CTO 门禁线并行）；交付锚=TriCompany dev **543e4f0**（close_skill.py+test 双件）
- 缺陷实锚承录: close.json 顶层 evidence 键缺席+stage_artifact_notes=[]/upgrade_list=[] 空列（持续五轮·CHO W45 首列+CPO 判分扣分点+七席联审缺陷单第 1 组）

## 一、修法读数（两件套+门禁配套）

1. **顶层 evidence 指针面落装**: close.json 增 `evidence` 键——段产物指针可达性逐段（preflight/qualify/plan/dce/verify/score 六段+manifest 扩展面第七锚）：{stage_artifact, path(实路径), present(在位布尔), verdict}——指针可达性=轮末机械检查承载（COO 案并入）
2. **stage_artifact_notes 实值填充**: 空列缺陷修=逐段现值注（`段名: verdict` 形·含 absent/unreadable 如实态）+scan absent 注保留
3. **门禁配套（②面）**: 结构门 `_structure_gate` 增 evidence 必载断言（键缺失=门拦）+形校验（逐指针 stage_artifact/present 字段在位）——**指针存在性=永久门**（每轮自检断言并入 ✓ COO 案）

## 二、验证读数

- close 家族: **13/13**（test_close_skill 含 GOOD fixture 双件套校准——evidence 键补形=期望校正双件套教义：字面校准+正道可达同形 run_close 实产链）+ **8/8**（test_close_cli）+ **16/16**（test_dce_steps）✓
- 结构门负路径: GOOD 无 evidence → 门拦两错（缺键+形校验）实证在案（复验面可重放）

## 三、对表与边界

- STE 设计卷 §四 judge_faces 面=主观判分域（线 2 已交付面），本件=close 载体域（顶层 evidence 指针）——两域键面零交叉（close.json vs subjective-score.json 分立照 STE §五）
- upgrade_list=[] 空列语义=「本轮零 fail 段产物提取」（scan 无 fail_stages 时合法空——**显式空态语义注已由 upgrade_list_state=extracted 键承载**·照精化二护栏；notes 实值填充后空态可辨）

## 四、使用依据

CEO 直令线 2 16:23（COS 分诊 D-81 经转·CTO 门禁线并行）；STE 设计卷 abcdf26ac §五卷面；close_skill.py/close_cli.py 现势实读（七段产物族+三态判+结构门）；期望校正双件套教义（memory standing）
