# 四 daemon 写端点 token 门覆盖面代码审计定性卷（CTO·BOD 19:44 升急令）

- sourceOfTruth: 本件（8710 升急事件技术定性正身：三 daemon+TriRMC 写端点 token 门覆盖面审计）
- syncMode: final
- lastSyncedAt: 2026-09-30 20:10 +0800（UserPromptSubmit hook 现戳 20:02:17 后本席推算落卷，候下一 hook 现戳勘正）
- 令链: BOD 19:44 升急实锚通报（两机 8710 外网握手成功+TriMMC addJob 零白名单疑虑）→「代码层核查写端点 token 门覆盖面（禁活体 POST 探测，读代码为准），明晨哨窗前给定性」→本卷
- 审计域: TriMMC（sg 8710·主标的）/ TriRLC（sg 8711）/ TriMLC（本机 8713）/ TriRMC（heyuan 8710·BOD R6 口径认领者，本席扩入）
- 方法纪律: 全程读代码（四仓 src 直读）+一次 status-code-only GET 活体验证（`-o /dev/null -w %{http_code}` 零 body 输出零真值溢出）；零 POST 探测零写操作

## 一、总定性（一段话版）

**sg 在役 8710 写端点 token 门=全覆盖且在役激活**：TriMMC 全部写端点（cron 四族+agents/notify/config/tasks 族）位于 `/internal/` 前缀单卡点门下游，无旁路路由；活体验证无令 GET=HTTP 401 实锚（门已激活，token 经 systemd unit override 持久注入，重启韧性成立）；BOD 疑虑的「外网 job 注入=任意命令执行」路径在现役被 token 门+安全组双重阻断。**但代码层设计形态弱于同族**：TriMMC/TriRMC 门为 opt-in fail-open（token 未配置=全放行），TriRLC/TriMLC 为 fail-closed 正形（未配置=401 全拒）+loopback 硬绑定双保险。

## 二、四仓对比表

| 仓:端口 | 门形态（代码） | env 未设行为 | token 比较 | listen 绑定 | 在役验证 | 外暴露面 |
|---|---|---|---|---|---|---|
| **TriMMC** :8710 sg | opt-in **fail-open**（`internalToken &&` 才校验，app.ts:141-154） | **全放行**（兼容旧行为，注释自认） | `!==` 非恒时 | **全网卡**（`listen(env.port)` 无 host 参数，app.ts:751） | **401 实锚**（无令 GET，20:0x）+unit override 注入 | 曾实锚→安全组已关（CEO 19:5x）→迁 8712+loopback 施工单在途 |
| **TriRLC** :8711 sg | **fail-closed 正形**（app.ts:1797-1812） | **401 全拒**（`internal_auth_disabled`） | `timingSafeStringEquals` 恒时 | 127.0.0.1 硬绑（app.ts:4779；cli.ts:596 同） | FSD 件4：401×2 实锚 | 无（loopback） |
| **TriMLC** :8713 本机 | **fail-closed 正形**（app.ts:1756-1771，与 TriRLC 逐字同构） | **401 全拒** | `timingSafeStringEquals` 恒时 | 127.0.0.1 硬绑（app.ts:4481；cli.ts:597 同） | F-2 复核：无令 401/带令 200 实锚 | 无（loopback） |
| **TriRMC** :8710 heyuan | opt-in **fail-open**（app.ts:148-161，与 TriMMC 同段注释同构） | **全放行** | `!==` 非恒时 | **默认 127.0.0.1**（`TRIRMC_HOST ?? '127.0.0.1'`，app.ts:805-806——代码默认安全，env 可覆写） | 河源现役 8710 外网曾可达（BOD 实锚）→部署面疑似显式设了 TRIRMC_HOST | 曾实锚→安全组已关；权威位留守 8710（CEO 口径） |

## 三、TriMMC 主标的五要点（BOD 三问逐条）

1. **覆盖面完整性=PASS**：单一 `createServer` 回调 if 链，token 门（app.ts:141-154）位于链首（仅 `/healthz` 在其前），其后全部路由（agents message/spawn、notify、tasks mirror/result、cron 四族、config 五路由、events/heartbeat）均以 `/internal/` 前缀受门覆盖；`startsWith('/internal/')` 前缀判=未来新增 internal 路由自动入罩，无逐路由挂载漏网形态。cron 委托 `src/cron/routes.ts` 无独立 server（全仓仅 app.ts:751 一处 listen，Grep 实锚）。
2. **写端点族全录**：cron `POST /jobs`（addJob）/`POST /jobs/{id}/run`/`PATCH /jobs/{id}`/`DELETE /jobs/{id}`+agents `POST /{id}/message`+`POST /agents`（spawn 会话）+notify 面写端点+config `POST pull`/`verify`/`DELETE cache`——全部门内。
3. **RCE 严重度锚=实锤**：`src/cron/command-handler.ts:83-88`=spawn `/bin/bash -e -c <payload.command>`（runAs 时 runuser 降身）——addJob 的 command 即任意 bash。若门未激活+外网可达=未认证 RCE（代码注释原文自认「未认证 RCE 面」）；现役双阻断（401 实锚+安全组）闭合。
4. **fail-open 条件现役未触发，但属结构性弱点**：门激活依赖 `process.env.TRIMC_INTERNAL_TOKEN` 运行态注入；sg 现役经 systemd unit override.conf 注入（401 实锚反证 env 已达进程）——但任何未来部署若漏配 env，8710 即静默回到零鉴权全开（且绑定全网卡）。对比 TriRLC 注释自证设计觉醒：「参照 TriMC 的实现是『未配置即放行』的兼容变体；本面有三条任意命令执行通道，缺省必须全拒」——**TriMMC/TriRMC 是同族中未升约的两席**。
5. **门外豁免面（低危注记）**：`/healthz`（返回 cron 统计，无敏感）；`/hello`+`/hello-pro`（**门外 GET**，直调 modelClient.chat=模型配额消耗面+`unknown_model` 错误回显模型清单）——外网可达时代为滥用面，安全组关闭后降为内网观察项，端口迁移后 loopback 下自然消解。

## 四、工程建议（候批，本席不擅动实现面）

| # | 项 | 形态 | 窗口 |
|---|---|---|---|
| 1 | **TriMMC 门升约 fail-closed** | 照 TriRLC 正形：env 未设→401 全拒；部署面确保 override.conf token 常驻（现已在位） | **随 8712 端口迁移窗一并**（COS 施工单，同 daemon 同重启） |
| 2 | **TriMMC bindHost env 化** | `listen(env.port, process.env.TRIMC_HOST ?? '127.0.0.1')`——TriRMC app.ts:805 形态即正形模板 | 同上迁移窗 |
| 3 | token 恒时比较 | TriMMC/TriRMC `!==` → `timingSafeStringEquals`（低危，时序侧信道理论面） | 随 1 顺带 |
| 4 | TriRMC 河源部署面复核 | 代码默认 loopback，现役外暴露=疑似显式 TRIRMC_HOST 覆写——河源 unit 复核（R 面通道）+回 127.0.0.1 | 候维护窗，非急（安全组已兜） |
| 5 | `/hello` 族处置观察项 | 迁移 loopback 后自然内敛；若未来对外开服务须另设公网网关层 | 观察 |

## 五、审计方法附注

- 代码源：四仓本地工作树直读（TriMMC 73 文件清单内定点 4 件；TriRLC/TriMLC app.ts 门段+listen 段；TriRMC app.ts 门段+listen 段+cli.ts 门注释）。
- 活体：一次 `curl -o /dev/null -w '%{http_code}'` GET（sg loopback→8710 `/internal/v1/cron/jobs`）=HTTP 401；零 body 零 token 材料出机。unit 勘验 `systemctl cat trimc.service`（token 行 grep 滤除后呈读，override.conf 在位）。
- 零真值令遵守：全程无 token 值/无 command 字段全文/transcript 零敏感材料。
- 本机 Grep 全工作区超时两笔（改精确路径重发成功）——审计方法无碍。

## 六、勘正注（2026-09-30 20:5x，BOD 迁移施工勘明后回补）

1. **token 注入源=双源非单源**：§三.4 原述「token 经 systemd unit override.conf 持久注入」——BOD 施工勘正：**真源=`docker/.env`**（start.sh 源读），unit L31 系重复注入面，双源并存。重启韧性结论不变（两处均磁盘持久），轮换时两处同步。本席 §五 勘验所见 override.conf 在位为实（重复注入面），单源表述随勘。
2. **§五「transcript 零敏感材料」范围注**：该句陈述本席审计过程事实（本席操作零溢出），不受 BOD 同日 `systemctl cat` 全值溢出事件影响（彼件在 BOD transcript，已由 BOD 自报定性零真值令违反+轮换台账升级，边际泄露≈0 论证同本席 gho_/前段溢出前案）。
3. **轮换施工要素增量（候轮换单）**：token 轮换同步面不止双源——在役 job command 内嵌 token 引用（config-sync-apply 实锚在案，COS 施工卷报备条）=**第三同步面**，轮换单须含「job command 引用面全扫+逐 job PATCH」工序。

## 使用依据

BOD 19:44 升急通报+R6 口径同步（安全组已关/MMC→8712+loopback 施工单发 COS/heyuan=TriRMC 解谜/审计标的不变）；TriMMC src/server/app.ts+src/cron/routes.ts+src/cron/command-handler.ts+src/internal-token.ts；TriRLC src/server/app.ts L1797-1812/4779；TriMLC src/server/app.ts L1756-1771/4481；TriRMC src/server/app.ts L148-161/805-806+src/cli.ts L440-462；sg 活体勘验（401 status-code+trimc.service unit cat）。
