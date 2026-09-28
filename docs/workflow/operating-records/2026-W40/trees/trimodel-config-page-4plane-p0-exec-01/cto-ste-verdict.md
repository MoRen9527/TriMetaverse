# CTO 裁定·STE 候裁两项（归因码 emit 点+L3 执行窗形态）

- sourceOfTruth: 本件（STE 候裁两项裁定正身；D-15 枢纽裁定留痕）
- syncMode: final
- lastSyncedAt: 2026-09-28 14:3x +0800（date 现查 14:25 hook 链）
- 实勘基线: TriModel src/api/config-cards.ts L25-70（鉴权）+L184-230（status/apply 分支）本席 HEAD 现勘；方案 v3 §3.3 归因码本义对表

## 一、裁 1 归因码 emit 点：**分两半裁——apply/status 非 200 审计补 emit（N3-N5 顺手面）；decrypt_failed server 侧不补不降维**

实勘定性（补 STE 转述的精度）：

- **pull_denied 已有 emit 点**：config-cards.ts L104——401 时 `appendFaceEvent(pull/denied/reason=pull_denied)` + 台账 last_pull_result=denied 双落 ✓。此码非缺。
- **真缺口=审计不对称**：status 端点（L186）与 apply 端点（L206）均只记 `statusCode===200` 成功态，**非 200（鉴权拒/校验拒）静默透传零审计行**——pull 面 401 有 emit 而 status/apply 面 401 无 emit，同族端点审计粒度不一致。鉴权拒系写面安全事件，无声=审计盲区。
- **decrypt_failed 本义场景不在 server 侧**：方案 §3.3 三码本义——pull_denied=拉取鉴权拒（server 侧✓）；decrypt_failed=**消费机 cache 域不匹配**（§3.3 「cache 解密失败→丢弃直落 tier3」）；apply_rejected=**应用方回写 failed 附码**。后两码的 emit 点本就在 daemon 侧（N3-N5 config-cache/回写链），server pull 视图的 decrypt 失败（server 解自己卡解不开=数据破坏异常态）非本义场景，warnings+skipped detail 已可审计。

裁：

| 项 | 裁 | 归属 |
|---|---|---|
| status/apply 非 200 审计 emit（result=denied+reason 透传拒因） | **补**——量级两处各 1-2 行，不动分期 | FSD N3-N5 顺手面（随交付窗折入，A5 门审时 G6 审计四族含 denied 态复验） |
| decrypt_failed server 侧 emit | **不补不降维**——本义场景在消费机，枚举导出非死码（N3-N5 daemon 接线即用） | N3-N5 daemon 侧落 emit 点（方案 §3.3 本义） |
| STE 「缺两码」表述勘正 | pull_denied 在役有 emit；实缺=status/apply 非 200 审计 + decrypt_failed daemon 侧待落，两案归属如上 | 随本卷知会 STE/FSD |

## 二、裁 2 L3 执行窗形态：**(a)+(b) 采，(c) 留升级判据；bump 幅度封顶 2x**

- **(a) L3 排轻载窗：采**——UI E2E 负载敏感系环境事实（30s goto/180s launch 无裕量×重载机=高 flaky），排轻载段系标准缓解；排程影响由 COO 入排程（晚间窗候选），09-30 完工窗不动采认。
- **(b) 超时裕量 bump：采，幅度封顶 2x**（goto 30→60s、launch 180→360s 量级）——护栏两条：①bump 后 L3 读数须记录六案实际耗时分布（贴新上限=仍脆，非复绿）；②裕量非回归盲区，bump 只为消环境 flaky，不为掩真回归——超时语义仍是硬断言。
- **(c) UI E2E 独立另窗：备选保留**——触发判据=(a)+(b) 落地后复跑仍超时，届时再议（两次排窗成本仅在必要时付）。
- STE 对平判定（环境型破平、非代码回归）**采认**；复绿判据=轻载窗+bump 后六案零超时且耗时分布不贴限，复绿读数随 A5 门审呈报。

## 使用依据

STE 节点回报三项（14:17:04 COO 转达）；STE §十 @ 46687349（r2 读数 308/287/6/15+归因三重佐证）；TriModel config-cards.ts 实勘（emit 点分布）；方案 v3 afb0180c §3.3（归因码本义场景）；门审清单 5c60b084 G4/G6。
