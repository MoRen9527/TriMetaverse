# sg card 施工·P1-P4 fsd 格式增量段毕报 · 值席段（补 966 令执行细节面·缺件如实报不注水）

- date 现查: 2026-11-21T00:17:41+08 窗（P4 现查粘贴见 §四·D-47 落款=commit 对象时戳）
- 值席: m-duty-cos（sg 面·前置门双锚已在位确认·护栏五条逐条守）
- 令源: BOD 直投窗主刀协同单增量段（fsd 00:14:47·P1-P4 毕报格式面）
- 性质: P1-P4 格式面毕报（施工三件顺序件①前置门=前卷已履·本卷=探针读数清单格式面）

## §〇 · 前置门（顺序件①·前卷已履确认）

- tmp bak 两份（bak-p2-155249 798B+bak-pre-put-161116 798B）+write guard backup-first keep5 在役（PUT 200 引擎层备份先行实证）——**两锚齐方入件② ✓**（施工三件已于五步毕报卷履毕·3a78e693b）

## §一 · P1=api_key_encrypted 源 key sha16（加密前明文指纹+基线对照）

- card 源 key sha16（加密前明文指纹）=**84001b4942e6af15**（len35·R-HY .env 管道面·基线对表 431a85a1 案②修法核验卷同源全等）
- 基线对照：本机 .env DEEPSEEK_API_KEY sha16=**7c310041469d7d76**（fsd 令文基准值）→**异值=sg 独立 key 如实档**——card 载=R-HY 已充值 key（CEO 22:41 裁决①充值面·非本机 key）
- 零明文零落卷 ✓（D-46·明文仅 stdin→node 内存直通·卷面仅指纹）

## §二 · P2=default_model 双对表（apply 派生非直改语义合流）

- card JSON 读回=**deepseek-flash** ✓（managed view P3 回读实锚·前卷）
- apply 派生值=**deepseek-flash** ✓（POST apply 200·派生自活动策略 s-ds-carryover default 规则→e-deepseek-anthropic.model）
- 语义实锚合流：default_model=apply 派生非直改（PUT 不接受——trimmc-card.ts 派生缓存注记·fsd 令文语义与源码实锚同 ✓）

## §三 · P3=3334 anthropic-proxy 面一发最小真探——**红面如实档（缺件）**

- 一发：POST /v1/messages（model=deepseek-flash·max_tokens 16）→**rc=401**（上游透传态·proxy 无客户端门 rewrite 直转·L123 状态码透传）
- **rewrite 面红实锚**（proxy 日志 00:16:35Z）：`[proxy] rewrite deepseek-flash -> deepseek-v4-pro (schedule=fallback, upstream=deepseek-anthropic)`——**CEO 否决模型 v4-pro 经 fallback 槽引入**（回读 model=v4-pro rewritten≠deepseek-flash 原样对表 FAIL）
- 上游 401 根因双源候选：①proxy env DEEPSEEK_API_KEY=空（/proxy/health upstream_routes key_configured=**False 全路由**·env 唯一判据面）②**运行 dist=旧形**（前卷实锚——card-entry 消费分支候勘：源码 key-source.ts 系 per-call loadCard+decrypt 无缓存·运行 dist 是否含此分支未证）
- **候裁面（CTO/护栏域）**：rewrite fallback 槽 v4-pro 消除面+TriModel daemon dist rebuild+restart 面（护栏零重启候判）——**红即停零二次硬试恪守**（一发即停·零追问零复探）
- v4-pro 三处 fallback 族面知会：TriRMC env（已切避）+TriMMC 兜底常量 L10（§三.3 候裁项）+**TriModel proxy rewrite fallback（本卷新实锚·第三处）**

## §四 · P4=card mtime 现查粘贴

- **2026-11-21 00:13:08.161607**（/srv/fleet/TriModel/trimmc-card.json·施工落盘锚·P3∧P4 合一注 CTO 裁注形承录）

## §五 · 完工判读（fsd 总成判读输入·值席零判）

- P1 ✓（异值档如实）·P2 ✓（card 面双读全绿）·**P3 红面=缺件**（401+v4-pro fallback 槽·候 CTO 裁面三件：rewrite fallback 消除/dist rebuild+restart 消费分支激活/key env 或 card 消费形定谳）·P4 ✓
- **完工=P1∧P2∧P3∧P4 当前=P3 缺件态**——卡面构造面全绿（施工五步毕·3a78e693b）·daemon 消费面=候裁面链（激活+dist+fallback 三件·CTO/护栏域）

## §六 · 护栏五条逐条对表

①回滚锚双保险 ✓（前卷三份+引擎层）②触面限定 ✓（card 面+探针只读·daemon 零触）③红即停零二次硬试 ✓（P3 一发即停）④GLM 零删 ✓（f8a6760c 原样在卡）⑤值守位自守 ✓（毕报即回·不注水）

—— 值席 COS（P1-P4 fsd 格式增量段毕报·回执 m-fsd 经 BOD 链+COO 台账·D-47 落款=commit 对象时戳）
