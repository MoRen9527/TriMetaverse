# TriCade MSI 构建日志 — TWF-002-S8-2

> **构建者**：小全（FullStackDeveloper）
> **日期**：2026-07-22
> **树**：TWF-002-S8 | **节点**：TWF-002-S8-2 | **下一步**：TestEngineer（S8-3）
> **依据**：`repackage-plan.md` v1.0（CTO 小狄，2026-07-22）

---

## 1. 构建产物

| 产物 | 路径 | SHA-256 |
|------|------|---------|
| TriCade-Bundle-x64-0.2.0.msi | `vscodium/build/windows/msi/releasedir/` | `7E840243CFB8B70D930705FF706633B548E47D4A1B66EE4D644977E3FF291775` |

- **MSI 大小**：2,112,714 bytes（~2.01 MB）
- **ProductCode**：`{99E444E3-F28E-4E5B-9782-B18E2FFE88FB}`（本次构建 GUID）
- **Tray.exe**：未包含（arch-trilc-tray 未构建 — 条件跳过 ✓）

---

## 2. WiX ICE 结果

### 2.1 编译阶段（candle.exe）

| 级别 | 代码 | 描述 | 处置 |
|------|------|------|------|
| WARNING | CNDL1118 | `AppName` 变量被重复声明（TriCade vs TriCade Bundle） | 预存（旧 Bundle 已有） |

### 2.2 链接阶段（light.exe）

| 级别 | 代码 | 描述 | 处置 |
|------|------|------|------|
| SUPPRESSED | ICE60 | 文件版本与语言不匹配 | 预存压制（`-sice:ICE60`） |
| SUPPRESSED | ICE69 | 组件引用不匹配 | 预存压制（`-sice:ICE69`） |

**结论**：零新增 ERROR，仅 1 个预存 WARNING + 2 个预存 SUPPRESSED。ICE 门禁通过。

### 2.3 构建中修复的 ICE 问题

| # | 原始错误 | 根因 | 修复 |
|---|---------|------|------|
| 1 | ICE17: Cancel button 无事件 | `WixUI_Minimal` 不提供默认 Cancel 事件 | 在按钮内嵌 `Publish Event="EndDialog" Value="Exit"` |
| 2 | ICE31: `WixUI_Font_Bold` 未定义 | WiX v3 WixUIExtension 不包含此字体样式 | 移除 `{\WixUI_Font_Bold}` 前缀 |
| 3 | LGHT0094: `CleanupTriLCTrayDir` 未解析 | Tray 未构建 → XSL 不注入 Component → Feature ComponentRef 悬挂 | 在 WXS 中直接创建永久 Component（合成占位，RemoveFolderEx 无害） |

---

## 3. 手工校验清单（8 项）

| # | 校验项 | 方法 | 期望值 | 结果 |
|---|--------|------|--------|------|
| V-001 | MSI 文件存在且大小合理 | `Get-Item` 检查 | 2–20 MB | ✅ 2.01 MB |
| V-002 | ProductVersion 写入 MSI 元数据 | MSI COM `Property` 表查询 | `0.2.0.0` | ✅ `0.2.0`（MSI 内部 3 段存储） |
| V-003 | UpgradeCode 不变 | MSI COM `Property` 表查询 | `{8F7A2B1C-D3E4-5678-9ABC-DEF012345678}` | ✅ 确认 |
| V-004 | WiX ICE 通过 | candle + light 输出 | ICE60/ICE69 压制可接受，无新增 ERROR | ✅ 见 §2 |
| V-005 | 包含 trilc.cmd | MSI COM `File` 表查询 | `trilc.cmd` 存在 | ✅ 确认 |
| V-006 | 包含 TriLC dist/ + node_modules/ | MSI COM `File` 表查询 | `cli.js` + `package.json` 存在 | ✅ `cli.js` 确认；9 个 `package.json` 确认 node_modules |
| V-007 | 包含 Tray.exe（条件） | MSI COM `File` 表查询 | 不存在（clean skip） | ✅ 未构建条件跳过，符合预期 |
| V-008 | SHA-256 记录 | `Get-FileHash` 与 `.sha256` 对比 | 一致 | ✅ 一致 |

**手工校验结论**：8/8 通过。

---

## 4. 文件变更清单

### 4.1 vscodium-bundle.wxs
- **Feature**：新增 `<ComponentRef Id="CleanupTriLCTrayDir" />`
- **InstallExecuteSequence**：新增 5 个 CustomAction 条目（卸载清理 + 管理员检测 + 安装注册）
- **UI**：替换 `WixUI_Minimal` 为扩展版（WelcomeDlg → TriLCDaemonDlg → ProgressDlg）
- **Fragment**：新增 2 个独立 Fragment（TriLCDaemonDlg 对话框 + CustomAction 定义）
- **Directory**：新增 `TriLCTrayDir` 合成占位 Component（确保 Feature ComponentRef 解析）

### 4.2 vscodium-bundle.xsl
- 移除 tray 目录 XSL 模板（清理由 CleanupTriLCDir 递归覆盖）

### 4.3 i18n-bundle/vscodium-bundle.en-us.wxl
- 新增 6 个本地化字符串（TriLCDaemonDlg + ProgressText）

### 4.4 build-bundle.sh
- **版本号**：新增 `RELEASE_VERSION="${RELEASE_VERSION:-0.2.0}"` 默认值
- **Tray 收集**：新增条件收集逻辑（`arch-trilc-tray` 未完成时 clean skip）
- **trilc.cmd**：新增包装脚本生成（Probe 1: TriCade\bin\node.exe, Probe 2: PATH）
- **产物校验**：新增 SHA-256 + 大小 + 版本三层自动化校验

### 4.5 trilc.cmd（新文件）
- 构建时由 `build-bundle.sh` 生成至 `BINARY_DIR/resources/app/tools/trilc/`
- 两级 Node.js 探测：VSCodium Base 内置 → 系统 PATH → 报错退出

---

## 5. 偏差记录

| # | 偏差 | 设计假设 | 实际行为 | 处置 |
|---|------|---------|---------|------|
| D-001 | ComponentRef 悬挂 | "ComponentRef 引用不存在的 Component 仅产生 ICE 警告（可压制）" | WiX v3 中为硬错误 LGHT0094 | 在 WXS 中创建永久合成 Component，RemoveFolderEx 在 tray 不存在时为无害 no-op |
| D-002 | `WixUI_Font_Bold` | WiX 5 方案假设此字体存在 | WiX v3 中仅有 Normal/Big/Title 字体 | 移除字体样式引用，使用默认按钮文本 |
| D-003 | Dialog Publish 重复 | 方案中 UI section 和 Dialog 内均定义 Back/Next Publish | WiX v3 可能导致重复事件 | 将 Back/Next Publish 移入 Dialog 控件内嵌，UI section 仅保留 WelcomeDlg Next 跳转 |

---

## 6. 使用依据

| 依据 | 文件 |
|------|------|
| 重新打包方案 | `docs/workflow/operating-records/2026-W30/trees/TWF-002-S8/repackage-plan.md` v1.0 |
| 技术设计 §8 MSI UX | `docs/workflow/operating-records/2026-W30/trees/arch-trilc-daemon/technical-design.md` |
| 现有 Bundle WXS | `vscodium/build/windows/msi/vscodium-bundle.wxs` |
| 现有构建脚本 | `vscodium/build/windows/msi/build-bundle.sh` |
| TriLC CLI | `TriLC/src/cli.ts` L290–472 |
| WiX 工具链 | `vscodium/build/windows/msi/bin/`（WiX 3.11.2.4516） |

---

## 7. 下一步

- **TestEngineer（TWF-002-S8-3）**：安装后功能校验（F-001 ~ F-006）
  - F-001: 安装 MSI → checkbox 注册系统服务
  - F-002: `sc query TriLC` → RUNNING
  - F-003: `sc qc TriLC` → BINARY_PATH_NAME 指向 trilc.cmd
  - F-004: 卸载 MSI → 服务已删除
  - F-005: 非管理员安装 → 友好降级
  - F-006: 升级场景 → 旧服务卸载 + 新服务安装

- **CTO 审查**：WiX 源码变更 + 偏差处置确认

---

**文档维护**：FullStackDeveloper（小全）
**下次审查**：S8-3 TestEngineer 测试启动时
