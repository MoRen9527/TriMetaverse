# STE·批 A 改名 playwright 验收卷（charter v2.1 0ea6b42f·交付锚 72d3099）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/trimodel-strategy-revamp-01/ste-batcha-acceptance-20261007.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-07T06:54:49Z（14:54:49+08，date 现查）
- 席位: STE 小柯（m-ste）· 非作者独立验收
- 令源: BOD 批 A 改名验收派工令（14:45，FSD 14:42 毕报+GO-r6 已签+R-HY 上役）
- 两刻制: **开工刻 2026-10-07T06:45:21Z（14:45:21+08）／毕报刻 2026-10-07T06:54:49Z（14:54:49+08，当场现查）**
- 对象: TriModel **72d3099**（批 A 改名 30 ins/30 del 单文件）· R-HY 活体 http://8.155.54.79:3333/ui（.deploy-sha 实锚）+本机 127.0.0.1:3333 对照

## 〇、判读（先答）

**PASS——四锚全绿**，零阻塞项；三异常如实列报（§四，均非阻塞：1 值面回显自领候定性+2 勘验注记）。

| 锚 | 断言 | 读数 | 判 |
|---|---|---|---|
| ① | 双向 grep 用户可见零残留（禁改九处除外） | 策略卡=**0**／连接配置=**9** 恰落禁改九处行号精确一致（560/592/679/764/814/1040/1348/1397/1446）／无法连接配置服务=**9** 同九行双向重合 | **PASS** |
| ① | 新名在场 | 模型策略=25／兜底模型=7；2448 行不变（布局零改动） | **PASS** |
| ② | 导航 label 两处渲染 | 元素级 BUTTON textContent 精确=「模型策略」「兜底模型」；旧名三连（策略卡/连接配置/无法连接配置服务）menu 面 includes 全 false；panel-strategy 页题「☁ 模型策略（本机过渡位实例）」+fb-zone「兜底模型」+§4.3 新副题全文 visible | **PASS** |
| ③ | r5 五件回归全链重放 | 眼睛显隐/认证字段切换/API 格式警示/1M 尾缀/放弃清场 五件全 PASS（§三逐件读数） | **PASS** |
| ④ | 双面部署核 | 本机 200/136424B+R-HY 200/133976B；R-HY 文件面策略卡=0/连接配置=9/无法连接配置服务=9/模型策略=25/兜底模型=7 与本地 72d3099 全同；**.deploy-sha=72d30995494c0876ce3ab34a9e4445049a0bd435 全 sha 一致**；trirmc/trirmc-mc 双 unit active×2 零触碰 | **PASS** |

## 一、锚①双向 grep（本地 TriModel 仓 72d3099 顶）

- `grep -c '策略卡'`=**0**（零残留）；`grep -c '连接配置'`=**9** 行号=560/592/679/764/814/1040/1348/1397/1446——与禁改九处清单**逐一精确一致**；`grep -c '无法连接配置服务'`=**9** 行号=同九行（双向重合：九处禁改全为「无法连接配置服务」动宾报错文案，恰证改名只绕开报错短语）
- 新名在场：模型策略=25／兜底模型=7；`wc -l`=**2448**（行数不变，布局零改动佐证）
- R-HY 文件面（/srv/fleet/TriModel/dist/ui/index.html）三计数同值（§〇锚④）

## 二、锚②导航 label（playwright 快照·R-HY 活体·强刷后）

- 强刷纪律执行：navigate+location.reload 双重（LG-058 缓存假阴性教训族；token 经 localStorage r5 遗留同值 in-place，len64+尾4 a775 与 R-HY api-token.env 双点吻合，零注入需求）
- menu 元素级：两 BUTTON textContent **精确等值**「模型策略」「兜底模型」（非 includes 模糊）
- 旧名三连 menu 面 includes 全 false；menu 全 7 键=[当前生效/TriMLC/TriRLC/TriMMC/TriRMC/模型策略/兜底模型]
- 页题面：panel-strategy h2=「☁ 模型策略（本机过渡位实例） 待应用」（☁ 保留=CPO 授权项在位）；fb-zone h2 visible=「兜底模型 四域各一份保底直配——改完经拉取下发，直接落到该域的落地配置。模型策略管平时怎么用得灵活，…」（§4.3 副题全文照抄核可）
- 结构勘验注记：连接页视图容器=**fb-zone**（非 #page-connect 命名）——早前抓样按 #page-connect 选择器 miss 系命名预期差，非缺陷
- 截图锚：`ste-batcha-connect-fbzone-20261007.png`（兜底模型页+四签）+`ste-batcha-strategy-page-20261007.png`（模型策略页）

## 三、锚③r5 五件回归全链重放（rmc 卡·R-HY 活体）

| # | 件 | 读数 | 判 |
|---|---|---|---|
| 1 | 眼睛显隐 | password「显示」→click→text「隐藏」→click→password「显示」——type/文案双向随切；Key len49 在位（掩码形态） | **PASS** |
| 2 | 认证字段切换→预览键名跟随 | AUTH_TOKEN→API_KEY 切换后配置预览键名同步跟随→restore 回 AUTH_TOKEN（键名面断言） | **PASS** |
| 3 | API 格式警示+零格式键 | 切 openai-chat→warn span（「需本地路由，TriModel 现役仅支持 Anthropic Messages 直连」）hidden=false 显；预览键集=[ANTHROPIC_AUTH_TOKEN,ANTHROPIC_MODEL] **零格式键**；restore anthropic→hidden=true | **PASS** |
| 4 | 1M 尾缀 | 勾（SONNET 行开关）→该行值空→[1m]（CONN_1M_RE=/\[1m\]$/i 挂缀源码 L511-515 实锚）；再点→剥除复原；预览键集 +ANTHROPIC_DEFAULT_SONNET_MODEL 联动→复原；「加剥双向」达成 | **PASS** |
| 5 | 放弃清场 | 制造脏态（BASE_URL=dirty.example.test）→点「放弃改动」→重渲后 BASE_URL=''/MODEL=glm-5.3-flash/KEY len49 全清回 v5 初态零脏残留 | **PASS** |

- formRows=13 对表 r5（row0=BASE_URL/row1=认证键 len49/row2=ANTHROPIC_MODEL=glm-5.3-flash/row3-6=SONNET·OPUS·FABLE·HAIKU 带 1M 开关/row7-12=CLAUDE_CODE_* 六行）——GLM 态（v5 回执 2026-10-07T06:47:23.753Z ok 新拉取轮）如实回读
- 四签正名 r3b 口径保持：M 面 · 服务域/M 面 · 本地域/R 面 · 服务域/R 面 · 本地域 4/4；TriRMC · R-HY 8712 端口对等未破

## 四、异常如实（三笔·均非阻塞）

1. **值面回显（自领即报，候 BOD 定性）**：件②抓样首跑用 preview textContent 全文未脱敏——智谱 Key 全值（尾4 Dmsf 同值）经 transcript 进链一次。归**值面回显家族第四例**（前三例在账：TRIRMC_INTERNAL_TOKEN/channel.cmd 三 token/trimc cron log）；先例形=操作瑕疵非安全事故、不提前轮换自裁，候 BOD。修正已即改：后续抓样全键名面/布尔面/掩码形（件③④⑤读数已用正形）。
2. **L1034 归类勘验注记（FSD 账面）**：「不搬钥匙」活体唯一命中=**SCRIPT 注释块**（`// key 不进策略面（CPO 方稿 2.4：模型策略不搬钥匙…`）——FSD 表 #10 将 L1034 记作「用户可见·密钥提示」，实态系 JS 注释非渲染面。改名本身零残留成立、锚①判定不受影响（锚①判据=旧名零残留）；归类勘误候 FSD 账面追注，同族其 §二 7→9 偏差披露。
3. **重放时序注记两笔**：a) 1M 开关位勘验=开关在 **4 副模型行**（SONNET/OPUS/FABLE/HAIKU），主模型行无开关——r5 卷「模型值尾缀」表述泛指行值非主模型行，行为与 r5 同构（批 A 30 处全文案零逻辑 diff 佐证非回归）；b) 件⑤首读 400ms 系异步重渲未完时窗抓样（读数假阴性），加长等待重读后清场确认 PASS。
4. 附注：R-HY `/healthz` 404（FSD 卷 §四 healthz 读数与 TriModel server 实际路由不符）——活体 /ui 200 已证 serving，非阻塞如实注记。

## 五、质量门禁评估

批 A 改名（charter v2.1 0ea6b42f）四锚全绿：禁改九处零误伤+旧名渲染面零残留+新名双页题+五件交互回归零破+双面部署读数一致（.deploy-sha 全 sha 锚）。判读 **PASS** 呈 BOD——批 A 验收面本席放行意见成立，候 BOD 终判。

## 六、使用依据

- BOD 批 A 改名验收派工令（14:45·四锚+三纪律+死线 16:00）
- charter v2.1 0ea6b42f（任务书终版）+fsd-batcha-closeout-20261007.md（516d93ae·正身卷）+fsd-batcha-construction-map-20261007.md（67d47df8）
- TriModel 72d3099 本地仓 grep/wc 实测+src L510-525 源码实锚；R-HY ssh 文件面（.deploy-sha/dist grep/双 unit is-active）
- playwright 活体读数（navigate+reload 强刷/evaluate 元素级断言/截图两帧）；r5 卷口径=lg058-remediation 树 ste-r5 卷 §1.1/§1.2

## 状态条（M-001）

- date 现查：2026-10-07T06:54:49Z（14:54:49+0800 Wednesday）
- 水位自估：中（批 A 验收毕 PASS 在卷；晚窗缝④ 8713 补测在册 18:57 进场自查）
- 末次活动：2026-10-07T06:54:49Z（落款现查时刻）
