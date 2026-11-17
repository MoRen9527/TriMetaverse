# T-a 修面勘定卷·web patch 13 条目缺 pm 漏点位单点定谳（CTO 主勘+FSD 协勘）

- date 现查: 2026-11-18 02:2x CST（D-47）
- 主勘: CTO 小狄；协勘: m-duty-fsd（T3 施工面）；单点定谳对象: web patch（generated 2026-10-16 21:36:10+08·source=TriCompany/source-agents@ce38ece2ebe38）13 条目缺 pm

## 一、单点定谳（漏点位钉死·双证）

**漏点位=生成时席册/源树无 pm（时点差）——非转译器缺陷、非生成后丢条**。双证：

1. **源树时点证**：source-agents@**ce38ece2ebe38**（web patch 生成时点 source 锚，2026-10-16 20:31:04+08）树内 source-agents/=**16 目录零 pm**（ls-tree 实勘：board/business-strategy/ceo-chief-of-staff/…/senior-test-engineer/16 目录·product-manager 零命中）——生成时点 pm 源目录**尚不存在**；
2. **pm 正式化时点证**：PM 席正式化六环=**2026-10-23 03:56:59+08（962d149）**——roster v1.1.0 13→14+D-13 PM 行+host_object_generation 第 14 员 objectSet，**晚于 web patch 生成 7 天**。

即：生成时点（10-16 21:36）pm 尚未正式化入席（10-23 才正式化），transpiler 按 10-16 时点席册枚举=13 条目**正确输出**（无漏转）——**缺 pm=时点差非缺陷**。

## 二、修面方案（一行级·照 L130 拆树 T-b 形）

修面=T3-b transplant 生成器链补 pm 条目：**pm 条目入 headless cordis.patch.yml**（14 条目形=现役 13+pm）——生成器 input 加 pm 源目录（product-manager/ 五件套·现役在库实锚 /srv/fleet/TriCompany/source-agents/product-manager/ 全件在）→transplant 生成器跑一把即出 14 条目 patch。

- 修面一行级=生成器 input 清单加 pm 一行（生成器本体零改——T3-b 生成器已交付 da59e59·input 面扩一行）；
- web patch 本体（4700 行）刷新=transpiler 重跑（transpiler 本体未定位——cos-t3a 勘定谳「一次性工具已离位/BOD SSH 深勘/dev 机面」三候选在案）——**备选正形=T3-b transplant 生成器产出 headless patch 形**（已交付链零回溯·L130 T-b 形承录）。

## 三、边界与残面（如实）

- 转译器本体=未定位（cos-t3a 勘定谳承录：河源 face 三面零命中·BOD SSH root 链深勘或 dev 机面或一次性工具已离位三候选）——**本体深勘=非 T-a 必需**（T3-b transplant 链已可产出 14 条目 patch·转译器本体深勘降为考古项候窗）；
- R-HY keys.enc 双 GLM 条目实读=部署窗核对项（参数化承形·前卷在案）；
- 本勘=只读取证（git ls-tree/show/log 三面·零写零触）✓。

## 使用依据

git ls-tree ce38ece2ebe38（生成时点源树 16 目录实勘）；git log 962d149（PM 正式化时点）；git show ce38ece2ebe38:source-agents/（树内清单）；cos-t3a-survey-readout-20261117.md（本体未定位勘定谳承录）；fsd-t3-window-handoff-readout-20261117.md（web patch 4700 行头注全套读数）。
