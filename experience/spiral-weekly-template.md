# 螺旋四行段模板（周报固定段，Q1-5）

> 依据：quad-migration-spec v1.0 §九通道③。每周报（OP 周记录/共学周记）粘贴本段并填数；口径冻结后形成可比序列。
> 核心健康度 = 闭环率（复用 ÷ 下行签收）——单报活动量是教练场自嗨指标，必须报闭环。

```markdown
## 螺旋观测（M↔R 桥，W<NN>）

- 上行演练请求：<N> 条（R 侧域 owner 发起；drill 树 <treeIds>）
- 演练完成：<Y> 棵 drill 树（[shadow] 对照：<S> 次，主路径零中断：<是/否>）
- 下行签收：<Z> 条 EXPER_ASSET 过三门入 confirmed/（待签积压：<K> 条）
- R 侧复用：<R> 次（闭环率 <R/Z>%）；本周新增经验资产：<list or 无>
```

计数器数据源：`experience/index.json` counters.mainPath / counters.shadow 双组（禁裸报单组）。
