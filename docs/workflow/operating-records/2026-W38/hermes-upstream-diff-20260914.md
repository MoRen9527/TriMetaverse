# hermes 上游新版对比（vs 本地 reference 副本）

- sourceOfTruth: 本件（BOD 亲勘）
- syncMode: static（对比快照）
- lastSyncedAt: 2026-09-14T17:1x+0800
- 对比对象: `TriMetaverse/reference/hermes-agent/`（本地副本）↔ 上游 `NousResearch/hermes-agent` @ `5eb99eb`（2026-09-14 04:56 UTC，clone 于 M-SG:/tmp/hermes-upstream）
- 性质: 结构级对比（顶层目录/文件清单 + 关键家族）；文件级深对比候三人组按需（BOD 可从 M-SG 取单文件/子树）

## 一、上游新增（本地副本无）

1. **apps/**：bootstrap-installer / desktop / shared——桌面应用化（安装器+桌面壳+共享层）
2. **hermes_state_* 模块族（20+ 文件）**：state_common/compression/dbfile/errors/fts/gateway/guard/holders/ids/maintenance/messages/portability/readpool/registry/repair/rewind/schema/search/sessions/telegram/titles/usage/wal——会话状态层从单体拆成单一职责模块族（**重大架构演化**）
3. **技能/插件生态**：plugins/、skills/、optional-skills/、optional-mcps/、plugin-catalog/、toolsets.py、toolset_distributions.py——三层分发（核心/可选/目录）
4. **评估与测试体系**：evals/、tests/、tests-js/
5. **UI 面**：ui-tui/、tui_gateway/、web/、website/
6. **多模型提供商层**：providers/、model_tools.py、model_tools_connectors.py
7. **国际化**：locales/、README.es.md、README.ur-pk.md、README.zh-CN.md、SECURITY.es.md、CONTRIBUTING.es.md
8. **平台化工程件**：native/、nix/、setup-hermes.sh、docker-compose.yml、docker-compose.windows.yml、uv.lock
9. **启动守护**：hermes_startup_watchdog.py、hermes_bootstrap.py（与前日本司 8713 看门狗方案同思路——互为印证件）
10. **SOUL 核心强化**：SOUL.md（顶层）+ docker/SOUL.md + hermes_cli/default_soul.py——身份种子机制成熟化（可编程默认灵魂）
11. 大仓工程件：compat_manifest.json、COMPAT_MANIFEST.md、mini_swe_runner.py、trajectory_compressor.py、run_agent.py、registration_lifecycle.py

## 二、本地副本有、上游顶层已无（移动/退役）

- `docs/`——上游顶层无 docs/ 目录（文档面迁往 website/ 或 web/，候文件级勘）
- `acp_registry`——或已并入 acp_adapter
- `landingpage/`——或已并入 website/
- `environments/`、`datagen-config-examples`——未见于上游顶层

## 三、对治理体系二期的启示（BOD 判读，供三人组）

1. **状态层模块化=活教材**：上游把会话状态拆成 20+ 单一职责文件——本司 schema 层（消化管道）设计可参考该拆分法（防单体膨胀，收口由 hermes_state_registry/state_schema 类总控）
2. **SOUL 身份种子成熟态**：default_soul.py=可编程灵魂生成——本司合同体系的 SOUL 吸收轨可对照升级
3. **skills/toolsets 三层分发**：核心/可选/目录三层——compass（手册）+ skill + registry 体系的成熟参照
4. **startup_watchdog 印证**：上游自带启动看门狗——本司 8713 看门狗方案与其互为独立印证
5. **evals/ 评估体系**：上游把评估作一等目录——本司治理体系六条验收锚可对照

## 四、获取方式

- 上游拉取（M-SG 通道）：`ssh M-SG-47.245.122.61 "cd /tmp && git clone --depth 1 https://github.com/NousResearch/hermes-agent.git hermes-upstream"`
- 单文件/子树按需：BOD 从 M-SG 代取

——BOD，2026-09-14 17:1x+0800
