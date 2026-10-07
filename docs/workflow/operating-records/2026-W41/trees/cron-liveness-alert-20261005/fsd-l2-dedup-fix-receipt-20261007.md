# FSD 施工回执 · l2 聚合 relay 去重小修（D-15，判据卷 7aec11ec）

- sourceOfTruth: 本件（FSD 施工回执；判据正身=同目录 cto-l2-dedup-fix-spec-20261007.md 7aec11ec，CTO 口径补丁=DryRun 天然单条时允许构造性验证）
- syncMode: static
- lastSyncedAt: 2026-10-07T06:47:41Z（14:47:41+08，date 现查）
- 施工标的: `%LOCALAPPDATA%\tri-liveness-l2.ps1`（135→142 行；L117 锚前插判据卷唯一正形 6 行去重块+1 空行；禁改面 L1-116/debounce/送信链/-DryRun 通道零触碰）
- 窗: 批 A 毕（14:42 毕报）后接，14:4x 施工毕，17:30 死线内富余

## 一、门禁四条读数（D-45 对表）

1. **改前备份**：`tri-liveness-l2.ps1.bak-20261007` 落位，改前后 SHA256 对表一致（`1D198232…194517D2`）；**备份保留至 CTO 验收毕再清**（门禁④约定）。
2. **安全形实跑探针**（改后即时）：AST Parser 0 错；`pwsh -File … -DryRun` exit=0 → l2.log `2026-10-07T06:46:19Z OK all-hosts`，无脚本错误。
3. **真轮验证**（还原自然态后实跑）：exit=0 → l2.log `2026-10-07T06:47:25Z OK all-hosts`——全 OK 轮，**「零行为变更」证成立**（基线四轮 06:10/20/30/40 全 OK 形态保持）。
4. **回滚通道**：未动用（零异常）；`.bak-20261007` 在位可秒回。

## 二、构造性验证（CTO 口径补丁道；天然轮零 issue 触发）

- 注入：R-HY `/var/lib/tri-liveness/state-2026-W41.log`（当轮最新 statefile）——先 `cp -a` 备份至 `/tmp/l2probe-state-bak`，追加 **2 条全同文**探针行 `ALERT-NEEDED dim=probe dedup-test injected=2x-identical …`（tail -3 窗内双命中 L85-87→修前形态必产 x2 重复条目）。
- 本机 DryRun 读数：l2.log `2026-10-07T06:46:55Z ISSUES x1 (debounce 1/2): dim=relay … detail=ALERT-NEEDED dim=probe dedup-test injected=2x-identical …`——**x2→x1 折叠值面证据**：标题计数 x1、body 恰一份 relay detail 零重复段；debounce 1/2 非送信分支（exit 0，未触 18710）。
- 还原：statefile `cp -a` 回写 → `diff -q` RESTORED-IDENTICAL（真实尾行 `06:45:01Z verdict=ok` 原样在位）；`/tmp` 探针备份即清。
- 痕迹清零：本轮 DryRun 写入的 `l2-failcount`（debounce 计数=1）已删除，恢复注入前空态——06:50 起自然轮从干净基线跑。

## 三、验收锚三条对表（判据卷 §四）

| 锚 | 读数 | 判 |
| --- | --- | --- |
| DryRun+真轮两读数落卷 | 06:46:19Z OK all-hosts（DryRun）／06:47:25Z OK all-hosts（真轮）＋06:46:55Z ISSUES x1（构造性验证轮，合成探针行标注 injected=2x-identical 防误读） | ✅ |
| issues≥2 两两互异／全 OK 轮零行为变更证 | 构造轮 x2 同文→折叠 x1（去重生效值面证据）；自然轮全 OK→零行为变更证 | ✅ |
| l1 探针/18710/sg notify 零触碰 | 真轮正常追加落 log；Send-Alert/pendF/18710 全程未触（debounce 1/2 分支即出） | ✅ |

## 四、账本对表

- 账本条 `l2-aggregate-dedup-minor`：修法照判据卷唯一正形施工毕，本回执+读数呈 m-cto 销账，知会 COS 刷态（照判据卷 §五）。
- 今晚 17:50 起窗⑤链零触碰（本修 14:4x 毕，窗前富余）；19:23 cron c9739989 另案未混。

## 使用依据

cto-l2-dedup-fix-spec-20261007.md（7aec11ec，修法唯一正形+门禁四条+验收锚三条）；m-cto D-15 派工令+DryRun 口径补丁令；tri-liveness-l2.ps1 现读（135 行基线+142 行改后）；l2.log 全读数；R-HY statefile 注入/还原操作记录
