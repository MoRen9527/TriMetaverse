# T3 技术方案卷·13 席 preset 移植 headless profile（BOD 144②·CEO 开工令·FD 主刀·候 CTO 门禁）

- 执行: m-duty-fsd（CTO/FSD 域·任务书 T3 行）；令面=BOD 144②（T4 开工条件=T2+T3 毕·T3 为缺口·T3 先行即启）
- 状态: **拟形候 CTO 门禁对表绿→编码**（河源勘定前置窗请求随卷）
- 现查: 2026-11-17T04:1xZ（写前现查·D-47）

## §一 · 现势实锚（写前勘定五面）

1. **T3 开工条件达成**: T0 六读数经施工线实质全勘明 ✓（值席勘实·转达令面）——session-bridge 面（T2 毕）/preset 现状/dsh 可达性（0.2.0-rc.2 活体）/sessions 面（r-duty-* 族在）/桥工具面现状/代理凭据面（T1b 毕）
2. **13 席 preset 发布物现役实锚（W45 谱系）**: web profile patch=**4681 行·头部注记「转译器生成 13 席 preset 发布物（禁人工编辑·修订走源侧合同）」**——preset 段 provider 键=spawn/fork/codex/claude-code 系（工具 subagent 面·非 LLM provider）；**headless patch=空 []**（4 行纯骨架·W45 patch 直读实锚）
3. **转译器本体=河源 face 资产（机位如实·D-24）**: sg 三面（TriRMC/TriCompany/proto）grep 零命中——转译器重跑面=河源勘定前置窗（值席/BOD SSH 链）；**web patch 零触**（发布物禁人工编辑——headless patch=新产件非编辑 web patch）
4. **T4 桥 HTTP API 面现成**: dsh-gateway-client.mjs（TriRMC scripts·web 8791 gateway·createSession({cwd, sessionId, agentPreset})·A2 面现役）——T3 的 preset+UUID 寻址=T4 桥工具面消费前置
5. **⚠️ runner required-services 缺机理勘明（FSD 定谳输入·承 SDE profile 三勘挂账卷 §三.1 候裁面）**: headless runner 自身 run() **首行 `await ctx.get("loader")?.await()`**（rc.2 工件码实锚）后取 agents/agentDefaultModel/sessions——fsd-adopt-runner 缺此行→loader 完成前取服务=absent（三 profile 全缺同款机理）——**修面=apply 首行加 loader await（一行面）**→v3 复验线+T4 线共用输入（随卷并勘候令·TriModel 单笔）

## §二 · T3 拆解（三件·机位路由分工）

### T3-a 转译器勘定+重跑（河源勘定前置窗·值席/SSH 链）

- 勘定四读数: ①translator 本体位置+运行形（河源 face 资产）②输入源形（源侧合同面=TriCompany 13 席定义？）③web patch preset 段 dump（13 席 preset entries 实锚·patch 直读窗）④重跑目标形（translator 是否支持 --profile headless 目标参数/或输出后置 transpose）
- 重跑产出=headless patch 生成物（13 席 preset entries）——或替代案（T3-b 生成器）承做
- **请求面**: 勘定窗四读数回卷（值席/SSH 链·read-only——web patch 零写）

### T3-b acp/headless patch 从空落实（sg 面施工件·FSD 主刀）

- 产件=**transplant 生成器**（仓归属=CTO 对表点·候选 TriRMC tools/ 或 TriCompany scripts/ops/local/presets 邻位）: input=web patch preset 段 dump（T3-a ③）或 translator 直出→output=headless cordis.patch.yml（13 席 preset entries·**零注释形**（BOD 135 修②教训遵行）·patch 条目 schema=W45 §二 三键正形+dump-config-schema 实勘面）
- acp patch 同形并勘（任务书面 acp/headless 双落点·acp=轻形不齐实锚在卷——落实范围候 CTO 裁·缺省 headless 先行）
- 落实窗=河源部署窗（值席/SSH 链）: 落实前置=**13 席 preset 现役 dump 留档**（headless patch 空 [] 4 行+web patch 4681 行卷面留档·charter §四护栏 2）→写 headless patch→`dsh --dump-config --profile headless` 值面勘
- 降权链勘（charter 验收门 4③）: preset entries 生成时 sandbox/approval 面=非 danger-full-access 值面自检（生成器断言面）

### T3-c UUID 寻址注册+employee-registry 承接（sg 面施工件·FSD 主刀）

- 注册表 schema: `r-duty-<seat> ↔ session-uuid ↔ employeeId`（三键映射 JSON·TriRMC 桥/T4 消费形）
- 生成器: 扫河源 `~/.dsh/sessions` 面（session 文件 id 读·listAgents 现役扫描形复用 8252d9f 谱系）→映射固化 JSON——UUID 面=河源实勘窗（session 文件内 id 形勘定·T0 ④ 深化读数）
- employee-registry 承接: TriCompany source-agents 13 席清单（正名+别名面）→注册表 employeeId 键位校验面（生成器断言 13 席齐——charter 验收门「13 席齐」）
- 落位: 仓归属随 T3-b 对表点·产物 JSON=桥面配置（T4 消费）

## §三 · 工序（候 CTO 门禁绿即启）

1. sg 面件: T3-b 生成器+T3-c 注册表机制+白盒族（生成器 schema 断言/13 席齐断言/零注释断言/降权值面断言/UUID 三键映射面）——TriCompany/TriRMC 各单笔 commit revert 一键形
2. 河源勘定窗（并行）: T3-a 四读数+UUID 面实勘（值席/SSH 链·read-only）
3. patch 稿生成: dump 输入→headless patch 落实稿（13 席·零注释·降权自检）
4. 落实窗: dump 留档→写 patch→dump-config 值面勘（charter 验收门 4 全项）
5. 毕报双通道（落卷+SendMessage 值席→BOD）+notice-115 解锁读数随督办线（charter 关联注记承面）→T4 依序接

## §四 · 护栏（charter §四 承+增）

1. charter 触面限定照走: 13 席 preset 面+桥工具面域——零触 TriRMC 现役 loop 链与 fade-001 线/零触旧形链三跑接力/零触 sg 现役资产/零 daemon 重启除非正形链
2. **web patch 零触**（转译器发布物禁人工编辑——headless=新产件）；headless patch 现役 dump 留档前置
3. dsh 侧零写面: 零删 sessions 目录持久态（charter §四护栏 2）；patch 落实=值面追加零删改
4. 零回归护栏七条（方案卷 §五）+单笔 revert+D-46 值面纪律照走

## §五 · 使用依据

BOD 144②（CEO 开工令·值席转达）；任务书 T3/T4 行+§四护栏（coo-task-charter-draft）；W45 dsh-glm-switch 谱系（web patch 4681 行/headless 空行/schema 三键正形实锚）；SDE profile 三勘挂账卷+loader await 机理勘定（本卷 §一.5）；dsh-gateway-client.mjs（T4 桥面现役）；T2 收口定谳卷+session-bridge 8252d9f 谱系；D-24 机位路由
