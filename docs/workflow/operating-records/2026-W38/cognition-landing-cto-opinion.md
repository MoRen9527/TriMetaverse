# 认知层落点归一·CTO 技术域意见（CPO×CTO 联审·v2）

- sourceOfTruth: 本件（CTO 技术域三命题：①落点归一工程路径②五件套声明批量修订④死层处置；产品域命题③命名+合流归 CPO）
- syncMode: draft（联审稿 v2；与 CPO 合流后呈 CEO）
- lastSyncedAt: 2026-09-19T00:5x+0800（date 现查 00:57:39，本回合执行）
- **v1→v2 勘正**：v1 实勘对象误为 `D:\Code\ai\TriCompany-copilot-host-assets`（非 git 裸目录老快照——第三棵树，见 §三.4）；本 v2 全部实勘对权威位 `TriMetaverse/TriCompany-copilot-host-assets/` 重验，并纳入 CPO 两笔勘误+双腿登记裁决

---

## 〇、实勘基线（v2 权威位重验+事实包校准）

| # | 事实 | 实勘读数 | 影响 |
|---|---|---|---|
| F-1 | COGNITION_HOME 消费面两类 | ①声明面：13 席合同件+`employee_source_kit.py:553/576`（required marker+节内落位硬检查——**改声明不同步 validator=13 席全红**，tools 退役同族教训）；②运行面：`TriCompany/runtime/cognition/kernel/` 九件活代码（build_kernel 读 env 落盘 shared/audit；05-24 时戳，含 **wiki 四件**） | 命题 1 含 kernel 维度；命题 2 必须 validator 联动 |
| F-2 | **host-assets/runtime/cognition=37 项结构化目录树**（providers/runners/tasks/kernel/contracts，最新 providers 08-10）——非「30 个平铺死脚本」 | governance 正身 `tricompany-copilot-host-assets-governance.md:105-111` 已定性：**宿主 runtime/vendor=承接已发布副本+宿主验证辅助的合法位**，真源=TriCompany/runtime/cognition（源侧 kernel 与宿主 kernel 同名件=真源/发布副本关系）。**命题4 该项从「归档死层」改判「甄别+副本治理」**（判据=:107：有源侧对应物=合法副本随管线；无源侧对应物=COS 死自动化滞留→死层候选） | 甄别工作量=逐项对照源侧，非一刀切 |
| F-3 | knowledge/employees=15 目录=13 有效席+2 脏（`randd-trainer` 旧名残留/`project-trainer` 名册无此席）（CPO 勘误，权威位复验吻合 ✓）；DE runbook `employees/deployment-engineer/inbox/windows-seat-remote-control-runbook.md` **实存**（CPO 二次勘误 ✓） | 入命题 4 清单 | §三 |
| F-4 | **第三棵树坐实**：`D:\Code\ai\TriCompany-copilot-host-assets` 非 git 仓根（裸目录老快照，knowledge/employees=11 与权威位漂移 4 项）——拷贝散落→真源漂移的活标本 | 入命题 4+副本卫生总注记 | §三.4 |
| F-5 | 死残留数据质量：`org/shared.md` 尾部=W29（07-14）daily-close+next-actions，**中文乱码损毁**（保史不保读）；权威位与 TriCompany 侧两处 `.tricompany-cognition/` 各 3 文件同构 | 归档档位 | §三 |

## 一、命题 1：落点归一——**认同 CPO B 案+双腿登记**（技术依据如下）

### 对双腿的裁决：**认同，且有技术硬依据**

双腿=运行腿（`.tricompany-cognition` 机器写入运行态：kernel shared/audit/回忆上下文）+学习腿（`knowledge/` 策展资产：inbox/wiki/workbench+org/roles）。技术依据三条：
1. **两类数据的保留策略本质不同**：运行态=机器高频写、可滚动/低保留/gitignore 候选；策展态=人+管道策划、版本管理、长期资产。混一树则 git 卫生互相污染（kernel 复活后每次 sync_turn 都会弄脏 knowledge 树 status）。
2. **既有先例同构**：LG-036 letter-store（daemon 信箱）已是「运行态独立于策展资产」的现役实例——双腿是既有架构语法的延续非新发明。
3. **kernel 零改动**：build_kernel 读 env 解析运行腿落点，双腿下 env 语义不变，复活即用；学习腿管道（p2 digest daemon）写 knowledge——**两腿各归各位，互不改造**。

**单一真源红线自查**：双腿是「两类数据各归其位」，非「同一数据两处真源」——运行腿真源=kernel 运行产出（其代码真源在源侧 runtime/cognition），学习腿真源=knowledge/ 策展流。红线不破 ✓。

**对 v1 自我修正一条**：v1 曾提「env 值域重定义指 knowledge 根」——与双腿冲突，**撤回**；改采：`TRICOMPANY_COGNITION_HOME` 语义=运行腿根（原义保留），学习腿在合同声明中独立成句（knowledge/ 直书路径）。契约双声明（CPO 口径）落地形态见 §二模板。

### A 案否决理由（维持 v1，对 CEO 条件句的显式回答）

「knowledge 放入 .tricompany-cognition 合适的话可以放」——实勘结论=**不合适**：①活体迁移成本>语义收益（15 目录×四区×多消费者+p2 全部路径基线）；②迁移=实质翻 p2 定稿路径（违任务书边界）；③双腿已实现语义归一，无需路径搬家。

## 二、命题 2：五件套落点声明批量修订（双腿双声明版）

**合同「运行资产落点」节改写模板**（13 席同构）：

> 运行资产落点分两腿：**运行腿**=机器写入运行态（认知 kernel 产出），由 `TRICOMPANY_COGNITION_HOME` 解析（现役默认 host-assets 下 `.tricompany-cognition/`，kernel 复活时初始化）；**学习腿**=knowledge/（`TriCompany-copilot-host-assets/knowledge/`），员工实例资产=knowledge/employees/<席>/ 四区（inbox/wiki/workbench/audit）。

**改序=双窗过渡（推荐）**：
- 窗 1：validator 双兼容（新双声明锚在节内=PASS；旧单标记在节内=PASS+deprecation warn）；
- 窗 2：13 席源侧批量改（≈40 文件文本）→重渲→跑门全绿；
- 窗 3（下批）：validator 收窄只认新锚，旧标记入 missing。
- 备选单批硬切可执行（一窗闭环，回滚锚同）；量级=一人一日内。回滚锚：源侧单 commit revert+重渲产物在版本库。

## 三、命题 4：死层处置（v2 逐项定案）

| # | 对象 | 定案 | 执行要点 |
|---|---|---|---|
| 1 | `TriCompany/.tricompany-cognition/`（07-14 停） | **归档** | git mv → docs/archive/cognition-run-2026-07/ +README 头注（停跑时点/kernel 指路/乱码如实注记）；W29 next-actions 系历史叙事有正式账，不抢救 |
| 2 | 权威位 `.tricompany-cognition/`（04-20 停） | **归档** | 同上分代目录（-2026-04）；运行腿落点声明保留（kernel 复活时初始化新目录），归档的是死数据非腿位 |
| 3 | 权威位 `runtime/cognition/` 37 项 | **甄别+副本治理（非归档）** | 判据=governance:107：有源侧对应物→合法发布副本，随发布管线更新（不动）；无源侧对应物→COS 死自动化滞留→死层候选归档。甄别产出=逐项清单挂方案执行件（预估多数为合法副本——kernel/providers/runners 结构化树系宿主验证辅助） |
| 4 | **第三棵树** `D:\Code\ai\TriCompany-copilot-host-assets`（裸目录老快照） | **归档或删除（候 CEO 二选一）** | 与 sg 部署副本口径对齐（部署副本≠权威位）；其 knowledge/employees=11 与权威位漂移 4 项=已失同步无增量价值初判，删除前抽查两差异目录（employees/runtime/vendor）确认零独有内容 |
| 5 | 脏目录 `randd-trainer/` | **更名或归档** | 若内容=rd-trainer 旧名期资产→更名 rd-trainer/ 归位；若空壳/重复→归档。执行时内容二查一定 |
| 6 | 脏目录 `project-trainer/` | **归档** | 名册无此席；内容若含 project_trainer_host_object_generation 线索件→归档区+缘由注记（该验证件在 TriCompany/runtime 活着，目录只是载荷位） |
| 7 | DE runbook `employees/deployment-engineer/inbox/` | **收编** | runbook 实存（F-3）——迁 knowledge/employees/deployment-engineer/inbox/（学习腿语义恰位）；顶层 employees/ 派送目录清空后删除，DE 操作注记改指 |

**副本卫生总注记（联审方案常设条）**：今后任何宿主资产复制**须走发布管线留痕**（发布 commit+manifest 登记），禁手工拷贝散落——本次第三棵树+两代 .tricompany-cognition 死残留同族根因（拷贝散落→真源漂移），与 governance 件:107-108 精神一致，建议升格为 governance 件明文条（候批）。

**红线自查**：活件勿伤 ✓（TriCompany/runtime/cognition 活验证件族不在处置域）；无第三真源 ✓（归档区=史料非真源）。

## 四、命题 5：与 hermes-gov-p2 衔接声明

| p2 定稿项 | 关系 |
|---|---|
| 消化管道四段 | **兼容零修订**（学习腿路径不动，全段照跑） |
| 两轨分层 | 兼容；双腿登记使分层更精确（运行/学习/公司三层各归位） |
| kernel wiki 四件 | **收编建议**：源侧 kernel 九件（含 wiki_page_registry 族）系完整实现——p2 管道 wiki 对接段实现时优先评估收编底座（勿重复造轮），衔接说明候 p2 转正身并入 |
| 六验收锚 | 不受影响（锚行为非路径） |

## 五、给 CPO 的接口面（合流待定项）

1. 命名三概念定案（学习 inbox/通信 letter/派送 dispatch 候名）——技术零阻力；
2. 归档区路径语（docs/archive/ vs legacy/）；
3. 双窗 vs 单批节奏（技术推荐双窗）；
4. 第三棵树归档 or 删除（CEO 二选一，技术面两案都给）；
5. p2 转正身时 kernel 收编建议并入门。

## 六、使用依据

- 任务书 20260919-cognition-knowledge-landing+BOD 两笔补充（CPO 勘误/第三棵树）
- CPO 件 trees/cognition-landing/cpo-view.md（fa5f7a71，B 案+双腿登记）
- 权威位实勘（本回合五组）：COGNITION_HOME 消费面两类/kernel 九件清单与 wiki 四件/37 项目录树与 governance:105-111 定性/15 目录与两脏/DE runbook/第三棵树非 git 形态
- governance 正身 tricompany-copilot-host-assets-governance.md（发布副本判据）
