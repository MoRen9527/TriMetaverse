# CTO 条件③快核卷 · A3/A4 步骤单+A5 探针命令单（裁决面）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-condition3-quick-review-20261009.md）
- syncMode: final（快核裁决·条件③闭合面；X1/X2 一项候 BOD 裁后 A3 微调）
- lastSyncedAt: 2026-10-09T03:51:45+08:00（date 现查原值粘贴·初稿 03:50 估算值已勘正）
- 快核对象: FSD A3/A4 合并卷 @b5082736 + STE A5 命令单 @6b3e7568（v1.1 复原笔·COO 03:40 勘正确认）
- 对表正身: cto-sudo-verb-index-20261009.md @e135f445（14 行白名单判据卷·本席拟制）
- 快核结论: **A5=五点全过零修正 APPROVE；A3/A4=整体 APPROVE 附四项裁+一项白名单缺口呈 BOD 二择**

## 一、白名单真缺口（本席设计遗漏·如实认领·候 BOD 二择）

**快核对表发现：白名单 mv 条目只有回滚方向（`.bak-lg066 → 原件`），无施工方向（`原件 → .bak-lg066`）——A3 P4.1（移走 trirmc-mc unit）按稿执行必 403 出集触发 G-1 停。** 系本席 01:3x 拟制白名单动词索引时只按回滚锚设计 mv 方向、漏了段1 施工 mv 的设计遗漏，如实认领。

| 案 | 内容 | 代价/收益 | 本席推荐 |
| --- | --- | --- | --- |
| **X1** | 扩白名单 1 条：`/usr/bin/mv /etc/systemd/system/trirmc-mc.service /etc/systemd/system/trirmc-mc.service.bak-lg066`（本席 root 通道即办+双验证，照 01:32 流程） | 保方案稿「unit 移走防复活」原语义；配置变更走 BOD 批即闭环 | **推荐**（R-HY 远程机不受本机约束，动作一分钟级） |
| X2 | 缩语义：P4.1 不 mv，stop+disable+daemon-reload 为段1 终态（disable 挡 fleet 手动 start 复活；unit 文件原地保留） | 零白名单变更；偏离方案稿「移走」锚需 BOD 认语义变更；root 直启复活面残留（防线弱一档） | 备选 |

**随案锁定（两案通用）**：P1.1/P1.2 备份 cp **维持白名单形**（`cp 原件 → 同目录 .bak-lg066`）——FSD 倾向案「cp 备份落 fleet 家目录」**否决**：R2.1/R-3 回滚 mv 白名单源=`同目录 .bak-lg066`，备份落家目录=回滚 mv 无源可移=**回滚链断**。P1.4 tar 家目录（已有）=第二备份锚，双锚制成立。

## 二、A3/A4 候核五点裁决

1. **P4.1/P1.1 备份后缀序**（§一已裁）：双锚制+X1/X2 呈裁。FSD 发现的「cp/mv 共用后缀自覆盖」观察正确，但根源=白名单 mv 方向缺口非后缀选择。
2. **drop-in 孤儿保留**：**认**。trirmc-mc.service.d/ 原地保留零生效（母 unit 移走后 drop-in 目录孤儿=systemd 不加载），回滚母 unit 回位即复完；白名单 14 行零 drop-in 条目不动；方案稿 §一.2「连同 drop-in 移入」降级注记进 A3 终稿。
3. **Q1.3 tee 回显 token**：**裁=tee 喂原件+`>/dev/null` 丢回显**（`sudo -n /usr/bin/tee /etc/systemd/system/trirmc.service < ~/lg066-new-trirmc.service >/dev/null`——重定向由 shell 处理不进 sudo 参数序列，白名单匹配不受影响）。FSD 备选案「tee 喂 sed 脱敏副本」**禁**：tee 写面=生产 unit 本体，喂脱敏副本=token 行变 `<set>` 字面量写进 unit=重启服务炸。EXPECTED 改「exit 0+事后 `diff <(sed 脱敏形 ~/lg066-new-trirmc.service) <(sudo -n cat /etc/systemd/system/trirmc.service | sed 同形)` 零差」。
4. **施工通道预检两形态**：**认**+补一形：P0.2 并列 `ssh -o BatchMode=yes heyuan 'echo OK'`（sg config heyuan 别名=本席 01:27 实勘现成资产，免 known hosts 首连交互）。三形序：直连→别名→跳板全展开，任一通即过。
5. **MC-3 分裂阈值/MC-4 激活缺陷判读**：**认**（MC-3「mtime 推进+行数变化>0 且内容分叉」定义确定化合格；MC-4 触发=停+报不窗内修正确）。

**附注（窗序面）**：R-1 段1 fail 窗收过夜=8710 暗窗过夜——请 COO 窗序终稿注记「窗收夜 l2/夜航探 8710 预期红=暗窗非故障」防误报刷屏；恢复 mc 走 R-3 候 BOD 令。

## 三、A5 五点对表（STE 命令单 6b3e7568）

| # | 快核点 | 判 | 注 |
| --- | --- | --- | --- |
| ① | 非特权全形（零 sudo） | ✓ PASS | P1/P2 全探 is-active/show/curl/find/stat//proc 读形，对表索引 §三 |
| ② | token 零值出机 | ✓ PASS | `grep -c` 计数形（P1-4/P2-6）+dash 兼容管道勘形注记在卷 |
| ③ | 红线内建 | ✓ PASS | neg 401 两形止步+「正确 token 禁触发」+「禁写面试打」显式 |
| ④ | 判据与窗令 v2 等价 | ✓ PASS | 段1 三探针=N3 语义；段2 三判据逐条量化；「到点真触发」归 72h 窗=升格①；R-1/R-2 两层分形（回端口≠回架构）语义清晰；trirmc-mc `disabled 或 not-found` 双值预期覆盖 P3.3/P1-1 两时点差 |
| ⑤ | 代码级预期值面 | ✓ PASS | healthz 全形 app.ts L116-142/401 形 L156-158 实锚；「计数=1 为 401 预期前提（门 unset=fail-open）」联判防误读=好设计；mcLedger/Cron 块与 FSD P6.1 不冲突（更严） |

分位声明（P2-4 本机两件 8711/8713 归本机窗段 STE 补探）**对**——sg 值席不可达本机 dev 面，防假覆盖如实。

## 四、条件③闭合判定

- **A5：APPROVE（终稿即正形）**。
- **A3/A4：APPROVE（附本卷四项裁进终稿）**；P4.1 形候 X1/X2 BOD 裁后 FSD 微调一步——**该项不阻条件③闭合**（语义两案皆已确定化，BOD 裁哪案走哪案）。
- 随卷转 COO：三齐条件②（试水拾取链）+③（本卷）已齐面，v3 窗令出令面候 BOD 对 X1/X2 的裁。

## 使用依据

- FSD A3/A4 合并卷 @b5082736；STE A5 命令单 @6b3e7568（v1.1）；cto-sudo-verb-index-20261009.md @e135f445（白名单正身判据）
- 窗令 v2 @a60b36b9+§九注记 @7eefc95f；FSD 合并方案稿 @055c40a7
- 8713 通知链勘修实证（本席 2026-10-09 03:4x 毕报）：403/400 实锚+白名单参数序列=匹配面机理（source_seat 形 403 实测）——X1 扩条命令形经实弹验证通路
- BOD 03:44 排程裁断（8713 件并入晨窗/sg 件候 LG-066 毕后窗）
