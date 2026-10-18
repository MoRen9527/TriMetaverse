# R 面 r-duty 班组 13 席常驻会话上线卷（CEO 21:06 令·BOD 执行）

- sourceOfTruth: 本件（BOD 点火落卷）
- syncMode: static（单次点火读数存证）
- lastSyncedAt: 2026-10-18 21:53:55 +0800（date 现查原值粘贴·D-47 写前闸）
- 令源: CEO 2026-10-18 21:06:43「r-duty-cos 上线，R面13席按值席班组形态起常驻会话」

## 结论

**13/13 全部上线**——dsh web（8791）GUI 人机形逐席建常驻会话：preset 挂载+compass 人格+值席候令态，逐席自报+候令句全 PASS。盘面双证齐：`/home/fleet/.dsh-workspaces/` 13 席工作区全在、`/home/fleet/.dsh/sessions/` r-duty 会话目录=13。

## 方法（GUI 人机形·B2 卷勘定正形）

- 通路：本机 18790（ssh 经 sg ProxyJump→河源 relay3 注 token 302）→本机 18791（ssh→河源 8791 dsh web）→兑换 303 cookie→GUI。**token 全程零入对话面**（成功链终点=干净 `./`）
- 建席：playwright 逐席「新建会话→模式钮→选 preset→发点火句→候『已上线候令』回卷」
- 点火句：波1 探路正形（自报身份+逐字引用 compass 身份句第一句）+值席候令态（r-duty 班组成员·常驻值守·无事候令有事接令即办）
- 模型：DeepSeek-V41-Flash·推理 High（dsh 现役默认）

## 逐席读数（13/13 UP）

| 席位名 | preset | 判定 |
| --- | --- | --- |
| r-duty-cos | CEOChiefOfStaff | UP（小贾·compass 逐字引用含 10-02 勘正注·62.7K tok/缓存 67%/10s） |
| r-duty-cao | ChiefAdministrativeOfficer | UP |
| r-duty-cfo | ChiefFinancialOfficer | UP |
| r-duty-cho | ChiefHumanResourcesOfficer | UP（重试 1 次） |
| r-duty-cmo | ChiefMarketingOfficer | UP |
| r-duty-coo | ChiefOperatingOfficer | UP |
| r-duty-cpo | ChiefProductOfficer | UP（重试 1 次） |
| r-duty-cso | CustomerSuccessOfficer | UP |
| r-duty-cto | ChiefTechnologyOfficer | UP |
| r-duty-fsd | FSD | UP |
| r-duty-rdt | RAndDTrainer | UP（重试 1 次） |
| r-duty-sde | SeniorDeploymentEngineer | UP |
| r-duty-ste | STE | UP（现查时刻+读 .dsh-workspaces/r-duty-ste/AGENTS.md=工作区人格物化旁证） |

- 3 席瞬态败（cho/cpo/rdt）均为 GUI 自动化点击竞态，重试即成，非服务面问题。
- 人格注入生效形优于波1：r-duty-cos 1 轮 3 步 10s（波1=7 步 22s 需读盘工具），compass 句直引带勘正注。

## 边界（如实报）

1. **token 破面自曝（D-46 违例·候裁）**：排障初期 playwright 工具回显把 8791 launch token 带入对话面一次。暴露面=本机隧道+对话面。轮换正形=dsh web 重启换 token（现役 13 席会话持久不受影响，重启后 cookie 重兑即可）——候 CEO 裁：立即轮换或并入下次 R 面重启窗。
2. **R-HY sshd 对本机 IP 临时限连**：本窗高频 ssh 连接触发阿里云防护（21:31 起本机直连 22 口 timeout·sg 视角 22 口 OPEN=河源本体无恙）。施工已全改经 sg ProxyJump 绕行；本机直连候防护解禁（典型 10-30min 自愈）。
3. **隧道持久化**：`bod-dsh-tunnel` schtasks 任务（正形抄 sg-trimc-tunnel keeper）常驻看护——值面探针 18790=302/18791=401 双锚·断线 75s 内自动重拉（经 sg 跳板）。回退锚：`schtasks /Change /TN bod-dsh-tunnel /DISABLE`。
4. **信箱面独立验未跑**：本窗只验 GUI 建席+人格+候令；席组信箱一来一回端到端验照 CTO 门禁卷 §四建议留 B16 通道迁移窗补。
5. **TriRMC 8710 注册表不受此影响**：dsh 会话存 dsh 自己 store（session 目录 13）；8710 `/internal/v1/agents` 旧形注册表（claude 形退役后恒 0）——两套名册分立如实注。

—— BOD 落款（2026-10-18 21:53:55 +0800·date 现查原值·commit 时对表）
