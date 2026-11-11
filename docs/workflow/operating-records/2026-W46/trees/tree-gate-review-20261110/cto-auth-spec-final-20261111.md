# 树执行授权门禁 · 授权件规格终稿 v1.0（CEO 八件全裁批后件③·CTO 出稿）

- sourceOfTruth: 本件（授权件+挂载检查规格正身·挂载闸施工与验收法定锚）
- syncMode: static（规格终稿 v1.0·施工期勘误走勘正注不改版号）
- lastSyncedAt: 2026-11-11T02:36:59Z（写前现查 10:36:59+08 原值·D-47）
- 令链: v2 总卷批注定谳（f8c977051 §八·CEO 2026-11-11 10:30 八件全裁·候裁③签发形=双签批·④规格 CTO 批·②hook=撤定谳）→规格终稿开工令（COS 10:34 转达）→本稿
- 裁定基面: 骨架批（挂载闸=服务域唯一执行入口·duty-cos 退回链）+双签批（③）+hook 撤（②）+settings 缩挂载脚本配置面（⑤联动）+硬隔离撤定谳（⑦）+观察期批（⑥·2 周三读数·排程 COO）

## 一、授权件正身 `authorization.json`（ADE 家族同形·三形合一）

```json
{
  "objectType": "TREE_AUTHORIZATION",
  "schema": "tree-auth/v1",
  "domain": "local-to-remote",
  "tree": "docs/workflow/operating-records/<ISO周>/trees/<tree>",
  "tree_hash": "sha256:<任务书正身卷内容 hash>",
  "authorized_by": "cos",
  "co_signer": "coo",
  "authorized_at": "<ISO8601 原值>",
  "expiry": "<ISO8601 = authorized_at + 72h>",
  "scope": ["<执行席名清单>"],
  "execution_permit": true,
  "order_msg_id": "<COS 派工信 msg_id 锚>"
}
```

**字段定谳表**：

| 字段 | 定谳 | 依据 |
|---|---|---|
| `schema` | `tree-auth/v1`（版本锚·演进走 schema 增版） | 三形合一防漂 |
| `domain` | 枚举 `local-to-remote`（现役唯一形）/`remote-to-local`（**预留·候触发**） | 增补 A 裁量（§五） |
| `tree_hash` | **sha256（任务书正身卷文件字节流）**——签发时算·挂载时重算对表 | tree-hash 绑定检查点（CEO 批）·**不用 git hash-object**（本仓 CRLF/LF autocrlf 漂移实测有 warning·字节流 hash 稳定） |
| `authorized_by` | 恒=`cos`（签发席） | 双签批（③·CEO 10:30） |
| `co_signer` | 恒=`coo`（副签席·双签形有单签形无） | 双签批（③） |
| `expiry` | `authorized_at + 72h`（超时=无权态须重签） | 三形合一择 expiry 形（CPO 附注两态实测第二态·防僵尸授权）·72h 覆盖常规任务生命周期·**超时重签=门不豁免不设续期弱化入口** |
| `scope` | 目标执行席名清单（挂载脚本对目标席查含） | v1 分卷 §一承续 |
| `order_msg_id` | COS 派工信 msg_id（「已发≠在链」纪律投影·授权可溯源到发信记录） | v1 分卷 §一承续 |
| 绑定对象 | **任务书正身卷**（brief 文件）非整树——毕报/日志追加不触发失效 ·任务书内容改动=hash 失配=须重签 | 绑「做什么」不绑「卷面修饰」·防移植冒用同时不勒死正常收尾卷 |

## 二、挂载脚本检查序（fail-closed 全检·顺序执行·任一不过即退）

| # | 检查 | 不过=退因枚举 |
|---|---|---|
| 1 | 授权件存在性（树根 `authorization.json`） | `AUTH_MISSING` |
| 2 | `objectType`+`schema` 对表 | `AUTH_SCHEMA_MISMATCH` |
| 3 | 值面三查：`authorized_by=="cos"` ∧ `co_signer=="coo"` ∧ `execution_permit==true`（**键在≠值对**） | `AUTH_INVALID` |
| 4 | expiry 窗：`authorized_at ≤ now < expiry`（**键在值对但过期=退**） | `AUTH_EXPIRED` |
| 5 | tree_hash 对表：重算任务书正身卷 sha256 == `tree_hash` | `AUTH_HASH_MISMATCH` |
| 6 | scope 对表：目标执行席 ∈ `scope` 清单 | `AUTH_SCOPE_EXCEEDED` |
| 7 | 全过=挂载放行 | —（挂载日志落卷 commit） |

- **fail-closed 原则**：任一字段缺失/解析败/取不到=按对应退因退（解析败按 `AUTH_SCHEMA_MISMATCH`）——**取不到值不放行**（门不豁免哲学）；
- **退回链挂接**（COO 五步细化已批）：退因记挂载日志→原路退回不销毁不代改→通知路由 COS 主+BOD 抄→分级=P2 常态拦截/P1 留绕闸企图升级纪律面→重挂不罚拦罚两分；
- **督办第三读数落点**：退回-重挂闭环时延=挂载日志退回时戳→同树重挂放行时戳差（§三回执面补终态读数）。

## 三、执行毕回执件 `execution-result.json`（CEO 增补 B 纳入·裁量=观测闭环必要面）

```json
{
  "objectType": "TREE_EXECUTION_RESULT",
  "tree": "<同授权件 tree>",
  "order_msg_id": "<同授权件锚>",
  "executor": "<执行席名>",
  "result": "success | failed | blocked",
  "finished_at": "<ISO8601 原值>",
  "artifacts": ["<毕报/产出卷相对路径>"],
  "error_summary": "<失败/阻塞时摘要·成功时空串>"
}
```

- **触发**：挂载放行后执行达终态（成功/失败/阻塞）时挂载脚本（或其驱动的执行链收口点）写本件；
- **通知路由**：与退回链同构=COS 主+BOD 抄（对域知会）；
- **观测价值**：本地域不出席（夜间态）可晨检回流读终态——「退回链夜间挂起安全侧」非缺口注的观测补全面。

## 四、三关键动作 commit 锚（CEO 增补 C 纳入·裁量=署名审计链闭环零新基建）

| 动作 | 存档件 | commit 要求 |
|---|---|---|
| 挂载放行 | `<tree>/mount-log.md`（谁/何时/授权件 hash/执行席） | 落卷 commit·署名脚本宿主席（duty-cos） |
| 退回 | `<tree>/mount-log.md` 退回段（退因枚举+时戳） | 落卷 commit 同上 |
| 执行毕 | `execution-result.json`（§三） | 落卷 commit 同上 |

- git 署名审计链闭环：授权件 commit（@m-cos 签发）→mount-log commit（duty-cos）→result commit（duty-cos）——三段署名可事后审计（伪授权/绕闸可追溯）。

## 五、反向挂载对称面（CEO 增补 A·裁量=**schema 预留·不建空闸**）

- **裁量理由**：(a) CEO 域性分工定调「本地域=会议交互+设计验证·服务域=执行」——服务域→本地域反向挂载要求本地域执行=与域性分工相抵；(b) 现役 sg→本机已有人工授权闸（任务书派工 COS 链流转·D-27）；(c) 为低频假想场景建自动反向闸=「想复杂了」判同型风险；
- **预留条款**：`domain` 字段双向枚举（§一）+检查序同构声明（反向闸=同一检查序换 domain 侧·零新设计）——**施工候真实需求触发**（现役场景出现≥2 例且人工链成为瓶颈时另立施工单），本规格施工序不含；
- **本规格内生效面**：仅 `domain: "local-to-remote"` 形。

## 六、验收挂接（观察期·排程 COO·启动锚=闸上线）

1. **红蓝对抗两态**（CPO 附注批定·各一跑真链路）：态一=无授权件挂树→应退回（`AUTH_MISSING`）·态二=过期授权件挂树→应退回（`AUTH_EXPIRED`）——两态读数=验收锚；
2. **观察期 2 周三读数**（COO 形）：拦截命中率/误报率目标 0/退回-重挂闭环时延（§二落点）；
3. **施工序建议**（候施工派工·挂载闸施工树另开）：①服务域挂载脚本改造（sg 侧现役挂载脚本位勘定→检查序七步嵌入）②授权件模板+签发位（本地域 COS 面模板卷）③本机域真授权件试跑一树全链④红蓝两态实测⑤观察期启动（COO）。

## 七、随裁候面知会承录

- P2 任务书=CEO 裁「暂时不激活」维持候态勿催（本席开工令不发·候面状态更新）；
- 件 B 域性分工入册=CAO 归口（对表件三 7055431 防两张皮）——本规格 `domain` 字段语义与入册件对表点=「本地域执行面界分判据」（v2 细化注 1：改变服务域或仓库状态=执行须过闸·只读/进程内验证不入闸域）。

## 八 · 增补款（施工期勘误·COO 一请触发·不改版号）

**§八-1 tree_hash 对象定义勘正（COO 一请采纳·原 §一选型论证勘正自领）**：

- **定谳**：`tree_hash` = **`git hash-object --path=<charter_ref> <charter_ref 文件>` 输出串（blob 身份·git 对象模型 LF 规范化）**·字段值形 **`blob-sha1:<40hex>`**（前缀显式标注算法）；
- **勘正理由（COO 读数实锚+机理补全）**：原 §一「工作区文件字节流 sha256」跨机漂移实锤（首例 c50aaa46 LF 态计·sg Linux checkout 对表即漂）——**且不止跨机：本机 autocrlf=true 下 git touch 一次（checkout/reset）工作区即转 CRLF·本机自漂**。原款「不用 git hash-object」的论证系误推——实测 CRLF warning 证的是**工作区字节流不稳定**（恰支持规范化形），blob hash=入库规范化内容身份恒定，正是防漂正形。采 COO 推荐 blob 形·次选 LF 字节规范化否（自实现规范化面：CRLF/尾随换行/BOM/编码四细节·签发/校验/审计三消费面三处实现三处坑）；
- **跨机一致性机理**：blob 身份由 git 对象模型定义（text 文件入库一律 LF 规范化）——本机 Windows（autocrlf=true·hash 前转 LF）与 sg Linux（默认 false·checkout 工作区恒 LF）同命令同结果·`--path` 显式走 attr filter 双保险；
- **首例处置**：首例授权件 tree_hash=`sha256:c50aaa46…` 按本款作废·真链试跑前按 blob-sha1 形重签。

**§八-2 字段面勘定表（首例授权件勘改指令·字段名出入以本表为准）**：

| 项 | 规格定谳 | 首例现值 | 处置 |
|---|---|---|---|
| 文件名 | `authorization.json`（§一定名） | `tree-auth.json` | 随规格改名 |
| schema 字段名 | `schema: "tree-auth/v1"` | `spec` | 改 |
| `charter_ref` | **必填**（本款新纳·采首例分层）：任务书正身卷相对路径——`tree`=树标识·`charter_ref`=绑定对象路径·`tree_hash`=charter_ref 的 blob hash（补原稿绑定对象字段落点洞·采首例） | 有 | 字段采纳入规格 |
| `tree_hash` | `blob-sha1:<hex>`（§八-1） | `sha256:…` | 重算重签 |
| 双签字段名 | `co_signer`（§一·检查序判此名） | `co_signed_by` | 改 |
| expiry 字段名 | `expiry`（§一·检查序判此名） | `expire_at` | 改 |
| `scope` | **恒为 JSON 数组·执行席名清单**（§一·检查序第 6 步 ∈ 判定的前提） | 字符串（施工面描述） | 改形——「做什么」入 charter_ref/scope 描述字段不判·「谁执行」才入 scope 数组 |
| 额外字段（`*_note`/`status`/`basis` 等） | **允许存在·检查序不参与判**（七步只读定谳字段·未知字段忽略=防过度约束·注解面留白） | 有 | 无需改·条款确立 |

**§八-3 首例授权件勘改分界（归属路由）**：技术字段勘改清单=本款（规格 owner 权）；首例文件勘改执行=COO 面（该文件作者·派工树文件）；签发笔面（`order_msg_id` 真锚+`authorized_at`/`expiry` 复核）=COS 签发序（COO 派工单自注候补正·照走）——三面各归其位·勘毕=自举闭环真链试跑前置件齐。

**§八-4 D-78 对表注**：首例 `basis` 引 D-78（TC 5acae50·10:42 铸条入册）——件 B 入册已动·规格与本增补款字段语义对 D-78 正身复核点=域性分工定调+门禁制条款号（CAO 入册面·本席 §七对表注承续）。

## 使用依据

批注定谳卷 f8c977051 §八（八件裁语+三增补建议原文+批后链）/v2 总卷四席确认卷（efc366f4a·含本席两细化注）/本席联审分卷（99901dd2a·§一规格样例+§九五层纵深承续）/COO 补笔 ba22e88f6（退回五步+督办第三读数）/CPO 附注（expiry 两态实测）/COS 开工令转达（10:34·msg 面）/COO 一请信（2026-11-11T02:41:46Z 落款·tree_hash 跨机漂移读数+blob 形推荐=本增补款触发源）/首例授权件+派工单（ed767c38c·字段面出入实勘源）/本仓 CRLF warning 实测（§八-1 机理补全依据）。

—— CTO 小狄（m-cto·规格终稿 v1.0），2026-11-11 10:36 CST（写前现查 2026-11-11T02:36:59Z=10:36:59+08 原值）
