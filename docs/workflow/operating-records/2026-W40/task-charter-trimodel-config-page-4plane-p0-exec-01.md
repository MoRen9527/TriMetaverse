# 执行单 TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01：LG-058 P0 期实施（卡面引擎泛化＋本机两卡接入＋备份轮换＋审计账）

- **归属**：LG-058 执行期 P0（规划单三轮走查+CEO 终审通过；方案正身=cto-implementation-plan.md v3 @ afb0180c／cpo-product-plan.md v3 @ 8b76976c／判定件 v3 @ 9bd40491）
- **发令**：CEO 2026-09-28 10:22 终审「通过，立执行单开工」（date 现查 10:23:14+0800 星期一；BOD 会审笔 §六 a2156991）
- **承接**：COO 拆派（实现主体候 COO 按能力矩阵定：FSD 实现+CTO 架构门审+STE 测试族）；经 COS 流转
- **face**：M 面（本机 TriModel 服务端+TriMLC/TriRLC daemon）
- **执行窗**：正常工时；P0 完成后 P1（服务域接入+降级梯全域+R-HY rmc 卡纠正迁移）候立第二批

## 一、范围（CTO 件 P0 行+判定件 v3 两 P0 确认项）

1. **卡面引擎参数化泛化**：face registry 静态注册（MVP 不做动态注册协议）+泛化端点族——`trimmc-card` 别名**保留零破坏**（老路径原样）；pull 视图四 face 可达；
2. **本机两卡接入**：TriMLC（8713）/TriRLC（8711）config-cache 泛化（key-cache 机制泛化件，R-HY 问7 先例）+「TriMLC·本机/TriRLC·本机」卡语义（寄居过渡注记随卡）；
3. **卡面写前备份轮换**（P0 确认项①）：claude-fallback L28 在役机制泛化，非新发明；
4. **卡写审计账**（P0 确认项②）：face-events 单一 jsonl，事件型四族（pull/write/apply/status），len-only；
5. **CLI config 族**：与网页能力矩阵底表对齐（CTO §5.2）；
6. **测试族**：API 族+cache 泛化单测。

## 二、验收锚

- **A1** 泛化端点族四 face 可达+trimmc-card 别名回归验证（零破坏实测）；
- **A2** 本机两卡 config pull 视图+face-events 台账四族事件落卷（len-only 核验）；
- **A3** 备份轮换实弹：卡写→备份生成→轮换序→审计行，全程留痕；
- **A4** CLI config 族与网页能力对表（底表逐格核）；
- **A5** 测试族全绿+CTO 架构门审签发；
- **A6** revert 演练：泛化层纯新增单 commit 回滚实测。

## 三、边界

- 不触生产写面：R-HY rmc 卡纠正迁移=P1（本单禁碰 R-HY）；sg 断链三件照旧走 M2 候修⑤不并入；
- 泛化层纯新增、别名保留=老路径原样（revert 单 commit 语义）；
- UI 改动不在 P0（左选项卡重构=P2 按 CPO IA）；
- 降级梯全域铺开=P1；层级合并（§4.3 裁决落地）=P1；
- BOD 执行注记随行：P1 层级合并动 env 语义前先了 M2 候修⑤（时序）；P2 诚实三态验收须 sg 断链活体实照（本单不涉，留档防丢）。

## 四、纪律

- UI spec 必附实现态走查（LG-035 家族）与渲染验证门对 P2 生效，P0 的 CLI 面照「全量读数回报」纪律；
- 派工/回报走 LG-057 节点收口件新规（本单为试点单之一：全链节点收口件落树）；
- commit attribution/收口 commit 卫生照纪律册。
