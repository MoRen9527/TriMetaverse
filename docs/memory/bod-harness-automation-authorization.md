---
name: bod-harness-automation-authorization
description: CEO 授权 BOD 用窗口自动化代敲 harness 命令（/compact 等）——仅限可唯一定位的独立窗口，VS Code 多 tab 拓扑禁用
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 57161bb6-0053-4f64-ab8e-f815fbfb3d01
  modified: 2026-09-04T14:35:21.846Z
---

CEO 授权（2026-09-04）：BOD 可用 OS 级窗口自动化（AppActivate+SendKeys）代敲其它会话终端的 harness 命令（/compact 等）。

**Why**：harness 命令（/compact/clear）在终端程序层，会话模型与跨会话消息都够不着；CEO 不想每次亲手敲。

**How to apply**：
- 仅当目标会话是**可唯一定位的独立终端窗口**（MainWindowTitle 明确匹配）才自动化；执行前必须先枚举窗口核验唯一性；
- **VS Code 单窗口多终端 tab 拓扑禁用**——tab 焦点无自动化接口，SendKeys 打进当前聚焦 tab，可能注入错误会话（压缩错人+输入框垃圾）；trimetaverse 工作区窗口实测即此形态；
- 首次实勘（2026-09-04）：窗口列表无独立 COS 终端，判定不可安全自动化，退回 CEO 手敲；
- 相关教训：会话无法内省自身 token 数，水位机械计=transcript 文件大小（见 [[bod-harness-automation-authorization]] 同日「机械水位计」立法）。
