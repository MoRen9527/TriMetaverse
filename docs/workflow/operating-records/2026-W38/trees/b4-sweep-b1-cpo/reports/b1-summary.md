# B1 汇总件——B4 扫尾批1（CPO 域 9 件）五席联审

> 汇总=COS 值席（m-duty-cos；打样批先例=MMC 值席代行 COO 汇总位，本批起汇总位由 COS 值席常设）·时点 2026-09-16 21:4x +08
> 程序位=审（本批零改动）；汇总依据=五席独立意见件全读（b1-cos/cto/cao/cpo/bs 共 395 行）·呈 BOD
> 批次元数据（CFO 批毕切账供料）：批号 B4-sweep-b1·域=CPO（source-agents/chief-product-officer 9 件 583 行）·时点 2026-09-16 21:21-21:39 +08（错峰窗）·五席出席形态见 §一

## 一、联审概况与出席形态

| 席位 | 出席形态 | 意见件 | 行数 | 表态分布（PASS/建议/挂起） |
|---|---|---|---|---|
| COS | m-duty-cos 常驻席（值席兼审） | b1-cos-opinion.md | 47 | 7/2/1（挂起=子项） |
| CTO | m-duty-cto 常驻席 M-004 直达 | b1-cto-opinion.md | 122 | 5/3/1（挂起=根因项跨 2 件） |
| CAO | m-duty-cao 常驻席 M-004 直达 | b1-cao-opinion.md | 81 | 4/4/1 |
| CPO | m-duty-cpo 常驻席 M-004 直达（自域） | b1-cpo-opinion.md | 85 | 3/6/0 |
| BS | spawn 型（V0.2 基列制明示形态；BOD 2026-09-16 裁定 BS=非人格 registry agent、spawn 合规） | b1-bs-opinion.md | 60 | 2/7/0（高优 1；候办 6） |

- 全量表态覆盖：9/9 件×5 席=45 行表态齐，无缺席。
- 独立性：五席均声明零接触他席稿（禁读约束执行；BS 件目录在册未打开声明在卷）。
- 零改动：五席 M4 声明齐（唯一写盘=各自意见件）。
- 过程留痕：BOD 双令事件（纠偏→撤令）定谳 M-004 spawn 边界=BS 非人格 registry agent spawn 合规、13 员工常驻席 SendMessage 直达——过程修正实录，供 D-27 循环 C 面沉淀。

## 二、跨席收敛项（按共识强度排序）

### 共识-1（5/5 席）：memory 运行资产落点条目重复
- `TRICOMPANY_COGNITION_HOME` 三现（:20/:25/:27，CAO/CPO 实测行号一致；COS 初读计 2 后核 3）+binding profile 与 colleagues 重复+孤行空行。文案级去重合并，五席无分歧。

### 共识-2（4/5 席）：contract 退役叙事欠账族（BS 定性=B4 本域最高行为风险件）
- runtime_baseline 三废字段（host: copilot-host/tri_mc_status: planned/tri_mc_migration_ready: false）+instructions 末条「未来 TriMC 正式宿主切换」指示句+tools `runtime_equivalent: openclaw:*` 旧运行时命名（CAO 实证：CAO 换代件已无此字段）。
- **处置收敛**：按 B1 切片1 五字段一次换代（m_plane_runtime/r_plane_runtime/service_domain/local_domain/host_switch_plane），走 CHO 五件套增量验收通道+D-07 发布；与 11/13 席同窗（夜航01 次批③校准窗已登记），非 CPO 单席。

### 共识-3（3/5 席明示）：business-strategy-state.md 断链（根因=两仓中央商业 registry 命名不对称）
- contract :87+session-body :25 引 `TriCompany/docs/registry/business-strategy-state.md` 零命中；源侧实体=`business-state.md`、中央侧实体在 TriMetaverse。CPO=消费 BS 路由最高频席（6/9 件载 BS 路由），断链落第一跳。
- **处置分歧如实登记**：CTO 挂起候裁（真源归属二选一）vs BS 建议案（本批后小修改指源侧 business-state.md+命名对称化候 CGR 候办⑥）。汇总裁断：**挂起候 BusinessStrategy 定谳**（BS 倾向案随案留痕，owner=BS+COS 中央收口），裁后随管线窗改两面。

### 共识-4（3/5 席）：壳退役标注缺时点锚
- 退役快照无基准日/commit 锚，版本差不可机械判定（「退役前旧态」vs「应同步漏同步」）。补「冻结于<日期>（commit 锚）」一行；退役件按原子退役律保留，仅补标注不回同步（红线③豁免标注 ✓）。

### 共识-5（2/5 席+1 候办）：session-body 正身声明条件式时态
- 「经 CHO 门签收+管线 execute 后为 session 面正身」停留将来时，签收状态不可辨。补完成时态+签收锚（日期+commit），或明示「候签」——归 COS/CHO 对表（BS 候办①同指）。

### 共识-6（2/5 席，BS 升维）：PRODUCT.md 名误已入 live compass 链
- session-body 阀门首行「PRODUCT.md」系名误（真源实名 PROJECT.md，同件 :47 自用正确）。**值席即时补勘**：compass 发布面命中 2 件（chief-product-officer.session.md :162+chief-technology-officer.session.md :45）；源侧现文仅 CPO session-body 1 件——CTO 发布面系陈旧渲染或异源带入，候管线窗勘源修两面。BS 附议：13 件全链 grep 由值席承担（本批已做，读数在卷）。

### 共识-7（3/5 席触及）：soul/body 四节双写机制
- 认知分层约束/当前原则/运行资产落点/层契约四节 soul 与 body 逐字双写、无机制锁（CAO 家族观察+CPO 建议(轻)+BS 沿 bb1 口径候结构标准窗）。归模板规范/结构标准域（bb1 H1 同域），非 CPO 单席缺陷。

### 共识-8（2/5 席）：colleagues 席位名格式混用+退役 spawn 名残留
- 「小全（full-stack-developer）」系退役名（D-13 FD 行正名=FSD，LG-029 勘误），应改「FSD（别名 小全）」；席位列举三格式混用应统一并与 D-13 对表。**跨批关联**：任务3① 探测中 FSD 席自报「寻址一律正名 FD」与本条同根——名址域对表时一并勘 FSD/STE 两席手册现文。

## 三、席间分歧与候统一项

| # | 事项 | 分歧 | 汇总裁断 |
|---|---|---|---|
| 1 | contract instructions 是否补 0.5 归属路由阀门 | CPO 席建议补（三面口径一致）vs COS 席判 copilot 面既有清单为设计形态 | 登记候统一：阀门语义已随 session-body 内联清单入 live 链；contract 面是否补列随管线窗（与 CTO 席「内联清单镜像注记」全席共性项同窗判向） |
| 2 | paths 缺 session_body 语义 | COS/CAO 判登记缺件（候 CHO 门/D1b manifest 二选一）vs CTO 判语义边界无文档锚（补 README 说明或补登记） | **二选一候裁 CHO 门**（P2）：补 paths 登记或出示 manifest 独立登记证据；语义边界文档化随窗 |

## 四、三红线执行清单

**红线①挂起候裁（2 项）**：
- P1｜business-strategy-state.md 真源归属/两仓命名对称（共识-3）——候 BusinessStrategy 定谳（倾向案：改指源侧 business-state.md+对称化候 CGR）。
- P2｜contract paths session_body 二选一（共识-2/分歧2 同族）——候 CHO 门核对 D1b manifest；与夜航01 次批③「2/13 contract schema 校准」并窗。

**红线②候 CEO**：0 项（五席均无保留权主张）。

**红线③豁免**：壳件=D1b 退役件按原子退役律保留（三席同口径：仅补时点锚，不回同步内容）✓；本批 9 件无历史冻结件命中。

## 五、候批执行清单（共识成立候放行；本批程序位=审零改动）

**文案级（小修通道）**：
1. memory 落点去重合并+孤行清理+「（⑦ 权界同构）」补全称「CEO 晨报五裁⑦」+传闻句改写（CPO 案在卷）。
2. colleagues「FSD（别名 小全）」正名修正+席位名格式统一（D-13 对表）。
3. session-body PRODUCT.md→PROJECT.md（源侧修+FADE-002 管线重发布 compass 面；CTO 发布面 :45 勘源随窗）。
4. 壳退役标注补「冻结于<日期>（commit 锚）」。
5. contract responsibilities 第 4 条 dict 展平为字符串（或全结构化，二选一随窗）。
6. session-body 正身声明完成时态+CHO 签收锚（候 CHO 对表后落）。

**结构性（候窗集，随次批③校准窗/域翻新窗/CHO 五件套增量通道）**：
7. runtime_baseline 五字段换代+instructions TriMC 句收敛+openclaw:* 清除（11/13 席同窗）。
8. paths session_body（P2 裁后随窗）。
9. description 唯一定义点制投影补注记（BS 重点3，B1 立制延续；business-strategy 三件注记句式可抄作业）。
10. soul/body 双写机制+内联清单镜像注记（模板规范窗，全席共性）。
11. business-strategy-state 指针（P1 裁后随管线窗）。
12. 候办认领：org/shared.md+audit.md 两仓根勘无其物（BS 候办②——涉 13 席通用模板句，候 owner 核实认领或改 env 语义表述）；tools.edit registry 域粒度（候办⑤，owner 裁量）。

## 六、呈报

呈 BOD：①本汇总件+五席意见件（D-27 销账锚=树路径 `2026-W38/trees/b4-sweep-b1-cpo/`+收口报告指针）；②挂起候裁 2 项（P1/P2）与候批执行清单 §五；③批次元数据供 CFO 批毕切账（时点 21:21-21:39 +08 错峰窗、五席形态、意见件 395 行）；④下批候放行：按域 sequential 下一域（建议序=COO 9 件）。

——COS 值席（汇总位）·2026-09-16 21:4x +08
