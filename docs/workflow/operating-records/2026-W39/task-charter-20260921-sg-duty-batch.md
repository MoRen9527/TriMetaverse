# 任务书·sg 值席批次（发布位追平+MAP 补漏+追平确认）

- sourceOfTruth: 本件=董事会任务书（CEO 2026-09-21 11:25 令：能给他做的任务书挂上，确保自动拾取）
- syncMode: static
- lastSyncedAt: 2026-09-21 11:2x
- 主责: m-duty-cos（sg 值席）
- 送达: 本件 scp 至 sg 工作树 + tmux 工单派发（BOD 跑腿）

## 任务清单（服务域可执行四件）

- **T-a·sg 发布位追平**：/srv/fleet/TriMetaverse/.claude/agents/ 全族从 bare fetch+ff 后与本地渲产物对表同步（双腿化/:20 三条/职责 12 条/SDE 正名族）——13 席下次启动读新正身。防坑：渲管线在本地，sg 侧=同步渲产物文件（git 协议 fetch bare），非本地跑管线。
- **T-b·bare-fetch-all MAP 补漏**：/home/fleet/bare-fetch-all.sh MAP 表补 TriRMC/TriGateway（CTO 候勘项转正式——现表 18 仓名缺此二）；补后手跑一轮验证 FETCH-OK。
- **T-c·sg bare TMV 追平**：/srv/git/TriMetaverse.git 从本地工作树路径 fetch（本地改名笔 senior-deployment-engineer 等）+工作树 fetch bare ff——sg 工作树/bare 追平本地顶。
- **T-d·D-13 入册两令核对**：T3 差口（FADE-008 server T3）指 D-13 名册两项入册候办——核对 D-13 现卷，缺则登记（内容照 FADE-008 server T3 收口报告），登记后回执。

## 验收锚

1. sg 发布位抽查 3 席（CPO/CTO/SDE）与本地渲产物 diff=0；
2. bare-fetch-all MAP 20 仓全（手跑一轮零 FAIL）；
3. sg bare+工作树 TMV 顶=本地顶（任务书发出时点）；
4. D-13 两令入册或登记回执；
5. 各节点收口报告落树（本件同树 exec/ 段）。

## 边界

- TriMC 服务目录禁动（照 A-1 注记）；
- 渲管线不在 sg 跑（本地跑完同步产物——T-a 口径）；
- 收口回执经 LG-036 notify 通道发 BOD（实战第二例）。

## 收口区（四件·m-duty-cos 执行·2026-09-21 12:0x+08）

- **T-a ✓**：ff 后发布位全族==HEAD；抽查 CPO/CTO/SDE diff=0×3；SDE 正名族入发布位实证。报告=trees/20260921-sg-duty-batch/exec/t-a-publish-face.md
- **T-b ✓**：MAP 18→20（TriRMC/TriGateway，ls-remote 双核实）；手跑 20/20 FETCH-OK 零 FAIL；CTO 候勘项就此销案。报告=exec/t-b-map-fix.md
- **T-c ✓**：BOD 手镜像笔对表一致后 ff；树顶==bare 顶==999b81bb（T-c 时点）。报告=exec/t-c-tmv-catchup.md
- **T-d ✓**：现卷核对（条 4 映射已在册）+缺项登记两笔（bf4360f：DE 行小布按册补录+SDE 正名族入册注记）；残差=tmux 改名重启候 BOD 窗。报告=exec/t-d-d13-register.md
- 五锚态：①✓ ②✓ ③✓（时点读数见 T-c/E 段）④✓（登记回执即本段+bf4360f）⑤✓（本树 exec/ 四件）
