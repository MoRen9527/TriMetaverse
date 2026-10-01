# LG-034/035 波⑤ FSD 修复面读数卷（batch-07 件 2·续跑收口）

- 执行: m-duty-fsd（FD）；任务书=本目录 task-charter-bod-pipeline-batch-07.md 件 2；判据正身=dispatch-wave5.md（99ef7487，W39 trimodel-recovery-ladder 树）
- 交付锚: TriModel 仓 dev **161d0ca**（2 files +8/−2，E10/E12 sg 覆写；修复笔 bc72ea4 原样在族零触碰）

## 一、修复面四条逐条读数（bc72ea4 @ 09-26 现势核验）

| # | 条目 | 现势锚 | 判 |
| --- | --- | --- | --- |
| 1 | 删除 handler 补策略删除通道 push | ui/index.html:1289 `tcDeletedStrategyIds.push(id)`（对齐双通道形态） | ✓ 在位 |
| 2 | PUT body 补 deleted_strategy_ids 行 | ui/index.html:892 `deleted_strategy_ids: tcDeletedStrategyIds`（四通道齐） | ✓ 在位 |
| 3 | 保存成功后通道清空对齐 | ui/index.html:1382 hydrate 清空（随三实体族；entries 通道清空位差异=fix卷已记在案） | ✓ 在位 |
| 4 | LG-035 冻结面零扩散 | 修复笔 diff=1 file +4/−1 全在删除通道面（fix卷核验）；本批零新增源面触碰（本批 diff=test 两文件 sg 覆写，测试面） | ✓ 达成 |

- `git merge-base --is-ancestor bc72ea4 HEAD` ✓；HEAD=8de8fe7 线（LG-058 族）→夜窗 754fc96→本批 161d0ca。

## 二、真 reload 持久周期断言线（硬判据·第四型纪律）

**断言环境（sg 全新搭建，用户级零系统变更）**：playwright chromium_headless_shell-1243（Chrome for Testing 153.0.8010.12）+ 12 缺失系统库便携化（yumdownloader --resolve 21 rpm→抽取 ~/.chromium-libs→LD_LIBRARY_PATH，无 root 路线）；真浏览器+真服务端 handler+真 page.reload()——jsdom/进程内复刻零使用。

| 断言 | 读数 | 判 |
| --- | --- | --- |
| **E12 C1 硬核**：删非活动策略乙→保存→真 reload→消失不复活（DOM+沙箱卡+通道三面断言） | PASS | **硬判据过 ✓** |
| E12 C2 二轮持久（再删丙→乙丙皆不复活） | PASS | ✓ |
| E12 C3/C4 对照通道（模型集/规则同周期+UI 预检守卫） | PASS | ✓（STE 门②对照面同覆盖） |
| E10 W3 周期（条目+fixed 规则保存→reload→回显） | PASS | ✓ |
| **E0 预修态对照**（bc72ea4^ 历史 HTML 供服）：同断言族 | **4 fail** | **断言力实证**（缺陷检出签名清晰） |
| gate 族（ui.e2e.gate.test.ts） | 13/13 | ✓ |
| **sg 实弹合计（夜窗件A 版基+本批覆写）** | **11/11 exit0** | **跨环境双证**（夜窗 dev 12/12+sg 11/11） |
| 全量门（node22，标准 env） | **313/296/0/17** | 零 fail ✓ |
| tsc 门 | 0 错 | ✓ |

- 停滞两日真因勘定：①修复笔 bc72ea4 早已在库（非修复停滞，系**验证停滞**）②E2E 族 env 门控（chromium 缺席显式 SKIP 禁静默绿纪律）→sg 无浏览器=实弹永远 skip ③sg 被 detach 于 8de8fe7 线且 E10 排列随版漂移（夜窗已修）——本批三解：sg 浏览器便携化+夜窗版基并线+覆写补丁。

## 三、既有挂独立归因（不转抄）

- E0 新线复跑超时（200s）：预修历史 HTML 与夜窗新测试面（C6 jsdom/C10b API 直打）互态不在支持矩阵——断言力证以先轮版基 4 挂读数为锚；非门内项。
- 仓工作区预存残留（非本批产物）：package-lock.json M+两 bak 目录（sg-switch 09-28 遗），原样保留；本地 dev 引用曾 detached/behind78——本批 checkout -B 正位。
- 全量 0 fail：无既有挂转抄面。

## 四、边界与移交

- 生产卡 trimmc-card.json/3333 生产面零触碰（E2E 全程沙箱卡+随机端口）✓；冻结面零扩散 ✓。
- STE 回头测面：真 reload 周期断言线已由本卷供弹（E12 全案+跨环境双证），STE 实弹复核/非作者手测门照 dispatch 门③④行进；「D1 测毕」里程碑判候 STE 读数。
- 使用依据：dispatch-wave5.md/fsd-wave5-d1-survey.md（b91e8340）/fsd-wave5-d1-fix.md（bc72ea4）/夜窗 754fc96 件A 双修卷面；TriModel 161d0ca diff 为本批改动唯一真源。
