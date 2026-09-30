# 8460 新形态改指落点重勘卷·两方案对照（batch-06 件1 只读）

- 执行: m-duty-cos 1001 06:4x+08；供裁决点 #3（settings 面或 env 面二择一）
- **8460 面定性突破**：proxy.mjs 头注自证=「BigModel H1.1 downgrade proxy（2026-09-09/10 事故缓解）」——根因=bigmodel 网关边缘（aliyun GA）按客户端 TLS 指纹（Bun/BoringSSL）拒 claude CLI（400 [1210]），本代理终结 loopback HTTP 后经 node（OpenSSL/HTTP1.1）**重发至 UPSTREAM=open.bigmodel.cn**。即：8460=**bigmodel 专用的 TLS 指纹规避 shim**，非账户/模型路由器——对 R-HY（node 服务，无 bigmodel 边缘）该存在理由不成立。

## 服务形态勘

- unit=**bigmodel-h1-proxy.service**（loaded/active/enabled，描述自带 TLS 缓解定位）；proxy.mjs UPSTREAM 为源码常量（非 env 可调）——方案 B 改后端=改源码+重启。

## 两方案对照

| 维度 | 方案 A：settings 直指 R-HY | 方案 B：8460 后端改指 |
|------|--------------------------|---------------------|
| 改动点 | settings.json 1 行+duty-env 1 行（ANTHROPIC_BASE_URL→https://8.155.54.79） | proxy.mjs UPSTREAM 常量+可能 header/鉴权映射改造+服务重启 |
| 影响面 | sg 全 claude 会话（模型切换为 R-HY 卡面 effective 模型=deepseek-v4-pro 系，即 M2 全时段切换本意） | 同左（透传切换）+8460 shim 永久耦合非 bigmodel 目标（架构债） |
| TLS/鉴权风险 | 直连 R-HY node 服务，无 bigmodel 边缘指纹拒面；鉴权=claude 头对 R-HY token 门（M2 读面鉴权裁联动） | shim 重发保留 claude 原头（bigmodel 形）→R-HY 鉴权面**可能不认**，需验或改造（新增工作量+风险点） |
| 回滚锚 | settings.json.bak 链+duty-env 原行（两行回退，秒级） | git revert proxy.mjs+服务重启（分钟级，且依赖 shim 进程健康） |
| 常驻锚 | 不新增依赖（8460 可退役或留作 bigmodel 直连备用 shim） | 会话关键路径永久挂靠事故缓解 shim（单点+进程形态弱锚） |
| M2 验收满足度（会话可用性） | **直满足**（改指即会话面切换） | 满足（透传）但多一层故障面 |

## 建议倾向

**方案 A（settings 直指 R-HY）**——理由：①B 的唯一优势（多消费透明切换）在本域不成立（消费面=claude 会话族，settings 单源）；②A 回滚最短路径（两行 bak 链）；③B 把会话关键路径永久绑在事故缓解 shim 上（其存在理由对 R-HY 不成立）＝负架构价值；④A 天然绕开 bigmodel TLS 指纹问题（R-HY 无该边缘）。

## 连带清单（方案 A 落地时同窗必办）

1. settings.json+duty-env **双面同窗换**（防双源分叉——duty-env 值形候细勘，已入连带清单）
2. 8460 shim 处置裁：退役（enabled→disabled）或留作 bigmodel 直连备用（GLM 重置 09-30 后 GLM 刚需场景候用——**建议留役备用不退役**）
3. R-HY 读面鉴权形态与 claude 头匹配验证（M2 议程锚定项联动）
4. 回滚两行预写备妥（bak 链已核：三 bak 在位+md5 基线 9e5aee98623f）
5. 前置依赖：R-HY 可达恢复（batch-05 链头，8710 缺项插入门）——两方案共同前置
