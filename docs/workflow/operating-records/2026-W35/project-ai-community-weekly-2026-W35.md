# 项目级 AI 共学周记 — 2026-W35

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W35/project-ai-community-weekly-2026-W35.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-28

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

### 2.2 内存存活掩盖重启必炸——dist 生产形态服务的潜伏损坏与诊断路径

- 现象：
  TriMC（Node 服务，编排命脉）restart 后陷入 crash loop：秒级 exit 1、restart counter 持续上涨；而重启前 healthz 全绿、已无异常运行数周——『坏』只在重启时显形。
- 具体表现：
  三步定性：①start 脚本揭示服务实为 node dist/src/index.js（dist 生产形态，非 tsx 直跑）；②run log 真实报错=ERR_MODULE_NOT_FOUND: node_modules/trimodel/dist/src/index.js，而 trimodel 是符号链接→/srv/fleet/TriModel；③根因=TriModel 仓重检出后 dist/（gitignored 构建产物）丢失——旧进程自 8-26 起内存存活，掩盖『任何 restart 必炸』的潜伏损坏，期间 healthz 一直正常。
- 解决方案：
  修复式前进而非回滚（回滚源码对 untracked 产物无效）：目标仓库重建 dist（npm run build，保持服务读属主）→restart 即恢复。沉淀纪律：dist 形态服务的 restart 前置检查应含『dist 完整性+符号链接目标存在性』；重检出/换仓类操作后必须重建构建产物。
- 问题影响：
  编排命脉停机约 2 分 46 秒（21:08-21:11）；最大风险是误判为新版本代码缺陷而回滚源码——无效方向且延误真因定位。

当前经验：

- 项目经验：
  『运行中≠可重启』：长活进程会掩盖依赖树（尤其 gitignored 构建产物+符号链接依赖）的潜伏损坏；重启可存活性是一项目视性质，应纳入部署前置检查与演练。
- 模型自查：
  本条由 agent 自诊自记：从『回滚本提交』的错误直觉出发，靠 start 脚本+run log 两步定性为产物丢失，未走无效回滚弯路；诊断顺序（脚本→日志→根因→修因不修症）可复用。

