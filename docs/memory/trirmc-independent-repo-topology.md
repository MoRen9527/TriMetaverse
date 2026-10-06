# TriRMC 独立仓拓扑（非 TriRLC）

- **TriRMC=独立仓 `D:/Code/ai/TriRMC/`**（origin=MoRen9527/TriRMC，GitHub+sg bare 双源）——河源服务域 daemon 代码真身
- TriRLC（`D:/Code/ai/TriRLC/`，8711 R 面本地域）≠TriRMC（R 面服务域，河源）——**两仓两 daemon**，查 R 面代码先分清查哪个仓（2026-10-06 BOD 复验扑空实证：8249eb7 在 TriRLC/TriMMC 均 unknown revision，FSD 指认独立仓后验在）
- CLAUDE.md Module Workspace Layout 未列 TriRMC——工作区拓扑断言先活体现探（ls 仓+git log），禁由文档布局推定（同「拓扑断言禁由恢复源推定」族）
- R-HY 部署位=/srv/fleet/TriModel（TriModel 配置面）与 TriRMC（daemon）两件；R-HY git 操作 root 身份遇 fleet 属主仓报 dubious ownership——单次豁免用 `git -c safe.directory=<path> log`，勿改 root 全局配置
- 关联：dual-controller-ports-m-mlc-r-rlc（8713=M 面 MLC/8711=R 面 RLC——本条补 R 面**服务域** TriRMC 独立仓位）
