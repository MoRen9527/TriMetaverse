# FSD R-HY 部署升级毕报 · 间隙修+全量积码上 R-HY 活体（72d3099→e30ea20）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/fsd-rhy-deploy-gapfix-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T01:50:59Z（09:50:59+08 周四，date 现查）
- 执行席: FSD 小全（m-fsd）；依据=BOD 令面修正令（09:34 达，执行序①拉平②推 origin ③R-HY 部署 ④毕报）+CTO 部署链技术边界六点（09:36 达）
- 结论: **R-HY 绿**——trimodel.service 换主 pid 2207670，值面探针全过，卡数据面零触实证，零触碰面双 unit 未动

## 〇、执行序实录（2026-10-08 09:40–09:47 +0800）

| 步 | 动作 | 读数 |
| --- | --- | --- |
| 0 | **前置：GitHub 追平** | R-HY origin=GitHub（MoRen9527/TriModel）顶仅 72d3099——BOD 保命五断点与本席 9557aa1..e30ea20 只在 sg bare。本机 TriModel 加 github remote→ff 推 `72d3099..e30ea20 dev→dev` ✓（gh CLI MoRen9527 在位）。R-HY 随后 fetch 得 `72d3099..e30ea20` |
| 1 | 基线采集 | 卡基线=cards GET entries_masked **3 条**（e-glm-anthropic/e-deepseek-anthropic/e-glm-flash-anthropic）；verify 在旧版 72d3099 无该路由（404 属预期——verify 系 S4 接线），基线改用 cards 端点 |
| 2 | 环A 备份锚 | `dist.bak-pre-gapfix-20261008T014508Z`（cp -a）+ `cfg-backup-pre-gapfix-20261008T014508Z.tar.gz`（trimmc-card.json+api-token.env，chmod 600）+ `BACKUP-ANCHOR-pre-gapfix-*.ready` 三件套 |
| 3 | 拉平 | safe.directory 单次豁免 fetch+checkout detached **e30ea20**（顶断言 rev-parse 对表过；detached 形态与现役一致） |
| 4 | build | npm install up-to-date 2s + `npm run build`（tsc+copy-ui）零错 |
| 5 | deploy-sha | `dist/.deploy-sha` = e30ea2016fd3e1debc6ce34f2db1cddc9ad45b5d（full SHA） |
| 6 | chown 归还 | root 会话操作后 `chown -R fleet:fleet /srv/fleet/TriModel`（root 属主文件零遗留路径） |
| 7 | restart | `systemctl restart trimodel.service`（仅此 unit）→ MainPID **2151586→2207670**，active |

## 一、值面探针（完工锚——逐项值面，非 active 即完）

| # | 探针 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | 零触碰断言 | trirmc.service + trirmc-mc.service 双 **active** 未动 | ✓ |
| 2 | GET /health（timeout 15s） | 200（2.3s）`ok:true`，rateLimitedCount 0；providers={anthropic:false, trimetaverse:false}（R-HY 配置面 provider 集与本机不同，见注记 3） | ✓ |
| 3 | GET /ui | 200 len=**139927**（部署前 133976，+6KB=S3/S4/S4b 增量，合理） | ✓ |
| 4 | 间隙修锚 | `margin-bottom: 12px` **[1]**（含分号正 pattern——本机探针漏分号坑已吸收） | ✓ |
| 5 | S4b 四锚 | 「已落 · 重启生效」**[5]**/「已清 · 待落地」**[1]**+「机器侧现持旧值」**[1]**/`reloadFaceCard` **[2]**/`void reloadFaceCard(connDomainActive)` **[1]**——与本机第二轮窗 P2 读数同构（5/1+1/2+1） | ✓ |
| 6 | 批 A 区块串 | 「模型策略」[26]/「兜底模型」[7]（回归零漂移） | ✓ |
| 7 | 三型新副文 | 「按时间段自动切换」[1] | ✓ |
| 8 | 四机位区块 | TriMMC[6]/TriMLC[10]/TriRMC[5]/TriRLC[5] 裸词全在；卡面标题真实串形=`TriMLC · 本机 8713'`/`TriRLC · 本机 8711'`/`TriRMC · R-HY 8712'` | ✓ |
| 9 | verify 四 face（CTO 边界②） | 200；mmc=not-configured / mlc=not-configured / **rmc=applied** / rlc=not-configured——**非全未配置**（rmc 真实三态读数在=探活链读的是真数据） | ✓ |
| 10 | cards 对比基线 | entries_masked **3 条逐 id 同基线**（e-glm-anthropic/e-deepseek-anthropic/e-glm-flash-anthropic）——卡数据面零触实证 | ✓ |
| 11 | 指纹三件 | 见 §三 | ✓ |

## 二、两疑点清案（探针发现，闭后交卷）

1. **三栏机位名 [0] 系探针串形臆造**：初探「TriMLC（M-MLC）」等全角括号形态零命中——该串形系本席从 trimmc-card.test 断言「TriMMC（M-SG）」类推臆造；源码对表真实形态=「TriMLC · 本机 8713」族。裸词复探四机位全在（§一#8）。**同 margin 漏分号同族坑**：探针 pattern 禁类推，必对源码串形。产物零问题。
2. **policy.js 指纹跨机异值=行尾差**：本机 dist/src/policy.js=CRLF+LF 混合（Windows tsc 产物），R-HY=纯 LF（Linux checkout+tsc）——行尾差致 SHA256 必异，代码语义零差。trimmc-card.js 跨机同值（a9991c02…）系该文件恰无行尾敏感差异。

## 三、R-HY 指纹三件（S5 开场锚——**替换本机第二轮窗指纹**，跨机不要求同值·CTO 边界④）

| 文件 | SHA256 前 16 位（R-HY 实测） |
| --- | --- |
| `dist/ui/index.html` | `8ca70d3d56b334db` |
| `dist/src/trimmc-card.js` | `a9991c020df51c09` |
| `dist/src/policy.js` | `4b7924fa1b1bb0c3` |

STE 复算=`sha256sum` 前 16 位对前缀（R-HY 面实测值；本机第二轮窗三件自然过期，本机 index.html 亦已被 e30ea20 重建覆盖）。

## 四、如实注记

1. **数据面零迁移对表（CTO 边界①）**：全程未触 /srv/fleet/trimodel-data/ 任何写面（cfg tar 只读归档进备份）；R-HY dotenv 配置在 unit `EnvironmentFile=/srv/fleet/trimodel-data/api-token.env`（非 repo 内 .env——repo 根与 dist/.env 均 absent），TRIMODEL_CARD_FILE/TRIMODEL_CARDS_DIR/TRIMODEL_DATA_DIR 三环境变量全指 trimodel-data。部署只换代码：pull+build+restart，配置独立于 build 产物，自证成立。
2. **verify mmc=not-configured 系 R-HY 卡状态机现势**：真卡 3 entries 在位但 status.state 未回写 applied（保存后未走 apply 回写链）——非本次部署引入（部署前无 verify 路由无从对比），部署后 rmc=applied 证明探活链工作正常。CEO 走查若见 mmc「未配置」徽章系此现势，候走查单定处置。
3. **providers={anthropic:false, trimetaverse:false} 系 R-HY 配置面现势**：R-HY 未配 deepseek 族 provider 键（与本机不同），health ok:true 不受影响——探活读数如实呈报，非部署缺陷。
4. **R-HY git 属 dubious ownership 态**（fleet 属主仓+root 会话操作）——全程 `-c safe.directory` 单次豁免未写 global config；root 操作后 chown 归还完毕。
5. **本机 git remote 新增 `github`**（https://github.com/MoRen9527/TriModel.git）——为 GitHub 追平而加，origin（sg bare）语义不变。GitHub 追平后与 sg bare 同顶 e30ea20。
6. **回滚面**：`dist.bak-pre-gapfix-20261008T014508Z` 在位；回滚=stop trimodel→rm dist→cp -a bak→chown→start（stage2-r6 rollback 正形）；git 侧 revert 锚=e30ea20（单段单 commit 不变式保持）。

## 五、CTO 部署链六点边界逐项对表

| # | 边界 | 执行 |
| --- | --- | --- |
| ① | 数据面零迁移 | ✓ §四.1 三环境变量锚+零写面 |
| ② | verify 四 face 部署前后对比 | ✓ 基线=旧版无路由（如实），改 cards 3 条基线；部署后 rmc=applied 非全未配置，红线未触 |
| ③ | /health 慢探 timeout | ✓ 15s（实测 2.3s 稳态过） |
| ④ | 指纹三件交 STE | ✓ §三 R-HY 实测值 |
| ⑤ | S5 期间 R-HY 写面纪律（C 清空禁触生产卡） | 收讫——本席后续 S5 支持只读锚实测；写面构造态回本机 3333（退役前） |
| ⑥ | trirmc/trirmc-mc 零触碰 | ✓ 探针 #1 双 unit active 实证 |

## 六、现势与后续

1. **R-HY trimodel.service**=e30ea20 活体（pid 2207670），含 S1–S4b 全量积码+间隙修——**S5 合一走查锚面=R-HY 实例**（BOD 已通知 STE；开场版本核锚=§三指纹三件）。
2. **候 BOD**：本机退役令执行（CEO 令面；本席不碰本地 3333 退役）。
3. **候 STE**：S5 19:00 晚窗照排；本席候走查结果，问题单即接修（R-HY 写面禁触，构造态回本机）。
4. 深测②收口后 TriModel registry 补账供稿（候 CTO 发排）不变。

## 使用依据

- BOD 令面修正令（2026-10-08 09:34+08 达：执行序①-④+禁动本地）；CTO 部署链技术边界六点（09:36+08 达）
- stage2-r6-rhy-execute.sh（批 A 部署机制先例：备份锚/deploy-sha/零触碰面/文件式探针/rollback 正形）
- 本席第二轮窗卷 fsd-unified-build-restart-window-r2-20261008.md（探针模式与 S4b 锚读数同构对表）
- 记忆条：R-HY root git dubious ownership 单次豁免/root 操作后 chown 归还/PS→ssh stdin CRLF 坑（本次 Bash 工具+heredoc 天然 LF 避开）/探针 pattern 禁臆造（本卷 §二.1 新实证，同 margin 分号坑族）
