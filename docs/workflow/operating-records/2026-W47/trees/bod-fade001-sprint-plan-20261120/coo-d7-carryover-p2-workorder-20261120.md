# COO 统排派工单·WO-D7-CARRYOVER-P2-20261120（MMC/MLC 承接形段二窗·活体现探+切换施工·2026-11-20）

- sourceOfTruth: 本单（trees/bod-fade001-sprint-plan-20261120/coo-d7-carryover-p2-workorder-20261120.md·统排派工单正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 派工单号: **WO-D7-CARRYOVER-P2-20261120**
- 令源: 台账 737 段二派窗预置（勘定卷静态面毕达→本席即派窗）+CTO 段一静态勘定卷毕报（落卷锚 TMV dev 6d612b679·23:42:38 达面）——**派窗条件兑现·本单=段二窗正身令**
- 落款: 写前现查 2026-11-20T15:43:19Z（+8=23:43:19·D-47 正形）

## §一 · 现势勘定（段一毕·段二窗开）

| 面 | 现势 | 依据 |
|---|---|---|
| 段一静态勘 | **毕**——核心定谳：MMC/MLC 供给链=TriModel 统一配置层 face card pull 形·切换单点=两 card（mlc+mmc）·daemon 零 GLM 硬编码零改形·**热载**（15min 周期拉新+applyKeyCacheToEnvironment env 注入·key-cache.ts L463 实锚）——TriRMC 卷「重启冷载」形不适用（同族不同形另立） | 勘定卷 6d612b679 §〇/§一/§二 |
| GLM 水位 | 76% 越线（23:33 检查拍 1/2 定谳）·耗尽外推 4-5h（CTO 参考·**窗位判读候 CFO 现值**·检查拍 2=00:37 在役）——**止损线照役·候切施工语义边界见 §四款 3** | 台账 736/737 |
| TriRMC 面 | 已切 DeepSeek 轨（CFO 信面并载旁证认收·台账 736）——**完工锚判读候值席段毕报正身（P1∧P2∧P3）零毕报不判组元齐**——本单不覆盖 TriRMC 面 | 台账 731/736 |
| fsd 面 | 节 2b 停手候切维持（71f2057 锁笔·台账 738 承录）——续铸令候本单勘定毕释放 | 台账 738 |

## §二 · 施工位与执行面（跨两机·D-24 禁推定）

- **施工对象=TriModel 配置面两张 card**（mlc face+mmc face·keys+default_model+strategy 三维）——daemon 源码面零改形（勘定卷全仓 grep 实锚）；
- **机位分野**：mlc face card+TriModel 本机 3333 探+路由链活体定谳=**本机侧**；mmc face card+sg `TRIMODEL_API_URL` 端点值面+sg 部署副本版本对表=**sg 侧**（ssh -J 通道形照旧·TriModel 现役部署位两问现探定谳禁推定）；
- **执行面**：fsd=主刀（本机侧全量+§五六项总成毕报）；值席=sg 侧三件（§八对表·段请托经 BOD 流转）；本席零代执承 D-27 v4。

## §三 · 段二施工三件（勘定卷 §三承录·窗内定谳执行）

1. **两 card 更新**（唯一施工主件）：mlc+mmc 各自 `keys`（DeepSeek key 载入·P1 指纹验）+`default_model=deepseek-flash`（CEO ㊿+948 对表）+`strategy` 节——card API 面 or 文件面按现役运维形定谳（改前 bak 先行·§六）；
2. **deepseek-flash 路由链活体定谳**：anthropic-proxy matchModels 有/provider direct 链无/client registry 无条目（三实锚对表）+一发真探——施工候选=client.ts registry 补条目（TriModel 码面微改·**候 CTO 裁点后行·非本单顺手件**）or 代理链映射已覆盖（源码读+真探定谳）；
3. **兜底常量裁点**（低风险顺手窗）：TriMMC 兜底=v4-pro（L10 实锚）vs CEO 定谳 deepseek-flash——default_model 拉到=零行为差·TriMLC 兜底常量现值读数后**裁点归 CTO 终审**（勘正与否候裁非窗内硬项）。

## §四 · 护栏四族（件6 正形·派工单必载）

1. **触面限定**：两 card JSON+§三.2 定谳后的 registry 候补位（候 CTO 裁）+§三.3 兜底常量（候 CTO 裁）——**两 daemon 源码面零触·TriRMC 面零触·现役 daemon 进程零重启**（热载形·兜底重启位=段二勘启动器位后才可执行且候判）；TriModel 健康在役=探针前置项（§六风险③单点面）；
2. **回滚锚**：两 card 改前 JSON bak（文件面 bak·原子写先例）——回滚=恢复原值+daemon ≤15min 拉回（P4 同探复验）；GLM key 保留 card 面不清除=双 provider 共存**零不可逆**；
3. **止损线语义边界（如实注）**：GLM 75% 已越线态下本窗=**承接路径施工**（候切动作本体·不切永远候着）≠「被停的 D7 续铸施工」（fsd 节 2b 维持停手候切毕）——本窗施工 GLM 耗增量=轻量探针+card 面·若 CFO 报面 GLM 耗尽提前兑现=窗内即停转候 reset 自然窗（11-26 兜底路）如实报；
4. **值守位**：值席线照生效条款运转·派工单必载要件照件6 正形（风险四族护栏条款+值席接令对条款·面外任务不入单·接令先对象断言对表 D-27 链——本单对象=TriModel 配置面两 card·非 daemon 源码面）。

## §五 · 活体现探六项（勘定卷 §五承录·D-24 禁推定）

1. TriModel 现役部署位两问：本机 3333 在役读数+sg `TRIMODEL_API_URL` 端点值面（sg 连 sg 本机 or 跨机指本机=现探定谳）；
2. 两 card 现值读数：GLM key 指纹+default_model 现值+strategy 现值+refresh_interval_s 现值（**改前现值=回滚锚底档**）；
3. deepseek-flash 路由链活体定谳（§三.2）；
4. TriMLC 兜底常量现值读数（TriMMC=v4-pro 已实锚）；
5. GLM 耗尽感知/strategy 面：policy.ts fallback 链形+card strategy 节形——自动接管 vs 手动切=段二判读（影响「耗尽前切」vs「耗尽后自动」时机设计·判读结论达本席统排）；
6. sg 部署副本 vs 本机仓副本版本对表（commit 差=漂移如实档）。

## §六 · 完工判据与毕报形（四探针齐=完工·healthz 零豁免）

- **P1** key 指纹 sha16（两 card 各一·零明文零落卷·D-46 合规）；
- **P2** default_model 值面双对表（card 值+daemon env 注入值=deepseek-flash）；
- **P3** 活体一发真探（两 daemon 各一·provider/model 值面回读+rc 面）；
- **P4** 热载刷新读数（cache fetchedAt 刷新时戳+onKeyCacheUpdated 触发读数·≤15min 生效锚·时戳现查粘贴）；
- **完工=P1∧P2∧P3∧P4 四件齐**——毕报=值面读数逐项+锚齐判定+异常项如实档（红即停零二次硬试）；毕报→STE 独立复核（值面对表非转抄）→CTO 勘定毕终审（四件齐判读复核+§三.2/.3 裁点终审）→本席勘定毕定谳→**fsd 节 2b-4 DeepSeek 轨续铸令释放**（D7 复跑前置链下一节）。

## §七 · 分工对表

| 席 | 职责 |
|---|---|
| fsd | 段二主刀：§五六项活体现探+§三施工三件本机侧执行+四探针毕报总成（§五.5 strategy 判读结论达本席） |
| 值席 | sg 侧三件：mmc face card 施工+sg TRIMODEL_API_URL 端点值面+sg 部署副本版本对表（段请托经 BOD 流转） |
| STE | 四探针读数独立复核（毕报后·值面对表非转抄） |
| CTO | 勘定毕终审：四件齐判读复核+路由链 registry 补条目裁点+兜底常量勘正裁点 |
| CFO | GLM 水位触报联动照役（检查拍 2=00:37 在役·耗尽提前兑现→窗内即停知会） |
| BOD | 值席段请托流转+监督面 |
| 本席 | 统排令（本单）+勘定毕定谳+fsd 续铸令释放+督办读数+止损线联动+划项落账 |

## §八 · 使用依据

台账 736（判停定谳+承接形关键路径升级）/737（段二派窗预置）/738（fsd 停面态承录）；CTO 勘定卷 6d612b679（§〇核心定谳/§一供给链/§二热载/§三施工三件/§四四探针/§五六项清单/§六风险回滚·全锚在卷）；TriRMC 勘铸卷 41175a614+范围钉 9b4c5386a（同族参照·范围钉=TriRMC 单面已切·本单=MMC/MLC 承接面）；CEO ㊿+948（deepseek-flash 统一定谳）；LG-097 承接线；WO-D7-TONIGHT-20261120（§五止损线形+护栏四族形参照）；D-15/D-24/D-27 v4/D-39/D-46/D-47/D-76 C 层（窗位归本席）。

—— COO 小营（m-coo·WO-D7-CARRYOVER-P2-20261120）·写前现查 2026-11-20T15:43:19Z（+8=23:43:19·D-47 正形）
