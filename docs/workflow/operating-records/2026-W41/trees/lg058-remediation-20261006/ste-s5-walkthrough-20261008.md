# STE S5 合一走查正跑卷 · R-HY 单锚（进行中→收口）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/ste-s5-walkthrough-20261008.md
- syncMode: live（窗内分段落盘，段落毕即 commit——D-45 款3 现役纪律）
- lastSyncedAt: 2026-10-08T12:02:15Z（20:02:15+08 周四，date 现查原值）
- 执行席: STE 小柯（m-ste）；锚面=R-HY 单锚（干跑卷 §六-§九 口径终版）
- 状态: **CTO 放行裁决 APPROVE（§四.1）——S5 技术面收口**；判定基线=CONDITIONAL_PASS（§四，CTO 独立抽验全对表后转正）

## 〇、开场锚四件（全绿）

自醒时点注记：cron 挂点 18:51+08，实到触发 19:33+08（会话忙延迟 ~42min，窗 19:00 后开工，如实注记）。

| # | 锚 | 读数 | 判 |
| --- | --- | --- | --- |
| 0 | date 现查 | 2026-10-08T11:33:54Z＝19:33:54+08 周四 | ✓ |
| 1 | 本机版本核 | TriModel 顶=e5394a4（父=e30ea20 全串对上；diff=ARCHIVED.md 10 行 docs-only，代码面与 e30ea20 等价）——非 e30ea20 本体系 BOD 09:56 退役标记 commit 所致，预期演化非漂移 | ✓ |
| 2 | R-HY 盘面指纹三件复算（ssh，hostname 断言首行=iZf8ziw57ydktu77fsld9yZ） | index.html=8ca70d3d56b334db… / trimmc-card.js=a9991c020df51c09… / policy.js=4b7924fa1b1bb0c3… 逐字对 FSD 交锚值；dist/.deploy-sha=e30ea20 全串；ss=0.0.0.0:3333 pid=2207670；service active MainPID 2207670 | ✓ 同机自洽（盘面） |
| 3 | served 面（本机直连实测，防火墙通行零猜） | GET /ui=200 len=139927（对 FSD 读数逐字同值）t=0.28s；**served body sha256=8ca70d3d…逐字节同盘面 hash**（自洽达锚强一档）；GET /health=200 ok:true t=1.57s（15s 门内），providers={anthropic:false,trimetaverse:false} 对 FSD 同值 | ✓ 同机自洽（served） |
| 4 | 行尾差定案 | 本地工作树 ui/index.html hash=a1ba4f25 ≠ served——`git show e30ea20:ui/index.html` blob hash=**8ca70d3d 逐字节同 served**，工作树 diff 空（含 --ignore-cr-at-eol）＝checkout 行尾差语义零差（同 policy.js 族先例）；jsdom 正跑读本地文件与 served 语义等价 | ✓ 注记在案 |

## 一、活体探针批（只读/校验拒，全绿；token 远端加载值面零出机，len=64 仅长度）

| 探锚 | 读数 | 对表 |
| --- | --- | --- |
| **B** GET /v1/config/verify（admin Bearer，200 t=0.002s） | mmc=not-configured（card_present=true）/ mlc=not-configured（last_pull 2026-10-08T09:24:13.950Z loopback ok）/ **rmc=applied**（已落生效，intent_version=5，applied_at 2026-10-06T23:17:23.776Z，last_pull 2026-10-08T11:32:24.290Z remote ok）/ rlc=not-configured | 对 FSD 探针 #9 同构（活体主态仅 rmc 可达）；mlc 有拉取无卡=卡状态机现势如实 |
| **D** GET cards 四 face managed（全 200） | mmc：3 条目逐 id 同 FSD 基线（e-glm-anthropic/e-deepseek-anthropic/e-glm-flash-anthropic），status.state=**pending**（2026-09-27，保存后未走 apply 回写链——FSD 注记 2 现势）；rmc：status.state=**applied** tier1（at=2026-10-08T11:32:24.398Z 窗前新拉落），local_config v5；mlc/rlc：card_file_present=false 空卡 pending | 卡状态机现势与 FSD 毕报一致；rmc 拉落链活体工作实证（窗前 11:32Z 刚跑过） |
| **E** PUT 无效模型（mmc，body=provider_entries 单条 foo-model） | **400** `trimmc card validation failed: provider_entries[ste-probe-e] 模型「foo-model」不在目录内。可用模型：deepseek-flash, deepseek-v4-pro, GLM-5.3-Flash, GLM-5.3, TMV`——五名逐名全列；卡文件 sha256 before=after（397ff674…）**零态变双证**（validateCard 拒在 saveCard 前，源码路径 api/trimmc-card.ts L233→L235） | S4b E-1 锚活体达标 |
| **neg** 无 token GET verify | **401** `Unauthorized: invalid or missing admin token`（fail-closed 端点面实证） | ✓ |

C 锚（禁触生产卡）：served 源码串面在场验证=「已清 · 待落地」[1]「机器侧现持旧值」[1]「已落 · 重启生效」[5]「重拉未成」[1]（「不在目录内」[0] 系服务端消息非 UI 串，预期）；交互级正身=干跑 70/70 构造态引证（§三）。

## 二、S5-F1 安全发现（已上报 m-cto，msg 4a66cda2；CTO 已裁——见 §二.1）

> 时点勘正（CTO 指正认领）：上报信头原写「19:45+08」系估写幻影时点，实发窗=19:43:29–19:44:11+08（锚=send 前现查 11:43:29Z+我方收信 hook 现戳 19:44:11+08）。家族纪律在案（落款当场重跑 date 贴原值），即录即改。

**发现**：GET /v1/config/cards/{face}?view=managed 200 body 含 `entries_decrypted[].api_key` 明文 + 完整 card doc（rmc local_config 含 ANTHROPIC_AUTH_TOKEN 白名键）。

- 源码锚：`api/trimmc-card.ts` L53-67——注释自称「api_key decrypted HERE only (UI never consumes it); masked view is the UI-facing surface」，但 decrypted 与 masked **同体下发**；`api/config-cards.ts` L104-115 managed=委托 handleGetTrimmcCard 原样返回。
- UI 消费面核实：served ui `entries_decrypted` 0 处引用 / `entries_masked` 4 处消费——decrypted=纯冗余暴露面（浏览器内存/devtools/代理日志），UI 每次卡载入即收明文键。
- 非鉴权绕过：admin 面 fail-closed（503 未配置/401 错 token）活体实证在案。
- 路由头契约注释「UI 面：掩码+状态」与行为相抵——契约/注释/行为三方不一致。
- **定性建议（候 CTO）**：非 S5 门禁破口，系暴露面过宽；修法方向=managed 视图剥离 entries_decrypted，候定点（本收口 or 维护波）。
- **连带自报（值面家族第 4 例）**：本人探针打印 body 未滤值面=GLM（尾纹 ****7d6v）×1 账号键两条目共用/DeepSeek（****26f3）×1/R-HY ANTHROPIC_AUTH_TOKEN×1 三值入本席 transcript。暴露面初评：transcript 本机 dev 在位；键属 R-HY/mmc 卡面；10-02 先例口径适用度候值面三查；轮换与否候 CTO/BOD 定性。操作教训即录：探针打印前先验响应形状（契约注释说了掩码≠响应体真只有掩码——键存在性抽验≠值面验证同族）。

### §二.1 CTO 裁定收讫（我方收信 hook 现戳=19:44:11+08 精确锚；CTO 令落款自报时点晚于收信现戳约 8 分（家族纪律如实并注，模糊尾分值不转抄），不影响裁定内容）

1. **定性采纳**：暴露面过宽缺陷成立、非门禁破口——三锚全采信（注释自认 UI 不消费/decrypted 与 masked 同体下发/UI 零消费面核实）；「最小暴露面」原则裁定=API 响应只含消费面所需字段。
2. **归宿=S3 候选清单新条（后窗），不入本 S5 收口**：①S5 是验证门，走查中途改码=验证基线漂移（四锚指纹刚核过）；②与 10-10 S3 窗不同仓不同 daemon，硬塞=范围爬升；③时效风险中低可接受过渡（admin fail-closed 已实证，「鉴权后过度暴露」），BOD 知情备案即可。
3. **修法候选条判据增补（CTO 补）**：改前**全仓扫 entries_decrypted 消费面**（排除 daemon 内部/CLI 消费——本席仅验了 served ui）；改后四锚指纹更新+R-HY 链部署照 ARCHIVED.md 纪律。
4. **本席值面自报**：10-02 口径初判适用（同盘同权限面增量≈零，操作瑕疵非新增泄露面）——转 BOD 备案定性，轮换与否候 BOD 裁。
5. 本席随跑供料项：全仓 entries_decrypted 消费面扫描（候选条判据预供，只读零险），见 §三.3。

## 三、构造态引证与回归（读数齐，全绿）

### §三.1 全量回归（npm test 正形，本机 e5394a4 顶=代码面 e30ea20 等价）

- **374 用例 / 360 pass / 0 fail / 14 skipped / 0 cancelled**（duration 185.8s）——对 S4b 基线读数（360/0/14）逐字同构，**零新增 fail**；skip=env-gated E2E 设计跳过（与两轮窗同数）。
- 既有失败归因：无既有失败族在册，0 fail 即全绿，无归因面。

### §三.2 GATE 双口径（六 *.gate*.test.ts）

- **正形读数（--import tsx，与 npm test 同链）：57/57 pass / 0 fail**——对 S4b GATE 读数同数（subtest 摊平口径）。
- **调用伪迹归因（独立验，如实注记）**：本席首轮裸 `node --test`（缺 `--import tsx` loader）跑出 3 文件级 fail（keys.secure/policy.gate.evaluation/proxy.gate）——单文件复跑勘验=整文件加载即崩（exitCode 1，Node 版本头=加载器级非断言）；根因=三文件含非可擦除语法需 tsx 转译、另三文件恰为原生可剥离语法故裸跑亦过；`package.json` test 脚本实锚=`node --import tsx --test …`。**定性=本席调用伪迹，非代码缺陷**；子集复跑必走项目自带入口/loader——假阴性机器教训即录（与「命令链断言失败须断整链」同族）。

### §三.3 jsdom 正跑（构造态引证正身）

- 干跑两批照用：**70/70 全绿**（dryrun1 负向+静态 44/44+dryrun2 四锚交互 26/26），防坑六条全在效（渲染面排 script/D- observer 法/同签重试/动态现取等）。
- 引证分层注记：jsdom=构造态（mock fetch+本地工作树文件，行尾差语义等价见 §〇.4）；活体可达态=§一 API 探针+served 逐字节；两态分列不互充。

### §三.4 entries_decrypted 全仓消费面扫描（S3 候选条判据预供，CTO §二.1.3 委托项）

- 扫描域=TriModel 全仓（ts/js/mjs/sh/ps1，排除 node_modules 与 .d.ts）：命中=`src/api/trimmc-card.ts`（producer 本体）/`test/keys.secure.gate.test.ts`/`test/trimmc-card.test.ts`（测试对表）/dist 镜像三件（构建产物随源）。
- **零 daemon/CLI 消费者**——UI 面已核 0 引用（§二）；剥离影响面=producer 响应体+两测试文件对表，候选条施工判据预供闭合。

## 四、S5 走查判定（本席三分法，放行裁决候 CTO）

**CONDITIONAL_PASS**——测试覆盖充分、门禁全绿、无阻塞性缺陷；非阻塞项在册需 CTO 确认收口：

| 层 | 读数 | 判 |
| --- | --- | --- |
| 开场锚 | 版本演化核+指纹三件+served/盘面逐字节自洽+防火墙实测通行 | ✓ PASS |
| 活体可达态 | B verify 四态对 FSD 同构（活体主态仅 rmc）/D 四 face 卡基线逐 id 同/E 400 五名全列+零态变双证/neg 401 fail-closed | ✓ PASS |
| 构造态引证 | jsdom 70/70+第二轮窗 P2-P4 历史卷（引证正身=干跑卷 §八 口径） | ✓ PASS |
| 回归门 | 全量 360/0/14 零新增 fail+GATE 57/57 | ✓ PASS |

非阻塞在册项（不阻本判，逐项有归宿）：

1. **S5-F1 暴露面过宽**：CTO 已裁 S3 候选新条（§二.1）；候选判据预供已闭合（§三.4）。
2. **mmc 卡状态机现势**（card_present=true 而 status.state=pending→verify 显 not-configured）：非本次部署引入，候走查单定处置（FSD 毕报注记 2 同源）——CEO 走查若见 mmc「未配置」徽章系此现势非缺陷。
3. **D- warn transient**：CTO 已裁独立改进项挂 FSD 候办（与 C 注记退役同维护波），S5 对表口径=「出现过」达锚。
4. **R-HY 配置面现势**：providers 两键 false/mlc 有拉取无卡=如实呈报非缺陷（FSD 注记 3 同源）。

覆盖缺口如实：UI 浏览器端真渲染+真人交互链（BOD playwright 预验截图作参考）不在本席工具面——CEO 走查为该层终验；本席活体层止于 API/served bytes/盘面三面自洽。

### §四.1 CTO 放行裁决收讫（收口终态，本席回填）

**裁决=APPROVE（放行）**——CTO 落款现查 2026-10-08 20:00:48+08，本席收信 hook 现戳 20:01:21+08（双锚精确值，时序正常无倒挂）。

1. **独立抽验（第二方法）全对表**：CTO 本机跨机复测 served 面 /ui=200 len=139927+sha256 前 16 位 8ca70d3d56b334db 逐字同 §〇.3 卷值；/health ok:true+providers 双 false 同值；verify 无 token=401 独立实证 fail-closed；全量回归于 TriModel 顶 e5394a4 独立复跑=374/360 pass/0 fail/14 skipped 逐字同构 §三.1（并注：全量绿含 GATE 子集，57/57 无需单跑即上位证明）。两法交叉验证闭合，四层 PASS 全数采信——**CONDITIONAL_PASS 转正=APPROVED 放行**。
2. **条件面定性**：浏览器真渲染+真人交互链=本席工具面覆盖缺口如实、不属测试面欠账，该层终验归 CEO 走查（BOD playwright 预验作参考）——**不阻技术面收口，S5 技术面至此收口**。
3. **非阻塞四项归宿复核全认**（§四表）；走查层留注记：CEO 走查若见 mmc「未配置」徽章系 pending 未走 apply 回写链现势，非缺陷（同 §四.2 口径）。
4. §三.2 伪迹归因独立验+教训即录处置获 CTO 认领（首轮 loader fail 自查自纠路径干净）。
5. 放行毕报走 BOD/COO 收口链（CTO 令面指令）；BOD 值面自报裁况（不轮换，10-02 口径）见席位卷与记忆条，卷面历史态不回填。

## 使用依据

- 干跑卷 ste-s5-dryrun-20261008.md（9a654e79，§〇-§九 口径正身）；FSD 毕报 fsd-rhy-deploy-gapfix-20261008.md（df65d515）
- CTO 判据面：m-cto 锚面五条（卷 §七）+本机退役口径三条（卷 §九）；BOD 锚面切换知会（卷 §六）
- 源码锚：TriModel api/trimmc-card.ts L28-67/L233-235、api/config-cards.ts L90-205、src/trimmc-card.ts L593-640（validateCard 序）
- 活体读数本席亲测（本卷 §〇-§一），FSD 对表值取自其毕报卷
