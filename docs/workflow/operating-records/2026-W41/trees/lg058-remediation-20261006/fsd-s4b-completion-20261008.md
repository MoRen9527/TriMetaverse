# FSD S4b 补载段毕报卷 · 观察项四锚施工完毕+段门四项全绿

- sourceOfTruth: 本卷（trees/lg058-remediation-20261006/fsd-s4b-completion-20261008.md）
- syncMode: final（S4b 段毕报正身；施工依据=CTO 裁决卷 179834cb 案 a+BOD 派工令 35905fb1）
- lastSyncedAt: 2026-10-07T21:55:54Z（05:55:54+08 周四，date 现查）
- 施工席: FSD 小全（m-fsd）；段名一律 **S4b**（CTO 勘名令：「S4.5 即 S4b」，裁决卷 S4.5 历史冻结不改）

## 〇、段门结论：READY_FOR_REVIEW（候 CTO 认收→统一 build+重启窗第二轮）

四锚全落+段门四项读数零失败。时点：05:55+08 毕，接令回执承诺窗（~06:3x 前毕）内。

## 一、段门四项读数（零失败）

| 项 | 命令 | 读数 |
| --- | --- | --- |
| tsc | `npm run check`（tsc --noEmit） | 零诊断 |
| 全量回归 | `npm test`（node --test --test-concurrency=1，374 用例） | **360 pass / 0 fail / 14 skipped**（skip=env-gated E2E 设计跳过，与第一轮窗同数零新增；duration 110.6s） |
| GATE | 六 `*.gate*.test.ts` 文件合计 | **57/57 pass 零失败**（汇总口径含 subtest 摊平；第一轮窗报 13/13 系顶层 it 口径——两口径同向零失败，如实并注） |
| 机读四锚 | grep 落点逐条断言 | B=5 处 / C=1 处 / D=2 处（handler 调用 L460+函数定义 L734）/ E=2 文件各 1 处+MODEL_CATALOG_LIST 各 2 处 |

## 二、六刀施工清单（三文件）

**ui/index.html（四刀）**：

1. **B-1 badge**（connLocalState）：applied 态徽章 `已落 · 重启生效`（语义锚「重启生效」四字必在）；数据源仍 verify.state 驱动——表现层注记，非判定树复活（S4 同源原则保持）。
2. **B-2 页顶缀**（tcApplyStateSuffix）：allApplied 分支+逐 face 分支同步改 `已落 · 重启生效`——与 badge 同族改，防两页读数分叉（S4「两页读数同源」完工门自我保护；判定为同锚同族落地非扩面）。
3. **C 清空注记**（connSaveDomain）：判定取保存前旧值 prevCount（`faceState[f]?.card?.local_config?.items`，loadFaceCards 刷新会覆盖 faceState——先取后存）；清空保存（items 空且 prevCount>0）→「已清 · 待落地（机器侧现持旧值）——清除落地链修复前，机器侧将继续持旧值运行」。
4. **D 切签重拉**：handler L456-461 切签后 `void reloadFaceCard(connDomainActive)`；新函数 reloadFaceCard（L734-743）=GET 既有单卡端点 `/v1/config/cards/<f>?view=managed`（零新增端点）→成功：faceState 更新+loadVerifyFaces（页顶缀随刷）+重渲（幂等，last-write-wins 防连点乱序）；**失败不空屏**（CTO 技术边界）：保留现显示+connMsg warn 轻提示（静默吞错=旧数据冒充新数据，故如实告知）。

**src/trimmc-card.ts（刀5 E-1）**：L617 400 msg 改 `provider_entries[<id>] 模型「X」不在目录内。可用模型：${MODEL_CATALOG_LIST}`——人话直述避 UI humanize 黑名单词（must be/invalid），自动透传卡面。

**src/policy.ts（刀6 E-2）**：L174-175 同族同稿（schedules[i] 形）。校验行为本身零改动（CPO 锚=文案自解释，非校验放宽）。

## 三、两处自纠（施工中实勘发现，如实注记）

1. **注记置后修（connSaveDomain 顺序缺陷）**：原顺序 connMsg→loadFaceCards（内部 renderConnectDomains）→renderConnectDomains——renderConnectDomains 用 innerHTML 整体重建 msg 节点为空 hidden，**注记设置后立即被冲掉（一闪即逝，用户永远看不到）**。既有「已保存」注记同病（非 S4b 新引入，系既有缺陷被 C 测设计暴露）。修法=注记置后（await loadFaceCards→renderConnectDomains→connMsg），最终态注记存活。jsdom C 测红→修→绿闭环实证。
2. **测试侧 msg 节点引用坑**：C 测首版持 click 前的 cd-mmc-msg 旧节点引用——成功路径重渲后旧引用 detached（textContent 永不变），waitFor 必超时。修=waitFor 内每次 getElementById 现取（S4 cd-*-phase 动态渲染可选链同族坑族再现，坑注已写进测试注释）。

## 四、测试跟随与新增（三文件）

- **ui-boot.test.ts**：T1（badge「已落 · 重启生效」+页顶串+重启生效语义锚断言）/T3（degraded 后缀串）/T5（全落单词缀）三处跟随改；L588 未知域零缀断言**加严**（`includes('已落生效')`→`includes('已落')` 子串级——零缀机制不变故过，加严防半截缀回归）；**新增 S4b 两测**：C 清空注记测（清单外键自由行→移除→保存→PUT mock 200→断言注记全文+可见）+D 切签 fetch 行为测（boot 首拉计数→切签→rlc cards GET +1→成功路径零失败提示）。
- **ui-fourplane.test.ts**：②f L507 rlc applied 断言改「已落 · 重启生效」（mmc 已存未拉/rmc 已拉未落不涉；L437 页副文「诚实三态」不动——CPO 裁不动面）。
- **trimmc-card.test.ts**：catalog enforcement 断言改 `includes('不在目录内')`+**五名逐名在场断言**（`for name of MODEL_CATALOG`——比 CPO 锚更严一档）；补 MODEL_CATALOG import。

## 五、未动面（边界对表）

- fb 面三处「重启会话后生效」（CPO 裁不动）；L296 页副文三态说明（同）；tcBadge 主卡徽章（待应用/已生效，非 verify 三态，不涉）。
- E 锚校验行为零改动（policy.ts/trimmc-card.ts 仅 msg 文案）。

## 六、技术债标记

1. **C 注记过渡期性质**：注记本身=过渡期诚实方案，daemon 真清除落地链修复（候 10-09 后维护波）后退役（CPO 卷 L33 预案）。修毕销注记时连带删 C 测或改断言——候办已在该维护波载荷里。
2. **既有「已保存」注记一闪即逝缺陷已随注记置后修一并修复**——非独立技术债，随本段闭环；S5 走查可覆盖验证。
3. GATE 口径差（57 vs 13）：非缺陷，读数口径并注（§一）；若 CTO 要统一口径候毕报裁定。
4. **D- 失败 warn transient（STE S5 预载干跑发现，2026-10-08 06:2x 补记）**：reloadFaceCard 失败分支 warn 提示可见窗仅 ~24ms（后被异步链重渲冲掉）——数据保留不空屏达标（CTO 技术边界守），失败提示可见性弱与 C 注记一闪即逝同病灶族。STE 定性锚面无碍，遵定性不扩面，候维护波与 C 注记退役并档处置。
   **CTO 裁正名（06:28+08 令）**：S5 锚面不受影响（数据保留+提示「出现过」即达锚，提示时长不在锚面）；「提示存活至下次交互」裁为独立改进项挂 FSD 候办清单——修面=reloadFaceCard 失败分支提示置后或独立容器（与 connSaveDomain 注记置后同族病灶不同函数）；排程=与 C 注记退役同维护波（10-09 后），不专开窗；S5 走查相关观察单按本口径对表。

## 七、后续（候 CTO 认收后）

1. 统一 build+重启窗**第二轮**（同第一轮四步序：build→停 28368→冷起→值面探针含四锚活体+S4b 新指纹三件交 STE 替换 S5 开场锚——第一轮指纹三件自然过期）。
2. S5 STE 合一走查照常 19:00 晚窗：四锚照验不降级；STE 开场首步=dist 快照版本核（锚=第二轮窗指纹）。
3. TriModel commit=回滚断点⑤（单段单 commit）。

## 使用依据

- CTO 裁决卷 179834cb（案 a 补载+段门定义）；BOD 派工令 35905fb1（任务书）；CPO 观察项裁决卷 cfcc055b（四锚正身+验收锚）；CTO C/D 裁决卷（C 维护波+D 主案技术边界）
- STE 预载发现卷 baa73055（四锚铁证四条）；本席第一轮重启窗卷 26fa6a6c（四步序+探针模式复用）
- 代码落点：TriModel ui/index.html（四刀）/src/trimmc-card.ts/src/policy.ts/test/ 三文件（本卷对应 commit=断点⑤）
