# 任务书 20260914-夜航01（BOD 应急打包，PACE 首航）

- face: **server-executable → M 面 MMC（M-SG）值席拾取执行**
- PACE: P=本任务书（已铸）→ A=已挂本平面（W37）→ C=MMC 值席拾取派树 → E=节点收口回写本文件
- 边界: 不动 R-HY 生产数据；bare dev 整合一律 ff-only；遇冲突即停回报；深夜生产机操作逐条留痕

## 任务1：周迁移回流三修（R-HY 链通）
- 内容: ①R-HY 推回被拒（非快进）按台账「回流冲突解法」通链，03774c50 推上 hub bare dev；②`.tricompany-cognition/` 定性（跟踪 vs gitignore）；③周迁移作业加「push 被拒→再拉取→合并→重推」分支
- 验收锚: hub bare TMV dev 含 03774c50；R-HY 与 hub 双向平；作业 json 含重推分支
- 证据: 执行读数回写本文件收口节

## 任务2：hub 对齐（sg 工作仓拉平）
- 内容: /srv/fleet/TriMetaverse 与 /srv/fleet/TriCompany 拉平至 hub dev 最新（含本任务书提交 4617cc22 之后）
- 验收锚: 两仓 `git log --oneline -1` ≥ 本任务书提交；工作树净

## 任务3：B3/B4 打样批（树协议回归首航）
- 内容: project-sources 2 件 + source-agents 首批 10-30 件按任务书树协议联审（五席独立意见→汇总）
- 验收锚: 树文件夹落 operating-records 当前周 trees/；节点收口报告齐；汇总件呈 BOD

## 收口区
（执行席逐任务追加：## 收口-任务N + 时间 + 读数 + 证据指针）
