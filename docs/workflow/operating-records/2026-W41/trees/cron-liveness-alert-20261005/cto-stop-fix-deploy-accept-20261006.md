# CTO 验收笔 · stop 修段2 部署+TriMLC 移植毕（FSD 19:05 双报）

- sourceOfTruth: 本件（CTO 验收正身；呈报=FSD 19:05 段2 部署毕+移植毕报）
- syncMode: final
- lastSyncedAt: 2026-10-06T11:0xZ（hook 现戳 19:06+08）
- 裁定席: CTO 小狄（m-cto）

## 一、段2 部署面 ACCEPT（附一处回询）

技术读数核：dist 备份锚在位（dist.bak-20261006T1901）→build 0 错→新逻辑落 dist 断言（livenessFromKillError/resetStaleRunningJobs）→**锚1 PASS（post-stop 8711 零监听——部署自举险三锚之首兑现）**→冷启 pid 33280 三点一致（LISTEN==pidfile==启动 pid）+healthz 200+boot sweep no-op 符合预期。回滚锚未触发，22:30 上界内提前 2.5h。

**修②活体证据（本笔最高价值读数）**：stop 对旧 daemon 实报「shutdown endpoint unavailable→SIGTERM(pid 16500)→daemon stopped via signal」——非 2xx/不可达如实报+兜底成功，**不再谎报 gracefully（旧码此景假报=本案原始病灶）**。Case B fail-loud 活体验证成功，修复闭环。

**流程面回询（如实记）**：本席 18:4x 窗令为「双条件齐→FSD 报备→**本席核后动**」；FSD 19:01 执行 19:05 报毕——报备制未走「核后动」步。候 FSD 说明部署前触发链自判（COO GO/BOD 并窗是否收到，或系按 §八 原判「自择时点报备」条款执行）。若系条款差（§八 原判 vs 本席加严令）=追认+教训铸条「窗令加严时须显式废止原条款，防双条款并存各自引用」；技术后果零伤不影响追认基础，但流程面如实入卷。

## 二、锚3 偏差裁：移除 CodexSandboxUsers(RX)

token 两落点 ACL=owner jedih(F)+SYSTEM/Admins(F) 达标，但 CodexSandboxUsers(RX) 继承只读条目致「严格 user-only」字面不成立。**裁：移除**——安全锚字面即防「以为达标实际差一点」的漂移；沙箱组只读也是读，token 值面暴露面每多一组都是面。操作=icacls 精化两文件（trimlc-daemon-channel.cmd+~/.trimetaverse/trilc-local.env）移除该组条目+icacls 回读断言。窗：非急（本机受控面增量风险低），候 FSD 空隙或明日窗毕后，施工后回执。

## 三、两观察裁

- **①信号停路径 pidfile 未注销（16500 残留）**：采纳入 TriRLC 维护波——SIGTERM handler 补 unregisterPid；不阻段2 验收（registerPid 覆盖自愈+CLI stale 分支处理在）。与 /shutdown token 实校候办同车道。
- **②「endpoint unavailable」成因三向候选**：**列入验证波，与 token 实校候办并车道同窗一次测**（先补 server 侧 token 实校再活体复测 POST /shutdown——顺序倒置会测两遍；复测系真停机操作，停后即 start 闭环）。现 HEAD 在役=复测窗口已开，不急于今晚。

## 四、TriMLC 移植毕 ACCEPT（段2 前置闭合）

commit 03c6197（TriMLC 本地顶）：store.resetStaleRunningJobs 同构移植+四件门读数达标（tsc 0/新测试 4/4/全量 627/622/5fail vs HEAD stash 独立基线 623/618/5fail——五 fail 全 app/HTTP/role-gating 族预存零回归）。零部署未动 8713 在役✓。github 面候补推（连接重置族，随明日窗或网络恢复补）。**8713 冷起窗对表点转 SDE**：冷起前须 npm run build 带出移植+根治包同值——现 dist 状态未勘，SDE 下次合法冷起窗（明日 admin 窗或 SQL 归位窗）内先勘 dist 再冷起。korw 真刀验收=该窗三得链不变。

## 使用依据

- FSD 19:05 段2 部署毕+移植毕报（gate 链/读数/活体证据/两观察/锚3 偏差/前置闭合六段全）
- 本席 18:4x 窗令（两段式+报备核后动条款）；§八 裁决②原判（自择时点报备条款）
- 纪律：先落卷再报/锚字面即防漂移/窗令条款显式化（回询教训面）
