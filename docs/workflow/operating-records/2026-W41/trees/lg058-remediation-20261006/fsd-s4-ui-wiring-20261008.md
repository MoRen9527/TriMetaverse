# 深测②合一 S4 件① UI 接线毕报+完工门机读卷 · FSD

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/fsd-s4-ui-wiring-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T05:15:29+08:00
- 树节点: FSD S4 施工毕报+完工门证迹（细估卷 §2.1 S4/§3.4 两页读数同源；候裁点④ A 案）
- 状态: S4 完工门全绿——候统一 build+重启窗 → S5 STE 合一走查

## 〇、交付锚

- **TriModel commit `572e59a`**（dev，独立回滚断点④）：3 文件 +204/-21（ui/index.html +ui-boot.test.ts +ui-fourplane.test.ts）
- 四断点制 4/4 就位：S1 `7f7063a` → S2 `b310c4b` → S3 `b394045` → **S4 `572e59a`**

## 一、S4 载荷逐项

| # | 载荷 | 落法 |
| --- | --- | --- |
| 主线·判定树退役 | connLocalState 五分支判定树删 | badge=/v1/config/verify 读数直消费：`state_label` 权威中文直用+`pull_chain_degraded` 结构化后缀；`TC_VERIFY_STATE_CLS` 五键样式映射（UI 样式语义非判定逻辑） |
| 主线·页顶读数行 | tc-active-line「应用于」接 S1 字段 | 新 `tcApplyStateSuffix()`：本域 face 集=域标签含 display 名匹配（`TC_FACE_DISPLAY` 与服务端 FACES.display 同值）；全落=单词缀「· 已落生效」，有未落=逐 face 如实列（「TriMLC 已落生效 · TriRLC 已存未拉」形态）；未知域标签=零缀不猜（现役形态原样） |
| 主线·取数挂点 | loadVerifyFaces() | loadFaceCards 尾（badge 首渲即真值防闪变）+PUT 成功后随刷（主卡保存=mmc face 下发意图更新）；晚到补渲染 tcRenderActiveLine 幂等 |
| 主线·如实降级 | 读数不可得三态 | verify 有值=权威读数／卡数据在+verify 缺=「读取失败」（断链候选如实）／都缺=「未配置」（未连接诚实态原样）——与 L820 注释语义族对齐 |
| 搭车① | 三型描述式定稿（CPO 00:5x 全案） | 规则空态副文=`（支持：按时间段自动切换 / 始终用某个模型 / 用量用完自动换下一个）`；旧「时段/默认/额度三型」串退役（渲染面零残留断言过） |
| 搭车② | rlc/mmc special 任务语言化 | 语境源码可判（rlc=8711 代管关系+card-faces plane='local'；mmc=trimmc-card.json 原位同文件），三问起草：rlc=`本域由本机 TriRLC 进程（8711）代管（R 面本地域）——本卡内容经该进程下发生效。`；mmc=`本域读取失败时如实显示（不造数）；在此修改配置直接生效，daemon 免重启；本卡的策略内容=「模型策略」页同一份，策略编辑请到「模型策略」页。`——**候 S5 CPO 到场校验稿** |

## 二、完工门机读

1. **两页读数同源断言**（ui-boot S4 describe 六测全绿）：T1 同源（badge=verify state_label 且页顶缀同源，域标签外 face 不进缀）／T2 判定树退役（卡/ledger 数据说「已落生效」而 verify 说「已存未拉」→badge=verify——服务端权威单点实证）／T3 degraded 后缀两页同缀／T4 读取失败如实／T5 全落单词缀+未知标签零缀／T6 三型换新
2. **CPO 搭车复扫**（一次性证迹 11/11 全绿，已删不入仓）：A 段三型旧串零残留+新串落位；B 段 special 两处旧词（寄居过渡形态/值席/候文件迁移方案）零残留+新语境落位；D 段 verify 同源渲染实证（badge 两 face+页顶缀+请求发出）
3. **渲染面残余如实注记**（不属 CPO 点名两处，候 CPO 二步清单）：`（寄居过渡）`meta×1（rlc 卡 nav meta）+`态候接线`×2（mlc/rmc special）——同族运维语，非本令载荷面

## 三、自测读数（全量四项）

1. `npm run check`（tsc）零错
2. **全量回归 372/358/0/14 skip**（S3 基线 366+6=S4 新增六测，零失败保持）
3. **GATE 真浏览器 E2E 13/13**（chromium 实跑；页顶「应用于 本地域」活体 daemon verify 真值拼接不破锚）
4. ui-fourplane 16/16（②f verify mock 对齐+② mmc 锚跟随）+完工门机读 11/11（§二）

## 四、如实边界与注记

1. **测试跟随两笔**：fourplane ②f（badge 驱动源换 verify——mock 与三域数据面对齐，断言值不变）；② mmc 特有锚（「值席」→「「模型策略」页同一份」——CPO 搭车②清洗的直接联动）。
2. **waitFor 假阳性坑一笔**（防坑存档）：`cd-*-phase` 元素系 renderConnectDomains 动态渲染——渲染前 `getElementById(...).textContent` 直呼=TypeError（waitFor cond 内无 null 保护时首帧即炸，表相=「元素永远 null」）；fourplane ②f 未踩中系其首探锚用 querySelectorAll（空集合不炸）。正形=可选链 `?.textContent`。
3. **扫描脚本无令牌态反证**：完工门扫描首跑（无令牌）D 段 4 败——verify 未发+页顶零缀——恰为「无令牌/读数不可得=零缀不猜」T5b 行为的活体旁证；补令牌后 11/11。
4. **special 起草候校验**：两处系「语境源码可判→三问起草」轨（CTO 转令②），S5 走查 CPO 到场校验；rlc 卡 nav meta 的「（寄居过渡）」不在点名两处内未动（扩面禁），入候 CPO 二步清单。
5. **三型 JS 注释保留**：L2013/L2093「三型」系源码注释（开发者面非 UI 面，渲染面零命中），按 S3 条 8 渲染面口径保留；CPO 全案「三型分类词不教不入 UI」的 UI 面已清。
6. **活体 dist 边界**：本段为 UI+测试文件（零服务端改动）——活体 3333 现服 dist=S1 版（pid 27252），S3 keys.ts 文案+S4 UI 接线的活体生效候统一 build+重启窗（S4/S5 前，细估段门纪律「重启窗紧贴验收，日窗内闭合」）。

## 五、下一步

统一 build+重启窗（刷新活体 dist：S3 keys.ts 三处+S4 UI 一并生效）→ S5 STE 合一走查（双前提二已齐：S3/S4 毕报落树+活体 dist 刷新；候 19:00 窗）。

## 使用依据

- CTO 细估卷 75a51dda（§2.1 五段序 S4 行+§3.4 两页同源+§88 接口错位防范）；批 B 技术设计卷 §3.4+候裁点④ A 案（BOD 终裁）；S1 交付卷（verify 端点正形：五态枚举+VERIFY_STATE_LABELS+pull_chain_degraded+零健康字段）；CPO 全案裁定（ab524ddf，CTO 转令：三型定稿+special 两处三问起草+常态只读砍终局）；card-faces.ts FACES registry（display/domain/plane 三字段=映射与语境起草证据源）；runtime-info.ts（domain_label 值域）；TriModel 572e59a/b394045；S3 毕报卷（三坑实录——beforeParse 装桩坑本窗复用避踩）。
