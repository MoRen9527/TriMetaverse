# notice-189 勘形三面勘定卷（CTO 源读实勘+BOD 实锚对表）

- date 现查: 2026-11-18 20:29:07 +0800（UTC 2026-11-18T12:29:07Z·D-47）
- 勘定人: CTO 小狄（勘形三面承令·CEO 20:06/20:39 直令 governs）
- 勘定形: 源码级实勘（npm rc.2 tarball 五件解包源读·sg 面 /tmp/dsh-pkg-survey/）+BOD 活体读数对表（8791 wrapper/401 门/loopback bind 实锚）——**零触河源运行面**（纯 npm 公网下载+本地解包）
- D-46 值面纪律: 本卷**零 token 值零凭据值**（token 传递纪律见面 a④）

## 面 a·CEO 浏览器访问路径安全面（源读勘定）

### a① 认证机制正身（dsh-web-app 0.2.2-rc.2 源锚）

- **launch-token exchange + signed session cookie** 双段制（web-app README「The launch-token exchange and signed session cookie authenticate every API method and WebSocket stream」）：
  1. web face 启动打印 **tokenized URL**（`dsh web: <url>?token=…`·fresh process token——每进程启动一枚新 token）；
  2. 浏览器首访该 URL → 服务器**兑取**：发 signed cookie → **302 重定向到无 token 同路径 URL**（README「receives a signed cookie, and redirects to the same directory without the token」源锚）；
  3. 此后全部 API/WebSocket = **cookie 鉴权**（URL 不再带 token）；
  4. **agent 运行时上下文与 `DSH_WEB_URL` 收到的是 clean URL**（README「the agent's runtime context and DSH_WEB_URL receive it clean」——设计原生零泄漏面：agent 面拿到的 URL 无 token）。
- BOD 实锚对表: 裸访 127.0.0.1:8791=401 门 ✓（cookie/token 双段制外围读数吻合）；wrapper 自动截获 token 落 .rot/new-token 文件 0600 ✓；stdout masked ✓。

### a② URL query 泄漏面裁定（CEO 问点正答）

**兑取型一次性面，非持久 query 面**——token 仅在首访请求的 query 出现一次，服务端兑成 cookie 后浏览器地址栏即被 302 清成无 token URL。残余面唯二：

1. **浏览器历史**保留首访 tokenized URL（若 token 未失效，历史记录=盘上活凭据残面）；
2. token 值经手环节（读取/转交）若落卷落屏=面外泄漏。

**收口判定：机制面已收口（兑取+重定向设计）；残面=历史条目与经手纪律，用运营纪律闭，非代码缺陷。**

### a③ 访问路径形态技术裁定（SSH -L 形=成立）

| 面 | 勘定 | 判 |
|---|---|---|
| 传输加密 | SSH 隧道 `-L 8791:127.0.0.1:8791` 全程加密 | ✓ |
| 暴露面 | 源锚=loopback bind+**wildcard 拒绝**（README:「only --host changes the listener: one concrete local IP, never a wildcard」+非 loopback 无 TLS 启动即告警）——现役 127.0.0.1:8791 零公网暴露 | ✓ |
| Host/Origin fence | 隧道下浏览器 Host: 127.0.0.1:8791=bind IP 自身，**fence 原生纳受，零 `--trusted-host` 需求**（README:「The Host/Origin fence accepts the bind IP itself」） | ✓ |
| 鉴权 | 401 门+token 兑取+cookie（a①） | ✓ |

### a④ token 传递/轮换纪律（CTO 建议形·候 CEO 定谳）

1. **传递**：BOD SSH 读 `.rot/new-token`（0600）→ **带外交付 CEO**（SSH/BOD 通道面）——禁落卷禁落工单文本禁屏显（D-46 值面纪律全形）；
2. **轮换**：**web face 进程重启=token 轮换**（fresh process token·旧 token 即失效）——联审窗毕照 restart discipline 重启一次（禁裸杀/pid 验对/healthz 留痕）→ 历史 tokenized URL 全数失效（a②残面1 随动闭）；
3. **CEO 侧纵深**：无痕窗访问或用毕清该历史条目（可选·双保险）；
4. cookie 面注：signed cookie 在 HTTPS listener 下才带 `Secure` 标（源锚）——隧道形下 cookie 走加密隧道=等效安全，无需 TLS 面改造。

### a⑤ 14 会话 uuid 清单（随转·原样承录）

COS=bd42c2bb / 50dcc987 · COO=70288b5b / 763d383d · CAO=2de2ff74 / 86bd8f2f · CPO=eb73dca3 / f530913c · CTO=36578dc5 / 3e32e754 · CHO=05551533 / 4ed4888f · CFO=57fda2de / 5dd59fad

（注：uuid=会话标识非凭据——面板访问权由 token/cookie 门把守，uuid 清单不构成访问面。）

### a⑥ 可见域裁定（架构面事实·候定谳）

**web face=单 workspace 单实例可见域**（运营实锚：run-web wrapper 根植 `.dsh-workspaces/r-duty-cos/.rot/`；源读=web 面板会话清单读该 workspace 会话存储）。14 会话散布七席 workspace → **单 web face 只见单席**——CEO 七席联审全景=「每席一 web face（多端口）」或「联审会话单 workspace 汇聚」二形，技术裁候 CEO 定谳执行面（见面 c④）。

## 面 b·tui profile 缺装勘补（源读勘定）

### b① 根因定谳（源码级钉死）

**「profile tui does not exist」=fail-visible 正确行为，非缺装故障**——dsh-official-bundles 0.2.2-rc.2 `PROFILE_TEMPLATES` 源锚（src/bundles.ts:10）：

```
acp: [dsh-base, dsh-acp-app]
web: [dsh-base, dsh-web-app]
headless: [dsh-base, dsh-headless]
sdk: [dsh-base, dsh-sdk-app]
sdk-minimal: [dsh-sdk-minimal]
```

**rc.2 出厂 profile 模板五名、零 tui**——tui 不存在=**profile 集设计现势**，rc.2 内无「补装」对象（非装漏，是没这货）。与 §九 前勘（四 profile 形）吻合并精化（+sdk-minimal 第五名）。

### b② 误导面溯源

launcher help 用 `dsh tui --resume` 作**通用示例**（dsh 包 args.ts:96-99 help 文本以 tui 作 illustration profile 名）——launcher 语法性接受任意名（`dsh <name>` ≡ `dsh --profile <name>`），解析至 profile 解析段才失败。**help 示例误导≠功能承诺**。

### b③ 终端交互面真形

rc.2 终端面=**web 面板内置终端**（`@deepseek-ai/dsh-terminal`/`dsh-terminal-bash` 实装包+OPTIONAL_BUNDLES 含 `dsh-experimental-terminal-bundle`·「persistent terminals」注释锚）——**无独立 TUI profile**。

### b④ 补形候选（候裁）

1. **正形=web profile+终端 bundle**（cordis.patch.yml/plugin manager 挂 terminal bundle）——零新面零新权限；
2. 自建 tui 名 profile（`dsh plugin --profile tui init`·DEFAULT_PROFILE_BUNDLES=dsh-base 起步）——但 rc.2 **无独立 TUI app 包可加**，形同空壳，不荐；
3. 升级线（后续版本若出 TUI 模板）=版本锁政策面，BOD 裁。

### b⑤ 新实锚勘正（npm 可得性）

**rc.2 tarball 五件（dsh / dsh-host-webserver / dsh-official-bundles / dsh-web-app / dsh-base）2026-11-18 20:23 CST 自 registry.npmjs.org npm pack 全部成功**（sg 面实测）——「rc.2 全家桶下架=不可复装」前记对**该五件**呈新实锚：下架域窄于前记（或已复挂）。heyuan 侧重装窗面如实待复勘（本卷只录，零装行动零触河源）。

## 面 c·会话查看形态 × 桥改造共存面（源读+前研究承录勘定）

### c① 面划分

- **web 面板（8791 形）=读视图+人类 attention 交互面**（chat/会话历史/内置终端）；
- **桥改造三 API（spawn/list/send·T2/T3 链）=headless 控制面**（sessions resolve-or-create·queue/steer/{inject} 三模式注入）；
- **同一 workspace 会话存储，双面共享**——查看（读）与桥发（写）**零争用**。

### c② 共存语义

- 桥发 queue/steer/{inject} 自带排队/注入语义——注入按序保持；
- CEO 浏览只读 ≠ 写 → 与桥发零冲突；
- 唯一纪律点：**同会话双面同窗写**（web 面板人手输入与桥 send 同刻并发）运营层规避——现役执行形（值席 CLI 派发 × CEO 只读浏览）天然错开=零冲突。

### c③ CEO 按 uuid 对座查看形态裁定（技术面）

- 面板会话清单=workspace 内会话卡列表，uuid 对座=清单内选卡进入（deep-link 路由形态候活体核，非本勘必需）；
- **单 web face 单 workspace 可见域**（a⑥）→ 14 会话七席全景需「每席一 web face」或「联审会话单 workspace 汇聚」。

### c④ 形态建议（CTO 技术裁·执行面候 CEO 定谳）

- **最小改动形=每席一 web face**（七实例七端口，wrapper 形复用现役 run-web 形——每实例独立 token 照面 a④ 传递/轮换纪律）；
- 汇聚形=联审会话单 workspace（架构面改动·涉会话落位纪律，非本窗必需）；
- 桥改造共存面结论：**三 API 与 web 查看面共存成立**（共享存储分面读写零争用）——桥施工线无需为查看面让路，两线并行无阻。

## 使用依据

npm registry rc.2 tarball 五件源读（/tmp/dsh-pkg-survey/·dsh-official-bundles bundles.ts PROFILE_TEMPLATES / dsh args.ts help / dsh-web-app index.ts+README auth 段 / dsh-host-webserver loopback/same-origin 面）；BOD 实锚读数（8791 wrapper/401 门/loopback bind/new-token 0600）；cto-superagent-mechanism-report.md §九（profile 四形前勘）；notice-189 派工令原文；D-46/D-47/D-24 纪律。
