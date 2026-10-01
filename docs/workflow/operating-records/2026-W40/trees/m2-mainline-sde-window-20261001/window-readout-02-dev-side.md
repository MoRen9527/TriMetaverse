# M2 主链 SDE 车道·窗读数②（dev 机侧段）

- 执行: m-sde（dev 机）；窗令=BOD 代发版+COO 版双达同文无冲突（车道划分以 COO 勘误版为准）；本卷=本机份额（sg 面作业权=m-duty-sde 值席，分域防撞车）
- 时点: 全部读数 2026-10-01 20:59-21:12+08 现采（12:59Z-13:12Z，date 现查锚）

## 一、item4 钟漂·采样2/3（dev 侧交叉探）=稳定同步级 ✅

- 探2（12:59:39Z）：healthz HTTP 200，0.10s
- 探3 区间法（13:06:23-25Z）：t0=13:06:23.564／R-HY Date 头=13:06:25／t1=13:06:25.268 → **钟漂∈[−0.27s, +1.4s]**
- 与值席采样1（11:26Z ≈1s）构成**两机两时点交叉（跨 1.6h）=稳定同步级；旧疑快 6m22s 确证不复现**（batch-04 疑读归因候 R-HY 侧记录）
- 观察周（改指毕起 7 天）随窗续测留痕

## 二、item1 前置·本机→R-HY 通路三态复验留痕 ✅

| 态 | 读数 |
| --- | --- |
| 8710 healthz | **200 全绿双探**（探1 12:59:33Z body `ok:true`/cron `enabled:false jobCount:0` 零降级；探2 200 0.10s） |
| 443 TLS | **网络层通**——严校 `SEC_E_UNTRUSTED_ROOT`=自签根预期拒（非网络阻）；openssl 实锚 leaf：CN=trimodel-r-hy 自签／SAN=IP 127.0.0.1+**8.155.54.79**+localhost／有效期 2026-09-26→2028-12-29（与 M1 卷 825d 部署形一致） |
| 3333 公网 | timeout 5s=**不可达保持 ✓**（A4 红线形态完好） |

## 三、item1 改指落点重勘·本机半（窗内裁决清单 #3 消费料）

1. **键名勘误点**：任务书裸 `TRIMODEL_API_URL` 系泛写——实锚键名**按仓分形**：TriMLC=`TRILC_TRIMODEL_API_URL`（`src/config/env.ts:170`，默认 `http://127.0.0.1:3333`=未设即本地锚，红线现役实现）；TriRMC 对照=`TRIRMC_TRIMODEL_API_URL`（M1 卷 app.ts L825 同构）。改指执行按各仓实锚键名落。
2. **本机落点位**：`%LOCALAPPDATA%\trimlc-daemon-channel.cmd` set 区（L3-17；现无 URL 键，改指=新增一行 set）。**⚠ 同文件承载连锁段 token 轮换**（TRILC_INTERNAL_TOKEN L12+TRIMC_INTERNAL_TOKEN L10）——两变更同文件须并批一次 restart（联动协调点窗读数①已提，候编排层标注联动序）。
3. **目标值形态**：`https://8.155.54.79`（443 Caddy 反代正门；daemon 拉取=GET 读面=Caddy gate 放行态；TRIMODEL_API_TOKEN 已在启动器 L11=鉴权头候用面）。
4. **⚠ 客户端信任面=改指执行关键前提（工序单增补建议）**：自签 leaf 严校必拒（NODE 默认 reject unauthorized）——执行时须 `NODE_EXTRA_CA_CERTS=<leaf pem>` 同批落（本机可 `openssl s_client -showcerts` 自取零跨机依赖；或河源 `/etc/caddy/tls/` 取料走 BOD 通道）。**裸改指无信任面=拉取必失败降级**。
5. 本机 8713 现役形态（零触碰实录）：healthz 全绿（trimlc/mc_link connected/cron 6 jobs 零降级/uptime 86773s）；启动器含 TRIMODEL_API_TOKEN（值零出机）+TRIMC_BASE_URL=127.0.0.1:18710 隧道形（09-30 8712 迁移窗 A 案）。本段纯只读勘验，daemon 本体零触碰零 restart。

## 四、item2/伴窗现势（候依赖面，本段零动作）

- item2（sg 机内 PUT card）：值席车道；键值候供=连锁段③（FSD 车道）
- chromium/CORE_VERSION：工序单+checklist 已卷（窗读数① §四候核两项维持候裁态）

## 五、车道终态

- 本机份额读数段全绿收口：item4 钟校稳定级+item1 前置三态留痕+落点重勘四件产出
- item1/item2 **执行段候连锁段③收口读数**（键值窗链 item5→回滚锚门，FSD 车道）+同文件并批标注——零抢跑
- sg 面零触碰（作业权=值席）；超载判定=零（本段 21:12 前毕，余量充足）

## 使用依据

- 窗令：BOD 代发版（sg 树 tonight-window-order-20261001.md）+COO 窗令（19:21 发）；车道正身=COO 勘误版（SDE=M2 主链 item1/2/4+伴窗）
- 工序正身：task-charter-trimodel-m2-cutover-01.md（W39 树）+batch-05 m2-execution-order-alignment.md（依赖序总览）+task-inventory-20260930.md LG-054 行（b87a7a31）
- 值席卷：窗读数①（946afdfc，链头门+采样1+现势盘点）
- 源码实锚：TriMLC src/config/env.ts L170（键名+默认值）；本机启动器 trimlc-daemon-channel.cmd（L3-17 set 区全读，值零出机）+trirlc-daemon.ps1（8711 对照，TRIMC_BASE_URL 已指 R-HY=M1 产物）
- M1 实锚：deploy-readings.md（Caddy 443 自签 SAN/写面 gate/3333 不可达）+rhy-switch-readout-20260929.md（tier1 接线/键名正形）
- 纪律：D-04（时刻现查）/零真值（token 值零出机，键名级+掩码）/机位前缀（河源 8710 唯一对外、sg 8712=TriMMC、本机 8713=TriMLC）/活体优先/边界=R-HY 生产冻结面零触碰
