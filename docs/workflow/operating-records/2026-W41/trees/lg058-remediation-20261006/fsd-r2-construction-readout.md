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
- 三机现势实勘: sg bare dev=0359b89（ls-remote 值面）/R-HY 在役 deploy-sha=45757bd
- 纪律: 硬门①报备义务（一轮 COO 令原文）/D-17 本机传输腿/B64 内联 aegis 对症/值面三断言（截断伪影与键值掩码面零触碰——本卷零 token 值出机）
