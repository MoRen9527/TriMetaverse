# trilc/trimc 命名清理 · CTO 技术面主审稿

- sourceOfTruth: 本稿（命名清理技术面主审正身·候 COS 裁合与 CAO 制度面稿并行呈 CEO 立项批）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 两节并包路由令 2026-11-04T15:24:57+0800 节一（CEO 令原话「trilc 表意不清，trilc 和 trimc 都要清理和明确」·主审三点=①bin/包名清理方案②影响面清单③退役时点+过渡策略）

## 一 · 现状实锚（四仓 name/bin 活体读数）

| 仓 | package name | bin | version |
|---|---|---|---|
| TriRLC | trilc | {trirlc, trilc} | 0.9.0 |
| TriMLC | trilc | {trimlc, trilc} | 0.9.0 |
| TriMMC | trimc | {trimmc, trimc} | 0.1.0 |
| TriRMC | trirmc | {trirmc, trimc} | 0.1.0 |

歧义全景（三点实锤）：
1. **trilc 双撞**：TriRLC 与 TriMLC 包同名（name=trilc）且 bin 同名（trilc）——两仓 npm global 同装时后装者覆写 trilc shim·CLI 行为随安装序漂移。
2. **trimc 双撞**：TriMMC 与 TriRMC bin 同名（trimc）——同 shim 覆写形。
3. **TriMMC name 错位**：name=trimc 与仓正名 TriMMC 不符（应为 trimmc）——单仓名实不符。

旧名渗透面（已嵌入运行时资产·非仅 package.json）：
- TriMMC internal token 键=`TRIMC_INTERNAL_TOKEN`（src/internal-token.ts L8/L21/L46·sg 环境在役）
- sg systemd unit=`trimc.service`（8712 在役·unit 名带旧名）
- 本机启动器=`trimlc-daemon-channel.cmd`（文件名+内容 trilc 系键名·schtasks 动作单源）

对齐锚：registry〈四控制器统称术语〉节（6a1dc4e）——族名全形=trirlc/trimlc/trimmc/trirmc（面属+层级·族 ⊇ daemon+cli+harness·矩阵=daemon 单形机位）。

## 二 · 清理方案（主审①）

正名原则：**族名全形小写·一名一实**。
- package name：TriRLC→`trirlc`·TriMLC→`trimlc`·TriMMC→`trimmc`·TriRMC→`trirmc`（四仓全改——TriRMC name 已对·随批次统一声明）。
- bin：主命令=族名全形（trirlc/trimlc/trimmc/trirmc）；旧短名（trilc/trimc）转**兼容别名**保留于 bin map·标 deprecated·退役窗毕删除。
- 正形样板：TriRMC 现 bin {trirmc, trimc} 已是「全形主+旧别名」形——全仓向此形收敛。

## 三 · 影响面清单（主审②·按破坏面分级）

- **零影响面**（勘定排除）：ew cron 白名单 command 串=node 脚本绝对路径形（不含 bin 名）——白名单零改动零 403 风险；scripts/fade 族全 node 直调零 bin 依赖；TriMLC 内部 env 键族 TRILC_*（TRILC_INTERNAL_TOKEN/TRILC_CRON_COMMAND_ALLOWLIST 等）=TriMLC 自有键名·**本案不动**（env 键改名=独立破坏面·候专项勘定）。
- **低破坏面**（npm global 迁移窗）：本机+sg 两环境 npm uninstall/install 链（shim 重建）——各约 10 分钟·可各自独立窗执行。
- **中破坏面**（消费面键名/unit 名·grep 全谱清点前置）：
  - TriMMC token 键 TRIMC_INTERNAL_TOKEN→TRIMMC_INTERNAL_TOKEN——消费面全谱清点（sg settings/启动器/脚本引用面 grep 全谱）+双键过渡窗（新键优先·旧键 fallback 一窗）；漏键先例=8713 L18 漏键（token 轮换三折在案）——清点纪律硬门。
  - sg systemd unit trimc.service→trimmc.service（unit 文件改名+daemon-reload+重启链 SOP 全程·低峰窗）。
  - 本机启动器文件名 trimlc-daemon-channel.cmd 及内容引用——schtasks 动作单源联动改（task 谱系链 SOP）。
- **文档引用面**（大而分散·分批随窗）：现役文档（TriMetaverse CLAUDE.md Common Commands 节/纪律册/registry/部署脚本）分批随窗改；**历史卷（operating-records/transcripts）=冻结面不改**（历史叙事冻结纪律）。

## 四 · 退役时点+过渡策略（主审③）

- **双名并存窗=2 版本窗（约 4 周）**：bin map 旧短名保留至消费面清零断言（grep 全谱零 trilc/trimc bin 调用读数）后删。
- **实施三阶段**：
  - 阶段一（低破坏·可并行）：四仓 package name+bin 全形化（双 bin 并存起窗）——纯仓内改动·内部工具族无外部消费者·风险极低。
  - 阶段二（消费面迁移窗）：npm global 两环境重装+token 键名/unit 名/启动器名迁移（各 SOP 全程+验证读数）。
  - 阶段三（别名退役窗）：消费面清零断言→bin map 删旧短名→版本窗发布。
- **与 CAO 制度面稿合流点**：命名规范条款（族名全形正名原则+别名退役制+新模块命名判据）交 CAO 稿合流——本稿供技术面正身。

## 五 · 风险与缓解

- 最大风险=token 键名变更漏消费面（复制漏键先例）→缓解=阶段二前 grep 全谱清点+双键过渡窗。
- unit 改名风险=sg duty 服务中断面→缓解=低峰窗+SOP 全程（勘修窗先例链）。
- npm global 迁移风险=daemon 在役时 uninstall（Windows shim 半删/文件锁）→缓解=迁移窗前 daemon 停机序（或先装新后卸旧·短并存窗）。

## 六 · 使用依据

- COS 两节并包路由令 2026-11-04T15:24:57+0800 节一原文（CEO 令原话）
- 四仓 package.json 活体读数（本日实锚·列于 §一）
- registry〈四控制器统称术语〉节 6a1dc4e
- TriMMC src/internal-token.ts L8/L21/L46（token 键名）·sg trimc.service unit 活体·本机启动器文件名活体
- D-46·D-47·历史冻结纪律
