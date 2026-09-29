# CTO 门审卷·P2 四域面卡 UI 骨架（亲验窗 09:30-11:00·五审点）

- sourceOfTruth: 本件（P2 门审 CTO 亲验正身）
- syncMode: final
- lastSyncedAt: 2026-09-29 10:25:16 +0800（date 现查原样粘贴）
- 令链: COO 05:24 排窗确认（09:30-11:00 弹性）+本席自管理 cron 09:28 触发；门审对象=P2 骨架 @995c2f7（A6 独立回滚锚）+managed additive @3e6ab37

## 〇、前置三查（窗启 09:32 读数）

1. **date 现查** ✓ 09:32:07 +0800（窗内）；
2. **FSD prep 件在位** ✓：jsdom 首启链案（ui-boot/ui-boot-connection/ui-fourplane 含 jsdom）+真 HTTP 链路案（ui.e2e.gate.test.ts createServer×2）可跑；
3. **STE 错峰**：ste-test-plan-p2.md 达笔（本窗读毕）；错峰面=STE 亲测手测（A1 U1-U3）候 STE 在岗窗，本席=技术侧预验非替代。

## 一、五审点逐项判定

### 审点① A1 选项卡渲染活体（非作者手测）——**技术侧 PASS**

- 本席非 FSD（作者）✓，亲跑亲读断言面：LG-058 四域面卡骨架七断言全绿（导航层 7 项+默认总览+hash 路由／一致面八项 id 族+模板序锁死／无令牌诚实态+零卡面请求／有令牌 managed×4+诚实三态徽标+不造数注记+审计行台账摘要／折叠自适应按有实数据卡数判（4/4→左菜单 3/4→顶部细条）／卡内指路委托／策略卡参照层正名）；
- S8.2 jsdom 首启五断言绿（断言①无令牌态面板禁用→②令牌保存自动重拉→③模型下拉填充→④条目提交 PUT 可达→⑤全文件通道词汇+结构词汇零出现）；
- 真浏览器 E1-E8 全绿（E1 首启 38s 真链路）；
- **分工注记**：像素级视觉走查+手测面归 STE U1-U3 与 CPO A2-P 验收窗（本席=断言面活体预验，不虚报「手测完成」）。

### 审点② A4 渲染验证门全家族——**PASS**

- R2 jsdom 首启链（含保存→reload→断言仍在第四型周期）✓ 绿；
- R3 真 HTTP 链路案 ✓：ui.e2e.gate E1-E8 真浏览器+真服务端两阶段全绿（LG-035 第三次命中教训的正形覆盖在位）；
- R4 结构升级触发器 ✓ 命中且已检（P2 导航层=结构升级型改动，jsdom 族+e2e 族随批更新在 995c2f7 diff 内：ui-boot 15 行/ui-boot-connection 13 行/ui.e2e.gate 15 行/trimmc-card.test 6 行）；
- **读数**：45 测 45 pass / 0 fail（duration 100s）。首跑同四件曾得 32 pass/13 cancelled——第二跑全绿复现不成，定性=瞬态环境非代码缺陷（注记采信第二跑）。

### 审点③ A6 revert 演练读数核——**git 层 PASS（实弹候 BOD 哨窗）**

- 锚序独立性 ANCESTOR-OK：`git merge-base --is-ancestor 3e6ab37 995c2f7` 过——revert 995c2f7 不回滚 managed additive；
- diff 面六件纯 test/+ui/index.html（672+/74-），**零 src/ daemon 触及**——revert 后端零受累语义成立；
- 995c2f7=本机 dev HEAD 在位；
- 回滚实弹演练归 BOD 哨窗 09-30（STE V1 同口径：锚在位+步骤走读过=本卷，实弹候哨验非作者纪律）。

### 审点④ 诚实三态+sg 实照存在性——**证据面 PASS；A2-P 终判归 CPO 窗**

- sg 双半实照在位亲验：evidence-sg-preswitch/ 8 件+evidence-sg-postswitch/ 7 件（manifest/401 body 件/台账双件/ui-live 双件+截图），与 CPO 收稿卷（v1 641d6f57+v2 e6c6f188）件账对表一致（含 CPO 注记的 manifest 两笔件名漂移，物证零缺陷）；
- A2-E 证据面 CPO 已判通过（v2 分段合判）；技术侧断言覆盖核：ui-fourplane ④「诚实三态徽标+不造数注记+审计行台账摘要」+⑤「结构词汇零出现」在卷跑绿；
- A2-P 呈现面判据三条（CPO v2 预设）候部署窗，本席门审不代判。

### 审点⑤ 全量 324+env-gated 15 带 env 复跑——**对表吻合 PASS；带 env 复跑挖出新发现项（§二）**

- **全量独立复现对表成立**：分段跑非 UI 段 265 测（262 pass/3 skip/17s）+UI 段 45 测（45 pass）+ui-e9~e12 段 14 测（2 pass/12 skip）=**324 测/309 pass/15 skip/0 fail**——与 FSD 申报逐位吻合（独立第二刀）；
- 非 UI 段 3 skip=既有域既有行为（坏密文跳过策略/非沪时区跳过/U12 防御性跳过=测试对skip语义的断言，非 env-gated）；
- **带 env 复跑（TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1，真浏览器）**：e11 全绿；**e9 挂 1/e10 挂 1/e12 挂 8**——见 §二。

## 二、新发现项：env-gated 旧案 10 挂（F-2 定性+处置裁）

**挂因全族一致**：playwright 对 `#tc-conn`／`#tc-str-body [data-del]` 等 visible 等待 30s 超时——元素 resolved 但 disabled/not visible。

**定性=旧案结构漂移，非产品功能缺陷**（证据三面）：
1. P2 骨架（995c2f7）把 UI 自平铺面改为「导航层+单页面板」（面板默认隐藏，导航点击显形）+策略卡改参照层常态隐藏——e9/e10（LG-036 期）与 e12（LG-053 期）案 selector 假设平铺可见面，未随 P2 骨架更新（995c2f7 随批更新了 ui-boot/ui-boot-connection/ui.e2e.gate 四件，e9/e10/e12 三件漏更）；
2. 功能面被 P2 代案+独立面覆盖全绿：ui-fourplane ⑦「面板隐藏不破策略卡功能」+E4「保存 PUT lands server-side」+S8.2 断言④+e12 C10b API 直打 400 守卫+C6 jsdom 首启策略表渲染；
3. FSD 申报 324/309/15/0 独立复现吻合——0 fail 在其自测口径（env 不带→e9~e12 skip）内成立，**非虚报**，系 env-gated 面 skip 态零实跑的口径盲面，本窗审点⑤补上。

**真实覆盖缺口（须认领）**：e12 独特主张=「删除→保存→**真 reload**→不复活」跨刷新持久（第四型盲区专属案，jsdom 不覆盖）——策略删除真浏览器跨刷新持久当前**无绿案覆盖**。

**处置裁**：
1. **不阻 P2 骨架门**（A1-A6 锚面证据全过）；
2. **FSD 修案挂候修清单**：e9/e10 加导航显形前缀（导航点击→面板 visible→fill）；e12 八案同法，**「真 reload 不复活」主张不降级不改判据**；
3. e12 修绿后 FSD 自证一遍「导航→策略面板→删除→保存→reload」路径——即 CEO 终验三项之「删除复活」的预演（防 CEO 亲测撞墙）；
4. 排窗：今日下午工时窗或 BOD 哨窗 09-30 前后；不阻 P2 部署窗排程；
5. 自测口径注记：结构升级型改动交付的自测，env-gated 受改动面族建议带 env 分段实跑（全量 15 skip 全带 env 非必须，受改动面必须）。

## 三、A3 卷面审读（非阻塞，随卷记）

fsd-a3-cli-web-matrix-verdict.md 读毕：R1-R6 判值分布（✅rlc+mlc 实测/🟡 码锚/⏳候件）与「候件不虚验」纪律兑现；差异标注 D-1~D-5 显式成文候 A3 完工窗一并裁（CPO 06:3x 已定裁窗）；确认①②生产活体闭合（sg 备份轮转+face-events 全族）。A3 终对表=完工窗事，不阻本骨架门审。

## 四、综合判定

**CONDITIONAL PASS——P2 骨架 @995c2f7 过门审**（①②③④ 审点过+⑤ 对表过），条件两项：

- **env-gated 旧案 10 挂修案（e9/e10/e12）候修清单挂账**，e12 真 reload 持久面修绿+CEO 终验预演自证后，全量回归 clean 定性方闭。
- **managed 新端点真链路案（件C）**——见 §五 勘误补注，FSD 补自动化案后 R3 方闭。

P2 部署窗排程不受阻（部署窗候 A2-P+CEO 亲测同窗，修案窗在其前有富余）。

## 五、勘误补注（STE N13 发现·2026-09-29 11:0x 补）

**STE R3 新发现**：managed 新端点（GET /v1/config/cards/\<face\>?view=managed @3e6ab37）三层覆盖=服务端单测✓/UI jsdom mock fetch✓/**真浏览器↔真 server 全链路案零覆盖**——LG-035 第三击教训字面形态（三集成缝 mock 掉：URL 拼接/auth 头拼接/三态解析）。

**本席独立实勘证实**（不转抄）：四真链路族 grep panel-card/view=managed/loadFaceCards 零命中（exit=1）；E1-E8 真链路覆盖端点=trimmc-card 族；ui-fourplane ④ managed 断言=L72 `window.fetch` mock（URL 形状断言非真 HTTP）。

**门审自纠**：本卷审点② R3 判定当时核的是「真链路案在位且绿」（E1-E8 对既有端点族），**未做「新端点覆盖面」grep 级核对**——R3 判定对 managed 面不成立，漏洞如实记档；STE 第三刀补位=门审互检机制生效。STE「缺案非挂案、不推翻已过面」定性认承。

**裁定**：
1. **裁②为准**（FSD 补自动化真链路案=正式达标）；①STE 人工活体验证**不单取**（三集成缝守卫必须自动化持续在，人工一次性读数守不住回归）——若 admin 通道就绪早于件C，STE 人工活体可做临时缓解加分项非达标替代。
2. **件C 并入 CONDITIONAL PASS 条件族**（与 e12 修案并列）。技术形态最低限：循 ui.e2e.gate 现案骨架加两案——(a) 有令牌 loadFaceCards 真链路（真 server+真 fetch：view=managed×4+auth 头+200 解析+三态徽标渲染断言）；(b) 错 token 401 诚实态（不假显不造数）。判据=LG-035 R3 原文（新端点×真服务启动×断言响应契约）。
3. **排程**：件A（e9/e10/e12 修案）+件C 同域同 e2e 基建一并做；件B（F-2）独立仓。三件一窗技术可行，件C 估量 ≈1-1.5h（骨架现成）。件C 纯测试面零重启（TriModel 侧，不并 8713 重启批）。

## 使用依据

- 本席亲跑读数：TriModel test/ 全量分段三批+ui.e2e.gate spec reporter+ui-e9/e10/e11/e12 带 env 逐件（时点见卷内）；
- git 层：merge-base --is-ancestor+995c2f7 --stat+dev HEAD 对表；
- CPO cpo-a2-evidence-intake.md（v1+v2 分段合判）；STE ste-test-plan-p2.md（A1/A4/A5 分工与 CEO 终验三项）；FSD fsd-a3-cli-web-matrix-verdict.md（候窗清单+F-1 闭环）；
- 深夜静态预备核（995c2f7 边界断言+3e6ab37 行级守卫 diff 对表 facc0989+快族 60 测+tsc 净）；
- 门审纪律：D-04 报时/实勘先行不转抄/门不豁免（skip 面带 env 复跑）/非作者验证。
