# 8460 缓解位活体实测·STE 读数卷（回 CTO 汇裁→BOD）

- sourceOfTruth: 本件（STE 执行读数卷；执行规程真源=cto-8460-liveness-probe-sop-20260929.md）
- syncMode: final
- lastSyncedAt: 2026-09-30 03:33 +0800（date 现查，hook 链锚 03:21:26/03:30:27 +0800）
- 令链: BOD 23:36 批明窗即派→COO 03:11 前移（03:30-05:00 自选时点）→STE 照卷执行
- 实测时点: 触发 03:26:52 +08（自选窗前缘早 3 分，如实记）；sg 机=M-SG-47.245.122.61（root SSH 只读+席内一轻量探针，零配置改动）

## 三读数

**R1 · shell 层 env 初筛 = ABSENT（双席验证）**

- 席位进程 `/proc/<pid>/environ` 实读（比 SOP 预设的 REPL echo 更忠实——进程 exec 时刻 env 快照）：m-duty-sde(pid 210215) 与 m-duty-ste(pid 3139246) 均无 `ANTHROPIC_BASE_URL`。
- bonus 机理发现（只记不修）：`/home/fleet/.trimmc/duty-env` 文件含该键（grep 命中 1），但席位 launcher 命令序=`source duty-env && set -a && claude`——`set -a` 在 `source` **之后**，source 期的赋值未 export，故不入进程 env。现势无害（路由由 CLI settings 层承担，见 R2），属潜在配置序脆弱点，候 CTO 裁是否入勘项。

**R2 · 流量对表（决定性）= 增量 +1，200 放行**

- 基线：`wc -l` = **2650**（触发前即时现读；本机侧 03:2x 首勘亦 2650，窗内稳定）。
- 触发：fleet tmux socket（`/tmp/tmux-1001/default`）向 m-duty-ste 窗格 send-keys 一条自标记探针消息（「勿执行任何动作，回复收到即可」）。tmux 三防全程执行：键入后 capture 逐字验证输入框=探针文本独占（原幽灵建议「出状态条」被真实输入顶掉，零拼接）→独立 Enter→对话流增量验证提交（窗格显 Manifesting+esc to interrupt 横幅）。
- 触发后 75s：`wc -l` = **2651**（+1）；tail 命中行=`2026-09-29T19:26:52.899Z POST /api/anthropic/v1/messages?beta=true -> 200`（=+08 03:26:52，恰为探针请求时刻）。席位 9s 完轮（done 3:27 AM）。

**R3 · 失败面补采 = 未触发**（R2 增量>0 且 200，按 SOP 条件不适用）。

## 判定矩阵命中与结论

| R1 | R2 | 实测 |
|---|---|---|
| ABSENT（非矩阵预设的「含8460」/「空直连」双行的精确前提） | **+1 且 200** | 命中判定语义=第 1 行结论 a fortiori |

- **一句话结论：漂移假设推翻——8460 缓解位在路且活体放行 200**。流量证据为决定性面：shell 层虽空，CLI settings 内部注入层（`/proc/environ` exec 快照不可见，SOP 前提节预警命中）承担路由，请求实过 8460 代理。
- 日流量 09-25 起断崖至 4-5 行/日的矛盾**不因配置漂移致**（断崖另因，回查断崖日变更链属 CTO 汇裁域）——「直连成功→1210 指纹拒风险面回归」与「直连被拒→漂移致障升优先级」两分支均不触发。

## 边界遵守

- 全程只读+席内一探针消息；零配置改动；token 值零出机（本探测未触 token 面）；tmux 三防留痕见 N32。

## 使用依据

cto-8460-liveness-probe-sop-20260929.md（2a9b5e94）；CTO 补勘卷 §一.3（575436cd）；/proc/environ exec 快照语义；bash source/set -a 导出序语义；树卷 N32（本树 node-status.jsonl）。
