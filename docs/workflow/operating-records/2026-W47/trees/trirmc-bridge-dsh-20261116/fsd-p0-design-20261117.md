# P0 施工段拟形卷·三件 registry 化（BOD 托转 138·CEO 门已开·候 CTO 门禁首闸·FD 主刀）

- 执行: m-duty-fsd；令面=CEO 回看裁三项（11:07:44·②P0 开工准+③P2 信箱=纳·②③先行生效）+P0 施工线即启令（双门走形：CEO 门已开·本卷=CTO 门禁对表面）
- 对象面: 方案卷 §3.1（legacy-staging/patch-runner/cli-adopt 三件 registry 化·**零行为变**）
- 状态: **拟形候 CTO 门禁对表绿＝P0 施工线启**

## §一 · 结构面（TriCompany 仓·新模块一件+改形一件）

1. **新模块 `runtime/cognition/delivery_plugins.py`**（DeliveryPlugin 契约 v1·方案卷 §二正形）:
   - 契约 base `DeliveryPlugin`（四件套同构）: `name`（=deliver_via 旗标值）/`apply(ctx, letters, dry)→readout`（批投递主步）/`inject`（服务声明类属性·零依赖=空表）/`validate_config(cfg)`（Config 手工校验形照 fsd-adopt-runner 先例）
   - 三插件类（现役核函数**原样收拢**·改形不改语义）:
     - `LegacyStagingPlugin`（name=legacy-staging·inject=[]·零 dsh 依赖）——apply=V2-2 staging 落位段（run_dir/convene 双件族 write+landed/staged 读数）现役形原样
     - `PatchRunnerPlugin`（name=patch-runner·inject=['dsh']）——apply=_deliver_letters(form='patch-runner') 现役核原样+validate_config 四参（dsh_bin/dsh_home/dsh_install_anchor/runner_path）
     - `CliAdoptPlugin`（name=cli-adopt·inject=['dsh']）——apply=_deliver_letters(form='cli-adopt') 现役核原样+validate_config 三参
   - `REGISTRY: Dict[str, DeliveryPlugin]`（三键在册·值域=VALID_DELIVER_VIA·mailbox=P2 候位不入册）
   - 迁移函数族（自 loop_convene_auto 原样搬家）: DEFAULT_DELIVER_VIA/VALID_DELIVER_VIA/形族 regex/is_session_id_form/read_deliver_via/seat_session_id/build_patch_runner_overlay/_invoke_dsh/_parse_runner_readout/_deliver_letters/run_deliver
2. **改形 `loop_convene_auto.py`**: 收缩为 orchestrator（run_auto_segment/main）——delivery 核函数改 import 自 delivery_plugins+**backward-compat re-export**（现名照旧可 import·现有白盒 31 件 import 面零改）；run_auto_segment legacy 分支 inline staging 落位段→LegacyStagingPlugin.apply 调用（同操作同序零行为变·landed/staged 读数同形）；run_deliver→registry 查找形（非法值 fail-visible 消息载值域）

## §二 · 零行为变守护面（护栏）

- 白盒 **31 件全跑零改**（现有断言即守护：legacy 缺省零漂移双断言+三形端到端+fail-visible 五面+dry 面双件）
- 新增 registry 白盒（test_delivery_plugins.py）: REGISTRY 三键=值域一致/四件套契约面（name/apply/inject/validate_config 三形）/run_deliver registry 查找+非法值 fail-visible/迁移函数与 re-export 等价面
- 读数形状 byte-level 对照: run_auto_segment 输出键面零改（mode/warn/deliver_via/letters/dimb/landed/delivery/compare/readings 八键原形）

## §三 · 施工工序（候门禁绿即启）

1. delivery_plugins.py 新模块（核函数迁移+三插件类+REGISTRY）→2. loop_convene_auto.py 收缩+re-export→3. 白盒: 31 件全跑+test_delivery_plugins.py 新增（估 6-8 件）→4. TriCompany 单笔 commit revert 一键形（pre-hash 留档）→5. 毕报双通道（落卷+SendMessage 值席→CTO 二审→呈报链）
- 回滚锚: pre-hash 单笔 revert 一键形；行为面回滚=deliver_via 缺省 legacy（零触码）

## §四 · P1/P2 候位面（本卷零触·如实列）

- P1 t4-bridge（TriRMC 跨仓对表窗·准实时指标 T_inject 验收门随卷）——候 P0 毕+CTO 窗
- P2 mailbox（CEO 裁=纳·registry 名=mailbox·五键 payload 现役写形照守·两世界桥）——另立施工线候排

## §五 · 使用依据

BOD 托转 138（CEO 回看裁三项）；方案卷 fd2fd57f0/86337fb0c（§3.1/§六/§八）；notice-134 五判据对表谱系；fsd-adopt-runner 四件套先例；V2-2 现役形 31 白盒守护面
