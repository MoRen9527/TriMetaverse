# LG-054 TASK-TRIMODEL-RHY-DEPLOY-01 前置勘验读数（执行序①②·SDE 承办）

- sourceOfTruth: 本件（前置勘验读数留痕正身；任务书=f1f89ee3）
- syncMode: append-only（勘验追加）
- lastSyncedAt: 2026-09-26 16:3x +0800（date 现查 16:33）
- 执行席: SDE 小布；face=R 面（R-HY 8.155.54.79，SSH 通道 R-HY-8.155.54.79@河源-key 全程只读勘验）
- 边界守约: R-HY 生产冻结面零触碰（TriRMC/trilc 族 unit 与 8710/8711 现役面只勘未动）；sg 侧未涉（走 BOD 通道候报）

## ① R-HY 基座勘验读数

| 项 | 读数 | 判 |
|---|---|---|
| 机位断言 | hostname=`iZf8ziw57ydktu77fsld9yZ`，内网 172.23.199.251，公网 EIP 8.155.54.79（SSH 河源-key 成功+TriRMC active+8711 监听=R 面河源画像三重吻合） | ✓ D-24 |
| Node | v22.23.2 @ /usr/bin/node | ✓ |
| systemd | 255 (255.4-1ubuntu8.17) | ✓ |
| 端口 3333 | **空闲**（ss 无监听） | ✓ 可占 |
| TriModel 代码位 | /srv/fleet/TriModel 在位但为**旧散拷贝**：无 .git 元数据、dist mtime=2026-08-27（波③前旧版）、package.json 无 @trimetaverse/tricode file: 依赖 | ✗ 需重建 |
| TriCode 同机在位（技术债⑩） | **全盘零命中**（/root /home /opt /srv 及 maxdepth4 全扫）——技术债⑩断言**未过** | ✗ 部署包须含 |
| TriRMC 现役 | active，127.0.0.1:8711（只勘未碰）；trilc-headless/trirmc 族 unit 在位 | ✓ 边界内 |
| 防火墙 | ufw **inactive** + iptables INPUT policy ACCEPT——机器层无墙，公网开闭全权在**阿里云安全组** | 勘实 |
| git | 2.43.0 | ✓ |
| trimodel unit | 不存在（预期，待部署） | ✓ |

## ② 通路勘验读数（本机→R-HY 侧）

| 探测 | 读数 | 判读 |
|---|---|---|
| 本机→R-HY:3333（公网基线） | **timeout**（8s 超时） | 安全组未开 3333=公网不可达基线 ✓（A4 终态现成，部署后保持断言） |
| 本机→R-HY:8710（现役开位对照） | HTTP 404（0.16s 通） | 公网经安全组可达 8710=安全组规则表现役实证（对照锚） |
| 本机→R-HY SSH | BatchMode 通，全程只读 | ✓ |

**sg→R-HY 侧（执行序②另一半）**：按 D-24 走 BOD 通道——勘项=SSH sg 后 `curl 8.155.54.79:3333`。因 3333 服务未部署，建议拆两段：**现在测 TCP 基线**（证 sg→R-HY 网络层可达性）＋**部署毕测正式三态**（TCP/TLS/带 token 200，A2 验收）。时点候 BOD 定（两段或一段）。

## 技术债⑩勘实与部署源裁定

1. **依赖真形**（本机真源实勘）：TriModel package.json `"@trimetaverse/tricode": "file:../TriCode"`；TriCode 导出 `./trimodel-cli` → `dist/trimodel-cli/index.js`（**构建产物消费**）——部署态硬链=TriCode 同机在位+TriCode 先 build+TriModel npm install 解析 file:。
2. **版本差**：本机 TriModel dev HEAD=`1972d83`（波③ core 化）**ahead origin=83 笔**；TriCode dev HEAD=`d20cb6b`（CORE-SPLIT A 强化+版本锁）ahead=13 笔——R-HY 现副本（8-27）落后两代以上，不可用作部署基座。
3. **R-HY 网络**：GitHub 200（0.75s）/codeload 通/npm 官方 registry 默认——clone 路径可行。
4. **部署源裁定（本席执行细节裁量，方案面零变动）**：**git bundle scp 直投**——本机 dev HEAD 逐字节真源、83+13 笔全含、零 GitHub 公共仓动作（推 83 笔系对外可见动作非本单必要范围）、不受 R-HY→GitHub 抖动影响。R-HY 侧 origin 留 GitHub 备 M2 增量更新（届时先推平再拉）。构建序=R-HY 上 TriCode npm install+build → TriModel npm install（file: 解析）+build。

## 候决/候授权项（随本件呈报）

1. **sg→R-HY 勘验时点**（现在基线/部署毕三态）——候 BOD 定；
2. **安全组 443 开位权限**：A4 三件之 TLS 终端（Caddy 反代）需阿里云安全组放行 443——R-HY 机器侧无墙（勘实在案），本席无阿里云控制台/CLI 凭据在册，候 BOD/CEO 面指通道（代开或授权）；3333 直口不开公网=现状已满足，部署后保持断言；
3. Caddy 在 R-HY 的安装（apt）属部署落地段动作，随部署序呈备。

## 使用依据

- 任务书 f1f89ee3 §三（执行序①②）§四（边界）§五（A2/A4 锚）
- joint-plan 问5/6/7（方案正身免重审）
- R-HY 实勘三批次（16:18/16:22/16:29 SSH 只读）；本机 TriModel/TriCode git 实勘（fetch+rev-list）
