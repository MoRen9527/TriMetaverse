# FADE-001 P1 告警闸部署段毕报（即日开工令·九项全毕·SMTP 端到端实锚）

- sourceOfTruth: 本件（fade001-phase1-review/cto-deploy-closeout-20261113.md·部署段毕报）
- syncMode: static（读数锚·11-15 值守窗首拍=版 A 实装形端到端首次实锚）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 11:43 直连令（「不是批了立即动工么」=批令语义立即动工·11-14 排期读法作废）→COS 11:50:29 流转即行令→COO 11:52:59 开工令知会（授权窗零重签·expiry 11-16 10:45:44 在有效期）→本席 11:51 启动确认→11:58 三查呈报→COS 11:59:35 采认（无异议不打断）→施工→12:07 毕

## §一 前置验真三查读数（11:58 呈报·毕报复载）

| 查 | 判 | 读数 |
|---|---|---|
| ① 检出版本 | 过 | TriCompany 河源检出（/srv/fleet/TriCompany）P1 改点锚 grep=2（b67a19a9/1f3b997）·两仓 fetch 见顶（TriRMC 3c588ef/TriCompany 8cc9ca9） |
| ② 单元活体 | 过 | trirmc.service（COO 勘定活体名·技术卷 trirmc-mc.service 名不实——unit-name-correction-note 对表）·active·WorkingDirectory=/srv/fleet/TriRMC·ExecStart=node dist/src/index.js（**dist 编译产物——部署序含 build 步**）·EnvironmentFile=/srv/fleet/trimodel-data/api-token.env（SDE 09-29 单一真源）·User=fleet·drop-in=mem.conf（MemoryMax 600M）+override.conf（env 引用+API_URL+PATH） |
| ③ 8712 端点 | 过+架构发现 | TriMMC 8712 实位在（sg 本机 healthz=200）**但绑定面=127.0.0.1 loopback only**（ss 实勘）——dev/河源跨机探皆 000·HTTP 辅形跨机不可达（裁定见 §四） |

## §二 部署施工序读数（九项全毕）

1. **两仓 push+收编**：TriRMC 分叉收编（远端 2 笔=值席族 dsh-gateway-client+bridge fix 10-17/10-20·app.ts auto-merge 无冲突行·check 绿+alarm 25+dsh 11=36/36+cron glob 形 61/61 全绿）→顶=3c588ef 双通道（github+sg bare）push·ls-remote 验真一致；TriCompany 顶=8cc9ca9（本席 64e71d9fda+COS 11:52:51 台账补笔线性链）双 pushurl+sg-server 推成验真一致。**读数变形注**：`node --test test/cron/` 目录形在 Windows 报笼统 fail 1（runner 目录加载语义变形）——glob 文件形复现 61/61 全绿=毕报读数基准（假读数家族又一向·runner 目录形·入卷）。
2. **河源两仓 ff**：TriRMC 2c5395e→3c588ef·TriCompany 66e2514→8cc9ca9（root fetch 属主修正 chown fleet 归还）。
3. **河源 install+build**：agent-core npm install up-to-date+dist rebuild（job-store.d.ts 12:00）·TriRMC npm install（nodemailer@10.5.0 added 2 packages）+build（alarm 三件套 dist 12:00 新烧）。
4. **env 值面装配**：TRIRMC_ALARM_* 七键（ENABLED+SMTP HOST/PORT/USER/PASS/FROM/TO）写入 api-token.env（值源=/home/fleet/.trimetaverse/notify.json 现役 notify config 原样搬运——实勘现役键族不在 api-token.env·凭据真源=notify.json 0600 fleet）·幂等剥离重写·0600 fleet 归还·**全程值零回显**（D-46·装配脚本输出只键名+nonempty 布尔）。HTTP URL/TOKEN 不配（挂账）。
5. **重启链×2**：部署重启（PID 2115702→2121552）+payload 改形后重启（→2121952）·Restart=always systemd 自守·两次皆 healthz ok+通道行+store/log 投影复验。
6. **告警闸装配实锚**：`[cron-alarm] enabled channels: smtp:smtp.qq.com:465`（通道名日志·零凭据值）·cron service 4 jobs 装载·零误报告警静默运行。
7. **run id+payload 终形改形**（件1+件4）：jobs.json weekly-plane-shift job（9c81c7ec）command 819→**1520 字符版 A 实装形**（备份 jobs.json.bak-pre-payload-vA-20261113·4209B）——骨架五要点全含（set -eo pipefail/RUN_ID 铸形第一动作 `shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)`/preflight 前置写 preflight.json+拦截轮 manifest/值面三查）+**两处实装勘定**：(a) **trap EXIT 全链兜底**——修正版 A 骨架语义缺口：set -e 中途退会绕过现役尾段 `||` 兜底·trap 形保住 shift_notify_fail 告警面（preflight 拦截轮也 notify·文案挂 run id 可追溯·语义偏差知情）；(b) **双仓拓扑勘定**——TriCompany 河源 remote 的 sg-bare 实名=**origin**（TriMetaverse 仓才叫 sg-bare）·TriMetaverse pull 段保留现役位·`{OPERATING_ROOT}` 方案占位符改现役硬编码（WEEK_TOKEN_RE 仅三 token 不展开 OPERATING_ROOT）·版 A 尾段缺 cd TriMetaverse 段照现役链补齐。值面三查：json.load 断言 OK/enabled=True/**nextRunAtMs=1794757800000=2026-11-15 23:50:00 保留**（值守窗硬时钟对齐）/staggerMs=0/id 9c81c7ec。
8. **SMTP 端到端探针**：`SMTP probe: SENT ok`——河源→smtp.qq.com:465 SSL+凭据+TLS 全链通（一封性·主题标注 FADE-001 P1 部署验证·值零回显）——通道实锚非纸面（「看起来能跑」≠「可以稳定交付」本席原则对齐）。
9. **F5 顺手窗**：healthz `storePath=/srv/fleet/TriRMC/data/cron/jobs.json`+`logPath=/var/lib/trirmc/cron/logs` 投影已生效——**两路径不同源知情**（store=job-store 读 TRIMC 旧名键 fallback cwd/data·log=TRIRMC_CONFIG_DIR 派生 /var/lib/trirmc）——投影目的正是让此不对称可见（命名残留债·a/b 形留 DCE 段重构窗·不拦部署）。

## §三 exit 4 定性读数

现役链通道=SMTP 形实勘确认（runtime/cognition/notify.py=smtplib·NOTIFY_SMTP_*·config 文件 ~/.trimetaverse/notify.json）——bash 链尾 shift_notify_fail 现役语义不受扰·验收锚③不受扰（11:58 呈报定性·COS 采认）。版 A 实装形 trap 兜底语义知情见 §二.7(a)。

## §四 HTTP 辅形挂账裁定（11:58 呈报·COS 采认·台账 COS 跟踪）

8712 loopback only 物理不可达——TRIRMC_ALARM_HTTP_URL 不配（wiring 零通道逻辑自动跳过·代码面已处理）·挂账项「HTTP 辅形候跨机通道」归 MMC 面拓扑变更提案（改绑/隧道/中继三案候裁·涉服务域变更超出 P1 范围）·本席技术债/风险组合登记后续窗裁决。

## §五 回滚锚

- 代码面：revert TriRMC 50988e040+TriCompany 64e71d9fda 两笔+河源重拉+build+重启（零数据迁移面）
- jobs.json：restore 备份 `jobs.json.bak-pre-payload-vA-20261113`+重启（现役 819 字符 command 原样在备份）
- env 面：剥离 api-token.env TRIRMC_ALARM_ 段+重启（daemon 无告警闸 env=零通道 disabled 自动跳过——零行为差）
- SMTP 探针：一封性已完成·无残留面

## §六 观察面与待办

- **11-15 23:50 首拍**=版 A 实装形端到端首次实锚（run id 铸形/preflight 四断言/manifest 落卷/pipefail tee 链全首验）——值守窗值席 23:45 前置 diverging 预检在轨·晨检三读数首数据点
- 告警闸自然触发首轮=SMTP 实发二次实锚（探针已实锚通道·自然轮验证判定面）
- 挂账：HTTP 辅形跨机通道（COS 台账）·TRIMC/TRIRMC 键名残留债（DCE 段）·lock root name=trimodel 旧态（11-14 顺手窗实测——本机侧·未入本段）
- 观察：批后 2 周+期末三态（本席=技术面裁决 owner）

## 使用依据

CEO 11:43 直连令（COS 11:50:29 流转）/COO 11:52:59 开工令知会（510 笔 72386e5c44）/COS 11:59:35 采认/技术卷 cto-phase1-tech-plan.md 13c67aa3c §四版 A 骨架锚/synthesis.md 36bf14a1d/预研段毕报 f210919f4（三件代码 50988e040·64e71d9fda）/unit-name-correction-note.md（活体名勘定）/现役读数=本卷 §一§二（journalctl/healthz/探针输出原样）。

—— CTO 小狄（m-cto·部署段毕报），2026-11-13 12:07:26 +0800（写前现查 2026-11-13T04:07:26Z 原值粘贴·D-47 正形）
