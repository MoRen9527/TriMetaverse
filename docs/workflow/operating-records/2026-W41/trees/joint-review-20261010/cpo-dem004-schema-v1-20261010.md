# CPO 定稿卷 · DEM-004 读数行 schema v1＋口径五要素（联审承接点②·一期施工前交付）

- sourceOfTruth: 本件（trees/joint-review-20261010/cpo-dem004-schema-v1-20261010.md）
- syncMode: final
- lastSyncedAt: 2026-10-10T12:05:19+0800（周六，date 现查）
- 定稿席: CPO 小乔（m-cpo·度量域定义权+口径权）
- 受理链: 10-10 联审三席一致裁（DEM-004=进方案+daemon 化一期本周排窗）→ COO 毕回执承接点② → 本卷
- 消费位: FSD 施工（读数步落盘结构）/CFO 阈值正身对表（三线数值域）/CTO 门禁验收（锚⑤判法）

## 摘要（大白话）

glm-quota-obs.jsonl 每行一 JSON 对象，四组字段：**身份组**（时戳+行 id+schema 版本）、**口径五要素组**（面/服务域/账户/模型/用量基数口径——LG-036 双口径失真防复发核心，其中「用量基数」一项是本 schema 的灵魂字段）、**读数+三线比对组**（含阈值快照——阈值调了历史读数不失真）、**交割组**（重置日终值行↔基线行互指，支撑锚④成对断言）。硬规矩两条：账户字段禁明文 key（值面教训在卷）；五要素全必填（锚⑤完整率 100% 的判法定义）。

## 一、读数行 schema v1（字段全表）

```json
{
  "row_id": "obs-20261010-0930-01",
  "schema_ver": 1,
  "ts": "2026-10-10T01:30:04Z",
  "source": "bigmodel-usage-api/<endpoint>",
  "plane": "M",
  "service_domain": "local",
  "account": "<账户名或尾指纹8位，禁明文key>",
  "model": "glm-5.3",
  "metric_basis": "provider",
  "quota_used": 42,
  "quota_total": 100,
  "usage_window": "weekly",
  "thresholds_snapshot": {
    "observe_weekly": 70,
    "warn_pace_daily": 15,
    "pause": 30,
    "watch_5h": 70,
    "slowdown": 90,
    "asof": "2026-10-10T00:00:00Z"
  },
  "line_status": {
    "observe": "normal",
    "warn": "normal",
    "pause": "normal"
  },
  "breach": false,
  "reset_flag": false,
  "pair_ref": null
}
```

字段语义逐条：

| 字段 | 类型 | 必填 | 语义与规矩 |
| --- | --- | --- | --- |
| row_id | string | ✓ | 唯一 id=`obs-<日期>-<时点>-<序号>`；缺行检测锚①的计数单元 |
| schema_ver | int | ✓ | 版本化：schema 演进不破坏旧读数可读性，v1 起 |
| ts | string | ✓ | 采集时点 ISO 8601 UTC Z（job 触发时刻，机写禁手填——幻觉时点防线同源） |
| source | string | ✓ | 数据源标识（API 端点名），读数可溯源最低要求 |
| **plane** | enum(M/R) | ✓ | **五要素①**：面 |
| **service_domain** | enum(local/svc) | ✓ | **五要素②**：服务域 |
| **account** | string | ✓ | **五要素③**：账户名或尾指纹——**禁明文 key**（值面字段禁进打印路径教训，观测文件两腿分离不入 git 但仍守此线） |
| **model** | string | ✓ | **五要素④**：模型标识 |
| **metric_basis** | enum(provider/transcript) | ✓ | **五要素⑤·灵魂字段**：用量基数口径——LG-036 在卷（两空间实测比 1.74-2.17×，基数口径不标=读数废）；本观测一期取 `provider`（CFO 定价基数=provider 侧实测后台锚定口径一致） |
| quota_used / quota_total | int | ✓ | 用量值，整数粒度取整口径（照 CFO 输入） |
| usage_window | enum(weekly/daily) | ✓ | 用量窗口标识（与三线各自的窗对齐） |
| thresholds_snapshot | object | ✓ | **当时**三线阈值快照+生效时点 asof——阈值调整后历史行仍可按当时阈值复算，判读不漂 |
| line_status | object | ✓ | 三线各自状态（normal/warn/breach） |
| breach | bool | ✓ | 触线总标志（任一线 breach 即 true——notify 触发的判据字段） |
| reset_flag | bool | 重置日 | 重置日交割行标志 |
| pair_ref | string/null | 成对行 | 终值行↔新窗基线行互指（row_id），锚④成对断言的判据字段；非重置日=null |

## 二、口径五要素定稿（对齐 CFO 成本读数同源纪律）

**「面+服务域+账户+模型+用量基数」五字段全必填**——缺任一=行无效（锚⑤判法=全字段非空断言，完整率 100%）。

- 与 CFO 接口同键：CFO 成本读数按「面+服务域+账户+模型」四元键供给——本观测加第五要素 `metric_basis`（用量基数），因观测对象（套餐额度消耗）比成本读数多一层基数口径分叉（provider 实测 vs 转录侧读数，LG-036 在卷）。
- 一期取值纪律：`metric_basis` 一期恒为 `provider`（与定价基数口径一致）；若未来加转录侧监控读数，**必须另起行**（不同 basis 不同行），禁同行混载两口径。

## 三、验收锚判法落地（五锚对表初判卷，本卷补判据字段）

| 锚 | 判法（本卷定稿） |
| --- | --- |
| ① 连续 N 日落卷零缺行 | 按 row_id 日期段计数断言，N=7 待联审终定（本席建议值在卷） |
| ② 触线注入即报 | 构造 breach=true 测试行 → notify 端到端到达 |
| ③ 急查时效 | 现跑脚本返回 ≤X 分钟（X 联审定） |
| ④ 重置日交割成对 | 同日 reset_flag=true 两行 pair_ref 互指断言（字段级可判） |
| ⑤ 口径完整率 100% | 五要素+ts+quota_used 全非空断言（schema 字段级判，逐行机扫） |

## 四、施工注记（给 FSD/CTO 面，两行）

- thresholds_snapshot 的阈值数值域候 CFO 卷面正身，施工先落结构、数值由配置/常量注入，禁硬编码进读数行生成逻辑（阈值调整不改代码）。
- ts 机写（date 注入）禁手填；jsonl 落 8713 运行数据目录（CFO input①·两腿分离不入 git）照旧。

## 使用依据

- 联审三席一致裁+COO 毕回执（DEM-004 进方案·承接点②归本席）
- 本席初判卷 cpo-dem004-pre-assessment-20261008.md @206f3389（五锚+口径五要素提案）
- CFO input 信面（JSONL 落点+三线阈值结构；数值候正身）
- LG-036 双口径纪律（metric_basis 灵魂字段依据）+值面字段禁进打印路径教训（account 字段规矩）

—— CPO 小乔，2026-10-10 12:05 +0800（定稿毕零施工；schema v1 生效待 FSD 施工消费，v2 演进走 schema_ver 版本化）
