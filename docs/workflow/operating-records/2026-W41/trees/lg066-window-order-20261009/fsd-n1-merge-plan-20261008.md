# FSD 合并方案稿 · LG-066 TriRMC 双单元合并（N1 技术门候审材料）

- sourceOfTruth: 本件（FSD 方案稿；候审判据=CTO N4 预裁 136dff92 + 双卷联合评估认账 d95018fe/66fbab3b + 任务书施工纪律五条）
- syncMode: static
- lastSyncedAt: 2026-10-07T16:03:50Z（date 现查，=+08 10-08 00:03:50）
- 两刻制: 受令刻=2026-10-07 深夜今夜加道令（BOD 令文原时点见其令文存照，本卷不复制估读值）/ 本卷发稿刻 16:03:50Z（现查）
- 实勘基线: 全部结论出自发稿前一小时的深夜活体现探（R-HY ssh systemctl/ls/stat、dev 本机 config/launcher/healthz、sg 脚本 grep），无一项由文档推定；跨机消费方清点=CTO 升格③，我这边 dev+sg 面已扫，R-HY 对外暴露面窗前复扫回填（§六）。

## 〇、活体实勘基线（方案三面共同地基）

R-HY（ssh 实探，10-07 深夜时段+08，发稿前一小时窗内）：

| 项 | trirmc 本体 | trirmc-mc |
| --- | --- | --- |
| 监听 | 127.0.0.1:8712（loopback） | 0.0.0.0:8710（全网卡） |
| cron | enabled，store 在 /var/lib/trirmc/cron/ | CRON_ENABLED=false，无 cron 目录 |
| CONFIG_DIR | /var/lib/trirmc | /var/lib/trirmc-mc |
| INTERNAL_TOKEN | 08e07c8b…（本卷只记指纹尾，值面禁回显） | d2cd071c…（**与本体不同值**） |
| MemoryMax | 600M | 同（drop-in 共享） |
| 共享 drop-in | EnvironmentFile=/srv/fleet/trimodel-data/api-token.env + TRIRMC_TRIMODEL_API_URL=http://8.155.54.79:3333 | 同 |
| 运行身份/ExecStart | User=fleet，WorkingDirectory=/srv/fleet/TriRMC，/usr/bin/node dist/src/index.js | 同（同一份代码同一实例形） |
| mc-store.sqlite | 在（10-01 陈旧，18.9MB） | 在（10-06 活跃，20.5MB，MC 面真数据） |
| config-cache.json | 新鲜（周期拉取自 3333） | 同样新鲜（mc 实例也在拉） |

dev 面（本机实探）：

- dev TriRLC 8711 出站：`trirlc-daemon.ps1` L11 硬编码 `TRIMC_BASE_URL='http://8.155.54.79:8710'`——**dev TriRLC 是 R-HY 8710 的活出站消费方**；现态 degraded（healthz `mc_peer:"trirmc"`+`trimc:"degraded"`）=记忆在册的「R-HY 401 pull_denied」候办，非合并新伤。
- dev TriMLC → R-HY https://8.155.54.79（TriModel 3333 公网面）——相邻面，合并零触碰。
- TriRLC 代码默认值 `env.ts:162 trimcBaseUrl ?? 'http://127.0.0.1:8710'`——**族约定「trirmc 住 8710」已写进代码默认**，与 CEO 端口终态天然咬合。

sg 面：tri-heartbeat-check.py 零 R-HY 端口引用；sg 侧无指向 R-HY 8712/8710 的活配置实锚。

## 一、监听端口收敛语义（面①）

**段1（合并收敛，本体留 8712）**：

1. `systemctl stop trirmc-mc && systemctl disable trirmc-mc`——mc 面停止即 8710 暗窗开始（见 §三消费方影响）。
2. unit 文件处置：备份锚先行（纪律①），`/etc/systemd/system/trirmc-mc.service` 连同其 drop-in 移入备份位（`mv` 至 /root/lg066-backup/ 或同效只读位），`systemctl daemon-reload`；断言 `list-unit-files` 零 trirmc-mc 残留=段1 完工判据之一。
3. 本体零改动全绿验收：8712 healthz+cron 面值面探针照旧（cron store 未动、token 未动、CONFIG_DIR 未动）——失败窗止于此，端口零动作（预裁原文）。

**段2（端口迁移 8712→8710，前置门=段1 落卷）**：

1. unit env `TRIRMC_PORT=8712→8710`（drop-in 或 EnvironmentFile 单点改，实勘时点定位确切落点）+ **`TRIRMC_HOST`/bind 显式定为 0.0.0.0**。
   - **绑定地址裁决建议（候 CTO 判）**：8710 现绑 0.0.0.0 的存在理由已实锚=dev TriRLC 跨机出站消费（§〇）；合并后该消费方语义必须保全，故 8710 必须保持 0.0.0.0，token 门为唯一安全控制（401 fail-closed 现役已在）。本体历史上 loopback-only 的收敛姿态随 8712 空置自然消亡——不保留双姿态。
   - TRIRMC_MC_DB_PATH 段2 起指向收敛后位置（见 §二.3）。
2. `systemctl restart trirmc`+restart 完工判据照纪律③（ExecMainStartTimestamp＞施工时点）。
3. 回滚判据窗前量化预置（升格②）：restart 后 5min 内 ①8710 healthz ok ②l2 探针回对（改址后）③cron 首滚=绿；任一不达**人工判回滚**（unit env 单值回 8712/127.0.0.1+restart，秒级），非自动。
4. 8712 空置时序照升格①：段2 验收毕+消费方确认前空置，并轨 N3 72h 观察窗（10-12 晚毕后放归服务域池）。

## 二、CONFIG_DIR 数据面迁移细案（面②，copy-not-move）

**方向裁决**：合并后唯一 CONFIG_DIR=**/var/lib/trirmc**（本体目录全保：cron store 在此、token在此、周期拉取链在此——动它=最大回滚面）；mc 目录**只读复制不迁移**（预裁 copy-not-move），旧目录原样保留为回滚锚+MC 面数据保全位。

逐项处置表：

| 项 | 现势 | 处置 | 理由 |
| --- | --- | --- | --- |
| /var/lib/trirmc 整目录 | 本体活数据（cron store+本体 cache+本体 mc-store+settings） | **零触碰** | 唯一存续面；cron 周迁移 job（9c81c7ec 族）与其日志免搬迁 |
| /var/lib/trirmc-mc/mc-store.sqlite | MC 面真数据 20.5MB（10-06 活跃写） | 段1 停 mc 后 sqlite checkpoint，复制→/var/lib/trirmc/mc-store.sqlite（覆盖本体那份 10-01 陈旧副本）；wal/shm 同步处理 | 合并后 MC 面若被再消费，数据不丢；本体陈旧副本以 mc 侧新值为准。**回填项**：复制前对两库做只读 sqlite 表清单盘点+行数对表留档（施工锚，禁凭大小推定内容） |
| /var/lib/trirmc-mc/config-cache.json | mc 实例自拉缓存（新鲜） | 不复制 | 缓存可再生（合并体自拉同一 3333 上游）；复制反引入过期污染 |
| /var/lib/trirmc-mc/settings.json | 185B（两目录同尺寸疑同文） | 施工时点只读 diff 实勘：同文则零动作；有差则差异项逐条列出候裁，禁静默择一 | 语义保全优先 |
| /var/lib/trirmc-mc/s3-backup 变体 | 备份链 | 不动（旧目录整体保留即天然保全） | copy-not-move 红利 |
| token 值面 | 双值并存（§〇） | 合并后单值=本体 08e07c8b…（env 不改零动作）；mc token d2cd071c… 随 unit 消失自然退役 | 消费方对 token 的依赖关系见 §三 |
| TRIRMC_MC_DB_PATH | mc unit 独有 env 指向 mc 目录 | 段2 起（若保留该 env 语义）指向 /var/lib/trirmc/mc-store.sqlite；若合并体代码默认已同路径则显式写明等价 | 避免「复制了数据但进程读另一份」的假迁移 |

属主/权限：两目录现 fleet:fleet；复制操作以 root 执行后 `chown fleet:fleet`+`find -user root` 清点归还（纪律⑤款）。

## 三、面路由语义保全（面③，消费方清单与联动面）

活体清点结果（实锚逐条）：

| # | 消费方 | 现读数 | 段1 影响 | 联动动作 |
| --- | --- | --- | --- | --- |
| 1 | **dev TriRLC 8711 → R-HY 8710**（trirlc-daemon.ps1 L11） | 活出站，现 degraded 401 | 8710 暗窗：degraded→unreachable，**无新降级类**（本已不通） | 段2 后 8710 复活即回 degraded 可达态；**认证恢复不属本件**——token 对齐候办须照合并后单 token 面收敛，时序建议=合并毕再修候办（修一次对准终态，禁合并前预修猜 token） |
| 2 | **tri-liveness-l2.ps1 → R-HY 8712 healthz**（L92 ssh 探针） | 活探针（LG-064 观察窗在役） | 段1 零影响（本体留 8712） | **段2 同窗原子改**：探针 URL 8712→8710（联动面六项之一，窗前脚本化） |
| 3 | l2.ps1 `systemctl is-active trimc` 断言（L92 同行） | **stale 旧名**：R-HY 实探 `trimc` unit 不存在（inactive 恒真）——现存潜伏误报源 | 无（本就悬空） | **联动清洗清单**：unit 名勘正 trimc→trirmc，随段2 联动窗一并改（我方 dev 侧脚本，零 R-HY 风险） |
| 4 | dev TriRLC env `TRIMC_NOTIFY_SG_URL=http://47.245.122.61:8710` | **stale 指针**：sg 8710 旧公网面 09-30 M2 已退役 | 无关 | 非本件范围，**入清洗清单候 CTO 域**（同族 stale 指针一次清） |
| 5 | TriModel UI 四签「R 服务域」行 8712 文案 | 卡面值面 | 段1 不动（中间态不进卡面，CPO 条件③） | 段2 升版轮（预裁已定，走升版流水线非手工） |
| 6 | mc_link_check.py | 本地 8711/8713 检查+`mc_peer:'trirmc'` 字段断言 | 零影响（peer=族名语义非端口） | 零动作；其 8710 注释系陈旧 docstring，随手勘正随卷 |
| 7 | sg tri-heartbeat-check.py | 零 R-HY 端口引用（grep 实锚） | 无 | 无 |
| 8 | R-HY cron store（本体目录内） | 周迁移 job 在役 | 零触碰 | 零触碰（§二表裁定红利） |
| 9 | 跨机消费方（sg/其他→R-HY 8712） | **窗前清点回填毕（2026-10-08 00:40-00:46 +0800 实勘窗；两端实证=dist build 文件时戳 00:40 与 hook 时戳 00:46:48）**：①R-HY ss 实锚 8712=127.0.0.1 loopback-only（跨机消费者物理不可达）+8710=0.0.0.0（trirmc-mc face，pid 2062569；本体 8712 pid 2064924）；②R-HY 配置面 8712 引用仅 trirmc.service/trirmc-mc.service 两 unit 自身，机上零第三方引用；③sg 出站活连接→8.155.54.79 采样时刻零；sg 配置面指向 R-HY 871x 唯一活件=`/home/fleet/.trilc/duty-night-patrol.py`（fleet crontab `*/30`，仅 `DNP_PEER_URL=8.155.54.79:8710/healthz` GET 巡检，不碰 8712，对 mc-face↔本体身份无断言，段2 后 healthz 形态同 `ok:true` 巡检零影响且语义更对）；其余命中=sg `~/.claude/file-history` 历史快照非活配置（排除） | — | **清点结论：8712 跨机消费方=零实锚达成，段2 放行硬前置闭合**（本行即回填件） |
| 10 | 相邻面 R-HY 3333 TriModel | dev TriMLC 消费中 | 零触碰 | 零触碰（写入边界红线） |

段2 联动面六项（预裁清单）对表落位：systemd unit env✓（§一.1）/启动器 env（R-HY 面无独立启动器实锚，窗前确认）✓/UI 文案升版轮✓（#5）/endpoint 值面✓/探针族✓（#2+#3）/文档与记忆条✓（随本卷+施工卷）。

## 四、N4 分支并卷结论

照 136dff92 同窗分段连环+段间硬绿门执行，本稿三面均给出可施工细案，**三面无「不成立」面**，无硬凑项；开放点全部收敛为 §六候裁/回填清单（不阻塞方案成立性）。双卷省面辨析照认账执行（验证锚一个不少）。CPO 产品条件三条全收：暗窗超窗宁诚实降级过夜不放水绿门；段2 终验含端到端消费链（预期口径=#1 恢复至 degraded 可达即达标，认证绿=候办件非本件承诺）；中间态 8712 形不进卡面文案。

## 五、施工序对表（段内步骤，窗前脚本化预备）

- 纪律五条 verbatim 全带（任务书 §施工纪律）：①备份锚先行（unit 文件+配置目录两件）②restart 清单 systemctl 实勘枚举禁按端口想当然③完工判据=ExecMainStartTimestamp＞施工时点④trap 回滚锚全程在挂⑤token 值面禁回显进会话链；生产数据与冻结面不越；零敏感值出机；R-HY root 身份操作后 find -user root 清点+chown 归还。
- 段1 序：备份锚（unit+drop-in 打包落备份位）→ §六回填项清点（跨机消费方+两 settings diff+两 mc-store 只读盘点）→ stop/disable trirmc-mc → unit 移备份位+daemon-reload → 残留断言 → 本体 8712 全绿验收落卷。
- 段2 序（前置=段1 卷）：unit env 端口+bind 单点改 → l2 探针脚本改址（dev 侧预commit，触发窗）→ restart → 5min 三判据量化判读 → 绿则联动面余项原子扫尾（UI 升版触发）→ 段2 卷；任一不达=人工判回滚（预置单值回改脚本）。
- N3+ 端口全表交付件照任务书（8710 复活断言+8712 空置断言+3333 不动断言，ss 全枚举）。

## 六、候裁与回填清单（不阻塞方案成立，逐条有主）

1. **跨机消费方窗前清点**（升格③，回填 §三#9）——窗前 ss/配置面复扫，我方车道可承接 10-08。
2. **8710 绑定 0.0.0.0 裁决**（§一.1）——建议保持，候 CTO 判。
3. **settings.json 两目录 diff 实勘**（§二表）——施工时点动作，有差候裁。
4. **mc-store 复制前只读盘点**（§二表）——施工锚，防盲复制。
5. **TriRLC token 对齐候办时序**（§三#1）——建议合并毕修，候 CTO 排窗确认。
6. **stale 指针清洗**：l2 `trimc` 名（#3 随段2 窗）/TRIMC_NOTIFY_SG_URL sg 8710（#4 候 CTO 域）。
7. R-HY unit 面无独立启动器实锚——窗前 systemctl cat 复核 EnvironmentFile 全量，防漏 env 落点。

## 使用依据

- 任务书 task-charter-lg066-trirmc-merge-20261006.md（目标形态/端口终态/N4 条款/纪律五条）
- CTO N4 预裁 136dff92 + 双卷联合评估 d95018fe/CPO 66fbab3b（分段连环/升格三条款/省面辨析）
- 活体实勘：R-HY systemctl cat trirmc{,-mc}.service+drop-in、/var/lib 双目录 ls-stat、list-unit-files trimc 悬空实证；dev trirlc-daemon.ps1 L11+env.ts:162+8711 healthz、l2.ps1 L92、sg heartbeat grep；N2 回执卷（sg 8710 退役在案）
