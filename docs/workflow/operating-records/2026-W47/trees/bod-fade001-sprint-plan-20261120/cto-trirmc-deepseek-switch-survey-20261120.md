# CTO 勘铸卷·TriRMC DeepSeek 供给切换技术形（CEO 22:41 裁决令转达承·BOD ㊿+942·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-trirmc-deepseek-switch-survey-20261120.md·勘铸正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令面受理: BOD 转达 CEO 22:41 裁决（①DeepSeek 已充值②TriRMC 切 DeepSeek key 防 GLM 额度不足③LG-097 供给线承接承录不变·卡尽不停工·fsd D7 起跑段照跑不停工）——本席=技术形勘铸·执行=值席/fsd 面·窗位=COO 统排随令（本席零自判窗位·D-76 C 层承）
- 勘铸性质: 技术形勘定卷（形+方法+判读基准）——**河源活体值面=施工窗现探·本卷零值面断言（D-24 禁推定·禁由本机/sg 面经验互推河源机位）**

## §〇 · 范围钉（勘正注·CEO 22:44 修正令 ㊿+944 承）

1. **切换范围=TriRMC（河源 8710）单面**——本卷 §一-§五 全谱本即 TriRMC 单面（零 MMC/MLC 涉）·范围修正对卷面形零影响·钉入=防执行面扩大化歧义；
2. **TriMMC（sg 8712）/TriMLC（本机 8713）不切·GLM 轨继续零动**（CEO 明令）——fsd/值席/STE 本地会话面=本机 TriMLC 域 GLM 轨照旧；
3. **「GLM 不冻结」语义修正承录**：MMC/MLC 面 GLM 轨继续·GLM 额度耗尽后承接照 LG-097 承接线·承接技术形=候本席技术形勘定（**候面挂账新条目**·非本卷现刻勘定范围·候 COO 统排派窗）；
4. CFO 22:42 加拍读数承录：GLM 74%·耗速急升 4.7pt/h·距 75% 止损线余 1pt——切换窗时效性高·统排候 COO 判形。

## §一 · key 配置位勘定（候选族+现探位清单）

TriRMC（河源 R-HY 8710·R 面本地域主控·独立仓）模型供给配置位=三候选形·施工窗活体现探定谳（禁推定具体路径）：

| 候选 | 形 | 现探判读位 |
|---|---|---|
| C1 env 面 | daemon 启动环境变量（GLM_API_KEY/GLM_BASE_URL 或同族命名） | 进程 env 读数（/proc/<pid>/environ 或 daemon 自报端点·值面=sha16 指纹） |
| C2 config 文件面 | settings/config 文件（JSON/TOML·provider 节） | 仓内 config 位 glob+daemon 读位源码核（config load 调用链） |
| C3 启动参数/启动器面 | .cmd/启动脚本/launch 配置内嵌 | 启动器文件面+进程命令行读数 |

**参照位如实注（禁互推）**：GLM 部署点位图历史锚（本机面·三端配置+node_modules/trimodel 符号链接）=参照形·河源 TriRMC 独立仓独立机位——配置布局以河源现探为唯一事实源。

## §二 · 重启/热载形勘定（判读基准+保守形）

1. **判读基准**：配置读入位定载形——启动时读（env/启动参数/启动链一次性 load）→**须重启**（冷载）；运行时读（每请求或周期性 re-read config）→热载可行。判读方法=源码 config load 位核（load 调用点在启动链 or 请求链）+现役实测（改 config 后 healthz 侧 provider 读数变否）；
2. **保守形=重启冷载**（默认定谳）：配置生效确定性高·热载仅当现探证实运行时读位存在才采——GLM→DeepSeek=endpoint+key 双变更·半生效态（endpoint 新 key 旧）=故障面·冷载消歧；
3. **重启纪律参照**（TriRLC 重启纪律族·河源现探校准）：stop 前验监听 pid==pidfile pid→优雅停（POST /shutdown+token 门·/end 不可靠）→验 port FREE→冷启→**完工三断言=uptime 重置+pid/CIM 对表+watchdog.log 旁证**——TriRMC 与 TriRLC 同族异仓·纪律形参照·端口号（8710）与启动器路径=河源现探定谳；
4. **三清护栏承录**（batch 偏移错位家族）：改配置前=shutdown daemon+杀 wrapper+port FREE 三清后才改·完工判据=新值面探针非 healthz（healthz 绿≠配置生效·重启窗完工判据承）。

## §三 · 切换后值面探针形（D-46 合规·三件完工锚）

| 探针 | 面 | 合规形 |
|---|---|---|
| P1 key 指纹对表 | 键存在性+值面指纹 | sha 前 16 对表（B4 先例 cos-3tk 形）——**零明文零落卷**（D-46 值面禁进打印路径） |
| P2 endpoint/model 值面 | provider 换发读数 | DeepSeek endpoint URL+model 名=非密值面可出（布尔+URL 面） |
| P3 活体一发真探 | 最小请求真发 | provider=deepseek 值面回读+响应 rc 面——真链路一发（非配置静态验） |

**完工判据=P1∧P2∧P3 三件齐**（目标变更值面探针·healthz 零豁免）——P3=真值锚（配置面对≠真发通·build-green-not-runtime-green 承）。

## §四 · D7 起跑段供给切换并勘（round_runner provider 配置轨）

1. **round_runner provider 配置位**=TriRMC runner 改造面随铸位（D7 明晨窗施工域）——provider 配置读取位与 daemon 同源（同一配置位族）或独立（runner 自带 provider 节）=现探定谳；**单值源定谳**：round_runner 与 daemon 供给配置宜同源单值（防双轨漂移——daemon 切了 runner 未切=半切换故障面）——若现探证实两套配置位独立·施工窗并轨勘定；
2. **D7 勘面卷 §五/§六勘正注**：四探针之「护栏位面」扩第五探=**供给轨探针**（provider=deepseek 值面·P2 同形）——四护栏常位验证锚的「GLM 速率护栏」锚形随轨更新：**护栏机制保留·限频对象随供给轨切换**（限频参数=DeepSeek 轨现探校准或沿用同值·施工窗定谳——「改造后原样保留」语义=机制位保留·参数对象随轨如实注）；
3. **供给切换与 D7 时序**：供给切换小窗=D7 起跑前置门新组元（起跑门双前置扩为三件=D6 划项+四护栏锚齐+**供给轨 DeepSeek 在役值面探针**）——起跑门 fail-closed 形不变（任一缺门闭）。

## §五 · 切换小窗技术形汇总（给 COO 统排·量级）

- **量级**：轻量小窗（配置位改+重启+三探针·活体现探为主·零码面施工·≤半小时量级）；
- **执行面**：值席/fsd 面（河源通道 ssh -J sg R-HY·本席零代执承 D-27 v4）；
- **窗位**：归 COO 统排随令（本席零自判）——候排参考=D7 明晨窗前完成（起跑门新组元·切换毕 D7 门面才全）；
- **回滚锚**：GLM 配置位 bak 锚（改前备份·回滚=恢复 GLM 配置+同三探针复验——切换可逆·零不可逆操作）；
- **护栏**：D-46 值面零回显零落卷（P1 指纹形）·三清护栏（§二.4）·红即停零二次硬试。

## §六 · 使用依据

BOD 转达 CEO 22:41 裁决令（㊿+942·①充值②切 key③LG-097 承接不变）；D7 勘面卷 e88cbf86e（§五四探针/§六护栏锚形·本卷勘正注承）；TriRLC 重启纪律族+batch 偏移错位家族+重启窗完工判据+token 轮换三折+GLM 部署点位图（历史锚·参照位如实注禁互推）；D-24/D-27 v4/D-46/D-47+D-76 C 层（窗位归 COO）。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
