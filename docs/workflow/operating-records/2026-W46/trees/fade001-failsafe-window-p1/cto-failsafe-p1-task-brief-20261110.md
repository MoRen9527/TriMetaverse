# P1 施工任务书 · 迁移失败告警面+preflight 断言（兜底三件之首·今夜勘修窗）

- sourceOfTruth: 本件（CTO 施工任务书面·P1 窗令承载）
- syncMode: static（施工候窗执行·窗=今夜 20:00-24:00 黄金段勘修窗）
- lastSyncedAt: 2026-11-10T10:35Z 前（date 现查 18:33:16+08 原值）
- 令链: CFO 复工令 18:30:38（③兜底三件解禁排窗）→COO 排窗单 18:31:25（建议窗今夜黄金段·护栏三件）→CTO 接令回执（df923ca0·P1 APPROVE）→本任务书
- 施工裁量与令文: CTO 域（本件）·施工执行=FSD 主刀+值席在岗·窗验收=CTO 终验

## 一、施工对象与止损边界

**对象**：R-HY 机 FADE-001 周迁移链——①`/srv/fleet/TriCompany` 检出的 `runtime/cognition/weekly_plane_shift.py`（328 行·迁移器本体）②TriRMC 8710 cron job 9c81c7ec 的 command 链（SOP L19 原文在卷）③新增小模块 `runtime/cognition/shift_notify_fail.py`。

**止损线（照 COO 排窗单护栏）**：改动仅限迁移器告警面+preflight 段+command 链兜底分支——**禁触**迁移五段本体逻辑（create/migrate/carry_over/validate/agent_close 五步函数体零改动）·禁触 jobs.json 其他 job·禁触 8713/8711 任何面。

## 二、现状实锚（改点依据·本席 18:33 勘验）

1. 告警面=SMTP 单路 non-blocking：`weekly_plane_shift.py` L211-213「TriLC notification push failed (non-blocking)」——失败不打断不重试不另路；
2. notify 段在迁移五段毕才跑（L280 ⑦ notify）——pull 段 exit 128 时 python 后续根本不执行=19.5h 静默的机理本体；
3. command 链=纯 `&&` 串联（pull→python→add→commit→push||兜底）——任何前段死=全链静默死，链上无 `||` 告警分支；
4. 收件人=env `WEEKLY_SHIFT_SMTP_TO` 或 notify config default_to——单址。

## 三、改点清单（三件）

**改点 A · preflight 段（python 层·weekly_plane_shift.py 内新增函数·本体逻辑零触）**：
- main() 前置调用 `_preflight_bare_sync()`：`git fetch sg-bare dev`（仅取顶不合并）→对表本地 dev 顶（rev-list left/right 计数）→**left>0（本地含 bare 无的提交=分叉）→notify 双址 blocking 告警「preflight: 本地分叉 bare·候裁不硬跑」→exit 3**；
- right>0 或 0/0（纯 behind/已齐）→放行（pull --ff-only 保留为二道闸不动）；
- preflight 函数独立可单测（纯函数化：输入两顶 hash 列表→输出分叉判定）。

**改点 B · 告警面双址+blocking 化（python 层）**：
- `_notify_shift` 与 preflight 告警统一走双址：env `WEEKLY_SHIFT_NOTIFY_TO`（逗号分隔·值席 COS+BOD 两址·施工窗内与 COS 对表实名）；
- blocking 语义：send 失败重试 1 次→仍败=落卷 `shift-ade.json` 顶层 `notify_failures` 字段（值面留痕·对齐 LG-069 家族读数形）+exit 码升 4——**告警发不出发不出必须可观测**（「已发≠在链」正形化第一层）；
- 现役 SMTP 通道复用（河源机外网 SMTP 可达·不依赖跨机隧道）。

**改点 C · cron command 链兜底分支（shell 层）**：
- 链改形：`(原 && 全链) || python3 -m runtime.cognition.shift_notify_fail`——新小模块（<50 行）：读链 exit 码+阶段探（树态/git log）→SMTP 双址 blocking 告警「迁移链 exit N·阶段 X」；
- 兜底分支覆盖 pull 段死（exit 128）——19.5h 静默的本体补丁；
- **command 串变更→ALLOWLIST 坑**（见 §五坑位 1）。

## 四、施工序（六步·探勘先行）

| # | 步 | 内容 | 门 |
|---|---|---|---|
| 1 | **探勘步** | 河源机活体现探：TriRMC cron API 对 command 变更的行为（ALLOWLIST 精确等值有无——先以只读 GET jobs 对表现势·再以测试 job 或 dry 形探 403 行为）+SMTP 通道活体可达（试发测试信）+18710/bod-dsh-tunnel 形态勘验（`ss -tlnp`/进程参数·-L 单向 or -R 反向——P2 通道设计输入） | 三探读数落卷·任一异常停窗报告 |
| 2 | 改点 A+B | python 层施工（TriCompany 仓检出·独立 commit）+单测（preflight 纯函数 4 例：0/0·纯 behind·分叉·fetch 失败） | 单测全绿+既有基线不增不减 |
| 3 | 改点 C | shift_notify_fail.py 新模块+command 链改（若 ALLOWLIST 精确等值=新串追加+TriRMC daemon 重启——重启照勘修窗实操序：验监听 pid→优雅停→port FREE→冷启→pid/CIM 对表） | 新串 POST 201+next_run 值面+enabled=1 三查 |
| 4 | 注入测 | ①分叉注入：河源树造 eval 笔不推 bare→手动 POST /run→preflight 拦截+双址收到+exit 3（测毕清理 eval 笔·恢复 0 分叉）②链断注入：临时 command 加假首段→`||` 分支告警到达（测毕还原）③正常轮回归：无分叉态手动跑=pass 五段全绿 | 三测读数+双址收信证据落卷 |
| 5 | CTO 终验 | 读数四查：三测证据+shift-ade notify_failures 字段形+ALLOWLIST 旧串保持可用+基线对表 | 本席 APPROVE 方毕 |
| 6 | 收口 | 施工卷落本树+TriCompany CodeRegistry 更新（weekly_plane_shift 行附依据）+P3 裁定条款随卷+P2 勘验读数出·候 COO 次/同窗排 P2 | registry 行回写毕 |

## 五、坑位警告清单（施工必读·家族纪律投影）

1. **TriRMC cron ALLOWLIST 精确等值**（TriRLC 同族教训·双入口 fail-closed）：command 字段任何变更（含路径微调）=必 403——正形=新串追加 ALLOWLIST+daemon 重启；旧串保留不删（回滚通道）；
2. **机位断言（D-24）**：施工对象=河源机（R-HY）两检出（/srv/fleet/TriMetaverse+/srv/fleet/TriCompany）+TriRMC daemon 8710——开工前活体三断言（ssh -J sg R-HY 可达+两检出 git 状态干净+8710 healthz ok）；
3. **repo git 操作必 sudo -u fleet**（河源通道家族坑）·跨机脚本防 CRLF（PS→ssh stdin 剥 \r 族·heredoc 独立跑）；
4. **值面三查**：notify 双址 send 后验收信证据（收件箱/SMTP 回执）非仅看 exit 0；
5. **禁裸杀 daemon**：TriRMC 重启走优雅停正形链（/shutdown→port FREE→冷启）；
6. **token 额度**：零批量 token 窗（CFO 收紧）——施工=代码面+三测低耗·禁扩测面。

## 六、回滚锚（三件）

1. python 改动=TriCompany 仓独立 commit·revert 单笔可回；
2. command 旧串 ALLOWLIST 不删·回滚=POST jobs 改回旧串（零重启即回·若新串已重启则改回后再验 201）；
3. 施工前基线快照：两检出 `git rev-parse HEAD`+shift-ade.json 备份+job 配置 GET 全文落卷（回滚对表基线）。

## 七、P2 勘验步（随本窗·不改死设计）

探 bod-dsh-tunnel 隧道形态（-L 单向/-R 反向监听有无）→「河源拍探本机 8713」通道三候选：a) 隧道加 -R 反向监听 b) 河源→sg→本机二跳 c) 本机侧拉形（8713 job 反探河源+河源侧静默判定）——**P2 设计随勘验读数另出简案**·本窗只出读数。

## 八、P3 裁定条款（本席裁定·随卷入派工模板）

**「R 面工作树提交毕随手推 sg-bare·禁 eval 笔滞留工作树过夜」**——D-27 派工单护栏条款模板承载（B3 根因制度面）·知会 COS 台账入账。

## 使用依据

COO 排窗单 18:31:25+08（护栏三件+额度面）/CFO 复工令 18:30:38/迁移器实锚（weekly_plane_shift.py L211-213·L280-284·328 行·本席 18:33 勘验）/SOP L19 command 链原文/联审分卷 I1 设计（385afbec9）/TriRLC cron ALLOWLIST 家族教训（工作区记忆条）/河源通道家族坑（sudo -u fleet·ssh -J）/勘修窗实操序先例（TriMLC 勘修窗 2026-10-11）。

—— CTO 小狄（m-cto·P1 窗令），2026-11-10 18:3x CST（现查 18:33:16+08 原值）
