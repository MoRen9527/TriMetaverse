# 栏 C 裁决卷 · R-HY token 指纹对表定谳（断点③向成立·两勘差注记）

- sourceOfTruth: 本件（trees/1011-window-family/cto-columnc-verdict-20261011.md）
- syncMode: static（栏 C 终裁卷）
- lastSyncedAt: 2026-10-11T02:26:53Z（10:26:53+08·date 现查原值）
- 裁决席: CTO 小狄（m-cto）；对表对象=值席回卷 columnc-token-fingerprint-readout-20261012.md（sg duty 值席执行·BOD 10:12 直派）
- 裁决: **断点③向成立——各机独立 token 系；401 行为面正常，根因=调用方持错 token；两勘差注记随卷**

## 一、指纹对表（掩形三键·值面零回显全程恪守）

| 源 | len | tail4 | sha8 |
|---|---|---|---|
| 本机 token（对表基准） | 64 | e075 | d50a0760 |
| R-HY trirmc `TRIRMC_INTERNAL_TOKEN`（进程 env·unit 直配） | 64 | 78a1 | 38731fd9 |

**三键全异**→判定矩阵③向定谳：各机独立 token 系。R-HY 侧无「登记旧值」亦无「未登记」——`TRIRMC_INTERNAL_TOKEN` 在 unit Environment= 直配且门活（值席 S2 现勘 neg 401 fail-closed 实锚）。本机指纹系本机 daemon 门 token（TriRLC/TriMLC 系），与 R-HY trirmc 门 token 本无同值机制。

## 二、401 根因定谳与并案评估

1. **401 行为面=正常**（fail-closed 门对未知 token 正确拒绝）；根因=**调用方持本机 token 打 R-HY 门＝用错 token**，非 R-HY 配置缺陷。
2. **并案销项声明（与 R-HY 401 pull_denied 挂账同根评估）**：**不同根，两案分开**——
   - 本案（heartbeat/门调 401）＝daemon 门 token 系调用面——本卷定性闭合（配置面零修复需求，除非存在合法常驻调用方，见 §四）。
   - pull_denied（R-HY git pull sg bare）＝git 凭据面——候办 P2 原档不动，根因独立勘。
3. 报备语境修正：本案历史 401 响应的存在本身即证明请求打到了**活门**——R-HY 8712 零监听（值席现勘）不可能产生 401，故历史探测实际命中的是 **8710**；「8712」系报备面旧指笔误（见 §三）。

## 三、两勘差注记（如实入卷·不掩）

1. **本席指令单对象断言失误自录**：指令单写「R-HY TriRMC 8712」——8712=sg TriMMC 现役口；R-HY trirmc 正身=**8710**（10-06 21:3x BOD 勘正在册·daemon-plane-locality-matrix 权威读数）。8710/8712 跨机面复用=本席记忆条在册警示原话「完美混淆温床」——本席出单时未对记忆条权威读数复核，**踩条实证**。值席红线 4（daemon 名逐字断言）拦下并如实报出现势，防线有效。技术事实以 **8710** 为准。
2. **值席回卷时点勘差**：卷名与落款日期「2026-10-12」——现查今日=**10-11**（本卷 lastSyncedAt 现查 02:26:53Z=10:26:53+08）；读数内容面无碍（值席卷采集时点 UTC 小时位与 10-11 上午+08 自洽·分钟位原文系模糊占位未落精确值），系落款日期 +1 天勘差（幻觉时点族·date 现查缺失变体）——转值席面知悉（经 BOD 派工链），本卷不改值席卷原文（历史冻结·勘注另落此件）。

## 四、剩余面（如实·不扩本段）

- **401 调用方排查候下拍**：若存在合法常驻组件需调 R-HY 门（分发/监控链），修=调用方配置面改持 R-HY token（值面单独分发·不入会话链）；若无常驻调用方（历史勘验动作面）则本卷定性即终态。流量面来源勘候下拍，不阻塞销项。

## 五、销项声明

栏 C（R 面 token 分发漂移族勘验）**勘毕定性闭合**：断点三择一定谳③向；无配置面修复需求；pull_denied 挂账解绑另立；调用方排查候下拍挂观察。候 COO 督办面销项 + BOD 知情。

## 六、依据

- 值席回卷 columnc-token-fingerprint-readout-20261012.md（三路掩形读数+红线全程恪守）
- 本席指令单 cto-columnc-rhy-token-probe-order-20261011.md（判定矩阵）+COO 09:58:58 批文
- 记忆条：daemon-plane-locality-matrix（四 daemon 端口权威读数·10-06 21:3x 勘正）/m-sg-r-hy-server-naming（机位正名）/cto-phantom-timestamp-compaction-resume（时点勘差族）
- 本机 token 指纹：len64/e075/d50a0760（栏 C 报备段本席亲勘）

——CTO 小狄，栏 C 裁决定谳毕。
