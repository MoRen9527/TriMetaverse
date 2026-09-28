# STE 测试方案件·TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01（测试族）

- sourceOfTruth: 本件（STE 测试族方案与排程正身；执行单=d9df61bc，方案正身=cto-implementation-plan.md v3 @ afb0180c，判定件 v3 @ 9bd40491）
- syncMode: working
- lastSyncedAt: 2026-09-28T02:34:15Z（date 现查，10:34 +0800；接令排程件）
- 席位: STE 小柯（m-ste）；拆派=COO（测试族：执行单 §一.6+验收锚测试化）
- 验收门: A5=测试族全绿+CTO 架构门审签发

## 一、测试范围

| 对象 | 内容 | 来源 |
| --- | --- | --- |
| §一.6 测试族 | API 族单测+cache 泛化单测（TriModel cards 端点族+TriMLC/TriRLC config-cache） | 执行单 §一.6 |
| A1 | 泛化端点四 face 可达实测+trimmc-card 别名零破坏回归实测 | 执行单 §二 |
| A2 | 本机两卡（mlc/rlc）config pull 视图实测+face-events 四族事件 len-only 核验 | 执行单 §二 |
| A3 | 备份轮换实弹：卡写→备份生成→轮换序→审计行全程留痕 | 执行单 §二 |
| A4 | CLI config 族×网页×API 底表逐格核 | 执行单 §二（候 CPO 功能项清单对表时点，未定形先按方案 §5.2 底表） |
| A5 | 测试族全绿全量读数+CTO 架构门审签发=本席放行门 | 执行单 §二 |
| A6 | revert 演练：泛化层纯新增单 commit 回滚实测 | 执行单 §二 |

不涉：R-HY（本单禁碰）；sg/河源面（P1）；UI（P2）。

## 二、测试策略（三层）

- **L1 单测层**（随 FSD 实现节点走，接口对表后落 TriModel/TriMLC/TriRLC 各 test 目录）：
  - **API 族矩阵**：4 face（mmc/mlc/rmc/rlc）× 5 端点（`GET cards/{face}?view=managed`、`?view=pull`、`PUT cards/{face}`、`PUT cards/{face}/status`、`POST cards/{face}/apply`）× 鉴权态（admin token 正常/未配 TRIMODEL_ADMIN_TOKEN=503 fail-closed/api-token 通配=P0 过渡态断言）+边界：{face} 不在册=404（防枚举）、view 参数缺省与非法值形态、status 回写值域（applied|failed 外拒）。
  - **别名零破坏双证**：①现有 trimmc-card 测试套**零改动全绿**（回归面）；②新增别名↔泛化等价断言（同卡态下 `/v1/config/trimmc-card` 与 `/v1/config/cards/mmc` 响应语义逐字段等价）。
  - **cache 泛化单测**（TriMLC/TriRLC 同构各一套）：拉取载荷→域内重加密（PBKDF2 域指纹）落盘→读回等价；24h expiresAt 过期判定；**域不匹配 cache=无效丢弃直落 tier3+告警读数**（§3.3 不变量三）；判梯序三态（tier1 可用/tier1 败→tier2 LKG→tier2 败过期→tier3）；15min stagger 刷新节奏。
  - **回写归因码**：pull_denied/decrypt_failed/apply_rejected 三码形态与台账/徽章同显。
- **L2 验收锚实测层**（沙箱实弹，A1-A4+A6）：
  - **A1**：沙箱 server 实例（独立端口+`TRIMODEL_DATA_DIR` 钉 tmp）四 face 端点可达；别名回归双证（上）。
  - **A2**：两卡 config pull 视图实测（**沙箱卡+沙箱实例**——view=pull 落拉取台账系写行为，不在活体 3333 做；活体仅 `?view=managed` 只读抽验且不落台账路径）；face-events jsonl 四族事件（pull/write/apply/status）各≥1 行+顺序合理+**len-only 值面核验**（逐行 JSON.parse 递归扫描值面：`sk-` 前缀键材/条目明文内容零命中——键存在性抽验≠值面验证纪律，len-only 断言打在值面）。
  - **A3** 备份轮换实弹：沙箱临时卡 6 连写→备份数=5（keep=5 轮换）→**备份名唯一性断言（`bak-<ts>-<pid>-<seq>` 唯一性后缀形态——LG-054 族③ io-kernel 同毫秒覆盖教训直引，同毫秒双写零覆盖为本案硬断言）**→FROZEN-BACKUPS 哨兵豁免在位→幂等短路→每写对应审计行。
  - **A4**：底表逐格核（功能项×网页×API×CLI），候 CPO 清单定形对表；未定形先按方案 §5.2 六行底表核 CLI 实现面。
  - **A6 revert 演练**：泛化层单 commit `git revert`→三仓全量门复跑→别名端点照常存活→revert 本身再 revert（演练复原，不留分叉）。
- **L3 全量门层**（A5 门）：TriModel+TriMLC+TriRLC 三仓 `npm test` 全量读数与各自修前基线对平（既有失败逐族归因，禁只报增量）；全绿后呈 CTO 架构门审签发=放行。

## 三、边界条件与关键风险（测试视角）

| # | 风险/边界 | 测试对策 |
| --- | --- | --- |
| T1 | 泛化伤现役 trimmc-card 消费方（方案 R1） | 别名双证（L1）+三仓全量对平（L3） |
| T2 | pull 视图明文键暴露（方案 R5） | view=pull 仅响应生命周期断言+face-events len-only 值面扫描+日志面无键值断言 |
| T3 | face 校验防枚举缺口 | 不在册 face 404+枚举串形态用例（大小写/空/路径穿越串） |
| T4 | 备份同毫秒覆盖（LG-054 族③同族缺陷复发） | 唯一性后缀硬断言（A3），同毫秒双写实弹 |
| T5 | 域锚跨机误用复发（方案 R3） | 域不匹配 cache 丢弃落 tier3 用例+域核验步读数固定项 |
| T6 | P0 通配鉴权态被误当收敛态 | 通配断言显式标注「P0 过渡态」，收敛绑定=P1 另测（防测试面给假保证） |
| T7 | 活体生产面污染 | 全部写实弹在沙箱实例+沙箱卡；活体 3333 只读 managed 抽验上限（不落台账） |

## 四、与 FSD 实现节点接口对表需求（候 FSD 定稿时随卷对表）

1. **测试 seam**：`TRIMODEL_DATA_DIR` env 可钉 tmp（face-ledger.json/face-events jsonl 落点随它）；卡文件路径可参数化（沙箱卡）；server 实例可独立端口起停（createServer 同族 in-process 形态）。
2. **face registry 常量导出面**：`FACES` 四元组可 import（单测直接对表 registry，不硬编码重复）。
3. **face-events schema 定稿时点**：四族事件字段形态（ts/face/etype/len-only 附加字段）——L1 用例依赖 schema 冻结。
4. **归因码枚举**：pull_denied/decrypt_failed/apply_rejected 常量导出。
5. **CLI config 族命令面**：A4 对格需要 bin 挂族定稿（正名 bin+旧别名过渡策略）。

## 五、排程（正常工时，与 FSD 备测并行）

| 窗 | 工作 | 依赖 |
| --- | --- | --- |
| NOW（FSD 备测期） | 本方案件落卷；现有 trimmc-card 测试套基线读数固化（别名双证的「修前」锚）；L1 用例骨架按方案 §二先行（对表 §四 seam 后填充） | 无（可并行） |
| FSD 实现节点交付 | §四对表核验→L1 填充跑绿→L2 A1-A4 实测 | FSD 交付+seam 在位 |
| 实测窗尾 | A6 revert 演练→L3 三仓全量读数→A5 门呈 CTO 签发 | 前两窗毕 |

## 六、纪律

- 活体 card/settings **禁写真数据**：实弹全在沙箱实例+临时卡；活体 3333 仅只读抽验。
- 全量读数回报：完工回报含三仓全量四项读数+既有失败逐族归因。
- 节点收口件（LG-057 试点）：每节点回报带时点（date 现查）+回执 id+done。
- 阻塞性缺陷即报 COO+CTO，不自裁放行。

## 七、修前基线锚（NOW 窗固化，2026-09-28 10:3x +0800；FSD 动笔前现跑）

| 仓 | 读数（总/过/败/跳） | 既有 fail 逐族归因（4 族） |
| --- | --- | --- |
| TriModel | **286/271/0/15** | 零 fail（今晨现势，LG-054 卷 §七 D 形读数直引） |
| TriMLC | **599/594/5/0** | ①`test/integration/replay-flow.test.ts` 文件级：`ERR_MODULE_NOT_FOUND D:\Code\ai\TriMC\src\comm\arbitration.js`——**TriMC 旧名路径残留**（改名迁移残留，LG-054 族①同型）；②`test/tui/components.test.ts` 文件级：`Cannot find package 'ink-testing-library'`——devDependency 缺装；③P0 通道一/二 HTTP 全局门（auth-gate-rejection）：子案「e1 /healthz 精确豁免」fail——鉴权门族；④FADE-ASSESS-005 两案（roster-gating-http）：子案「ownerRoleId 未上岗 409」+「ASSESS-003 metrics routing_error 计数」fail——值班派工门禁族 |
| TriRLC | **644/639/5/0** | 同构镜像：not ok 清单与 TriMLC **逐位同构**（同名文件同族），归因平移①-④ |

- **相关性判定**：四族均不触 LG-058 P0 改动面（key-cache→config-cache 泛化/卡面 API/face-events）——基线锚有效。
- **改后对平判据**：三仓 fail 集合⊆本基线集合（同族同数）=零回归；任何新增 fail=回归即查，禁转抄「既有」定性须独立验。
- **挂账候选（非本单，owner 另议）**：TriMC 旧名残留（replay-flow.test.ts）与 ink-testing-library 缺装两笔，随下一节点回报呈 COO。

## 八、CTO 门审清单 G1-G10 对表映射（5c60b084 落树知会后补；A5 门审备测对表，减少返工）

| G 项 | 本席测试面映射 | 增补动作 |
| --- | --- | --- |
| G1 face registry | L1 API 矩阵+§四.2 registry 常量导出对表 | — |
| G2 泛化端点+别名 | L1 矩阵+别名双证（A1） | — |
| G3 鉴权双层 | L1 矩阵鉴权态（503 fail-closed/P0 通配态 T6 显式标注） | — |
| G4 域锚不变量 | L1 cache 泛化（域不匹配丢弃落 tier3/三归因码）+A2 | — |
| G5 备份轮换 | A3 实弹（keep=5+哨兵豁免+幂等+唯一性后缀硬断言） | — |
| G6 face-events | A2 len-only 值面核验 | — |
| G7 CLI config 族 | A4 对表 | **增补负断言：CLI 不开卡写面**（CLI 命令面无卡写通道+写端点无 CLI 路径实证） |
| G8 两卡接入 | L1 两仓 cache 单测+A2 pull 实测 | — |
| G9 revert 单 commit | A6 演练 | **增补 diff 断言：泛化层 commit 不触老路径文件**（git show --stat 逐项核） |
| G10 部署重启纪律 | 重启归 FSD/SDE 执行面（TriLC 重启纪律：权威路径+pidfile 按 port+禁裸杀） | 本席核验项：重启后两 daemon healthz 留痕读数入 L3 卷 |

## 九、FSD N1+N2 交付对表（2026-09-28 午；实现锚=TriModel 43086ff，8 files +840/-1 独立实勘吻合）

- **seam 四项实勘过四**（card-faces.ts 源码面对照，非转抄自述）：①dataDir/faceCardPath 双钉位（DATA_DIR/CARDS_DIR）✓ ②FACES/FACE_IDS/isRegisteredFace 导出 ✓ ③FaceEvent schema `{ts,face,etype,result,detail,reason?}` 冻结 ✓ ④ATTRIBUTION_CODES 三枚举 ✓；⑤CLI bin 候 N4（A4 对格挂起）。
- **FSD 22 案（test/config-cards.test.ts）覆盖 L1 矩阵主面**：防枚举 404（T3 形态族）/view 形态/managed 鉴权三态/pull 鉴权三态（fail-closed+P0 通配+FACE_TOKENS 绑定）/载荷语义（禁用不进+明文仅响应生命周期）/台账/守卫五案（T4 同毫秒唯一性硬断言在位）/别名逐字段等价（A1 双证②）/status 台账同步/apply 审计/len-only 全账扫描。本席 L1 增补面收敛为 3 案：status `failed` 合法值（值域全覆盖）/decrypt_failed 布景（坏密文卡→warnings+skipped 计数）/apply 失败布景（非 200+零 ok 审计行）；cache 泛化单测候 N3（TriMLC/TriRLC 仓）。
- **对表发现（呈 CTO 门审裁，非阻塞）**：`decrypt_failed`/`apply_rejected` 两归因码**枚举导出但泛化层无 emit 点**——decrypt 失败走 warnings+skipped 计数进 detail（审计 result=ok，L127-150）；apply 非 200 透传无审计行（L205-215）。fail-closed 主语义达成（跳过+告警不静默猜），缺的是两码归因粒度；候裁：补 emit 点或方案 §二 L1「三码形态」降维为「一码 emit+两码行为面形态」。
- **全量独立验**：首跑 600s timeout 残局作废（19 cancelled+usage.test.ts 0xC0000142=杀进程波及形态，禁当 fail 计——命令链断言纪律：跑完才有效）；r2 后台重跑在途（Monitor 护汇总），读数归卷候下节。

## 十、全量独立验 r2 读数与 UI E2E 6 fail 归因（2026-09-28 午后）

- **r2 有效读数（跑完整，cancelled=0）**：TriModel @43086ff **308/287/6/15**（1916s）。FSD 自述 308/293/0/15，差=6 fail 全部集中于 GATE UI E2E 族：E5/E7/E8/W1/W2/W4。
- **6 fail 逐案形态**：`page.goto/reload/screenshot Timeout 30000ms`（Playwright 超时门），**零断言失败**；同 suite 7 案 pass（E1-E4/E6/W3/W5——server/浏览器活体在位）；suite 总时长 1727s。
- **环境型定性（三重证据）**：①同 HEAD（43086ff）FSD 自测全绿 293 pass=287+6 数学吻合（11:52 前后轻载窗）；②r2 六案全 TimeoutError 形态（代码回归应为断言失败形态）；③单文件复验跑（同午）`browserType.launch: Timeout 180000ms`——浏览器冷启动都超时=机器负载活体持续佐证（13 席常驻+daemon 重载机）。
- **复验经过如实记**：单跑命令缺 `--test-concurrency=1` 与 npm script 不同构（教训：复验方法须与原跑同构）；修正后仍不可达——launch 180s 超时，**复绿实证在本机现势负载下不可取**，不谎称复绿。
- **对平判定（本席）**：fail 集合⊄基线（形式破平），归因=环境型、非 43086ff 代码回归；定性成立但复绿实证候窗。**候 CTO 裁（L3 执行窗形态）**：(a) L3 全量门排轻载窗执行；(b) UI E2E 超时裕量 bump（goto 30s/launch 180s 无重试无裕量，重载机高 flaky）；(c) UI E2E 独立于 L3 全量门另窗跑。本席荐 (a)+(b) 并做，(c) 备选。
- **L1 增补案布景依据已勘**（落笔下节点）：decrypt 失败布景=有效 base64 非法密文（GCM auth fail 必 throw，key-encryptor.ts L59-67）；apply 失败布景=无卡 404（L238）/无活动策略 400（L242）双形态。→ **已落笔跑绿（本席更新）**：`test/config-cards.ste.test.ts` @ TriModel **54eeaab**，3/3 一跑全绿（2026-09-28 14:2x +0800；案②③固化两码无 emit 点现势形态断言，候 CTO 裁后随裁更新）。

## 十一、CTO 两裁采认与裁 2(b) bump 实施（裁定卷 de6d49f8；2026-09-28 14:2x-14:3x +0800）

- **裁 2(b) bump 已实施**（TriModel @ **86fdec2**）：四点定位=r2 六案超时门实测反查（launch L127 默认 180s→**360s**；goto freshPage L146 单点覆盖 E5/E7/W2/W4，30s→**60s**；screenshot L285 30s→**60s**；reload L347/L398 30s→**60s**）。验证形态=tsc 门绿+E1 单案活体过（重载机现势下 bump 参数生效，launch/goto 均未触新限）；六案真值复绿+实际耗时分布候晚间轻载窗（COO 排程，窗位候 FSD 全交付时点固化）。
- **复绿判据（CTO 口径转录）**：轻载窗+bump 后六案零超时**且不贴限**——贴新上限（goto 60s/launch 360s）=仍脆非复绿；A5 呈报材料=r2 归因卷（§十）+复绿读数+六案耗时分布全卷。(c) 独立另窗留升级判据：(a)+(b) 复跑仍超时再议。
- **裁 1 联动面（本席测试文件）**：案②（decrypt_failed 行为面）=**定案形态**（裁 1 乙：server 侧不补不降维，注释已定案化 @ 86fdec2）；案③（apply）候 FSD N3-N5 补 emit 后随裁更新（apply_rejected 事件断言加入）；案①（status failed）系 200 正常路径审计案，非 200 emit 补丁不触及——COO 附注「案①随裁更新」按此澄清，案①断言不变。
- **勘正知会入卷**：pull_denied 在役有 emit（CTO 勘正）——本席 §九 表述口径即两码（decrypt_failed/apply_rejected），无三码全缺歧义；知会收讫。

## 十二、BOD 哨裁两固定项入卷 + FSD N3 对表（COS 转达 2026-09-28 15:46；N3=4d8e735）

- **固定项①（BOD 令）**：`bak-20260927-2325-pre-fullflash` 双重身份（生产 policies/local.json 恢复源+本席 A5 证据）——**A5 卷收口时「该 bak 保留必要性」列入确认面**；清场流程升格=STE 确认→BOD 双确认→方可清。本席侧义务已挂 A5 收口清单。
- **固定项②（BOD 令）**：「E2E 禁触生产路径」硬断言入 STE 固定项——栅栏要求自本令起属固定项非候选项。**落地面已勘**：FSD 族1 整改链（7f8ba7e 卡面钉沙箱+9d47ceb boot migrate seam+4d8e735 策略面 belt 全撤）已实现栅栏本体（UI E2E bootServer 三钉位：TRIMODEL_POLICIES_DIR 钉 workDir/TRIMODEL_DISABLE_BOOT_MIGRATIONS=1/TRIMODEL_CARD_FILE 钉 workDir）；**A5 复验核验项增补：栅栏在位值面验证**（bootServer env 三钉位断言+仓根活卡/活策略零接触实证）。TRANS_LOG belt 残留 2 套件与 server 侧 snapshot-protocol 同型面候勘时一并上栅栏（候勘联动项在卷）。
- **FSD N3 对表（4d8e735，本席文件面）**：①案③更新系 FSD **代执行**（走本文件 L10 预授权条款）——断言改「恰一条 failed 审计行 reason=http_404」，与裁 1(甲) emit 形态吻合（wrapper 鉴权拒=denied/admin_auth，delegate 非 200=failed/http_<code>；apply_rejected 留 daemon 侧语义不冒用）——**对表追认**；②案①②未受 N3 触及（200 路径/decrypt_failed 定案形态）✓；③本席 bump 四点在位（L132/L146/L285/L347/L398，belt 撤除零触碰）✓；④STE 3 案复验 **3/3 全绿**（15:5x +0800，N3 树上现势）。
- **注记**：N3 动 policy.ts（评估序投影+8 行）与 keys.secure/policy.gate.e2e/proxy.gate 四测试件——全量基线读数变化候晚间 L3 窗全量门见真章，本席 §七 基线锚对平判据照旧适用（fail⊆基线+归因独立验）。

## 使用依据

执行单 d9df61bc（§一.6/§二/§三/§四全读）；cto-implementation-plan.md v3 @ afb0180c（§2.1/§2.2/§2.3/§三/§四/§5.2/§十 两 P0 确认/§十一 v3）；判定件 v3 @ 9bd40491（commit 题录）；COO 拆派令（2026-09-28 10:33 hook）；LG-054 族③教训卷（ste-crossmachine-base-adaptation.md §二/§五，唯一性后缀直引）；工作区记忆条：全量读数回报/键存在性抽验≠值面验证/命令链断言。
