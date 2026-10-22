# SDE 毕报卷 · D' Windows 装机部署窗（dsh 装机+spawn 适配+TUI 四态复验全绿）· 2026-10-21

- sourceOfTruth: docs/workflow/operating-records/2026-W43/trees/sde-dprime-windows-install/reports/sde-dprime-install-closeout-20261021.md
- syncMode: static（毕报卷·D' 装机节点收口）
- lastSyncedAt: 2026-10-21 11:30:20Z（+8=19:30:20 北京·date 现查原值·写前现查）
- 执行席: SDE 小布（m-sde）·COO 派工令（c6c830772·死线提前急令重排 18:46）·基线 checkpoint TriRLC 813d19c/HEAD 3837ba3
- 施工位: 本机 dev（TriRLC 仓+全局 npm+~/.dsh）·四态复验照验收卷 2b 口径（code-state.md 段 2 收口条目）

## 部署计划（回滚方案先行）

- 目标环境: dev 机 Windows 11·TriRLC TUI --acp 段 2 交付装机（源码态·无 installer）
- 版本: trilc@0.9.0@3837ba3（基线）+ dsh@**0.2.0-rc.2**（**preview 期版本钉住**——registry latest=0.2.1-rc.2 未经验证不取·与河源现役+段 2a/2b 已验证版本一致）
- 回滚锚（全程可用·零操作回滚）: 现役面零触碰（8711/8713/TriRLC 源基线全程在册）——回滚=npm rm -g @deepseek-ai/dsh+删 ~/.dsh+git revert 07549a5（TriRLC 单 commit 独立可逆）
- 自检清单: 窗前断言六项→依赖/build→dsh 装机→凭据装载→spawn 适配→TUI 四态→全量回归

## 窗前断言六项（对表段 18:41-18:48·全绿）

| # | 项 | 读数 | 判 |
| --- | --- | --- | --- |
| ① | A1 双锚 | HEAD=3837ba3 工作区零脏·813d19c ancestor YES·代码面 diff=0 行 | ✓ |
| ② | 双 daemon 活体 | 8711 pid 26472 uptime 4.2d jobCount=1 / 8713 pid 19444 uptime 4.2d 均 ok | ✓ |
| ③ | npm lock 完整 | dry-run 18s·1 平台 optional 差异=预期形·node_modules 137 entries·trimodel 链接在册 | ✓ |
| ④ | tsc --noEmit | exit=0 零红 | ✓ |
| ⑤ | 电源面 | CIM 现查 SurfaceBattery BatteryStatus=2（AC 在线）·65% 硬件健康——**LG-069 定性=TriMLC powerMonitor 睡眠唤醒后读取链断**（readFailures=8·lastReadAt 冻结 10-20 22:59 睡前·acOnline=false 系睡前缓存与 CIM 现查矛盾）——非结构性无电池（窗前令文候选假设被现查否）·8713 非窗内对象候窗报 FSD | ✓ |
| ⑥ | 进程/tmux | node 面=服务族+双 daemon 无孤儿 | ✓（tmux 读数勘误见附注④） |

## 部署执行（步骤→读数→自检）

| 步 | 操作 | 读数 | 自检 |
| --- | --- | --- | --- |
| 1 | npm install（对 lock） | up to date 1s exit=0 | ✓ |
| 2 | npm run build | exit=0·dist 38 entries·index.js 9181B·tui/acp 面在册 | ✓ |
| 3 | dsh 真身勘定 | **dsh=deepseek harness（官方 npm 包 @deepseek-ai/dsh·设计稿 dsh-rplane-harness-design-20261014 真源令）**·河源 root/fleet 侧均无裸命令（profile 启动器形态·~/.dsh 数据目录两侧在册） | ✓ |
| 4 | dsh 装机 | npm i -g @deepseek-ai/dsh@0.2.0-rc.2——538 包 4m exit=0·dsh --version=0.2.0-rc.2 断言绿 | ✓ |
| 5 | 凭据装载 | ssh cat 流式拉河源 fleet 凭据→~/.dsh/.credentials.yaml **223B 字节级同源·值面零回显**·河源中转件清理·icacls 收敛终态=仅 jedih:(F)（600 等价） | ✓ |
| 6 | **Windows spawn 适配（发现→修复）** | AcpClient 缺省 spawn `dsh` 裸名=ENOENT（Node22 无 shell spawn 不解析 shim）·dsh.cmd 绝对路径=EINVAL（**CVE-2024-27980 安全拦**）——**一行修复=shell 选项化**（缺省 platform==='win32'·POSIX false 零行为变化·测试注入 false）·commit **07549a5** | ✓ |
| 7 | 改后回归 | tsc 0 红+ACP 组 9/9+全量 **758/758 零回归**·rebuild dist | ✓ |
| 8 | ACP 探针真链路 | create 形双轮绿：initialize→list→new→prompt settle **end_turn**（真 DeepSeek·凭据装载生效实锚）→close/dispose 净收 | ✓ |
| 9 | TUI 四态复验（ConPTY 形） | 见下节四态表 | ✓ |

## TUI 四态复验（态①②③④全绿·ConPTY 编程驱动形）

| 态 | 断言（照 2b 口径） | 读数 | 判 |
| --- | --- | --- | --- |
| ① | 首启活体 | TriCade v0.4.0 横幅+Session (loaded)+输入框+StatusLine（acp│cwd│ctx│tokens）render 全现·**8711 uptime 窗前后仅自然增长无重置（early return 零触碰活体证）** | ✓ |
| ② | 一问一答 settle | 问句上屏+Thinking 行+**答文「佳」渲染**+ctx 0%→1%→2% 递增（usage settle 实锚） | ✓ |
| ③ | /exit 收净 | PTY-EXIT code=0+teardown 序列净+chat 进程残留=0 | ✓ |
| ④ | 重进 resume 上下文保持 | 同 cwd 重进→新问「你回的是哪个字」→**答「佳」（前答回读·上下文保持实证）**·ctx 连续递增 | ✓ |

## 部署收口

- 最终状态: **装机毕·四态全绿**——triilc chat --acp 在 Windows 原生形态全链可用（dsh spawn 适配+凭据+真模型 settle+resume 生命周期）
- smoke test: 探针 create 双轮+TUI 四态=六轮真链路全绿
- 部署耗时: 18:41 对表段起→19:30 收口=**49min**（死线 20:44 前 74min·判停点 20:14 前收口）
- 回滚方案状态: 全程未触发·独立可逆（07549a5 revert+全局包卸载+~/.dsh 删）

## 附注（观察项·如实记档）

1. **8713 窗内被并行重启**（窗前 uptime 362887→19:4x 读 1781≈30min）——非本席施工触碰（本席零触碰 8711/8713·触碰面只有 TriRLC 仓+npm 全局+~/.dsh）——并行窗事件·候值席面知悉归因
2. **ConPTY 输入链观察项（候 CTO/FSD 面）**: 标准 `\r` Enter 经 node-pty/ConPTY 到达 app stdin（字节级实证 GOT "0d"）但 TUI return 不触发；**kitty CSI u（ESC[13u）形正常触发**——人工键盘未测（本席自动化注入形）——候选=TUI 输入层（useTerminalInput/parse-keypress 链）对 CR 的 ConPTY 路径分流勘修·候窗
3. **winpty 0.4.3 管道形 assert crash**（Line 924 cols/rows）——弃用转 node-pty（@lydell/node-pty --no-save 零 package.json 污染）
4. **假读数自防一笔**: 窗前 `tmux ls 2>/dev/null` 把「命令不存在」读成「零会话」——本机无 tmux（/winpty 发现后弃管道形）——断言读数须验命令存在性非吞 stderr
5. LG-069 电源面: 硬件健康实锚（AC 在线）·powerMonitor 实现面候窗报 FSD（消费面勘修候选·不阻塞）

## 使用依据

- COO 派工令 c6c830772+死线提前急令（205 笔·CEO 18:39 判停点 20:14/死线 20:44）
- 验收口径: TriRLC/docs/registry/code-state.md 段 2 收口条目（2b 四步）+段 2a 探针形
- dsh 真源: docs/execution/dsh-rplane-harness-design-20261014.md（npx @deepseek-ai/dsh 形+preview 版本钉住纪律）
- 改动 commit: TriRLC 07549a5（2 files·+8/-2）
- 勘验实锚: npm view/dsh --version/icacls/stat 字节对表/healthz uptime 对表/ConPTY 字节探针（GOT "0d"）

落款=SDE 小布 2026-10-21 11:30:20Z（+8=19:30:20 北京·date 现查原值·三锚合同·发毕对表）
