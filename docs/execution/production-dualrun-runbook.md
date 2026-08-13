# 生产双跑 Runbook — TriLC ↔ TriMC（M3-R2）

> sourceOfTruth: TriMetaverse/docs/execution/production-dualrun-runbook.md
> syncMode: source-only
> lastSyncedAt: 2026-08-13
> 作者: 小全（r14-production-dualrun / r14-2）
> 契约依据: `TriCompany/docs/engineering/heartbeat-dualrun-contract.md` v1.0（commit bf36e4c）

## 一、当前形态与产物

| 项 | 值 |
| --- | --- |
| 本地生产产物 | `output/TriMetaverse-Desktop-v0.4.4-r14-windows.zip`（58.68MB，contracts 14/14 v3.0，version.json 0.4.4 无 BOM） |
| 现役安装 | C:\Program Files\TriCade（ARP 26.08.05.1，RegRun 启动） |
| TriMC 服务器 | systemd trimc.service，/srv/fleet/TriMC 源码 + npx tsx（M1 dev 直跑） |
| 心跳契约 | v1.0：TriLC 10s/3败/2成/5min退避（零改动）；TriMC 节点心跳表 30s/180s/2 次回归（r14-2 已接线） |

## 二、部署步骤

### 2.1 本地生产仓（提权一次执行）

```powershell
# 管理员 PowerShell
powershell -ExecutionPolicy Bypass -File D:\Code\ai\TriMetaverse\scripts\install-tricade.ps1 `
  -ZipPath D:\Code\ai\TriMetaverse\output\TriMetaverse-Desktop-v0.4.4-r14-windows.zip -Force
```

- 门禁行为（5.4 已验）：现役 ARP 26.08.05.1 vs 产物版本 0.4.4 → 降级路径警告放行（-Force 跳过同版本拦截的语义差异，产物 trilc/version.json=0.4.4 与 ARP calver 属不同版本命名空间，安装后以 trilc/version.json 为准）
- 安装后自动备份现役 `trilc.bak-yyyyMMdd-HHmmss`
- 验证：`curl http://127.0.0.1:8711/healthz`（预期 version 0.4.4）+ `curl "http://127.0.0.1:8711/internal/v1/agents?scope=company"`（预期 count 14，tricompanyEnabled true）

### 2.2 服务器面（blocked，见 §五）

## 三、双向切换预案

### 3.1 TriMC 不可达 → TriLC 续跑

- 判定：TriLC 连接视图 3 次心跳失败 → degraded（现有机制，2.5 已验）
- 行为：degraded 状态本地任务继续执行；事件进 pending 队列；超 5min 转 60s 慢心跳
- 恢复：2 次成功 → connected，`_performReplay()` 重放 pending + TaskMirrorPusher 全量推送
- **TriMC 侧新能力（r14-2）**：TriLC 失联超 30s（degraded 慢心跳期 180s）→ 该节点任务标 unknown；心跳回归 2 次 → known

### 3.2 TriLC 挂 → TriMC fallback

- 判定：TriMC 节点心跳表超阈值 → markNodeUnknown（r14-2 接线，此前为盲区）
- 行为：TriMC 将失联节点非 terminal 任务标 unknown（任务查询端可见）
- 恢复：TriLC 重启后心跳 2 次 → known；TriLC 侧 replay 全量事件覆盖（恢复对齐主路径，TriMC 回流标记为可选增强未启用）

### 3.3 恢复动作幂等

- TriLC replay 幂等（2.5 已验）；TriMC recordNodeHeartbeat 幂等（重复心跳只更新 lastSeenAt）

## 四、回滚预案

| 场景 | 动作 |
| --- | --- |
| 本地新版本异常 | 停 daemon → `C:\Program Files\TriCade\trilc` 改名 → `trilc.bak-*` 还原为 trilc → 重启 daemon（RegRun 自动拉起或手动 node dist/index.js） |
| 需要降级到旧包 | install-tricade.ps1 指定旧版本产物：版本门禁降级路径警告放行 + 自动备份（5.4 已验） |
| TriMC 心跳接线异常 | TriMC 回滚：`git revert` r14-2 接线 commit + 服务器 tsx 重启（需服务器权限，blocked） |
| 心跳误判风暴 | TriMC 端停扫描：临时改 scanStaleNodes 调用注释或重启前 TRIMC 环境变量（未实现开关——登记为观察项，若生产出现误判再补开关） |

## 五、blocked 批量清单（CEO 一次执行，契约 §5.2）

| # | 项 | 卡点 | 执行动作 |
| --- | --- | --- | --- |
| 1 | push sg-server | git 写权限 | `git push sg-server dev`（本地领先 3+ commits，含 r14-2 接线） |
| 2 | 服务器 git pull + 重启 | 服务器操作权限 | ssh sg-ecs-server：`cd /srv/fleet/TriMC && git pull && sudo systemctl restart trimc`（验证 /tmp/trimc-run.log） |
| 3 | 联通面启用 | 环境变量 + 防火墙 | 本地 TriLC 设 `TRIMC_BASE_URL=http://<服务器>:8710`；服务器防火墙放行 8710（契约 §2.3） |
| 4 | M3 生产形态改造 | 记 M3 后续里程碑 | TriMC dist 构建 + 版本化部署替代 dev tsx 直跑（不入本树） |
| 5 | UAC 提权安装 | 管理员权限 | §2.1 的 install-tricade.ps1 命令 |

## 六、验收核对点（r14-3）

1. 契约参数两端实读一致（10s/3/2/30s/180s/2）
2. TriMC 单测全绿（登记/30s unknown/180s 不误判/2 次回归）
3. `markNodeUnknown` 有调用方（grep src/mirror/store.ts scanStaleNodes）
4. 心跳响应向后兼容（payload 结构未变，只加登记副作用）
5. TriMC 全量 457/460（2 fail 预存 pipeline tier 断言 + 1 skip O3 win32）
6. TriLC 核对两项过（payload 带 state、replay 幂等），零改动成立
7. 服务器面清单（§一表）与 r14-1 盘点一致
8. 硬卡五项登记完整（§五）

## 七、更新记录

- 2026-08-13 初版（r14-2）：契约 v1.0 落地后部署/切换/回滚/blocked 全链文档化
