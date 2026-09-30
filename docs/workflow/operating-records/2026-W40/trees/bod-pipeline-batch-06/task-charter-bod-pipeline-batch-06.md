# 任务书·BOD 流水线批次 06（改指落点重勘·只读单件）

- sourceOfTruth: 本件（CEO 22:48 流水线不停令+batch-05 件 1 裁决点 #3 供弹链；BOD 铸发）
- syncMode: final
- lastSyncedAt: 2026-10-01 06:3x +0800
- 执行位: m-duty-cos（值席）
- 任务书纯净性自检: 只读勘证单件（裁决面归 12-14 窗）✓

## 件 1·8460 新形态改指落点重勘（派值席，只读）

- 背景: batch-05 裁决点 #3=「sg env 无 TRIMODEL_API_URL+主路由已易位 8460 代理面——改指落点按 8460 新形态重勘后定（settings 面或 env 面二择一）」。M2 执行单原假设（3334→3333 链）两度过时，本件把窗内 #3 裁决的对表材料勘齐。
- 干什么: ①勘 settings.json 主路由链现势全貌（8460 面入参出参/模型路由键/GLM-5.3-Flash 绑定关系）②「改指 R-HY」在 8460 形态下的两个落点方案对照——方案 A=改 settings.json ANTHROPIC_BASE_URL 直指 R-HY（绕开 8460）／方案 B=8460 代理面后端改指 R-HY（保留代理层）——逐方案列：改动点/影响面/回滚锚/对 duty-env 的连带③两方案对 M2 验收锚（会话可用性）的满足度对照④8460 代理面（bigmodel h1，pid 2029747）本身的服务形态勘（systemd unit 名/重启影响/是否常驻锚）。
- 验收锚: `trees/bod-pipeline-batch-06/repoint-landing-recheck.md`：两方案对照表+建议倾向+连带清单。
- 边界: 只读；禁改 settings/禁重启代理；密钥面脱敏（指纹形）。

## 收口纪律（同前批）

- 卷落本树目录；NOTIFY 收口广播；零敏感值出机。
