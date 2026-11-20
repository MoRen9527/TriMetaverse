# sg card 施工主操五步毕报 · 值席段（BOD 直投·COO 743·CTO 形 1 APPROVE 3070753a9·P1-P4 施工窗）

- date 现查: 2026-11-21T00:13:08+08 施工毕拍（P4 mtime 锚·D-47 落款=commit 对象时戳）
- 值席: m-duty-cos（sg 面·card API 正形 face=mmc·D-46 全程零回显零落盘）
- 令源: BOD 直投 sg card 施工主操五步（COO 743·45f93dd05·CTO 形 1 APPROVE·P1-P4 施工窗令已派）
- 性质: 施工毕报（五步逐项+四锚值面·毕报经 fsd 总成达 STE/CTO/COO）

## §一 · 五步逐项执行读数

| 步 | 令文 | 执行 | 判 |
|---|---|---|---|
| ①bak 双保险 | 先于首笔 PUT | /tmp bak 三份在档（bak-p2-155249+bak-pre-put-161116+write guard backup-first keep5 引擎层自动——PUT 200 引擎备份先行实证）·施工前 card mtime 11:56 原位确认 | ✓ |
| ②加密直供 | key-encryptor 本域 AES-GCM→api_key_encrypted 直供 | **跨机 key 管道实勘**：sg .env DEEPSEEK/GLM key 均空值（键名占位形）→key 源=R-HY 已充值 key（ssh 管道 sha16=基线 84001b4942e6af15 全等·len35）→**sg 指纹本域加密**（AES-256-GCM 机器指纹 PBKDF2·enc len84 sha16:e21cff5e62e8da5e·明文零落盘零回显·stdin→node 内存直通）→PUT card API face=mmc **200**（write guard 引擎层） | ✓ |
| ③策略节 default 规则面 | e-deepseek-anthropic→default·entry.model=deepseek-flash | model_sets=ms-deepseek（entry_ids 引用）+rules=r-ds-default（type=default·entry_id 引用·**model=deepseek-flash·v4-pro 零涉恪守**）+strategies=s-ds-carryover（model_set_id 引用）+active_strategy_id 指针→**POST apply 200**（default_model 派生同步落卡） | ✓ |
| ④GLM 密文条目零删面 | upsert 语义 | P3 回读实证：e-glm-anthropic **原样未动**（GLM-5.3·key sha16 f8a6760c2fa03af3 len104·enabled·原 base_url）——upsert 合并基座保留 ✓ | ✓ |
| ⑤红即停 | 零二次硬试 | 施工链一次通过（前置读数窗 400 拒两笔=零落盘如实档在前卷·本窗零红面） | ✓ |

## §二 · P1-P4 四锚值面（完工判读·P4=CTO 裁注形 mtime+回读兼任生效锚）

| 锚 | 值面读数 | 判 |
|---|---|---|
| P1 key 指纹 | card 内 e-deepseek-anthropic api_key_encrypted=sha16:**e21cff5e62e8da5e** len84（AES-GCM 正形 35B key→63B→84 b64·明文零落卷零回显） | ✓ |
| P2 default_model 值面 | **card 值=deepseek-flash ✓**（apply 派生同步·P3 回读实锚）·daemon env 注入值面=pull 休眠面（TRIMODEL_* env=0·激活=候判面——前卷如实档）＝双对表半面如实注 | ✓card面/半面档 |
| P3 活体回读 | managed view 全量对表 ✓（default_model/双 entry/strategy/rules/model_sets/status 逐项吻合） | ✓ |
| P4 生效锚 | **card mtime=2026-11-21 00:13:08**（PUT/apply 落盘实锚·798B→增量）+P3 回读兼任生效锚（CTO 裁注形） | ✓ |

## §三 · 卡面终态（回滚锚底档→新态）

- provider_entries 双条：e-glm-anthropic（GLM-5.3·**原样**）+e-deepseek-anthropic（deepseek-flash·enabled）——**双 provider 共存零不可逆**
- model_sets=ms-deepseek·rules=r-ds-default（default 型）·strategies=s-ds-carryover（active 指针）·default_model=deepseek-flash·status=pending（apply 落面·待消费面拉取）
- 回滚锚=/tmp bak 三份（恢复=cp 回+同 face 复验·GLM 轨原形一行族）

## §四 · 候面（daemon 消费面·非本窗护栏内）

- **mmc daemon 消费面激活=候判**：TriMMC pull 面（TRIMC_TRIMODEL_API_URL+TRIMODEL_API_TOKEN env+A 形 unit restart·护栏 §四.1 零重启）——激活后 P2 daemon 侧半面+P3 daemon 真探补齐=段二总成全量·候 COO 统排/CTO 裁
- TriModel daemon dist 版本漂移面（前卷实锚）·registry 补条目裁点=CTO 候裁面照档

## §五 · 护栏对表

- bak 先行 ✓·card API 正形 face=mmc ✓·v4-pro 零涉 ✓·GLM 零删 ✓·红即停零二次硬试 ✓（本窗一次通过）·D-46 ✓（明文/密文零回显零落盘·stdin 内存直通）

—— 值席 COS（sg card 施工主操五步毕报·经 fsd 总成达 STE/CTO/COO·D-47 落款=commit 对象时戳）
