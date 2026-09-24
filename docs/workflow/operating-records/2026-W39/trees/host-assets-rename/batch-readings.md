# LG-046 Phase 0-2 执行读数（BOD 唤醒令续作）

- 执行: m-duty-cos 09-24 夜航段；锚=charter+execution-brief v1+转投单四约束
- **Phase 0 物理迁移 ✓**: `TriCompany-copilot-host-assets` → `TriCompany-host-assets`（TMV 树内 mv）+ 同名 symlink junction（锚②旧路径可达实证：ls 过符号链接列目录正常）
- **Phase 2 TMV 内容正名 ✓**: 219 件 1,866 处替换（含更名目录自身内部引用与 .claude/.github 发布拷贝路径行——渲染管线将再证）；提交 1f9d505b（TMV dev 双同尖）
- **Phase 1 TC 内容正名 ✓**: 145 件 604 处替换；提交 d9cd33f（TC dev bare 同尖）；他席在途两件（IPD 培训件+report_envelope.py）pathspec 排除未提交——worktree 附带路径正名随其席收口，如实注
- **复验**: 双树活面旧名残量=0（排除冻结面后 grep=0）；cron/本席脚本族旧名引用=0（计划任务面零波及）；sync_validator EXIT=2=既有 planned 口径判读（与本批无关，重跑同值=幂等符合锚③前半）
- **红线遵守**: operating-records/trees 冻结面零改动；脚本逻辑零改动；LG-040 护栏表述未现役化；他席在途件隔离（bottleneck/report_envelope/IPD 三件各归其席）

## 锚进度（五锚）

| 锚 | 态 |
|----|-----|
| ①活引用面正名全量 | ✅ Phase 1+2（TC 145 件+TMV 219 件；冻结豁免） |
| ②junction 别名生效 | ✅ symlink 实证 |
| ③三 daemon 重启后引用解析 | ⏳ 候底卷 5 处对表+restart（BOD root 通道，可与名册激活同窗） |
| ④manifest 支撑面同步 | ✅ 随内容正名覆盖（host-object-manifest.json 等已正名）；STE 先例式终验候 Phase 4 复核 |
| ⑤inbox-wiki 首条线就绪 | ⏳ 迁移毕零返工衔接成立，首条线本体=本地线窗 |

## 候外部件

- 底卷补投（配对命名表 13 行/三护栏行全表/daemon 5 处明细）→ Phase 3 前置
- daemon restart root 一条（可与名册 restart 同窗合并执行）
- BOD 验收链（照 23:33 修正令 COS 收口→BOD 验收）
