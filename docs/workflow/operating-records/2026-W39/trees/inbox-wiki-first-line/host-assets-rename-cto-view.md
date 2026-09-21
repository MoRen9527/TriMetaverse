# 宿主资产目录命名·CTO 技术层评估（追加命题）

- sourceOfTruth: 本件（迁移工程全量盘点/窗口关系/渐进 vs 一次到位；合流独立决策节素材）
- syncMode: draft
- lastSyncedAt: 2026-09-20T23:4x+0800（date 现查 23:43:50，本回合执行）
- 命题: CEO 23:42 追加——copilot 名不副实→TriCompany-x-host-assets 提案技术评估

---

## 一、迁移工程全量盘点（引用面实测，分域分扫防超时法）

| 域 | 引用文件数 | 性质 |
| --- | --- | --- |
| host-assets 自引用（runtime 18 含） | **147** | README/管线脚本/manifest/知识区——真源自述面 |
| docs/workflow | **52** | 治理件/runbook/SOP/联合方案——文档引用面 |
| .claude（渲染产物） | **27** | 13 席 agents 的路径文本——渲染源头件改→重渲窗 |
| .github | **16** | binding/manifest/prompt——发布登记面 |
| docs/execution | 5 | 方案件 |
| **三 daemon 仓代码** | **5**（TriRLC 1/TriMLC 1/TriMMC 3） | **运行消费面——env/路径硬编码，改后须 daemon 重启生效（D-03 v3 dist 完整性坑族前置检查）** |
| 合计 | **~250 文件** | 另有 TriCompany 侧文档散布未计入（量级再加十位） |

消费者四类：管线代码（改码+测试）/渲染产物（源头件改+重渲窗）/文档引用（随窗改）/daemon env（改后重启才生效——不可见失败风险位）。

## 二、窗口关系建议：**迁移先行于首条线上线**

理由：首条线全部 artifacts（inbox 模板/digest-rules/wiki 路径/教程）落在该目录树内——先上线后迁移=首条线产物二次改路径（模板/教程/已有 inbox 件 frontmatter 全返工）；先迁移=首条线一次写新名零返工。窗口天然错开：首条线在候注入器命题合流+CEO 批（未实跑），迁移窗可先行且不与首条线实跑抢资源。

## 三、渐进 vs 一次到位对比——**裁渐进（junction 别名制）**

| 维度 | 渐进（git mv 真名+旧名 junction 兜底） | 一次到位（单窗全改） |
| --- | --- | --- |
| 断链风险 | 零（junction 穿透兜底，启动链/D-29 任务全不断） | 单窗内几百引用漏改=断链（不可见失败位：daemon env 改后不重启=静默旧路径） |
| 窗口成本 | 分窗摊薄（管线/代码一批+文档随窗） | 单窗巨型（~250 文件+三 daemon 重启+全量重渲+全链测试同窗） |
| 先例 | **compass 改名正身先例**（hub→compass git mv+junction+触发式终点——全链已验证成熟） | 无先例 |
| 风险特有 | 双名并存期（compass 先例=触发式终点防无限延长：manifest 更新+重启过轮+文档活件更新三条件齐删别名） | 「今夜三起探错树」同根风险放大期（肌肉记忆失效+树名变更多窗混跑） |
| 回滚 | 每步独立 commit+别名保留=可逆 | 大窗回滚=全量回退 |

**裁=渐进**，执行序（候批后）：①管线+代码批（source_publish_check 族/daemon env/测试件）→②git mv+junction+.gitignore（compass 步序照抄）→③渲染窗（.claude 27 件+binding 路径随渲更新）→④文档随窗→⑤触发式终点（三条件齐删 junction）。全程照 compass 先例步序+回滚锚四件。

## 四、命名形态技术注记（最终名归 CPO/CEO）

技术面唯一要求=**宿主中性化**（现名锁死单宿主代称 copilot，与双宿主+未来多宿主现实相抵——CEO 提案方向正确）。形态候选供产品裁：`TriCompany-host-assets`（去限定词，最干净）/`TriCompany-x-host-assets`（CEO 提案原样）/`TriCompany-multi-host-assets`（显式多宿主）——三者迁移工程无差（同名改法），纯命名取舍。

## 五、与首条线的合流关系

本追加命题独立决策节呈 CEO（BOD 令）：**决策序建议=命名定案→迁移批（先行窗）→首条线实跑（落新名）**；若 CEO 判迁移不急，首条线可按现名先跑（拉取式主/注入摘要级的路径引用集中度高——digest-rules.yaml+compass 指针两处改即可，二次改成本可控），两案都通，差异在返工量（先行=零返工）。

## 六、使用依据

本回合分域分扫实测（~250 文件量级/三 daemon 5 代码文件）+compass-rename-plan.md（junction 正身先例/触发式终点/D-03 v3 dist 坑族）+D-29（计划任务路径合规面）。
