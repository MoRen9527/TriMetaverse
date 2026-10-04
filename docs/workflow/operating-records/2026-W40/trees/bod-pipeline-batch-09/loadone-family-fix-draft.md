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

## 使用依据

BOD 08:0x 令；CTO 卷 dbc5f8eb 架构面裁；agent-core 新 dist PathsSchema 实读；TriMLC 工作树 diff（未提交态）
