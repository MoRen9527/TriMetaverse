---
name: powershell-ssh-stdin-crlf-trap
description: PowerShell→ssh stdin 管道带 CRLF 行尾——远端写入物粘 \r 致匹配零命中；sed 剥离或管道侧统一 LF；跨管道行尾族
metadata:
  node_type: memory
  type: project
  originSessionId: 1c4840bc-cf7a-49d6-a198-987bc373b80d
  modified: 2026-09-30T02:08:09.507Z
---

**坑**（BOD 2026-09-30 10:03 PAT 写入施工实证，124→123 字节实锚）：PowerShell 管道内容经 ssh stdin 送达远端时行尾带 CRLF——远端落盘物（credential store/配置文件/heredoc 写入件）行尾粘 `\r`，后续精确匹配（git credential fill 按行读 URL/token）零命中，表象极似「凭据错/权限错」。

**修法**：远端侧 `sed -i 's/\r$//' <file>` 剥离后复测；或写入前管道侧统一 LF（PowerShell 侧 `` `n `` 显式拼接/`[IO.File]::WriteAllText` 控制行尾）。

**识别指纹**：字节数比预期多 1×行数；`cat -A` 见行尾 `^M$`；「内容肉眼一致但匹配零命中」先查行尾。

**跨管道行尾族**（同族教训并档）：ps1 中文须 UTF-8 BOM（PowerShell 5.1 ANSI 误读）、嵌套 pwsh -Command $env 转义、本条 CRLF——Windows→跨机/跨进程管道三坑，凡 PowerShell 起头的内容传输先断言行尾/编码/转义三面。

关联 [[ps1-utf8-bom-requirement]]、[[nested-pwsh-command-dollar-escape]]、[[sg-github-pat-push-channel]]。
