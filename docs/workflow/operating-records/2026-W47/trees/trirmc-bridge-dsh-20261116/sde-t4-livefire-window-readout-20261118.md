# SDE T4 活体互发窗毕报·①②毕+③阻塞 fail-visible（daemon 陈旧 dist 实锚·restart runbook 全件就绪候令·T4 修笔双单笔）

- sourceOfTruth: 本卷（T4 活体互发窗执行卷正形·deployment log 审计面）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 148 排窗已废承·值席径裁·活体互发案即排令（执行形照 FSD runbook §九·护栏照走）
- 执行窗: 2026-11-17T23:14:19Z→23:26:34Z（date 现查原值·全 D-47 现采·D-24 断言先行）
- 判定: **①生成毕+②落实毕（14 条目×桥工具全挂·值面勘绿）+③真值互发=阻塞 pre-fire（运行 daemon=T2 前旧 dist·spawn claude ENOENT 实锚）——restart runbook 全件就绪（tsc HEAD 绿面探针毕）·rebuild+restart=候令面（护栏「零触现役 loop 链」+cron CEO 门先例=非自授权）**

## §一 · T4 修笔双单笔（施工面·执行前实勘发现·白盒守护）

| 笔 | 仓/commit | 内容 | 白盒 |
|---|---|---|---|
| 生成器 append 面桥工具补挂 | TriCompany **4065c32**（双推 sg bare+github·顶对表 ✓） | runbook ②「14 条目×plugins 各+1」语义对齐：--append-entry-text 文本域绕过 generate() 注入域→pm 零桥工具=T4「每席」违面——injectBridgeIntoAppended() 对象域回环补挂（幂等·13 现役条目值面零改） | **15/15**（+1 组合面） |
| 桥工具 token 面补装 | TriRMC **d5f2196**（推 origin sg bare·河源 pull 同步 ✓） | 活体窗前置实勘：daemon TRIRMC_INTERNAL_TOKEN 已设=门 active（app.ts L172-184·无凭 curl 401 实证）——POST 头零 token=必 401（io stub 白盒测不出·活体窗=终证面反证）——token 同 env 域序补装·零值形头省略照开放形零变·D-46 token 零回显 | **11/11**（+2 token 面） |

## §二 · ①生成毕+②落实毕（R-HY 面）

- **①**：--seats 现役 13 形+append pm+--with-bridge-tool /srv/fleet/TriRMC/scripts/dsh/r-duty-send-message/index.mjs → readout presets_total=13·seats_emitted=13·**bridge_tool_injected=14**（13+1 补挂·修笔生效实证）·gates clean
- 终验：14 条目·桥挂载 14/14 正确形（name=绝对路径 file 形）·**剥桥 deep-equal=PASS（14 席各恰+1 零改）**·pm 补挂在·!!js 28·降权 0
- **②**（T3 形）：回滚锚先行 bak-20261117T231937Z（前态 4337 形 md5 8f922c7d）→落位 b0ddaeb834c48245ea75d61e11ee7333（staging 吻合）→值面勘四门 exit=0/preset 14/桥面 28 命中/降权 3=基座齐平/persona 14 全保留 ✓
- patch 不变面=工具文件会话启动时载入（token 修笔零 regen 生效形·如实注）

## §三 · ③阻塞定谳（fail-visible·零侧效实锚）

- **spawn B（daemon API POST /internal/v1/agents）→ spawn_failed: "spawn claude ENOENT"**
- 根因三面钉死：①源面 session-bridge.ts=T2 dsh 形改指 ✓（断言 1 验面=源面·零 claude 调用点成立）②**运行 dist=2026-11-13 17:02 build（claude 13 命中·dsh 0=T2 前旧形）**③**daemon 起时=2026-11-16 02:10（用旧 dist 起）**→运行面 spawn 仍 exec claude（已卸载 CLI）→ENOENT
- 伴生勘定：daemon agents 注册表=0（T3 reload boots=直 dsh CLI 形不入 daemon 表——B 须经 daemon spawn 注册形·API 面实勘 spawn/list/message 三路由在）·token 门 list 面 ✓ 200（本席 daemon environ 直读形·D-46 零回显）
- 零侧效实锚：spawn_failed 零 registry 残留（list count=0 clean）·A 席 boot 零开火（pre-fire 阻塞）·现役态=②毕态原样

## §四 · restart runbook 全件就绪（候令面）

1. dist 换装：tsc HEAD staging 探针毕=**exit=0 全绿**（/tmp/trirmc-dist-staged-20261117T2327Z·session-bridge dsh 28/claude 3=注释与禁回退文案形零 exec 面）→正式形=tsc rebuild dist（或 staging 换装）
2. daemon restart：**systemd trirmc.service**（system 级·quadmig-2·cmd=node dist/src/index.js）——`systemctl restart trirmc`=root 面=**候 BOD/CTO 通道**（河源 root 链先例形）
3. restart 后复验链（本席 ready 即跑）：healthz（token/env 单元面保留核）→spawn B→list 对表→③真值互发（A=cos 工作区 boot·R_DUTY_SEAT=cos+TRIRMC_INTERNAL_TOKEN env 形→send_message→B 回执→A 收执=真值链）→T5 断言面复勘
4. 候令理由：即排令护栏自携「零触现役 loop 链」+TriRMC cron 生命周期 CEO 门先例（cron 恢复候令在案）——daemon restart=运行面关键变更非本席自授权域

## §五 · T5 断言现势对表

| 断言 | 现势 |
|---|---|
| 1 claude 清零 | 源面 ✓（零调用点）·which claude 零命中 ✓（6c7dd3a3b 承）·**运行 dist 面=候 rebuild**（本卷 §三） |
| 2 三 API smoke | spawn=阻塞（§三）·list=✓（token 面 200 形）·send=候 spawn 毕 |
| 3 SendMessage 回执链 | 候 restart（§四 runbook 3） |
| 4 preset 值面勘 | ✓ 本窗②毕（14 席齐+桥面+降权基座齐平+persona 保留） |
| 5 零回归 | ✓ 8710 healthz 照走读数·sg 面零触·零 daemon 重启 ✓ |

## §六 · 护栏遵行

零 daemon 重启/零触现役 loop 链 ✓（spawn_failed 零残）｜web patch 零写 ✓｜单笔 revert=4065c32+d5f2196 双一键形 ✓｜D-46 全程（token 零回显·curl @file 形）✓｜D-24 断言先行 ✓

## 使用依据

值席即排令（活体互发案·runbook §九）；fsd-t4-code-readout（runbook+残面）；fsd-t4-design；coo-task-charter §五五断言；app.ts 路由面实勘（L189-358·spawn/list/message 形）；session-bridge.ts 源面/dist 面对勘；本卷读数=现采实锚（md5/exit/readout/registry 全 machine-read）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→m-cos→BOD→CEO·restart 候令面随卷·卷面时戳=2026-11-17T23:26:34Z）
