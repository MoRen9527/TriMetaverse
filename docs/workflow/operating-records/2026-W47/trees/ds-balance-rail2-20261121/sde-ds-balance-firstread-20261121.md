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

## §四 · 使用依据

- COO 派工（DS 余额首读验证·key 源/读数面/护栏五款）+CFO 转达卷 f95d06e94
- CTO 技术形两裁信（频率/供数形/实施派工路径）
- 活体：D:/Code/ai/.env 指纹对表+api.deepseek.com 首读响应
- D-46/D-47

—— SDE 小布（m-sde·DS 余额首读通过+CTO 两裁承录·实施候 COO 派工）·写前现查 2026-11-21T03:34:14Z（+8=2026-11-21 11:34:14·date 现查原值·D-47 正形）
