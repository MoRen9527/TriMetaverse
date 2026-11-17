# v3 施工毕报·loop_convene_auto 直用 dsh runtime 库（in-process adopt 真通道）+deliver_via 三形（BOD 托转 133·FD 主刀）

- 执行: m-duty-fsd；正身=BOD 托转 133（CEO 令「没有排窗直接干」）+CTO 一审绿维持（§九 PASS·条件⑤预案段已达+条件①耦合面清单=本卷 §四 载）+编码施工即启令（COS/CTO 双道转达）
- 交付锚: **TriModel dev 93617e5**（runner 插件+白盒 15 件）+ **TriCompany dev 92432ea**（deliver_via 三形+白盒 20 件）——双仓各单笔 commit revert 一键形·双 push sg bare ✓
- 回滚锚: TriModel pre=3efc4df/TriCompany pre=155535a（revert 一键形前置声明 ✓）+deliver_via 缺省=legacy-staging（行为面零漂移=运行时回滚零触码）
- 状态: **READY_FOR_REVIEW**（候 CTO 完工门禁二审）

## 一、实现读数（三件面）

| 件 | 落位 | 读数 |
| --- | --- | --- |
| ①runner 插件 | TriModel src/dsh-adopt/runner.ts | cordis 插件契约（name/apply/io 缝）·零顶层依赖（ctx 服务面全走 dsh 安装域=判据②）；adopt-or-create 两腿（live=adopted-live/resume=adopted/not-found→create=created·七席自举）；三模式注入映射（queue→followup/steer→steer/inject→inject·inject 零 whenIdle=不唤醒）；版本 pin fail-visible（矩阵双行+不在册拒跑）；dsh-llm createUserMessage install-anchored 动态解析；读数=状态六键 JSON 零 letter 值（D-46） |
| ②deliver_via 三形 | TriCompany loop_convene_auto.py | 门控 fail-safe 缺省 legacy-staging（V2-2 零行为漂移·非法值降级+warn）；seat 映射双入形（m-duty-*+叙事席名→r-duty-*·非映射形 fail-visible）；overlay 调用级生成（disable headless-runner+insert fsd-adopt-runner·letter tmp 文件面=YAML 转义域归零）；per-seat 顺序骨架 fail-visible（单席失败读数记录不中断）；cli-adopt 兜底形=rc.2 原生 CLI --session-id stdin `-` 形；dry=零文件零子进程预演 |
| ③白盒族 | 双仓 test 各一 | TriModel 15/15+TriCompany 20/20（面单 §三） |

## 二、门禁读数

- **白盒 35/35 绿**（TriModel 15+TriCompany 20）
- **TriModel tsc --noEmit 绿**；套件 343/320/6/17（6 fail=预存 sg 环境面·a1 段 stash 双跑已证·零因果 Δ+15 全绿）
- **cognition 全量 294 tests**：10 errors=stash 双跑实证预存 sg 环境面（preflight git identity 9+score_engine py3.8 union 1·V2-1 卷已档同族）——零因果 Δ+20 全绿
- **D-46 防御双道**: runner 读数面零 letter 值（白盒断言）+Python 读数解析 letter 回显检出=失败记录（evil bin 白盒实证）
- **护栏遵行**: 零触现役 loop 链/零 daemon 重启/零河源面/沙箱隔离域（.dsh-sandbox{,2}+.dsh-upgrade-probe 零真 home 零真存储·清理候令）

## 三、白盒面单

- **TriModel 15**: Config schema 形×3（全字段绿/缺字段清单形/非法 mode 拒收）/版本 pin×2（矩阵两行+拒跑端到端先于会话触面断言）/两腿×5（live 零 resume/create 断言/resume 绿/not-found→create+meta.cwd/非寻址错不吞/显式 sessionId）/三模式×3（queue+whenIdle/steer/inject 零唤醒断言）/读数零值×2（六键结构+letter 值禁入）
- **TriCompany 20**: 门控×3/映射×3（含叙事席名形）/overlay×3（形+显式 sessionId+越形守卫）/dry×2（manual 零投递+七席预演 overlay 预览）/legacy 零漂移×2（V2-2 staging 双件等价+manual 零投递）/patch-runner 端到端×5（七席读数/非零 rc 记录/D-46 检出/缺 config fail-visible/越形席记录）/cli-adopt×1（stdin 形七席）

## 四、耦合面清单（CTO 条件①·两面分列）

**API 面（runner 内·dsh 版本升级触此面·风险中）**：

| # | 触点 | 形 | 风险 |
|---|---|---|---|
| 1 | ctx.get 五服务 | agents/agentDefaultModel/sessions/fs/appExit | 低（服务注册面稳定） |
| 2 | agents.create | {sessionId, meta:{cwd}, agentOptions} | 中（签名漂移） |
| 3 | agents.resume | {resumeSessionId, agentOptions} | 中 |
| 4 | agents 五原语 | followup/steer/inject/whenIdle/get | 低（原语族稳定·0.2.2-rc.3 diff=EMPTY） |
| 5 | sessions.flush | agent.session | 低 |
| 6 | assertAdoptable 同款守卫 | header.origin/cwd/preset | 中（守卫语义演进） |
| 7 | createUserMessage（dsh-llm） | install-anchored 动态解析 | 中（消息 schema 演进） |
| 8 | 插件契约+overlay 条目形 | name/apply+patch YAML | 低-中（patch schema 演进） |
| 9 | 版本 pin 矩阵 | SUPPORTED_VERSIONS 双行 | 升级即改（单点面） |

**调用面（TriCompany 旗标形·风险低）**：loop_convene_auto 经 deliver_via 旗标+deliver_config（dsh_bin/dsh_home/dsh_install_anchor/runner_path 五参）+JSON I/O——**dsh API 零触**（触面=子进程 spawn+JSON 解析·版本无关面）；dsh 版本升级=零改（仅 deliver_config 路径参数对表）。

## 五、残面与候窗面（R-HY 部署窗活体实证清单）

1. **adopt 活体一例**: agents.resume 对存量 cwd-face session 解析实证（判据①关键勘点·码级已落锤=rc.2 工件原码读+0.2.2-rc.3 直测）
2. **overlay path 形 name 挂载实证一例**（loader :214-223 解析形）
3. **runner 端到端一例**（seat 自举+letter 注入+flush+读数四读数）
4. **dsh bin node22 face 对表**（rc.2 需 node:util.parseEnv≥20.12·河源现役启动形实勘）
5. cordis patch 8682 接线=§三 方向稿+schema 勘定+落位时点候同窗裁定（照令面非本批强制）

## 六、使用依据

BOD 托转 133；CTO 一审绿维持令面（条件①⑤）；fsd-v3-design-20261117.md（§二/§九）；dsh-headless@0.2.0-rc.2 工件原码读+0.2.2-rc.3 跨版本直测；T2 收口定谳卷 ④-1 映射表；D-46/D-47；V2-2 现役形基线
