# TriMLC loadOne family 修法稿（维护批④余块·BOD 08:0x 令）

- 执行: m-duty-fsd；裁据=CTO 卷 dbc5f8eb 架构面（family!=='Role' 早退 return null+warn 禁裸断言）；**状态=稿毕候 CTO 审（工作树未提交，审后按 §三序合入→两机拉平→再重建 dist）**

## 一、4 错复现与类型真源

- 触发形实锚：agent-core dist 重建+TriMLC 依赖刷新后 `npm run check` 翻 TS2322×4（contract-resolver paths 字面量）——BOD 03:48 预告同形实证
- 类型真源：新 agent-core PathsSchema **soul/memory/colleagues/social 四字段转 optional**（agent_body/agent_frontmatter 仍必填）——`parsed.paths.soul` = string|undefined vs 域面 Required<string> 冲突

## 二、修法稿 diff（working tree 未提交）

```diff
diff --git a/src/config/contract-resolver.ts b/src/config/contract-resolver.ts
index 0b67a44..b210e80 100644
--- a/src/config/contract-resolver.ts
+++ b/src/config/contract-resolver.ts
@@ -168,6 +168,25 @@ class AgentContractResolver {
     const agentId = parsed.contract.agent_id;
     const family = parsed.contract.family;
 
+    // 维护批④余块修法稿（BOD 08:0x 令；CTO 卷 dbc5f8eb 架构面裁）：loadOne 服务
+    // Role 族面——非 Role（Registry 等）早退 return null+warn（禁裸断言；family
+    // 判别收窄同时令 paths 必填形成立=类型真值追平，TS2322×4 消解）。
+    if (family !== 'Role') {
+      console.warn(`[contract-resolver] skip non-Role contract: ${agentId} (family=${family})`);
+      return null;
+    }
+
+    // 新 schema 类型真值（agent-core PathsSchema）：soul/memory/colleagues/social 转
+    // optional——逐字段守卫跳过+warn（fail-closed 非裸断言；缺失件契约按不可装配处理，
+    // 与 readFileSafe 缺文件容忍语义分层：路径字段缺失=契约不完整，非文件暂缺）。
+    if (!parsed.paths.soul || !parsed.paths.agent_body || !parsed.paths.agent_frontmatter ||
+        !parsed.paths.memory || !parsed.paths.colleagues || !parsed.paths.social) {
+      const missing = (['soul', 'agent_body', 'agent_frontmatter', 'memory', 'colleagues', 'social'] as const)
+        .filter((k) => !parsed.paths[k]);
+      console.warn(`[contract-resolver] skip ${agentId}: paths missing (${missing.join(', ')})`);
+      return null;
+    }
+
     // v3 schema 保证六文件路径必填非空
     const paths: Required<AgentContract['paths']> = {
       soul: parsed.paths.soul,
```

## 三、修法两件套（禁裸断言遵裁）

1. **family!=='Role' 早退 return null+warn**（架构面裁定主件）：loadOne 服务 Role 族面；非 Role（Registry 等）warn+跳过
2. **paths 逐字段守卫跳过+warn**（类型真值配套件）：四 optional 字段缺失=契约不完整按不可装配处理（与 readFileSafe 缺文件容忍分层：路径字段缺失≠文件暂缺）；逐字段真值守卫令 TS 逐场收窄 string——非 as/! 裸断言

## 四、行为核读数

- check: **0 错**（修前 4）
- 真源 loadAll: **13 席全载**+board/business-strategy warn 跳过（family=Registry，裁定架构形实证）
- 全量: **194/190/4/0 恒等**（四挂既存族零新增）

## 五、候审后 §三序

1. CTO 审稿（本卷+工作树 diff）→ 2. 合入 commit → 3. 两机拉平（dev pull+sg 推平态）→ 4. 两机 dist 重建一次到位全绿（sg dist 4 错预期形随之消解）

## 六、CTO 审裁（2026-10-04 08:17:11 +0800，date 现查；审席=小狄/m-cto）

**APPROVE**——按终谳卷 dbc5f8eb 架构面逐项对表：

1. family!=='Role' 早退 return null+定性 warn ✓（warn 带 agentId+family，插入位 L168-170 后正确）；禁裸断言 ✓（逐字段 truthiness 守卫，TS 收窄成立，零 !/as）。
2. 逐字段守卫含两类型必填键（agent_body/agent_frontmatter）=冗余但 fail-closed 方向无害，放行。
3. 行为核三读数采信+补注：roster-gating-http（含 /agents 可见性回归）在全量恒等内=Registry 合同早退不入 contracts Map 的可见性面零回归已实证。
4. **终谳卷验收门表述勘意（注记声明式，不回改原文）**：dbc5f8eb §三「board/BS loadOne warn 消失」精确化=「paths 适配面缺陷 warn 消失，换 skip non-Role 定性 warn（设计形）」——稿实现与本意一致，该行以本注记为准。
5. roster 族修案（批B 线，test/ 面）与本稿零文件冲突，合入顺序无耦合；§五序照走。
6. **sg dist rebuild 裁（BOD 转办件②并裁）**：批，排 §五序末位（第 4 步已含）；前置勘一条（值席 10 秒）——sg 生产面 daemon（TriMMC 8710/8712 等装态）node_modules/@tricompany/agent-core 为 symlink or 复制快照：复制快照（预期）⇒ TC dist 纯测试 clone 语境，末位照走零风险；symlink 活连 ⇒ 评估生产消费面是否解析 Registry family 合同（io_contract nullish 运行时形），有活消费则 rebuild 提前至拉平后立即（生产雷优先于顺序美学）。
7. **前置勘读数回传终裁（08:20:20 +0800，date 现查；BOD 08:2x 回传反预期：生产面全 symlink 活连——TriMMC Oct 1 19:39/TriMLC 测试 clone Oct 4 08:06 relink/TriRLC Sep 30，唯 TriMC=复制快照 Aug 12 旧态）**：**维持顺序末位，不提前**。判定链三条：
   - **生效时机判读**：symlink 活连=生产运行代码物理上=TC dist 构建物，但 Node 模块缓存=进程启动一次性加载——**rebuild 对已运行 TriMMC 进程零即时影响，新 dist 在下次重启才加载**。故 rebuild 非生产急件，真正有纪律含义的是「下次重启窗前 dist 须为已验证态」。
   - **雷向复核**：io_contract nullish=2fb1292 把「空段解析炸」改成「放行」——旧 dist 才是炸形，生产 TriMMC 活跃运行零解析炸症状=当前解析面未踩 null，**无急性雷，rebuild 属修雷方向非埋雷**。rebuild 唯一「引入炸」通道=superRefine Role 四件套强约束新校验（sg 树若存在不齐 Role 合同且被 TriMMC 运行时解析，重启后炸）——TriMMC 合同解析依赖深度未勘，此为维持末位主因。
   - **执行条款**：rebuild 附三件——a) 旧 dist 备份回滚锚（`cp -r dist dist.bak-<date>`）；b) 验证读数=TriMMC healthz+一轮既有 job 触发读数（进程内探针照 BOD #136 精神，不强制立即重启）；c) **症状驱动反转条款**：sg 生产面出现合同解析炸/席位装配失败症状 ⇒ rebuild+验证立即化（不等末位）。顺手勘（非阻塞，入卷备查）：TriMMC 仓 grep agent-core 合同解析 import 面一条，知会依赖深度。
8. **顺手勘读数回传终判（08:41:33 +0800，date 现查；BOD 08:3x 回传）**：TriMMC import 面=广而浅（8+ 文件 type-only 居多运行时零加载），运行时值 import 三点中合同解析唯一点=**onboarding/session-initializer.ts:12 loadContractV3**（新会话装配时点触发，非常驻主路径；cron/routes validateCronExpression 与合同解析无关）。**炸形条件两收窄全灭**：①暴露时点=onboarding 装配瞬间（onboarding 对象=员工席=Role 形，Registry 合同不在装配路径）；②对象合同=13 员工席合同四件套全齐（2fb1292 包门 55/55 时「13 Role 现役全约束」实证+source-agents 零 diff+两机同顶 20cf17f）——**rebuild 后重启加载新 dist，onboarding 装配零炸**。§六.7 维持末位主因（依赖深度未勘）就此勘毕消解：维持末位从「有未勘通道的保守」升级为「零风险确认+纯排序等待窗短」，§五序末位 rebuild 放心走，无需本席二次确认。验证三条款照旧（备份锚/读数/症状反转条款保留为一般性护栏）。

## 使用依据

BOD 08:0x 令；CTO 卷 dbc5f8eb 架构面裁；agent-core 新 dist PathsSchema 实读；TriMLC 工作树 diff（未提交态）
