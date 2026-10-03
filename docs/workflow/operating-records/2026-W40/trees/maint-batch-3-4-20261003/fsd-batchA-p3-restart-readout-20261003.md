# FSD·批A P3 受控重启+回归门读数卷（BOD 亲验窗 14:00，#312 转令）

- sourceOfTruth: 本件（批A P3 施工卷；令源=COO 11:4x P3 门令，BOD #312 亲验 14:00 北京时间）
- syncMode: live（骨架预位于候令期 12:3x；窗内四步读数随做随填）
- lastSyncedAt: 2026-10-03T12:35+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道；执行通道=Bash 代，本会话 PS 工具面卡死异常在案）

## 零、候令期预勘（12:2x，只读零触）

| 项 | 读数 |
| --- | --- |
| pid 42616 | 活（node.exe，Bash tasklist 实锚） |
| 3333 监听 | LISTENING pid 42616（netstat 实锚） |
| .env | 303B 在位（P2 产物） |
| dist/src/server.js | 7015B 在位（build 窗产物） |
| /healthz | **404——TriModel 无此端点**，回归门探针形=/v1/config/keys Bearer 200 替代 |
| 优雅停面 | **零 /shutdown 端点+零 SIGTERM handler（git grep 双空）**——矛盾点 a 呈报 |
| watchdog 位 | 3333 无 watchdog 位（BOD 09-29 bash 后台手起）——矛盾点 b 呈报，「协同」落实=8711/8713 侧链路恢复验证 |
| PS 工具面 | 卡死（裸命令 143×3），Bash 通道交叉全通 |

## 一、开工断言（14:00 后，BOD 到场）

- [ ] pid==42616 复断言（变则=照冷起形态报备候裁不擅动）
- 读数：（窗内填）

## 二、受控重启（执行口径终版=BOD 13:1x 定调：停起分双手）

- **停形=BOD 自敲**：pid 断言 42616 先行 → BOD 到场亲自 `taskkill /PID 42616` 单 pid → FSD 到场监督读数。时点：（填）
- **拉起形=FSD 执行**照 09-29 同形：`(cd /d/Code/ai/TriModel && node dist/src/server.js > <log> 2>&1 &)`（bash 后台+log 重定向；log 文件位候 BOD 到场示下，默认新文件 /d/tmp/bod-p3-restart/trimodel-3333-p3.log 避免复用旧件）——**BOD 逐项过目四点：命令行/日志头/端口绑定/探针恢复**。时点：（填）
- 死区验证：3333 监听消失→恢复——读数：（填）

## 三、回归门四项（BOD 亲验禁转抄，FSD 执行逐项过目）

| # | 项 | 探针形 | 读数 | 判 |
| --- | --- | --- | --- | --- |
| 1 | keys 探针 | GET /v1/config/keys Bearer（.env 值）→200 | （填） | |
| 2 | GLM 链 smoke | （照 BOD 到场定形，最小实弹） | （填） | |
| 3 | watchdog 复验 recovered（**替换形照准=BOD 13:1x**） | 8711 keys fetch card absent 恢复+8713 stub auth-dead flag 停刷（daemon.log/log 面） | （填） | |
| 4 | relay 卡面对表 | card absent fallback 应消失（daemon.log 对表） | （填） | |

> 探针形照准（BOD 13:1x）：回归门探针=GET /v1/config/keys Bearer（.env 值）→200。

## 四、门后序（四项全过+解围栏+M2 闭合序，照 BOD 指示）

- （窗内填）

## 五、异常与偏离记录

- （窗内填；异常即停回询）

## 六、使用依据

- COO 11:4x P3 门令（BOD #312 亲验 14:00）+COO 07:57 批A 开工令（#300）
- CTO P1 卷 L104 P3 序（断言→重启→四项）；P3 口径知会（#302 C 件：四项本机照旧+亲验门不变）
- 候令期预勘读数（§零）
