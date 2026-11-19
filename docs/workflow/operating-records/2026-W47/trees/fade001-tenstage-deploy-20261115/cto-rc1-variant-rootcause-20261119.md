# ns8 spawn rc=1 新变体·深勘裁定卷（CTO·因果序勘定+根因钉死）

- date 现查: 2026-11-19 16:5x CST（D-47）
- 勘定人: CTO 小狄（fix B/C author 链·B 线域续勘承）
- 勘定形: 复现探针（同形 spawn 一发·全 stderr 捕获）+时间线 sweep+交集勘定三面——禁只报不勘承

## 一、根因钉死（复现单发·全错文捕获）

**rc=1 变体=DeepSeek 账户余额耗尽（QUOTA: Insufficient Balance）**——复现探针（dsh headless+overlay 同形一发）全错文尾行：

```
[tricompass-context] context registered: compass <- …（14 席注册成功行·噪音面）
dsh: QUOTA: Insufficient Balance (request_id: bbcf975f-…)
```

- tricompass 注册行=**成功噪音非故障点**（14 席 compass 全注册毕——boot 面健康）；进程败点=注册后的**模型调用段**（dsh 头一个真模型请求）——上游真响应带 request_id=dsh 键**认证过+模型解析过+计费层拒**（Insufficient Balance=余额零）；
- **dsh 链键≠trimodel 链键**：trimodel 键=404 Not Found 面（根因卷④）；dsh 键=QUOTA 余额面——**同一 DeepSeek 账户族的两个死面**（键不同/死法不同）。

## 二、因果序勘定（修 B/C 交集=零·时间线三实锚）

| 勘面 | 实锚 | 判 |
|---|---|---|
| 时间线 | score-skill spawn 健康 ripe 至 042908Z 拍（joint=1）；**首 rc=1=075254Z 拍（07:52）**；090551Z（ns8·09:05）全断 | **rc=1 早于修 B/C（昨 15:39-16:00）八小时**——「修 B/C 后首现」=假关联（ns8=修后首个 spawn 轮·非病因首现轮） |
| 交集① | 修 B vendor patch=trimodel dist client.js——dsh=@deepseek-ai/* 独立生态**零 import** | 零交集 |
| 交集② | 修 C=preflight.py——dsh boot **零 import** | 零交集 |
| 交集③ | env 增补=TRIMODEL_*/TRIRMC_* 三键——dsh **零读取** | 零交集 |

**因果序定谳：rc=1 与修 B/C 零因果**——同一根因（DeepSeek 账户域④配额/权益面）在 dsh 链键上的时面暴露（余额于 11-19 04:29-07:52 间耗尽·spawn 自耗加速）。

## 三、修法建议（双径候裁）

- **修 D-1·余额径（外部面·唯一直修）**：DeepSeek 账户充值/键换发=BOD/CEO 域（QUOTA 面唯一直修·与根因卷键续命面同源合并呈报）；
- **修 D-2·dsh 供给切 GLM（config face·我域候勘施工）**：spawn env 注入 ANTHROPIC 三键面（ANTHROPIC_BASE_URL/AUTH_TOKEN/MODEL=glm-5.3-flash·值经 settings.json 直通 env 零回显 D-46）→dsh 会话切 GLM 活体面——候令形（loop_autoreview spawn env 增补一行族+白盒）；
- **即效面**：值席手工补面（ns2 先例·在工承）——aggregate 候补面后终形（设计面 exit 2 链停=防线上如实）。

## 四、与 B 线主根因关系

同一④族双链双面：trimodel 键（404 权益面）+dsh 键（QUOTA 余额面）——**账户族级失效**（非两键独立坏）。修 A/B/C 已令 TriRMC/trimodel 链 GLM 化（活体三重绿）；dsh 链=修 D 双径候裁（D-1 外部直修最快·D-2 config 切换=令后我域即施工）。

## 使用依据

复现探针全错文（/tmp/fixb-repro rc=1+QUOTA 行）；score-skill 时间线 sweep（042908 健康/075254 首 rc=1/090551 全断）；修 B/C 交集三面源勘（trimodel dist=trimodel 生态/preflight.py/env 键域）；tricompass-context/index.mjs 源读（注册成功语义）；notice-214/218/219 谱系；D-46/D-47。

---

## 勘正段（notice-222 款二·CEO 账户面定谳承·修正记录留痕形·2026-11-19 18:0x CST）

**归因勘正**：§一「dsh 键=QUOTA 余额面（DeepSeek 账户域）」定性——**CEO 定谳勘正=GLM 周额度耗尽面（非 DeepSeek dsh 键）**；CEO 已用最后一张周重置卡恢复周额度。原文段落保留不删（修正留痕形·本段为勘正记录）。

**修 D-2 活体通（rc=0）×重置卡恢复·两面贡献序对表**（入卷如实事勘定）：

| 面 | 贡献者 | 时点序 | 解除面 |
|---|---|---|---|
| QUOTA 面解除 | **CEO 重置卡**（GLM 周额度恢复） | ~17:00 前后·先 | 额度面（必要条件——无额度任何路由皆 QUOTA） |
| 1210 面解除 | **修 D-2 overlay**（llm-deepseek 适配器行 maxTokens=16384 配对·dsh 默认 256e3>GLM 上限） | 17:33 后·后 | 参数面（独立于额度·我面） |
| 路由显式化面 | 修 D-2 env 注入（DEEPSEEK_BASE_URL→GLM 端点） | 随 3bdae1f | 路由一致面——**若存量路由本已 GLM 同面=冗余一致形·若存量=DeepSeek 端点=切换面**（候勘注） |

**rc=0=三面叠加时点联合结果**（额度卡 CEO 面·预算 overlay 我面·路由注入一致性面）——非单因归功形。

**款一承录**：修 D-1 候裁面关闭（DeepSeek 暂不充值不换 key）；GLM 单供给=唯一活体面；fallback 链 deepseek 节点=死节点保留不改（链形兜底保留）。

**款三盯守义务登记（CTO 面）**：8710 链+spawn 链 GLM 消耗速率知情盯守（读数源=spawn/score-skill 产出卷+preflight 供给探针断言读数·与 CFO runway 盯守联动）；**QUOTA 类异常再现=即刻报 BOD（不等 30min 节律）**——standing 承。

**留勘面（如实·非阻塞运营面）**：rc=1 复现 shell 零 DEEPSEEK env 仍过认证=认证键供给存储面在（位置未勘获·dsh home 无 settings 存储实锚）——候勘注（键账户面=CEO 权威定谳承·存储位置面不阻运营）。

**勘正使用依据增补**：notice-222 款二 CEO 定谳；周重置卡恢复事实；本卷 §一~§四原勘证据（证据面全部保留有效——错误体/request_id/时间线/交集三面=不变事实；变的=账户归属标签）。
