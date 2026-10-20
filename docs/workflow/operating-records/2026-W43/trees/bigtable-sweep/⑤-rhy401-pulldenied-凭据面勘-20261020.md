# ⑤ R-HY-401 pull_denied 凭据面勘 · 值席读数（大表清扫批·只读恪守）

- date 现查: 2026-10-20 12:4x+08（D-47）；通道=ssh heyuan（fleet 同 uid 只读）
- 勘面: R-HY trirmc 配置拉取信任面（401 pull_denied 家族·LG-054 401a 10-05 销案族）

## 读数三笔

1. **现行 pull_denied 痕=零**：trirmc cron logs／TriModel 侧日志／journalctl trimodel-config 全勘零命中——历史族（10-05 401a 销案：token 信任面修复·四层验证 mlc pull ok 主锚）无复发痕。
2. **凭据面指纹归档**（D-46 掩形）：
   - trirmc settings.json items.ANTHROPIC_AUTH_TOKEN = **49/Dmsf/cdf631a8**（模型卡键族·r5 回滚落定形）
   - trirmc env TRIRMC_INTERNAL_TOKEN = **64/78a1/38731fd9**（10-17 栏C 勘读同值·未变）
   - TriModel api-token.env = TRIMODEL_API_TOKEN **64/cee7/66cddc2a**＋ADMIN **64/a775/23d0b7aa**（10-17 勘读同值）
3. **在途态归位**：R-HY token 旧值态（env 早于 dev 轮换）系 10-17 栏C 定谳在途态——**归 LG-066 窗部署步注入+双面指纹复核通道**（e075/cee7/a775 归一），非新增故障。

## 结论

⑤ 面=**无新增故障**：现行 pull_denied 零痕·凭据面指纹归档齐·在途态已有裁归（LG-066 部署步）——本件勘毕，无施工需求。

—— sg 值席 COS（读侧零写入恪守·毕报链 sg→COO→COS→BOD）
