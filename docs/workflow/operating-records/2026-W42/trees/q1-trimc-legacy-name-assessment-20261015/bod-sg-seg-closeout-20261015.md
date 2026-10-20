# BOD sg 段毕报卷 · 步3 归一窗（19:00-20:00 微窗·派工单 046caf7cb）

- sourceOfTruth: 本卷（trees/q1-trimc-legacy-name-assessment-20261015/bod-sg-seg-closeout-20261015.md）
- syncMode: static（sg 段毕报·CTO 派工单 BOD 承接段·交棒本机段）
- lastSyncedAt: 2026-10-15 19:04:14 +0800（commit 实锚）

## 一、施工序实录（定稿序逐项）

| 步 | 读数 |
| --- | --- |
| 窗前预检 | 断言门现状钉死：TriMC dev=60496df 领先 bare 1 笔（今晨补录笔未推·fast-forward 形）·引用链窗前零活命中·bare 权威位=/srv/git/TriMMC.git |
| 前置① | git push origin dev：`9561273..60496df` fast-forward ✓·推后 TriMC dev==bare dev==60496df 对表 ✓ |
| 前置② | tar 归档 7 运行时 json → /srv/fleet/backup/trimc-legacy-runtime-20261015.tar.gz（106897B·7/7 逐名 ARC_OK 断言·含 35 封历史 bod 信取证面） |
| 断言门 | GATE_HEADS_OK+GATE_TRACKED_CLEAN（跟踪面零脏）+7/7 ARC_OK 三绿 |
| rm | `rm -rf /srv/fleet/TriMC`→DIR_GONE ✓（23 项内容随目录清·源码笔已保 bare·运行时已归档） |
| 引用链终验 | sweep 命中分类：duty-urge-patrol.py L13 活引用（**已修**·见 §二）·poller.sh.bak/log/pyc/file-history 非活引用留档；TriMMC src+dist 零 TriMC 路径引用·sbin/脚本全量零活引用双 CLEAN |
| daemon 自持 | rm 后 trimc active+healthz 200（TriMMC 侧自持·零依赖 TriMC 目录） |

## 二、窗内增补修复·duty-urge-patrol.py 路径勘正（计划外一处）

rm 后 sweep 发现 fleet crontab 三拍脚本（urge 每 2h/morning 8:05/master 每 30min）L13 读已删路径 `/srv/fleet/TriMC/docker/.env`——**master 拍 19:00 即炸**。修复：cp bak 先行→sed 改指 `/srv/fleet/TriMMC/docker/.env`（TriMMC 侧在位·fleet:fleet 600）→py_compile OK+fleet 可读断言 OK。bak=duty-urge-patrol.py.bak-20261015。

## 三、token 轮换段（两段施工·真源勘正一笔）

1. **第一段（unit 面）**：override.conf bak-pre-rotate 先行→openssl rand -hex 32 新值→sed 改 unit+daemon-reload+restart→双探针读数**反常**（旧 400=放行到 body 校验仍有效/新 401）——**判读：daemon 服务端 token 真源非 unit env**。
2. **真源勘正**：读 dist/src/internal-token.js——服务端 token 三链解析（env→模块相对 docker/.env→**cwd 探测链上溯 3 级**）——进程 cwd=/srv/fleet/TriMMC→cwd 链命中 **/srv/fleet/TriMMC/docker/.env**＝服务端真源（override.conf 的 env 行未进 daemon 进程 env·旁证=restart 后旧值仍 400）。
3. **第二段（真源面）**：docker/.env bak-pre-rotate 先行→sed 改 TRIMC_INTERNAL_TOKEN=同值（与 unit 对齐·取自 override.conf 现值）→**chown fleet:fleet+chmod 600 属主还原**→restart→双探针正位：**old_token_code=401（旧值拒）·new_token_code=400（新值放行到 body 校验·d={} 缺必填=鉴权过）**·active·healthz 200 ✓。
4. 属主态：docker/.env=fleet:fleet 600 ✓（值面零进信零进卷·全程变量内不回显）；override.conf 及 bak=root（systemd 面惯例·root 只读可接受形）；tar 归档=root:root（CTO 属主提醒认·备份位保持 root 只读）。

## 四、消费面清点（旧值残留 401 面防）

| 消费方 | 形态 | 判定 |
| --- | --- | --- |
| duty-urge-patrol.py | 动态读 docker/.env | 自动新值·零需改 ✓ |
| duty-night-patrol.py | 只打 healthz（无鉴权端点） | 零 token 消费 ✓ |
| notify-poller.sh | 零 API 调用 | ✓ |
| TriMMC cron/CLI 面 | 同仓 cwd 链 | 自洽新值 ✓ |
| daemon 内部 duty-consumer | pullPendingForSeats 零 HTTP 回环 | ✓ |
| **本机 TriMLC 8713 出向** | 跨机·token 在本机侧 | **CTO 本机段义务——单原文只载 TriRLC 8711 env 同写，8713 TriMLC env 同写请一并纳入**（否则 8713 出向下拍 401·notifyFailures 再涨） |
| 本机 TriRLC 8711 出向 | 跨机 | CTO 本机段（单载） |

## 五、回滚路径

- rm：TriMC 破坏性删除零回滚（断言门三绿前置=设计上零独有损失·bare 有笔+tar 有运行时）；
- token：docker/.env.bak-pre-rotate-20261015+override.conf.bak-pre-rotate-20261015 两 bak 还原+restart；
- patrol 路径：duty-urge-patrol.py.bak-20261015 还原。

## 六、交棒（双号）

- **sg 段毕**→CTO 本机段可动（TriRLC 8711 env 同写+重启纪律链+出向 200 终态·**增补 8713 TriMLC env 同写**）∥ FSD 8713 激活段可动（allowlist 追加+build 件③拾取+冷启+本地腿真投复测）；
- 窗毕号=CTO 面（本机段毕后发「窗毕·件①可动」）。

—— 落款: 2026-10-15 19:04:14 +0800（commit 实锚 55af38865·初稿落款推算值已勘正·D-47 自记）

## 七、窗内增补修复二·config-sync-apply job 双害修（19:05 拍首败·19:1x 修毕）

**发现**：19:07 节拍 8712 cf=1 回升——job log 定性双害：①command 硬编码旧路径 `/srv/fleet/TriMC/dist/src/cli.js`（rm 后 MODULE_NOT_FOUND）；②command 内嵌 **export TRIMC_INTERNAL_TOKEN=旧值明文**（token 轮换后必 401）——**§四消费面清点漏项自报**：cron job payload 面未入清点扫描·且 jobs.json payload.command 明文 token 使旧值经本席 walk 读数入读（D-46 自报·值已废·轮换正当性反证）。

**修复实录（API PATCH 通道）**：
1. 首试 PATCH `{command}` 平铺键→patch_ok 但 persist 三态矛盾（applyJobPatch 键面认 `payload` 整体·平铺 command 静默忽略——源码 applyJobPatch@agent-core dist L156 键面实证）；
2. 正形 PATCH `{payload:{command:新command,cwd}}`（新值正则替换 TRIMC_INTERNAL_TOKEN=[0-9a-f]+ →docker/.env 新值·路径 TriMC/→TriMMC/）→persist 三绿（新 token 在/TriMMC 路径在/旧值 gone）；
3. force run 终验：**RESULT: exit code 0**（`bundle … already applied` 幂等形正常）·healthz **cf=0 degraded=False**——19:20 拍免败；
4. 通道注意：GET 单 job 路由不存在（404）——经列表取 job。

**教训两笔**：①「消费面清点」必须含 cron job payload 面（内嵌 token/路径的 command 是隐性消费方）；②PATCH 类 API 键面语义先读实现（applyJobPatch 静默忽略未知键=假成功形态·persist 断言救场）。

—— 增补段落款（date 现查）: 2026-10-15 19:15:4x +0800（BOD）
