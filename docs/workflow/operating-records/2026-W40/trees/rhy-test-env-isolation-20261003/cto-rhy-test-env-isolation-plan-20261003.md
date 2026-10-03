# R 面测试环境勘+隔离方案卷（CTO 车道，BOD #302 转录 CEO 09:31 令）

- sourceOfTruth: 本件（R 面测试环境勘+隔离方案正身；令源=COO 09:3x B 件令，CEO 令=TriModel 测试族执行环境迁 R 面，保 M 面 GLM 直连稳态供 8713 调试）
- syncMode: final
- lastSyncedAt: 2026-10-03 09:58:40 +0800（date 现查贴原值；勘面时点 09:35-09:58 随文标注）
- 方案席: CTO 小狄（m-cto）；勘面只读零写面 ✓（R-HY 全程只读 SSH）；施工候窗 ✓
- 验收链: 本卷（方案）→STE 验→BOD 复核；施工面候派（SDE/FSD 车道候 COO 裁）

## 一、R-HY 测试执行环境勘读数（09:35-09:58 三轮 SSH 只读）

| 项 | 读数 | 判读 |
|---|---|---|
| node/npm | v22.23.2 / 10.9.8（/usr/bin/node） | node 22 原生 test runner 稳定态 ✓——TriModel test script（`node --import tsx --test --test-concurrency=1`）原生兼容 |
| 代码布局 | `/srv/fleet/` 下 TriModel+TriCode 同构兄弟目录在位 | `file:../TriCode` 相对依赖形态天然满足 ✓ |
| 生产 clone | /srv/fleet/TriModel 顶=8de8fe7（LG-058 P1 范围 6①），origin=github MoRen9527/TriModel；node_modules 在位含 tricode link | 生产位健康；**拓扑注（09:5x 原稿）**：R-HY 线=github 镜像线，顶比本机/sg bare 线（161d0ca）新（含 LG-058 新笔）——双线非冲突（R-HY unit 自述 company truth=github 拉取线），测试基线取 github 线与 R-HY 生产行为可比（§三.1）。**【13:2x 勘正】本行「github 线顶 8de8fe7」表述过强：09:45 实锚仅=「R-HY 本地 clone 顶 8de8fe7」，github 远端 HEAD 未现查即被注记并入；SDE 步 0（13:22:57）ls-remote 实测 github HEAD=161d0ca（与本机/sg bare 线同源）——即 R-HY 本地 clone 领先 github 远端（LG-058 笔未推或另有推送链），非「github 被推平」。施工基线裁答随勘正改：**clone 改从 R-HY 生产 clone 本地 clone（8de8fe7 基）**，理由=测试位与生产位同基可比性最强+LG-058 笔属 P1 范围相关笔不该回退+零 github 外网依赖；§三.1 同步勘正（步 1 命令改 `git clone /srv/fleet/TriModel /srv/fleet/trimodel-test`） |
| TriCode clone | /srv/fleet/TriCode 顶=d20cb6b（9-26，与 sg bare 顶一致） | tricode 依赖源就位 ✓ |
| 生产服务面 | trimodel.service（LG-054 R-HY company truth，WorkingDirectory=/srv/fleet/TriModel，ExecStart=node dist/src/server.js）+caddy.service（443 门）running | **硬边界对象=trimodel.service+caddy+api-token.env 三面**（§二） |
| 磁盘/内存 | 32G 空闲 / 内存 1.6G（available 1064M） | 足够；小内存机约束=构建与测试串行、test-concurrency=1 维持不动 |
| npm registry | registry.npmjs.org 标准配置，.npmrc 零镜像 | cn-heyuan 机直连 npmjs 速度未验——施工预检步含 npm ping+试装（§三.0） |
| 测试族形态 | node 原生 test+tsx loader；mock 为主（anthropic-proxy.test 14 处 mock），card-path.test 零 mock 纯逻辑 | 零重量级框架；测试不依赖真 GLM key 调用 ✓（§二.5 复核条款兜底） |

## 二、隔离形方案（硬边界=测试禁碰生产 trimodel.service 面，sg 健康实例亦然）

### 硬边界五条（施工单+STE 验证共同守）

1. **目录隔离**：测试位=`/srv/fleet/trimodel-test/`（新 clone from github 线），与生产 clone（/srv/fleet/TriModel）物理分离——生产 clone 目录及其 node_modules/dist 零触碰。
2. **服务隔离**：测试位零 systemd 注册、零开机自启、零 watchdog——测试进程前台/独立 tmux 会话跑，跑毕即停（会话可留存读数，进程不留）。
3. **端口隔离**：测试实例用独立非生产端口（候施工时从 server.ts 端口 env 键名勘定具体形态；原则=与生产内部端口+443+8710/8711/8713/3333 全部错开，建议 3433 系）。
4. **面隔离**：caddy 443 门、api-token.env、trimodel-data 零读零写（测试零需门面值面）；sg 面 trimodel-config/proxy.service 零触碰。
5. **GLM 稳态保护**：测试位 .env 不配真 GLM key（零 .env 或仅占位）；测试族 mock 形态已证（勘面读数）——若施工发现个别用例要求真 key/真网，该用例**跳过不跑**并在卷标注，禁为测试开通真调用（CEO 令=保 M 面 GLM 直连稳态）。

### 为什么 R-HY 合格（选型判据一句话）

node 22+同构布局+registry 标准+轻依赖测试族=零新增基建；隔离形=纯目录/进程级，不新增服务面；R 面生产 Trimodel 即跑此仓（测试环境与生产同 OS 同 node 大版本，行为可比性最强）。

## 三、施工序（施工单素材，六步）

- **步 0 预检**（R-HY 只读+最小写）：npm ping；`git ls-remote https://github.com/MoRen9527/TriModel.git` 可达性；3433 端口占用检查。
- **步 1 clone（13:2x 勘正后正形）**：`git clone /srv/fleet/TriModel /srv/fleet/trimodel-test`（**R-HY 生产 clone 本地为源，8de8fe7 基**——与生产位同基可比+零 github 外网依赖；原 github URL 命令作废，勘正缘由见 §一拓扑注【13:2x 勘正】；记录顶 hash 入卷）。
- **步 2 依赖**：cd trimodel-test && npm install（devDeps 含 tsx/typescript——file:../TriCode 相对依赖 resolve 至 /srv/fleet/TriCode 既有 clone，**复用不重装**；若 npm 对 file: 走复制则尊重 npm 行为，不动 TriCode clone 本体）。
- **步 3 构建门**：npm run check（tsc --noEmit 类型门）——先类型后测试，失败即停（呼应 STE 类型门 baseline 同根因面）。
- **步 4 样本冒烟（验收锚）**：样本集=card-path.test.ts（纯逻辑零 mock）+apply-strategy.test.ts+anthropic-proxy.test.ts（14 mock 形态）——`npm test` 限定三文件跑；全量 test 族跑候窗（内存 1.6G 面全族时长未验，先样本后全量两段走）。
- **步 5 清场**：测试进程停+tmux 会话读数留档+目录留存（候后续日常测试复用；清理/保留候 COO 裁——默认保留=今后日常测试位的本意）。

### 验收锚（B 件③：R 面跑通 TriModel 测试族样本冒烟）

主锚=步 4 三文件样本 exit 0+通过数读数入卷；辅锚=步 3 类型门过+步 2 install 完整（node_modules/@trimetaverse/tricode resolve 在位）；隔离断言=硬边界五条逐条自查+STE 复验（生产服务面零变化：trimodel.service uptime 连续+caddy 连续+生产 clone git status 干净）。

## 四、风险与缓解

| 风险 | 缓解 |
|---|---|
| npmjs 直连慢/不通（cn 机） | 步 0 预检先验；不通则候镜像配置裁决（.npmrc 镜像=独立裁决项不擅配） |
| file:../TriCode 依赖 resolve 异常 | 步 2 后显式断言 node_modules/@trimetaverse/tricode 在位；异常则 npm install 时 TriCode 先 prep（ TriCode build 候补步） |
| 小内存 build 卡 | 串行施工+tsc 限定 --noEmit；卡则分段跑 |
| 个别用例需真网/真 key | §二.5 跳过条款；用例清单施工时如实记录 |
| github 线 vs sg bare 线基线分歧 | 本卷 §一拓扑注已定调（github 线=R-HY 生产行为可比基线）；两线收敛属 TriModel 拓扑治理另案（候办记一笔：镜像链自动化勘定） |
| 测试误触生产面 | 硬边界五条+施工单禁区+STE 独立复验三重；测试命令全部显式 cd trimodel-test 前缀（bash cd 后台链坑纪律——独立行 cd/子壳包裹） |

## 五、与在途件关系

- 批A P3 回归门一次性豁免：确认不受影响（P3 在本机 TriModel 链，与 R 面测试位零交集）。
- 迁移面向今后日常测试：本位（/srv/fleet/trimodel-test）即今后日常测试执行位的雏形——施工毕+STE 验后，日常测试 SOP（谁触发/读数归档/清场节奏）候 COO 组单另定，本卷不越界定 SOP。
- sg 面（LG-035 P3-sg 副本）：零动。若未来 sg 侧亦需测试位，同构方案复制（独立目录+独立端口+零 systemd），非本卷范围。

## 使用依据

- COO 09:3x B 件令（BOD #302 转录 CEO 09:31 令）
- R-HY 实勘（09:35/09:45/09:55 三轮 SSH 只读，读数见 §一表）：node/npm 版本+/srv/fleet 布局+两 clone 顶+unit 面（systemctl cat trimodel.service）+caddy/registry/磁盘内存
- 本机勘（09:3x）：TriModel package.json（test script+deps 面）+test/ 目录 mock 形态抽样（anthropic-proxy 14 mock/card-path 零 mock）+~/.ssh/config R-HY 通道条目（R-HY-8.155.54.79，root+pem）
- 关联在案：P1 版本基勘定卷（a8d64326，本机线 161d0ca 判定与 R-HY github 线拓扑注呼应）；graceful 技审卷（cbd0abab）；bash cd 后台链坑/跨机操作路由（M 面 SG 直达、R 面 R-HY 直达同原则）
