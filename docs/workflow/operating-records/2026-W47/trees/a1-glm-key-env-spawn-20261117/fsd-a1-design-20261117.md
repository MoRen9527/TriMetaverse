# a1 技术方案卷·TriModel 进程内解卡→spawn 3334 带 env（BOD 裁124 续·FD 主刀·候 CTO 门禁）

- 执行: m-duty-fsd；令面=a1 施工派工令（值席径裁·BOD 裁124 续）；门禁=CTO 六判据（①解卡最小化②明文生命周期③3334 spawn 窗序④零新增明文面断言⑤回滚锚⑥隔离纪律）
- 施工位实勘: TriModel 仓（sg clone /srv/fleet/TriModel·河源侧现域同构·双机拓扑=sg bare↔河源 pull 照 TriRMC 先例勘定形）——**双机拓扑勘定：改动落 sg clone+push sg bare→河源 pull 对齐（照 T2 河源 pull 先例）**；现 HEAD 对表=4a05c74 谱系后（本席实勘 406b8ca 段）
- 状态: **方案稿候 CTO 门禁**（一审绿→编码）

## 一、现势实锚（写前现查三面）

1. **3333 配置面**（server.ts·持解密权）: secure-keys.ts keys.enc 解密族在库（readSecureKeys→decrypt）——GLM 凭据双条目（e-glm-anthropic/e-glm-flash-anthropic）解密权在本进程内
2. **3334 代理面**（proxy-server.ts·TRIMODEL_PROXY_PORT=3334）: anthropic-proxy.ts glm-anthropic 路由消费 **GLM_API_KEY env**（apiKeyEnv 面·:53）——现役 3334 进程 env 无 GLM 键=T1b 三缺实锚（GLM 路由 auth-fail 形）
3. **现役 3334 启动形**: 独立进程（npm run serve:proxy 或 systemd 形·**非 3333 spawn 子进程**·env 无 GLM 键注入通道）——a1 改形=3333 进程内解卡后 **spawn 3334 子进程带 env**（key 零出进程：解密值只在父进程内存→子进程 env 链·零落盘零明文面）

## 二、a1 机制设计（进程内解卡→spawn 3334 带 env）

### 2.1 解卡面（①判据·最小权限解卡）

- decrypt 范围=**双 GLM 条目**（e-glm-anthropic/e-glm-flash-anthropic·keys.enc providers 面）——**e-deepseek 条目零触**（最小权限解卡面照判据①）
- 解密工具=security/key-encryptor.js decrypt（在库·零新依赖）
- 条目映射参数化（R-HY keys.enc 实读面候部署窗核对——双条目 id 与 GLM 双模型档映射=方案参数化形·实勘定谳落卷）

### 2.2 注入面（spawn 3334 带 env）

- 3333 进程内组装子进程 env: `{ ...process.env, GLM_API_KEY: <decrypt(e-glm-anthropic)>, GLM_FLASH_API_KEY?: <decrypt(e-glm-flash-anthropic)> }`（env 键名=anthropic-proxy apiKeyEnv 现役消费面对表）
- child_process spawn `tsx src/proxy-server.ts`（或 dist 形）带 env——**明文生命周期=父进程内存→子进程 env 链·零落盘零日志零读数卷**（②判据·D-46 全程）
- 失败面: 解密失败/条目缺席 → 3334 不 spawn（现状维持）+warn 面载计数（零值面）——fail-safe 照 secure-keys 家族纪律

### 2.3 接线形（3333 server.ts 主面挂钩点）

- server.ts 启动序末段（3333 listen 后）挂 `spawnProxyWithKeys()`——imports 自 runtime/fade… **非**：TriModel 内部面 `./proxy-server.js` 子进程 spawn（同一仓双端口拓扑现形·3333/3334 本为同仓双监听面）
- 旧 3334 独立进程处置=部署窗 kill（③窗序段）——R-HY 面照 SDE 勘定谳窗序

## 三、六判据对表

| 判据 | 方案面 |
| --- | --- |
| ①解卡范围最小化 | decrypt 限双 GLM 条目（e-glm-anthropic/e-glm-flash-anthropic）·e-deepseek 零触（§2.1） |
| ②明文生命周期最小化 | 解密→父内存→子 env 链·零明文持久（禁落盘/禁日志/禁读数卷·D-46 全程）（§2.2） |
| ③3334 spawn 窗序 | restart 形（SDE 勘定谳）承接：stop 旧 3334 独立进程→3333 spawn 新 3334 带 env 子进程→healthz 复验（§四窗序段） |
| ④零新增明文面断言 | post-a1 盘面/日志 GLM 明文扫=0（grep 断言随施工卷·argv/env 传递面零 console 面字段化） |
| ⑤回滚锚 | pre-a1 态锚=3334 无 GLM env 现役形（systemd/手动启动形记录）+回滚一步=kill spawn 子进程+restart 无 GLM env 旧形（一步还原） |
| ⑥隔离纪律 | TriModel src 施工分支形（零主链触·零触现役 loop 链/零 daemon 重启）+R-HY 部署面=BOD SSH/R 面通道（跨机路由恪守·D-24） |

## 四、restart 形窗序/影响面（③判据必载段）

- **窗序**: ①旧 3334 独立进程 stop（在途调用 drain 窗≤秒级）→ ②3333 spawn 新 3334 带 env 子进程 → ③3334 healthz 复验 → ④glm-anthropic 路由探针（GLM 模型一活体调用·zero plaintext 读数面）
- **影响面**: 在途调用扰动窗=stop→spawn 间隙（秒级·调用方 retry 容差内）；择窗建议=低流量窗（SDE 勘定谳窗序优先·R-HY 值守窗时段）
- **首拍锚零动**: 23:50 cron 原排零触（3333 配置面零行为变更·双端口隔离铁律照守）

## 五、编码工序（候 CTO 门禁绿即启）

1. server.ts 增 spawnProxyWithKeys()（解卡双条目+spawn 带 env+healthz 复验·§2 全段）
2. env 键名面: GLM_API_KEY（主）/GLM_FLASH_API_KEY（档）——anthropic-proxy apiKeyEnv 消费面对表（GLM_API_KEY 现役 ✓；GLM_FLASH 档=候 R-HY keys.enc 实读定谳·缺席=单键形）
3. 白盒族: 解卡双条目 mock 形/零明文断言（spawn env 面截断读数）/fail-safe 缺条目形
4. 毕报双通道+post-a1 明文扫断言随施工卷

## 六、残面与边界

- R-HY keys.enc 双 GLM 条目实读=部署窗核对（方案参数化承形·缺席条目=单键形降级）
- sg 面零施工（改动落河源部署窗·本卷=方案面+sg clone 工序预演面）
- ANTHROPIC_AUTH_TOKEN 族=3334 域外（claude 依赖面已消·零触）

## 七、使用依据

BOD 裁124 续 a1 派工令（值席径裁）；CTO 六判据门禁令面；TriModel src 现势实读（server/proxy-server/secure-keys/key-source/anthropic-proxy/config 六面）；T1b 三缺 COS 分性毕报卷；D-46/裁决 C 三档
