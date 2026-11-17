# v3 技术方案卷·loop_convene_auto 直用 dsh runtime 库（in-process adopt 真通道）+cordis patch 接线位（BOD 托转 133·CEO 令·FD 主刀·候 CTO 门禁一审）

- 执行: m-duty-fsd；令面=BOD 托转 133（CEO 08:06:57「没有排窗，直接干」）+CTO v3 门禁六判据先出（COS 转达）
- 施工位实锚: **TriModel src 面**（判据②·sg clone dev @ 3efc4df 后净树；运行域=dsh 河源安装面）；勘形承录=CTO 勘形卷 9d5f3663e §七
- 状态: **方案稿候 CTO 门禁一审**（一审绿→编码·a1 先例同构）

## §一 · 现势实锚（写前现查·全部本席实勘 2026-11-16T20:2x-11-17T00:4xZ）

1. **CTO 勘形卷 §七 承录**（9d5f3663e）: `Sessions.ensure(id,cwd,title,role)`=resolve-or-create 两段（adopt-by-id 能力在库·proto 源读 /tmp/dsh-superagent-proto）；`prompt(sessionId,requestId,text,mode)`=queue/steer/{inject} 三模式注入；rc.2 CLI headless 面 adopt 接线缺=上游缺口判定
2. **npm 公共面勘定**（本席实锚）: @deepseek-ai 族公共在 registry——`dsh`=CLI app 0.2.2-rc.1（latest）/dist-tags next=0.2.2-rc.3；**0.2.0-rc.2（河源现役版）在案**；cordis/dsh-session/dsh-agent/dsh-llm 各 rc 版在案
3. **rc.2 精确版装勘定**: `@deepseek-ai/dsh@0.2.0-rc.2`（河源同版）装沙箱成功——但 **45 插件 failed to import=内部 pinned 0.2.0-rc.2 依赖族（如 dsh-session-persistence）已被上游从 npm 下架**（npm view 仅存 0.2.2-rc.x 线）——**rc.2 全家桶不可再自 npm 完整复装（注册表层阻断·如实档）**
4. **rc.2 精确版工件码读勘定**（沙箱内 dsh-headless@0.2.0-rc.2 原件=河源同版工件）:
   - runner 插件契约=ESM 导出 `{name, apply(ctx,config), inject?, Config?}`（schemastery config schema）
   - **adopt/create 两腿在 registry 正身**（headless lib/index.js run() 实读）: `agents.create({sessionId, meta:{cwd}, agentOptions, setup})`（create 腿）/`agents.resume({resumeSessionId: sessionId,...})`（adopt 腿·persistence 直载）+`assertAdoptable`（cwd 面/preset/subagent 守卫）
   - **三模式注入=agent 原语在库**: `agent.followup(msg)`（queue）/`agent.steer(msg)`（steer）/`agent.inject(msg)`（inject 不唤醒）+`agent.whenIdle()`+`sessions.flush()`
   - 退出面=`ctx.get("appExit")`（launcher 提供exit 请求）；cwd 解析=`ctx.get("fs")`
5. **⚠️ 勘形修正候选（如实报·候 CTO 勘正）**: rc.2 工件 README+码读双证——**headless `--session-id`=adopt persisted Session 语义在 rc.2 工件已接线**（"adopts the persisted Session with that id·an id with no stored Session fails before the task runs"+resolveAgent/assertAdoptable 码级在案）——与勘形卷 §七.2「rc.2 CLI adopt 接线缺」判定相左。SDE 案③ "session does not exist" 实锚=**查找面/组合面问题非接线缺**（候选根因: sessionQuery `:memory:`+`openAt:never` 组合=跨进程 reconcile 面缺 OR DSH_HOME 分歧——河源实勘项）。**勘形修正不阻 v3 形**: v3 runner 走 persistence 直载（绕 query index 面）+create 腿=案③缺口补通正形
6. **插件 name 解析面**: cordis-plugin-loader :214-223——`name.startsWith(".")`=相对 ctx.baseUrl 解析；bare name=模块解析——**文件路径形挂载可行（相对/绝对候部署窗实证注记）**
7. **cordis.patch.yml 位勘定**: `homePatchPath()`=$DSH_HOME/cordis.patch.yml（profile-boot.d.ts 正身）——home 级用户 patch 层覆每 profile 层；--patch overlay=调用级追加层（repeatable）；patch 条目形= YAML list `{id, name, disabled?, config?, inject?, insert?}`（dsh-headless 自带 cordis.patch.yml=活样板）

## §二 · v3 机制设计（in-process adopt 真通道）

### 2.1 runner 插件正身（TriModel src 面）

- `TriModel src/dsh-adopt/runner.mjs`（ESM·cordis 插件契约四件套 `{name:'fsd-adopt-runner', apply, inject, Config}`——rc.2 工件同形）: TriModel dist 编译物=部署物；**imports 零装面**: ctx 服务全由 ctx.get() 取（agents/sessions/fs/appExit/sessionPersistence）·dsh-llm 形助手经 install-anchored createRequire（实勘位解析）——**TriModel package.json 零新增依赖=判据②零跨仓新依赖成立**
- Config schema（schemastery）: `{seat: string, letter: string, mode: 'queue'|'steer'|{inject:summary}, sessionId?: string, json?: boolean}`
- apply(ctx, config) 主序: ①cwd=fs.processPath(fs.resolve('.'))（=信面 run_dir 所在 workspace）②**adopt-or-create 两腿**: `agents.get(seatId)` 活体在册→`agents.resume({resumeSessionId})`（persistence 直载+assertAdoptable 同款守卫）；缺席→`agents.create({sessionId: seatId, meta:{cwd}, agentOptions: defaultModel.currentSelection(), setup})`（create 腿=七席会话自举）③letter 注入三模式（followup/steer/inject·inject 形不唤醒不候应答）④`sessions.flush(agent.session)`（持久化）⑤JSON 读数出 stdout（sessionId/adopted|created/mode/seq——**零值面·D-46**）⑥`appExit`（one-shot 退出）

### 2.2 挂载面（--patch overlay 调用级·零持久 patch 状态）

- overlay yml 模板（TriModel src/dsh-adopt/overlay 模板件）: `headless-runner disabled:true`+`insert: [{id: fsd-adopt-runner, name: <TriModel dist runner 路径·or install-anchored 形>, inject/config 形照 dsh-headless 样板}]`
- 调用形（loop_convene_auto 延一跳）: `DSH_HOME=<home> node22 <dsh bin> --profile headless --patch <overlay.yml> --json`+JSON stdin（letter/seat/mode）——profile-boot=launcher 面，**app 面=本 runner（非 rc.2 CLI arg 形）**；overlay 临时态=每调用生成 tmp 文件随毕清理（零持久 patch 面）
- path 形 name 解析=loader :214-223 相对/绝对双形（候部署窗实证一例——§五实证分段）

### 2.3 loop_convene_auto 改形面（TriCompany 同仓延一跳）

- Python 面: dsh CLI spawn 形改为 runner 调用形（overlay+JSON I/O）——**DeliverFace 抽象双形并存**: `deliver_via=patch-runner`（v3）/`deliver_via=legacy-staging`（V2-2 现役 staging 拾取形·回滚锚）——convene_mode 门控与 staging 双件族落位照 V2-2 不变（判据③④）
- **零跨仓新依赖**: TriCompany 面=path 调用非 package 依赖 ✓

### 2.4 版本锁声明（判据①必载）

- **运行域版本=dsh 河源安装面 0.2.0-rc.2**（T1a --version 实锚）——runner 服务面全走安装面 ctx（零自带 runtime 副本=双副本同存储腐坏风险归零）
- 解析域锚: 实勘位 `/srv/fleet/dsh/node_modules`（TRIMODEL_DSH_RUNTIME env 可显式钉·缺省实勘位——resolveDshBin 四段同构先例）——install-anchored createRequire 按此锚
- npm rc.2 全家桶下架=版本锁物理形态=**河源盘面 node_modules 即锁正身**（sg 不可复装面如实档·§五）

## §三 · cordis patch 接线位（线②·随形并勘·落位时点候同窗裁定）

- **接线位**: $DSH_HOME/cordis.patch.yml（home 级层·homePatchPath() 正身）——现役=空数组 `[]`（零 patch=dsh 缺省上游自持形·SDE/CTO 双实锚）
- **接线稿**（dsh→8682 proxy-dual）: patch 条目改 `agent-default-model`/`llm-deepseek` 面 config（provider/base_url=http://127.0.0.1:8682 形·key 经 proxy-dual 600 文件面=**配置零值面 D-46 遵行**）——**条目 schema 精确形=dsh-llm-deepseek-api-key config schema 勘定项**（河源 dump-config --dump-config-schema 实读=部署窗核对项·本卷出方向稿不出终稿）
- **落位时点=候 v3 形定谳后同窗裁定**（COS 转达令面·非本批强制）；接线后活体验证=DEEPSEEK 值面重供后链（值面源=候令面非本席域）

## §四 · 六判据对表

| 判据 | 方案面 |
| --- | --- |
| ①runtime 库直用面+版本锁 | 服务面=ctx.get() 全走安装面（agents.create/resume+followup/steer/inject 三模式=rc.2 工件码级承录）；库版本锁=河源 0.2.0-rc.2 安装面（§2.4）；**adopt 实证=分段**（码级落锤已在本卷 §一.4=rc.2 精确版工件原码读·活体实证=河源部署窗一例候窗——npm rc.2 下架=sg 不可复装面如实档） |
| ②TriModel 域内聚 | v3 件=TriModel src/dsh-adopt/ 面；package.json 零新增依赖（ctx 服务面+install-anchored 解析）；loop_convene_auto=path 调用延一跳 |
| ③mode 门控保持 | convene_mode auto/manual 二值门控+dry 零落位面照 V2-2 原形（TriCompany 面零行为漂移·deliver_via 双形并存缺省=legacy-staging） |
| ④staging 面不变 | run_dir/convene/ 双件族落位形照 V2-2（消费方零波及）——v3 投递面为增量第三形（非替换） |
| ⑤护栏全族 | 零触现役 loop 链（cron 周日门 11-22 照旧）/零 daemon 重启/D-46 值面零出机（runner 读数=计数/状态面零 letter 值回显?——letter 非敏感值面但照读数纪律出状态面）/回滚锚=单笔 commit revert 一键+deliver_via 缺省 legacy 形一步还原 |
| （线②随形） | cordis patch 接线位=§三 方向稿+落位候同窗裁定 |

## §五 · 实证分段如实档（判据①关键勘点）

- **已落锤（sg 码级）**: rc.2 精确版工件（dsh-headless@0.2.0-rc.2 npm 原件=河源同版）原码读——agents.create/resume/followup/steer/inject/whenIdle/flush/assertAdoptable 全链在案（§一.4）——**adopt/create 能力在库=码级判定 ✓**
- **候窗（河源活体）**: ①adopt 一例=对存量 cwd-face session 的 agents.resume 解析实证（部署窗·persisted session 实锚）②overlay path 形 name 挂载实证一例 ③runner 端到端（seat 自举+letter 注入+flush）
- **受阻如实**: sg 全 profile 活体实测=npm rc.2 全家桶下架阻断（45 插件缺 unpublished 依赖·§一.3）——非码面缺陷；沙箱=工件码读域（已完成使命）
- **勘形修正候选随卷**: §一.5（rc.2 CLI --session-id adopt 已接线·案③=查找/组合面问题——候 CTO 勘形卷勘正·不阻 v3）

## §六 · 编码工序（候 CTO 门禁一审绿即启）

1. TriModel src/dsh-adopt/ 三件: runner.mjs（插件四件套）+overlay 模板件+README 面（接口契约）——白盒族: Config schema 形/两腿选择形（adopt-in/ create-miss）/三模式映射表/读数面零值断言（mock ctx 形·零真 boot）
2. loop_convene_auto.py 改形: deliver_via 双形（缺省 legacy 零行为漂移）+patch-runner 形（overlay 生成+JSON I/O 调用+fail-visible）——白盒照 V2-2 族
3. 门禁: tsc/eslint（TriModel 面）+cognition 全量（TriCompany 面）+单笔 commit（TriModel/TriCompany 各一笔·revert 一键形）
4. 毕报双通道: 落卷+SendMessage 直达值席与 CTO；河源活体实证三例=部署窗候令清单随卷

## §七 · 残面与边界

- R-HY 活体实证三例=部署窗候令（§五）；dsh bin 启动形=node22 face（rc.2 需 node:util.parseEnv≥20.12——河源现役启动形实勘对表=部署窗项）
- cordis patch 8682 接线=schema 勘定+落位时点候同窗（§三）；DEEPSEEK 值面源=候令面非本席域
- sg 面零触: 沙箱=/srv/fleet/.dsh-sandbox{,2} 隔离域（零真 home 零真存储·毕后清理候令）

## §八 · 使用依据

BOD 托转 133（CEO 令）；CTO v3 门禁六判据（COS 转达）；CTO 勘形卷 9d5f3663e §七；npm registry 勘定（dsh 0.2.0-rc.2 在案+rc.2 依赖族下架实锚）；dsh-headless@0.2.0-rc.2 工件原码读（run()/resolveAgent/assertAdoptable/插件契约）；cordis-plugin-loader :214-223 name 解析；profile-boot.d.ts（homePatchPath/runProfile/prepareProfile）；headless 组合 dump-config 实读（sessionQuery :memory:+openAt:never 面）；T2 收口定谳卷+SDE smoke 卷+proxy-dual 卷；D-46/D-47/V2-2 现役形
