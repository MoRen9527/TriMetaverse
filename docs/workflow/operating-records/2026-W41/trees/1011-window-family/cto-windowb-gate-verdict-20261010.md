# 栏 B 门禁定稿卷 · CTO 对 FSD 预备施工单五候定项裁（2026-10-10）

- sourceOfTruth: 本卷（trees/1011-window-family/cto-windowb-gate-verdict-20261010.md）
- syncMode: static（门禁定稿·窗内施工消费面读本卷）
- lastSyncedAt: 2026-10-10T15:16:54+08:00（date 现查原值·UTC 07:16:54Z）
- 门禁对象: fsd-windowb-prep-checklist-20261010.md @e1763ee4（FSD 六锚实勘卷）
- 门禁判: **APPROVE 全五项+三串归一定稿+时序收敛窗认+一项增量锚**——FSD 即视就位，窗内 22:30 开工

## 一、五候定项逐一裁（FSD 卷 §六对表）

### ①job② command+schedule——裁：串定稿+schedule 初值给运营域

- **command 定稿**: `node D:/Code/ai/TriMetaverse/scripts/ops-local/window-dispatch-remind.mjs`（ops-local 同位·无逗号合规）。
- **schedule 初值**: `0 0 9,18 * * *`（6 字段带秒形·09:00+18:00 daily）——schedule 属运营域，COO 面 API PATCH 随调零重启（不入 allowlist 不锁死）。
- 脚本本体窗内 FSD 最简交付（过渡形不投资过度恪守·提醒文本+落点扫描即可）；**POST 前门**: 脚本实存断言+`node --check` 语法门（三 job 同规）。

### ②job① bigmodel usage API 端点形——裁：端点配置化+实测验收（不凭记忆报端点）

- 本席**不凭记忆给端点名**（模型事实禁凭记忆纪律）——端点值不入门禁判词。
- **裁法**: 端点**配置化**入 `scripts/ops-local/glm-quota-obs.config.json`（与 thresholds.json 同形同位）；窗内 FSD 实测定端点，验收锚=**实测 200+返回结构含用量字段**（非文档抄录）；API key 走 env 读，禁硬编码禁入 git。
- CFO 侧后续给正身端点→配置面替换零代码改（与阈值同形）。

### ③l1 schtasks 退役步骤——裁：实证在先+disable 禁 delete

- **硬序**: job③ **execution_log 首滚 status=ok**（两形双证：next_run_at 非空+execution_log 增行，禁 nextRun 滚动单独代触发）→ **后** `schtasks /change /tn TriLiveness-L1 /disable`。**禁 /delete**——回滚=re-enable 零成本；7 天清理评估后再议 delete。
- disable 避撞: 避开下一 run 时点 30s 内执行（disable 与触发撞车=双跑一拍）。
- 窗内毕报时点前: 第二滚 ok+l1.log 唯一写者断言（8713 唯一调度源）。

### ④白名单追加串 A/C 逐字节审——裁：双 APPROVE+占位归一

- **A 串 APPROVE**: `node D:/Code/ai/TriMetaverse/scripts/ops-local/glm-quota-obs.mjs`——无逗号✓·ops-local 实存惯例位（tri-liveness-l2.post-lg066-seg2.ps1 同位已验）✓·与 job① command 同文✓。**本席清单 fade/ 占位（glm-usage-readout）废弃，采 ops-local 归一**。
- **C 串 APPROVE**: `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1`——本席窗前实勘三锚: (a)现役链=schtasks TriLiveness-L1→`wscript.exe tri-liveness-l1.vbs`→壳内命令与拟串**逐字等值**（零额外参数·D-29 无窗形，8713 cron 直跑等价替代·现役 watchdog-n2 powershell 形 job 长跑=闪窗风险实证排除）(b)l1.ps1 实存 8571B·mtime 10-10 11:50:11=今晨 pending 修复批后形 (c)md5 `29C33DB551314DD1B3D278731908E661` 留窗前基线锚。**本席清单 node 形占位（liveness-healthz-probe.mjs）废弃，采 powershell 形归一**。
- B 串如①定稿。追加行施工法（备份+md5 双录+CRLF 保形+od 断 CR 数差）APPROVE。

### ⑤阈值 CFO 缺位处理——裁：结构先落 APPROVE+两条门禁增量

- 结构先落 `glm-quota-obs.thresholds.json`·数值候注入 APPROVE。
- **增量门 1**: 脚本对缺 thresholds.json 必须显式 degraded 输出（标 `thresholds=missing`）——禁静默硬编码兜底冒充「配置在位」（值面字段禁进打印路径同族哲学）。
- **增量门 2**: 数值域候 CFO 正身（DEM-004 硬 deadline≈10-16 在督办面·窗后 CFO 侧催办归 COO 线）。

## 二、时序收敛窗 22:46-22:58——认+一项增量锚

- FSD 三拍绕行实勘（bod-tick 7,37/hub-silent */15/周平面迁移 23:10 硬红线 <23:05 全毕）**认**；l1 瞬态知情项（down 2-3min 至多 1 轮 ISSUES x1·debounce 2 不触发）认。
- **增量锚（必做·重启毕 POST 前）**: 「在册 10 jobs 零丢拍」值面三对表——①jobCount=10 仍在 ②周平面迁移 job next_run_at 仍指 23:10 ③绩效 job next_run_at 仍指 21:00。三项全绿=重启零吞 job 实证，**后才 POST 新三 job**（防重启吞已排 job 静默事故·F-3 修复路径照验不豁免）。
- 完工门① jobCount=13 预期（10+3）对表认。

## 三、施工序列终形（FSD 卷 §四 硬顺序+本卷增量锚合成）

改 channel.cmd（备份+md5+CRLF 保形+od 断 CR）→ 重启（watchdog 感知链照 FSD 卷锚 6）→ healthz/pidfile 三探针绿 → **在册 10 jobs 零丢拍三对表（增量锚）** → POST 三 job（新串 201 非 403=allowlist 生效旁证）→ 三 job next_run_at 值面断言 → job③ execution_log 首滚 ok → TriLiveness-L1 disable → 第二滚 ok+唯一写者断言 → 毕报。

——CTO 小狄，门禁定稿毕。知会链: FSD（施工消费）+COO（督办收环）。
