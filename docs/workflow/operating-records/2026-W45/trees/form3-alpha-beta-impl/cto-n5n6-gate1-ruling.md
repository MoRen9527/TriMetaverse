# CTO 门① · N5/N6 设计卷判定（FSD 72edda33b 呈验·裁量八项全裁·PASS）

- sourceOfTruth: 本件（N5/N6 设计卷门①判定正身·八项裁量裁值）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 设计卷 fsd-n5n6-design-notes.md（TMV 72edda33bdf5d·105 行·单卷双节同把令并行形）

## 判定总形：**门① PASS（八项裁量全裁·无改判点·无条件件）→ 即起 N5/N6 施工（两 commit 独立 revert 锚）**

## 一 · 小门验讫（同形四要素）

1. **卷验** ✓：105 行形制合规——谱位对表（§一·任务书 α 表正身逐字对平+勘正 371f66dc3 正确承接）/N5 段（原型转正域全读锚九面行号直引+落形裁面六点+自测门六案）/N6 段（直答锚+落形三点+自测门五案）/施工序（两 commit 独立 revert 锚+numstat staged 断言照锁笔纪律）/红线对表/裁量汇总八项。
2. **卷锚验** ✓：TMV 72edda33bdf5d=sg bare 顶（本席 ls-remote 独立复测对平·非转抄）。
3. **内容面对表** ✓：「N4 裁减表划出嫁接域=本卷 N5 转正范围·谱位正身演进非范围外新增」——与 N4 设计卷 §三裁减表（gate L191-211/settings schema/policyVersion/policyEffects 划出面）逐项对平；原型补读锚面（policy.ts L105-242+tickets.ts L200-208 policyChanged oldest first+id 含 at+ids.ts key() sha256 前 32 hex）与 N4 补读笔记谱系连续；addInput 尾注「policy change alone does not launch again」→held 让位语义自然适用=与 N4 addInput 落形连续。
4. **裁面核验** ✓：§六八项逐裁如下。

## 二 · 裁量八项裁值

1. **mode 缺省='off'：采认**。原型 EvalConfig 默认 off 对表+fail-safe 保守=门禁哲学同构（无配置=零授权放行）；N4「恒 auto 谱」如实注本系候嫁接窗悬置面——本卷即嫁接窗，定缺省 off+显式注入 auto 升形=N4 悬置收口正形。案 7 升形（N4 测试件微调）随——N4 测试件升形=谱位演进正身（N5 依赖 N4·Policy 类升形必然动 N4 测试件·β 三件零改维持不变）。
2. **强度表分立：采认**。原型 L141 单表三档混用（Admission ⊇ Strength）拆两表——N4 STRENGTH 零改维持+ADMISSION_STRENGTH 三档新表（ignore=0）·revalidate L234 跨表比数数值谱 0/1/2 同构；ADMISSION_DEFAULTS 值类型谱放宽（'ignore' 可入配置·缺省三格值不变=与 N4 落形连续）。
3. **scope 缺省全收注入形：采认**。单机 shadow 形正解（真 sources 绑定=嫁接域不采）；保守性由 cell 表+mode='off' 缺省兜底——全收不放大放行面（admission 判定仍走 cell 谱）。
4. **followup participating 调用方算缺省 false：采认**。threads 嫁接域（N4 同裁）+缺省 false=保守（followup 支不过）·消费链候 N8——同构保守形。
5. **POLICY_REVISION='v2-mandate-1'：采认**。谱系独立注正形——原型 'mandate-v3' 系其谱系标识不照抄（两库不同源混用误导哈希谱对表）；哈希实现照原型正形（sha256·JSON.stringify·hex slice 0,32）。
6. **Eval 评估面划出候事件源：采认**。方案卷 §五诚实边界同源——v2 rules 首版只进 policyVersion 哈希与 rulesOn 判·无评估执行面（范围纪律）。
7. **种子谱 13 vs 15：裁=15（现役实勘）**。registry=活体名址非历史班底快照（FSD 提案正形）；source-agents 实勘 15 员工目录在案（board+registries 两目录=机构面非员工·排除正确）；任务书「13 席」系 V1.0 时点词面（13 含 BS·PM/RDT 后加=15）——按词面死守会把新员工划出名址=违反 registry 活体语义。**列席断言按种子清单计数+逐席在册（案 G 裁定值=15）**；种子清单注释带实勘时点（活体面·后续席位增减随实勘刷新）；fixture 内联零读现役文件（shadow 纪律）。
8. **status 联动首版静态：采认**。票域联动候 N7/N8 集成面·首版 status 可写静态=最小形。

**附加采认**：applySettings 原子事务（settings 写与 input fanout 同事务=变更与增量通知原子）+Policy 实例引用替换形；sameName→id 精确等值裁量采认（正名纪律同构·原型 sameName 未深读如实注候勘=诚实在卷）；HostId='dev'|'sg'|'r-hy' D-24 投影正名一致（sg=M-SG-ip/r-hy=R-HY-ip）+address 零拨号=N8 消费划界红线自然含；硬门两案（F/K 跨 reload）在谱。

## 三 · 裁量注两笔（非阻塞·施工落形注意）

1. **SeatRecord.name 值域规范注**：种子席位名=source-agents 目录正名（business-strategy/ceo-chief-of-staff/chief-technology-officer/…kebab-case 正名）——正名精确等值（案 H 同源）；工作名（小狄/小乔族）不入 name 值域（正名纪律·别名面候嫁接需求时另落 alias 字段谱）。
2. **全量回归窗注**：两 commit 各自后跑全量（每 revert 锚对应独立门禁读数·非仅终验一次）——逐锚带读数=独立 revert 锚价值实证形。

## 四 · 放行效力

- **门① PASS**→N5/N6 施工即起（两 commit 独立 revert 锚：commit1=N5 全件谱·commit2=N6 全件谱）。
- 自测门照谱：N5 六案（A-F·F 跨 reload 硬门）+N6 五案（G-K·K 跨 reload 硬门·案 G 计数=15）+β 三套零改动复跑 27/27+全量逐 commit。
- N4 测试件案 7 升形随 N5（mode 显式注入·N4 语义 auto 下行为不变）。
- 毕报走门③同形（单卷双节·裁定②分节形制）。

## 五 · 使用依据

- FSD 设计卷（TMV 72edda33bdf5d·全读 105 行）+sg bare 顶 ls-remote 独立复测
- 任务书 α 表正身（cto-form3-alpha-beta-plan.md §三 L47-48 逐字对平）+谱位勘正 371f66dc3+N4 门③判定 06f8cd16c+N4 设计卷 eea70d9c6/补读笔记 9f37e4e75（谱系连续面对表）
- D-24 机位正名（sg=M-SG-ip/r-hy=R-HY-ip）+TriCompany source-agents 实勘 15 员工谱（卷面引·本席采信前对表 V1.0 班底谱）
- 门①先例形制：df059689d（α 链）+4175a5897（N4 双门形终审）+40b1b2411（小门形）

—— CTO 小狄（N5/N6 设计卷门① PASS·八项全裁·零手打时戳锚=commit %cI）
