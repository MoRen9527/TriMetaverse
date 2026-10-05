# BOD 哨阅读数笔 · P0-EXEC-01 提前读面验收（2026-09-28 深夜，读面三科）

- sourceOfTruth: 本件（BOD 哨验收 A1-A6 之读面科目提前卷；写面科目候 09-29 哨窗）
- syncMode: 快照件（读数落笔即冻结；复测以 09-29 哨窗终卷为准）
- lastSyncedAt: 2026-09-28 23:40 +0800（date 现查 23:38:52 星期一）
- 验收席: BOD（禁转抄亲测；CTO 终判卷 de76b2d3 已落卷=A5 正式 PASS+FREEZE 解除）

## 一、提前验收缘起

CEO 23:28 问「为什么明晚验收，现在不能验收么」——三理由中「门审未落」已于 23:23 失效；
读面科目零生产写入即可验，BOD 裁提前开跑；写面科目（A3 实弹/A6 revert）+A4 终验候部署步。

## 二、读数（亲测，零转抄）

### A5 全量测试独立复跑 — PASS

- 命令：`npm test`（TriModel 根，node --test --test-concurrency=1），EXIT=0，duration 118.4s
- 读数：**tests 313 / suites 74 / pass 298 / fail 0 / cancelled 0 / skipped 15 / todo 0**
- 对表：与 FSD/COO 报数逐字一致；BOD 22:07 前轮 fail=3（W1/W2/W3）本轮**亲测归零**——修复生效实证

### A1 泛化端点族四 face 可达 + 别名零破坏 — PASS

| 探针 | 端点 | 钥匙 | 读数 | 判 |
|---|---|---|---|---|
| pull 视图 ×4 | `/v1/config/cards/{mmc,mlc,rmc,rlc}?view=pull` | API_TOKEN | 全 200 | ✓ |
| managed 视图 ×4 | 同上 `?view=managed` | ADMIN_TOKEN | 全 200 | ✓ |
| 别名零破坏 | `/v1/config/trimmc-card` | ADMIN_TOKEN | 200 | ✓（admin 面语义原样） |
| 面分离交叉 | 同上 | API_TOKEN | 401 | ✓（双层面语义保持） |
| 防枚举 | `/v1/config/cards/__probe__` | API_TOKEN | 404 | ✓（不在册先拒） |

- 过程注记：首测别名误用 API_TOKEN 得 401，实勘 trimmc-card.ts L32-36（GET=requireAdmin）定性为
  BOD 用错钥匙非缺陷——老路径本就 admin 面，行为与泛化前一致，零破坏成立

### A2 face-events 审计账 + len-only — 机制 PASS，两观察点

- 账面：`TriModel/face-events.jsonl` 796 行；**len-only 扫描 PASS**（键值材料 0 命中）
- etype 分布：pull 79 / write 717 / **apply 0 / status 0**
- per-face 行数：mmc 191 / rlc 76 / rmc 1 / mlc 1
- **观察点①**：apply/status 两族零实弹——daemon 回写链路（applied|failed）尚无真实调用序列；机制在卷（四族
  事件型代码落卷+测试覆盖），实弹候部署步后 daemon 真实消费
- **观察点②**：mlc/rlc 卡 pull 探针返回「card absent」——本机两卡**未建卡**（无配置可拉=降级默认态）；
  与 daemon 侧 dist 未更新一致（见 A4），部署步后 daemon config-cache 泛化接入方产生真实 pull/apply 序列

### A4 CLI config 族 — 终验候部署步（部署时序，非缺陷）

- 源码面：`TriMLC/src/cli.ts` L851 config 子命令族在卷：`trilc config <pull|show|verify|cache show|cache clear>`
- 产物面：`node dist/cli.js config show` → **unknown command: config**——dist 未 rebuild
- 定性：部署步（G10，FREEZE 刚解除候执行）含 rebuild+daemon 重启；A4 终验（与 CTO §5.2 底表逐格核）
  天然排在部署步后。教训族：源码有≠产物生效（LG-035 同族变体，本次为预期时序非事故）

## 三、明晚哨窗计划（修订）

1. 部署步（G10）执行：TriMLC/TriRLC rebuild+重启（照 TriLC 重启纪律：pidfile/pid 对表+禁裸杀+父 cmd 消亡验）
2. A4 CLI 终验：五子命令实测+CTO §5.2 能力矩阵底表逐格核
3. A3 备份轮换实弹：卡写→备份生成→轮换序→审计行全程留痕（部署步验收读数已含 canonical 写 bak 活体断言）
4. A6 revert 演练：泛化层纯新增单 commit 回滚实测+恢复
5. A2 观察两点复核：部署后 daemon 真实消费链 pull/apply 落账核验
6. 全过 → P0 宣告闭合 + 第二期（P1）执行单当夜落笔

## 四、哨阅独立发现汇总（候门审/收口对表）

- 无新增缺陷；A4 dist 滞后=部署时序预期态；A2 两观察点均指向同一根因（daemon 侧部署步未执行）
- BOD 误用钥匙 401 事件已定性（用错面非门坏），留痕免复盘误判

## 使用依据

- CTO 终判卷 de76b2d3（A5 正式 PASS+FREEZE 解除）；FSD 完工读数（TriModel e9938cc）；
  BOD 亲测命令与读数全在本笔 §二；token 验证线（23:03）另卷 COS 台账
