# FSD 技术协作稿 · 前两阶段白盒回审+阶段 3 plan skill 技术方案+4-10 实现路线框架（CEO 大会组织令·技术方案 FSD 面）

- **seat**：FSD（小全·m-fsd）
- **令链**：CEO 17:26 大会组织令→COS 17:33 转达（台账 529 笔 74a97c36f）→本席技术面三件：①前两阶段技术角度回审（含自施工面验收锚对表）②阶段 3 plan skill 技术方案协作稿③4-10 逐段实现路线框架
- **COS 裁决 A/B 对表**（17:39 信·台账 532 笔）：今晚 21:00=**实现面**（落仓落绿·预演形最小判据·零生产面触·现役 vB 保持）；周日 23:50 首拍=部署+全链实走——本稿全部产出按「实现面」形态落形，生产面零触
- **对表锚**：CPO 主稿 fe792b616（对接点五件·§四）+STE 回审卷 d14f3f527（锚草案五条+验收锚族六原则+判据框架八族）——本稿 §二/§三 逐条对表
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

## §零 · 审位声明

- 本席=P1 改点 A/B 自施工面 owner（b67a19a939+1f3b997·CTO 终验 APPROVE a8af43624）——§一阶段 1 回审含自施工面对表（自审+白盒复读双面·非利益回避对象：验收锚数据面全部取自独立活体读数非自报）
- preflight.py/qualify.py=CTO 施工面——本席白盒读源码回审（读数独立·非转抄毕报）
- 阶段 3-10=本席实现面主笔域（CTO 架构约束内·架构裁决归 CTO——本稿方案稿性质，施工候令候批）

## §一 · 前两阶段技术角度回审（白盒读数）

### 阶段 1（触发执行·vA1）

**白盒读数**（preflight.py 281 行·TriCompany 64e71d9 逐行读毕）：

| # | 断言件 | 白盒判读 | 强度 |
|---|---|---|---|
| 1 | 算周双闸 γ 主闸（check_week_math） | `compute_week_shift_tokens` python 侧重算（isocalendar 标准+跨年 wrap=上年 12-28 ISO 周）与占位符传入值三值比对+周日边界断言——与 TriRMC week-math.ts 同族语义对表成立 | 强 |
| 2 | hostname（check_hostname） | 硬校验+dev escape 双位（env 覆盖+--skip-hostname）——部署面必配形态正确 | 强 |
| 3 | git 卫生（check_git_hygiene） | MERGE_HEAD/rebase 探针+porcelain 迁移面过滤（`MIGRATION_FACE in path_part`——其余路径脏不拦，语义=「迁移面残留才是不硬跑的理由」）+worktree .git 文件形解引用（gitdir: 行解析）——边界细化到位 | 强 |
| 4 | healthz（check_healthz） | urllib 5s timeout+ok 值面断言（`is True` 严格判·非 truthy）+cron.enabled 读数旁证 | 强 |
| 5 | 分叉预检（check_diverge） | **import 复用 `_preflight_bare_sync` 零复制**（单点真源防两处分叉·P1 改点 A 正身）+异常同拦语义——与本席自施工面衔接面干净（preflight 只消费不复制） | 强 |
| 6 | 退出码优先序 | 分叉拦(exit 3)优先于断言族(exit 2)——「3 比 2 更 actionable」注释面与实现一致 | 强 |

**自施工面验收锚对表**（P1 三锚·终验四查 APPROVE 独立抽验非自报）：

| 锚 | 稿面（cto-phase1-tech-plan §六） | 自施工面现态 | 收口点 |
|---|---|---|---|
| ① run id 三处同串 | manifest/commit message/run 目录名 | vA1/vB payload 铸形第一动作实装（cmd_len 1741·md5 4f990e911c3f） | 生产面=11-15 首拍（STE 判据 C） |
| ② preflight 注入拦截 | DEM-009 同款·告警达 COS | 单测 21/22 案族绿（preflight 22/22+qualify 回归）·拦截轮 trap→notify 实装形 | 生产面=首拍（STE 判据 D） |
| ③ 告警时效 ≤30min | CPO-011 ≤2h 同值同源 | alarm N 值表四参数+SMTP 端到端 SENT ok | 生产面=首拍（STE 判据 F） |
| ④ 零外溢 byte 级同形 | W 目录/carry-over/commit 形 | P1 毕报 §三 18 单测族+终验抽验 | 生产面=首拍后 carry_over 段读数（CTO 裁定③挂起） |
| ⑤ F5 store 真值面 | healthz storePath/logPath 直读 | resolveStorePath 投影导出（agent-core）+deploy 卷 §二.9 读数 | **已实锚收口**（STE §一确认·本席无异议） |

**γ 二道闸白盒读数**（weekly_plane_shift.py L424-434·12 行）：`date.fromisoformat(start_date).isocalendar()[1]` 重算 toWeek 与 args.to_week 对表——错周双保险第二道成立；**注**：主闸重算基于「今天」、二道闸重算基于「start_date 参数」——两面同源（start_date=周一则 ISO 周号恒定）·语义自洽无分叉。

**阶段 1 回审结论**：**技术角度通过·零阻塞**。白盒观察项一项（非阻塞）：preflight `--expected-host` 默认值硬编码河源机名常数（iZf8ziw57ydktu77fsld9yZ）——env 覆盖位可覆盖故非缺陷，但**机名常数入代码面=跨机部署隐含耦合**，DCE 段（阶段 4）统一自愈标准设计窗顺手注记（若 TriCompany 检出被复制到非河源机跑 preflight，默认值即拦——fail-closed 方向安全·知情即可）。

### 阶段 2（Agent qualify·vB）

**白盒读数**（qualify.py 240 行·bf3c954 逐行读毕）：

| # | 断言件 | 白盒判读 | 强度 |
|---|---|---|---|
| 1 | 执行身份（check_identity） | getpass 保守 import（奇异宿主降级拦非炸）+env 覆盖+dev escape——与 preflight hostname 同族形制 | 强 |
| 2 | run dir 可写（check_run_dir） | mkdir(parents,exist_ok)+probe 写删三步全 try——哑卷防线成立 | 强 |
| 3 | git 身份（check_git_identity） | name+email 双 nonempty·值面零回显（bool 面 D-46）·timeout 15s | 强 |
| 4 | 告警凭据（check_alert_credentials） | config>NOTIFY_SMTP_*>WEEKLY_SHIFT_SMTP_* 三级 precedence 与 notify.py 同源+坏 json 兜底+`_has` strip 空白防"空格值"假阳性——静默死家族的资格前验，设计价值最高点 | 强 |
| 5 | 磁盘余量（check_disk_free） | shutil.disk_usage+env 覆盖阈值（58x 富余实锚 29089MB） | 强 |

**白盒观察项两项**（均非阻塞·如实注）：
1. **断言 3 与 payload L24 内联身份=两层防线非同一面**：qualify 断言 3 验 repo git 身份在位，但 payload vB L24 commit 行带 `-c user.name="TriRMC-Scheduler" -c user.email="trirmc@tri.company"` 内联兜底——即使 repo 零身份 commit 也能成。**判读：非缺陷=纵深设计**（断言 3 真实价值=属主错位前兆信号[git 身份缺失与 dubious ownership 同源]+pull 段活性保障；commit 段成败由内联兜底独立保障）——回审在案知情·不动作。
2. **qualify 退出码族只有 0/2**（preflight 有 3=分叉拦语义）——资格面全本地静态可验无分叉语义·与设计稿 §二退出码表一致——非缺口，DCE 段扩展退出码表时（CPO 对接点③）注意两模块语义族对表即可。

**payload vB 文稿白盒**（payload-vB-draft.sh 24 行）：trap EXIT 兜底链（shift_notify_fail --chain-exit）→RUN_ID 铸形第一动作→preflight RC guard（`|| RC=$?` 显式捕·vA1 教训正形）→manifest 主行→**qualify 单插**（拦截轮 manifest 含主行+qualify_exit 行·审计面完整）→pull||true→迁移器 tee→commit+push 带回退 merge。骨架五要点全在——与毕报 v2 §三部署读数（cmd_len=1741=1539+202 qualify 行·md5 双面同串）对表吻合。

**阶段 2 回审结论**：**技术角度通过·零阻塞**。三勘偏（连字符/假阴性/字典序劫持）白盒复核成立——勘偏③ mtime 序勘修（e408da5 probeArrivalFace）与命名陷阱单测案=STE 锚族六原则第 4 条（妆容劫持防族规）的实证底座·本席赞成立法。

### 回审总判定

**两阶段技术角度回审：通过·零阻塞**——生产面收口点全如实挂账候 11-15 首拍（锚 1/2/3 生产面收口·不虚标单测绿=验收毕·STE 锚族原则 2 遵行）。白盒观察项三项全非阻塞（机名常数耦合/断言 3 两层防线/退出码族对表注记）——登记入 §四 技术债与风险。

## §二 · 阶段 3（plan skill）技术方案协作稿（FSD 主笔件）

### §二.1 形态终裁建议（候 CTO 架构裁）

`TriCompany/runtime/cognition/plan_scope.py` **独立薄模块**（照 preflight/qualify 先例形同族）：

- 与 preflight/qualify 边界=**业务面切片**：preflight 判「该不该跑」（触发侧）·qualify 判「有没有资格跑」（执行环境侧）·plan 判「迁什么不迁什么」（业务范围侧）——三段零重叠探针零复检（单点探针纪律同 P2 §一）
- stdlib only 零新依赖（同族纪律）·退出码 0/2 同族·JSON 单份落卷同族

### §二.2 分类判据（机械可判·从现役迁移器语义反推）

现役迁移器三段（migrate_weekly_plane/shift_carry_over/review_shift）已承载「迁」的动作——plan skill 价值=**迁移前清单预审**（先枚举判定候审·DCE 照单执行·verify 照单对表）。三分类判据（周平面 `trees/` 目录级扫描·机械规则先行）：

| 分类 | 机械判据（预演形 v1） | 语义锚 |
|---|---|---|
| **migrate**（迁·活随人带走） | 树内含在途标记：open 工单未拾取/authorization.json 未过期未 close/树尾注记含「候」「在途」「挂起」族 | CPO 语义锚「这一周的活」 |
| **keep**（不迁·记录随周封存） | 树全节点 close/销账终态（tick 日志族/patrol 巡检族/已毕报且无 open 项）——且无任何在途标记 | CPO 语义锚「这一周的记录」 |
| **carry_over**（平移+状态去向） | unresolved-items.md §1 表 CARRY 行（正则 `CARRY-\d+` 同现役 shift_carry_over L103 形）——每行带状态去向字段（候 CEO 裁决/推进/冻结/关闭+计数 Nw→(N+1)w bump 语义照现役） | CPO 三标准之三+现役 carry 语义 |

**判据边界如实注**：预演形 v1=机械规则分类（文件名/标记词正则面）——「候/在途」词面判据有误分类残余风险（误判方向=该迁的没迁→verify 对表可捕+carry_over 面兜底·漏报毒于误报方向下误分类可接受度高于静默漏扫）。生产形（CPO §二第三栏）=agent qualify 互动候审+不迁判据逐行注明——候首拍后节奏窗·不虚标。

### §二.3 plan.json schema（STE 锚① schema 断言+CPO 对接点②命名族）

```json
{
  "plan_version": "1.0.0",
  "run_id": "shift-W46-20261115T155000Z",
  "from_week": "W46", "to_week": "W47",
  "migrate":    [{"tree": "fade001-ten-stage-review", "reason_codes": ["open_items", "authorization_active"]}],
  "keep":       [{"tree": "bod-tick", "reason_codes": ["all_closed"]}],
  "carry_over": [{"carry_id": "CARRY-042", "item": "...", "status_to": "pending_ceo", "counter": "3w→4w"}],
  "counts": {"migrate": 1, "keep": 5, "carry_over": 2},
  "bidirectional_ok": true,
  "check_time": "2026-11-15T15:50:05+00:00"
}
```

- 落卷位=`$RUN_DIR/plan.json`（CPO 对接点②命名族 plan.json/verify.json/score.json/close.json 对表——qualify.json/arrival.json 已在役）
- `reason_codes`=**不迁清单带判据**（CPO 三标准之二·每树注 keep 理由码——预演形=码面·生产形=逐行注明）

### §二.4 双向枚举断言（STE 锚②·CPO 三标准之一）

- 扫描 `{operating_root}/{from_week}/trees/` 全目录枚举全集 S；分类产出 M∪K∪C
- 断言：**M∪K∪C = S（零遗漏）∧ M∩K = ∅ ∧ M∩C = ∅ ∧ K∩C = ∅（零重叠）**——任一违断言 exit 2 拦+plan.json 带违断言读数落卷（不造替身清单）
- 断言读数进 plan.json（`bidirectional_ok` 字段+违例明细）——verify 段（阶段 5）消费面

### §二.5 替身禁令（STE 锚⑤·S51 先例）

- 扫描异常/目录不可读/分类器 crash=**exit 2 FAIL-EXPECTED**——plan.json 落 verdict=fail+异常读数·**禁造替身清单**（空 keep 全集形=最毒替身——双向断言会假绿，故 fail 态直接拦 DCE 接棒）
- plan skill 不可达在 payload 链=RC guard 拦（同 qualify 形·`|| { RC=$?; …; exit $RC; }`）

### §二.6 γ 二道闸与 verify 衔接（阶段 5 咬合·STE 锚④）

- 阶段 5 verify 对表锚=**plan.migrate[] vs 实迁 diff**：清单内树未迁=漏（exit 非零）/清单外新增迁入=幽灵（exit 非零）——γ 二道闸（toWeek 对表）+清单对表双闸并行
- 接口预留：verify 模块读 `$RUN_DIR/plan.json` 为对表基准——**今晚实现面只落 plan 侧·verify 侧接口预留签名**（阶段 5 施工对象·不抢段）

### §二.8 实盘勘定修正注（17:48 只读实勘·编码前必修面·修正 §二.2 初版）

实勘对象：W46/W45 trees/ 目录+OP index+unresolved-items 实形（全部只读）——**四发现修正判据**：

1. **全集必须落文件系统实盘·index 只作旁证层**：W46 OP index 实值=activeTrees **0**/doneTreesThisWeek **0**/doneTreesFromPreviousWeek 65——vs 实盘 trees/ 20+ 在途目录（fade001-ten-stage-review 等本日在途树）——**index 与实盘脱节是现势常态**。plan_scope 若只读 index 清单=假全集·双向断言空转。修正：全集 S=`{from_week}/trees/` 全条目（目录+散文件两类——W46 trees/ 实盘 20+ 目录+5 散文件 .md 混装）；OP index 差异读数进 plan.json `index_drift` 字段（如实注记非分类基准）。
2. **迁移动作域澄清（对表现役迁移器）**：`migrate_weekly_plane`（weekly_plane.py L231-311 白盒读毕）动作域=**OP index 元数据层**（doneTreesThisWeek→to 周 doneTreesFromPreviousWeek 清单并入+源周 retire status=closed）——**文件系统树本体零移动**（原地封存=「记录随周封存」现役语义承载）。plan_scope「migrate」判定=清单候选面：预演形只产清单候审零动手；生产形=清单驱动 index 元数据层搬家（域不变·防 plan_scope 设计越域去动文件目录）。
3. **CARRY id 两形**：实盘 unresolved-items §1 现役区行=`CARRY-20260728-004` **日期形**——现役 weekly_plane_shift.py L103 `_CARRY_ID_RE=r"CARRY-\d+"`。**〔勘正 2026-11-13 17:56·CTO 裁决④ 9ab8419fc：缺陷候选定性不成立·实勘驳回〕**——识别面零漏：L107 用 `.search()` 子串匹配，日期形被 `CARRY-20260728` 前缀命中识别通过；bump 本体走 `_WEEK_CELL_RE` 与 id 形态正交；实盘 blast path 首拍 W46→W47 bump 面两形全覆盖零漏行。**本席初判误因=白盒引用只读正则字面未读使用面**（match/search 语义差）——方法论教训如实入档。plan_scope 判据面显式双形正则保留（`CARRY-\d{8}-\d+|CARRY-\d+`·清单计数精度面非缺陷修复面·CTO 采纳面确认）。
4. **tree-op.json 非普适**：bod-tick/fade001-ten-stage-review 实勘=树内零 tree-op.json（纯卷文件族）——分类判据 degrade 链：tree-op.json status（若有）→树内标记面（authorization.json expiry/open 工单残留/卷名 in-flight 词面）→**默认 keep（保守方向·漏迁毒于误封存——verify 对表+carry_over 面双兜底）**；散文件（.md 单件）默认 keep 原地封存。

**修正后 §二.2 判据表以本节为准**（初版「扫 trees/ 全目录做迁移判定」词面作废——动作域与全集定义以本节实锚为准）。

### §二.7 调用形与 payload 接入点（候部署窗·今晚零生产触）

```bash
# payload vC 形接入点（预演·部署候首拍后窗·裁决 A 现役 vB 保持）
python3 -m runtime.cognition.plan_scope --from-week {fromWeek} --to-week {toWeek} \
  --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records \
  --run-dir "$RUN_DIR" >"$RUN_DIR/plan.json" 2>&1 \
  || { RC=$?; printf '{"run_id":"%s","plan_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"; exit $RC; }
```

- 插序=qualify 过后·migrate 接棒前（FADE 三段序：触发闸→资格闸→范围闸→执行本体）
- **单测随 TriCompany 测试纪律面**：注入式案族（目录不可读/schema 毒化/双向违断言双向案/替身禁令负路径案[STE 锚⑤三向：NOT_FOUND/FAIL/结构门非橡皮图章]+CARRY 计数 bump 边界案+跨年 wrap 树名案）——**runner 形态=glob 文件形基准**（STE 锚族原则 5·毕报必声明）

## §三 · 阶段 4-10 逐段实现路线框架（FSD 面框架·每段施工候令候批）

| 段 | 对象 | 承载（落点） | 接口/产出 | 退出码 | 依赖序 | 工作量级 |
|---|---|---|---|---|---|---|
| 4 DCE | 确定执行本体：bash 交棒后段序骨架（pull→迁移器→commit→push 分段落卷） | weekly_plane_shift.py 段化+payload vC | 各段读数落 `$RUN_DIR/dce-*.json` 段卷族 | 段级 RC 捕获族 | 阶段 3 plan 过=照单执行 | 0.5-1 天 |
| 5 verify cli | 迁完验迁对：toWeek 断言+新周 index active+**对表 plan.migrate[]**（§二.6 双闸） | verify.py 新薄模块（γ 二道闸归位迁移器外） | `$RUN_DIR/verify.json` | 0/2（对表败=2） | plan.json 在卷 | 0.5 天 |
| 6 score cli | 跑完有分：score 序骨架（评分产物落 run dir·读数可查） | score_cli.py 薄模块（score_engine 接口预留·实弹候 J5-J7 灰度） | `$RUN_DIR/score.json` | 0/2 | verify 过 | 0.5 天 |
| 7 score skill | 考卷=机械判官：卷面骨架在位 | 考卷面（件⑥改卷制域·T1 三断言扩形注记随写·CPO 对接点④） | 卷面版本一跳 | —（考卷面非 cli） | 阶段 1-3 锚落定 | 考卷域 0.5 天 |
| 8 close skill | 复盘自动发生：升级清单提取（非空判定+路由分级字段） | close_skill.py 薄模块（读 shift.log+review_shift 输出提取） | `$RUN_DIR/close.json`（升级清单+路由分级字段） | 0/2 | score 毕 | 0.5 天 |
| 9 close cli | 每个 run 有终点：run id 终态落卷（ok/failed/stale 三态·FADE-012 适配语义） | manifest.json 终态段补写（`final_status` 字段·零新文件） | manifest 终态面 | 0 | 全段毕 | 0.25 天 |
| 10 结论与动作 | 结论到达人：成功/失败双向 notify 路由+ζ 闭合+F 系销项对表 | 复用 P1 notify 链（_resolve_notify_to/_notify_blocking 现役函数族）+shift_notify_fail 对称形 shift_notify_done | notify 记录落卷 | 复用现役 4 语义 | close 毕 | 0.5 天 |

**CPO 对接点③·段×退出码→告警级→收件人映射表**（技术面初版·候 CTO/CTO-COS 裁）：

| 段 | exit | 语义 | 告警级 | 收件人 | 承载 |
|---|---|---|---|---|---|
| 全段 | 0 | 成功 | 成功通知（信息级） | COS（+CEO 知情面候裁·ζ 定性候生产形） | 阶段 10 notify_done |
| 1 preflight | 2/3 | 断言拦/分叉拦 | blocking（P1 现役） | COS+CEO 双址 | trap→shift_notify_fail（在役） |
| 2 qualify | 2 | 资格拦 | blocking | 同上（在役） | 同上 |
| 3 plan | 2 | 范围拦（双向断言违/扫描败） | blocking | 同上 | 同上（manifest plan_exit 行） |
| 4 DCE | 段级 RC | 迁移败 | blocking | 同上 | tee+trap 在役 |
| 5 verify | 2 | 对表败（漏迁/幽灵迁） | blocking（**错周静默双闸升级面**） | 同上 | verify.json+trap |
| 6 score | 2 | 评分败 | 非阻塞告警（评分败≠迁移败·不拦终态） | COS 单址 | 候裁 |
| 8 close | 2 | 提取败 | 非阻塞告警 | COS 单址 | 候裁 |
| 10 notify | 4 | 通知败（现役语义） | 升 4 优先 | —（自身败面·patrol 兜底 G3） | 现役在役 |

**实现序建议**（今晚 21:00 实现面窗内·候 COO 拆树派工）：plan_scope.py（§二 全件+单测）→verify.py 骨架（对表逻辑+γ 归位）→close_skill.py 骨架→score_cli.py 骨架→manifest 终态段→notify_done 对称形——**每段落仓落绿即预演形验收锚（裁决 B·每段产物落卷即验）**·生产面零触（裁决 A）。

## §四 · 技术债与风险（识别即标记·不隐藏）

| # | 级 | 项 | 偿还计划 |
|---|---|---|---|
| 1 | 低息 | preflight 机名常数入代码面（§一观察项·跨机部署隐含耦合·fail-closed 方向安全） | DCE 段统一自愈标准设计窗顺手注记 |
| 2 | 知情 | qualify 断言 3 与 payload L24 内联身份两层防线（§一观察项·纵深设计非缺陷） | 零动作·回审在案 |
| 3 | 低息 | plan 分类判据词面残余误分类风险（§二.2 如实注） | verify 对表可捕+carry_over 兜底·生产形候审互动消解 |
| 4 | 知情 | 妆容 run dir 双 W 债（`shift-W{fromWeek}-*` 字面量族·毕报 v2 §五在案） | DCE 段顺手窗（CTO 毕报已挂账·本席随段执行面承接） |
| 5 | 候裁 | score/close 非阻塞告警级承载位（§三映射表两行候裁） | CTO 裁后落形 |

## §五 · 自测门禁声明（实现面形态）

- 今晚实现面=**落仓落绿**（plan_scope.py+单测族·379/389 门全量回归既有失败逐族归因照 P1 纪律）——**未自测不标 ready-for-review**（本席门禁纪律）
- 生产面（payload vC 改形/河源部署）=**零触**——候首拍后窗或 CEO 明示解冻（裁决 A·现役 vB 1741/4f990e911c3f 冻结链保持）
- 预演形最小判据（裁决 B）：每段产物落卷即验+双向断言过+替身禁令负路径绿——不追生产判据不虚标（CPO §五风险 1 缓解建议遵行）

## §六 · 使用依据

- 令链：CEO 17:26 大会组织令（COS 17:33 转达·台账 529 笔）+COS 裁决 A/B（17:39·台账 532 笔）
- CPO 主稿 fe792b616（§四对接点五件·本稿 §二.3/§三映射表逐条对表）+STE 回审卷 d14f3f527（锚草案五条/锚族六原则/判据八族·本稿 §二.4/§二.5/§五对表）
- 白盒读源：TriCompany preflight.py 281 行（64e71d9）/qualify.py 240 行（bf3c954）/weekly_plane_shift.py γ 二道闸 L424-434+carry 正则 L103+main 步序 L346-471/payload-vB-draft.sh 24 行（0bd373e9f）
- 自施工面：P1 改点 A/B（b67a19a939/1f3b997·终验 a8af43624）+毕报卷 ff0cdb0a2+勘读数卷 0e43a4dbf/55cfbe7aa
- 底图：十阶段映射卷 fade001-ten-stage-mapping-20261112.md+CTO phase1/phase2 两稿+毕报 v2（cto-phase2-build-closeout）

—— FSD 小全（m-fsd·技术协作稿），写前现查 2026-11-13T09:42:13Z=17:42:13+08 原值（D-47 正形·卷面时戳锚=commit %cI）
