# LG-058 R-HY 升版流水线·执行卷（rhy-upgrade-pipeline）

- 执行: m-sde（SDE 小布）；令源=COO 升版触发令 12:13（msg e4abb7cf，BOD 11:56 终裁令序③）+COO 裁准 APPROVE 12:2x（两级包形态+验收细化附入）
- 时点: 开工笔 2026-10-06 12:40+08（date 现查 2026-10-06T04:40:22Z）；本卷=开工笔+读数卷合一（毕后续写收口段）
- 升版对象: TriModel sg bare dev=45757bd811fa8f705ae51e5a4e9478c548466010 + TriRMC sg bare dev=99806cf191cbb623d6c009d78a98b39975be2ba8（RLC 5481f4f 本地域不在本面）

## 一、形态（COO 裁准两级包）

```
Stage1 sg 构建环（TriMMC 8712 挂单，无人值守）
  clone sg bare → checkout 目标 sha → 构建（tsc+copy-ui / tsc）→ dist tar + git bundle 备援 + SHA256SUMS
    ↓ 本机传输腿（scp 纯搬运 bundle+dist 包 sg out/ → R-HY in/）
Stage2 R-HY 自包含执行包（ssh nohup 单发触发，全自动）
  环A 备份锚 → BACKUP-ANCHOR.ready → 停等 GO.flag（120s 超时 HOLD exit 42）
    → 环B 部署（stop→staging→mv+chown→sha 指纹断言→start→is-active）
    → 环C 值面探针（healthz 绿≠生效：/health+8710/healthz+managed 四卡字段+N4 文案断言）
    → 环D N2 演练 rmc→rlc（COO 细化：差异模板双断言 apply≠原态+rollback==原态）
    → 环E 拉取链对表（journalctl vs 卡面 local_config）
```

- 硬门①: 环A 备份锚 hash+时点写 `BACKUP-ANCHOR.ready`→本机腿轮询到→**即时报备 COO+BOD**→GO.flag 才续环（未报备禁止开跑，COO 令原文）
- 硬门②: 环C 值面探针——版本/四卡数据/N1 拉取状态/N3 来源/方案三三态字段级实测，脱敏白名单字段输出
- 硬门③: 回滚预案随链——环B 任一断言失败自动 rollback（恢复 dist.bak+restart+is-active），stage2.ROLLBACK 留痕

## 二、开工现势（12:40）

| 项 | 态 |
| --- | --- |
| Stage1 脚本 | ✅ 写毕+`bash -n` 过+scp sg `/srv/fleet/lg058-upgrade/stage1-sg-build.sh`（sha256 abe7ae01…21e5e 与本机一致） |
| Stage2 脚本 | ✅ 写毕+`bash -n` 过+scp R-HY `/srv/fleet/lg058-upgrade/stage2-rhy-execute.sh`（sha256 fad38c1d…c91bd8 与本机一致；预置未触发） |
| sg TriRMC 构建依赖 | 勘勘实锚：sg 现役 checkout 无 node_modules 无 dist（v6b 系 tsx 直跑）→Stage1 环1d 改 `npm ci` 走网络（npm run build=tsc，R-HY node_modules 不动——依赖零变双仓已断言 161d0ca→45757bd、496613b→99806cf package.json+lock diff 空） |
| 挂单 | ✅ TriMMC 8712 job `1923c530-ea5e-4404-bbcd-406aed606bca` name=lg058-stage1-build every 60s+done 门+毕即自删；首轮 nextRunAt=**12:40:32+08** |
| 进行中 | Stage1 构建环（clone→npm ci→build→tar，预计 5-15min） |
| 候办 | Stage1 毕→本机传输腿→触发 Stage2→**BACKUP-ANCHOR 报备 COO+BOD（候信态）**→GO.flag→环B-E→收口 |

## 三、账本同步行（树单合同）

in-progress.json 增条 `lg058-rhy-upgrade-pipeline`（owner=SDE，status=open，本笔 commit 随带）；N5 条候信态（开工回执）随本笔同步。

## 四、观察项（不阻链）

1. **跨机 ssh 读闪烁 P2**: 本机→sg/R-HY ssh 会话对 `/srv/fleet/lg058-upgrade/` 下新建文件出现间歇假阴性（「No such file」），下一连接自愈，且两台同签名——同连接内 chmod 假无+紧邻 ls 真有已实证（12:36 R-HY）。执行件本地跑不受影响（Stage1=sg 本地 cron、Stage2=R-HY 本地 nohup），仅影响我方跨机观测轮询（假阴性→多等一轮，无害向）。候 CTO/网络面勘（本机侧 ssh 通道疑）。
2. **TriMMC addJob 字形勘正**: 请求形=`{schedule:{kind,everyMs}, payload:{cwd,command}}`（everyMs 非 intervalMs；command/cwd 在 payload 内）——与 TriMLC/TriRLC 形又异，三形态分野记忆族再+1。
3. N2 演练 rlc 卡候建态（R-HY 无 trirlc-card.json）——脚本内 skip+如实落卷不硬造。

## 五、使用依据

- COO 触发令 12:13+裁准 12:2x；任务书 task-charter-lg058-remediation-20261006.md（384000f5）+tree-plan.md（边界七条）
- 45757bd 源码实锚（apply-template/rollback/backups/cards API 形+cardTemplatesDir=CARDS_DIR/templates/<face>）
- 备份惯例形活体锚=/srv/fleet/TriModel/dist.bak-pre-align-20261005T2316Z（20261005T2316Z 例）
- 纪律: D-17（sg→R-HY 无 ssh 授权面不自增，bundle+scp 通道）/D-23（13:4x 前全毕目标，14:00 禁排区避让）/键值掩码（token 零回显，ADMIN_TOKEN 动态读 len 探针）/时刻现查
