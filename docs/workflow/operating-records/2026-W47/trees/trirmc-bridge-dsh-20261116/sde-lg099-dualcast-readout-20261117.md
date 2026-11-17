# SDE LG-099 双铸件分段毕报（BOD 裁 147·子项 A 分段档+子项 B 全办毕）

- sourceOfTruth: 本卷（LG-099 双铸件分段毕报正身·承拆树任务书正身）
- syncMode: write-time
- 施工席: SDE 小布；令源=BOD 裁 147 子项 A/B 双铸件启动令（LG-099 拆树任务书签批生效 governs）
- 执行窗: 2026-11-17T21:3x-21:4x+08 段（date 现查锚）
- 判定: **子项 B 全办毕实锚（闸双脚本铸+试跑核+双 job HTTP 201 挂+jobCount 对表）·子项 A 分段档（脚本面铸+job 铸/ALLOWLIST 面=dev 触达缺候裁）**

## §一 · 子项 A 分段档（三账对表机械化·M-SG 席组/TriMLC 域）

- **脚本面铸**：三账（台账-树-大表）互查 cron 判读脚本面=可铸（sg 面铸+部署件移交形候裁）
- **受阻面实锚**：8713 面=dev 机 TriMLC 面——**sg 值席面零触达实锚**（ssh config 零 dev host+内网候选 IP 均不通+常见 dev host 零命中——dev 触达面=sg 面缺实锚）
- **受阻分项**：①job 铸面（8713 API 面=dev 触达缺）②ALLOWLIST 精确等值追加面（8713 ALLOWLIST 面=dev 触达缺）③重启激活面=候勘修窗正形链（任务书明文不在本任务书内预执行·维持）
- **候裁面**：a) dev 触达通道面（值席/COS 面 dev 通道知会）b) 分工调形（脚本面铸毕+部署件移交值席 COS/dev 侧执行——照任务书责任席调形候值席/BOD）

## §二 · 子项 B 全办毕实锚（周迁移机械闸·河源侧）

| 铸件 | 落装 | 凭据 |
|---|---|---|
| pre-gate.sh（T-10min 未完树清单闸） | /srv/fleet/trirmc-gate/pre-gate.sh（1351B·fleet 域） | 试跑核=pending_trees=0（现值正形）+卷落 pregate-20261117T133426Z |
| post-gate.sh（T+10min 每树新周目录验证闸） | /srv/fleet/trirmc-gate/post-gate.sh（1351B） | 铸毕（verify 面） |
| **双 job 挂（TriRMC 8710 cron）** | lg099-pre-gate=40 23 * * 0（周日 23:40）+lg099-post-gate=10 0 * * 1（周一 00:10） | **HTTP 201+201** ✓ |
| jobCount 对表 | **6**（4+2 新增）+degraded=False | ✓ |

- 闸面语义：T-10=周日迁移前 10min 未完树清单卷+T+10=迁移毕每树新周目录验证卷——缺失即警报 COS+BOD（自动警报非轮询照任务书）
- TriRMC 面 addJob=零 allowlist 阻（POST 201 直挂实证·TriMLC 面 allowlist 门=8713 面非 TriRMC 面如实注）

## §三 · 护栏遵行

只读观测+告警面（闸脚本=清单/验证卷落+警面零改迁移本体）✓｜零触施工资产/零改任务生命周期语义 ✓｜fresh/容量护栏照 CFO 常态 ✓｜触发面熄火维持 ✓

## 使用依据

BOD 裁 147 双铸件启动令；LG-099 拆树任务书正身-coo-20261117.md（子项 A/B 正形表+BOD 146 径裁注记河源直办链）；闸双脚本铸+试跑+双 job 挂实录=现采实锚。

—— SDE 小布（毕报双通道=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
