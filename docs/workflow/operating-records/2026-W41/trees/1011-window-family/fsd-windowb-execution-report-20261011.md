# FSD 栏 B 窗毕报 · 8713 并批三件一次重启（施工消费卷 v3.1 执行实录）

- sourceOfTruth: 本件（trees/1011-window-family/fsd-windowb-execution-report-20261011.md）
- syncMode: static（毕报卷·落盘即锚）
- lastSyncedAt: 【窗毕时填·date 现查原值】
- 执行位: FSD 小全（m-fsd）
- 令源链: BOD 2026-10-11T07:58:56+08 即刻开窗令（CEO 07:58 令栏 B 现在开·硬锚 11:00）→施工消费卷 fsd-windowb-prep-checklist-20261010.md v3.1（@89565265 现行）+CTO 门禁卷 cto-windowb-gate-verdict-20261010.md
- 状态条: ①date 现查 2026-10-11T00:02:42Z（08:02+08·窗内开工时）②【窗毕时更新】③联审证据=本卷④水位自估=中⑤末次活动=【窗毕时填】

## 一、结论

【窗毕时填：一句话=三件全落/门四项全绿或 fail 停报现场】

## 二、步 1 准备段读数（08:02-08:12 已毕·实录）

| # | 项 | 读数 | 判 |
|---|---|---|---|
| 1 | 端点实测（CTO 验收锚·禁转抄） | `GET https://open.bigmodel.cn/api/monitor/usage/quota/limit`·Authorization 裸值→HTTP 200 success:true level=max·data.limits[] 三型（unit6/num1=周窗 31%·unit3/num5=5h 窗 1%·TIME_LIMIT 无关套餐）·key 尾 Dmsf（len49） | PASS |
| 2 | GLM_API_KEY env 勘误 | 尾 VRyY 枚=code 1000 身份验证失败（**非 Coding Plan key·实测实锚**）→改设 User env `GLM_CODING_KEY`（sg-glm-direct.txt 活枚·值零回显） | 勘正入卷 |
| 3 | env→schtasks 链实证 | 临时探针任务 FSD-EnvProbe：Result=0x0·ENV-READ len=49（首轮 7s 超时假阴性·10s 定谳）——daemon 同链新进程可读 User env | PASS |
| 4 | job① 三件 | glm-quota-obs.mjs+config.json+thresholds.json 落 scripts/ops-local/·node --check=0·干跑全链 row=obs-20261011-0810-01 weekly=31% fiveh=1% thresholds=loaded·负验证（缺 key→FATAL exit2 零行）·**干跑行已删**（08:10 非锚行防污染明日同锚差分·09:30 起正式行） | PASS |
| 5 | job① 首行 schema 自扫 | 五要素全非空（M/local/tail:VWi3Dmsf/glm-coding-plan/provider）·ts 机写 Z·quota_used=31·thresholds_snapshot 全值·line_status observe=normal+warn/pause=no-prior-anchor（首日显式形）·weekly_reset=2026-10-14T12:44:33Z=20:44+08 与 CFO 卷秒级吻合 | PASS |
| 6 | job② | window-dispatch-remind.mjs 落位·node --check=0·干跑 log 落位 | PASS |
| 7 | channel.cmd 手术 | 备份 .bak-pre-windowb-20261011 md5=1D477FEC23FCF70F5E1E861B422DB338（双录）→L25 行尾追加三串（latin1 字节保真·行内追加零新行）→CR 39→39 零差·byteDelta=240 精确·commas 12→15 | PASS |
| 8 | 剥启动行探针 | 副本剥 cd+node 启动行+@echo off→cmd 解析 parsedStrCount=15（12 原串+[13]glm-quota-obs+[14]window-dispatch-remind+[15]tri-liveness-l1.ps1 按序）·batch 语法完好 | PASS |

## 三、步 2-9 序列读数（【窗毕时填】）

| 步 | 时点 | 读数 | 判 |
|---|---|---|---|
| 2 重启三连 | 【填】 | /end Watchdog→/end Daemon→/run Daemon | 【】 |
| 3 uptime 重置 | 【填】 | healthz ok·uptime 旧→新·pidfile==listen pid | 【】 |
| 4 零丢拍三对表 | 【填】 | jobCount=10+迁移 job next_run 23:10+绩效 job next_run 21:00 | 【】 |
| 5 POST 三 job | 【填】 | 三串 201 非 403 | 【】 |
| 6 next_run 双路 | 【填】 | sqlite+JSON 投影双路非空（job① 09:30/job② 09:00·18:00/job③ +5min） | 【】 |
| 7 job③ 首滚 | 【填】 | execution_log status=ok（两形双证） | 【】 |
| 8 L1 disable | 【填】 | schtasks /change /disable（避 30s 窗·禁 delete） | 【】 |
| 9 第二滚+唯一写者+09:30 首滚机扫 | 【填】 | 第二滚 ok+l1.log 唯一写者+jsonl 正式首行机扫 | 【】 |

## 四、完工门四项读数（【窗毕时填】）

| 门 | 读数 | 判 |
|---|---|---|
| ① 进程内生效 | 【healthz/uptime/pidfile/jobCount=13】 | 【】 |
| ② 三新 job next_run 非空 | 【双路对表】 | 【】 |
| ③ allowlist 生效+执行链 | 【201×3+job③ 首滚 ok】 | 【】 |
| ④ DEM-004 首验行 schema 机扫 | 【09:30 行五要素+ts+quota_used 全非空】 | 【】 |

## 五、知情项与技术债（如实）

1. **job① 附加键超出 CPO schema v1 字段表**（fiveh_pct/fiveh_reset/weekly_reset/plan_level/fiveh_watch）——CFO input 行样例同形·候 CPO v2 收编或裁剪（锚⑤机扫不破坏：必填字段全非空）。
2. **model 字段取值 `glm-coding-plan`**——观测对象=套餐池非单模型，CPO schema「模型标识」语义候确认。
3. **阈值数值=CFO input 信面值**（observe70/pace15/pause30/5h70/90·asof 10-08）——候 CFO 正身，config/thresholds 文件面替换零代码改。
4. **env GLM_CODING_KEY 新增**——User 作用域·值=sg-glm-direct.txt 活枚（尾 Dmsf）·GLM_API_KEY（尾 VRyY）经实测非 Coding Plan key 留原位未动（TriStaciss 链自用）。
5. 干跑行删除决策在卷（§二.4）——jsonl 09:30 起正式行，首日 warn/pause=no-prior-anchor 显式形。
6. 【窗内新增如实填】

## 六、回滚锚（现状）

- channel.cmd 回拷 `.bak-pre-windowb-20261011`（md5 1D477FEC）+/end→/run Daemon（≤5min）
- 三 job DELETE（API）·TriLiveness-L1 re-enable·watchdog 复位 Ready 确认
- User env GLM_CODING_KEY 可留（无副作用·脚本显式消费）

## 七、毕报链

【窗毕时填：CTO+COO 转发记录→BOD 收口毕报】

## 使用依据

- 施工消费卷 fsd-windowb-prep-checklist-20261010.md v3.1（@89565265）·CTO 门禁卷（@894ec51d+@831f3f66）
- CPO schema v1 @5ceb13e9·CFO input 信（cfo-dem004-quota-observation-inputs.md）·BOD 端点调研卷 ccswitch-quota-endpoint-research.md（bcec4e825——端点线索源·本窗独立重测非转抄）
- 纪律册: CRLF 保存法/F-3 家族/禁裸杀/值面禁进打印路径/假阴性排除（键存在性≠值面·探针先排除执行失败）
