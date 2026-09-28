# CTO 正式门审卷·LG-058 P0-EXEC-01（A5 签发判定；G10+A5+预勘四项合并）

- sourceOfTruth: 本件（正式门审裁卷正身；A5 签发判据出本卷）
- syncMode: final
- lastSyncedAt: 2026-09-28 23:1x +0800（date 现查 23:02 hook 链；STE A5 包 23:01 达笔）
- 门审包: STE §十三（2696108c+实勘补卷 f1f96711）+预勘卷 411609cd+裁定三卷（a52ae33d/de6d49f8/1a74b955）+门审清单 5c60b084

## 一、G1-G10 逐项判定（对照门审清单 5c60b084）

| 门 | 判定 | 依据 |
|---|---|---|
| G1 face registry 静态声明 | **PASS** | FACES 四值静态（mmc/mlc/rmc/rlc），mmc=trimmc-card.json 原位零迁移；43086ff 实勘+段中反馈确认（a52ae33d §四） |
| G2 泛化端点+别名零破坏 | **PASS**（附 G2b 记档） | 三族端点在卷+trimmc-card 别名保留 M3 移除；G2b=managed 明文回显系现役行为非本单引入，P0 不动（零破坏原则+admin 门内），记档 P1/P2 候 CPO 对表（411609cd §二） |
| G3 鉴权双层 | **PASS** | 写面 requireAdmin fail-closed（未配=503）/pull 面 TRIMODEL_API_TOKEN+FACE_TOKENS 通配过渡（P0 约定面）；pull_denied emit L104 双落在卷 |
| G4 域锚三不变量 | **PASS** | at-rest 密文域=创建机；拉取流受控载荷非密文文件；消费机 PBKDF2 域内重加密——方案 §3 对表实勘吻合 |
| G5 备份轮换五件 | **PASS** | 唯一后缀 seq 模块级单调（同毫秒双写零覆盖）/备份失败拒写 fail-closed/轮换失败不阻塞/FROZEN-BACKUPS 哨兵豁免/幂等短路逐字节——五门全勘（a52ae33d §四） |
| G6 审计账四族 | **PASS** | face-events 四族 len-only 293 行在役实证；裁 1 联动已闭合：status/apply 非 200 emit 补丁随 N3 4d8e735 落地，STE 案③对表追认（delegate 非 200=failed/http_\<code\> 形态，apply_rejected 不冒用留 daemon 侧） |
| G7 CLI 族不开写面 | **PASS** | app.ts 注记「CLI 不开写面，本组零卡写端点」实勘在卷（1a74b955 §一）；configRequest 带 x-internal-token+未配置显式报错=双向 fail-closed |
| G8 两卡接入同构 | **PASS**（部署窗执行项） | face registry 同构声明+接入步骤随 G10 部署窗；步骤纪律见 G10 |
| G9 revert 单 commit | **PASS** | +840/-1 纯增量（唯一 -1=dispatch 透传参语义零变）；守卫挂 saveCard 引擎层=LG-054 族③教训闭合裁（a52ae33d §三）；泛化层纯新增随单 commit revert 完整消失 |
| G10 部署纪律 | **PASS**（前置已解除） | pid 13432 内存态=恢复态三方一致实证（411609cd §五）→重启无数据损失；重启照 TriLC 重启纪律（优雅停+port 断言禁裸杀）；**生效面注记入签发件**：守卫全覆盖对重启后进程成立，验收读数含「重启后 canonical 写留 bak+审计行」活体断言 |

## 二、A5 判定：**CONDITIONAL APPROVE（带条件签发）——实现与部署面放行；测试面两案挂复绿收口窗**

### A5 双条件核验

1. **G1-G10 全 PASS ✓**（十门全过，附记档项均不阻）。
2. **STE 读数——部分达成**：
   - 基线面 ✓：TriRLC 662/657/5/0 基线四族**逐位同构零新增**（STE 独立提取案名核验）；TriModel 313 案 3 fail 全在 UI E2E 六案域（本单改动面自身）；TriMLC 617/611/6/0 唯一 +1=runConfirmCheck **flaky 定性采认**（隔离复跑 21/21 绿+全 mock 链零真实 git/网络+与 LG-058 改动面零关联）——列观察项挂账，不阻 A5。
   - 栅栏面 ✓：BOD 固定项②值面实证 PASS（生产双文件 before/after sha256+mtime 逐位一致；UI E2E 真浏览器链 20+ bootServer 零触生产）——族1 整改三钉位实证有效。
   - 复绿面 ✗：六案 4/6（W1/W2 未达），W3（非六案）goto 60s 贴限——复绿判据未全达。

### 候裁四项裁定

**① W2 断言族归因：测试 fixture/连接层脆性优先，真回归候选挂证伪义务；归因收口路径=FSD 修 connectPage bug 后 W2 单案复现**

- 采认 STE 两点：connectPage 层脆性实锤（隔离两轮失败点漂移至 connectPage 未及 ruleRows 断言=环境时序型成分在案）；「r2 环境型定性不完整」判定成立（形态迁移 reload 超时→断言族，归因家族必须重开不外推）。
- 本席补一条反向证据：**W4（同域同卡写路径+完整 reload 周期）L3 全量 PASS**——「写→reload→规则在表」完整周期在同一改动面上有 pass 实证，规则持久域本体（saveCard/reload/渲染链）非全坏面。
- **ruleRows=0 未证伪=不放行 PASS 亦不判 FAIL**：收口判据=FSD 修 connectPage 三参签名 bug 后 W2 单案隔离复跑——**过=归因闭合测试层；仍挂 ruleRows=0=真回归实锤，FREEZE 部署步+升级代码面复勘**（W2 读真卡 vs TRIMODEL_CARD_FILE sandbox 钉位交互，候勘面 STE 已列）。禁止在 connectPage 脆性未修前对 W2 下任何终局归因。

**② W1 click 维度 bump：采，追加裁——click 30→60s（2x 封顶同护栏）**

- 裁 2(b) 原判只覆盖 goto/launch 两维度，click 30s 默认限=实施缝隙非语义反对；bump 同护栏适用：①bump 后仍卡（元素 visible/enabled/stable 后 hit-test 超时）=非超时族，转 W2 同路径排查（页面主线程/遮挡=真问题候选）；②耗时分布入卷。

**③ W3 贴限+TriMLC flaky：W3 不计入 A5 阻塞域；flaky 列观察项**

- W3=非六案域（r2 pass 案），贴限=裁 2(b) 语义「仍脆」属实但不阻门；「goto 贴限指纹仍在」记复验窗观察面；裁 2(c) 独立另窗判据保持挂起（六案外案不触发）。
- TriMLC runConfirmCheck：flaky 定性采认（三重佐证在卷），根因未定列观察项——候修清单挂账（与 cronRequest token 缺口同族=测试基建可靠性面），不阻 A5。

**④ 门审放行：CONDITIONAL APPROVE，两窗结构**

- **实现/部署面：放行**——G1-G10 十门全过+栅栏实证+基线零新增+TriRLC/TriMLC 零新增稳定回归。
- **复绿收口窗（09-30 完工窗内，N3 遇阻顺延 10-01 上午）**：FSD 执行授权修正（见下）+W1 click bump→六案复跑——**6/6 绿=A5 转正式 PASS**；W2 仍挂 ruleRows=0=FREEZE 部署步+代码面复勘升级。
- **部署步（G10 重启窗）门禁**：重启窗执行前置=W2 归因收口闭合（测试层实锤或代码面复勘毕）——部署后守卫生效面变化会改 W2 复跑环境基线，先收口归因再重启，防归因污染。
- **附带发现授权：准**——FSD 修 connectPage L299 `waitForFunction(fn, {timeout:8000})` 三参签名误传（`{timeout:8000}` 落 arg 位，实际 30s 默认限在跑——报错 Timeout 30000ms 为证）+`waitSelectOptions` L305 同型勘。授权域=Playwright API 误用修正，**断言语义零变更**（W2 断言本体不动）；修后各案耗时分布如实入卷。

### 预勘四项合并收口

1. **113B 差**：核心实体零损形态级差（三方一致实证），低风险——收尾条件（无真实配置变更呈报）已过时点=**闭卷挂观察**。
2. **G2b managed 掩码化**：记档 P1/P2 候 CPO 对表（managed=管理面语义当掩码 vs keys 分发面设计本性分立不并），不阻 A5。
3. **键沾染**：两枚 dev 键已转 BOD/CEO 轮换面与 09-27 项并单——非门审项，卷内留指针。
4. **族1 断言窗**：「bak 零新增+活卡零变」自 411609cd 起算——L3 窗值面实证（生产双文件逐位一致）+TriModel 3 fail 全在 UI E2E 域非仓根写=**断言窗 PASS**，族1 整改有效性实证 ✓。

### 固定项① bak 保留确认（A5 收口义务，候 BOD）

本席确认：`bak-20260927-2325-pre-fullflash` **保留至 09-30 哨验收毕**（生产恢复源+栅栏 before 对照锚双重身份）；哨验收后循升格流程（STE 确认→BOD 双确认）清场。确认链三席齐（STE §十三+本卷）。

## 三、A1-A6 哨里程碑交接（出卷后 BOD 哨验收 09-30）

- A6 revert 演练实测在哨窗（+840/-1 单 commit revert 语义）；A5 本卷=CONDITIONAL，正式 PASS 待复绿收口窗读数；A1-A4 已在在卷证据面（执行单六项对表）。
- 哨验收通过后：升级流程清 bak（固定项①）→CG9 常态挂账→方案 v3 归档冻结态。

## 使用依据

STE ste-test-plan.md §十三全卷（2696108c+f1f96711，三仓独立全量未转抄+W2 隔离复跑两轮实勘）；预勘卷 411609cd（113B/G2b/键沾染/族1 断言窗）；裁定卷 a52ae33d（G9/写手两族）/de6d49f8（裁1/裁2）/1a74b955（N4）；门审清单 5c60b084（G1-G10+A5 双条件定义）；执行单 d9df61bc（A1-A6 锚）；门审清单/裁定卷内实勘锚（43086ff/9d47ceb/4d8e735/c7414e3/03bae30 diff 面）。
