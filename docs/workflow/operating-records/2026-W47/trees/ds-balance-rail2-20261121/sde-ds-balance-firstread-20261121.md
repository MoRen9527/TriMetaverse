# SDE DS 官方 API 余额首读验证卷（轨二供数·CTO 技术形两裁承录）

- sourceOfTruth: 本卷（trees/ds-balance-rail2-20261121/sde-ds-balance-firstread-20261121.md·DS 余额首读与持久形裁定承录正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COO D-27 v4 派工（DS 余额首读验证·CFO 供数形转达卷 f95d06e94·落款 2026-11-21T03:32:18Z）
- 判定: **首读验证=通过（http 200·is_available=true·CNY total=83.66 granted=0.00 topped_up=83.66）·CTO 技术形两裁已承录（频率=每日随 CFO 日报+告警升频·供数形=.env 直读独立 key 面）·实施候 COO 派工**

## §一 · 首读读数（实测 2026-11-21T03:33:39Z 前后·零值面）

- **通道**：`GET https://api.deepseek.com/user/balance` → **http 200**。
- **读数原样**：`{"is_available":true,"balance_infos":[{"currency":"CNY","total_balance":"83.66","granted_balance":"0.00","topped_up_balance":"83.66"}]}`
- **key 源与指纹**：本机 `D:/Code/ai/.env` → `DEEPSEEK_API_KEY`·len=35·**sha16=7c310041469d7d76**（=COO 派工给定指纹·CTO 上游 200 已验同源）。
- **D-46 双闸**：key 仅入 Authorization header 零打印；响应侧 hex64 命中=0·key 子串命中=0。
- 护栏：只读零改·零 daemon 触·零 LLM token。

## §二 · CTO 技术形裁定两件（承录）

1. **频率**：常态=**每日一次随 CFO 日报**（对齐既有节拍·零新增调度成本）+ **告警升频形**（告警线候选 **20 CNY**·低于→CFO 面升频/升级·**阈值最终归 CFO 定**）；否每小时形（日级变化为主·GLM 面已解耦·分钟级监控无对价）。现余额 83.66 CNY·按日耗观测再校准。
2. **供数形**：**.env 直读（独立 key 面·非 card 载解密）**——理由=余额查询属运维/财务面工具非模型消费链·不依赖 card 加密链（解密面最小化·D-46 面收敛）；key 轮换=同源自动跟随；卡载解密形否（新增解密面零收益）。

## §三 · 实施挂账（候派工）

- 实施面=**SDE**（只读小脚本：GET balance→结构化输出 `is_available`+`total_balance`+`topped_up_balance` 三字段）+挂 CFO 日报链。
- 供数契约（日报格式/告警呈现）=**CFO** 面；**派工经 COO**（CTO 只裁技术形）。
- 本席收到 COO 派工单后实施；未派工前不预动。
- **实施必有注（CFO 回赠·2026-11-21 采认回执）**：采集脚本侧注明「**余额=账户级·多 key 同值属正常·勿以单 key 变动差异作告警源**」——防未来维护者误读为异常。
- **CFO 采认回执承录**：双证采认·「候选归属」标注解除·**轨二基线改锚=2026-11-21 11:36:01 CST·83.19 CNY**（83.66@11:33:39 降为历史点）·差分管保留=持续 sanity+日耗测量两用（CFO 卷锚 1180ee464）。

## §四 · 使用依据

- COO 派工（DS 余额首读验证·key 源/读数面/护栏五款）+CFO 转达卷 f95d06e94
- CTO 技术形两裁信（频率/供数形/实施派工路径）
- 活体：D:/Code/ai/.env 指纹对表+api.deepseek.com 首读响应
- D-46/D-47

## §五 · 账户同异判定（CFO 关键注②静态解·哈希+余额双证）

- **问题**（CFO 注）：.env 基线 key 账户 与 DS 轨实际消费账户（TriModel 卡载 key）同异未见证。
- **静态勘定（零值面·只出指纹）**：卡面 provider_entries 三条 key 均**加密态**（api_key_encrypted·len 84/104）→ key-cache 走 `GET /v1/config/cards/rmc?view=pull`（Bearer TRIMODEL_API_TOKEN）解明文。三 key 指纹：e-glm-anthropic/e-glm-flash-anthropic sha16=**817845d517233499**（len 49）·e-deepseek-anthropic sha16=**fadbdaf2de323f23**（len 35）·.env DEEPSEEK_API_KEY sha16=**7c310041469d7d76**（len 35）——**异 key 确认**。
- **账户判定（余额=账户级属性·双 key 交叉）**：.env key 首读 03:33:39Z=**83.66**；卡载 deepseek key 03:35:53Z=**83.19**（http 200·R-HY 本机出网）；.env key 复读 03:36:01Z=**83.19**（与卡载读数 8s 差同值至分）且 env key 自身 83.66→83.19 跟随实况消费（-0.47 CNY/~2.4min=DS 轨正在消费）——**判定=同账户多 key 形**（两独立账户恰同步同值到分+同步掉额不可信），**轨二 .env 直读读数对 DS 消费账户具归属效力**（CFO「候选归属」标注可解除·差分监视仍建议保留为持续 sanity）。
- 旁注：勘定时刻 DS 消费活跃（−0.47 CNY/~2.4min 短窗样本·不外推日耗）。

—— SDE 小布（m-sde·DS 余额首读通过+CTO 两裁承录+账户同异判定同账户入卷+CFO 采认回执/实施必有注承录·实施候 COO 派工）·写前现查 2026-11-21T03:37:23Z（+8=2026-11-21 11:37:23·date 现查原值·D-47 正形）
