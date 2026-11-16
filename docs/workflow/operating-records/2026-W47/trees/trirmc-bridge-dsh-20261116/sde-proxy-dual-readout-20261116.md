# SDE proxy-dual 落装毕报（裁①本地代理布建形·DEEPSEEK 先行+GLM 槽 pending-key 形）

- sourceOfTruth: 本卷（proxy-dual 落装毕报正身·T1b 工程面续段）
- syncMode: write-time
- 施工席: SDE 小布；令源=COS CTO T1b 工程面形定两裁续行令（裁①proxy.mjs 移植四件承形+双后端路由/裁②dsh cordis patch 接线）
- 执行窗: 2026-11-16T12:5x-13:3xZ（UTC·=20:5x-21:3x+08）——**时戳勘正行（D-47）**：上卷 T1b 落款 12:4xZ=20:4x+08 同点对表无差·本卷续 UTC Z 形一致制
- 判定: **proxy-dual 落装毕（8682 listen·四件承形+双后端路由）·探针三读数=GLM 503 pending-key ✓/DEEPSEEK 上游 401 key invalid（值面源问题非通道问题）/健康面 ✓**

## §一 · 落装实录（四件承形逐项）

| 承形件 | 落装 | 凭据 |
|---|---|---|
| env-port 参数化 | DUAL_PROXY_PORT（默认 8682） | proxy.mjs L8 |
| upstream 键控 | pickBackend(model) model 族路由：deepseek 族→api.deepseek.com（Authorization Bearer 注入）/glm 族→GLM 槽 | proxy.mjs 路由面 |
| 600 key 文件 | /srv/fleet/proxy-dual/deepseek.key（600 fleet·35B——河源 TriModel/.env 自提取形） | 每请求读形（h1 同构） |
| log 面 | /srv/fleet/proxy-dual/proxy.log（ISO+method+url[backend]->status） | appendFileSync 形 |

- 部署位：/srv/fleet/proxy-dual/proxy.mjs（84 行·fleet 域零 root）
- **listen 实锚：127.0.0.1:8682**（碰撞核=前置零监听空位择定 ✓·nohup node 后台在役）

## §二 · 探针三读数（CTO 续行序③逐项）

| 探 | 读数 | 判 |
|---|---|---|
| GLM 槽 pending-key | `{"type":"error","error":{"type":"pending_key","message":"GLM upstream pending-key（值面候 CEO 供值·fail-visible 形）"}}` **HTTP 503** | ✅ **fail-visible 显式 503 落装实证**（非静默） |
| DEEPSEEK 活探 | **HTTP 401 authentication_error**——上游判 "api key: ****f738 is invalid"（尾 4 掩码） | ⚠️ **值面源 invalid（TriMMC/docker/.env 35 值被上游判无效——值面源问题非通道问题：proxy 转发形正确·401=上游鉴权面）** |
| 健康面 | 127.0.0.1:8682 LISTEN+进程在役 | ✅ |

## §三 · 判读与候裁

- **proxy-dual 形=落装毕**（通道面全绿：路由/键控注入/503 fail-visible/log 五面实证）
- **DEEPSEEK 值面=invalid key 实锚**（TriMMC/docker/.env 35 值=上游 401——**候值面重供**（DEEPSEEK 控制台新 key=CEO/管理员终端供值形·同 GLM 挂起族管道注入可复用——key 文件换装免重启形照 h1 先例）
- GLM 槽=候 CEO 供值（pending-key 503 显式面维持——供值到即 glm.key 600 落位启用）
- dsh cordis patch 接线=候 proxy 活 key 面（base_url=http://127.0.0.1:8682 形接线·key invalid 面下接线验证面=503/401 形如实——候值面供毕接线验证）

## §四 · 护栏遵行

零触 loop 链/零 daemon 重启（proxy=独立 node 进程非 daemon 单元·systemd unit 化候选注）/dsh 持久态零删/触发面熄火维持 ✓｜prompt/配置零密钥（key 600 文件面·配置零值面）✓

## 使用依据

CTO 两裁（裁①四件承形+双后端/裁②cordis patch 接线形）；h1-proxy 54 行实读（四件承形锚）；proxy-dual 实装 84 行+探针三读数实录=现采实锚。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
