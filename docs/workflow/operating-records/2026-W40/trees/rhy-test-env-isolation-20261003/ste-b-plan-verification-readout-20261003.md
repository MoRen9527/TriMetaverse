# STE·B 件方案卷验证卷（CTO〈R 面测试环境勘+隔离方案〉验）

- sourceOfTruth: 本件（B 件方案卷 STE 验正身；对象=trees/rhy-test-env-isolation-20261003/cto-rhy-test-env-isolation-plan-20261003.md，3532a1c5，71L 全读）
- syncMode: static（验毕候 BOD #307 链；BOD 已裁「STE 验毕立施工单准」）
- lastSyncedAt: 2026-10-03T03:24:16Z（date 现查）
- 验证席: STE 小柯（m-ste）；令源=COO 10:2x 穿插件预位（验点=硬边界五条完备性/验收锚三件套可验性/风险表覆盖）
- 验证方法：卷面全读+本机实勘交叉+**R-HY 只读 SSH 活体探针一组**（零写面：git log/ls/grep/systemctl is-active 四类只读命令）

## 一、验点①：硬边界五条完备性——PASS

五条（目录/服务/端口/面/GLM 稳态）对「测试禁碰生产 trimodel.service 面」目标完备：生产三面（trimodel.service+caddy 443 门+api-token.env/trimodel-data 值面）全被④点名，sg 两 service 零触同条覆盖；⑤占位/skip 条款把 CEO「保 8713 GLM 直连稳态」令锚死。本席加压探勘两项，均归 NIL/已含：

- **a. file:../TriCode sibling 写穿风险=NIL（本机+R-HY 双实锚）**：npm 对 file: 目录依赖若目标含 prepare/postinstall 生命周期脚本会在目标 clone 就地 build（写穿 /srv/fleet/TriCode）——TriCode package.json scripts 实勘（本机 a3893ba 现树+git show d20cb6b 双版+**R-HY 活体 grep prepare 计数=0**）=build/check/test 三键，**零 prepare/postinstall 双版一致** → install 不触 TriCode 本体写入；卷 §三.2「不动 TriCode clone 本体」+风险表第 2 行已覆盖 resolve 面。硬边界无需扩条。
- **b. D9 卡迁移写面自 contained**：测试位若触 legacy 卡 boot 迁移（改名搬规范位），写面落 trimodel-test 自身目录内，目录隔离①已含。
- **观察 1（非阻塞·执行身份未钉）**：卷未钉测试位执行身份（root/fleet）——root 身份施工留 root 属主文件，妨碍后续 fleet 身份日常测试复用（sg root-store root 属主连败先例族）。建议施工单加一行：执行身份断言（统一 fleet，或 root 施工后 `find /srv/fleet/trimodel-test -user root` 清点+chown 归还）。
- **观察 2（非阻塞·TriCode 顶双线一笔差，拓扑对表注）**：R-HY 活体勘 TriCode 顶=**d20cb6b**（CTO 卷读数对 R-HY 准确 ✓）；本席今晨 sg bare TriCode.git 克隆顶=**a3893ba**（=d20cb6b 直接后一笔，lg-054 test script glob 加引号笔）——「与 sg bare 顶一致」主张系 sg bare 线后进一笔所致时点差，非读数错。该笔只改 TriCode 自身 test script（非 TriModel 消费面），无行为影响；file: 消费以 R-HY 本地位 d20cb6b 为准，无需动作，拓扑对表留痕即可。

## 二、验点②：验收锚三件套可验性——PASS（附 1 加固建议）

- **主锚**（三文件样本 exit 0+读数入卷）：可验 ✓——样本形态与本席勘面读数吻合（card-path 零 mock/apply-strategy/anthropic-proxy 14 mock），三文件均无 listen 面，`npm test` 限定三文件跑法明确；STE 复验可独立 SSH 重跑同命令。
- **辅锚**（类型门+install 完整）：可验 ✓——`npm run check` 退出码+node_modules/@trimetaverse/tricode 在位断言明确。
- **观察 3（非阻塞·辅锚加固一行）**：「resolve 在位」只断存在不断可用——R-HY TriCode clone dist 在位（活体勘：dist/index.js Sep 26）✓，但若 npm 对 file: 走**复制**形态，TriCode package.json 有 files 白名单，复制装出的 node_modules 件可能不带 dist → 件在而 import 断。建议辅锚加一行 import 探针（`node -e "import('.../@trimetaverse/tricode/dist/index.js').then(...)"` 或经包入口），一步同时断 resolve 形态与可用性。
- **隔离断言**（五条逐条自查+STE 复验）：可验 ✓——三判据全机器可判；**本席已录基线锚**：trimodel.service ActiveEnterTimestamp=**2026-09-29 02:59:13 CST**、caddy active（R-HY 活体勘 03:0xZ）——复验对照此基线判「uptime 连续」；「生产 clone git status 干净」空输出判定明确。建议施工单把五条自查落 checklist 形随卷归档。

## 三、验点③：风险表覆盖——PASS（附计数勘正）

- **计数勘正**：卷风险表实为**六条**（COO 预位令文与 BOD #307 转述作「风险五条」）——六行判定如后，覆盖无缺。
- 六行逐一判定：npmjs 直连（步 0 预检+镜像=独立裁决不擅配，围栏正确）✓／file: resolve（断言+TriCode build 候补步）✓／小内存 1.6G（串行+tsc --noEmit 分段）✓／真网真 key（⑤ skip 条款+禁开真调用=CEO 令锚）✓／双线基线分歧（拓扑注 github 线定调+收敛另案）✓／测试误触生产（硬边界+施工单禁区+STE 独立复验三重+cd 独立行纪律）✓。无未列风险族（本席 a/b 探勘归观察级非表缺项）。

## 四、验证结论

- **PASS——方案可施工**：硬边界五条完备、验收锚三件套可验、风险六条覆盖全。4 条观察全非阻塞，建议施工单吸收两行：观察 1 执行身份行+观察 3 import 探针行（各一行成本）；观察 2 留痕；样本集/施工序/步 0 预检维持原案。
- R-HY 活体探针四实锚（03:0xZ 只读）：TriCode 顶 d20cb6b／dist/index.js 在位（3383B，Sep 26）／prepare 计数=0／/srv/fleet/trimodel-test 未占位（步 1 前提成立）。
- BOD #307「STE 验毕立施工单准」：本卷即验毕件，COO 可立施工单派 SDE。

## 五、纪律

只读验 ✓（本机实勘+卷面全读+R-HY 单轮只读 SSH 四类命令，零写面零服务触零值面）；候裁不自改 ✓（观察=建议形，施工单裁量）；值面零出机 ✓。

## 六、使用依据

- CTO 卷 cto-rhy-test-env-isolation-plan-20261003.md（3532a1c5）71L 全读；COO 10:2x 预位令；BOD #307 裁
- 本机实勘：TriCode package.json scripts（a3893ba 现树+d20cb6b git show 双版）；TriCode git log（a3893ba=d20cb6b 直接后一笔）；TriModel package.json test script（--test-concurrency=1 与卷 §一吻合）
- R-HY 活体探针（03:0xZ 只读 SSH）：git log/ls/grep prepare/systemctl is-active+show ActiveEnterTimestamp
- 关联：ste-a-trimodel-testenv-clause-draft-20261003.md §七（A 件 T2 已挂本卷指针）；sg root-store root 属主先例（观察 1 依据）；本席批B③ 卷 b5c68843（勘面读数交叉）
