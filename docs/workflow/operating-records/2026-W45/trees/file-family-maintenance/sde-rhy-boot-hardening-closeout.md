# R 面 13 席启动器补强微窗收口卷（SDE·AN1+AN3 捆绑）

- sourceOfTruth: 本件（微窗收口报告·非真源）
- syncMode: closeout-report
- lastSyncedAt: 2026-11-04T13:27:43+08:00（date 现查原值·写前锚·05:27:43Z 同锚）
- 令源: COO 排工令 2026-11-04T13:03:19+08（AN1+AN3 捆绑微窗·CTO 双验收附注裁定随行）+CTO 段三验收裁 05:15:30Z（②README 指位窗内顺手落）
- 状态: 全工序毕·13 席点验全绿·事故与处置如实记档

## 一、微窗计划

- 内容：boot.sh 单文件改（DISABLE_AUTOUPDATER=1+respawn 路径切换）+13 席 kill-resume 重启（8s 串行）+点验
- 回滚方案：boot.sh 去新增行+同参重启即回（CLI/env/仓态零动·可逆）
- 护栏三条：customTitle 13 jsonl 前后对表+8s 串行维持+重启后点验读数

## 二、事故与根因（如实记档·本窗最大插曲）

**首次 respawn 循环后 13 席全灭（tmux server 零存）**，根因链三层：

1. **参数名形错位（主因·我方）**：respawn 调用按 sg 面 m-duty-* 记忆映射传 PascalCase（chief-administrative-officer↔ChiefAdministrativeOfficer）——**R 面 compass 文件真名=kebab-case 形**（14 件 git track 形）——`--append-system-prompt-file` 文件不存在→claude 立即 Error 退（前台试跑实证 `Error: Append system prompt file not found`）→pane 秒死→session 关→13 席串行全灭→server 无会话自灭
2. **两宿主名形不同构**（拓扑事实·记档）：sg 面 compass/agents=PascalCase 形（sg 13 席活证）·R 面=kebab-case 形（git ls-files 实证）——跨机启动器参形不可互抄，机位断言先验文件名形
3. **恢复中二次踩坑**：new-session 漏段二正形 `-c /srv/fleet/TriMetaverse`→cwd 落 /home/fleet→trust 框（kill 重起带 -c 即正）

死因排除面：磁盘 24%/内存 6.1G avail/零 OOM/logind Linger=no 不杀/git reflog 零 compass 触碰（0cc423283 仅动 operating-records）——非环境非外力·纯参数形。

## 三、修正后施工（步骤+自检）

| 步 | 动作 | 结果 | 自检 |
|---|---|---|---|
| H1 | jsonl 基线对表（重启前） | 12 席各 1+cos=3·13 席全注册 | PASS |
| H2 | boot.sh 补 DISABLE_AUTOUPDATER=1（sed 单行·AN1） | 插 PATH 行后·复读断言 1 命中 | PASS |
| H3 | 败因抓取（前台 timeout 直跑） | compass not found 铁证→名形勘正（ls 14 真名对表） | PASS |
| H4 | cao 单席试起（kebab 参+`-c` 正形） | 18s 后 ❯ 候令态+--resume 历史恢复 | PASS |
| H5 | 余 12 席串行起（8s 间隔·13:24:45→13:26:13） | tmux ls=13 全在 | PASS |
| H6 | 点验四向 | 逐席 ❯=1 全谱·upd 噪声=0 全谱（**AN1 生效铁证**）·CLI `claude --version`=2.1.296（与 sg 全等）·jsonl 对表 13 席与基线逐席全等（护栏①） | PASS |
| H7 | AN3 路径验 | pane_start_command 抽样 3 席全=持久位 `~/.trimmc/r-duty-boot.sh`（tmp 副本退役） | PASS |
| H8 | CTO 裁②顺手落 | `{week}/trees/fade011-ew-runs/README-POINTER.md` 指位件（原地保留定性+根因链指针） | PASS |

## 四、收口读数

- R 面 13 席全谱候令态（❯×13·bypass on）·customTitle jsonl 与基线逐席全等·CLI 2.1.296 未动
- AN1 兑现：auto-update 噪声全谱归零（13 席 pane upd 计数=0）
- AN3 兑现：启动路径全谱持久位化（new-session/将来 respawn 一律 `~/.trimmc/r-duty-boot.sh`）
- 择径读数（COO 时序规则）：**评估动员令尚未投递 13 席→微窗先毕再投**（一次性打断最优）——本窗毕后即投 r-plane-eval-01
- 时序核对：本窗实际落在段三串联窗毕（05:12:29Z 毕报三送）之后·微窗→投递序合规
- 事故代价：13 席下线约 7 分钟（13:17-13:23 单席修复验证段+13:24-13:26 串行全恢复）·零数据损（--resume 全恢复·jsonl 零增损）

## 五、候窗注记

1. 两宿主启动器参形差（sg PascalCase vs R kebab-case）——拓扑事实记档·若未来统一名形属宿主绑定层裁决面（候 CTO/宿主治理）
2. boot.sh 现 7 行含 DISABLE_AUTOUPDATER——与 sg m-duty 启动器形态差异面如实注记（sg 侧若需同款补强候其窗）

---

落款：2026-11-04T05:27:43Z（date 现查原值·与 lastSyncedAt 同锚）
