# BOD 施工卷 · sg 8712 SOURCE_SEAT_WHITELIST 补录 'trirlc-conn'（观察池⑥）

- sourceOfTruth: 本卷（trees/sg-8712-allowlist-conn-20261015/bod-exec-plan-20261015.md）
- syncMode: static（施工卷·BOD 主施工·COO 转请令源）
- lastSyncedAt: 2026-10-15 09:56 +0800（date 现查窗内）

## 一、令源链

| 时点 | 事件 |
| --- | --- |
| 10-14 勘误卷 | TD-obs-1 卡③收口正形含「通道修通后轮 8713（正身 8712）白名单补录 source_seat='trirlc-conn'」（观察池⑥） |
| 10-15 09:42 | 8711 obs 出向启用窗毕（激活）——本件解挂 |
| 10-15 09:52 | COO 转请 BOD 面（跨机操作照 M 面路由·COO 不跨机）——即办令 |

## 二、对象断言（实勘·令文「sg 8713」系笔误·正身勘定）

- 正身=**sg TriMC 8712**（127.0.0.1 回环·pid 3126596·10-13 08:30 起·`node dist/src/index.js`·systemd `trimc.service` r15-1-4 直管）；
- 白名单=**代码内硬编码** `src/notify/outbox.ts` L66 `SOURCE_SEAT_WHITELIST=['m-duty-cos','bod','m-cos','m-coo','power-gate','m-duty-coo']`（L128/L229 两处门禁 403）——'trirlc-conn' 零命中不在列；
- 生效机制=改源码→`tsc` 重建→`systemctl restart trimc`（非配置热载）。

## 三、施工序（护栏内）

1. 改 outbox.ts L66 数组追加 'trirlc-conn'（python 精准替换·改前 count==1 断言+git diff 单文件断言）；
2. `npm run build`（tsc→dist）；
3. `systemctl restart trimc`（秒级停摆·systemd 守护非裸杀）；
4. 生效三断言（进程内生效验证·非 healthz 绿即完）：①healthz 200 ②pid 变更对表 ③**值面探针=dist/src/notify/outbox.js grep 'trirlc-conn' 命中**（编译产物含=真生效）；真值探针（trirlc-conn 实信入箱 201）候 8711 侧下次出向自然验证·记观察注；
5. 毕报落树+commit+回 COO+知会 CEO。

## 四、影响面评估

- 8712=sg duty 13 席宿主+TriMC cron 10 jobs——重启秒级停摆·duty 席 claude 进程独立跑不受杀·cron 巡检类推迟一 tick 可接受；施工前活体断言 sg duty 全席空闲（09:45 拍已证·施工时复核）；
- 8712 回环独占无外部暴露面·零公网风险；
- 回滚：git checkout src/notify/outbox.ts+build+restart（单文件单行·整体可逆）。

—— 落款（date 现查）: 2026-10-15 09:56 +0800（BOD）
