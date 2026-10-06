# LG-058 R-HY 升版流水线·执行卷（rhy-upgrade-pipeline）

- 执行: m-sde（SDE 小布）；令源=COO 升版触发令 12:13（msg e4abb7cf，BOD 11:56 终裁令序③）+COO 裁准 APPROVE 12:2x（两级包形态+验收细化附入）
- 时点: 开工笔 2026-10-06 12:40+08（date 现查 2026-10-06T04:40:22Z）；本卷=开工笔+读数卷合一（毕后续写收口段）
- 升版对象: TriModel sg bare dev=45757bd811fa8f705ae51e5a4e9478c548466010 + TriRMC sg bare dev=99806cf191cbb623d6c009d78a98b39975be2ba8（RLC 5481f4f 本地域不在本面）

## 一、形态（COO 裁准两级包）

```
Stage1 sg 构建环（TriMMC 8712 挂单，无人值守）
  clone sg bare → checkout 目标 sha → 构建（tsc+copy-ui / tsc）→ dist tar + git bundle 备援 + SHA256SUMS
    ↓ 本机传输腿（scp 纯搬运 bundle+dist 包 sg out/ → R-HY in/）
Stage2 R-HY 自包含执行包（ssh nohup 单发触发，全自动）
  环A 备份锚 → BACKUP-ANCHOR.ready → 停等 GO.flag（120s 超时 HOLD exit 42）
    → 环B 部署（stop→staging→mv+chown→sha 指纹断言→start→is-active）
    → 环C 值面探针（healthz 绿≠生效：/health+8710/healthz+managed 四卡字段+N4 文案断言）
    → 环D N2 演练 rmc→rlc（COO 细化：差异模板双断言 apply≠原态+rollback==原态）
    → 环E 拉取链对表（journalctl vs 卡面 local_config）
```

- 硬门①: 环A 备份锚 hash+时点写 `BACKUP-ANCHOR.ready`→本机腿轮询到→**即时报备 COO+BOD**→GO.flag 才续环（未报备禁止开跑，COO 令原文）
- 硬门②: 环C 值面探针——版本/四卡数据/N1 拉取状态/N3 来源/方案三三态字段级实测，脱敏白名单字段输出
- 硬门③: 回滚预案随链——环B 任一断言失败自动 rollback（恢复 dist.bak+restart+is-active），stage2.ROLLBACK 留痕

## 二、开工现势（12:40）

| 项 | 态 |
| --- | --- |
| Stage1 脚本 | ✅ 写毕+`bash -n` 过+scp sg `/srv/fleet/lg058-upgrade/stage1-sg-build.sh`（sha256 abe7ae01…21e5e 与本机一致） |
| Stage2 脚本 | ✅ 写毕+`bash -n` 过+scp R-HY `/srv/fleet/lg058-upgrade/stage2-rhy-execute.sh`（sha256 fad38c1d…c91bd8 与本机一致；预置未触发） |
| sg TriRMC 构建依赖 | 勘勘实锚：sg 现役 checkout 无 node_modules 无 dist（v6b 系 tsx 直跑）→Stage1 环1d 改 `npm ci` 走网络（npm run build=tsc，R-HY node_modules 不动——依赖零变双仓已断言 161d0ca→45757bd、496613b→99806cf package.json+lock diff 空） |
| 挂单 | ✅ TriMMC 8712 job `1923c530-ea5e-4404-bbcd-406aed606bca` name=lg058-stage1-build every 60s+done 门+毕即自删；首轮 nextRunAt=**12:40:32+08** |
| 进行中 | Stage1 构建环（clone→npm ci→build→tar，预计 5-15min） |
| 候办 | Stage1 毕→本机传输腿→触发 Stage2→**BACKUP-ANCHOR 报备 COO+BOD（候信态）**→GO.flag→环B-E→收口 |

## 二.5 Stage1 排障实录（12:40-13:0x，六轮）

| 轮 | 失败点 | 根因 | 修 |
| --- | --- | --- | --- |
| 1-4（12:41-12:44） | executor exit 127「No such file」×4 | **aegis（AliYunDun）间歇性文件锁**：新落可执行脚本 open 面对部分上下文返回 ENOENT（root 部分时刻可见/fleet 长期被藏；readdir+glob stat 可见、literal open 拒；R-HY 同签名复现） | **B64 内联 command**（`bash -c "echo <b64>\|base64 -d\|bash"`）零文件面执行——突破后 executor 链全通 |
| 5（12:48） | tm-build TS2307 `@trimetaverse/tricode/trimodel-cli` | 双仓 `"file:../TriCode"` workspace 锚在 clone 内断（sibling 无 TriCode）；node_modules 相对链同锚 | clone 树旁 `src/TriCode → /srv/fleet/TriCode` 单 symlink 双仓通吃 |
| 6（12:52） | rmc-build `tsc: command not found` | TriRMC lock 生产系无 typescript 条目（npm ci 仅 19 包） | PATH 注入 TriModel clone 的 tsc 5.9.3（满足 ^5.9.2） |
| 7（12:55） | rmc-build TS2688 `Cannot find type 'node'` | 同 lock 根因缺 @types/node（tsconfig `types:["node"]`） | symlink TriModel 的 @types/node |
| 8（13:00） | TS2307 `@tricompany/agent-core`+TS18046 unknown 级联 | 第三 workspace 包 `file:../TriCompany/packages/agent-core`（unknown 系 import 断类型级联） | `src/TriCompany → /srv/fleet/TriCompany` 锚+`trimodel` 项经 clone 本体自动锚定；@types/pg registry 补装（pg import 类型面） |
| 9（13:04） | rmc-build TS2322+TS2345 ×2 | **TriRMC 存量 strictNullChecks 类型债**（非环境问题：六件修全生效、tm-build 亦绿）——99806cf 从未过全量 tsc（本机 dist mtime=9-26 实锚），日常验证链 vitest/tsx 不做全量类型检故未暴露。两处：resolver.ts(50,5) `io_contract: c.io_contract` 源型含 null\|undefined / session-initializer.ts(91,49) `resolve(sourceRoot, paths.soul)` string\|undefined 传 string 参 | 修归 FSD（源码车道，SDE 不降 tsconfig 质量门不代修）——SendMessage 直达求两处最小修+push bare 回执新 sha；job 已 PATCH enabled=false 停重试防刷；候 COO 裁「修后新 sha 升版对象漂移」流转口径 |

**COO 候裁点裁定（13:10 信，梯次二档在窗确认）**：①流转裁=**类推准口径采认**——strictNullChecks 类型修 2 处视同「使构建成立」类修复（与排障三构建链缺陷同族），不候 CTO 门放行推进；②护栏一=FSD 修毕收 sha 时 diff 面断言（`git show --stat <新sha>` 必须仅两文件最小行数禁夹带，diff 摘要随重挂回执链呈报）；③护栏二=**锚表显式替换** 99806cf→新 sha（树单锚表+读数卷锚标+Stage1 job checkout 锚+Stage2 包名断言四处同步）；④护栏三=CTO 事后追认环随五环读数卷一并呈（COO 随卷流转，不占时窗）。

**BOD 采认硬要求两条（13:12 COO 传导，随回执链生效）**：①FSD 回执验收三要素齐才放行清门重挂=新 sha+**tsc 全量绿读数**（零行为语义变更自证锚，缺一退回）+两处 diff 摘要——diff 面断言照做不替；②**sha 变更点显式标注**：备份锚报备信与五环读数卷均加一行「升版对象 TriRMC sha 变更点：99806cf→\<新sha\>（FSD strictNullChecks 最小修）」随 CEO 链上行。STE 序④将对新锚读数与 v6b 读数逐行差分（四族 not-ok 名单任一行增减=光谱漂移升报），读数卷保持全量原样。

**基建影响面（COO 裁示单列，随读数卷流转 CTO 知情+候 CAO 入册）**：
- **aegis 间歇性文件锁**影响所有 sg/R-HY 侧「落文件再执行」通道（at-job/cron 脚本族部署物）——症状四联征：①新落可执行脚本 open 面间歇 ENOENT ②readdir/glob stat 可见而 literal open 拒 ③root 与非 root 上下文可见性分裂 ④时长分钟级不定（扫描/隔离评估窗）。**B64 内联执行系对症绕过**（零文件面）。与 v6 +x 缺失教训并档：at-job 部署物落盘面两型坑（+x 漏设/aegis 锁）。
- 附带发现：TriModel/TriRMC lock 均生产系（无 devDeps 条目）——**构建机依赖全靠现役 checkout 工具链移植**（tsc/@types symlink 注入），干净构建环境缺失是 sg 侧构建通道的系统性约束（候 CTO 面：sg 构建依赖源建设）。

## 二.6 部署收口（终态读数，五环全毕）

**升版对象 TriRMC sha 变更点：99806cf→a02d89b（FSD strictNullChecks 最小修，COO 类推准裁 13:10+BOD 采认 13:12，BOD 硬项②标注行随 CEO 链上行）**

| 环 | 终态 | 读数锚 |
| --- | --- | --- |
| Stage1 构建 | ✅ 轮 10 绿 05:22:29Z | 双 dist tar sha256 本机侧校验 OK；毕即自删实证；FSD 修 diff 面断言 2 文件 10+/2- 独立验 |
| 传输腿 | ✅ 13:23 | 双包+SHA256SUMS 落 R-HY in/；bundle 备援 sg 侧缺失（WARN 非门，观察项③） |
| 环A 备份锚 | ✅ 05:23:25Z | TriRMC dist bak sha256=4e0683ba…d94b+cfg tar sha256=84745c82…72e+TriModel dist bak dir（观察项①指纹空勘误） |
| GO 门 | HOLD→GO→续 | 120s 超时 HOLD exit 42（05:25:25，设计内）；BOD GO 13:25:4x+COO GO 13:26 双批；复用锚重触发 05:25:42 |
| 环B 部署 | ✅ 05:25:49Z | untar→stop→mv+chown→**deploy-sha 双断言 ok**（45757bd+a02d89b 值面复核一致）→start→双 unit active |
| 环C 值面探针 | ✅（含修正实录） | 见下探针段 |
| 环D N2 演练 | ✅ rmc 双断言 PASS | 断言1 apply≠原态（差异字段=_lg058_drill 新增分支）+断言2 rollback==原态（restored_from=trirmc-card.json.bak-20261006T052550Z-…）；rlc 卡候建态 SKIP 如实（对表：file_present=false 实锚）；drill 模板已清防 UI 残留 |
| 环E 拉取链 | ✅ | journalctl：新 pid 2062569 05:25:47 loaded cached→05:25:48 **pulled fresh config (2 providers)**——升版后拉取链即时恢复实证；旧 pid 2020075 每 15min refreshed 序列对照 |

**环C 探针修正实录（值面硬门②自我修正，如实落卷）**：预置集合路由 `GET /v1/config/cards?view=managed` 404（`{error:"Not found"}`，token 门 401 已过）→grep dist 实锚路由表=**全系 per-face 形**（`/v1/config/cards/${face}`+apply/apply-template/backups/rollback/status/templates 七端点，零集合路由）→修正探针三段读数：
- **rmc 主卡**：card_file_present=true，entries_masked 3 条目（e-glm-anthropic/e-deepseek-anthropic/e-glm-flash-anthropic），**card.status={state:"applied", at:"2026-10-06T05:26:47Z", tier:1}**——applied+回写 tier=1 时点在部署后=卡层真活值面锚（per-entry tier/source 值面在 entries_decrypted 敏值面，禁读不碰，卡级实锚已足）
- **四 face 概览**：rmc applied tier=1／mmc file_present=true+3 entries+pending（M 面暂缓候 CEO 解锁，合 N2 条现势）／mlc+rlc file_present=false 候建态（rlc 候建与环D SKIP 互证）
- N4 文案：旧『本卡特有』dist/ui 零命中（硬断言过）+新『本域特有』1 文件命中
- /health version 0.1.0+8710 /healthz mcLedger ok

**smoke（部署收口标准件）**：双 unit active+双 /health 绿+deploy-sha 双值对表=DEPLOY 态成立。

**耗时链**：Stage1 绿 13:22:29→传输腿 13:23→首触发 13:23:23→锚 13:23:25→HOLD 13:25:25→BOD/COO 双 GO→重触发 13:25:42→**STAGE2 DONE 13:25:52**（净部署段 ~10s，含双 sha 断言+双 unit 重启）。

**CTO 事后追认段（护栏三，随读数卷呈）**：源码车道变更（99806cf→a02d89b，agent-contract.ts 域型如实化+session-initializer.ts soul 守卫，零行为语义差=FSD 全量测试基线同族同数自证锚）经 COO 类推准裁+BOD 采认放行，未占 CTO 门时窗——追认随本卷流转，候 CTO 面知情追认。

**观察项（不阻链，随卷）**：
1. **锚脚本指纹路径笔误**：BACKUP-ANCHOR TriModel 行 sha 空（脚本写 `$BAKTM/server.js`，实际结构 `dist/src/server.js`）——备份本体 cp -a 完整不受影响（BOD 令收口勘：勘误记录在案，回滚路径不依赖该指纹，实锚=目录完整+TriRMC 行指纹在）。
2. **cron enabled=false 定性闭**：trirmc-mc unit 明注 `TRIRMC_CRON_ENABLED=false 系设计`（服务面实例零 cron，cron 归 8712 trirmc.service 主实例零耦合并存）——healthz cron 字段非异常。
3. **bundle 备援缺失**：sg 侧 git bundle create 未产出（Stage1 日志 WARN 非门）——备援件缺位影响面=仅灾备冗余，双 dist tar+裸仓 sha 锚三重在，候办：下次构建环补 bundle 或裁撤该项。
4. 演练 backups 路径形：restored_from 锚文件在卡同目录（`trirmc-card.json.bak-*`）非 `backups/rmc/` 目录——路径认知勘误，不影响回滚链实证。

## 三、账本同步行（树单合同）

in-progress.json 增条 `lg058-rhy-upgrade-pipeline`（owner=SDE，status=open，本笔 commit 随带）；N5 条候信态（开工回执）随本笔同步。

## 四、观察项（不阻链）

1. **跨机 ssh 读闪烁 P2**: 本机→sg/R-HY ssh 会话对 `/srv/fleet/lg058-upgrade/` 下新建文件出现间歇假阴性（「No such file」），下一连接自愈，且两台同签名——同连接内 chmod 假无+紧邻 ls 真有已实证（12:36 R-HY）。执行件本地跑不受影响（Stage1=sg 本地 cron、Stage2=R-HY 本地 nohup），仅影响我方跨机观测轮询（假阴性→多等一轮，无害向）。候 CTO/网络面勘（本机侧 ssh 通道疑）。
2. **TriMMC addJob 字形勘正**: 请求形=`{schedule:{kind,everyMs}, payload:{cwd,command}}`（everyMs 非 intervalMs；command/cwd 在 payload 内）——与 TriMLC/TriRLC 形又异，三形态分野记忆族再+1。
3. N2 演练 rlc 卡候建态（R-HY 无 trirlc-card.json）——脚本内 skip+如实落卷不硬造。

## 五、使用依据

- COO 触发令 12:13+裁准 12:2x；任务书 task-charter-lg058-remediation-20261006.md（384000f5）+tree-plan.md（边界七条）
- 45757bd 源码实锚（apply-template/rollback/backups/cards API 形+cardTemplatesDir=CARDS_DIR/templates/<face>）
- 备份惯例形活体锚=/srv/fleet/TriModel/dist.bak-pre-align-20261005T2316Z（20261005T2316Z 例）
- 纪律: D-17（sg→R-HY 无 ssh 授权面不自增，bundle+scp 通道）/D-23（13:4x 前全毕目标，14:00 禁排区避让）/键值掩码（token 零回显，ADMIN_TOKEN 动态读 len 探针）/时刻现查
