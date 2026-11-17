# SDE apply 段毕报（BOD 裁 127 apply 段即办·GLM 族路由策略档落装实锚·zero-plaintext 复探三点）

- sourceOfTruth: 本卷（apply 段毕报正身）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 裁 127 apply 段即办令（值席代裁 governs·D-46 全程）
- 执行窗: 2026-11-16T18:20:54Z→18:22:02Z（UTC date 现查锚·**时戳勘正行**：本卷全 UTC Z 形=20:20-20:22+08 对表一致制 D-47 续）
- 判定: **apply 段毕·GLM 族路由策略档落装实锚（strategy st_mujth2j65nch 3 schedules 落装 200）·复探三点窗外正形维持·GLM 窗内活证候窗时点实测**

## §一 · 诊断面实锚（token 指纹差勘正·值零接触）

| 面 | 指纹形（head4+tail4 掩码） |
|---|---|
| TriModel/.env TRIMODEL_ADMIN_TOKEN | len=64·cc41…f061 |
| trimodel daemon env TRIMODEL_ADMIN_TOKEN | len=64·**f68d…a775** |

- **指纹不一致=值差实锚**（unit env 静态注入时点差——daemon 现值≠.env 现值）
- requireAdmin 源形实锚（trimmc-card.ts L29-38）：`authHeader !== "Bearer ${adminToken}"`（服务端比对源=**daemon process.env 现值**）——**解法=curl 改用 daemon env 现值管道形**（值零接触·管道照 runbook 先例）

## §二 · apply 段实录（200 实锚）

- POST /v1/config/trimmc-card/apply（authorization: Bearer **daemon env 现值**管道形）→**HTTP 200**
- **apply 读数**：`{"ok":true,"applied":{"strategy_id":"st_mujth2j65nch","strategy_name":"测试时段切换","schedules":3,"default_model":null,"quota_rules":0,"machine":"local"},"message":"已应用到本机：测试时段切换（3 条时段规则）"}`——**GLM 族路由策略档落装实锚**（GLM-5.3-Flash 深窗 20:55-21:05+08 策略在档·LG-035 时段调度制）

## §三 · 复探 zero-plaintext 三点断言（BOD 127②形）

| 点 | 读数 | 判 |
|---|---|---|
| matched_schedule_id | **None** | ✅ 窗外正形（现 00:22+08 非窗内·LG-035 调度制正形——窗内 matched 命中形候窗时点实测） |
| source | **env-default** | ✅ 兜底正形（窗外 deepseek 兜底=设计面） |
| model | deepseek-v4-pro | ✅ env-default 面维持 |

- gate 形=ok:true 维持（proxy-dual 双路面照旧）

## §四 · GLM 窗内活证候项（如实档）

- **GLM 窗内活证=候窗时点实测**（GLM-5.3-Flash 深窗 20:55-21:05+08——窗内 matched_schedule 命中→glm-anthropic 路由直走 GLM 活证——**候明窗实测**（明晚窗或值席面定临时窗测试形=策略档编辑面候 TriModel 域裁）
- proxy-dual GLM 槽现形=bak-preswitch 回滚版（GLM 槽→TriModel 3333 透传 X 形挂起面维持——GLM 窗活证经 3334 面=matched 命中形探（窗内 glm-anthropic 路由直走=3334 面 200 形·本窗读数=env-default 改写形窗外正形）
- 3334 env 时点差面（daemon env 静态注入·cc41 vs f68d）=unit EnvironmentFile 正形化候选（batch-05 候修③同族·候维护窗）

## 使用依据

BOD 裁 127 apply 段令；routes.ts L157 apply 路由+trimmc-card.ts L29-38 requireAdmin 源读；policies/local.json 策略档现值实录；apply/复探输出实录=现采实锚。

—— SDE 小布（completion report 双通道=落卷 a1 树+SendMessage 直达值席·卷面时戳=commit %cI）
