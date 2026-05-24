# Hermes Memory Reference Bundle

版本：V0.1
日期：2026-04-16
状态：冻结参考副本

## 1. 定位

本目录用于把 TriMetaverse/reference/hermes-agent 中与 memory / metacognition 最相关的核心文件冻结到 TriCompany，作为本地可追溯参考副本。

这里不是运行时真源，也不是对 Hermes 的整仓镜像。TriCompany 的实际实现与改造应落在 runtime/cognition/。

## 2. 当前纳入范围

- src/memory_provider.py
- src/memory_manager.py
- src/memory_tool.py

## 3. 当前不纳入范围

- web、gateway、cli 等宿主外围
- 非 memory 核心的工具与 UI 资产
- 整套第三方 provider 实现

## 4. 使用规则

- 本目录只做冻结参考，不直接作为 TriCompany 当前运行时导入真源。
- 任何改造、裁剪、抽象都优先写入 runtime/cognition/ 与 docs/engineering/。
- 如需继续吸收 Hermes 新能力，应先在本目录更新来源与边界，再决定是否进入 TriCompany 自有原型层。

## 5. 来源

- 上游来源：TriMetaverse/reference/hermes-agent/
- 当前复制时间：2026-04-16
- 复制策略：只复制 memory 编排核心文件，不复制外围宿主层

## 6. 许可证说明

本目录保留对上游 Hermes 参考实现的来源指向。具体许可证与版权约束以参考仓中的 LICENSE 与原文件为准。
