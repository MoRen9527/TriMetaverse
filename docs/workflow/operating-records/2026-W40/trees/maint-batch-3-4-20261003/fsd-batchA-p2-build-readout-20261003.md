# FSD·批A 事故恢复链施工卷：P2 .env 重建 + build 窗（BOD #300 点火晨窗）

- sourceOfTruth: 本件（批A P2+build 窗施工卷；令源=COO 07:57 批A 开工令，BOD #300 点火/#299 框连贯不分窗）
- syncMode: static（P2 毕+build 窗毕两节点毕报已发；**停 P3 门候 BOD 亲验到场令**）
- lastSyncedAt: 2026-10-03T10:55+08:00（date 现查 02:52:15Z）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）

## 一、P2：TriModel/.env 重建（毕，探针双 200 闭环）

### 前置勘读数

| 项 | 读数 |
| --- | --- |
| TriModel 仓现态 | HEAD=161d0ca（=令文重建基准 ✓）branch dev 工作树零漂移；缺失面=.env+dist 两件 |
| build 脚本形 | `build = tsc -p tsconfig.json && node scripts/copy-ui.mjs`；`start:server = node dist/src/server.js` |
| 3333 活体 | pid 42616（09-29 04:53:31 起）cmdline=`node dist/src/server.js` 零触 |

### 第二键勘形链（令文「dotenvx log 2 键形实锚，勘毕如实报值源或缺源」）

1. STE 验证卷 L70「2 键形 dotenvx log injected(2)」在 W40 trees **无独立实锚行**（仅表格转述一处）。
2. **决定性实锚=本机会话 transcript 09-26T06:09Z 实值形读数**（f5f9f484 jsonl L4627）：五键形——TRIMODEL_API_TOKEN(hex64 a5cb..13a7)+TRIMODEL_ADMIN_TOKEN(hex64 de44..f36a)+TRIMODEL_DEFAULT_MODEL(len15)+TRIMODEL_TRIMETAVERSE_API_KEY(len9 tmv-)+TRIMODEL_TRISTACISS_BASE_URL(len24 http..8000/v1)。
3. **矛盾如实报**：采 transcript 实锚（证据层级：实值形读数>表格转述），照原形**五键**重建；STE「2 键形」与实锚矛盾留卷候 BOD 复核。
4. 三非敏配置键照原形带出理由：config.ts L59 代码默认 TRISTACISS_BASE_URL=**8008** 而 .env 原值=**8000**，缺带出会漂行为。

### 值源裁决（双源互证）

- L1 API_TOKEN：8711 trirlc-daemon.env 钦定源（令文）a5cb..13a7 ＋ transcript 源同值 → **双源 same-value True**。
- L2 ADMIN_TOKEN：transcript 09-26 实锚 de44..f36a 管道恢复（进程内提取直写，值零出机）——**有源非缺源**。
- 消费语义实锚：TRIMODEL_API_TOKEN=拉取面（8711 keys 链，缺=fail-closed 401）；TRIMODEL_ADMIN_TOKEN=写面（cards/keys 写+fallback admin，缺=503 降级不崩）。

### 写盘与断言（gate 不过即 abort 零写盘）

- 三 gate：api 指纹（a5cb..13a7 hex64）✓ / admin 指纹（de44..f36a hex64）✓ / 双源同值 ✓ → 单次写 UTF-8 无 BOM。
- 写后四对表：5 行 303B / LF 零 CR / 无 BOM / 键序+指纹全对。
- **活体探针双 200（01:47Z）**：GET /v1/config/keys Bearer 新值=200（新值≡3333 活体 gate 值互证，旧进程内存 env 同源）；cards/mmc pull=200。响应体零打印（keys 端点 body 防值面）。
- admin 值活体验证形态=指纹互证（写面端点族全 POST，只读纪律下不探写面），候 P3 窗写面自然验证。

## 二、build 窗：三仓同窗毕（毕，02:52Z）

### 实际执行序（勘正如实报）

令文三仓并列同窗；首跑 TriModel 即 TS2307（`@trimetaverse/tricode/trimodel-cli` 缺）→实勘依赖方向：TriModel node_modules/@trimetaverse/tricode=**Junction→D:\Code\ai\TriCode**，TriCode package.json exports `./trimodel-cli`→`./dist/trimodel-cli/index.js` 需 TriCode dist 先行——**实际序 TriCode→TriModel→agent-core**（同窗毕，序内调换零越窗）。TS2307 首跑实锚=P1 卷 L74 预言同族缺陷（trimodel-cli 导出位缺失）。

### build 读数

| 仓 | ci | build | 断言 |
| --- | --- | --- | --- |
| TriCode | 7 件 46s（node_modules 缺失全装） | tsc 40s 绿 | dist/trimodel-cli/index.js+index.d.ts 双 True |
| TriModel | 157 件 208s | tsc+copy-ui 44s 绿 | **dist/src/server.js=True（令文必做）**+dist=src/test/ui |
| agent-core | 16 件 60s（node_modules 缺失全装） | tsc 79s 绿 | dist 6 子域（contracts/message-guard/permissions-engine/process-supervisor/scheduler/sub-agent）+types |

- 第二重断言：TriModel 仓自带 `build-verify` 过（「all build artifacts present incl. dist/ui/index.html」exit 0）——P1 卷判定可四条件之 4 达成。
- 3333 复验（02:52Z）：pid 42616 零触在位，build 窗零重启动作。

## 三、P3 候令序（停在门，零动作）

开工断言 pid==42616（变则照冷起形态报备）→受控重启（watchdog 协同正形禁裸杀）→回归门四项：keys 探针 200 / GLM 链 smoke / watchdog 复验 recovered / relay 卡面对表（card absent fallback 应消失）。**重启动作前候 BOD 亲验到场令**（COO 转到场令）。

## 四、技术债务标记

1. STE 卷「2 键形 injected(2)」与 transcript 五键实锚矛盾——本卷留证，候 BOD 复核定谳后 STE 卷面勘正（本席不代改他席卷）。
2. admin token 长期值源=transcript 本机会话件（非权威台账）——候值源闸三笔后续：admin 值入台账或轮换，消解 transcript 依赖。
3. TriModel npm ci 157 件含 3m 安装窗——build 窗口时长实锚，供后续 dist 重建窗排程参考。

## 五、纪律遵守

- 值面零出机 ✓（全程管道提取+指纹断言；gate 面 abort 设计；探针响应体零打印）
- 围栏对表 ✓（P2/build 面放行域内施工；清理类零触；3333 pid 42616 零触候 P3 门后）
- 禁裸杀 ✓（本卷零停机动作；P3 序照权威路径候令）
- 令文勘正如实 ✓（build 序调换/第二键值源/证据链矛盾三项全报）

## 六、使用依据

- COO 07:57 批A 开工令（BOD #300）+09:3x P3 口径知会（#302 C 件）+COO/CTO P1 卷 cto-p1-versionbase-verdict-20261003.md（L37 三处同值互证/L74 trimodel-cli 预言/L95-L104 P2-P3 工序）
- STE 验证卷 ste-maint34-verification-readout.md（L55-85 事故根因链+恢复面表）
- 实勘：TriModel 仓全态/config.ts/.env.example/keys.ts+config-cards.ts+claude-fallback.ts 消费语义/package.json exports 链/TriCode exports 面/transcript L4627 实值形读数
- 关联纪律：值面零出机（指纹形）；junction 摘除纪律（STE 事故教训条）；禁裸杀；执行令时点交叉核对
