# SDE 勘验卷 · 窗2 第4项 credentials service 勘验（P2 key 长驻形态裁定材料）

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-p2-credentials-survey-20261017.md
- syncMode: static（勘验卷·裁前备料）
- lastSyncedAt: 2026-10-17 12:56:30+08:00（date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 窗内·只读勘验零 boot 零触现役
- 施工位依据: COS 七项正身单 #4「credentials service 勘验·SDE 面·候窗内施工」

## 机制面实勘（dsh 0.2.0-rc.2 河源装设位 README 源码直读）

| 面 | 读数 | 锚 |
| --- | --- | --- |
| 包构成 | dsh-credentials（seam）+dsh-credentials-local（文件 store·**base composition 默认已载入**） | 两包 README Summary |
| store 形 | 私有文件 `.credentials.yaml`（config.path 指绝对路径）·配置 UI 存取或直编·改动自动重载·值跨重启存活 | local README |
| lookup 优先序 | **固定四级**：launch environment → stored file → project `.env` → harness-home `.env`（新存值即时覆盖旧 .env） | local README Summary |
| 轮换语义 | **rotated stored key 下请求即生效·零重启零配置改动** | credentials README Summary |
| 值面暴露 | 配置 UI 只报 set/unset/source/writable **永不露值**·空值=absent（空 record=有意存储） | credentials README |
| 安全边界（如实） | 「**this store cannot isolate secrets from the agent**」——agent 工具进程同 OS 用户跑·文件权限隔不了 agent 本身·席间同 fleet 用户亦路径级分离非强隔离 | local README 明示 |

## 三形态对比（13 席生产运行视角）

| 形 | 轮换成本 | 值面攻击面 | 13 席复制性 | 备注 |
| --- | --- | --- | --- | --- |
| A env 形（现状波1） | 重配 env+重启（候选载入位清点+全键清点·轮换三折族全适用） | **进程 env 可读面**（同用户 /proc/<pid>/environ·env dump 族） | 每席进程各自注入（13 处载入位） | 段A 探针级够用 |
| B store 形 | **零重启**（下请求即生效） | 值在 600 文件·**不进进程 env**（攻击面收窄） | **单文件统一 13 席**（同 profile 同 DSH_HOME 一处生效） | base 默认已载入·零新挂载 |
| C 混合迁移形 | 写 store→清 env→重启一次（env 优先级高于 store·清 env 即接管） | 同 B | 同 B | 现状→B 的迁移正形 |

## 倾向意见（裁归 CTO·本席勘验面）

**store 形（B）优**：①轮换零重启（段B 13 席生产运行 key 轮换必然事件·轮换三折族成本归零）②值面出 env 攻击面 ③13 席单文件统一（载入位清点从 13 归 1）。边界如实：agent/席间强隔离两形态皆不可达（同 OS 用户·dsh 官方明示）——13 席同 key 账户级共享无妨。**若裁 B**：迁移=C 形一次（13 席 web 形运行前落位·`~/.dsh/.credentials.yaml` 600·fleet）+env 注入退役时点入账。

## 与 P 系关系

- 本件=P2 裁定材料备料毕——**CTO 裁示候收**（开窗令口径：P 系裁 R1/R2 段内或毕后）。
- 裁 B 则段B 接位三验前落迁移（一次性·分钟级）·裁 A 则现状零动作。

## 使用依据

- COS 七项正身对表单（06ff05ff9）#4 施工位认领·COO 开窗令②先行件口径
- dsh-credentials/dsh-credentials-local README 源码直读（河源装设位 0.2.0-rc.2·2026-10-17 实勘·只读零 boot）
