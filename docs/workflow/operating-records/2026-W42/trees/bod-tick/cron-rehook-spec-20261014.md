# BOD 四时点 cron 重挂规格（重启续命存档）

> **【已废止·2026-10-14】** D-52 报到制随 CEO 14:24 终审签批立条（纪律册 4e02402·先立后破同批废止）——本件 §重挂规格表已平移为清单正本 `TriCompany/docs/workflow/onboard-work-registry.md` §五附录（内容不变）；后续重挂一律照清单正本，本件仅存历史（内容冻结不动）。
> sourceOfTruth: 本文件=BOD 值守连续性存档（非合同非纪律正身）；制度化候 CEO 裁，裁后走 COS→CAO 入册链
> syncMode: static · lastSyncedAt: 见卷尾落款

## 背景（CEO 2026-10-14 11:1x 问询「重启是自动挂还是要提醒」）

节拍/信箱双点 cron 挂 BOD 会话内存（session-only），重启即失；现状=**非自动挂**，靠人提醒。BOD 非人格无记忆只能靠制度或提醒——本文件=制度成立前的机械续命存档：任何新 BOD 会话照本规格重挂，一分钟恢复。

## 重挂规格（2 job·4 时点）

| job | cron | 内容要点 |
|-----|------|---------|
| 节拍转报 | `9,39 * * * *` | 读 `D:/Code/ai/TriMetaverse/docs/workflow/operating-records/<当 ISO 周目录>/trees/bod-tick/tick-latest.md` 转报 CEO；拍时戳超 12 分钟旧报上一拍并注明；token 值面禁进转报 |
| 信箱兜底巡检 | `11,41 * * * *` | date 现查落款；读 `D:/Code/ai/TriMLC/notify-mailbox.json`（顶层键=`letters`）；筛 read=false 且 target_seat∈{bod,board}；最多 5 封 latest 优先；JSON.parse→改→writeFileSync 禁文本行编辑；仅本轮已转报的落 read=true；零未读只报一行 |

- 重挂法：CronCreate 两条（recurring=true·session-only 照旧）。
- 错峰注：sg daemon 拍点=:07/:37（tick 文件生成），BOD 读点=:09/:39（+2min 错峰）；信箱=:11/:41。

## 制度化建议（候 CEO 裁·裁后 BOD 发令走 COS→CAO 链）

1. **纪律条（主·CAO 入册 D-系）**：BOD 会话启动/复活后第一轮值守动作=自检四时点 cron 在挂状态，缺即照本规格补挂，补挂报备一行——不靠任何人提醒，新会话自查自补；
2. **载体行（board 开工前置核查节·随下批渲染生效）**：「四时点 cron 自检缺即补挂」；
3. **机械兜底（候补·可缓批）**：8713 daemon cron 加 tick 陈旧探测（>15min 未更新→信箱落 letter 催），把「静默死」变「有信催」。

归属：制度与提醒机制归 CAO（秘书处机制域）；CHO 为人事域不涉。

## 本轮连带勘得（随存档记·候 CAO 对轨）

- **sg duty-cos 框提交正形**：tmux send-keys key 名 `Enter`/`C-m` 在滞留 paste 态失灵，**`-l` 送裸 CR 字节可达**；连发删键（0.03s/0.2s pacing 均试）被应用侧合并吞没，单键有效——补 tmux Enter 吞噬坑族；
- **D-47 族新变体自领**：框内预置「执行毕」读数稿，执行滞后于文案（transcript `a password is required` ×64 在案·sudo -n 失败未补跑）——被 Enter 吞噬拦下未扩散，值面核查（find 仍=87）拦住虚报；正形=报文写前必跑（D-47 双保险既有条款）；
- **sg root 操作正形**：走 `M-SG-47.245.122.61` root 直连（本机 ssh config 现成），fleet 侧 sudo 需密勿再绕。

—— 落款（date 现查）: 2026-10-14 11:40:07 +0800
