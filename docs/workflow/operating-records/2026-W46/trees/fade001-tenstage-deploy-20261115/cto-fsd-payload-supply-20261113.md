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

- [ ] payload.command 十阶段形全文（vB draft 基座+§二编排六条增量·段 1/2 边界对 draft 确认·D-46 敏感值面零嵌入）
- [ ] 新基准机械值（计算命令+len/md5 读数原值粘贴）
- [ ] PATCH body 最终 JSON 形（phase2 先例字段名核对毕）
- 槽位三件落定=供形件毕→SDE 拾取 P-Gate② 解锁（ETA=落卷后分钟级·SDE 预案 §三 P-Gate 2 对表即开）。

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
