# Plugins Memory Notes

版本：V0.1
日期：2026-04-16
状态：结构说明

## 1. 目的

本目录当前不复制整套 Hermes 第三方 memory provider 实现，而是记录 TriCompany 需要吸收的插件化思路。

## 2. 当前吸收重点

- provider 生命周期接口
- recall context 的注入边界
- 组织共享与个体表示分层
- session-end consolidate 的扩展点
- 外部 provider 可插拔而不替代内建记忆

## 3. 当前观察到的样式

- Honcho 更偏双层 context injection 与 user / AI representation
- Supermemory 更偏 profile + semantic recall + 容器隔离

## 4. 当前策略

- TriCompany 先抽象 provider 契约与命名空间策略。
- 外部 provider 当前只保留 adapter 位，不直接引入全部第三方实现。
- 等 shadow-test 和宿主边界稳定后，再决定第一版外部 provider 选型。
