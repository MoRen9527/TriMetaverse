# FSD 勘定卷·批 2 ③接线窗 kit 双真源分叉实勘（NEEDS_CLARIFICATION 升 CTO 前技术输入件）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T03:08:17Z（date 现查粘贴·+8=11-20 11:08·D-47 正形）
- 令面: COO WO-RW1 §七 接线窗开工令（3bddd0972·台账 642）+CTO 批 3 APPROVE 信（批 2 全解锁转发）
- **裁定状态: NEEDS_CLARIFICATION——kit 双真源分叉=架构面歧义·本席零裁零擅接（决策三分法正用）·施工在途态如实承录**

## 一·令面 vs 事实面冲突定谳

- **令面**：TriMMC package.json 改 `@tricompany/orchestration-kit: file:../TriOrchKit`（照 0b78db4da 形②）→活体重启窗→值面探针。
- **事实**：TriMMC 消费面（8811220 session-bridge.ts 收敛装配 shim·sg 值席 C1 件）import **createSessionBridge/SessionBridgeDriver/bin 属性**——**TriOrchKit 独立仓全谱（4 笔·366cd0c→04f0894）零此三件**（`git log --all -- "**/bridge*"` 零命中）——`file:../TriOrchKit` 接线即 TS2307×2+TS2339×1=**零活体接线即崩**（「半接线态比未接线更差」裁据精准命中）。

## 二·kit 三层谱系实勘表（活体现探·非推定）

| 层 | 实体 | 顶/状态 | 出口面 vs shim 需求 |
|---|---|---|---|
| A·TC 仓包 | `TriCompany` origin/dev 顶 **2786b0e**=packages/orchestration-kit/（notice-238 C1·02:00:17+08 铸·m-duty-fsd 主刀·CTO 两包形定谳 97c8c70a3/667bcd67f 承录）·**src/bridge/ 二件真源在**（bridge-types 56 行+session-bridge-core 57 行） | TC dev 顶 | index.ts 出口=九件基础面+`BridgeAgentSession` type 面（L24）——**index 出口零 createSessionBridge/SessionBridgeDriver 直出**（bridge 核心未挂根出口） |
| B·TriOrchKit 独立仓 | dev 顶 **04f0894**（本席 C1 契约套件 31 案+C2 批 3 P1 演进+债 k2/k4·CTO 复验 APPROVE a387de991） | sg bare/dev+master 同步 | 22 符号面（0b78db4da 卷 §二实锚）——零 bridge 域 |
| C·sg 手装野生面 | `/srv/fleet/TriMMC/node_modules/@tricompany/orchestration-kit/` **真目录**（11-20 01:54 落位·零 git 锚）·description=「…**bridge**）— TriCompany company-dimension package (P1 convergence of MMC/RMC drift twins)」 | 野生 build | dist/index.js **含 createSessionBridge**（grep 实锚）+dist/bridge/session-bridge-core 在——**出口面>TC 顶 2786b0e**（TC index 零直出）=sg 手装版比 TC 仓顶还新·真源回写面缺位 |

- **8811220 msg 自承**：「node_modules 手装形现势（npm edgesOut 坑+package.json root 属墙双绕·tarball file: 断链亦绕）——deps 持久行=root 链补笔项（毕报载·BOD SSH 链候排）·单笔 commit revert 一键形」——**sg 面=已知手装过渡态·声明面缺位**=批 2 ③的施工对象正体。
- **npm 面临势（sg）**：TriMMC node_modules 手装 kit=真目录零 symlink——`file:` 声明形 install 重算=预期 symlink 替换（0b78db4da 形②本机实锚同款）——但 kit 本体真源指向=本卷升裁核心。

## 三·本席技术输入漏勘自领（如实）

- 0b78db4da 技术输入卷（07:17+8）形②正形=「file:../TriOrchKit+22 符号探针」——**漏勘 TC 包**：TC 包 2786b0e 铸于 02:00+8（**先于技术输入 5h17m**）·sg dev 已推讫——本席技术输入扫描面零 TC 仓（gate 卷 §四根因同族自家中招第二例：**检出/扫描面落后≠件不存在·hash 断言前先 fetch——技术输入面同款适用**）。漏勘后果=令面接线范式指向不完整真源面——如实自领·候 CTO 裁面勘误记录。

## 四·三裁面候选（技术输入·裁决归 CTO）

- **裁 A·TriOrchKit 仓并入 bridge 面**：TC 版 bridge 二件+sg 手装版出口面真源化移植进 TriOrchKit 仓（新顶含 bridge+根出口 createSessionBridge/SessionBridgeDriver）→接线指向 TriOrchKit（令面 file:../TriOrchKit 正形保·kit 独立仓=唯一真源收敛向）——**基线差勘定前置**：TC 版九件基线（02:00 铸·照 MMC 旧基）vs TriOrchKit 版（04f0894·含批 3 P1 演进/债 k2/k4）——九件双基线 diff 面=移植基线勘定（引擎面零互逆·但 dispatch-proxy/types/cost-controller 双版内容面不同谱——**kit 内部一致性问题**：TriMMC shim 消费 dispatch 面=kit 内部消费，基线差面若混装（A 裁照 sg 手装版直移=sg 版含旧基 dispatch）→kit 内 dispatch 新旧并存险——**A 裁细化=以 TriOrchKit 04f0894 为基·bridge 二件+出口面从 sg 手装版/TC 版移植+三件白盒案**——接线对象=单一真源收敛顶）。
- **裁 B·接线指向 TC 包**：package.json 改 `file:../TriCompany/packages/orchestration-kit`（TC 包=kit 正身·TriOrchKit 独立仓=契约资产仓定位重议）——令面勘误形+TC 包出口面补直出（TC index 零 createSessionBridge 直出=TC 包亦需补笔）——双仓关系=CTO 两包形裁（d9fa1d283/97c8c70a3/667bcd67f 谱系）重对表。
- **裁 C·TriMMC shim 改形**：session-bridge.ts 回函数形/改对 04f0894 出口面——反收敛向（8811220 已删实现·回迁=劣）·非候选推荐。

## 五·施工在途态自证（零半接线落地）

- 本机 TriMMC：dev 已 ff 至 8811220（对齐 sg）+package.json 已加 kit 行（**工作区在途零 commit**）+npm install 已跑（本机 node_modules symlink orchestration-kit→TriOrchKit 04f0894·tsc TS2307×3 实锚）——**零 commit 零 push 零 sg 面改动零重启**——TriMMC 活体（sg pid 1915139·8811220+手装 kit）零扰动 ✓。
- 回滚锚现成：`git -C TriMMC checkout package.json` 一笔（回滚纪律 §三2 承）。
- sg 活体现势勘锚：daemon pid 1915139（node dist/src/index.js·15d12h uptime·ppid=1 systemd 收养面）·8712 LISTEN ✓·TriOrchKit sg 检出顶=366cd0c（04f0894 待 pull）·TriMMC sg 检出顶=8811220（=sg bare 顶同步）·node v18.20.8（kit engines>=20 声明差·运行面探针实跑定谳注）。

## 六·使用依据

- COO WO-RW1 §六/§七（3bddd0972）+CTO 批 3 APPROVE 信（a387de991 复验卷）+CTO gate-interface-ruling 卷（30fcdcc81·§四根因条同族自领）
- TriMMC 8811220（sg 检出 log 实锚+git show diff 面读）+TriCompany 2786b0e（fetch 后对象库直读·src/bridge 二件+index 出口面全读）
- sg 面活体 ssh 现探（pid/检出顶/node 版/手装实体三层）+本机面实跑（npm install symlink 落位+tsc TS2307×3）
- 0b78db4da 技术输入卷（形②正形·漏勘面自领）+0b78db4da 后 CTO 批 3 复验卷（a387de991·TriOrchKit 面 APPROVE 不涉此歧义面）

---
落卷=FSD 小全（m-fsd）·批 2 ③接线窗勘定卷（NEEDS_CLARIFICATION）·**next_agent=CTO**（双真源分叉裁决·三裁面候选备全）·活体零扰动·施工候裁复启
