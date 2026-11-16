# T2 编码段执行读数卷·session-bridge 三 API 改指 dsh CLI 形（BOD 裁119②·FD 主刀）

- 执行: m-duty-fsd；施工位=sg TriRMC 仓 dev（双机 HEAD 同锚 e408da5 实勘·净树零漂）
- 交付锚: TriRMC dev **8252d9f**（session-bridge.ts 改形+test/session-bridge-dsh.test.ts 白盒族·单笔 commit revert 一键形）
- CTO 一审绿承录（五判据+两基线全过）+ coding per 方案卷 fsd-t2-design-20261116.md

## 一、三 API 改形读数（接口形零改·调用方零波及）

| API | claude 现役形 | dsh 改指形 |
| --- | --- | --- |
| spawnSession | claude --bg -n <id> "<task>"（背景正则） | dsh --profile headless <employeeId> <task>（boot+会话标识解析容错两形：uuid 正则/JSON 行·尾词回填兼容形） |
| listAgents | claude agents --json | ~/.dsh/sessions 工作区会话族扫描（缺目录=空注册表合法·不造替身） |
| sendMessage | claude -p --resume <id> --fork-session "<msg>" | dsh --profile headless --session-id <uuid> "<msg>"（定向投递→回复文本） |

- SessionBridgeOptions：claudeBin→**dshBin**（调面 app.ts 只传 runAsUser/cwd=零波及实证 grep）
- 新增导出：DshSessionState 五态/SESSION_TRANSITIONS 六行迁移表/resolveDshBin+DshBinResolution（PATH 三段+命中记录面）
- 降权链：headless profile 受限工具集+runuser 链保留；零凭据声明（bridge 构造段零 key·ANTHROPIC 族依赖消失净收益）

## 二、白盒族读数（test/session-bridge-dsh.test.ts）

- 三 API mock 端到端（boot sessionId 提取/send 回执/list 扫描）+PATH 三段解析序（显式/env/实勘位/which+全落空 fail-visible）+状态机迁移表六行全谱
- mock dsh 形：sh 脚本回 canned 输出（boot JSON/send 文本）

## 三、复验读数（loader 直引形 STE 修正案）

- 首跑 tsx 解析阻=TriRMC node_modules 零装（sg pull face 无 deps——非缺陷面）→ **STE 修正案采纳**：三路 loader 直引形 `/srv/fleet/.tsx-tool/node_modules/tsx/dist/loader.mjs`（.tsx-tool 中性工具目录 npm 面）
- 复验后双缺陷修正：existsDir→existsSync（漏改名）+spawn 尾词回填兼容形（mock send 输出回显语义）→ **7/7 全过**

## 四、验证与残面

- 常规门: TriRMC 套件零触（本件新增两文件+单文件改形·app.ts 调用面零波及 grep 实证）
- 残面如实: ①tsc 门禁=dev face（node_modules 10-03 版）候 STE/dev 联检 ②河源 pull 对齐=值席直办链（同步段照裁119②③）③实弹段=T1b CI 承办毕后（BOD 三裁②依赖序）

## 五、使用依据

BOD 裁119② 派工令；CTO 一审绿五判据；fsd-t2-design-20261116.md 方案卷；TriRMC e408da5/8252d9f diff；STE 复验修正案两笔（递案转值席）
