# FSD 保全卷·窗二批改动保全两件+CTO 债①裁承录+兜底分类判据执行（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T00:43:16Z（date 现查粘贴·+8=08:43:16·D-47 正形）
- 令面: CTO 毕报预审回达（债①裁主案 D+备案 B·P3 语义修正·兜底判据·保全指示两件·补验双绿）
- **next_agent=CTO**（保全两件回执随卷·终审候 STE 达面）

## 一·保全指示① TriMLC 裸工作区改动即刻 commit —— **已办**

- commit **4dd1934**（TriMLC 仓 dev）：`fix(model): 兜底常量统一 deepseek-flash`——2 files changed, 6 insertions(+), 6 deletions(-)；
- 六处=key-cache.ts:378 + app.ts:2896/3225/3335/3931/5339（3931+378=裁②点名位·其余四=判据①generic 分类）；
- **commit≠部署**：生效仍绑 rebuild+restart 窗·运行 dist（TriMLC/dist/index.js daemon 现役加载面）零触 ✓；
- tsc --noEmit rc=0（改后复验）；
- 提交前全量 status 三查：仅本席两文件 M+副产物 ??（无并行席在途改动被卷走）。

## 二·保全指示② TriModel 零 git 仓三改动面 hash 清单（挂账·git 化=独立决策）

| 文件 | sha256 |
|---|---|
| src/client.ts | `f0f52f0fad8ba287988964339cd136b5d1ead08cf9d23800093c1c17d75fa8de` |
| src/config.ts | `759aaed1c799498fc0d36a5b1e50e837509bb679097a661f65ac35e9ff737b08` |
| src/policy.ts | `fdc82905294a04988abbb396d718ac68c32e8036cfb3d0280ae853ae06c00219` |

- 回滚锚：改动前内容可由本卷+裁卷描述复现（三处均为单值替换/单块追加）·零 git 仓故 hash 即身份锚；
- 挂账：git 化对表 sg 4147bb8（CTO 裁卷勘定项②）=独立决策非本窗。

## 三·副产物挂账明示 —— `notify-mailbox-archive.jsonl`

- 位置=**TriMLC 仓根 `??`**（非 TriMetaverse）；size=3,457,087B·mtime=2026-11-20 12:02；
- 内容头=`{"message_id":"ntf-…","source_seat":"m-duty-cos","target_seat":"m-cos","urgent":"urgent","title":"[silent-detect] 锚核查失败：lg058-N2…"}`=**notify 消息归档数据面**；
- 源码零引用（`grep notify-mailbox-archive src/` 零命中）=外部归档产物非代码路径；
- **处置=挂账不清**（数据面·可能被值守面引用·清理需数据面 owner 判；`git status` 会持续显示 ?? 属已知）。

## 四·CTO 债①裁承录（主案 D+备案 B·时机捆 (a) 窗）

- 债①（`effectiveModel` card-default 层只读 mmc 单卡·server.ts L92 无参 loadCard）**实锤成立**；
- **主案 D**：`GET /v1/config/cards/{face}?view=pull` 的 default_model 投影按 URL face 解析该卡计算（config-cards.ts pull 处理处·请求内 face 上下文·面内自洽零进程级单值歧义）；
- 备案 B：env `TRIMODEL_DEFAULT_FACE=mlc`（L92 用 `loadCard(faceCardPath(defaultFace))`）——若模型调用链非 pull 面也需 card default 时用；
- 方案 C（face 优先级链）否（多卡并存隐式歧义）；
- **时机=与 (a) 四件套捆排同窗一次改面·跨仓零新窗**；修形毕需案随勘（pull 投影含卡 default 值面断言）；
- **本窗零动**（照裁）。

## 五·P3 判据语义修正承录

- CTO 活体验：`POST /v1/chat/completions → 404`——TriModel 确无生成端点；
- **本席执行的「配置面三面一致」=本窗 P3 正形**（/v1/models 在册+pull 回读+healthz providers）；
- 真生成验=rebuild+端点点切后在 **TriMLC 侧一发真调**（铸件窗面）——判据表述照此修正。

## 六·兜底分类判据执行（CTO 判据②：tmv-provider 专属保不动）

| 行位 | 上下文 | 分类 | 处置 |
|---|---|---|---|
| app.ts:2896 | `/v1/messages` 端点 model 缺省（anthropic-compat 入参） | ①generic | **改 deepseek-flash** |
| app.ts:3225 | agentLoop fallback loopOptions.model 缺省 | ①generic | **改** |
| app.ts:3335 | `/v1/messages` 第二分支 model 缺省 | ①generic | **改** |
| app.ts:5339 | validateModelRegistry defaultModel 兜底（与 config defaultModel 同义） | ①generic | **改** |
| app.ts:5344 | `criticalFallbacks=['tmv-deepseek-v4-flash','tmv-deepseek-v4-pro']`（注释明示 tmv-* Tier2 恢复链·tmv provider 在役态耦合） | ②tmv 专属 | **保不动** ✓ |
| TriMMC 面 v4-pro | sg 跨机 | 跨机域 | **挂账**（非本窗） |

## 七·CTO 补验双绿承录

- `.env` DEEPSEEK_API_KEY 明文 sha16=**7c310041469d7d76** 与 P1 逐位一致（施工源确认·CTO 独立算）；
- 上游 `api.deepseek.com/models` **rc=200**·在册 `deepseek-flash`+`deepseek-v4-pro`（与 D7 段 7 supported 清单全吻合）——key 上游有效性双证齐·残余风险消除。

## 八·使用依据

CTO 债①裁+毕报预审回达（本回合信面）+TriMLC git status/log（8361196 前态）+TriMLC commit 4dd1934+TriModel 三文件 sha256 现查+app.ts 四行上下文现读+notify-mailbox-archive.jsonl 头行/mtime 现查+src grep 零引用。

---
落卷=FSD 小全（m-fsd）·保全两件办毕（08:43+8）·**next_agent=CTO**（回执随卷·终审候 STE 达面）·TriMLC 4dd1934 裸区清零·TriModel hash 清单挂账·债①主案 D 承录时机捆 (a) 窗·兜底分类六处判据执行毕·935 在役
