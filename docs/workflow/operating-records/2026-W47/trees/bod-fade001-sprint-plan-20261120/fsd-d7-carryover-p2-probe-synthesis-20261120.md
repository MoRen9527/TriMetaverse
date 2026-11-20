# FSD 总成卷·WO-D7-CARRYOVER-P2 段二活体现探（双半边并卷·施工形判读+候裁面五处·P1-P4 完工探针候施工窗）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T00:00:43Z（date 现查粘贴·+8=11-21 00:00:43·D-47 正形·跨日窗如实注）
- 并卷: 本机侧毕报 **575ac8762**（fsd-d7-carryover-p2-local-probe-20261120.md·六项全）+值席毕报 **5c5abee78**（cos-carryover-p2-reading-segment-毕报-20261120.md·sg 四项+加值五件）
- 令面: WO-D7-CARRYOVER-P2-20261120 §五活体现探六项=双半边全毕——**本卷=总成判读+施工形分支候裁面呈统排**
- **next_agent=COO**（候裁五处统排·裁点归 CTO 照派工单§六·STE/CTO 复核位候施工窗毕报）

## 一·六项探针总成读数（双半边合并·零一可省兑现）

| # | 探针 | 本机半边 | sg 半边 | 判 |
|---|---|---|---|---|
| ① | TriModel 部署位 | **零部署形态**（3333 拒连·零启动史·零 git 仓） | **在役**（3333 server.js pid 3347710+3334 proxy pid 3681236·systemd·cwd=/srv/fleet/TriModel·dev@4147bb8 检出） | 分裂形=**sg 集中供给活**·本机零 |
| ② | 两 card 现值 | mlc face=**零文件**（新建形） | mmc face=GLM-only（e-glm-anthropic 单条·default_model=None·strategy 空节·mtime 11-20 11:56 零触实证） | sg card=真回滚锚底档·本机=新建 |
| ③ | deepseek-flash 路由链 | registry 零条目→`Unknown model` throw 必败（client.ts L446-448）+provider 零白名单门+**上游 API 真探在册 ✓**（rc=200 ["deepseek-flash","deepseek-v4-pro"]） | proxy 面 3334 matchModels 有承载（勘定卷 L41）+运行 dist 旧形（PUT hydration 400·源码 4147bb8 有分支=**dist 漂移面**） | **唯一断点=registry 条目**（码面微改候裁）·上游/门面双通 |
| ④ | 兜底常量 | TriMLC `tmv-deepseek-v4-pro`（app.ts:3931+key-cache L378）+TriModel config `tmv-deepseek-v4-pro`/policy `v4-pro` 两形 | TriMMC `v4-pro`（勘定卷 L10 承录） | 四处族谱两形·**零行为差**（card 拉到=不触发）·候 CTO 终审 |
| ⑤ | strategy 面 | policy 额度触发=**MVP 钩子位+空信号（零自动接管实装·恒走常规）** | card strategy=空节（active_strategy_id=None·strategies={}) | **判读结论达 COO：耗尽感知=手动切·「耗尽前切」=本窗正确时机形**·自动形候后续批 |
| ⑥ | 版本对表 | TriMLC dev@8361196·TriMMC dev@e812485（=sg-server/dev 同步）·TriModel 零 git | TriModel dev@**4147bb8**·TriMLC dev@**2bf19193**·TriMMC dev@**e8124857**（**TriMMC 双端全等 ✓**） | TriMLC 双端有差（8361196 vs 2bf19193·漂移如实档候勘）·TriModel sg 独有版本锚 |

## 二·供给链架构现势总定谳（活体+源码双锚）

```
sg 席组 LLM 链: 席位 → TriModel proxy(3334·matchModels) → 上游 provider   ← 主战场
sg TriMMC daemon: key-cache pull 休眠（TRIMODEL_* env 总数=0·激活位=两 env+unit restart=护栏红面）
本机 TriMLC daemon: tier1 断（3333 零 server）·tier2 零缓存·tier3 活链（OPENAI_*=bigmodel GLM）
                   ——零重启约束下 card 链无活形（env 面变更+TriModel 在役化均需重启/新进程）
GLM 额度消耗面: sg 席组（8460 代理族→bigmodel）+两 daemon tier3——切换主战场=sg card+proxy 面
```

- TriMLC model 名消费链（零重启热载关键位）：`cache.defaultModel ?? env.TRIMODEL_DEFAULT_MODEL ?? 'tmv-deepseek-v4-pro'`（app.ts:3931）——**cache=pull 成功后注入**（applyKeyCacheToEnvironment 运行时改 process.env·L463）——tier1 恢复即可热载（但恢复手段本机侧全部触重启红面）；
- **TriMMC daemon pull 休眠=card 更新后亦不拉**（激活位=env 面+unit restart——**触零重启护栏候判面**·值席实锚双源对表）——mmc card 施工的直接受益面=**sg 席位 proxy 链**（TriModel card 面直读形）非 TriMMC daemon pull 面——两链如实区辨；
- **default_model=派生缓存形**（值席源码勘定）：PUT 不接受直改——apply 时自活动策略 default 规则同步（`type=default+entry_id→defaultModel=entry.model`）——**card 更新正形=策略节 default 规则面**（e-deepseek-anthropic entry_id→default）+应用硬门=活动策略须含 ≥1 条 default/time 规则。

## 三·施工形候选（窗内活形排序·候 COO 统排+CTO 裁点）

1. **形 1=sg card 加密直供+策略 default 规则（零重启活形·首选候选）**：值席 key-encryptor dist 模块本域加密（AES-256-GCM 机器指纹 PBKDF2）→api_key_encrypted 直供 PUT（绕旧 dist 明文 hydration 400 面）+策略节 default 规则（e-deepseek-anthropic）→proxy 面/registry 路由 deepseek-flash——**零现役进程重启**·GLM 密文条目天然保留（upsert 语义·回滚锚=值席 /tmp bak 两份+write guard backup-first keep5 双保险）——**registry deepseek-flash 断点独立候裁**（proxy 面直发 deepseek-flash 上游在册真探证·TriMLC client 语境才触 registry 断点）；
2. **形 2=sg TriModel dist rebuild+restart**（源码 4147bb8 与运行 dist 漂移修复·PUT hydration 正形激活）——**触 TriModel server/proxy 双进程 restart（systemd unit）**=护栏字面外第三进程·候裁面（派工单「两 daemon 零重启」语义边界=TriMMC/TriMLC 语境·TriModel server 候裁如实注）；
3. **形 3=TriMLC（本机）侧承接**：零重启约束下 card 链死结（env 面+TriModel 在役化均触红面）——**候窗二批或裁 restart 例外**（TriMLC daemon restart=护栏现役 daemon 零重启直接触·候 COO 显式裁）；
4. **TriMMC daemon pull 激活位**：两 env+unit restart=触护栏——**mmc daemon pull 非席位链必需**（席位走 proxy 直读）——激活与否候裁（非窗内硬项）。

## 四·候裁面五处汇总（达 COO 统排·裁点归 CTO）

| # | 候裁面 | 归口 | 依据 |
|---|---|---|---|
| 1 | registry deepseek-flash 补条目（码面微改）vs 型号名勘正 deepseek-v4-pro（零码面） | CTO（派工单§三.2 承） | 本机毕报§一③ |
| 2 | 兜底常量族谱勘正（四处两形·零行为差） | CTO 终审（§三.3 承） | 本机毕报§一④ |
| 3 | 形 1 加密直供+策略 default 规则形施工授权（零重启活形） | COO 统排+CTO 技术形 | 本卷§三.1 |
| 4 | 形 2 TriModel dist rebuild+restart 例外（护栏第三进程面） | COO 统排（护栏语义裁） | 值席毕报§五.1 |
| 5 | 形 3 TriMLC 本机侧承接时机（窗二批 or restart 例外裁） | COO 统排 | 本卷§二 |

## 五·P1-P4 完工探针候施工窗预告（派工单§六承录）

- **P1** key 指纹：新条目 e-deepseek-anthropic api_key_encrypted sha16 对表（源=.env DEEPSEEK_API_KEY sha16=7c310041469d7d76 加密后指纹对表·零明文）；
- **P2** default_model 值面：card 值+apply 派生值双对表=deepseek-flash（形 1 策略 default 规则面·候裁型号名）；
- **P3** 活体一发真探：sg 席位 proxy 链一发（provider/model 值面回读+rc）——候选端位=TriMLC selfcheck POST /internal/v1/init/selfcheck/run（本机毕报§二勘定）+sg 面真发形候值席协同；
- **P4** 热载刷新读数：**TriMLC 侧=fetchedAt 刷新时戳锚**（pull 恢复前提=形 3 裁后）·sg proxy/card 面热载形=card mtime+proxy 生效读数（ MMC pull 休眠态下 P4 语义=TriModel card 面+proxy 路由生效锚·候 CTO 对 P4 锚形裁注）；
- 完工=P1∧P2∧P3∧P4 四件齐（healthz 零豁免）——毕报→STE 独立复核→CTO 终审→COO 定谳→节 2b-4 续铸令释放。

## 六·异常项与自纠如实档

1. **值面泄漏自纠一笔**（本机毕报§三.1 承录·零落卷零外传·投影正形已改）；
2. **TriModel 本机零 git 仓**（版本锚缺失·git 化候面项）；
3. **TriMLC 双端版本差**（本机 8361196 vs sg 2bf19193·漂移如实档候勘位）；
4. **mc_link=degraded**（8713 healthz 现读·TriMLC↔TriMMC 链路降级态·非本窗域候勘）；
5. .env 畸形行三处（零加载影响·低风险注）；
6. 值席施工尝试两笔零落盘认收（两令并读中途即停恪守✓·/tmp bak 两份回滚锚预备在位）。

## 七·使用依据

- 派工令 WO-D7-CARRYOVER-P2-20261120（§三/§四/§五/§六全条款）+台账 736/737/738/739 承录
- 本机侧毕报 575ac8762（六项全读数+源码实锚族）+值席毕报 5c5abee78（sg 四项+加值五件·经 BOD 回流并卷）
- CTO 勘定卷 6d612b679（§〇-§七·静态面全复验一致零漂移·热载定谳形活体修正两处=本机零部署面+TriMMC pull 休眠面）
- D-15/D-24/D-27 v4/D-39/D-46/D-47/D-76 C 层（窗位归 COO）

---
落卷=FSD 小全（m-fsd）·段二探针总成毕（00:00+8·跨日窗）·**next_agent=COO**（候裁五处统排→施工形定谳→P1-P4 施工窗派令）·GLM 止损线在役承（探针轻量·施工候令零抢跑）
