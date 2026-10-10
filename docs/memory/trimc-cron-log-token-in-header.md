# trimc cron 日志 header 嵌 command 全文含 token——tail 前必滤

> 2026-10-02 22:2x BOD 实证：tail /var/lib/trimc/cron/logs/*.log 未滤 → 日志 header 的 `command:` 行以明文嵌 `export TRIMC_INTERNAL_TOKEN=<64hex>` → sg 活体 internal token 进 BOD 会话链（跨机出机档，比 09-30 channel.cmd 同机案多一档；定性=操作瑕疵非安全事故，增量≈零，轮换候裁）。

**正形**：读任何 trimc cron 日志（/var/lib/trimc/cron/logs/）一律先滤 header 两行：

```bash
tail -N logfile | grep -vE "^command:|^runAs"
```

或只取 stdout/stderr/RESULT 段。**禁裸 tail/cat 整日志**。

**同族**：值面字段禁进打印路径（channel.cmd 案 09-30）——凡 daemon 生成的日志/快照/配置类文件，读前先想「里面会不会有凭据行」。

**sg 工作仓 root 污染族**（同晚第二发现）：BOD root 身份在 sg 工作仓跑 git 操作（add/commit/log 勘验）会留下 root 属主文件（.git refs/logs/objects + 工作树），fleet 身份的定时 job（config-sync-apply 等）后续 git pull 时 reflog append 被拒连败。**BOD SSH sg 一切 git 操作后必须 `find <repo> -user root` 清点+chown fleet:fleet 归还**；能以 fleet 身份做的操作不以 root 跑。
**bare 仓变体+静默潜伏面**（2026-10-10 CAO 勘补）：bare 仓（/srv/git/<repo>.git）同族污染症状不同——fleet push 报 `! [remote rejected] ... unable to migrate objects to permanent storage`（对象落点目录 root 属主则写不进；ls-remote 读 refs 不受影响=读通写拒不对称）；且**污染静默潜伏**：10-05 22:19 留痕 24 件（TriCompany.git objects b1/61/d3/89 等散布），10-10 11:3x 我 push b1fcc7a 恰落 b1/ 前缀才爆——未撞上前缀期间一切正常，**「上一次 push 成功」不证明仓净**。修法同族=BOD root 面 `chown -R fleet:fleet /srv/git/<repo>.git`；清点扫全 bare 面 `for r in /srv/git/*.git; do find $r -user root; done`（10-10 实勘：全 21 仓仅 TriCompany.git 中招 24 件，他仓零污染）。

**验证锚**：2026-10-02 22:26:02 chown 修复后 fleet fetch 双 ref 更新零错；22:40 轮 config-sync 绿跑候验。
