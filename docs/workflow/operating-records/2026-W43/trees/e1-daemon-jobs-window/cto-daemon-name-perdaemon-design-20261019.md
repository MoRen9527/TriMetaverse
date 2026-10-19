# CTO 设计稿 · window-reminder-patrol.mjs DAEMON_NAME per-daemon 化（候 A2 改派稿连带批）· 2026-10-19

- sourceOfTruth: 本稿（trees/e1-daemon-jobs-window/cto-daemon-name-perdaemon-design-20261019.md）
- syncMode: static（设计稿·挂账件① DAEMON_NAME 硬编码改造·COO 21:06 裁「设计归 CTO 面·候 A2 改派稿连带批」）
- lastSyncedAt: 2026-10-19T13:23:55Z（+8=21:23:55 北京·date 现查原值粘贴·D-47 机械闸）
- 缺口出处: A1 窗勘验（收口卷 431998c33 §三·脚本 L16/L113 实勘）

## §一 缺口与目标

**缺口**：`scripts/ops-local/window-reminder-patrol.mjs` L16 `DAEMON_NAME='TriMLC@8713(win-m-cto-host)'` 硬编码·全脚本唯一消费点 L113（提醒卷头「提醒拍发: ${DAEMON_NAME} …」D-47 落款行）——8711 真提醒拍落卷将冒 8713 名义（D-24 机位断言头失真）。现空转故未显形，四 daemon 全量部署后必显形。

**目标**：身份位 per-daemon 化——①8711 零额外配置即正名 ②8713 现役零变化（向后兼容硬门）③四 daemon 同一脚本源 ④零 ALLOWLIST 变更·零 daemon 重启（硬约束：cron command 白名单=精确全串比对，command 面任何变更=必 403+追加+重启，本设计全程不触 command 面）。

## §二 方案三选一裁决

| 方案 | 形 | 裁 |
| --- | --- | --- |
| A. env-only | `process.env.TRILC_WR_DAEMON_NAME \|\| 旧默认` | ✗ 单用：8711 须改 ps1 壳加 env→**须 daemon 冷启才生效**（job 子进程 env 继承 daemon·daemon env 由壳注入）——违目标④ |
| B. DATA_DIR 推断-only | basename 映射推断 | △ 单用：隐式耦合目录命名，新机位（8712/8710 服务域·DATA_DIR 命名未实勘）无 env 逃生门 |
| **C. 混合（裁用）** | **env 显式优先 → DATA_DIR basename 映射推断兜底 → 旧默认保底** | ✓：8711 现役 `TRILC_DATA_DIR=trirlc` 已设（A1 勘验·ps1 L10）→**零配置零重启即正名**；8713 零 env→推断 `trilc-channel` 命中同值零变化；8712/8710 部署时壳显式 env（身份含机位面·A2 部署稿连带定名） |

## §三 改动面（diff 级·单文件单点）

L16 一行替换为：

```js
// D-24 机位断言头（per-daemon: env 显式 > DATA_DIR 映射 > 旧默认=8713 向后兼容）
const DAEMON_IDENTITY_MAP = {
  trirlc: 'TriRLC@8711(win-r-cto-host)',        // 本机 R 面本地域·A1 勘验实锚
  'trilc-channel': 'TriMLC@8713(win-m-cto-host)', // 本机 M 面本地域·现役默认同值
};
const DAEMON_NAME = process.env.TRILC_WR_DAEMON_NAME
  || DAEMON_IDENTITY_MAP[DATA_DIR.replace(/[\\/]+$/, '').split(/[\\/]/).pop()]
  || 'TriMLC@8713(win-m-cto-host)';
```

附验证旗标（入口处·不影响 cron 无参形态）：

```js
if (process.argv.includes('--print-identity')) { console.log(DAEMON_NAME); process.exit(0); }
```

改动统计：净增 ~8 行·净改 1 行·消费点 L113 零改。注意：`replace+split` 取 basename 兼容 Win`\`/POSIX`/` 双形态（8712/8710 跨机预备）。

## §四 兼容矩阵

| daemon | env 设定 | 推断路径 | 生效身份 | 需重启 |
| --- | --- | --- | --- | --- |
| 8713 TriMLC（本机） | 无 | trilc-channel 命中 | TriMLC@8713(win-m-cto-host)=现值 | **否** |
| 8711 TriRLC（本机） | 无（TRILC_DATA_DIR=trirlc 已在） | trirlc 命中 | TriRLC@8711(win-r-cto-host) | **否** |
| 8712 TriMMC（sg） | A2 部署稿壳显式 `TRILC_WR_DAEMON_NAME='TriMMC@8712(win-sg-*)'`（机位名 A2 定） | 未命中走 env | 待 A2 定名 | 随 A2 部署自然冷启 |
| 8710 TriRMC（河源） | 同上 `'TriRMC@8710(r-hy-*)'` | 同上 | 待 A2 定名 | 随 A2 部署自然冷启 |

向后兼容硬门自证：映射表 8713 值=旧硬编码字面量同串·未命中回落亦同串——8713 任何路径下身份面零漂移。

## §五 验证门禁（施工窗执行·照 8713 首铸门禁同款 spirit）

1. **diff 审**：单文件净增 8 行·消费点零改·无其他行触碰。
2. **`--print-identity` 双侧对拍**（零 job 触发·零落卷）：`TRILC_DATA_DIR=%LOCALAPPDATA%\trirlc` 跑→断言 `TriRLC@8711(win-r-cto-host)`；`=…\trilc-channel` 跑→断言现值。
3. **双 daemon run 拍零异常**：8711/8713 各 CLI run 一次→status=ok+error_count 零增（空转形态照旧）。
4. **既有 job 零差异断言**：cron_jobs 配置字段对表（command 面未动=白名单面零变·复用 A1 基线法）。
5. **落卷身份实证**：下个真提醒窗自然拍验（8713 W43 内必有·8711 候窗）——落卷头身份面逐 daemon 对表；不构造假窗（禁伪 state 注入）。

## §六 回滚姿态

git revert 单 commit 即全量回退：脚本无身份态残留（身份面=落卷头字符串·非持久状态）·两 daemon 零重启零配置面变动——回滚成本≈施工成本零头。风险定级：低（消费点单点字符串+映射表硬门自证+五道验证门）。

## §七 候批声明

本稿=设计面·**施工未启动**（L16 现形未动·21:23 复核仍在）。候 A2 改派稿连带批：批后施工归 FSD 线（本席验收）或本席直施（半行级·A2 窗内）——归 COO 排程裁决。8712/8710 身份定名建议随 A2 部署稿一并上呈（机位名含宿主面·D-24 机位断言规范）。

—— CTO 小狄（落款 date 现查原值 2026-10-19 21:23:55 +0800·发毕对表）
