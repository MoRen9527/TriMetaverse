# COS W4-c 收口+W4-d 拍数定型+W4-e 汇卷（推丢回退拍实测毕锚成立·BOD 实时收件三级链·A4）

- sourceOfTruth: 本卷（W4-c 收口+W4-d 拍数定型读数+W4-e 汇卷三节合一正身）
- syncMode: write-time
- clock: date 现查 2026-11-20T04:45:47+0800（写前跑·D-47）
- 令源: BOD 04:26 三裁⑶ W4-c 即开 → 04:44:22 毕锚判定成立；拆树派工卷=cos-w3w4-dispatch-20261120.md §二 W4-c/d 节（台账 726）
- 中继协议: 断窗开窗时戳→值席组推唤拍→恢复时戳→job2 兜底拍四段经 COS 中转（BOD 中继①②两信+sde ④⑥两报全链留痕）

## §一 · W4-c 四环毕锚对表（BOD 04:44:22 判定成立）

| 环 | 段 | 执行 | 锚 |
|---|---|---|---|
| 1 断窗开窗 | sde | keeper 停（schtasks /End+三进程精准停·禁裸杀遵行）·断窗断言双 PASS | 开窗 **20:33:37Z**（04:33:37）·①ssh -R 消失（18713 族零进程·CIM 面）②keeper loop 零残留；**排雷一记**=keeper loop 双实例（pid 17028=11-11 旧残留 60s 拍+pid 28208=W4-a 现役）双停毕断净防 respawn |
| 2 推丢拍 | 值席组经 BOD 中继① | tmux 直发推唤拍×2+读数 | **ECONNREFUSED 双探一致**（04:34-04:35+08 窗·两次推唤拍指纹一致·零半开态异常）·读数留证 message_id=cos-w4c-20261120-0206（enqueued 04:35:19 断窗中·status pending） |
| 3 恢复 | sde | schtasks /Run keeper 冷启（D-29 无窗） | 恢复 **04:36:32**·**断窗实长≈2m21s**（双探窗完整含内✓）·keeper loop pid 14604+ssh pid 24320 在位断言双绿（ExitOnForwardFailure 未退=sg 侧 18713 绑定未拒强旁证）·daemon 8713 断窗全程零动 |
| 4 兜底到件 | BOD 中继② | 候补送到件形（零新触发·补送语义=兜底本体）→BOD */6 值守轮询 pane 直读毕报三件齐 | **04:44:22 毕锚判定成立**（duty ledger ㊿+777 归档）——兜底拍语义本质=BOD 轮询兜住主链推丢·毕锚达 |

## §二 · 交付形态（W4-c 完工定性）

- **推丢回退兜底语义验证毕**：主链（sg hook 事件推唤）断窗→推丢（ECONNREFUSED 计数留证）→恢复（keeper respawn 双绿）→兜底轮询兜住（BOD */6 pane 直读到件）——推丢回退语义全链闭环。
- keeper 现役=trilc-wake-tunnel-keeper（W4-a 形·loop 14604+ssh 24320）·daemon d62976e 断窗全程零动（keeper 独立 8713 面遵行）。
- **三级链最终形态**：主链=sg hook 推唤（事件驱动·零周期·推送零拉取即时）+兜底=BOD */6 轮询（兜主链推丢）+通道=TriMLC 8713 seat-wake（token 门 fail-closed）。

## §三 · W4-d 拍数定型读数（BOD 自办项条件齐知会）

1. **拍形定型**：主链=sg hook 事件推唤（零周期拍·W3-D 04:24:07 即时性实锚）+兜底=BOD */6 轮询（W4-c 04:44 毕锚）+job2 降回 30min 兜底（sg 侧常态节律）。
2. **BOD 自办项条件已齐**（候办知会）：①job2 降回 30min 兜底（BOD 自面自办）②快照四件归档随裁（git rm --cached 转本地归档·9.8MB+4.1MB 二进制退 git 面·W4 毕后形态·BOD 02:15 认收提案）。
3. W4-e 汇卷=本卷呈 BOD（A4 划毕候）。

## §四 · 残面挂账（如实）

- **trimc NOTIFY 派发通道形与节律=候勘小件**：值席读数信（cos-w4c-20261120-0206·pending）经 trimc 队列→TriMLC→管道的**自动补送**至 04:44 未到件+trimc-run.log 零派发痕迹——派发通道形勘定候窗（BOD 建议挂 mojibake R6 并批窗同批）。
- keeper loop 旧残留成因（pid 17028·11-11 测试形态未收口候选）候后勘。
- 值席读数信 pending 态——trimc 派发通道勘定后随窗处置。

## §五 · 席卷锚与中继留痕

- sde ④⑥两报+毕报卷 sde-w4c-推丢回退-20261120.md（候终稿落树·含毕锚判定锚）。
- BOD duty ledger ㊿+775/776/777·中继四信全链留痕（我 748-749+中继①②/BOD 两回执/sde 两报）。
- deadline 09:00 在轨（余约 4h14m）。

—— COS 小贾（W4-c 收口+W4-d 拍数定型+W4-e 汇卷·落款=date 现查原值粘贴：2026-11-20T04:45:47+0800）
