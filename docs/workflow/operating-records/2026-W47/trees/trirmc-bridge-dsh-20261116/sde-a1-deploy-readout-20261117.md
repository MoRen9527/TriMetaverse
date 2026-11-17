# SDE a1 部署窗四步毕报（BOD 裁 126 部署窗准·a1 3efc4df 机制激活·GLM 槽活形达成）

- sourceOfTruth: 本卷（a1 部署窗四步毕报正身）
- syncMode: write-time
- 施工席: SDE 小布；令源=BOD 裁 126 部署窗准四步执行令（D-39 全域授权·裁毕即生效·CTO 施工序 governs）
- 执行窗: 2026-11-17T01:4x-02:0x+08 段（date 现查锚）
- 判定: **四步全绿·a1 机制激活实锚（glm-anthropic key_configured=True 判据核达成）·GLM 槽活形=a1 spawn env 形达成（策略窗 apply 形候）**

## §一 · 四步执行实录

| 步 | 操作 | 读数 | 判 |
|---|---|---|---|
| 前办 | 河源 TriModel pull 对齐 3efc4df+**dist 重建**（proxy-spawn.js dist 落装 5525B·新代码激活前提） | build 毕 | ✓ |
| ① stop 旧 3334 | 前形快照=回滚锚（pid 2399228·setsid nohup node dist/src/proxy-server.js 重启形留档）→精确 kill node 本体（首 kill 误中 bash 包装修正补 kill） | 3334 已停 ✓ | ✓ |
| ② 3333 spawn 带 GLM env（a1 形） | **3333=systemd trimodel unit 管理形实锚**（Restart=on-failure·SIGTERM 非零退出触发拉回=新 dist 自动激活零 root 通道）——kill 3333（pid 2180253）→unit 拉回新 pid 2405427（uptime 00:02）→**a1 proxy-spawn 自动 spawn 3334 带 GLM env**（3334 LISTEN 复现实锚·key 零出进程 D-46 全程） | a1 激活 | ✓ |
| ③ healthz 复验门禁 | 3334 /proxy/health=**ok:true**+upstream_routes 三路在表+policy_effective 面读数 | 门禁过 | ✓ |
| ④ glm-anthropic 路由探针（zero-plaintext 形） | **HTTP 200 Anthropic message 形响应**（id/type/role/content/usage 结构面·zero-plaintext 读数=结构+状态级） | 200 全链绿 | ✓ |

- **判据核（glm-anthropic key_configured）**：**True**（a1 spawn env 有效性判据核达成——GLM-5.3-Flash/GLM-5.3 族路由在表+baseUrl=open.bigmodel.cn/api/anthropic）
- deepseek-anthropic key_configured=True（DEEPSEEK 注入面生效维持）

## §二 · 判读面（如实注三笔）

1. **B/C 转绿面延伸**：glm-anthropic 探针 200 响应 model=**deepseek-v4-pro**——GLM 请求被 **policy_effective env-default 策略改写**（matched_schedule_id=null=策略调度窗未匹配——env-default 策略吞请求改写 deepseek）——**GLM 原生直走=策略窗 apply 形候**（apply-strategy GLM 策略档 apply→matched_schedule 命中→glm-anthropic 路由直走——**CTO Form a 机制面同源**（apply-strategy=裁①机制面端点）——候令段（apply 形=TriModel 策略面·本席执行候令）
2. tristaciss-anthropic 路 key_configured=False（TMV 路零 key=非本轮面如实注）
3. TriModel 3333 零 healthz 面（404 形如实注——3334 /proxy/health=门禁正形）

## §三 · 回滚锚与护栏

- 回滚锚：旧 3334 快照（pid 2399228+重启形留档·可重启）+TriModel .env 600 原形+unit 拉回前 pid 2180253 快照
- 护栏：零触 loop 链/零 daemon 重启（trimodel unit restart=设计内替换照 CTO 精化注·非 daemon 面）/dsh 持久态零删/触发面熄火维持 ✓｜zero-plaintext 探针形（D-46 值面不出机正形）✓

## 使用依据

BOD 裁 126 四步令；CTO 精化注（stop=设计内替换）；a1 3efc4df（proxy-spawn.ts 进程内解卡机制）；本卷读数=01:4x-02:0x+08 现采实锚。

—— SDE 小布（毕报链=落卷 a1 树+SendMessage 直达值席→m-cos→BOD→CEO·卷面时戳=commit %cI）
