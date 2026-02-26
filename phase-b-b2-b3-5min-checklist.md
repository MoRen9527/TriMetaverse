# Phase B 收尾（B2/B3）5 分钟最短清单

更新时间：2026-02-26

## 目标

- 用最少步骤补齐两项人工证据：
  - B2：GitHub Mobile 端“查看/评论/审批”可用性。
  - B3：非作者账号对 PR 的一次 Approve 证据。

## 前置

- 你已登录 GitHub Mobile。
- 有一个“非作者账号”（协作者）能访问 `MoRen9527/TriMetaverse`。

## Step 1（手机，约 2 分钟）

1. 打开 PR：`https://github.com/MoRen9527/TriMetaverse/pull/2`
2. 在手机端确认可见以下入口：
   - 查看 diff
   - 评论（Comment）
   - 审批动作入口（Review / Approve）
3. 在 PR 留一条短评论（示例：`Mobile check OK (view/comment/review visible)`）。

通过标准：评论成功发送，且能看到审批入口（即使该 PR 已合并，也可作为“入口可见性”证据）。

## Step 2（网页，约 2 分钟）

1. 用主账号新建一个临时文档 PR（只改一行）：
   - 建议文件：`phase-b-pilot-record-2026-02-26.md`
   - 标题：`[Phase-B-Pilot] non-author approve evidence`
2. 切换到“非作者账号”进入该 PR，执行一次 `Approve`。
3. 主账号合并 PR（squash 即可）。

通过标准：PR 时间线出现 `approved these changes`（非作者账号）。

## Step 3（回填，约 1 分钟）

将以下内容追加到 `phase-b-pilot-record-2026-02-26.md`：

```markdown
## B2/B3 补充证据（人工）

- B2（GitHub Mobile）：
  - 设备：
  - 时间：
  - PR 链接：
  - 结果：可查看 / 可评论 / 可见审批入口（是/否）

- B3（非作者 Approve）：
  - PR 链接：
  - Approver 账号：
  - Approve 时间：
  - 结果：已完成（是/否）
```

## 注意

- GitHub 规则不允许“作者审批自己 PR”，因此 B3 必须使用非作者账号完成。
- 若手机端因网络抖动无法稳定操作，先用 Web 端完成审批，再回手机补截图/评论证据。