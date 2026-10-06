# trimc cron 日志 header 嵌 command 全文含 token——tail 前必滤

> 2026-10-02 22:2x BOD 实证：tail /var/lib/trimc/cron/logs/*.log 未滤 → 日志 header 的 `command:` 行以明文嵌 `export TRIMC_INTERNAL_TOKEN=<64hex>` → sg 活体 internal token 进 BOD 会话链（跨机出机档，比 09-30 channel.cmd 同机案多一档；定性=操作瑕疵非安全事故，增量≈零，轮换候裁）。

**正形**：读任何 trimc cron 日志（/var/lib/trimc/cron/logs/）一律先滤 header 两行：

```bash
tail -N logfile | grep -vE "^command:|^runAs"
```

或只取 stdout/stderr/RESULT 段。**禁裸 tail/cat 整日志**。

**同族**：值面字段禁进打印路径（channel.cmd 案 09-30）——凡 daemon 生成的日志/快照/配置类文件，读前先想「里面会不会有凭据行」。

**sg 工作仓 root 污染族**（同晚第二发现）：BOD root 身份在 sg 工作仓跑 git 操作（add/commit/log 勘验）会留下 root 属主文件（.git refs/logs/objects + 工作树），fleet 身份的定时 job（config-sync-apply 等）后续 git pull 时 reflog append 被拒连败。**BOD SSH sg 一切 git 操作后必须 `find <repo> -user root` 清点+chown fleet:fleet 归还**；能以 fleet 身份做的操作不以 root 跑。

**验证锚**：2026-10-02 22:26:02 chown 修复后 fleet fetch 双 ref 更新零错；22:40 轮 config-sync 绿跑候验。
