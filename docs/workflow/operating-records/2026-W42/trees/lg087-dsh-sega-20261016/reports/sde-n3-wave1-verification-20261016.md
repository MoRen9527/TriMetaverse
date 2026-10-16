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

## 波1 续 · web 形段（COO 22:15:55 开工令·CTO 两缺口裁=a 案 web 形）

- lastSyncedAt（本节）: 2026-10-16 22:23:34+08:00（date 现查原值）

| 项 | 读数 | 判 |
| --- | --- | --- |
| 探针床复位（护栏①） | suppress 配置零残留·头注弃用标注在·preset 链验证形（registry+cos 单席） | ✓ |
| web 形 boot | 发布位现役形·127.0.0.1:3080·key env 形·**tricompass register 13 连出**（13 preset 全激活+compass provider 全注册） | ✓ **mount 面 boot 级实证**（对照 acp 形 pending·CTO a 案落锤） |
| 渲染面通路勘定 | web API=WS 流（typert RPC 自定义 mux 帧）+browser-trust fence+一次性 boot token（43 字）——REST/curl 三形全 401 无门 | ✗ 脚本客户端=协议逆向·今夜窗超限**停手报裁** |
| headless 载体旁证 | 一次性 headless 实验出厂形+session header preset **ABSENT**（与 acp 同） | web 形=preset 链唯一载体·a 案再添一证 |

- **候裁件**：渲染面三验载体三选——a) 段B 专窗 Python WS typert 客户端（估半日）b) dsh 官方脚本客户端（sdk profile·候勘）c) headless 混挂形（不推荐·非发布位形）
- **护栏执行**：web 实例关停（3080 释放·token 随进程亡）·headless 一次性 home 已清·现役/发布位零触碰（boot 只读）·探针床复位
- **观察注（值面纪律族增补）**：web boot log 含一次性 token 字样·tail 未滤入 transcript 一例——一次性形低风险已记档·正形=log tail 前滤 token 形（`grep -v 'token='`）

## b 案只读勘验（COO 22:27:49 派工·CTO 三锚裁示 22:28:22·22:33 判停）

| 锚 | 判 | 证据（纯 cat/head/ls/grep·零 boot 零发送零施工） |
| --- | --- | --- |
| ① 官方件性 | ✓ 成立 | `dsh --profile sdk`=官方 stdio JSON-RPC 服务端（dsh-sdk-jsonrpc-server·握手 identity=deepseek-harness-sdk-runtime·官方协议包 dsh-sdk-protocol 在册·主 README「SDK and ACP are profiles, not separate public bins」+Python wheel 打包同命令） |
| ② 读数承载 | **✗ 不齐→判停主因** | dsh-sdk-app 出厂 patch 无 agent-preset-registry（仅全局 system-prompt+jsonrpc-server·与 acp-app 同形）→preset 链 pending（轮3 机制同形实证）→三验①②两读数无承载；发布位 13 席 patch 只装 web profile——承载须补挂+装 13 席形=自研包装变形（锚①随破）+新施工（禁） |
| ③ 红线 | ✓ 不适用即满足 | stdio JSON-RPC initialize 合法握手·不涉 browser-trust fence/boot token |

- **结论（照 CTO 裁「任一锚不齐→停」）**：a 案挂窗2 候窗项清单第七项·渲染面三验①②随段B 专窗·今夜波1 收口=部分接位。
- **窗2 新增候裁选项（勘验附赠情报）**：官方 jsonrpc-server 明示「persona come from the surrounding composition」——「sdk profile 补 13 席 patch」路线（patch files=官方组合机制）可成 preset 链第二载体兼官方脚本客户端通路。
- 且回呈链=SDE→COO（msg e8f8b795·22:33:26 落款·对表 +23s 正挂）·本席转 standby 不开新施工面（余窗 87 分钟>30 分钟纪律）。

## 使用依据

- CEO 21:47:57 直连令（解停点+取径指定）·COS 21:49:42 转办信（D-46 五条纪律）·CTO 21:47:47 required 裁示（suppress 计数入运行观察读数）·COO 22:27:49 派工令+CTO 22:28:22 三锚裁示（COO 22:28:22 转录）
- dsh 0.2.0-rc.2 源码直读：dsh-agent-preset-registry（definitions 键=config.id·session-log 铁律）／dsh-system-prompt（personaPrefix section 注册·suppress 语义）／dsh-persona（Config 契约·scope-only 注释）／dsh-web-app 出厂 patch（registry 挂载正形）
- B1 分账卷（8c5f4a094）钥匙双路径·session log model-visible 实物（session.v4.jsonl 解压直读）
