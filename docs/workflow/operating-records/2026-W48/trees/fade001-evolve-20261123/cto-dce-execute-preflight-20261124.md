# CTO 前置清单卷·dce 真跑（DCE_EXECUTE=1）六项前置+点火形态（2026-11-24 17:5x·CEO 批授权窗）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-dce-execute-preflight-20261124.md·前置清单正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 批「dce 开关和授权窗都开」（BOD 转 17:52）+CTO dce dry_run 根因卷（chain argv 无 --execute）

## §一 · 真跑六项前置（pull/migrate/commit/push 不可逆）

| # | 项 | 判据 | 责任面 |
|---|---|---|---|
| 1 | **目标树清洁** | 两仓（TMV/TriCompany）`git status` 干净（除 `.fade/` 运行面） | SDE 核 |
| 2 | **无冲突预检** | dry_run 渲染面已绿（resume15 实证）+W47 待搬树清单明（dce 的 migrate 目标段） | CTO/SDE |
| 3 | **回滚锚** | **dce 前打 tag `pre-dce-resume16`**（两仓）+记录当前 HEAD sha（回滚=`git reset --hard <sha>` 或按段 revert） | SDE 执行 |
| 4 | **两面一致性** | R-HY 树状态 vs 本机/部署副本（W47 已搬 or 待搬·无半态） | SDE 核 |
| 5 | **权限/路径** | R-HY `/srv/fleet/` 目标树可写+pull/migrate 的源树可读+push 认证通道（内网/sg 备援） | SDE 核 |
| 6 | **成本/时间窗** | 四步真跑预计时长（分钟级）+成本（CFO 面知会）+链空闲窗（D-91 照役） | CTO/SDE |

## §二 · 点火形态（DCE_EXECUTE=1 注入形）

**定形**：**SDE 起 ignite 时以 shell env 前缀注入**——`DCE_EXECUTE=1 <ignite 命令>`（`spawn` 默认继承环境变量→`chain_runner` 读 `process.env.DCE_EXECUTE`→dce argv 加 `--execute`）——**最简无代码改 ignite**·**只 dce 段读该 env**（其他段不读·安全）——env 生命周期=该 ignite 进程（一次点火=一次授权）。

## §三 · 真跑验收判据

1. dce.json：**mode="execute"**+verdict="pass"（L273 三前提：execute+all checked+all ok+无 failed_step）+四步 rc 全 0；
2. **分数首次有效**（score 段 G 族真判 execute 面）；
3. **零残留**（无半迁移态）。
4. **失败处置**：任一步 fail→dce verdict=fail→段门拒→链停+回滚锚（tag）可用。

## §四 · 使用依据

CEO 批令（BOD 转 17:52）+CTO dce dry_run 根因卷（chain argv L140-142/dce_steps L215-273）+dce_steps 头注 L5（注释勘正随件）+D-15/D-24/D-27 v4/D-46/D-47/D-91。

——CTO 小狄（m-cto）·写前现查 2026-11-24T09:29:03Z（+0800=11-24 17:29）〔commit 时戳锚·D-47 正形〕
