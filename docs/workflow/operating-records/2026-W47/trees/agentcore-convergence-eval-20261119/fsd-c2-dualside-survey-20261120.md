# FSD 卷：C2 P1 双侧九件真漂移谱勘定（strip-cr 重勘·假漂移家族勘正+两候裁标注）

- seat：FSD（m-fsd）·C2 P1 主刀前置勘定卷
- 时刻（date 现查）：2026-11-19T22:30:41Z（北京 2026-11-20 06:30:41 +0800）
- 输入：STE 契约卷 ste-contract-test-suite-nine-20261120.md（九件实锚 sg 双仓名集零差）+CTO 收敛评估卷 97c8c70a3 面 §二「9/9 双仓全漂移」
- 勘法：双侧九件（TriMMC/src/orchestration × TriRMC/src/orchestration·本机 dev 检出）逐件 `diff --strip-trailing-cr` 真差勘定——**先验读数（未 strip-cr）9/9 全漂移 26-502 行/件=行尾族假阳性（一侧 CRLF 一侧 LF·跨仓行尾族坑同谱）**

## §一 真漂移谱（strip-cr 后）

| 件 | 真差行 | 定性 |
|---|---|---|
| types.ts | 4 | 头注释词面（TriMMC/TriMC 旧名投影）·语义零差 |
| employee-registry.ts | **7** | **真语义差 1 处**（见 §二·候裁①） |
| employee-scheduler.ts | 2 | 头注释词面·零差 |
| dispatch-proxy.ts | 2 | 头注释词面·零差 |
| capability-router.ts | 2 | 头注释词面·零差 |
| cost-controller.ts | 2 | 头注释词面·零差 |
| session-bridge.ts | 2 | 头注释词面·零差 |
| trilc-executor.ts | 24 | **纯改名投影**（TriLC→TriRLC·TriMC→TriMMC 改名族 2026-08-31/2026-09·类名+注释+错误消息词面·语义零差——收敛正形=新名投影） |
| index.ts | 2 | 头注释词面·零差 |

**行数双侧**：八件全等（types 170/170·scheduler 146/146·dispatch 251/251·capability 173/173·cost 232/232·session 192/192·executor 153/153·index 13/13）=同基线分叉·各自只动了头注释；**registry 例外=MMC 116 / RMC 111（差 5 行=§二候裁① family 过滤段实锚·行数面自洽）**——「漂移孪生」实证面**大半为行尾族+改名族+注释词面假漂移·真语义差 1 处**。

## §二 候裁标注（两件·契约面不擅裁语义归一——STE 卷基准形教义遵行）

**候裁①（语义正形候选）**：employee-registry.ts L88-92——**MMC 侧有·RMC 侧缺**：
```
// batch-15 件③追裁连带（CTO 2026-10-02）：agent-core Registry family 分支后
// board/business-strategy 两 Registry 席合法加载——员工 roster 面=Role 席 only，
// 显式 family 过滤（此前系 schema 拒绝「恰好排除」，Registry 合法化后该机制消解，
// 须显式维持 13 席 roster 纯度；Registry 席=合法排除，不进 errors 不进 employees）。
if (contract.identity.family !== 'Role') continue;
```
=RMC 侧落后 MMC 基线 5 行（CTO 裁达语义未同步 RMC）。**kit 收敛正形候选=含 family 过滤段（MMC 形）**——候 CTO 裁（含段=RMC 消费侧行为变化：board/business-strategy Registry 席被过滤出员工 roster——RMC 现役若依赖全量装载含 Registry 席则有行为差·须 RMC 侧消费面对表后裁）。

**候裁②（工程落位）**：kit 包仓落位——CTO 评估卷 §四+STE 卷铸面定包名（@tricompany/orchestration-kit·独立版本独立回滚）·**仓落位未明铸**。三选项：
- a) TriCode 仓 workspaces 化子包（TriCode=「Shared code runtime and orchestration」定位正合·但=TriCode 单包仓边界变更）
- b) 独立新仓（sibling 命名族·独立版本独立回滚最纯形）
- c) sg 双仓一侧 workspace 先落（MMC 或 RMC 内）
——候 CTO 一句裁；落位裁下前码面施工不 block（契约断言体铸形落位无关·kit 本体直拷面已勘定）。

## §三 C2 施工量级重估（勘定后）

- 九件本体收敛=近直拷（MMC 形为基+行尾归一 LF+头注释归一现役名+executor 新名投影+候裁①裁决项并入）——**非重写级**；
- 契约测试 9 套件=STE 断言面照铸（C1-C9 逐件）——落位裁下后一段铸形；
- C3 验收四仓活体对表+md5 复验——双侧勘定读数本卷先行供锚（md5 基面=C3 时点重取）。

## §四 增补段：候裁① RMC 侧消费面读数（cos 分诊注记提速面·2026-11-19T22:36:23Z 现勘）

**勘法**：TriRMC/TriMMC 双仓 src+test 全谱 grep（loadEmployeeRegistry 调用面→dispatch 上溯→fixtures family 值面三段）。

| 读数面 | 结果 |
|---|---|
| loadEmployeeRegistry 唯一消费 | 双侧同构=dispatch-proxy L120（`deps.employees ?? loadEmployeeRegistry(deps.registryDir).employees` 路由候选池） |
| dispatch/dispatchAsync 外部活体调用 | **双侧 src 面零命中**（唯一引用=trilc-executor type import+注释）——**编排九件双侧皆「已铸未接线」态** |
| RMC 测试面 family 值面 | employee-registry.test 内联 fixtures 三案（CTO_YAML/CPO_YAML/BROKEN_YAML）**全 `family: Role`**·其余 4 套件 fixtures 同形全 Role——零 Registry 席案 |
| MMC 对照组 | family 段现役已跑（2026-10-02 裁达起 49 天）·MMC 测试面同构全 Role fixtures——活体对照实证 |

**供裁结论**：kit 收敛正形含 family 过滤段（MMC 形）→RMC 侧**活体行为差=零**（dispatch 链未接线无消费）+**现役测试零破坏**（fixtures 全 Role·`employees.length===2` 断言不受过滤影响）——**候裁①可直裁含段**·RMC 消费面对表义务由本读数代偿（CTO 裁时勘阅本段即可·无候令依赖）。

## 使用依据

- STE ste-contract-test-suite-nine-20261120.md（九件实锚+契约基准形「交集为正形·差异面候裁标注」）
- CTO cto-agentcore-convergence-eval-20261119.md（§二漂移孪生实证·§四两包形·判据四条）
- 活体：TriMMC/TriRMC 双仓 src/orchestration/ 九件现勘（dev 机检出·strip-cr diff 法）
- 教训锚：跨管道行尾族三坑（CRLF/LF 假漂移家族——本次=仓间同码异行尾实证变体）

（FSD 落卷·候 CTO 两裁标注·候裁期间零空档：契约断言体铸形续进。）
