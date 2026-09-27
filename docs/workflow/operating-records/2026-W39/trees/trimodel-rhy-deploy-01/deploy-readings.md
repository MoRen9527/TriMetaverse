# LG-054 TASK-TRIMODEL-RHY-DEPLOY-01 部署落地段读数（执行序③④⑤·SDE 承办）

- sourceOfTruth: 本件（部署落地段读数留痕正身；前置勘验=同目录 predeploy-survey-readings.md；任务书=f1f89ee3）
- syncMode: append-only（部署读数追加）
- lastSyncedAt: 2026-09-26 16:48 +0800（date 现查 16:47:56）
- 执行席: SDE 小布；face=R 面（R-HY 8.155.54.79）
- 授权链: CEO 16:08「现在部署」→ BOD 四裁（bundle 先启/不阻塞清单/部署毕 sg 三态亲勘/443 候 CEO）→ CTO 门审 a03a81e9（整位重建裁可/门审基线 1972d83）

## 一、部署源与构建读数（执行序③前半）

| 项 | 读数 | 判 |
|---|---|---|
| 部署源 | git bundle 双件（TriModel 1.2M+TriCode 8.6M）scp 直投 R-HY:/srv/fleet/，verify 双 PASS | ✓ BOD 裁准 |
| TriCode 重建 | clone@d20cb6b detached+origin set-url 重指 GitHub（CTO 注记）+npm install+build PASS（dist/trimodel-cli 在位） | ✓ 技术债⑩销债 |
| TriModel 重建 | clone@1972d83 detached+npm install（file: 符号链接解析实证）+build PASS（dist/src/server.js 在位） | ✓ 门审基线 |
| **部署源污染拦截（自报）** | bundle 标签 1972d83 但 clone 出 bc72ea4（FSD 波⑤ D1 笔 16:20 入 dev，在我打 bundle 前 3 分钟；工序瑕疵=勘 HEAD 后未在打 bundle 前重勘）。处置=R-HY `checkout 1972d83` 回退门审基线，HEAD-ASSERT-PASS；**bc72ea4 留仓未部署**，候 CTO 审毕随 M2 或另笔补部 | 自报 |
| 快照锚 | 旧散拷贝整位 `mv` → `/srv/fleet/TriModel.bak-20260926-pre-lg054/`（CTO 附裁 a） | ✓ |

## 二、测试读数与归因（全量纪律）

| 仓 | R-HY 全量 | 本机同基线对照 | fail 归因 |
|---|---|---|---|
| TriCode | 41 pass+1 fail | 58/58/0 全绿（同 sha d20cb6b） | ①计数差=glob 退化漏根层（sh 无 globstar，`test/**/*.test.ts` 单层匹配）；根层 digest-chain.test.ts 单跑 17/17 全绿→41+17=58 对平。②1 fail=FROZEN-BACKUPS 哨兵（five-gates 轮换豁免断言 6!==7）=HOME 环境依赖型 |
| TriModel | 5 fail（policy.gate.e2e 族+anthropic-proxy 2 件） | policy 族挂因=ERR_MODULE_NOT_FOUND `/srv/fleet/TriRLC/src/config/key-cache.ts`（R-HY 只有旧名 TriLC）+netstat Windows 格式依赖；anthropic-proxy 本机 1972d83 worktree 19/19 全绿 | 全部环境型（TriRLC 路径/netstat 格式/HOME 形/本机 3333 活体依赖），无部署运行时代码缺陷命中 |

- 归因结论：**双仓构建产物过门**；跨机测试基座适配 owner=STE（TriRLC 旧名路径/netstat/哨兵 HOME 三族）。
- R-HY TriCode 递归模式对照读数异常（`--test test/` 目录模式 # tests 1）已弃用该方法，以根层单跑+本机对照为准。

## 三、systemd unit 与 A1 活体三态（执行序③后半）

- unit：`/etc/systemd/system/trimodel.service`（systemd-analyze verify PASS；verify 另两条告警系阿里云 cloudmonitor 既有 unit，未触碰）
- 设计：User=fleet（对齐 TriRMC 惯例）/WorkingDirectory=/srv/fleet/TriModel/Restart=always RestartSec=3/NoNewPrivileges+PrivateTmp
- env 钉位：TRIMODEL_HOST=0.0.0.0、TRIMODEL_PORT=3333、TRIMODEL_POLICIES_DIR=/srv/fleet/trimodel-data/policies、TRIMODEL_CARD_FILE=/srv/fleet/trimodel-data/trimmc-card.json、EnvironmentFile=api-token.env（600 fleet）——**代码/数据分离**（D9 路径规范化正身：env 钉位>cwd；数据独立根使代码位整位替换零数据迁移）
- A1 三态：systemd 拉起 active ✓ + **Restart=always 活体实证**（kill -9 → NRestarts=1 → 新 pid → /health 200 in 0.026s）✓ + /health 200（0.035s，`{"ok":true,...}`）✓

## 四、Caddy 装配就绪态+写面 gate+token 三命令（执行序⑤，M1 加固件）

- Caddy 2.6.2（apt 单包 `--no-install-recommends`，只装不动其他包=BOD 呈备条款；deb 默认 Caddyfile 留锚 Caddyfile.deb-default.bak）
- TLS：openssl 自签 leaf（SAN=127.0.0.1/8.155.54.79/localhost，825d）落 /etc/caddy/tls/（640 root:caddy）。弃 `tls internal` 根因=caddy 启动尝试 sudo 装根进系统信任库失败（caddy 非 sudoer）→握手 internal error
- admin API：`admin localhost:2019`（显式回环收敛；`admin off` 与 graceful reload 互斥——自举教训：改配置文件需 restart 一次解除，此后 reload 链全程可用）
- **写面 gate（Caddy 层）**：`@write_no_auth` PUT/POST 非 Bearer → 401；读面（GET/health/UI）放行。实弹：GET 经 443→200 透传 ✓ / PUT 无 token→401 ✓ / PUT 带 token→400 业务层（与直打 3333 对照同码=反代透传）✓
- **候 CTO 追认①（实现层裁量）**：方案问6「ADMIN 写面独立强 token」在代码侧未实现（server.ts/routes.ts 无 token gate，routes.ts L69 注释明示 policy GET 为 P1 no-auth 口径）——本席将写面 gate 落 Caddy 层（零代码变更、零未审笔叠加；443 公网未开=装配全程零裸奔窗口）。若 CTO 裁应用层实现，候 M2 前 FSD 另笔
- **候 CTO 追认②（缺位呈报）**：限流——Caddy 2.6.2 标准发行无 rate_limit 模块，本波未落，候插件构建或应用层另案；443 公网未开前非暴露面
- **token 三命令（A5）**：`/usr/local/sbin/trimodel-admin-token`（gen [outfile] / revoke <head4><tail4> / list）——真源 /etc/caddy/tokens.list(root:600)，Caddyfile gate 段锚替换渲染+caddy validate 失败不 reload（fail-safe）+graceful reload
- **A5 实弹读数（全值零回显）**：双枚并行窗（枚1 23bf PUT=400+枚2 c401 PUT=400+无 token=401）✓ → gen 新枚（全值仅经 600 临时件一次性交付）→ 新枚即活 PUT=400 ✓ → revoke → 已吊销枚 PUT=401 ✓ 存枚未殃及 PUT=400 ✓ → 终态窗 2 枚。违反并行窗=FREEZE 硬判据达成

## 五、四象限迁移与 A3 对表（执行序④）

- 迁移件：本机活体 `D:/Code/ai/TriModel/policies/local.json`（1076B，LG-035 时段调度档：GLM-5.3 深窗/deepseek-v4-pro 晚窗）+`trimmc-card.json`（2631B，含加密 key 条目）→ scp（SSH 加密通道）→ `/srv/fleet/trimodel-data/{policies/local.json, trimmc-card.json}`（卡 600/policy 640/fleet 属主）
- 载入：systemctl restart 后 boot 日志 `card migration: already-canonical`（迁移卡被识别为规范位）✓
- **A3 对表**：GET /v1/config/policy（machine=服务端固定 local，policy.ts L215 注释明示）R-HY 与本机返回**逐字节同构**（同 schedule id/双窗/时区）✓
- keys 门真 token 读数：`{"object":"config.keys","default_model":"deepseek-v4-pro",...}`——卡内容活体生效 ✓
- 四象限分区口径：policies/ 目录 per-machine 文件位现成（policyPathForMachine 参数化 API 在库）；config-plane 读面单档口径（S11.2 机为参数）。machine 键由 M2 各面 daemon 拉取时落位
- 真源唯一对表：R-HY 位=指定新真源（数据根独立+env 钉位证据在 journal）；本机旧位继续主用至 M2 切指（真源切换时点=M2，M1 期间双位并存内容一致）

## 六、A2 通路三态（机内段全绿+跨机段候排）

| 态 | 机内读数 | 跨机 |
|---|---|---|
| TCP | 127.0.0.1:3333 直打全通 | 本机→R-HY:3333 公网 timeout（=A4 不可达保持）✓ |
| TLS | 443 自签 curl GET 200（0.017s） | 本机→R-HY:443 公网候安全组通道；sg→R-HY 候 BOD 亲勘（部署毕=现可排，D-24 走 BOD 通道） |
| 带 token 200 | GET /v1/config/keys Bearer api-token → 200（无/错 token=401 fail-closed） | api-token 掩码=len64 head=3608****tail=cee7（消费方 M2 交付） |

## 七、验收锚状态表（M1 五锚）

| 锚 | 状态 | 依据 |
|---|---|---|
| A1 活体三态 | **绿** | §三 |
| A2 双通路三态 | **机内绿**/跨机候排（443 通道+BOD 亲勘） | §六 |
| A3 四象限迁移+对表 | **绿** | §五 |
| A4 公网三件+3333 不可达 | **4/5 绿**（TLS ✓/写面 token ✓/3333 不可达 ✓ 保持；443 开位候 CEO 通道；限流候补追认②） | §四 |
| A5 token 三命令+并行窗 | **绿** | §四 |
| 回滚锚成文 | 见 §八 | |

## 八、回滚锚（RB-01，成文）

1. 停服：`systemctl disable --now trimodel.service`
2. 代码位回退：`mv /srv/fleet/TriModel /srv/fleet/TriModel.failed && mv /srv/fleet/TriModel.bak-20260926-pre-lg054 /srv/fleet/TriModel`（数据根 /srv/fleet/trimodel-data/ 独立，零数据迁移）
3. Caddy 回退：`mv /etc/caddy/Caddyfile /etc/caddy/Caddyfile.lg054 && mv /etc/caddy/Caddyfile.deb-default.bak /etc/caddy/Caddyfile && systemctl restart caddy`（或 `systemctl disable --now caddy` 整体下线）
4. token 窗作废：清 /etc/caddy/tokens.list+删 api-token.env（消费方未上=零影响）
5. 验证回部署前态：ss 断言 3333/443 无监听
- ROLLBACK 判据：smoke 失败/关键指标异常/CTO 决策（部署决策三分法）；当前 DEPLOY 态五锚读数在卷

## 九、边界守约声明

- R-HY 生产冻结面零触碰：TriRMC/trilc 族 unit 与 8710/8711 现役面只勘未动；cloudmonitor 告警只读未修
- 本机活体（3333 旧真源）零触碰（迁移为只读拷出；card 16:37 mtime 变动系活体自身刷新，未干预）
- sg 侧未涉（D-24）；M2/M3 零越位（daemon 改指/本机退役均候另单）
- 涉配置写面全程备份锚（Caddyfile.deb-default.bak/整位 bak）+值面验证（对表读数）

## 十、候决/候追认汇总

1. **候 CTO 追认①**：写面 gate 落 Caddy 层的实现层裁量（§四）；
2. **候 CTO 追认②**：限流缺位候补方案（插件构建 vs 应用层）；
3. **候 CEO**：安全组 443 开位通道（另呈在途，A4 最后一态+跨机 TLS 三态依赖之）；
4. **候 BOD**：sg→R-HY 三态亲勘排期（部署毕=现可排）；
5. **候 STE**：跨机测试基座适配三族（TriRLC 旧名路径/netstat Windows 格式/哨兵 HOME 形）；
6. **候 CTO**：bc72ea4（FSD 波⑤笔）审毕随 M2 或另笔补部 R-HY。

## 十一、A2/A4 跨机段对表注记（BOD 基线轮入卷）

- BOD 16:5x 亲勘 sg→R-HY（D-24 亲勘，经 m-coo 16:51 +0800 转达到本席）：TCP 443=TIMEOUT（安全组未开基线）/ **TCP 3333=TIMEOUT（本件 §六 A4 不可达读数获跨机独立复证 ✓）** / TCP 8710=OPEN（对照锚=断的只安全组两口，路径本身健康）/ TLS 443 超时（与 TCP 断一致）。BOD 定性=基线轮成立。
- **终态轮对齐条款**：443 开位后本席 A4 终态补段与 BOD 同法终态轮（TCP/TLS/带 token 200 全量三态）成对执行、两轮成对入卷=通路闭环证据链。
- c91e3772 五锚+技术债⑩销口经 m-coo 录账确认（16:51）。

## 十二、CTO 门审第二单裁项对表（正身 cto-gate-review-2.md @ de98db19，经 m-coo 16:51 +0800 转达）

| 裁项 | 裁决 | 本席执行态 |
|---|---|---|
| 写面 gate Caddy 层 | **裁可追认**（裁量正当：零代码变更+零裸奔窗口+实弹三读数+A5 并行窗硬判据记档正面） | §十候追认①销口；**双层制**=Caddy 层 gate 常设不拆+问6 应用层 ADMIN token 候 M2 FSD 另笔 |
| 限流 | **M1 不阻、443 开位硬前置条件**——开位时限流未到位不开；选型候 M2 优先 xcaddy 插件构建 | §十候追认②升级为硬前置注记：**A4 终态依赖链=CEO 443 通道＋限流落位（两项齐方开位）**；排程候编排层定（限流提前落 vs 443 缓开） |
| bc72ea4 补部 | **验收毕即补部**（另笔不随 M2）；触发=STE D1 验收毕 | 配方照录：R-HY 单笔 fetch+merge+rebuild→机内 A2 三态复验+gate 401/400 复验，履行读数随报。本席候触发执行 |
| 污染拦截自报 | 记档正面（回退基线+如实处置） | 已录 |
| 工序教训 | **打包前重勘 HEAD 断言（勘→打→重勘一致方出包）**入卷 | 本席认领：后续 bundle 打包工序照此执行（三步断言制） |

- CTO 定性：机内段验收通过；跨机段候 443/BOD 亲勘照旧。
- 门审第二单与本读数件关系：追认后 §四 Caddy 层 gate=正式配置面（非临时裁量态）。

## 十三、M1 基础限流落位读数（COO 排程令应答，候 CTO 随到随审）

- **接令链**：CTO 门审②限流=443 开位硬前置 → COO 排程「落位即排并行非阻，M1 基础限流落位即可」→ 本席 16:52 接令回执（技术形态勘正：Caddy 2.6.2 无 rate_limit 模块，纯 Caddyfile 落不了真限流）。
- **形态裁定**：M1 基础限流落**内核层 iptables hashlimit on 443**（活体勘实先行：TriModel src 内 429/rateLimited 全系上游 provider 换棒逻辑、无入站限流=应用层排除；xcaddy 系 CTO 裁候 M2 形态不提前）。即 **双层限流**=M1 内核层基础面（per-IP 连接速率）+M2 xcaddy 应用级精细面（method/path/token 维度）互补。
- **落位读数**：
  - 规则（只 append 新链，既有 INPUT 零删改——落位前锚=仅 1 行 `-P INPUT ACCEPT`）：
    - `-A INPUT -i lo -j RETURN`（机内管理面豁免）
    - `-A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j TRIMODEL_443`（仅 443 新建连接入链）
    - `-A TRIMODEL_443 -m hashlimit --hashlimit-above 30/minute --hashlimit-burst 20 --hashlimit-mode srcip --hashlimit-name trimodel443 -j DROP`（per-IP 新建连接 30/min、burst 20，超限丢）
    - `-A TRIMODEL_443 -j RETURN`（未超限放行）
  - 持久化：iptables-persistent（netfilter-persistent enabled）+`netfilter-persistent save`——rules.v4 五行全录，重启自动重载 ✓
- **smoke 四断言**：机内 443 GET 200（lo 豁免生效）✓ / 3333 GET 200（未殃及）✓ / 8710 GET 200（现役面零触碰）✓ / 8711 监听在位 ✓
- **空转期语义**：443 安全组未开=规则装载但零流量，开位即生效——匹配 CTO「开位时限流未到位不开」硬前置时序。
- **回滚锚（RB-02）**：`iptables -F TRIMODEL_443 && iptables -D INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j TRIMODEL_443 && iptables -D INPUT -i lo -j RETURN && iptables -X TRIMODEL_443 && netfilter-persistent save`（零既有规则回退依赖）。
- **开位条件对表（COO 令文）**：①本项完成读数=本节 ✓；②443 通道=候 CEO——两项齐后 A4 终态+BOD 终态轮成对收官。
- 实弹限速验证（公网侧真实触发）候 443 开位后补测（空转期公网零流量不可触发，如实记）。

## 十四、TLS 站点块修正与 A4 终态轮（BOD 定谳③+①执行令，收官段）

- **时序根因（闭环）**：CEO 443 开位生效于站点块修正**之前**——BOD sg 侧 17:1x 首读 alert internal error 与本席 17:15 公网 curl 000 为**同一窗口**：彼时 Caddyfile 站点块=`https://127.0.0.1`，公网 SNI=8.155.54.79 无匹配站点→服务端回 alert。BOD 定向判断（站点块匹配面）准确；17:17 修后 reload 起全绿。
- **修法（BOD 定谳③+①并装）**：站点块显式 `https://8.155.54.79`（挂既有 IP-SAN 自签证书）+全局 `default_sni 8.155.54.79`（无 SNI/SNI 变体兜底）。如实注：Caddy 2.6.2 无 `fallback_sni` 选项（2.7+），①的兜底语义由 `default_sni` 单项全覆盖；②绑域名照裁候 M2 域名决策（ACME 真证书终态）。修前配置锚 `/etc/caddy/Caddyfile.pre-ipblock-20260926.bak`；token gate 锚段原样保留（gen/revoke 脚本兼容断言=2）。
- **门审三件套读数**：
  1. **公网 TLS 三态**（本机→8.155.54.79:443 真公网路径）：GET /health **200**（0.252s）✓ / PUT 无 token **401**（gate fail-closed）✓ / api-token GET keys **200** ✓；s_client SNI=IP 形握手正常（CN=trimodel-r-hy）✓；curl 无 SNI 形 200 ✓
  2. **机内四断言回归**：lo 443 无 SNI 200 ✓ / IP-SNI 443 200 ✓ / 3333 200 ✓ / 8710 200 ✓（smoke 不回退）
  3. **iptables hashlimit 现役**：TRIMODEL_443 链 DROP 30/min burst 20 mode srcip 在位 ✓ + 8711 监听在位 ✓
- **A4 终态对表**：TLS 终端 ✓+写面 token ✓+3333 公网不可达（§六保持）✓+安全组最小开位（443 开/3333 不开，CEO 面）✓+限流在位（§十三）✓——**A4 五件齐**。
- **候 BOD**：sg 侧同法复测终态轮成对归卷（修后态预期全绿；若 sg 侧仍有 alert 读数请附探测工具+参数，供工具形定位）。
- 排查过程中途读数存档：s_client 机内双形（无 SNI/SNI=IP）修前即通（手动证书按 SAN 全索引），证明败点精确在站点块 SNI 匹配而非证书本体——与 CTO 门审预意见①一致。

## 十五、bc72ea4 补部执行读数（2026-09-26 17:24-17:28，date 现查 17:28:49）

- **触发与配方**：CTO 补部令（波⑤验收签认 604670ee 即触发）——R-HY 单笔 fetch+checkout bc72ea4（1972d83→bc72ea4 单笔推进）→rebuild→机内 A2 三态+gate 401/400+smoke 四断言回归。
- **打包（三步断言制，勘→打→重勘一致方出包）**：
  1. 勘：本机 TriModel 挂临时 branch `tm-deploy-bc72ea4`=bc72ea46147c69ba286ff92caef2caa2c631e116 ✓；亲缘复核 1972d83 是 bc72ea4 祖先（merge-base --is-ancestor）+区间 count=1 ✓；
  2. 打：`git bundle create /tmp/tm-bc72ea4.bundle tm-deploy-bc72ea4 --not 1972d83` → **1360B** verify okay（requires 1972d83=R-HY 在位可满足）；
  3. 重勘：list-heads=bc72ea4 refs/heads/tm-deploy-bc72ea4 + branch 复勘同 sha ✓。
- **bundle 裸 sha 坑根因落卷（排障 ~17:10-17:24）**：`git bundle create` 对裸 sha 形（含全量 `bc72ea4`、range `1972d83..bc72ea4`、`--stdin` 管道）一律 "Refusing to create empty bundle"，而 `rev-list` 同参数正常（count=1）——**本 Git for Windows 版本 bundle 头只认可广告 ref 名，裸 sha 一律拒**；修法=临时 branch 挂点后以 ref 名+`--not` 增量打包（二分定位：裸 sha 无 exclusion 全量亦 empty → 锁定 ref 广告机制，非 MSYS 转换、非 exclusion 语义）。
- **R-HY 侧推进**：scp 1360B → 现位断言 HEAD=1972d83（工作区干净）→ `git fetch /tmp/tm-bc72ea4.bundle refs/heads/tm-deploy-bc72ea4` → `checkout --detach FETCH_HEAD` → **HEAD-AFTER=bc72ea4 断言 ✓**（单笔推进语义：detached 与原部署位形态一致，零 merge commit、零 branch 移动）。
- **rebuild**：npm install（file: TriCode 链接在位，TriCode 面零变更不重 build）+ `npm run build`（tsc+copy-ui，17:25 新鲜）；产物断言：`deleted_strategy_ids` 命中 dist/ui/index.html（76189B，bc72ea4 前端通道正身=del handler+PUT body+hydrate 三笔）+dist/src/api/trimmc-card.js（0b4ed36 服务端通道早就在位）+test 两件——**变更落位面与 commit 文自述逐项吻合**。
- **restart 与稳态**：systemctl restart trimodel →17:26:53 active pid=1547186 → **NRestarts=0 稳态**（零自愈触发）；token 面零触碰（tokens.list 现役两枚与 A5 实弹同 mask：23bf****b0a4+c401****34f1=M1 验收对原样，零轮换）。
- **复验全量（Host 钉形 `--resolve 8.155.54.79:443:127.0.0.1`）**：

  | # | 项 | 读数 | 判 |
  |---|---|---|---|
  | 1 | health 443 真透传 | 200（0.014s）+body=`{"ok":true,"service":"trimodel",...}` | ✓ A2 三态之 TLS |
  | 2 | keys 带 api-token | 200 | ✓ A2 三态之带 token（应用层 fail-open 面正确） |
  | 3 | PUT /v1/config/policy 无 token | **401**（gate fail-closed） | ✓ gate 401 |
  | 4 | PUT 带 gate 枚1（23bf） | **400**（业务层，与直打对照同码） | ✓ gate 400 |
  | 5 | PUT 带 gate 枚2（c401） | **400**（并行窗双枚全通） | ✓ A5 并行窗复验 |
  | 6 | 3333 直打带 gate 枚 | 400（对照同码=反代透传） | ✓ |
  | 7 | GET /v1/config/policy 无 token（读面 P1） | 200 透传 | ✓ 读面可达=现设计 |
  | 8 | keys 带 gate 枚 | 401（应用层 fail-closed） | ✓ 双层制语义正身：gate 面 token 只过 Caddy 层、应用层只认 api-token，两层互不通用 |
  | 9 | smoke 四断言 | lo443（Host 钉）200 ✓ / 3333 health 200 ✓ / 8710 healthz 200（现役面零触碰，unit active）✓ / 8711 监听在位 ✓ | ✓ 不回退 |

- **机内测试形勘正教训（本次排障实际命中）**：机内 `curl https://127.0.0.1` 的 Host=127.0.0.1 **不匹配站点块地址 8.155.54.79**——Caddy 无路由命中返回空 200（假绿：首轮四项 200 全系空 handler 形，其中 PUT 带 token 200 vs 直打 400 异码即暴露铁证）；**机内测 443 面必须 `--resolve` 钉 Host=8.155.54.79** 方为真透传路径。§十四 L142「lo 443 无 SNI 200」读数形勘验为 default_sni 兜底下 Host 无匹配空 200 形（非应用透传），本件以 Host 钉形读数勘正之，门审结论不変（公网真路径 Host 恒匹配）。
- **CTO 异码裁定并卷指针**（cto-gate-review-2.md @ f133b85a，COO 转）：PUT 401=Caddy 写面 gate 拦截（未达应用）；GET 404=读面放行透传后应用路由未命中；「无 token 读面 404 化防枚举」推断不采。本件 §五 BOD 对表问询项以该裁定收口——读面公网无 token 可达=现设计（M1 正身=写面 gate），读面鉴权归 M2 应用层细门议程，不阻 M1。
- **候触发（随本件报号）**：补部毕读数为号 → ①CTO 门审（本件读数经 COO 转）②BOD 轻量跨机抽测（TLS 握手+写面 401 两读）作 M1 收官附件。

## 十六、M1 收官印（BOD 跨机抽测归卷，COO 转 2026-09-26 17:3x）

- **sg 跨机公网路径抽测（bc72ea4 终版时点）**：TLS 握手 ✓（TLSv1.3/IP-SAN 自签 trimodel-r-hy，与补部前形态一致——rebuild 未扰 TLS 面）/ 写面 fail-closed ✓（PUT 无 token=401，0.62s）/ GET 对照 ✓（404 稳定=读面透传态，与 CTO 两层异源裁定形态吻合，应用活体应答正常）。
- **收官裁定（BOD）**：M1 收官全件齐=五锚+CTO 门审三件套+sg 终态轮三轮证据链+bc72ea4 补部九项复验——**LG-054 M1 正式收口**；候 CEO 知悉呈报（BOD 自办）；M2 议程挂账候排窗（严格候另单）。
- 本席在途唯一附件：CTO 补部读数门审——**已通过**（cto-gate-review-2.md @ 762635dc：四步对表全合/双层制落证/九项+smoke 全绿）；随批并采「机内测 443 须钉 Host」教训记档正面（候与「打包前重勘 HEAD」并批入共用测试纪律）。
- **SDE 侧 LG-054 在途清零，全收官**（COO 清零笔 2026-09-26 17:3x）；M2 候另单口径不变。

## 十七、R-HY 重跑六步·终态对平读数（STE 基座适配验证；2026-09-26 17:39-17:48，date 现查 17:48:58）

- **执行环境（纯测试面边界守约）**：R-HY **隔离测试位** `/tmp/lg054-rerun/`（本地 clone 部署位两仓+bundle 增量 fetch+checkout）——部署位 HEAD（TriModel bc72ea4/TriCode d20cb6b）、dist、systemd 服务**全程零触碰未 restart**；TRIRLC_HOME=/srv/fleet/TriLC 钉现役旧名位。
- **配方①同步（三步断言制）**：TriModel tm-ste-df72995.bundle 9416B（df72995=bc72ea4+e12 测笔+STE 适配笔 2 笔增量，勘→打→重勘一致）+TriCode tc-ste-a3893ba.bundle 1029B（1 笔增量）→ R-HY checkout 断言 df72995/a3893ba 双 ✓；TriCode npm build OK（trimodel-cli 产物在位）。
- **配方②前置断言**：node v22.23.2 ≥21 ✓（node 内部 globbing 路径，无需显式枚举 fallback）。
- **配方④ TriCode 读数：58 tests / 57 pass / 1 fail / 0 skip**——fail=FROZEN-BACKUPS 哨兵（five-gates.test.ts:148 断言 6!==7，实得 6）=**族③预告案精确命中**（io-kernel.ts L155 备份名毫秒碰撞，STE 适配卷 §二探针双组实锤+如实预告「FSD 动笔前可能偶发再败，败读数归因=本节」）——零意外零新因，候 CTO 裁 FSD 小笔后自愈。
- **配方③ TriModel 读数：273 tests / 260 pass / 1 fail / 12 skip**（本机同 commit 对照复现 286/271/0/15 ✓）——不平项三层归因全闭环（用例名级两 log diff，LC_ALL=C 对齐）：
  1. **件数差 13=E1-E8（8）+W1-W5（5）**：R-HY 无 chromium → chrome 系 UI E2E **整 suite skip 不展开案**（R-HY skip 归因文亲证："chromium unavailable — tried TRIMODEL_E2E_CHROMIUM override then .../chrome.exe"）——环境门非缺陷；
  2. **fail 1=proxy policy window hit**（anthropic-proxy.test.ts:163 断言 `'no-api-key' !== 'ok'`，栈全文在卷 /tmp/tm-test-full.log）：**R-HY 无 upstream env key 环境型**（该案期望 settings 有真 key；本机 dev settings 有、R-HY 裸机无）——同 suite 其余 3 件全 pass，非代码缺陷；
  3. **3 个环境前提案两机镜像互补**（GET keys default/effectiveModel fallback/routes wired）：本机 repo root 有活体 policy/卡文件→前提缺席→skip；R-HY 隔离位磁盘干净→前提在场→正常 pass——两机各按其环境正确行事。
- **STE 三族适配 R-HY 实证生效（硬读数）**：M1 时 R-HY 5 fail 主体（policy.gate.e2e 族 ERR_MODULE_NOT_FOUND `/srv/fleet/TriRLC/...`+netstat Windows 格式）**全数平绿**——GATE P2/S5×2/L3+anchor③/L1×3/P3-sg **8 件全 pass**；P4-guard（ss -tln linux 分支）pass；**GATE L3+anchor③「daemon real-chain poll」pass=TRIRLC_HOME 三级解析链 R-HY 实弹工作**（读现役旧名位 key-cache）。
- **对平结论**：零部署运行时代码缺陷、零适配回归；残差 3 项（chromium 门/无 env key/族③预告）全环境型且逐件归因在卷。判据面：族①② 对平 ✓；族③ 如预告败=自愈候 FSD 小笔；两环境门案（chromium/env key）系 R-HY 裸机属性非适配对象——是否补装 chromium/钉测试 key 候 STE/CTO 定（属测试环境建设，非本单范围）。
- 隔离位清理候令（/tmp/lg054-rerun+双 bundle 留 R-HY /tmp 供复核，/tmp 重启自清）。
- **CTO 两裁闭项**（cto-adaptation-review.md @ ffb5ddb5，COO 转 17:5x）：①六步读数判**合格**——跨机基座适配判据正式达成，**LG-054 全链全域收口**（剩 BOD 收官件自办）；②隔离测试位裁量记档正面（部署位零触碰=纯测试面守约）；③候决两裁：(a) chromium/钉 key=候办挂账候 M2 与「跨机测试基座 CI 化」一并裁（不为测试便利在裸机挂 key）；(b) 隔离位清理=不派令，留位供族③门开窗时 R-HY 复现环境对照复用。**SDE 执行面义务全域清零。**

## 十八、B 案修复重跑收口读数（2026-09-26 18:10-18:12，date 现查 18:12:42）

- **背景**：STE B 案动笔（a9d9fc8=test/anthropic-proxy.test.ts 单文件 26+/8-，「policy window hit」案 ambient GLM 键依赖根治=before() 基座自含哨兵键）→ CTO 门审通过（3878d7c0，纯测试域无需补部）→ SDE 单文件同步入隔离位重跑（STE 重跑请+COO 行动令双路一致）。
- **三步断言制同步**：勘（a9d9fc8=dev HEAD，df72995..a9d9fc8 count=1，单文件 diff 对表 26+/8-，文件头注记 'LG-054 B 案' L142+哨兵键 L172 版本对位核 ✓）→ 打（tm-b9-a9d9fc8.bundle 2893B，`--not df72995` 增量，verify okay）→ 重勘（list-heads=rev-parse 同 sha ✓）→ scp。
- **隔离位推进**：fetch+checkout 断言 a9d9fc8 ✓+注记对位复验 ✓（部署位零触碰纪律照旧，TriCode 不动）。
- **重跑读数：273 tests / 64 suites / 261 pass / 0 fail / 0 cancelled / 12 skipped——与 CTO 门审预期 273/261/0/12 逐字对平**：pass 260→261（proxy「policy window hit」案修复转绿）/ fail 1→**0 清零** / skip 12 不变（chromium 族同形）。
- **对平判据全项达成**：TriModel R-HY fail 归零 ✓；TriCode 唯一 fail=族③预告案（候 FSD 门窗修后复验，在途不在本重跑范围）。**LG-054 对平判据全项达成。**
- 隔离位现 checkout a9d9fc8（留位供族③复验复用，纪律照旧）。
- **适配窗全域收口**（cto-adaptation-review.md @ 31e21b2f，COO 转）：对平判据全项达成，三席义务终态全域清零（STE 适配面/CTO 门审面/SDE 执行面）；隔离位清理锚=族③ CORE_VERSION 修后复验毕由本席执行（STE 卷 §八 @ d725e7e8）。

## 十九、后令·R-HY 发新 ADMIN_TOKEN（BOD 直派 2026-09-27 15:06，CEO 15:04 令「安排办法2，发新ADMIN」；date 现查 15:07）

- **执行**：`trimodel-admin-token gen`（R-HY）→ **新枚 len=64 head=f68d\*\*\*\*tail=a775**，window=3 active（23bf 现役+c401 残留+f68d 新枚——**旧 ADMIN 保留并行**，吊销候 CEO 后令）；gen 内建 render_and_apply（validate+graceful reload）执行毕，warn 两条系 OCSP/auto-HTTPS 既有形态非异常。
- **交付（全值零会话零账面）**：R-HY 侧 600 临时件 → scp 字节流直投 CEO 取件文件 `%USERPROFILE%\.claude\settings.presets\rhy-admin-token.txt` → 字节级去尾换行 → 断言 64B/ASCII 无 BOM/无尾换行/头尾对表掩码 ✓ → R-HY 侧临时件 `shred -u` 销毁。全值未进任何会话上下文/聊天窗/树账（取件文件头 8 字符 od 断言见掩码 head4+4 hex，如实注记）。
- **活性验证**：新枚机内 PUT gate 实弹=**400**（过 gate→应用业务层，可用态）✓。
- **CEO 提示随转**：取件后文件自行管理（阅后可删），浏览器 /ui 登录即用。
- 生成时点：2026-09-27 15:07:30 +0800（R-HY date 现查）。
- **加投·现役 API_TOKEN 取件**（BOD 令 15:12，同族安全链）：对象=api-token.env 现役读面 token（**直投不新发**，掩码 len=64 head=3608\*\*\*\*tail=cee7 与 M1 在案一致=零轮换）；R-HY 600 临时件（64B 无尾换行）→scp 字节直投 `%USERPROFILE%\.claude\settings.presets\rhy-api-token.txt` →断言 64B/无 BOM/单行无尾换行/头尾对表 ✓→活性 GET /v1/config/keys=**200** 可用 ✓→临时件 shred -u。时点 15:13:25 +0800（R-HY date）。全值零会话零账面 ✓。
- **定向修·unit 补 TRIMODEL_ADMIN_TOKEN**（BOD 令 15:22，COS 转投=活体操作审批门授权；根因=BOD 实勘 `GET /v1/config/trimmc-card` 503 "TRIMODEL_ADMIN_TOKEN not configured (fail-closed)"——应用层 unit 缺 env 与 Caddy gate 层 ADMIN 脱节）：
  - 修法（最小改动面）：**unit 本体零改动**，追加 `TRIMODEL_ADMIN_TOKEN=<新枚>` 进现有 EnvironmentFile `/srv/fleet/trimodel-data/api-token.env`（600 fleet 权限达标，避免 unit 文件 world-readable 泄密面）；值机内直取 tokens.list 行 3（对位断言 f68d\*\*\*\*a775 与 CEO 手上枚同枚 ✓）零回显；改前备份锚 `/etc/systemd/system/trimodel.service.bak-20260927-pre-adminenv`。
  - 执行：15:26:00（R-HY date）追加+daemon-reload+restart → active pid=1594078。
  - **复验五读数**：trimmc-card 带 f68d 枚=**200** ✓（BOD 复验锚）/ 无 token=**401**（fail-closed 从 503"未配置"升级 401"拒绝"=应用层 ADMIN 门挂上语义正身）/ health=200 ✓ / PUT 无 token=401（Caddy gate 零回归）✓ / NRestarts=0 稳态 ✓。
  - v1 族 404 清单（effective/presets/healthz/fallback-info）留 BOD 跨机对照 UI 源码逐端点复验（不预判照令）。

## 二十、后令·deepseek 模型统一切 flash（BOD 定向改令 2026-09-27 16:05，CEO 16:02 令「所有用 deepseek 的位置，模型用 deepseek-flash，不要用 deepseek-v4-pro」；本席 16:13 +0800 收口，08:13Z 现查换算）

- **R-HY 正源改 2 处**（备份锚先行 `/srv/fleet/trimodel-data/bak-20260927-pre-flash/`：local.json 1076B+trimmc-card.json 2631B，cp -p 权限保持，旧值保留核 ✓）：①policies/local.json schedules[1].model（strategy 窗 14:00-18:00 daemon-default）②trimmc-card.json provider_entries e-deepseek-anthropic 条 model——**勘实即 BOD 勘「keys.default_model」之源**（keys 面 default_model 系 card 条目派生）。改法=sed 字符串级替换（v4-pro→flash 全串替换，不动加密 key 材料字节）→ 双件 JSON 合法性 PASS → 残留 0/落位 1+1。
- **A1 验收读数（R-HY 活体）**：GET policy（gate 枚）schedules[1].model=**deepseek-flash** ✓；GET keys（应用层枚 3608\*\*，gate 枚打 keys=401 两层制已知行为照实注）default_model=**deepseek-flash** ✓；trimmc-card 复验 **200** ✓（sed 直改后服务读盘正常）。loadPolicy/keys 每请求读盘语义实证=零重启即时生效。
- **A2 验收读数（本机 3333 并行实例）**：数据面同形同改（备份锚 `D:/Code/ai/TriModel/bak-20260927-pre-flash/` 2 件+sed+JSON PASS+残留 0/落位 1+1）；活体双读数 keys.default_model=**deepseek-flash** ✓ + policy.schedules[1].model=**deepseek-flash** ✓（token 源=.env TRIMODEL_API_TOKEN 掩码 a5cb\*\*\*\*13a7 机内直取；本机 .env **无** TRIMODEL_DEFAULT_MODEL 行=env 覆盖回写风险不存在）。零重启即时生效。
- **扫尾定性清单**（`deepseek-v4-pro` 全命中 48 文件按面拆，本机+R-HY）：
  - **数据面（现役读盘）已清**：两机 policies/local.json+trimmc-card.json ✓；两机运行 env（本机 .env/R-HY api-token.env）均无 v4-pro ✓。
  - **备份/证据类不改**：两机 bak-20260927-pre-flash（回滚锚语义）+本机 trimmc-card.json.pre-v4.bak.json+scripts/walkthrough/.ste-\* 历史证据件+test/evidence/lg-035-walkthrough/。
  - **代码面列候裁（涉 core 语义，归 CTO 面非本配置令范围）**：src/config.ts L60 defaultModel fallback=`tmv-deepseek-v4-pro`（tmv- 前缀系 trimetaverse 注册表名，env 可覆盖；策略+keys 默认在位时运行时几乎不触达）+src/secure-keys.ts L38-39 MIGRATION_MODEL_MAP 一次性迁移映射（R-HY 已迁移毕不再触发；新环境初始化会合成 v4-pro=模板语义②）+其余 src/providers/client/proxy 等 fallback 常量链。R-HY dist 35 文件命中=src 编译产物同源，候代码面收敛时随 rebuild 部署波次清。
  - **模板语义列候裁**：scripts/provision-card-entries.py L38 写死 `'model': 'deepseek-v4-pro'`——**下次跑此工具会把 v4-pro 写回 card（回写风险真实）**，荐随代码面收敛一并改。
  - **测试/文档面**：test/ 27 文件断言 fixture（与代码默认值耦合随 B 类动）+README/docs/registry 3 件+.env.example L37 示例行——随代码面收敛波次，不单独动。
- **回执边界**：A3 sg 侧=BOD 亲勘（本令原文，本席不越面）；A4 CEO UI 刷新=CEO 端动作。回滚锚=两机 bak-20260927-pre-flash 快照回写（sed 逆向替换同形）。
- **途中事件两笔如实报备**：①本机 keys 端点全量回显 api_key 明文（dev 形脱敏缺口，既有行为非本次造成；本会话 transcript 已沾一枚本机 dev key 一枚——本机 3333 仅听回环无公网暴露，风险面低，候 CTO 知悉定性；后续读数已改单字段提取）②本机 `python3`=Windows Store stub 假 python（rc=49 无 traceback，早前「解析成功」实为 fallback 分支假象）——本机读数解析已改 node 形。

## 二十一、后令·被沾 dev key 轮换即办（BOD 令 16:30，CTO 三裁第三条执行面，裁定正身=model-fallback-sweep-01/cto-triage-verdict.md @ e54979bd；本席 16:30 +0800 属主勘定毕，08:30Z 现查）

- **①属主勘定（三枚实质沾染，较令文「一枚」扩围，全掩码呈报）**：
  - **OpenRouter 枚**（len73，head=sk-or-v1-c 尾=2e4）：curl 直出**全量 73 位露**（§二十 途中事件①主体系此枚）。活性勘验 GET openrouter.ai/api/v1/key=**200 属主坐实**：label 对表同枚 ✓，usage=$0.0777 有真实消费，无 limit 无 expires，creator=user_2yMY\*\*\*\*（账号在 CEO 手）。**同枚两处引用**：deepseek 条（**base_url=api.deepseek.com/anthropic 错位死配**——OpenRouter key 打官方端点必 401，史疑配置）+anthropic 条（base_url=openrouter.ai/api=正确落位，消费源）。
  - **GLM/openai 枚**（len49，head=15a23238）＋**glm 枚**（len49，head=86c08366）：json slice(0,60) 回显=**48/49 位露**——secret 段 16 位露 15 位，差 1 字符可穷举=**实质全量沾染**。两枚均 open.bigmodel.cn（智谱）平台 key（GLM 部署主力面）。
  - trimetaverse 条=tmv-local 假值，无敏不涉。card 文件 at-rest 全密文（api_key_encrypted，机器指纹域）✓——沾染源唯一=keys GET 解密回显（脱敏缺口本体）。
- **②轮换路径勘定**：provider 新钥生成均需控制台（服务端 keys 面只可改存不可生成；旧 keys 写面 410 退役，活源=TriMMC 卡条目）→ 走令文第 2 条后半回报 CEO。**落存配方已勘毕**：PUT /v1/config/trimmc-card（ADMIN 枚）D7 合并语义=脏条目 upsert 非整卡回写+服务端加密水合（明文不落盘）——R-HY 面 ADMIN 枚 f68d 在役即落；**本机面堵点勘实**：.env TRIMODEL_ADMIN_TOKEN=**空值**（行在值空）→ 本机活体写面 503 fail-closed，候配（补值+重启活体）或本机 node 调 dist 同指纹加密直写 card（届定时）。
- **③候 CEO 操作项（经 BOD 转）**：
  1. OpenRouter 控制台 https://openrouter.ai/settings/keys：生成新 key＋revoke 旧枚（c51\*\*\*\*2e4）；
  2. 【候裁扩围】智谱控制台 https://open.bigmodel.cn（API Keys 页）：同批轮换两枚（15a2\*\*\*\*/86c0\*\*\*\*）——48/49 露+差 1 可穷举，荐同批办；
  3. 新钥交付形态荐照 token 先例（600 件直投我落存，全值零会话）；或 CEO 自录 UI「模型信息」表单（R-HY 可即录；本机 ADMIN 面未配置候补）；
  4. deepseek 条 base_url 错位（OpenRouter key+官方端点）顺手裁归位：a) 保 OpenRouter→base_url 改 openrouter.ai/api；b) 转 DeepSeek 官方→需官方平台 key（platform.deepseek.com）。
- **④旧钥作废断言（候新钥落存毕执行）**：旧枚打 provider 元数据端点=401 复验（OpenRouter/api/v1/key 同法）。
- 轮换状态：**属主与路径勘定毕，落存候 CEO 新钥**（本节为中间回执，轮毕补读数）。

## 二十二、后令·四枚新钥落存+旧三枚作废（BOD 令 19:52，CEO 四裁已供钥；本席 20:06 +0800 收口，12:06Z 现查）

- **取件勘验**：四件 600 链在位（openrouter 73B/glm-tmv-rlc 49B/glm-tmv-rmc 49B/deepseek-tmv-rlc 35B，全单行无尾换行无 BOM，头尾掩码对表 BOD 读数 ✓；首轮 grep 词过滤误报缺失已勘正）。
- **A1 新枚活性四枚全绿**：OpenRouter 新枚元数据 200（label …004 对表 ✓，limit=$3 CEO 设防，usage=0 干净）/glm-rlc 200/glm-rmc 200（bigmodel v4/models）/deepseek 官方枚 200（api.deepseek.com/models）。
- **R-HY 面落存（全绿）**：PUT trimmc-card 200（D7 upsert 两枚：e-glm-anthropic=rlc 枚+e-deepseek-anthropic=官方枚，服务端水合加密落盘）→ api-token.env 备份锚（bak-20260927-pre-flash/api-token.env.bak）+补 ANTHROPIC_API_KEY=OR 枚+ANTHROPIC_BASE_URL=https://openrouter.ai/api 两行（CEO 裁①anthropic 落位=env 面，card 校验白名单无 claude 系拒之）→ daemon-reload+restart（新 pid 1604847）→ **A3 keys 三条目**（anthropic=sk-or-v1-6\*\*\*\*73B/glm=f17f5f\*\*\*\*49B/deepseek=sk-9fcf658\*\*\*\*35B，条目数 0→3）+**A4 trimmc-card 200**+undecryptable 归零。
- **本机面落存（两枚绿+两候裁）**：.env 备份锚（bak-20260927-pre-flash/dot-env.bak）+ANTHROPIC_API_KEY 值替换（旧 c51→新 OR 枚）→ PUT 两枚 200（e-glm-anthropic=**rmc 枚**（rlc/rmc 后缀按面域对号：rlc→R-HY 面，rmc→本机面）+e-deepseek-anthropic=官方枚）→ 活体重启（pid 42764→13432，无窗拉起）→ A3 复验：deepseek=sk-9fcf658\*\*\*\* ✓+glm=04519dcd8a\*\*\*\* ✓+A4 trimmc-card 200 ✓；**anthropic 条缺席=候裁①**（下详）；**openai 条候裁②**：无新枚对位（CEO 四枚命名无 openai 位），旧 15a2 已作废→openai env 条失活，智谱消费面由 glm 条覆盖，候 M2 域收敛。
- **途中重大勘实·密文跨机域不匹配（潜伏缺陷现形+本轮治愈）**：R-HY 服务日志 undecryptable 首现 **15:13:38**（早于 §十九 restart/§二十 sed；全天 40 次跨两进程稳定复现）——根因=**LG-054 部署时 card 从本机 scp，密文本机指纹域加密，R-HY 指纹解不开**（M1 抽测面未触读卡解密链故潜伏）；enc_len 快照=现役（sed 未咬密文排除）。**修复=本轮 PUT 本体**（服务端现域重加密，e-deepseek enc 136→84 实证）→ undecryptable 归零。R-HY 在本轮前实际无可用 provider key（keys 条目空），策略窗 default_model 系文本显示非可用态。
- **§二十一 勘正**：本机 .env TRIMODEL_ADMIN_TOKEN **非空**（len64 de44\*\*\*\*f36a）——此前「空值」系键存在≠值面误报（正中既有教训条），本机写面实际可用（PUT 200 实证）。
- **候裁①（本机 anthropic 条堵点）**：本机 node 被 vestauth 系 agent-auth wrapper 钩住（「injected env (2)」形态）——wrapper 对 ANTHROPIC_API_KEY **置空占位**（TRIMODEL 系放行），dotenv override:false 输给已存在空占位→.env 新枚载不进进程（dotenv parsed 面 4 键全在+env 面空=决定性二分）；card 建条目路径被 catalog 白名单拒（model 白名单无 claude 系）；R-HY 无 wrapper 故 env 行成功。**用户环境级工具，本席不擅动**——候 CTO 裁（wrapper 豁免配置 vs card 白名单扩 claude 系二择一）；当前无生产消费位（M2 前 daemon 未改指），影响面低。
- **A2 旧三枚作废断言全 401 ✓**：OpenRouter c51（全值在案）/智谱 15a2（D:/Code/ai/.env 机内取零回显）/智谱 86c0（**假绿甄别**：首轮空 key 打智谱 401 无效→GLM_API_KEY env len49 掩码对表坐实=86c0 枚→真断言 401 ✓）。
- **途中事件报备·D:/Code/ai/.env 个人凭据文件沾染（高优）**：该文件系用户个人凭据备忘杂物（非标准 .env：多枚生产凭据明文——OpenAI proj key/kimi/openrouter 枚/telegram bot token/github pat/阿里云 AK/SK 两组），且被 TriModel dotenv 三级加载链扫到（openai 15a2/deepseek-fallback/trimetaverse tmv-local 条活源即此）；**本席 cut 勘验动作把全文行打进 transcript=扩大沾染（我的失误，如实认）**。个人文件本席不擅动，候 CEO 裁（涉轮换评估面：github pat/阿里云 AK 等生产凭据）。**建议**：TriModel config.ts 三级 dotenv 链的上级扫描面（../.env）候 CTO 面收敛（防用户杂物文件被应用加载）。
- 模型 id 对表（CEO 裁③）：两面 deepseek 条 model=deepseek-flash 保持现条目形制 ✓。
- 临时件清场：R-HY /tmp/lg054-keys shred+目录删 ✓；本机 D:/tmp 临时件已删 ✓；CEO 取件四件未动（候 BOD/CEO 定）。

## 二十三、后令·两面 card 增配 GLM-5.3-Flash 条目（BOD 令 20:42，CEO 20:38 令「应该增加 glm-5.3-flash」；本席 20:44 +0800 收口，12:43Z 现查）

- **配方变更（钥源）**：CEO 取件四件已被阅后清空（settings.presets 20:18 目录更新，先例内）→ 钥不外求——**各面机内自取现役 glm 枚明文**（GET trimmc-card 响应顶层 entries_decrypted 字段带解密值（api/trimmc-card.ts L2/L18 在案形态），提取 e-glm-anthropic.api_key len49 验 ✓）→ 同机 PUT——全程零回显零新增钥零出机。
- **R-HY 面**：PUT 200（单条目 upsert e-glm-flash-anthropic：provider=glm/model=GLM-5.3-Flash（目录 id 原形白名单内）/base_url 照抄 glm 条/钥=rlc 枚）→ A2 条目数 2→3+card 200 ✓。
- **本机面**：PUT 200（同形，钥=rmc 枚）→ A2 条目数 2→3+card 200 ✓。
- **A1 活性断言两面全绿（真消费）**：x-api-key 形 POST open.bigmodel.cn/api/anthropic/v1/messages，model=GLM-5.3-Flash，max_tokens=1——两面各 200 真响应（msg_\* 回显 model=GLM-5.3-Flash，thinking 面输出，stop=max_tokens，13+1 token 最小消费）——**智谱平台真 id 有效坐实，BOD 兜底条款（模型不存在候 CEO 勘）不触发**。
- **条目构成对表（防 UI 达阵数错）**：BOD「现 3 条」系 keys 派生面（anthropic env+glm+deepseek）；card 条目层两面各 2→3（glm-5.3/glm-5.3-flash/deepseek-flash）——**anthropic 条在 env 面不在 card**（R-HY）/本机 anthropic 候裁①在途——CEO UI 模型信息区源=card 条目，R-HY 刷新预期见 **3 条**（glm-5.3/glm-5.3-flash/deepseek-flash），加 keys 面 anthropic 的「模型集」勾选列表合成视角或显 4——A3 达阵读数候 CEO 端刷新回传。
- 临时件清场：两面 shred/rm 全清 ✓（card-dump/g-put/g-resp/g1-key）。

## 二十四、后令·flash 窗规则挂链+真消费实证（BOD 令 20:54 收件，CEO 20:52 UI 新增 flash 窗规则未进生效面；本席 21:07 +0800 收口，13:07Z 现查）

- **形态差异实勘（令面第 2 条预设 vs 实况，候报）**：CEO UI 已自毕「建策略+激活」——card v4 三实体勘实：新策略 st_mujth2j65nch「测试时段切换」（20:50:42 建）+新规则 rule_mujtfmwuzuar「测试」（time 型三窗：20:55-21:05→e-glm-flash-anthropic／21:06-21:10→e-deepseek-anthropic／21:11-22:00→e-glm-flash-anthropic，CEO 定义原样未动）+active_strategy_id 已=新策略。**真缺环=生效面投影未刷新**：policies/local.json mtime 16:06 旧投影（老策略三窗）——local.json 系 card 派生投影（schedule id 形态 `strategy:<pid>:<rid>:<wi>`），非策略真源。
- **挂链操作**：POST /v1/config/trimmc-card/apply 200（「应用到本机」正统端点 routes.ts L146，ADMIN 门 Bearer）——服务端派生投影+savePolicyForMachine 落盘+card.default_model 同步一条龙；applied={strategy_id:st_mujth2j65nch, strategy_name:测试时段切换, schedules:3, default_model:null}。守卫 ✓：apply 零实体删改（活动策略/规则/条目原样），只写投影+default_model 派生缓存。
- **回滚锚**：R-HY `/srv/fleet/trimodel-data/bak-apply-20260927T125946Z/`（local.json 1075B+trimmc-card.json 3900B，apply 前现势快照）；回滚=还原双件。
- **时区校验 ✓（形态注记）**：规则实体本身无 timezone 字段（v4 schema）；投影派生层服务端硬编码 Asia/Shanghai（api/trimmc-card.ts L269 源锚）——投影三窗 tz 全=Asia/Shanghai 读数在卷。
- **读数（令面第 5 条）**：GET /v1/config/policy → effective={model:GLM-5.3-Flash, matched_schedule_id:strategy:st_mujth2j65nch:rule_mujtfmwuzuar:0, source:policy}；投影三窗全在位（flash/deepseek/flash 各带窗+tz）；评估链=每次 readFileSync 热读（policy.ts loadPolicy 无进程缓存）→投影落盘即生效，零重启。
- **真消费达阵 ✓（令面第 6 条，21:03:33 在窗 0 内）**：临时拉起 TriModel proxy 面（127.0.0.1:3334，**fleet 身份**）→ POST /v1/messages → **200 真响应 model=GLM-5.3-Flash**（智谱真响应 id msg_20260927210331…，usage 14+8 最小消费）+rewrite 日志一字定音：`rewrite claude-3-5-sonnet-20241022 -> GLM-5.3-Flash (schedule=strategy:st_mujth2j65nch:rule_mujtfmwuzuar:0, upstream=glm-anthropic)`——matched 三处同源一致（config 面 GET policy／proxy health／rewrite 日志）。teardown 收净（3334 关闭断言+临时件全清）。
- **新发现候报三件**：
  - **①R-HY proxy 路由面未随 unit 部署**：trimodel unit 只拉 config 面（ExecStart=dist/src/server.js→3333）；proxy 面（3334，TriModel 部署位组件）dist 在位但无常驻——本次临时拉起测毕收净。M2 daemon 改指后路由消费形态（daemon 侧拉取自路由 vs R-HY proxy 面常驻）候 CTO 裁。
  - **②card 加密域锚含 username（跨用户域不匹配——§二十二 跨机域机制的同根扩展）**：security/key-encryptor.ts L27 指纹四元组=hostname:username:platform:arch——root 身份手拉 proxy 报 undecryptable（config 面 fleet 身份能解），以 fleet 身份（su - fleet）拉起即解。影响面：任何非 fleet 身份进程读 card 密文全堵（含排障场景）。候 CTO 裁（部署纪律入册「card 密文面进程须 fleet 身份」vs 域锚收敛）。
  - **③apply 副作用如实呈报**：card.default_model 现=null（新策略无 default 规则，派生函数固有语义 L301）——窗外回落语义从 card-default(GLM-5.3) 变 env-default 链，系 CEO 测试策略定义的忠实投影非异常；规则窗间 1 分钟空洞两处（21:05-21:06／21:10-21:11，CEO 窗定义原样），空洞时刻同走 env-default 回落（proxy 面 env 无 GLM/DEEPSEEK 枚会报 not configured，daemon 消费面不受影响——走 daemon 自己 key-cache）。
- 临时件清场：R-HY /tmp/tm-consume.sh、/tmp/tm-proxy-test*.log、/tmp/tm-cons.json 全删 ✓；proxy 进程收净 ✓。

## 使用依据

- 任务书 f1f89ee3 §三执行序③④⑤ §五验收锚；joint-plan 问5/6/7（方案正身）；BOD 四裁+附裁两笔；CTO 门审 a03a81e9
- 前置勘验件：同目录 predeploy-survey-readings.md（基座/通路/技术债⑩/部署源裁定）
- R-HY 实勘实操作批次：16:29-16:47（SSH 全程留痕+journal/systemd/ss 读数在卷）；本机对照实验（worktree 1972d83 已清理）
- §二十四源锚：BOD flash 窗挂链令（2026-09-27 20:54 经 COO）；TriModel src：api/trimmc-card.ts（handleApplyStrategy L230-323／窗级派生 L258-274／时区硬编码 L269／requireAdmin L21）、api/routes.ts L146（apply 路由）、api/policy.ts L31-42（GET policy effective）、policy.ts（loadPolicy L325 热读／effectiveModel L361 评估序）、security/key-encryptor.ts L25-40（指纹四元组域锚）、proxy-server.ts（L25-29 默认 127.0.0.1:3334／L85 路由／L152 config 面 untouched）；R-HY 实勘批次 20:57-21:04（card 三实体/apply/消费全链 SSH 留痕）
