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

## 使用依据

- 任务书 f1f89ee3 §三执行序③④⑤ §五验收锚；joint-plan 问5/6/7（方案正身）；BOD 四裁+附裁两笔；CTO 门审 a03a81e9
- 前置勘验件：同目录 predeploy-survey-readings.md（基座/通路/技术债⑩/部署源裁定）
- R-HY 实勘实操作批次：16:29-16:47（SSH 全程留痕+journal/systemd/ss 读数在卷）；本机对照实验（worktree 1972d83 已清理）
