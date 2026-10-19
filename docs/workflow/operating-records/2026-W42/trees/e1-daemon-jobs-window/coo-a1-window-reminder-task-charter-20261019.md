# A1 任务书草案 · 余三 daemon 窗起提醒 job 复制推广 · 2026-10-19

- sourceOfTruth: 本卷（A1 施工任务书草案·候 CEO 确认后生效——D-39 增补段任务书面 CEO 确认制）
- syncMode: static（草案 v1·承 CEO 2026-10-18 评审批「进下周周一窗」+CEO 2026-10-19 13:20:05 五组裁决 A1「拆任务书进周一窗」）
- lastSyncedAt: 2026-10-19 18:2x +0800（date 现查·动态生成·写前闸）
- 排工位: COO 小营（拆任务书·实现走 CTO 线照裁决路径）
- 依据链: CTO 方案稿 e1b2ba891（单巡检 job 动态读台账主案·施工位递推 8713→8711→8712→8710）+COO 会签卷 1db9d27ca（10-14）+8713 首铸卷 3091eece0（E1-1 生产值守态上线现役）+cto-segment2-restart-window-record-20261017

## 一·目标态

余三 daemon（8711/8712/8710）各部署窗起提醒 job·与 8713 现役对齐——**四 daemon 窗起提醒全覆盖**（CEO 10-14 21:26「四个 daemon 都立」原裁+10-18 评审批进周一窗）。机制：job 5min 巡检读台账 front-matter windows·窗起/窗毕 ±5min 容差判拍·落卷 trees/window-reminders。

## 二·对象断言（机位矩阵硬规则·daemon-plane-locality）

| daemon | 机位 | 域 | 现态 |
|---|---|---|---|
| TriMLC 8713 | 本机 | M 面本地域 | **现役上线**（模板·3091eece0） |
| TriRLC 8711 | 本机 | R 面本地域 | 候部署（ALLOWLIST 追加+重启） |
| TriMMC 8712 | sg | M 面服务域 | 候部署（SSH·ALLOWLIST 追加+重启） |
| TriRMC 8710 | 河源 | R 面服务域 | 候部署（SSH·BOD 特批现行权界·job 配置非 dsh 面） |

## 三·施工内容（每 daemon 同构·照 8713 先例四步）

1. **脚本部署**：window-reminder-patrol.mjs 部署至各 daemon 消费位（照 8713 现役版·幂等状态落各自 DATA_DIR）。
2. **ALLOWLIST 追加**：cron command 白名单精确等值追加（新 command 全串）——TriRLC 白名单纪律：任何变更=必追加+重启（双入口 fail-closed）。
3. **daemon 重启载入**：照勘修窗三件套正形——watchdog Disable→POST /shutdown（根路径·token 门）→验 port FREE→冷启（schtasks/对应启动器·禁裸杀）→pid/CIM 对表→watchdog Enable。
4. **job 注册+三查**：addJob 后判定三查=①返回 201 ②next_run 值面非空且合理 ③enabled=1（三 daemon addJob 行为分野·201≠会触发·F-3 家族性照防）。

## 四·窗位申请（D-23 对轨·白名单第一类=daemon 勘修重启窗）

- **8711 本机**：建议今晚（10-19）19:30-20:30 独占窗——独占+护栏齐备方开窗（回滚锚=ALLOWLIST 追加行可逆摘除/止损线=重启后 healthz+job 三查 15min 内不过即回滚/值守位=施工席全程在场）。
- **8712 sg**：8711 毕后另窗（建议明晨 10-20 0:00-9:00 GLM 黄金段子段·对 sg 值席先知会·SSH 通道照现行权界）。
- **8710 河源**：8712 毕后另窗（同上段位·河源值守面先知会·BOD 特批 SSH 权界内）。
- 三窗不并排（单 daemon 独占·互不叠窗）；各窗起前值守面知会信照发（机制本体即此事·施工窗自身先身体力行）。

## 五·护栏（全窗通用）

- 只追加不改动：既有 cron job 零触碰（各 daemon 既有 job 清点前置+毕后对表断言零差异）。
- 重启链正形照勘修窗三件（TriMLC 2026-10-11 先例）·禁裸杀禁跳步。
- token 值面零回显（D-46）·ALLOWLIST 追加行 diff 单行可审。
- 施工窗与值守面重叠先知会（133 笔秩序承诺·机制化的源头教条）。

## 六·验收门

- 每 daemon：job 三查绿+窗起判拍端到端旁证（落卷 trees/window-reminders 对应 daemon 目录）+既有 job 零差异断言。
- 总验收：四 daemon job 配置同构对表（CTO 门禁卷）+连续两窗起周期判拍零漏拍。
- 毕报三送：COO/CTO/COS·BOD 对表销账（A1 清结）。

## 七·候确认项（CEO 过目）

1. 本任务书面生效确认（D-39 任务书面 CEO 确认制）。
2. 三窗窗位确认（本节四·或改排）。
3. 施工人认定：CTO 线自施工或派 SDE/FSD（CTO 域内自决·本任务书默认 CTO 线）。

—— COO 小营（date 现查动态生成·草案候批·候批不施工）
