# TriMetaverse 双 pushurl 拓扑：push 尾行 fatal ≠ 失败

**拓扑现势（2026-10-07 13:26 配置改写，BOD 10-08 采认）**：TriMetaverse 主仓 origin=GitHub（fetch）+**双 pushurl**（GitHub `https://github.com/MoRen9527/TriMetaverse.git` + sg bare `ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git`），另有独立 remote `sg-server`（sg bare fetch+push）。

**坑**：双 pushurl 下 git push 逐通道推，任一通道失败（如 GitHub 443 断连 Recv failure/timeout）时**尾行以 fatal 收尾但另一通道（sg bare）实际已推成功**——按尾行定性「push 失败」=误读，会引发重复推送/误报/误回滚。

**验真正形**：push 后不以尾行定性，`git ls-remote <目标通道> <branch>` 对表顶 hash；sg 侧验 bare 顶、GitHub 侧 443 不通期以 sg bare 为准（双源同顶由下次 443 恢复后补齐）。

**变更留痕缺口**：.git/config 不入版本控制，本次变更（10-07 13:26 mtime）无直接留痕——配置意图与 CTO ssh 单通道评估（3445cf46，同日 18:40 落）方向一致，BOD 采认为容灾设计。**COS 查证结论（10-08 11:49）**：三形态写命令全席 transcript 零执行命中=**非席位所为**，疑用户侧终端手动操作；sg-server remote 创建早于 13:26（10-07 上午已被值席使用），13:26 mtime=origin 双 pushurl 追加笔；意图=GitHub 443 断连为环境常态下 sg 单推保活。登记位：本条代记（COS 面 2026-10-08 令确认无独立 machine 配置登记位）。

**同类拓扑**：TriModel 仓=origin sg bare+github 双 remote（非双 pushurl，推两次各自显式），推后必双验（10-08 退役标记 e5394a4 曾只推 origin 致 GitHub 落后，FSD sg 中转补齐）。

关联：发布重渲攒批节奏（push 断连切 HTTP/1.1+ls-remote 核真值）、sg-github-pat-push-channel。
