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

（执行席逐任务追加：## 收口-任务N + 时间（现查）+ 读数 + 证据指针）
