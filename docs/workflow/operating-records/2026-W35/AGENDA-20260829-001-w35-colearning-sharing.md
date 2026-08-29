# W35 共学分享会提纲（2026-08-29 周六 20:00）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W35/AGENDA-20260829-001-w35-colearning-sharing.md
- syncMode: local-only
- lastSyncedAt: 2026-08-29

> 记录人：编排层（董事会直连会话代拟，供主讲人使用）
> 素材：`project-ai-community-weekly-2026-W35.md` 条目 2.1 / 2.2（2.2 已走完 journal CLI 全链，score 98，close APPROVED）
> 主线一句话：**两条故障，同一类伪装——环境层问题穿上了业务层的外衣。**

---

## 1. 开场（5 min）

- 一句话点题：本周两条共学条目都不是业务逻辑 bug——一条是 shell 语义层（Git Bash/Windows），一条是构建产物层（gitignored dist + 符号链接）。共同点：**症状出现在业务面（401 / crash loop），根因藏在平台面**。
- 预告产出：讨论后收 2-3 条行动项（见 §6）。

## 2. 条目 2.1 分享：Windows 工具链三坑与 PowerShell 换装（12 min）

讲述线（现象 → 弯路 → 实证 → 解法）：

1. 三现象同日齐发：robocopy 旗标被翻译成路径挂起 2 分钟；ssh 内嵌 node -e 三层引号炸语法；CRLF 混入 HTTP 认证头 → 401。
2. 排查弯路（重点讲，价值在误诊链）：先怀疑鉴权方式 → 再怀疑网络抖动 → 最后才发现是行尾不可见字节。累计约半小时。
3. 实证手法：服务器端 key-len 前后对照（73 → 30 字节差），用字节证据替代猜测。
4. 解法三件套：`CLAUDE_CODE_USE_POWERSHELL_TOOL=1` 换装原生 PowerShell 工具；跨端文本消费端统一 `tr -d '\r'`；多层引号改 base64/heredoc 传参。

演示点（可选，3 min）：

- 现场用 `file <name>` / `od -c <name> | head` 展示 CRLF 与 ^M——"肉眼全同、字节不同"比口讲有说服力。

## 3. 条目 2.2 分享：运行中 ≠ 可重启（15 min，本周主菜）

讲述线：

1. 反差开局：healthz 全绿、无异常运行数周 vs restart 后秒级 exit 1、restart counter 持续上涨——"坏"只在重启时显形。
2. 三步定性（可复用的诊断顺序）：start 脚本 → 真实运行形态是 `node dist/src/index.js`（dist 生产形态，非 tsx 直跑）；run log → `ERR_MODULE_NOT_FOUND: node_modules/trimodel/dist/src/index.js`；根因 → trimodel 是符号链接指向 TriModel 仓，重检出后 gitignored 的 `dist/` 丢失。
3. 决策点（重点讲）：为什么"回滚本提交"是无效直觉——回滚源码对 untracked 构建产物无效。修因不修症：目标仓库重建 dist → restart 即恢复。
4. 代价与收获：编排命脉停机 2 分 46 秒（21:08-21:11）；沉淀纪律——dist 形态服务 restart 前置检查应含"dist 完整性 + 符号链接目标存在性"；重检出/换仓后必须重建构建产物。

概念升华一句话：**重启可存活性是一项目视性质，与当前健康状态无关。**

## 4. 跨条目方法论提炼（8 min）

1. 排错分层原则："内容看起来一样但行为不同" → 先查平台层（CRLF / BOM / 路径分隔符 / shell 语义）再查业务逻辑。
2. 先定性再动手：两步/三步定性确定损坏域，再选动作；拒绝直觉性回滚（两个条目各挡掉一次无效方向：轮换密钥 / 回滚源码）。
3. 教训纪律化闭环：一次性教训 → 前置检查项 / 工程纪律条款，而不是踩坑回忆。这正是共学周记"现象-实证-纪律"三段格式的意义。

## 5. 讨论题（10 min）

1. 我们还有哪些"只在重启时显形"的潜伏依赖？（候选线索：cron job state 的 nextRunAtMs、pidfile、worktree、.env、其他 gitignored 产物）
2. Windows 开发三条纪律（shell 选择 / 行尾清洗 / 声明式宿主配置）要不要升格进 `TriCompany/docs/workflow/engineering-disciplines.md`？
3. 周记条目 2.2 的 restart 前置检查，值得脚本化进部署链吗？落在 TriRLC 还是 TriMC 侧？

## 6. 行动项与收口（5 min）

- 汇总讨论产生 2-3 条行动项，指派归属（TriRLC / TriMC / 工程纪律册），登记进下周跟踪。
- 周记收口提醒：今日签发后按版本规则归档 `v2026.W35.1` 至 `operating-records/项目级 AI 共学周记/`。

---

## 素材速查（主讲人用）

| 项 | 值 |
| --- | --- |
| 条目 2.1 关键数字 | 排查约 30 分钟；key-len 73 → 30 字节 |
| 条目 2.2 关键数字 | 停机 2 分 46 秒（21:08-21:11）；crash loop 秒级 exit 1 |
| 条目 2.2 根因链 | restart → node dist/src/index.js → trimodel 符号链接 → TriModel 重检出丢 dist/ → ERR_MODULE_NOT_FOUND |
| 解法速记 | 2.1：换 PowerShell 工具 + tr -d '\r' + base64/heredoc；2.2：重建 dist（修复式前进，不回滚） |
| 周记文件 | `docs/workflow/operating-records/2026-W35/project-ai-community-weekly-2026-W35.md` |
| 关联记忆/纪律 | ps1-utf8-bom-requirement（同族坑）；engineering-disciplines D-06（周记 ADE 链） |
