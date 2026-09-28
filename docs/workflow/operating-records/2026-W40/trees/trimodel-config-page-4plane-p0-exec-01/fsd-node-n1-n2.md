# FSD 节点收口件·N1+N2（face registry+泛化端点+写前守卫+审计账） — TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01

- sourceOfTruth: 本件=FSD 节点收口件（LG-057 试点·实现节点 N1+N2）
- syncMode: static
- lastSyncedAt: 2026-09-28T03:54:28Z（date 现查；落笔时戳经现查回填校正）
- 施工席: FSD 小全（m-fsd）；实现锚=TriModel **43086ff**（8 files, +840/-1）

## 交付内容（方案 v3 §2/§十 对表）

| 件 | 内容 | G 项 |
|---|---|---|
| `src/card-faces.ts`（新） | FACES 四值静态 registry（mmc=trimmc-card.json **原位零迁移**=别名保留文件面延伸）+TRIMODEL_DATA_DIR+face-ledger.json 台账（读盘零重启）+face-events.jsonl 审计（四族 len-only）+归因码枚举导出+TRIMODEL_CARDS_DIR 沙箱钉位 | G1/G6 |
| `src/card-write-guard.ts`（新） | 写前守卫：备份先行（唯一后缀 `bak-<ts>-<pid>-<seq>`，LG-054 族③直引）+keep=5 轮换（core rotateBackups 复用+哨兵豁免）+幂等短路+write 审计 | G5 |
| `src/api/config-cards.ts`（新） | 泛化五端点 handler：写/status/apply 全委托现役 trimmc-card handler（**merge/删除通道/校验单源零复制**）；pull=server 域内解密受控载荷（明文仅响应生命周期/禁用条目不进载荷/解不开跳过+warnings）；双层鉴权（admin fail-closed 写面/api-token+TRIMODEL_FACE_TOKENS 可选绑定拉取面，P0 通配） | G2/G3/G4 |
| `src/trimmc-card.ts`（+5 纯增） | saveCard 前置守卫挂载（写语义零变；别名与泛化端点共享备份保护——**实现裁定**：守卫挂引擎层=「卡写备份」语义本体，G9「不触老路径」以 diff 纯+行+别名双证回归满足断言意图，候门审裁） | G5/G9 |
| `src/api/routes.ts`（+34 纯增） | 泛化分支注册：{face} 不在册=404 防枚举（正则 `[a-z]+` 收敛+大小写/穿越/编码串拒）；方法不匹配=404 | G2/T3 |
| `src/server.ts`（1L） | dispatch 透传 remoteAddress（pull 台账 loopback/remote 归因；唯一 1- 行） | G1 |
| `test/config-cards.test.ts`（新 22 案） | STE L1 对齐：registry seam②④/防枚举/managed 三态/pull 鉴权三态（P0 通配+FACE_TOKENS 绑定收敛态）/载荷语义/台账/守卫五案（T4 同毫秒双写唯一性硬断言）/别名逐字段等价/status+apply 审计/len-only 值面扫描 | G1-G6 |

## 自测读数

1. **新测试族**：22/22 全绿（0.77s）。
2. **全量**：**308 tests / 293 pass / 0 fail / 15 skipped**（skip 15 与基线同形）——基线 286 套零改动全绿=别名回归双证①；期间 1 次 flaky fail 未复现（首跑 1 fail 无案名，二跑全绿，终读数以全绿为准，候 L3 复验盯防）。
3. **build:verify 门**：绿（首跑曾抓出测试布景 2 处 TS 错——RuleEntity/StrategyEntity 无 id 字段——即修，门价值在案）。
4. **lint**：80 errors/898 warnings 与基线 stash 对比**逐位同读数=零新增**。
5. **diff 面**：840+/1-，唯一 1- 行=server.ts dispatch 调用行（透传参，语义零变）。

## STE seam 对表（测试方案 §四 五项）

①TRIMODEL_DATA_DIR/TRIMODEL_CARDS_DIR/TRIMODEL_POLICIES_DIR 三钉位✓（in-process dispatch 直调形态）②FACES/ATTRIBUTION_CODES 常量导出✓ ③face-events schema=`{ts,face,etype(pull|write|apply|status),result(ok|denied|failed),detail,reason?}` 冻结于 card-faces.ts✓ ④归因码三枚举导出✓ ⑤CLI bin 挂族=N4 节点交付（候）。

## 技术债/观察项标记

1. **守卫意外收益=既有测试活卡往返写显性化**：仓根出现 5 个 trimmc-card.json.bak-*（守卫自动留证）。**活卡内容零损实证**（策略 st_mu1bth1f66s5a2/status.at 09-27 原样=mtime 变化系等值往返写）；写手=某既有测试在无钉位状态写 canonical 路径（两轮 grep 未锁定，嫌疑=handler 直调漏传 cardPath 的等值写）——**候勘项呈 CTO**；bak 已入 gitignore（运行时数据域）。基线无守卫时代此类写无痕发生=潜伏污染，守卫使其可见。
2. face-events 审计的 face 字段=卡文件 basename 反推（faceFromPath）——沙箱自定义文件名落 basename 兜底（len-only 安全，语义注记在码）。
3. 泛化 managed 视图 body.object 恒 'config.trimmc-card'（委托原样保别名等价）——face≠mmc 时 object 字段语义位错（非功能性；P2 UI 接线时随呈现层对齐，记录在案）。

## 使用依据

- 方案 v3 afb0180c（§2.1/2.2/2.3/§三/§十）+执行单 d9df61bc+门审清单 5c60b084（G1-G6/G9 逐项对表）
- STE 测试方案 af59dc9e（§二 L1/§四 seam/§七 基线锚 286/271/0/15）
- 现役源：trimmc-card.ts 引擎（saveCard L522 原子写/canonicalCardPath）/keys.ts（API_TOKEN fail-closed 先例）/claude-fallback.ts（五门① 机制蓝本）
