# 凭证轮换施工纪律·消费对象三段链

token 轮换施工前必勘**每个键**的消费对象（键→URL→对端 daemon 三段链），**禁同名键顺手同换**——同名键不同对端=窗内只换单向时必翻车。清点必含**全部候选载入位**（env 候选链全 grep），单点改一处即值分裂；消费面清点四层=进程 env+config 文件+启动器+cron job payload；PATCH 类 API 键面语义先读实现（平铺键静默忽略=假成功形态，persist 三态断言救场）。

**实锚（2026-10-15 归一窗三折·CTO 卷 0b3d0bebd+BOD 卷 db924be8b）**：
- 折2：`TRIMC_INTERNAL_TOKEN` 在 8711=河源对端（heartbeat 链）/在 8713=sg 对端——盲同换打断 heartbeat 链（totalFailures 1→18），探针三态 404/401/400 定谳后回滚修复。
- 折3：TriRLC env 候选链含工作区根 `D:/Code/ai/.env` r19 残留副本（L93 守卫「先载入者赢」）——只改一处即分裂，值一致化修复。
- BOD §七：config-sync-apply job `payload.command` 内嵌旧 token 明文+旧路径——cron payload 是隐性消费方（PATCH `{payload:{...}}` 整体键正形·平铺 `{command}` 静默忽略）。

纪律正身=**D-54 凭证轮换施工纪律**（TC 74403e7·2026-10-15 入册候 BOD 复核）；值面泄露防线姊妹条=D-46（同 commit）。跨 daemon 重启修法附注：Git Bash 面 schtasks /run 必炸，一律 Start-ScheduledTask。

关联：value-face-never-print-path（D-46 泄露面）·d46-nested-payload-recursive-mask·trilc-daemon-restart-discipline（重启链）·trimlc-repair-window-20261011（schtasks 坑族）。
