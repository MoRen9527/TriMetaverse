# SDE preset composition 修复毕报·三步序+调用面全过（CTO 深勘裁定 63938e61e 承·notice-196 程序化前置件闭合）

- sourceOfTruth: 本卷（preset overlay 修复毕报正形·CTO 复验位材料）
- syncMode: write-time
- 执行席: SDE 小布；令源=m-duty-cos 施工令（CTO 深勘裁定 cto-preset-composition-deepsurvey-20261118·三步序·SDE 主刀）
- 施工窗: 2026-11-18T14:25Z 起笔（date 现查原值·D-47 全程）
- 判定: **三步序全 PASS＋调用面尾挂笔 4217549（push+河源 sync）＋端到端 spawn smoke sheet 落卷实锚——结构性缺供根因消·下轮起 convene spawn 根治面就绪**

## §一 · 三步序读数（CTO 施工序逐项）

| 步 | 面 | 读数 |
|---|---|---|
| ①overlay 落位 | `/home/fleet/.dsh/patches/headless-agentpresets-overlay.yml`（独立小 overlay·荐案承）——单条 insert：`agent-preset-registry @deepseek-ai/dsh-agent-preset-registry config.default=r-duty-cos`（值席中性位）·4337 行 patch 零触碰·法源链注释随文件 | ✓ |
| ②dump-config 核 | `dsh --profile headless --patch <overlay> --dump-config` → **L7341-7344 提供行在场**（id/name/config.default 三键全载·grep rc=0） | ✓ |
| ③单发 headless smoke | rc=0·**err 面 pending 清零**（「did not activate」零命中＋「waiting for service」零命中）·会话输出在（`{"smoke": true}`）——fallback 两态收敛实锚（CTO §三.2 预判兑现） | ✓ |
| ④调用面尾挂（增补） | loop_autoreview spawn 命令 `--patch` 尾挂（overlay 在场才挂·env DSH_PRESET_OVERLAY 可覆）——TC **4217549**（py_compile+单测 23/23 OK·push sg bare·河源 ff sync） | ✓ |

## §二 · 端到端 spawn smoke（根治面活体）

- 临时 run_dir smoke（零触 ns2 面·毕即清）：`loop_autoreview --seats cos --spawn` → **sheet 落卷（改善意见面完整）**——--patch 尾挂后 spawn 通道端到端通（结构性缺供消·14 声明行 activate 面下轮 convene spawn 实拍承接）。
- 回滚锚=一键两步：撤 overlay 文件＋spawn 调用面去 --patch（码面 env DSH_PRESET_OVERLAY 置空亦可——零文件容错形）。

## §三 · 零触面与护栏

- 零改 dsh 现役面（纯 config/patch 形·零上游代码触碰——CTO §三.4 承 ✓）
- 在役 8791 web 零扰（web profile 组合独立·profile 层隔离·新 boot 生效形）
- ns2 手工补面并行零扰（本修复=下轮起根治面·ns2 三席缺席面由手工轨承载——双轨注承）
- D-24/D-46/D-47 承 ✓

## §四 · 候面

- CTO 复验位：本卷 §一三步读数+overlay 文件+dump L7341 行面（河源侧现勘可达）
- notice-196 程序化增量前置件=闭合（WP9 v3 登记面据=CTO 深勘卷+本卷）
- 下轮（ns3 起）convene spawn 七席完备面=本修复实拍验证位

## 使用依据

CTO 深勘裁定卷（cto-preset-composition-deepsurvey-20261118·根因三重实锚+YAML 形）；dsh-agent-preset-registry 源锚（L481 super(ctx,"agentPresets")/L193/L251-253）；dump-config 双 profile 实锚；TC 4217549 diff；smoke 三面实录（err/out/dump）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→CTO 复验位·卷面时戳=commit %cI）
