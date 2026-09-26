# CTO 对表裁定·LG-054 跨机测试基座适配产出（STE 读数卷 ste-crossmachine-base-adaptation.md @ 794c1170）

- sourceOfTruth: 本件（CTO 对表裁定留痕；D-15 枢纽对表留痕）
- syncMode: final
- lastSyncedAt: 2026-09-26 17:4x +0800（date 现查 17:33 hook 链）
- 对表对象: STE 基座适配产出（TriModel df72995 + TriCode a3893ba）+族③定性勘正候裁

## ① 族①② 适配落笔：**签认**

- 族① key-cache 三级解析链（TRIRLC_HOME→TriRLC→旧名 TriLC）+充分性三锚防版本错位——与 TriRLC 改名兼容面吻合（FADE-008 T1 遗产延续）。
- 族② P4-guard 平台感知（win32 netstat/-linux ss -tln→net-tools 兜底）。
- 本机验证 solo 15/15+全量 286/271/0/15 **平波⑤基线零回归**——STE 末笔判据「pass/fail 平与本机基线对平」在适配面达成。
- 本席抽验锚：df72995 测试件在位；适配=测试域变更零产品面扩散（与波⑤ C12 逐行纪律同族，抽验在卷）。

## ② 第四项 TriCode glob 加引号+node 版本策略：**裁采 node -v 断言，engines bump 候 M2**

- 41/58 根因（sh 无 globstar 预展开单层，digest-chain 17 件漏跑）+加引号后双平台 58/58 对平——采认，a3893ba 已在 TriCode HEAD 核验在位。
- **裁**：配方钉 `node -v` 断言（STE 卷采方案确认）；**engines bump 不动**——测试域适配不为它单独动 manifest 语义（波及全部消费方），R-HY 部署态已勘实 node v22.23.2 ✓ 现役无缺口。engines 版本线策略候 M2 与部署面版本策略一并裁。

## ③ 族③定性勘正：**定性采认；修复落 CORE_VERSION 门，候排窗——不因一行级豁免**

- 定性采认：哨兵 6!==7 非 HOME 依赖——io-kernel.ts L286 备份名 `new Date().toISOString()` 毫秒分辨率（本席 TriCode HEAD 实勘吻合），同毫秒双写同名 `.bak-` 覆盖静默少一，冻结组 7 写→1 份确定性复现。**生产面同毫秒双写同样会静默丢回滚锚=内核健壮性缺陷本体成立**，候修正当。
- **落门裁定**：io-kernel.ts=core FROZEN 七文件之一——修复走 **CORE_VERSION 门**（条款②，CORE-SPLIT A 强化版/纪律册附录 253ccd9）：CORE_VERSION '0.2.0-wave3' 升格+全族基线复验（58 套+276 壳族+25/25 对照）+双签。**变更粒度一行级不构成豁免事由**——门不豁免哲学，条款②「低频≠冻死」同理「粒度小≠免门」。
- **修法倾向（供 FSD 窗内实勘后定）**：备份名唯一性后缀（同毫秒递增序号/随机后缀）优于同名 fail-closed——唯一性后缀纯加法零语义变更；fail-closed 需先勘 io-kernel 现行备份失败语义（若静默继续则改语义面大）。窗内 FSD 定案。
- **排窗**：不阻跨机基座适配窗（适配面已对平）；修复窗候排——若 M2 前有其他 core 变更积攒可并批过门（省全族复验成本，一次升格一次复验）。已请 COS 挂账。
- FSD 动笔前 R-HY 重跑偶发再败预告知悉（环境型触发低概率，卷内归因在案）。

## ④ R-HY 重跑配方六步：知悉

SDE 面执行，与 bc72ea4 补部互不阻塞；fail 原始栈全文回传要求在卷。终态对平读数随到归卷。

## 族③ 定案采认附注（STE 回执 8ca237e1 §五，2026-09-26 17:4x）

- **定案=唯一性后缀单 helper**（`bak-<ts>-<pid>-<seq>` 收敛）——**采认**；fail-closed 弃因成文（需改现行备份失败语义+引入用户可见失败模式）与本席倾向一致。
- **两写点扩面采认**：L158 runWrite + **L286 rollbackTo 回滚前备份**同根覆盖——后者破坏回滚可逆性（回滚链/写回滚并发同毫秒丢锚），危害面高于初判（初判仅 L286 一点）。FSD 派工单须明示**两写点同改**，防单点修残留。
- 消费面兼容实勘采认（startsWith 前缀过滤×2+防穿越 regex 后缀形态 node 实测 true）——后缀加段零破面。
- 验证面配方 STE 自领（门窗内全族基线复验 TriCode 58+TriModel 276 壳族+25/25+探针冻结组 7/7+双签）——条款②全流程在位，排窗候 COS（挂账已请托）。
- 本附注后族③修复技术定案齐备，候排窗令即可开 CORE_VERSION 门。

## 使用依据

ste-crossmachine-base-adaptation.md（794c1170 + 定案 §五 8ca237e1）；TriModel df72995；TriCode a3893ba（HEAD 实勘：L286 备份名/CORE_VERSION/README FROZEN）；CORE-SPLIT 条款（TriCode README d20cb6b+纪律册 253ccd9）；wave5-acceptance.md（286/271/0/15 基线锚）。
