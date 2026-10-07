# CTO 修复判据 · l2 聚合 relay dim 重复入列（候办 l2-aggregate-dedup-minor）

- sourceOfTruth: 本件（CTO 修复判据正身；施工=FSD 车道，D-15 派工）
- syncMode: final
- lastSyncedAt: 2026-10-07T05:2xZ（date 现查 13:2x+08）
- 裁定席: CTO 小狄（m-cto）；施工席: FSD 小全（m-fsd，批 A 毕后接）
- 窗: 今日 D-23 禁排区例外窗（CEO 13:14 令）内，**17:30 前毕**，不碰今晚 17:50 起窗链

## 一、缺陷定位（本席实勘，file:line=%LOCALAPPDATA%\tri-liveness-l2.ps1 部署位现读）

- **根因**：L56 R-HY 探测命令尾段 `tail -3 $SF` 取 l1 statefile 尾 3 行 → L85-87 `elseif ($l -match 'ALERT-NEEDED')` 对**每条**命中行各自 `$issues.Add(...relay...)`——statefile 尾窗内同一/多条 ALERT-NEEDED 行=单轮 verdict 内 relay dim 重复入列（标题计数 xN 虚高、body 重复段）。
- **危害面**（如实，低危定级依据）：只虚增条目数不改变告警方向判断（debounce 2 轮+送信逻辑不受影响）——与 24h 判决卷定级一致。
- **波及面**：全列表去重同时覆盖 M-SG 段 STALE 行（L110-112）同类潜在重复，一并封住。

## 二、修法（唯一正形，最小写面）

**L117 `# ============ verdict + debounce + alert ============` 之前**插入：

```powershell
# dedup: statefile relay lines can repeat within one round (LG-064 maintenance wave)
if ($issues.Count -gt 1) {
  $uniq = [System.Collections.Generic.List[string]]::new()
  foreach ($i in $issues) { if (-not $uniq.Contains($i)) { $uniq.Add($i) } }
  $issues = $uniq
}
```

- 语义=**轮内精确串去重**：非空跑零行为变更（不同缺陷条目全保留）；重复条目折叠。选全列表去重而非仅 relay 段：更简、波及面全覆盖、非重复场景严格等价。
- 禁改面：L1-116 探测/入列逻辑、debounce 计数、送信链、-DryRun 通道**一律不动**。

## 三、施工门禁（D-45 对表）

1. **改前备份**（live-first-write 语义）：`Copy-Item tri-liveness-l2.ps1 tri-liveness-l2.ps1.bak-20261007`；
2. **安全形实跑探针**：改后先 `pwsh -File tri-liveness-l2.ps1 -DryRun`（L134 DRYRUN 通道只落日志不送信），读数=日志含 `DRYRUN-ALERT` 或 `OK all-hosts` 且无脚本错误；
3. **真轮验证**：触发一轮实跑（去 -DryRun），l2.log 新增行读数如实记（issues 空则 `OK all-hosts` 即证零行为变更；有 issues 则条目无重复）；
4. **回滚通道**：探针异常→`Copy-Item .bak-20261007 → 原名` 秒回+备份保留至验收毕。

## 四、验收锚

- DryRun+真轮两读数落卷（本树 fsd 回执件）；
- 若轮内 issues≥2，断言两两互异（去重生效值面证据）；全 OK 轮则记「零行为变更」证；
- l1 探针/18710 通道/sg notify 链零触碰读数（l2.log 正常追加即旁证）。

## 五、账本对表

- 账本条 l2-aggregate-dedup-minor：本判据落卷即「修法已裁」，FSD 施工回执+验收读数毕由本席销账，知会 COS 刷态。
