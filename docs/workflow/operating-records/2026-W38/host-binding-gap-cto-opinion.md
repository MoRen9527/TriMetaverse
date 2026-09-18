# 宿主支撑架构缺口·CTO 审核意见（Claude Code 宿主结构化绑定面）

- sourceOfTruth: 本件（CTO 技术可行性面；产品必要性面归 CPO，合成呈报候批）
- syncMode: static
- lastSyncedAt: 2026-09-18T22:5x+0800（date 现查 22:49:45，本回合执行）
- 触发: BOD 联合审核令（CEO 发现的宿主支撑架构缺口；背景事故=m-cos 复活无名址注册）
- 实勘: TriCompany `.github/binding-profiles/`（13 席 JSON，CTO 席键面实读）+ `TriCompany-copilot-host-assets/host-object-manifest.json` + 本机 `.claude/`（agents/compass/settings，无绑定面）

---

## 一、审核问 1：设计缺陷还是合理差异？

**裁：机制差异合理，结构化缺位是真实缺口——两层必须分开判。**

**第一层（机制形态）=合理差异**：Copilot 宿主用 JSON binding-profiles 是**它的平台消费形态所需**（Copilot 发布机器读 JSON 装配）；Claude Code 宿主的消费形态=CLI 参数（`claude -n <seat> --append-system-prompt-file <session>`）——参数本身承载绑定信息，机制不同不需要照搬 JSON。这一层**无缺陷**。

**第二层（结构化缺位）=真实缺口**：Claude Code 宿主的绑定信息**只存在于启动命令这个瞬态形态**——
- **无落盘**：13 席启动命令仅作为 manifest:1040 附近的**文档字段**存在（compass-rename-plan 实勘），非可执行/可校验结构；
- **无看门狗可读**：复活/拉起靠人记命令+屏扫（MSG-Alert 班）；
- **无名址自检**：启动时无「本席应注册为何名」的结构化依据——m-cos 复活无名址事故的直接土壤（根因=CLAUDE_CODE_CHILD_SESSION=1 环境遗传+无注册表对照面）；
- **无寻址校验**：SendMessage/通知通道的 target seat 名靠记忆，无权威名册可查（LG-036 通知通道的 target 解析目前单点硬编码 'bod'）。

**结论**：缺的不是「binding-profiles 等价物」，缺的是**「宿主会话名址录」这张轻量结构化面**。

## 二、审核问 2：应该补什么？

**裁=轻量名址录（seat registry），明确不照搬 binding-profiles 全量。**

### 2.1 形态：`.claude/seats.json`（TriMetaverse 仓，Claude Code 宿主位）

每席一条，**只含启动+寻址+健康三面**（不复制 binding-profiles 的 supportObjects 发布机器消耗件）：

```json
{
  "seat": "cos",
  "workName": "小贾",
  "hostFace": "local",
  "sessionPrompt": ".claude/compass/ceo-chief-of-staff.session.md",
  "launchCommand": "claude -n COS --append-system-prompt-file <sessionPrompt>",
  "launchEnvPolicy": { "strip": ["CLAUDE_CODE_CHILD_SESSION"], "require": ["FORCE_SESSION_PERSISTENCE=1"] },
  "notifyTarget": "bod-addressable: false",
  "health": { "daemonPort": null, "watchdogTask": "<schtasks 名或 null>" },
  "revivalPolicy": "schtasks|manual|watchdog"
}
```

关键字段动机（全部对应已实证的事故/需求）：
- **launchEnvPolicy.strip**：CLAUDE_CODE_CHILD_SESSION=1 环境遗传（m-cos 无名址根因）——复活器按字段结构化清洗，不再靠人记得；
- **notifyTarget**：LG-036 通知通道的跨面可寻址位（现在硬编码 'bod'，泛化时按名册解析）；
- **health/revivalPolicy**：看门狗与 DE 复活面的结构化消费位（08713/8711 daemon 探针+schtasks 任务名）。

### 2.2 真源关系：派生面，非第二真源

**由发布管线再生，禁手维护**：seat 名/工作名/session 路径的真源=TriCompany 五件套（agent-body fm name+岗位定义），扩展 source_publish_check 族增加 `host=claude-code` 渲染目标（现有 copilot/claude/claude-session 三 host 外的第四个输出面），从 manifest 派生生成 seats.json。**人工编辑会在下次重渲被覆盖**——与 compass 渲染纪律同构，零双真源。

### 2.3 消费者面（谁读它）

1. **看门狗/复活器**：按 revivalPolicy+launchEnvPolicy 结构化执行（消 m-cos 型事故）；
2. **启动自检**：会话启动 hook 读名册核「本席名已注册/环境已清洗」，异常即报（名址注册从「碰运气」变「有门禁」）；
3. **LG-036 通知通道**：target seat 按名册解析（泛化前置件）；
4. **DE 操作面**：stop/start/shutdown 按 health 字段定位（补 pidfile 修复后的操作结构化）；
5. **跨席协作**：SendMessage 寻址前置校验（防「发给不存在的席」）。

### 2.4 分期

- **MVP**：13 席+board 静态名册（发布管线派生）+复活器与启动自检两消费者——直接治今晚事故族；
- **P2**：notifyTarget 泛化（任意席跨面寻址，随通知通道扩面）、health 探针自动化、sg 侧同名册镜像（跨面联审互查）。

## 三、边界与风险

- **不扩 Copilot 侧**：binding-profiles 保持其平台形态不动，两宿主各按各的消费形态走，**不为统一而统一**；
- **隐私/安全**：seats.json 只含结构元数据（名/路径/策略），无凭据无内容面——低敏，可入库；
- **漂移风险**：派生管线断链时 seats.json 陈旧——照 compass 先例，发布校验件加「名册与 manifest 一致性」断言即可。

## 四、使用依据

- BOD 联合审核令（CEO 发现缺口+背景事故）
- 实勘：binding-profiles 键面（bindingProfileId/liveEntry/supportObjects 族）+ host-object-manifest.json 位置 + compass-rename-plan §五（启动命令文档字段形态）+ 本机 .claude/ 目录面（无绑定结构）
- 事故链：m-cos 复活无名址（CLAUDE_CODE_CHILD_SESSION=1 环境遗传，memory 本机席位复活名址缺口条）
- LG-036 通知通道（notifyTarget 硬编码 'bod' 现状）
