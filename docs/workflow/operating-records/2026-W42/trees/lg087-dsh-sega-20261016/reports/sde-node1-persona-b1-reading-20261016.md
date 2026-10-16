# G1 节点1·scoped persona 实测首验（B1）读数卷 · charter-2026-W42-003

- sourceOfTruth: 本卷（trees/lg087-dsh-sega-20261016/reports/sde-node1-persona-b1-reading-20261016.md）
- syncMode: static（读数卷·persona 段与 model 段分账记账照 CTO 13:02:14 裁——本卷仅 persona 段·禁并表）
- lastSyncedAt: 2026-10-16T13:07:09Z（date 现查 13:06:14Z·写前跑）
- 施工位: 河源 R-HY·测试床=一次性 DSH_HOME（/home/fleet/dsh-smoke-20261016/dsh-home·零污染现役面）·运行时=钉死装设 /srv/fleet/dsh@0.2.0-rc.2 exact

## 一、B1 首验判（charter §2B B1：scoped persona 是否需 bundle patch）

- **判：零 bundle patch 成立（mount 级 CONFIRMED）**——三行（agent-preset-registry+preset-persona-test+scoped dsh-persona 行）纯经 profile 用户补丁层（cordis.patch.yml·官方 sanctioned 用户层）干净入组合树：`--dump-config` RC=0·零警告·零 bundle 编辑·三包均官方在册包（安装 node_modules 自带）。
- 渲染级（render·system prompt 实组装含 persona 文本+`{{var}}` 插值零失败）：**候 model leg 并测**——无钥匙态下 ACP 会话零 update 流、零 session 持久化（无成功 turn 不落盘），render 证据活体不可得。与 CTO 门禁语义吻合：persona 段绿≠烟测门过。

## 二、活体链读数（无钥匙态·2026-10-16T13:04-13:06Z 段）

| 探针 | 读数 |
| --- | --- |
| spawn+initialize | 绿（protocolVersion=1） |
| authenticate | 绿（authMethods[0] 即成·trusted controllers 语义） |
| session/new | 绿（configOptions=model=["deepseek-official","deepseek-v4-flash"]+reasoning_effort=high） |
| session/prompt（无钥匙） | settlement=内部错误 -32603「no API key for provider route "deepseek-official"; store DEEPSEEK_API_KEY through the credentials service（web Models 页写入）, or export DEEPSEEK_API_KEY in the launching environment」 |
| update 流 | 零条 |
| session/close | 绿 |

## 三、窗内新发现三件（如实入账）

1. **ACP session/new 不校验 preset 存在性**（bogus-default 判别实验：registry default 指向不存在 preset 时 session/new 照样成功）——**n2 批量发布门不能靠 session/new 验 preset**：preset 选择接线在 acp 建会话面不可见（render 时才炸或软失败），render 级验证法候 model leg 定谳。批量发布门（13 preset+13 persona+版本头注）的验证手段需含 render 级抽查。
2. **钥匙官方双路径**（a 线管道落点选项）：①credentials service（dsh-credentials-local 文件存储·harness home 下 `.credentials.yaml`·可直接编辑·自动热载·优先级 env>store>project .env>home .env）②spawn env 导出。烟测推荐 ②（零新增落盘）；长驻运行形态候值席手册（①更适合常驻）。
3. **acp profile 默认组合不含 preset 三包**（dsh-agent-preset/-registry/persona 均需 patch 层显式挂载）——合同 §4.2「acp profile 起步+preset 用 registry 默认（standard 系）」的落地板=需在 profile 补丁层挂注册表行+默认 preset 行（本卷测试床已验证此挂法零 patch 冲突）。

## 四、分账声明

- 本卷=persona 段（B1）读数：mount 级全绿·render 级候 model leg。
- model leg（烟测门 §2.5 全链）：**未过未冻结终态**——凭证缺口已报 CTO（13:02Z）·M→R 管道照 002 先例流转中（COS 执行）·钥匙到位即本窗内补测；fallback=冻结转另窗如实收口。

—— 落款（date 现查原值）: 2026-10-16 21:06:14 +0800（SDE 小布·r-duty-sde）
