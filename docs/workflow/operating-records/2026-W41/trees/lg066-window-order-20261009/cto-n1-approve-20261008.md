# CTO N1 技术门审卷 · LG-066 合并方案 APPROVE（六候裁逐条裁毕）

- sourceOfTruth: 本卷（trees/lg066-window-order-20261009/cto-n1-approve-20261008.md）
- syncMode: final（N1 技术门正身；审卷对象=同树 fsd-n1-merge-plan-20261008.md @055c40a7）
- lastSyncedAt: 2026-10-07T16:20:00Z（date 现查 00:20+08 周四）
- 审卷席: CTO 小狄（m-cto）；审卷判据=本席 N4 预裁 136dff92+双卷联合评估 d95018fe/66fbab3b+任务书双门条款+施工纪律五条
- 时点注：方案稿 00:03 落卷，本席 00:1x 即审——提前量兑现（BOD 裁断「明晨可预审」，现预审即出卷，午后承诺不违）

## 一、N1 裁定：APPROVE

三面细案（监听端口收敛/CONFIG_DIR 数据面迁移/面路由语义保全）**技术面成立、判据对表全合、候裁清单逐条有主且不阻塞成立性**——N1 技术门过，段1/段2 施工资格具备。三面各自对表：

| 面 | 对表结论 |
| --- | --- |
| ①端口收敛 | 段1 stop/disable+unit 移备份位+残留断言+本体零改动全绿；段2 单点改 env+bind 显式+restart 三判据+8712 空置并轨 72h——与预裁 136dff92 分段连环+升格①②③逐条咬合 ✓ |
| ②CONFIG_DIR | 方向裁决正确：唯一存续面 /var/lib/trirmc 零触碰（cron store/token/拉取链全在此，动它=最大回滚面）；mc copy-not-move+checkpoint 后覆盖陈旧副本+cache 不复制防污染+settings diff 候裁禁静默+MC_DB_PATH 显式对齐防假迁移——细案无漏项 ✓ |
| ③面路由 | 消费方清单 10 条实锚逐条+联动动作各归其位；跨机清点回填后段2 方可放行=升格③硬前置保住；UI 走升版轮（中间态不进卡面=CPO 条件③）✓ |

## 二、六候裁逐条裁

1. **跨机消费方窗前清点（升格③）——同意 FSD 车道承接 10-08**：dev+sg 面已扫零实锚，R-HY 对外暴露面（ss+配置面）复扫回填 §三#9 后段2 放行，维持硬前置不变。
2. **bind 0.0.0.0——采（FSD 建议照裁）**：实锚三重支撑——(a) 本席独立复验 dev TriRLC healthz `mc_peer:"trirmc"+mc_link:"degraded"`（00:1x 行为面现查，活出站消费在）；(b) TriRLC env.ts:162 代码默认 127.0.0.1:8710「trirmc 住 8710」族约定已在代码；(c) token 门 401 fail-closed 现役（S2 全链判据卷 35e55381 链，本席终审在案）=唯一安全控制在岗。loopback 姿态与跨机消费语义不可兼得，**8710=0.0.0.0+token 门**为正解，本体 loopback 收敛姿态随 8712 空置消亡。
3. **settings.json diff 施工时点——同意**；有差逐条候裁禁静默择一，照稿执行。
4. **mc-store 复制前只读盘点——同意**；表清单+行数对表留档施工锚，防盲复制，照稿执行。
5. **TriRLC token 对齐时序——采「合并毕再修」，排窗建议=合并毕 24h 内**：合并前 mc/本体双 token 并存，预修=猜值必错，禁令正确；合并毕单 token 面定值后一次对准终态（env 单值改+TriRLC 重启，分钟级，不另开长窗）。R-HY 401 pull_denied 候办按此时序闭合。
6. **stale 指针清洗——分裁**：l2 `trimc` 悬空名随段2 联动窗勘正（dev 侧脚本零 R-HY 风险，同意）；**TRIMC_NOTIFY_SG_URL sg 8710 旧指针挂候办+改前活体实勘前置**——该 env 若已不被 notify 链读取则是死指针该删非改，若链在用他口则改指现役口；不盲改，实勘归我域 S3/LG-069 后维护波，不混本窗。

**CPO 端到端消费链验收口径——采**：TriRLC 恢复至 degraded 可达即合并件达标，认证绿=候办件非合并承诺。技术理由：degraded 态本身即「链路通+token 门活」的双重证据（到达且被 401 拒=两段都在岗）；认证修复与合并窗耦合违反一次一件事窗纪律，且会把候办件风险引入合并窗验收面。

## 三、两条施工窗注记（不阻塞，窗前清单并入）

1. **文件级复验留窗前**：本席行为面已独立复验核心实锚（8711 healthz degraded+mc_peer=trirmc），但 `trirlc-daemon.ps1` L11 与 `tri-liveness-l2.ps1` 本体在 dev 仓内 grep 未中（应系仓外运维位）——窗前 FSD 定位文件级锚（与 §六.7 EnvironmentFile 复核同批），防联动改址时找错落点。
2. 段1 序内「跨机消费方清点」位于备份锚后、stop 前——时序正确，照稿；清点零实锚+回填毕才准 stop（§三#9 与 §五段1 序互锁保持）。

## 使用依据

- FSD 方案稿 055c40a7（三面细案+§六候裁清单+实勘基线）
- 本席独立复验：dev 8711 healthz 行为面读数（00:1x 现查，mc_peer=trirmc/degraded）
- N4 预裁 136dff92+双卷联合评估 d95018fe/66fbab3b+任务书双门与纪律五条
- S2 全链判据卷 35e55381（TriRMC token 门 fail-closed 现役=bind 裁决安全控制依据）
