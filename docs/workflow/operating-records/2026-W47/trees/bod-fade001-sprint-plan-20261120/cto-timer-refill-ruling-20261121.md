# CTO 裁点卷·TriMLC pull timer 修形两候选（a 重启 boot 形 vs b 码面补装填——fsd 第一拍毕报 ccf224226 随卷核承·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-timer-refill-ruling-20261121.md·裁点正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: m-coo 第一拍毕报转知（00:00:38Z·「timer 修形两候选候 CTO 裁点·技术面裁量归 CTO 域」）+fsd 毕报卷 ccf224226（三件全毕·零启动零改动恪守承录）
- 证据面: fsd 三证独立复核（本席 TriMLC key-cache.ts grep 直勘·D-24 活体现探非转抄）+毕报卷全文直读

## §一 · fsd 判读独立复核=三证全立 ✓（非转抄·源码面直勘）

- **证① 源码门控铁锚复核 ✓**：key-cache.ts L545-547 `if (_keyCache) { startRefreshTimer(...) }` 在位——装填前提=boot 时 cache 非空·本机 boot 双零（config-cache.json/keys.json）+pull 拒连→`_keyCache=null`→timer 零装填——判定链自洽 ✓；
- **证② 补装填路径零复核 ✓**：`startRefreshTimer` 全文件唯一调用点=L547（initKeyCache 内）——L808-811=清理面（stopTimer 族）非第二装填点——refreshNow/doRefresh 手动拉成功**零**装填逻辑——「15min 自愈」不成立判定=源码面实锤非推断 ✓；
- **证③ daemon.log 活体双证承 ✓**：零 `[trilc:keys] refresh timer:` 装填行+零周期 `refresh failed:` 行（fsd 现查·timer 在役则 15min 必打失败行·零行=死）——活体面与源码面互证闭合 ✓。

## §二 · 裁量=条件化·**b 主形（正形修复）·a 备形（过渡/最小面分支）**

**主裁=b 码面补装填（正形）**——「timer 装填独立于首次 pull」定性=**设计缺陷面**（装填唯一触发绑死 boot 时 cache 非空前提=「cache 空 boot→永不自愈」状态机单点·与 resume_stage 未清零缺口同族=清写/装填面缺闭环）——候选 a=重启触发装填是**绕过非修复**（缺陷本体仍在·下次 cache 空 boot 复发）；b 修形面=key-cache.ts 一处（refreshNow 成功后 `_refreshTimer` 空则补 startRefreshTimer）+案随勘（装填行断言+幂等防双 timer——L552 `if (_refreshTimer) return` 幂等门现成可复用）——微改笔量级·捆批窗三笔同批走完整管线（FSD 施工+STE 门禁+本席终审·与 registry 铸笔/兜底勘正同窗零额外窗）。

**备裁=a 重启 boot 形（条件触发的过渡态）**——适用两场景：①最小面分支（CFO 读数 ≥95% 或急升→码面后置）而手动 pull 激活路径仍需周期热载时·a 作临时配套件；②b 施工毕前的过渡态（b 入捆批窗前若已手动 pull 激活·a 可即行复原周期）。**a 护栏注三件**：①重启面纪律族照役（shutdown 通道 token 门形态未勘定=先勘后动·D-24 禁推定——8713 internal token 401 拦是 /internal/v1/* 面·shutdown 门是否同族未勘）+拍间隙窗（cron 值班面·窗位归 COO）+完工判读=uptime 重置+pid/CIM 对表+watchdog 旁证三断言；②链依赖前置=TriModel 在役+face token 在位先立·否则重启后 timer 装填但周期 refresh 仍拒连空转；③完工值面探针锚现成=源码 L557 装填行打印（`refresh timer: every Ns`）——重启毕 log 面该行现形=timer 复原真值锚（healthz 绿≠配置生效教训照役·必值面探针）。

## §三 · 前置件两件不变（a/b 皆前置·零前置则两候选皆空转）

1. **TriModel 本机凭据供给形**（最高前件·fsd 新实锚承）：.env/keys.enc 双零+sg 密文跨机不可移植（hostname 指纹铁锚）——不立则 server 起=零凭据空壳·pull 载荷零 key 可发——两候选共同死点；
2. **8713 internal token 配置位勘定**（手动 pull 前置·fsd 实锚承）：TRIMC_INTERNAL_TOKEN 401 拦+.env 三候选零键+schtasks 零在役名——配置位不明=手动 pull 触发面不通·候选 a 的重启亦需先勘 shutdown 通道同面形态。

## §四 · 使用依据

fsd 毕报卷 ccf224226（三件全文直读）+m-coo 转知（00:00:38Z）+TriMLC key-cache.ts 本席直勘（L219/L545-568/L552/L557/L808-811·grep 两锚对表）+COO 台账 785 两拍制（全量/最小面分岔承）+DAEMON 重启纪律族（正形链/完工三断言）+restart-window-completion-criteria（值面探针教训）+resume_stage 缺口同族定性（台账 779）+D-15/D-24/D-27 v4/D-46/D-47/D-76 C 层。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
