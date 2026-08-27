# GLM 模型部署点位图 v1.0

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-27/glm-model-deployment-map.md
- syncMode: source-only
- lastSyncedAt: 2026-08-27（v1.2：四面 key 分发落地）
- 背景：ox-alpha 停服 → GLM（bigmodel.cn Anthropic 兼容端点）切换战役产物；编排层会话记忆升格为公司可读真源

> **v1.2（2026-08-27 午前，CEO 指令）**：按面分发 key——命名约定与落点：
>
> | face key 名 | 实例 | 落点 | 模型档 |
> | --- | --- | --- | --- |
> | `tmv-mm-face` | sg-server Claude Code（TriMMC） | `/home/fleet/.claude/settings.json` | glm-5.3-flash（spawn 编排档） |
> | `tmv-ml-face` | 本机研发仓 Claude Code（TriMLC） | `%USERPROFILE%\.claude\settings.json` | glm-5.3[1M] 主力档 |
> | `tmv-rm-face` | heyuan TriRMC+TriRLC daemon | `/srv/fleet/TriLC/.env` | glm-5.3-flash |
> | `tmv-rl-face` | 本机 TriLC daemon（pidfile `~/.trimetaverse/trilc.pid`，schtasks 系） | Windows 用户级 env（HKCU\Environment 三变量：API_KEY/BASE_URL/MODEL，setx 写入） | glm-5.3-flash |
>
> 四面全部端到端实测通过（GLM-OK/MM-KEY-OK/RM-KEY-OK/RL-KEY-OK）。限流韧性配套：TriModel provider 层 429/5xx 指数退避重试（1858f90，双服务器已部署）。**key 值不进任何 git 仓库**；本机 rl-face 的备用记录在 `~/.trimetaverse/trilc-local.env`（用户目录，非仓库路径）。
> **待 CEO 操作**：旧共享 key（255dc140…）与本机中途现役过的 key（bef0e848…）请在 bigmodel.cn 控制台吊销。

## 一、配置点位矩阵

| 端 | 配置文件 | 关键变量 | 变更后动作 |
| --- | --- | --- | --- |
| 本地 CC | `~/.claude/settings.json` env | ANTHROPIC_API_KEY / BASE_URL=`https://open.bigmodel.cn/api/anthropic` / MODEL=`glm-5.3[1M]`；haiku 档 `GLM-4.7-Flash` | 重启会话 |
| sg-server CC 会话 | `/home/fleet/.claude/settings.json` | 同上镜像——orchestrate_tick spawn 的 CC 读此处 | 下次 spawn 生效 |
| sg 编排计价/钉模型 | `/home/fleet/.trimetaverse/orchestration.json` | default_model=glm-5.3；prices_override 全 0（按 token 量控制 15 亿/日） | 立即 |
| heyuan TriRLC | `/srv/fleet/TriLC/.env` | ANTHROPIC_BASE_URL/API_KEY/MODEL 三变量 | **必须** `systemctl restart trilc-headless` |
| heyuan 编排 | `/home/fleet/.trimetaverse/orchestration.json` | model=glm-5.3 | 立即 |
| TriModel registry | TriModel/src/client.ts（commit 9afe789） | glm-5.3 / glm-5.3[1M] / GLM-4.7-Flash → anthropic provider | 双服务器 scp src+dist（node_modules 为符号链接即生效） |

## 二、风险与陷阱备忘

1. **模型漂移秒死**：spawn 不钉模型时，CC 读 HOME 配置解析——漂移一次=0.8s 死亡+孤儿锁级联（141800Z 事故）。已用 `--model default_model` 显式钉死（P1-4）。
2. **key-cache 覆写隐患**：TriLC keyCache 刷新会用缓存覆写运行时 ANTHROPIC_* env。当前无覆写路径（heyuan 无 keys.json 缓存、sg trimc 分发源无 anthropic key）；若未来启用 TriModel /api/keys 分发须复查此面。
3. **CRLF 污染密钥**：Windows 编辑器给 .env 存 \r\n 会破坏 auth header（历史上发生过）——服务器侧改动统一走 sed/python 写入并 grep -c $'\r' 校验。
4. node_modules/trimodel 在两台服务器均为符号链接指向各自 /srv/fleet/TriModel——scp 该目录 src/dist 即全端生效，无需 npm install。

## 三、验证锚点

- heyuan 链路：`curl 127.0.0.1:8711/v1/messages` 发 "Reply with exactly: GLM-OK" 流式回含 GLM-OK 即通（2026-08-26 实测）
- sg 链路：`sudo -u fleet HOME=/home/fleet claude -p ... --output-format json` result=GLM-OK（同日实测）
