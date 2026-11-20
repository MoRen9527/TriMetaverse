# BOD 实时收件评估方案卷（notice-236 款三·a/b 两形成本风险面·候 CEO 确认后施工）

- date 现查: 2026-11-20 00:1x CST（D-47）
- 评估人: CTO 小狄（款三评估令承·方案卷候确认制——施工候 CEO 确认）
- 现役基线: BOD（本机 dev 宿主会话）取件=30min 拍窗轮询（job2 既有 cron 面·免扰窗 exempt-until 语义现役）

## §一 两形评估

### 形 a·cron 密度提升（*/30→*/5 或 */10）

- **成本**：唤醒次数 ×6（*/5=288/日 vs 48/日）——每拍=BOD 会话唤醒+扫描+空闲退出=token/API 线性成本；免扰窗语义保留（exempt-until 照承·窗内零发面不变）；
- **风险**：低（机制零新件·纯调度参数）；噪声面=空闲拍占多数（扫描空转率↑）；
- **收益**：取件延迟 30min→均值 2.5min（*/5 形）；
- **与 job2 关系**：=job2 本体改参（零新件）。

### 形 b·跨机事件推送触发

- **链形（荐·复用既有设施三级）**：sg 裸仓 post-receive hook（现役三职能 sync 机制锚·TM 08-27 面）**扩展第四职能=推唤信号**→dev 宿主 **TriRLC daemon**（dev 机本地控制器现役·HTTP+SSE+cron 既有）wake 端点→daemon 经本机通道唤醒 BOD 会话（tmux send-keys/cc-socks 同机面）——零新常驻件（TriRLC 现役复用）；
- **成本**：一次性接线（hook 扩展+dev 侧 wake 端点小件+跨机 auth 钥匙面候勘——sg→dev SSH 通道=新增钥匙面·候勘注）；运行期近零边际（事件驱动零空闲拍）；
- **风险**：新链故障模式（hook 失败/通道断/唤醒丢）→**job2 保留为兜底轮询**（推丢=30min 兜底取件·最坏=现态）——双径冗余形；
- **收益**：延迟→秒级（推唤即醒）·零空闲成本。

### 对照表

| 维 | 形 a 密度提升 | 形 b 事件推送 |
|---|---|---|
| 延迟 | 均值 2.5min（*/5） | 秒级 |
| 运行成本 | token 线性 ×6 | 近零 |
| 一次性成本 | 零 | hook 扩展+wake 端点+auth 钥匙面（小件族） |
| 风险 | 低（零新件） | 中低（新链故障模式·兜底冗余覆盖） |
| job2 关系 | 本体改参 | 兜底轮询保留（双径冗余） |

## §二 荐案=分级混合形（b 为靶·a 为桥）

1. **桥段（即时可施工·零确认外新件）**：job2 密度 */30→*/10（成本 ×3·延迟均值 5min）——过渡桥；
2. **靶形（确认后施工）**：形 b 全链（hook 推唤+TriRLC wake+会话唤醒）——job2 降回 */30 兜底；
3. **冗余保证**：双径（推+兜底轮询）——推链故障最坏=回现态零恶化；
4. **auth 面候勘注**：sg→dev SSH 钥匙面=施工前勘定项（钥匙面=D-46 值域·候值席/BOD 通道确认）。

## §三 施工拆面（确认后·候 COO 排）

W1 hook 第四职能扩展（sg 裸仓·TM 面）→W2 TriRLC wake 端点小件（dev 机·+白盒）→W3 会话唤醒接线（tmux/cc-socks 面）→W4 联调+兜底验证（推丢回退拍实测）→桥段参数回 */30。

## 使用依据

notice-236 款三令面；job2 拍窗现役（23:26 拍锚·ledger idle-watch 面源读）；sg 裸仓 post-receive 三职能锚（TM 08-27 机制）；TriRLC daemon HTTP+SSE+cron 能力面（CLAUDE.md Common Commands）；免扰窗 exempt-until 语义（ledger 承录）；D-46/D-47。

---

## 勘正笔＋款三口径修正段（notice-237 两款·2026-11-20 00:2x CST）

**款一勘正 ✓（TriRLC→TriMLC 面域勘正·三处）**：形 b 链形二级/W2 施工件/§二对照——「dev 宿主 TriRLC daemon wake 端点」**勘正=TriMLC 8713（M 面本地域控制器·本机）**——面域路由=BOD 值守链全 M 面；TriRLC 8711=R 面本地域（河源线）与此链无关（四 daemon 矩阵面域勘正）。W1 施工件已随勘正落位（wake.env 键名=TRIMLC_WAKE_URL·勘正后语义一致 ✓）。

**W1 施工毕 ✓（本机 sg 裸仓面）**：post-receive hook 第四职能扩展（config 门控 no-op 安全形——TRIMLC_WAKE_URL 未设=skip 零故障面；异步+timeout·失败只记日志绝不阻塞铁律承；bash -n SYNTAX-OK）+wake.env 配置文件面（0600·W2 落位后值席/BOD 填 URL 即活）。**W2 候面**：TriMLC wake 端点小件=dev 宿主面（本席 sg 域外·候值席/BOD dev 机面施工+auth 钥匙面确认——sg→dev SSH·D-46 值域）。

**款二承录 ✓**：桥段=BOD 即时执行毕（*/10 六拍·降噪规则承录）；靶形 W1-W4 施工批准（CEO 本次裁=生效确认不再候二道）——W1 毕+W2 候 dev 面+W3/W4 随序；auth 候勘照承。

**款三·口径修正段 ✓（本卷「候 CEO 确认」条款勘正）**：方案级/评估级/技术选形裁决=**COS 径裁面**（D-39 全域授权·裁毕入账事后呈报知情）——本卷候确认条款随口径修正（后续同类=COS 径裁·不再挂候 CEO 面）；候 CEO 只留=真任务书生效面+CEO 保留权三类。CAO 域勘注转知承（D-39 附注/纪律册勘定建议·如需落册走 COS 转 CAO）。

**勘正使用依据增补**：notice-237 两款；四 daemon 矩阵面域定谳；W1 hook 实锚（bash -n+wake.env）。

---

## 附卷·② polyfill 施工毕报（TriMMC 8712 恢复读数·2026-11-20 12:2x CST）

**施工三件**：①better-sqlite3 vendor 安装（npm arborist 错误→/tmp vendor merge 形·node v18.20.8 兼容 ✓）②shim v2 换装（node_sqlite_shim/index.js=better-sqlite3-backed DatabaseSync API 映射·bak-shim-20261120 回滚锚·roundtrip+reopen 持久化单测 ✓）③TriMMC 重启（nohup TRIMC_PORT=8712·new-pid 1413225·healthz {"ok":true,"cron":{"enabled":true,"degraded":false}}）。

**持久化实证**：data/fade.db 真层写→关→重开→读=**PERSIST-PROOF-OK**（六表在库 fade_runs/transitions/gate_rejections/watch_state/watch_audit·daemon 日志零 no-op 警告·-shm 12:22 活体触写）。探针表已清（DROP 干净退出）。

**如实开放项**：①cron jobCount=0（job state=shim 期易失·**再录面候补**——易失清单②件恢复待令）②TRIMC_INTERNAL_TOKEN 不可复原（前进程 env 随停丢失·duty-env/值守会话双缺）→/internal/*=**internal_auth_disabled fail-closed**（401 安全门内置·token 轮换=候值席/BOD 通道协调——dev 宿主调用面 per W40 记录）③notify 降级态=notify 面 self-recover 候复核（mailbox/outbox 文件在库根）。

回滚锚=index.js.bak-shim-20261120（no-op stub 回退）。
