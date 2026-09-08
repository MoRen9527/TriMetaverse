# LG-030 TriRLC 连接面拓扑勘定——联审议题卡（D-15 CPO+CTO 双席）

- sourceOfTruth: TriMetaverse/docs/execution/lg030-connectivity-survey.md
- syncMode: source-only｜lastSyncedAt: 2026-09-04
- 状态：**实证链三查已闭合，候双席联审五问裁决**；边界=只读实勘不改连接配置（动连接候 CEO 明令）

## 一、CEO 质疑与三查实证链（核心证据）

**质疑**：TriRLC（8711）应连 R 面 MC=TriRMC，代码/配置面疑似指向 TriMC（旧名中央面）。

**三查实证链（2026-09-04 COS 只读实勘）**：
- **查①注入值定谳**：TRIMC_BASE_URL **User 级系统 env + daemon cmd 双注入**=`http://47.245.122.61:8710`（非代码默认 127.0.0.1:8710 死端口）；daemon cmd 注记「2026-08-14 env injections」。
- **查②实连定谳**：8711 进程（17148）**ESTABLISHED 真连 47.245.122.61:8710**（netstat 实证对端地址）。
- **查③判定真伪**：healthz trimc=connected（serverTime 现时=非陈旧缓存）；taskrun.log 有 degraded→recovered 弧线（降级触发记录在案=判定机制真实工作）。
- **查④对端身份定谳**：`~/.ssh/config sg-ecs-server HostName=47.245.122.61`——**对端=sg 中央面**（sg 侧 TriMC 物理托管 /srv/fleet/TriMC，8710=TriMC 服务端口）。

**结论前置**：8711 TriRLC **真连 sg 中央面 :8710**（代码字段 trimc/trimcBaseUrl 语义=「Tri 中央 MC」缩写，字段名本身无错配）。

## 二、五问（联审必答）

- **a 拓扑责任面**：8711 TriRLC 连接对象定谳——应为中央面（TriMMC 语义，本机控制器上送中央，whitepaper 拓扑支持）vs 应连 R 面 TriRMC（河源 heyuan=8.155.54.79，周平面迁移执行点）？TriRLC「R 面本地控制器」命名语义 vs 现连中央面的张力裁决。
- **c 若需改连锁**：改配置值 vs 改 env 名/代码字段（trimc→trimrmc？）连锁清单+8713/周平面迁移线影响（若裁不改则答无）。
- **d TriRMC cron（河源）与 8711 上送关系**：同一对象（河源 TriRMC 消费本机上送）vs 两回事（河源独立自治+8711 直上中央）。
- **e 结论入册点**：相关文档/纪律/登记册更新点（whitepaper 拓扑节/协议侧 if any/README 拓扑表述三端不一）。

## 三、他问（BOD 补实证推论域待裁）

- 默认值指向死端口却报 connected：已解=env 显式注入覆盖默认（查①），非缓存陈旧。
- 代码默认 127.0.0.1:8710 语义=本机 TriMC 同机部署形态（dev 态），prod 注入形态=连 sg——两形态并存合法性裁。

## 四、材料索引

- 源码：TriRLC src/config/env.ts:160（TRIMC_BASE_URL 默认）+src/server/app.ts:1700-1722（trimc 判定上送）
- 运行面：`D:/Code/ai/TriRLC/.env`（无 base url 键）；`$LOCALAPPDATA/trirlc/.env`（OPENAI 类注释）；daemon cmd 注入行
- 实证快照：netstat ESTABLISHED 47.245.122.61:8710（PID 17148）；healthz trimc=connected；taskrun.log degraded→recovered
- 身份锚：~/.ssh/config sg-ecs-server=47.245.122.61；heyuan=8.155.54.79（周平面迁移+LG-016 件 2 在册）