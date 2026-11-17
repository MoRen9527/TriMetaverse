# STE T2 收口段 tsc 联检复跑读数卷（COS 催办·BOD 定性 T2 收口要件·2026-11-17）

- sourceOfTruth: 本卷（trees/trirmc-bridge-dsh-20261116/·tsc 联检复跑读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: STE 小柯（m-ste·联检复跑窗·催办令 COS 23:08 转承 BOD 催办令 CEO 23:06 关切线）
- 跑面: sg TriRMC dev **f70a3bf** HEAD（=8252d9f T2 主施工+修案链顶·双机锚）

## §一 · 修案链溯源（接手规则·版本差标注）

| commit | 时点（+08） | 面 |
|---|---|---|
| 8252d9f | 11-16 23:26 | T2 主施工（session-bridge 三 API 改指 dsh+白盒族） |
| f8df7ba | 11-16 23:34 | 修面案·STE 递案（execFile encoding utf-8 TS2339 一阶+SpawnRe…） |
| f70a3bf | 11-16 23:37 | 线3·STE 第三处修案（whichDsh Sync 解构→直收 string TS2339 二阶消解） |

催办令面「STE 两笔修案」=f70a3bf 前时点定性——现势=**三笔修案链**（第三处修案 f70a3bf 已在 dev HEAD·版本差如实注）。第一轮联检修至第三处后中断·本卷=f70a3bf HEAD 面复跑读数。

## §二 · tsc 全量复跑读数（f70a3bf·tsc 5.9.3）

- **真实退出码=2**（`node_modules/.bin/tsc --noEmit` 直重定向取真值·首跑经管道 tail 的 EXIT:0 系假读数已勘弃·链断言教训遵行）
- **报错 35=两族全非 8252d9f 触面**：

| 族 | 数 | 面 | 定性 |
|---|---|---|---|
| TS2307 模块解析缺 | 29 | trimodel/@tricompany/agent-core/@trimetaverse/tricode/nodemailer/yaml 等 | **deps 环境面固有缺**：file: 依赖目标位全在（../TriCompany/packages/agent-core、../TriCode、../TriModel 实勘）但 node_modules 链接面全缺（@tricompany/@trimetaverse/trimodel 三链接零在·实勘）——npm install 装链接从未跑（10-03 版部分 face）——**工程环境残面非代码缺陷** |
| TS18046 unknown 收窄缺 | 6 | src/cron/service.ts（job/a/b） | **存量类型缺**：8252d9f 零触文件·TS 5.9.3 严格面首跑显形（vitest/esbuild 转译不查类型故套件绿而 tsc 显形）——**候修窗类型收窄案·非本线引入** |

- **触面专项**：session-bridge 相关 grep **零报错**+test 文件面**零报错**——8252d9f 改形+三笔修案面在 tsc 5.9.3 下类型干净。
- 反证充分性：35 错分布（agent-loop/cron/server/onboarding/cli/prompt-cache 全仓老模块）与触面（session-bridge.ts+test）零交集+两族机理（deps 链接缺/存量收窄缺）均与 8252d9f 改形无关——**不切 HEAD 跑前基线对照**（零扰 duty 共享施工面护栏·结构面反证充分）。
- 基线形态如实注：无前轮 tsc 全量 log 在档（「候 STE/dev 联检」=此前未跑过全量）——本卷读数=**首跑全量基线**（复跑语义=修案链后首全量·非对表前轮）。

## §三 · 判定

**T2 触面联检：绿**（8252d9f+修案链面零类型错·三笔修案闭环达成）；**整仓 tsc 门禁：CONDITIONAL**——35 错两族存量/环境面如实档·建议处置：①TS2307 族=`npm install` 装 file: 链接（dev/环境域·非 STE 修案面·装后预期 TS2307 清零）②TS1806 族=service.ts 类型收窄小案候修窗（6 处·量级小）③两族均不阻 T2 收口（触面零涉）。

## §四 · 工作区残面如实档

- **package-lock.json 被删**（dirty -1568 行·非本席笔）：对 tsc 零影响（tsc 读 tsconfig 不读 lock·已实证）——锁文件删除=依赖漂移风险面·**建议 restore**（git checkout -- package-lock.json）·原窗意图不明不代动·报值席勘。
- 首跑管道 tail 假读数（EXIT:0）一笔如实自领：`tsc | tee | tail` 管道退出码=tail 非本体——重跑直重定向取真值 2 在卷（链断言教训再触·自领入档）。

## 使用依据

- COS 催办令 23:08（BOD 催办令·CEO 23:06 关切桥改造加速线）+回执 23:1x（排窗今晚即开）
- fsd-t2-code-readout-20261116.md（残面① tsc 门禁候联检源注+修案链 §三）·sde-t2-smoke-readout-20261117.md（活体面）
- sg TriRMC dev f70a3bf 活体实勘（log 链/dirty/node_modules 链接面/file: 依赖目标位）
- 大表 task-inventory-20261117.md（桥改造线 T2 收口 b 形+T3 毕现势·催办令旧态矛盾注已随回执报 COS）

—— STE 小柯（m-ste·联检复跑窗）·写前现查 〔commit 时戳锚·D-47 正形〕
