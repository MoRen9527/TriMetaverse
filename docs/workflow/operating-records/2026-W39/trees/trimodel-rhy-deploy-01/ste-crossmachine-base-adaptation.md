# STE·LG-054 跨机测试基座适配读数卷（三族+runner 口径+族③勘正）

- sourceOfTruth: 本件（STE 席基座适配读数正身；派工链=deploy-readings.md §二/§十候 STE 项+COO 转办令）
- syncMode: working
- lastSyncedAt: 2026-09-26T09:50:46Z（date 现查，17:50 +0800；§六 R-HY 重跑对表追加）
- 席位: STE 小柯（m-ste）；判据（CTO）：三族清零后 R-HY 双仓全量 pass/fail 平与本机基线对平
- 适配锚: TriModel `test/policy.gate.e2e.test.ts` @ df72995；TriCode `package.json` @ a3893ba

## 一、三族适配法与本机验证读数

| 族 | 落点 | 适配法 | 本机验证 |
| --- | --- | --- | --- |
| ① TriRLC 旧名路径 | TriModel policy.gate.e2e L177+（跨仓 `../TriRLC/src/config/key-cache.ts` 硬路径） | 三级解析链：`TRIRLC_HOME` 钉位优先→新名 TriRLC→旧名 TriLC（R-HY 现役旧名位）；加文本面充分性三锚（onKeyCacheUpdated/applyKeyCacheToEnvironment/initKeyCache 缺一即 fail 带归因，防旧克隆版本错位哑败） | solo **15/15** PASS；TRIRLC_HOME 钉位分支单独验绿 |
| ② netstat Windows 格式 | 同文件 P4-guard（`netstat -ano`+LISTENING） | 平台感知：win32=netstat -ano（LISTENING）；linux=`ss -tln`（LISTEN）→旧 net-tools `netstat -tln` 兜底；断言语义不变（监听行在位+绑回环 127.0.0.1） | solo 15/15（win32 分支命中） |
| ③ 哨兵 HOME 形 | TriCode five-gates FROZEN-BACKUPS 轮换豁免（断言 6!==7） | **定性勘正：非 HOME 依赖**——见 §二机制勘正；测试零改动（不掩内核缺陷） | 本机 five-gates 全绿（快 fs 才触发，见下） |

**全量对平读数（本机）**：TriModel 默认门 **286/271/0/15**=波⑤ 基线全平（适配零回归）；TriCode **58/58**（引号修后复验平）。

## 二、族③机制勘正（探针双读数，io-kernel 备份名毫秒碰撞）

- 机制：`io-kernel.ts` L155 备份名=`new Date().toISOString()`（**毫秒分辨率**）；同毫秒两次写入→同名 `.bak-` 相互覆盖→备份静默少一。R-HY 读数 `6 !== 7`（实得 6）吻合：哨兵在位时 rotateBackups L46 早退不可能删，**计数减一唯一通路=同名覆盖**。
- 探针（`D:\tmp\lg054\probe-backup-collision.mjs`，双组）：
  - 冻结组（toISOString 冻结常量）：7 写全撞同名→**backups=1**（覆盖机制确定性复现 ✓）
  - 对照组（本机真实时钟）：7 写 13ms→5 个不同名（~2.6ms/写，NTFS 未撞但贴脸；R-HY 更快 fs 迭代可<1ms→偶发同毫秒→6）
- 定性：环境型触发（fs 速度）+**内核健壮性缺陷本体**（生产面同毫秒双写同样静默丢回滚锚）。
- **候 CTO 裁+FSD 候补小笔**：备份名加唯一性后缀（pid+计数器/短随机）或同名存在即 fail-closed，一行级；FSD 动笔前 R-HY 重跑此案可能偶发再败（低概率，如实预告，败读数归因=本节）。

## 三、第四项·runner 口径修正（TriCode 41/58 计数差根因）

- 根因：`package.json` test script glob **未加引号**——R-HY sh（无 globstar）预展开成单层（41，根层 digest-chain 17 件漏跑）；本机 cmd 不展开、原样传 node 内部 globbing（58）。41+17=58 对平实锚。
- 修法：glob 加引号→sh/cmd 双平台原样传 node 内部递归展开；本机 58/58 复验平。
- 前置：**运行时 node≥21**（--test 位置参数内部 globbing 版本线；本机 v22.21.1）；`engines >=20.0.0` 与此有缝——候 CTO/SDE 裁（bump engines 或 rerun 配方钉 node -v 断言，本卷采后者不动 engines）。

## 四、R-HY 重跑配方（SDE 面；R-HY 生产冻结面零触碰，纯测试面）

1. 同步测试基座：TriModel `test/policy.gate.e2e.test.ts`（df72995）+TriCode `package.json`（a3893ba）入 R-HY 树（bundle/fetch 照部署工序三步断言制：勘→打→重勘）；
2. 前置断言：`node -v` ≥ v21（否则 TriCode 改显式枚举：`node --import tsx --test test/*.test.ts test/*/*.test.ts`）；
3. TriModel：`npm test`——预期 pass/fail 平本机基线 **286/271/0/15**（skip 15=UI E2E gate-off 族同形）；
4. TriCode：`npm test`——预期 **58/58**；
5. 任一 fail：原始栈全文回传（禁 head 截断关键行——命令链断言纪律），候本席逐族归因；
6. 附注：bc72ea4 补部（SDE 线，触发=波⑤ D1 验收毕已达成）与本配方互不阻塞可并行；族③偶发再败候 FSD 小笔后自愈（§二）。

## 五、族③修复定案书（CTO 裁定③「窗内实勘定案」应答；正身=cto-adaptation-review.md @ 4b22d9ef）

- **定案=唯一性后缀**（同名 fail-closed 弃）。全源面扫描实勘（TriCode src `.bak-` 全命中 6 处）：
  - **写点×2 同缺陷**：io-kernel L158 runWrite 备份+**L286 rollbackTo 回滚前备份**（新勘——同毫秒回滚链/写回滚并发同样覆盖丢锚，破坏回滚可逆性，与 runWrite 同根）；copyFileSync 静默覆盖（node 默认）=现行失败语义。
  - **消费面全兼容后缀**：rotateBackups L52/listBackups L241 均 `startsWith(${path}.bak-)` 前缀过滤；rollbackTo L265 防穿越 regex `^settings\.json\.bak-[0-9A-Za-z:\-.]+$`——后缀形态 `bak-<ts>-<pid>-<seq>` 实配断言 **true**（本席 node 实测，pid 数字+连字符均在字符类内）；既有测试两处 filename 断言均前缀形不破。
  - fail-closed 弃因：需先改现行备份失败语义（新增 existsSync 预检+失败中止路径），把同毫秒场景从「静默丢锚」变「用户可见失败」——优于现状但劣于后缀（后缀零新失败模式+操作恒成）。
- **修法建议（FSD 动笔面，CORE_VERSION 门条款②全流程）**：io-kernel 内收敛单 helper（如 `backupName(path)`：`bak-${ts}-${process.pid}-${++seq}` 模块级单调序），L158/L286 两写点同改；注释 L256/L266「<时间戳>」形态描述随更新。
- **验证面承诺（本席，双签制内）**：修后全族基线复验执行——TriCode 58 套+TriModel 276 壳族+25/25+探针回归（冻结组修后应 backups=7）；five-gates 哨兵案在快 fs 下转确定性绿=R-HY 对平族③清零实证。
- 排窗：候 COS 挂账 CORE_VERSION 门窗；本席验证配方已备（探针+双仓全量命令族在卷 §四）。

## 六、R-HY 重跑对表（SDE 面 17:52 读数件 §十七 @ 1cebf5a8 回流；本席 reconciliation）

- **对平判据判定：条件达成**——族①② 实证清零；族③ 唯一 fail 系预告案在途（修复门在途）；两新环境缺口（非三族、非代码缺陷）候裁。

| 仓 | R-HY 读数（总/过/败/跳） | 本席逐族归因 |
| --- | --- | --- |
| TriCode | **58/57/1/0** | fail 1=FROZEN-BACKUPS 哨兵 6!==7=**族③预告案精确兑现**（§二归因原文，零新因；清零=FSD CORE_VERSION 门窗修后） |
| TriModel | **273/260/1/12** vs 本机 286/271/0/15 | 件数差 13=E1-E8(8)+W1-W5(5)=R-HY 无 chromium 整 suite skip 不展开案（名级 diff LC_ALL=C 对平，零暗败）；fail 1=proxy 'no-api-key'=**R-HY 无 upstream env key**（同 suite 余 3 件全绿；环境数据缺口，fail 栈全文在 R-HY /tmp/tm-test-full.log 备核） |

- **族①② 生效硬读数（Linux 实弹）**：GATE 族 8 件全 pass（M1 时 ERR_MODULE_NOT_FOUND 5 fail 主体全平）；daemon real-chain poll pass=`TRIRLC_HOME` 三级解析实弹工作；P4-guard linux 分支（ss -tln）pass。
- **候裁两项（SDE 提请，本席附荐）**：
  1. R-HY 补 chromium：**荐不补**——UI E2E 覆盖 dev 机已足（e12 门 TRICOMPANY_ENABLE_TRIMODEL_UI_E2E 本地可开），R-HY=部署面非 UI 开发面；记账候 M2 后有跨机 UI 需求另立窗（装后须先过 13 案 Linux chrome 实证，非零成本）。
  2. 钉测试 key（proxy 'no-api-key' fail）：候 CTO 裁——荐**测试面适配**（本席候选小笔：该案无 key 环境下显式 skip+归因注记，或钉 key 走 SDE 测试环境建设）——荐前者（基座自含优于环境外置依赖，skip 计数透明可对平）。
- 隔离测试位（/tmp/lg054-rerun）：**荐保留**至族③ CORE_VERSION 修后 R-HY 复验（复用），验毕清理。
- SDE 同步形态裁量（隔离位零触碰部署位+TRIRLC_HOME 钉现役旧名位）=配方未钉落点处的合理裁量，追认在卷。

## 使用依据

COO 转办令（三族 owner=STE）+CTO 判据令（对平判据）；deploy-readings.md §二/§十（c91e3772 起读数，现势 5c739faa）；TriModel df72995/TriCode a3893ba/波⑤ 基线 ea2b6c60 卷；探针卷 `D:\tmp\lg054\`；工作区记忆条：命令链断言/manifest 身份验证/活体优先诊断。


COO 转办令（三族 owner=STE）+CTO 判据令（对平判据）；deploy-readings.md §二/§十（c91e3772 起读数，现势 5c739faa）；TriModel df72995/TriCode a3893ba/波⑤ 基线 ea2b6c60 卷；探针卷 `D:\tmp\lg054\`；工作区记忆条：命令链断言/manifest 身份验证/活体优先诊断。


COO 转办令（三族 owner=STE）+CTO 判据令（对平判据）；deploy-readings.md §二/§十（c91e3772 起读数，现势 5c739faa）；TriModel df72995/TriCode a3893ba/波⑤ 基线 ea2b6c60 卷；探针卷 `D:\tmp\lg054\`；工作区记忆条：命令链断言/manifest 身份验证/活体优先诊断。
