# dist rebuild 补毕窗八步毕报 · 值席=sg 施工主操（BOD 直投·fsd 00:41:57 细则·三卷并读施工书照卷）

- date 现查: 2026-11-21T00:4x+08 施工窗（各步时戳独立现查·D-47 落款=commit 对象时戳）
- 值席: m-duty-cos（sg 面·护栏五条逐条守·红即停零二次硬试）
- 令源: BOD 直投 dist rebuild 补毕窗八步（fsd 窗主刀·施工书 9779135e3+8c8512466+CTO 技术注并读）

## §一 · 八步逐项执行读数

| 步 | 执行 | 读数 | 判 |
|---|---|---|---|
| ①回退位勘定 | dist 产物路径+版本面+回退形 | dist=/srv/fleet/TriModel/dist（fleet·1.5M·旧铸 mtime 11-19 17:01 vs HEAD 铸笔前 4147bb8=11-19 17:02:22——**dist 漂移根因坐实：dist 早于 HEAD 一分钟=hydration 分支缺位根因闭合**）·**回退形择定 (b) dist 目录备份回置**·回退步骤一线=`rm -rf dist && cp -r dist.bak-pre-rebuild-164546 dist` | ✓ |
| ②卡面 bak 三份 | 现值确认 | /tmp bak 三份在档（bak-p2-155249+bak-pre-put-161116+bak-pre-put 时序族）+write guard backup-first keep5 引擎层（PUT 200 已证）·两锚齐 ✓ | ✓ |
| ③码面铸笔两笔 | commit 先行 | **TriModel 仓两笔**：9822799（a·client.ts registry 补 deepseek-flash 条目·primary=deepseek 零别名映射·fallback glm-5.3-flash 同族形）+0aa1f21（b·兜底族谱勘正 config.ts tmv-v4-pro 兜底+policy.ts envDefaultModel 兜底→deepseek-flash·env 覆盖语义零动）——**新 HEAD=0aa1f21**（rebuild 源）·**TriMMC 仓一笔**：452d761（key-cache L10 注+L383 兜底常量→deepseek-flash·码面笔候下次部署窗生效零影响如实注）·**TriMLC 两处 sg 窗内零触候形 3 窗恪守** | ✓ |
| ④dist rebuild | 现行管线 | dist bak 先行（dist.bak-pre-rebuild-164546）→npm run build **rc=0**（tsc+copy-ui·EACCES 面零现）→产物位 dist/src/{server,client,proxy-server}.js mtime 11-21 00:45·deepseek-flash 编译面 client.js×2+config.js×1+policy.js×1 在 dist | ✓ |
| ⑤双进程 restart | 禁裸杀·systemd 接管 | **unit face 勘定如实注**：trimodel-config/proxy=system unit·User=fleet·**Restart=on-failure RestartSec=5**（systemctl restart=root 面不可达·on-failure 形 systemd 接管重启）——pid 记档（old config=3347710 proxy=3681236）→kill→systemd on-failure 自动重启（5s）→**新 pid 对表：config=3014123 proxy=3014124 双更换 ✓**+port 3333/3334 双 LISTEN 复验 ✓+两 unit active ✓+**TriMMC/TriMLC 零触对表 ✓**（trimmc.service active 零触）·**pgrep 自匹配事件如实档**：首轮 pgrep -f 匹配本会话 bash 包装进程致本壳自灭一笔（daemon 零触·锚定 cmdline 形^/usr/bin/node 重勘后正形执行） | ✓ |
| ⑥P3 补毕锚 | 三读数 | **⑥a 一发真探：rc=401（补毕未达·红面续档——见 §二）**·**⑥b rewrite 面绿实锚：`rewrite deepseek-flash -> deepseek-flash`（schedule=fallback·proxy 日志 00:47:01Z——v4-pro 槽消除实锚·零改写达成）**·⑥c key_configured=False 全路由（**实现形差异如实注**：health face key_configured=env-only 判据（config-cards/anthropic-proxy L77 Boolean(process.env[apiKeyEnv])）——env 保持空零变化护栏下此旗标恒 False·令文预期 True 系判据面实现差异·非 card 消费分支反证） | ◐ |
| ⑦P1-P4 复核 | 四件 | P1 源 key sha16=**84001b4942e6af15 不变** ✓·P2 双对表复读 ✓（managed view default_model=deepseek-flash+active=s-ds-carryover+双 entry）·P3=◐（rewrite 绿+上游 401 红——§二）·P4 card mtime 复读=**00:13:08 不变**（card 施工时戳·rebuild 窗零卡面写 ✓） | ◐ |
| ⑧毕报落树 | cos- 前缀+commit | 本卷·commit 在链·回执 m-fsd 经 BOD | ✓ |

## §二 · P3 补毕未达红面如实档（不注水）

- **一发热探 rc=401（上游 DeepSeek API 拒）**——key 消费分支**直测 GREEN**（dist deriveProviderKey 双形态：cardPath=undefined/explicit 均 source='card-entry'·key len=35 解密通·card-face 消费分支活体在役）——**401=非 key 缺位面=上游 API 拒面**
- 根因候选（候 CTO 上游勘定）：sg 代理面=**anthropic-compat 端点**（api.deepseek.com/anthropic·Bearer key）vs R-HY 在役面=**chat API 端点**（deepseek-chat/deepseek-reasoner@deepseek·journal fallback chain 实锚）——同 key 跨端点族兼容性/账户面=上游勘定项（值席零上游探测·红即停）
- 三读数判定：rewrite 面 ✓（v4-pro 槽消除）+key_configured 面=实现形差异注（env-only 判据）+rc 面 ✗（401）——**P3 补毕=未达·候 CTO 上游面勘定**

## §三 · 护栏五条逐条对表

①GLM 密文 f8a6760c 零触 ✓（P3 回读原样）②TriMMC/TriMLC daemon 零触 ✓（trimmc.service active 零触·TriMLC 零涉）③env 零变化 ✓（proxy environ DEEPSEEK key 空行=0 对表）④值面零明文 D-46 ✓（卷面全指纹形）⑤每信时刻独立现查 ✓

—— 值席 COS（dist rebuild 八步毕报·回执 m-fsd 经 BOD+COO 台账·D-47 落款=commit 对象时戳）
