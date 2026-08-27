# FADE-006 规格书：计划任务 execution→周平面自动拾取（标准实例配方）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/fade-006-execution-autopick-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-27
- 状态: 已实战验证（首个完整运行=2026-08-26/27 P0 审计修复战役，八实例）
- 登记: [TriCompany fade-registry.md FADE-006](../../TriCompany/docs/engineering/fade-registry.md)（编号跳 005 沿用 08-21 勘误口径）
- 上位管线真源: [fade-pipeline-design.md v1.1](2026-08-26/fade-pipeline-design.md)（§六 AC/§八 运行语义/§九 卷封制）

## 一、这个实例解决什么

把「**任何符合配方形状的任务包**」从"人写完计划还要人来推着做"升级为：落盘即入队、双通道自动拾取、自治执行到收口、材料全程防篡改、故障分层取证自愈。任务包形状 = 计划文档（docs/execution/）+ 树注册（周平面 tree-op.json）。

## 二、六步标准流程（新战役照此配方复制）

| 步 | 角色 | 动作 | 硬性工件 |
| --- | --- | --- | --- |
| F1 铸计划 | TriMLC+CEO | 计划文档落 docs/execution/<date>/，带元信息头与验收标准 | plan.md（版本化） |
| F2 拆树封卷 | 小贾 | 树注册周平面；`seal-materials.py --attach` 预封 sourceMaterials；face/domainRouting 显式标注 | tree-op.json+卷封字段 |
| A 双远端挂平面 | 小贾 | push sg-bare（枢纽）+GitHub（镜像）；归账只 merge 不 cross-rebase | hook 日志秒级行 |
| D 自动拾取 | sg 编排层 | hook 秒级/cron :18,:48 兜底 → 三重门+面路由 → O_EXCL 锁+PID 判活+1800s 冷却 → spawn（cwd=树 repo 直落+裸命令铁律+BRIEF_V2） | registry ticks(rc·pid·trigger) |
| E 自治执行 | CC 会话 | 节点 fresh 派工×一次一节点；验卷→先写后报→原子提交→对卷收口；blocked 必走分层取证 | 每节点 status 翻转 commit |
| Z 收口回执 | 会话+小贾 | 树 done 快照 root 入战役档案；结果对账回填计划文档 §对账节；生产部署移交清单单列 | campaign-root + 回填节 |

## 三、护栏速查（管线自带，配方直接继承）

| 护栏 | 语义 |
| --- | --- |
| 原子锁 O_EXCL + PID 存活判死 | 同一时刻单会话；进程退出即释放队列 |
| 1800s 冷却无旁路 | 同指纹重入唯一路径；push 只对工作项变化生效 |
| 预算双门 | 15 亿 token/日台账 + 月度金额兜底 |
| 面路由 | m-face 缺省归 TriMMC；r-face 严格制显式标注 |
| 卷封制 | 材料漂移未裁决=不得通过（硬坎）；campaign Merkle root 收口存档 |

## 四、故障处置速查表（三天实战争得的六面墙）

| 症状 | 定层方法 | 解法锚 |
| --- | --- | --- |
| 工具命令被拒 | 取原始拒绝文本：审批前缀匹配层？ | D-11 裸命令/cwd 直落（orchestrate_tick c0ad6b8） |
| 执行通道缺失（npm/tsc 全拒） | 白名单对照被拒串 | spawn --allowedTools 全家桶（61dfaea） |
| push Permission denied | 裸仓 objects 属主分布 | D-10 chgrp+sharedRepository+bare-perm-heal cron |
| push 后 tick 无反应 | fade-hook.log 有无 dev-updated 行 | D-08 unset GIT_DIR；锁文件归属随推送者漂移须 666 共享 |
| tick 看不到新树 | `_sync_worktree degraded` 字样 | P1-1 自愈已内建；降级即查脏树 |
| 多线归账互拒 fast-forward | range-diff 看同补丁异 SHA | merge-only 归账规则（禁跨 hub rebase） |

## 五、运行证据链（首战役）

设计审查 CONDITIONAL_PASS→P0/P1 全修（fade-rehearsal-001/reports/design-review.md）；AC-4 受控实验 PASS（fadeslow-verify-001/reports/slow-path.md）；战役对账与本 root 见 p0-fix-and-trilc-merge-plan.md §四（root `40ee6f8c…`）。试卷与评分记录为补齐项（登记册跟踪中）。
