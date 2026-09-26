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

## R-HY 六步终态对平归卷（SDE 读数 §十七 @ 1cebf5a8，2026-09-26 17:5x）

**归卷裁定：合格。跨机基座适配判据正式达成——LG-054 全链（部署+验收+补部+基座适配+终态对平）全域收口**，剩 BOD 收官件（自办在途）。

- **对平读数核验**：TriCode 58/57/1/0（唯 fail=FROZEN-BACKUPS 哨兵=族③预告案精确命中，STE §二预告归因原文兑现，零意外零新增缺陷）；TriModel 273/260/1/12 对照本机 286/271/0/15——件数差 13=UI E2E 整块 skip（R-HY 无 chromium）、fail 1=无 upstream key 环境案，**全部环境型归因闭环，零代码缺陷**。
- **适配生效硬读数采认**：GATE 族 8 件全 pass（M1 时 ERR_MODULE_NOT_FOUND 5 fail 主体全平）+TRIRLC_HOME 三级解析链实弹 pass+P4-guard linux ss 分支 pass——「pass/fail 平对平」判据在 fail 面唯余族③预告案+环境案的口径下达成。
- **隔离测试位裁量记档正面**：/tmp/lg054-rerun 隔离 clone+部署位零触碰（HEAD/dist/systemd 全未动）——纯测试面边界守约，防部署对象语义漂移，方法正当。
- **候决两项归属裁**：
  ① **R-HY 补装 chromium/钉测试 key：候办挂账不即办**——属测试环境建设投资，当前无跨机 CI 门需求（LG-054 判据已闭）；补装改变机环境面、钉 key 触密钥审批面（不为测试便利在裸机挂 key）。候 M2 排窗与「跨机测试基座 CI 化」一并裁。
  ② **隔离位清理：不派令，/tmp 重启自清**——留位供族③ CORE_VERSION 门开窗时 R-HY 复现环境对照复用；派清理令反增一次跨机动作，零收益。

## STE reconciliation 判定采认+B 案批令（读数卷 §六 @ 67c3cb44，2026-09-26 17:5x）

- **测试面对平判定与本席归卷裁定一致**——判据条件达成双面确认，族①② Linux 实弹清零+名级 diff 对平零暗败。
- **候决 A（chromium）：裁不补**——与 STE 荐一致；STE 附条件「如补须先过 13 案 Linux chrome 实证」入 M2 跨机 CI 化候办账作前置。
- **候决 B（测试 key）：改裁——批测试面适配（STE 荐 B）**：'no-api-key' 案改无 key skip+归因注记，基座自含可对平（把环境差异编码进测试基座优于环境钉 key/裸机挂 key）；该案与既有「环境前提案镜像互补 skip/pass」同族=无 key 环境正确行事。**STE 即刻动笔**（TriModel 测试域小笔，非 core 零门槛冲突），随卷出读数走门审。
- **隔离位清理锚点精确化采认**：保留至族③ CORE_VERSION 修后复验毕（比「重启自清」更精确，采纳 STE 口径——届时复验毕再清）。

## B 案小笔门审（a9d9fc8 @ 读数卷 §七 df4894b6，2026-09-26 18:1x）

**门审：通过。前提勘正申报采认。**

- **前提勘正采认**：原荐「无 key skip」作废正确——败案机制=before() 未自设 GLM_API_KEY、案经 env fallback 依赖 ambient 键（dev 机真席位键恒绿=**基线假象之源**，R-HY 裸机败=暴露隐性环境依赖）。**无事可 skip 勘定成立**，本体落点=before() 自设哨兵键=「基座自含」正解。机制先钉后动笔（不盲写）+点名 dev 机假象机制——记档正面。
- **diff 面核验（本席抽验）**：单文件 test/anthropic-proxy.test.ts 26+/8- 与申报一致；哨兵键 ORIGINAL_GLM 保存/恢复对称；alwaysHitWindow now±8h 计算窗跨午夜正确（at() 归一化+start>end 包裹分支引擎支持已勘+Asia/Shanghai h23 确定性），字面端斥窗两案全替换——零扩散。
- **同笔双义裁定**：缺陷①（哨兵键）+缺陷②（60 秒空洞）同文件同 describe 同族测试确定性缺陷，单文件内同笔可接受（回滚面一致），commit message 双义明示——不判混笔违规。
- **读数三形采认**：裸机形（env -u）修前 18/19 精确复现 R-HY→修后 19/19（E0 同族锚：先复现后修复）+异键形 19/19+全量 286/271/0/15=波⑤ 基线全平零回归。
- **候决② O-B1（policy-machine/policy.gate.evaluation/policy.test 等同形字面端斥窗统一计算窗化）：候选办挂账不即办**——非阻塞潜伏面（60 秒/日撞窗概率），统一化有价值候 M2 前排或下个测试域维护窗并批（与 O-E12-1/O-6 同族候选办）。
- **候决③ SDE R-HY 重跑：准**——单文件同步入隔离位+重跑（预期 273/261/0/12 fail 清零），读数归卷即对平判据全项达成、STE 适配面全域收口。

## 适配窗终局归卷（SDE B 案重跑读数 §十八 @ 949709c3，2026-09-26 18:1x）

**收口裁定：通过。跨机测试基座适配窗全域收口——对平判据全项达成。**

- **终态读数核验**：273/64/261/0/0/12 与门审预期 273/261/0/12 逐字对平——pass 260→261（proxy policy window 案转绿）、fail 1→0 清零、skip 12 不变。**TriModel R-HY fail 归零**。
- **对平判据全项达成**：TriModel fail 归零 ✓；TriCode 唯一 fail=族③预告案（CORE_VERSION 门候排窗，明确在途不在本重跑范围——账面清晰）。三族+B 案适配产出在 R-HY 裸机形全部实证生效。
- **工序面**：三步断言制同步（勘→打→重勘）+隔离位推进 a9d9fc8+部署位零触碰（照「无需补部」裁定，TriCode 不动）——全程守约。
- 隔离位 checkout a9d9fc8 留位供族③复验复用（清理锚=族③复验毕，前裁不变）。
- **本窗席位义务终态**：STE 适配面全域收口；SDE 执行面全域收口；本席对表/门审义务全域清零。LG-054 剩余面=BOD 收官件（自办在途）+族③ CORE_VERSION 门（候排窗，挂账在案）。

## 使用依据

ste-crossmachine-base-adaptation.md（794c1170 + 定案 §五 8ca237e1 + B 案 §七 df4894b6 + 门审采认 d154b398 + 重跑收口 §十八 949709c3）；TriModel df72995/a9d9fc8（HEAD 抽验）；TriCode a3893ba（HEAD 实勘：L286 备份名/CORE_VERSION/README FROZEN）；CORE-SPLIT 条款（TriCode README d20cb6b+纪律册 253ccd9）；wave5-acceptance.md（286/271/0/15 基线锚）；deploy-readings.md（§十五 b096d1c2/§十七 1cebf5a8）。
