# 编译门 §五序 3/4 执行读数卷（BOD 令·loadOne 修稿已合 2bf1919 后续）

- 执行: m-duty-fsd（FD/sg 值席）；令=BOD 编译门令（序 3/4：两机拉平→dist 重建→验证读数）
- **TriMLC 拉平腿=即停候 BOD 裁（止停条款触发）**；其余腿执行毕读数如下

## ①两机拉平

| 面 | 勘/动作 | 判 |
| --- | --- | --- |
| TriCompany/agent-core | fetch→origin/dev=96fab42（2fb1292 ∈ history ✓）→本地 20cf17f **FF 拉平至 96fab42** | ✓ 拉平毕 |
| TriMLC | **2bf1919 不可达实锚**：remote 仅 origin=/srv/git/TriMLC.git；`git cat-file -t 2bf1919`=Not a valid object；fetch --all 后无任何远端枝含此笔——2bf1919 仅存 dev 机 TriMLC 本地，未推 sg bare | **即停候 BOD 裁**（止停条款照令）：候选路径=dev 侧推 2bf1919 至 /srv/git/TriMLC.git 后 sg 拉平，或 BOD 另裁通道 |

## ②dist 重建（回滚锚先行·CTO 条款a）

- 备份: `packages/agent-core/dist.bak-pre-rebuild-1004-0927` ✓
- 重建: 首跑 npm error（瞬时噪音）→复跑 **exit=0 tsc 清** ✓（dist 刷新至 2fb1292 源态）

## ③验证读数

| 门 | 读数 | 判 |
| --- | --- | --- |
| TC 包门（agent-core tests） | **55/55 pass exit=0** | ✓ |
| sg TriMLC check·(a) 2b1709d 未合态+新 dist | **4 错**（TS2322×4 paths 字面量——BOD 03:48 预告同形实证） | 预期形确认 ✓ |
| sg TriMLC check·(b) 修稿效力态（loadone 修稿 working tree）+新 dist | **0 错** | 修稿效力实证 ✓ |
| TriMMC 8712 healthz 活面 | ok=True／jobCount=9／degraded=False／consecutiveFailures=0 | ✓ 活面健康（dist 重建不触其冻结 node_modules 快照；症状驱动反转条款未触发） |
| 既有 job 探针 | jobCount=9 全在排（六哨+三 job 族） | ✓ |

## 三态对照小结

- (a) 态 4 错 = 2bf1919 未拉平时 sg 的稳定预期形（非回归，BOD 预告兑现）
- (b) 态 0 错 = 修稿效力预演实证（2bf1919 拉平后 sg check 即 0 错）
- **通路唯一缺件=2bf1919 过 sg bare**——候 BOD 裁（dev 推送/或授权通道代推）

## 使用依据

BOD 编译门令（§五序 3/4）；CTO 终谳序 dbc5f8eb §三；TriCompany 96fab42/TriMLC 2b1709d 仓态实勘；agent-core dist.bak-pre-rebuild-1004-0927 回滚锚

---

## 补记·序3收尾（BOD 令 09:5x 裁后·拉平腿闭）

- 2bf1919 过 sg bare（dev 侧推送毕，BOD 裁）→TriMLC clone fetch+**FF 拉平至 2bf1919** ✓（工作树未提交修稿稿面经 checkout 让位——内容已含于合入笔，零丢失）
- check 复验: **0 错**（(b) 预演转正式；四错灭达成）
- **拉平腿闭**——§五序 3/4 全段收官：TriCompany 96fab42／TriMLC 2bf1919 双面拉平+agent-core dist 重建（回滚锚在）+三门读数全绿；余=四仓联动验证读数（SDE sg 侧车道）+CORE_VERSION b14-core-bump 候双签并批（另线在途）
