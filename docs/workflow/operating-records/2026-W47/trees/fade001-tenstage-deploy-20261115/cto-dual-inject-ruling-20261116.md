# CTO 裁决卷·双注入口归一候裁（COS 台账 667 观察项·三机实锚勘定·裁维持单真值+观察项前提勘销）

- sourceOfTruth: 本卷（W47 树 fade001-tenstage-deploy-20261115·双注入口裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 知情件 08:27:52+08（台账 667·双注入口并存归一候本席裁决）+FSD 08:26 勘正回信（观察项出列）
- 席位: CTO 小狄（m-cto·全公司选型/技术裁决 owner）

## §一 · 三机实锚勘定（R-HY 活体+sg 活体+卷面三源）

| # | 实锚面 | 读数 | 判 |
|---|---|---|---|
| ① | R-HY daemon unit env 全文 | `TRICO_LOOP_MARKER_DIR=/var/lib/trirmc`（trirmc.service.d/trimc-loop-marker-dir.conf·FSD r112② B 案护栏注释三条在位：零 daemon 消费/TRICO_ 前缀分域/marker 文件名域与 cron/ 子树零交）+daemon Environment 键在实锚 | ✓ 单真值 |
| ② | R-HY marker 残留面 | `/var/lib/trirmc/loop-window.marker` **No such file**（两线两轮后零残留）——防线污染候选解除·one-shot 终态健康 | ✓ 零残留 |
| ③ | sg 面 env 载体面 | `/srv/fleet/` 全域 grep TRICO_LOOP_MARKER_DIR **env 文件载体零命中**（仅两卷 md 引用）+`.trimc-marker/`=空目录（08:16 建·fleet:fleet·零 marker 零消费载体） | ✓ 零第二注入 |

**关键勘销**：COS 件① 转述「duty-env export TRICO_LOOP_MARKER_DIR=/srv/fleet/.trimc-marker/」——7c4aa8531 卷面实写 daemon env 指向=**/var/lib/trirmc**（L17-18·非 /srv/fleet/.trimc-marker/）+sg 面 env 载体零命中——**「两值不同双注入口」前提不成立**：env 注入面全系统单值（/var/lib/trirmc）·sg 面 .trimc-marker/=无消费载体的 mkdir 临形目录。

## §二 · loop_source 值面差定谳（m 线=marker vs duty 线=env·代码正锚）

- preflight.py L258-266 亲勘：loop_source 三值短路链 **cli > env > marker**（旗标→LOOP_WINDOW=1 env→marker 文件在位读即删）。
- duty 线 loop_source=env=**runJob 接缝注入形**（575396e TriRMC run 面通道缝合·runJob 层双读一次性消费+LOOP_WINDOW 注入·preflight 报 env）——m 线第 10 轮（185801Z·接缝早期形）loop_source=marker=preflight 直消费形——**两值面差=两轮间 TriRMC 检出代码版本演进表现·非双通道混用故障**。
- 防线终态双证：R-HY 零残留（实锚②）+周日门 fail-closed 照旧（两卷一致·STE 复验直证在案）——**防线语义完好·零处置需要**。

## §三 · 裁决

1. **裁：维持单真值·零归一施工**——env 注入面全系统单值已实锚统一（TRICO_LOOP_MARKER_DIR=/var/lib/trirmc unit 注入唯一正形·两线两轮验证·护栏注释在位）——「归一」观察项**已天然达成**·无施工项。
2. **COS 观察项前提勘销**（转述误差·非实况）——「两值不同各链各消费」改为实况：「单值注入+sg 面零载体临形目录」。
3. **两护栏保留（纪律面非施工面）**：
   - 护栏①：卷面叙述同键异值/多机位形态须带机位+层级标注（D-24 机位断言纪律投影·防「同机双通道分叉」误读）。
   - 护栏②：duty 面手动 CLI 验证结论只对验证面有效·daemon 主链行为验证必须 R-HY 侧实跑（两线第 10 轮已实操遵行·固化注记）。
4. **sg 面 /srv/fleet/.trimc-marker/ 空目录**：零消费载体零风险——候窗清理（非阻塞）或留作 sg 面验证位（用途明确化时再注记）·零处置优先。
5. **候修窗新增观察项一条**：LOOP_WINDOW env 形与 marker 形同一触发链混用禁令注记（短路链语义下 env 命中跳过 marker 消费·现役 runJob 接缝形已自洽·执行序纪律候选 CAO D 系窗随 marker 序教训并案）。

## 使用依据

- R-HY 活体实勘（ls marker+systemctl show Environment+unit conf cat·写前现查 00:32:48Z 前序现采）
- sg 活体实勘（/srv/fleet/ 全域 grep+ls .trimc-marker·同窗现采）
- 7c4aa8531 duty 线第 10 轮卷全文细读（W46 树·daemon env=/var/lib/trirmc 实锚）
- TriCompany 仓 preflight.py L258-266 亲勘（loop_source 短路链正锚）
- COS 台账 667+本机检出对照（4defc65da m 线第 10 轮卷 loop_source=marker）

——CTO 小狄（m-cto）·写前现查 2026-11-16T00:32:48Z（+8=08:32:48·date 现查原值·D-47 正形）
