# BB-2 汇总件——B3/B4 打样批联审（树协议回归首航）

> 汇总=MMC 值席代行 COO 汇总位（B2 先例=COO 汇总 COS 联签；夜航窗口常驻 COO 席 m-duty-coo 未入本轮派工——席位形态如实标注，候 BOD 复核）·时点 2026-09-14 04:2x +08
> 程序位=审（本批零改动）；汇总依据=五席独立意见件全读（bb1-cos/cto/cao/cpo/bs 共 493 行）·呈 BOD
> 批次元数据（CFO 批毕切账闸门供料）：批号 B3/B4-打样（LG-034 B3 全量+B4 首批 18/169 件）·时点 2026-09-14 03:53-04:2x +08·五席出席形态见 §一

## 一、联审概况与出席形态

| 席位 | 出席形态 | 意见件 | 行数 | 表态分布（PASS/建议/挂起） |
|---|---|---|---|---|
| COS | spawn 代理（COS 无 sg 常驻席——席位矩阵 12 席无 COS，**发现**） | bb1-cos-opinion.md | 92 | 7/8/5 |
| CTO | m-duty-cto 常驻席 M-004 直达 | bb1-cto-opinion.md | 96 | 9/11/0 |
| CAO | m-duty-cao 常驻席 M-004 直达 | bb1-cao-opinion.md | 99 | 9/8/3 |
| CPO | m-duty-cpo 常驻席 M-004 直达 | bb1-cpo-opinion.md | 121 | 6/14/0（子项挂起 3） |
| BS | spawn 型（V0.2 基列制明示形态） | bb1-bs-opinion.md | 85 | 5/15/0（挂起子项 1） |

- 全量表态覆盖：B3 2 件+B4 18 件=20 件 ✓（五席各 20 行表态表齐，无意见件均有明示）。
- 独立性：五席均声明零接触他席稿（禁读约束执行）。
- 首航打样读数：值席首发 4 席误用 spawn 后停发改 M-004 直达（V0.2「spawn 仅限三残留场景」纠偏）——**树协议回归首航的过程修正即打样产出之一**；COS 席无 sg 常驻席为席位矩阵缺口（候 BOD 排期补位或明示 COS 出席形态豁免）。

## 二、跨席收敛项（按共识强度排序）

### 共识-1（5/5 席独立收敛）：CAO 席工作名四载体两态
- soul/contract「待命名」vs social「小行（CEO 正式命名 2026-08-01）」vs D-13 宪法表 CAO 别名列空缺 vs employee-roster.json instanceName=小行。
- **处置分歧如实登记**：CAO 席+COS 席主张候 CEO（命名存废=保留权面②+CAO 利益相关回避）；CPO 席+BS 席主张事实回填（宪章 V1.0 名册已载小行=回填非新授权）。
- **汇总裁定**：按红线②从严——挂起候 CEO 一裁四追平（少数意见「事实回填」随案留痕，CEO 可采快速通道）。

### 共识-2（5/5 席）：contract v3 runtime_baseline 段陈旧（两席同形=系统性）
- host: copilot-host/tri_mc_status: planned/migration_ready: false 与现役双宿主+TriMMC 在役事实不符；B1 首件（business-strategy）已立五字段新口径（m_plane_runtime/r_plane_runtime/service_domain/local_domain/host_switch_plane）。
- BS 席判「欠账非分歧」：13 席一致性处理归 CHO 合同面+CTO 管线面合办（候批执行项）。

### 共识-3（5/5 席同意）：CLAUDE.md:60 定性修正（rides B3 登记面）
- 五席全部同意修正方向（design document→中央摘要+宪章真源指针）；CPO 席交终版措辞、BS 席交英文行方案+同族 :22 联动建议——**措辞两案并呈候 owner 择一**（见 §五）。

### 共识-4（3/5 席独立收敛）：AGENTS.md L74-76 机器级 agent_type 退役名
- FullStackDeveloper/TestEngineer→FSD/STE（D-13 条4 勘误 2026-09-03 退役）+L76 CEOChiefOfStaff→TriCompanyCEOChiefOfStaff（CAO 席 ListAgents 现役名册 04:0x 实证三新名在册/三旧名不在册）——按现行文执行机器路由即落 fallback 支线（CTO 席判「本批最重要」）。

### 共识-5（4/5 席）：CTO 壳/身/契内容漂移（组装源不明）
- 入口壳 7 条（含 CodeGraph）vs agent-body 6 条；contract instructions 两条独有；CAO 壳缺开场白 intro 段——派生同步机制失效信号（CPO 席判=渲染债归零纪律应处理对象）。COS 席挂起 G2：设计行为 vs 漂移不裁定，候 CTO 席/结构标准 §3.2 owner 出对表结论。

### 共识-6（5/5 席观察到）：agent-frontmatter.agent.md 空件两席同款
- 处置两案：BS 席=按 B1 description 唯一定义点制补投影内容；COS/CAO 席=候裁（占位预期 vs 缺陷）。归共识-5 同域（结构标准 §3.2 对表窗）。

### 共识-7（3/5 席）：CTO supervises=[] vs colleagues 四人 vs agents-md 两人（三口径）
- CPO 席挂起候裁①：裁决依据=授权矩阵（治理域非产品语义可定），裁后三处追平。

### 共识-8（5/5 席）：CAO memory:19 行政流程记录落点悬空
- `TriCompany/docs/execution/administrative-records/` 双仓 find 零命中（CTO 席 D-18 双方法复核）——初始化目录或改标「候初始化」。

### 共识-9（2/5 席，域内自证可判）：CAO 治理真源方向倒置
- agent-body/memory 以 TMV 侧 company-governance-state.md 为真源首位，session-body（对表基准件）明定「源=TriCompany 侧/TMV=字节级副本」——CAO 域内部自证矛盾（CPO 席判「无需外部裁决」，批内可执行修正）。

### 共识-10（2/5 席）：contract paths 缺 session_body 键（两席同形）
- D-16 三面管线表明载 session 面真源=合同 sessionBody，paths 六键未含第七件实存——D-18-2 引用面与实存面对齐族。

## 三、席间分歧与勘验冲突（汇总裁断）

| # | 事项 | 冲突 | 汇总裁断 |
|---|---|---|---|
| 1 | AGENTS.md:88 instructions 落点 | BS 勘「名下无物」vs COS 勘「TriCompany/.github/instructions/ 唯一定位」 | **值席复核：文件实存**（`/srv/fleet/TriCompany/.github/instructions/ceo-chief-of-staff.instructions.md` ls 通过）——COS 读数正确；BS 误差根源=glob 不扫 `.github` 隐藏目录（勘验方法注记入档）。修改建议采 COS：补路径前缀 |
| 2 | CAO 工作名处置 | 候 CEO（CAO/COS）vs 事实回填（CPO/BS） | 按红线②候 CEO（§二共识-1），少数意见留痕 |
| 3 | L60 措辞 | CPO 终版（中文行+附录防误引尾注）vs BS 英文行方案 | 两案并呈，owner（CLAUDE.md 真源域=COS/FADE-002 链）择一执行 |
| 4 | CLAUDE.md:69「(primary)」口径 | COS 判「语义兼容无需再裁+可选小修」vs BS 建议改「发布位/入口位」口径 | 归 §五候批执行清单可选项（CEO 2026-09-11 晨报裁定已追平宪章侧，入口侧对齐属文案级） |

## 四、三红线执行清单

**红线②候 CEO（1 项）**：
- E1｜CAO 席工作名四载体（共识-1）——CEO 定谳「小行」存废；存则 soul/contract 追平+D-13 表补录+D-07 通道发布；废则 social 勘误。

**红线①挂起候裁（6 项）**：
- H1｜空件定性+壳/身/契组装差异（共识-5/6 三现象合并）——候 CTO 席/结构标准 §3.2 owner 对表结论。
- H2｜runtime_baseline 处置通道（共识-2）——删段移交 binding profile vs 五字段换代，候结构标准 owner+CHO/CTO 合办（13 席一致性）。
- H3｜CTO 监督跨度三口径（共识-7）——候 CompanyGovernanceRegistry/授权矩阵裁现役名单。
- H4｜AGENTS.md SOO 位序 vs 中央 BS 信息源优先级（BS 席）——候 agents-md owner 与 BS 会商。
- H5｜员工数口径 13 vs 15 席（CPO 挂起③+CAO 附带：D-13 标题仍「14 席」）——候 CAO 席名址域对表（13 员工/15 正名席/14 席标题三数并存）。
- H6｜D-27 与 B3 真源衔接缺口（CAO 席 §四：CLAUDE.md 零承接+两套树协议并存无关系声明）——**转正后补**（CTO 会签前不动，批准记录明载「签后本条生效转正」）。

**红线③豁免**：本批 20 件无历史冻结件命中（2 lowercase 孤儿件系 LG-034 挂起④在案冻结，不在本批靶标）。

## 五、候批执行清单（共识成立，候 BOD 放行执行窗；本批程序位=审零改动）

1. CLAUDE.md:60 定性修正（5/5 同意；措辞两案见 §三-3）+agents-md:22 同族联动——真源改+FADE-002 管线发布，小修通道。
2. AGENTS.md L74-76 agent_type 三处退役名→现役名（3/5 收敛+名册实证）——同 FADE-002 窗。
3. CAO 治理真源方向三处追平（共识-9，域内自证）——D-07 通道。
4. 两席 contract paths 补 session_body 键（共识-10）——D-07 通道。
5. CAO memory:19 落点处置（共识-8：初始化目录 vs 候初始化标注）——CAO 域。
6. 可选小修集（文案级）：L104 MD022 空行、Common Commands 指针补真源路径两要素（CTO 重点2）、:17/:25/:88 引用补路径/降权标注（BS 重点2）、:41 联审括注泛化（BS）、Key documents 补 project.md/白皮书条目（CPO）、:78 归属括注补全（BS）、CAO session-body 主笔清单补 D-26/27+范围句 D-01..D-27（CAO 重点4）、跨机路由节/布局节现势注（COS 重点1）。

## 六、遗留与候办

- B4 扫尾余量：source-agents 现势 169 件（晨报 ~136 口径差如实标注——B1 批后 registries 51 件等增量），首批 18 件后余 ~151 件按域 sequential（批毕切账闸门制照晨报）。
- arch-storage-migration.md 本体换代（BS 候办①：仓根漏网旧稿另立改写窗）。
- 值席过程偏差 1 笔入档：首发误用 spawn（已自纠 M-004）——树协议首航打样过程修正实录，供 D-27 循环闭环 C 面沉淀。
- COS 席 sg 常驻位缺口（§一）——候 BOD。

## 七、呈报

呈 BOD：①本汇总件+五席意见件（D-27 销账锚=树路径 `trees/b3b4-joint-review-pilot/`+本件指针）；②候 CEO 1 项（E1）；③候批执行清单 §五（放行令候批）；④打样批流程读数（spawn 纠偏/COS 缺席/勘验冲突裁断方法注记）。

——MMC 值席（代行 COO 汇总位）·2026-09-14 04:2x +08
