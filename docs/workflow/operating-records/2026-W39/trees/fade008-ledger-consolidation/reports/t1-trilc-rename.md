# T1·A-1 sg 旧名工作区处置收口报告

- 执行：mv /srv/fleet/TriLC /srv/fleet/TriRLC（2026-09-20T19:4xZ，fleet 属主整体改名，内容零改动）
- 动前引用面终扫：crontab（仅 ~/.trilc patrol 自路径）/worktree-reverse-push.sh（注释明载「TriLC/TriMC 旧名树不在列」20 树清单）/worktree-guarded-ff.sh/bare-fetch-all.sh/duty-night-patrol.py/systemd 单元——fleet/TriLC 零命中；tmux 14 pane cwd 全在 TriMetaverse
- 硬边界遵守：/srv/fleet/TriMC 涉服务禁动——未触碰
- 验收三验：①8710 healthz ok（trimc，cron 6 jobs，consecutiveFailures=2 观察项不阻塞）②tmux sessions=14（13 m-duty 席+1 其他，与动作前同）③配额纪律位不动（settings.json mtime 2026-09-16 20:59:22+08 前后一致）
- 销账锚：本报告+tmux/healthz 读数

- 【补记 2026-09-22·A-1 推进令】嵌套残留甄别归档：/srv/fleet/TriRLC/TriLC（876d21e 旧克隆，84MB/5848 文件，嵌套独有文件=0——内容经 diff -rq 全量核验被父树 d60126e 吸收替代）→ 归档 `/srv/fleet/TriLC.quarantine-20260921T163934Z`（照 TriModel.quarantine 先例命名）；处置后 TriRLC 树净零脏面、8710 healthz ok。旧名目录甄别令就此闭：外层 mv 改名（T1 原笔）+内层嵌套归档（本笔），迁移+归档双形态齐。
