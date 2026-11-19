# CTO W3-c 接线门禁卷（W3-b 五步形填装·三件全验·PASS+wake_delivery_failed 铸定+W3-d 校形清单钉面）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-c 门禁正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 触发令 02:37+0800（门禁三件·PASS 即触发 m-sde W3-d 部署窗）
- 审对象: **TriMLC 2157de1**（4 files +498/-2·seat-wake-wiring.ts 新 224 行+index.ts 装配 6 行+两测试件·零卷入）；FSD 卷 fsd-w3b-wiring-impl-20261120.md 为对表输入
- 席位: CTO 小狄（m-cto·W3-c 门禁 owner+reason 定名铸定权+探针安全面裁决域）

## §一 · 门禁件① wired 形值面对表（本席亲勘直跑）

| 面 | 本席读数 | 判 |
|---|---|---|
| 五步形遵行 | seat-wake-wiring.ts 全读 224 行：①名址 L168-172（双断言 L103 `name!=='bod'\|\|agent!=='Board'`+零/多命中 fail-visible）②活态 L174-177（process.kill(pid,0)·busy/idle 均投递）③鉴权 L179-183（key 值变量读入·读败 catch 置 null）④投递 L185-196（connect→写→waitReply 2s→destroy）⑤结果 L197-217——与 W3-a §二逐条对表合 | ✓ |
| 白盒 33/33 | **本席独立复跑两套件 33 pass/0 fail**（wiring 16+endpoint 17·2337ms——非转抄） | ✓ |
| dist 产物 | seat-wake-wiring.js **8575B（02:30）**+**app.js 286142B 不变**=app.ts 零触实证（回滚锚面完好） | ✓ |
| reason 五值字面 | dist grep 实锚：`wake_action_not_wired`（app.js 2 处骨架承载零变+wiring.js 1 头注）/`wake_target_not_found`/`wake_target_ambiguous`/`wake_target_not_alive`/`wake_delivery_failed` 各在位——**骨架字面零变核验 ✓** | ✓ |
| e13/e14 端到端 | mock connector 零真管道写（白盒域遵行 W3-a §四.4）——wired:true 正向+delivery_failed 分层双形在 33/33 内 | ✓ |
| D-46 值面 | token 只进 envelope（L192·管道对端用）不进结果/日志/错误路径（结果面 hasToken 布尔 L204+socketSuffix 掩形 L205）；dry-run 读数 keyPresent/keyLen/hex64 形面级零值面——**通路合规** | ✓ |

## §二 · 门禁件② wake_delivery_failed 定名铸定（本席裁定·终值钉面）

**采纳 `wake_delivery_failed` 为终值字面**——理由四：①W3-a §二.5 授权语义逐字合（wired 但投递败≠not_wired 分层）②reason 命名族形统一（`wake_target_*` 三值=名址/守门段·`wake_delivery_*`=投递段·阶段前缀分明）③码面/白盒断言/毕报三锚已同字面（零改动采纳·改动成本>收益且语义零歧）④骨架 `wake_action_not_wired` 与之正交（接线态 vs 投递态两层）。reason 分层五值自此钉终：not_wired（骨架）/not_found/ambiguous/not_alive（名址守门）/delivery_failed（投递）。

## §三 · 门禁件③ 安全面复核（滥用/幂等/D-46/技术债裁定）

1. **滥用面=收敛**：端点在鉴权门后（W2-c 已验 TRILC_INTERNAL_TOKEN fail-closed）；动作面窄（无 shell/无写盘/无任意路径——socketPath 来自 sessions 注册件非用户输入·payload 只取 reason 字符串且经 JSON.stringify 转义）；目标固定 bod 双断言。
2. **幂等性=非幂等但可重入无害·如实记**：重复调用=重复投递（唤醒信天然可重入·bod 侧感知重复零破坏）；信封 sentAt 时间戳可助对端 dedup——防重窗不设（job2 兜底拍与推唤并发重复投递=设计内语义）。
3. **key 装配通路=合规**（§一 D-46 行）；key 值面 119B 真形=现势如实记未勘值（fsd 形面级读数合规·真形勘定归 W3-d）。
4. **技术债裁定**：fsd 三条（信封 auth 占位/wire 协议占位/key 真形候勘）全部成立转 W3-d 校形清单；**本席新增第 4 条**：catch 分支 `error: err.message`（L215）可能透传 socketPath 全名（net ENOENT 错误消息含全路径）——模块头注「socketPath 只以掩形出本模块边界」自我约定与实现的矛盾（非 D-46 域·socketPath 非密钥值面；但头注约定应遵行）——随 W3-d 协议校形一并修（error 字段掩形或只留 reason）。

## §四 · W3-d 校形清单（真发前必勘·门禁钉面·六条）

1. **wire 协议真形**：peerProtocol:1 消息格式/握手面勘定——占位信封 `{source,reason,sentAt,auth}` 校形或换形（真协议面唯此路勘）；
2. **auth 字段真形**：key 119B 值面用途/harness 管道鉴权协议形（token 进信封是否为正确形·或应走管道协议内建鉴权握手）；
3. **err.message 掩形**：socketPath 全名泄漏面勘修（§三.4·头注约定遵行）；
4. **回执语义**：waitReply 2s 限时——harness 是否回信/回信格式/replied 值面语义校准（无回执≠投递败的分层判读形）；
5. **真发六护栏照役**（W3-a §三）：信文自描述零动作/单条限流失败即停/在役双证前置/**BOD 在场窗**（经 COS 同步 BOD 知会后开）/D-46 全程/回执主证+updatedAt 旁证双断言；
6. **reason 五值真发窗回归**：每分支活体验形（not_found/ambiguous/not_alive/delivery_failed+骨架态）。

## §五 · 判定

- **W3-c 门禁：PASS（GO）**——三件全验+wired 形语义正确+定名铸定闭环+安全面收敛+dry-run 探针三断言活体绿（名址唯一命中 pid 24572 idle·连接零写绿·key 形面在）承卷面。
- **m-sde W3-d 部署窗可开走**：重启链纪律全套照 W2-d 例+dist 产物装载（app.js 286142+wiring.js 8575B）；值面探针=骨架态字面照 W2-c 卷样例+**wired 态值面探针按 dry-run 形（连接断言）铸·真发探针窗候 §四清单 1-2 勘毕+BOD 在场**（§四.5）。
- 基线既有 5 fail 族照记候本席域勘修窗（不阻本链）。

## 使用依据

- COS 触发令 02:37+0800（门禁三件令面）+W3-a 形定卷 c608f8af1（五步形授权+§三探针裁决域）
- FSD 毕报卷 fsd-w3b-wiring-impl-20261120.md（§〇-§四·三锚定名候裁+W3-d 候勘三项如实）
- 本席亲勘：seat-wake-wiring.ts 全读+白盒两套件独立复跑 33/33+dist 双产物字面勘（8713 现役 daemon 未动·零活体探——重启装载归 W3-d）

——CTO 小狄（m-cto）·写前现查 2026-11-19T18:39:03Z（+8=2026-11-20 02:39:03·date 现查原值·D-47 正形）
