# 直连兜底两套·sg 写入通道技术方案（LG-036·CTO 域）

- sourceOfTruth: 本件（CTO 技术方案；产品语义真源=CPO `2026-W38/fallback-dual-cpo-def.md` 838a699d）
- syncMode: static
- lastSyncedAt: 2026-09-16T02:3x+0800（date 现查 02:31:46，本回合执行）
- 流程位: D-15 联审——本方案 → CPO+CTO 双签 → 实施（TriModel 仓只增不改，v1 同族）
- 依据: CPO 产品定义四要件（两套定义/互不串写/凭据不跨机/应急独立）；v1 链条 `14efe8e→6120e08→1e07310`；本席 2026-09-16 02:3x 双机活体实勘（读数见 §一）

---

## 〇、方案摘要

**选型=乙案「本地 TriModel 薄代理 + SSH 管道转发 sg 现端点」**：本地 TriModel 新增 2 个只增端点（sg 状态读/兜底写），服务端经 `ssh sg-ecs-server curl -s -m 10 -K -` 将请求转发到 **sg 侧 TriModel 现成的 claude-fallback 端点**（经部署更新后）——**写入在 sg 侧由 sg TriModel 执行落盘**，凭据全程仅经「浏览器内存→本地进程内存→SSH 加密管道 stdin」透传，**本机零落盘、零日志、零 argv**。

- sg 侧**零新代码**（复用 v1 端点全安全族：fail-closed/备份/坏 JSON 拒写/幂等 9 键全族）。
- 备选甲（SSH 隧道直调）可作升级路径；丙（分发链）列为「通道全断」降级预案，不实施。

## 一、双机活体实勘（2026-09-16 02:3x，全部现查）

| # | 事实 | 读数 |
|---|---|---|
| F1 | 本机 TriModel 活体 | `{"ok":true,"service":"trimodel","version":"0.1.0",...}`（127.0.0.1:3333） |
| F2 | sg TriModel 活体 | 同款 health OK；**127.0.0.1:3333 LISTEN**（仅环回，node pid 2322956） |
| F3 | SSH 通道可达 | 本机 `ssh sg-ecs-server` 执行远程 curl 成功（甲/乙两案命门实证通过） |
| F4 | **sg 端点缺席** | sg GET `/v1/config/claude-fallback` 回 `{"error":"Not found"}`——sg 码版=`ea522e2`（P3-sg 期，**先于兜底 v1**）→ **部署前置项** |
| F5 | sg TriModel 进程身份 | 用户=**fleet**，cwd=/srv/fleet/TriModel，运行=`/usr/bin/node dist/src/server.js`（systemd：`trimodel-config.service` 3333 + `trimodel-proxy.service` 3334） |
| F6 | 写入目标归属 | fleet 位 homedir=/home/fleet → 端点 `homedir()` 自然指向 **/home/fleet/.claude/settings.json**（13 席 settings 载体；实读现值 base_url=127.0.0.1:8460 代理、model=glm-5.3[1M]、15 键）——**目标位天然正确，零配置** |
| F7 | sg 工具面 | curl=/usr/bin/curl、python3 在位（管道方案可用） |

## 二、通道选型（三候选裁）

| 案 | 形态 | 裁 |
|---|---|---|
| **乙（主选）** | 本地 TriModel 薄代理端点 → ssh 管道 → sg TriModel 现端点 | ✓ **采纳** |
| 甲 | 浏览器 → SSH 隧道（-L 常驻）→ sg 端点直调 | 备选（取舍见下） |
| 丙 | 分发链（pending 意图 → sg 侧人位执行，四卡同族） | 降级预案，不实施 |
| 丁 | sg 侧凭据库引用（意图只传 entry_ref，key 永不出 sg） | 排除——依赖 sg keystore 可用，与「应急独立性」冲突（TriModel 坏时引用必失败） |

**乙采理由**：①写入真 sg 侧执行（sg TriModel 落盘）；②sg 零新代码（复用现端点全族）；③本机零落盘（stdin 管道+SEC 白名单+表单会话内存）；④运维最轻（无隧道常驻进程/端口/keepalive）；⑤合 v1「只增不改」（本地加薄端点）。
**甲取舍**：免本地进程经手 key（更洁），但隧道生命周期管理重（Windows spawn/keepalive/断线重连/端口冲突）+ UI 须直持 sg 端点细节——v1 阶段不成比例；列为将来安全升级路径。
**丙定位**：ssh 通道整体不可用（网络/凭据全断）时的最后一跳——写「意图文件」落共享面由 sg 侧人位投放，分钟级、需人工，仅作预案写入运维手册。

## 三、凭据交付设计（「不跨机落盘」的机械化实现）

**两条凭据**：sg 栏 API 密钥（要写入的值）+ sg TriModel 管理令牌（端点鉴权用）。

全链路径（乙案）：
```
浏览器表单（会话内存）
  → 本地 TriModel（内存透传；SEC 白名单日志=零 body 记录；零磁盘）
  → child_process.spawn('ssh', ['-o','BatchMode=yes','-o','ConnectTimeout=10',
        'sg-ecs-server','curl','-s','-m','10','-K','-'])
  → 配置经 ssh stdin 管道（url/header/data 全在 stdin——argv 零密钥/零载荷）
  → sg curl 读 stdin（-K -；sg 进程列表零泄漏）
  → sg TriModel 端点（fail-closed 鉴权）
  → 落盘 /home/fleet/.claude/settings.json（sg 侧）
```

**零落盘五规则**：
- R1 本机文件面零写：sg 流程不触碰本机任何文件（settings/备份/临时文件皆无）。
- R2 日志零密钥：本地 TriModel SEC 白名单扩展至 sg 两端点（仅记 method+path+状态码，永不记 body）。
- R3 argv 零泄漏：载荷与令牌仅经 stdin（上链）；ssh 远端命令串为静态常量（`curl -s -m 10 -K -`），sg `ps` 不可见。
- R4 UI 会话内存：sg 栏两凭据仅存表单内存（**不 localStorage、不随设置持久化**；写后清空输入框，同 v1 密钥处理）；刷新即失（应急场景可接受）。
- R5 响应不回显：密钥永不回显；尾 4 位仅 sg 管理令牌验证通过后由 sg 端点返回（继承 v1 admin-gated）。

**BatchMode=yes 为硬要求**：防首次连接 host-key 询问/密码提示挂死请求（失败即人话态，运维预置 known_hosts）。

## 四、UI 两栏数据形态（本机前/sg 后，CPO 布局照准）

**本地栏**：v1 原样（GET/POST `/v1/config/claude-fallback`）零改动。

**sg 栏（新增两端点，只增不改）**：
```
GET  /v1/config/claude-fallback/sg/status
  → { object:"config.claude-fallback.sg",
      channel: { state:"ok"|"unreachable"|"version_unsupported", label:<人话> },
      file_present, readable, base_url, model,
      api_key_masked }            // 仅 X-SG-Admin-Token 验证通过时附
POST /v1/config/claude-fallback/sg/restore     // Authz=本地令牌（同 v1）
  body: { base_url, api_key, model, sg_admin_token }
  → 同 v1 restore 响应体 + channel 字段（幂等/备份/落盘读数同族）
```

**人话态词表（零黑话）**：`sg 通道正常` / `sg 通道不可达（请检查网络或联系运维）` / `sg 侧版本过旧，请先更新 sg 侧 TriModel` / `sg 令牌不正确`。
（`version_unsupported` 探测=status 转发回 404 即判定——F4 现态即触发此态。）

## 五、安全姿态复用清单（v1 全继承）

POST fail-closed 三态（无令牌配置 503/错误 401/拒写零触碰）｜GET 只读仅回地址+模型｜尾 4 位 admin-gated｜9 键全族 verbatim｜写前 bak 备份｜坏 JSON 拒写｜幂等「已是该值」不重写｜原子落盘（tmp+rename）｜三值校验（http(s) 前缀/密钥长度/模型必填）——**sg 侧由 sg TriModel 端点原样执行（同代码），本地代理端点零复制零改写**。

## 六、实施分步（双签后动）

1. ~~**sg TriModel 部署（前置·DE/BOD 位·fleet 身份）**：`/srv/fleet/TriModel` 拉当前 dev（含兜底 v1 全链）→ 构建 → `systemctl restart trimodel-config trimodel-proxy` → 探测端点（本方案 F4 态消解）~~——**已执行毕（COS，2026-09-16 02:4x）：sg TriModel ea522e2→1e07310 部署完成，端点实测 GET 200（读 13 席真值）/restore 401 fail-closed ✓；F4 态消解，version_unsupported 探测保留为常态防御**。
2. **本地 TriModel 薄代理**：新文件 `src/api/claude-fallback-sg.ts`（status/restore 两 handler + ssh spawn 封装）+ `routes.ts` 两行接线——既有端点零改动。
3. **UI 两栏**（CPO §三 形态）：TriMLC 栏（v1 复用）在前、TriMMC 栏在后；sg 栏凭据会话内存处理。
4. **测试**：单测（ssh spawn 契约 mock）+ **真链路两案**（对 sg 实机：status 读通+写落盘读回）+ 零落盘断言（sg 流程前后本机文件面 diff=空）+ 凭据痕迹断言（argv/日志扫描零命中）。
5. **走查**：非作者手测（BOD）+CPO 验收（CPO §六 四锚）。

## 七、验收锚（CPO §六 → 技术断言映射）

1. **互不串写**：本机栏操作→断言 sg 侧 settings mtime/内容零变；sg 栏操作→断言本机文件面零变（含无新文件）。
2. **应急独立**：卡数据损坏场景两栏可操作——设计天然满足（两栏不读卡/策略/引擎），补断言实证。
3. **继承断言族两套同跑**：幂等/备份/坏 JSON/不回显——本机侧本机跑、sg 侧经真链路在 sg 跑。
4. **sg 侧落盘真验证**：写后 sg 侧读回（技术线/BOD 走查）。

## 八、风险与缓解

| 风险 | 缓解 |
|---|---|
| ssh 不可用/超时 | BatchMode+ConnectTimeout+人话态 fail-closed；实现期 spawn 自检（本地端点启动时探一次） |
| sg 版本前置未完成 | `version_unsupported` 人事态显式提示（F4 探测）——**部署前 UI 不静默** |
| 凭据痕迹 | R1-R5 五规则+第 4 步痕迹断言（argv/日志/文件三面扫描） |
| Windows ssh.exe 依赖 | 已实证（git ls-remote 同通道）；实现用完整路径兜底+错误人话化 |
| known_hosts 首次询问 | BatchMode=yes 防挂死；运维预置（部署步骤连带） |

## 九、使用依据

- CPO 产品定义（TMV `docs/workflow/operating-records/2026-W38/fallback-dual-cpo-def.md`，838a699d）
- v1 链条：TriModel `14efe8e→6120e08→1e07310`（本席 09-15 审 APPROVE 件）+ `src/api/claude-fallback.ts` 实勘
- 双机活体读数：本席 2026-09-16 02:3x 实勘（§一 F1-F7；含 ssh 通道/sg 端点缺席/进程身份/目标位实读）
- 河源模式原则（跨机只传意图不传凭据）：本方案经 stdin 管道+零落盘实现其机械化
