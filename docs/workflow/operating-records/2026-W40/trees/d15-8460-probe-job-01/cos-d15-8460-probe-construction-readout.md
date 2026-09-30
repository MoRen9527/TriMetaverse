# D-15 8460 探测 job 施工读数卷（COS 施工，2026-09-30 夜窗）

- 任务源：CTO D-15 派工（2026-09-30 05:0x 消息令，五要目）+ CEO 04:57 批①实施；执行窗=今夜 18-24（COO 重排表 v2 维持）。
- 施工席：COS（m-cos，守望体系 owner 承接）。
- 状态：**施工毕，实弹验证 PASS，候 CTO 验收**。

## 施工链读数（全程亲验）

| # | 工序 | 读数 |
|---|------|------|
| 1 | 勘察·TriMMC 路由 | job API 正身=`/internal/v1/cron/jobs`（此前 `/internal/v1/jobs` 缺 `/cron` 段=not_found 根因）；源锚=`/srv/fleet/TriMMC/src/cron/routes.ts`（POST 建/GET 列/PATCH 单/`{id}/run` force run/log/status 全族） |
| 2 | 勘察·addJob schema | `name`+`schedule{kind:'every',everyMs}`+`payload{command,cwd}`（validateCreateInput 必填族，routes.ts L36-57 亲读） |
| 3 | 脚本落树 | `scripts/fade/sg-8460-probe.mjs`（99 行，node --check PASS）commit=`76e4507a` |
| 4 | 推链核真 | 本地→sg bare 单路直推→ls-remote 三层同顶（bare 顶=本地 HEAD=github/dev=76e4507a7） |
| 5 | sg 树 FF | `/srv/fleet/TriMetaverse` merge --ff-only 至 76e4507a，脚本在位（fleet:fleet 6059B） |
| 6 | TriMMC addJob | job id=`d684f621-8995-4fa9-add8-7ef997eecc71`，name=`sg-8460-probe`，every 21600000ms，enabled=true，**nextRunAtMs 正常**（+6h=次日 00:12 前后首轮自动跑） |
| 7 | force run 实弹 | `{"ok":true,"ran":true,"reason":"status=ok"}`，durationMs=84，TriMMC cron log 入册 status=ok |
| 8 | 探针 log 首行 | `2026-09-30T10:12:28.190Z VERDICT=OK service=active port=LISTEN dailyLines=5 alerts=none` |

## 五要目逐条对表（CTO 令）

1. **执行位=sg TriMMC 8710 job/21600s** ✓ —— id `d684f621`，every 21600000ms（6h，日 4 轮），即生效型（TriMMC 零白名单零重启，nextRunAtMs 入调度实锚）。
2. **双锚只读** ✓ —— 锚①`systemctl is-active bigmodel-h1-proxy.service`==='active' 且 `ss -tln` 含 `:8460` 监听（两证齐=在位；判据自身失败出声禁静默）；锚②proxy.log 当日（UTC 日界，与日志原生时间戳对齐）行数 `<2` 告警（9-25 起低活基线 4-5 行；今日 5 行吻合；2=下破线，7 日校准期 2026-09-30 起）。log 真路径=`/opt/bigmodel-h1-proxy/proxy.log`（勘察勘明，非 /home/fleet 猜测位）。
3. **告警通道=LG-036 notify 信箱双跳** ✓ —— 契约照 `ledger-watchlist-patrol.mjs` notify() 先例：sg 面 loopback `http://127.0.0.1:8710` + `/etc/trimc-internal-token` 直读；`bod` 目标必 `target_daemon:'trimlc'`（09-29 勘正注随抄）；**异常才发**，正常轮静默落 log（force run VERDICT=OK 实证零 notify 副作用）。
4. **异常触发实测规程挂链 2a9b5e94** ✓ —— 告警 body 内嵌分诊指针（systemd down→journalctl；无监听→查进程；低行数=低活观察非故障）+「定谳须实测照 `docs/execution/fade-007-incident-sop.md` 链 2a9b5e94」+探测只报不定谳原则。
5. **只读探针+回滚锚** ✓ —— 全程只读（systemctl is-active/ss/readFileSync 零写零杀，proxy.log 仅读）；回滚=`enabled:false` PATCH 即停（TriMMC PATCH 不涉 command 零 403 面，未实弹试以免扰动在役 job——回滚路径已内嵌告警文案）。

## log 落点

`/srv/fleet/TriMetaverse/.fade/probe-logs/sg-8460-probe.log`（append 一行/轮；.fade=非 git 面）。

## 报备（随卷）

- **零真值溢出一笔**：施工勘察 GET job 列表时，既有 job `config-sync-apply` 的 command 字段含明文 `TRIMC_INTERNAL_TOKEN` 前段进会话 transcript（既有 job 非本次施工产物；transcript 本机私域有界）。列轮换候选随施工读数报 BOD 裁。教训：job 列表类读数须先脱敏 command 字段再输出（后续查询已改此式）。
- 件②（双 job command PATCH 切 scripts/fade/）前置已核得：启动脚本=`%LOCALAPPDATA%\trimlc-daemon-channel.cmd`（TRILC_INTERNAL_TOKEN+TRILC_CRON_COMMAND_ALLOWLIST 现值 5 条全在）；双 job 目标=tree-node-patrol+ledger-watchlist-patrol（两壳头注释自证候晚间批）；allowlist 精确等值→新路径必 403→**须 allowlist 追加+重启 TriMLC daemon**（重启窗对时互报随回执行）。

## 验收请求

候 CTO 按五要目对表验收；验收过即销挂账条 `sg-8460-probe-job`（销账验证锚=本卷+commit 76e4507a+job id d684f621+探针 log 首行）。
