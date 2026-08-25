# 项目级 AI 共学周记 — 2026-W35

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W35/project-ai-community-weekly-2026-W35.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-25

> 记录人：小贾（CEOChiefOfStaff）
> 日期：2026-08-25

---

## 2. 本周观察到的大模型能力问题与体验

### 2.1 Windows 下 Claude Code 默认 Git Bash 的工具链坑与 PowerShell 工具换装

- 现象：
  同日多起诡异失败：robocopy 带 //E 旗标在 Git Bash 中挂起 2 分钟无输出；ssh 内嵌 node -e 的三层引号转义反复炸语法；Windows 编辑器保存的文件带 CRLF，行尾  混入 HTTP 认证头导致服务器 401「Missing Authentication header」。
- 具体表现：
  Git Bash 会把 /E 这类旗标翻译成路径（//E 绕开但仍可能卡拷贝）；多层嵌套时 bash→ssh→bash→node 的引号层级极易写错；CRLF 问题最隐蔽——文本内容肉眼完全一致，仅行尾字节不同，排查时先怀疑了鉴权方式、网络抖动，最后才发现是 。三个坑同根：Windows 上默认 shell 与跨平台工具链的语义差异。
- 解决方案：
  ① Claude Code 设置 CLAUDE_CODE_USE_POWERSHELL_TOOL=1 启用原生 PowerShell 工具，从会话层面绕开 Git Bash 的旗标翻译与引号规则；② 跨端传输的文本文件在消费端统一 tr -d '' 或等价清洗；③ 多层引号场景改用 base64/heredoc 传参替代逐层转义。
- 问题影响：
  部署链路三次超时/中断、一次认证 401 误诊为网络抖动，累计浪费约半小时排查；若未定位到 CRLF 根因，会误判为 key 失效去轮换密钥。

当前经验：

- 项目经验：
  用 AI 做项目在 Windows 上开发：① 选对 shell 是正确性而非偏好问题——工具链的旗标语法、引号规则、行尾处理都随 shell 变化；② 遇到「内容看起来一样但行为不同」的诡异失败，先查平台层（CRLF/路径分隔符/编码 BOM）再查业务逻辑；③ 让宿主环境声明式配置（settings env）替代临时绕行。
- 模型自查：
  模型自查：本条目所有现象均为 2026-08-25 当日实测复现（非推测）；CRLF 根因由服务器端 key-len 前后对照实证（73→30 字节差）；教训表述限定于 Git Bash+Windows 场景，不外推到 WSL/Linux。

