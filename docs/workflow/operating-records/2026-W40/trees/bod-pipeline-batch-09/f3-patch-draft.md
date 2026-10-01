# F-3 修复补丁稿（batch-09 件 1·窗前预研）

- 执行: m-duty-fsd（FD）；任务书=本目录 task-charter-f3-patch-draft.md；性质=**只读预研产稿**（sg TriMLC 仓零改动零推送零重启，本件全程未执行任何窗内动作）
- 勘面基线: /srv/fleet/TriMLC @ **99d8466**（git 顶实勘）；旁证=/srv/fleet/TriMMC+agent-core；补丁目标面=dev 机 TriMLC 8713（今晚 18-24 窗应用）

## 一、缺陷定位读数

### 1.1 列清单比对（src/cron/store.ts）

- **CREATE TABLE cron_jobs（L19-37）16 列**：id/name/schedule_kind/schedule_value/schedule_tz/system_prompt/command/role_id/enabled/state/created_at/updated_at/**last_run_at/last_run_status/next_run_at**/run_count/error_count
- **INSERT（L229-231）仅 14 列**：缺 **last_run_at、last_run_status、next_run_at** 三可空列（VALUES 占位自洽 14/14——语句本身无语法错，属静默缺列）
- **缺补面裁定**：三缺列中 **唯一缺陷列=next_run_at**。last_run_at/last_run_status NULL=「从未运行」正确语义，**不补**（补了反而伪造运行史）

### 1.2 缺陷机制链（全链实证，F-3 症状逐环释出）

1. addJob（store.ts:218-244）插入 next_run_at=NULL，返回 job.nextRunAt=undefined，**无任何补算**
2. timer.ts:93 `jobs.filter(j => j.enabled && j.nextRunAt)`——**NULL 即不入调度池**
3. timer.ts:132 tick 判 due `if (!j.nextRunAt) return false`——**NULL 即永不到期**
4. nextRunAt 唯二写点=跑后重排（timer.ts:195-199/:386-387）+错峰（:351）——**永不跑→永不写=自锁死环**
5. 症状全释：六 job nextRun/lastRun 全 None+零 run 记录；healthz jobCount:6 只数行数不看 next_run_at→degraded:false 假象

## 二、TriMMC 正形旁证·对表差异清单

- TriMMC 无 src/cron/store.ts（其 cron 持久化=**agent-core 共享 JSON job-store**，非 SQLite）：正形位=`TriCompany/packages/agent-core/src/scheduler/job-store.ts:186`——**`state.nextRunAtMs = computeInitialNextRunAtMs(create.schedule, staggerMs)`，addJob 即生效**（:206 schedule 变更同款重算）
- TriMLC 应对齐差异=**一条**：addJob 缺「插入时补算初值」步。TriMLC 已有等价工具=`src/cron/scheduler.ts parseCronSchedule(schedule).nextRunMs()`（timer.ts:195/:386 同款在用），零新依赖
- 修复史勘（git log -S next_run_at）：仅 7a3ac1f（updateJob 重算）/23e58ae（Phase 3）——**无 addJob 插入修复笔**，与「六 job 建后从未触发」时序吻合

## 三、版本定性

- sg TriMLC 仓 @99d8466 工作树实证**含同款缺陷**（INSERT 缺列现存）→ sg 仓与 dev 8713 **两处同源缺陷态**
- **修法定性=同款补丁双落，非并版本**（sg 仓亦无修复可并）；sg 仓今晚窗随 BOD 令同步落补丁（本件未动 sg 仓，只读✓）
- 在役态注记：sg TriMLC clone **不在役**（8712=TriMMC；pgrep 零命中 BOD 已勘）——本件零 sg 生产影响

## 四、补丁 diff 稿

### Part A·INSERT 补列+初值补算（必选，最小缺陷修复）

```diff
--- a/src/cron/store.ts（addJob 内，现势 L221-237；行号按特征串定位，窗内以 git diff 复核）
+++ b/src/cron/store.ts
@@ function addJob @@
     const scheduleTz = scheduleKind === "cron" ? input.schedule.tz ?? null : null;
+
+    // F-3 修复（batch-09 件 1 稿）：addJob 即生效——插入时补算初值 next_run_at。
+    // 正形=agent-core job-store.ts:186 computeInitialNextRunAtMs；工具=timer.ts:195
+    // 同款 parseCronSchedule。缺阵后果链：timer.ts:93/:132 NULL 永不入选/不到期
+    // +重排仅在跑后（:195/:386）→自锁死环（F-3）。
+    const { nextRunMs } = parseCronSchedule(input.schedule);
+    const initialNextRun = nextRunMs();
+    const initialNextRunAt = initialNextRun != null ? new Date(initialNextRun).toISOString() : null;
     const stmt = db.prepare(`
       INSERT INTO cron_jobs (id, name, schedule_kind, schedule_value, schedule_tz,
-        system_prompt, command, role_id, enabled, state, created_at, updated_at, run_count, error_count)
-      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'idle', ?, ?, 0, 0)
+        system_prompt, command, role_id, enabled, state, created_at, updated_at, next_run_at, run_count, error_count)
+      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'idle', ?, ?, ?, 0, 0)
     `);
     stmt.run(
       id, input.name, scheduleKind, scheduleValue, scheduleTz,
       input.systemPrompt, input.command ?? null, input.roleId ?? null,
-      input.enabled ? 1 : 0, now, now,
+      input.enabled ? 1 : 0, now, now, initialNextRunAt,
     );
```

- 注①：`parseCronSchedule.nextRunMs()` 可空（scheduler.ts 签名 `number | null`）——非法 schedule 落 NULL=退化为现行为（不劣化）；interval<1s 抛错路径原有语义不变
- 注②：INSERT 处需 `import { parseCronSchedule } from "./scheduler.js";`（store.ts 现无此 import，补一行）

### Part B·既有行自愈回填（建议必选——不回填则既有 6 job 仍死，事件不闭）

```diff
--- a/src/cron/timer.ts（startCronTimer 起排前，首 tick 前一次性自愈；hook 点候窗内裁）
+++ b/src/cron/timer.ts
@@ 启动装载后、调度池构建前 @@
+  // F-3 Part B：存量 NULL next_run_at 自愈回填（INSERT 补列只救新 job——
+  // 既有六 job 须回填方复活；updateJobRun 路径=timer.ts:351 同款既有通道）
+  for (const j of jobs) {
+    if (j.enabled && !j.nextRunAt) {
+      const { nextRunMs } = parseCronSchedule(j.schedule);
+      const v = nextRunMs();
+      if (v != null) {
+        deps.store.updateJobRun(j.id, { nextRunAt: new Date(v).toISOString() });
+      }
+    }
+  }
```

- 注③：jobs 数组变量名与装载形以 startCronTimer 现势为准（稿以特征串「enabled 过滤首现处」定位；updateJobRun 通道=timer.ts:351 既有形）
- 注④：jobs 数组变量名以 startCronTimer 现势装载形为准（稿以特征串「enabled 过滤首现处」定位）

## 五、三判据

### 5.1 测试判据（#136 探针正形；路由已实证 src/server/app.ts:4050/4084/4139）

1. `POST /internal/v1/cron/jobs`（name=`f3-probe-<ts>`，schedule={kind:"every",everyMs:3600000}）→ 断言响应 `nextRunAt 非 NULL`（Part A 直证）
2. `GET /internal/v1/cron/jobs` → probe job nextRunAt 非 NULL 且 >now
3. 端到端触发实证（可选加件）：短周期 probe（everyMs=5000）→候 ≤15s→GET `lastRunAt 非 NULL`
4. `DELETE /internal/v1/cron/jobs/{id}` → GET 复查零残留
5. 存量复活断言（Part B 直证）：GET 六既有 job → nextRunAt 全非 NULL

### 5.2 段内重启步骤（禁裸杀）

1. 先验：`trilc status`+8713 探活（`GET /healthz`）；pidfile 按 port 分位先验=src/pidfile.ts:73 `registerPid(port)`（index.ts:145 实证 per-port 键位）——dev 状态目录 pid 文件窗内核对
2. `trilc stop` → `trilc status` 确认零活
3. 应用补丁（Part A 必选+Part B 候裁）→ `npm run check` 过 → 重启 `trilc start`
4. 复验：healthz jobCount:6 + 5.1 探针四步 + 存量复活断言

### 5.3 回滚锚

- `git revert <补丁 commit>` → 重复 5.2 重启步（同路径回退）
- 回滚安全性：无 schema 变更（CREATE TABLE 不触）；Part B 仅 UPDATE 值不损行；回滚后缺陷行为回归（job 再灭）但数据零损

## 六、使用依据

- /srv/fleet/TriMLC @99d8466 实读：src/cron/store.ts（L19-37/L218-244/L298/L348）/src/cron/timer.ts（L93/L129-136/L195-199/:351/:386-387）/src/cron/scheduler.ts/src/server/app.ts（L4048-4139）/src/pidfile.ts/src/index.ts（L145）
- 旁证：/srv/fleet/TriCompany/packages/agent-core/src/scheduler/job-store.ts（L184-209）
- 修复史：git log -S next_run_at（7a3ac1f/23e58ae）；记忆条 trimmc-mlc-addjob-divergence
