# 2026-09-09/10 bigmodel 400[1210] 13 席全故障·根因报告（CTO 席主笔）

- sourceOfTruth: TriMetaverse/docs/execution/20260910-bigmodel-400-1210-incident-report.md
- syncMode: draft｜lastSyncedAt: 2026-09-10
- 性质：事故根因定谳+缓解落地+根治候办（CTO 席主笔，BOD/COS 会签读数在卷）
- 密钥安全：本报告零密钥值；凭据仅前 6 位前缀+长度指征。

## 一、事故摘要

- **现象**：sg 47.245.122.61 上 12 席 m-\* 常驻会话+值班位 interactive claude 会话（claude 2.1.227，Bun 运行时）向 `https://open.bigmodel.cn/api/anthropic` 发起的一切 API 调用稳定复现 **400 [1210]「API 调用参数有误，请检查文档」**，首发 1s 空转即败；13 席 interactive 全员阻塞，池中转值班面通信断。
- **影响**：TriCompany 赛博公司 sg 侧全员下线（值班位+12 席），约 22:39 起至 01:01 恢复，历时约 2.5h。
- **根因判**：**bigmodel 网关边缘（阿里云 GA 8.219.103.148）对客户端 TLS 指纹（claude CLI 的 Bun/BoringSSL 栈）实施拦截**，返回与参数无关的 400 [1210]——非我方任何配置/代码/凭据变更所致。

## 二、时间线（2026-09-09/10，+08）

| 时刻 | 事件 |
| --- | --- |
| 14:06 | `/home/fleet/.claude/settings.json` 末次修改（[1M] 模型名入 env 段，先于事故，非诱因——已实证排除） |
| 22:37 | 13 席 m-\* tmux 会话重拉（`duty-env`+`claude --dangerously-skip-permissions` 生产链） |
| ≤22:39 | **COS 席录得首例 400**（事故起点上限；bigmodel 侧行为变更窗口 ≤22:39 当晚） |
| 23:19-23:52 | transcript 首录 1210 批量落盘（a75df66d/a088bb91/357e0bdf 等，零成功 usage）；`.claude.json` 三次自动备份 |
| 00:16 | CTO 席接案（COS 转 BOD 催办三问） |
| 00:26-00:55 | 实包抓取战役：dump-proxy（8450）+iptables 重定向+会话重启拦截三路并进 |
| 00:53 | **决定性对照实验成功**：real HOME 同链路重启 m-cao 经 node H1.1 代理=200（同头体直连=1210） |
| 00:58 | 根因读数回执 COS；缓解方案获批 |
| 00:59-01:01 | `bigmodel-h1-proxy.service` 上线（8460）+13 席全量重拉 |
| 01:05-01:07 | 金丝雀三席全绿（m-cao/m-cto/m-duty-cos），fleet 恢复 |

## 三、根因证据链（对照实验矩阵）

### 3.1 决定性对照（最硬证据）

同一会话（real HOME、同 duty-env、同 cwd、同 launch 链、同 18ch 测试消息）：

| 路径 | 结果 |
| --- | --- |
| 直连 bigmodel（Bun TLS 栈） | **400 [1210]**（00:45:37 复测复现，requestId 20260910004537…） |
| 经本席 node H1.1 代理转发（HTTP 头体全同，含全部 10 个 beta 头） | **200**（00:53，cap-003 全量抓包在卷） |

请求面完全相同（164KB 实包：10 beta 头、`mid-conversation-system` 角色、32 tools、`thinking adaptive`、`context_management`、`output_config`、max_tokens 32000、SSE）→ 唯一变量=发起点 TLS 栈（Bun/BoringSSL vs node/OpenSSL+HTTP/1.1）。

### 3.2 排除清单（逐项实证，全数排除）

| # | 假设 | 实证读数 | 结论 |
| --- | --- | --- | --- |
| 1 | `[1M]` 模型名非法 | curl 直发 `glm-5.3[1M]`→**1211 模型不存在**（非 1210）；且 claude 实包中后缀已剥离转 beta 头 | 排除 |
| 2 | context-1m beta 头 | curl+beta 头→200；250K token 大上下文+beta→200 | 排除 |
| 3 | 上下文超限 | 600K token→**1261 prompt is too long**（非 1210）；故障会话首发即败（零成功 usage，上下文极小） | 排除 |
| 4 | 系统提示词过长 | 8K/32K/64K/128K/256K 字符系统段→全 200 | 排除 |
| 5 | 凭据失效/差异 | duty-env AUTH_TOKEN 与 settings API_KEY 双凭据分别 curl 同富体→双 200（两凭据不同值） | 排除 |
| 6 | settings env 覆盖/环境差异 | settings.json 覆盖进程 env 实证（BASE_URL 以 settings 为准），但 fakehome 同 settings 探针 200 | 排除 |
| 7 | interactive REPL 特有形状 | 同链路 interactive 会话经代理 200；print 模式直连亦 200 | 排除 |
| 8 | 消息内容（IDENT/附件/技能清单） | 同一 18ch 消息：m-cao 直连败/探针过；附件全标准件 | 排除 |
| 9 | HTTP/2 协议层 | curl `--http2` 最小体直连→200 | 单独排除（协议版本非充分条件，与 #10 合并理解） |
| 10 | key 信任态（rejected） | 客户端侧效应（拒发/refusal），非服务端 1210 来源 | 排除为主因 |

### 3.3 判定逻辑

- curl/node/python 任一 OpenSSL 系栈直连=200；claude（Bun/BoringSSL）直连=1210，与载荷/凭据/端点路径/协议版本全无关；
- 同头体经 node 转发=200 → 服务器在 HTTP 语义层收到的请求无差异仍区别对待 → 判据只能位于 TLS 握手层（JA3/JA4 类指纹）或其上与客户端实现绑定的特征；
- 起拦时点 ≤22:39 当晚、无任何我方变更对应 → bigmodel/阿里云 GA 侧 WAF 规则变更（对 Bun 指纹误伤或针对性拦截）。

## 四、缓解落地（已执行，2026-09-10 00:59-01:07）

1. **`bigmodel-h1-proxy.service`**：`/opt/bigmodel-h1-proxy/proxy.mjs`，systemd（User=fleet，Restart=always），listen `127.0.0.1:8460`，上游 `open.bigmodel.cn:443`（node HTTPS/H1.1，keepalive 池，SSE 双向流式直通，requestTimeout=0）。
2. **`/home/fleet/.claude/settings.json`**：`ANTHROPIC_BASE_URL → http://127.0.0.1:8460/api/anthropic`（settings 覆盖 env 已实证，13 席生效无需逐席改）；`.claude.json` key 信任态 rejected→approved（与验证态一致）。
3. **13/13 席重拉**（生产链不变）；金丝雀 m-cao 12s / m-cto 14s / m-duty-cos 21s 全绿；proxy log 全 200。
4. **回滚位**：settings BASE_URL 还原直连+`systemctl disable --now bigmodel-h1-proxy`（bigmodel 侧修复指纹拦截后执行）。
5. **风险注记**：本地代理=SPOF（systemd 自拉缓解，候 watchdog 健康巡检项）；代理日志 `/opt/bigmodel-h1-proxy/proxy.log`（仅方法/路径/状态码，零载荷零凭据）。

## 五、根治候办

| 项 | 内容 | 归属 |
| --- | --- | --- |
| R1 | **bigmodel 正式申诉**：TLS 指纹（Bun/BoringSSL claude-cli 2.1.227）拦截误伤，请求凭据/账号正常，请白名单或修复 WAF 规则；附本报告 §3 证据矩阵 | 日间窗，CEO/CFO 通道（账号主体方）+CTO 出证据包 |
| R2 | 确认性补强实验：裸 Bun runtime 最小请求直连复现 1210（本机无独立 bun，候装 bun 或用 claude 二进制自带运行时） | CTO 帙候窗 |
| R3 | watchdog：h1-proxy healthz 巡检入值班 patrol（FADE-001 同窗） | TriDev/FSD 候令 |
| R4 | 旧会话挂起派工丢失（IDENT-LOAD/VERIFICATION 等）重派 | 值班 COS/hub |
| R5 | code-state.md 补事故+缓解条目；本报告回执归档 | CTO（本报告随附） |

## 六、证据清单

- 服务器留档（0700，root）：`/srv/fleet/incident-20260910-400-1210/`——cap-001/002/003（敏感头已脱敏）、resp-001/002/003、failing-transcript-excerpt-357e0bdf.jsonl（8 条 1210 记录）、全部实验脚本、mit-proxy.mjs+unit
- 抓包原码位：sg `/tmp/cap450/`（重启易失，以留档为准）
- 关键 requestId：直连败 `2026091000453758ff7fe196c34354`；代理过 `msg_20260910005322e9b3d294f4ea4b3d`
- 本席工作件：`.fade/tmp/h1-proxy.mjs`、`cap-*.sh/py`（本地仓 .fade，不入 git）

## 使用依据

- COS 移交 STE 五探证据链+五探排除清单（22:4x）
- BOD 催办三问（00:16）+缓解方案批注（00:58，含 Timeline ≤22:39 修正口径）
- 本席 sg 实勘全记录（D-24 hostname 首行断言逐件执行：iZt4n2ppusbxaxtj2qse7dZ）
