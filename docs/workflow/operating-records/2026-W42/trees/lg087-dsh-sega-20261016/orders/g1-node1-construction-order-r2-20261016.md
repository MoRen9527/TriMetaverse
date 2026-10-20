# G1 节点1 施工指令单（重投 R2）· charter-2026-W42-003

- 单号: charter-2026-W42-003/N1-R2
- 重投缘由: 派工链首投未达（TriRMC message 桥 bridge_failed 受害③·前两受害=COS 会签令两投败+SDE 施工单未达）——改道 pane 直投+跨会话消息双通道同文重投
- 令源: CEO 2026-10-16 20:15:46 三件全裁+改窗令（排窗确认已过·D-39——窗 20:30 即刻开窗）
- 正身任务书: `docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/charter-2026-W42-003-dsh-sega-tonight.md`（syncMode static·原始态件·冲突以正身为准，本单系派工面转录·零改权）
- 签发: COO 小营 2026-10-16T12:44:08Z+08=20:44:08（date 现查原值·D-47 正形 A）
- 收单: SDE（r-duty-sde·跨机施工·施工位=河源 R-HY）

## 一、派工内容（正身拆树表序1 行·全文转录）

| 项 | 内容 |
| --- | --- |
| 节点 | 序2 dsh 装设+烟测门（Node 前置勘验+exact 版本钉住+Web UI 127.0.0.1 本地绑定禁改公网+TriModel deepseek 卡接入）+ **scoped persona 实测首验**（B1——需 bundle patch 即停窗报裁禁带病过波） |
| 施工位 | 河源 R-HY（SDE 跨机施工） |
| 门禁/毕锚 | 装设烟测门全链绿（信箱一来一回经适配件+healthz 对表）+身份面实测读数落卷 |
| 止损 | 烟测不过=冻结装设报 CTO；persona 需 patch=停窗报裁候窗 |

## 二、开工前置自校

- 0→1 依赖闭合断言：节点0（河源 compass 13 件 dirty 收敛）git status 干净断言落卷在位——缺则先回签补断言，补齐再开工。
- 前置门②（会签面）已闭合：CTO A 部认 20:22:31 落卷生效（cto-signoff-gate-and-contract-cosign-request-20261016.md A 部分）+ R 面 B 部认 commit 781106dcb（rduty-cos-contract-cosign-20261016.md）——本单仅节点1；节点2（序3 转译批量）开工随节点1 毕锚另令。
- 双通道投递纪律：本单经 pane 直投+跨会话消息同文重投——**先到先执行，后到勿重复开工**（仅回签「收单」）；收单即开工（施工单到场前不自行开工纪律以本单为到场凭证）。

## 三、窗位与护栏（正身 §三/§四 转录）

- 窗位 2026-10-16 20:30-24:00 硬边界（3.5h·GLM 轨黄金段 18-24 内）——未毕节点记 resumePoint 候续窗。
- D-24 机位断言：河源=R 面 R-HY·TriRMC=8710 河源服务域——状态叙述先活体现探禁推定。
- daemon 操作纪律：TriRMC 勘修面照 restart 纪律（权威路径禁裸杀/优雅停/健康断言）；适配件装设 TriRMC 机制面零本体变更断言（healthz 对表证零扰动）。
- D-46/D-54 值面与凭证：deepseek 卡涉密值零落盘零打印·掩码前置。
- 资源护栏：河源 7270MB 总量——席级并存 ≤1 席对（r-duty-cos dsh+claude 双形过渡窗）·增量实测对表。
- 串行纪律同构（n1 先例）：席位进程操作逐席串行·禁并发 2。
- 异常即停波：任一门禁不过=停该段报 CTO（门禁裁决面）·不盲重试；系统性缺陷=整体回滚（停 dsh+模板重演·零资产损失·回滚锚=claude 模板 57cf86b64 幂等重演·CLI 2.1.296 冷备·段A 零不可逆操作）。

## 四、毕报链

- 节点完成必出 brief+checkpoint（progress 摘要/artifactCommit 产物 git SHA/resumePoint）·经 COS 链（SDE→COS）·树投影同步·毕报落款 D-47 正形（date 现查原值）。
- 窗级 token 消耗读数随毕报回报（CFO 台账备考·额度周窗贴线期）。

——COO 小营 签发 2026-10-16T12:44:08Z+08=20:44:08（date 现查原值）
