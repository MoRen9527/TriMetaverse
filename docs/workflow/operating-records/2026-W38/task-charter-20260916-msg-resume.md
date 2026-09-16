# 任务书 20260916-M-SG 复工（服务域积压批：B3/B4 放行 + 夜航次批服务域面）

- sourceOfTruth: 本件（BOD 铸，2026-09-16 03:0x 现查）；CEO 令（同刻）：「做好之后，让 M-SG 把活干起来，把没做完的任务书挂到服务域执行」
- face: **server-executable → M-SG**（值席/五席矩阵；M-004 直达派工+本平面留痕）
- PACE: P=本件 → A=已挂 W38 平面 → C=M-004 直达（m-duty-cos 派工）→ E=节点收口回写本文件
- **前置（顺序锁）**：①LG-036 收官（CTO 核文案落地后）②**配额重置 2026-09-16 20:44:33 之后**（现 sg 席位 429 挡，shell 级不受阻）③sg 仓拉取含本件 commit
- 边界：不动 R-HY 生产面；不动冻结面（W35/W37 记录、CEO 复合件）；**配额纪律照 LG-036**（错峰优先〔周一~五 14-18 之外=1/3 费率〕、批量≥80M 事前报备、账户级闸值 5h 19,600/25,200·周 98,000/126,000）

## 任务1：B3/B4 候批执行清单 6 组（**放行=本令**）

源=`2026-W37/trees/b3b4-joint-review-pilot/reports/bb2-summary.md` §五（程序位=审零改动，本批=执行）：
1. CLAUDE.md:60 定性修正（措辞两案见 §三-3）+ agents-md:22 同族联动——真源改+FADE-002 管线发布
2. AGENTS.md L74-76 agent_type 三处退役名→现役名——同 FADE-002 窗
3. CAO 治理真源方向三处追平——D-07 通道
4. 两席 contract paths 补 session_body 键——**与夜航01 次批③「2/13 contract schema 校准」同族，执行面合看判向**（CTO 已裁：2/13 不对称登记次批校准）
5. CAO memory:19 落点处置——CAO 域
6. 可选小修集（文案级，条目见 §五-6）

## 任务2：B4 扫尾批（~151 件，按域 sequential）

- 源=bb2-summary §六：source-agents 现势 169 件，首批 18 件后余 **~151 件按域 sequential**（批毕切账闸门制照晨报）；
- 形态照 B3/B4 打样批先例：五席联审（M-004 直达；spawn 仅三残留场景）；销账锚=树路径+收口报告。

## 任务3：夜航01 次批·服务域面两项

- ① **终点三条件之 sg 部分：tmux 全量重启轮**（junction 终点触发条件之一；重启须在配额恢复后——重启即载 compass 新手册链，须逐席 capture 验启动链读通）；
- ② **TC GitHub 面回流归账**（`b3a450d` 系：GitHub→M-SG merge 归账，照「拉取→merge 归账→重推」先例，冲突即停）。

## 任务4（**已闭幕**）：sg 侧组织缺口——COS 补位 + 全席补真身

- **裁决=补位**（CEO 2026-09-16 19:5x 令）。
- **执行记录·2026-09-16 20:0x**：实勘=13 席原为**裸启动**（无手册参数）；COS 单席先行补位 → 随即照 CEO 令**全席补真身**：13 席全部以 `claude -n m-duty-* --dangerously-skip-permissions --append-system-prompt-file /srv/fleet/TriMetaverse/.claude/compass/<席>.session.md` 重启（tmux 13 + 进程 13 双验 ✓）；-n 依 CEO 裁定用 `m-duty-*`（名址统一）；`--agent` 非 manifest 正身组成（本机 13 席同款无此参数，不加）。
- 过程如实：首例 COS `/exit` 时 tmux 会话随之关闭（席位=会话唯一窗口）→ 按标准式样重建，净结果=裸会话换真身。
- **附**：控制台后台数据落地（周额度 100% 已用满/不支持按键分账）；f_GLM=2.17 校准终值；CEO 政策（GLM 优先用满/deepseek 高峰+超额补足）；等=定——详见 CFO/COS 两件。

## 收口区

### 开工配置变更（BOD 执行·CEO 令）·2026-09-16 21:0x

- **缘由**：CEO 发现席位在用 GLM-5.3（贵档），令改 GLM-5.3-Flash 续跑。根因=两层打架：`duty-env` 本为 Flash，但 **settings.json 优先级更高**且写 `glm-5.3[1M]`（+三值混档）→ 实际生效=GLM-5.3。
- **执行**：走兜底端点（sg 本机 3333 `claude-fallback/restore`）写入——**9 键全族=GLM-5.3-Flash** + base_url/key 保持 + 备份件落（settings.json.bak-* 在卷）✓。
- **验证**：13 席重启载新配置 → 复派开工 → 转录面实测 **6 次调用全 `GLM-5.3-Flash`** ✓。
- **经济**：Flash 积分系数（2.3/0.56/8）≈ GLM-5.3（6.9/1.7/24）的 1/3——同等工作省 ~2/3 额度。
- 附注：`[1M]` 后缀未带（沿用本环境 Flash 类不带 1M 的惯例）；如需保留 1M 窗口，改 `GLM-5.3-Flash[1M]` 一条命令可复。

## 收口-任务1（2026-09-16T13:17:53Z＝21:17:53 +08 现查；执行席=COS 值席）

- **判定：六组全数核销——09-14 批令④⑤执行波已全部落地，本批复查零重复执行**。执行波收口=90089e5a（树 `2026-W38/trees/b3b4-exec-wave/`+BE-5 收口报告，2026-09-14 11:5x）。
- 逐组核销（本批复查=sg 真源现文实读）：
  1. 组1 CLAUDE.md:60+agents-md:22 → BE-1 落地；真源现文=CPO 终版措辞原文（中央摘要+宪章真源指针+附录归档尾注），TMV 发布面同文 ✓
  2. 组2 AGENTS.md L72-78 → BE-1 落地（初版 TriCompanyCEOChiefOfStaff）后经 09-15 夜航01 序③ 62d9c01 勘正为 CEOChiefOfStaff（copilot 按名绑定失配级）；现文退役名零命中 ✓
  3. 组3 CAO 治理真源三处 → BE-2 正源化；现文 memory+agent-body 均 TriCompany 首位+「TriMetaverse 同路径字节级副本」注记 ✓
  4. 组4 两席 paths 补 session_body → BE-2（CAO）+BE-3（CTO）落地；2/13 不对称残余经 CTO 2026-09-15 裁定**登记夜航01 次批③校准**（夜航01 终报遗留③在卷），本批零动作 ✓
  5. 组5 CAO memory:19 → BE-2 择「候初始化」标注案（目录未建，标注在卷）✓
  6. 组6 可选小修集 → BE-1 八+十处覆盖（Key documents 补 project.md/白皮书、括注泛化、MD022、Common Commands 路径两要素、:17/:25 降权注、:88 补路径、SOO 适用域注、:78 归属括注全、primary 发布拷贝口径、跨机现势注）✓
- 账实注记：本任务书铸于 09-16 03:0x，清单自 bb2-summary §五平移未核执行波现势（执行波收口在先）；按「台账即真源，账实不符先核事实再改账」转核销处理，非扩大解释。

## 收口-任务3（2026-09-16T13:17:53Z＝21:17:53 +08 现查；执行席=COS 值席）

- **①tmux 全量重启轮（夜航01 次批⑥ sg 部分）**：重启=BOD 侧已执行（13 席 tmux 20:59:30-44 新建+进程 13 双验，同任务4 形态载 compass 手册+GLM-5.3-Flash）；本批补两级验证——13/13 banner 面读通（CLI+模型+角色名实读）+12 席零动作探测 **12/12 应答**（9-32s，各自报手册正名+模型=append-system-prompt 链载入实证；本席=第 13 席直接实证）→ **启动链读通 13/13 全绿 ✓**。
- 观察项（不阻收口）：FSD 席自报「寻址一律正名 FD」、STE 席自报「正名=ST」，与 D-13 名册名（FSD/STE）存口径差——候名址域（CAO/CTO）对表，同族于 62d9c01 copilot 按名绑定教训。
- **②TC GitHub 回流归账（夜航01 次批⑦）**：
  - 实勘：GitHub `MoRen9527/TriCompany.git` dev 尖=**b3a450d（恰为本系主）**；sg 工作仓/裸仓 dev=396f5ef，b3a450d 系其严格祖先（09-15 22:1x dev 推仓 396f5ef 携入）→ **回流半环（GitHub→M-SG）零差口，事实闭环**（`rev-list b3a450d..HEAD`=20，全为 sg 领先侧）。
  - 重推半环（sg→GitHub，照先例）：推前验尖 b3a450d 未动 → 快进推送 → **拒**：`Permission to MoRen9527/TriCompany.git denied to deploy key`——github-mirror 键=TMV 仓 deploy key（仓域限定），TC 仓无写凭据。按冲突即停条款止推。
  - 残差登记：GitHub TC 停 b3a450d、落后 sg 20 commits（全 LG-035 夜航01 链，均已评审收口），候授权侧扩凭据（账户级键/机器用户/Token 三择）后一次快进推平；与 dev 侧 GitHub 推墙（无凭据族）、TriRMC 直推凭据缺失同族三分，归口授权侧。
  - 证据：ls-remote 读数×3（初探/推前/推后通道在）、push 全量 stderr（deploy key 拒因原文）、本地 merge-base/rev-list 读数。

## 收口-任务2·进度注记（批1）（2026-09-16T13:41:24Z＝21:41:24 +08 现查；执行席=COS 值席）

- **批1（CPO 域 9 件）已收口**：五席联审全绿（COS/CTO/CAO/CPO 直达+BS spawn；BOD 2026-09-16 双令定谳 spawn 合规）；45 行表态齐、共识 8 项/分歧 2 项/挂起候裁 2 项（P1 真源归属候 BS/P2 paths 二选一候 CHO 门）/红线②候 CEO 0 项。销账锚=树 `2026-W38/trees/b4-sweep-b1-cpo/`（tree done+五意见件 395 行+汇总件+收口报告）。
- 批1 增量发现：PRODUCT.md 名误已入 live compass 链（2 件：CPO:162+CTO:45，后者系陈旧渲染）、description 唯一定义点制未随、FSD 退役名残留（与任务3① 探测 FSD 席自报同根）。
- 批次元数据已供 CFO 切账（21:21-21:39 错峰窗，估 <30M 未触报备线）。
- **余量 ~142 件候放行**：建议序 COO→COS→CFO→CHO→CMO→CSO→DE→FSD→STE→RDT→BS 余 2→registries 51 分批；本任务整体保持 open 候 BOD 逐批放行或一次授权多批。

### 收口-任务2·进度注记（批2）（2026-09-16T14:03:34Z＝22:03:34 +08 现查）

- **批2（COO 域 9 件）已收口**：五席联审（三常驻席 SendMessage 直达=M-004 定谳通道+BS spawn）；45 表态齐、共识 8/分歧 2/红线② **E2 一项候 CEO**（COO 工作名四载体追平——CAO 从严判 vs COS/CPO/BS 事实回填判，按 bb2 共识-1 先例从严登记；附快速通道+横切预警=后续域预计系统性命中「待命名」残留，候一裁后 CHO 通道批量追平）。挂起 P3（supervises 补 CSO 候 CHO）/P4（TriDev 旧名族候 CTO）新登记，P2 延续。销账锚=树 `b4-sweep-b2-coo/`（commit 见下）。
- 批1 切账：18.36M tok/654.02 分/闸内零触发（5a3de7ef）；批2 元数据已供 CFO。
- 余量 ~133 件；下批=COS 域 9 件候批2 切账回填后闸门开。
