# FSD·件A 双修完工读数（夜窗件②·可夜验）

- sourceOfTruth: 本件（FSD 件A 完工读数卷；判据源=CTO 午窗批 selector 裁+teardown 裁 21fe08d6 §六.4；恢复令=CEO 02:21 经 BOD 02:24 转）
- syncMode: working
- lastSyncedAt: 2026-09-29T18:5xZ（date 现查=2026-09-30 02:5x +0800）
- 施工席: FSD 小全（m-fsd）
- 交付锚: TriModel **d3fda84**（挂起态底座：三文件 helper+teardown+e12 修）+**69ea6ac**（完工增量：e9/e10 随版对齐，44+/13-）

## 实勘结论：旧测随版漂移共四层（CTO 定性=旧测漂移非产品缺陷，修=测试随版对齐，产品零动）

| 层 | 缺陷机制 | 修法 |
| --- | --- | --- |
| ①可见性 | `#tc-*` 全在隐藏 `#panel-strategy`（P2 单页架构）——fill/click 要求可见即挂 | gotoStrategy 幂等切视图（hidden 预查+菜单点击+8s 显形等待；先例=gate test L153-156）：e9/e10 fill 前+e12 withHarness conn 后+C2 二轮编辑前+e10 reload 后 |
| ②探针 enable | conn-save 探针 200 才 `setDataPanelsDisabled(false)`（ui L536-540）；e10 无 ADMIN_TOKEN env→handler 503 fail-closed→探针黄→编辑面永 disabled；e9 缺 GET trimmc-card handler→404 红→同 | e9/e10 补 `TRIMODEL_ADMIN_TOKEN`（UI 填同值→探针 200→enable，e12 既有同构）；e9 补真 `handleGetTrimmcCard` 分支 |
| ③表单形态 | 现版条目表单含 model select（未显式选=默认首项 mock deepseek-flash 误绑）+baseurl 必填；e10 旧「当前使用/fixed 选择器」流现版已重构为默认规则流 | 两文件表单流补 provider/model/baseurl 显式选择填写；e10 映射：tc-r-add→type=default→tc-r-entry（option value=纯 eid，tcFillEntrySelect L1414）→tc-r-save |
| ④断言载体 | 规则行摘要渲染 model 名（tcWindowModel L1300）非 entry id；v4 卡 rules=对象映射非数组 | 断言改规则行名+model 绑定（绑定面由磁盘 entry_id=w3a 断言保）；`Object.values(disk.rules)` |

**W3 硬核判据保持不降级**：保存→真 page.reload()→断言仍在完整周期（reload 后规则表行+磁盘 default 规则+PUT body 链三面）；真 reload 零 mock 化。

## teardown 三件套（CTO 21fe08d6 §六.4，三文件同套）

closeBrowserRobust=close 套 Promise.race 15s 超时+超时 `taskkill /PID <pid> /T /F` 强杀进程树+吞错防遮蔽；server close 前置 `closeAllConnections`（keep-alive 挂连接=server.close 挂起主因）+5s race；finally 全程防 teardown 异常遮蔽原断言。e10 browser 声明提至 try 外（finally 作用域可达）。

## 自测读数（BOD 恢复令口径：env 完整实测毕再标 ready-for-review——已毕）

| 面 | 读数 |
| --- | --- |
| env 实测（TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1，本机 Chrome） | **12/12 pass 0 fail**：e9 1/1+e10 1/1+e12 10/10（含 C1 硬核删除复活案+真 reload 全周期） |
| 全量（无 env 基线态） | **324 tests/76 suites/309 pass/15 skip/0 fail**（gate 族 env 门 skip=常态）——与件D 基线同谱零回归 |
| 类型面 | tsc --noEmit 零错 |

## 迭代过程留痕（恢复段 02:24-02:5x）

挂起态首验（00:2x）暴露 e10 作用域错→修；恢复后段1（e9+e10）三轮迭代逐层剥出漂移②③④层（每轮单案错误栈实锚后修）；段2（e12 十案）底座修直接翻绿零增量。e12 本次零改动（其修全在 d3fda84）。

## 技术债务标记

- 三文件镜像 helper（gotoStrategy/closeBrowserRobust）×3 份——候抽公共 test util（不阻塞，量小）。
- E0 对照钩（历史态 HTML）与新 helper 的兼容性未验——E0 特殊窗启用时候 STE 注意（历史态结构差异可归因）。

## 可夜验声明

- **可夜验**：件A 完工。STE 夜验窗=env 三文件复跑（命令：`TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1 node --import tsx --test --test-concurrency=1 test/ui-e9-seam.test.ts test/ui-e10-reload.test.ts test/ui-e12-strategy-delete.test.ts`，注意整跑 >10min 建议分段）+全量 324 基线对照。
- 件C 续开工（两案，预读定形全锚在案）。

## 使用依据

- BOD 23:11 夜窗令+CTO 午窗批/21fe08d6/6bf7a596 裁卷+CEO 02:21 恢复令（BOD 02:24 转）
- TriModel d3fda84/69ea6ac diff
- 实读：ui/index.html conn-save L524-552/条目表单 L203-215/规则表单 L233-247/tcFillEntrySelect L1409/tcWindowModel L1298
