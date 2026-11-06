# 任务书：双面服务域补 PM 席正式启用施工（CEO 2026-11-06 19:12 直连令②）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W45/trees/pm-seat-enable/pm-seat-enable-charter-20261106.md）
- syncMode: write-time（COS 写时维护·任务书）
- lastSyncedAt: 2026-11-06T19:17:22+0800（date 现查原值·写前跑）
- 令源链: CEO 2026-11-06 19:12 直连令②（BOD 19:2x 转呈·㊿+294 后续卷）+令①二元律任务书化形（本任务书=令①①形态范本：立任务书·本地段设计毕·交服务域接力施工）
- 真源基座: `TriCompany/docs/registry/employee-roster.json` **v1.1.0·14 席全 live·product-manager=live**（COS 19:1x 实锚）+`TriCompany/source-agents/product-manager/` 八件套正身

## 一、施工对象

| 段 | 面 | 对象 | 现役基线 |
| --- | --- | --- | --- |
| M 段 | sg duty 班组（/srv/fleet/·tmux m-duty-* 值席组） | 补 **m-duty-pm**（第 14 席） | 现役 13 席同构布局 |
| R 段 | 河源班组（R-HY·dsh workspaces 13 席同构） | 补 **r-duty-pm** | 现役 13 席同构布局 |

## 二、面分工与路由

- **M 段**：COO 排工→sg 值席组施工（tmux 直发 m-duty-* 现役值席主持·M-SG 席组通道）
- **R 段**：河源通道 `ssh -J sg R-HY`（sg 值席经通道执行·或 COO 按 M-SG 席组调度裁量）——河源侧 git 操作必 `sudo -u fleet`（真源纪律）
- **编排收口**：COO 督办·两段毕报 fan-in COS→BOD 转呈 CEO

## 三、施工内容（照现役同构形纯增量）

1. 工作区补席：PM 席工作区目录（照现役 duty 席同构布局·13 席同构→14 席）
2. 席位配置：m-duty-pm / r-duty-pm 席位文件+启动配置（照现役 duty 席形）——PM 岗位定义真源=`TriCompany/source-agents/product-manager/`（roster live 在册）
3. 通道配置：代理照现役形（sg 13 席走本地 8460 代理现役形·PM 席同通道）；tmux 会话注册照现役形
4. 存活验证：席位启动+探针（session 在位·idle 态正常）

## 四、护栏四条

1. **纯增量补席**——现役 13 席零触碰不停机；现役配置文件禁改写（PM 席新增文件面）
2. **G4 攒批窗互踩防**——sg live 面随 A 批 G4 重渲换代（排程单 note4·候 COO/值席协调窗）；PM 补席施工对象=新席文件面·与 G4 存量席换代不同物·但窗面知会 CHO/COO 协调
3. **值面纪律**——token/代理配置照现役 duty 席形·值面禁进打印路径（D-46 全系）
4. **机位断言先行**（D-24）——两段施工前先活体现探现役布局·禁推定

## 五、验收锚（毕报必载）

- 席位存活探针读数（tmux 会话在位+session idle 态正常）
- 配置对表读数（新席配置 vs 现役 duty 席同构对表·差异面零或如实注）
- 现役 13 席零触碰断言（施工前后 jobs/席组读数不变）
- 两段毕报 fan-in：M 段毕报+R 段毕报→COS 汇总→BOD 转呈 CEO（施工毕回报令原文）

## 六、时限

- 今夜起跑（任务书即排·候 COO 排工）·毕报随毕随报·无硬死线（CEO 令未设·禁半截挂空=毕报节奏全程在账即合规）

---

派工链: COS 任务书（本件）→COO 排工（D-27·D-73 单通道）→M 段 sg 值席/R 段河源通道→毕报 fan-in
落款: 2026-11-06T19:17:22+0800（date 现查原值·COS 小贾）
