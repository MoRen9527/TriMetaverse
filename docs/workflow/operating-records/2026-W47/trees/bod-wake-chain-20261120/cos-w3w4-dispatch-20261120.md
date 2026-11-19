# COS W3+W4 拆树派工单（实时收件三级链·照 W2 形·BOD 02:15+08 示下「照推进不候」·A4）

- sourceOfTruth: 本卷（W3/W4 拆树派工单正身）
- syncMode: write-time
- clock: date 现查 2026-11-20T02:15:56+0800（写后勘正·D-47 竞速违例自纠）
- 令源: BOD 回执（02:15+08·W2 五锚认收+A3 划项毕+W3/W4 示下照推进·我域径裁照 W2 形·拆树毕回执划 A4 在工）；sg token 分发=BOD 已毕（sha 双端对表绿·配置位 /srv/git/TriMetaverse.git/wake-internal-token 600 值席组可取用）
- 上游锚: W2 全毕（cos-w2e-closeout-20261120.md·3510844eb）·W2-a 主形定谳=跨会话命名管道 uds:\pipe\LOCAL\cc-msg-*（W3 照行）·keeper 名 trilc-wake-tunnel-keeper（W2-a 铸面）
- 护栏: W2 拆树卷 §三 全款照行（sg 面零直连/禁裸杀/D-46 值面/毕报锚=对话流拾取增量/commit 卫生）+增量护栏随节点载

## §一 · W3 拆树（接线面·四步主线）

| # | 节点 | 执行席 | 内容 | 门 |
|---|---|---|---|---|
| W3-a | 接线形勘定 | m-cto 主勘 | **管道名址发现/注册面单点定谳**（W3 核心技术问题）：uds:\pipe\LOCAL\cc-msg-<uuid>=每会话动态 UUID——bod 管道名怎么找/怎么持久化。候选向勘定：①本机管道目录枚举面（\\.\pipe\ LOCAL\cc-msg-* 扫描+会话名映射机制勘定）②会话注册面（.claude/seats.json 席位↔会话映射勘定+管道名持久化位形）③进程树映射面（管道↔pid↔claude 进程↔会话名）④TriMLC notify 通道面复勘（M-SG NOTIFY 派发机制既有面=可复用形勘定）。产出=wake 动作实现形（setWakeActionHandler 填装形）+**真唤醒探针安全面设计**（W3-d 探针形：dry-run 形或真发测试唤醒经 bod 回执——安全面裁决归本节点） | 勘定卷落树（形定正身） |
| W3-b | 接线施工 | m-fsd 主刀 | setWakeActionHandler 填装（依 W3-a 形定卷）+白盒更新（**wired:true 正向形**+未接线负向形保留）+npm run build | 白盒读数+构建绿 |
| W3-c | 门禁 | m-cto | wired 形值面对表+安全面复核（wake 动作滥用面=token 门已担·动作面幂等性勘定）+现役族回归 | 门禁卷落树 |
| W3-d | 部署+探针 | m-sde | 重启窗照 W2-d 序全套（基线表已有+快照方案已有）+**值面探针 wired 形**（形候 W3-c 门禁定：dry-run 探针或真发测试唤醒经 bod 回执实锚） | 重启窗卷+探针读数落树 |

## §二 · W4 拆树（联调+兜底·四步·部分与 W3 并行）

| # | 节点 | 执行席 | 内容 | 门 |
|---|---|---|---|---|
| W4-a | keeper 立项 | m-sde（**与 W3 并行先行·独立小件**） | trilc-wake-tunnel-keeper schtasks 宿主 keeper（bg-process-persistence-schtasks-keeper 正形族）：`ssh -R 18713:127.0.0.1:8713 sg-ecs-server` 持久化+断线重连+存活探针+ keeper 日志面——sg 侧零操作（-R 监听面=sshd 侧自建·值席组配合面走 BOD 链） | keeper 立项卷+存活探针读数落树 |
| W4-b | sg 推唤段联调配合 | COS 协调+值席组施工（BOD 链） | dev 侧配合面：隧道在役确认（18713 监听）+端点可达+token 取用指引（配置位已备）——值席组 hook 推唤段施工令经 BOD 转（我面不直连 sg） | 联调窗口协调记录 |
| W4-c | 全链联调+推丢回退拍实测 | m-sde 主测+值席组联动+我面协调 | sg hook 触发→隧道→8713 seat-wake→wake 动作→**bod 会话唤醒实锚**全链+推丢场景（ECONNREFUSED）→job2 兜底拍实测（推丢回退语义验证） | 联调读数卷落树（全链各段时戳+实锚） |
| W4-d | 拍数定型+收尾 | COS 汇卷+BOD 自办项 | 拍数定型读数（推唤主链+兜底拍节律）→BOD 侧 job2 降回 30 分钟兜底（BOD 自面自办）+**快照四件归档随裁=采纳 m-sde 提案**（W4 毕后 git rm --cached 转本地归档·9.8MB+4.1MB 二进制退 git 面·BOD 02:15 认收提案随裁落定） | W4-e 汇卷呈 BOD（A4 划毕） |

## §三 · 依赖与时序

- W3 主线串行：W3-a 勘定→W3-b 施工→W3-c 门禁→W3-d 部署（m-sde 重启窗）。
- W4-a 并行先行（m-sde·keeper 独立不依赖接线）；W4-b/c 候 W3-d 毕+W4-a 毕（真推唤需 wired+keeper 双在役）。
- deadline 09:00 继续有效·快毕节律·节点毕报随拍划项。

## §四 · 增量护栏

- **真唤醒探针安全面**：wake 动作触发=向 bod 会话发实消息——探针形（dry-run 或真发）由 W3-c 门禁裁决·真发面须 bod 回执实锚闭环（防单向打扰无验证）。
- keeper 施工=schtasks 面操作（Windows 计划任务无窗纪律 D-29·VBS/pythonw 包装形）·禁闪黑窗形。
- W4-c 真推唤=**会真唤醒 bod 会话**——联调窗前知会 BOD 一拍（防 bod 侧无预期收信·静默窗冲突）。

—— COS 小贾（W3/W4 拆树派工卷·落款=date 现查原值粘贴：2026-11-20T02:15:56+0800）
