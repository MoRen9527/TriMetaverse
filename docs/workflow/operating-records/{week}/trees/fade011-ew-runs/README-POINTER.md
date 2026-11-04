# 指位 README：{week} 字面目录·排障窗一次性产物（候裁保留·CTO 裁 2026-11-04T05:15:30Z ②）

- sourceOfTruth: 本件（指位说明·非真源）
- syncMode: pointer-note
- lastSyncedAt: 2026-11-04T13:27:43+08:00（date 现查原值·写前锚·05:27:43Z 同锚）

## 本目录定性

本目录（`operating-records/{week}/trees/fade011-ew-runs/`）**路径中的 `{week}` 为字面字符串**，系排障窗一次性产物，非现行机制产物。

- 现行机制：TriMLC 2833c82 起 TREE_ROOT=`.../{week}/...` 模板形在 run 创建时展开为真实周串（2026-W45 形）——正常 run 全落 `operating-records/2026-W45/trees/fade011-ew-runs/`
- 本目录两 run 树（fade-w-fade011-ew-c6a6aea17564 + fade-w-fade011-ew-c89a45715f36）= 排障插曲期间旧代码实例触发（2026-11-04 04:52:49Z / 04:54:19Z），当时现役 dist 尚未重建（无展开逻辑），`{week}` 被字面当目录名
- 两 run 均 APPROVED 合法产物·fade.db checkpoint 记录的 treeDir 为本字面路径——原地保留以维持 DB/盘一致（记录面一致性优先·CTO 裁）
- 根因链与排障全程：见段三串联窗收口卷 `2026-W45/trees/file-family-maintenance/sde-phase3-serial-window-closeout.md`（TriMetaverse dev ba734bf6e）

## 处置

候裁保留（搬移/清理均产生 DB checkpoint 与盘面不一致）。如后续换周窗统一清理，须连带勘正 fade.db 两 run 的 checkpoint.treeDir 或注记路径漂移，禁单侧盘面删除。
