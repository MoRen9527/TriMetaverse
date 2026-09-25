# STE 手测环境说明——TriModel 连接配置页 v2（TASK-TRIMODEL-RECOVERY-LADDER-01 波① 段2 UI 终验收）

> sourceOfTruth: 本件（一次性手测环境说明，随树归档）
> syncMode: snapshot
> lastSyncedAt: 2026-09-25T19:55Z（+0800=2026-09-26 03:55；r2=CTO 点名风险项实勘勘正笔）
> 作者: FSD 小全（m-fsd）· 验收派单: CTO 段1 签认指示 · 手测执行: STE 小柯

---

## 0. 红线（先读，违一条即停手上报）

1. **真活体 `C:\Users\jedih\.claude\settings.json` 全程零接触**。本手测把写路径全部钉进临时目录（§1 env 钉位），任何一步发现写到真活体（§5 hash 变化）→ 立即停手、保留现场、上报 CTO。
2. 手测**开始前**与**结束后**各验一次真活体 hash，读数必须都等于基线：

   ```
   491f33353d50f938b6b6dfd26cc8c7804500e10be55ac52caebb6e633cd778b2
   ```

   验证命令见 §5 第 0/7 步。两次读数随报告原样粘贴。
3. 手测服务端口用 **3399**（避开现役 8711/8713 daemon 族与默认端口），测完即停进程。
4. 本手测只验**本机通道**（`/v1/config/claude-fallback*`）。sg 通道（claude-fallback-sg）不在本手测范围。

## 1. 临时文件钉法（起真 serve）

### 1.1 建临时域

PowerShell：

```powershell
New-Item -ItemType Directory -Force D:\tmp\ste-fb | Out-Null
@'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-old-token-0123456789",
    "ANTHROPIC_BASE_URL": "https://old.example.com/api",
    "ANTHROPIC_MODEL": "old-model",
    "KEEP_ME": "untouched-value"
  },
  "model": "old-model",
  "permissions": { "defaultMode": "bypassPermissions" }
}
'@ | Set-Content -Encoding utf8 D:\tmp\ste-fb\settings.json
```

### 1.2 钉位启动服务（cwd=TriModel 仓根 `D:\Code\ai\TriModel`）

```powershell
cd D:\Code\ai\TriModel
$env:TRIMODEL_PORT = '3399'
$env:TRIMODEL_ADMIN_TOKEN = 'ste-manual-token-2026'
$env:TRIMODEL_CLAUDE_SETTINGS = 'D:\tmp\ste-fb\settings.json'   # 关键钉位：写路径全落临时文件
$env:TRIMODEL_AUDIT_LOG = 'D:\tmp\ste-fb\config-audit.log'      # 审计行落临时域
node --import tsx src\server.ts
```

看到 `[trimodel] listening` 与 endpoints 行即起服成功。浏览器开 `http://127.0.0.1:3399/ui`。

> 四个 env 全部只影响本进程，关闭窗口即失效，不污染系统环境。

## 2. 五门 UI 流清单（人手走查，逐条打勾）

UI 页面：兜底连接配置区。凭据框填测试密钥 `sk-ste-manual-abcdefghij`（16+ 位）。

| 门 | 步骤 | 预期 |
|---|---|---|
| — | 开 `/ui`，看兜底配置区 | 模板下拉已加载（bigmodel 可选；未部署模板禁用态或缺失均为合理现势，记录所见即可） |
| 门② 锁 | 只选模板不填凭据，直接点「预览」 | 人话拒：提示先填凭据（键名锁在服务端，UI 侧门提前拦截为体验层） |
| 门③ 凭据健康 | 凭据填 `PLACEHOLDER`（或 3 个字符），选模板，点「预览」 | 人话拒：占位符/密钥过短提示；**不发请求不进预览** |
| 门④ 预览 | 凭据填合法值，选 bigmodel 模板，点「预览」 | 出 diff（地址/模型/密钥仅长度），按钮解锁进入可写态；此时 `D:\tmp\ste-fb\settings.json` **未被修改**（可顺手开文件确认） |
| 门① 备份 | 点「写入」 | 写入成功提示含「重启会话后生效」；凭据框自动清空；临时目录出现 `settings.json.bak-*` 备份一份，内容=写前原文 |
| 门⑤ 掩码+审计 | 开 `D:\tmp\ste-fb\config-audit.log` | 有结构化审计行；**全文件搜 `sk-ste-manual-abcdefghij` 零命中**（掩码红线），密钥只以尾 4 位形态出现 |
| 写后复读 | 刷新 `/ui` 页面看兜底区当前值 | 地址/模型=模板三组值；凭据只显尾 4 位（`****ghij`） |
| 门控保持 | 写入成功后立刻再点「写入」 | 按钮应保持门控（禁点）；须重新预览才能再写（本次实测修复的 bug 位：成功路径不得自动恢复按钮） |
| 回滚武装 | 「查看备份」→ 选刚产备份 → 点回滚（两次点击武装） | settings.json 恢复为写前原文，复读区回到 old-model 值，审计行 who=ui-restore |
| 401 人话 | 「管理令牌」框填错误值 → 预览 → 写入 | 人话拒：「令牌不正确」类提示，settings.json 零变化 |
| 503 人话 | （附加，可选）不带 `TRIMODEL_ADMIN_TOKEN` 重启服务后走写链 | 人话拒：「管理写面未启用」类提示 |

走查判据：**预期列全部吻合**=通过；任一条不符→截图+操作序列上报，不停在「看起来差不多」。

## 3. 60 秒切换验收脚本（API 层平行验证）

> 用途：UI 人手走查之外的**同环境 API 层自动化断言**（真 HTTP 链路，非 mock）。全程 ≤60 秒。
> 前置：§1 服务已按钉位起好（脚本复用同一服务与同一临时文件）。
> 落盘为 `D:\tmp\ste-fb\accept-60s.ps1` 后执行；脚本自断言，末尾打 PASS/FAIL 总结。

```powershell
$ErrorActionPreference = 'Stop'
$base = 'http://127.0.0.1:3399'
$tok  = 'ste-manual-token-2026'
$set  = 'D:\tmp\ste-fb\settings.json'
$key  = 'sk-ste-manual-abcdefghij'
$H    = @{ authorization = "Bearer $tok"; 'content-type' = 'application/json' }
$fail = @()
function Check($name, $cond) { if ($cond) { Write-Host "PASS  $name" } else { Write-Host "FAIL  $name"; $script:fail += $name } }

# 前置：回滚到基线（幂等起步态）
Copy-Item D:\tmp\ste-fb\settings.json.baseline.json $set -Force -ErrorAction SilentlyContinue
if (-not (Test-Path $set)) { @'
{"env":{"ANTHROPIC_AUTH_TOKEN":"sk-old-token-0123456789","ANTHROPIC_BASE_URL":"https://old.example.com/api","ANTHROPIC_MODEL":"old-model"},"model":"old-model"}
'@ | Set-Content -Encoding utf8 $set }

# ① 预览 dry-run：200 + 零写盘（三输入体：base_url/model=bigmodel 模板现值）
$before = (Get-Item $set).LastWriteTimeUtc
$pv = Invoke-RestMethod -Uri "$base/v1/config/claude-fallback/preview" -Method Post -Headers $H `
  -Body (@{ base_url='https://open.bigmodel.cn/api/anthropic'; api_key=$key; model='glm-5.3-flash' } | ConvertTo-Json)
Check 'preview-200'            ($pv.diff -ne $null)
Check 'preview-zero-write'     ((Get-Item $set).LastWriteTimeUtc -eq $before)

# ② 写入：200 + 三组值落盘 + 其余键保留
$r = Invoke-RestMethod -Uri "$base/v1/config/claude-fallback/restore" -Method Post -Headers $H `
  -Body (@{ base_url='https://open.bigmodel.cn/api/anthropic'; api_key=$key; model='glm-5.3-flash' } | ConvertTo-Json)
$doc = Get-Content $set -Raw | ConvertFrom-Json
Check 'write-200-message'   ($r.message -match '重启会话后生效')
Check 'write-base-url'      ($doc.env.ANTHROPIC_BASE_URL -match 'bigmodel')
Check 'write-9key-family'   ($doc.env.ANTHROPIC_DEFAULT_OPUS_MODEL_NAME -eq $doc.env.ANTHROPIC_MODEL)
Check 'write-backup-exists' ((Get-ChildItem (Split-Path $set) -Filter 'settings.json.bak-*').Count -ge 1)

# ③ 复读：GET 读回新值 + 密钥只给掩码
$g = Invoke-RestMethod -Uri "$base/v1/config/claude-fallback" -Headers @{ authorization = "Bearer $tok" }
Check 'get-new-model'  ($g.model -eq $doc.env.ANTHROPIC_MODEL)
Check 'get-masked-key' ($g.api_key_masked -match '^\*\*\*\*')
Check 'get-no-raw-key' ((Invoke-RestMethod -Uri "$base/v1/config/claude-fallback" -Headers @{ authorization = "Bearer $tok" } | ConvertTo-Json -Depth 5) -notmatch [regex]::Escape($key))

# ④ 掩码红线：审计文件全文本零密钥
$audit = Get-Content D:\tmp\ste-fb\config-audit.log -Raw -ErrorAction SilentlyContinue
Check 'audit-no-raw-key' (($null -eq $audit) -or ($audit -notmatch [regex]::Escape($key)))

# ⑤ 401 fail-closed：错令牌拒写 + 文件零触碰
$snap = Get-Content $set -Raw
try { Invoke-RestMethod -Uri "$base/v1/config/claude-fallback/restore" -Method Post `
  -Headers @{ authorization = 'Bearer wrong-token'; 'content-type' = 'application/json' } `
  -Body (@{ base_url='https://open.bigmodel.cn/api/anthropic'; api_key=$key; model='glm-5.3-flash' } | ConvertTo-Json) | Out-Null; Check 'unauth-401' $false }
catch { Check 'unauth-401' ($_.Exception.Response.StatusCode.value__ -eq 401) }
Check 'unauth-zero-write' ((Get-Content $set -Raw) -eq $snap)

Write-Host ''
if ($fail.Count -eq 0) { Write-Host '=== 60s ACCEPT: ALL PASS ===' -ForegroundColor Green }
else { Write-Host "=== 60s ACCEPT: FAIL x$($fail.Count): $($fail -join '; ') ===" -ForegroundColor Red; exit 1 }
```

> 勘正注（FSD 实勘 2026-09-26，CTO 点名风险项核覆）：preview/restore 请求体=**三输入** `{ base_url, api_key, model }`——UI 前端把模板三组值代填进表单后发三输入；`{ template }` 形态属 inject-key（部署钥注入）端点，不在本手测范围。脚本三处 body 已按实勘改齐。三组值来源=TEMPLATES bigmodel 行现值（`src/api/claude-fallback.ts`）；preview 路径实勘=`routes.ts:115`，与本脚本一致。`TRIMODEL_DEPLOY_KEY` 实为**独立钥文件路径**（deployKeyPath() 读文件），非钥内容——本手测不走 inject-key，无需钉位（§1 已删）。

## 4. 「重启会话后生效」验证（分层口径）

- **本手测范围（临时域）**：写入后文件持久性验证——① `GET /v1/config/claude-fallback` 读回新值（§3 步③）；② 停服务→重启服务（同钉位）→再 GET 仍为新值。两步过=「写入已持久、服务重启不丢」成立。
- **真会话生效**（Claude Code 新会话读新 settings）：属 Claude Code 运行时行为，**不在临时域手测范围**——真活体零接触红线之下不真切。该步留给波④真切换窗口在授权下完成；UI 文案「重启会话后生效」的断言已由自动化测试覆盖（ui-boot-connection 契约测）。

## 5. 真活体 hash 验证命令（手测前后各一次）

PowerShell：

```powershell
Get-FileHash C:\Users\jedih\.claude\settings.json -Algorithm SHA256 | Select-Object -ExpandProperty Hash
```

- 期望读数（前后两次都必须）：`491F33353D50F938B6B6DFD26CC8C7804500E10BE55AC52CAEBB6E633CD778B2`
- PowerShell 输出为大写，与基线比对忽略大小写即可；**任何不一致=立即停手上报**。
- 附带记录 mtime：`(Get-Item C:\Users\jedih\.claude\settings.json).LastWriteTime`（参考值 2026-09-25 04:09:35 +0800）。

## 6. 收尾

1. 停服务进程（关窗口 / Ctrl+C）。
2. 临时域保留不删（`D:\tmp\ste-fb\`）——候 CTO 复核后统一清理。
3. 报告三要素：五门清单逐条结果 + 60s 脚本输出原文 + 真活体 hash 前后两读数。报 CTO 转 COO 入档。
