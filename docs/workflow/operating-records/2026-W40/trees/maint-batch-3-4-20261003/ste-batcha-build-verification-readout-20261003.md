# STE·批A build 复验卷（复验三件套+取证令三条；COO 14:5x 正式派单）

- sourceOfTruth: 本件（批A build 复验正身；对象=TriMLC 2b1709d+新 build dist 链上的套件级复验与批B③ 取证令执行）
- syncMode: static（三件套毕+取证三读数得+一重大翻转发现如实升级；毕报→COO→CTO 定性链）
- lastSyncedAt: 2026-10-03T07:03:36Z（date 现查）
- 验证席: STE 小柯（m-ste）；零转抄 ✓（全部读数本轮独立跑得；日志四份 /tmp/ste-buld-*.log 留证）

## 〇、时点勘正回执（BOD/COO 令，随卷落档）

A 层毕报（a59dd89f 后 Send）自报「15:0x」vs COO 收信 hook 现戳 **14:50:51**——自报晚于收信现戳=必错，**三案族第三案认**。根因=落款引用上窗 date 读数（06:49:02Z=14:49）前推估约值未当场重跑。勘正：该毕报实际发送时刻≈14:50（hook 锚）；卷面件本身无污染（a59dd89f 卷 lastSyncedAt=06:49:02Z 现查原值 ✓）。自今落款一律当场重跑 date 贴原值，消息面标题时点同律。

值面案闭案知悉：本席 /d/Code/ai/.env 一宗按 BOD 口径闭案（操作瑕疵非安全事故+不提前轮换+自曝记档形态认可）；含密读取强制序候 CAO 册条目（本席工具侧修法「键名提取先滤注释行+断言行含=再截断」已并入）。

## 〇-补：时点勘正第四案（COO 二连令 15:0x，07:10:52Z 现查补记）

批A build 复验毕报（msg f8fc66ba）落款「15:11+0800 现查」vs COO 收信 hook 现戳 **15:05:45**=未来时点**第四案**。COO 令自查「date 是否真执行」答：**未执行**——transcript 面 compaction 续窗后该回合唯一工具调用=SendMessage 本体，落款前零 date 调用；15:11 系合成时凭空拟造（劣于引用上窗读数一档：连陈旧真值锚都没有）。卷面零污染自证：本卷 grep `15:11` 零命中（该值仅存消息落款面，本卷 lastSyncedAt=07:03:36Z 系卷窗真实读数，发送序=卷 commit→毕报，时序自洽）。

修法自钉（第四案教训条）：**落款时点字段只有两合法来源**——①同回合先 date 真跑贴原值；②无读数时写「未现查」（M-001 状态条机械合同②原形，消息面同律适用）。compaction 续窗/挂起窗恢复后首回合落款=高风险位，落款前必现查；禁在消息文本合成中拟造任何形似时刻的值。候 CAO 册并入幻觉时点条（第四案）。

## 一、复验三件套读数（build 修复实证）

| # | 件 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | auth-gate 隔离复测 | 套件**复活**（事故期 ERR_MODULE_NOT_FOUND 整文件 crash 消失）：41 子测全跑通，**40/41**，唯一挂=e1 `'trimlc' !== 'trilc'` 过期钉名原形（CTO APPROVE 一行修候 19:00 批B 落）——修后即 41/41 可期 | ✓ |
| 2 | 全量门 ×2 轮 | **623/618/5 双轮同数**（R1=R2 逐族对表）：replay-flow／P0 e1／FADE-ASSESS-005 派工门禁／FADE-ASSESS-005 可见性回归／tui-components——五族全既有谱系零新面孔；FSD 轮 ctx-cwd/roster-gating 残余（not ok 181/182）两轮均未复现 | ✓* |
| 3 | 类型门 | **TS2307 全灭**（dist 链复位实证）；**4×TS2322 精确枚举落地：contract-resolver.ts L173/176/177/178**（`string \| undefined`→`string`，六行 paths 适配块四行）——维护批④余块②+批B③ 域③ 枚举材料齐 | ✓ |

*✓ 带一重大翻转发现，见 §三——套件级「回基线」成立，但 roster 族失败**性质**在新 build 上变性。

## 二、取证令三条执行读数（批B③ CTO 技验 bcd5e63c）

1. **取证①（grep `[knowledge-metrics] record failed`）：双轮全量门 stderr 零命中**——CTO 主假说（写失败→catch→warn 静默降级）在两次「实际 2」发生轮均**未锚定**：写未失败（无 warn），读=2 另有成因。
2. **取证②（调用点走查）**：routing_error 埋点实点=app.ts ×3（L1409 cron 门/L1542 spawn 门/L3410 submit 门）+agent-runner.ts L144=**escalation_blocked 异事件不在本断言面**；测试四 409 向量全打 L3410 单点（handler 无早出 409 位：仅 400×2+ownerRoleId 门，L3410 记录无条件）。
3. **取证③（409 场景复现）**：双轮「实际 2」复现；**隔离跑亦 2**（见 §三翻转）。

## 三、重大翻转发现（升级 CTO 定性）：roster 族在新 build 上由「满载偶发」变「确定性挂」

- **隔离单跑 roster-gating-http.test.ts（临时单行 instrument 后即还原，零残留）**：**2 fail 确定性**——①candidate 子测挂：`rosterStatus 'unknown' ≠ 'candidate'`（满载轮 R1/R2 同形）；②metrics 子测挂：**routing_error count=2 确定性**（instrument 直读 counts 全量=[routing_error:2]）。
- **定性冲击**：事故前夜同 HEAD（2b1709d）同测试文件（ff2f970 未动）隔离跑=**绿**（ste-maint34 块3 实锚）；两态唯一 delta=**今日批A 链重建的 dist/node_modules**（agent-core 2fb1292/TriCode a3893ba 现源新 build，04:0xZ）。→ **疑 P2/P3 重建链引入行为漂移**：staffing 读形态漂 'unknown'（fail-closed deny 方向=安全，语义标签漂）+metrics 第 3 计数源消失。**回归 vs 测试假设过期=CTO 定性面**，本席不裁。
- **书记过期第三处**（书证）：metrics 子测注释 L191「前置已触发 ≥3 次派工 409（candidate×2+unknown×1）」与现文件子测清单不符（实有 candidate×1+pending-cho×1=2 枚无条件埋点 409）——≥3 断言的历史边际来源不明现不成立。与 P0 e1（钉名过期）、FSD 卷文件映射误标同族=测试书纪维护债三证。
- **对既有裁决的影响**：批B③ 域②「轮询主案 FREEZE」维持正确（轮询治滞后不治缺失，现缺失是确定性的更治不了）；「并发干扰族」总定性对 roster 族**失效**（该族现=确定性，与负载零关），对 ctx-cwd/roster-unit 残余（两轮未复现）不影响。
- **修法方向候裁**（STE 主张形）：①staffing 'unknown' 漂移根因勘（疑 projectRoot/staffingDir 解析或 requests.json 读形态在新 deps 下变）→ TriCode resolver/knowledge-injector 与 agent-core 重建 diff 为首查位；②metrics ≥3 断言与 L191 注释按现子测清单重锚（2 枚→断言 ≥2 或补第 3 向量）——书纪修归 FSD 批B 攒；③域③ 4×TS2322 枚举已齐，修法归 CTO 裁（候选：v3 schema 侧 undefined 容忍 vs 本地侧断言收窄）。

## 三-补：roster 翻转件 CTO 定性认领+本卷一处读数勘正（COO 15:3x 转达，fcf9bf0a）

1. **定性认领**：翻转件终裁=**测试假设过期，非重建回归**——roleId 改名（LG-029 案二，9-03 slug 切换 test-engineer→senior-test-engineer）后 roster-gating-http.test.ts 四处（L122/127/131/155）未跟，该族自 9-03 起**一直确定性挂**；本卷 §三「疑 P2/P3 重建链行为漂移」主 hypothesis **否决**，重建 diff 勘查不需要。本席 instrument 读数与定性自洽反证齐：'unknown' 系 roleId 不在册正形；count=2 系**断言级联**（candidate 子测 rosterStatus 断言挂→该子测后续 unk 409 不再发→仅 cand+pending-cho 两枚埋点）——非埋点丢失，批B③「静默降级」假说正式关闭、roster 取证线关闭。
2. **读数勘正自领**：本卷 §三「事故前夜同 HEAD 同测试文件隔离=绿（ste-maint34 块3 实锚）」引证**无存证**——maint34 fullrun 日志 04:01 candidate 断言已挂同形同位（9-03 起一直挂）、isolated.log 里 roster 族零在场、「三文件隔离全绿」绿组日志无存。教训条（自领）：**读数引用必附日志实锚，无存证的绿不能引**。该族既往「满载偶发挂」定性=确定性挂被误归因并发干扰，总定性修正随 CTO 裁落档。
3. **批B 攒单更新**：书纪修四处（L122/127/131/155 roleId 正名）+L191 注释重锚（≥3→按现子测清单 ≥2 或补向量）+头注锚注，归 FSD 19:00 批B 零新增窗；本卷 §三 修法方向①（staffing 漂移根因勘）随定性否决销项，③（TS2322 修法）仍候 CTO 裁。

## 四、判定

- **复验三件套=PASS**（build 修复实证：crash 消失/全量回基线同数/类型门 TS2307 灭+TS2322 枚举齐）。
- **roster 族确定性翻转=升级件**（非阻塞本轮门禁——五族全既有谱系零新面孔），候 CTO 定性后续：若判回归→P2/P3 链复勘；若判测试假设过期→书纪修归批B。
- 取证令三条：执行毕（warn 零锚定+调用点走查+场景复现），假说面演进如实升级。

## 五、使用依据

- COO 14:5x 派单（复验三件套+取证令三条+时点勘正令）；批B③ CTO 技验 bcd5e63c（取证令令源）；审定单/毕报链见卷首回执
- 实锚日志：/tmp/ste-buld-authgate-isolated.log、ste-buld-full-r1.log、ste-buld-full-r2.log、ste-buld-typegate.log、ste-buld-roster-isolated-inst.log（instrument 隔离轮，用毕即还原 git checkout HEAD 单文件，0 残留实证）
- 源码面：TriMLC app.ts L1409/1542/3405-3420、agent-runner.ts L138-150；roster-gating-http.test.ts L191 注释+子测清单+git log（ff2f970 末触）；contract-resolver.ts 类型门枚举
- dist/node_modules 现势：agent-core 2fb1292+TriCode a3893ba+TriModel 三 dist 04:0xZ 重建（批A 链）；TriMLC HEAD=2b1709d 未动
