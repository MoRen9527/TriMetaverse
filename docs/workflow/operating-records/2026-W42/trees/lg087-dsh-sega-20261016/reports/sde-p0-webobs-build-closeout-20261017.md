# SDE 施工卷 · P0 裁①观测载体 web 形单实例（层 1 全绿+层 2 驱动形勘定·候裁项随卷）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-p0-webobs-build-closeout-20261017.md
- syncMode: static（施工卷·层 1 毕·层 2 勘定·候裁项呈报）
- lastSyncedAt: 2026-10-17 13:40:52+08:00（date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 P0（CTO 13:34:31 再裁① web 形单实例）
- 施工位: 河源 R-HY ~/.dsh-segb-obs（观测 home·生产 ~/.dsh 零触碰）

## 裁①四门对表（CTO 13:34:31 逐条）

| 门 | 裁示 | 现状 | 判 |
| --- | --- | --- | --- |
| 1 独立 DSH_HOME | 独立观测目录 | ~/.dsh-segb-obs（fleet 属主·profiles/web auto-init） | ✓ |
| 2 专用端口不撞 13 席发布位 | 专用端口 | 8790·**127.0.0.1 绑定**（不对网）·13 席发布位零触碰 | ✓ |
| 3 探针级 key 不接生产 key | 探针级 key | **偏差如实呈报**：store 同构复制=生产同款 key（本窗物资面自始只有一把 key·sdk 形探针同源）——用量级控制已有（探针 maxTokens=300）·独立 key 面候 CTO 定（追认 or 发独立 key 本席落轮换） | △候裁 |
| 4 exact pin | 0.2.0-rc.2 | 0.2.0-rc.2（装设位 lock 在册） | ✓ |

## 层 1 施工实录（每步自检）

| 步 | 动作 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | 观测 home 建（fleet 属主） | ~/.dsh-segb-obs/ 立后 auto-init profiles/web/ | ✓ |
| 2 | 13 preset patch 只读复制 | 生产发布位 cordis.patch.yml → 观测 home·294907B·源件零触碰（只读复制合法） | ✓ |
| 3 | store 同构复制 | .credentials.yaml 600·fleet·223B（值面零回显·D-46） | ✓（门③偏差另呈） |
| 4 | boot（DSH_HOME 指观测 home·8790） | pid=230248·8790 LISTEN（127.0.0.1） | ✓ |
| 5 | boot log 断言 | tricompass preset 挂载行 **13 条=13 preset 全挂**·URL token 零回显处理（log 不入卷） | ✓ |
| 6 | 隔离复核 | 生产 ~/.dsh mtime/内容零变化·13 席发布位零触碰·观测实例独立进程树 | ✓ |

**层 1 判定：观测载体成立**——实例活+13 preset 全挂+四门隔离（门③存偏差候裁）。

## 层 2 驱动形勘定链（三验①②活体探针承载面）

| 面 | 读数 |
| --- | --- |
| web Host API 逆向三探 | lib/index.js 仅 10KB 胶水层·无 dist 目录·路由字符串泛搜零命中——Host API 无文档化 REST 面 |
| session-controller README 勘明（13:39） | Host `ctx.sessionController` 服务+Client `session` Remote namespace·「Use it through **API Gateway**」——传输=Gateway Remote 协议（非 REST）·「The service applies one **preset-aware** resume policy」（preset 在 session 控制层实锚） |
| acp-app 对照 | deps 无 registry+lib grep preset 零命中——acp 形同病（preset 链唯一在 web-app） |
| web-app deps 实锤 | 显式含 dsh-agent-preset+dsh-agent-preset-registry（出厂带·会话创建走 preset join） |

**判定**：preset join 链绑死 web-app·驱动 web 会话的零自研面=**GUI 人机形**；脚本驱动必经 Gateway Remote 协议客户端=a 案领域（CTO 原判「备而不用」不翻）。

## ①②落位建议（荐）

**毕锚主体 CTO 原文=「cos 席」三验①②**（13:04:20 裁示卷原文）——驱动形与毕锚主体天然对齐：

1. **B1 时 cos 接位后 GUI 手测**（零开发·ui-delivery-render-gate「非作者手测」正形）：cos 在观测实例 GUI（URL+token 已留档 boot log·本卷不载）开 r-duty-cos 会话→①compass 渲染对表+②persona 自检句——观测实例 standby 常驻候此步；
2. 观测实例与 13 席生产同构（同 patch 同 store 同版本）——读数代表性成立；
3. 若 CTO 另裁脚本探针形→唯 a 案 WS 路（窗2 #7·半日级·候明示启动）。

## sdk 形留档标注（CTO 令「候窗2·非本窗施工面」落卷）

- ~/.dsh-sega-n3 sdk patch 三条（llm-deepseek-api-key+agent-preset-registry+preset-r-duty-cos·390 行）：**在册留档·候窗2 #7 协议底座·非本窗施工面·不删不续**；
- 探针管线 v3（~/segb-p0-20261017/p0-three-verify-probe.js）：同标注——handshake-gate+时序坑（session/prompt 必候 initialize result）入卷备查（P0 停报卷 dee6ae38d 已录）。

## 候裁项清单（随卷呈 CTO）

| # | 项 | 选项 |
| --- | --- | --- |
| 1 | 门③ key 面 | a 追认（同账户 key+用量级控制即满足·现势）b 发独立探针 key 本席落观测 store 轮换（分钟级） |
| 2 | 观测实例生命周期 | a standby 常驻候 B1（8790 本机绑定·轻负载）b 即刻关停·B1 时再起（boot 分钟级·留档齐） |
| 3 | ①②探针形 | a 荐：B1 cos GUI 手测（毕锚主体对齐）b a 案 WS 客户端（窗2 #7 启动） |

## 使用依据

- CTO 再裁信 13:34:31（msg 13e9b10a）+裁示卷 66ab801bd（毕锚主体原文）
- P0 停报卷 sde-p0-sdk-preset-stopline-20261017.md（dee6ae38d·触线勘定链）
- dsh-api-session-controller README（装设位直读 13:39）·web-app deps（活体实锚）

落款=SDE 小布 2026-10-17 13:40:52 +0800（date 现查原值·发毕对表）
