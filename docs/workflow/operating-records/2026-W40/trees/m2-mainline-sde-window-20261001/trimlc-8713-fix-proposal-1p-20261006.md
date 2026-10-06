# TriMLC 8713 错位根治·修复方案一页（CTO 技术门 APPROVE 附三核意见——本版=三核落实稿）

- 执行: m-sde；时点: 2026-10-06 10:2x+08 草拟；窗位=今晚 b14 晚窗（与 FSD TriRLC 仓主活零冲突）
- 核状态: CTO 技术门 APPROVE 附三核意见（判读锚 30699063；同刻前身 0f66b394 系 amend 遗留不可达，不引用）。核①fail-closed 已改（§二守卫+§五风险段口径贯通）｜核②jobCount 语义注记已落（§一.3）｜核③8711 拉起者并案已入施工序（§四.1，与提权验证并列打头）｜FSD 件②token 落盘限权+件③boot 恢复清扫 scope 增补已入（§三）。**改毕回执即视为施工放行（CTO 判读原文）**
- 红线对照: ①**宁可不拉，不可拉错**（无人登录窗保不了 jedih 正形拉起→宁可 8713 短时缺位走 L1 告警，绝不留 store-blind 假活）②**禁新引入 SYSTEM/提权上下文拉起面**（本方案全部动作在 jedih Interactive 面内，零新提权）

## 一、判活探针三件套（治「假活 16h」——watchdog.ps1 改造，配置面无源码依赖）

判活从「healthz 200」升级为三探全过：
1. healthz 200（现状保留）
2. **pidfile 对验**：`~/.trimetaverse/trilc-8713.pid` 存在且==8713 现监听 pid（错位形零 pidfile→现形）
3. **store 活性抽验**：`GET /internal/v1/cron/jobs`（带 X-Internal-Token）jobCount>0（store-blind→现形）。**语义注释（CTO 核②）**：jobCount=0 属合法空 store（新装/迁移窗），抽验语义=「正形 store 有内容却读零=错位信号」，非「必须非零才健康」——探针在 0 时输出中性读数交 pidfile 对验并判，不单凭 0 判 DOWN
任一不过=DOWN→走 revive；**revive 后 90s 自验**（pidfile 写入+jobCount>0）不过→记 ALERT 行+保留 fail 计数（现有 3 连败 stand-down 机制兼容）。

## 二、无人登录窗保护（治「错位拉起」——红线①落地点）

watchdog.ps1 revive 前加登录态守卫：`qwinsta`/`Get-CimInstance Win32_ComputerSystem` 探 jedih 会话在位——**无人登录（或无法确证 jedih 会话）→不 revive**，写 ALERT 行（L1 在位必告）后退出。**守卫判态失败（qwinsta 不可用/输出不可解析）一律 fail-closed=不 revive+ALERT 行注记「登录态不可判不拉起」（CTO 核①：登录态不可判≠可拉，红线①推导，判读锚 30699063）**。错位成因未完全破案（拉起者未锚）背景下，此守卫保证 watchdog 自己**绝不产出无法自验的拉起**；非 watchdog 通道的拉起者（20140 考古剩余候选）由判活三件套在 ≤5min 内现形告警。

## 三、代码缺陷修复（FSD 面施工件，TriMLC 仓）

1. `isProcessAlive`：EPERM 与 ESRCH 分流——EPERM=进程在（返回 true+不可控语义），仅 ESRCH=死。治 stop 假成功根。
2. `gracefulShutdown`：状态码校验（仅 2xx=成功；4xx/5xx=false 走 SIGTERM 分支）+带 X-Internal-Token（token 从 channel env/ENV_FILE 读）。**scope 增补（CTO 核判读 FSD 件②）**：token 落盘限权——channel.cmd/ENV_FILE 内 token 落盘面收 user-only ACL（jedih），压其他本机上下文读取面（错位 daemon 异 token 401 实证异上下文对 8713 的读取/认证面存在）。
3. `cronEngine` 完成路径兜底：running 态超时自愈探针（如 30min 无完成回调→强制归 idle+execution_log 记 timeout 行）+spawn error 事件处理（error≠exit 也要归位 state）。治 l2-scan 永卡族。**scope 增补（CTO 核判读 FSD 件③）**：boot 恢复清扫——daemon 启动时把 store 内陈旧 running 态归位 idle（上一 boot 崩溃/强停残留），防补跑洪峰竞态残留 running 永卡（10:05 补跑轮 l2-scan running 态实证形态，本 boot 不清则引擎互斥永不重触发）。
4. channel.cmd env pin 补全：`set TRILC_DATA_DIR` 改字面路径（去 %LOCALAPPDATA% 展开）+pin USERPROFILE——治 store 落点漂移机制候选。

## 四、施工序（b14 窗内）

1. 提权验 systemprofile store 落点（考古最后一块，10min）＋**8711 正形拉起者追查（CTO 核③并案，与上项并列打头）**：19:50 无人登录窗内 8711（TriRLC 16500）正形拉起+pidfile 写入——若非人工即=「正确拉起模板已实证存在」（TriMLC 对抄候选）+23980 破案钥匙；候选面同 TriMLC 查法，首查 TriRLC-Watchdog（jedih/Interactive）在 19:50 窗的运行态与登录时序对表
2. l2-scan 解卡：daemon 重启（带 token /shutdown 正途+channel.cmd 冷启，复活链同款；~60s 空窗，三件套自验收）
3. watchdog.ps1 改造（§一+§二， jedih 面配置文件，D-09 UTF-8 BOM 纪律+改后单轮探测冒烟）
4. FSD 件③④（TriMLC src）——若 FSD 无窗则候下一批，本窗只交 §一/§二/§四 配置面件
5. 收口断言：watchdog 三探冒烟（错位形模拟：临时停 pidfile 探 DOWN 路径）+l2-scan 归位读数+全 7 job 推进读数

## 五、风险与回滚

- watchdog.ps1 改造回滚=还原备份（改前 copy 带时间戳）；守卫误判（登录在位判无人）风险=qwinsta 解析容错+**判态失败一律 fail-closed 不 revive（CTO 核①口径贯通，§五原 fail-open 残留句随核①一并撤销）**——误判代价=无人窗短时缺位走 L1 告警（红线①预期形态），绝不产出 store-blind 假活
- daemon 重启回滚=复活链已实证可重复（今日 10:05 同款）
- l2-scan 卡死态重启即清，无数据风险（store 备份在位：trilc-channel-backup-20261006/）
