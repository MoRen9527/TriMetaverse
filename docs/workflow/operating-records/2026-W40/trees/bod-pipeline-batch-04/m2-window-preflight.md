# M2 部署主窗（10-01 12-14）前置勘证卷·三组（件1 只读）

- 执行: m-duty-cos 1001 05:1x+08；勘证对象=LG-054 M2（daemon 改指 R-HY cutover，执行单 TASK-TRIMODEL-M2-CUTOVER-01/e0663eac 系）
- 时点: 全部读数 2026-10-01 05:0x-05:1x+08 现采

## ①在役版本态

- trimc: active（09-30 20:47:51 CST 起），**r15-1-4** dist production form，8712 loopback 在听，cron 9 jobs degraded=False
- 现役模型路由: settings.json `ANTHROPIC_BASE_URL=http://127.0.0.1:8460/api/anthropic`（8460 代理面）+ `ANTHROPIC_MODEL=GLM-5.3-Flash`；duty-env ANTHROPIC_BASE_URL 亦设（值指纹略）
- R-HY TriModel: M1 交付锚=e9938cc（河源升级+强钉三 env，P1 链 496613b 验证在卷）

## ②环境前提

- 磁盘: / 与 /home/fleet 各 21G free ✓
- 端口: 8712 在听 ✓（新主控面）；cron 9 jobs degraded=False ✓
- 权限: settings.json 属主 fleet 可写 ✓（cutover 写面就绪）
- **R-HY 面: ⚠️ 异常**——8710 healthz+cron jobs 双面空回（5s/12s 双超时档；昨夜尚可达=not_found 响应可证）——**daemon 改指目标宿主面健康前提存疑（缺项）**；sg 无 SSH 凭据，API 降级面亦空回=本席勘证通道到此为止，候 heyuan 面通道核（R4 本地电量暂停与 heyuan 两机无涉）

## ③回滚锚盘点

- settings.json.bak-* 三件在位（20260813-144316/09-16T1259Z/ox-alpha）+现值 md5 前 12 位 `9e5aee98623f` 留痕（cutover 前对表基线）
- LG-041 ③ restore-claude-config.ps1+direct.json 预设（TC 8a5b630）=切回工具在位（dev 侧执行形，sg 侧经 m-cos 通道）
- git 回退点: 各配置面 commit 均在 dev 线可 revert

## 缺项清单

1. **R-HY 面可达性**（M2 硬前提，缺）——双面双超时空回，候 heyuan 面通道勘（BOD SSH 或 TriRMC 对端代理面）
2. TriModel 河源版现势健康读数（依赖缺项 1 解）
3. M2 执行单候修 5 项之第 5 项（sg TriModel 断链三合一）与本卷所测 8460 路由面对表关系——候 M2 窗内裁决
