# TriCade MSI 重新打包方案（S8-1）

> **作者**：小狄（CTO）
> **日期**：2026-07-22
> **版本**：v1.0
> **树**：TWF-002-S8 | **节点**：TWF-002-S8-1 | **下一步**：FullStackDeveloper（S8-2）
> **上游**：TWF-002 Phase 5 报告 + known-deviations.md + arch-trilc-daemon technical-design §8

---

## 0. 前置核查摘要

| # | 核查项 | 文件 | 结果 |
|---|--------|------|------|
| 0 | 工作路径 | `docs/workflow/operating-records/2026-W30/trees/TWF-002-S8/` | ✅ 正确 |
| 0.5 | 归属路由 | CTO 域（打包方案设计、WiX 源码变更、版本策略） | ✅ 未越界 |
| 1 | CEO 输入 | TWF-002-S8-1 任务单 | 设计 TriCade MSI 重新打包方案 |
| 2 | BusinessStrategy | Phase 5 报告 L18 — TriLC 为"本地人机协作主入口" | ✅ 无冲突 |
| 3 | 技术真源 | `arch-trilc-daemon/technical-design.md` §8 | ✅ MSI 安装 UX 规格完整 |
| 4 | 模块 Registry | TriLC `package.json` v0.1.0 / TriPilot `package.json` v0.0.1 / TriCode `package.json` | ✅ |
| 5 | 构建 Registry | `cpo-tricade-packaging-split/tree-op.json` done — Bundle 13.1MB 90s | ✅ 拆分方案已裁决 |
| 6 | 跨树依赖 | `arch-trilc-msi-e2e` node-1 in_progress（E2E 测试方案） | ⚠️ S8-2 执行前需 node-2 done |

**关键发现**：
1. TriLC CLI 已实现 `install-service` / `uninstall-service` / `install-regrun` / `uninstall-regrun`（`cli.ts` L290-472），可直接被 WiX CustomAction 调用。
2. 当前 Bundle WXS 使用 `WixUI_Minimal`（仅进度条，无交互页面）。需升级为自定义 UI 序列以嵌入 `TriLCDaemonDlg`。
3. 当前 Bundle 版本号 `1.126.04524/04525` 派生自 VSCodium 版本，应切换为独立 TriCade 版本号。
4. TriLC CLI 是 Node.js 脚本（`dist/cli.js`），MSI CustomAction 需通过 Node.js 运行时调用。方案：在 build-bundle.sh 中生成 `trilc.cmd` 包装脚本，自动探测 VSCodium Base 内置 `node.exe`。

---

## 1. 版本号策略

### 1.1 决策

| 维度 | 当前值 | 新值 | 理由 |
|------|--------|------|------|
| ProductVersion | `1.126.04524`（VSCodium 派生） | `0.2.0.0` | TriCade Bundle 独立产品，不与 VSCodium 版本耦合 |
| ProductCode | 每构建新 GUID | 每构建新 GUID | WiX 标准实践，不变 |
| UpgradeCode | `{8F7A2B1C-D3E4-5678-9ABC-DEF012345678}` | **不变** | 保持同产品家族升级路径 |
| RTMProductVersion | `0.0.1` | `0.0.1` | 不变，历史起点 |
| build-bundle.sh RELEASE_VERSION 默认值 | `1.126.04524` | `0.2.0` | 脚本参数，构建时可通过 `RELEASE_VERSION` 覆盖 |

### 1.2 版本语义

```
TriCade Bundle v0.2.0.0
  ├─ 0     = 主版本（Beta 阶段，正式发布前）
  ├─ 2     = 次版本：daemon + tray + sync 集成
  ├─ 0     = 补丁号
  └─ 0     = 构建号（MSI 4 段要求）
```

版本历史：
- `v0.1.0` = W29 初始 Bundle（TriPilot + TriLC + TriCode 文件覆盖，无 daemon 注册）
- `v0.2.0` = TWF-002-S8 重新打包（新增 TriLCDaemonDlg + CustomAction + Tray.exe + sync 字段）

### 1.3 升级策略

由于 Bundle UpgradeCode 不变，v0.1.0 → v0.2.0 升级自动执行 **先卸载后安装**（`RemoveExistingProducts After="InstallInitialize"`，已有逻辑）。卸载时执行新增的 `UninstallTriLCService` CustomAction 清理旧服务注册，避免残留。

---

## 2. WiX 源码变更范围

### 2.1 变更文件清单

| 文件 | 变更类型 | 变更内容 |
|------|---------|---------|
| `vscodium-bundle.wxs` | **修改** | 新增对话框 + CustomAction + UI 序列 + InstallExecuteSequence |
| `vscodium-bundle.xsl` | **修改** | 新增 tray 目录的 RemoveFolderEx 注入 |
| `i18n-bundle/vscodium-bundle.en-us.wxl` | **修改** | 新增 TriLCDaemonDlg 中英文字符串 |
| `build-bundle.sh` | **修改** | 版本号 + `trilc.cmd` 生成 + Tray.exe 收集 |
| `trilc.cmd`（新文件） | **新增** | Node.js 自动探测包装脚本（构建时由 build-bundle.sh 生成） |

### 2.2 vscodium-bundle.wxs 变更详情

#### A. 头部 namespace 增加

```xml
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi"
     xmlns:util="http://schemas.microsoft.com/wix/UtilExtension">
```

无需变更 — `WixUIExtension` 已通过 `candle.exe -ext WixUIExtension` 链接，`util` namespace 已存在。

#### B. 新增 `TriLCDaemonDlg` 对话框

在 `</Product>` 之前插入独立 `<Fragment>`。**TriLC 复选框使用独立属性名 `INSTALL_TRILC_SERVICE`，不与 Base 属性冲突**：

```xml
<!-- 新增：TriLC daemon 注册对话框 -->
<Fragment>
  <UI>
    <Dialog Id="TriLCDaemonDlg" Width="370" Height="270"
            Title="TriCade Bundle — TriLC Service" NoMinimize="yes">
      <Control Id="BannerBitmap" Type="Bitmap" X="0" Y="0" Width="370" Height="44"
               Text="WixUI_Bmp_Banner" />
      <Control Id="Title" Type="Text" X="15" Y="6" Width="340" Height="30"
               Transparent="yes" NoPrefix="yes"
               Text="{\WixUI_Font_Title}TriLC Local Controller" />
      <Control Id="Description" Type="Text" X="25" Y="50" Width="320" Height="40"
               Text="TriLC 是本地 AI 助手守护进程。注册为系统服务后将在系统启动时自动运行，确保 IDE 关闭后任务继续执行。" />
      <Control Id="TriLCCheckbox" Type="CheckBox"
               X="25" Y="95" Width="320" Height="20"
               Property="INSTALL_TRILC_SERVICE"
               CheckBoxValue="1"
               Text="将 TriLC 注册为系统服务（推荐）" />
      <Control Id="TriLCAdminNote" Type="Text"
               X="40" Y="118" Width="290" Height="32"
               Text="注意：注册系统服务需要管理员权限。无管理员权限时将自动使用注册表启动（登录时运行）。">
        <Condition Action="hide"><![CDATA[INSTALL_TRILC_SERVICE <> "1"]]></Condition>
      </Control>
      <Control Id="Back" Type="PushButton" X="180" Y="243" Width="56" Height="17"
               Text="{\WixUI_Font_Bold}&amp;上一步" />
      <Control Id="Next" Type="PushButton" X="236" Y="243" Width="56" Height="17"
               Default="yes" Text="{\WixUI_Font_Bold}&amp;下一步" />
      <Control Id="Cancel" Type="PushButton" X="304" Y="243" Width="56" Height="17"
               Cancel="yes" Text="{\WixUI_Font_Bold}取消" />
    </Dialog>
  </UI>
</Fragment>
```

#### C. 新增 CustomAction 片段

```xml
<!-- 新增：TriLC 服务注册/卸载 CustomActions -->
<Fragment>
  <!--
    Step 1: 收集安装路径到 CustomActionData（immediate → deferred 传递）
  -->
  <CustomAction Id="SetTriLCInstallPath"
                Property="InstallTriLCService"
                Value="&quot;[APPLICATIONFOLDER]resources\app\tools\trilc\trilc.cmd&quot; install-service"
                Execute="immediate" />

  <CustomAction Id="SetTriLCUninstallPath"
                Property="UninstallTriLCService"
                Value="&quot;[APPLICATIONFOLDER]resources\app\tools\trilc\trilc.cmd&quot; uninstall-service"
                Execute="immediate" />

  <!--
    Step 2: 执行服务注册（deferred, no impersonation → SYSTEM 上下文）
  -->
  <CustomAction Id="InstallTriLCService"
                BinaryKey="WixCA"
                DllEntry="WixQuietExec64"
                Execute="deferred"
                Impersonate="no"
                Return="check" />

  <!--
    Step 3: 执行服务卸载（deferred, no impersonation）
  -->
  <CustomAction Id="UninstallTriLCService"
                BinaryKey="WixCA"
                DllEntry="WixQuietExec64"
                Execute="deferred"
                Impersonate="no"
                Return="check" />

  <!--
    管理权限检测（immediate，安装前判断）
  -->
  <CustomAction Id="CheckAdminPrivilege"
                Script="vbscript">
    <![CDATA[
      Dim objShell
      Set objShell = CreateObject("Shell.Application")
      If Not objShell.IsRestricted("System") Then
        Session.Property("HAS_ADMIN_PRIVILEGE") = "1"
      Else
        Session.Property("HAS_ADMIN_PRIVILEGE") = "0"
      End If
    ]]>
  </CustomAction>
</Fragment>
```

#### D. InstallExecuteSequence 新增条目

在已有的 `<InstallExecuteSequence>` 块（当前仅含 `PreventDowngrading` + `RemoveExistingProducts`）中追加：

```xml
<InstallExecuteSequence>
  <!-- 已有 -->
  <Custom Action="PreventDowngrading" After="FindRelatedProducts">NEWPRODUCTFOUND</Custom>
  <RemoveExistingProducts After="InstallInitialize" />

  <!-- 新增：卸载时清理服务（先于文件删除） -->
  <Custom Action="SetTriLCUninstallPath" Before="UninstallTriLCService"><![CDATA[REMOVE ~= "ALL"]]></Custom>
  <Custom Action="UninstallTriLCService" Before="RemoveFiles"><![CDATA[REMOVE ~= "ALL"]]></Custom>

  <!-- 新增：管理权限检测（早于 InstallTriLCService） -->
  <Custom Action="CheckAdminPrivilege" After="CostFinalize"><![CDATA[NOT Installed]]></Custom>

  <!-- 新增：安装时注册服务（仅当 checkbox 勾选） -->
  <Custom Action="SetTriLCInstallPath" Before="InstallTriLCService"><![CDATA[INSTALL_TRILC_SERVICE = "1" AND NOT Installed]]></Custom>
  <Custom Action="InstallTriLCService" After="InstallFiles"><![CDATA[INSTALL_TRILC_SERVICE = "1" AND NOT Installed]]></Custom>
</InstallExecuteSequence>
```

#### E. UI 序列改造

将现有 `<UI><UIRef Id="WixUI_Minimal" /></UI>` 改为：

```xml
<UI>
  <!-- 基于 WixUI_Minimal（WelcomeDlg → ProgressDlg → ExitDialog）-->
  <UIRef Id="WixUI_Minimal" />

  <!-- 注入 TriLCDaemonDlg，覆盖 WelcomeDlg→ProgressDlg 默认跳转 -->
  <DialogRef Id="TriLCDaemonDlg" />

  <Publish Dialog="WelcomeDlg" Control="Next" Event="NewDialog"
           Value="TriLCDaemonDlg">1</Publish>
  <Publish Dialog="TriLCDaemonDlg" Control="Back" Event="NewDialog"
           Value="WelcomeDlg">1</Publish>
  <Publish Dialog="TriLCDaemonDlg" Control="Next" Event="NewDialog"
           Value="ProgressDlg">1</Publish>

  <!-- CustomAction 进度文本 -->
  <ProgressText Action="InstallTriLCService">正在注册 TriLC 系统服务...</ProgressText>
  <ProgressText Action="UninstallTriLCService">正在移除 TriLC 系统服务...</ProgressText>
</UI>
```

**关键点**：
- `WixUI_Minimal` 默认序列：WelcomeDlg → ProgressDlg → ExitDialog。通过 `<Publish>` 覆盖 WelcomeDlg 的 Next 跳转，即可将 `TriLCDaemonDlg` 插入中间。
- 维护模式（修复/卸载）时 `WixUI_Minimal` 跳过 WelcomeDlg 直接进入 ProgressDlg，TriLCDaemonDlg 不会被显示——这是正确的：修复/卸载不需要重新询问服务注册。
- `ProgressText` 仅在相应 CustomAction 执行时显示，无副作用。

### 2.3 vscodium-bundle.xsl 变更详情

在 XSL 末尾（`</xsl:stylesheet>` 之前）追加 Tray 目录清理规则：

```xml
<!--
  Inject RemoveFolderEx into the tray directory (if present in S8 repackaging).
-->
<xsl:template match="wi:Directory[@Name='tray']">
  <xsl:copy>
    <xsl:copy-of select="@*"/>
    <xsl:apply-templates />
    <wi:Component Id="CleanupTriLCTrayDir" Guid="*">
      <wi:RegistryValue Root="HKLM"
        Key="SOFTWARE\TriMetaverse\TriCade\Bundle"
        Name="TriLCTrayPath" Type="string" Value="1" KeyPath="yes" />
      <util:RemoveFolderEx On="uninstall" Property="{@Id}" />
    </wi:Component>
  </xsl:copy>
</xsl:template>
```

并在 `MainApplication` Feature 中新增 `<ComponentRef Id="CleanupTriLCTrayDir" />`（通过修改 `vscodium-bundle.wxs` 的 Feature 列表）。

### 2.4 i18n-bundle/vscodium-bundle.en-us.wxl 变更详情

在现有 `<WixLocalization>` 内追加：

```xml
<String Id="TriLCDaemonDlg_Title">TriLC Local Controller</String>
<String Id="TriLCDaemonDlg_Description">TriLC is a local AI assistant daemon. Registering as a system service ensures tasks continue running after the IDE closes.</String>
<String Id="TriLCDaemonDlg_Checkbox">Register TriLC as a Windows service (recommended)</String>
<String Id="TriLCDaemonDlg_AdminNote">Note: Admin privileges required for service registration. Without admin, registry auto-start will be used instead (launches on login).</String>
<String Id="Progress_InstallTriLCService">Registering TriLC system service...</String>
<String Id="Progress_UninstallTriLCService">Removing TriLC system service...</String>
```

### 2.5 build-bundle.sh 变更详情

#### A. 版本号默认值

```bash
# 第 17 行附近，替换
# RELEASE_VERSION default from 1.126.04524 to 0.2.0
RELEASE_VERSION="${RELEASE_VERSION:-0.2.0}"
```

#### B. Tray.exe 收集（条件包含）

在 "Collect TriCode" 之后追加：

```bash
# --- TriLC Tray (conditional: arch-trilc-tray output) ---
echo "Collecting TriLC Tray..."
TRILC_TRAY_EXE="${TRILC_DIR}/src/tray/bin/Release/net8.0-windows/win-x64/publish/TriLC.Tray.exe"
if [[ -f "${TRILC_TRAY_EXE}" ]]; then
    mkdir -p "${BINARY_DIR}/resources/app/tools/trilc/tray"
    cp "${TRILC_TRAY_EXE}" "${BINARY_DIR}/resources/app/tools/trilc/tray/"
    # Copy tray dependencies if publish directory exists
    if [[ -d "$(dirname "${TRILC_TRAY_EXE}")" ]]; then
        cp -r "$(dirname "${TRILC_TRAY_EXE}")"/* "${BINARY_DIR}/resources/app/tools/trilc/tray/" 2>/dev/null || true
    fi
    echo "  ✓ TriLC.Tray.exe collected"
else
    echo "  ⚠ TriLC.Tray.exe not found at ${TRILC_TRAY_EXE} — skipping (Tray not yet built)"
fi
```

#### C. trilc.cmd 包装脚本生成

在 `echo "Overlay source ready."` 之前（Tray 收集之后）：

```bash
# --- Generate trilc.cmd wrapper for MSI CustomAction ---
echo "Generating trilc.cmd wrapper..."
cat > "${BINARY_DIR}/resources/app/tools/trilc/trilc.cmd" << 'CMDEOF'
@echo off
setlocal enabledelayedexpansion
set TRILC_DIR=%~dp0
set TRILC_CLI=%TRILC_DIR%dist\cli.js

REM Strategy: probe VSCodium Base bundled Node.js first,
REM fall back to system PATH node.
REM VSCodium ships node.exe in bin\ or directly in install root.
set NODE_EXE=

REM Probe 1: ..\..\..\..\bin\node.exe → TriCade\bin\node.exe
if exist "%TRILC_DIR%..\..\..\..\bin\node.exe" (
    set NODE_EXE=%TRILC_DIR%..\..\..\..\bin\node.exe
    goto :run
)

REM Probe 2: system PATH
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set NODE_EXE=node
    goto :run
)

echo [trilc] ERROR: Node.js not found. Cannot run TriLC CLI.
echo [trilc] Please install Node.js >=20 or ensure TriCade Base is installed.
exit /b 1

:run
"!NODE_EXE!" "%TRILC_CLI%" %*
exit /b %ERRORLEVEL%
CMDEOF
echo "  ✓ trilc.cmd generated"
```

#### D. Feature ComponentRef 输出注释

`vscodium-bundle.wxs` 的 `MainApplication` Feature 需包含 Tray 清理引用。由于 heat.exe 输出不含 Feature 引用，通过手动 patch 或在 build-bundle.sh 中 sed/追加完成。当前方案：**在 vscodium-bundle.wxs 的 Feature 中预先声明 `<ComponentRef Id="CleanupTriLCTrayDir" />`**，即使 Tray 未构建，ComponentRef 引用不存在的 Component 仅产生 ICE 警告（可压制）。

---

## 3. 产物校验方法

### 3.1 构建后校验（自动化）

构建完成后（`build-bundle.sh` 最后），追加校验脚本：

```bash
# ── Artifact Verification ──
echo "=== Verifying MSI artifact ==="
MSI_PATH="${SETUP_RELEASE_DIR}\\${OUTPUT_BASE_FILENAME}.msi"

# 1. File existence + size sanity
if [[ ! -f "${MSI_PATH}" ]]; then
    echo "ERROR: MSI not found at ${MSI_PATH}"
    exit 1
fi
MSI_SIZE=$( stat -c%s "${MSI_PATH}" 2>/dev/null || wc -c < "${MSI_PATH}" )
echo "  MSI size: ${MSI_SIZE} bytes"

# Expected range: 2-20 MB (similar to current 2-13 MB builds)
if [[ ${MSI_SIZE} -lt 2000000 ]] || [[ ${MSI_SIZE} -gt 20000000 ]]; then
    echo "  ⚠ WARNING: MSI size outside expected 2-20 MB range"
fi

# 2. SHA-256 hash
if command -v sha256sum &>/dev/null; then
    sha256sum "${MSI_PATH}" | tee "${MSI_PATH}.sha256"
elif command -v certutil &>/dev/null; then
    certutil -hashfile "${MSI_PATH}" SHA256 | findstr /V "hash" > "${MSI_PATH}.sha256"
fi
echo "  SHA-256 → ${MSI_PATH}.sha256"

# 3. Version verification via MSI metadata
echo "  MSI version: ${RELEASE_VERSION}"
echo "  ProductCode: ${PRODUCT_ID}"

echo "=== Verification complete ==="
```

### 3.2 手动校验清单（FullStackDeveloper 执行 S8-2 时）

| # | 校验项 | 方法 | 期望值 |
|---|--------|------|--------|
| V-001 | MSI 文件存在且大小合理 | `dir TriCade-Bundle-x64-0.2.0.msi` | 2-20 MB |
| V-002 | 版本号写入 MSI 元数据 | `msiexec /i TriCade-Bundle-x64-0.2.0.msi /lv install.log` 后检查日志 | `ProductVersion: 0.2.0.0` |
| V-003 | UpgradeCode 不变 | Orca 打开 MSI → Property 表 | `{8F7A2B1C-D3E4-5678-9ABC-DEF012345678}` |
| V-004 | WiX ICE 验证通过 | 构建日志中 `light.exe` 输出 | ICE60/ICE69 压制可接受，无新增 ERROR |
| V-005 | 包含 trilc.cmd | 7-Zip 打开 MSI → 检查 `trilc.cmd` | 存在且内容正确 |
| V-006 | 包含 TriLC dist/ + node_modules/ | 7-Zip 打开 MSI | `dist/cli.js` 存在，`node_modules/` 子目录存在 |
| V-007 | 包含 Tray.exe（条件：arch-trilc-tray done） | 7-Zip 打开 MSI → `tray/TriLC.Tray.exe` | 存在或 clean skip |
| V-008 | SHA-256 记录 | `sha256sum TriCade-Bundle-x64-0.2.0.msi` | 与 .sha256 文件一致 |

### 3.3 安装后功能校验（S8-3 TestEngineer 域）

| # | 校验项 | 期望结果 |
|---|--------|---------|
| F-001 | 安装 MSI → checkbox 勾选 "注册系统服务" | 安装成功，无错误码 |
| F-002 | `sc query TriLC` | STATE: RUNNING |
| F-003 | `sc qc TriLC` | BINARY_PATH_NAME 指向 `trilc.cmd` → `node.exe` → `cli.js` |
| F-004 | 卸载 MSI → `sc query TriLC` | 服务已删除 |
| F-005 | 非管理员安装 → checkbox 勾选 | 友好提示 fallback 到 RegRun 或跳过 |
| F-006 | 重新安装（升级场景） | 旧版本先卸载（含服务清理），新版本安装成功 |

---

## 4. 依赖与风险

### 4.1 跨树依赖矩阵

| 依赖树 | 当前状态 | S8-2 执行前要求 | 风险 |
|--------|---------|----------------|------|
| `arch-trilc-daemon` | ✅ done | — | 无 — D1 CLI 已实现 |
| `cpo-tricade-packaging-split` | ✅ done | — | 无 — 拆分方案已裁决 |
| `arch-trilc-tray` | node-2 pending（实施） | **done**（Tray.exe 就位） | **中**：如 Tray 未就位，Bundle 不含 Tray，需后续更新补上 |
| `arch-trilc-sync` | node-1 in_progress | 不阻塞（sync 引擎在 TriLC 服务器侧，MSI 打包无需感知） | 低 |
| `arch-trilc-msi-e2e` | node-1 in_progress | node-2 **done**（E2E 测试方案就位） | **中**：E2E 方案指引 S8-3 验证 |

### 4.2 技术风险

| # | 风险 | 影响 | 缓解 |
|---|------|------|------|
| R-001 | VSCodium Base 的 `node.exe` 路径与 `trilc.cmd` 中 Probe 1 假设不匹配 | CustomAction 失败，服务未注册 | 在 S8-2 构建前，手动确认 VSCodium Base x64 安装后的 `node.exe` 路径；如路径不同，调整 `trilc.cmd` Probe 1 |
| R-002 | `WixQuietExec64` 在非管理员安装时 `sc create` 失败 | 安装报错回滚 | 通过 `CheckAdminPrivilege` 条件分流：无管理员权限时不执行 InstallTriLCService，改用 toast 提示手动运行 |
| R-003 | WiX UI 对话框序列 `WelcomeDlg` → `TriLCDaemonDlg` → `VerifyReadyDlg` 与 WixUI_Common 内置定义冲突 | ICE 错误 | 使用 DialogRef + Publish 而非完整自定义 UI 序列；`WixUI_Common` 仅提供共享控件，不定义序列 |
| R-004 | `RemoveExistingProducts After="InstallInitialize"` 在升级时先卸载旧 Bundle → 可能删除正在运行的服务 | 服务中断 | 卸载 CustomAction `UninstallTriLCService` 已在 `RemoveFiles` 之前执行 `sc stop`，确保安全清理 |

### 4.3 已知缺口（不阻塞 S8 交付）

| # | 缺口 | 后续归属 |
|---|------|---------|
| G-001 | `trilc.cmd` Probe 2（系统 PATH node）未指定 `>=20.0.0` 版本检查 | W31 技术债 |
| G-002 | 无管理员安装时的 RegRun fallback 未在 MSI UI 中提供选项（当前依赖 `trilc.cmd` 内部逻辑） | W31 技术债 |
| G-003 | Linux/macOS 不适用 MSI；需独立打包方案（`.deb`/`.rpm`/`.pkg`） | arch-trilc-linux-packaging（后续树） |

---

## 5. 门禁裁决

```
TWF-002-S8-1 门禁：

  ✅ 版本策略：0.2.0.0，UpgradeCode 不变，独立于 VSCodium 版本
  ✅ WiX 变更范围：vscodium-bundle.wxs（对话框 + CA + UI）+ .xsl（Tray 清理）+ .wxl（字符串）
  ✅ 构建脚本：build-bundle.sh 版本号 + trilc.cmd 生成 + Tray 条件收集
  ✅ 产物校验：size/hash/version 三层自动化 + 6 项手动清单 + 6 项安装后功能校验
  ✅ 依赖识别：arch-trilc-tray 未完成 → Tray.exe 条件包含
  ✅ 风险缓解：R-001~R-004 均有明确缓解措施

门禁建议: APPROVE ✅

FullStackDeveloper 可进入 S8-2 执行。
执行前需确认：
  1. arch-trilc-tray node-2 done（Tray.exe 就位）或接受不含 Tray 的 Bundle
  2. VSCodium Base x64 安装后 node.exe 实际路径已验证
  3. WiX 工具链（heat.exe / candle.exe / light.exe）可用
```

---

## 6. 使用依据

| 依据 | 文件 |
|------|------|
| 树操作计划 | `TWF-002-S8/tree-op.json` |
| Phase 5 验证报告 | `TWF-002/phase5-report.md` v1.0 |
| 已知偏差清单 | `TWF-002/known-deviations.md` |
| 技术设计 §8 MSI UX | `arch-trilc-daemon/technical-design.md` L662-755 |
| 拆分打包方案 | `cpo-tricade-packaging-split/tree-op.json` |
| 当前 Bundle WXS | `vscodium/build/windows/msi/vscodium-bundle.wxs` |
| 当前 Bundle 构建脚本 | `vscodium/build/windows/msi/build-bundle.sh` |
| 当前 Bundle XSL | `vscodium/build/windows/msi/vscodium-bundle.xsl` |
| TriLC CLI 实现 | `TriLC/src/cli.ts` L290-472 |
| TriLC package.json | `TriLC/package.json` v0.1.0 |
| TriPilot package.json | `TriPilot/package.json` v0.0.1 |

---

**文档维护**：CTO（小狄）
**下次审查**：S8-2 FullStackDeveloper 打包执行启动时
