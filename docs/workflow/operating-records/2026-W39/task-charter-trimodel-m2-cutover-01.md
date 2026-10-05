# 任务书 TASK-TRIMODEL-M2-CUTOVER-01：TriModel M2 切换（daemon 改指 R-HY＋读面细门＋观察周）

- **归属**: LG-054 部署波 M2 里程碑执行单（joint-plan 问5 里程碑制兑现；不占新号）
- **发令**：CEO 2026-09-27 11:37 令「②先做」（date 现查 09-27 星期日 11:34+）
- **承接**：SDE（读面细门=R-HY 应用侧）＋两 daemon 改指（本机=运维侧/sg=BOD 通道 D-24）；CTO 技术门；STE 观察周读数；经 COS 流转 COO 拆派
- **face**: M 面（本机+sg）→ R-HY；跨机 sg 侧走本席通道
- **执行窗**：立即排（M1 已收口，前置全备）

## 一、范围（joint-plan 问5/问6 M2 兑现）

1. **两 daemon 改指 R-HY**：本机 TriMLC 域+sg TriMMC 域 `TRIMODEL_API_URL` 改指 `https://8.155.54.79`（改指前 sg→R-HY/本机→R-HY 通路三态复验留痕）；改指顺序=先 sg 后本机（远程面先行，本机留最后=保留本地回退位最久）；
2. **读面细门**（M2 议程锚定项，CTO 异码裁定安全附注）：R-HY 读面公网无 token 可达=现设计——本单落读面鉴权（应用层细门，形态随 CTO 门审裁：API_TOKEN 读面启用/路径白名单二选一裁）；上线读数=公网无 token 读被拒；
3. **观察周起表**：改指毕起 7 天（拉取成功率/降级误触发率双读数日报），观察周毕 M2 闭，M3（本机 3333 退役）候排另呈。

## 二、安全语义（joint-plan 已批照守）

- 拉取失败不阻塞本地运行（key-cache 最近已知好配置）；降级梯同构（服务域梯问7）；
- 活体配置写过事故案补丁门（测试隔离/值面验证/备份锚）；token 若涉轮换守双并行窗硬判据；
- **回滚锚**：改指前两 daemon 配置备份+回滚步骤成文（改回本机 3333 即回退）；读面细门上线前配置锚。

## 三、验收锚

- **A1** 两 daemon 改指毕+R-HY 拉取成功读数（各面留痕）；
- **A2** 读面细门上线+公网无 token 读被拒读数（本席 sg 侧亲勘同法复测）；
- **A3** 观察周日报机制在跑（成功率/误触发率双读数）；
- **A4** 降级梯实弹一轮（R-HY 停服模拟→daemon 降级本地直连→恢复→回切，真活体 settings hash 零变化判据沿用）。

## 四、边界

- M3（本机 3333 退役）不在本单；本地直连=唯一本地恢复锚永久红线不动；
- sg daemon 改指=跨机活走 BOD 通道（D-24），本席亲勘或 m-duty-cos 留痕；
- R-HY 生产冻结面纪律延续（只触 TriModel 应用层+两面 daemon 配置位）；
- 观察周内发现问题=回滚锚先行，观察不硬撑。

## 五、执行窗前候修清单（累积；2026-09-27 23:4x BOD 成文）

1. **sg 改指步骤按实况重定**：sg TriMMC env 无 `TRIMODEL_API_URL`，实走 3334→3333 proxy 链——改指前补勘 sg 接入形态定改法（原始 M2 前置假设有误）；
2. **跨机配置域核验**：card 加密域锚四元组（hostname:username:platform:arch）跨机/跨用户域互解不开（R-HY 治愈案已证）——sg 侧 card 建立须 sg 机内 API PUT 机内加密，禁跨机复制 card；
3. **proxy 3334 常驻形态待定**：现 systemd unit（trimodel-proxy.service）无 `EnvironmentFile=`，环境注入形态未决——与候修 5② dotenv 修法联动裁；
4. **~~R-HY 钟漂观察项~~（2026-09-28 01:0x BOD 亲勘撤销）**：疑快 6m22s 读数系 SDE 落款时戳非现查所致序列矛盾（收件早于落款三连），非 R-HY 钟漂——BOD 亲勘 chronyc tracking 微秒级健康+与本机秒级一致坐实；遗留真问题=SDE 报时纪律（落款必现查 date），转 COO/SDE 对表；
5. **sg TriModel 断链三合一**（2026-09-27 23:2x 勘验；CEO 23:42 裁：M2 执行窗前必修）：①`GLM_API_KEY` env **空值从未配**（sg `/srv/fleet/TriModel/.env` 9/11 建档起即空，上游调用必拒 `no-api-key`）；②dotenv dist 态路径缺陷（`config.ts` L10-11 候选序只探 `dist/.env` 与 `/srv/fleet/.env`，`TriModel/.env` 永不可达）；③card 正身文件缺失（默认模型路由无卡可读）。**关联更正**：当晚 21:03-21:06 sg 面消费验证存在路由层假绿成分（rewrite 日志真、上游层从未通——与 86c0「空 key 也回 401」同族）。修复路径已勘明=机内 PUT card 零重启（键值候供；重启路堵=fleet 无免密 sudo）。
