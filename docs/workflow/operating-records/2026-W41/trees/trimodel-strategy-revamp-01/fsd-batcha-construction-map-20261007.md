# FSD 批 A 施工地图 · 「模型策略」+「兜底模型」改名（19 可见+7 注释，禁改九处）

- sourceOfTruth: 本件（FSD 批 A 施工前定稿地图；定账正身=task-charter v2.1 0ea6b42f+cpo-product-design §3.3 04:12Z 勘+cto-tech-design 增补）
- syncMode: static
- lastSyncedAt: 2026-10-07T04:2xZ（12:2x+08，date 现查）
- 施工窗: today 14:30 后开工，16:00 前毕报+部署毕（BOD 派工令+三处改判令 12:1x 全收）
- 施工对象: **TriModel 仓** `D:\Code\ai\TriModel\ui\index.html`（2448 行；copy-ui.mjs 拷入 dist）
- 基线: TriModel 树 clean @ 73ca1cc；本机 3333（tsx dev）直服工作树 ui/——纯 UI 改动零重启本机面即验

## 一、定账（charter v2.1 终账）

- **用户可见 19 处** = CPO 表 16（#1-#10+#11-#16）+ CTO 增补 L1067/L1084 + FSD 实勘增补 L356 第二处
- **注释级 7 处** = CTO L1269/L1281 + FSD 增补 L380/L400/L488/L874/L1472
- **禁改九处**（同文案报错，动错=事故）：L560 / L592 / L679 / L764 / L814 / L1040 / L1348 / L1397 / L1446——「无法连接配置服务」全量九处，动宾短语（连不上·配置服务）非页面名
- 替换文正身=cpo-product-design.md §3.3 新文案列+§4.3 副题，**照抄不手写**；内层词（策略/活动策略/策略列表/新增策略/策略面）零触碰；布局零改动

## 二、编辑地图（锚行 | 旧→新；全部照抄 §3.3 新文案列）

### 「TriModel 策略卡」→「模型策略」（正身行 #1-#10/#16-#19 + 表外注释增补；L890/L948+957 系多片段行）

> 账目口径：19 处用户可见=CPO 表 16 行（含表内注释行 #3/#5/#10/#12）+CTO 增补 2+本席 L356 hit1；7 处注释=CPO 表外增补（CTO L1269/L1281+本席 L380/L400/L488/L874/L1472）。行账与片段账在毕报逐锚对齐。

| 锚 | 旧（关键段） | 新 |
| --- | --- | --- |
| L189 注释 | `═══ TriModel 策略卡（参照层；LG-035 面——` | `═══ 模型策略（参照层；……原样）` |
| L193 页题 | `<h2>☁ TriModel 策略卡（本机过渡位实例） <span id="tc-badge"...` | `<h2>☁ 模型策略（本机过渡位实例） <span...`（☁ 保留，CPO 授权施工定） |
| L356 注记 hit1 | `本卡配置文件现役=策略卡过渡位` | `本卡配置文件现役=模型策略过渡位`（FSD #19） |
| L356 注记 hit2 | `策略内容见「TriModel 策略卡」` | `策略内容见「模型策略」`（CPO #16） |
| L407 导航 | `label: 'TriModel 策略卡', title: '过渡期形态 · 常态只读（编辑窗候 CEO 终验）'` | `label: '模型策略', title: 原样保留` |
| L539 提示 | `'策略卡规则数据未加载——先在策略卡页连接后再勾选'` | `'模型策略数据未加载——先在模型策略页连接后再勾选'`（§3.3 #4 照抄） |
| L868 注释 | `策略卡=菜单，域卡=点菜` | `模型策略=菜单，域卡=点菜` |
| L869 注释 | `模型下拉出自策略卡清单` | `模型下拉出自模型策略清单` |
| L870 注释 | `策略卡不搬钥匙` | `模型策略不搬钥匙`（「key 不进策略面」内层词不动） |
| L871 注释 | `从策略卡规则清单勾选复制` | `从模型策略规则清单勾选复制` |
| L890 JS | `'来自策略卡·' + set.name : '来自策略卡菜单'` | `'来自模型策略·' + set.name : '来自模型策略菜单'` |
| L948 提示 | `'菜单外手填——建议先在策略卡登记'` | `'菜单外手填——建议先在模型策略登记'` |
| L957 提示 | `'菜单外手填——建议先在策略卡登记'`（oninput 行第二处） | 同 L948 |
| L986 空态 | `'策略卡菜单为空（未连接策略卡或暂无条目）——仍可手填，但会标注为菜单外'` | `'模型策略菜单为空（未连接或暂无条目）——仍可手填，但会标注为菜单外'`（§3.3 #8 照抄） |
| L1034 提示 | `（各域密钥域内自管，策略卡不搬钥匙）` | `（各域密钥域内自管，模型策略不搬钥匙）` |
| L1050 注释 | `菜单=策略卡规则清单` | `菜单=模型策略规则清单` |
| L1067 空态 | `'策略卡暂无规则清单'` | `'模型策略暂无规则清单'`（CTO 增补） |
| L1084 文案 | `rid + '（策略卡已删，本域仍有副本）'` | `rid + '（模型策略已删，本域仍有副本）'`（CTO 增补） |
| L1269 注释 | `═══ TriModel 策略卡（LG-035 v4：S2 交互唯一模式...` | `═══ 模型策略（LG-035 v4：……原样）`（CTO 注释#1） |
| L380 注释 | `模型下拉出自策略卡清单，` | `模型下拉出自模型策略清单，`（FSD 注释#1） |
| L488 注释 | `勾=策略卡规则对象复制进本域卡` | `勾=模型策略规则对象复制进本域卡`（FSD 注释#3） |
| L874 注释 | `菜单快照：策略卡（过渡位 trimmc-card）条目/模型集/规则三清单` | `菜单快照：模型策略（过渡位 trimmc-card）……原样`（FSD 注释#4） |

### 「连接配置」→「兜底模型」（正身行 #11-#15 + 表外注释增补 L1281/L1472）

| 锚 | 旧（关键段） | 新 |
| --- | --- | --- |
| L299 注释 | `═══ 连接配置（导航层第 4 组；LG-058 N5 方案三四域化——` | `═══ 兜底模型（导航层第 4 组；……原样）` |
| L305 页题+sub | `<h2>连接配置 <span class="sub">四域本地配置直改面——改完经拉取下发落到该域落地配置（诚实三态：已存未拉 / 已拉未落 / 已落生效）</span></h2>` | `<h2>兜底模型 <span class="sub">四域各一份保底直配——改完经拉取下发，直接落到该域的落地配置。模型策略管平时怎么用得灵活，这里管万一的时候拿什么保底。（诚实三态：已存未拉 / 已拉未落 / 已落生效）</span></h2>`（§4.3 副题照抄+三态括注保留） |
| L354 tpl hit1 | `TriMMC 域的本地配置直改走「连接配置」页「M 面 · 服务域」签` | `TriMMC 域的兜底直配走「兜底模型」页「M 面 · 服务域」签`（§3.3 #14） |
| L354 tpl hit2 | `<button data-goto="connect">前往连接配置</button>` | `<button data-goto="connect">前往兜底模型</button>`（data-goto 不动） |
| L408 导航 | `{ id: 'connect', label: '连接配置' },` | `{ id: 'connect', label: '兜底模型' },` |
| L1281 注释 | `── 连接配置页 v2（波① 2026-09-25）：...` | `── 兜底模型页 v2（波① ……原样）──`（CTO 注释#2） |
| L1472 注释 | `═══ 连接配置四域直改面（LG-058 N5 方案三；CPO 方稿 §3.3-3.6）═══` | `═══ 兜底模型四域直改面（……原样）═══`（FSD 注释#5） |

## 三、施工后断言（本地面，commit 前全绿才推）

```bash
cd /d/Code/ai/TriModel
[ "$(grep -c '策略卡' ui/index.html)" = "0" ]                                  # 策略卡零残留
[ "$(grep -c '连接配置' ui/index.html)" = "9" ]                                # 连接配置仅存于九处报错文案
[ "$(grep -c '无法连接配置服务' ui/index.html)" = "9" ]                         # 禁改九处正向断言
grep -q "label: '模型策略'" ui/index.html && grep -q "label: '兜底模型'" ui/index.html   # 导航双 label
grep -q '模型策略数据未加载' ui/index.html && grep -q '模型策略暂无规则清单' ui/index.html && grep -q '（模型策略已删，本域仍有副本）' ui/index.html
grep -q '四域各一份保底直配' ui/index.html                                     # §4.3 副题正身
grep -q 'API Key' ui/index.html && grep -q '认证字段' ui/index.html && grep -q 'API 格式' ui/index.html && grep -q 'data-cd-keyref' ui/index.html && grep -q 'data-cd-1m' ui/index.html   # r5 五件
grep -q 'ANTHROPIC_AUTH_TOKEN' ui/index.html && grep -q 'ANTHROPIC_API_KEY' ui/index.html
grep -q '请求地址' ui/index.html && grep -q '配置预览' ui/index.html            # r4 回归
grep -q 'M 面 · 服务域' ui/index.html && grep -q 'R-HY 8712' ui/index.html && ! grep -q '河源' ui/index.html   # 三轮
grep -q 'body class="menu-full"' ui/index.html                                # 二轮
```

本机面活体验证：`curl -s http://127.0.0.1:3333/ | grep -c '无法连接配置服务'` = 9 + 双 label 渲染（tsx 直服工作树零重启）。

## 四、部署链（升版流水线全链）

1. 断言绿 → commit TriModel → push sg bare（唯一 remote）
2. stage1-r6-sg-build.sh（sg 构建环；同目录预稿，TM_SHA 回填真值后执行）——r6 新增批 A 锚+零残留文件式断言
3. 传输腿：sg out/ → R-HY in/（scp tar+SHA256SUMS-r6，收侧 hash 复核）
4. stage2-r6-rhy-execute.sh 触发 → 环A 备份锚 → **GO-r6 硬门停等 120s（超时 HOLD exit 42 设计内）→ 报备 BOD 复核签发**
5. 环B 部署（只 trimodel.service；trirmc 双 unit 零触碰）→ 环C 值面探针（文件式 grep 零管道，r2 SIGPIPE 教训正形）
6. 本机/R-HY 双面 200 + 环C READOUT → **毕报两刻制**（开工/毕报两时刻原值）附 19/7 逐锚清单+九处禁改清单+部署读数 → BOD 收报派 STE

## 五、文档面联动清洗（随本卷，另 commit）

- `2026-W41/trimodel-ceo-product-walkthrough-20261005.md`（讲解件 v2）：L75/L79 节头、L117/L118 正文活引用、L129 实勘注 → 新页名；顶部加改名追记行（留痕 v2 时代用名）；L122 勘误版注系历史记录不追改
- `2026-W41/trimodel-product-plan-9items-20261006.md`（P2 三件方案稿）：方案二/三正文活引用+验收锚两条 → 新页名；标题节加同一改名追记；打回记录历史面不追改
- 本席记忆条 open-items-ledger.md 命中面施工后单独勘
- 历史卷（lg058-remediation 树各卷/ste walkthrough/daily-progress）**零触碰**（已收口周叙事冻结）

## 使用依据

task-charter v2.1 0ea6b42f（定账+锚正身）；cpo-product-design.md §3.3/§4.3（04:12Z 勘，5d175a26 系）；cpo-charter-reconciliation.md（合并稿锚）；cto-tech-design.md（L1269/L1281 增补）；BOD 三处改判令（12:1x 交叉信）；ui/index.html 73ca1cc 实勘全量 grep；stage1/stage2-r5b 模板（lg058-remediation 树）
