# STE·LG-060 渲染链解冻复验独立验卷（batch-14 形态；COS 值席请领 05:3x）

- sourceOfTruth: 本件（LG-060 复验链 STE 独立复验正身；对象=cos-lg060-refix-chain-readout-20261005.md cc8e6a59 对表）
- syncMode: static（两法四读数毕；死线 10-05 EOD 提前达成）
- lastSyncedAt: 2026-10-04T22:02:29Z（date 现查原值=10-05 06:02:29+0800）
- 验证席: STE 小柯（m-ste）；零转抄 ✓（复扫量尺+三面 dry-run 均本席独立重跑，COS 读数仅对表）
- 第二方法交叉验证（COS 请领指定形态）：法一=复扫量尺（git grep 四面独立跑）+法二=三面 dry-run 独立重跑（items[].action 权威口径）

## 一、法一：前置断言门复扫（独立量尺，四面全域）

| 断言 | 本席读数（git grep，10-05 06:0x） | COS 卷 | 判 |
| --- | --- | --- | --- |
| A: LG-063 族旧名 `TriCompany-copilot-host-assets` | .claude/agents 0 / .github/agents 0 / .claude/compass 0 / source-agents 0 | 0/0/0/0 | ✓ 同 |
| B: 活护栏句旧形「TriMC 正式宿主切换」 | 四面 0 | 0 | ✓ 同 |
| C: TriMC 裸命中 `TriMC([^M]|$)` | .claude/agents 3 / .github/agents 3 / **compass 1** / source-agents 0 = **7** | 6（两面域尺） | ✓ 兼容（见 §二） |

## 二、断言 C 差 1 勘性（独立复验增值发现，量尺域差非矛盾）

7 命中逐处勘性：business-strategy :33（LG-040 单点护栏·历史来源已退役组件）+:45（【历史】别名条款）+chief-technology-officer :148（LG-040 护栏同句族）×两面投影=6 处=COS 同域读数严合；**+1=.claude/compass/chief-technology-officer.session.md:143**（LG-040 护栏句族投影，带完整历史限定语+「禁现役化表述」正形）——COS TriMC 裸命中量尺域=「TMV 两面」，compass 面在其域外；该 1 处系同句族投影**非回流非活护栏旧形**。**判读：COS「3K+0 残」独立成立；本席全域尺 7 命中全合法历史面，零现役化表述**。

## 三、法二：T5 三面 dry-run 独立重跑（items[].action 权威口径，未信顶层 summary）

| 面 | 本席独立读数（10-05 06:0x，EXIT=0×3） | COS 卷 | 判 |
| --- | --- | --- | --- |
| claude | total 19，derived_identical 19，drift **0**，errors 0，status pass | 19/19/0/0 | ✓ 逐格同 |
| copilot | total 19，derived_identical 13+skipped_identical 6，drift **0**，errors 0，status pass | 19/13+6/0/0 | ✓ 逐格同 |
| claude-session | total 13，derived_identical 13，drift **0**，errors 0，status pass | 13/13/0/0 | ✓ 逐格同 |

- 非绿项明细三面**全空**（error/derived_drift 零条目，逐 items 过滤实证非 summary 转信）。
- 零炉料判读同认：drift 0×3=渲染位已与源侧正名态一致，dry-run 零写入零 commit 本步成立。
- copilot skipped_identical=6 拷贝语义件构成差异同认（非 drift 非错误）。

## 四、16 件 revert 案闭环判读（本席义务面）

- **旧名零回流**：渲染位三面（.claude/agents+.github/agents+.claude/compass）`TriCompany-copilot-host-assets` = **0/0/0**（§一断言 A 即渲染位实扫）+TriMC 裸命中零现役化（§二勘性）——revert 后零回流实证。
- **源↔渲一致**：derived_drift=0×3（§三）=16 件 revert 案的正名态渲染位与源侧完全一致稳定态，无未渲变更无漂移。
- **闭环判读：成立**——LG-060 复验链「旧名零回流」要件两法独立实证，案闭。

## 五、执行过程两笔如实录（工具/路径族，候假读数家族并档）

1. **配方路径身份勘验**：首探以 TriMetaverse cwd 相对路径 `TriCompany/runtime/cognition/...` 报不存在——差点写「COS 引用路径悬空」假阴性；实勘脚本与 manifest 真落点=**sibling 仓 `D:/Code/ai/TriCompany/`**（runtime/cognition/source_publish_check.py+source-agents/registries/trimetaverse-live-agent-publish-manifest.json），COS 卷引用无误，系本席首探 cwd 落点错。manifest_missing_or_invalid 错形（首跑 claude EXIT=1）即 cwd 基准错的直接读数——**身份验证先于缺席断言再实证**。
2. **/tmp 语义分裂**：bash 重定向 /tmp 与 Windows python 路径语义不通（FileNotFoundError 假象）——JSON 解析改 stdin 管道通过；跨工具管道文件交换禁共享 /tmp 字面路径。

## 六、判定

**独立复验 PASS——两法四读数与 COS 值席卷对表全合**：前置断言门绿（3K+0 残全域尺成立）+T5 三面 dry-run drift 0×3 errors 0 逐格吻合+16 件 revert 案闭环判读成立。LG-060 渲染链解冻复验链独立验段毕，候 BOD 采双卷裁 LG-048/051 连带解窗（解窗动作权在 BOD，本席不代裁）。

## 七、使用依据

- COS 请领（m-cos 05:38）+值席卷 cc8e6a59（对表）；CTO 条件卷 bod-pipeline-batch-13 §二（复验链三步义务面）；batch-14 先例卷（本席 10-02 GREEN 形态基）
- 本席实锚：git grep 四面三断言（10-05 06:0x）；/tmp/t5-{claude,copilot,claude-session}.json 三面 dry-run 全输出（items[].action 逐条统计+非绿项明细过滤）；source_publish_check.py L39/L66/L1326（路径解析与身份校验逻辑现读）
- 配方身份实勘：D:/Code/ai/TriCompany/{runtime/cognition/source_publish_check.py, source-agents/registries/trimetaverse-live-agent-publish-manifest.json} 双 ls 实锚
