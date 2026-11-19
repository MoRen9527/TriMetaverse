# FSD W2-b wake 端点施工毕报卷（8713 TriMLC·骨架+接线口·白盒 15/15+构建绿）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W2-b 毕报正身；快轨正身=毕报信）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·W2-b 主刀）
- 落款: 2026-11-19T17:54:09Z（+8=2026-11-20 01:54:09·date 现查原值粘贴）
- 法源链: BOD W2 托转令（2026-11-20 01:40+08）→CEO 01:28 批准线（notice-237 款二）→COS 拆树派工卷（§二 W2-b）→COS deadline 确认知会（09:00 全 Plan 含 A 线·快毕节律）
- 施工锚: **TriMLC d7eabb3**（2 files +392·src/server/app.ts+test/server/wake-endpoint.test.ts·零卷入）+**改名件 f0f22c6**（§五·COS D-39 径裁随件·端点终名 seat-wake）

## §〇 · 实现方案（先勘后抄禁自造形遵行）

鉴权面**零新增**——现役全局安全门（P0 加固 p0fix3-trilc-http）顺序契约原样覆盖：
`/healthz 精确豁免 → Host/Origin 白名单 403 → X-Internal-Token 401（fail-closed 全拒形·TRILC_INTERNAL_TOKEN 请求期直读）→ 其余路由`——新路由置于门后即自动受门（现役 15 案鉴权门套件零改动全绿=覆盖实证）。路由注册照现役线性分支形（`req.url==='…' && req.method==='POST'`）·body 读取照 fade/runs 例形（chunks→concat→JSON.parse）·响应 object 命名照现役族（`object:'wake'`）。

**撞词消歧注**（码注在卷）：与 heartbeat-wake（`this.wake` 心跳唤醒模块·CTO-008-M Phase 1）无关联——本端点=BOD 实时收件链推唤信号消费口。

## §一 · 代码变更（TriMLC d7eabb3）

1. **模块级 wake 接线口**（app.ts helper 区）：`WakeActionPayload/WakeActionResult` 类型+`setWakeActionHandler/clearWakeActionHandler/isWakeActionWired` 三导出——**接线面候 W2-a 形定卷在树后由接线施工填**（本文件只留可插接口位·骨架期 handler=null）。
2. **POST /internal/v1/wake 路由**（power 段后·init 段前）：body 形检三案（坏 JSON=400 invalid_json_body/非 object=400 payload_must_be_object/source·reason 非串=400 source·reason_must_be_string）+**骨架未接线态 200 `{object:'wake',accepted:false,wired:false,reason:'wake_action_not_wired'}`**（端点可用可探·值面完工判据形）+接线后 handler 结果透传（`accepted:true,wired:true,...result`）+handler 抛错 500 wake_action_failed。
3. **测试新件**（test/server/wake-endpoint.test.ts·15 案）：3 单元（接线口 set/clear/isWired/重注册语义）+12 端到端（照 auth-gate-rejection.test.ts 起服配方：临时数据目录+port 0+死端口降级+node:http 裸请求）。

## §二 · 自测结果（W2-c 自测部分·门禁候 m-cto）

| 门 | 读数 |
|---|---|
| wake 单件白盒 | **15/15 pass**（正向 2·负向 3〔无 token 401/伪 token 401/未配置 401 internal_auth_disabled〕·形检 3·方法错 1·接线 2〔透传+500 形〕·现役族不损 1·单元 3） |
| 现役端点族不损 | healthz 200+cron jobs 200（ok:true+jobs 数组）+power 200+config show 200 同拍全绿（e12 案） |
| tsc check / build | **RC=0 / RC=0**（dist/server/app.js 286132 bytes 01:52 新鲜产物·W2-d 重启前加载面就绪） |
| 全量回归 | **816 pass / 5 fail**=基线同族既有零漂（基线 801+15 新案=816 数学闭合·既有 5 fail 族名独立验同谱：replay-flow / auth-gate e1-healthz 族 / FADE-ASSESS-005×2 / tui components——本件零接触·基线 8fa3b97 提交载录逐字对表） |

## §三 · 骨架期边界与候接线面

1. **接线面候 W2-a**：handler 位空置（wake_action_not_wired 形可探）——m-cto W2-a 形定卷（通道形+鉴权映射形+sg 侧需求清单）在树后接线施工填 handler（本文件 setWakeActionHandler 调用位+或独立接线模块）·W3 会话唤醒接线段消费。
2. **请求契约骨架期宽松**：source/reason 可选 string·未知字段容忍（W2-a 形定后如需收紧只动形检段零触门族）。
3. **勿越面遵行**：channel.cmd/重启面（W2-d=m-sde）/通道形勘定（W2-a=m-cto）零触——本件纯 TriMLC 源码域。

## §四 · 技术债务标记

1. 骨架未接线态=端点可用但动作空转（设计使然非缺陷·W2-a/W3 链在途）。
2. 既有 5 fail（基线族）非本件域——如实转报不修（候 CTO 域勘修窗裁量）。
3. `TRILC_INTERNAL_TOKEN` 键名=TriLC 遗留形（实勘照抄·与 TriMMC TRIMC_INTERNAL_TOKEN 键族分立）——改名属破坏性变更候远期面（现役读侧写侧同键自洽非债务）。

## §五 · 改名令遵行段（wake→seat-wake·COS D-39 径裁随件·TriMLC f0f22c6）

- 法源链: W2-a 勘定卷（cto-w2a-channel-survey-20261120.md·52ce83db6）§二②重大消歧→CTO 建议 seat-wake→COS 径裁采纳改名令→随件补注（reason 字面值形态由施工席自裁·唯一硬要求=本卷未接线态 reason 终态字面值面如实载明）。COS 定性=平行施工时差落了裸名·非缺陷非返工——本席首勘只勘到 heartbeat-wake 模块撞词（已码注）·漏 healthz/power 面 wake 字段族（lastWakeSeenAt/lastHandledWakeAt/wakePollFailures/lastWakeReport=电源面睡眠唤醒语义在役）真撞名——CTO 勘得更全·采认。
- 施工三件（改名令①②③全毕）：
  1. **端点路由改名**：`POST /internal/v1/wake`→`POST /internal/v1/seat-wake`——app.ts 3 处+测试件 13 处·全引用面同步·**裸名端点引用零残留断言 ✓**（grep `/internal/v1/wake`（非 seat 前缀）TriMLC 源码域零命中）；消歧注增补双族（heartbeat-wake 模块+healthz/power 字段族·W2-a 卷锚）。
  2. **白盒 15 案更新+复跑**：测试件 git mv→`seat-wake-endpoint.test.ts`（91% 相似 RM 形）·13 处路径+案名中文全同步（案名残留零）——**复跑 15/15 全绿 ✓**。
  3. **build 复验+commit**：tsc check RC=0+build RC=0（dist/server/app.js 286142 bytes 01:58 产物·W2-d 加载面就绪）+**TriMLC f0f22c6**（2 files +24/-20·git mv 零卷入）。
- **★未接线态 reason 终态字面值面（W2-c 门禁+W2-d 值面探针对表锚·m-cos 补注硬要求载明）**：
  - **reason 终态字面=`wake_action_not_wired` 照旧不改**——自裁依据=改名令原文「其余零变……accepted:false wake_action_not_wired 未接线值面照旧」明文遵行；接线状态语义（wired/reason=handler 在位面）与端点路径名不同层·路径改名不牵引值面字面。
  - 终态探针样例（改名后·供 W2-d 探针防硬编码漂移假失败）：
    `POST /internal/v1/seat-wake`（头 X-Internal-Token 合法）body `{}` → `200 {object:'wake', accepted:false, wired:false, reason:'wake_action_not_wired'}`——码面（app.ts 未接线分支）与测试面（e1/e2 deepEqual 断言）字面逐字一致已 grep 断言 ✓。
- 复验补录：server 套件快验 141 pass/3 fail——3 fail 逐案归因=auth-gate e1-healthz 端到端族 1+FADE-ASSESS-005 派工门禁 2——**全为基线既有族同谱**（§二全量 5 fail 基线的 server 目录子集·族名实读非转抄）·零新增零漂。

## 使用依据

- COS 拆树派工卷（§二 W2-b/§三护栏）+BOD 托转令四点+COS deadline 确认知会
- 现役形实勘四段：app.ts L1884-1921（全局门顺序契约+fail-closed 形）/L1928-1975（config 族路由例）/L1975-2020（fade/runs body 读取例）/test/server/auth-gate-rejection.test.ts（15 案鉴权门套件+起服配方参照）
- 基线读数：TriMLC 8fa3b97 提交信息（801 pass/5 fail 基线载录）

—— FSD 小全（m-fsd）·2026-11-19T17:54:09Z（+8=2026-11-20 01:54:09·date 现查原值·D-47 正形）·§五增补 2026-11-19T18:02Z（+8=2026-11-20 02:02·date 现查原值·D-47 正形）
