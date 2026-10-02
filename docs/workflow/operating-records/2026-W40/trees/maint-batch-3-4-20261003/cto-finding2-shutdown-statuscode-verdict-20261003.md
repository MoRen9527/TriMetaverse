# 发现②裁修卷：cli.ts gracefulShutdown 状态码误判（CTO 速裁，10-03 凌晨窗）

- sourceOfTruth: 本件（发现②裁修正身；令源=COO 03:5x 速裁令，FSD 维护批③施工卷 13a40206 §三.2 带出）
- syncMode: final
- lastSyncedAt: 2026-10-03 04:00:25 +0800（date 现查贴原值；源码实勘时点 03:59-04:00 随文标注）
- 裁定席: CTO 小狄（m-cto）；速裁面零代码动笔 ✓

## 一、裁定总表

| 项 | 裁态 |
|---|---|
| 三态裁答 | **①修法指定 + 归属=下一维护批攒**（非②：修法语义门现在定死防施工再议；非③：fallback 保功能但观测失真已实证产生误导成本，一行修成本与失真持续不对故） |
| 缺陷定性 | **真缺陷（观测面失真族）**——非阻塞（fallback 保证停机功能完成），但 log 双向失真有实证误导成本（今晚实弹） |
| 修法适用域 | **双仓同修**（增量发现：TriMLC cli.ts L380 同名函数同款缺陷，COO 令文仅提 TriRLC 仓） |

## 二、缺陷实锚（源码面）

### TriRLC `src/cli.ts` L379-397 `gracefulShutdown()`

- L384-386：`(res) => { res.resume(); res.on('end', resolve); }`——**拿到任意响应即 resolve，`res.statusCode` 零读取**；L393 `return true`。
- 后果：401/403/4xx/5xx 全部走 true（「accepted」）路径。

### 调用链双向失真实锚（L340-376 cmdStop）

- true 路径 L354-359：等进程退超时→**L359 `console.warn('graceful shutdown accepted but pid ... still alive, sending SIGTERM...')`**——401 场景下此文案**双向失真**：①把「gate 拒绝」说成「accepted」②真因（401 auth）完全吞掉，运维被导向「daemon 为何 accepted 还不退」的进程 bug 方向，而非「为何 401」的认证配置方向。**今晚实弹正是绕了这个弯**（8711 gate fail-closed 全拒 401→accepted 误报→SIGTERM L365 完成停）。
- false 路径 L361「shutdown endpoint unavailable」：当前 false 仅网络错/超时触发；修后非 2xx 也走 false——**L361 文案必须随修**，否则 401 只是从「accepted」换成「endpoint unavailable」换个位置说谎。

### 同族增量发现

- **TriMLC `src/cli.ts` L380 同名函数同款实现**（L302/L353 双调用点）——两仓 cli 镜像族，**同款缺陷双仓在案**，修法双仓同改（批量修口径），只修 TriRLC 留 TriMLC 同款雷。

## 三、修法指定（语义门三条件，具体实现归施工）

1. **状态码校验**：`gracefulShutdown` 内响应回调读 `res.statusCode`——**2xx 才 resolve（true=accepted 真话）**；非 2xx reject（false 路径）。核心形态：`res.on('end', () => { const code = res.statusCode ?? 0; (code >= 200 && code < 300) ? resolve() : reject(new Error('HTTP ' + code)); })`。
2. **log 真因化**：L361 文案随修——false 分支 log 须含真实失败原因（`HTTP 401`/`timeout`/网络错），禁笼统「unavailable」。L359 文案可保留（真 accepted 后退得慢的场景语义仍成立，SIGTERM 提速合理）。
3. **行为不变量**：非 2xx/网络错→照走 SIGTERM→（必要时）SIGKILL 现有 fallback 链——修法只动观测面（log 说真话），零动停机行为；**accepted 一词自修后仅限 2xx**。

### 生效链附注（施工时勘，不阻塞）

cli.ts 改动经 build→CLI 消费位生效——本机 `trilc` CLI 不在 PATH（本席 02:02 实勘），实际消费方（trilc stop 由谁调：人工/计划任务/脚本）候施工时勘定，生效验证随施工单。

## 四、归属裁定与发现①联动附注

- **归属=下一维护批攒**：一行级修+功能面无害（fallback 兜底）+停机低频+与维护批既有三笔（a1 头注一行补注/a3 bak 缺失文案/本件 L361 文案）同族同批最经济。维护批四笔清单：①triladder a1 头注补注（发现①裁卷 §四.1，3c0a2753）②a3 bak 缺失文案（STE 验证卷发现项 2）③TriRLC cli.ts 状态码校验+L361 真因化（本件）④TriMLC cli.ts 同款（本件）。
- **与发现①（8711 gate fail-closed 修复，晨窗组窗候选）联动**：两修无序依赖——发现②修后+发现①未修的窗口期，trilc stop 8711 会打「HTTP 401, sending SIGTERM」**真话日志**（较现态更诚实的降级，无劣化）；发现①晨窗裁决不受发现②进度牵制。两修同向后增益：②的 401 真话日志会让 ①类 gate 配置问题**即时暴露**（不再被 accepted 掩盖数小时）。

## 使用依据

- COO 03:5x 速裁令；FSD 施工卷 `fsd-maint34-completion-readout-20261003.md`（13a40206）§三.2（素材面）
- 源码实勘（03:59-04:00）：TriRLC src/cli.ts L340-397（gracefulShutdown 全函数+cmdStop 调用链）；TriMLC src/cli.ts L302/L353/L380（同族定位）；TriRLC app.ts L4531（SIGTERM fallback 注释旁证）
- 今晚实弹链（COO 令文转述+FSD 卷）：8711 gate 401→accepted 误报→SIGTERM 完成停
- 关联在案：发现①裁卷（cto-finding1-header-verdict-20261003.md，3c0a2753——daemon 门 fallback 形实锚，与本件互补：①治 gate 可达性/②治观测面）；D-04 家族「表面绿≠真生效」同族（本件=CLI 观测面变体）
