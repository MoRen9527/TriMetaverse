# P0 施工毕报·投递插件族三件 registry 化（BOD 托转 138·双门走形毕·FD 主刀）

- 执行: m-duty-fsd；令面=CEO 回看裁三项（②P0 开工准·③P2 信箱=纳）+CTO 门禁首闸绿（d54bda7af 三对表点全过·双门走形毕）
- 交付锚: **TriCompany dev 862ec1f**（单笔 commit revert 一键形·已 push sg bare 346158a..862ec1f）
- 回滚锚: pre-hash **346158a**（/tmp/p0-pre-hash.txt 留档 ✓）+行为面回滚=deliver_via 缺省 legacy（零触码）
- 状态: **READY_FOR_REVIEW**（候 CTO 完工门禁二审→呈报链）

## 一、实现读数（拟形 §一 对表）

| 面 | 落位 | 读数 |
| --- | --- | --- |
| 新模块 | runtime/cognition/delivery_plugins.py | DeliveryPlugin 契约 v1 base（name/apply/inject/validate_config 四件套）+三插件类（LegacyStagingPlugin inject=[] 零 dsh/PatchRunnerPlugin+CliAdoptPlugin inject=('dsh',)·validate_config 逐键点名）+REGISTRY 三键=VALID_DELIVER_VIA（mailbox=P2 候位不入册显式）+核函数族原样搬家（旗标/形族/seat 映射/overlay/子进程/读数 D-46/_deliver_letters/run_deliver） |
| 收缩面 | loop_convene_auto.py | orchestrator 形（mode 门/初判/召集件渲染/插件调用）+backward-compat re-export（现名照旧可 import·现有白盒 import 面零改）+读数八键 byte-level 原形零改 |
| 新白盒 | test_delivery_plugins.py | 11 件（registry 面/契约面/validate_config 三形/fail-visible 消息形状/legacy apply 端到端+dry 零落位/re-export 同一性） |

## 二、门禁读数

- **白盒 42/42 绿**=现有 31 守护件零改全绿（缺省 legacy 零漂移双断言在册）+新增 11 件
- **读数形状 byte-level**: run_auto_segment 八键原形（mode/warn/deliver_via/letters/dimb/landed/delivery/compare/readings）
- **cognition 全量 308 tests**: 10 errors=逐名同款预存 sg 环境面（preflight git identity 9+score_engine py3.8 union 1·三笔在档）零因果 Δ+14 全绿
- **护栏遵行**: 零触现役 loop 链/零 daemon 重启/零河源面/零 P1 P2 候位面/单笔 revert ✓

## 三、候位面（本卷零触·如实列）

- P1 t4-bridge（TriRMC 跨仓对表窗·T_inject 准实时验收门随卷）——候 P0 毕报+CTO 窗
- P2 mailbox（CEO 裁=纳·registry 名=mailbox·五键 payload 现役写形照守·两世界桥）——另立施工线候排

## 四、使用依据

BOD 托转 138（CEO 回看裁）；CTO 门禁首闸绿（三对表点·COS/CTO 双道转达）；fsd-p0-design-20261117.md（拟形 §一/§二）；方案卷 fd2fd57f0/86337fb0c；V2-2 现役形 31 白盒守护面；TriCompany 862ec1f diff
