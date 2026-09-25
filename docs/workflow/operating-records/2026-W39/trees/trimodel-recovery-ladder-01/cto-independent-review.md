# CTO 独立意见·TASK-TRIMODEL-RECOVERY-LADDER-01 联审设计方案（七问）

- sourceOfTruth: 本件（CTO 独立意见树内正身；互不通气期独立产出，未与 CPO 交流）
- syncMode: draft（候与 CPO 合成双签方案后转 final）
- lastSyncedAt: 2026-09-25 22:1x +0800（date 现查 22:00:52 hook 链）
- 意见基线: 任务书终态 354ec7fb（含第六节追加令+四族勘正版）+ 本席实勘四件（下标）

## 实勘基础（本席亲勘，非转抄）

| # | 实勘项 | 读数 |
| --- | --- | --- |
| E1 | TriModel-Watchdog 计划任务 | **存在但 Disabled**（LG-045 遗产）；action=wscript → `.fade/trimodel-watchdog.vbs` → ps1 v2 常驻循环 |
| E2 | watchdog ps1 v2 逻辑 | 60s 探 `http://127.0.0.1:3333/health`（8s 超时）→非 200→wscript 拉起 launch.vbs→10s 复探→log 留痕；D-29 无窗已合规（Run 第二参=0） |
| E3 | TriModel 健康端点 | `/health` GET 在位（routes.ts L29）；业务端点 `/v1/config/keys` 需 Bearer token，返回 default_model（值面可断言） |
| E4 | TriMLC 仓 | 独立仓 `D:/Code/ai/TriMLC`，bin 名=`trilc`（package.json 实勘），daemon/server/heartbeat/cron 结构在；TriMLC-Watchdog 计划任务 Ready |
| E5 | 本机 watchdog 任务族全景 | TriMLC-Watchdog/TriRLC-Watchdog+Daemon/TriHubWatchdog/Seat-Watchdog 全 Ready——**本机 watchdog 基础设施成熟，唯 TriModel-Watchdog 停用** |
| E6 | policy 按 machine 分文件机制 | `policyPathForMachine(machine)` 在位（policy.ts）——四象限路由的现成架构钩子 |

---

## 问1·UI 直连配置页（功能边界+安全护栏）

**功能边界裁决：不新建自由 JSON 编辑器，扩展现役「直连兜底」区（fb-zone）为直连配置页。**

理由：①现役 fb-zone（LG-036 两套：TriMLC 本机+TriMMC sg）已是「写活体 settings.json 的结构化页面」，安全护栏骨架现成（校验/掩码/写后清空/备份承诺文案）；②自由文本编辑 settings.json 全量=半写/错键名/占位符穿透全开——09-25 事故全家族形态，**写入面必须锁死在结构化字段**（base_url/model/key 三件套）；③新页面=第二个写入面=事故面扩大。

页面能力（在 fb-zone 上扩展）：
1. 结构化编辑（三件套+provider 模板下拉，模板见问3）；
2. 「从 .deploy-key 注入」按钮（服务端读独立钥文件回填，**禁从活体读钥回填**——禁事故死循环形态）；
3. 高级区只读预览：将写入的 env 子集 diff 展示（只读，不可编辑）；
4. 页头常驻明示文案：「本页为日常便利配置层，TriModel 服务不可用时请用 trimlc 命令（恢复梯 L3/L4 通道）」——**「页面≠兜底」写进 UI，防误当兜底**。

安全护栏（09-25 事故五缺陷逐条对锁）：
| 护栏 | 对锁缺陷 | 实现 |
| --- | --- | --- |
| 备份先行+哨兵豁免 | ②-3 备份轮换自毁 | 写前 `.bak-<ts>` 备份+轮换近 5 份+`FROZEN-BACKUPS` 哨兵轮换豁免（修-3 同款） |
| 键名服务端锁定 | ②-1 键名错位 | 键名映射写死服务端，客户端只传值不传键名（修-2/5 语义） |
| 凭据健康门 | ②-1 空串穿透 | PLACEHOLDER/空串/纯空白三态全拒（修-1 同款），fail-closed |
| JSON 双向校验+值面断言 | ②-4 值面盲区 | 写前 merge 结果整文档 parse；写后回读断言（非空+与提交一致+JSON 合法）失败自动回滚（修-4 同款） |
| 掩码红线 | — | 钥值 len-only 日志（Format-ValueForLog 红线），GET 回读 masked 尾 4，写后输入框清空 |
| 审计行 | 完成即报缺位 | 每次写入结构化结果行（who/when/mode/备份路径/断言读数，钥值 len-only） |

与 LG-035 冻结面分界：本页只写 **claude settings.json env 子集**；trimmc-card.json/policies/local.json 归 LG-035 面（policy/card 冻结解冻只对 CEO 测试窗开放的边界不变）；页面挂 fb-zone 不进 TriMMC 卡。

## 问2·分层监督链拓扑（L1→L2 判定+探活+钥源+L3）

**拓扑：watchdog=进程级自愈（L1）→触发标记→TriMLC=配置级自愈（L2）→toast（L3）→人工（L4）。分层原则：进程死归 watchdog，配置坏归 daemon 命令，两者不混。**

- **L1 落地=启用现役资产零新代码**：TriModel-Watchdog 计划任务 Disabled→Enabled（E1/E2 实勘，探活/重拉/复探/日志全套现成）。
- **探针双层判定表（L1→L2 路由）**：
  - `/health` 非 200 → L1 重启；**连续 3 轮**（重启→10s 复探→60s 窗，约 3-4 分钟）复探仍 fail → 判「重启无效」→ 写 L2 触发标记（状态文件，路径=`.fade/trimodel-l2-flag`）；
  - `/health` 200 但业务探针 `/v1/config/keys` 401 或 default_model 空值 → **auth 死态→跳过 L1 直达 L2**（重启不救配置错误；键存在≠值面有效——09-25 教训④直接转为判定条件）。
- **L2 触发与执行**：TriMLC cron（现役机制）每 2min 扫 L2 触发标记+自探活（双层探针同款）→命中即调 `trilc restore-direct`（问3）→成功清标记+结构化结果行；失败（含钥源缺失）→置 L3 提醒态。
- **L2 钥源**：`.deploy-key` 独立钥文件（修-2 机制现成衔接，`~/.claude/settings.presets/.deploy-key`）——**禁从活体 settings.json 读钥**（活体可能被打空=事故死循环形态）。钥文件缺失/空 → fail-closed 不写半份配置，直跳 L3。
- **L3 toast**：Windows 原生 toast（Windows.UI.Notifications，零第三方依赖）；节律=TriMLC cron 每 30min 重提醒直至人工处置；**D-29 合规**=经 VBS 包装启动（Run 第二参=0，E2 现役同款形态）禁 conhost 闪窗；toast 文案携带 `trilc restore-direct` 命令全文（用户可复制执行=直通 L4）。

## 问3·跨平台命令族（勘正版四族）

**统一命令契约，四绑定实现。** 契约=三件套命令+同旗标语义：

| 命令 | 语义 |
| --- | --- |
| `restore-direct` | 恢复直连：读 `presets/<provider>.json` 模板+独立钥文件→凭据健康门→备份（哨兵豁免）→原子写 env 子集→写后值面断言→失败自动回滚→结构化结果行 |
| `config <list\|get\|set>` | 模板参数管理：list=列模板与现役 env 键形（len-only）；get/set=查改 base_url/model |
| `status` | 状态查询：TriModel health+keys 值面探针读数+现役 env 键形（len-only）+备份清单+L2 标记态 |

四族绑定（勘正版四象限，BOD 误写版作废）：

| 族 | 载体 | 平台 | 目标写入面 |
| --- | --- | --- | --- |
| trimlc | TriMLC 仓 bin（现名 trilc，E4 实勘） | 本机 Win | 本机 `~/.claude/settings.json` |
| trirlc | TriRLC 仓 bin | 本机 Win | 本机 `~/.claude/settings.json`（R 面域参） |
| trimmc | TriMMC 仓新增 CLI bin | sg Linux | sg 席位 settings 面（语义沿 LG-036 sg 通道，细节执行窗对表 8460 代理关系） |
| trirmc | TriRMC 仓新增 CLI bin | 河源 Linux | 河源侧 settings 面 |

实现形态：**共享 core 包**（TypeScript：凭据健康门/备份轮换/原子写/断言/结果行全纪律件）+四仓 bin 薄包装——四族一份纪律，防四实现四漂移。全局命令名解析现勘候执行窗首项（本机 trilc 现指 TriMLC dist 实勘过，其余三仓装位随部署窗定）。

**与 restore-claude-config.ps1 关系裁决：吸收取代。** 逻辑移植共享 core（该脚本 f887b27 FSD 修复版的修-1..6 全套纪律+沙箱 25/25 验证成果=core 实现的验收蓝本）；脚本退役为带外应急工具，保至命令族过首个里程碑后归档。注：脚本现处 frozen 态（897b0da），若裁吸收取代则解冻 revert 链可缩短——**frozen 件处置涉 BOD 权，本裁决标注候 BOD 联裁**。

**多模型模板三件套**：`presets/<provider>.json` = `{base_url, model, key_placeholder}`；bigmodel 第一实现（现役 presets/direct.json 改模板形）；deepseek 等后续加文件即插拔；钥不进模板（独立钥文件 per-provider 命名扩展 `.deploy-key.bigmodel`）。

## 问4·全链演练验收

**沙箱形态（禁真伤活体）**：配置写入全走 `-TargetDir` 沙箱目录（假 `~/.claude-sandbox`）；TriModel 演练实例 `TRIMODEL_PORT=3334` 副本；**真活体 settings.json 全程零接触——演练前后真活体 hash 零变化为总判据之一**。L1 例外：3333 进程重启本身=设计行为可真做（进程≠活体配置）。

故障注入矩阵（跑通判据=五行全过+留痕可审计）：

| # | 注入 | 期待层 | 断言 |
| --- | --- | --- | --- |
| F1 | kill 3333 进程 | L1 | ≤70s 探活 fail→拉起→health 200；log `revive attempt up=true` |
| F2 | 端口占位使拉起必败×3 轮 | L2 | L2 标记落盘→TriMLC cron ≤2min 拾取→restore-direct（沙箱）执行→结果行 |
| F3 | 沙箱活体置空钥+副本 3334 起 | L2 直达 | 业务探针 401/空值→跳 L1 直 L2（判定表 auth 死分支） |
| F4 | 移走 .deploy-key | L3 | fail-closed 零半写→toast 触发（截图+30min 节律断言） |
| F5 | 人工 restore-direct | L4 | 结构化结果行+沙箱配置恢复+status 探针全绿 |

## 问5·R-HY 部署面

**形态裁决：R-HY=TriModel 配置正身位（服务域集中位）；本机 3333 过渡期并行，终态退役为开发形态。**

- **部署形态**：Node 服务 systemd unit（`Restart=always`）——**systemd 即 R-HY 的 L1**（Linux 侧进程级自愈标准形态，R 面保活候建项由本 unit 先落第一块）；端口 3333 沿默认；`TRIMODEL_HOST=0.0.0.0`（服务域须被两面访问）；数据目录 `TRIMODEL_POLICIES_DIR`+卡/预设/presets 全集中 R-HY 位。
- **保活现势**：R 面无 watchdog（候建）——本 unit 的 systemd Restart=always 补位；**R 面 watchdog 候建项不因本单扩容**（另线，本单只落 unit 级自愈）。
- **与本机 3333 关系**：并行→收敛两阶段（退役节奏详问7）；过渡期本机 3333 定位=开发/演示形态，配置权威面逐步移交 R-HY。
- **存储与下发通道：拉取制（现成架构零改造）**——daemon key-cache 本来就是拉取语义（`TRILC_TRIMODEL_API_URL`/8713/8711 现役指本机 3333，改指 R-HY 端点即切）；**不做推送**（推送=新增通道=新增攻击面+新增故障面，违背地基论）。
- **两面拉取拓扑（终态）**：M 面=本机 TriMLC 8713+sg TriMMC 席位面；R 面=本机 TriRLC 8711+河源 TriRMC——各面 `TRIMODEL_API_URL` 指 R-HY。sg TriModel 部署位现势（d0bf218 范本/LG-036 sg 通道）候执行窗对表，若 sg 已有实例则归入「并行实例收敛」清单同处置。

## 问6·网络与安全面

- **公网鉴权**：TriModel 现有 Bearer token 门（读 API_TOKEN/写 ADMIN_TOKEN 分权）在位，公网暴露前加固三件：①**TLS 终端**（Caddy 反代自动证书为建议位；node 原生 HTTPS 为退阶）；②ADMIN 写面独立强 token+限流（写面=高风险面，与读面异权）；③R-HY 安全组最小开位（443/反代口；3333 直口不开公网，仅环回+内网管理）。
- **通路勘验（候执行窗首项，活体优先诊断法）**：本机→R-HY、sg→R-HY 双通路 curl 三态（TCP 通/TLS 握/带 token 200）实测留痕；D-24 机位断言纪律照守（dev/sg/河源各走各面通道）。
- **两面两域路由模型**：**machine 标识=四象限路由键**——`policyPathForMachine(machine)` 现成机制（E6 实勘）扩展为四分区命名（如 `m-local`/`r-local`/`m-sg`/`r-hy`），配置按 machine 隔离存储、按域下发；UI 域标签（runtime-info domain_label）同构扩展。四象限=M/R × 服务域/本地域全覆盖，与问3 四族命令一一对位。

## 问7·恢复梯立体化

**两段恢复梯（R-HY 上位后）**：
- **服务域梯**：R-HY TriModel 故障 → systemd 重启（L1'）→ 无效（连续 N 次重启循环探测仍 fail）→ **各面 daemon 探活失败感知**（M/R 两面本地 daemon key-cache 拉取连续失败 N 次=远程面故障的共同观测位）→ 各面独立降级本地直连（L2'：trilc/trirlc 各调 restore-direct，钥源=各域自己的 `.deploy-key`）→ L3 toast → L4 人工。
- **本地域梯**：不变（问2 拓扑），唯探活对象从本机 3333 改指 R-HY 端点。
- **衔接关键**：本地降级钥源永远是**本域 .deploy-key（唯一本地恢复锚）**——远程配置面挂不挂，本地直连锚独立可用；presets 模板本机留副本（拉取制断链时本地模板仍可生成完整直连配置）。
- **本机实例退役节奏（里程碑制）**：M1=R-HY 部署+四象限配置迁移完成+通路三态验绿 → M2=两面 daemon key-cache 全改指 R-HY+观察周（读数：拉取成功率/降级误触发率）→ M3=本机 3333 停用（TriModel-Watchdog 计划任务再 Disabled+启动项撤+3334 演练副本清理）。**退役≠兜底退役**：退役后本地兜底=.deploy-key+presets+trilc 命令（零服务依赖，L4 锚永在）——CEO 地基论的最终落点。

## 边界自检

R-HY=新增部署不动生产数据（CEO 开闸收讫）；生产冻结面不解冻只开 TriModel 部署位；方案未批三面（页面/daemon/命令）不动工；活体操作全程事故案补丁门；D-24 机位断言+sg 走 BOD 通道不经本地中转。

## 使用依据

任务书终态 354ec7fb；本席实勘 E1-E6（计划任务族/wacthdog ps1 vbs 本体/TriModel routes/TriMLC package.json/policy.ts machine 机制）；09-25 事故复盘报告+修-1..6 方案（trees/incident-sde-settings-01/cto-review-report.md）；restore-claude-config.ps1 f887b27 沙箱验证读数；LG-036 兜底两套现役形态（ui/index.html fb-zone）；memory 双控制器端口定性（8713=M 本地/8711=R 本地）。
