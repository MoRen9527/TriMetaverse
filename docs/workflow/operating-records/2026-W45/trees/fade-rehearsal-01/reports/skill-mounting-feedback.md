# skill 布装机制接口缺口·首验反馈卷（勘窗件③·tri-fade011 双 pack 首验实证）

- sourceOfTruth: 本件（勘窗产出证据卷·反馈件非制度正身）
- syncMode: rehearsal-fixture
- lastSyncedAt: 2026-11-03T14:36:03Z（date -u 现查原值）

## 首验实证（FADE-011 首彩排⑧⑨段·tri-fade011-score/close 双 pack）

1. **宿主 skill 清单不可见**：双 pack frontmatter `disable-model-invocation: true`（设计内·防自动化引擎误用）——后果=宿主会话 available-skills 清单不含本 pack，跨席无法经 skill 调用机制自动发现。
2. **直读照办=有效 invocation**：COS/CAO 双席⑧段各自 Read `SKILL.md` 全文→按规程执行（三维打分/双席流程/schema 输出）——⑰轮定谳「skill=规程载体非自动化引擎」实证成立；tri-fade011-close ⑨段同形（四态裁/证据引用/先裁后写）。
3. **现役发现通道=AGENTS.md 映射表**：TriSkill AGENTS.md 增两映射行（tri-fade011-score=COS+CAO／tri-fade011-close=裁决席·258bbf9）——席位经模块 AGENTS.md 得知 skill 存在，再直读 SKILL.md 照办；run-registry 载 skill 路径+版本锚（L39-41·TriSkill 35ec18d）=run 链内第二发现通道。

## 接口缺口描述

- 缺口=**TriSkill→宿主会话面的装挂接口无自动发现通道**（disable-model-invocation pack 不进 skill 清单·发现依赖 AGENTS.md 映射表人工维护+run 工件链指针）。
- 影响面=跨实例复用时新席位不知道规程 skill 存在（除非读 run-registry/AGENTS.md）——FADE run 自带指针已缓解（run-registry 载路径），缺口=非 FADE 场景的泛化发现。
- 设计张力注：disable-model-invocation=true 是**设计内选择**（规程载体防自动化·⑰轮定谳），非缺陷——缺口本质=「规程类 skill 的发现机制」与「自动化类 skill 的调用机制」未分层。

## 候裁决面（非 CAO 代决域·呈 TriSkill owner 面）

- 候选 A：维持现状——FADE run 工件链自带指针已覆盖 FADE 场景（首验实锚够用），泛化发现候真实需求出现再议（禁形式主义·无需求不立制）。
- 候选 B：TriSkill 面立「规程类 skill 发现约定」——如 AGENTS.md 映射表增列「规程 pack」标注段·或宿主清单外设规程索引件（owner=TriSkill 面）。
- 候选 C：协议侧收口——FADE spec §2.6/§2.7 增「skill 指针为 run 工件必载项」条款（run-registry 载 skill 路径从惯例升条款·CAO 纪律册/协议归口面）。

CAO 面意见：候选 A 为现役正形（首验够用·不过度设计）·候选 B/C 候第二次实例或真实缺口复现再裁。

## 销项

勘窗件③毕——本卷即反馈件·呈 COS/CTO 面知会（TriSkill owner 裁决面候排）·不阻 run 终态（APPROVED 已落）。
