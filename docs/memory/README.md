# 项目记忆镜像位（TriMetaverse docs/memory）

- sourceOfTruth: 镜像位（真源=C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse\memory，Claude 项目级记忆；本目录=随仓镜像）
- syncMode: machine-mirror（sync-memory-mirror.ps1 自动同步，每小时+登录时）
- lastSyncedAt: 2026-10-06T20:29+0800（CEO 令初装全量镜像，date 现查 20:28:24）

## 机制（CEO 2026-10-06 20:27 令）

1. **双向定位**：源目录=Claude 项目记忆（行为反馈+导航指针，harness 自动加载）；本目录=随仓镜像（随 git 记录不丢失，换机/迁移环境后纪律指向仍可达）。
2. **自动写回**：`TriCompany/launch/sync-memory-mirror.ps1` 每小时+登录时由 Windows 计划任务（Sync-Memory-Mirror）无窗拉起，Copy-Item 只增改不删；源缩量判卫（疑似异常保镜像并留痕）；有变化且 staged 面干净时机器 commit（`docs(memory): 项目记忆镜像同步`）。
3. **删除面人工**：镜像不跟随源删除（防源误清空双丢）；下架记忆须人工删镜像+commit 留痕。
4. **纪律指向**：TriCompany 纪律册/治理文档引用项目记忆教训族时，指向本镜像位（`TriMetaverse/docs/memory/<name>.md`）；映射真源=TriCompany/docs/engineering/governance-memory-index.md（LG-016，候 CAO 增补本位指针）。
5. **sg 备援**：本目录随 TMV 主仓既有 push 管线走 GitHub+sg bare，不另建通道。

## 内容

93 件（2026-10-06 初装全量）：MEMORY.md 总索引+92 条记忆（行为反馈/纪律/教训/导航指针，frontmatter 原样保留）。
