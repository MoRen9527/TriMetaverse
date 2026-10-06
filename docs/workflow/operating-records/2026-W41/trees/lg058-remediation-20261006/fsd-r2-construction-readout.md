# LG-058 二轮·FSD 施工执行卷（fsd-r2-construction-readout）

- 执行: m-fsd（FSD 小全）；令源=BOD 更正令 2026-10-06 20:31（CEO 亲测打回·活体核实·五条）；COO 20:32 优先级知会（二轮最高优先）
- 时点: 开工 2026-10-06T12:31:25Z（date 现查）；本卷随环续写

## 一、更正令逐条落点（代码段，commit 0359b89）

| 条 | 落点 |
| --- | --- |
| ① 左菜单无条件常驻 | `ui/index.html` `<body class="menu-full">` 静态挂载——冷态零 JS 即呈现左菜单右主体骨架（验收锚⑤前半）；未连接/无数据不隐藏菜单栏（菜单项 7 个恒在场） |
| ② 条件展开门废除 | `updateMenuMode`→`updateMenuState`：删 `withData >= 4` class toggle；「四卡全数据后自动展开」话术全删；缺数据卡菜单项置灰（`.menu-btn.dim` opacity .55 + title「待数据：连接后填充」，可点击看诚实空态不禁用） |
| ③ 顶部细条退役 | 基础横排样式保留仅作窄屏 720px 降级底色（响应式形态保留）；宽屏恒 `body.menu-full` 覆盖 |
| ⑤ 验收锚 | 冷态直开即左右骨架（body 静态 class）+连接后 `updateMenuState` 刷注记/置灰而骨架恒定 |

## 二、自测门读数（全量四项）

- 三 UI 门（ui-boot/ui-fourplane/ui-boot-connection）: **36/36 pass 0 fail**
- 案⑤改写: 4/4 与 3/4 均 menu-full 常驻断言+mmc 置灰分域断言+「自动展开/顶部细条」话术零残留断言；ui-boot 断言①增冷态直开骨架三断言（menu-full 在场+7 项恒在+dim 在场）
- ⑤b menu-full 布局门: CSS 锚正则保全不动（`body.menu-full` 选择器形态未变）
- 全量: **344/330 pass / 0 fail / 14 skip**（零失败，无既有失败需归因）
- lint: 两改动文件改前改后同读数 87 problems（13 errors 全既有基线，stash 对照法独立验）；全仓 108 errors 既有基线零新增贡献
- build:verify: 绿（tsc+copy-ui，dist/ui/index.html 在位）

## 三、两级流水线二轮（Stage1 绿+传输腿毕+Stage2 环A 锚毕 HOLD）

- 升版对象: TriModel 45757bd→**0359b89**（纯前端单包）；TriRMC 双 unit（trirmc/trirmc-mc）零触碰零重启（一轮 §二.7 本体教训：本轮该面零变更即零重启）
- 脚本母本: 本树 `stage1-r2-sg-build.sh`（sg sha256 6ed4861e…，60 行）+`stage2-r2-rhy-execute.sh`（R-HY sha256 c58734c1…，99 行）；两端远端 `bash -n` 过+剥 CR
- Stage1-r2: **绿 12:46:31Z**（checkout 0359b89 断言+build+**产物值面三断言**: menu-full 静态骨架在 dist/ui/index.html/常驻注记在/退役话术零残留——D-44 spirit build 时点断言新码特征）；包 `trimodel-dist-0359b89.tar.gz` sha256 **70a97bb9…e863**
- 传输腿: sg out/→本机 /tmp/lg058-r2/→R-HY in/（scp 纯搬运，D-17 通道）；R-HY 侧 `sha256sum -c SHA256SUMS-r2` **OK**
- Stage2-r2: 触发 12:47:12Z→环A 备份锚毕→**HOLD 安全停 12:49:12Z（exit 42 设计内，硬门①候 GO）**
- **备份锚读数**: dist bak=`/srv/fleet/TriModel/dist.bak-pre-lg058r2-20261006T124712Z`（dir，server.js 指纹 **a6af0b9b…f50**）+cfg tar=`backup/trimodel-data-cfg-r2-20261006T124712Z.tar.gz`（**31e5e15c…a1e8**）+ts 20261006T124712Z
- 硬门①报备: COO（msg b593fe40）+BOD（msg c11418d8）双发 12:49:45Z，候 GO-r2
- 执行形: B64 内联 nohup（aegis 间歇锁对症，一轮轮1-4 教训）；ssh 后台触发带 `</dev/null` 缺失致首触发 ssh 会话超时挂 90s（命令内容完整送达，无碍——下轮修：显式 `</dev/null`）

## 四、勘误自报（候定性）

1. **锚指纹路径二犯**: 环A 脚本写 `$BAKTM/dist/src/server.js`，实际 cp -a 形=`$BAKTM/src/server.js`（备份结构实证 `{src,test,ui}`）——一轮观察项①同款坑（彼为 `$BAKTM/server.js`），已活体补指纹进锚行（a6af0b9b…f50），回滚路径不依赖指纹（BOD 一轮收口勘口径）；脚本母本已随本收口 commit 勘正（`$BAKTM/src/server.js`）
2. 一轮脚本磁盘版锚=初版（TM 45757bd/RMC 99806cf）与一轮实跑锚（RMC a02d89b）不同步——实跑面=job command B64 内联文本（锚同步在 job 面），磁盘脚本=素材未回写。二轮脚本磁盘版=真源（母本树内+两端 sha 对表）

## 五、GO-r2 执行段（12:50 批→12:57 终态）

- GO 批: BOD 20:50+08+COO 20:50 hook 双批（四点判据核毕）；执行 12:51:00Z 重入——环A skip 复用锚→GO flag 读入→环B: untar/stop/cp/deploy-sha 断言 ok（0359b89）/start→**trimodel active 12:51:03Z**→/health ok 12:51:07Z
- **环C 首探针 FAIL=假阴性（勘误）**: 「冷态静态骨架缺失」——pipefail+SIGPIPE 假阴性实锤：`set -uo pipefail` 下 `echo "$UI"(121KB) | grep -q` 匹配即退→echo 残余写入 SIGPIPE 死 141→pipefail 误判整管道败。现场重现 rc=141×2（同响应同 grep 模式）；部署本体无恙（响应与磁盘 121837B 逐字节同 size，同进程 MainPID 2087595 未动）
- **修正版探针（文件式，管道零参与）三断言全绿**: menu-full 11 处+`<body class="menu-full">` 在场+常驻注记 4 处+退役话术 0 残留（12:56Z，R-HY /tmp/ui-now.html 勘验件）
- 收尾: FAILED→`stage2-r2.FAILED.probe-false-negative-sigpipe` 留痕改名（不抹史）；`stage2-r2.done` 落 12:56Z；GO flag/HOLD/b64/stage-r2 中间物清；三服务终态 active（trimodel/trirmc-mc/trirmc）
- **第①刻毕报**: 12:57Z 双发 COO+BOD（部署毕+环C 读数随报）；BOD 侧 playwright 独立复验→呈 CEO 刷新 3333 复验；STE 复验链候毕报触发
- CEO 亲测面: http://8.155.54.79:3333/ui#overview 冷态直开=左菜单右主体骨架+缺卡项置灰；连接后菜单项填充骨架不变

## 六、探针假阴性家族条（候 CAO 入册）

- 家族归位=「中间层隐式变形+静默失败」变体：pipefail+SIGPIPE 把断言成功伪装成失败（反向假阴性，与 chained-command-assert-abort 同族异向）
- 识别信号: 断言失败但旁证（health ok/字节 size 同/进程未动）全部指向成功→先疑管道形不疑产物
- 正形: 大变量断言禁 `echo "$VAR" | grep -q`（pipefail 下必炸）——curl/读盘直接落临时文件 grep 文件；或 grep 不带 -q 走完输入

## 六、使用依据

- BOD 更正令 2026-10-06 20:31（五条）；COO 20:32 优先级知会

## 七、终验锚（二轮闭环）

- 全链时点: GO-r2 20:50 批→部署毕 20:57 毕报→BOD playwright 复验 PASS 20:59→**CEO 亲测「左右布局 pass」21:03:22**——更正令 20:31 起 ~32 分钟闭环
- COO 认收传达 21:04（msg 收讫）: 二轮升版本体收口；STE 非作者走查照跑作质量门归档（结论可引 CEO pass 终验背书）；执行卷 ebeb3c2a 收口认账
- 本席二轮义务至此清；候办照前令: github 补推 ×2+根治设计小方案+明晚 N2

## 八、三轮施工段（机器位三段式正名，CEO 21:22 令+BOD 21:3x 端口勘正）

- 令面: 四域签三段式全格式（压缩形清零）+机器位正名 sg→M-SG/河源→R-HY+四签定谳端口（BOD 勘正 M 服务域=8712 实勘，8710 无监听）；值面 endpoint 存量零触碰边界
- 代码: **0a2ce5b**（ui/index.html 12 处正名+测试三件同步——②f 断言换全格式/⑥案压缩形勘正/新增②g 正名案（压缩形·河源·裸 sg 词边界渲染面清零）/trimmc 代际锚 TriMMC（M-SG)）；代码标识符面（fb-sg/sg_admin_token/claude-fallback-sg）非机器位称呼不动；已推 sg bare（ls-remote 证实）
- 自测门: UI 四门 **52/52**；全量 **345/331/0/14** 零失败零归因；lint 108 errors 与二轮基线同零新增；build:verify 绿；显示层 8710 清零独立 grep 验
- 流水线: Stage1-r3 绿 13:36:45Z（六条值面锚: 全格式签/M-SG/R-HY 在场+河源/压缩形零残留）；包 sha256 **14947679…77e**；传输腿 R-HY sha OK；Stage2-r3 环A 锚毕 13:37:39Z（dist bak a6af0b9b…f50=与二轮同指纹·纯前端 server.js 零变实证+cfg tar 86d30fa4…575）→**HOLD 停等，硬门①报备 13:39:57Z 双发（f44652f9/534e06e4），候 GO-r3**
- r2 教训落正形: 环C 探针文件式 grep（管道零参与）；传输腿 scp 双文件合发被 sg 侧老 scp 拒（拆两条）实录
- 脚本母本: `stage1-r3-sg-build.sh`（sg sha256 7c94991f…c09）+`stage2-r3-rhy-execute.sh`（R-HY sha256 a5e9b0fc…457）
- 时窗自查: 21:39 报备，23:00 前毕充裕
- **GO-r3 双批（COO 21:40+BOD 21:40）→续环一次绿**: 13:41:15Z 续环→deploy-sha 0a2ce5b 断言 ok→环B active 13:41:19Z→/health ok+环C 全绿 13:41:22Z→**STAGE2-R3-DONE（文件式探针零假阴性，r2 教训闭环实证）**；二轮锚⑤ menu-full 保持+正名锚全绿（全格式签/M-SG/R-HY 在场+河源/压缩形渲染面零残留）；三服务终态 active，TriRMC 双 unit 零触碰；GO flag/中间物清 13:41:54Z
- 第①刻毕报: 13:42Z 双发 COO+BOD（②f mock 8710 边界外单列注明遵 BOD 令）；BOD playwright 复验候触发

### r3b 补钉段（BOD 21:44 复验打回单点→21:56 GO 双批→21:57 毕，一次绿）

- 打回面: 正名锚全过 PASS 维持，**单点打回**=#connect R 服务域卡头实例行缺端口（「TriRMC · R-HY」→须「TriRMC · R-HY 8712」）；对称性缺口——三姊妹卡头均带端口，本席原以最小 diff/原形无端口为由漏改（UI 对称性走查教训族，候 CAO 与四签对等正形并档）
- 补钉: `CONN_DOMAINS` rmc 行→`TriRMC · R-HY 8712`；**四签端口对等显式化三层锚**——②g jsdom 逐 pane 断言（`M-SG 8712`/`本机 8713`/`R-HY 8712`/`本机 8711` 四卡头逐一在场）+Stage1/Stage2 构建产物 grep 四条（`port-parity:` 前缀 fail 硬断言）+BOD playwright 真浏览器终验
- 代码: **0a2ce5b→ce153a9**（ui/index.html 单点+②g 端口对等扩展；其余零变），已推 sg bare（ls-remote 证实 dev=ce153a9）
- 自测门: UI 四门 52/52；全量 **345/331 pass / 0 fail / 14 skip**；lint 与基线同零新增
- 流水线 r3b: Stage1-r3 绿（十锚=六正名+四端口对等，TM_SHA=ce153a9）；传输腿 sha256 -c OK；Stage2 环A skip 复用 r3 备份锚（BACKUP-ANCHOR-r3.ready，dist bak a6af0b9b…f50 纯前端零变）；**GO gate 真值注记**: COO 令文「touch GO-r3b.flag」而脚本停等门真值=`GO-r3.flag`——按脚本真值触发并如实注记（候毕报核实项，已毕）
- 回滚语义如实: 备份锚=r2 dist（文案级回退——r3b 回滚将回到二轮形态，重跑即恢复；COO/BOD 双认账）
- **GO-r3b 双批（COO 21:56+BOD 21:56）→续环一次绿**: 13:57:03Z GO flag 读入→deploy-sha ce153a9 断言 ok→环B **trimodel active 13:57:06Z**→/health ok+环C 十锚全绿 13:57:07Z（文件式零管道，r2 教训持续生效）→**STAGE2-R3B-DONE**
- **活体值面终刀 13:57:48Z**（/ui 独立 grep）: 四端口对等 PASS×4+RMC 卡头「TriRMC · R-HY 8712」在位 PASS+无裸「TriRMC · R-HY」卡头+三服务 active；GO flag/b64/stage 中间物清毕
- 触发形勘误候记: ssh 后台触发 `A && B & C` 中 `&` 使整链后台化挂 ssh 90s（读数完整无碍）——正形=换行语句形分离（候入 D 系触发令形条）
- 时窗自查: 21:57 毕，23:00 界内充裕
- **BOD 快复验 PASS 22:03（三轮闭环）**: playwright reload 强刷后渲染面逐一实锚——打回单点「R 面 · 服务域 TriRMC · R-HY 8712」在位✓+四签端口对等 8712/8713/8712/8711 逐卡在场✓+截图存证（lg058r3b-rmc-card-header-verify.png）；候 CEO 亲测归真终态。首验两次零命中=浏览器缓存旧 bundle（r3 形）非部署面（BOD 观察注记如实转记）
- **候办两条（BOD 候办不强令，本席记挂）**: ①index.html 加 no-cache 头 ②bundle 文件名 content-hash 核验项——涉服务响应头与构建管线形态，归 CTO lane 裁后再动（模块边界与技术栈不经裁不擅动）；本席登记不擅启
- 一轮执行卷: rhy-upgrade-pipeline-20261006.md（形态/硬门/教训全供）

## 九、r4 施工段（连接配置「添加项」预置项名改造·表单化，CEO 22:41 批+BOD 裁 b 今夜续走）

- 令面链: BOD 22:21 r4 单→22:25 首暂停（CEO 勘正 settings.json 面）→22:29 重拟 15 项→22:33 追加 crossSessionInbound=16 项→22:37 二暂停（CEO 22:36 令改 CC Switch「编辑供应商」表单化形态，16 项清单仍有效）→22:41 CEO 批 v2 表单化「照这个派工」→22:43 BOD 裁 b 特批今夜续走+三护栏（①硬门①全程不省②毕报候 BOD 即时复验③复验异常即时回滚不过夜，回滚判据=四签/表单/预览任一渲染面异常即滚）
- 代码: **ce153a9→75986ad**（ui/index.html+test/ui-fourplane.test.ts 两文件单包）；表单化布局: 主平铺 2 件（请求地址 ANTHROPIC_BASE_URL+主模型 ANTHROPIC_MODEL，中文标签+键名小字注）/高级选项▼折叠内三块（模型映射表 4 行×映射模型+展示名 8 键+行为开关组 6 项含 crossSessionInbound+自定义项折叠兜底）/配置预览折叠区实时 JSON 预览（input 事件委托→connRefreshPreview→所见即落盘）；密钥禁入（AUTH_TOKEN/API_KEY 结构性零出现，域卡自管边界照旧）；四域统一同组件，各域值独立；存量分流（CONN_FORM_KEYS 内键填表单、外键走既有自由行零冲突）；保存链零变更（隐藏 data-cd-key 承键名，connCollectItems 内部升级位置配对+表单行空值=未设）
- 自测门: UI 四门 **51/51**（r3 报 52 系含 skip 口径差，如实注明）；全量 **346/332 pass / 0 fail / 14 skip** 零失败零归因；lint errors 13=基线（5 处 no-non-null-assertion+1 处 prefer-const 新引入即修，stash 对照法）；build:verify 绿
- 流水线 r4: Stage1-r4 绿 15:10:28Z（值面锚: 表单 8 特征+密钥两键零出现+三轮回归）；包 sha256 **7360ed48…2712**；传输腿 sg→本机→R-HY sha256 -c **OK**；Stage2 环A 锚毕 15:11:06Z（dist bak=/srv/fleet/TriModel/dist.bak-pre-lg058r4-20261006T151106Z，server.js 指纹 a6af0b9b…f50=与 r2/r3 同指纹·纯前端零变实证+cfg tar 5c40ffbb…9b2）→**HOLD 安全停 15:13:06Z（exit 42 设计内）**→硬门① 报备 15:13Z 双发（COO bc464814/BOD f208cfc3），候 GO-r4
- 触发形勘误候记（B64 heredoc 经 ssh 变形）: 首触发用「双引号 ssh+内嵌 heredoc+$(cat 展开)」形——远端 /tmp/s1r4.b64 落成 4184B **明文**（非 base64 5580B），base64 -d 解不出→管道 bash 收空→静默未跑（TRIGGERED 回显但 log 零建立）；正形=**本地管道直灌**（`cat local.b64 | ssh 'cat > remote.b64'` 传后验 wc -c+解码 head+bash -n 三验，再单独 ssh 触发 nohup）；根因未深挖（heredoc+ssh 参数化形态在链上被隐式变形，截断伪影家族「中间层隐式变形+静默失败」同族候记）
- **GO-r4 批（BOD 23:13+08 单批）→续环一次绿**: 15:14:26Z 重入→环A skip 复用 r4 备份锚→GO flag 读入→环B untar/stop/cp/deploy-sha 断言 ok（75986ad）→**trimodel active 15:14:29Z**→/health ok 15:14:30Z→环C 全绿 15:14:31Z（文件式零管道，r2 教训持续生效）→**STAGE2-R4-DONE**；三服务终态 active（trimodel/trirmc-mc/trirmc），TriRMC 双 unit 零触碰零重启
- **活体值面终刀 15:14:54Z**（/ui 独立落盘 grep，128388B）: r4 表单 8 锚 PASS×8（请求地址/主模型/高级选项/模型映射表/行为开关/配置预览/BASE_URL/crossSessionInbound）+三轮四签端口对等 PASS×4（M 面 · 服务域/R-HY 8712/本机 8713/本机 8711）+menu-full 保持 PASS+密钥两键 0 出现+河源 0 残留；GO flag/HOLD/b64/stage-r4 中间物双机清毕（in 包+备份锚留审计）
- 部署毕时点 23:14+08；第①刻毕报候发双（COO+BOD），BOD 护栏② 即时复验在挂；回滚锚毕（护栏③ 备而未用）
- **BOD 复验 PASS 23:18（护栏② 关账·r4 闭环候 CEO 深验）**: playwright 强刷独立复验全绿——四卡表单 11 锚×4 全 PASS（请求地址/主模型/高级选项/映射表四行 Sonnet-Opus-Fable-Haiku/行为开关/自定义项/配置预览）+密钥两键零出现×4+河源零残留×4+四签端口对等（M-SG 8712/本机 8713/R-HY 8712/本机 8711）+**交互级实测 PASS**（主模型填值→配置预览实时出 `{"ANTHROPIC_MODEL":"glm-5.3-flash"}` 联动，放弃改动清场毕）+视觉截图 lg058r4-form-verify.png 留锚；护栏③ 未触发零回滚；本席 r4 义务至此清，收工候 CEO 亲测

## 十、r5 施工段（连接配置表单增补·cc-switch 对齐，CEO 23:31 打回三缺口+23:41 批令·裁 A）

- 令面: BOD 23:42 派工（任务书正身=board worktree W41 `task-charter-lg058r5-connect-form-20261006.md`——已读照办）；CEO 23:31 深验打回 r4 三缺口（API Key 无填写位/高级选项缺 API 格式与认证字段）→功课（cc-switch 手册 2.1）→23:41 批「范围认，API 格式裁 A，派工」
- 代码: **75986ad→5188e7f**（ui/index.html+test/ui-fourplane.test.ts 两文件，+210/−7）；五件落点:
  ①API Key 密钥行: password+显隐眼睛钮（`data-cd-eye` click 委托切换 type+钮文），主平铺紧跟请求地址（`__APIKEY__` 哨兵行）；值落所选认证字段键（`data-cd-keyref` 行→收集链取 pane 内 `[data-cd-authfield]` select 现值作键——收集链语义零变更扩展）
  ②认证字段下拉: AUTH_TOKEN（默认）/API_KEY，说明文照任务书；两键入 CONN_FORM_KEYS=存量分流走表单不再落自由行；密钥存量填充判定 AUTH_TOKEN 优先/API_KEY 缺位回落
  ③API 格式下拉: 四选项照录（Anthropic Messages（原生）默认/OpenAI Chat Completions/OpenAI Responses API/Gemini Native generateContent，均「需开启路由」）；**裁 A**: select 无 data-cd-key/val=零收集=不落盘不进预览（结构性保证）+非原生警示 span（「需本地路由，TriModel 现役仅支持 Anthropic Messages 直连」）显隐联动
  ④模型映射表行级 1M 开关: checkbox `data-cd-1m`，change 剥/加 `[1m]` 尾缀（CONN_1M_RE 幂等正则，_NAME 展示名不加）；预览实时联动
  ⑤预览联动增补: Key 值落所选键/1M 尾缀实时/格式零出现
- 施工中间修复两笔（如实）: ①接入设置两行初带 data-cd-row 致 ②h/②i 自由行断言 3≠1——该两行无收集语义摘除属性（select 刷新走 change 委托不依赖 input 面）；②jsdom 环境无全局 HTMLElement——instanceof 断言改存在性断言
- 自测门: UI 四门 **52/52**（②i 新增一案: 五件渲染×4 卡+眼睛切换+键名跟随+裁 A 双断言+1M 联动+放弃清场五断言）；全量 **347/333 pass / 0 fail / 14 skip**（+1 案）；lint 全仓 108 errors=基线零新增（改动文件 13=r4 同面）；build:verify 绿
- 密钥纪律: 测试全假值（sk-test-stock-fsd/sk-test-live-fsd），真值零进会话链；锚语义反转如实注记（r4 密钥禁入→r5 密钥行在位，任务书纪律「密钥明文落投影对齐 cc-switch」）
- 推送: sg bare ls-remote 证实 dev=5188e7f8d18dc02f2c5325ece0b23503db259235（75986ad..5188e7f）
- 流水线备便: `stage1-r5-sg-build.sh`（sg sha256 cf628659…8d39，锚=五件特征 12 条+r4 回归 8 条+三轮/二轮回归 4 条）+`stage2-r5-rhy-execute.sh`（R-HY sha256 69e6a6fb…f1b9，GO-r5.flag 停等+回滚 bak-pre-lg058r5）双端已部署 bash -n 过；候 BOD GO-r5 硬门签发后开跑
- 时窗: 施工毕 16:08Z（00:08+08，10-07 凌晨）；「是否可入部署窗」如实两案候裁（①顺延 10-07 晚窗②特批即时走 r4 裁 b 同款三护栏）
- **GO-r5 签发（BOD 00:12 裁 b 即时走·三护栏全程不省·自挂 flag 授权）→全链毕**: Stage1-r5 绿 16:13:02Z（五件特征 12 锚+回归 12 锚全过）；包 sha256 **61fba299…0a0a** 传输腿 sha256 -c OK；环A 备份锚毕 16:13:26Z（dist bak=/srv/fleet/TriModel/dist.bak-pre-lg058r5-20261006T161325Z，server.js 指纹 a6af0b9b…f50=**四轮同指纹**纯前端零变+cfg tar c5508d57…684）；硬门① 报备 16:13:40Z（msg 8eb68764）→自挂 GO-r5.flag→重入→**STAGE2-R5-DONE 16:14:00Z**（deploy-sha 5188e7f 断言 ok→active 16:13:59Z→/health ok→环C 六项全 PASS）
- **双实例重放勘误（如实）**: GO 停等设计下首实例（16:13:25Z 启动，停等窗 120s 未超时）与我方 16:13:5xZ 重入实例**并存竞争**——首实例 16:14:01Z 读到 flag 续环二次部署（同包 5188e7f 幂等重放：deploy-sha 同值断言过/环B active 16:14:04Z/环C 复验全绿 16:14:05Z/二次 DONE）；trimodel 闪断一次（~5s，16:14:01-04Z 窗）；根因=本次报备+自挂快于停等窗（r4 报备时首实例已 HOLD 退出故无双跑）；终态三服务 active+deploy-sha 5188e7f 正确；候记 GO 停等门纪律条（自挂触发前先查停等实例存活，正形=轮询 HOLD/done 后再触发）
- **活体值面终刀 16:16:22Z**（/ui 独立落盘 grep 133862B+**拉取面 HTTP 200 断言**）: r5 五件锚 PASS×9（API Key/认证字段/API 格式/keyref/eye/1M/AUTH_TOKEN/API_KEY/警示文案）+四选项文案 PASS+r4 回归 2 锚+三轮四签对等 PASS×4+menu-full 保持+河源 0 残留；GO flag/b64/stage-r5 中间物双机清毕（in 包+备份锚留审计）
- 毕报两刻制: 第①刻部署毕 16:14:05Z（环C 读数随报）；第②刻活体终刀 16:16:22Z——候 BOD playwright 即时复验（护栏②）
- **BOD 复验七锚全 PASS 00:2x+08（护栏② 闭环·r5 全链毕）**: playwright 强刷+textContent 逐卡+交互级实测——①四卡五件 10/10 ②眼睛双态还原 ③认证字段切换键跟随+旧键消失（假 Key sk-test 形，真值零进链）④裁 A 双断言绿 ⑤1M 勾→[1m] 即现 ⑥放弃清场正形（首读 HAS-VALUE 假象=400ms 异步重渲窗时序，与 r4 innerText 假象同族，BOD 已入任务书附注）⑦两面 200+r5 特征命中；截图留锚；BOD 勾账 commit a750e565；双实例重放勘误收讫入账不追责，「自挂前先查停等实例存活」正形候记收到——本席 r5 义务至此清，呈 CEO 深验（九条第 3 项重开），收工
- 三机现势实勘: sg bare dev=0359b89（ls-remote 值面）/R-HY 在役 deploy-sha=45757bd
- 纪律: 硬门①报备义务（一轮 COO 令原文）/D-17 本机传输腿/B64 内联 aegis 对症/值面三断言（截断伪影与键值掩码面零触碰——本卷零 token 值出机）

## 十一、r5b 缺陷修复段（密钥行保存必 400·STE 真链路实测暴露·BOD 03:12 阻塞级派工·裁 a）

- 令面: BOD 03:12 阻塞级——STE 03:11 报 r5 密钥行保存必 400：`handlePutTrimmcCard`（config-cards.ts L208）→`trimmc-card.ts` L162 守卫黑名单正则 100% 命中 ANTHROPIC_AUTH_TOKEN/ANTHROPIC_API_KEY（`tokens?`/`api[_-]?keys?` 段）；jsdom 全绿+真链 400=「单测直调+jsdom mock」双盲（09-15 家族第三次实证）。修法裁 a=守卫两键精确名白名单豁免（黑名单前置），其余泛拦照旧不松；密文存储候办另议不阻；真链路测试必补（硬锚）；禁再 jsdom 单过即报完工
- 代码: **5188e7f→73ca1cc**（src/api/trimmc-card.ts+新卷 test/config-cards.r5b-truechain.test.ts，+151/−1）:
  ①守卫豁免: `LOCAL_CONFIG_KEYREF_ALLOWED = Set(['ANTHROPIC_AUTH_TOKEN','ANTHROPIC_API_KEY'])`（精确名/大小写敏感），黑名单判定前置 `!ALLOWED.has(k) &&` 短路——api_key/token/secret 泛拦照旧（含小写变体仍拒）；与 UI CONN_FORM_SPEC.authfields 同名同集，改一处须同步另一处（单点真源候办候 CTO 排窗）
  ②真链路硬锚（新卷 3 案）: 真 socket serve→真 dispatch→PUT /v1/config/cards/rmc→落盘→HTTP+文件双面回读。案1 两键+普通键 200+值面（假 Key sk-test 形）回读；案2 FOO_API_KEY 仍 400 人话拒+卡零污染（version 不动+键零落盘+案1 值面不受扰）；案3 小写 anthropic_auth_token 仍 400（精确名边界不外溢）
- 施工中间修复三笔（如实）: ①首跑 400「条目数据格式错误」=载荷保真缺 provider_entries（写守卫要求键在场）——对齐 ui L1736 r5 表单 save 正形 `{provider_entries:{}, local_config:{items}}`；②二跑 400「connection.name 必填」=沙箱无存量卡（emptyCard('') 空名），生产现势=表单编辑既有卡——布景种子卡（引擎层 saveCard 直写仅作 arrangement，被测面仍是 HTTP 全链）；③after 钩子内嵌+死代码 pin 清理（server 生命周期外提统一收口）
- 自测门: 新卷 **3/3**；定向族（trimmc-card/v4/config-cards/ste/card-path/ui-fourplane）**96/96** 零旧案翻绿（既有守卫案用泛键 api_key 不受豁免影响）；全量 **350=336 pass / 0 fail / 14 skip**（env 门控既有形态）；tsc 清；build:verify 绿
- 推送: origin（sg bare）dev=73ca1ccfd1f5df3cf34419cb947ef972180c29da（5188e7f..73ca1cc，19:23:11Z）
- 流水线小轮: `stage1-r5b-sg-build.sh`（新增 r5b 守卫值面锚 3 条=编译产物 LOCAL_CONFIG_KEYREF_ALLOWED+两键；r5 五件+r4/三轮/二轮回归锚全保持）+`stage2-r5b-rhy-execute.sh`（GO-r5b.flag 停等+回滚 bak-pre-lg058r5b+环C r5b 守卫面探针——活体进程读的就是这份编译文件）；双脚本落树+双端部署 bash -n 过
- Stage1 毕 19:25:02Z（包 trimodel-dist-73ca1cc.tar.gz sha256 **a44e6fe0…9096**）；传输腿 sg→本机→R-HY sha256 -c 双跳 OK；环A 备份锚毕 19:25:51Z（dist bak=dist.bak-pre-lg058r5b-20261006T192551Z，server.js 指纹 a6af0b9b…f50=**五轮同指纹**·守卫面单文件变更实证+cfg tar f4480246…5442）；硬门① 报备 19:26Z 双发（BOD 6fc2ec35/COO 5841923f），停等 GO-r5b 候批——120s 超时自 HOLD exit 42（设计内），环A 锚持久批后重入零重复备份
- 纪律: 真 socket 真路由（dispatch 零 mock，唯一替身=无关 ModelClient）；载荷保真对齐 UI 正形；假 Key 全程（sk-test-r5b-*），真值零进链；防双实例候记正形待触发段执行（触发前查停等实例存活）
- **GO-r5b 签发（BOD 03:2x 三面复核 PASS·裁 b 即时走·三护栏）→全链毕（防双实例正形首用）**: 收令 19:27:38Z 即查停等实例存活——首实例 pid 2110137 存活且在停等窗（剩 ~13s）、flag 未落→正形只挂 flag 不起二实例；flag 19:27:57Z 落，首实例 19:27:51Z 已 HOLD 退出（早 6s，设计内安全停零部署）→旧实例确认死+重入单实例：环A skip 复用备份锚→GO 读入 19:28:12Z→deploy-sha 73ca1cc 断言 ok→**active 19:28:15Z**→/health ok→环C 全绿→**STAGE2-R5B DONE 19:28:16Z**
- **活体终刀 19:28:4xZ（独立于环C 复核）**: 三服务 active；TriRMC 双 unit 零触碰实证（ActiveEnterTimestamp 13:46:38/13:25:47 CST=早于本窗未重启）；活体守卫面 LOCAL_CONFIG_KEYREF_ALLOWED×2 命中（活体进程所读编译文件）；/ui 独立落盘 133862B 十锚 PASS+河源零残留；中间物双机清毕（in 包+备份锚+READOUT+log 留审计）
- 毕报两刻制: 第①刻部署毕 19:28:16Z+第②刻终刀 19:28:4xZ 合并双发（窗短）；知会 STE 即启两 Key 保存链复测（BOD 令附款）
