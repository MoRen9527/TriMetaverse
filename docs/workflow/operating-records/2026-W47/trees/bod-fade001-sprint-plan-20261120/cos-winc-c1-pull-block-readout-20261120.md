# RW1 窗 C·C1 sg 面 install+build 派工·pull 阻断读数卷（BOD 675 派令·护栏③红即停如实报）

- date 现查: 2026-11-20T16:14:xx+08 工序窗（落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（sg 面·零活体触零 daemon 触·护栏③红即停零二次硬试恪守）
- 令源: BOD 直投 675 窗 C-C1 派令（COO 台账 675·FSD 毕报 571139c 承·纯写面零活体触）
- 性质: 工序①阻断读数卷（②备份锚+⑤前活体读数已成·③④候 root 链）

## §一 · 工序① pull 对表读数

- **对表偏差如实报（良形）**：令文 ls-remote 顶=571139c·实际 origin/dev 顶=**e8124857b**（571139c **直系后代**·同链 C-1 勘正笔「engines 回落 >=18.20.0 精确形·分支 A 命中=债真清·CTO 独立复勘承录」）——571139c 在远端链上被包含·pull 目标=现役顶（含 C-1 实体+A1 精确形）
- **pull 阻断实锚**：
  ```
  error: unable to unlink old 'src/fade/store.ts': Permission denied
  error: unable to unlink old 'src/fade/types.ts': Permission denied
  ```
  - 根因=**src/fade 族 root:root 属主**（目录+store.ts+types.ts·mtime 11-04 17:23=11-04 root 链操作产物）——fleet 零 unlink 权→git 无法更新 C-1 目标文件（正是 A1 替换对象）
  - HEAD 未动（b2852cf 原位）·ff-only 中止零半套——中途 M 残留（package.json/package-lock/test 三件部分更新态）已 `git reset --hard HEAD` 清扫毕（清扫后 status 净·备份锚与 node_modules 零涉）

## §二 · 阻断面全谱（root 属主面扫·候 chown 清单）

| 面 | 读数 |
|---|---|
| src/fade/ | 目录+store.ts+types.ts root:root（**C-1 替换对象·主阻断**） |
| test/ 族 | echo-queue/fade-skill-loader/fade-runs-endpoint/fade-store/fade-closing-gate/heartbeat-node/contract-resolver/internal-auth/employee-registry/fade-state-machine/fade-recovery 等 test 文件 root 属主（pull 更新+白盒跑面均涉） |
| 旧备份/docker 备份 | dist-bak-pre-fade-20261104T092507Z/·docker/.env.bak-pre-rotate-20261015·.github（非本序触面·如实注） |
| node_modules/ | **fleet:fleet ✓**（install 面畅通） |
| dist/ | fleet ✓（备份锚已成·cutover 面畅通） |

- **处置候选（BOD root 链一条·照 649/654/656 root git 操作形）**：
  ```bash
  chown -R fleet:fleet /srv/fleet/TriMMC/src /srv/fleet/TriMMC/test
  ```
  （最小触面=src+test 两目录族·chown 后值席面续工序① pull→③ install→④ build+断言·零自裁零代 root）

## §三 · 已成件（本序零损失）

1. **②备份锚** ✓：`dist-bak-pre-c1-20261120T081540Z/`（716K 全量·恢复命令形=`rm -rf dist && cp -r dist-bak-pre-c1-20261120T081540Z dist`——G1 硬项③闭合就绪）
2. **⑤前·活体三读数** ✓：is-active=**active**·LISTEN 8712 **pid=1816473**（A 形托管代·全序零触实证）
3. package.json 现检（b2852cf 态）无 better-sqlite3 行（571139c 引入面候 pull 达后 install）

## §四 · 护栏对表

- 触面限定 ✓（检出面只读+reset 清扫·零 daemon 零 unit 零 web 8791 零 TriRMC 8710 零树协议零值席常驻）·③红即停 ✓（pull 阻断即停·零二次硬试·零自代 root）·回滚锚 ✓（备份位+git 原位零损）·值守自守 ✓

—— 值席 COS（窗 C·C1 pull 阻断读数卷·候 BOD root 链 chown 后续序·归转 COO/CTO+BOD·D-47 落款=commit 对象时戳）
