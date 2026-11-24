**节拍（daemon 版）2026-11-24 17:07:05**

**⓪ 全席现态**：**非空闲·4 席在干活**——**sg duty 组（重点）**：m-duty-cao=候令·m-duty-cfo=候令·m-duty-cho=候令·m-duty-cmo=候令·m-duty-coo=候令·m-duty-cos=候令·m-duty-cpo=候令·m-duty-cso=候令·m-duty-cto=候令·m-duty-fsd=候令·m-duty-pm=候令·m-duty-rdt=候令·m-duty-sde=候令·m-duty-ste=候令；本地在干活：m-cto、m-cao、m-cos、m-fsd（附注）

**① 双树**：sg 试水树=done 收口（认账毕）；LG-066=已销账（10-13 03:28 COS 终验·台账 closed·大表销态）
**② 四口**：8713 TriMLC ok=true uptime_s=286414 notifyFailures=37 pwr=100% ac=true gate=none
　　8711 TriRLC（本机·R面本地域）：ok=true uptime_h=307 cron=1 mc_link=connected follow=following/none lastPoll=2026-11-24T09:06:25.029Z gateSeen=none pollFail=0
　　河源 TriRMC（服务域）：trirmc:active
**③ MMC**：8712{"ok":true,"service":"trimc","cron":{"enabled":true,"jobCount":0,"degraded":false,"consecutiveFailures":0}} | logs 最新=12:05:00 (sg now=17:07:03)
**④ 大表**：total=24 open=4
**⑤ 卡什么**：（daemon 版无信件面，事件面以拍报差异与本机席转录为准）

**⑥ 席面（BOD 填·阶段一·17:24）**：数据源=commit「@m-xxx」标记法——**局限如实注**：未带标记的 commit 不计（SDE/FSD 今日实际在干活〔P0 修复 57393fa/423987c〕但 message 无标记→显示 316min 失真；cso/cmo 无标记载≠断档）。
- m-cos 19min｜m-coo 402min｜m-cao 20min｜m-cpo 32min｜m-cto 17min｜m-cho 28min｜m-cfo 847min｜m-sde 316min*｜m-fsd 316min*｜m-pm 15647min｜m-ste 4625min｜m-rdt 1253min｜m-cso 无标记载｜m-cmo 无标记载（*标记缺失失真）
- **在途=是 的席：无**（当前零进程）→按三层判据无档可判（静默不报）。
- **阶段一缺口报 CAO**：①commit 标记法不可靠（建议改席台账 mtime/专用心跳文件）②daemon 每 30min 重写 tick-latest——本段可能被下一拍覆盖（需机制位或独立文件载体）。
