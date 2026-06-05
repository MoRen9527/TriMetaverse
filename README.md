# TriMetaverse

TriMetaverse 是三元宇宙的中央战略仓与项目级真源约束层。

当前职责：

- 维护白皮书、项目级架构、中央 workflow、中央 registry 与 operating records。
- 维护 `reference/` 吸收链、模块边界和公司级治理摘要。
- 承接 `TriCompany` 源侧稳定结论向中央摘要层的同步。

当前阶段说明：

- 当前仍处于赛博公司研发阶段与本地 Copilot-host 正式接管阶段。
- `TriCompany` 负责公司侧流程、岗位参与、资料组织与书面核签。
- `TriDev` 负责开发型项目的十阶段执行主线。
- `TriMC` 是未来正式宿主与统一 runtime 核心；当前不能写成已正式切换完成。

命令行快捷入口：

- 从 `TriMetaverse` 根目录可直接执行：
  - `.\tmv.cmd dev-task "任务描述"`
  - `.\tmv.ps1 dev-task "任务描述"`
- 该命令默认会串行执行 `task-intake` + `autopilot`；当前 runtime 会自动推进 Discovery / Intelligence / Designing，并在 Coding 及后续执行阶段要求真实工程证据（源码、测试、部署或运行产物）后再继续，不再把纯文档产物直接签成交付。若只想先创建 intake case，可显式加 `--intake-only`。

模块标配：

- 架构表中的模块一旦被纳入正式模块面，就应具备独立 git 仓、`README.md`、`docs/` 文档基线与本地 `CodeGraph`；占位模块也应先补齐这套骨架，再继续标注为待初始化。
- `CodeGraph` 只作为本地辅助索引；`.codegraph/` 与 `.cursor/` 不作为仓库真源提交。
- 模块级 `CodeRegistry` 负责维护摘要、排除规则、扫描锚点与 `Git Health` 事实。
