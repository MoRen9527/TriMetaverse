# SDE proxy slot ①查读数卷（CFO 勘定框架执行·分支 A 根因定谳＋修正需求面）

- sourceOfTruth: 本卷（①查执行读数·分支 A 根因定谳）
- syncMode: write-time
- 执行席: SDE 小布；令源=m-duty-coo ①查执行转达（CFO 勘定框架 ea934dfcf 承·首要嫌疑 key 槽位错位）
- date 现查: 2026-11-21 01:1x+08（D-47 全程·指纹面 D-46 照守·值零录）

## §一 · ①查执行读数（勘定四步逐面）

| 步 | 面 | 读数 |
|---|---|---|
| 卡面 slot 结构勘 | trimmc-card.json（四枚 bak 链在） | provider_entries.e-glm-anthropic.api_key_encrypted＝**加密载**（len 104·加密串 sha16=f8a6760c2fa03af3——加密串 hash≠key hash·卡面零解密恪守）——卡面指纹与卡载指纹（84001b49）口径不可直对→换面 |
| proxy 进程面实勘 | pid 3014124（trimodel-proxy.service·00:46 起·3334 监听在） | proxy-server.js＝anthropic rewriting proxy（LG-035 P3-sg 切片·`/proxy/health` 自检面 no key material） |
| **proxy 真调用一发**（④面 body 补取） | POST /v1/messages probe-shape 面 | **HTTP 401**·body＝`{"type":"error","error":{"type":"authentication_error","message":"Authentication Fails, Your api key: ****f738 is invalid (request_id: d879de42-…)"}}`——**proxy 活动槽尾＝f738**（上游平台回显·动态实证） |
| **proxy health 自检面**（决定性实锚） | GET /proxy/health | **upstream_routes key_configured: false**（deepseek-anthropic apiKeyEnv=DEEPSEEK_API_KEY＋glm-anthropic GLM_API_KEY **双缺**）·policy_effective source=env-default |

## §二 · 根因定谳（分支 A·slot 错位修正对齐）

- **主因＝proxy 进程 env 面 key 双缺/旧值驻留**（非卡面槽错位——proxy key 源＝env（apiKeyEnv DEEPSEEK_API_KEY）非 trimmc-card——**卡面与 proxy key 源两分立面**）——proxy 起于 11-20 00:46 旧 env 态驻留·卡面 11-20 16:13 改写（face 账 write/rotated/removed=1 实锚）未入 proxy env（两分面·改写与 proxy env 无联动）
- **槽尾 f738 定性**＝env 旧值残留或空 key 上游回显（平台侧 invalid 判面）——充值 key（84001b49·len35·值席真值源）**未入 proxy env**＝401 与充值动作无关（CFO 基线承：401 形资金面不在场 ✓复核成立）
- **修正需求面**：proxy env 注入充值 key（DEEPSEEK_API_KEY＝充值 key 值·值席真值源）＋proxy reload——**权面（root systemctl）＋值面（key 值席持）双候**——直办链/值席注入面候裁（P3 续候修正毕）

## §三 · 使用依据

CFO 勘定卷（ea934dfcf·首要嫌疑 slot 错位框架）；探 1 读数卷（84001b49/7c310041 双指纹表）；proxy health/真调用实录（本卷 §一）；face 账（16:13 write 面）；trimmc-card 结构勘（值零录）。

—— SDE 小布（①查读数卷·分支 A 根因定谳·卷面时戳=commit %cI）
