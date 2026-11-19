# notice-214 款二·B 线正式勘修卷（CTO·malformed 24 案根因诊断定性+修法+复验）

- date 现查: 2026-11-19 08:5x CST（D-47）
- 勘修人: CTO 小狄（正式接单·BOD notice-214 CEO 融合裁「B 同步转正式勘令」）
- 勘修形: 在役活体探针（8710 /internal/v1/agent 五模型 A/B+GLM 反例·token 走 systemd show 零回显）+journalctl 时间线+双端 keyless 路径探针+源码链路全读——D-46 恪守（key 值零回显零落卷）

## 一、根因定性（主因层钉死·A/B 单变量实证）

**主因=④配额/账号层面精确形——DeepSeek 账号/键权益面失效**：daemon 键通过认证（404 带上游 request_id·非 401）但**全模型 404 Not Found**（chat/reasoner/flash/v4-pro/v4-flash 五 id 全测全 404）；同 daemon 同刻同链 **GLM 反例活体**（glm-5.3-flash→content_delta 流·loop_end done）=供给链机制面健康，DeepSeek 账号域模型权益=零（账号失效/权益回收形）。

**四层排除实证**：

| 层 | 实证 | 判 |
|---|---|---|
| ①代理面 | DeepSeekProvider=直连 fetch 零代理路径；GLM 同进程同网络栈活体通=出口面健康 | 排除 |
| ②WAF 面 | 404=上游结构化 JSON 错误体（request_id 在·非挑战页非断连）；keyless 同路径探针达认证层（401 gate） | 排除 |
| ③TLS 指纹面 | 同一 node fetch 栈对 GLM 成功（指纹非判别面）；curl/节点双客户端均达 DeepSeek 认证层 | 排除 |
| ④配额面 | **主因层**：认证过+全模型 404=账号域模型权益零（死账号/权益回收精确形）；附第二死键（dotenvx TriModel/.env 键 ****f738=401 invalid·双死键并录） | **主因** |

**malformed 全族解释**（报备件承录+本勘补强）：零 delta→_extract_agent_text None→unparsable——32-34 件/拍同根因；404 面首现锚=11-15 15:37（11-01 起 journalctl 3486 次全 404 循环）；GLM 供给面=r-duty 席组活体（席 sheet 正产出旁证）。

**级联面缺陷（次因·修 B 承）**：全 id 池互为 fallback（chat→v4-flash、reasoner→v4-flash…全部漏斗进 v4 死 id 对）——任一 id 失效即全链耗尽；agent-core 兜底常量 DEFAULT/FLASH=v4 名同源死对（历史 TriMC 谱系引擎库·现役形态=TriRMC 进程内引擎——LG-040 限定语承）。

## 二、修法定案（三修形·候排）

- **修 A·供给切换（主修·我域可施工）**：TriRMC 默认模型解析链切 GLM 活体面（resolveDefaultModel/resolveFlashModel 链+config-sync 形·glm-5.3-flash 已活体验证）——malformed 根面立止；DeepSeek 键续命/账号重开=外部面候 BOD/CEO 域（本席零代笔）；
- **修 B·fallback 链改（次修）**：registry/常量 fallback 不再漏斗进单一死 id 对——chat↔reasoner 自链+GLM 跨面级联（单一供给面死=链不灭）；
- **修 C·供给断言（防线·A2-2 供给面同构）**：preflight 断言族增供给探针断言（一发活体探针·供给红=断言红·七席修法共识+报备件承录落地）。

## 三、复验判据（修 A 施工毕）

1. 8710 /internal/v1/agent 默认链探针（零 override）→content_delta 流+loop_end done（活体）；
2. 下轮 fallback 拍 agent_readings failed=0（malformed 增量归零）；
3. GLM/DeepSeek 双面状态断言落 preflight（修 C 后）。

## 四、随窗面·节流笔显式复验回执行（notice-214 款二令面承·只补回执不重开）

**显式回执行**：节流笔两 commit（744e10d 同日一发形+2adc3c4 _json 名勘正）本席复验=**两 commit 均在 origin/dev 谱系（merge-base 实锚 yes/yes）+plan_scope 测试族 69/69 自跑 OK（2026-11-19 现跑）**——回执成立，节流面闭环。

## 使用依据

8710 /internal/v1/agent 五模型活体探针（chat/reasoner/flash/v4-pro/v4-flash 全 404·GLM done·token 零回显）；journalctl 时间线（11-15 首现/3486 次/keyless 双端路径探针 401 gate 实锚）；trimodel client.ts/providers 源读（registry fallback 漏斗形+DeepSeekAnthropicProvider 链路）；key-cache S2 加密形现勘（零解密零触值面）；744e10d/2adc3c4 谱系+69/69 自跑；报备件（malformed-root-cause.json 001438Z run）；D-46/D-24/D-47。
