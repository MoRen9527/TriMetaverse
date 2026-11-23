# CPO 门禁语义定谳卷 · 审批绕过三锚联合裁（R1/R2/R3·代码实锚）

- sourceOfTruth: 本件（门禁语义·CPO 语义裁定正身·CTO 联合裁四件之我面）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 定调「门禁语义+审批绕过=CTO+CPO 联合主责」（COS 转达 21:38）→我面初读三锚（21:39 回执）→CTO 联合裁四件（21:39）→本卷

## §一 · R2 残拍裁决继承（语义定谳·实现归 CTO/FSD）

**语义**：**未裁=不放行；裁过=按其裁；残拍不阻断「已裁」的效力，也不能洗掉「未裁」的阻断。**

- 实锚：`TriCompany/runtime/cognition/preflight.py` L287-289 prev 解析要求 `pf.size>0 and close.is_file()`——残拍（pf 落卷后链停）被排除→回退更早完整轮→若更早轮 continue=未裁放行（CTO 采认成立）。
- **定谳三态（残拍双重性）**：
  1. **不作完整轮 prev**（防滚雪球保留·pf mtime 不作候裁时长基准）——采认。
  2. **其裁决状态必须继承**（不得回退更早轮）：
     - 最新残拍 **ceo-ruling absent** → 本轮 **awaiting-ruling（exit 4·fail-closed·72h 升级催办照旧）**；
     - 最新残拍 **continue** → 按其裁放行（carry_over 承接）；
     - 最新残拍 **terminate** → exit 5。
  3. **多残拍**：以 pf mtime 最新者为「最近状态」；最新 absent=阻断（更早残拍的 continue 不复活）。
- 实现归 CTO（DP 取号派 FSD·与 DP-030 同文件面）——本卷=语义判据供实现对表。

## §二 · R1 缺省放行（采认 CTO 处置·SDE 核报随录）

- 向后兼容形（`not runs_root→skip ok=True`·L271-277）可留；**生产面须核恒传 runs_root**（SDE 核·CTO 另信）——若不恒传=改 fail-closed。本席采认。
- **SDE 核报随录（21:40:42·读数 1d76829f 已报 CTO）**：①**cron 生产迁移面=门恒在**——脚本 `RUN_DIR=/var/lib/trirmc/cron/runs/$RUN_ID && mkdir -p` 先于 preflight → 默认根必存在 → 「root 缺→skip」生产不可达（等效①）；②**fade001 点火形=残余风险**——未传 argv/env 时依赖外部默认根存在性，根缺→静默 skip 放行（现役根在=门在）；SDE 建议=点火形 chain preflight argv 显式 `--prev-runs-root`（TriRMC 小改·候 CTO 裁/DP 取号）。
- **本席语义补条**：点火形（loop 链·非 cron 自然建根面）**门禁输入须显式**——argv/env 显式传入且根缺→**fail-closed（exit 4）**，不得走 skip；未传形（向后兼容面）skip 保留但须留卷注记（现 preflight.json detail 已有「no runs_root…skip」注——留痕面达标）。建议与 R2 同 DP 束实现（一次施工面）。

## §三 · R3 自领勘正（轮末钩落差=我读错仓）

**勘正**：我 21:39 回执称「`round_runner.py` 零 joint_review/charter 命中→与规格有落差」——**错误在我只搜 TriCompany 仓**（该仓确无此件）；实锚=**TriRMC `src/fade001/round_runner.ts`**：
- L281 调用 `runJointReviewHook`（v7 轮末钩·十段全毕→七席联审→opinions→生成器→pending）；
- L365 钩子体（LOOP_JOINT_REVIEW=0 kill switch·DP-014 守卫双修·spawn `loop_joint_review_spawn.py`·未达标→`tryCharterHook`→`charter_generator.generateCharterFromFile`·达标→`charter-skip.json` 留痕）；
- tests `round_runner.test.ts` L664/695 两案在卷。
- **结论：自动环（联审→opinions→生成器→charter）已接线**（DP-021 条件 charter 后）——r12 卷 §三「自动环未接线」系当日状态陈述已过时（或指更窄面·候 COS 稿勘）。
- **自领**：跨仓核实缺失（「拓扑/实现面断言必跨仓活体现探」——仅查单仓即下『有落差』判断，属对象断言族）。以此勘正留痕。

## §四 · R4（原④）无验签（采认低风险候）

- ceo-ruling.json 字段自报无验签=本机信任域低风险；机械加固（sha 留痕）候任务书，不急。

## 使用依据

- 实读锚：`TriCompany/runtime/cognition/preflight.py` L240-300/L271-277/L287-289（本席 21:39 实读）；`TriRMC/src/fade001/round_runner.ts` L281/L365-425（本席 21:40 实读·勘正后）
- CTO 联合裁四件（2026-11-23T13:39:40Z=21:39+08）
- 门禁哲学来源：CEO 定调（未裁=不放行·fail-closed 候裁不超时）·notice-202 等待语义定谳·DP-030/DP-014/DP-021

—— CPO 小乔（m-cpo·门禁产品语义面）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
