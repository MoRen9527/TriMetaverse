# TriMLC 本地通道 daemon 设计 spec（LG-020 单 A）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/trimlc-channel-daemon-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：CEO 两单之单 A（立项→设计→立法→实施）；设计依据=CEO 定见七条（董事会确认口径照录）
- 配套：协议 v2.1 §六五实例表 TriMLC 行重定义（单 A 立法配套⑥）+命名真源表（单 B 联动）

## 一、定位（标准结构缺口补齐）

标准结构=2 面 ×（MC 服务器调度 / LC 服务器执行 / LC 本地执行）——全表现只缺 **M 面本地 LC** 一格，本单补齐。**边界**：R 面本地 LC=现有闲置 trilc daemon，归懒建 clone 激活批（LG-019 已立），不混入本单。

## 二、形态立法

1. **同库 profile**（董事会修正「借代码」→同库 profile 防 fork）：TriLC=LC 单一真源（同 TriCode 定位）；通道态=同一代码库 TRILC_CHANNEL_MODE=1 profile，非 fork 非新仓。
2. **通道态能力面**：常驻+心跳（外拨 TriMC）+收件箱+最小 cron+session-reaper；**关 agent 宿主能力**（/v1/messages、/internal/v1/agent、/chat/completions 三路由 501 channel_mode_no_agent_host）。
3. **客户端模型**：CC 交互会话与中枢会话=客户端（trilc chat 同款连接模式）；会话可关，重开连 daemon 拉 7×24 积压。
4. **宿主能力不预建**：CC headless 驱动（TriMC 壳角色）不预建，需用时另批。

## 三、边界如实（两条，入册）

1. 「7×24」=**PC 醒着的 24h**——睡眠/关机段本地静默（消息积压于服务器侧，醒后拉取）；服务器节点为真 24h。
2. 本地 daemon **外拨型**：出站心跳/SSE 连服务器；listener 绑 127.0.0.1（代码现成）禁外部入站——NAT 后入站派送走已建连接下行。

## 四、实施参数（Windows）

| 项 | 值 | 依据 |
| --- | --- | --- |
| 代码库 | D:/Code/ai/TriLC（dev，同库 profile） | 防 fork |
| 端口 | **8713**（实勘 8711=现役 daemon pid 27168 占用、8712/8713 空闲） | 独立端口 |
| CWD/workspace | D:/Code/ai/trimlc-channel（独立目录，勿指主仓勿与 R 面实例混用——CEO 点名 per-instance 不拷贝） | 独立 CWD |
| DATA_DIR/PID_DIR | %LOCALAPPDATA%/trilc-channel/ 独立 | per-instance |
| 启动 | 计划任务（本地 trilc 计划任务先例=Win 兼容实证） | Windows |
| env | TRILC_CHANNEL_MODE=1 + TRILC_PORT/CWD/DATA_DIR/PID_DIR/TOKEN 独立集 | 通道 profile |

## 五、能力边界（立法写明）

通道态可执行普通程序（cron/script）；**无 agent 宿主能力**；CC headless 驱动=宿主能力（TriMC 壳角色）不预建，需用时另批。

## 六、远期愿景锚（不入本期实施）

CEO 原始愿景=员工长期在岗+会话间自由通话——本通道是地基；员工连续性=常驻通道+按需苏醒+快照续命（.fade/hub-snapshots 同款机制）；员工间自由路由=phase-2。

## 七、协议 §6.1 联动（单 A 立法配套⑥）

TriMLC 行重定义：「本地 CC 宿主」→「**本地 LC daemon 通道态**+CC 交互为客户端」；命名真源表联动单 B（代码面↔叙事面对齐评估）。

## 八、增补（2026-08-31 晚，CEO 裁定两段）

### 8.1 daemon.mode 字段口径（董事会微裁决文档化）

healthz daemon.mode 字段=**宿主 OS 平台形态标识**（app.ts:1667 平台三元硬编码，win32→'schtasks'），非注册实况——字段名有误导，三态化（registered|unregistered|platform-×）挂该文件自然编辑窗顺手改（董事会自裁：8711 现役同码重启不值，不动代码）。

### 8.2 宿主能力理由修正（CEO 点破）

§二.4 宿主能力不预建的**理由修正**：本地 CC headless 二进制/凭据本就存在——解锁门槛不变（有需求另批），**理由改为治理边界**：无人值守 agent 在个人机运行须 job 白名单/目录约束/凭据面立法先行，非能力建设成本。

### 8.3 迁仓预告

通道态代码迁仓计划（TriLC 仓→新 TriMLC 仓）见 repo-rename-migration-plan-20260831.md §三阶段 3（8713 并行换源不断服）。
