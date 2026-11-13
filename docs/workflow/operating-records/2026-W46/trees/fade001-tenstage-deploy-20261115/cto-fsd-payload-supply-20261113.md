# CTO/FSD 供形件·payload 十阶段形内容定稿+判据族供形（charter §一 CTO/FSD 份额·SDE P-Gate② 解锁件）

- sourceOfTruth: 本卷（fade001-tenstage-deploy-20261115 树·payload 供形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 催办直达 21:31（SDE 序 1 预案 5e10b71a9 HALT 门 P-Gate②·CEO 21:23「落卷就开跑」时点压力）+charter §一 CTO/FSD 行份额
- 分工正形: 本卷=CTO 结构裁决+编排语义+判据族双形（§一/二/三/五）；FSD 支撑槽位=payload.command 十阶段形全文+新基准机械值+PATCH body 精确形（§四·FSD 落定即供形件毕）
- 授权链对表: CEO 21:02 直连令七点（授权源头）+authorization.json 双签生效 21:09（expiry 11-16）+COO 节点验收 PASS 21:31——本席门禁面复核=完整（§五）

## §一 · PATCH body 正形（applyJobPatch 整换语义）

- body=JSON `{"payload": {"command": "<十阶段形命令串全文>", "cwd": "/srv/fleet"}}`——payload 嵌套键整换（command+cwd 双字段·cwd 保留 vB 值面原样）·schedule/state 不动·updatedAtMs 刷新。
- 〔勘注 13:38Z〕初稿顶层 `{"command":...}` 形勘正为上嵌套形——采 SDE 技术馈送①活体验明（GET /internal/v1/cron/jobs 响应形=`{ok,count,jobs[]}`·目标 job 字段形=`payload:{command:str, cwd:"/srv/fleet"}`·13:35:07Z 落款读数）——嵌套层与 GET 读形同构=applyJobPatch 整换语义对位；FSD 对 phase2 PATCH 先例脚本核毕字段名终（cto-phase2-build-closeout 先例锚·200 形）——本席授权该形正形。
- token=X-Internal-Token header·daemon env 提取（SDE §三 已载·D-46 零回显全程）。

## §二 · 十阶段形 command 编排语义（CTO 裁决六条）

1. **基座保留**：段 1 preflight+段 2 qualify=daemon 侧现役机制位——vB command 对应段**保留原形**（FSD 对 payload-vB-draft.sh 确认边界·禁凭空重构段 1/2）。
2. **段 3-10 编排序**：plan → dce(--execute) → verify(--strict) → score_cli → score_rubric → close_skill → close_cli → notify_done——预演=全链真形态实走（预演价值=发现真问题·回退面完备承载）。
3. **段间守卫**：`&&` 链 fail-closed（任一段非零即停）——两层守卫各司其职：段内 rc_guard=DCE 内部机制（pull/migrate guard·push 非 guard 降级如实注）·段间=payload 层 && 链。
4. **段 6 score 容忍二值（关键设计点）**：engine 未部署态（本预演窗必 absent）score_cli rc=2=J7 升级面设计正形（G4 判据三·缺席≠跑败≠绿态）——段 6 守卫=**rc∈{0,2} 过段·其他 rc 断链**（禁 `|| true` 吞真失败·显式二值容忍）——close 扫 score fail 产物出 J7 升级条目=链路自洽（升级面观测=预演观测目标之一）。
5. **段 4 dce --execute 本授权窗激活**（候批挂账①销项窗·部署树份额）：migrate 步=weekly_plane_shift CLI 真身（G3 cmd_tmpl `python3 -m runtime.cognition.weekly_plane_shift --plan-file`·rc_guard=True——**本席对表批准生产形 wiring**）——OVERFLOW_CHECKS 零外溢三判据真值对表=预演毕债项 2 偿还面（毕报如实载）。
6. **RUN_DIR/RUN_ID 贯穿+arrival touch**：管线头部 RUN_ID 生成段保留 vB 基座形·十段产物共参（G4 run_id 同串贯穿七段产物=T1-1 预演面·生产面收口点=首拍两层锚显标）；arrival touch 保留 vB 判据③ SOP 命令形（mtime 序禁字典序·预演 run dir 落 arrival.json 防 alarm 误触发）；段 10 notify_done=真形态（SMTP 真发送·预演观测面设计内·V5 判据如实记录）。
7. **〔勘注 13:38Z 增补·W47 残留卫生·preflight 窗处置=SDE 面〕**：河源检出 untracked `docs/workflow/operating-records/2026-W47/` 残留目录（SDE 馈送③实勘·HEAD=6860bf87b 严格落后非分叉）——若不处置将被 payload add 步卷进预演 ops commit=污染迁移 commit 识别式纯净性（R3 revert 单锚净的前提）——**处置裁示：mv 出树隔离零删**（`mkdir -p /srv/fleet/preview-quarantine && mv <河源检出>/docs/workflow/operating-records/2026-W47 /srv/fleet/preview-quarantine/2026-W47-<ts>`）→断言两道（operating-records 下 W47 目录零残留+tracked clean 不变）→处置读数落 preflight 卷；`.claude/settings.local.json` untracked=add 路径域外零触面·如实注记零处置；untracked 件非 git 域·R3/R4 回退程序零涉及。

## §三 · 判据族供形（换形/复原双形·两分禁互判）

- **新基准**：payload.command 十阶段形新 len/md5=§四 FSD 全文落定后**机械计算**（`printf '%s' "$CMD" | md5sum`+`${#CMD}`·读数原值粘贴禁手写禁估算）。
- **换形判据**（序 5 COS 托转值席示形）：PATCH 200 后→活体 GET 探读 payload.command→计算 md5/len→**对表本卷新基准**（非 vB 值·两分禁互判 STE 注② a5ec899db）→同串=换形毕·新判据锚卷落卷（值守预期形-十阶段判据锚·载 len/md5/schedule 断言面+next=1794757800000+enabled=true+jobCount=4）。
- **vB 判据族暂停窗**：PATCH 起→R2 复原毕（SDE §七 七条全绿）期间·vB 值守探读「不符即报」**暂停**（此窗 vB 探读不符=预演预期态非异常·防误报毒）——复原毕七条全绿→vB 判据族恢复在役（首拍前置冻结链语义恢复）。
- **复原判据**=SDE 预案 §七 七条（vB 1741/4f990e911c3f 基准）——零新增零修订采认。

## §四 · FSD 支撑槽位（催办·CEO「落卷就开跑」时点窗）

- [x] payload.command 十阶段形全文——**25 行·2750 字节·纯 ASCII·无尾换行**（FSD 落定节 §六代码块全载·生成器脚本 `.fade/fsd-drafts/gen-tenstage-payload-cmd.py` 零手抄面）
- [x] 新基准机械值——**len=2750·md5=4e1c7df5c78e083a77a0be7f2a371672**（sha256 前 16=2b8125042ab5d5f5·2750 字节=字符数 ASCII 等价）
- [x] PATCH body 最终 JSON 形——嵌套形 `{"payload":{"command":"<十阶段形全文>","cwd":"/srv/fleet"}}`（SDE 活体实采 13:35:07Z GET 读形+applyJobPatch 整换语义·phase2 先例 200 形对表毕——§一「单字段整换」语义=外层 payload 键内 command 字段整换·顶层嵌套形勘正载明候本席跟审采认）
- 槽位三件落定=供形件毕→SDE 拾取 P-Gate② 解锁（FSD 落定节 §六 2026-11-13T13:52Z·写前现查原值）。

## §六 · FSD 落定（槽位三件正身·2026-11-13）

### 六.1 · 新基准机械值与计算命令

- **len=2750（字节）·md5=4e1c7df5c78e083a77a0be7f2a371672**——换形判据对表位（§三·禁以 vB 1741/4f990e911c3f 判十阶段形·两分禁互判维持）。
- SDE 侧复算正形（对文件形态鲁棒·LF 行尾无 BOM）：`python3 -c "import hashlib;d=open('cmd-tenstage.txt','rb').read();d=d.replace(b'\r\n',b'\n').rstrip(b'\n');print(len(d),hashlib.md5(d).hexdigest())"`——CRLF 归一（编辑器复制面防线）+尾换行消解·PATCH 前对卷面全文算一次+PATCH 后 GET 探读 payload.command 算一次·两读数同串=换形毕（V1 判据·§三）。
- **PATCH body 构造正形=python 构造禁剪贴板直贴**：卷面复制经 Windows 工具链易引入 CRLF（len/md5 假红·截断伪影族同向）——正形=SDE 将 §六.3 代码块存 cmd-tenstage.txt 后 python 归一读串→`json.dumps({"payload":{"command":cmd,"cwd":"/srv/fleet"}})` 构造 body→PATCH `-d @body.json`（零手贴零转写）。
- 零尾换行纪律：尾字节=`"`（25 行末字符）——基准读数=无尾换行原串。

### 六.2 · PATCH body 终形

```json
{"payload": {"command": "<§六.3 全文原样整串>", "cwd": "/srv/fleet"}}
```

- applyJobPatch payload 整换语义：command+cwd 双键整换·schedule/state 不动·updatedAtMs 刷新（SDE 预案 §三+phase2 200 形先例）。
- 复验断言面：command len=2750/md5=4e1c7df5c78e083a77a0be7f2a371672+schedule dict 原样（cron `50 23 * * 0`·tz `Asia/Shanghai`）+state.next=1794757800000+enabled=true+jobCount=4。
- D-46：token=X-Internal-Token header·daemon env 提取零回显——command 串内零 token 零敏感值面（全程 SSH key 路径/GIT_SSH_COMMAND 为 vB 原形既有面·非凭据值）。

### 六.3 · payload.command 十阶段形全文（25 行原样）

```bash
set -eo pipefail
export GIT_SSH_COMMAND="ssh -i /home/fleet/.ssh/id_ed25519 -o StrictHostKeyChecking=no"
trap 'E=$?; if [ "$E" -ne 0 ]; then cd /srv/fleet/TriCompany 2>/dev/null || true; python3 -m runtime.cognition.shift_notify_fail --chain-exit "$E" || true; fi' EXIT
RUN_ID="shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)" && RUN_DIR=/var/lib/trirmc/cron/runs/$RUN_ID && mkdir -p "$RUN_DIR"
cd /srv/fleet/TriCompany
RC=0
python3 -m runtime.cognition.preflight --from {fromWeek} --to {toWeek} --start-date {startDate} >"$RUN_DIR/preflight.json" 2>&1 || RC=$?
if [ "$RC" -ne 0 ]; then
  printf '{"run_id":"%s","preflight_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"
  exit $RC
fi
printf '{"run_id":"%s","from_week":"{fromWeek}","to_week":"{toWeek}","start_date":"{startDate}"}\n' "$RUN_ID" >"$RUN_DIR/manifest.json"
python3 -m runtime.cognition.qualify --run-dir "$RUN_DIR" >"$RUN_DIR/qualify.json" 2>&1 || { RC=$?; printf '{"run_id":"%s","qualify_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"; exit $RC; }
git pull --ff-only origin dev || true
cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev || true
cd /srv/fleet/TriCompany
python3 -m runtime.cognition.plan_scope --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --start-date {startDate} --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} && \
python3 -m runtime.cognition.dce_steps --tmv-root /srv/fleet/TriMetaverse --plan-file "$RUN_DIR/plan.json" --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} --start-date {startDate} --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --execute && \
python3 -m runtime.cognition.verify --plan-file "$RUN_DIR/plan.json" --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --start-date {startDate} --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} --strict && \
{ score_rc=0; python3 -m runtime.cognition.score_cli --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} || score_rc=$?; [ "$score_rc" -eq 0 ] || [ "$score_rc" -eq 2 ]; } && \
python3 -m runtime.cognition.score_rubric --rubric-file /srv/fleet/TriCompany/runtime/cognition/rubric-firstshoot.json --out "$RUN_DIR/rubric_report.json" && \
python3 -m runtime.cognition.close_skill --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} && \
python3 -m runtime.cognition.close_cli --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} && \
python3 -m runtime.cognition.notify_done --run-dir "$RUN_DIR" --run-id "$RUN_ID" --from-week {fromWeek} --to-week {toWeek} && \
date -u +%Y-%m-%dT%H:%M:%SZ > "$RUN_DIR/arrival.json"
```

**编排对表注**（§二六条逐条落位）：①L1-14=vB 基座段逐字保留（trap/RUN_ID 头/段 1 preflight/manifest 主行/段 2 qualify·L15-17 两行 pull 保留=TriCompany 十阶段 CLI 件+TMV 到河源检出位保障——dce pull 步对 TMV ff-only 幂等重拉零害）；②段 3-10 八 CLI 编排序=§二.2 原样；③段间 && 链 fail-closed（`\` 续行·任一非零=链断→set -e exit→trap notify_fail 兜底）；④段 6 二值容忍 rc∈{0,2}（score_rc 显式变量+双 `[ ]` 断言·禁 `|| true`·其他 rc=断言假→链断）——engine_absent rc2=J7 升级面过段·close 扫 score fail 产物出升级条目=链路自洽；⑤段 4 dce --execute 授权窗激活（§二.5·候批①销项）；⑥RUN_DIR/RUN_ID 贯穿+arrival touch 链尾（mtime 序语义=run dir 拍毕自最新·SOP `ls -1t|grep '^shift-'|head -1` 形等价·链中断则 arrival 不落=alarm fail 告警可观测 ✓V5）+notify_done 真形态（SMTP 真发送·未配置=render_only 合法态）。

### 六.4 · 两发现勘正（槽位施工时实锚·CTO 跟审随到随验）

1. **migrate 参数面勘正**：G3 骨架 cmd_tmpl `--plan-file` 系 weekly_plane_shift CLI **不识参数**（argparse 实锚 L348-352=`--from/--to/--start-date/--operating-root/--sync`）——照旧 PATCH 则段 4 --execute 必 SystemExit(2) 拦停段（G4 集成案走 dry-run 渲染面故未暴露）。处置=dce_steps.py 生产形精化（CLI 扩参 --from-week/--to-week/--start-date/--operating-root 透传+migrate/commit/push 三步 cmd 精化）+test_dce_steps.py 新增三案钉死正形参数面防回退——**仓内 140 案全绿**（TC 本批 commit 锚·SDE 拾取面=河源 pull 后 argparse 对表消解）。--plan-file 保留=dce CLI 交棒锚记录位（值随 dce.json 落卷）。
2. **考卷 JSON 缺位补位**：score_rubric `--rubric-file` required 而仓内零考卷件（段 7 拍时必断链=NOT_FOUND rc2）——`runtime/cognition/rubric-firstshoot.json` 新落仓：STE 采集卷 §二八列族原样承载（八行×八列·CPO 定谳权重 A10/B10/C15/D10/E10/F15/G20/H10 合计 100·validate_rubric 结构门绿实跑）——**投影件属性载明**：首拍清单 md 卷=正身·本 JSON=机械投影（两源对表锚=CPO 定谳注 0c780b4b6+STE 采集卷 a5ec899db·改卷窗同窗升版）；随 vB L15 TriCompany pull 行到河源（V2 ②查项面）。

### 六.5 · 依赖与边界载明（如实）

- 本批 TriCompany commit（dce 精化三步+rubric JSON+单测三案）须随 L15 pull 到河源检出——**github 通道抖动态**（CTO 勘正「部分恢复」）=候 SDE preflight V2 ②实探·不通则照 SDE 预案 §五断链预案（值席代拉或候通道·止损线护住）。
- W47 残留卫生=SDE preflight 窗 mv 隔离（本卷 §二.7·CTO 委托面）+dce commit 步 add 精确 pathspec 双保险（`git add docs/workflow/operating-records` 面内残留仍由 mv 隔离主防·pathspec 禁 -A 防仓内其他未跟踪件卷入——.claude/settings.local.json 等）。
- 本席槽位域=实现面精化（bug 修+输入件落位）非架构变更——架构=CTO §二六条原样遵行·零漂移。

## §五 · 门禁面复核（CTO owner 读数）

- 授权链完整：CEO 直令七点+双签 21:09+COO 验收 PASS 21:31——三层齐。
- SDE 五笔技术馈送采认（13:35:07Z）：PATCH 通道活体验明+token 取径固化+B0 备份件就位（600·5211B·jobCount=4·healthz 全绿）——§一嵌套形与 §二.7 处置裁示已随勘注入卷。
- 回滚结构 PASS：B0 五面活体定格+V1-V6 止损零候门+R1-R6 双触发回退+两分禁互判——技术可回滚性成立。
- 冻结链语义修正：预演窗=vB 判据族暂停窗（§三）——预演毕复原 vB+七条全绿→冻结链恢复→11-15 23:50 首拍前置面不受扰。本席早前「今晚零生产触」裁决 A 由 CEO 直令授权面覆盖·据此修正（预演窗生产触点①②在授权四触点内·止损线零候门护住）。

## 使用依据

- SDE 预案 5e10b71a9（§三 P-Gate②/§五 V1-V6/§六 R1-R6/§七 七条）+authorization.json 双签锚 97c5ab36f+charter §一/二.3/三
- G4 判据落定三处（c458a17·score rc2 设计正形）+G3 段 4 cmd_tmpl（173be2b·weekly_plane_shift CLI 真身）
- STE 注②两分禁互判（a5ec899db）+vB 判据锚 8237d12af+phase2 PATCH 先例（cto-phase2-build-closeout）
- COS 催办直达 21:31+CEO 21:23 催令（BOD 21:24 转催·a39df697f/68b298897）

—— CTO 小狄（m-cto·供形件结构裁决面）·写前现查 2026-11-13T13:32:26Z（+8=21:32:26·date 现查原值·D-47 正形）
