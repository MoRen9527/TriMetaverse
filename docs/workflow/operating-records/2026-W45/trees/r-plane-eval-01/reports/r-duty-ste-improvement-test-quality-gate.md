# 改进计划分席卷 · r-duty-ste · 测试与质量门禁域 · r-plane-eval-01

- sourceOfTruth: 本卷（trees/r-plane-eval-01/reports/r-duty-ste-improvement-test-quality-gate.md）
- syncMode: static（分席改进卷·值席汇卷制）
- lastSyncedAt: 2026-11-04T05:31:49Z（date 现查原值·京时 13:31:49+08；本卷签发时刻≈13:45+08 以此为基）
- 执行席: r-duty-ste（ST 小柯）；姊妹卷=同目录 maturity 卷
- 边界注: 本卷只出测试域改进建议+验收锚；技术裁决与排期归 CTO/COO 面，本席不越域拍板

## 改进项（P1→P3·每项含验收锚）

### P1-1 · TriRLC 11-04 merge 后补全量验证读数（销 N1）

- 动作：`npm test` 正形全量复跑 @`067fbfd` + `npm run check`（tsc --noEmit）·读数入 docs/testing 新验证卷；与 10-20 卷（758/758·suites 137）对表
- 跑法纪律：禁 bash 直跑 `**` glob（235 假读数家族·跑法层在档）；只许 npm test 正形
- 前置：跑测属「仓面零写」边界微妙面——跑前按域知识族第 2 条做值面预审（测试 tmpdir 用法 audit），或在 CTO 授权跑测窗内执行
- 验收锚：docs/testing 新卷含 HEAD hash+tests/pass/fail/suites 全量读数+EXIT 码·与既有读数链对表零未释回归
- owner 建议：STE 执行·CTO 门禁收口

### P1-2 · TriPilot 基线拉齐决策（销 N2）

- 动作：CTO/FSD 面裁决 Pilot dev 线 10 周休眠的处置（拉齐 RLC 侧 10-23 后批次节奏/或正式定性休眠降权）——测试域配套：定性后补一次基线快照读数（compile+现有套件+tsc）入档
- 验收锚：Pilot 现势有 dated 读数卷（现无任何 08-28 后读数）；处置定性入 code-state
- owner 建议：CTO 裁决·FSD 执行·STE 验证

### P2-1 · TriPilot 测试面扩容起步（销 N3）

- 动作：优先补 token 门（LG-002 X-Internal-Token 全调用面）与 daemon 通信面的边界案组——现有 2 件只盖 sseParser；轻门禁脚本（check:reference-tools/check:tool-impl）先纳入常规验证读数口径（零成本扩门）
- 验收锚：token 门案组≥3 边界（无 token/错 token/过期态）；CI quality-gate.yml 保持绿
- owner 建议：FSD 写·STE 用例评审

### P2-2 · TriRLC 最小 CI 护栏（销 N4）

- 动作：GitHub Actions 单 job（checkout→npm ci→`npm run check`→`npm test` 正形）——把人肉双面互证纪律沉淀为机器底线，人肉面继续作增量
- 验收锚：workflow 在 dev push/PR 触发且首跑全绿读数在档
- owner 建议：FSD 实施·CTO 审·STE 验证

### P2-3 · test-state 登记追平（销 N5）

- 动作：P1-1 读数落档后，模块级+中央 test-state.md 追平至现势（RLC 模块 09-11→11-04；双线分叉冻结项与 8713 疑案族两条缺口销账状态复核）
- 验收锚：lastSyncedAt 更新+已知缺口条目与现势一致
- owner 建议：STE 供料·CTO 收口

### P3-1 · 卫生债清理（销 N6/N7）

- 动作：TriRLC test/ 两件 .tmp-* 临时测试文件移出 test/ 或删（先溯源其存在缘由防误删在役件）；Pilot lint 配置决策（引 eslint 或正式定性暂不设并改脚本注记）
- 验收锚：test/ glob 面零 untracked 残留；lint 面有明确态
- owner 建议：FSD·STE 复核

### P3-2 · 8711 live 面冒烟预案（预置·非当下）

- 动作：R 本地域若起 8711 daemon，先备只读冒烟清单（healthz 免鉴权只读面·power-follower 三裁据对应现场断言）——当下无监听不动
- 验收锚：冒烟清单入 docs/testing 待用；起服窗由 CTO/COO 面定
- owner 建议：STE 预置

## 汇总

- P1×2（RLC 补读数+Pilot 定性）·P2×3（Pilot 扩容+RLC CI+登记追平）·P3×2（卫生+预案）
- 全部建议不涉现役 8710/443/8791 零碰面；执行窗与优先级归 CTO/COO 裁决面
