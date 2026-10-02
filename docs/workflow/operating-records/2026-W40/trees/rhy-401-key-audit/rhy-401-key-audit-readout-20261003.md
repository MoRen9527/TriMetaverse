# FSD·R-HY 401 两键分勘读数单（10-03 01:4x 黄金窗·COS 派·CEO 01:38 令）

- sourceOfTruth: 本件（FSD R-HY 401 勘验卷；令源=COS 01:39 派工令（CEO 01:38「轮换不急、勘验先走」经 BOD 转录））
- syncMode: static（三勘面全毕；修复面两写操作候另窗）
- lastSyncedAt: 2026-10-03T01:52+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）
- 纪律执行: 只读勘验零写操作 ✓（零配置改零重启零轮换）；零敏感值出机 ✓（全程指纹形 len+head4+tail4，b64 传脚本防引号+值面零回显）

## 勘验①：两键现役形态

### TRIMODEL_API_TOKEN（门面 token）——两端形态对表

| 端 | 配置位（文件+行位） | 形态指纹 | mtime |
| --- | --- | --- | --- |
| R-HY 门面（trimodel.service，pid 1669514） | `/srv/fleet/trimodel-data/api-token.env` **L1**（unit EnvironmentFile 实锚） | len=64 head4=[3608] tail4=[cee7] | **2026-09-27 19:58(+8) 定值后未变** |
| 本机 M 面 TriMLC（8713，pid 22556） | `C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd` **L11** | len=64 head4=[a5cb] tail4=[13a7] | （启动器面） |

**两端不同（3608..cee7 ≠ a5cb..13a7）=401 根因实锚**。同 env 文件另有 TRIMODEL_ADMIN_TOKEN（L2，len64 f68d..a775，管理面另值）；进程活体 env（/proc/PID/environ 键名扫描）与文件面四键一致（TRIMODEL_API_TOKEN/ADMIN_TOKEN/ANTHROPIC_API_KEY/ANTHROPIC_BASE_URL）。

### GLM_API_KEY（上游 key）——R-HY 门面**零持有**

- 门面进程活体 env 键名扫描（tr '\0' '\n' | cut -d= -f1）：**无 GLM_API_KEY**；
- 代码引用面：`TriModel/src/anthropic-proxy.ts` **L53** `apiKeyEnv: 'GLM_API_KEY'`（GLM-5.3/GLM-5.3-Flash 模型匹配条目，baseUrl=bigmodel anthropic-compat，L51 注记「见 .env.example 注释行」）；
- 文件面：grep 全仓命中皆文档/测试/bak 形（.env.example=模板非活值），**无现役活值配置位**；
- trirmc-mc 进程（pid 1670411）env 键名同样零持有。
- **定性：R-HY 门面 GLM 上游转发链缺 key（独立缺件）**——非本 401 因果（见②），候 sg 门面对照勘+补齐窗。

## 勘验②：401 错误族分诊

**定性=门面 token 不同步族（配置漂移），非 1210 指纹族非 1310 配额族**。

门面事件流实证（`/srv/fleet/trimodel-data/face-events.jsonl`）：

| 面 | 结果 | 读数 |
| --- | --- | --- |
| face=**mlc**（本机 TriMLC 8713 poller） | pull **denied** 92 条 | **最早 2026-10-01T16:49:36Z**（北京 10-02 00:49）→最新 10-02T17:34:26Z（北京 01:34，勘验当下仍在发生）；首两条密集两连（16:49:36/16:51:47）后转 15 分钟节奏（poller cron 化） |
| face=**rmc**（R-HY 本机 TriRMC-mc） | pull **ok** 持续 | 同窗 15 分钟节奏全 ok（entries=3，最新 10-02T17:34:32Z） |

- 同一门面、同一校验链：**rmc ok + mlc denied 并存**=门面 token 本身正常，**唯 mlc 侧持值漂移**——根因单向实锚（排除门面侧故障）。
- 背景锚「信任面 TLS 已通、token 门未放行」与本勘一致（TLS 层无异常记录，拒因 detail=`pull auth rejected` 纯授权层）。
- 漂移引入窗候勘（不在本件三项内，列附录）：门面 token 9-27 19:58 定值；mlc denied 始于 10-01T16:49Z（北京 10-02 00:49）——本机启动器 L11 现值 a5cb..13a7 的写入时点候 channel.cmd 历史形勘（10-02 M2 落位件/COS 还原笔在案关联）。

## 勘验③：门面-上游键链路对应

```
[R-HY 门面 trimodel.service (8443?)]
  入口闸: TRIMODEL_API_TOKEN ←—— 跨机 pull 客户端 Authorization
            ├─ face=rmc（R-HY 本机 TriRMC-mc）：持值匹配 → ok
            └─ face=mlc（本机 M 面 TriMLC 8713，经 TRILC_TRIMODEL_API_URL=*.*.*.54.79）
                                      ：持值漂移 → 401 pull_denied（92 连）
  管理面: TRIMODEL_ADMIN_TOKEN（另值，admin API）
  出口（上游转发）: GLM_API_KEY ←—— anthropic-proxy bigmodel 转发（matchModels GLM-5.3*）
            └─ R-HY 门面现役未配置（进程 env 零持有）=GLM 上游缺 key 缺件
```

- 一进一出**互不引用**：TRIMODEL_API_TOKEN 管入口授权，GLM_API_KEY 管出口上游转发——两 token 401 无因果关联。
- 本机启动器关联键（channel.cmd，指纹面）：L10 TRIMC_INTERNAL_TOKEN 与 L17 TRIMC_NOTIFY_SG_TOKEN 同值（4842..4aa5，sg TriMMC 8710 门）——与门面 token 独立三族，无混淆。

## 修复候裁（两写操作，本件禁做，候另窗）

1. **mlc token 同步**：本机 `trimlc-daemon-channel.cmd` L11 同步为门面现役值（从 R-HY api-token.env L1 取完整值）+TriMLC 8713 重启（进程 env 持旧值，改文件不重启不生效——重启窗纪律照 D-04/进程内生效验证）。
2. **GLM_API_KEY 补齐**：候 sg 门面对照勘（sg 形有/无）后定补齐窗（api-token.env 增行+门面重启）。
3. **漂移引入时点候勘**（可选附录项）：channel.cmd 历史形对照。

## 使用依据

- COS 01:39 派工令（CEO 01:38 令经 BOD 转录）；勘面三项+两硬纪律
- 实勘证据：R-HY systemctl cat/api-token.env 指纹/两进程 /proc environ 键名/face-events.jsonl 时间线（92 denied+rmc ok 对照）/anthropic-proxy.ts L40-62；本机 Get-NetTCPConnection 8713→pid 22556→cmdline→channel.cmd 指纹
- 关联在案件：cmd 批文件 CRLF 件候办（本件即其勘验段）；10-02 工序1' TRIMC 族三落点换新（本机 TriRLC 门，非 R-HY 门面门，两门两 token 勿混淆）
