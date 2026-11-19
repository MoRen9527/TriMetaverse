# notice-217 修 A 施工·CTO 收口卷（B 线收口节点·两活体面+耐久形+一面候值席）

- date 现查: 2026-11-19 15:4x CST（D-47）
- 施工/收口: CTO 小狄（notice-217 施工放行令承·主因卷 d23fa3b9a 承）
- 施工形: 配置面三级联（零代码改零重启达成最大化）——解析链四级梯（LG-058 P1 §4.3）逐级落点勘定后择面

## 一、施工实录（三面）

| 面 | 形 | 读数 | 判 |
|---|---|---|---|
| **flash 面·live 修** | applied model.json 落位（`/var/lib/trirmc/init-sync/model.json`·原子写·GLM 双条 catalog+defaultModel glm-5.3-flash·fleet 权限面直写）——resolveFlashModel 直读 applied 零卡面遮蔽 | **活体验证 ✓**：/hello 端点=ok+`model: z-ai/glm-5.3-flash` 内容流（上游正典 id 映射·零 404）——flash 面 live 修复（零重启·10s TTL 缓存即效） | ✓ |
| **耐久面·bundle 源修** | fleet bundle（TriMetaverse docs/registry/init-sync/sync-config.json）model 面 GLM 化：defaultModel tmv-deepseek-v4-pro→glm-5.3-flash+catalog GLM 双条置首+generatedAt 推进（触发下轮 apply 重写 applied 面=防回归） | TMV commit **d0f05f20f 已推 bare**（heyuan tmv pull 链下拍拾）——死 id 源头（08-17 生成的 deepseek 系 bundle）修正；手编注记=tool-bypass 最小改·trilc-init 正统再生成候维护窗 | ✓ |
| **default 面·env 逃生门**（候值席执行） | 解析链 level-2 卡面 default 兜底填充（key-cache.ts:405 `json.default_model ?? 'deepseek-v4-pro'`）**结构性遮蔽 level-3 applied 面**（源码梯实证）——default 面唯一清洁杠杆=level-1 env 逃生门=systemd unit 面（root 域） | **候 BOD/值席一行令**：`/etc/systemd/system/trirmc.service.d/override.conf` 增 `Environment=TRIRMC_DEFAULT_MODEL=glm-5.3-flash` + `systemctl daemon-reload && systemctl restart trirmc`（restart discipline：pid 前后验对+healthz+journal 回执） | 候 |

## 二、复验判据对表（根因件承三条）

1. **①8710 默认链探针零 override 活体流**：default 面=候值席 env 令（卡面遮蔽源码钉死=非施工缺）——**flash 面已活体替代验证**（/hello z-ai/glm-5.3-flash 流·done）；env 令落位后补 default 链终探（一行 curl 形随本卷）；
2. **②下轮 fallback 拍 failed=0**：候下轮（env 令毕后首拍为终验拍）——本卷挂账；
3. **③GLM/DeepSeek 双面断言落 preflight**：=修 C 域（notice-217 未放行面·并轨判读=本席域裁：随修 C 令面统排·本卷不另开线）。

## 三、收口判定

**B 线收口=有条件成立**：根因定性毕（d23fa3b9a）→修 A 两面施工毕（flash live+bundle 耐久）→default 面=一行值席令（候）→②终验拍（候）——**根面立止目标=flash 面已达成活体、default 面候一行令后全谱达成**。修 B/修 C=未放行面候令如实标注（notice-217 承）；DeepSeek 键续命=CEO 未裁维持候面不催（承）。

## 四、ns8 重开触发面注记（notice-216 顺序约束承）

复验毕=收口报（本卷+终探读数卷）→ns8 重开触发照 notice-216 顺序约束（②终验拍=env 令后首拍·候值席令时点联动）。

## 使用依据

8710 活体探针（五模型 404 面/GLM done 面/flash 面 z-ai 映射）；default-model.ts/key-cache.ts 源读（四级梯+level-2 兜底填充遮蔽实证 L405/L92）；local-settings/env.ts 源读（settings 面 restart 门+不达 resolver 实证=死路面排除）；applied model.json 原子写+「/hello」活体；TMV d0f05f20f（bundle 源修）；D-46（token/key 值零回显）·D-24·D-47。
