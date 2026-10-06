# resume-by-title 跨项目目录同名歧义

- resume 值=UUID 或 session title（customTitle）；**title 匹配面=projects/ 下全部项目目录**（含各 worktree 目录），非仅当前 cwd 对应目录
- worktree 项目目录（D--Code-ai-TriMetaverse-worktrees-<seat>）残留同名 customTitle 会话 → 多命中 → 交互弹会话选择器（卡「会话选择」）；唯一命中 → 直进
- 判活纪律：jsonl 的 meta 行（custom-title/mode/permission-mode 等）**无 timestamp 字段**，tail 取最后时戳法会漏判 meta 写入、误判「席位全卡」——判活用文件 mtime + 进程命令行双证，勿单信 tail 时戳
- 修复法=归档改名（customTitle 值加 `-archived-日期` 后缀），备份留 `.bak-日期` 回滚锚；**禁删文件**（转录为追加型，删除毁历史链）
- 实证（2026-10-05）：m-cos/m-fsd 卡选择器终极根因=ceo-chief-of-staff / full-stack-developer 两 worktree 项目目录残留同名会话（119/77 行）；归档后 CEO 亲验两席直进。主仓内同名副本同样会致多命中（同窗先行归档三件）
- 发送账锚：TriMetaverse 2026-W40 发送账 #406/#407（f5868f90）
