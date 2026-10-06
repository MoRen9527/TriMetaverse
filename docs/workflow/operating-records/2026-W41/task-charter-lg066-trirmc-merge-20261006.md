# 任务书 · LG-066 TriRMC 合并回单单元（trirmc-mc 名字消失）

- sourceOfTruth: 本件（任务书正身；CEO 2026-10-06 17:21 批令「TriRMC 合并回单单元+trirmc-mc 名字消失」）
- syncMode: static
- lastSyncedAt: 2026-10-06T17:29+0800（date 现查 17:29:12）
- 立书位: 董事会 BOD（排期 COO 已裁 10-09 晚窗=授权域，本席认账落单；D-39 BOD 待裁全域授权）
- 受理依据: CEO 17:21 批令（含 10-13 理由质询）+COO 排期回卷树单 ba8dbe17（trees/lg065-duty-seat-bc-20261006/tree-plan.md §二；原笔 9966b061 收编正形=ba8dbe17）+CTO 质询卷双卷（CPO cf9dcfd3/CTO f1bc62a5）
- 挂账号: LG-066（COS 已录，态=候排→本件落单后=已排）
- face 路由: 方案审=CTO；施工=SDE/FSD（按 COO 树单分工）；验证=STE；挂账=COS

## 目标形态

TriRMC systemd 双单元合并回**单单元**：trirmc 本体（8712，cron 主实例+CONFIG_DIR=/var/lib/trirmc）保留为唯一服务面；trirmc-mc（8710+TRIRMC_CRON_ENABLED=false+CONFIG_DIR=/var/lib/trirmc-mc）**名字全面消失**——unit 文件/配置目录/监听面/文档与台账表述联动清洗清单（随施工方案落）。合并依据：CPO+CTO 双卷认「CEO 判断站得住」（单模块双服务面=维护复杂+误导源）；CTO 定性五天三笔债（10-01 误退役循环论证/10-04 周迁移停摆/10-06 漏枚举）中两笔与双单元形态直接相关。

## 排期与双门（COO 裁，本席认账）

- **施工窗：10-09（周四）晚窗**。不采 CTO 10-13 倾向，理由四条在树单 §二（三晚窗无压满实况/a02d89b 升版至 10-09 18:00 已 71h 观察/合并恰消 restart 清单漂移结构根因/10-13 缺排期依据）——本席复核：CEO 质询两问（前面任务清单+黄金时段占用实况）均答实，理由充分，认账。
- **双门显式前置**：门1=LG-058 CEO 终验毕；门2=CTO 合并技术门。任一门 **10-08 18:00 未齐即顺延 10-10 或 10-13 并即报 BOD+CEO，禁自动再滑**。

## 节点

- **N1 技术门**（CTO）：合并方案审（监听端口收敛/CONFIG_DIR 数据面迁移/面路由语义保全）+ APPROVE 落卷。
- **N2 施工**（SDE/FSD 按 COO 树单）：停 mc 面→配置数据面迁移→本体单单元收敛→trirmc-mc 清洗清单执行→起动验证。
- **N3 验证**（STE）：值面探针（8712 单点+cron 面+面路由全量回对）+双单元零残留断言+72h 观察窗挂账。

## 施工纪律（LG-058 教训族全带，verbatim 约束）

1. 备份锚先行（unit 文件+配置目录两件，删改可回滚）。
2. **restart 清单 systemctl 实勘枚举**：按 ExecStart/WorkingDirectory 对表枚举全部消费 unit，禁按端口想当然。
3. **完工判据=ExecMainStartTimestamp＞施工时点**，禁以 is-active 代重启验证（active≠重启）。
4. trap 回滚锚全程在挂。
5. token 值面禁回显进会话链；生产数据与冻结面不越；零敏感值出机；R-HY root 身份操作后 find -user root 清点+chown 归还。

## 边界

- 10-07/10-08 晚窗已有在办（b14 链+8713 术后观察+LG-065 N2/N3），本件不挤占；SDE 车道 10-08 空闲但双门未齐不用（COO 树单明示）。
- CEO 对排期另裁时以 CEO 为准即调（COO 回卷承诺，BOD 认账）。
- 收口链：施工席收口→STE 验收→BOD 复核→呈 CEO 知情。

## 使用依据

- CEO 17:21 批令全文；COO 排期回卷（17:28 SendMessage+树单 ba8dbe17）；CPO/CTO 质询卷双卷；LG-058 终复核卷 c354a580（教训族源）
