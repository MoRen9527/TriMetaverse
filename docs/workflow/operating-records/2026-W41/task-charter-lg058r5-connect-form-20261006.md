# 任务书 · LG-058 九条③ r5 连接配置表单增补（cc-switch 对齐）

- sourceOfTruth: 本件（任务书正身；CEO 2026-10-06 23:31 深验打回令+23:41 批令「范围认，API格式裁A，派工」）
- syncMode: static
- lastSyncedAt: 2026-10-06T23:42+0800（date 现查 23:41:08）
- 立书位: 董事会 BOD（方案四件已呈批——三缺口功课+全件对表+候裁两点，CEO 23:41 裁毕）
- 受理依据: CEO 23:31 深验打回（API Key 无填写位置，高级选项中 API 格式/认证字段皆无；附 cc.png 实图）+23:41 批令
- face 路由: 施工=FSD（SendMessage 直派）；部署=升版流水线；验证=BOD 独立复验→呈 CEO 深验
- 前轮: r4（23:14 部署 75986ad）表单化壳已立，本件=其上增量

## 背景与功课实锚

cc-switch（farion1231/cc-switch）官方用户手册 2.1 添加供应商章（GitHub docs/user-manual/zh）三件功能设计：

1. **API Key**：主平铺输入框+显隐眼睛钮；值落**所选认证字段**环境变量键。
2. **认证字段**：下拉 `ANTHROPIC_AUTH_TOKEN`（默认）／`ANTHROPIC_API_KEY`；手册原文 AUTH_TOKEN=「替代 API_KEY 的认证方式」。CEO 本机 settings.json 两键同值并存即此形态。
3. **API 格式**（手册名「上游格式」）四选项：Anthropic Messages（原生）默认直连／OpenAI Chat Completions（需开启路由）／OpenAI Responses API（需开启路由）／Gemini Native generateContent（需开启路由）；非默认时高级选项自动展开+「需要路由」徽章。

## 施工件（每域卡同构 ×4：cd-mmc/cd-mlc/cd-rmc/cd-rlc）

1. **API Key 输入框**：password 型+显隐眼睛切换钮；主平铺位，紧跟请求地址；说明文注明落所选认证字段键。
2. **认证字段下拉**：ANTHROPIC_AUTH_TOKEN（默认）／ANTHROPIC_API_KEY；说明文「选择接入密钥的环境变量名」。
3. **API 格式下拉**：四选项与 cc-switch 全同（文案照录手册）。**CEO 裁 A**：选非原生出警示「需本地路由，TriModel 现役仅支持 Anthropic Messages 直连」，**保存时格式不落盘**（不进 settings.json 投影与预览 JSON）。
4. **模型映射表增「1M」列开关**：行级开关，开启→该行实际请求模型值尾缀 `[1m]`（依据：Claude Code 客户端 1M 开关语义，发请求前剥除；记忆条 claude-code-model-env-semantics）。
5. **配置预览联动增补**：API Key 值落所选认证字段键（默认 ANTHROPIC_AUTH_TOKEN）；1M 开关联动尾缀实时出预览；API 格式不出现于预览（裁 A）。

## 验收锚（BOD 复验逐条）——**2026-10-07 00:2x BOD playwright 独立复验七锚全 PASS**

- [x] 四域卡同构五件全渲染（textContent 逐卡断言，防折叠态 innerText 假象）——四卡 10/10 全绿（Key 行/认证字段双键/API 格式四选项/警示/1M 列/请求地址/主模型/预览/password 框/眼睛钮 data-cd-eye）
- [x] API Key 显隐眼睛切换可用——password↔text+钮文「显示↔隐藏」双态还原（mmc 卡实测）
- [x] 认证字段切换→预览 JSON 键名跟随（AUTH_TOKEN↔API_KEY）——假 Key（sk-test 形）默认落 AUTH_TOKEN，切 API_KEY 后旧键消失值随迁
- [x] API 格式选非原生→警示文案现；保存后配置无格式键（裁 A 断言）——「需本地路由」警示现+预览零 apiFormat 键
- [x] 1M 开关→预览对应模型值尾缀 [1m]；关闭→尾缀移除——映射表四行 checkbox×4，勾选预览即出 [1m]
- [x] 保存/放弃双钮行为不回退（放弃清场含新五件）——放弃后 Key 清空/格式回原生/预览归 {}（首读 HAS-VALUE 假象=400ms 异步重渲窗时序，细判终态正形，与 r4 innerText 假象同族记录）
- [x] Stage2 部署绿+环C 探针绿——两刻 16:14:00Z/16:16:22Z（GO 起 8 分钟）；环C 六项两遍全绿；本机+R-HY 3333 双面 200+r5 特征 10 处命中；FSD 17 锚全 PASS

**复验附注**：假 Key 纪律全守（sk-test-bod-verify-000，真值零进链）；部署期双实例幂等重放勘误（GO 停等窗 120s 内自挂快于首实例超时→同包二次部署 5s 闪断）已如实入 FSD 执行卷，终态正确；BOD 先头 vitest 误跑（node:test 基座）自纠无欺。截图锚=lg058r5-connect-form-verify.png。

## 边界与纪律

- 不入件（本批明确不做）：预设库/端点测速/获取模型/自定义 UA/本地代理请求覆盖/获取 Key 跳转/完整 URL 模式——候办 P2 另立。
- 密钥明文落 settings.json 投影（对齐 cc-switch+CEO 本机形态）；预览明文形态与 cc-switch 同。
- **复验与联调用假 Key（sk-test 形），真值禁进会话链**；零敏感值出机。
- 升版走既有流水线全链（Stage1 sg 构建→传输腿 sha256→环A 备份锚→硬门①报备→GO→Stage2→环C 探针→毕报两刻制），禁手动逐跳；HOLD exit 42 设计内。
- UI 交付渲染验证门（LG-035 教训族）：非作者走查+BOD playwright 独立复验+浏览器强刷防缓存假阴性。

## 收口链

FSD 施工完→报备 BOD→GO-r5 硬门（BOD 复核签发）→Stage2→BOD 独立复验→呈 CEO 深验（九条第 3 项重开）。
