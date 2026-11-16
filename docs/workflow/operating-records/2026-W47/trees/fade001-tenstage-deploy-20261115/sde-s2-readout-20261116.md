# SDE S2 施工毕报（loop convene 段 auto-review 形 runner·BOD 直派·CTO 裁定卷 governs）

- sourceOfTruth: 本卷（S2 施工毕报正身）
- syncMode: write-time
- 施工席: SDE 小布；令源=BOD 直派 S2 施工令（CTO 施工序 governs·notice-159 催办后兜底直派）
- 施工窗: 2026-11-16T11:49:48Z 接令→T13:xxZ 毕（含 S3 dry 双态）
- 判定: **S2 代码面施工毕（独立 commit 单笔族 cefa5eb+155535a 修笔·revert 一键）·S3 dry 面板核形四断言实测（③真缺红 RETRY 降首例实弹）·实弹席=河源 claude 缺不可行实锚如实档（§五 降级面候裁）**

## §一 · S2 施工落装（CTO 裁定卷 §一/§三 逐项）

| 施工项 | 落装 | 凭据 |
|---|---|---|
| 七席评分会话 runner | SEATS 七席（cos/coo/cao/cpo/cto/cho/cfo）+席角 prompt 模板零密钥（D-46·prompt 只引 run_dir 相对路径·值面由会话自读）+per-seat headless claude -p spawn/收集/聚合 | runtime/cognition/loop_autoreview.py（**206 行+修笔**·独立 commit 单笔族：cefa5eb 落装+155535a 四句门③ pattern 修笔——revert 一键） |
| sheet JSON staging | run_dir/convene/seats/<seat>-score.json（缺席席=<seat>-score.absent.json 如实注不冒充全席 §五） | spawn 落卷形（--spawn 面） |
| subjective 聚合初判形 | 已席均形+缺席标注（不冒充全席）+**人联评终审签认位保留**（r119④ 防线双层·聚合初判=自动前段） | aggregate-initial.json 落 run_dir/convene/ 面 |
| **四句门四机械断言**（CEO 四句 §九 冻结照录） | ①不漏=plan.migrate 清单 vs counts②不多=W47 面可清点③必迁族逐件在位（task-inventory/daily-progress/OP 双件宽形 glob）④closeout 四态词——全绿 PASS 行入聚合卷·任一红 FAIL+**verdict RETRY 照降** | four_gate_assertions()·dry 面实测 |
| CLI 面 | --run-dir/--seats（降级三席代表形内置）/--spawn/--dry/--records-root | argparse 面 |
| python3.6 兼容 | Optional 形（sg 3.6 实勘）+capture_output 3.6 形 | 编译双过（py_compile+ast） |

## §二 · S3 dry 双态读数

### 面板核形（--dry 零 spawn·113937Z run_dir）

| 断言 | 读数 | 判 |
|---|---|---|
| ①不漏 | migrate 清单 n=0 vs counts=0 | ✅ |
| ②不多 | W47 面=河源 operating-records/2026-W47（树 n=2·多轮共面现值形） | ✅ |
| **③必迁族** | **缺件=task-inventory-*+daily-progress*.md（OP 双件 glob 修后命中转绿）** | ❌ **真缺红=RETRY 降设计语义首例实弹** |
| ④closeout | verdict=pass+run_state=stale 四态词对表 | ✅ |

- **gate_pass=False=RETRY 照降**（③缺件=五件族 copy-latest 面 W47 现势缺——真实缺口实锚非 pattern bug（155535a 修笔后两面辨析毕）——候迁移面补迁/值席面知情）
- 修笔如实档：③ pattern 首版构造 bug（月号/周号混形+日期形）——W47 面 ls 实锚后宽形 glob 修正（155535a）

### 实弹 dry-run 席（单席试会话 cpo）

- **不可行实锚**：`FileNotFoundError: 'claude'`——河源面 claude CLI 零命中（which/常见位/find 全空——**河源班组=候重建态（r149 CHO 定性同源）·claude 装机面缺**）
- **候裁三形**（§五 降级面扩）：a) 河源 claude 装机令（环境面·BOD/CEO）b) spawn 形改 sg 面（材料只读投喂 scp 跨机形——runner 形态改=CTO 域）c) 降级三席代表=sg 面 claude spawn 形（sg claude 在役）

## §三 · S4 STE 复验交棒（材料面）

- 代码面：loop_autoreview.py cefa5eb+155535a（独立 commit 单笔族·四断言实现/prompt 模板/聚合形/CLI 面）
- 面板核读数：dry 四断言实测（本卷 §二）
- 单测面：四断言单测候 STE 面（测试域·sandbox 形照 575396e 先例）
- 复验重点：sheet 形/聚合数/四断言实现正确性+prompt 零密钥核（D-46）

## §四 · 触发面熄火遵行

S2-S4 未毕前 marker/convene_mode 触发面保持熄火（113937Z 事故教训——**marker 已自消零残留·convene_mode=auto 备路面维持原值候收口清理令**——S5 真值轮触发=候 S4 复验绿+环境面解+值席令三面齐）

## 使用依据

CTO 裁定卷 cto-autoreview-form-ruling-20261116.md（§一/§二/§三/§四/§五）；BOD 直派令（护栏四条）；STE 复验绿面（S1 形）；本卷读数=施工窗现采实锚。

—— SDE 小布（毕报双通道=落卷+commit+直达通知 BOD·卷面时戳=commit %cI）
