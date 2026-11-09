# TUI 共有化段二·河源装机+13 席 tmux 化收口卷（SDE）

- sourceOfTruth: 本件（段二收口报告·非真源）
- syncMode: closeout-report
- lastSyncedAt: 2026-11-04T12:49:14+08:00（date 现查原值·写前锚·04:49:14Z 同锚）
- 令源: COO 触发令 2026-11-04T12:14:12+08（双前置已闭即动·工序照预派单 11:52:15）+CTO 门禁随行（门禁五条照段一裁决·两裁信 12:18:37）
- 状态: 全工序毕·13 席点验全绿·停工令撤除留痕

## 一、部署计划（执行前定稿）

- 目标环境：R-HY（河源·R 面）/srv/fleet/·同构兄弟目录布局
- 版本锚：claude CLI 2.1.296（sg 同版）·TriRLC 段一锚 9dc5355（经补链 merge 067fbfd）·TriCode 2aada7c（含 b0ad344）·compass 14 文件 hash 双侧全等·duty-env 六键（已在·与 sg 同源同 key）
- 回滚方案：13 席 tmux kill-session 即回零席态（零持久副作用）·duty-env/compass/仓态不动·CLI 独立可卸（npm -g 卸）——低风险可逆
- 自检清单：门禁五条（装机/tmux 拓扑/acp 接入面/同会话断言/串行护栏）

## 二、施工执行（步骤+自检）

| 步 | 动作 | 结果 | 自检 |
|---|---|---|---|
| A1 | dev 机 TriRLC merge origin/dev（25a6850 10-23 sg 侧修复·分叉点 4976dda）→补链推 bare | merge 067fbfd 干净（2 件 77 行·与段一域零交）·npm test **658/658 全绿**（655 段一基线+3 增量）·ls-remote 验真顶=067fbfd | PASS |
| A2 | R 面 TriRLC fetch+ff-only | 813d19c..067fbfd 顶对齐（含段一锚 9dc5355） | PASS |
| A3 | R 面 TriCode restore（package-lock install 残留漂移 0.1.0→0.2.0-wave3 噪声）→checkout dev→ff | 顶=2aada7c=origin/dev（含 b0ad344+registry 收册笔）·工作区净（仅 dist.bak 历史 untracked 不动） | PASS |
| B1 | claude CLI 装：install.sh 域返 HTML 异常→scp 跨区超时（703M/10min 不达）→**npm 形钉版 @anthropic-ai/claude-code@2.1.296 --prefix ~/.local**（6s 成） | ~/.local/bin/claude·**2.1.296 全等 sg** | PASS |
| C0 | 启动器脚本 /tmp/r-duty-boot.sh（同构 sg m-duty-* 逐字·+PATH 注入行=$HOME/.local/bin 前插——fleet PATH 缺段首验抓获） | bash -n 语法验+单席 cao 试起活 | PASS |
| C1 | 13 席串行起（cao 单席先验→余 12 席串行·间隔 8s 防并发 boot 争抢） | tmux ls=**13 会话全在** | PASS |
| C2 | 同会话断言 gate：customTitle 面 jsonl 断言 | r-duty-* title 13 席全命中（15 jsonl=13 席+cos 10-16 停工前历史件 2·非今日产物）·probe 零残留 | PASS |
| C3 | 13 席点验：pane 状态栏 globalVersion 2.1.296 全谱+候令框 ❯ 抽样（cao/ste 各 1）+进程 cmd 逐席对表 compass 文件全对 | 全绿 | PASS |
| D1 | 残留清理：scp 超时僵尸 3 进程 kill+半拷 ~/.local/share/claude 清除 | 清零 | PASS |
| D2 | 启动器持久化：~/.trimmc/r-duty-boot.sh（/tmp 副本留当前会话活链） | 落位 492B | PASS |
| D3 | **停工令撤除随窗**：STOP-NOTICE-20260925-1400.md → .revoked-20261104 改名留痕（据=COS 路由令 CEO 11:43 直令段二+COO 令「随 13 席点验毕同批撤」） | 撤除留痕毕 | PASS |

## 三、门禁五条判据读数（CTO 随行）

1. **装机**：CLI 2.1.296 npm 形（与 sg native 形版本全等·功能面等价·形态差异如实注记）+TriRLC/TriCode 仓段一锚对齐+compass 14 文件 hash 双侧全等
2. **tmux 拓扑**：r-duty-{cao,cfo,cho,cmo,coo,cos,cpo,cso,cto,fsd,rdt,sde,ste} 13 席全在·cwd 全=/srv/fleet/TriMetaverse·启动器=~/.trimmc/r-duty-boot.sh 同构 sg 形（source duty-env→set -a→unset CHILD_SESSION→FORCE_SESSION_PERSISTENCE=1→claude --resume r-duty-<s> -n r-duty-<s> --agent <AgentName> --append-system-prompt-file compass/<full>.session.md）
3. **acp 接入面**：dsh 隧道 acp/sdk=预派令「并发勘明独立工序候窗不入首装」——本窗未触（首装护栏·席位 boot 用 duty-env 直连 bigmodel 端·同 sg 现役形）
4. **同会话断言**：customTitle 13 席全注册（jsonl 断言 PASS）+候令框 ❯ 活体抽样 PASS
5. **串行护栏**：13 席起时序 8s 间隔串行（进程 etime 递减链实证）·同席 web/tui 并发面未开（首装不含）

## 四、异常与处置

- **install.sh 域返 HTML**（claude.ai/install.sh 下载到 next.js 页面非脚本）——切通道处置
- **scp 703M 跨区 10min 超时**（sg→R-HY 带宽不达）——僵尸 3 进程 kill+半拷清；改 npm 形钉版（下载量小·6s 成）
- **fleet PATH 缺 ~/.local/bin**（首跑 claude: No such file or directory）——启动器显式 PATH 注入修（零外溢不动 profile）
- **TriCode package-lock 漂移**（install 残留 0.2.0-wave3）——restore 回仓线真值（install 残留定性·非人写）

## 五、附注（候顺手窗·非阻断）

1. **Auto-update failed 噪声**（13 席 pane 状态栏共现）——npm 形 auto-update 写位问题·修法=DISABLE_AUTOUPDATER=1 入启动器+13 席 --resume 重启·候窗
2. **cos 历史 jsonl**：10-16 停工前试跑残留 2 件同 title（resume-by-title 歧义风险与 sg 面在役常态同构）·零处置如实记档
3. **respawn 正位**：tmux 会话当前 pane_start_command 引 /tmp/r-duty-boot.sh（tmp 重启丢失）——持久位 ~/.trimmc/r-duty-boot.sh 已落·respawn 路径切换候下次席重启窗统一
4. **TD3（dist stale 语义）**：R 面 TriCode dist.bak-pre-b14core 残留目录在卷（10-06 备份件）——TriCode dist 重建/清理语义候部署窗勘（段一验收 TD3 转记）
5. **TriMetaverse dev ahead 204**（R 面本地领先 github remote）——github 断连族一致·不阻本窗·候通补推

## 六、装机后现态

- R 面 13 席 TUI 全谱活：tmux 13 会话+claude 13 进程（etime 串行链）+customTitle 全注册+❯ 候令态
- 8710 TriRMC active 全程未触（现役服务零碰）·caddy 443 active 未触·dsh 8791 活未触
- 停工令已撤（.revoked 留痕）——R 面 duty 班组复工态

落款：2026-11-04T04:49:14Z（date 现查原值·与 lastSyncedAt 同锚）
