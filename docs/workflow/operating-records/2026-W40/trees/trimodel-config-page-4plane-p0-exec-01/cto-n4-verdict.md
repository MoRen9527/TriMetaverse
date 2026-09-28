# CTO 裁认·FSD N4（CLI config 族）实现路径+观察项 a

- sourceOfTruth: 本件（N4 裁认正身；D-15 枢纽裁定留痕）
- syncMode: final
- lastSyncedAt: 2026-09-28 16:4x +0800（date 现查 16:39 hook 链）
- 实勘基线: TriRLC c7414e3 diff（cli.ts +108/key-cache.ts +197/app.ts +49/测试 +204）+ app.ts 全局门段 L1776-1830 本席现勘

## 一、实现路径裁认：**采认（CLI→daemon 内五端点触发形态）**

- **技术必然性成立**：「即时生效」（refreshNow=daemon 进程内 key-cache 内存态刷新+env apply）与 cache clear（清内存态+盘上文件）语义本体要求 daemon 内执行——CLI 独立进程触达不了 daemon 运行态，方案 §5.1「即时生效」「清=强制回梯验证」在 CLI 进程形态下不成立。FSD 路径=语义忠实的唯一实现形态。
- **daemon 视角更准**：`config show` 语义=「本域面现效配置+来源归因」——真值是 daemon 进程内解析态（含内存 cache 归因）；CLI 进程自解析反而可能偏离 daemon 实际生效态。daemon 内实现非妥协系语义精化。
- **§5.2 语义保全实勘**：CLI 经 `/internal/v1/config/*` 触达与 daemon 内部同一实现函数——「同一能力面两个消费端」成立；app.ts 注记明示「CLI 不开写面（§5.2 差异①），本组零卡写端点」✓（G7 关键断言在卷）。
- **安全门覆盖实勘**：五端点注册于全局安全门之后（L1776 门段：/healthz 精确豁免→Host 白名单 403→Origin 403→X-Internal-Token 401 fail-closed 含 timingSafe 比较+请求期读 token→L1819+ 路由）=门内保护 ✓；CLI configRequest 带 `x-internal-token`（TRILC_INTERNAL_TOKEN env）+未配置显式报错指引（fail-closed 双向）=门契约完整。
- **形态差记档（不回改冻结方案）**：方案 §5.1「对应 API」列=TriModel 服务端 API 面；实现链路=CLI→daemon `/internal/v1/config/*`→daemon 内实现→（pull 时）TriModel `cards/{face}`——多一跳、语义同源零冲突。本记档随门审卷存证，方案正文不动。

## 二、观察 a（cronRequest 未带 token）：**本单不修，记候修清单**

- **缺口实锤+根因定性**：P0 全局门（p0fix3 PD-1）无条件覆盖全部 `/internal/*` 路由，cronRequest 未带 token=401——族外既有缺口（门引入时 cron CLI 面未跟上），非本单引入。`trilc cron add/list/run` 当前全 401 不可用。
- **运维不受阻**：LG-056/057 落位走直接 HTTP+launcher env 先例在役（白名单门 SDE 读数在卷），cron CLI 缺口不阻在役作业。
- **不修理由**：修法有独立设计判断——token 源三择（launcher env 传递/HKCU 注册表/`--token` 参数），而 LG-056 勘验实录「HKCU 注册表值与运行时不一致（D-03 env 快照活例），真值以 launcher 为准」=CLI 拿可靠 token 源系独立小题，不宜执行单顺手带过。
- **归属**：候修清单挂账（与 daemon 运维面改善族并批或独立小窗）；修复时顺带断言 cron CLI 全命令族过门回归（add/list/run+白名单门联动）。
- **本单验收不受影响**：config 族带 token 完整；A4 对表面=config 族四命令，cron CLI 非对表格。

## 三、知悉项

- STE 预注采认：N4 单测=4 it/仓（refreshNow/describeConfig/verifyPull/clearKeyCache 各一），「5」系转写误差，读数以 STE 本报为准（+10/仓=4 单测+6 HTTP 案，全量算术吻合：TriRLC 662/657/5/0、TriMLC 617/612/5/0，既有四族零新增）。
- 观察 b（bin 挂族=STE 缝隙⑤部署面）知悉——归 N5/部署窗交付面，本裁不涉。
- 双仓镜像（TriMLC 03bae30+6e4feb3）commit 结构同构，正式门审时并入 G9 diff 断言面。

## 使用依据

FSD N4 报告（16:37:50 COO 转达）；TriRLC c7414e3/TriMLC 03bae30 diff 实勘；app.ts 全局门段位置序实勘；方案 v3 §5.1/§5.2；LG-056 门审笔（D-03 env 快照活例/launcher 真值实录）；COO 附注读数。
