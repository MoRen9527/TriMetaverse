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

## 使用依据

BOD 08:0x 令；CTO 卷 dbc5f8eb 架构面裁；agent-core 新 dist PathsSchema 实读；TriMLC 工作树 diff（未提交态）
