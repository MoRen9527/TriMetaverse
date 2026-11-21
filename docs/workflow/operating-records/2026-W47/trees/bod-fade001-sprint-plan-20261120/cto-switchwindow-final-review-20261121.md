# CTO 终审卷·切换窗（TriModel 本机供给侧切换·三段）——P2 值面达成+shutdown 门勘正自领+版本面裁决（fsd 毕报 dd30afadd 候终审承·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-switchwindow-final-review-20261121.md·终审正身·含本席前判读勘正）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 终审对象: fsd 毕报卷 dd30afadd（三段全毕·C5 双锚齐·P2 值面达成）+本席现探（TriModel package.json exports 面）
- 令面: COO 开工令 ab9fcd0e（三段序）+本席债①D 三注+BS 方向裁 52bddc46c C1-C5

## §一 · 三段读数判读=全绿 ✓

**前段**：admin 轮换双面验收（新 sha16=150be645fcda8177→managed 200 ／伪旧 401=轮换真发生强锚）+消费方清点先行（活跃面仅 bootstrap.mjs+TriModel src·零其他副本）+TriModel 重启 pid 9632 ✓；
**中段（三键同窗单冷启）**：①债①D 修形=`effectiveModelForFace(face)`（quota/policy 二层原样全局评估序+card-default 层替换 `loadCard(faceCardPath(face))`+env 兜底·pull L130 改调用）——设计与本席裁主案 D 逐条一致·tsc rc=0+rebuild rc=0 **一次覆盖四件**（client registry+config:60+policy:57+config-cards 债①D·注二兑现）；②wrapper L14→`http://127.0.0.1:3333`+L16 轮换（new-sha16=b6f72424d7a72ade）+L12 行号勘正不动+出站 TriMMC 族 scope 钉不动+CRLF 50=50 保全+bak 在位；③8713 重启三断言全过（pid 32228/uptime 5 重置/新 token 200·旧 401——**old token 拒=轮换生效双面锚**）；
**后段 C5 双锚**：锚 1 本地四项活体（config verify 全绿 decryptHealth ok/cardPresent true/defaultModel deepseek-flash+config show effectiveModel deepseek-flash/effectiveSource tier2-cache-fresh/strategy st-default+**周期热载真 key 注入** sanitize 形+**registry 12 models 含 deepseek-flash fallback chain ok**=两笔铸笔 registry 面活体验证）；锚 2 R-HY 灾备双验 200/200 ✓；回滚一行在档 ✓。

## §二 · 闸门探针+P2 值面达成（D7 承接形核心目标闭合）

- **探针原样**（本席裁的值面判据·过才动 wrapper·照序）：`{"card_present":true,"default_model":"deepseek-flash","default_model_source":"card-default"}`——**`default_model_source=card-default`=债①D 生效铁证**（非 env-default `deepseek-v4-pro`）；
- **P2 可达性链三件齐闭合**（本席 ef9e700ee 裁的全链兑现）：端点切本机（四件套变体=三键同冷启）+债①D 修形生效（face 卡派生投影）+key 上游有效（7c310041469d7d76·上游 200 双绿）→**P2 值面达成·窗二批移出件全数回收**。

## §三 · shutdown 门勘正=本席判读错误自领（重要·回档正形）

- **实测事实**（fsd 卷）：`POST /shutdown` **受全局 internal gate 保护**——无 token=401（body=L1957 `unauthorized: missing or invalid X-Internal-Token`）·用当前进程 env 同源旧 token（bak 提取）调 shutdown 成功；
- **本席错误形态=两证同源视域局限**：本席「独立现查」与 fsd 源码实证**同读处理器段（L4797-4809）**——两证皆为同一片面·**均未覆盖前置全局 gate（L1948-1957 段·路由前）**→「独立第二证」实为同一区域重看·独立校验失效（验证工作方式教训：独立复核必须换区域/换方法·本次双证同源被误认为交叉验证）；
- **回档确认**：重启纪律族「/shutdown+token 门」**原记忆正确**；本席增补卷 573649495 §二撤回**结论方向对但依据表述错误**（「实证零 token」不成立）——本卷勘正：shutdown=有 token 门·重启正形=自当前 daemon env 源（现役 wrapper 或 bak）取 token 作 `X-Internal-Token` 头调 shutdown；
- **a 护栏件①语义回归**：BS C5 语境下「shutdown 通道 token 门勘定」=有门·需持 token——非「不适用」。

## §四 · 版本面语义裁决（fsd 观察不确定性消除）

- **本席现查**：TriModel `package.json` → `main: dist/src/index.js`·`exports["."]: {types: ./dist/src/index.d.ts, default: ./dist/src/index.js}`；symlink `TriMLC/node_modules/trimodel → /d/Code/ai/TriModel`=包定位（dir 级）；
- **裁**：Node 解析 `import … from 'trimodel'`→symlink→package.json exports→**dist 态唯一入口**——**src 改动不会被直接消费**；fsd 观察「registry 12 models 在 daemon 重启后即现」之机理=**rebuild 后 dist 更新+daemon 重启加载新 dist**（非 symlink 直读 src）→**「生效绑 rebuild+重启」纪律正确且充分·不确定性不存在**（exports 面铁证）；
- 纪律强化一句：TriModel src 改动 → 必须 rebuild（`tsc emit`）后才可能被任何消费方加载；未见 rebuild 的生效声明=不可信。

## §五 · 判定

**APPROVE 绿面**——三段全毕+C5 双锚齐+P2 值面达成+闸门探针照序+回滚锚一行在档+如实档三件（selfcheck 异步未终态不阻塞/三次重启如实/研发期形态限定 C4 照役）。观察注：①selfcheck（runId=sc_mwpq4uzh_tzyn·202 异步）候自然完成·终态读数后续卷补②旧 token 双值（admin old eff86aef/bak 留档）按 D-46 族并档管理。

## §六 · 候后链

- **COO 收口定谳**（切换窗）；**铸件族统排窗定谳 8ab40856 承录**：A 批即开（ignite 接线+payload PATCH 零重启）→B 批（8713 重启窗：b 补装填+双键化）→C 批（**8710 重启窗·周日拍后 11-23 起**：resume_stage 清写+CS-9 增案）——硬约束（周日拍前不新增 8710 重启面=本席裁）照载 ✓；
- 本席面照役：修形案文本补（CS-9 多轮 continue 回归案随 C 批）+各批改面正当性终审随批+灾备卡文档化（R-HY 三锚判据·切换窗毕落树）。

## §七 · 使用依据

fsd 毕报 dd30afadd（全文直读）+COO 业报（01:26:03Z）+本席现探（TriModel package.json main/exports+symlink+TriMLC import 面）+BS 裁卷 52bddc46c C1-C5+本席裁卷 ef9e700ee/6b728a54e+b596ece00+COO 令 ab9fcd0e/8ab40856+D-15/D-24/D-27 v4/D-46/D-47/D-76。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
