# TriMetaverse 双 pushurl 拓扑：push 尾行 fatal ≠ 失败

**拓扑现势（2026-10-07 13:26 配置改写，BOD 10-08 采认）**：TriMetaverse 主仓 origin=GitHub（fetch）+**双 pushurl**（GitHub `https://github.com/MoRen9527/TriMetaverse.git` + sg bare `ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git`），另有独立 remote `sg-server`（sg bare fetch+push）。

**坑**：双 pushurl 下 git push 逐通道推，任一通道失败（如 GitHub 443 断连 Recv failure/timeout）时**尾行以 fatal 收尾但另一通道（sg bare）实际已推成功**——按尾行定性「push 失败」=误读，会引发重复推送/误报/误回滚。**执行序勘正（2026-10-13 BOD 21:15/21:16 两轮实证·丢笔案随录）**：GitHub 腿（第一 pushurl）失败即**断整链 RC=128·ssh 腿（第二 pushurl）不执行**（非无条件「一通一断」——第一腿短路优先）——推 sg 正形=**显式推 sg URL 绕腿**（`git push ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git dev:dev`）。

**验真正形**：push 后不以尾行定性，`git ls-remote <目标通道> <branch>` 对表顶 hash；sg 侧验 bare 顶、GitHub 侧 443 不通期以 sg bare 为准（双源同顶由下次 443 恢复后补齐）。

**变更留痕缺口**：.git/config 不入版本控制，本次变更（10-07 13:26 mtime）无直接留痕——配置意图与 CTO ssh 单通道评估（3445cf46，同日 18:40 落）方向一致，BOD 采认为容灾设计。**COS 查证结论（10-08 11:49）**：三形态写命令全席 transcript 零执行命中=**非席位所为**，疑用户侧终端手动操作；sg-server remote 创建早于 13:26（10-07 上午已被值席使用），13:26 mtime=origin 双 pushurl 追加笔；意图=GitHub 443 断连为环境常态下 sg 单推保活。登记位：本条代记（COS 面 2026-10-08 令确认无独立 machine 配置登记位）。

**同类拓扑**：TriModel 仓=origin sg bare+github 双 remote（非双 pushurl，推两次各自显式），推后必双验（10-08 退役标记 e5394a4 曾只推 origin 致 GitHub 落后，FSD sg 中转补齐）。

**验真读数行归属错位变体（2026-10-13 BOD 丢笔案·21:15 定谳）**：多命令链验真（`push … | tail -3; echo RC=$?; ls-remote origin dev | head -1; rev-parse --short HEAD`）四行输出逐行对位——GitHub fatal+`2>/dev/null` 吞错致 ls-remote **零输出**，末行 `rev-parse HEAD`（本地顶）被误读为远端验真行→「验真 ✓」假象→他席笔被误判「被 merge 刷出」（实为从未到达，bare 流水零痕+mirror ff 时序三证互锁）。正形三禁一必：**ls-remote 必显式目标 URL**（禁裸 origin=只读 fetch url）·禁 tail/head 截断关键验证行·RC 系多 pushurl 整体码不证单腿达·多命令链输出必逐行归属对位（末行≠验真行）。bare 侧仲裁真值=`/srv/fleet/shadow-plane/fade-hook.log`（post-receive 每笔成功 update 必留 `dev updated oldrev -> newrev`·UTC——ref 争议流水级铁证位）。

关联：发布重渲攒批节奏（push 断连切 HTTP/1.1+ls-remote 核真值）、sg-github-pat-push-channel、并行窗提交互踩族（本案系「merge 倒退丢笔向」的观察错位假阳性——管线侧全 ff 健康）。
