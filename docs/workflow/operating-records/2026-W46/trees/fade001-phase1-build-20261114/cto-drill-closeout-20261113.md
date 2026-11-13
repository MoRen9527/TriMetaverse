# FADE-001 P1 验收演练段毕报（CEO 14:30 直连令·即行启动·三缺陷三修复·锚②③读数在卷）

- sourceOfTruth: 本件（fade001-phase1-build-20261114/cto-drill-closeout-20261113.md·演练段毕报）
- syncMode: static（读数锚·11-15 23:50 首拍=版 A1 实装形端到端首次生产实锚）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 14:30 直连令（演练段**即行启动**·11-14 排期作废·停工带特批派工·D-69 零通报照旧）→COS 14:3x 流转→COO 515 笔排工单窗时点勘改（内容面四点全保留）→本席 14:31 启动确认→施工→15:0x 毕
- 演练段目标（COO 513 笔锚覆盖面读法）: 锚②=exit 2 断言族拦截路径实锚（exit 3 diverging=F4 挂 P2 不提前）·锚③=机面时延+到达 sighting 两腿拼合方对表 ≤30min·单腿不虚标达标

## §一 演练施工三缺陷三修复（演练段核心价值——三个真缺陷·逐一修复·全部 11-15 首拍前清障）

### 缺陷① jobs.json 版 A 形被 patrol 回写冲掉（部署段真缺陷·演练头功）

- **现象**: 昨日部署段改形写文件 1520 字符（值面三查过）→patrol job（e1b2-window-reminder-patrol-8710·5 分钟拍）fire→daemon 内存态（旧 819 形）经 saveJobStore **全量回写覆盖文件**→后续重启 load 到的已是旧形——若不修，11-15 首拍必跑旧 819 形（版 A 全部骨架要点丢失）。
- **定谳法**: jobs.json md5/mtime 对表+journal 对拍（patrol finished 时点==文件 mtime）+回写形 md5≠备份 md5（证回写非 restore）。
- **修复**: 经 TriRMC PATCH API（`PATCH /internal/v1/cron/jobs/{id}`·payload 整换·schedule 不动→nextRunAtMs 不受扰）改 daemon **内存态**——patrol 下拍回写即固化 vA1 形·零竞争窗。
- **教训（部署段流程缺步）**: 「重启后终态复验」步缺失——改文件与重启之间任何 job fire 都会冲掉改形；正形=凡 job-store 改形必走 daemon API 或重启后立即复验文件 md5。教训已入卷（部署段毕报观察面补注）。

### 缺陷② 版 A payload bash 语义坑（`if ! cmd; then RC=$?`——拦截时告警静默失效）

- **现象**: then 块内 `$?` 取的是「取反复合命令」的退出码（preflight 失败 3→`!` 取反→0）→RC 误读 0→manifest 误记 preflight_exit=0→`exit 0`→trap EXIT 不触发→**拦截时 shift_notify_fail 告警链静默失效**（首拍最毒形态：被拦且无人知道）。
- **定位法**: isolated preflight 单跑（绕 payload bash 链）二分定位——preflight 本身 exit 3 正确·bash 层 RC 传值断。
- **修复（版 A→vA1）**: `RC=0` 先置+`preflight ... || RC=$?`（`||` 右侧豁免 set -e 且 `$?` 取真值）+`if [ "$RC" -ne 0 ]` 判断——v3 拍实证 RC guard 正确传值（manifest preflight_exit=2 与实际拦截一致）。

### 缺陷③ preflight 分叉预检 remote 名错位（不修则 11-15 首拍必被假拦）

- **现象**: `check_diverge` 硬编码 fetch `sg-bare`——但 sg-bare 是 **TriMetaverse** 检出的 remote 实名；preflight `--repo` 默认 TriCompany 检出（实名=**origin**）→`No such remote 'sg-bare'`→fetch 128→假拦 exit 3。单测真 bare 仓案只测行为未测 remote 名（测试盲区·生产实锚抓到）。
- **修复**: TriCompany commit **c7bb4b562d46ebf7e819f182a53e99cb45492447**——`--diverge-remote` 参数化（默认 origin=TriCompany 检出实名·TriMetaverse 检出显式传 sg-bare）+`build_parser()` 提取+argparse 默认值单测案（DivergeRemoteDefaultTest）+两行为案显式 sg-bare 保语义·**22/22 绿**（原 21+新 1）。本地推成→河源 fleet 身份 ff pull→grep 验证在位（L274）→v3 拍 diverge ok=True 实证。

## §二 第一拍作废定性（执行身份错位·读数不入锚）

演练第一拍以 root 身份执行→fleet 属主仓 dubious ownership→fetch 128→exit 5；HOME=/root→notify.json 读不到→notify_failures 全 render_only（零 SMTP 实发·COS 面无信为预期）——**第一拍锚②③读数作废**。修正=fleet 身份重跑（`sudo -u fleet -H`·生产 User=fleet 同构）。教训=演练/值守操作身份必须对齐生产 unit 身份。

## §三 锚②读数（exit 码路径·v3 终态拍实锚）

- 演练脚本 `/tmp/fade001-drill-p1v2.sh`（fleet 身份·注入 `TRICO_PREFLIGHT_EXPECTED_HOST=drill-wrong-host-fade001-p1`+vA1+三 token 手动展开·residual 断言过）。
- **RUN_ID=shift-WW46-20261113T065305Z** · **exit 2** · verdict=fail · manifest=`{"run_id":"shift-WW46-20261113T065305Z","preflight_exit":2}`（vA1 RC guard 正确传值实证）。
- 五断言读数: week_math ok=False（**周五跑触发日断言挂=主闸防线实锚**）· hostname ok=False（**注入拦截实锚**）· diverge ok=True（**缺陷③修复生效实锚**）· git_hygiene ok=True · healthz ok=True——两拦三过·与设计预期形完全一致。
- 覆盖面如实注（COO 513 笔读法对表）: 锚②设计内 exit 2 路径=**已实锚**；exit 3 diverging 路径=F4 挂 P2 不提前——v2 拍曾得 exit 3 但系缺陷③ bug 所致非设计内 diverging 测试（如实定性·不入覆盖面）；v2 拍链路证据（trap→shift_notify_fail→sent·gate→end 1.088s/全链 1.238s）证明告警链在 exit 3 时同样工作（bug 触发的旁证）。

## §四 锚③读数（两腿·单腿不虚标达标）

- **机面腿（主读数·自动可得）**: v3 拍全链 4814ms（含 sudo+bash+python 启动开销·preflight gate 段秒级）·v2 拍 preflight gate→end 1.088s/全链 1.238s——两拍皆**远低于 ≤30min 阈**·机面腿达标。
- **到达腿（候收件方人工锚）**: 两拍 sent 日志行原样=`[shift_notify_fail] chain-fail alert sent (dual-address blocking)`（双地址 blocking·SMTP 真发·值面零回显）——sent 紧随 preflight 拦截（相对序·机械 run_id 时戳为锚 064924Z/065305Z 两拍）·**到达 sighting 候 COS 面确认**——两腿拼合对表以 COS sighting 回执为终·本毕报不虚标达标。

## §五 值面事件如实注（D-46 自领）

演练中 `systemctl show trirmc.service -p Environment` 整行输出一次把 TRIRMC_INTERNAL_TOKEN 值面带入会话 transcript（token 实位=systemd unit 内联 Environment= 行·非 api-token.env——api-token.env grep=0 先入误判）。处置=不复述不落卷·读数法当场勘正为 `systemctl show → 解析 → 环境变量 → 零打印`（输出只 bool+len）·后续 PATCH 鉴权全程零回显。定性=值面进会话一次·未进任何落卷物·未外发；token 轮换评估归 DCE 段顺手窗（与既有 TRIMC/TRIRMC 键名残留债同窗候选）。

## §六 复员断言与生产面终态（演练毕·生产位完好）

- 河源 TriCompany 检出: porcelain 仅存量两面（package-lock.json M+dist.bak 未跟踪目录·与部署段对表一致）·HEAD=c7bb4b5（--diverge-remote 在位）。
- jobs.json 文件终态复验: md5 变化（patrol 回写后 7ee97d65）但值面=**vA1 形稳定**（cmd_len=1539·has_trap=True·has_RC_guard=True）·nextRunAtMs=1794757800000（2026-11-15 23:50 保留·硬时钟锚位不动）。
- trirmc.service: healthz ok=true 全程绿·零重启需求（演练只经 job 拾取跑·daemon 不受扰）。
- 演练残留面: /tmp 下 drill 脚本与日志（tmpfs 自清·不入生产面）·runs 目录两拍 run dir（shift-WW46-20261113T064924Z/065305Z·读数卷面引用）。

## §七 观察面与挂账

- **11-15 23:50 首拍**（锚位不动）: 版 A1+preflight 修复形端到端首次生产实锚——值守窗值席 23:45 前置 diverging 预检在轨（现用正确 remote 名·假拦风险已清）。
- run id 双 W 妆容债: RUN_ID=`shift-WW46-`（骨架字面 `shift-W`+token 展开 `W46` 叠加）——零行为差·低息债·顺手窗候选（与 HTTP 辅形跨机通道/TRIMC/TRIRMC 键名残留债同账）。
- SMTP 自然触发首轮=告警判定面二次实锚（sent 通道已三拍实锚：部署探针+演练 v2/v3）。
- **阶段 2（Agent qualify）设计先行**: CEO 令③——演练 OK 即进阶段 2 设计（与 P2/P3 验收并行·施工仍候令候批·届时四席联审 CTO 入列·先知会 COS）——本席设计稿随知会呈。

## 使用依据

CEO 14:30 直连令（COS 流转）/COO 512 笔（APPROVE·f2c2f0cfb4）+513 笔（排工单·锚覆盖面读法）+515 笔（窗时点勘改 e8bfc207d0）/部署段毕报 cto-deploy-closeout-20261113.md（§回滚锚/§挂账承接）/TriCompany commit c7bb4b5（preflight diverge 参数化·22/22 绿）/TriRMC PATCH API（cron/routes.ts L115）/演练读数=本卷 §三§四（preflight.json/manifest/journal 原样）。

—— CTO 小狄（m-cto·演练段毕报），2026-11-13 14:57:16 +0800（写前现查 2026-11-13T06:57:16Z 原值粘贴·D-47 正形）
