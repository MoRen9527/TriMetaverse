# 合流命题件·contract schema 现代化（A-D 四命题双签稿）

- sourceOfTruth: 本件（trees/contract-schema-modernization/ 合流命题件）
- syncMode: static
- lastSyncedAt: 2026-09-21（CHO 主笔合稿+CTO 三裁并入）
- 上位令: task-charter-20260921-contract-schema.md（CEO 2026-09-21 10:53 定调结构化）
- 输入: CHO 实勘矩阵（15 件全扫）+ CTO 三裁（trimc 并桶/BS 随批/baseline 三态分类处置）
- 双签: CHO（命题 A 主笔）✓ / CTO（命题 B/C 主笔+联审）**✓ 签认（2026-09-21 11:02+0800 date 现查）——验读：实勘矩阵与 CHO 原件一致；三裁①②③全文照录未改写；命题 C 预锚录位准确；验收锚五条覆盖 A-D；执行窗排期照令（候注入器合流呈批后）**

## 一、实勘矩阵（窗前全扫定稿）

| 维度 | 读数 |
| --- | --- |
| contract 件数 | 15（13 席+BS；board 无 tools 段不涉） |
| tools 段在位 | 14 件 |
| runtime_equivalent | 8 席 31 处（COS/CPO/CTO/RDT/SDE 各 4、FSD/STE 各 4、CSO 3） |
| 方言三态 | openclaw:*×6 席／trimc:*×2 席（FSD/STE，TriMC 旧名方言）／无等价物×6 席 |
| host_overrides | 0/15（本线引入） |
| runtime_baseline 三态 | 旧三废态（host: copilot-host+tri_mc_status）11 席／B3B4 换代双面态 2 席（CTO/CAO：m_plane_runtime+r_plane_runtime）／BS 异形 1 件 |

## 二、命题 A 终案（CHO 主笔，CTO ①②裁并入）

1. 限制本体四键保留：`name/scope/risk_level/requires_approval`＝宿主无关真源声明位（一个位置声明覆盖所有宿主）。
2. 每 tool 增 `host_overrides:` 消费开关块（语义=该宿主是否消费该限制）：`claude: disabled`（现状如实=发布位无 tools 行全工具）／`copilot: enabled`／`openclaw: enabled`。
3. `runtime_equivalent` 全族删除（31 处；openclaw:*/trimc:* 两方言同桶）——git 史即档，不另立归档件（与次批③清扫家族口径一致）。
4. 批量范围：13 席+BS 随批（CTO 裁②）＝14 件；board 不涉。

## 三、命题 B 终案（CTO 主笔三裁③）

三态分类处置，非一刀切：
- 旧三废态 11 席：`tri_mc_status` 直接删（tri_mc 迁移早已完成，死字段零迁移价值）；`host: copilot-host` 删（binding profile 本体即 host 绑定，此字段系其陈旧影子）。
- 换代双面态 2 席（CTO/CAO）：`m_plane_runtime/r_plane_runtime` 一并迁出 contract **迁 binding profile 新键**（候选名 `runtime_planes: {m: claude-code-runtime, r: agent-core}`）——判据：该席在哪面跑什么 runtime＝部署绑定事实，系 binding profile 定义域；B3/B4 有效信息迁非删。
- BS 异形：执行窗细勘按形态归入上两类之一。
- 终态：contract 零 runtime_baseline 段（15 件全删段），有效信息归位 binding。

## 四、命题 C 确认（CTO 预锚）

现行为对齐无倒退：TMV-1 A1 实测 claude 面 tools 行消失×14＝新 schema `claude: disabled` 语义（disabled=渲染不输出 tools 行即现行为）；渲管线读 host_overrides 后 copilot=enabled 输出限制行。执行窗留渲管线消费点全清单。

## 五、命题 D validator 接口（双签采纳）

- legacy 红：`runtime_equivalent` 出现即红（防回流）。
- `host_overrides` 值域白名单 {enabled, disabled}；缺省=enabled。
- 13 席批量+validator 用例同步（schema 变更测试）。

## 六、执行窗与排期

- 注入器命题合流呈批后启动（双席负载调度）；与次批③ contract schema 校准窗并窗；与首条实证线 schema 设计同域协调。
- 批量：源侧 14 件 contract+validator 用例+渲管线消费点（CTO 面）+binding profile runtime_planes 迁入（CTO/CAO 两席）。

## 七、验收锚（本线，候窗生效）

1. 15 件 contract `runtime_equivalent` 零残留（legacy 红=0）。
2. 15 件 contract `runtime_baseline` 段零残留。
3. 14 件 tools 段 `host_overrides` 在位（claude=disabled/copilot=enabled/openclaw=enabled）。
4. validator 用例绿（含 legacy 红回归+白名单校验）。
5. CTO/CAO binding profile `runtime_planes` 新键在位。
