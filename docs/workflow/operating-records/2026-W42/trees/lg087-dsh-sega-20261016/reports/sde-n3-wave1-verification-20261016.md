# SDE 施工卷 · charter-2026-W42-003 n3 波1 验证段毕（key 接取+注入双通道 model-visible 实证+suppress 计数+两缺口发现）

- tree-id: n3（CEO 21:47:57 直连令解停点·COS 21:49:42 转办·standby 解除）
- charter: charter-2026-W42-003
- syncMode: static（施工在案卷）
- lastSyncedAt: 2026-10-16 22:09:15+08:00（date 现查 22:09:15+0800 原值）
- 执行席: SDE 小布（m-sde）；施工位=本机（key 接取+卷）+河源 R-HY（探针床）

## 波0 · deepseek key 接取（D-46 全条款）

| 项 | 读数 | 判 |
| --- | --- | --- |
| 在案记录查（D-46③） | settings.presets/deepseek.txt 无先例读取记录；键名惯例 DEEPSEEK_API_KEY 溯源 TriModel 键池/LG-035 实锚 | ✓ |
| 本机读取仪式 | read→var→计数面断言：prefix sk- ✓·len 35（对表 COS 对象断言 35B） | ✓ 零回显 |
| 传输落位 | stdin 管道→河源 `/home/fleet/.dsh-sega-n3/deepseek.env`（fleet 属主·umask 077→600）·wc -c 35 对表平 | ✓ 值零进命令文本 |
| key 锚（D-46② 转报面） | 文件名 deepseek.txt（本机 settings.presets）+35B+写入目标=河源 ~/.dsh-sega-n3/deepseek.env（600·fleet）+探针结论=key 链通（deepseek-official route·deepseek-v4-flash·ctxWindow 1M） | ✓ |

## 波1 · 注入验证判别链（五轮探针·假读数排除全程留痕）

| 轮 | 判别点 | 读数 |
| --- | --- | --- |
| 1 | 无钥匙基线复证+路径笔误暴露 | cat 报错直白——写入位 `.dsh-sega-n3` 带点·探针命令漏点（自我路径不一致·非外部删除·ls 实证目录在） |
| 2 | key 链通 | stop=end_turn·8s·模型真响应；契约勘误=dsh update 类型 snake_case（agent_thought_chunk） |
| 3 | preset 激活判别 | stderr「pending (waiting for service: agentPresets)」——n2「render 级懒加载」判断**推翻**：真因=acp 组合缺 agentPresets 提供者 |
| 4 | registry 挂载 | 补 dsh-agent-preset-registry（web-app 出厂 patch 同形·default=config.id 形 r-duty-cos）→tricompass register 行现 |
| 5 | 注入正形通道 | preset-scoped persona 炸（同名冲突）→改 **dsh-system-prompt config.personaPrefix 正形通道**→**机制面全绿** |

## 部署收口 · 三验读数

| 验 | 读数 | 判 |
| --- | --- | --- |
| ① compass 注入渲染对表 | runtime-context snapshot sections=[sandbox:policy, approval:policy, **compass**]·compass 段 28766 字含「通信面正名」×4·stderr register 行=`compass <- /srv/fleet/TriMetaverse/.claude/compass/ceo-chief-of-staff.session.md` | ✓ model-visible 实证（user-role snapshot 形·合同件⑤§4.3 cache 语义印证） |
| ② persona 自检句身份抽验 | system message 13987 字含 prefix 全文（当前角色定位×1·身份契约×1·小贾×3）·回复三字段全中：「通信正名 COS／职位全称 TriCompany 董事长助理（CEO 总助／Chief of Staff）／工作名小贾」 | ✓ |
| ③ mailbox 一来一回 | **候桥修（停点②·窗2）**——且本波发现的 acp 适配件缺口（下）与其同族 | ⏳ 候窗2 |

- **suppress 场景实测（CTO 裁示②计数=1 案钉死）**：`includeRuntimeContext: false` → runtime snapshot **整层消失**（compass 随层消·无豁免手段=required 候定项意义所在）·persona section 独立存活（section/runtimeContext 两层分离正解）。
- **token 读数（CFO 口径·逐条 usage）**：4 轮 input 18872+output 711+cacheR 27519≈47K total——<1M 额度 4.7%；冷轮 in 18367（prefix 5480+suffix 5613+compass+出厂 system+tools schema）·热轮 cacheR 11008/11136（88-99% 谱系吻合监测哨读数）。

## 两缺口发现（CTO 裁示域·如实报）

1. **acp 形 preset 绑定缺口**：acp session 创建不走 agentPresets 链——三铁证=session header（session.v4.jsonl line 0）无 preset 字段／dsh-acp lib 零 preset 引用／dsh-acp-app bundle 无 preset-registry（web-app 出厂自带）。**13 席 preset 形生产运行形态必须 web 形**（或候 acp 适配件——mailbox 桥修同族候窗2）。
2. **persona scope 语义**：preset-scoped dsh-persona mount 与 dsh-system-prompt 自身 config.personaPrefix（deployment:persona-prefix）同名冲突 throw——preset scope 非 agent scope 不可 shadow·官方 per-agent override 正形=agent.ctx（agentPresets→agent 链·acp 缺）——同根因 1 的另一面。
- **验证正形（本波实证）**：全局 systemPrompt config.personaPrefix/personaSuffix+全局 tricompass mount（探针单席床无覆盖问题）——13 席生产形注入形态候 CTO 裁（web 形 preset 链 vs 全局形+分流适配件）。

## 环境状态（收口时点）

- 现役 13 席（claude 形 16 真席）零触碰 ✓·发布位 web patch 零触碰 ✓
- 探针床 `/home/fleet/dsh-compass-probe-20261016/`：patch=全局验证形（includeRuntimeContext:false 已注入·候复用时注意）·acp_probe_n3.py（snake_case 收集版）·probe-stderr-n3.log
- key 承载位 `~/.dsh-sega-n3/deepseek.env`（600·fleet）在位——段B 13 席运行前形态（credentials service vs env）候 CTO 裁
- 施工窗硬边界 24:00 前本段收口 ✓（22:09）

## 使用依据

- CEO 21:47:57 直连令（解停点+取径指定）·COS 21:49:42 转办信（D-46 五条纪律）·CTO 21:47:47 required 裁示（suppress 计数入运行观察读数）
- dsh 0.2.0-rc.2 源码直读：dsh-agent-preset-registry（definitions 键=config.id·session-log 铁律）／dsh-system-prompt（personaPrefix section 注册·suppress 语义）／dsh-persona（Config 契约·scope-only 注释）／dsh-web-app 出厂 patch（registry 挂载正形）
- B1 分账卷（8c5f4a094）钥匙双路径·session log model-visible 实物（session.v4.jsonl 解压直读）
