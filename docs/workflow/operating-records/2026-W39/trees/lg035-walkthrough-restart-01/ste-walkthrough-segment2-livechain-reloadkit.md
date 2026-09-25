# STE 走查门段·段二：首启链 GET-only 活体验证 + reload 全周期检具（TASK-LG035-WALKTHROUGH-RESTART-01）

- sourceOfTruth: 本件（段二正身；读数全部自产，全程 GET/文件只读，零写触活体）
- syncMode: segment
- lastSyncedAt: 2026-09-25T12:11:30Z（北京 20:11，date 现查）
- 执行席: STE 小柯（m-ste）；活体: `http://127.0.0.1:3333`（PID 16248，19:3x 健康基线承继）

## 测试判断

首启链四层（连接→卡/策略→政策→生效值）**GET-only 全链验证 PASS**，窗命中语义正确；两 readiness 发现（徽标态漂移 + local_apply 门控关闭）均为非阻塞、后者影响 CEO 窗 I8 步骤走法（两分支处置见段三）。reload 全周期（第四型盲区）自动化件 E10 存在但 env-gate 未跑且断言对象已随 v4 退役——真人全周期检具做成 CEO 窗清单（段三），本件给检具设计依据。

## 一、首启链活体读数（2026-09-25T12:10Z ≈ 北京 20:10，curl GET 原样）

| 层 | 探针 | 读数 | 判定 |
| --- | --- | --- | --- |
| ① 连接 | `GET /ui` | 200，67,519B，0.0084s | ✓ 服务面健康 |
| ① 域信息 | `GET /v1/config/runtime-info`（无鉴权） | `domain_label=本地域（TriMLC/TriRLC）`，`local_apply_enabled=false`，`machine=TABLET-0BGCRCP5` | ✓ 域标签正确；**local_apply 关（见准-2）** |
| ② 卡 | 仓库冻结本尊 `trimmc-card.json`（指纹在档）+ 端点同源 | version=4；active_strategy_id=`st_mu1bth1f66s5a2`（名「时段切换策略」，目的「闲时用 glm 忙时用 deepseek」）；规则 2 条=「三窗切换」(time, 3 窗) +「默认模型」(default→e-glm-anthropic)；default_model=GLM-5.3；machine 与 runtime-info 一致 | ✓ 活动策略回显链数据在位 |
| ③ 政策 | 冻结本尊 `policies/local.json` | 3 schedules=id 形 `strategy:st_mu1bth1f66s5a2:rule_mu1bth1g0jdd19:{0,1,2}`，窗/模型=00:00-14:00→GLM-5.3、14:00-18:00→deepseek-v4-pro、18:00-23:59→GLM-5.3，priority=100，Asia/Shanghai | ✓ **time 规则→窗级展开语义与卡逐窗一致**（apply 语义正确性实证） |
| ④ 生效 | `GET /v1/config/policy`（无鉴权） | `effective={model:GLM-5.3, matched_schedule_id=…:2, source:policy, evaluated_at=2026-09-25T12:10:21Z}` | ✓ **20:10∈18:00-23:59 窗→GLM-5.3，窗命中正确**；三层取值（窗命中→政策）链活 |

派生缓存核对：卡 `default_model=GLM-5.3` = 活动策略 default 规则条目（e-glm-anthropic→GLM-5.3）✓——「apply 时自活动策略 default 规则同步」语义在读数面成立。

全程零写自证：模型 transitions 指纹 `8b70db22…`（4131B）与回归后 T1 一致——GET 探针未触发任何状态迁移记录。

## 二、readiness 发现（2，非阻塞）

| # | 级别 | 发现 | 处置 |
| --- | --- | --- | --- |
| 准-1 | 非阻塞·显示面 | 卡 `status.state=pending`（at 2026-09-14T14:16:37Z）与生效事实（schedules 在位+窗命中）**漂移**——09-14 晚最后保存后未再 apply，徽标将显「待应用」而系统实为已生效运行态 | CEO 窗如实观察记录；若 I8 分支可走（见准-2），一次「应用到本机」即翻正 |
| 准-2 | 非阻塞·就绪面 | `local_apply_enabled=false`——活体 daemon 未设 `TRIMODEL_LOCAL_APPLY=1`，**「应用到本机」按钮门控隐藏**（UI L688 `applyBtn.hidden=!local_apply_enabled`），任务书四问④的 I8 步骤（应用到本机→生效值刷新闭环）当前不可走 | 两分支：a) BOD 裁 CEO 窗内以 `TRIMODEL_LOCAL_APPLY=1` 重启 daemon（非只读操作，P-5③ 不走带外窗故必经 BOD 授权+排窗）；b) 不重启则 CEO 窗按「已应用态验证」分支走（段三已备），apply 闭环候 flag 窗补 |

## 三、reload 全周期检具（第四型盲区·设计依据）

- **盲区定性**：jsdom/进程内复刻不覆盖真 reload boot 链（LG-035 W3 实锤）；真链自动化件 E10 存在（save→`page.reload()`→回显断言，真实 fetch+鉴权头+全状态重置）但 ①env-gate（`TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1`+Chrome）默认 SKIP；②断言对象「fixed 规则选择」v4 已退役（测-1，段一已报）——**现役形态的真 reload 全周期当前只有真人手测可覆盖**。
- **检具**：做成 CEO 窗可执行清单（段三 §B），核心环=「新增测试策略→保存卡片→F5 reload→断言策略仍在/活动策略回显/令牌保持连接/三窗规则表仍在」+删除回环「删测试策略→保存→reload→断言消失」。设计对准 E10 原始盲区面（真 fetch+localStorage+全状态重置），对象换成现役策略实体。
- **窗后回封**：CEO 窗为 policy/card 冻结的合法解冻窗（任务书 §一.3）；窗毕 BOD 知会本席即做窗后指纹封存（T2' 对窗前 T0'），冻结闭环回归席位态。

## 使用依据

- 任务书: `task-charter-lg035-walkthrough-restart-01.md`（4717f20d）§二.4/§四
- 基线 spec: `2026-W38/lg-035-local-ui-spec.md`（I2-I8 交互契约/§五 就绪声明）
- 活体读数: 本会话 curl GET 原样输出（12:10Z）；冻结本尊: `TriModel/trimmc-card.json`+`policies/local.json`（指纹 `ste-freeze-fingerprints.txt`）
- 盲区先例: E10 件头注释（真链复刻面自述）+ LG-035 第四型教训族
