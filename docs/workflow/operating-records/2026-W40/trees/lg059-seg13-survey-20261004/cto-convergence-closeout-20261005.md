# CTO·LG-059 收敛窗毕卷+双调度器单写者定谳（BOD 05:24 三件令·件①件③）

- sourceOfTruth: 本件（件①收敛毕卷正身+件③裁决正身；令源=BOD 05:24 CEO 05:23「拉到现在跑，不要等」三件并窗令）
- syncMode: final
- lastSyncedAt: 2026-10-05 06:50:00 +0800（date 现查贴原值）
- 执行席: CTO 小狄（m-cto）；STE 验收段并行（junction 法独立验，06:4x 读数交叉印证）

## 件①·TriRLC 白窗收敛：**毕，门绿三端推平**

### 收敛链（五步全录）

| 步 | 锚 | 读数 |
| --- | --- | --- |
| 前置四查 | 05:25 | 工作树净/HEAD 18cd777/ahead8-behind5 零新笔=圈令基线一致 |
| 撞面预勘 | 05:25 | merge-tree 五件双改（package-lock/cli.ts/key-cache/letter-store types/app.ts） |
| merge 执行 | 5b3f2f7（05:26） | 唯一冲突 key-cache.ts 头注释（本地 P0③ 泛化内容 vs origin f45885e 正名头名）——融合解：HEAD 泛化全量+头名随 origin TriRLC 正名；其余四件 auto-merge |
| 施工三笔 | 11a6c8f | ①loadOne family 分支同构移植（TriMLC 修法稿配方；四错 TS2322 L177/180/181/182 消解，check 0 错）②config-endpoints 正名测试未跟修（createTriLCApp→createTriRLCApp 4 处）③letters R1 环境解耦（见下勘定） |
| 门+推平 | 5481f4f | 693/693/0 全绿（第三跑；一二跑 2-3 fail 逐族勘定见下）→push→**三端同顶**（本地=sg bare=GitHub dev=5481f4f，ls-remote 双核） |

### fail 逐族归因（全量回归纪律，三跑全录）

1. **config-endpoints（一二跑崩）**：`createTriLCApp` 旧名 import——origin f45885e 正名笔改 src 导出名未跟 test 面（「改名测试未跟」族，同 LG-029/TriMLC 先例）。修=正名 4 处。STE 初判「test 残留多数合法」被此实证推翻一处（STE 已自领）。
2. **letters R1（一二跑红）**：2ab47df（LG-060 WO-B 校准笔）把断言改为「连接即 task_error」并定性「src:3540-3543=未注册 runner 结构行为」——**勘定=误定性**：3540-3543（origin 版行号）实为 **model check 失败的 task_error**（validateModelAgainstRegistry 路径），「未注册 runner」判定在 app.ts 不存在（grep 全证）。绿/红由 entry.model 是否在环境注册表决定（origin 环境缺→绿；本机 19 models 全含→红）=**环境绑定断言**。修=测试 env 注死模型名 `no-such-model-r1-stability`（L3448 默认链 env 位注入），model check 必败→task_error 结构行为成为确定性断言对象，断言语义不变、环境解耦。2ab47df 语义锚定勘正随本卷，LG-060 面知会。
3. **REQ-018 PID（三跑前一轮红）**：EADDRINUSE 18732——STE 验收窗 fixture daemon 残留（pid 19260，06:25 起）占测试固定端口。清残留→复跑 2/2 绿。环境残留非代码回归；fixture 端口固定无清理兜底=小改进候办（不阻）。
4. **flaky 一条（首跑 3 fail→次跑 2 fail）**：漂移条未留名（两次跑间自愈）——与 R1/config 同套件时序面，REQ-018 同族环境敏感概率形，候办挂观察。

### 交付态判定

- 「本地 8 笔零新增回归」✓（STE 验收段同判）；「229 全量门绿」✓（基准已扩容 688→693，STE 正名批+1 套件 5 tests 入集）
- **解冻语义达成**：门绿=冻结读数纪律解除，本卷读数即基线回归读数
- 件二 TriLC×3 registry 正名并批：STE 车道并行推进（212c551 文件名面已入链），name/desc 内容面随 STE 车道，本卷不代述
- 本地 TriRLC daemon（52752）全程未动（Node 一次性加载，merge/build 不影响现役进程；下次重启窗自然带新码）

## 件③·双调度器单写者定谳：**留 R-HY trirmc 正形，sg TriMMC 8710 周迁移 job 裁停（disabled，非删）**

### 裁据四条

1. **单写者原则**：周平面迁移=全局唯一写动作，双写者=漂移源。b61e86b7 双跑实证（sg 侧 10-04 23:59:01 触发，幂等踩空零数据损伤=侥幸非设计），同族风险随双跑常态化必爆（nextRunAt 错位/时区差/迁移窗冻结期误触发）。
2. **真源锚**：memory 周平面迁移执行点真源=「唯一执行点=河源 TriRMC cron（周日 23:00 北京时间）」+迁移链实勘 R-HY job 9c81c7ec=正形。sg TriMMC 8710 job=后加分叉写者非正形。
3. **裁停非删**：TriMMC cron job disabled=true（F-3 探针读数确认 enabled 字段在）——可逆（随时重启）、审计面保留（job 历史 lastRun 留档）、零代码变更；删除=不可逆且丢历史。改只读不成立（cron job 无只读形，disabled 即停等价）。
4. **形态勿互套**：TriMMC 8710（sg）与 TriRMC（R-HY）是两个控制器两台机器——停 sg 侧不影响 R-HY 正形链（fetch+ff+push 回）。

### 执行面与连带

- 执行=sg 值席车道（PATCH job disabled=true 或等价 API；TriMMC addJob/PATCH 行为=即生效零重启，2026-09-30 实勘在案），随值席窗落；本席不直操 sg 机。
- **CARRY-001 §4 行计 15w+ 溯源（外观核验级）**：双跑踩空无数据损伤判读已含行计外观（幂等语义=ff-only 拉推零增量）；15w+ 行计数字的深溯源=台账归口线（候 COS 台账窗），本卷不展开。
- 连带候办：TriMMC 8710 若存在其他 R 面职能镜像 job，同族单写者审计候扫（值席窗顺手 grep job 清单，非本窗急件）。

## 件②·LG-064 告警方案案头确认：另卷随出（任务书细读后）

## 使用依据

- BOD 05:24 三件令（CEO 05:23「拉到现在跑，不要等」）；圈令卷 cto-trirlc-convergence-ruling-20261004.md（merge 配方+229 门+解冻语义）
- 实锚全录本卷表；STE 验收段读数（06:4x：688/686/2 交叉印证+三方基线 12/12-12/11-继承）
- memory：周平面迁移执行点真源/双控制器端口定性/TriMMC cron 行为实勘
