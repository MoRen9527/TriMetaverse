# progress-snapshot.md 污染件勘源止损卷（BOD ②令）

- 勘源: 写入者=8712 cron job `bod-progress-report`（ae02593a，every 30min）→`/srv/fleet/bin/bod-progress-snapshot.sh`——tmux capture m-duty-cos pane 尾 12 行+树目录 ls，append 至 progress-snapshot.md（六轮 131KB 实锤；头帧=本席 A2 试点 sleep 命令行）
- 定性: 观察器直写版控文件（append 形无轮转无上限）＝设计缺陷（版控面禁 append 污染；tmux 面含命令行文本有敏感值出机风险）
- 处置（BOD ②令授权）: ①停写=PATCH enabled=false（D-02 纪律：只 patch enabled 不动 nextRunAtMs；13:2x 落，核验 False ✓）②止损=git checkout 恢复已提交版（131KB→128.6KB，M 消净 ✓）
- 教训条候选: 观察器类脚本禁直写版控文件（写面=非版控专用卷或 notify 链）；tmux capture 面含命令文本=敏感值出机风险面（照零敏感值出机纪律族）
- 恢复核验: 本卷落笔时点=止损后，污染件已回已提交版
