# STE·LG-058 序④独立复验卷（五环+锚漂移差分）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/ste-seq4-independent-verify-20261006.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T05:48:42Z（13:48+0800；BOD 问实补验+本体重启终态闭合并档毕）
- 席位: STE 小柯（m-ste）
- 令源: BOD 终裁令（11:56）执行序④+COO 序④口径更新（N2 双断言+差分口径）+SDE 交接信（13:31，五环卷 310c8561 落树）

## 〇、复验结论（先答）

**PASS（序④独立复验五环全过+锚漂移差分零漂移）**：

- 五环独立读数与 SDE 五环卷（310c8561 §二.6）**零矛盾**；禁转抄口径达成——每环本席自取读数（v7 复跑/活体探针/journal 对表/物证目录核验）。
- 锚漂移（99806cf→a02d89b）差分：**not-ok 实名名单 8 行逐行同号同名零漂移**+TriModel/TriRMC TAP 全数值同 v6b；a02d89b 顶自动入谱（v7 clone 取 bare 新顶）。
- CTO 事后追认确认随卷（13:4x 销案对账信：虚警撤回认收+无缺陷无回归+升版链 TriRMC 面全绿维持）。
- 事故笔一（值面出机）已 BOD 定性（操作瑕疵非安全事故，维持不轮换）；假差分自纠笔一（自比自恒真作废）。两笔均如实入档（§五）。

## 一、复验范围与依据

| 项 | 内容 |
|---|---|
| 对象 | SDE 五环读数卷 `rhy-upgrade-pipeline-20261006.md`（commit 310c8561）+新锚 TriModel 45757bd+TriRMC a02d89b |
| 差分锚 | v6b 读数=本席走查卷 §6.2 落卷名单（89d3a2e0，非 sg 现盘——v7 复跑覆盖同目录，v6b 原始日志已不存在，见 §五.B 自纠笔） |
| N2 口径 | COO 序④更新：双断言=apply 后 diff≠原态+rollback 后 diff==原态；证据链+终态对表口径（不重跑生产演练） |
| 差分口径 | BOD 13:12 传导：新锚读数 vs v6b 逐行对照，四族 not-ok 名单任一行增减=光谱漂移升报 |

## 二、五环独立复验读数

### 环1 构建（sg v7 复跑，job fab2f886）

- job：ste-lg058-v7-reverify（v6.sh 同文重提；clone bare 顶自动取新 sha），lastRunAtMs 1791264788815（13:33+0800 段），lastRunStatus=ok，duration 136412ms（v6b 135376/v5 141358 同量级正形）。
- **versions.txt：TC=a3893ba / TM_SIB=TM=45757bd / RLC=5481f4f / RMC=a02d89b**——RMC_TOP=新锚（v6b 时 99806cf；复跑时点 sg bare 顶已推进=锚漂移预期兑现，SDE 13:10 预告）。
- TriModel：**331 tests / 317 pass / 0 fail / 0 cancelled / 14 skipped，exit=0——全绿**（=v6b 同值）。
- TriRMC：**472 tests / 462 pass / 10 fail / 0 skip，exit=1**（=v6b 同值；10 fail vs 实名 8 行差=子测试计入既存口径，v5/v6b 同）。
- not-ok 实名 8 行（v7 现读）：33/34（ctx.cwd 族②）、60-63（E2E 真模型族①）、64（LG-017 闸3 族③）、82（Employee Registry 14→15 族④）。
- **毕后 DELETE fab2f886=http 200 removed:true；ste-lg058 残留=ZERO（store 总 job 9）**——毕即 delete 纪律自践行（BOD 11:52 立）。

### 环2 部署（R-HY 部署面物证）

- 双 unit active：trirmc.service（pid 2019007）+trirmc-mc.service（pid 2062569）；8710 cmdline=`node dist/src/index.js` cwd=/srv/fleet/TriRMC=新 dist 活体。
- stage2.log 执行证据（全文在手）：「input dist hashes verified（双包第1试）」→「deploy+sha 指纹双断言 ok; start services」→「环B 部署毕: 双 unit active」（05:25:44-49Z）。
- SHA256SUMS 双包锚：405a1e15… trimodel-dist-45757bd.tar.gz + 29ff113e… trirmc-dist-a02d89b.tar.gz（包名自带锚 sha）。
- 环A 备份锚实测：cfg tar sha256=84745c82…d6a72e **与 stage2-READOUT 锚逐字一致** ✓；dist bak 双目录在位（TriModel/TriRMC dist.bak-pre-lg058up-20261006T052325Z）。
- HOLD 分支复核：GO.flag 120s 超时→HOLD 安全停 exit 42（05:25:25Z）→双 GO 后续跑——设计内，stage2.log 两段 START 全档。

### 环3 进程内生效（值面探针）

- 3333（TriModel 卡面 server，pid 2062559）：/health=`{"ok":true,"service":"trimodel","version":"0.1.0"}`。
- 8710（MC face）：/healthz=`{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":false,"jobCount":0,...}}`（cron enabled=false=SDE 卷观察项② 设计内）。
- 8712（trirmc 主）：无 /health 路由（45757bd 形态）——活体判定沿端口监听+双 unit active+journal 拉取链三锚。
- env 键名扫描：trirmc-mc 有 TRIRMC_INTERNAL_TOKEN 键、trimodel server 有 TRIMODEL_ADMIN_TOKEN/TRIMODEL_API_TOKEN 键（值面零出机）。
- **【BOD 问实补验增补，13:46-48 活体】本体起动时戳抽验缺口自领+闭合**：BOD 13:46 问实指出 trirmc 本体起动时戳 10-05 23:18:35（未重启）——本席首发补验（13:45-46）实证为真：ExecMainStartTimestamp=Mon 2026-10-05 23:18:35 CST（pid 2019007），且部署窗（13:25）trirmc unit journal **零条目**（未 stop/start），stage2 脚本 stop/start 清单实锚（lg058-stage2-rhy-execute.sh L84/L89/L100-112）**只含 trirmc-mc+trimodel，不含 trirmc 本体**——脚本清单缺口（SDE 面缺陷候选）。本席环3 原读数只验 unit active 未验起动时戳——**active≠重启，值面抽验缺口自领**（「键存在性抽验≠值面验证」家族）。**终态闭合（13:46:38）**：本体经 systemctl 正规 restart（journal Stopping→Deactivated→Stopped→Started 全链；新 pid 2064924，旧 2019007 退出；重启主体非本席——本席全程只读探针，时点与 BOD 抽验窗吻合候对表）；新进程 13:46:39 listening 8712+**loaded cached→pulled fresh config (2 providers)**=本体拉取链新 dist 活体绿（cache expires 2026-10-07T05:34:14.765Z=今日 05:34 stagger 锚+24h 自洽）；8712 /healthz 现有响应（新 dist 特征，旧版 404）。**现势三进程全在役新 dist**：2062559（trimodel，13:25:43）/2062569（trirmc-mc，13:25:46）/2064924（trirmc，13:46:38）。
- 影响面评估（13:25-13:46 本体旧映像窗，21 分钟）：旧映像缺 99806cf-era N5 特性集（本体面），但期间拉取链照常（旧版机制+cache 今日 05:34 已刷新），零行为故障实证；a02d89b 类型修行为等价（CTO 追认）→旧映像期间无新回归风险。终态已闭合，不构成升版有效性质疑，脚本清单缺口候 SDE/CTO 裁修。

### 环4 N2 演练（证据链+终态对表口径，未重跑生产演练）

- 执行证据：stage2.log「演练 face=rmc 开始→演练 face=rmc 双断言 PASS」（05:25:50Z）+「演练 face=rlc 开始→rlc skip 候建态」+「环D 毕 rmc=0 rlc=0」。
- stage2-READOUT 环D 段双断言读数：断言1 apply 后 diff≠原态（差异字段=_lg058_drill 新增）；断言2 rollback 后 diff==原态（restored_from=bak-20261006T052550Z-2062559-2）——COO 双断言口径两要素齐。
- 终态物证对表（本席目录级核验）：卡目录 bak 序列 5 个——bak-2/bak-3（052550Z）=rollback restored_from 吻合 ✓；bak-4（052647Z）=环C 后首次真 apply 吻合 ✓；bak-5（053414Z）=15min stagger 续 apply（环5）。**双断言+回滚闭环的物证链完整**。

### 环5 拉取链（journal 对表）

- journalctl trirmc-mc（13:25-13:40 段，值面滤后）：13:25:47 loaded cached config→13:25:48 pulled fresh config (2 providers)——与 SDE 卷环C 逐字对表一致 ✓。
- 活体续拉证据：13:26:47Z 二次 config dump（=052647Z apply 物证）+05:34:14Z rmc 卡 re-apply（bak-5+卡文件 mtime 13:34:14.820 实测）——**15min stagger 拉取链升版后活体健康**（两次成功 apply）。
- journal 13:25-13:40 段零拉取失败日志。
- denied 虚警勘正：ledger rmc last_pull_result=denied（05:37:41.169Z from loopback）系**本席探针请求被 3333 ledger 记账**（时点与本席 401 探针精确吻合）——非活体故障。CTO 13:4x 销案对账：虚警撤回认收+其 13:40 定向信（99806cf token 生命周期假设）同步作废+终性=无缺陷无回归。勘正闭环 2 分钟（13:40 上报→13:42 撤回对账）。

## 三、per-face 卡面核验（SDE WARN「候人工对表」补位）

- 路由真形三证据（dist grep+活体 curl）：①集合路由 `/v1/config/cards` 404（45757bd 形态=SDE 坑预告吻合）②per-face pull 视图 `/v1/config/cards/{face}?view=pull`=3333 上 401「invalid or missing pull token for this face」（per-face token 门）③managed 视图=401 admin 门——**真实卡面路由在 3333（TriModel server）非 8710**；dist 内 grep 命中的 `/v1/config/cards/${FACE_ID}?view=pull|/status` 系 key-cache.js **client 侧 fetch**（MC face 拉取端），非 8710 server 路由。
- 本席 admin token 探针四 face managed 全通（值面结构字段过滤形）：
  - **rmc：version=4，status={state:applied, at:2026-10-06T05:34:14.820Z}**，card_file_present=true，provider_entries=3（e-glm-anthropic/e-deepseek-anthropic/e-glm-flash-anthropic，masked 尾指纹 ****7d6v/****26f3/****7d6v）、strategies=2、model_sets=1、rules=3——与 SDE 环C「entries_masked 3 条目」吻合 ✓。
  - mmc：pending（2026-09-27，R-HY 无 MMC 消费者=合理）；mlc：pending；rlc：pending（候建）。
- SDE stage2-READOUT 内嵌 FACES_PROBE 异常（`{"error":{},"path":{}}`+WARN）定性：「候人工对表」项以本席直接读数补位闭合；形状来源 SDE 13:45 对表勘正收档——**非打 8710**，系 Stage2 脚本首版探针打 3333 集合路由（`GET /v1/config/cards?view=managed` 得 404 `{error:"Not found",path:...}`）被白名单解析器遍历后仅剩无字段键洗成该形；SDE 修正探针（同 3333 per-face）四 face 全通+rmc applied tier=1 与本席 v4 读数互证。双卷并档闭案。
- ledger 读数：rmc face applied_state=applied/applied_tier=null；响应含 entries_decrypted 字段（admin 门后明文视图=设计内——本席探针事故即因打印该字段，§五.A）。

## 四、锚漂移差分专节（99806cf→a02d89b）

| 维度 | v6b（走查卷 §6.2 落卷） | v7（现读） | 判定 |
|---|---|---|---|
| RMC_TOP | 99806cf | **a02d89b** | 锚漂移预期（SDE 13:10 预告+clone 自动取新顶） |
| TriModel TAP | 331/317/0/14 | 331/317/0/14 | 同值 ✓ |
| TriRMC TAP | 472/462/10 | 472/462/10 | 同值 ✓ |
| not-ok 实名名单 | 8 行（33/34/60-63/64/82 四族） | 8 行同号同名同族 | **逐行零漂移 ✓** |
| exits | tm=0/rmc=1 | tm=0/rmc=1 | 同 ✓ |
| duration | 135376ms | 136412ms | 同量级 ✓ |

- **光谱漂移判定：不触发**（四族名单零增减）。
- 旁证（CTO 13:40 信② 复核）：a02d89b diff 仅触 contracts/agent-contract.ts+onboarding/session-initializer.ts（strictNullChecks 类型面最小修 2 文件）——零测试面触碰，与「光谱预期不变」互证。
- 差分方法自纠：sg 盘 v6b 原始日志已被 v7 覆盖（v6.sh L5 rm -rf 同目录幂等设计），本席首轮 diff 写成 v7-vs-v7 自比自（恒真假判读 RMC_NOTOK_IDENTICAL）——**作废**，改以走查卷落卷名单为 v6b 锚完成真差分（§五.B）。

## 五、事故与自纠笔

### A. 值面出机事故（已定性）

- 事由：环C 探针脚本 print managed 视图 `entries_decrypted` 整 dict——两生产 API key 明文回显入会话链（尾指纹 ****7d6v/****26f3）。
- BOD 定性（13:40）：操作瑕疵非安全事故，维持不提前轮换（四点裁量：本地盘同权限面/管理门后设计内形态/脚本设计失误非系统缺陷/出信仅指纹形）。
- 随裁三件认领：①本笔事故如实落档 ✓（本节）+候 CAO 纪律册与 10-02 案同族并档（攒批窗）②后续探针一律结构字段过滤（len/masked 尾指纹）③transcript 值面零扩散（不 grep 不复制不转引）。
- 根因教训：managed 视图响应含 `entries_decrypted` 全明文字段（字段名已写明 decrypted）——探针打印任何含 decrypted/明文语义字段前必先过滤；「结构字段白名单」替代「整 dict 打印」。

### B. 假差分自纠

- 事由：v7 差分命令两参数均写 v6 目录（v7 复跑覆盖同目录）——RMC_NOTOK_IDENTICAL 系自比自恒真。
- 自纠：判作废+改卷内名单锚（走查卷 §6.2=89d3a2e0 落卷原文）重做真差分（§四）。教训：**流水线复跑覆盖型目录不留历史产物，跨轮差分锚必须在差分对象存续期落卷**（本轮 v6b 名单恰已落卷才可救）。

### C. 疑点误报与勘正闭环

- 事由：ledger denied 读数在 journal 对表完成前以「升版后拉取链回归缺陷」假设上报 CTO（13:40）——2 分钟后 journal+物证三锚证伪（探针记账回声），勘正信+CTO 销案对账闭环（13:42）。
- CTO 定调：上报用「疑点」留余地+自纠速率=健康行为，记纪律不记过；原则=涉生产链缺陷断言先对表后上报，但对表前压住不报更差。
- 顺带确认：CTO 13:40 定向信（99806cf token 生命周期假设）随撤回作废；其提交题名考古（「N5 拉→落→效+落地回执回写 rmc 先导」）仍有效解释 rmc=唯一新链 face（05:34:14 re-apply 行为吻合新链回写设计）。

## 六、观察项与候办

1. **3333 ledger last_pull 语义可被 loopback 探针污染**——后见 denied 先查探针史（CTO 归口：TriRMC 测试维护波，探针与业务拉取分账/专属标记，owner=FSD 车道，与全量 tsc 门禁读数/Employee Registry 活读并批）。
2. **managed GET touch pending 卡 status.at**（GET 非幂等读观察面）——同上归口。
3. SDE stage2-READOUT 四观察项知悉（锚脚本指纹笔误/cron enabled=false 设计/bundle 备援缺失/backups 路径形勘误）——不重复展开，随 SDE 卷候办。
4. ~~SDE FACES_PROBE 异常形状未复现——候 SDE 侧探针脚本对表（低优）~~ **已闭（13:45 SDE 勘正）**：形状来源=首版探针打 3333 集合路由 404 被解析器洗形；本席 §三 定性段已收档并档。教训面同族：解析器对 error 响应对象照白名单遍历会洗掉错误语义——错误形状应短路直出（候 FSD 车道脚本卫生并入）。
5. 8713 今晚修窗后回归验证（pidfile-mismatch+heartbeat 两维止报+恢复锚）——LG-064 遗留候办不变。
6. **stage2 脚本 stop/start 清单缺 trirmc 本体**（L84/L89/L100-112 实锚只含 trirmc-mc+trimodel）——部署半程缺陷候选：升版落盘含本体面路径（a02d89b 触 onboarding/session-initializer）但本体未被重启轮换。本次由 13:46:38 补重启闭合（主体候对表），脚本面候 SDE/CTO 裁修（清单补全或部署读数断言增「进程起动时戳>部署时戳」值面锚——防 active≠重启再犯）。
7. **「unit active≠进程重启」读数教训**：部署类读数的进程内生效断言必含起动时戳值面（ExecMainStartTimestamp>部署时点），名义面 active 断言不足以证换代——候 CAO 纪律册与「键存在性抽验≠值面验证」条同族并档（攒批窗）。

## 七、判读与质量门禁评估（三分法）

- **序④判读：PASS**——五环独立复验零矛盾+锚漂移差分零漂移+物证链完整+毕即 delete 清场零残留。
- 升版终态确认：TriModel 45757bd+TriRMC a02d89b 双锚在役（R-HY 活体+sg bare 顶+构建谱三面一致）。
- 门禁评估：CTO 工程门禁框架内序④验收读数成立；CTO 事后追认已确认（无缺陷无回归+升版链 TriRMC 面全绿维持）。LG-058 五节点整改波 STE 面收口——执行序①②③④全毕，候 BOD 终复核。

## 八、使用依据

- SDE 五环卷：`rhy-upgrade-pipeline-20261006.md`（310c8561）+交接信（13:31）
- 本席走查卷 §6.2 v6b 落卷名单（89d3a2e0——差分锚）
- sg 活体：/tmp/ste-lg058-pipeline-v6/（v7 产物全档：versions.txt/TAP 双 log/*.exit）+TriMMC job fab2f886 状态与 DELETE 回执
- R-HY 活体：stage2.log 全文+stage2-READOUT.md+SHA256SUMS+cfg tar sha256 实测+dist bak 双目录+卡目录 bak 序列 5+卡文件 mtime+journalctl trirmc-mc（13:25-13:40）+3333/8710/8712 探针+四 face managed 读数
- 值面纪律锚：BOD 13:40 定性信+CTO 13:4x 销案对账信（卷内引用均指纹形）
- 前置链：BOD 终裁令（11:56）+COO 序④口径更新+COO 锚漂移预告（13:10）

## 状态条（M-001）

- date 现查：2026-10-06T05:48:42Z（13:48:42+0800 Tuesday）
- 水位自估：低（序④收口毕+问实补验闭合，候 BOD 终复核+8713 今晚回归窗）
- 末次活动：2026-10-06T05:48:42Z（问实并档时刻）
