# 3333 兜底方案 V2·cc-switch 思想吸收重设计（LG-041 ③）

- sourceOfTruth: 本件（V1 bottleneck-architecture-plan.md 自本版起 superseded）
- syncMode: final（CEO 2026-09-24 11:45 三裁落稿；实施归 DE）
- date: 2026-09-24 11:5x CST
- 修订缘由: CEO 三裁——L1/L2 撤销（鸡肋成立，cc-switch 覆盖且更优）；L0 保留并入预设化；按 cc-switch 思想吸收导向重设计
- 思想来源: `TriCompany-host-assets/vendor/reference/cc-switch/README.md`（吸收件）

## 〇、紧要目标（验收总锚）

**3333 挂时，配置恢复一条命令内完成。**

## 一、重设计三原则（cc-switch 思想映射）

### 1. 预设文件化（吸收「预设库」，去库化）

两套 settings 预设为**即在位 JSON 文件（env 子集块形态）**，置于 `~/.claude/settings.presets/`：

- `direct.json` —— 直连 bigmodel 官方端点+known-good model（=V1 L0 known-good 并入，CEO 急救夜手改形固化）
- `relay-3333.json` —— 3333 中转现役形（**部署日 `-CaptureRelay` 自现役 settings.json 收编固化，不预置**——cc-switch「首启收编现役配置」思想；DE 2026-09-24 裁定，CTO 验可：sg 面无 dev 现役 env 凭据可达，预置=编造）

无库无 DB 无服务依赖：预设即真源，任何编辑器/命令可读改；切换=二选一覆写。

**密钥卫生红线（DE 交付审验增设）**：含真钥预设**仅存在于本机部署位**，永不入 git；仓库侧模板=占位符（部署日自本地密钥源注入）。

### 2. 一键化（吸收「一键切换+原子写+备份轮换」）

单命令：`restore-claude-config <direct|relay>`（缺省 `direct`，安全侧默认）。

切换形态（DE 2026-09-24 裁定，CTO 验可——较本稿初版整文件拷贝更优）：**env 子集覆写**——保留现役 settings.json 非 env 键（model/permissions/hooks 等，最小侵入），仅以预设 env 块覆写 env 子集（cc-switch dual-way 同语义；TriModel claude-fallback 同语义）；原子写保持（合并结果 temp+rename，杜绝半写）。

动作序列（脚本内置）：
1. 备份现 `settings.json` → `settings.json.bak-<YYYYMMDD-HHmmss>`（轮换保留近 5 份）；
2. 合并 env 子集 → 临时文件 → rename 为 `settings.json`（原子）；
3. 输出结果行：「已切换至 <X>，备份于 <Y>」。

### 3. 写入通道解单点（吸收「最小侵入」，去服务化）

恢复链全部为**本地磁盘文件操作**：预设文件+脚本零依赖 3333/任何 daemon/网络——断网可演、3333 挂时可用的带外（out-of-band）通道。现役 `settings.json` 永在、只覆盖不删除；弃用脚本不伤现役配置。

## 二、与 watchdog 的关系（纵深防御非重复建设）

TriModel-Watchdog（LG-045 已销，≤5min 自动复活）=第一防线，压低人工触达概率；本方案=watchdog 失效/共因失效（同机断电等）时的**人工最后防线**——紧要目标保证最后防线本身一条命令可用。

## 三、DE 实施任务规格（handoff）

| 项 | 规格 |
| --- | --- |
| 产物 | `scripts/ops/local/restore-claude-config.ps1`（脚本真源化域；TriCompany 源侧+本机部署位）+ `~/.claude/settings.presets/{direct,relay-3333}.json` |
| 预设内容 | direct=bigmodel 官方端点+known-good model（急救夜形）；relay-3333=现役 3333 env 形（DE 自现役 settings.json 提取） |
| 行为 | 参数 direct/relay（缺省 direct）；备份轮换 5；原子写（temp+rename）；完成输出结果行；全程零服务/网络依赖 |
| 验收锚 | ①两预设文件在位且合法 JSON ②direct/relay 双向一条命令切换实证 ③备份轮换实证 ④断网环境演练通过 |
| 边界 | 不装 cc-switch、不建 proxy、不动 3333/watchdog；脚本入真源化域后本机部署位随批登记 |

## 四、V1 处置与裁决留痕

- V1（bottleneck-architecture-plan.md）superseded：L1 独立恢复脚本提案、L2 last-known 自动快照——**撤销不建**（鸡肋成立：cc-switch 思想之原子写+备份+预设文件化覆盖且更优，L2 之 TriModel 改码亦免）；L0 known-good 并入 direct 预设。
- 三裁令链: CEO 2026-09-24 11:45（①修订 ②cc-switch 引入 ③重设计，紧要目标一条命令，截点 18:00）→本稿落定→DE 实施→回 COS 收口→BOD 验收。
