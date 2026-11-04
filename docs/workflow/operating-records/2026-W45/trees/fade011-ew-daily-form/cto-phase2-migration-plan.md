# ew 迁 TriMMC · 阶段二排窗与实施序（LG-092 裁 Z' 承接）

- sourceOfTruth: 本卷（fade011-ew-daily-form 案阶段二排窗正身·对 COS 件一裁定分发令 2026-11-04T16:02:08+0800「排窗读数与实施启动回执」请托）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 上游: CTO 回询卷 cto-mmc-migration-recourse.md（43cd92e54·适配面正身）·CEO 15:57 放权裁·LG-092 裁档 Z'

## 一 · 排窗读数

| 节点 | 时点（+0800） | 主语 | 说明 |
|---|---|---|---|
| 阶段二开工（工序 1 勘定） | **今日 11-04 即启** | FSD | 只读勘定·回执后进代码窗 |
| 代码窗（工序 2 移植） | 11-05→11-07 | FSD | fade 模块移植+端点挂接+自测 |
| 部署面（工序 3） | 11-06→11-07（SDE dsh 线毕后接） | SDE | sg fade.db+脚本 sg 化+同步链 |
| 验证窗（工序 4） | 11-07→11-08 | FSD+SDE·CTO 门禁 | sg 端到端+8712 job 新建+真触发 |
| 切换窗 | **11-08 或 11-09 凌晨 03:30** | — | 8712 新 job 首触发（验证毕为前提·未毕则顺延一日） |
| 8713 退役 | 切换验证毕后即日 | SDE | cli cron remove·回滚=re-add |

- 8713 现役 job 迁移窗内**照跑不中断**（11-05/11-06 观察窗两发+11-07/11-08 照跑）——服务连续性优先·8712 验证毕方退役（LG-092 裁 Z' 语义）。
- 「尽早排窗不拖延」承接：开工今日·无额度拖因（CEO 语义对表）。

## 二 · 实施工序（五工序·每工序回执）

1. **FSD 工序 1（勘定·今日）**：fade 模块文件组清单化（文件级+依赖面）；TriMMC app.ts 端点挂接点勘定（POST /internal/v1/fade/runs 挂接位+TRIMC_INTERNAL_TOKEN 鉴权中间件复用面）；fade.db schema/初始化面；tri-skill 技能栈 sg 解析面（resolveTriSkillSkillsRoot/resolveTriSkillAgentsMd 在 TriMMC cwd 下解析正形）。**先勘后动·回执 CTO。**
2. **FSD 工序 2（移植·代码窗）**：fade 模块文件组移植 TriMMC src/fade（零改动直搬为正形·内互依赖 types/state-machine/closing-gate/skill-loader 随搬）+app.ts 端点挂接+契约对表+自测门禁。
3. **SDE 工序 3（部署面）**：sg fade.db 初始化部署+脚本 sg 化适配（四处硬编码→sg 正形：PORT=8712/OP_ROOT=/srv/fleet/TriMetaverse/docs/workflow/operating-records/token 正则=TRIMC_INTERNAL_TOKEN/CMD_FILE=sg 侧启动形态勘定）+记录面 git 同步链勘定（树落 /srv/fleet→fleet commit→bare→本机 fetch 收编——执行主语+频率+冲突即停语义）。
4. **联合工序 4（验证窗）**：sg 侧端到端一发（POST 8712 端点→run 驱动至终态→树落位）→CTO 门禁→8712 cron job 新建（嵌套 payload {command,cwd} 形·`30 3 * * *`）→手动 force 真触发验证（TriMMC 无 ALLOWLIST·cli 形面勘定随工序 1）。
5. **工序 5（切换+退役）**：8713 job 退役（cli cron remove）+8712 两日观察窗（首触发读数+次日核对）→毕报经 COS 转 BOD 呈 CEO。

## 三 · 风险与缓解

- **watch 不随迁**（已退役·裁示在卷）——移植面零 watch.ts。
- **记录面同步链新增跳**：sg 树→bare→本机——真源单点维持·冲突即停（weekly-plane-shift 同构语义）·工序 3 勘定执行主语。
- **TriMMC 版本纪律**：移植改动入 TriMMC 仓走正常版本窗·dist production form 重建窗=SDE 部署面协同（unit 在役形 r15-1-4 重建 SOP）。
- **回滚姿态**：8712 侧全链可退役（job remove+端点代码回退 commit 级）；8713 job 迁移窗内保留=服务连续性兜底·退役动作可逆（re-add 即恢复）。

## 四 · 使用依据

- COS 件一裁定分发令 2026-11-04T16:02:08+0800（LG-092 裁 Z' 生效·排窗请托）
- CTO 回询卷 cto-mmc-migration-recourse.md（43cd92e54·四实锚+适配面）
- TriMLC/TriMMC 形态分野勘定（嵌套 payload/TRIMC_INTERNAL_TOKEN/无 ALLOWLIST）
- D-15 派工链·D-23（凌晨窗时点先例 03:30 双轨交集形）·D-46·D-47
