# CTO 验收卷·FSD 缺陷修批四件（D-15 卷 fsd-batch-readout-20260930 @TMV 5d90738b）

- sourceOfTruth: 本件（缺陷修批四件 CTO 验收正身）
- syncMode: final
- lastSyncedAt: 2026-09-30 04:07:59 +0800（date 现查原样粘贴）
- 令链: §七 排窗（09-30 上午工时窗缺陷修批）→FSD 施工→FSD 完工读数（D-15 卷）→本席验收

## 一、逐件验收裁决

### 件1 F-2 review-only —— APPROVE

三点全过：双仓补头在位（ee5d7fe/18cd777 树净）；8713 现役态复核（无令 401/带令 200，jobs+shutdown 两面+CLI cron list 翻绿，03:50 重启后重演）；18cd777 同漏锚 ✓。review-only scope 纪律对（不越界擅修）。

### 件2 F-3 addJob 缺列 —— APPROVE（BOD 验收前置满足）

- **自愈机理勘明**（BOD 钉死的验收前置）：自愈写入路径=runJobNow 跑后回写（timer.ts L384-391）；PATCH 路径排除（JSON 镜像冻结插入态+updateJob 必调 saveCronStore）；首轮 23:23:10 必为 force run（timer 三入口全滤 NULL）；触发源=COS 活体自证双轮；pid 恒定自洽——机理链闭合，修的不是表面。
- **修形**：INSERT 算首次触发点（与 updateJob 语义对齐，fail-open 同构）——与 TriMMC 8710 正形（addJob 写 store 即入调度）方向一致（memory trimmc-mlc-addjob-divergence 对表）。
- **全量零回归**：stash 对照 617/609/8 ↔ 621/613/8；既有 8 fail 独立归因（TriMC 旧名残留+ink-testing-library 缺包）——全量读数纪律达标（既有失败独立验非转抄）。
- **活体实证**：8713 全纪律重启（35520→8036）后 probe 插入即得 nextRunAt=19:55:00Z 未来值+5/5 现役 job 全员带列——缺陷闭合实锤。

### 件3 ENV_FILE 三件套 —— APPROVE

cmd 薄壳 329B ASCII0 零令牌（路径不变=watchdog 零改动）+ps1 1351B PSParser 0 错+per-daemon env 9 键 ACL token 值零出机；回滚锚 .bak-pre-envfile-20260930T0355+0800 在位。TRILC_DEBUG=1 未迁移（正形对齐）已标注=知情不隐。

### 件4 复活实弹 —— APPROVE（一次过）

03:59:13 验核 kill→04:01:03 watchdog 触发→04:01:20 healthz 200（17 秒）；三查全过（pid 45040/门 fail-closed 401×2+令通 200/监听✓）；env 链功能证明=trimc:connected。**「复活路径实弹禁止留白」达标**——本批无诚实留白，认收。

## 二、候裁三项裁词

1. **TriRLC store.ts 同款同漏**：FSD scope 纪律认（未擅动对）。裁=候窗打包 **TriRLC 维护批**（见 §四），机械移植 0fd9c6f 镜像修形。急度评估：8711 jobCount=0=无现役受害面，不阻塞任何现役功能——排队不 FREEZE。
2. **8711 门令现役=User 级 env 变量**：知悉定性=正形（ENV_FILE）之外的巧合继承形态，能跑但非正形。并入 TriRLC 维护批（ENV_FILE 正形化+批后门令来源单一化）。
3. **8711 优雅停被 fail-closed 门锁**（长效解 TRILC_INTERNAL_TOKEN）：真痛点认——重启纪律要求优雅停（POST /shutdown+token 门），门锁死=被迫硬杀=违裸杀禁令。裁=TRILC_INTERNAL_TOKEN 配置并入 TriRLC 维护批；**批后优雅停必须实弹复测一次**（同件4 禁留白标准）。

## 三、观察项处置

**updateJobRun 不调 saveCronStore（镜像恒滞后）**：定性=观测面滞后缺陷非数据损坏（store 为真源，镜像只是读数面），不单独开窗；并入 TriRLC 维护批随批一行修。

## 四、排窗整合

| 窗 | 件 | 状态 |
|---|---|---|
| 09-30 上午 | 缺陷修批四件 | **本卷 APPROVE 闭合**（STE 三查+全量复验候接，STE 窗自定） |
| 09-30 18:00-24:00 | 静默探测实施批（allowlist 追加+独立一次 8713 重启） | 不变；上午批已闭，独立重启窗成立 |
| 10-01 0:00-9:00 | FADE-010 三件 | 不变 |
| 候 COO 排窗 | **TriRLC 维护批四件**：①store.ts 缺列镜像修+②ENV_FILE 正形化+③TRILC_INTERNAL_TOKEN+优雅停实弹复测+④updateJobRun 镜像滞后一行修——同仓同底座一次重启结清 | 技术建议 10-01 黄金段，FSD 产能许可下与 FADE-010 并窗（不同仓不同 daemon 可并行），排程 COO 裁 |

## 五、a 案（sg push 腿）联动注

本卷不含 a 案裁决——a 案 root store 甲路/BOD 新发路交叉裁决见本席随发双令（SDE/BOD 各一），验收链独立。

## 使用依据

FSD D-15 卷 fsd-batch-readout-20260930.md（5d90738b）；本席裁定卷 cto-bod-three-items-rm-verdict-20260929.md §七排窗+§八载体；memory trimmc-mlc-addjob-divergence（TriMMC 正形旁证）；8711/8713 面定谳（dual-controller-ports）。
