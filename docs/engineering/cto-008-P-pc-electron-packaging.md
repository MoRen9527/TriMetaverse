# CTO-008-P：PC 端 Electron 打包技术方案

> 设计人：ChiefTechnologyOfficer（小狄）
> 状态：设计完成，已实现（ConnectionManager + Phase P0 打包脚本）
> 日期：2026-07-16
> 上游依据：CPO 产品路由包裁决 #9-11 + `docs/architecture-overall-unified.mmd`

---

## 一、架构总览

```
┌─────────────────────────────────────────────────────┐
│              PC 端四合一套装 (Electron)               │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │          vscodium (IDE 宿主)                   │   │
│  │  ┌────────────────┐  ┌──────────────────┐    │   │
│  │  │  TriPilot       │  │  TriCode          │    │   │
│  │  │  VS Code 插件   │  │  glue 适配层      │    │   │
│  │  │  (ACP 协议)     │  │  (插件→opencode    │    │   │
│  │  │                 │  │   →Claude Code    │    │   │
│  │  │                 │  │   →codex→zcode    │    │   │
│  │  │                 │  │   →copilot)       │    │   │
│  │  └───────┬─────────┘  └────────┬─────────┘    │   │
│  │          │    HTTP API          │              │   │
│  │          └──────────┬───────────┘              │   │
│  └─────────────────────┼──────────────────────────┘   │
│                        │                              │
│  ┌─────────────────────▼──────────────────────────┐   │
│  │  TriLC (HTTP :8711)                            │   │
│  │  ┌─────────────────────────────────────────┐  │   │
│  │  │  ConnectionManager                      │  │   │
│  │  │  TriMC 可达? → 代理到 TriMC              │  │   │
│  │  │  TriMC 不可达? → agentLoop() 本地执行    │  │   │
│  │  └─────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  更新策略：壳统一分发 + 模块独立更新                   │
└─────────────────────────────────────────────────────┘
```

### 三层通信路径

| 路径 | 协议 | 说明 |
|------|------|------|
| TriPilot ↔ TriLC | HTTP（REST + SSE） | TriLC 暴露与 TriMC 相同 API 面，TriPilot 无需感知差异 |
| TriCode ↔ opencode/Claude Code | ACP / 原生协议 | TriCode 作为协议适配层，统一转换为内部调用 |
| TriLC ↔ TriMC | HTTP（CTO-008-M） | TriLC 优先代理到 TriMC，断线自动切本地 |

---

## 二、实现策略：渐进式三阶段

### Phase P0：零打包验证（当前阶段）

不引入 Electron 打包工具链。用脚本把已有组件"看起来像打包"。

```
产出：
  scripts/pack-pc/
    ├── bundle.ps1          # Windows 打包脚本
    ├── install-extensions.ps1  # 预装 TriPilot 到 vscodium
    └── start.bat           # 一键启动 (TriLC → vscodium)
```

行为：
1. 检测本地 vscodium 安装路径
2. 将 TriPilot 扩展安装到 vscodium extensions 目录
3. 复制 TriLC 二进制到 bundle 目录
4. 启动 vscodium 时自动拉起 TriLC（通过 .vscode/tasks.json 或 startup script）

### Phase P1：Electron 薄壳

在 Phase P0 验证通过后，用一个最小 Electron 壳包裹：

```
electron-shell/
  ├── main.js         # 启动 vscodium + TriLC sidecar
  ├── preload.js      # 暴露 TriLC 连接状态到渲染进程
  ├── tray.js         # 系统托盘（显示连接状态、快捷入口）
  └── package.json
```

行为：
1. Electron 启动 → 先拉起 TriLC (spawn)
2. 等待 TriLC healthz 200
3. 用 child_process 启动 vscodium（指定 extensions-dir）
4. 系统托盘显示连接状态（绿=TriMC, 黄=TriLC, 红=断线）
5. 关闭 Electron → 先关 vscodium → 再关 TriLC

### Phase P2：安装包构建

- Windows: NSIS 安装包
- macOS: DMG
- Linux: AppImage / deb

---

## 三、分发形态设计

```
TriMetaverse-PC/
├── TriMetaverse.exe          # Electron 入口（薄壳）
├── resources/
│   ├── vscodium/             # vscodium 便携版
│   │   ├── bin/codium
│   │   └── extensions/
│   │       └── tripilot/     # 预装 TriPilot
│   └── tri-lc/               # TriLC 运行时
│       ├── trilc.exe         # TriLC 编译产物
│       └── node_modules/     # 依赖
├── tri-code/                 # TriCode glue（Bun 运行时）
│   └── ...
└── config/
    └── defaults.json         # TriMC 默认连接地址、简化模式开关
```

### 更新策略

| 组件 | 更新方式 | 频率 |
|------|---------|------|
| Electron 壳 | 统一分发包升级 | 低频（月度） |
| vscodium | 独立升级（复用 vscodium 内置更新） | 随上游发布 |
| TriPilot | VS Code 扩展市场更新 | 高频（周级） |
| TriCode | 独立包更新（npm/bun install） | 中频（迭代） |
| TriLC | 独立二进制更新（替换 resources/tri-lc/） | 中频（迭代） |

---

## 四、CPO 验收门禁映射

| 门禁 | 实现方式 | Phase |
|------|---------|-------|
| G1: 安装包正常安装启动 | Phase P2 NSIS/DMG/AppImage | P2 |
| G2: 自动拉起 TriLC | Phase P1 Electron spawn TriLC | P1 |
| G3: 连接成功+断线切换 | TriLC 内置 ConnectionManager（CTO-008-M 已规范） | P0/P1 |
| G4: 聊天发送 → agent 思考 | TriPilot chat → TriLC HTTP API → agentLoop() | P0 |
| G5: 总助分派任务 | 依赖 TriMC Soul Loader/Memory Injector pipeline | P0 (TriMC online) |
| G6: 员工执行 → 结果展示 | SSE 流式返回 | P0 |
| G7: 任务历史可回溯 | TriPilot chatHistory + TriMC tasks API | P0 |
| G8: 设置页配置 TriMC 地址 | TriPilot settings 面板 | P0 |

**关键依赖**：G5（总助分派）依赖 TriMC 云端 pipeline（Soul Loader/Memory Injector/Context Builder），TriLC 本地 raw mode 不支持。离线场景下 G5 降级为直接 agentLoop 执行。

---

## 五、实现记录（2026-07-16）

### ConnectionManager（TriLC `src/server/app.ts`）

- 状态机：3 次连续失败 `connected→degraded`，2 次连续成功 `degraded→connected`
- 健康检查：每 30s 主动 ping TriMC `/healthz`，启动时立即检查一次
- 请求路径：`connected` 时优先代理到 TriMC（30s HTTP 超时），失败 → 自动回退本地 `agentLoop()`
- `/healthz` 扩容：返回 `trimc: 'connected' | 'degraded'` 状态字段
- 新增 `connectionState` getter 供消费者查询
- 新增 `ConnectionManager.stopHealthCheckLoop()` 在 `stop()` 中调用

### Phase P0 打包脚本

| 脚本 | 功能 |
|------|------|
| `scripts/pack-pc/bundle.ps1` | 构建 TriLC、组装 VSCodium portable + TriPilot + TriLC 到 `dist/pack-pc/` |
| `scripts/pack-pc/install-extensions.ps1` | 复制 TriPilot 扩展到 VSCodium extensions 目录并 npm install |
| `scripts/pack-pc/start.bat` | 一键启动 TriLC → health check → 启动 VSCodium（带 Tripilot 扩展） |

### 验证

- TriLC `tsc` 编译通过
- 冒烟测试通过：healthz ✓、TriMC 断开时自动本地 fallback ✓、agentLoop 正常执行 ✓、clean shutdown ✓

---

## 六、简化模式 vs 全功能模式

依据 CPO 裁决 #10，由 TriPilot 前端控制：

```
简化模式（首次启动默认）：
  UI: 仅聊天输入 + 历史列表 + 基础设置 + "切换到全功能"
  限流: TriMC 高级配置隐藏、Agent 选择器隐藏、调试日志隐藏

全功能模式（一键切换）：
  UI: 所有面板可见
  状态持久化: localStorage，不跨设备同步
```

技术实现：TriPilot `extension.ts` 启动时读取 `localStorage('ui-mode')`，默认简化。

---

## 七、风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| vscodium 版本兼容性 | TriPilot 无法在新版 vscodium 运行 | 锁定 vscodium 版本号，与 TriPilot 版本矩阵测试 |
| Node.js 运行时冲突 | vscodium 内嵌 Node vs TriLC 公共 Node | TriLC 使用独立 Node 或编译为单文件可执行（pkg/nexe） |
| ACP 协议依赖 | TriPilot 当前依赖 ACP 与 opencode 通信 | Phase P0 验证 ACP→HTTP 桥接可行性 |
| TriCode 仓库未独立 | 当前仍在 Tride 仓库 | Phase P0 仅验证概念，P1 前完成仓库迁移 |
| Bun vs Node 冲突 | TriCode 使用 Bun 运行时 | P1 Electron 壳不负责 TriCode 生命周期管理，TriCode 作为可选 CLI 工具 |

---

## 八、待 CEO/CPO 确认事项

1. **vscodium vs 纯 Electron 自定义 UI**：当前方案复用 vscodium 作为 IDE 宿主。是否考虑纯 Electron 自定义 UI（类似 Cursor/Windsurf 的做法）？
2. **TriCode 独立仓库时间**：Phase P1 前是否需要 TriCode 完成从 Tride 的迁移？
3. **安装包签名**：Windows 代码签名证书、macOS 公证是否需要纳入 P2 范围？

---

## 九、使用依据

- CPO 产品路由包裁决 #9-11（PC端验收门禁、简化模式、插件市场）
- `docs/architecture-overall-unified.mmd`（PC端四合一套装定义）
- `docs/engineering/cto-008-M-tri-mc-lc-protocol.md`（TriMC↔TriLC 通信协议）
- Tride Tauri 桌面应用参考（`Tride/opencode-dev/packages/desktop/`）
- TriPilot VS Code 扩展（`TriPilot/`）
