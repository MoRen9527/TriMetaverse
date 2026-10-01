# LG-034/035「策略删除后保存复活」勘实+测实读数卷（batch-11 件①）

- 执行: m-duty-fsd（FD/sg 值席）；任务书=../bod-pipeline-batch-11/task-charter-lg034-035-bug-resurrect.md（BOD 03:1x 派）
- **落点注（权限异常报备）**: 任务书目录 bod-pipeline-batch-11/ 系 root 铸造（drwxr-xr-x root:root，03:12），fleet 无写权——本卷落我席自建邻目录 bod-pipeline-batch-11-fsd/，候 root 链 chown 后可迁正
- 勘实定性（工序①三态判别）: **非重放申报矛盾、非回归——本缺陷 face 已处「修毕+测实毕」态**，本单为该态的确证勘验（非新增修复笔）

## 一、复活路径三候选逐项勘实（工序①）

| 候选路径 | 勘实法 | 判 |
| --- | --- | --- |
| 前端未删（删除 handler 缺通道） | ui/index.html 锚点核验（HEAD 161d0ca）: `tcDeletedStrategyIds.push`(:1289)+`deleted_strategy_ids: tcDeletedStrategyIds`(:892)+hydrate 清空(:1382) | ✅ 已修（bc72ea4 三笔在族） |
| 后端回写（浅合并 upsert 复活） | E12 C1-C4 沙箱卡断言（deleted_strategy_ids 通道声明+落盘无复活） | ✅ 通道闭合 |
| 读旧缓存/旧部署面 | **sg 在役 3333 活面实测**：`GET /ui` 所服内容含修复锚点 2/2 | ✅ 活面即修复态 |

## 二、测实读数（工序③）

- **E12 真 reload 持久周期（第四型纪律）**: **10/10 pass / 0 fail**（今日复跑；chrome-headless-shell-153+沙箱卡，删除→保存→真 page.reload()→不复活+对照通道 C3/C4 同绿）——回归判别=零回归
- **TriModel 全量门**: **313/296/0/17**（与窗内终读数逐数一致，零新增失败）
- 既有失败: 零（17 skip=env 门控显性化族，既有在案不转抄）

## 三、验收锚对表

- 「删除→保存→刷新全链不复活」: **达成**（E12 C1 硬核+C2 二轮持久，真浏览器真 reload；历史双证=dev 12/12+sg 11/11 在卷 batch-07）
- 「门读数无新增失败」: **达成**（0 fail 恒等）

## 四、残面注记（如实）

- **dev 活 daemon UI 面未自 sg 勘**（本机 face）：dev 侧部署拷贝若滞后 bc72ea4，活面复活在 dev 残留可能——dev 本机 COS 承接的 F-3+token 冷起（e31278fd）将同窗带出修复态 UI；dev 仓 face 已有夜窗 12/12 实证（754fc96 线）。候 BOD 裁：如需 dev 活面勘验单，另派本机面。
- 工序②修复动笔=**零新增**（既有修复笔 bc72ea4/161d0ca 族已覆盖，本单零改码）。

## 五、使用依据

TriModel 161d0ca 工作树实读；E12/E10 测试族实跑；sg 3333 活面 curl 实测；batch-07 件 2 读数卷（波⑤ 硬判据双证）；task-inventory LG-034/035 行现役段定义
