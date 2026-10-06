# 裁决前必断言作业对象机位+形态

- 2026-10-03 15:2x trimc runuser 修窗案实证：SDE 报文明示修窗对象=sg 8712 TriMMC（8712 监听/healthz 多轮在案），CTO 裁答时把本机 TriMLC 8713 白名单门（app.ts L4062/L4117+channel.cmd L24）套上喊停——喊停令基于错误机位断言；结果零伤害纯因执行时序交叠（SDE 喊停到达前已 PATCH 毕且零撞墙）。同日 COO 对镜案：「TriMMC 零白名单」口径未先断言四 job 驻留对象即套 PATCH 通道——双案合成对：**先断对象再引口径**（COO）+**先断对象再套机制**（CTO）。
- 正形：裁决涉及 daemon cron/端口/配置面时，第一动作=从报文原文回贴「对象三要素」（哪台机/哪个 daemon 形态/哪个端口）——TriMMC/TriMLC/TriRLC 三形态机制不同（白名单有/无、addJob 行为、PATCH 门），本机 8713 vs sg 8712 机位不同；报文里出现过的实锚（8712 监听等）是现成断言材料，裁答时回读即可，禁凭勘定记忆新鲜度脑内替换对象。
- 「三形态勿互套」纪律引了不算数——套对了才算数；引纪律与守纪律是两个动作（本条主教训）。
- 关联：trimmc-mlc-addjob-divergence（三形态分野正身）/ m-sg-r-hy-server-naming（机位断言）。
