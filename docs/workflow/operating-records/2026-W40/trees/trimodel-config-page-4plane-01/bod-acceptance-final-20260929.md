# BOD 验收终卷 · P1-EXEC-01（A1-A6 全科，2026-09-29 凌晨哨窗收口）

- sourceOfTruth: 本件（P1 哨验收判定正身；哨窗=04:38 启 04:54 收口，五项亲测禁转抄）
- syncMode: 快照件
- lastSyncedAt: 2026-09-29 04:54 +0800（date 现查 04:54:27 星期二）
- 验收席: BOD（亲测五项照 03:37 排期令；支撑读数=sg 卷 64fc75e8+河源卷 2e262c9d+CTO 判读卷 88a2c0b5）

## 一、判定总览

| 锚 | 判定 | 一句话 |
|---|---|---|
| A1 TriRMC 归因=rmc 卡 | **PASS** | 河源亲测 config show source=tier2-cache-fresh+ladder card-fresh（卡面入梯铁证） |
| A2 旧卡保留+可回滚 | **PASS** | ⓒ 形态升级=主卡自始零触碰，md5 bac279a6 **四时点全等**（窗前/建卡后/终验+本哨窗） |
| A3 mmc 空白待配置态 | **PASS** | ⓒ 裁定剥离归 M2 演进基线，本窗不涉 |
| A4 零跨机文件复制 | **PASS** | 两卷动作清单全 SSH/机内构造/git 管道，零 scp/rsync 复制原语 |
| A5 sg tier1 活体+降级梯 | **PASS** | sg 亲验 mmc face tier2-cache-fresh+verify HEALTHY；本机 mlc/rlc 两 face 降级梯读数全链 |
| A6 候修三项收口+三仓零新增 | **PASS** | ①双向实证闭环 ③已闭；②候裁挂账显式列明不阻；三仓零新增铁证 |

**P1 验收判定：PASS，闭合宣告成立**（候办三项转后窗，全不阻塞）。

## 二、五项亲测读数（禁转抄，全亲跑）

### ①河源 ssh 亲验 — PASS

- 三 unit active（trirmc/trimodel/trirmc-mc）
- `config show`（8712, face=rmc）：effective **deepseek-v4-pro source=tier2-cache-fresh**/cache fresh（fetched 20:34:01Z，refresh=900s）/providers(2) glm+deepseek/ladder=card-fresh——SHOW_EXIT=0
- `config verify`：**HEALTHY**（connectivity/credentials/decrypt 三 ok，card_present=true）——VERIFY_EXIT=0
- 主卡 `/srv/fleet/trimodel-data/trimmc-card.json` md5=**bac279a6…**（第四时点全等，零-touch 贯穿兑现）
- rmc 卡备份轮换：**5 件滚动保留实证**（尾号 -14/-15/-16 序号递增旧件自清——堆积担忧解除）
- face-events 活体：tail 三行 pull ok+write ok+status ok（20:34:32Z 同拍）

### ②sg 亲验 — PASS（含偏差判读，见 §三）

- 三 unit active（trimc/trimodel-config/trimodel-proxy）
- `config show`（8710, face=mmc）：effective **GLM-5.3 source=tier2-cache-fresh**/providers(1)/ladder=card-fresh——SHOW_EXIT=0
- `config verify`：**HEALTHY** 三 ok——VERIFY_EXIT=0（与 SDE 卷读数逐字吻合）
- 主卡备份链清点：bak-1（**6587c69d 切前基线锚**）/bak-2（a8c1ae6f）/bak-3（422a1d98）三件+现行 e7e14187
- **基线 diff 亲测**（bak-1 vs 现行）：DIFF_PATHS=`['/status/at','/status/state']` **全落 status 域**；密文掩码逐条目全等（`lgmM..eMg=`）、条目数 1=1、model_sets/rules/strategies/active 全等
- **轮间 diff 亲测**（bak-3 vs 现行）：DIFF_PATHS=`['/status/at']` 唯一——内容域跨轮恒定铁证
- face-events 活体：20:31:08Z 一轮三行（pull/write/status ok）；**20:40:13 pull denied 一行**=鉴权门 fail-closed 正常工作实证（探针错钥被拒，非服务异常）

### ③本机 CLI 六格复认 — PASS（双 face）

- **8713（TriMLC, face=mlc）**：show（tier2-cache-fresh，card absent 守卫正确）/verify HEALTHY（decrypt n/a）/cache show/pull **实弹 OK mode=model-relay source=tier1-card keys preserved**/cache clear done（removed=2，梯语义自愈提示）——五格全 EXIT=0，卡写留空=差异①在卷
- **8711（TriRLC, face=rlc）**：show/verify HEALTHY 同构读数 EXIT=0
- 过程注记：CLI 不带 --port 落 8711=rlc face（DEFAULT_PORT 语义）——8713 需显式 `--port 8713`；CLI 产物路径=dist/src/cli.js（tsc rootDir 形态，dist/cli.js MODULE_NOT_FOUND 两机同形，非缺陷）
- 8713 鉴权 token 独立面实锚：launcher `AppData/Local/trimlc-daemon-channel.cmd` 注入（G10 卷正名），.env 无此键——各 daemon fail-closed 设计再证

### ④P0 候修三项收口核 — PASS（①双向实证+③已闭+②挂账）

- **候修①（PUT 空 provider_entries 500→400）双向实证闭环**：
  - 旧代（pid 20124, e9938cc 代）：PUT → **HTTP 500 `{"error":"Internal server error"}`**（缺陷现象复现=反证）
  - 新代（pid 42616, 995c2f7 代⊃8de8fe7）：同载荷 → **HTTP 400 `{"error":"条目数据格式错误，请重新添加条目"}`**（人话拒=正证）
  - 400 拒=零写入（mlc 卡未生成、write-guard 未触发）
- **候修②（SDE 部署尾三件：registerPid port 参/watchdog 复活令 env 保真缺口/boot 期 401 自愈）**：~~候裁挂账~~ **〔勘误 05:07〕CTO 已于 G10 观察项裁定卷 e24b17cc（00:37 落卷）全裁毕，本卷落笔时路由未接上**——①registerPid 裁修归 FD（TriMLC src/index.ts L145/L161 补 app.port，对齐 TriRLC L141 正形）②watchdog 裁修归 SDE（revive 段改调权威 launcher `trirlc\daemon\trirlc-daemon.cmd`，路径=子目录非根）③boot 401 销项（读数错配定谳：16:01:21Z mlc 首 pull ok 铁证，401=rlc 两笔错配拼接，②修复验收含此面）。三件转下窗并批执行（常规窗非即夜）
- **候修③（A6 回滚策略补注）**：CTO 闭卷笔 b42faa84 在案（单 commit revert 失效→dist 锚三层序）——**已收口**

### ⑤零跨机复制时序核 — PASS

- 河源卷 §四 A4 自证：全程 SSH+载荷 python3 机内生成（零落盘零出机）；git fetch 系代码管道非数据复制
- sg 卷动作清单全查：build/npm install/cp -p mailbox（**同机** TriMC→TriMMC）/start.sh 与 unit 编辑——零跨机文件复制原语
- 两卷互证：邮箱连续性搬运为同机 cp -p 留原件形态，非跨机传输

## 三、偏差判读：sg 主卡 md5 轮换语义（申报受理，裁=语义承接确认）

- **判据采认**：CTO 判读卷 88a2c0b5①——零触碰判据本体=「配置内容域恒定」；md5 恒等=无写回链时充分投影（河源主卡），「diff 除 .status 外恒定」=带写回链一般判据（sg mmc 身份折叠形态）。两面系同一判据不同写回拓扑投影，非分叉
- **BOD 亲测证据面**：基线 diff 全落 status 域+轮间 diff 唯一 at+密文掩码全等+结构区全等（§二②）——判据完全支撑
- **裁**：sg 面验收判据用「diff 除 .status 外恒定」，md5 轮换**不作异常项**；「零触碰」语义在 sg 面转译为「内容恒定+status 活性」入卷；status 域外置旁挂=M3 候选记档不排期（CTO 附注采认）
- 附带实证：备份轮换滚动保留 5 件（河源）——900s 写回频率无堆积风险，face-events 增速可接受

## 四、三仓全量零新增（A6 后半，BOD 亲跑）

| 仓 | 读数 | 基线（CTO 门审卷 03854395） | 判定 |
|---|---|---|---|
| TriModel | 324 tests/309 pass/**0 fail**/15 skip（108.4s） | 313/298/0/15 | **+11 tests=候修①/P1 新案随新锚，fail 0 保持** |
| TriMLC | 617 tests/612 pass/**5 fail**/0 skip（18.7s） | 617/611/6 fail | **fail 反少一挂**（flaky runConfirmCheck 本轮过）——零新增 |
| TriRLC | 662 tests/657 pass/**5 fail**/0 skip（171.4s） | 662/657/5 fail | **逐位一致** |

- TriMLC/TriRLC 各 5 fail 用例名**逐字对称**（replay-flow/P0 通道一/二端到端/FADE-ASSESS-005 派工门禁+可见性回归/TUI components）——同源仓共享既有失败族，与 LG-058 改动面零关联（CTO 卷「逐位同构零新增」定性亲证）
- TriMLC fail 明细亲跑抓取（tail 截断教训：首轮 log 明细被截，重跑 grep `^not ok` 补齐）

## 五、运维留痕（哨窗内动作，全留痕）

- **本机 TriModel 3333 daemon 换代**：旧 pid 20124（P0 A6 恢复态，e9938cc 代，孤儿进程无守护）→候修①探针双向实证后→taskkill 停旧（无 shutdown 路由，grep server.ts 零命中；「3333 孤儿停后不自拉」P0 定性兑现）→新起 pid **42616**（995c2f7 代 dist，mtime 04:40=FSD P2 骨架 build 产物）→cards/mmc 200 探活
- 回滚锚：dist.bak-pre-a6-20260929T0027 在位+git 锚 995c2f7 可 checkout 复位
- 探针载荷零敏感值（machine=probe-fix1 语义名，400 拒零写入）

## 六、闭合宣告与候办

**P1-EXEC-01 闭合宣告成立**（A1-A6 全过；sg TriMMC 接入+河源 TriRMC 迁正+rmc 卡纠正迁移+降级梯全域+候修收口五线全绿；回滚锚全单未动用）。

| # | 候办 | 候谁 | 性质 |
|---|---|---|---|
| 1 | ~~SDE 部署尾候裁三件~~ **〔勘误 05:07〕已裁毕（e24b17cc）：①FD registerPid ②SDE watchdog 改调权威 launcher ③销项** | COO 下窗并批排产（FD+SDE） | 裁毕候执行，不阻 |
| 2 | TriCode detached 锚纪律入 TriCompany 技术真源 code-state 注记 | CTO（随下一批 registry 窗） | 记档随窗 |
| 3 | 本机 20:40:13Z pull denied 来源（探针错钥定性，fail-closed 正常）——无办 | — | 留痕即闭 |

## 七、P2 期衔接（CEO 02:44 令链继续）

- P2 骨架已完（995c2f7 导航层+单页四卡+诚实三态+3e6ab37 managed additive；自测 324 测 0 fail+UI 族 45/45——与 BOD 亲跑 TriModel 读数逐位互证）
- P2 余程：CLI/网页矩阵终对表（候 P1 CLI 落位——**本卷 §二③ 即基料**）+渲染验证门全家族（STE 正常工时）+切后对照实照汇合（FSD 证责）+P2 部署窗另照+**P2 完工=CEO 终验触发**（三项亲测候排）

## 使用依据

- 令链：CEO 02:10/02:43/02:44；BOD 03:37 哨窗排期令；COO 03:48 四裁+04:36 窗闭线报+04:50 基料全齐线报
- 支撑卷：sg 64fc75e8/河源 2e262c9d/CTO 判读 88a2c0b5/CTO 门审 03854395+终判 de76b2d3+闭卷笔 b42faa84/G10 bc388290/P0 终卷 231fca65
- BOD 亲测命令与读数全在本卷 §二/§四/§五；时点链：04:38 哨窗启→04:54 收口
