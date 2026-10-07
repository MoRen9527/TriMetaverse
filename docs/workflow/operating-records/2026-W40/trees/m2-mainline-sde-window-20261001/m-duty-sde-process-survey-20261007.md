# 勘查卷 · sg m-duty-sde 进程身世勘定（CEO 21:08 令·BOD 勘查单）

- sourceOfTruth: 本件（SDE 面只读勘查读数正身；上游=BOD 勘查单·CTO 今晚 socket 勘验附带发现「m-duty-sde 系 16 天 tmux 会话族外直跑进程」疑点）
- syncMode: static
- lastSyncedAt: 2026-10-07T13:12:30Z（date 现查；+8 = 21:12:30 +0800）
- 执行席: SDE 小布（m-sde）；约束=只读勘查零触碰现役，结论不落地（「需要修改/归位/清退」类结论候 BOD 排窗）

## 一、勘定结论（先答后证）

**疑点不成立：m-duty-sde 非族外直跑，就在 duty tmux-1001 族内，系现役值班席。** 无归位/清退需求，零触碰维持。

## 二、三面铁证

| 面 | 读数 | 定性 |
| --- | --- | --- |
| 进程谱系 | pid **210215**，**PPID=3136462**（=tmux-1001 族 server，09-16 20:51 起，13 席 duty 会话全挂其下），tty=/dev/pts/1，start **Sep 21 03:09:32 2026**（etime 16d18h——「16 天」读数吻合），sg 时区 CST+0800（=本地凌晨 3:09 起席） | 族内 |
| tmux 权威面 | `tmux list-panes -t m-duty-sde` → **pane_pid=210215**；`tmux list-sessions` → **m-duty-sde 在册**（created Sep 21 03:09:33，与进程 start 秒级吻合），14 会话全列 | 族内在册 |
| env 面 | `/proc/210215/environ` 含 **`TMUX=/tmp/tmux-1001/default,3136462,35`**（族外直跑进程必无此键）；CLAUDE_CODE_CHILD_SESSION/FORCE_SESSION_PERSISTENCE 零命中（非子会话遗传形态，tmux 内原生跑法自然注册名址） | 族内铁证 |

cmdline：`claude -n m-duty-sde --agent DeploymentEngineer --verbose --dangerously-skip-permissions --append-system-prompt-file /srv/fleet/TriMetaverse/.claude/compass/senior-deployment-engineer.session.md`

## 三、勘查单三问直答

1. **谁起的/干什么用/现职还是残留**：09-21 03:09 经 tmux-1001 族 server 以 new-session 形起（pane_pid 权威面直认）——系 09-16 主批（12 席）之后 4 天的**补起批**成员；用途=sg 面 SDE 值班席（DeploymentEngineer agent 形+senior-deployment-engineer.session.md，值席批次执行先例在册：夜航01/批令执行波系 m-duty-sde 系承接）。**定性=现职**：会话在册+进程活体+族内三证齐；16d18h 长龄系 tmux 常驻形正常态（同族 09-16 批各席 19-21 天同量级），非残留特征。
2. **归位 or 退役**：**均不需要**——已在 duty tmux 族内（谱系/tmux pane/env 三面铁证），「归位」前提（族外）不成立；现职在跑，退役前提不成立。
3. **在跑职责不能动**：确认——sg SDE 值班席在役承载任务流，本次全程只读（ps/tmux list/proc environ/ls），零触碰维持。

## 四、CTO 疑点来源候选（供复勘对照）

「不在 tmux-1001 socket 族内」判读与活体三证矛盾，勘验方法盲区候选：①以非 fleet 身份（root/sudo 剥离 env）跑 `tmux ls`——默认 socket 落 `/tmp/tmux-<uid>/default`，非 fleet uid 找不到 tmux-1001 族即误判族外；②在 `env -u TMUX` 剥离环境里勘（20:29 实锚有 `sudo -u fleet env -u TMUX tmux attach -t m-duty-cos` 在途——剥离是 attach 正确做法，但同环境跑 ps 判读易失 TMUX 参照）；③勘验对象/机位错位候选。附本卷三面读数供 CTO 侧复勘对表。

## 五、附带观察项（如实录，非结论）

1. `--verbose` flag 系 m-duty-sde 同族独有（13 席中仅此一席）——形差非功能差，候 09-21 补起操作记录侧对账（谁起的面=tmux 形无 shell history 可考，操作者身份未勘，候需求大表侧如需可查 claude 项目 transcript 时戳）。
2. sg 侧 claude projects transcript 目录 mtime 停 10-03 22:57（低活观察项；值席任务驱动形态下低活≠残留，不作定性依据）。
3. m-duty-cos 会话 created Oct 3 22:45（=重启过，非 09-16 主批原形，与会话清单 (attached) 标吻合）——已知形态如实录。

## 六、使用依据

- BOD 勘查单（CEO 21:08 令）；D-24 机位断言（sg=fleet@47.245.122.61，全部读数 ssh fleet 身份实勘）
- 实勘读数：本卷 §二/§四 原样（2026-10-07 21:10-21:12 +0800 窗内，ps -eo/tmux list-panes/list-sessions//proc/environ 只读四通道）
- 零触碰声明：勘查全程无任何写面/信号/会话操作
