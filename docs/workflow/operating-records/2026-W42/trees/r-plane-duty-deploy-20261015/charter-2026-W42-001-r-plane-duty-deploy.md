# R 面班组部署窗任务书 · 2026-10-15

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/r-plane-duty-deploy-20261015/charter-2026-W42-001-r-plane-duty-deploy.md
- syncMode: static（原始态件·执行中不迁移不覆写——M2 §五原始态两分离）
- lastSyncedAt: 2026-10-15T20:46:40+08:00（date 现查原值·D-47 正形 A）
- 令源: CEO 直连会话 2026-10-15T20:42 直令「开，走 COS 链排窗」（BOD 20:42:44 转令流转·背景读数随令转录）
- 形成位: COS 小贾（备料起草·G0 初判）
- 执行域: TriRMC / TriRLC / TriMLC / TriMMC（跨域任务列全值·主执行域 TriRMC 在前）
- 挂账号: LG-080
- face 路由: 会话实体=BOD/CEO·制度=本件+M2 模板+D-27 v10·施工=SDE 跨机部署+河源侧施工位·验收=BOD/CEO
- 立书位: 董事会 BOD（CEO 直令转呈）
- 来源三路（登记面必填枚举）: 董事会令

## 一、目标与范围

- **目标态（CEO 原义锚）**：R 面（河源）duty 班组部署窗开立——BOD 20:33 活体现探 R-HY 8.155.54.79 读数：TriRMC 8710=active·healthz 绿 ok=true·cron 3 jobs·cf=0；河源 tmux root/fleet 两侧**零会话=班组实体不存在，本窗即组织流向目标态落地窗**（CEO 2026-10-14 定谳「1BOD+4COS·域内整班组独立闭环」之 R 面落地）。
- **部署四要素（BOD 转令照录）**：①R 面 duty 席位进程树部署，与 M 面 sg 13 席同构对表；②名址注册；③TriRMC 机制面与席位链路打通（notify+cron 通道）；④席位复活名址缺口家族坑预防（CLAUDE_CODE_CHILD_SESSION=1 启动前清变量）。
- **范围边界（不做什么）**：不改动 TriRMC daemon 本体代码（机制面配置除外）；不动 M 面 sg 13 席现役运行态（对表只读参照）；不涉 R 面 13 席**人格内容定制**（部署=进程树+名址+链路三层，源侧八件套绑定候部署窗毕另行流转）；不称生产部署（两面皆研发环境·CEO 2026-10-14 定性）。

## 二、拆树表（草案——终拆归执行域 COO·charter-id:tree-id=1:n）

| 序 | 内容 | 施工位 | 门禁/毕锚 | 止损 |
| --- | --- | --- | --- | --- |
| 1 | R 面 duty 席位进程树部署（与 M 面 sg 13 席同构对表：/srv/fleet/ 两面同构布局） | 河源 R-HY | 13 席进程树活体在跑+tmux 会话在册；同构对表读数落卷 | 进程树 kill 回退·零残留断言 |
| 2 | 名址注册（13 席名址面，对表 M 面名址形态） | 河源侧名址面 | ListAgents 等价面名址互见读数落卷 | 名址条目回退 |
| 3 | TriRMC 机制面×席位链路打通（notify 投递+cron 通道） | 河源 TriRMC 8710 | 首信直达席位箱+cron job 新建三查（201+next_run 值面+enabled=1）+触发读数 | 通道配置回退·daemon 优雅停重启链 |
| 4 | 席位复活名址缺口家族坑预防（启动器面） | 河源席位启动器脚本 | 启动前清 CLAUDE_CODE_CHILD_SESSION=1+置 FORCE_SESSION_PERSISTENCE=1 断言在案+冷启抽验 | 脚本回退 |

## 三、窗位段

- **charter-id**：`charter-2026-W42-001`（备料 COS 授号·2026-10-15 20:46·登记面主键——**任务书端立册**·D-27 v10 两段式；周索引 OP-202610-W42-001.json metadata.charters 指针形登记）。
- **树锚**：执行域拾取后拆树授予（charter-id:tree-id=1:n·树 front-matter 带 `charter:` 回指——**执行域拆树**·D-27 v10；canonical 树名=工作名 kebab 规范化·同工禁双树）。
- **白名单四类件**：本件属 **daemon 勘修重启类**（TriRMC 机制面配置+席位进程树启动）——出窗位段候排：窗位由 COO 排（G1 终裁·D-23 v3 对轨·GLM/DS 轨对表）→**报 CEO 确认**（D-39 边界收窄 2026-10-14 10:00 令②：任务书和排窗须 CEO 确认）→窗开执行。
- **避让约束（G0 初判输入·非排窗裁决）**：本机 21:33 dim-4 观察窗（one-shot cron ef9f0b91）在档——R 面窗若排今晚须错开；时长预估（G0 初判）**90-150min·服务域轨**（预估≠裁决·G1 终裁权=COO）。

## 四、边界护栏

- **D-24 机位断言**：河源=独立机（R-HY 8.155.54.79）·活体现探禁推定；本机读数禁代河源态（本窗背景读数系 BOD 20:33 河源活体现探所得·施工前重探刷新）。
- **daemon 重启纪律（TriRLC 家族·TriRMC 同族适用）**：权威路径禁裸杀；优雅停=POST /shutdown→验 port FREE→冷启；完工三断言=uptime 重置+pid/CIM 对表+watchdog.log 旁证。
- **cron 白名单精确等值（家族性 F-3）**：ALLOWLIST=精确全串比对·command 字段任何变更=必 403 须追加+重启；POST 201≠会触发·新建 job 判定三查=201+next_run 值面+enabled=1。
- **端口硬规则**：TriRMC=8710（河源服务域）/TriRLC=8711（本机 R 面本地域）/TriMLC=8713（本机 M 面本地域）/TriMMC=8712（sg M 面服务域）——探错端口空回≠服务停·store 位同理先对 DATA_DIR。
- **D-46 含密值面探针四正形+D-54 凭证轮换施工纪律**：涉河源 token/凭证配置段——值面禁进打印路径·先 split 后掩码；轮换前勘消费对象三段链+候选载入位全清点（若涉）。
- **席位复活名址缺口家族坑（本窗四要素之④·条款级强调）**：CLAUDE_CODE_CHILD_SESSION=1 环境遗传致名址缺口——**启动前清该变量+FORCE_SESSION_PERSISTENCE=1**；代起常驻进程前必清。
- **D-47 信面落款机械合同**：毕报/状态条落款=date 现查原值·禁估读/虚标现查。
- **硬门签认必落卷直达**：门消费面读树不读会话——签认席自己落卷+commit 直达通知。
- **共享 JSON 账本写法纪律**：名址/配置若涉 JSON 账面——load→改→dump 全程解析·禁 Edit 文本行插入。
- **组织流向条款**：R←M 经 BOD 各 COS 流转（1BOD+4COS 目标态）；M 面 sg 13 席为同构对表只读参照·禁动其现役运行态。

## 五、会签位

- 起草席落款（date 现查原值）→会签席落款。
- 起草：COS 小贾 2026-10-15T20:46:40+08:00（date 现查原值·D-47 正形 A）——G0 初判：>30min 明确·服务域轨·时长预估 90-150min。
- 会签生效判据（M2 §五）：会签=读卷+独立抽验+边界核对+表态三选（「认·生效」/「认·附修改项」/「不认·退改」）——表态落卷即生效。
- 会签候：COO（G1 终裁+排窗窗位·D-23 v3 对轨）+CTO 域约束知会（daemon 机制面）。

## 六、毕报链

- 经 COS 链（新链形 COO→COS→CEO→COS→COO 或席间 COS 收口）。
- 节点完成必出 brief+checkpoint（progress 摘要/artifactCommit 产物 git SHA/resumePoint）·树投影与节点台账同步；毕报落款 D-47 正形。
- 窗毕候 CEO 确认验收（本窗系 CEO 直令·验收呈报面=BOD→CEO）。

## 使用依据

- CEO 直令 2026-10-15T20:42「开，走 COS 链排窗」（BOD 20:42:44 转令流转·回执即记账 D-01）
- M2 任务书模板正形（TriCompany/docs/workflow/task-charter-template.md·六段+§五登记面 schema·M2.x 版）
- D-27 树协议执行层标准 v10 两段式（TC a393207·任务书端立册+执行域拆树 1:n）
- D-39 裁决分级+边界收窄（2026-10-14 10:00 令②·排窗须 CEO 确认）
- D-23 v3 排程窗口指导表（daemon 勘修重启类四类判据+GLM/DS 双轨对表）
- 组织流向 1BOD+4COS 定谳（CEO 2026-10-14·域内整班组独立闭环目标态）
- 席位复活名址缺口家族坑（CLAUDE_CODE_CHILD_SESSION=1 环境遗传·启动前清+FORCE_SESSION_PERSISTENCE=1）
- M 面 sg duty 施工面同构参照（/srv/fleet/ ↔ D:/Code/ai/ 两面同构·7×24 duty 施工面设计）
