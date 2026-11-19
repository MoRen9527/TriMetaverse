# fade-001 进化冲刺总 Plan List（2026-11-20 夜班→09:00）

- sourceOfTruth: 本件（BOD 集散·冲刺总清单·CEO 2026-11-20 01:42:27 令）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 令源原文: 「把正在施工和将要施工的，以及我们对fade-001的runner套loop套fade-001的终极改造，写一个plan list，一条一条的列出来，毕一项划掉一项，runner的CEO意见部分你可代我给出，推动fade-001的进化。文档落成md，每6分钟按最近任务项去催cos，到明早九点争取全毕。」
- 机制: BOD 每 6 分钟拍按「最近未毕项」催对应 COS（sg 值席 tmux/本地 m-cos SendMessage 双通道）·毕一项划一项（[x]+删除线）·deadline=09:00（毕后终态报 CEO·停催转值守）
- 催办序: 每拍取最上方第一个未毕项→查其责任席现态→有进展即划掉并顺移下一项·零进展两拍（12min）=催
- 代笔注: runner CEO 意见段=BOD 代笔（D 线卷首·按 CEO 已裁定口径延伸+补口处标「代笔补口」）

---

## A 线 · 实时收件三级链（CEO 01:28 批·分级混合形靶形）

- [x] ~~A1 桥段：job2 提频 30min→10min（BOD 自面 cron 改参）~~ ——**01:28 毕**（912ebefb）·01:42 CEO 令再提 6 分钟拍（催办制升级·见机制行）
- [x] ~~A2 W1：sg 裸仓 post-receive hook 第四职能扩展（推唤信号）~~ ——**01:35 毕**（值席毕报）
- [x] ~~A3 W2：TriMLC wake 端点小件（8713）+通道形勘定~~——**02:13 毕**（W2 五步全毕：a 通道勘定 52ce83db6 / b 端点施工 f0f22c6 / c 门禁 PASS 7035ec7dd / d 重启部署 fd7178c63 / e 汇卷 3510844eb·定名 seat-wake 消歧在役·值面探针正向 200 {accepted:false,wired:false} =未接线 stub 正确形+负向 401·重启窗 3min 11 步 cron 18 job 零损穿越·sg 五项清单转办毕+token 分发毕双端 sha 对表绿·汇卷锚 cos-w2e-closeout-20261120.md）
- [x] ~~A4 W3：会话唤醒接线（跨会话命名管道 uds:\pipe\LOCAL\cc-msg-*→bod 会话·W2-a 勘定主形）~~——**02:50 毕**（W3 四节点全毕：a 名址定谳 `~/.claude/sessions/<pid>.json` 注册面 c608f8af1 / b 接线填装 TriMLC 2157de1 / c 门禁 PASS GO·reason 五值钉终 c4c6aef41 / d 部署毕 0fc407208）·**真发端到端验证达成 04:24:07**（[W3-D PROBE] 到件实锚·直投 accept 全通·五轮根因链修毕·交付锚链 TriMLC 2157de1→d62976e 六轮终态·收口汇卷 cos-w3-closeout-20261120.md 747）
- [x] ~~A5 W4：联调+兜底验证→拍数定型~~——**04:55 毕**（W4-e 终报卷 cos-w4e-final-20261120.md 04:55 认收：W4-a keeper 在役/W4-b sg 推唤段在役/W4-c 毕锚 04:44 四环闭环/W4-d ②毕+①job2 降回=09:00 后 BOD 自办——**拍数定型终态：主链=sg hook 推送零拉取·兜底=BOD */6 轮询·job2 降回 30min 候形态**；快照归档终态=二进制全退 git 面（c84b8664f+8d0598007 收编+c2a71f005 悬空清场·路径真相=sde-w2d-preflight/）·json 留 track；残面四项挂账：mojibake R6 并批窗（04:52 m-cos 排令已开）/trimc NOTIFY 通道形勘定（R6 同批）/keeper 旧残留成因候后勘/job2 降回候形态）
- [x] ~~A6 auth/通道勘定结卷~~——**毕于 A5 前**（隧道形落卷=cto-w2a-channel-survey-20261120.md 四项主勘+sg 需求清单五项铸面；sg 侧许可+token 分发双端 sha 对表绿（A3 行内注）→W4-e §一 W2 行终态=token 门 fail-closed 在役+W4-a keeper -R 隧道在役=许可与通道实际生效终证）

## B 线 · ns8 前置修缮（顺序锁：B6 全谱合一=ns8 重开触发面）

- [x] ~~B1 修A：registry 防漏斗 7 处~~ ——11-19 毕
- [x] ~~B2 修B：fallback 链改（env 逃生门·default 链 GLM 活体面）~~ ——11-19 毕（final-synthesis 全谱六件合一）
- [x] ~~B3 修C：preflight 供给断言 5/5~~ ——11-19 毕（防线三梯成型）
- [x] ~~B4 修D-2：dsh 切 GLM 值面探针复验~~——**02:06 毕**（值席 cos-snb4 毕报：GLM 链活体通·独立探针读数留证·落卷锚 cto-fixD2-closeout-20261119.md）
- [ ] **B6 B线收口终卷全谱合一**（env 终探①+fallback 终验拍②并轨）← **当前最近未毕项**——CTO 收口段在工（02:07 值席报）→ **毕=ns8 重开触发面**
- [ ] B5 修D-1：dsh/trimodel 余额充值或键换发——候 CEO 裁（加急直呈在候·**不催不 block**：B 线其余项不依赖 B5）
- [ ] B7 ns8 排面重开（WP9v3 基线+等待语义 gate 首用+spawn 七席·notice-221 起跑授权在）——候 B6

## C 线 · 两包形收敛施工（notice-236 款一定谳·P1-P3 分批强制·契约测试先行）

- [x] ~~C1 P1 拆树派工~~（编排九件收进 @tricompany/orchestration-kit 独立包）——**01:50 毕**（值席 cos-snp1 短报：FSD 主刀+STE 契约先行排面双发毕·STE 契约测试套件卷落树 ste-contract-test-suite-nine-20261120.md）
- [ ] **C2 P1 施工**（九件迁移+契约测试先行+准入断言族）← FSD 主刀在工（STE 契约卷已落树）
- [ ] C3 P1 验收（四仓活体对表+漂移归一+md5 复验）
- [ ] C4 P2 配套/infra 收敛（候 C3）
- [ ] C5 P3 local 族收敛（候 C4）

## D 线 · 终极改造：runner 套 loop 套 fade-001（ns9 线·TriRMC runner 施工面承接）

> **runner 改造 CEO 意见（BOD 代笔·2026-11-20 01:45·按 CEO 已裁定口径延伸）**
>
> 1. **评分闸**：两轨制照行——fade-001 内部分（客观+主观=100）当周迁移质量分·**>90 免 retry / ≤90 retry 一次封顶**（代笔补口：retry 一次封顶防打转·再败=入异常卷报 CEO 不自动三轮）；7 席联审均分 **95 线**=进化判据·抖动=进化优势不抹平。
> 2. **进化判决**：COS 综合裁判——收轮间意见+看双分数→径裁（continue/evolve/close）·**不投票**；轮间意见窗 fail-closed（3 天催办维持）。
> 3. **编排形态**：程序编排 round_runner 本体（除 spawn 外都用程序·CEO 定谳）+spawn 七席·装配面退役；**TriRMC runner=施工面承接**（ns9 不走融合施工）。
> 4. **激活形**：自动挡插头辨——改造毕按激活判据自动上·**不候人工逐轮放行**（代笔补口：首轮跑完候 CEO 一眼知情·二轮起全自动）。
> 5. **收口恒等式**：有无联审收口都是对 fade-001 自检与总结·七席联审=进化面与收口两义分立（notice-210 正形）。
> 6. **护栏常位**：8 轮封顶保险丝+GLM 速率护栏+token 值面禁进转报+D-47 时刻制——四护栏改造后原样保留。

- [x] ~~D1 改造方案卷定稿~~（round_runner 程序编排+spawn 七席+等待语义+retry 闸漏补立）——**01:50 毕**（CTO round 编程设计卷落树 fade001-tenstage-deploy-20261115/cto-round-programming-design-20261119.md·值席划项回传认收）
- [ ] **D2 评分两轨落地**（ScoreCLI 机械面先+ScoreSkill 主观面后·两段锁勿互套·score 顺序 7/7 维持）——候 CTO 按 D1 设计卷排工
- [ ] D3 进化判据接线（95 线+四前置件批立兑现·含 95 线定谳件）
- [ ] D4 进化判决形落地（COS 综合裁判接口+轮间意见窗）
- [ ] D5 close 恒等式接线（自检总结面·closeCLI+closeskill 双面分工）
- [ ] D6 自动挡激活判据件（插头辨清单+首轮知情停点）
- [ ] D7 ns9 起跑（TriRMC runner 施工面·四护栏常位验证）
- [ ] D8 ns9 终判呈 CEO（并盘 100 三域 breakdown·r86 硬序·大白话摘要）

## 全局护栏（全程适用·非任务项）

- 真任务书生效面候 CEO（D-39 收窄）；方案级/工序开工=域内径裁事后呈报（01:28 口径勘正）
- token 值面禁进转报；D-47 落款=date 现查；并行窗三态保护（写后即 commit 锁笔）
- GLM 速率护栏+runway 观察（CFO 免 relay BOD 直报线常开）
- 09:00 deadline：到点未毕项如实列余量·终态报 CEO（不虚假毕项·不赶工降验收）

---
——BOD 2026-11-20 01:45 立·每 6 分钟拍催办维护·毕项随拍更新
