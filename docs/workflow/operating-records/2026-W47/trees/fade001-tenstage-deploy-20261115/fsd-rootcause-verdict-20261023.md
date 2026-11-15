# 勘修线根因定谳卷·unparseable 15+file missing 7（CEO 17:24:11 直令·FD 主刀+CTO 联勘判定树）

- 执行: m-duty-fsd；判定树=CTO 联勘材料（三候选判定树+file missing 首嫌疑）；修复锚=TriCompany dev **6272005**
- 定谳时刻: date 现查 2026-10-23 13:5x CST（23:00 倒排毕线内）

## 一、定谳① unparseable 15——**候选③ 解析层键面失配（实锚定谳）**

- **根因机制**：agent-core 引擎文本信道=`content_delta` 事件族（键=`delta`，loop.ts:164/257 实锚）——判定 JSON 经此通道分段发出。plan agent 化提取层 `_extract_agent_text`（plan_scope.py:420）逆序找键 text/content/message——**delta 键不在候选**→逆序命中最后一个 `tool_result` 事件的 `content`（工具裸输出，非判定文）→判卷解析 family 缺枚举→malformed。15/15=全慢道调用 systematic（凡经工具的 agent 判定全触发）。
- **证据直读**：合成回包复现——`[{tool_use},{tool_result content='{"raw":...}'},{content_delta×3 判定 JSON 分段}]`→修复前提取=tool 裸 JSON→family out of enum=malformed；修复后提取=三段 delta 串联=完整判定文→parse+validate 全链通 ✓
- **三候选排除**：①自由文本排除（模型判定文经 delta 通道结构化发出，非自由形）②wrapper 形排除于主判（围栏形若存，`{...}` 截取正则已容——非计数源）③**解析层取字段错=定谳**（取字段键面缺 delta=解析层错）
- **修法（已落 6272005）**：delta 串联主路径（按事件序拼接 content_delta 文本）+旧键逆序兼容路径保留（旧事件族兼容）——44/44 回归绿（discover 实测）

## 二、定谳② file missing 7——**周形两形并存（机制面码锚定谳）**

- **根因机制**：周目录名两形并存——wrapper :52-53 产出裸 `W{NN}` 形（from_week/to_week，无年段）vs 实盘规范形=`{ISO 年}-W{NN}`（`_week_dir` weekly_plane_shift.py:59-61 + plan_scope `_resolve_week_dir` :652-666 实锚同判）。plan 载荷随载 `from_week="W41"` 裸形→下游证据/评分消费面以裸形构造路径→对 year-W 正形树查找=ENOENT→file missing 计数。
- **证据面如实注**：7 条缺失路径原文在 dev 执行面（sg 不可达·CTO 树已注计数器 dev 面）——本席定谳=机制面码锚（两形并存三处实锚：wrapper :52/:53/:66+_week_dir :61+_resolve_week_dir :660）+量形推断（7=该批 plan 条目证据指针裸形消费子集）。**精确修复候原文**：7 条原文达后按三形对照（裸 W/year-W/未填充）逐条归位。
- **修法（已落 6272005·根治锚）**：plan 载荷随载 `from_week_dir`（resolved year-W 正形，`_resolve_week_dir` 解析产物）——下游消费从载荷取目录正形（裸 from_week 字段保留=兼容读数面）；44/44 回归绿 ✓

## 三、预演 agent>0 实证面（随修带出）

- 修复后合成链 agent 判定=valid True（family/confidence/reasons 全过守门）——agent>0 实证=复验线 STE 实弹段面（dev 执行回包），修复形（agent>0）目标态由本修解锁 ✓

## 四、修法分级与残面

| 项 | 级 | 态 |
| --- | --- | --- |
| ① delta 主路径修复 | 立即修（已落 6272005） | 44/44 绿+合成链通 |
| ② from_week_dir 载荷随载 | 立即修（已落 6272005） | 44/44 绿；下游消费面切换=dev 执行面随窗 |
| ② 7 条原文逐条归位 | 候原文（dev 面） | 候 BOD 转派取原文或复验窗实证 |
| 提取层单测族化 | 排窗 | 合成案入库 test_plan_scope 候 STE 复验批一并 |

## 五、使用依据

CTO 联勘判定树（三候选+file missing 首嫌疑+排除面）；T3 preview 判读卷（cto-t3-preview-verdict-20261115.md 15/7/8 三计数）；plan_scope.py :405-470（call/extract/parse/validate 四层实读）+weekly_plane_shift_fade.py :45-66+weekly_plane_shift.py :56-77/:173-181 实读；agent-core loop.ts :164/:257 delta 信道实锚；TriCompany 6272005 diff
