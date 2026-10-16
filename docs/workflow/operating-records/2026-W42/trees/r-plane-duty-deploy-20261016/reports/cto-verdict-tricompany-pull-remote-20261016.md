# CTO 技术裁决卷 · tricompany-pull job 持续 error（charter-002 发现项）· 2026-10-16

- sourceOfTruth: 本卷（trees/r-plane-duty-deploy-20261016/reports/cto-verdict-tricompany-pull-remote-20261016.md）
- syncMode: static（技术裁决卷·D-15 留痕·施工位 SDE 候排窗）
- lastSyncedAt: 2026-10-16T13:20:41+08:00（date 现查·写前跑）
- 令源: m-coo 13:11:40 裁决请（charter-2026-W42-002 窗毕发现项·台账五十二/五十三笔分诊转 CTO）
- 裁定: **案 c'「remote 重指形」（b/c 混合变体）——修树 remote 配置，job 原样零改动**

## 一·缺陷真身（活体现勘 13:11-13:18·非信面转述）

- 8710 healthz：`degraded=true, consecutiveFailures=3`（COO 信 2→现勘 3·持续涨实锚）。
- job 真身（8710 API 现读）：`tricompany-pull` = `cd /srv/fleet/TriCompany && git pull --ff-only origin dev`·*/15 节律·enabled。
- 错误根因：`/srv/fleet/TriCompany` 工作树 `origin = /srv/git/TriCompany.git`——**河源本机 bare 路径，而河源 `/srv/git/` 目录整个不存在**（现勘 ls 实锚）——部署时照抄 sg 拓扑写 remote、未建对应本地 bare 的部署遗留。
- **job 本身没错**：错误形态（git 报 repo 不存在）证明 job 正常执行了 git pull、是 remote 解析失败——修 job 是修错对象。

## 二·消费面（案 a 排除的关键证据）

同 daemon 现役 `weekly-plane-shift` job（周日 23:00 Asia/Shanghai）第一步即 `cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev` 后进 `/srv/fleet/TriCompany` 跑周平面迁移——**河源 TriCompany 树=周平面迁移唯一执行点的现役消费树**（在案先例：周平面迁移执行点记忆条）；且今日 charter-002 河源 13 席 duty 班组刚全量起树（12:23 13/13 全活）——R 面 duty 施工面源侧仓同步需求现役成立且刚加重。**案 a（删 job）排除。**

## 三·三案对表与裁定

| 案 | 判 | 理由 |
| --- | --- | --- |
| a 删/停 job | ✗ 排除 | 消费面现役成立（§二）——删=R 面源侧仓永停更 |
| b 改 job 指向 | ✗ 排除 | 修错对象：job 对、remote 错；且触发 command 变更→白名单/重启面（不必要风险） |
| c 河源建 bare+镜像链 | ◑ 留升级位 | 结构正解但新增常驻运维链（谁推河源 bare）——现需求（15min 级同步）不值当，候 R 面独立性需求出现再升 |
| **c' remote 重指（本席裁定）** | **✓** | `origin` 改指 sg bare（`ssh://fleet@47.245.122.61/srv/git/TriCompany.git`）——零 job 改动、零 store 变更、零重启、零新运维链；与 weekly-plane-shift 的 TriMetaverse 树拉 sg-bare 同构（河源现役先例） |

**现勘旁证四条**：①河源→sg bare 通路 fleet 身份 `git ls-remote` **实测通**（HEAD 回包在案）；②三方 TriCompany 同 hash `7080a0e`（本机/sg bare/河源树——当前零落后，本机下一推后即开始偏离，修复宜趁未落后窗）；③sg bare `/srv/git/TriCompany.git` 现役在位（15 仓全清单）；④本机 TriCompany push 链含 sg bare（M 面权威镜像链现役）——河源拉 sg bare=拉权威面，方向正确。

## 四·施工单（SDE·一次性三步·全 <5 分钟）

1. **树级 key 配置（身份无关）**：`git -C /srv/fleet/TriCompany config core.sshCommand "ssh -i /home/fleet/.ssh/id_ed25519 -o StrictHostKeyChecking=no"`——cron 子进程任何身份都带 key（weekly-plane-shift 同款 key 形；规避 root/fleet 身份分叉）；顺手对表树属主 `stat -c %U`（13 席 fleet 属主同构，预期 fleet）。
2. **remote 重指**：`git -C /srv/fleet/TriCompany remote set-url origin ssh://fleet@47.245.122.61/srv/git/TriCompany.git`。
3. **验真三查（D-52 增补款 A 同族·真触发证据禁受理回执）**：①手动 `git -C /srv/fleet/TriCompany pull --ff-only origin dev` 真通（已落后则追平）；②8710 healthz `consecutiveFailures` 归零+`degraded=false`；③下一 */15 节律拍后 origin/dev 仍对平（真触发证据）。

**回滚**：`git remote set-url origin /srv/git/TriCompany.git` 一行还原（秒级·零残留）。
**F-3 消解**：零 command 变更、零 cron store 变更、零重启——白名单/重启面全程不触。
**风险与缓解**：sg 单点依赖——sg bare 不可达窗=河源树停更+job error 可见（不静默损坏），sg=7×24 服务域可接受；冗余升级位=案 c 候需再升。

## 五·部署线沉淀（正形建议·交本树收口）

R 面部署脚本照抄 sg 拓扑写 remote（`/srv/git/<repo>.git` 本机 bare 形）时应**二选一**：建对应本地 bare，或写跨机可达 remote——本次 `tricompany-pull` 即漏检此步的遗留。建议入 n 系部署线收口注记（同族树如有同形 remote 一并勘修：TriAvatar/TriChain/TriCode 等在河源若有同形 origin 同病同修）。

## 使用依据

- 活体现勘（13:11-13:18 ssh R-HY）：8710 healthz+jobs 全清单（API token 读入零回显）·河源 TriCompany 树 remote/log/status·fleet ls-remote sg bare 实测·河源 /srv/git/ 不存在实锚；
- sg 侧现勘：/srv/git/ 15 仓清单+TriCompany.git 顶 hash；
- 本机现勘：D:/Code/ai/TriCompany remote 拓扑+顶 hash（三方同 7080a0e）；
- charter-002 卷：sde-n1-serial-launch-20261016.md（13/13 全活）·sde-n0-livereading（12:00 窗开锚）；
- 纪律：D-24（活体现探禁推定）·D-52 增补款 A（真触发证据三查）·F-3 家族性（受理≠执行）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 13:20:41 +0800·发毕对表）
