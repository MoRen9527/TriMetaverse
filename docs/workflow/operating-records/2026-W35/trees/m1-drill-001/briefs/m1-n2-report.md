# m1-n2-report：alias 一致性抽查核对结论（只读）

- 节点：m1-drill-001 / M1-N2（TestEngineer，TriMMC 编排会话首跑派工）
- 日期：2026-08-25
- 性质：只读核对（A/B 源文件未做任何修改）；本文件为树 action 指定的唯一产出
- 判定：核对 PASS（比对完整、无实质口径漂移）；附 6 处非实质差异供引用侧下版收口

## 一、比对范围与版本锚

| 项 | A 权威 alias 表（真源） | B spec 引用表 |
| --- | --- | --- |
| 文件 | /srv/fleet/TriCompany/docs/registry/company-governance-state.md | /srv/fleet/TriMetaverse/docs/execution/2026-08-24/quad-migration-spec.md |
| 比对范围 | 第 185-197 行（表头 190-191，四行数据 192-195） | 第 28-37 行（as-of 声明 30，表头 32，四行 34-37） |
| 版本锚 | 生效 2026-08-24；CEO 四模块迁移指令（quad-migration-spec v1.0 §三.2 授权本表为唯一真源） | 表内声明"权威 alias 真源落 CompanyGovernanceRegistry（§三.2），此处引用 as-of v0.2"；spec 本体 v1.0 签发 2026-08-24 14:36 |

- 防混纪律语境（spec §三.1-3）：§三.1 操作命令语境禁新名（硬规则）；§三.2 alias 单一真源——权威表四列（名 / 读法·口播约定 / 一句话角色锚 / 兼容面载体），其余文档一律"引用+as-of 版本号"，禁自由复述副本（副本必漂移）；§三.3 大小写分工——大写连写=叙事名，小写标识符=兼容面旧名。
- 判定口径：B 为引用方（as-of v0.2），A 为真源；凡 B 与 A 不一致处，按"引用漂移"或"真源待补"定性，不和稀泥。

## 二、逐行逐列比对表

### 行序总览

| 序 | A 表行序 | B 表行序 |
| --- | --- | --- |
| 1 | TriMMC | TriMMC |
| 2 | TriMLC | TriMLC |
| 3 | TriRMC | TriRLC |
| 4 | TriRLC | TriRMC |

行序差异：A = TriMMC→TriMLC→TriRMC→TriRLC；B = TriMMC→TriMLC→TriRLC→TriRMC（TriRLC/TriRMC 对调）。B 按变更性质叙事排序（TriRLC=换轨、TriRMC=新增）。判定：非内容差异，不构成漂移（D4）。

### 叙事名（主项一）

| 行 | A（真源） | B（spec §2.1） | 判定 |
| --- | --- | --- | --- |
| TriMMC | TriMMC | TriMMC | 一致 |
| TriMLC | TriMLC | TriMLC | 一致 |
| TriRLC | TriRLC | TriRLC | 一致 |
| TriRMC | TriRMC | TriRMC | 一致 |

叙事名 4/4 一致，无拼写差异，符合 §三.3 大小写分工（大写连写=叙事名）。

### 读法·口播（主项二）

| 行 | A（真源） | B（spec §2.1） | 判定 |
| --- | --- | --- | --- |
| TriMMC | Tri-双M-C | 读"Tri-双M-C"，读法词条待白皮书波 2 补 | 核心一致；B 带"待补"残留后缀（D1，非实质） |
| TriMLC | Tri-M-L-C（4 音节，勿混 TriModel=Tri-Model 2 音节） | 读 Tri-M-L-C，4 音节 | 核心一致；B 缺防混提示（D2，非实质） |
| TriRLC | Tri-R-L-C | 读 Tri-R-L-C | 一致 |
| TriRMC | Tri-R-M-C | 读 Tri-R-M-C | 一致 |

读法 2/4 逐字一致；2/4 核心一致+非实质差异。

### 角色锚·一句话角色（主项三）

| 行 | A（真源） | B（spec §2.1） | 判定 |
| --- | --- | --- | --- |
| TriMMC | 元虚拟教练系统的服务端（驱动成熟宿主 claude code 的壳） | 驱动成熟宿主（claude code）在 fleet 工作的壳 | 核心一致；B 去"服务端"定位（由其层列"元虚拟·主控"补位）、增"在 fleet 工作"；措辞级差异（D3，非实质） |
| TriMLC | 元虚拟教练系统的本地腿（承载本地研发仓宿主；FADE 灌人+成果落盘） | 承载本地研发仓宿主；FADE 灌员工定义入宿主；实验成果落盘元认知仓 | 核心一致；B 去"本地腿"定位（层列"元虚拟·本地腿"补位）、细化灌入/落盘表述；措辞级差异（D3，非实质） |
| TriRLC | 元现实落地队的本地控制器（原 TriLC daemon） | 会话持久化/调度/cron/心跳/审计自持（agent-core） | 语义互补无冲突：A=身份定位+旧名锚（B 由层列"元现实·本地控制器"与旧名列 TriLC 补位），B=功能清单式；本列措辞差异最大行（D3，非实质） |
| TriRMC | 元现实落地队的服务端（自持生产面，与 TriRLC 共用 agent-core） | 必须自持的生产面：稳定执行/无人值守/权限审计/跨节点协同（agent-core） | 核心一致（自持生产面+agent-core）；B 未逐字复述"服务端/与 TriRLC 共用"（共用关系见 spec §一 15 行与 TriRLC 行）、增功能细节；措辞级差异（D3，非实质） |

角色锚 0/4 逐字一致；4/4 核心语义一致、措辞级改写，无语义冲突。

### 兼容面载体（附注，非本次抽查主项）

| 行 | A（真源） | B（spec §2.1） | 判定 |
| --- | --- | --- | --- |
| TriMMC | systemd trimc.service、TRIMC_CONFIG_DIR=/var/lib/trimc、/srv/fleet/TriMC、/srv/git/TriMC.git 及全体 remotes、healthz 8710（5 项摘要） | 上列 5 项 + drop-in、safe.directory 登记、loose g+w、logrotate 规则、本地目录 D:/Code/ai/TriMC（10 项完整清单） | B 更全；按 §三.5"兼容面冻结完整清单：§2.1 第四列全部条目"系 spec 授权分工，不构成冲突。注：A 含 healthz 8710——候选观察点"A 无 healthz 8710"经核实不成立 |
| TriMLC | D:/Code/ai/TriMLC（新仓即新名） | D:/Code/ai/TriMLC（+现状说明） | 路径一致 |
| TriRLC | D:/Code/ai/TriLC 目录名、trilc bin/npm 名 | 同左（+被 CLAUDE.md/TriCade 打包/build-tricade.yml 引用链说明） | 核心一致 |
| TriRMC | D:/Code/ai/TriRMC；未来部署面 trirmc.service/:8712 物理名一次定终身 | D:/Code/ai/TriRMC（+现状说明）；无部署面锚 | B 未覆盖 A 的"trirmc.service/:8712"部署面锚（D6） |

结构附注：A 表四列（名/读法/角色锚/载体），与 §三.2 声明一致；B 表六列（旧名/新名/层/角色/载体/变更状态），系引用侧扩展列，不违规。B 以"层"列（元虚拟·主控/本地腿、元现实·主控/本地控制器）补位 A 角色锚中的系统/侧定位，信息未丢失。

## 三、差异清单

### 实质差异

无（0 处）。不存在命名矛盾、读法矛盾、角色锚语义冲突或载体冲突；B 四行叙事名、读法核心、角色锚核心与 A 全部一致。

### 非实质差异（6 处）

| # | 位置 | 差异内容 | 定性 |
| --- | --- | --- | --- |
| D1 | B TriMMC 读法 | 带"读法词条待白皮书波 2 补"残留后缀，真源 A 已无该字样 | 引用漂移（弱）：as-of v0.2 状态残留，真源读法已定 |
| D2 | B TriMLC 读法 | 缺防混提示"勿混 TriModel=Tri-Model 2 音节" | 引用漂移（弱）：防混提示缺失；按 §三.2"禁自由复述副本"精神宜补 |
| D3 | B 角色锚列（4 行） | 全部为改写式而非逐字引用；TriRLC 行差异最大（定位式 vs 功能清单式，靠层列+旧名列补位） | 引用漂移（弱）：措辞/粒度级，无语义冲突 |
| D4 | 行序 | B 中 TriRLC/TriRMC 与 A 对调 | 非漂移：排版自由（按变更性质排序），不影响内容 |
| D5 | B as-of 锚 | 声明"引用 as-of v0.2"，落后于真源生效状态（2026-08-24 授权生效；spec 本体已 v1.0 签发） | 引用滞后：元层面锚点问题，D1 的成因 |
| D6 | B TriRMC 载体列 | 未引用 A 的"未来部署面 trirmc.service/:8712 物理名一次定终身"锚 | 引用漂移（弱）：真源信息引用侧未覆盖 |

### 真源待补

无必须项。可选收口：若 CAO 认为真源表载体列应达完整清单粒度，可吸收 §三.5/§2.1 第四列条目（当前为"真源摘要+spec 展开"分工，按 §三.2 授权合法）。

## 四、结论

1. 不存在实质口径漂移。B 对 A 的引用总体成立：as-of 声明在、叙事名 4/4 一致、读法核心 4/4 一致、角色锚语义 4/4 一致，四行均无命名/读法/角色语义矛盾。
2. 候选观察点核实结果：观察点 1（行序差异）属实且为非实质；观察点 2（TriMMC 读法后缀）属实，核心读法一致，后缀为版本残留；观察点 3（TriMLC 防混提示）属实，缺失但非实质；观察点 4（角色锚措辞）四行均有措辞级改写，语义一致；观察点 5（A 无 healthz 8710）不成立——A 第 192 行含 healthz 8710。
3. 差异全部集中在措辞、粒度、锚点与排版层面：6 处非实质差异，其中 5 处归"引用漂移（弱）/引用滞后"（D1/D2/D3/D5/D6），1 处为排版自由（D4）；无"真源待补"必须项。
4. 修订归属：
   - 真源侧（CompanyGovernanceRegistry，A 表维护 owner=CAO）：无需强制修订，A 表本身无误；可选做载体列完整化。
   - 引用侧（quad-migration-spec，签发线 CEO，修订走"新版本+留痕"）：如需收口——(a) as-of v0.2 升为当前生效版（D5）；(b) 清除 TriMMC 读法"待补"后缀（D1）；(c) TriMLC 读法补防混提示（D2）；(d) 角色锚列改逐字引用或注明改写版 as-of（D3）；(e) TriRMC 载体列补 trirmc.service/:8712 锚（D6）；(f) 可选对齐行序（D4）。以上为质量收口建议，均非阻断项。
5. 测试判定（三分法口径）：本任务为只读核对而非门禁测试——核对本身 PASS（读取完整、逐字比对完成、结论可溯源）；产出落盘完成（本文件）。

## 五、使用依据

- A（真源）：/srv/fleet/TriCompany/docs/registry/company-governance-state.md 第 185-197 行
- B（引用侧）：/srv/fleet/TriMetaverse/docs/execution/2026-08-24/quad-migration-spec.md 第 28-37 行（§2.1）、第 53-67 行（§三 防混纪律含 §三.1-3/§三.5）
- 树定义：/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/m1-drill-001/tree-op.json（M1-N2 action）
- 本报告为本次只读核对在红线范围内（本树 briefs/ 目录）的唯一写盘产出；A/B 源文件未做任何修改，未执行任何 git 操作。
