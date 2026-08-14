# TriCade 初始化到协同 E2E 手动测试方法（CEO 亲测版）

> 树：init-collab-i5-first-collab（verify/ 验收域）
> 日期：2026-08-15（W34 预演练无痕回退后，正式手动验收）
> 状态：active — CEO 按本方法亲测；编排层待命协助
> 前置：W34 预演练已无痕回退（四端 = c3b363ab，W33 active，运行态已复位至 uninitialized→selfcheck 待触发）

## 〇、前置快查（30 秒）

```powershell
# daemon 健康 + 链态（预期 ok:true / version 0.4.10 / chainState selfcheck）
curl http://127.0.0.1:8711/healthz
curl http://127.0.0.1:8711/internal/v1/init/chain/status
```
服务器侧（编排层已备）：TriMC 8710 健康 / 2 jobs / weekly-plane-shift runCount=0 / fleet=c3b363ab。

---

## 一、公司初始化（SELFCHECK → ONBOARDING → 装配开张）

### 入口 A：TriPilot 面板（主入口，推荐）

1. **打开 TriCade** → 左侧 TriPilot 聊天面板——应显示**初始化阶段卡**（当前阶段 = 自检）
2. **点「开始自检」** → 诊断卡逐行点亮五探测：
   - 预期：healthz ✓ / tripilot（面板连通待确认，degraded 正常）/ trimodel ✓ / tristaciss ✓ / **问周面路径**（真实模型会话，30-90s）
   - ⚠️ **已知 bug**：第五探测期间面板可能卡约 1 分钟（装后态 plane-hint-probe 阻塞 HTTP 面）——等它自己恢复，恢复后继续。若超过 3 分钟未恢复 → 报编排层
   - 预期终态：绿卡（pass）或黄卡（degraded）——两者都自动进入下一阶段；红卡（blocked）= 认证失败 → 检查 trilc-daemon.cmd 的 TRIMODEL_API_TOKEN
3. **阶段卡自动进入「公司开张」** → 岗位目录卡片列表（13 岗）
   - 预期：**默认勾选恰好 5 岗**（总助/全栈/CAO/CHO/CTO）；每卡显示一句话定位；治理岗有标记
   - 验证 A4-拦截：**清空所有勾选 → 提交** → 预期被拒（至少 1 岗）
   - 验证 <5 提示：只勾 1 岗 → 提交 → 预期提示「推荐至少 5 岗」但**不拦截**
4. **恢复默认 5 岗 → 逐个起名**（默认 5 岗建议沿用：小贾/小全/小理/小才/小狄，或你现场起名）
5. **断点续跑验证（A3）**：命名到一半时关闭 TriCade → 重新打开 → 预期：已答的名字**不重复提问**、可回看、当前步高亮
6. **汇总确认 → 提交装配** → **开张卡**：显示 CEO 名 + 员工名单（与你选的一一对应）
7. **计时（指标 I4）**：从岗位选择界面呈现 → 开张卡显示，预期 ≤3 分钟、零命令

### 入口 B：trilc chat（备选验证）

```powershell
trilc chat
```
文本化流程同上（编号多选 + 命名问答 + 汇总确认）。两入口任一走通即可；有余力可交替验证（A3 断点续跑跨入口）。

### 阶段验证

```powershell
curl http://127.0.0.1:8711/internal/v1/init/chain/status
# 预期 chainState: project-link（装配成功自动转移）
```

---

## 二、项目初始化（PROJECT-LINK）

### TriPilot 面板

1. 阶段卡进入**项目关联** → 选择**本地源** → 填写：
   - 项目仓路径：`D:/Code/ai/TriMetaverse`
   - worktree 落点：`D:/Code/ai/projects/trimetaverse`（可自定义，勿落在研发仓内）
2. 提交 → SSE 进度条（检测 → 白名单 → 建立 worktree → 登记）→ 完成显示 projectKey + 分支
   - 预期：分支 `project/trimetaverse`（常驻项目分支）
   - 失败分类会明确提示（非 git 目录 / 非白名单 / 门禁等）

### 阶段验证

```powershell
curl http://127.0.0.1:8711/internal/v1/init/chain/status
# 预期 project-link.phaseDetail.status = linked
type %LOCALAPPDATA%\trilc\project-registry.json   # 注册点已登记
git -C D:/Code/ai/projects/trimetaverse log --oneline -1   # worktree 可用
```

⚠️ **注**：若 link 报 `spawn git ENOENT` → daemon 启动 PATH 问题，报编排层（昨晚 .cmd 已修 ASCII PATH，正常应不出现）。

---

## 三、五维同步 + 协同确认（SYNC → CONFIRM → READY）

1. 阶段卡进入**同步** → 点「开始同步」→ 五维逐维三态呈现：
   - 预期：company/model/keys/project = 绿（synced）；**employees 可能黄**（服务器侧 TriCompany sourceCommit 机制性滞后 = 正常降级，有重试入口）
2. 同步完成后进入**确认卡**：
   - L1 三元素（repoUrl / projectKey / worktree 指纹）三方一致
   - L2 HEAD 一致性徽标 = 绿（同线收敛）
   - L3 服务器已应用 = 绿（bundleId 双侧一致）
   - L4 = pending 注记（由首个协同工作承载——即第四阶段的周平面迁移）
3. **点「确认开启协同」** → 状态变 **READY**

### 阶段验证

```powershell
curl http://127.0.0.1:8711/internal/v1/init/chain/status    # chainState: ready
ssh sg-ecs-server "curl http://127.0.0.1:8710/internal/v1/config/sync/status"   # applied.bundleId = 本地
```
注：同步会在 dev 上生成 `chore(init-sync): five-dim sync bundle` commit 并推送（这是正式工作产物，无需回退）。

---

## 四、W33 → W34 周平面平移（真实迁移）

### 时点选择（重要）

| 时点 | 方式 | 说明 |
| --- | --- | --- |
| **周六(08-16)或周日(08-17)起** | `ssh sg-ecs-server "node /srv/fleet/TriMC/dist/src/cli.js cron run b00b0070-2f82-4e7d-a98c-de73e886834b"` | week-math 窗口正确（tomorrow 落 W34）→ 自动 W33→W34 ✅ |
| 周日 23:00 | 无需操作 | cron 自然触发（正式口径） |
| 今天(周五)就要测 | 手动五段链（显式参数） | 见下方命令；**勿用 cron run**（周五触发会算出 W32→W33 错误参数——昨晚预演练事故根因，bug 已登记未修） |

手动五段链（显式参数，任何日期正确）：

```bash
ssh sg-ecs-server "runuser -u fleet -- bash -c 'cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.weekly_plane_shift --from W33 --to W34 --start-date 2026-08-17 --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --sync && cd /srv/fleet/TriMetaverse && git add docs/workflow/operating-records && (git diff --cached --quiet || git -c user.name=\"TriMC Scheduler\" -c user.email=\"trimc@tri.company\" commit -m \"ops: weekly plane shift W33->W34 (TriMC scheduler)\") && git push /srv/git/TriMetaverse.git HEAD:dev && echo MIGRATION_OK'"
```

### 迁移后验证（按序）

```powershell
# 1 服务器产物
ssh sg-ecs-server "ls /srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W34/"
#    预期 OP-202608-W34-001.json + unresolved-items.md + .shift-ade.json（from W33 to W34 pass）

# 2 本地回流（W34 可见 = L4 核心判定）
git -C D:/Code/ai/TriMetaverse pull sg-server dev
ls D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W34/

# 3 协同稳态（re-sync 后三面收敛）
curl -X POST http://127.0.0.1:8711/internal/v1/init/sync/run -H "Content-Type: application/json" -d '{\"entry\":\"manual-acceptance\"}'
curl http://127.0.0.1:8711/internal/v1/init/confirm/check   # 全绿后无需再 confirm（已 ready）

# 4 首个协同工作归档
curl -X POST http://127.0.0.1:8711/internal/v1/init/ready/first-collab -H "Content-Type: application/json" -d '{\"status\":\"triggered\"}'
curl -X POST http://127.0.0.1:8711/internal/v1/init/ready/first-collab -H "Content-Type: application/json" -d '{\"status\":\"passed\"}'
```

三面收敛终检（编排层可代查）：本地 = 裸仓 = fleet HEAD 精确相等，服务器 applied.bundleId = 本地。

---

## 五、失败处置

- 任一步失败 → 停在该步、截图留证、报编排层；**不要自行回退**
- 回退预案（编排层执行）：runbook §5 四件套（演练已验证两轮）
- 已知 bug 清单（撞到即报，均登记在案）：SELFCHECK 第五探测卡顿 ~60s / week-math 周五窗口 / 安装脚本自启 daemon 无 env（重装后需换 .cmd 启动）

## 六、通过后

编排层据实收口：I5 正式收口（CEO 亲测版）→ R4-RELEASE-MERGE 收口（W33 OP 条目置 closed）→ OP 登记。
