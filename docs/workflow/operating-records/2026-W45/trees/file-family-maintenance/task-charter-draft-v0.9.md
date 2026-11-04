# 任务书草案 v0.9（根目录 md 迁移+引用面同步+docs-maintenance 接入·COO 铸·候 CEO 确认）

- sourceOfTruth: 本件（真任务书草案·**候 CEO 确认生效**——D-39 任务书生效面 CEO 确认制保留·生效前不派工）
- syncMode: task-charter-draft
- lastSyncedAt: 2026-11-04T10:53:46+08:00（date 现查原值·COO 铸草案落笔）
- 姊妹件: 排期单 v1.1（同目录 coo-dispatch-plan-v1.0.md·工序明细/分工细化承袭本件·COS 域径裁面）
- 候裁点（唯一）: **本任务书生效与否（CEO 确认）**——映射终稿 COS 已定谳（10:51:44）·灵感记录 CEO 已定谳随卷归档（10:45）·本草案无其他候形注记

## 授权锚

- CEO 2026-11-04 10:30:13 亲令（verbatim）：「先分析下TriMetaverse根目录下的相关md文档及其关联文档，将这些迁移到TriMetaverse/docs下的合适目录里，然后把目录接入docs-maintenance场景。」
- 流转链：bod 10:38 分析毕流转（底稿意见㊻/㊼·两件漏项自领勘定）→COS 10:40:57 转令排工→CPO 落点意见 7 件 10:48:23 齐→COS 映射终稿定谳 10:51:44→COO 拆解排期单 v1.1+本草案。

## 任务（三段）

1. **迁移**：根目录历史/理念卷按映射终稿四组落位——A 组 23 件→docs/archive/（含灵感记录·CEO 10:45 定谳）＋B 组 2 件→docs/execution/（现役参考位+注记）＋销项组 3 件 0 字节销项·留根 3 不动；git mv 保历史·meta-recognition/ 子目录按件各归其组后删目录。
2. **引用面同步**：白皮书改指五条（内章自指形×2+索引/清单改指+占位废·内容锚定非硬行号）＋全仓被引面改链（底稿 E 类读数逐项·arch-storage-migration 20 处最大断链面）＋doc-graph.json re-scan。
3. **接入**：docs-maintenance event-watch env 三键（fail-closed）+8713 受控重启（本日第三次同口径链）+首验真触发 run 证据留档呈 bod。

## 范围与分工

- P1 迁移+P2 引用面同步=**FSD**（同窗紧接防断链窗口）；P3 接入=**SDE 施工+CTO 门禁**；工序督办+毕报汇总=**COO**；收口=**COS**；进度异常升级 COS→bod。
- 施工细化（注记形式/WATCH_DIRS 并集裁定/逐处改链判断）=排期单 v1.1 承袭·执行席按惯例对表裁量留痕。

## 验收锚（四锚·详判据=排期单 v1.1 第三节）

1. 根目录 md 恰 3 件（README/CLAUDE/AGENTS）+meta-recognition/ 目录不存在。
2. 断链断言：25 迁移件+3 销项件旧路径全仓引用零命中+白皮书五条改指逐条在卷。
3. doc-graph.json 新鲜（generatedAt=re-scan 时点·repoHead=现顶）。
4. event-watch 首验：真触发 run 证据卷（run id+APPROVED+触发路径）呈 bod。

## 生效后动作

- CEO 确认生效→COO 即派 P1-P3（排窗已废·顺序推进·完成即报）→P1/P2 毕报回 COS 转 bod→P3 首验证据呈 bod→四锚齐 COS 收口→复盘闭环入当周 operating records。
