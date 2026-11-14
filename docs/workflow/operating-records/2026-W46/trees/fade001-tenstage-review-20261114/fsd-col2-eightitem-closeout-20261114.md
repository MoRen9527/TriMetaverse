# FSD 栏二八项直接开工批毕报卷（CTO 派工单八项·review 日栏二）

- sourceOfTruth: 本卷（trees/fade001-tenstage-review-20261114/·FSD 栏二八项毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-14T03:40:13Z（+8=11:40:13·date 现查原值粘贴）
- 授权链: CEO 11:16 令（候排程挂法废止·能直接干的直接干·完成即报）→ CTO 派工单八项（review 日栏二改直接开工批）→ D-15 接令回执（msg bd7e470b）后开工

## §〇 · 总读数（毕报锚）

- **八项全毕**：逐项独立 commit 九笔（八项+连带一笔）·双通道推讫·ls-remote 双验顶 hash=e4fea56。
- **全量十一件 157 案全 OK**（首跑捉获 1 failure=发现 12 连带 fixture 未同步·修后全绿·见 §九）。
- **validation 族 438/5/1 零漂移**：五案名独立提取逐字对表=frontmatter_parity/lg024_signed_piece/lg025_manifest_prefix/entry_level_session_body/manifest_claude_code_targets=既有基线族全中（非转抄·本轮独立验）。
- 零触运行面遵行：全项目=TriCompany 仓源码+测试施工·零 payload/jobs.json/daemon 触（780730b 追认先例+CEO 本令授权形）。

## §一 · 发现 27【CEO 点名】notify_done --notify-to 缺省链对齐（babe7de）

- **实现**：新增 `_notify_to_chain(cli_value)`——CLI 逗号分隔值 → `WEEKLY_SHIFT_NOTIFY_TO`（逗号分隔双址）→ `WEEKLY_SHIFT_SMTP_TO`（兼容）→ `[]`（落 config default_to）·L65 消费点换装。
- **选型**：precedence 同源=import 复用迁移器 `_resolve_notify_to`（shift_notify_fail L46 先例形·真单一真源）·函数内延迟 import 照先例。
- **自测**：NotifyToChainTest 六案增（CLI 优先胜 env/逗号 split 同迁移器形/双址谱逐级回落/全空白逗号形/全空→[]/集成案 send 路径 `sent["to"]` 消费链断言）·notify_done 14 案全 OK。

## §二 · 发现 12 close 扫描域扩 dce.json（bcce338）

- **实现**：close_skill `_STAGE_ARTIFACTS` 五件→六件（插 dce.json·plan 后 verify 前）+close_cli `_STAGE_ORDER` 六件→七件同步+两侧 docstring 词面勘正。
- **行为面**：dce.json verdict=fail 同提取升级条目（trigger=stage_artifact_fail）；dce.json 缺=absent 注记→stale（十阶段形下 dce.json 必在·缺即悬空 run）。
- **自测**：dce fail 提取案+dce absent 注记案+dce 缺=stale 案三增·close_skill 13+close_cli 8=21 案全 OK。
- **连带**：pipeline fail-chain fixture 未同步案见 §九（全量门禁捉获·e4fea56 修）。

## §三 · 发现 21/22 migrate rc=3 候裁态特判（88418b6·CTO 裁量先行①）

- **实现**：rc_guard 拦停分支内 rc==3 → `entry["halt_class"]="pending_ruling"`+halt_note；verdict 面 any(halt_class)→`halt_pending_ruling` else fail。
- **裁量遵行**：停段行为不变（rc=3 仍拦·后续步骤零执行·exit_code=2 两态一致·零豁免零 escape·门不豁免哲学不破）；rc=4 维持布尔拦不特判（特判稀释读数）。
- **自测**：rc3 pending_ruling 案（exit 2+verdict+halt_class/halt_note 断言）+rc4 plain fail 案（零 halt_class 键）两增·dce 15 案全 OK·既有 mock 案（rc=0/128/1）零破坏。

## §四 · 发现 4 run_plan kind=is_dir 实值（c36760d）

- **实现**：`kind = "dir" if (trees_dir / name).is_dir() else "file"`（实探文件系统）·migrate 分支冗余 kind 重赋值一并删。
- **选型**：方案 B（run_plan 内实探·scan_trees 契约零扩散）否方案 A（值面扩展动契约）。
- **自测**：PlanAllPass 案 kind 三断言增（dir/file/dir 对表·bod-tick 目录+mapping-note.md 散文件）·plan_scope 27 案全 OK。

## §五 · 发现 30 classify_dir reason 码拆两态（5a40048）

- **实现**：`exp is None → ["authorization_unparsable"]`（保守在途）/`exp > now → ["authorization_active"]`（确证活授权）/过期 → `["authorization_expired"]` 不变·分类行为不变（两态同 migrate）。
- **消费面全谱**：Grep 全仓=本体 L112+测试 L157 各一处·零外部消费者（拆码零扩散）。
- **自测**：active 全等断言案增+unparsable 案勘正（含旧合一码退役负断言防回退）·plan_scope 28 案全 OK。

## §六 · 发现 7 migrate cmd cd 前缀锚位换真源（5eefc00·候裁→裁 A 收口）

- **过程**：令文 `cd {tmv_root}` 与活体实测冲突（TriMetaverse cwd 下 `import runtime` → ModuleNotFoundError·`python -m` 解析 sys.path[0]=cwd 需 TC 仓根·payload vB L9/L23 现役链 cwd=/srv/fleet/TriCompany 双证）→ **停笔候裁**（NEEDS_CLARIFICATION msg 4c18a5e1·附三案）→ CTO 裁 A（锚位换真源 tc_root·主卷原形系锚位笔误·案 B/C 否决裁据在卷）→ 即施工毕。
- **实现**：模块级 `TC_ROOT = str(Path(__file__).resolve().parents[2])`（零新参自锚·dev/河源两机同形）+render ctx 增 tc_root 键+migrate cmd_tmpl 加 `cd {tc_root} && ` 前缀。
- **自测**：cd 前缀案增（startswith 断言+TC_ROOT 值面断言+**负案 tmv_root 不得入 migrate 前缀**防回归）·dce 16 案全 OK。

## §七 · 发现 24 shift_carry_over L67 死变量行删（2d71448·零行为）

- **实勘**：`from_md = operating_root / f"{from_week}" and None` 恒 None（Path truthy → and None）·Grep 全文件唯一出现=L67 本体零消费（源路径真解=glob 候选形 L70-73）。
- **变更**：删一行·零运行时影响。
- **连带验证**：notify_done（import `_resolve_notify_to`）+dce_steps（argparse 源码对表）两套件 29 案全 OK。

## §八 · 发现 29 commit pathspec 抽单一真源（4b66ce6·CTO 裁量可直接干）

- **实现**：dce_steps `from runtime.cognition.preflight import MIGRATION_FACE`+commit cmd_tmpl 字符串拼接换装（preflight 卫兵与 commit 落卷面同 face 常量·漂移即同动）。
- **零语义实证**：无环单向（dce→preflight→weekly_plane_shift·preflight import 面实勘）·渲染输出逐字同形（test_dce_steps L89 字面断言过=零漂移铁证）。
- **自测**：dce 16+preflight 22 案全 OK。

## §九 · 连带同步：pipeline fail-chain fixture 七段齐形（e4fea56·全量门禁捉获）

- **捉获**：全量十一件首跑 157 案 1 failure=`test_tenstage_pipeline.TestTenStageFailChain.test_fail_chain_upgrade_entry_and_alarm_route`（run_state 'stale' != 'failed'）。
- **归属**：发现 12 测试同步义务连带（非清单外新增）——fixture 上游模拟卷止于段 1/2（发现 12 前六段齐形·L172 注记自证），七件形后 dce.json 缺=absent→stale 盖过 failed。
- **修复**：fixture 补 dce.json 模拟卷+注记六段齐→七段齐勘正·补后全量 157 案全 OK。

## §十 · 推送面与护栏对表

- **推送**：origin 双通道（github+sg bare）推讫·ls-remote 双验顶 hash 一致=e4fea56·推送区间 c36760d..e4fea56（前四项+CAO 76dcaa3 已在远端·「未推」陈旧记勘正）。
- **护栏**：清单外零新增（发现 7 冲突停笔候裁未擅改形=同约束面）；升锚义务未动（照旧挂周日新会签小件）；保留面未触（发现 28 d 施工+qualify 注记=周日 γ 序位关键路径）。
- **毕报信**：SendMessage m-cto msg 7b69ed17（11:39+0800·候验收·验毕转 COO/BOD 转 CEO 照毕报链）。
- **明日预演窗**：10:00 候跑态不变（C2 知情件 a1afad0ca 五行判读表在卷·发现 31 时点敏感 migrate≈1 推演现场现值为准）。

## 使用依据

- CTO 派工单八项（review 日栏二·跨席信 11:19）+裁量两笔先行
- CEO 11:16 令（BOD 转达·直接开工批授权形）
- CTO 裁 A（发现 7 锚位勘正·跨席信 11:32）
- 技术真源：`TriCompany/docs/engineering/DESIGN.md` → metacognition-architecture → code-state（本批零架构边界变更·八项均 review 面修形）
- commit 链（TriCompany dev）：780730b（栏一小修包·追认在卷）→ babe7de → bcce338 → 88418b6 → c36760d → 5a40048 → 5eefc00 → 2d71448 → 4b66ce6 → e4fea56
