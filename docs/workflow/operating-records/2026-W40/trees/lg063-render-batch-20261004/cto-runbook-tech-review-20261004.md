# CTO·渲染管线 Runbook 技审卷（CAO 定位核毕转技审+COS 技审请并案）

- sourceOfTruth: 本件（技审裁决正身；审对象=TriCompany/docs/engineering/render-pipeline-runbook.md @ 9a47a35）
- syncMode: final
- lastSyncedAt: 2026-10-04 21:50:14 +0800（date 现查贴原值）
- 审席: CTO 小狄（m-cto）；全链对照管线正身 source_publish_check.py 逐项实勘（只读）

## 总判

**APPROVE（附三条勘意增补+一条长期修法技术约束，均随更级非阻级）**——runbook 操作面与管线正身现值对表成立，断言① 抓住主要矛盾，可作操作真源 companion 在位。

## 一、对表通过项（逐项实锚）

| 候审面 | 实锚 | 判 |
| --- | --- | --- |
| §一 CLI 配方 | `--publish-agents`（L3082，dry-run 默认 help 原文）/`--agent-execute`（L3089）/`--host` choices=registry 三键（L3096-3108）/`--source-root` 默认 `.`（L3047）/`--support-root` 默认 `../TriMetaverse`（L3052）/`--employees` 仅 publish-agents 面（L3114） | ✓ 全对 |
| L174 锚位 | `HOST_RENDER_REGISTRY: dict[str, HostRenderSpec] = {` 实在 L174 | ✓ |
| 三面目标 | copilot→`.github/agents/`+`.agent.md`/claude→`.claude/agents/`+`.md`/claude-session→`.claude/compass/`+`.session.md`（L174-219） | ✓ |
| §三 JSON 字段形 | scope_specific.counts 六键（L1629-1636：created/updated/skipped_identical/skipped_dry_run/derived_identical/derived_drift）+items action 枚举（L287-295+L309-310，另含 error，runbook 省写可接受） | ✓ |
| 输出面 | `--format` choices=("json",) 唯一（L3069-3074）；人类可读报告 `file=sys.stderr` 多处实锚（L1458/3528/3564/3597…） | ✓ |
| §五 443 欠推 | sg bare 核验拓扑与在案路由一致 | ✓ |
| 断言① 根因 | **summary 吞 drift=设计行为**——L1582-1591 注释原文：derived_* 两 action 均计入 skipped「so the ADE invariant total == changed + skipped + errors holds」；runbook 定性「假全绿陷阱+items 层解法」口径正确 | ✓ |

今晚读数交叉自洽：41 件 updated = claude 14+copilot 14+session 13 ✓；summary changed 0/skipped 19 = 14 derived_drift+5 derived_identical ✓。

## 二、勘意增补三条（候 COS 随更，非阻级）

1. **「19 entries」语境须钉死**：目录物理实盘=**22/22/13**（本席 ls 实勘 21:4x）——19=管线 manifest 处理 entries 数（与今晚 14+5 自洽），22=目录件数含 2 旧名残留双胞胎（company-governance-registry、tri-metaverse-code-registry）+1 待勘差件。§一建议标注两语境（「manifest entries 19；目录物理 22 含正名残留」），防执行者拿 22 对表 19 误报差。残留双胞胎本身入 143 行正名族批次窗清单（在案不新增）。
2. **status 字段同病补注**：L1600 `"status": "fail" if errors else "pass"`——status 仅看 errors，derived_drift 不入 errors，**drift>0 时 status 仍=pass**。断言① 点名了 summary 层，建议补半句「status 字段同不可单信，drift 真值唯一权威=items[].action 统计」。
3. **§三 读数形样板微勘**：「Derived(ok) 5」为卷面口语形非 JSON 字段名（正形=derived_identical），样板保持但可加括注防新执行者按字面 grep。

## 三、长期修法技术约束（§六候办采纳时生效，本席 owner 裁）

**候办「drift 出 skipped 单列」禁动顶层 summary 四键**——技术依据两条：

1. 顶层 `summary{total,changed,skipped,errors}` = ADE 契约不变式面（L1585 注释明示 total == changed + skipped + errors）；
2. 下游多 envelope 聚合器按四键 sum（L2281/2288 `sum(env.get("summary",{}).get(key,0)…)`），动顶层语义=聚合器连带改+历史卷读数断代。

**最小修正形（本席裁向）**：status 判定扩容一行——`"status": "fail" if errors else ("pass" if derived_drift == 0 else "drift")` 或等价 drift>0→非 pass 形。假全绿根治、零聚合面破坏、scope_specific.counts.derived_drift 本就单列在位（L1632-1633 现成键）。修时随更 runbook §三 status 枚举+刷新 lastSyncedAt（维护链照 §六）。候 10-06 攒批炉排程采纳，排程前消费防线=runbook 断言① 照走。

## 使用依据

- COS 技审请（21:48）+CAO 转技审令（21:48:38，定位核绿放行五点）
- runbook 本体 @ 9a47a35 全读；source_publish_check.py 实勘：L174-219/L1582-1591/L1600/L1625-1636/L287-310/L3040-3115/L1458+/L2266-2296
- 渲染位三目录 ls 实盘（22/22/13）；今晚 COS 炉读数（41=14+14+13）交叉自洽
