# Option A 节拍投递落地任务书（五件并一）

- sourceOfTruth: 本件
- syncMode: rolling
- lastSyncedAt: 2026-10-11T11:37:02+08:00（date 现查）
- 令源链: CEO 09:39 问询投递挪 daemon 侧→10:15 裁「A 捎带+兜底」→11:35 令「全天黄金窗·能挪前挪·开工」
- 施工位: FSD（件1/2/3）；件4=BOD 自施工即刻；件5=候 COS 排窗
- **零重启面声明**: bod-tick-runner.mjs=8713 cron 每拍 spawn 的独立进程，改脚本下一拍自然生效——**FSD 禁触 8713 重启**（勘修窗 CTO 主刀并行中，重启面归 CTO 专管）

## 件1 runner 写信箱段

bod-tick-runner.mjs（D:/Code/ai/TriMLC/scripts/）L188 appendFileSync 落盘行后加写信箱段：

- 读 `D:/Code/ai/TriMLC/notify-mailbox.json`（JSON.parse，异常静默跳过——信箱写失败≠拍炸，拍报落盘优先）
- push 新 letter，schema 照现有 letter 键面（message_id/source_seat/target_seat/urgent/title/body/delivery/received_at/delivered_at/read）
- source_seat='bod-tick'；target_seat=件2 钉死名；urgent=false；title='节拍 '+ts；body=拍报前 500 字符；read=false
- 写回全量 writeFileSync；拍频半小时竞争面极低，注释说明即可
- 逐段 try/catch（纪律：任一段挂≠全拍炸）

## 件2 名址对齐（根因件）

现役信 target_seat='bod' vs notify-inject.cjs 在 wt/board 推导 seatFilter='board' 名对不上=BOD 从未收到信箱信的根因。FSD 实勘两件后二选一钉死：

- 甲：runner 写 target_seat='board'（零配置改动·最小面）
- 乙：seats.json（D:/Code/ai/TriMetaverse/.claude/）加 bod→board 映射+board 条目 notifyTarget 改 addressable（配置面完整但动名址簿）
- 择一依据落卷；现有未读 target_seat='bod' 历史信处置建议随卷（件5 消费）

## 件3 名册补漏

runner LOCAL_SEATS 数组补 'm-fsd'（12→13）——对齐头注释「13 席名册」+CEO 10:34 全席令+sg duty 组 13 席对仗（本日 11:35 CEO 问询实锚：m-fsd 漏扫）。验收=下一拍拍报「本地 13 席」。

## 件4 兜底 cron（BOD 自施工·即刻毕）

本会话 CronCreate 小时级：读信箱 target_seat∈{bod,board} 未读信→转报 CEO→落 read=true。注：会话级随重启蒸发（与 74b83c49 同属性），宿主级 schtasks 形态候办不阻塞本件。

## 件5 信箱积压卫生（候 COS 排窗）

本机 notify-mailbox.json 2158 封未读（read 标记机制形同虚设实证）=机制修复+历史信清库/归档。建议随件2 裁定后一并排。

## 验收门

1. 下一拍（12:07 拍点）拍报落盘正常+信箱新增一封信值面断言（target_seat/read=false 值面对表）
2. 拍报文案「本地 13 席」（件3 实锚）
3. 钩子注入实测：BOD wt/board 会话下一轮交互 stdout 现 [M-SG NOTIFY]（BOD 面自然验收，毕报注明候验）
4. 全程零 8713 重启（uptime 连续探针）

## 并行警示

TriMLC 仓同窗并行（CTO 勘修窗动 src/+dist 重建）：FSD 只动 scripts/bod-tick-runner.mjs，**写后即 commit 锁笔**，commit 错峰，禁 amend——并行窗提交互踩族防线照带。
