# STE 测试方案·P1 期（TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P1-EXEC-01·测试族+三仓全量读数）

- sourceOfTruth: 本件=STE P1 测试规划正身（承接 COO 拆派 wt/board 231fca65/CEO 02:10 显式令）
- syncMode: static
- lastSyncedAt: 2026-09-28T18:2xZ（date 现查=2026-09-29 02:2x +0800）
- 施工席: STE 小柯（m-ste）；对表基座=P1 执行单 §一范围六项/§二验收锚 A1-A6/CTO 件 §六迁移五步+§6.3

## 一、测试范围（COO 拆派三块+A6 锚展开为五族）

| 族 | 对范围/A 锚 | 性质 | 可启时点 |
|---|---|---|---|
| T-sg | 范围1/A5 前半：sg TriMMC tier1 接入活体 | 活体只读检视 | 规划即日；活体候 FSD sg 面落位 |
| T-fb | 范围4/A5 后半：降级梯四面检视（cache show 四面） | 活体只读+L1 | 规划即日；活体候落位 |
| T-mig | 范围3/A1-A4：R-HY rmc 卡迁移切换后验证族 | 切换后验证（写面非本席） | 规划即日；预检对表可先行；切换后验证候 CTO 门审过+CEO 知悉窗 |
| T-fix | 范围6/A6 前半：P0 候修三项随批验证 | L1+文档面 | ①案即日可预置；②案候 CTO 裁 |
| T-reg | A6 锚：三仓全量读数（三仓零新增） | 全量回归 | 候 FSD 实现落位（P0 终态=新基线） |

## 二、T-sg：sg TriMMC tier1 接入活体（A5 前半）

前置：sg 面=FSD 落位后；通道=跨机路由 M 面（SSH sg-server/值席通道，D-24 机位断言先行）。本席只读检视，禁生产写面。

- **S1** sg TriMMC `config show` 来源归因=card（tier1 卡接入后）：读数=归因字段+date 现查留痕；判据=归因 card 且卡面语义 mmc。
- **S2** sg 侧 tier1 卡缺席态：`config show` 走降级路径不炸（连接 L3 环境四态对表）；判据=报错人话+归因≠card。
- **S3** sg dotenv 缺陷观察档随接入复核：接入前后现值对比读数（观察档在卷，非阻塞面）；判据=缺陷形态消失或观察档更新，不即断言。
- **S4** sg 面审计行活体：tier1 拉取在 face-events（sg 侧落点）留痕（len-only 值面照旧）；判据=pull 事件+result=ok。

## 三、T-fb：降级梯四面检视（A5 后半，§4.3 裁决落地）

四面=mmc/mlc/rmc/rlc；每面三态链=card 正常→拉取失败→最近已知好配置→本地直连。

- **F1-F4** 四面各一案：`cache show` 三态读数（来源归因字段）。判据=每面归因链与 §4.3 层级一致（card > last-known-good > local direct）。
- **F5** 层级合并 env 逃生门：env 置位态走读+活体一态（候落位形态定）；判据=逃生门生效路径与 §4.3 裁决文一致。
- **F6** 降级触发真实性：拉取失败注入面（候 FSD 实现形态——若无可注入缝，则以卡缺席态 S2 同型面替代并如实标注注入缝隙缺失）。
- 边界注记：四面活体两机分布（本机 TriMLC 8713/TriRLC 8711+sg TriMMC+河源 TriRMC）——四面全检视需跨机通道齐备，候排程；单机可达面（本机两面）可先行。

## 四、T-mig：R-HY rmc 卡迁移切换后验证族（A1-A4 可测化+§6.2 五步对表）

**写面动作（映射/切换/apply）=执行席（FSD）操作，本席只做验证面**。双门纪律：预检报告 CTO 门审过+CEO 知悉窗内，切换步方可执行——本席验证族在切换后启动。

预检对表（只读，可先行，呈 CTO 门审材料测试侧输入）：
- **P-1** 预检报告双要素齐：server 域内解密验证读数（可解/不可解定性）+snapshot 全卡 JSON 留档（时戳+hash 留痕）；判据=两要素在卷且 snapshot 时点早于一切写动作时点。
- **P-2** snapshot 值面抽验（len-only 纪律照旧）：条目计数与活卡对表；判据=计数一致零漂移。

切换后验证族（A 锚逐条可测化）：
- **M1（=A1）** TriRMC on 河源 `config show` 来源归因=card（rmc 卡）：活体读数+归因字段；判据=归因 card 且卡面语义 rmc（非 mmc 别名残留）。
- **M2（=A2）** 旧 `trimmc-card.json` 改名 `.bak-<ts>` 原位保留：文件在位断言+唯一性后缀格式断言（`bak-<ts>` 纪律同族）+反向迁移脚本在位走读；**回滚实弹不进本席验证族**（分钟级回滚实弹候 BOD 哨验亲测，非作者纪律）；判据=三要素在位+脚本可执行性走读过。
- **M3（=A3）** mmc 卡河源实例呈空白待配置态：`config show` 空白读数（无 provider_entries/无策略链）；判据=本职语义回归（空≠错）。
- **M4（=A4）** 全程零跨机文件复制（时序留痕）：审计链时戳序断言（snapshot<建卡<apply<验证）+无复制动作痕迹（server 域内流转佐证）；判据=时戳单调+零跨机复制证据。
- **M5（观察窗）** 切换后 ≥1 个 key-cache 刷新周期：周期计算依据=现役刷新间隔配置现查（禁估读）；到期后 M1 复跑仍归因=card；判据=持久性成立。
- **M6（映射面，§6.2②）** 无法归属条目呈报面核验：映射清单与 snapshot 对表（无法归属条目=呈报非擅断）；判据=分拣清单可溯源+呈报项零擅断。

## 五、T-fix：P0 候修三项随批验证（范围6）

- **X1（候修①）** PUT 无 provider_entries 载荷 500→400 人话拒：L1 API 案（in-process dispatch+沙箱钉位，同 config-cards 族方法）入 `config-cards.ste.test.ts` 增补；判据=400+人话错误体+零 500。**案可即日预置候 FSD 落位同批跑**。
- **X2（候修②）** SDE 候裁三件（registerPid port 参/watchdog 复活令 env/boot 期 401 自愈判读）：候 CTO 裁 3 件文（e24b17cc 裁面）落位后随裁测试化——裁前不预设细节，占位登记。
- **X3（候修③）** A6 回滚策略门审卷补注：文档面核验（dist 锚策略补注入卷+`dist.bak-pre-a6` 在位断言）；判据=补注在卷+补位文件在位。

## 六、T-reg：三仓全量读数（A6 锚=三仓零新增）

- 方法=同构 `npm test` 三仓串行（P0 L3 窗同法：后台子壳+Monitor+`--test-concurrency=1`）；**新基线=P0 终态读数**（FSD 复绿收口三笔 e9938cc 后：TriModel 313/298/0/15｜TriRLC 662/657/5/0｜TriMLC 617/612/5/0——候 FSD P1 落位时点 HEAD 现勘确认基线锚更新，禁沿用 P0 修前旧锚）。
- **仓集合扩注（P1 范围 2 落地）**：TriRMC 仓入对平面（COO 02:53 知会授权 TriRMC 仓侧先勘）→对平面=四仓（TriModel/TriRLC/TriMLC/TriRMC）。

### 六.1 TriRMC 仓侧对平（首勘，2026-09-29 02:54-02:58 +0800）

- HEAD 勘验：**496613b 在位**（P1 范围 2 落笔），工作区净；同构 `npm test`（仓 script 原样）独立全量。
- 读数：**589/584/4案(3族)/1 skip, exit=1**——FSD 报「589 测 3 挂族=既有」对差解消：fail 4=嵌套子案计数（套件 62 含 2 子案+63/107 各 1），**顶层挂族 3=3 零实质差**。
- 三族归因（独立验，非转抄）：①`Contract Resolver — chief-technology-officer v3.0`（子案：tool "read" 缺 runtime_equivalent+runtime_baseline 缺失）②`Contract Resolver — resolveContracts over source-agents (14 v3)`③`Employee Registry — source-agents v3 (14 employees)`——**全部=source-agents v3 契约投影测试**（TriRMC test/orchestration 面对表 TriCompany 源侧 agent 文件现势）；496613b diff 八文件（config-cache/key-cache/cli/config-sync/server+三新测试件）**零触契约投影面**——既有挂族定性实证 ✓；跨仓投影漂移（源侧文件 vs 测试期望）独立线候勘归 owner，不阻 P1 门，候 CTO 定是否列观察项。
- 新增测试族 23 案（key-cache/default-model-ladder/config-endpoints）**全绿**（pass 584 覆盖）✓。
- TriModel 侧（范围 1 TriMMC commit）在途，落位后补对平。
- 判据：fail⊆新基线（同族同数）+零新增；既有失败逐族归因独立验（禁转抄）。
- 时机：FSD 实现项落位后完工窗执行（COO 令「读数候实现落位，不空转」）。

## 七、纪律与边界

- 活体只读面（config show/cache show/文件在位断言）本席可执行；生产写面（建卡/apply/迁移切换）零触碰——验证族严格在执行席动作后启动。
- 跨机通道：sg=M 面（BOD 值席/SSH 直达）；河源=R 面（D-24 机位断言+面通道现勘后定）；本机两面直检。
- 时刻引用 date 现查（UTC Z +8 禁估读）；读数留痕含时点+回执 id；len-only 值面扫描照旧（sk- 前缀零命中）。
- 非作者走查：BOD 哨验收窗亲测 A1-A6 照旧——本席验证族=BOD 哨验的预验面，非替代。
- 本树 node-status.jsonl 由本席 self-register 起账，候 COS 并账。

## 使用依据

P1 执行单正身（wt/board 231fca65 `task-charter-trimodel-config-page-4plane-p1-exec-01.md` 全文）；CTO 件 §六（176-193 行五步+§6.3 锚）+§4.3 降级梯裁决；BOD P0 终卷 bod-acceptance-final-20260929.md（A1-A6 全过=P0 锚链闭环）；P0 期本席 §七基线锚方法+L3 窗同构回归方法（ste-test-plan.md §十三）。
