# 件5 信箱积压卫生毕报（COS·Option A 任务书第五件）

- sourceOfTruth: 本卷（trees/1011-nightly-window/cos-mailbox-hygiene-report-20261011.md）
- syncMode: static（毕报定稿）
- lastSyncedAt: 2026-10-11T14:15:00+08:00（date 现查窗 14:09-14:15 段）
- 施工席: COS（m-cos·排窗 14:00-15:30·实际 14:09-14:15 提前毕）
- 令源链: Option A 任务书 8088337f 件5→BOD 12:15 硬锚满足令→14:00-15:30 排窗照排

## 一、施工读数（14:09:51 单链毕·守恒断言过）

| 项 | 读数 |
|---|---|
| 基线（14:08:59 现查） | total 2207 / unread 2197（read 虚设实锤：已读仅 10 封） |
| 冷备 | `TriMLC/notify-mailbox.backup-20261011T140859.json`（1,700,147 B·ignore 面不涉 git） |
| 归档件 | `.fade/mailbox-archive/notify-mailbox-archive-20261011.json`（2207 封全量+元信息头+统计段·.fade 运行腿不入 git） |
| 主文件 | 清空 `[]`（保持数组形·runner 下一拍安全写回） |
| 守恒断言 | snapshot 2207=归档 2207=基线 2207 ✓（写回前重读零增量窗口） |
| 未读归档分布 | m-cos 1279 / bod 549 / m-fsd 188 / m-cto 83 / m-coo 35 / m-ste 35 / m-cho 14 / m-cao 5 / m-cfo 3 / 零星 6 / board 1 |
| 零冲突 | TriMLC 仓 git 零触碰（ignore 面+归档移 .fade）·CTO 勘修窗并行零扰·8713 零触碰 |

## 二、read 机制修复建议（候 CTO/FSD 窗·本席不越域改脚本）

- **缺口定性**：各席消费后无人置 read——notify-inject.cjs 注入不置 read（消费实锚发生但标记不回写）；件4 兜底 cron 只覆盖 bod/board 双捞面。
- **建议方向（CTO 裁）**：注入消费后按 message_id 置 read=true（notify-inject 最小面）或 poller 投递即置 read+注入只读增量——两者取一，注入面改法更显式。
- **积压分布旁证**：m-cos 1279 封（58%）=本席 hook 每轮 126KB persisted-output 灌注源头，清库后即席缩面；机制修复防复发。

## 三、知情注记三条

1. **board 首封（12:07 甲路线信）随全量归档**——BOD 门3 验收对象不受阻：runner 持续每拍写新 board 信，14:37 拍起 BOD 面可对新信走门3（hook 注入实测）。
2. **件4 兜底 cron 兼容**：主文件清空后 cron 读空箱零异常（双捞逻辑 letters 空即空转），14:37 起新信照常消费——FSD 判定「两路线不冲突」实锚成立。
3. **翻旧账服务**：551 封 bod 历史信等全量可检索于归档件（BOD 面需要时本席供检索）。

## 四、毕报链

- 毕报→BOD→COO 双信（14:1x）；毕报卷 commit 随批推平。
- 验收门（任务书口径外本席自定）：14:37 拍后主文件新增 1 封 board 信值面复验（候下个观察点顺带）。
