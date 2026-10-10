# 栏 C 前置件 · R 面 token 分发漂移族勘验路径+掩形工具（CTO）

- sourceOfTruth: 本件（trees/1011-window-family/cto-window-c-token-drift-survey-plan-20261010.md）
- syncMode: static
- lastSyncedAt: 2026-10-10T15:02:50+08:00（date 现查原值）
- 立案源: S3 窗技术收口卷 §二.1（三症状同根：mc_link degraded 4 天+两机 token 非同值+R-HY 401 pull_denied）
- 时段: 10-11 日间弹性·勘验零写面·开窗前报备 COO

## 一、勘验目标（一问定断点）

**R-HY TriRMC 8710 认的 channel/heartbeat token 指纹=？** 与两已知锚比对定分发链断点方向：

| 锚 | 指纹（掩形） | 来源 |
| --- | --- | --- |
| 本机 trirlc-daemon.env `TRIMC_INTERNAL_TOKEN` | len=64·sha8=d50a0760·tail4=e075 | SDE 毕报 §六分线②（14:3x 实勘） |
| sg TriMMC channel token | len=64·tail4=4aa5 | STE 锚卷 cto-final-acceptance §三.2 |

## 二、勘验路径（三路·全程零写面）

- **路1（主路）R-HY fleet 只读**: `ssh heyuan`（别名形）——`systemctl show trirmc -p Environment` + env/unit 文件面键名扫描（`/etc/systemd/system/trirmc*` 系+TriRMC env file）→ 命中 token 键后**只取 len/sha8/tail4 三掩形**。
- **路2（旁证）401 响应体形读**: 本机带 token POST R-HY 8710 heartbeat 复现 401，读响应体错误文案前缀（unauthorized 细分形——missing vs invalid vs unknown-token，区分「无此键」与「键在值错」）。
- **路3（拓扑补全）sg 面现值复核**: sg TriMMC 认的 channel token 现值指纹（4aa5 现值复核+GET/POST 分叉面只读观察）——sg 面深勘本体归 BOD/值席通道（SDE 卷已注「403 GET-POST 分叉本体在 sg 面不可本机勘」），本席只取对表锚。

## 三、判定分支树（勘毕即出定性）

- **分支 A**（R-HY token==e075 同值）: 值同而 401→因在**头格式/路由/门实现面**（非分发漂移）→转 401 响应体形读细勘（路2 加权）。
- **分支 B**（R-HY token≠e075）: **分发漂移实锤**→修向=以本机 envfile 为权威源，R-HY+sg 两面登记同步（掩形传输）→**勘毕另呈修复窗**（涉变更不入勘验窗·零写面恪守）。
- **分支 C**（R-HY 侧 token 键不存在）: 「无此键」型→TriRMC 门配置缺登记（非漂移是缺配）→修复同 B 向（登记面）。
- 每分支勘毕两件并案销项评估（BOD 并案注记：与 R-HY 401 复核同根）。

## 四、掩形工具行（值面零回显红线）

```bash
# 值面只出 len/sha8/tail4 三掩形（grep 命中行禁直接回显）
grep -h "TOKEN" <env-file> | awk -F= '/TOKEN/{v=$2; print $1" len="length(v)" tail4="substr(v,length(v)-3)}'
# sha8 需要时：
printf '%s' "$TOKEN_VALUE" | sha256sum | cut -c1-8   # 值经变量传递不落 log/树
```

- 纪律: token 值面不进任何会话输出/log/树（len/sha8/tail4 三掩形 only·照 SDE 卷 C6/E 区守形）；trimc cron 日志 token 嵌 header 教训同守（tail 前滤 `^command:` 系）。

## 五、边界

- 勘验零写面（只读命令族 systemctl show/grep/awk/sha256sum/curl 只读探）。
- 修复动作（登记同步）**不入本勘**——勘毕定性+修向另呈修复窗候排。
- sg 面深勘+跨机修复施工=候值席/BOD 通道（本席本机+R-HY fleet 只读为勘验域）。

——CTO 小狄，路径清单毕。
