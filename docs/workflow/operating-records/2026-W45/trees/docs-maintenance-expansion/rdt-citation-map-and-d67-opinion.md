# rdt 备料卷 · TriTraining docs 引用面地图 + D-67 培训域语义意见（候 SDE 批 1 调遣供数）

- sourceOfTruth: 本卷（docs-maintenance 三模块梳理·TriTraining 内容域 owner 备料——COS 知会 2026-11-04T15:48:57）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘定面: TriTraining/docs 全 md＋cc-tutorial 5 md＋根 AGENTS/README（in-repo 链接+反引号路径提及两形态扫描·2026-11-04 15:5x 一轮脚本）

## 一 · 引用面地图（in-repo 出边）

**枢纽件**：`docs/training/README.md` →13 出边（host-publish 系 5＋source-kit 系 4＋tritraining 系 3＋training-pack-migration-plan）——TriTraining docs 内部引用网近单点枢纽形，枢纽更新即全族联动触发点。

次级边：
- `cc-tutorial/agent-core-v0.1.0/README.md` →4（01-04 四件套目录内互链）
- `docs/training/employee-source-kit-cli-course.md` →1（host-publish-pipeline-course）
- `docs/training/employee-host-publish-chain-beginners-guide.md` →1（host-publish-pipeline-course）＋**1 断链**
- 根 `AGENTS.md` →2（docs/engineering/README＋docs/registry/product-state）；`docs/engineering/README.md` →1（product-state）

**入边画像**：docs/training 族 14 件中 12 件零入边（仅被枢纽 README 单向挂接）——**引用关系稀疏=联动触发面薄弱的实证**（与 CEO 点因「引用关系未梳理=TriTraining 未被触发联动更新的重要原因」直接吻合）；跨仓入边（TMV/TC 镜像件回指 TriTraining 正身）候 SDE 全仓扫描补全，本卷仅 in-repo 面。

## 二 · 硬发现两笔（候 SDE 批 1 施工消化）

1. **断链**：`docs/training/employee-host-publish-chain-beginners-guide.md` → `../training/tricompany/03-source-publish-live-链路.md`（markdown 链接形）——该相对路径按 TriTraining 布局解析为 `docs/training/tricompany/03-...`，**TriTraining 仓内不存在**（tricompany 课程包真身=`TriMetaverse/docs/training/tricompany/`）——系 TMV 仓布局的相对链接被原样拷入 TriTraining 未适配=跨仓拷贝伪影。修法候勘：改跨仓路径记法（LG-023 纪律：TriMetaverse 仓文件写相对路径）或纯文本指向，禁造 TriTraining 侧同名占位件。
2. **cc-tutorial 位置注**：cc-tutorial/ 在 TriTraining **仓根**（docs/ 之外）——三模块 docs 梳理范围（TriTraining/docs）若按字面则不含 cc-tutorial；但培训域 19 md 口径（COS 知会用语）=docs/training 14＋cc-tutorial 5。**候 SDE 勘定 scope 时显式对表**，防 cc-tutorial 漏出规范头/版本号/引用面三件梳理圈。

## 三 · D-67 培训域语义意见（款 2「minor/patch 分档裁量归各件 owner」域内供数）

**双层版本语义辨析（核心意见）**：
- **文档维护版本**（D-67 三段式管辖面）：元信息头版本字段，1.x.x 形。
- **内容绑定版本**（D-67 不管辖）：cc-tutorial 五件的 `tutorialVersion: agent-core-v0.1.0` 系**代码快照绑定版本**（随 agent-core 包版本走·升版=新平行目录旧版冻结，README 版本规则节正身）——**机械梳理禁把 1.x.x 规格套到 tutorialVersion 字段**（套了即毁绑定语义）。两字段并存正形：`tutorialVersion: agent-core-v0.1.0`＋维护版本 1.x.x 分列。

**分档映射建议**（SDE 梳理存量迁移时对表用）：
- major+1=课程结构换代（四版套重写/课程体系重构/真源换代——如 agent-core 大版本升版出新平行目录）
- minor=章节/口径级增改（如 beginners-guide §10 规划项现势对表 rewrite、course-graph §8 图节点刷新、02 迁移叙事→四 daemon 矩阵口径重构）
- patch=勘误微修（正名批/行锚勘正/勘误 as-of 头追加——段二首跑五件中的纯正名件：course-graph/curriculum-architecture/beginners-guide 正名面=patch 档；02 含口径 refram=minor 档；README 指纹重锚=patch~minor 候 owner 定）
- 存量迁移基准：现 `版本：V0.1/V0.2` 两段式件（beginners-guide/course-graph/curriculum-architecture 等）→ `1.0.x` 起算（现世代 1.x.x 形·款 3 存量迁移归 SDE 施工面）

## 使用依据

- COS 知会 2026-11-04T15:48:57（CEO 15:43 令·三件梳理·SDE 主担五批框架）
- D-67 条文原文实读（`TriCompany/docs/workflow/engineering-disciplines.md` :1057 起·CAO 铸条 6f842b1）
- 引用面扫描脚本一轮读数（15:5x·markdown 链接+反引号路径两形态·in-repo 限界如实注记）
- 段二首跑五件版本分档建议衔接本席勘六 review 留痕（recon-rdt-seg2-tritraining.md）
