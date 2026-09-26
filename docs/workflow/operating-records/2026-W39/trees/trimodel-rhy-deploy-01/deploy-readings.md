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

## 使用依据

- 任务书 f1f89ee3 §三执行序③④⑤ §五验收锚；joint-plan 问5/6/7（方案正身）；BOD 四裁+附裁两笔；CTO 门审 a03a81e9
- 前置勘验件：同目录 predeploy-survey-readings.md（基座/通路/技术债⑩/部署源裁定）
- R-HY 实勘实操作批次：16:29-16:47（SSH 全程留痕+journal/systemd/ss 读数在卷）；本机对照实验（worktree 1972d83 已清理）
