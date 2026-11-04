# SDE 毕报 · TriMMC 8712 受控重启链（现刻提前·一窗双变+批 5 残段闭环）

- sourceOfTruth: 本卷（8712 重启链施工收口正身·八步全序+根因五环+遗留显面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COS 转办（2026-11-04T21:49:28+0800·CEO 质疑裁「23:30 窗撤销现刻即办」·经 bod 转办）·SOP 基线=8713 勘修窗 2026-10-11 同构 sg 形

## §一 · 自裁结论（令文事实缺口·带理由）

**裁 a 形=一窗双变兑现**（node22 升形+fade 端点同窗生效）。理由三锚：
1. /opt/node22/bin/node **v22.23.4 在盘**（10-21 装）
2. trimc-start.sh **PATH=/opt/node22/bin 切形 mtime=2026-11-04 17:25:12+08**（今日下午落——FSD 工序 3 切毕实证）
3. 现役进程真身勘定：旧 pid 3705072 exe=/usr/bin/node（v18.20.8·14 天前起）——「装毕切毕只差生效」逐字吻合
全局 node 勘定旁证：/usr/bin/node=v18.20.8 唯一·无 nvm/local-bin 22 形——切形唯 start 脚本 PATH 一道（冷启自然带 22）。

## §二 · 八步全序读数（sg 形映射·五轮进程谱）

| 步 | SOP 形 | sg 实形 | 读数 |
|---|---|---|---|
| 1 | watchdog Disable | **不适用跳过**——sg-seat-watchdog.sh（crontab */5）grep 零 trimc/8712 牵涉（实锚） | — |
| 2 | /shutdown | systemctl restart **polkit 拒**（fleet 无 sudo 免密·「Interactive authentication required」）→kill -TERM 形（进程属 fleet） | 含一次管道吞 RC 假绿自纠（systemctl\|head RC=0 假 C-OK·显式 RC 捕获后真执行） |
| 3 | port FREE 验 | 每轮启动前 ss 断言 | ✓（五轮全过） |
| 4 | 冷启 | systemd Restart=on-failure **未触发**（TERM 外部杀 inactive(dead) 不拉起）→手工 setsid nohup trimc-start.sh 过渡形 | 五轮（见下谱） |
| 5 | pid 对表 | ss pid+readlink /proc/<pid>/exe 逐轮断言 | 终 pid=**1915139** |
| 6 | Enable | 不适用（watchdog 未停） | — |
| 7 | healthz | curl /healthz | ok true·**jobCount=16**·degraded false·consecutiveFailures 0 |
| 8 | fade 端点进程内探针 | POST /internal/v1/fade/runs | **200 APPROVED gated=true**（对照 BOD 21:40 同打 404=端点部署闭环实证）+401 fail-closed 面（无/假 token 双探） |

**进程谱（五轮·每轮红灯自拦根因）**：

| 轮 | pid | 终局 | 拦获根因 |
|---|---|---|---|
| 旧 | 3705072 | kill | node18 期 14 天旧进程（exe=/usr/bin/node） |
| 1 | 1888902 | 弃 | **缺 systemd drop-in env**（jobCount=0 红灯自拦——cron store 回落错位） |
| 2 | 1890894 | 弃 | fade 端点 500 逐段暴露：SKILL.md not found tri-fade011-score→close→AGENTS.md 映射 false |
| 3 | 1905698 | 弃 | gateDetail=checker script not found（TMV_REPO_ROOT 缺省 dev 布局假设错位） |
| 4 | 1912337 | 弃 | gateDetail=python 3.6.8 无 datetime.fromisoformat（AttributeError exit=1） |
| **5** | **1915139** | **终** | 全绿：node22 exe+jobCount=16+**APPROVED gated=true** |

**node22 生效实证（一窗双变第二变）**：终轮 exe=**/opt/node22/bin/node**（v22.23.4·environ PATH=/opt/node22/bin 前置）。

## §三 · 根因五环（修复链全谱）

1. **drop-in env 手工形缺件**：systemd drop-in 九键（TRIMC_CONFIG_DIR/HOME×2/NOTIFY_DUTY 三件/PORT/HOST/TRIMMC_TRI_SKILL_ROOT）手工冷启不自带→jobCount=0 红灯自拦→逐键注入修复
2. **fade skill 族未部署+root 配置错位双因**：tri-fade011-{score,close,plan} 三 skill sg 缺位（本机 TriSkill/skills/engineering/ 为源·scp 部署）+TRIMMC_TRI_SKILL_ROOT 现值=/srv/fleet/TriSkill（缺 /skills/engineering 两层——skill-loader.ts:349 注释直证期望形=…/TriSkill/skills/engineering·resolve ../../AGENTS.md）→修正=/srv/fleet/TriSkill/skills/engineering
3. **AGENTS.md 映射行缺**：/srv/fleet/TriSkill/AGENTS.md 零 tri-fade011-plan 命中（agents_md_mapping=false 检查=文件存在且含映射行·driver.ts:177）→本机版同步（1 命中）
4. **TMV_REPO_ROOT 缺省错位**：closing-gate.ts:31 D-24 env override 正道·缺省=dev 布局假设（scriptDir 上三层+TriMetaverse=/srv/fleet/TriMMC/TriMetaverse 不存在）→env 注入 /srv/fleet/TriMetaverse
5. **python 解释器旧**：sg 缺省 python=3.6.8（fromisoformat 3.7+ API·checker 炸）→/usr/bin/python3.8（3.8.17 在位）TRILC_FADE_PYTHON 显式注入（D-65 显式解释器形）

**终轮 env 全谱**：drop-in 九键+TRIMMC_TRI_SKILL_ROOT（修正值）+TMV_REPO_ROOT+TRILC_FADE_PYTHON=/usr/bin/python3.8。

## §四 · 批 5 残段闭环（令文要件③）

- **runId=fade011-daily-20261104-221104·http=200·created=true·finalState=APPROVED·gated=true**
- 树位（sg）：/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W45/trees/fade011-ew-runs/fade011-daily-20261104-221104/（plan.md+artifacts/dce-output.md+reports 全谱）
- close-output.json 值面：verdict=**APPROVED**·gate_check score_total=**100**（阈值 90）·required_all_passed=true·hash_match=true·pending_list 零项
- 与 8713 对照形（214104·APPROVED·0.8s）同族正态——批 5 完整语义闭环（阶段一 ✓+阶段二 ✓）
- 过渡轮 runId 谱如实留痕：214027（404）/220034/220405/220418/220507/220610/220705/220701/221000（FINALIZING 系·gateDetail 全落响应面）/**221104（APPROVED 终）**

## §五 · 遗留显面（候 root/FSD 面·非本席即办）

1. **drop-in 缺三键候 root 归位**（现役手工形 env 已修正但 systemd 持久面缺）：tri-skill-root.conf 值修正 /srv/fleet/TriSkill→/srv/fleet/TriSkill/skills/engineering+新建 tmv-repo-root.conf（TMV_REPO_ROOT=/srv/fleet/TriMetaverse）+fade-python.conf（TRILC_FADE_PYTHON=/usr/bin/python3.8）→daemon-reload
2. **systemd 形复位序**（root 归位时）：杀手工进程 1915139→systemctl start trimc（勿 restart 撞端口）→pid/healthz 复验
3. python 3.6 checker 兼容=代码面候 FSD 裁（TRILC_FADE_PYTHON 3.8 注入已解运行面·drop-in 补键即持久）
4. root 直下过渡副本已自清（skill 三件退役毕·零漂移种子）——engineering 分类层为唯一权威位
5. FSD 工序 3 环境缺口知情件：skill 族部署+AGENTS.md 映射行+drop-in 三键=工序 3「env 就位」面漏件族——已修运行面·FSD 下次工序单勘补清单

## §六 · 使用依据

- COS 转办令 2026-11-04T21:49:28+0800（八步要件+自裁条款+批 5 残段联动）
- 8713 勘修窗 SOP（trimlc-repair-window-20261011 同构 sg 形映射）
- bod-batch5-run-20261104.md（两形试跑谱+残段定义+8713 对照读数）
- fade011-ew-auto-trigger/brief.md §四（S5 触发面端点形+token 通道）
- TriMMC 源码实勘：app.ts:236-295（端点）·skill-loader.ts:347-351（root 期望形）·driver.ts:171-182（可达性检查）·closing-gate.ts:28-49（TMV_REPO_ROOT/python 解析）
- sg 活体读数全程 ssh 勘定（D-46 掩码管道·值面零回显）
