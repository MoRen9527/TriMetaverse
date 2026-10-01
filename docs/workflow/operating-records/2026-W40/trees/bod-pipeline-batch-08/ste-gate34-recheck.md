# LG-058 门③④ STE 实弹复核卷（batch-08 件1）

- sourceOfTruth: 本件（STE 门③④复核正身；承接 batch-08 件1 派工，弹线=batch-07 件2 卷 1f9fc5a6）
- syncMode: final
- lastSyncedAt: 2026-10-01T00:5xZ（date 现查=2026-10-01 08:5x +08，走查窗 9-12 窗内并行段）
- 执行席: STE 小柯（m-duty-ste）；门④主位=BOD 亲测不替位，本席=独立第二走查席
- 落卷注: 验收锚目录 `trees/bod-pipeline-batch-08/` 现 root:root 属主（fleet 写面拒）——本卷暂存 /tmp，候权限修正移入 commit（读数已全毕，落卷纯搬运）
- 结论速览: **门③ PASS（11/11+13/13 双 EXIT=0 与 FSD 卷逐位对表吻合）；门④ 三遍走查 PASS（零 console/pageerror、互斥全过、守卫反路径零请求零落盘）+1 非阻塞记档（sg 域标签 checklist 候核）**

## §一 门③ E12 案族 sg 实弹复跑读数（对表 FSD 卷 11/11）

### 1.1 环境对表

| 项 | FSD 卷口径 | STE 复跑现勘 | 判 |
|---|---|---|---|
| sg HEAD | 161d0ca | 161d0ca ✓（零漂移；工作区残留 package-lock M+两 bak 目录=卷 §三注记同款，原样未触） | ✓ |
| 浏览器 | chromium_headless_shell-1243（Chrome for Testing 153.0.8010.12） | 同位同版逐字吻合（--version 实测 153.0.8010.12） | ✓ |
| 便携库 | ~/.chromium-libs LD_LIBRARY_PATH 无 root 路线 | ~/.chromium-libs/usr/lib64 ✓ | ✓ |
| node | 「全量门 node22」 | /home/fleet/node22/bin/node **v22.23.3**（同源用户级安装位；见 1.3 预检插曲） | ✓ |
| 沙箱 | 沙箱卡+随机端口，生产卡/3333 零触碰 | 测试自带 mkdtemp tmp+自建 server；本席全程零生产触碰 | ✓ |

### 1.2 复跑读数（弹线对表）

| 面 | FSD 卷 | STE 复跑（node22 + env 双门 + LD 便携库） | 对表 |
|---|---|---|---|
| E12（ui-e12-strategy-delete）+E10（ui-e10-reload）定向 | **11/11 exit0** | **11 tests/11 pass/0 fail/0 skip/EXIT=0**（44.2s；E10 W3 ok+E12 describe ok 含 C1 硬核/C2 二轮/C3/C4 对照） | **逐位吻合 ✓** |
| gate 族（ui.e2e.gate.test.ts） | 13/13 | **13 tests/13 pass/0 fail/0 skip/EXIT=0**（29.5s） | **吻合 ✓** |
| C1 硬判据语义（删除→保存→真 page.reload()→消失不复活） | PASS | 复跑 PASS（同案族，第四型周期由真浏览器+真 handler+真 reload 承载） | ✓ |
| E0 预修态对照 | 4 fail（断言力锚，卷注明非门内项） | 不重跑（对照钩非门③对表面，FSD 读数为锚） | — |

- 跑法：`TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1 TRIMODEL_E2E_CHROMIUM=<headless_shell> LD_LIBRARY_PATH=~/.chromium-libs/usr/lib64 node22 --import tsx --test --test-concurrency=1 <files>`（log 留痕 /tmp/ste-gate3-e12e10.log、ste-gate3-e2egate.log）。
- 「不一致即停回卷」条款：**未触发**（全数对表吻合）。

### 1.3 预检插曲如实注（非缺陷，环境事实入卷）

- sg 系统 node=`/usr/bin/node` v18.20.8——playwright-core 此版本 import 层硬拒（「requires Node.js 20+」），node18 首跑 2 文件 0/2 fail（ERR_TEST_FAILURE at import）。
- 勘定：sg 用户级 node22 位=`/home/fleet/node22/bin/node`（v22.23.3）即 FSD「全量门 node22」同源位；换 node22 复跑全绿。**非弹线不一致，系 node 解析位差异**；sg 复跑环境口径自此入卷=node22 显式路径（非系统 node18）。

## §二 门④ 非作者手测·三遍走查单（独立第二走查席）

- 对象=sg 活体 `http://127.0.0.1:3333/ui`（HEAD 161d0ca 同源构建面）；方法=独立 Playwright 走查脚本（/tmp/ste-gate4-walkthrough.mjs，非抄门族逻辑；headless_shell 同 §一环境）；**只读交互面**——写面交互（data-del/data-edit/保存类）零触碰。
- 防踩单照 batch-07 件3 卷 §二执行：截图 8 张落 /tmp/ste-gate4-shots/ 不落仓 ✓；零真实凭据（守卫反路径用假占位值且已清空）✓；读数件零 token 值 ✓。

### 遍1 走通（导航/互斥/首启）

- 菜单 7 项齐：当前生效/TriMLC·本机/TriRLC·本机/TriMMC·sg/TriRMC·河源/TriModel 策略卡/连接配置 ✓
- 逐项点击标签↔panel 一一对应（panel-overview/card-{mlc,rlc,mmc,rmc}/strategy/connect）✓
- **面板互斥全过**（每次点击恰一 panel 可见，mutualExclusive=true 零破例）✓
- 域标签无鉴权显示（I1）：`本地域（TriMLC/TriRLC）` ✓（值面见 §二.4 记档①）
- console 零错误+pageerror 零 ✓

### 遍2 细看（四族检具抽样+七条复查面）

- **四卡副标语义对表零串卡**：M 面·本地域·本机 8713／R 面·本地域·本机 8711（**寄居过渡**如实）／M 面·服务域·sg 8710／R 面·服务域·河源 8712——与件3 卷 §3.1 四域面名单逐卡吻合 ✓
- **诚实徽标**：四卡 badge 全=「未连接」（走查席无凭据，boot 链 idle 态如实呈现零造数）+策略卡 tc-badge=「未配置」——S6 三态族人话 ✓
- **CLI 对照行**：四卡全含各自正名命令族（trirlc/trimlc/trimmc/trirmc）✓
- **候建区诚实**：rlc/mmc/rmc 含「候建」文字态、mlc 全功能卡无候建字样——与 U3 卷面差异化呈现同构 ✓
- **术语属性面全 DOM 扫描**（title/aria-label/placeholder ×禁词族 8 模式）：**零命中** ✓（件D 五行修后 v3 复扫口径在 sg 活体同向成立）

### 遍3 反路径（守卫/首启恢复）

- 仅填 API 令牌（假占位值）点「连接」→守卫人话 **「缺少管理令牌（卡片功能不可用）」**+conn-dot=warn ✓
- **零网络请求发出**（连接相关 request 计数=0，守卫客户端拦截实证）✓ **零 localStorage 落盘**（token 键零）✓
- 守卫双分支注：现值与 U2 第一段「请填入 API 令牌与管理令牌」非矛盾——本次仅缺管理令牌触第二分支，双分支语义更精确，S6 人话族零 HTTP 码零黑话 ✓
- 清空 reload→conn-guide 引导重现+回 idle 态（首启链正常，第四型 idle 面）✓

### 记档（均非阻塞，不阻门）

1. **sg 域标签 checklist 候核**：活体域标签现值=默认「本地域（TriMLC/TriRLC）」；LG-035 §四.4 部署 checklist 口径「sg 部署须设 TRIMODEL_DOMAIN_LABEL=TriMMC（sg）」。本席不裁该条在 sg 现役部署（3333 过渡位形态）的适用性——如实记档候 CTO 核（部署标注面，非功能非诚实性缺陷）。
2. 候建区/态候接线面在无凭据走查下的呈现边界：徽标=「未连接」（未做 managed 深验，凭据面不擅掘——U2.2 深验面已有在卷读数，本席不重复）。

## §三 边界遵守自检

- 只读+沙箱卡 ✓（门③测试自带 tmp 沙箱+随机端口；门④零写面交互）
- 生产卡 trimmc-card.json/3333 写面/冻结面零触碰 ✓（3333 仅 GET /ui 与静态资源）
- 测试窗零写面 ✓（未触 policies/；未跑全量测试写根路径面）
- 零敏感值出机 ✓（零真实凭据入卷；截图不落仓）

## §四 使用依据

- 派工令（batch-08 件1）+弹线卷 batch-07 件2 `lg034-035-wave5-fsd-fixes.md`（1f9fc5a6）
- TriModel 161d0ca diff（E10/E12 sg 覆写两文件）+ui-e12-strategy-delete.test.ts 文件头（env 门/E0 钩/沙箱口径）
- batch-07 件3 卷 §二 防踩单（快照掩码/截图不落仓/零明文）
- LG-035 spec §三 走查记录+§四 已知边界（域标签 checklist 条）；ste-test-plan-p2（U2 守卫双分支/G2① v3 扫描口径/U2.2 深验在卷）
