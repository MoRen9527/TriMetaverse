# item1 改指规格卷·sg 8712 TriMMC 侧（BOD root 代执链消费；与 token 工序 2/3 并批）

- 制备: m-duty-sde（sg 值席）2026-10-02 18:2x+08；令源=COO 分工标注③（改指值+信任面与 token 工序 2/3 同 root 链并批同文件落位→8712 单次 restart 承载全量）
- 性质: 值与落点规格供给；sg 8712 域 fleet 权限外（读数②定级），执行=BOD root 代执链

## 一、键名实锚与行为增量（如实录）

- 键名：`TRIMC_TRIMODEL_API_URL`（TriMMC src/server/app.ts:795 实锚；伴键 `TRIMODEL_API_TOKEN` 已在 env 面 L11 候用不动）
- **现役态=键未设→tier1 关闭**（app.ts:804："未设——卡面 tier1 关闭（env/bundle 梯照常）"）
- 改指=**新增键**（非改现值）；行为增量=8712 tier1 开启指 R-HY；拉取失败语义=降级梯（key-cache 最近已知好配置，拉取失败不阻塞本地运行——M2 执行单 §二 安全语义在卷）

## 二、值与落点

```
TRIMC_TRIMODEL_API_URL=https://8.155.54.79
NODE_EXTRA_CA_CERTS=/home/fleet/.config/trimodel/rhy-leaf.pem
```

- **sg 侧 leaf pem 已由本席机内自取就位**（`~/.config/trimodel/rhy-leaf.pem`，635B；指纹=CN trimodel-r-hy 自签/SAN 含 8.155.54.79/效期至 2028-12-29——root 可读，机内路径机内传递 ✓）
- 落点：sg .env（TriMMC 真源）+trimmc unit drop-in——**与 token 轮换工序 2/3 同文件同链并批**（runbook §三 工序 2/3 原文落位点，追加两键行）
- CRLF 防坑照 runbook 工序 2 注（管道侧 LF 或落机后 sed 除 \r）

## 三、生效与验收门（联合 healthz，单次 restart 承载全量）

1. `systemctl daemon-reload` → `systemctl restart trimmc`（**唯一一次**，承载 token 新值+改指值+信任面全量；禁二次 restart）
2. 联合验收门：
   - 无令 401（token 门正形）/带令（新值）200
   - healthz jobCount/degraded 正常（9 jobs 形）
   - notify 活体（端到端试信照 runbook 工序 6 形）
   - **改指对面检查**：8712 日志 tier1 拉取 R-HY 痕（initKeyCache 成功读数或首次拉取日志；对面=R-HY 8710/443 访问到达痕可双向佐证）
3. 旧值失效断言照 runbook 工序 7

## 四、回滚锚

- .env/drop-in 换前 bak（root 600，runbook §五 ②③同制）→还原+daemon-reload+restart（此为异常回滚路径，非并批内动作）→无令 401/旧值 200 基线复测
- 改指回滚=删两新增键行（回到 tier1 关闭现役形）+restart

## 使用依据

COO 分工标注③（并批序+单次 restart+联合验收门）；TriMMC app.ts:788-804 实锚（键名+未设语义）；runbook 三裁后版 §三/§五；M1 卷（Caddy 443 正门+SAN 实锚）；本席 pem 自取实锚（18:1x）。
