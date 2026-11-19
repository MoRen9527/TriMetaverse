# preset composition 深勘裁定卷（CTO·SDE 报备升级授权承·agentPresets 缺供根因钉死+config 形修复勘定）

- date 现查: 2026-11-18 21:2x CST（D-47）
- 勘定人: CTO 小狄（深勘授权承·零改 dsh 护栏恪守·纯只读源勘+dump-config 面）
- 勘定形: heyuan 在役 `dsh --profile web/headless --dump-config`（组合树权威实锚）+ npm 0.2.0-rc.2 源读（dsh-agent-preset-registry/-preset/-headless/-web-app tarball）

## 一、根因钉死（三重实锚）

1. **服务供给链**：`agentPresets` 服务提供者=`@deepseek-ai/dsh-agent-preset-registry`（源锚 apr lib/index.js:481 `super(ctx, "agentPresets")`·其依赖 `inject=["loader","sessionProjections"]`）；preset 声明行=`@deepseek-ai/dsh-agent-preset`（源锚 ap lib/index.js:10 `static inject=["agentPresets"]`→`ctx.agentPresets.register(config)`——声明行**消费**该服务）；
2. **web 组合有供**：在役 `--profile web --dump-config` 实锚 L634-635：`- id: agent-preset-registry / name: '@deepseek-ai/dsh-agent-preset-registry'`（提供行源=dsh-web-app/cordis.patch.yml L561-565 `insert`·config.default: standard）；
3. **headless 组合零供**：在役 `--profile headless --dump-config` 实锚：14 条声明行在（preset-r-duty-cos… 每行 `inject agentPresets`）+**零 agent-preset-registry 提供行**（grep 唯 permission-presets+声明行）→ 14 行全部 pending「waiting for service: agentPresets」→ 审计面恒报「14 entries did not activate · waiting for service: agentPresets」——**非竞态、非环境态，组合缺提供行，结构性缺供**。

SDE 判别面（registry 源 L193「rows waiting for services the composition does not supply」）=**正确直锚**；授权深勘补全者=提供行归属（web-app patch 专有）与缺供结构位。

## 二、修复/config 形勘定（零代码改·patch 层单条 insert）

**headless 组合补一条提供行 insert**（与 14 声明行同 patch 层即毕——声明的注入等待机制原生消化时序：L251-253 源锚「Rows waiting for a Host service stay mounted: they activate by themselves once the provider finishes」）：

```yaml
- insert:
    - id: agent-preset-registry
      name: '@deepseek-ai/dsh-agent-preset-registry'
      config:
        default: r-duty-cos   # 必填项（registry Config.default required·值=14 声明行的 config.id 面）
```

- **落位面**：headless profile 的 cordis.patch.yml 用户层（14 条目 patch 同文件追加，或独立小 overlay `--patch` 尾挂——SDE 施工面择一；**荐独立 overlay**=4337 行 patch 零触碰·回滚=撤 overlay 一键）；
- **依赖面已验**：registry 注入的 loader/sessionProjections 在 headless 组合均供（dump 实锚 L27-28 typert-loader、L89-102 session-projection/-cache）——单条 insert 即闭合，无次级缺供；
- **default 值**：14 席任一 config.id 可（推荐 r-duty-cos 值席中性位）——仅约束「未显式选 preset 的新会话」，显式 adopt 的会话绑定不受影响；
- **零触面**：web profile 组合独立不受染（profile 层隔离）✓；在役运行会话零扰（新 boot 生效形）✓；npm 装 dsh-agent-preset-registry 在装 ✓（装清单实锚）零新依赖。

## 三、覆盖面与关联裁定

1. **notice-196 策一程序化增量前置件=闭合**：程序发起 convene 同经 headless 组合——组合级修复对手工/程序化两路同效（SDE 关联面呈报采认·WP9 v3 前置依赖登记面此卷为据）；
2. **「成功席 fallback/失败席空输出」现象解释**：preset 目录缺席时无显式绑定会话退 bare persona（fallback 形），显式依赖 preset 的会话=空输出——修复后目录在场，两态收敛；
3. **施工序建议（SDE 主刀）**：①overlay 落位→②`dsh --profile headless --dump-config | grep agent-preset-registry` 行在场核→③单发 headless smoke（审计 pending 清零·14 entries activate）→④回执。验证锚=dump 行在场+smoke pending 零；
4. **零改 dsh 护栏承 ✓**：全程 patch/config 形，零上游代码触碰。

## 使用依据

heyuan 在役 dump-config 双 profile 权威实锚；npm 0.2.0-rc.2 四包 tarball 源读（registry L193/L251-253/L465-481·ap L10/L25·web-app patch L561-565·headless patch 全读）；SDE 报备升级文（九拍零成实锚·err 恒文）；notice-196 关联面呈报；D-24/D-46/D-47 纪律。
