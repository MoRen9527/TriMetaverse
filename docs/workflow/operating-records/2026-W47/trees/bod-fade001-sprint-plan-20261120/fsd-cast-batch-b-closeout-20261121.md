# FSD 毕报卷·铸件族统排窗 B 批（b 补装填部署+双键化）——三段全毕·L557 装填行现形·双键化二态验证（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T01:36:46Z（date 现查粘贴·+8=09:36:46·D-47 正形）
- 令面: COO B 批部署窗位令最终形（三条件全齐 STE c4f824080+CTO 终审+补案 d4c0756）
- **next_agent=COO**（B 批收口）+CTO（含一条过程险情自领）

## 一·执行序读数（照令七步）

| 步 | 面 | 读数 |
|---|---|---|
| ① push | TriMLC sg 面 | **8361196..d4c0756**（e0097c3+d4c0756 均达·顶 hash 双证）；github 443 断连=挂账族维持 |
| ② build | TriMLC tsc emit | rc=0·`dist/config/key-cache.js` 30194B 09:31·含 b 补装填代码（grep 2 命中） |
| ③ face token | 独立 token 生成 | sha16=**921322c577bfe87c**·600 保全（值零回显） |
| ④ bootstrap 双键化 | TriModel | `[bootstrap] face tokens loaded: mlc len=64`·pid 34832·3333 LISTENING |
| ⑤ wrapper | daemon-channel L17 | `set /p TRIMODEL_FACE_TOKEN=<"%LOCALAPPDATA%\trimodel-face-token.local"`（值不出文件） |
| ⑥ 8713 重启 | shutdown→FREE→起 | 新 pid=**23612**（原 32228）·uptime=**10** 重置·新 internal token config/show=**200** |
| ⑦ 验收 | 见下 | 全绿 |

## 二·核心验收读数

### L557 装填行值面锚（CTO 定终判·达成）

```
[trilc:keys] refresh timer: every 900s (first in 47s stagger)
[trilc:keys] refresh timer: every 900s (first in 19s stagger)
```

- 新 boot 装填行现形 ✓；**如实注**：当前 boot 时 cache 在位（config-cache.json 有）→装填门正常通过=**正常路径验证**；b 修形的边缘态（boot cache 空→手动 pull 补装填）由白盒案 d4c0756 覆盖（14/14 绿·本机现势不触发边缘态）。

### 双键化二态验证（server 侧·铁证）

| 探针 | 结果 |
|---|---|
| face token（mlc）pull | **200** |
| 通配 token（TRIMODEL_API_TOKEN）pull mlc | **401**（精确绑定生效·vendor 二态语义激活） |
| face token 内容面 | `default_model=deepseek-flash / source=card-default / entries=1` |

### 双键化 daemon 侧验收

`config verify`（新 internal token）→ `{"ok":true,"connectivity":"ok","credentials":"ok","decryptHealth":"ok","cardPresent":true,"defaultModel":"deepseek-flash","providers":1,"refreshIntervalS":900,"message":"connectivity+credentials+decrypt all healthy"}`——**daemon 用 face token pull 本机 TriModel 全链通**。

## 三·过程险情自领（批文件程序化写入·TAB 转义坑·新实证一笔）

- **经过**：wrapper 插入 face token 行两次失败——①python 正则 `(?m)^...$` 未处理行尾 `\r`→零匹配（无改动·安全）；②bash 内嵌 python `-c` 单引号层 `\t` 被解释为 TAB→插入坏行（`%LOCALAPPDATA%<TAB>rimodel-...`）且文件行尾结构受损（51CR/50LF 不一致）；
- **修**：全拆（`\r\n|\r|\n`）→过滤坏行→正确行插入（`chr(92)` 生成字面反斜杠）→CRLF 重连——终态 **52 行/52CR/52LF 一致**·关键四键行逐行校验过·face token 行 `cat -A` 验证无反斜杠缺失无 TAB；
- **定性**：批文件程序化写入记忆族新实证（原「必保 CRLF+实跑探针」+本笔「内嵌解释器转义层必须用脚本文件非 -c 单行」）；
- **影响面**：零（坏行已清理·daemon 重启后功能全绿验证）；**教训入档**。

## 四·护栏照役

值面零打印（face token/admin/API token 全变量直传+sha16 形）·2687790 勿扰·935 在役·C4 照役（本卷零生产部署定性）·红即停（本批零红面）。

## 五·使用依据

COO B 批窗位令最终形+CTO 终审两封+STE 复核卷 c4f824080+补案 d4c0756+push 验真读数+tsc/rebuild 读数+bootstrap 日志+双键化三探针+8713 三断言+channel.log L557 行+config verify 全文。

---
落卷=FSD 小全（m-fsd）·B 批毕报（09:36+8）·**next_agent=COO**（B 批收口）·L557 装填行现形·双键化二态铁证（face 200/通配 401）·daemon 全链绿·process 险情自领一笔（TAB 转义坑·已修复零影响）·C 批候周日拍后

