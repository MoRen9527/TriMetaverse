# SDE T2 活体验证段毕报（三案 smoke·案①②绿+案③黄档如实报·BOD 裁 128 governs）

- sourceOfTruth: 本卷（T2 活体验证段毕报正身）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 裁 128 T2 活体验证段即开令（CEO 02:45 授权径裁·止损线照走）
- 执行窗: 2026-11-17T0x-1xZ 段（分段实录）
- 判定: **案①spawn 真值案绿（模型调用活体 OK 应答）+案②sessions 面对表绿（r-duty-* 席目录族实锚）+案③adopt 黄档如实报（dsh rc.2 语义面候选·零硬闯）**

## §一 · 三案读数

| 案 | 形 | 读数 | 判 |
|---|---|---|---|
| ①spawn 一席真值案 | `dsh --profile headless "reply with the single word OK"` | **stdout=「OK」**（headless answer-one-task-exit 形·活体模型调用成功） | ✅ 绿 |
| ②list 见席（sessions 对表） | ~/.dsh/sessions 面 | **r-duty-* 席目录族实锚**（--home-fleet-.dsh-workspaces-r-duty-{cao,cfo,cho,cmo,…} 族=河源 R 面班组 dsh workspaces 形·任务书语境兑现）+session json 族 | ✅ 绿 |
| ③send 收到回执（--session-id adopt 形） | `dsh --profile headless --session-id <案①id> "continue…"` | **"session … does not exist"**——案① session 真位=**--srv-fleet-dsh--/session-b38ba22d…/session.v4.jsonl.zstd+lock**（cwd 面存储）——adopt 面不认该存储（**dsh 0.2.0-rc.2 headless session 不可 adopt 语义面候选**） | ⚠️ **黄档如实报**（零硬闯） |

- 案① session 实锚：session-b38ba22d-9f06-4443-b295-c5825026404a（projcache/sessions 双位投影——4124B）
- dsh 模型面实锚：dump-config 树=**@deepseek-ai/dsh-llm+deepseek-llm-api-extensions 族**（dsh 上游=DeepSeek LLM API 族——**案①"OK"=DeepSeek API 族调用活**——cordis.patch.yml=空数组 `[]`（**patch 面零接线实锚**——T1b cordis patch 接线面未落——案① 活=**dsh 缺省上游活**（dsh 内置 key/缺省端点形——**上游实锚候深勘**（dsh-llm config 深段·dsh 域面）

## §二 · 判读与候裁

- **案①活体=模型调用真值 ✓**（「OK」应答=LLM 真调用非 mock——**上游实锚=dsh 缺省 DeepSeek 族**（cordis.patch 零接线=**T1b cordis patch 接线面未落的旁证实锚**（接线未落而活=dsh 缺省上游自持形——**proxy-dual 8682 接线位=候令面**（接线后上游=proxy-dual 双后端形）
- **案③黄档两面**：a) dsh rc.2 headless session 不可 adopt 语义面（dsh 域勘·FSD/dsh 域协同）b) adopt 查找位与 headless 存储位隔离面（--srv-fleet-dsh-- 面位实锚在卷）
- 候令面：案③黄档候裁（dsh 域勘/FSD 协同/降级形）——T2 段判读=案①②绿+案③黄档（**非全绿非全红——如实三态**）

## §四 · 护栏遵行

零触现役 loop 链/零 daemon 重启/dsh sessions 持久态零删（案① session 留档零删）/触发面熄火维持 ✓｜zero-plaintext 值面纪律 D-46 照走（dsh 上游值面零接触——cordis.yml grep 零命中实锚）✓

## 使用依据

BOD 裁 128 T2 即开令（任务书 §五断言 2 三案形）；dsh 0.2.0-rc.2 CLI 实锚（--version/--help/--session-id adopt 面）；~/.dsh 面实勘实录；本卷读数=现采实锚。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
