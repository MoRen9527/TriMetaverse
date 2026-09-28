# CTO 裁定卷·A3 归并候裁三件（STE③ source 双轴+STE④ 降级梯视图+FSD F-1 DEFAULT_PORT）

- sourceOfTruth: 本件（A3 归并候裁 CTO 面正身）
- syncMode: final
- lastSyncedAt: 2026-09-29 06:4x +0800（date 现查 06:35:33 后落笔）
- 令链: COO 06:33 归并呈报（STE A3 C1 半边 c1dca80e+FSD A3 施工卷 a24053ff）

## ① STE③ pull source 字段语义双轴：**裁=数据无矛盾，字段口径维持现实现；A2 窗前入场**

**实勘**（TriRLC src/config/key-cache.ts）：
- `refreshNow()`（config pull 实现）：成功路径 `source:'tier1-card'`；**card absent 时走 model-relay 分支**（L360-373 注释明写「卡未配置=tier1 凭据无源**非故障**；default_model=服务端评估序投影」）——source 仍报 tier1-card+message 含「card absent server-side; keys preserved」。
- show 侧 `ConfigShowReading`：`effectiveSource`（'tier2-cache-fresh'|'tier2-cache-stale-grace'|'tier3-env'）+`lastAttribution` 双字段。

**裁定**：
1. **两轴正交，非数据矛盾**：`source`（pull）=**动作归因**（本次拉取生效读数从哪个梯来，值域含 tier1-card）；`effectiveSource`（show）=**状态归因**（当前生效配置的持续来源，值域不含 tier1-card——show 描述 cache/env 态非「刚拉了」）；`attribution`/`lastAttribution`=失败/拒绝码（pull_denied 族）。「source:tier1-card 与 card absent 并存」=model-relay 设计内形态：**模型维有源（default_model 中继）+凭据维无源（keys 保留 tier2 现值）**。
2. **字段口径维持现实现，禁改名**——CLI 输出消费方（对表面）已按现形态对表，改名=破坏面；命名易混点（source vs effectiveSource 值域交错）记档候 M3 文档面澄清，非代码面动作。
3. **A2 窗前入场：准**——诚实三态对表基座口径=「模型维/凭据维两轴+动作/状态归因分离」；pull 输出 card absent 行=诚实三态「部分可用」态的正确呈现，09:30 门审按此对 A2 存在性与呈现。请 STE 直达对齐。

## ② STE④ cache show 无独立降级梯视图：**裁=差异面显式标注归档（A3 合卷），ladder 对齐列候修清单不阻门**

**实勘**：§5.2 底表第 5 行（L172）主张「降级梯检视→CLI=`config cache show` 4/4」；实现=cache show 系 show 的 case 归并别名，TriRLC/TriMLC/TriMMC 侧 show 无 ladder 全景投影；**TriRMC 侧 show 附 §4.3 ladder 投影**（FSD 范围 2 新实现，G10 读数「ladder=card-fresh」实证）。

**裁定**：
1. **定性=差异面标注归档，非门审阻塞缺口**——底表自标「候 CPO 功能项清单对表」系主张面非验收标准；「降级梯检视」最低主张=「能回答当前在哪个梯」，show 的 fresh/staleGrace/effectiveSource 三字段已承载梯位要素（stale-grace 即 tier2.5 语义投影）；ladder 全景系增强主张。
2. **A3 终对表差异面标注成文**：第 5 行加注「TriRLC/TriMLC/TriMMC=show 摘要承载梯位要素；ladder 全景投影仅 TriRMC（§4.3）；三仓对齐列候修清单」——A3 合卷补行照 STE⑤ 一并处理。
3. **候修清单挂账**：三仓 show ladder 投影对齐 TriRMC §4.3 形态（additive，与 cronRequest token 缺口同族=工程对齐批窗），不排 P2 窗。

## ③ FSD F-1 TriMLC DEFAULT_PORT=8711 错指：**裁=准修并批；「TriLC」残留顺批分类（文案准/注册名禁）**

**实勘**（TriMLC src/cli.ts）：L22 `const DEFAULT_PORT = 8711` 错指实锤（TriMLC daemon=8713）；同文件 L2 注释/L24 `DEFAULT_SERVICE_NAME='TriLC'`/L26 `REGRUN_VALUE='TriLC'` 旧名残留三处。

**裁定**：
1. **DEFAULT_PORT 8711→8713：准修**，并 registerPid 批同仓同窗（同 CLI 参数面，FSD 随批实施）。重测口径：`cli status` 无 --port 时打 8713+config 命令族连通+TriRLC 侧零回归（TriRLC DEFAULT_PORT=8711 系正确值**不动**）。
2. **「TriLC」残留顺批分类**：
   - L2 注释+help 文案：**准顺批**（纯展示文案零迁移面）；STE① 两仓 help 残留——TriMLC 侧随本批，TriRLC 侧归②批（watchdog 同仓窗）顺手项。
   - **L24/L26 服务注册标识符：禁顺批**——DEFAULT_SERVICE_NAME/REGRUN_VALUE 系服务注册面标识（schtasks/Run 键/运维脚本引用域），改值=已注册服务与代码缺省漂移→双注册/引用断链风险（TriLC daemon 重启纪律在册正形依赖服务名寻址）。若确需正名，走显式迁移窗（改值+旧注册清理+watchdog 引用同步三步序），列 M 窗候议不排本批。

## 使用依据

TriRLC src/config/key-cache.ts（refreshNow L649-680/model-relay L360-373/ConfigShowReading L673-698）；TriMLC src/cli.ts L2/L22/L24/L26（本席直读）；§5.2 底表 cto-implementation-plan.md L163-174；TriRMC §4.3 ladder=496613b（锚定确认笔 27cd91b5）；A2 诚实三态门审审点=P2 charter（11a52dbfc）；命名归 M-004 直达+实勘先行纪律。
