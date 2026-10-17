# SDE 施工卷 · B2 回滚锚实演备料毕（模板实体破案+实演细案·候 CTO 退役毕信号）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-b2-rollback-rehearsal-prep-20261017.md
- syncMode: static（备料卷·实演候节拍）
- lastSyncedAt: 2026-10-17 06:17:14Z（+8=14:17:14 北京·date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 B2（COO 14:13 开工令）
- 施工位: 河源 R-HY（实演对象席=r-duty-cto）

## 模板实体破案链（三层收敛）

| 层 | 勘 | 读数 |
| --- | --- | --- |
| 1 | 河源 fleet ~/.claude 实体搜（find/ls templates） | **零命中**——模板非 ~/.claude 下文件/目录 |
| 2 | 设计卷+charter 定义面 grep | 设计卷 L89「河源 13 席=claude 直启形（tmux+claude CLI·57cf86b64 模板）」+L114「重开模板 57cf86b64 幂等可重演」——**57cf86b64 指向段A 卷** |
| 3 | daily-progress L846+git show | **57cf86b64=git commit**「docs(sde): n1启动命令清单在案卷」（10-16 03:40）——**模板=启动命令清单卷本体**（r-plane-duty-deploy-n1-process-tree-20261016/reports/sde-n1-launcher-manifest-20261016.md·61 行·全参在卷） |

**定性**：「claude 模板 57cf86b64 幂等重演」=按该卷在档启动命令清单重演——备料断言「模板在册」成立，实演零新施工（纯重演）。

## 模板卷要点（cto 席实演参数）

- **启动命令形**（L21-22）：`tmux -u new-session -d -s r-duty-<seat> -c /srv/fleet/TriMetaverse 'source /home/fleet/.trimmc/duty-env && set -a && unset CLAUDE_CODE_CHILD_SESSION && export CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1 && claude -n r-duty-<seat> --agent <Agent> --verbose --dangerously-skip-permissions --append-system-prompt-file /srv/fleet/TriMetaverse/.claude/compass/<agent-file>.session.md'`
- **护栏段**：unset CLAUDE_CODE_CHILD_SESSION + FORCE_SESSION_PERSISTENCE=1（本机席位复活名址缺口修复对·任务书「清+置」活体实形）
- **cto 席名册行**（L41）：会话名 r-duty-cto / --agent ChiefTechnologyOfficer / compass chief-technology-officer
- **首启/复活两段语义**（L26）：首启=`-n <title>` 新建形；**复活=`--resume <title> -n <title>`**（M 面 10-13 冷启同款）——cto 席 10-16 已首启（现役在跑）→B2 重开走**复活形**

## 实演细案（候 CTO 退役毕信号）

**重开命令（cto 席复活形）**：

```bash
tmux -u new-session -d -s r-duty-cto -c /srv/fleet/TriMetaverse 'source /home/fleet/.trimmc/duty-env && set -a && unset CLAUDE_CODE_CHILD_SESSION && export CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1 && claude --resume r-duty-cto -n r-duty-cto --agent ChiefTechnologyOfficer --verbose --dangerously-skip-permissions --append-system-prompt-file /srv/fleet/TriMetaverse/.claude/compass/chief-technology-officer.session.md'
```

**三断言判据**（CTO 演练正形 66ab801bd 逐条）：

| # | 断言 | 判据 |
| --- | --- | --- |
| ① | 进程起 | tmux 会话 r-duty-cto 在册+pane pid+claude comm 命中+/environ 护栏两变量断言（零打印值面） |
| ② | compass 渲染可达 | capture-pane 会话复活态+--append-system-prompt-file 挂载面（compass 文件 13 件 md5 聚合 04c434c3 前后对平） |
| ③ | TriRMC 适配链重连 | TriRMC 8710 agents 面 r-duty-cto 注册态回归（活体 API 直探） |

**节拍**：CTO claude 退役毕信号 → 我重开 → 三断言 → 绿落卷 → 我再退（retire 脚本同款） → 声报 CTO 落 dsh 形生产续 + 毕报 COO。异常即停波（重开失败/断言不过=停该席声报 CTO+COO·不盲重试）。

## 现役参照（活体读数·退前基线）

- r-duty-cto tmux 会话在册（created 10-16 12:44:08）·pane_pid=16263·claude 直跑形（三级探测①命中）
- 子进程 npm exec @playwright/mcp（claude MCP 伴生）——retire 脚本 S2 子 pid 采集+精杀覆盖面已读毕
- retire-claude-seat.sh 河源执行位 /home/fleet/segb-tools-20261017/ ·fleet 755 可跑（目录 root 属主无碍）

## 使用依据

- COO B2 开工令 14:13（施工位=回滚锚实演）·CTO 演练正形 66ab801bd（三断言原文）
- n1 启动命令清单卷 57cf86b64（模板本体）·设计卷 dsh-rplane-harness-design-20261014.md L89/L114
- retire-claude-seat.sh（本仓 scripts/dsh/·122 行全读）

落款=SDE 小布 2026-10-17 06:17:14Z（+8=14:17:14 北京·date 现查原值·发毕对表）
