# CTO 技术面盘点 · 可服务域执行件筛（答任务书 a8db08b1 施工件①）

- sourceOfTruth: 本件（CTO 面盘点正身；汇总归 COO）
- syncMode: final
- lastSyncedAt: 2026-10-07T05:28:55Z（date 现查 13:28:55+08 周三）
- 盘点席: CTO 小狄（m-cto）

## 一、可服务域执行件（自含打包型）

| # | 件 | 自含判据 | face | 状态 |
| --- | --- | --- | --- | --- |
| S1 | **本机主仓 dev 已提交未推笔平推 sg bare** | git 笔自含（文档卷/l2 判据卷 7aec11ec/C-D 裁决卷 04f97398/trimodel 六笔等今日多笔）；通道现成（fetch/ls-remote 核真值纪律） | 投递动作本体（push 即投，非 MMC 拾取件） | **今日 18:00 前推**——github 443 若复断，sg bare 通道正是兜底 |
| S2 | **TriRMC cronRequest 无 token 缺口修**（原 FSD 车道） | 代码笔+全量测试跑批自含；TriRMC 仓=R 面仓，施工+测试 R 面跑天经地义；验收锚=token 门 fail-closed 断言+测试套绿 | server-executable⇒TriRMC 侧 | **本席派工枢纽改派候选·首笔全链实证推荐件**——价值高（安全面）+完全自含。**部署落活候 LG-066 冻结解**（R-HY 双 unit 零触碰），本笔只含施工+测试不触运行 unit |
| S3 | TriRLC F-3 修复+help 漏列补+8711 store 对齐（维护波） | 代码笔+测试自含（TriRLC 仓） | server-executable⇒TriMMC/TriMLC 侧判定候 COO | 候 COO 定窗（10-08 后）；窗定后可走服务域，本笔不抢跑 |
| S4 | 首笔全链实证备选轻件：TriRLC F-3 help 漏列（help 文档行补+测试） | 单行级+测试自含 | server-executable | 若 S2 判重（涉 daemon 安全面不宜首笔），此件为轻备选——链路验证优先于件价值 |

**改派注记（D-15）**：S2 原派本机 FSD 车道，转服务域车道=本席枢纽改派；本机 FSD 车道腾给批 B+件①（10-08 窗）。FSD 侧知会随投递发。

## 二、留本地件（注理由）

| 件 | 理由 |
| --- | --- |
| l2 聚合去重修（FSD 施工中，17:30 前） | 改本机 %LOCALAPPDATA% 探针+DryRun 实跑验证=本机环境+交互链依赖 |
| 今晚窗链五段（17:50-19:30+） | 本机 daemon 操作面+时分敏感+回滚窗口贴身 |
| C 条修法卷 / N1 方案审 / LG-066 技术门卷 | 审读裁决型，依赖本席会话上下文与真源对表，非批处理型 |
| TriModel 批 B+件① 施工（10-08 窗） | FSD 本机车道已排（任务书边界同款：批 A 不动勿并线） |
| 技术债组合管理/选型登记/趋势雷达 | 裁决与判断产出型，无服务域执行面 |

## 三、daemon 侧保障（任务书施工件②我面部分）

1. **值席 MMC 拾取链活体**：13:20 探针 8712=200+cron 新鲜（BOD 已验，转引如实标注）；我面例行盯防现成=l2 探针 M-SG 段每轮 healthz 读数在链，零新动作。
2. **face 映射核对**：任务书 face 路由段=server-executable⇒{TriMMC,TriRMC} 过渡映射（M1 已批）已核读一致；我面投递件按 `face: server-executable`+执行域标注格式落。**防混注记**：TriModel FACE_META 的 face 卡（产品语义，mmc=8460 代理/rmc=3333 过渡位）与任务书 face 路由是**两个不同名空间**，后者为执行域路由标签，不互译不混写。

## 四、投递时序（18:00 前毕）

1. 本卷落树 commit（即笔）→ S1 平推 sg bare（ls-remote 核真值）；
2. S2 任务书面（树文件+验收锚）随推上链——首笔候选呈 COO 编排定夺；
3. FSD 改派知会发出。

## 使用依据

- 任务书 a8db08b1（判据/分工/验收锚/边界）
- 本席名下账本与窗链排程（l2 候办/今晚五段/批 B 10-08）
- M1 执行域标准化映射（server-executable⇒{TriMMC,TriRMC}）
