# BOD 验收终卷 · P0-EXEC-01（A1-A6 全科，2026-09-29 凌晨收口）

- sourceOfTruth: 本件（BOD 验收判定正身；读面三科提前卷=bod-survey-readings-20260928.md）
- syncMode: 快照件
- lastSyncedAt: 2026-09-29 00:40 +0800（date 现查 00:38 星期二）
- 验收席: BOD（全科禁转抄亲测；G10 部署步=SDE 23:41 派工 00:13 完工回报 bc388290）

## 一、判定总览

| 锚 | 判定 | 一句话 |
|---|---|---|
| A1 四卡端点+别名零破坏 | **PASS** | 四 face pull/managed 双视图 200+别名原样+防枚举 404+面分离交叉验证 |
| A2 pull 视图+审计账 | **PASS**（两观察点附卷） | len-only 合规；daemon 真实拉取链已实证（16:10/16:20Z 亲证） |
| A3 备份轮换实弹 | **PASS** | 三写两备份轮换序+审计行全程留痕+降级回落活体+白捡一缺陷 |
| A4 CLI 六格对表 | **PASS** | §5.2 底表逐格核闭+8711 全链亲测+五命令族在役 |
| A5 测试族+门审 | **PASS** | 亲跑 313/298/**0 fail**/15 skip EXIT=0，与门审卷逐字一致；W1/W2/W3 亲测归零 |
| A6 revert 演练 | **演练完成·双向 PASS+两发现** | 回滚态/恢复态断言全中；git 单 commit 回滚已失效→dist 锚策略修正（见 §三） |

**P0 验收判定：PASS，闭合宣告成立**（附候修 1 项+演练发现 2 项+承接 SDE 候裁 3 项，全不阻塞）。

## 二、各科读数要点（亲测铁证）

- **A1**：pull×4=200 / managed×4=200 / 别名+admin=200 / 别名+pull-token=401（面分离）/ __probe__=404（防枚举）。
  过程注记：首测别名 401 实勘定性=BOD 用错钥匙（老路径本就 admin 面），非缺陷。
- **A2**：face-events.jsonl 796 行，etype 分布 pull 79/write 717/apply 0/status 0；len-only 扫描 0 命中。
  观察点①apply/status 零实弹=daemon 回写链候真实应用序列（机制在卷不阻）；观察点②本机 mlc/rlc 卡
  absent=卡未配置（机制交付 vs 内容配置分层，运营动作候 P1）。
- **A3**：rmc 测试卡三写——首写「no prior file, no backup」如实入账；二写 bak-…162151Z-11000-1 生成
  （rotated=true）；三写 bak-…162152Z-11000-2（轮换序递增）；清理后 pull 断言 card_present=false+
  default_model 回落 policy 层（降级语义活体实证）。测试卡+bak 已清零，审计行留卷。
- **A4**：§5.2 六行逐格——config show（归因 tier2-cache-fresh）/verify（HEALTHY）/cache show（fresh+
  refresh 900s）/pull（tier1-card 拉取即生效，16:20:01Z）全亲测；卡写留空=差异①裁决采认在卷（v3 L242）；
  8713 面 CLI 验证经 token 隔离面确认（各 daemon 独立 token=fail-closed 设计在役，非缺陷）。
- **A5**：npm test EXIT=0 duration 118.4s，313/298/0/15 与 FSD/COO/CTO 三方读数逐字一致。
- **A6**：详见 §三。

## 三、A6 演练全记录（双向实测+两发现）

1. **发现一（策略修正）**：`git revert 43086ff`（泛化层本体单 commit）冲突——config-cards.ts/card-faces.ts/
   test 三文件 modify/delete（后续 4d8e735 等修补叠改破纯度）。**「纯新增单 commit 回滚」预设失效**；
   已 abort 保持工作区干净。生产回滚锚语义修正=**dist 层快照回拷+重启**（非 git 单 commit）。
2. **发现二（锚缺口已补）**：TriModel 服务端侧原无 dist 快照（SDE 锚=daemon 双仓）——本次演练已补
   `dist.bak-pre-a6-20260929T0027` 留档在位。
3. **回滚方向实测**：泛化前基座 a9d9fc8 隔离 worktree build（泛化件 0）→快照现役→停 11000→换老 dist→
   起服（pid 28660）→断言 **health 200+老路径 200+泛化路由 404+keys 面 200**——回滚语义铁证。
4. **恢复方向实测**：换回泛化 dist→起服（pid 20124）→断言 **health 200+四 face 全 200+老路径 200**——
   复绿铁证；8711 daemon config verify HEALTHY 全程无波动（tier2 cache 兜底在役）。
5. 演练档：dist.rollback-trial-a6（老 dist 留档）；worktree TriModel-pre-a6 候清。

## 四、验收产出候办（不阻塞 P0 闭合）

| # | 项 | 性质 | 候谁 |
|---|---|---|---|
| 1 | PUT 无 provider_entries 载荷→500 非 400（trimmc-card.ts L108 Object.entries(undefined) TypeError） | 低危健壮性，测试族未覆盖形态 | CTO 候修清单 |
| 2 | SDE 部署尾候裁三件（registerPid 缺 port 参/trirlc-watchdog 复活令无 env/boot 期 card pull 401 自愈） | 基建尾巴+观察 | CTO 裁 |
| 3 | A6 回滚策略修正（单 commit→dist 锚）+TriModel dist 锚补立 | 门审卷补注 | CTO 认可 |

## 五、第二期授权依据

CEO 23:39「部署步也今晚做了吧，做完直接验收」+此前裁「验收全过→当夜落笔立第二期单」——
本卷 A1-A6 全过，**P1 执行单当夜落笔**（task-charter-trimodel-config-page-4plane-p1-exec-01）。

## 使用依据

- 执行单 d9df61bc（A1-A6 锚定义）；CTO 门审卷 03854395+终判卷 de76b2d3；G10 读数 bc388290；
  BOD 亲测命令与读数全卷 §二/§三；提前读面卷 1b663479
